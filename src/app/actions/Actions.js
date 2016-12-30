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

	// PARAMETRES
	"deleteParam",
	"addParam",
	"editParam",
	
	// TP ACTIONS
	"addTp",
	"selectTp",
	"editTp",
	"deleteTp",
	
	// Datasets ACTIONS
	"selectDataset",
	"refreshDatasetsList",
	"changeDataSetFilter",

	// DataSets PARAMETRES
	"deleteDSParam",
	"addDSParam",
	"editDSParam",

	// DataSets DATA
	"deleteData",
	"addData",
	"editData",
	
	// AGENT ACTIONS
	"selectAgent",
	"disableAgent",
	"deleteAgent",
	"refreshAgentList",

	// EDITOR SERVICE
	"showEditor",
	"closeEditor",

	"disableCallback",
	"editCallback",

	"notify"
	
]); 

module.exports = Actions;
