var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Redirect = require('react-router').Redirect;

var App = require('./App.jsx');
var AdminSimulateurs = require('./views/AdminSimulateurs.jsx');

module.exports=(
    <Router>
        <Route component={App}>
            <Route name="simulateurs" path="/simulateurs" component={AdminSimulateurs}/>
           
            {/* Redirects */}
            <Redirect from="/" to="/simulateurs" />
           
        </Route>
    </Router>
);