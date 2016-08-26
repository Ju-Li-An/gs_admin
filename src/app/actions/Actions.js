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
	"editService",
	"refreshSelected",
	
	//SERVICE EDITOR
	"selectStep",
	"submitStep",
	
	// API ACTIONS
	"selectApi",
	"editApi",
	"deleteApi",

	// OPERATION
	"selectOperation",
	"deleteOperation",
	"addOperation",
	"editOperation",
	
	// TP ACTIONS
	"addTp",
	"selectTp",
	"editTp",
	"deleteTp",
	
	// Datasets ACTIONS
	"selectDataset",
	"refreshDatasetsList",
	"changeDataSetFilter",
	
	// AGENT ACTIONS
	"selectAgent",
	"disableAgent",
	"refreshAgentList",

	// EDITOR SERVICE
	"showEditor",
	"closeEditor",

	"notify"
	
]); 

module.exports = Actions;
