var Reflux = require('reflux');

var Actions = Reflux.createActions([
	// SERVICES ACTIONS
    "updateServices",
	"selectService",
	
	// API ACTIONS
	"selectApi",
	
	// AGENT ACTIONS
	"selectAgent",
	"disableAgent",
	"refreshAgentList"
]); 

module.exports = Actions;
