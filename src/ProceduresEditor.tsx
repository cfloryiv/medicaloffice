import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Form, Table } from 'react-bootstrap';
import { Form as Formx, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from './api';
import { SessionContext } from './App';
import { useHistory } from 'react-router-dom';

interface PROCEDURE {
    code: string,
    desc: string,
    cost: number,
    length: number,
}


const SignupSchema = Yup.object().shape({
    code: Yup.string()
        .min(1, 'Too Short!')
        .max(4, 'Too Long!')
        .required('Required'),
    desc: Yup.string()
        .required('Required'),
    cost: Yup.number()
        .required('Required'),
    length: Yup.number()
        .required('Required'),
});

export function ProceduresEditor() {

    const history = useHistory();

    const token = useContext(SessionContext);

    let proceduresx: PROCEDURE[] = [];
    const [procedures, setProcedures] = useState(proceduresx);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        async function getProcedures() {

            await API.get(`api/dental/procedures`)
                .then(res => {
                    setProcedures(res.data);
                });
        }
        getProcedures();

    }, [refresh]);

    async function submitHandler(values: PROCEDURE) {

        // post
        await API.post(`api/dental/procedures`, values)
            .then(res => {
                console.log(res.data);
            });

    }
    return (
        <>
            <Row>



                <Col md={{ span: 4, offset: 1 }}>
                    <Card>
                        <h5 >Procedures Form</h5>
                        <Col md={{ span: 10, offset: 1 }}>
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    code: "",
                                    desc: "",
                                    cost: 0,
                                    length: 0
                                }}
                                onSubmit={submitHandler}
                                validationSchema={SignupSchema}
                            >
                                {() => (
                                    <Formx>

                                        <Form.Group>
                                            <Form.Label>Code</Form.Label>
                                            <Field className="form-control" name="code" type="text" />
                                            <ErrorMessage component="span" name="code" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Description</Form.Label>
                                            <Field className="form-control" name="desc" type="text" />
                                            <ErrorMessage component="span" name="desc" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Cost</Form.Label>
                                            <Field className="form-control" name="cost" type="number" />
                                            <ErrorMessage component="span" name="cost" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Length</Form.Label>
                                            <Field className="form-control" name="length" type="number" />
                                            <ErrorMessage component="span" name="length" />
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
                    <Card>

                        <h5>Procedures List</h5>
                        <Col md={{ span: 10, offset: 1 }}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Code</th><th>Description</th><th>Cost</th><th>Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {procedures.map((proc, key) => (
                                        <tr key={key}>
                                            <td>{proc.code}</td>
                                            <td>{proc.desc}</td>
                                            <td>{proc.cost}</td>
                                            <td>{proc.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
