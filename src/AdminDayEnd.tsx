import React, { useState, useEffect, useContext, useRef } from 'react';
import { Col, Row, Card, Container, Form } from 'react-bootstrap';
import { Form as Formx, Formik, Field, ErrorMessage, FormikProps } from 'formik';
import * as Yup from 'yup';
import API from './api';
import { SessionContext } from './App';
import { useHistory } from 'react-router-dom';
import {getNameFromAddress, getInsuranceFromName} from './restRoutines';
import { AnyARecord } from 'dns';

interface APPT { date: string, time: string, name: string, idx: string, empid: string, userid: string };
interface PROCEDURE {
    code: string,
    desc: string,
    cost: number,
    length: number,
}
interface BILL {
    code: string,
    insurance: string,
    cost: number,
    insurance_portion: number,
    patient_portion: number,
}
interface POLICY {
    code: string,
    percent: number,
    deduct: number,
    max: number,
}
interface INSURANCE {
    name: string,
    policies: POLICY[]
}
const SignupSchema = Yup.object().shape({
    code: Yup.string()
        .min(1, 'Too Short!')
        .max(4, 'Too Long!')
        .required('Required'),
    insurance: Yup.string()
        .required('Required'),
    cost: Yup.number()
        .required('Required'),
    insurance_portion: Yup.number()
        .required('Required'),
        patient_portion: Yup.number()
        .required('Required'),
});
export function AdminDayEnd(props: { allowUpdate: boolean }) {

    const token = useContext(SessionContext);
    const history = useHistory();
    const ref = useRef();

    let times = [
        "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30",
        "4:00", "4:30"
    ];
    let columns = token.employees;
    let numberColumns = columns.length;

    let date0 = new Date(2021, 5, 14);
    let formatDate: string = date0.toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(date0);


    const appts: any[] = [];
    times.forEach(time => {
        columns.forEach(col => {
            let appt = { formatDate, time, name: "", idx: "", userid: "", empid: col };
            appts.push(appt);
        })
    });
    const [apptsx, setappts] = useState(appts);
    let proceduresx: PROCEDURE[] = [];
    const [procedures, setProcedures] = useState(proceduresx);
    const [refresh, setRefresh] = useState(0);
    const [currentAppt, setCurrentAppt]=useState({ date: "", time: "", name: "", idx: "", userid: "", empid: "" });
    const init = () => {
        // create a clean slate for this week
        const appts: any[] = [];
        times.forEach(time => {
            columns.forEach(col => {
                let appt = { formatDate, time, name: "", idx: "", userid: "", empid: col };
                appts.push(appt);
            })
        });

        // query each date for this week to get previous data

        API.get(`api/dental/appts?date=${formatDate}`)
            .then(res => {

                res.data.forEach((appt: { date: string, time: string, name: string, _id: string, userid: string, empid: string }) => {
                    let time = appt.time;
                    let name = appt.name;
                    let empid = appt.empid;
                    let userid=appt.userid;
                    let date=appt.date;
                    columns.forEach((col) => {
                        appts.find((apptx, index) => {
                            if (apptx.time === time && apptx.empid === empid) {
                                console.log('found match', col, time, name);
                                appts[index].name = name;
                                appts[index].userid=userid;
                                appts[index].date=date;
                                return;
                            }
                        })
                    })
                })
            })

        setappts(appts);

    };
    useEffect(() => {
        async function getProcedures() {

            await API.get(`api/dental/procedures`)
                .then(res => {
                    setProcedures(res.data);
                });
        }
        getProcedures();
        init();

    }, []);

    async function submitHandler(values: BILL) {
        const billValues={
            ...values,
            userid: currentAppt.userid,
            empid: currentAppt.empid,
            balance: values.patient_portion,
            date: currentAppt.date,

        }
        console.log(billValues);
        // post
        await API.post(`api/dental/bills`, billValues)
            .then(res => {
                console.log(res.data);
            });

    }
    function fillForm() {
        
        
    }
    const [doctorName, setDoctorName]=useState('');
    const [patientName, setPatientName]=useState('')
    async function processCurrentAppt(appt: APPT) {
        setCurrentAppt(appt);
        let pn=await getNameFromAddress(appt.userid)
        await setPatientName(pn);
        let dn=await getNameFromAddress(appt.empid)
        await setDoctorName(dn);
    }


    return (
        <>
            <Container>
                <Row>
                    <Col md={{ span: 4, offset: 0 }}>
                        <Card>
                            <Row>
                            <Col>
                            <h5>Billing Form</h5>
                            </Col>
                            <Col>
                            <h5>{patientName}</h5>
                            <h5>Seen By:</h5>
                            <h5>{doctorName}</h5>
                            </Col>
                            </Row>
                        </Card>
                        <Card>
                            
                            <Formik
                            
                                enableReinitialize={true}
                                initialValues={{
                                    code: "",
                                    insurance: "",
                                    cost: 0,
                                    insurance_portion: 0,
                                    patient_portion: 0,
                                    
                                }}
                                onSubmit={submitHandler}
                                validationSchema={SignupSchema}
                            >
                                {(props) => (
                                    <Formx>

                                        <Form.Group>
                                            <Form.Label>Procedure</Form.Label>
                                            <Field as="select" className="form-control" name="code" type="text">
                                            <option value='' defaultValue=''>Select an option</option>
                                            {procedures.map((proc, key) => (
                                                <option key={key} value={proc.code}>{proc.desc}</option>
                                            ))}
                                            </Field>
                                            <ErrorMessage component="span" name="code" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Insurance</Form.Label>
                                            <Field as="select" className="form-control" name="insurance" type="text" >
                                            <option value='' defaultValue=''>Select an option</option>
                                            {token.insurance.map((ins, key) => (
                                                <option key={key} value={ins}>{ins}</option>
                                            ))}
                                            </Field>
                                            <ErrorMessage component="span" name="insurance" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Cost</Form.Label>
                                            <CostField className="form-control" name="cost" type="number" 
                                                procedures={procedures}
                                                  values={props.values}
                                                  setFieldValue={props.setFieldValue}
                                                   />
                                            <ErrorMessage component="span" name="cost" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Insurance Portion</Form.Label>
                                            <InsurancePortionField className="form-control" name="insurance_portion" type="number" 
                                                  values={props.values}
                                                  setFieldValue={props.setFieldValue}
                                                   />
                                            <ErrorMessage component="span" name="insurance_portion" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Patient Portion</Form.Label>
                                            <PatientPortionField className="form-control" name="patient_portion" type="number"
                                                values={props.values}
                                                setFieldValue={props.setFieldValue}
                                                 />
                                            <ErrorMessage component="span" name="patient_portion" />
                                        </Form.Group>
                
                                        <button className="btn btn-primary" type="submit" onClick={(e) => setRefresh(refresh + 1)}>Post</button>
                                        <button className="btn btn-secondary" type="button" onClick={() => history.goBack()} >Cancel</button>
                                    </Formx>
                                )}
                            </Formik>
                        </Card>
                    </Col>
                    <Col md={{ span: 6, offset: 1 }}>
                        <Card>
                            <h1 style={{ textAlign: "center" }}>Schedule for: {formatDate}</h1>

                            <Row>
                                <Col>
                                    <div></div>
                                </Col>
                                {columns.map((col: string) => (
                                    <Col>
                                        <div style={{ textAlign: "center" }}><strong>{col}</strong></div>
                                    </Col>
                                ))}
                            </Row>
                            {times.map((time: string, tindex: number) => (
                                <Row key={time}>
                                    <Col>
                                        <div className="timecell"><strong>{time}</strong></div>
                                    </Col>
                                    {columns.map((col: string, dindex: number) => (
                                        <Col>

                                            <div
                                                className={apptsx[tindex * numberColumns + dindex].name === '' ? "emptycell" : "cell"}
                                                onClick={() => processCurrentAppt(apptsx[tindex * numberColumns + dindex])}
                                            >
                                                {apptsx[tindex * numberColumns + dindex].name}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            ))}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );

}
function PatientPortionField(props: any) {
    useEffect(() => {
        let val;
        if (props.values.insurance_portion) 
        {
            val=props.values.cost-props.values.insurance_portion
        } else {
            val=props.values.cost
        }
        props.setFieldValue("patient_portion", val);
    
    }, [props.values]);

    return (
        <input
            className="form-control"
            type={props.type}
            name={props.name}
            value={props.values.patient_portion}
        />
    );
}

function InsurancePortionField(props: any) {

    const [policies, setPolicies]=useState([{code: "", cost: 0, percent: 0, deduct: 0, max: 0}]);

    useEffect(() => {
        let val=props.values.cost;
        convertPromiseToInsurance(props);
        console.log('policies', policies);
        let policy=policies.find((pol) => {
            return props.values.code===pol.code;
        })
        if (policy===undefined) {
            val=0;
        } else {
            val=val*policy.percent/100;
            val=val-policy.deduct;
            if (val<0) {
                val=0;
            }
            if (val>policy.max) {
                val=policy.max;
            }
        }
        props.setFieldValue("insurance_portion", val);
    }, [props.values]);

async function convertPromiseToInsurance(props: any) {
    const insurance=await getInsuranceFromName(props.values.insurance);
    const pol=await insurance.policies;
    await setPolicies(pol);
    return;
}
    return (
        <input
            className="form-control"
            type={props.type}
            name={props.name}
            value={props.values.insurance_portion}
        />
    );
}
function CostField(props: any) {
    useEffect(() => {
        let val=0;
        let procedure=props.procedures.find((proc: PROCEDURE) => {
            return proc.code===props.values.code
        })
        if (procedure != undefined) {
            val=procedure.cost;
        }
        props.setFieldValue("cost", val);
    }, [props.values]);

    return (
        <input
            className="form-control"
            type={props.type}
            name={props.name}
            value={props.values.cost}
        />
    );
}