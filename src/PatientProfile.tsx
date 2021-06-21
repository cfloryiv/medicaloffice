import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { Form as Formx, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface ADDRESS  {
    name: string,
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
      .max(5, 'must be 5 characters')
      .required('Required'),
      telephone: Yup.string()
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
  });

  export const PatientProfile = () => (  
            <>
                <Row>
                    <Col md={{ span: 6, offset: 1 }}>
                        <Card style={{ backgroundColor: 'white' }}>
                            <h5 style={{ backgroundColor: 'white' }}>Address Form</h5>
                            <Col md={{ span: 10, offset: 1 }}>
                                <Formik 
                                    initialValues={{ name: ""}}
                                    onSubmit={values => {
                                        console.log(values);
                                    }}
                                    validationSchema={SignupSchema}
                                    >
                                        {({errors}) => (
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
