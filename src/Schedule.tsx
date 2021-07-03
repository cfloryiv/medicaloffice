import React, {useState, useEffect, useContext} from 'react';
import {Col, Row, Card, Container} from 'react-bootstrap';
import API from './api';
import {SessionContext} from './App';

interface APPT {date: string, time: string, name: string, idx: string, empid: string, userid: string};

function bumpDate(date0: Date, deltaDays: number) {
    return date0.getTime()+deltaDays*(24*60*60*1000);
}
export function Schedule(props: {allowUpdate: boolean}) {

    const token=useContext(SessionContext);
    const [employee, setEmployee]=useState("");
    const [userid, setUserid]=useState("");
    const [refresh, setRefresh]=useState(0);

    let times=[
        "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30",
        "4:00", "4:30"
    ];
    let weekDays=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    let date0=new Date(2021, 5, 14);
    let [startDate, setStartDate]=useState(date0);

    let dates: string[]=[];
    for (let ndx=0; ndx<5; ndx++) {
        dates.push(new Date(bumpDate(startDate, ndx)).toISOString().split('T')[0]);
    };
    
    

    const appts: APPT[]=[];
    times.forEach(time => {
        dates.forEach(date => {
            let appt={ date, time, name: "", idx: "", userid: "", empid: employee};
            appts.push(appt);
        })
    });
    const [apptsx, setappts]=useState(appts);

    const init = () => {
        // create a clean slate for this week
        const appts: APPT[]=[];
        times.forEach(time => {
            dates.forEach(date => {
                let appt={ date, time, name: "", idx: "", userid: "", empid: employee};
                appts.push(appt);
            })
        });
        // query each date for this week to get previous data
        dates.forEach(date => {
            API.get(`api/dental/appts?date=${date}`)
                .then(res => {
                    
                    res.data.forEach((appt: {date: string, time: string, name: string, _id: string, userid: string, empid: string}) => {
                        let time=appt.time;
                        let name=appt.name;
                        let empid=appt.empid;
                        
                        appts.find((apptx, index) => {
                            if (apptx.date===date && apptx.time===time && apptx.empid===empid) {
                                appts[index].name=name;
                                return;
                            }
                        })
                    })
                })
        });
        setappts(appts);
        
       } ;

    useEffect(() => {
        init();
        setTimeout(() => setRefresh(refresh+1), 2000);
    }, [startDate, employee]);



    const cellHandler = (tindex: number, dindex: number) => {
        let index: number=tindex*5+dindex
        if (!props.allowUpdate) return;

        const newappts=[...apptsx];
        if (newappts[index].name==="") {
            newappts[index].name="reserve";
        
        
        } else {
            if (newappts[index].name==="reserve") {
            
            newappts[index].name="";
            
            }
        }
        
        setappts(newappts);
        
    };
    function updateDB() {
        if (employee==="") {
            alert("Select an employee from the dropdown box");
            return;
        }
        if (userid==="") {
            alert("Enter a user id");
            return;
        }
        apptsx.forEach((appt) => {
            if (appt.name==="reserve") {
                appt.empid=employee;
                appt.userid=userid;
                appt.name=userid;
                
                API.post(`api/dental/appts`, appt)
                    .then(res=> {
                        console.log(appt);
                    })
            }
        });
        // clear schedule
        setUserid("");
    }
    const changeWeek = (numberDays: number) => {
        setStartDate(new Date(bumpDate(startDate, numberDays)));
    }
    return (
        <>
         <Container>
        <Card>
            <h1 style={{ textAlign: "center"}}>Schedule for: {dates[0]} to {dates[4]}</h1>
            
            <div style={{textAlign: "center", margin: "1em"}}>
            <button className="btn btn-success" onClick={(e) => changeWeek(-7)}>Previous Week</button>
            <select onChange={(e) => setEmployee(e.target.value)} >
                <option value="choose" disabled>choose</option>
                {token.employees.map((emp) => (
                    <option value={emp}>{emp}</option>
                ))}
            </select>
            <input onChange={(e) => setUserid(e.target.value)}/>
            <button className="btn btn-success" onClick={(e) => changeWeek(7)}>Next Week</button>
            <button className="btn btn-success" onClick={updateDB}>Update</button>
            </div>
            
            <Row>
                <Col>
                    <div></div>
                </Col>
                {weekDays.map((day: string) => (
                    <Col>
                    <div style={{textAlign: "center"}}><strong>{day}</strong></div> 
                    </Col>
                ))}
            </Row>
            {times.map((time: string, tindex: number) => (
                <Row key={time}>
                    <Col>
                        <div className="timecell"><strong>{time}</strong></div>
                    </Col>
                    {dates.map((date: string, dindex: number) => (
                        <Col>
                        
                            <div className={apptsx[tindex*5+dindex].name==='' ? "emptycell" : "cell"} 
                                onClick={(e) => cellHandler(tindex, dindex)}>{apptsx[tindex*5+dindex].name}</div>
                        </Col>
                    ))}
                </Row>
            ))}
            </Card>
            </Container>
            </>
    );
    
    }