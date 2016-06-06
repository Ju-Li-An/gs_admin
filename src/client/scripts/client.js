import ReactDOM from 'react-dom';
import App from '../../app/App.jsx';
import React from 'react';
import { Router, Route, Redirect } from 'react-router';
import AdminSimulateurs from '../../app/views/AdminSimulateurs.jsx';

/*var ReactDOM = require('react-dom');
var App = require('../../app/App.jsx');
var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Redirect = require('react-router').Redirect;
var AdminSimulateurs =require('../../app/views/AdminSimulateurs.jsx');*/

ReactDOM.render(
	(
	<Router>
        <Route component={App}>
            <Route name="Simulateurs" path="/Simulateurs" component={AdminSimulateurs}/>
           
            <Redirect from="/" to="/Simulateurs" />
           
        </Route>
	</Router>
	    ), document.getElementById('app'));