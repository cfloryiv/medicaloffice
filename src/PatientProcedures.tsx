import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { SessionContext } from './App';
import API from './api';

interface BILL {
    code: string,
    insurance: string,
    cost: number,
    insurance_portion: number,
    patient_portion: number,
}
interface PROCEDURE {
    code: string,
    desc: string,
    cost: number,
    length: number,
}

export function PatientProcedures() {

    const token = useContext(SessionContext);
    const [bills, setBills] = useState([{ date: "", code: "", empid: "" }])
    const [procedures, setProcedures] = useState([{ code: "", desc: "", cost: 0 }])
    const [billDesc, setBillDesc] = useState([{ date: "", desc: "", name: "" }]);
    useEffect(() => {
        async function update() {
            await API.get(`api/dental/bills?userid=${token.userid}`)
                .then(res => setBills(res.data));
        }
        update();
        const temp = bills.map((bill) => {
            const code = bill.code;
            const proc = procedures.find((proc) => proc.code === code);
            if (proc !== undefined) {
                return { date: bill.date, desc: proc.desc, name: bill.empid };
            } else {
                return {date: bill.date, desc: 'unknown', name: bill.empid};
            }
        });
        setBillDesc(temp);
        async function getProcedures() {

            await API.get(`api/dental/procedures`)
                .then(res =>
                    setProcedures(res.data))
        }
        getProcedures();
    });

    return (
        <>
            <Container>
                <Card>
                    <h4 style={{ textAlign: 'center' }}>Patient Procedures</h4>
                    {bills.length === 0
                        ? <h4>No Procedures</h4>
                        : (<Row>
                            <Col md={{ span: 6, offset: 1 }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date</th><th>Procedure</th><th>Doctor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billDesc.map((bill, index) => (
                                            <tr key={index}>
                                                <td>{bill.date}</td>
                                                <td>{bill.desc}</td>
                                                <td>{bill.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        )}
                </Card>
            </Container>
        </>
    )
}