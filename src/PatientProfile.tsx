import React, {useContext, useEffect, useState} from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { Form as Formx, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from './api';
import {SessionContext} from './App';

interface ADDRESS  {
    name: string,
    street: string,
    city: string,
    state: string,
    zipcode: string,
    telephone: string,
    email: string,
}


const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    street: Yup.string()
      .required('Required'),
      city: Yup.string()
      .required('Required'),
      state: Yup.string()
      .min(2, 'must be 2 characters')
      .max(2, 'must be 2 characters')
      .required('Required'),
      zipcode: Yup.string()
      .min(5, 'must be 5 characters')
      .max(5, 'must be 5 characters')
      .required('Required'),
      telephone: Yup.string()
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
  });

  export function PatientProfile() {

    const token=useContext(SessionContext);

    const [address, setaddress]=useState({_id: "", userid: token.userid, name: "", street: "", city: "", state: "", zipcode: "", telephone: "", email: ""});
   
    useEffect(() => {
        async function getAddress() {
            
            await API.get(`api/dental/addresses?userid=${token.userid}`)
                .then(res => {
                    let addressx=res.data[0];
                    setaddress(addressx);
            });
        }
        getAddress();
    }, [token]);

    async function submitHandler(values: ADDRESS) {
        console.log(address);
        if (address===undefined) {
            // post
            await API.post(`api/dental/addresses`, {...values, userid: token.userid})
                .then(res => {
                    console.log(res.data);
                });
        } else {
            // put
            await API.put(`api/dental/addresses/${address._id}`, values)
                .then(res => {
                    console.log(res.data);
                });
        }
    }
      return (
            <>
                <Row>
                    <Col md={{ span: 6, offset: 1 }}>
                        <Card style={{ backgroundColor: 'white' }}>
                            <h5 style={{ backgroundColor: 'white' }}>Address Form</h5>
                            <Col md={{ span: 10, offset: 1 }}>
                                <Formik 
                                    enableReinitialize={true}
                                    initialValues={{name: address?.name ?? "",
                                                    street: address?.street ?? "",
                                                    city: address?.city ?? "",
                                                    state: address?.state ?? "",
                                                    zipcode: address?.zipcode ?? "",
                                                    telephone: address?.telephone ?? "",
                                                    email: address?.email ?? ""}}
                                    onSubmit={submitHandler}
                                    validationSchema={SignupSchema}
                                    >
                                        {() => (
                                        <Formx>

                                            <Form.Group>
                                                <Form.Label>Name</Form.Label>
                                                <Field className="form-control" name="name" type="text" />
                                                <ErrorMessage component="span" name="name" />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Street</Form.Label>
                                                <Field className="form-control" name="street" type="text" />
                                                <ErrorMessage component="span" name="street" />
                                            </Form.Group><Form.Group>
                                                <Form.Label>City</Form.Label>
                                                <Field className="form-control" name="city" type="text" />
                                                <ErrorMessage component="span" name="city" />
                                            </Form.Group><Form.Group>
                                                <Form.Label>State</Form.Label>
                                                <Field className="form-control" name="state" type="text" />
                                                <ErrorMessage component="span" name="state" />
                                            </Form.Group><Form.Group>
                                                <Form.Label>Zipcode</Form.Label>
                                                <Field className="form-control" name="zipcode" type="text" />
                                                <ErrorMessage component="span" name="zipcode" />
                                            </Form.Group><Form.Group>
                                                <Form.Label>Telephone</Form.Label>
                                                <Field className="form-control" name="telephone" type="text" />
                                                <ErrorMessage component="span" name="telephone" />
                                            </Form.Group><Form.Group>
                                                <Form.Label>Email</Form.Label>
                                                <Field className="form-control" name="email" type="text" />
                                                <ErrorMessage component="span" name="email" />
                                            </Form.Group>
                                           
                                            <button className="btn btn-primary" type="submit">Save</button>
                                            <button className="btn btn-secondary" >Cancel</button>
                                        </Formx>
                                    )}
                                </Formik>
                                </Col>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
