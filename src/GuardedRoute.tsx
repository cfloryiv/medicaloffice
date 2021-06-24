import React, { Component } from "react";
import {Route, Redirect} from 'react-router-dom';

const GuardedRoute=({component: Component, auth, ...rest}: any) => (
    <Route {...rest} render={(props) => (
        auth===true
            ? <Component {...props} />
            : <Redirect to='/' />
     )} />
)

export default GuardedRoute;