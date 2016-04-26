var ReactDOM = require('react-dom');
var routes =require('./routes.jsx');
var bootstrapUtils = require('react-bootstrap').utils.bootstrapUtils;
var Button = require('react-bootstrap').Button;

bootstrapUtils.addStyle(Button, 'remove');
bootstrapUtils.addStyle(Button, 'add');

ReactDOM.render(routes, document.getElementById('app'));