import React, { useState, useEffect, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import API from './api';
import { SessionContext } from './App';

interface APPT { date: string, time: string, name: string, idx: string, empid: string, userid: string };

export function TodaysSchedule(props: { allowUpdate: boolean }) {

    const token = useContext(SessionContext);


    let times = [
        "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30",
        "4:00", "4:30"
    ];
    let columns = token.employees;
    let numberColumns = columns.length;

    let date0 = new Date(2021, 5, 14);
    let formatDate: string = date0.toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(date0);


    const appts: any[] = [];
    times.forEach(time => {
        columns.forEach(col => {
            let appt = { formatDate, time, name: "", idx: "", userid: "", empid: col };
            appts.push(appt);
        })
    });
    const [apptsx, setappts] = useState(appts);

    const init = () => {
        // create a clean slate for this week
        const appts: any[] = [];
        times.forEach(time => {
            columns.forEach(col => {
                let appt = { formatDate, time, name: "", idx: "", userid: "", empid: col };
                appts.push(appt);
            })
        });

        // query each date for this week to get previous data

        API.get(`api/dental/appts?date=${formatDate}`)
            .then(res => {

                res.data.forEach((appt: { date: string, time: string, name: string, _id: string, userid: string, empid: string }) => {
                    let time = appt.time;
                    let name = appt.name;
                    let empid=appt.empid;
                    columns.forEach((col) => {
                        appts.find((apptx, index) => {
                            if (apptx.time === time && apptx.empid===empid) {
                                console.log('found match', col, time, name);
                                appts[index].name = name;
                                return;
                            }
                        })
                    })
                })
            })

        setappts(appts);

    };
    useEffect(() => {
        init();
        setTimeout(()=> setStartDate(new Date()), 2000);
    }, [])



    return (
        <>
            <h1 style={{ textAlign: "center" }}>Schedule for: {formatDate}</h1>

            <Row>
                <Col>
                    <div></div>
                </Col>
                {columns.map((col: string) => (
                    <Col>
                        <div style={{ textAlign: "center" }}><strong>{col}</strong></div>
                    </Col>
                ))}
            </Row>
            {times.map((time: string, tindex: number) => (
                <Row key={time}>
                    <Col>
                        <div className="timecell"><strong>{time}</strong></div>
                    </Col>
                    {columns.map((col: string, dindex: number) => (
                        <Col>

                            <div className={apptsx[tindex * numberColumns + dindex].name === '' ? "emptycell" : "cell"}
                            >{apptsx[tindex * numberColumns + dindex].name}</div>
                        </Col>
                    ))}
                </Row>
            ))}
        </>
    );

}