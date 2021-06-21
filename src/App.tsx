import React from 'react';
import { Route} from 'react-router-dom';

import {Header} from './Header';
import {Navigation} from './Navagation';
import { PatientPortal } from './PatientPortal';
import { EmployeePortal } from './EmployeePortal';
import { AdminPortal } from './AdminPortal';
import { PatientProfile} from './PatientProfile';


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const token= {
  userid: "cfloryiv",
  password: "pw",
  admin: true,
  doctor: false
}

export const SessionContext = React.createContext(token);

export default function App() {
 

    return (
      <SessionContext.Provider value={token}>
        <div>
        <Route path='/' component = {Header} />
        <Route exact path='/' component={Navigation} />
        <Route exact path='/patientportal' component={PatientPortal}/>
        <Route exact path='/employeeportal' component={EmployeePortal}/>
        <Route exact path='/adminportal' component={AdminPortal}/>
        <Route exact path='/patientprofile' component={PatientProfile}/>
        </div>
        </SessionContext.Provider>
    );
  }

