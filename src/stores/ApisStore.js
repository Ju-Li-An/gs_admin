var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');
var ServicesStore = require('./ServicesStore.js');

let data = {
	apis:[],
	selected:-1,
	currentPage:1,
};

var ApisStore = Reflux.createStore({

	init: function() {
		this.listenToMany(Actions);
        this.listenTo(ServicesStore, this.onServicesStoreChange);
    },
	
	
	onServicesStoreChange:function (storeData){
		if(storeData.selected===-1){
			return;
		}
		var services = storeData.services;
		var service = services[storeData.selected];
		
		data.apis=[];
		data.selected=-1;
		
		for(var idApi in service.apis){
			var api = service.apis[idApi];
			
			for(var idOperation in api.operations){
				var operation = api.operations[idOperation];
				
				operation.name=api.name;
				operation.uri=api.uri,
				operation.id=data.apis.length;
	
				data.apis.push(operation);
			}
		}
		data.selected=0;
		
		this.trigger(data);

	},
	
	onSelectApi:function(id){
		data.selected=id;
		this.trigger(data);
	},
	
	getDefaultData(){
		return data;
	}
});

module.exports=ApisStore;