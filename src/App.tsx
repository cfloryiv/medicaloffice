import React from 'react';
import { Route } from 'react-router-dom';

import { Header } from './Header';
import { Navigation } from './Navagation';
import { PatientPortal } from './PatientPortal';
import { EmployeePortal } from './EmployeePortal';
import { AdminPortal } from './AdminPortal';
import { PatientProfile } from './PatientProfile';
import { Schedule } from './Schedule';
import { SchedulePortal } from './SchedulePortal';
import { TodaysSchedule } from './TodaysSchedule';
import { ProceduresEditor } from './ProceduresEditor';
import { InsurancesEditor } from './InsurancesEditor';
import { PatientProcedures } from './PatientProcedures';
import { AdminDayEnd } from './AdminDayEnd';
import { PatientBilling } from './PatientBilling';

import GuardedRoute from './GuardedRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { PatientAppointments } from './PatientAppointments';

const token = {
  userid: "cfloryiv",
  password: "pw",
  admin: true,
  employee: false,
  employees: [
    "doctor1", "doctor2", "employee1", "employee2"
  ],
  insurance: [
    "Aetna", "Blue Cross", "Medicare", "Self Insured", "Tufts"
  ]
}

export const SessionContext = React.createContext(token);

export default function App() {


  return (
    <SessionContext.Provider value={token}>
      <div>
        <Route path='/' component={Header} />
        <Route exact path='/' component={Navigation} />

        <GuardedRoute exact path='/employeeportal' component={EmployeePortal} auth={token.employee} />

        <GuardedRoute exact path='/adminportal' component={AdminPortal} auth={token.admin} />
        <GuardedRoute exact path='/procedureseditor' component={ProceduresEditor} auth={token.admin} />
        <GuardedRoute exact path='/insuranceseditor' component={InsurancesEditor} auth={token.admin} />
        <GuardedRoute exact path='/admindayend' component={AdminDayEnd} auth={token.admin} />

        <GuardedRoute exact path='/patientportal' component={PatientPortal} auth={!token.employee} />
        <GuardedRoute exact path='/patientprofile' component={PatientProfile} auth={!token.employee} />
        <GuardedRoute exact path='/patientschedule' component={PatientAppointments} auth={!token.employee} />
        <GuardedRoute exact path='/patientprocedures' component={PatientProcedures} auth={!token.employee} />
        <GuardedRoute exact path='/patientbilling' component={PatientBilling} auth={!token.employee} />

        <Route exact path='/schedule' render={() => <Schedule allowUpdate={true} />} />
        <Route exact path='/scheduleportal' component={SchedulePortal} />
        <Route exact path='/todaysschedule' component={TodaysSchedule} />
      </div>
    </SessionContext.Provider>
  );
}

