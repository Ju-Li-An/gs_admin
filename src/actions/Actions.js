var Reflux = require('reflux');

var Actions = Reflux.createActions([
	// SERVICES ACTIONS
    "updateServices",
	"selectService",
	
	// API ACTIONS
	"selectApi",
	
	// TP ACTIONS
	"selectTp",
	
	// Datasets ACTIONS
	"selectDataset",
	"refreshDatasetsList",
	
	// AGENT ACTIONS
	"selectAgent",
	"disableAgent",
	"refreshAgentList"
]); 

module.exports = Actions;
