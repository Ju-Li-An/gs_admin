var Reflux = require('reflux');

var Actions = Reflux.createActions([

	// SERVICES ACTIONS
  "refreshServicesList",
	"selectService",
	"changeServiceFilter",
	"submitService",
	
	
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
	"refreshAgentList"
	
]); 

module.exports = Actions;
