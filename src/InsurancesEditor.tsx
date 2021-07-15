import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Form, Table } from 'react-bootstrap';
import { Form as Formx, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from './api';
import { SessionContext } from './App';
import { useHistory } from 'react-router-dom';

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
interface PROCEDURE {
    code: string,
    desc: string,
    cost: number,
    length: number,
}

const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(4, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Required'),
    code: Yup.string()
        .required('Required'),
    percent: Yup.number()
        .required('Required'),
    deduct: Yup.number()
        .required('Required'),
    max: Yup.number()
        .required('Required'),
});

export function InsurancesEditor() {

    const history = useHistory();

    const token = useContext(SessionContext);

    let insurancex: INSURANCE = { name: "", policies: [] };
    insurancex.policies = [];
    const [insurances, setInsurances] = useState(insurancex);
    let proceduresx: PROCEDURE[] = [];
    const [procedures, setProcedures] = useState(proceduresx);
    const [refresh, setRefresh] = useState(0);
    const [startup, setStartup] = useState(true);

    useEffect(() => {

        async function getProcedures() {

            await API.get(`api/dental/procedures`)
                .then(res => {
                    setProcedures(res.data);
                });
        }
        if (startup) {
            getProcedures();
            setStartup(false);
        }
        async function getInsurance() {
            await API.get(`api/dental/insurances?name=${insurances.name}`)
                .then(res=> {
                    setInsurances(res.data[0]);
                })
        }
        getInsurance();
        //setInsurances(insurancex);

    }, [refresh]);

    async function refreshTable(name: string) {
        await API.get(`api/dental/insurances?name=${name}`)
            .then(res => {
                if (res.data[0] === undefined) {
                    insurancex={name: "", policies: []};
                    insurancex.name=name;
                    insurancex.policies=[];
                    setInsurances(insurancex);
                    //setInsurances(res.data[0]);
                } else {
                    setInsurances(res.data[0]);
                }
            });
        await console.log(insurances);
         
    }
    async function submitHandler(values: any) {

        let insurancesx = { ...insurances };
        insurancesx.name = values.name;
        let policy = {
            code: values.code,
            percent: values.percent,
            deduct: values.deduct,
            max: values.max,
        }
        let index = insurancesx.policies.findIndex((pol) => {
            return policy.code === pol.code;
        });
        if (index === -1) {
            insurancesx.policies.push(policy);
        } else {
            insurancesx.policies[index] = policy;
        }
        await API.put(`api/dental/insurances?name=${insurances.name}`, insurancesx)
            .then(res => {
                console.log(res.data);
            });
        await setInsurances(insurancesx);
        
        await setTimeout(()=>setRefresh(refresh+1), 2000);
    }
    const tableBody: any[] = [];
    if (insurances !== undefined) {
        insurances.policies.forEach((proc, key) => {
            tableBody.push(
                <tr key={key}>
                    <td>{insurances.name}</td>
                    <td>{proc.code}</td>
                    <td>{proc.percent.toFixed(2)}</td>
                    <td>{proc.deduct.toFixed(2)}</td>
                    <td>{proc.max.toFixed(2)}</td>
                </tr>
            )
        })
    }
    return (
        <>
            <Row>
                
                <Col md={{ span: 4, offset: 1 }}>
                    <Card >
                        <h5 >Insurance Form</h5>
                        <Col md={{ span: 10, offset: 1 }}>
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    name: insurances?.name ?? "",
                                    code: "",
                                    percent: 0,
                                    deduct: 0,
                                    max: 0
                                }}
                                onSubmit={submitHandler}
                                validationSchema={SignupSchema}
                            >
                                {() => (
                                    <Formx>

                                        <Form.Group>
                                            <Form.Label>Insurance</Form.Label>
                                            <Field as="select"
                                                className="form-control"
                                                name="name"
                                                type="text"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => refreshTable(e.target.value)}
                                            >
                                                <option disabled>Select an option</option>
                                                {token.insurance.map((ins, key) => (
                                                    <option key={key} value={ins}>{ins}</option>
                                                ))}
                                            </Field>
                                            <ErrorMessage component="span" name="name" />
                                        </Form.Group>
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
                                            <Form.Label>Percent Coverage</Form.Label>
                                            <Field className="form-control" name="percent" type="number" />
                                            <ErrorMessage component="span" name="percent" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Deductable</Form.Label>
                                            <Field className="form-control" name="deduct" type="number" />
                                            <ErrorMessage component="span" name="deduct" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Max Coverage</Form.Label>
                                            <Field className="form-control" name="max" type="number" />
                                            <ErrorMessage component="span" name="max" />
                                        </Form.Group>
                                        <button className="btn btn-primary" type="submit" onClick={(e) => setRefresh(refresh + 1)}>Save</button>
                                        <button className="btn btn-secondary" type="button" onClick={() => history.goBack()} >Cancel</button>
                                    </Formx>
                                )}
                            </Formik>
                        </Col>
                    </Card>
                </Col>
                <Col md={{ span: 5, offset: 1 }}>
                    <Card >
                        <h5 >Insurance List</h5>
                        <Col md={{ span: 10, offset: 1 }}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Insurance</th><th>Code</th><th>Percent</th><th>deductable</th><th>Maximum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableBody}
                                </tbody>
                            </Table>
                        </Col>
                    </Card>
                </Col>
      
            </Row >
        </>
    );
}
