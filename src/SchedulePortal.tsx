import React from 'react';
import { useHistory} from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';


export function SchedulePortal() {

  const history=useHistory();

  function handleLink(link: string) {
    history.push(link);
  }
    return (
      <>
   
         <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/schedule')}>Schedule an Appointment</h4>
         </Col>
     </Row>
     <Row>
         <Col md={{ span: 6, offset: 1 }}>
             <h4 onClick={() => handleLink('/todaysschedule')}>Today's Schedule</h4>
         </Col>
     </Row>
    </>
    );
}