var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');
var ServicesStore = require('./ServicesStore.js');

let data = {
	currentService:'',
	apis:[],
	agent:{},
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
			this.initData();
			this.trigger(data);
			return;
		}
		var service = storeData.selected;
		data.agent=storeData.agent;
		data.currentService =  service.basepath;

		data.apis=[];
		data.selected=-1;
		
		service.apis.map((api) => {
			api.operations.map((operation) => {
				operation.name=api.name;
				operation.uri=api.uri,
				operation.id=data.apis.length;
				data.apis.push(operation);
			});
		});
		

		if(data.apis.length > 0)
			data.selected=data.apis[0];
		
		this.trigger(data);
	},
	
	onSelectApi:function(api){
		data.selected=api;
		this.trigger(data);
	},

	initData:function(){
		data = {
			currentService:'',
			apis:[],
			agent:{},
			selected:-1,
			currentPage:1,
		};
	},
	
	getDefaultData(){
		
		return data;
	}
});

module.exports=ApisStore;