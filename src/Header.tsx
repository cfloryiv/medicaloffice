import React from 'react';
import { Jumbotron} from 'react-bootstrap';

export function Header() {
    return (
      <>
        <Jumbotron style={{backgroundColor: 'blue' }}>
        <h1>Medical Office</h1>
        <p>Manage a medical office for Doctors and Patients</p>
      </Jumbotron>
     
    </>
    );
}