var Reflux = require('reflux');

var Actions = Reflux.createActions([

	// SERVICES ACTIONS
  	"refreshServicesList",
	"selectService",
	"changeServiceFilter",
	"submitService",
	"deleteService",
	"startService",
	"stopService",
	
	//SERVICE EDITOR
	"selectStep",
	"submitStep",
	
	// API ACTIONS
	"selectApi",
	
	// TP ACTIONS
	"selectTp",
	
	// Datasets ACTIONS
	"selectDataset",
	"refreshDatasetsList",
	"changeDataSetFilter",
	
	// AGENT ACTIONS
	"selectAgent",
	"disableAgent",
	"refreshAgentList",

	// EDITOR SERVICE
	"createService",

	"notify"
	
]); 

module.exports = Actions;
