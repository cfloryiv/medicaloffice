import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { SessionContext } from './App';
import API from './api';

export function PatientAppointments() {

    const token = useContext(SessionContext);
    const apptsx: { date: string, time: string, name: string, _id: string, userid: string, empid: string }[]=[];
    const [appts, setAppts] = useState(apptsx);

    useEffect(() => {
        async function update() {
            const apptsx: any[] = [];
            await API.get(`api/dental/appts`)
                .then(res => {
                    res.data.forEach((appt: { date: string, time: string, name: string, _id: string, userid: string, empid: string }) => {
                        if (appt.userid === token.userid) {
                            apptsx.push(appt);
                        }
                    })
                })
            setAppts(apptsx);
        }
        update();
    });

    return (
        <>
            <h1>Upcoming Appointments</h1>
            {appts.length === 0
                ? <h4>No appointments scheduled</h4>
                : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th><th>Time</th><th>Doctor</th><th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appts.map((appt, index) => (
                                <tr key={index}>
                                    <td>{appt.date}</td>
                                    <td>{appt.time}</td>
                                    <td>{appt.empid}</td>
                                    <td>{appt.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
        </>
    )
}