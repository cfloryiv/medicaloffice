import React, {useContext} from 'react';
import { useHistory} from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { SessionContext } from './App';


export function PatientPortal() {

  const history=useHistory();

  const token=useContext(SessionContext);


    return (
      <>
        <h1>Welcome {token.userid}</h1>
         <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => history.push('/patientprofile')}>Profile</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => history.push('/patientschedule')}>Schedule</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => history.push('/patientbilling')}>Billing/Payments</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => history.push('/patientprocedures')}>Procedures</h4>
         </Col>
     </Row>

    </>
    );
}