import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { SessionContext } from './App';
import API from './api';



export function PatientProcedures() {

    const token = useContext(SessionContext);
    const [billDesc, setBillDesc] = useState([{ date: "", desc: "", name: "" }]);
    useEffect(() => {

        async function update() {
            await API.get(`api/dental/bills?userid=${token.userid}`)
                .then(res => setBillDesc(res.data));
        }
        update();
    }, [token]);

    return (
        <>
            <Container>
                <Card>
                    <h4 style={{ textAlign: 'center' }}>Patient Procedures</h4>
                    {billDesc.length === 0
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