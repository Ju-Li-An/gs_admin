var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');
var ApisStore = require('./ApisStore.js');
var Check = require('../util/check.js');

let dataSetsPerPage = 10;

let data = {
	datasets:[],
	service:'',
	filter:'',
	api:'',
	operation:'',
	agent:{},
	selected:{dataset:{}, details:{}, template:{}},
	currentPage:1,
	pages:1
};

var DataSetsStore = Reflux.createStore({

	init: function() {
		this.listenToMany(Actions);
    this.listenTo(ApisStore, this.onApisStoreChange);
    },
	
	onApisStoreChange:function (storeData){
		if(storeData.selected === -1){
			this.initData();
			this.trigger(data);
			return;
		}

		data.agent = storeData.agent;
		data.service = storeData.service;
		data.api = storeData.selected.api;
		data.operation = storeData.selected.operation;
		data.filter = '';
		
		//si le statut de l'agent est arrêté, on ne tente pas l'appel pour afficher les services
		if(!data.agent.status){
			return;
		}
		
		// Rafrachissement de la liste des JDDs
		this.onRefreshDatasetsList(1);
		
	},
	
	onChangeDataSetFilter:function(filter){
		data.filter=filter;
		this.onRefreshDatasetsList(1);
	},
	
	onRefreshDatasetsList:function(pageNum){
		data.datasets=[];
		data.selected={};
		
		var count=0;
		
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port+'/';

		// Récupération de la liste des Services
		$.ajax({
			url: `${agentUrl}${data.service.basepath}/${data.api.name}/${data.operation.method}/datasets?pageNum=${pageNum}&pageSize=${dataSetsPerPage}&filter=${data.filter}`,
			type: "GET",
			dataType: "json",
			success: (result) => {
				data.datasets=result.page;
				data.pages=Math.ceil(result.totalSize/dataSetsPerPage);
				data.currentPage=pageNum;
				if(data.datasets.length>0){
					this.onSelectDataset(data.datasets[0]);
				}else{
					this.trigger(data);
				}
			},
			error: (x, t, m) => {
				// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
				Actions.disableAgent(data.agent);
			}
		});
	},
	
	// Change le service sélectionné
	onSelectDataset:function(dataset){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port+'/';

		// Récupération de la liste des Services
		$.ajax({
			url: `${agentUrl}${data.service.basepath}/${data.api.name}/${data.operation.method}/dataset/${dataset.key}`,
			type: "GET",
			dataType: "json",
			success: (result) => {
				data.selected.details=result;
				data.selected.dataset=dataset;
				this.getTemplate();
			},
			error: (x, t, m) => {
				// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
				Actions.disableAgent(data.agent);
			}
		});

	},

	refreshSelected:function(dataset,details){
		data.selected.details=details;
		data.selected.dataset=dataset;
		this.trigger(data);
	},
	
	getTemplate:function(){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port+'/';
		
		var templateName = data.selected.details.template;

		$.ajax({
			url: `${agentUrl}${data.service.basepath}/${data.api.name}/${data.operation.method}/template/${templateName}`,
			type: "GET",
			success: (result) => {
				data.selected.template={name:templateName,content:result};
				this.trigger(data);
			},
			error: (x, t, m) => {
				// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
				Actions.disableAgent(data.agent);
			}
		});
	},

	onEditDSParam:function(origin,newParam){
		var details=data.selected.details;

		if(origin.name!=newParam.name){

			var doublon = Check.paramExist(newParam.name,data.operation,details);

			if(doublon.exist){
				Actions.notify({title: data.service.basepath, message:doublon.message,level:'error'});
				this.trigger(data);
				return;
			}
		}

		//on remplace la propriété
		for(var id in details.parameters){
			if(details.parameters[id].name == origin.name){
				details.parameters[id]=newParam;
				break;
			}
		}

		this.publishDataSet(details);
	},

	onDisableCallback:function(){
		var details=data.selected.details;
		details.callback.enable=false;

		this.publishDataSet(details);
	},


	onEditCallback:function(callback){

		var details=data.selected.details;
		details.callback=callback;
		details.callback.enable=true;

		this.publishDataSet(details);

	},

	onAddDSParam:function(newParam){
		var details=data.selected.details;
		
		var doublon = Check.paramExist(newParam.name,data.operation,details);

		if(doublon.exist){
			Actions.notify({title: data.service.basepath, message:doublon.message,level:'error'});
			this.trigger(data);
			return;
		}

		if(details.parameters == undefined){
			details.parameters=[];
		}

		details.parameters.push(newParam);

		this.publishDataSet(details);
	},

	onDeleteDSParam:function(param){
		var details=data.selected.details;
		
		for(var id in details.parameters){
			if(details.parameters[id].name == param.name){
				details.parameters.splice(id,1);
				break;
			}
		}

		this.publishDataSet(details);
	},

	onDeleteData:function(dataKey){
		var details=data.selected.details;
		
		delete details.data[dataKey];
				
		this.publishDataSet(details);
	},

	onAddData:function(dataKey,dataValue){
		var details=data.selected.details;

		if(details.data==undefined){
			details.data={};
		}

		details.data[dataKey]=dataValue;

		this.publishDataSet(details);
	},

	onEditData:function(oldDataKey,dataKey,dataValue){
		var details=data.selected.details;
		if(oldDataKey!=dataKey)
			delete details.data[dataKey];

		details.data[dataKey]=dataValue;

		this.publishDataSet(details);
	},


	publishDataSet:function(details){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;
		$.ajax({
			url: `${agentUrl}/${data.service.basepath}/${data.api.name}/${data.operation.method}/dataset/${data.selected.dataset.key}`,
			type: "PUT",
			dataType: "json",
			data: JSON.stringify(details),
			success: (d,textStatus,xhr) => {
				this.refreshSelected(data.selected.dataset,details);
				Actions.notify({title: data.selected.dataset.key, message:`DataSet [${data.selected.dataset.key}] modifié.`,level:'success'});
			},
			error: (x, t, m) => {
				this.onRefreshDatasetsList(data.currentPage);
				Actions.notify({title: data.selected.dataset.key, message:x.responseText,level:'error'});
			}
		});
	},
	
	initData: function(){
		data = {
			datasets:[],
			service:'',
			filter:'',
			api:'',
			operation:'',
			agent:{},
			selected:{dataset:{}, details:{}, template:{}},
			currentPage:1,
			pages:1
		};
	},
	
	getDefaultData(){
		
		return data;
	}
});

module.exports=DataSetsStore;