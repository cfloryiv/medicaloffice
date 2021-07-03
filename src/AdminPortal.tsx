import React from 'react';
import { useHistory} from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';


export function AdminPortal() {

  const history=useHistory();

  function handleLink(link: string) {
    history.push(link);
  }
    return (
      <>
   
         <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/patientprofile')}>Employees</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/insuranceseditor')}>Insurance Editor</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/procedureseditor')}>Procedures Editor</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/patientprocedures')}>Misc</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/admindayend')}>Day End</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/patientprocedures')}>Reporting</h4>
         </Col>
     </Row>
    </>
    );
}