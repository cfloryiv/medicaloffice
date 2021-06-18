
import { Route} from 'react-router-dom';

import {Header} from './Header';
import {Navigation} from './Navagation';
import { PatientPortal } from './PatientPortal';
import { EmployeePortal } from './EmployeePortal';
import { AdminPortal } from './AdminPortal';
import { Container } from 'react-bootstrap';


import API from './api';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

 
    const token= {
      userid: "cfloryiv",
      password: "pw",
      admin: true,
      doctor: false
    }



    return (
      <Container>
        <Route path='/' component = {Header} />
        <Route exact path='/' component={Navigation} />
        <Route exact path='/patientportal' component={PatientPortal}/>
        <Route exact path='/employeeportal' component={EmployeePortal}/>
        <Route exact path='/adminportal' component={AdminPortal}/>
      </Container>
    );
  }

export default App;
