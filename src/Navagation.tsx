import React from 'react';
import { useHistory} from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';


export function Navigation() {

  const history=useHistory();

  function handleLink(link: string) {
    history.push(link);
  }
    return (
      <>
   
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/scheduleportal')}>Schedule Portal</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/patientportal')}>Patient Portal</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/employeeportal')}>Employee Portal</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/adminportal')}>Admin Portal</h4>
         </Col>
     </Row>
    </>
    );
}