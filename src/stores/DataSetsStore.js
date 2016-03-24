var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');
var ApisStore = require('./ApisStore.js');

let dataSetsPerPage = 8;

let data = {
	datasets:[],
	currentService:'',
	currentApi:'',
	currentOpe:'',
	agent:{},
	selected:{dataset:{}, parametres:{}, template:{}},
	currentPage:1,
	pages:1
};

var DataSetsStore = Reflux.createStore({

	init: function() {
		this.listenToMany(Actions);
    this.listenTo(ApisStore, this.onApisStoreChange);
    },
	
	onApisStoreChange:function (storeData){
		if(storeData.selected===-1){
			return;
		}
		data.agent = storeData.agent;
		data.currentService = storeData.currentService;
		data.currentApi=storeData.selected.name;
		data.currentOpe=storeData.selected.method;
		
		//si le statut de l'agent est arrêté, on ne tente pas l'appel pour afficher les services
		if(!data.agent.status){
			return;
		}
		
		// Rafrachissement de la liste des JDDs
		this.onRefreshDatasetsList(1);
		
	},
	

	onRefreshDatasetsList:function(pageNum){
		data.datasets=[];
		data.selected={};
		var count=0;
		
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port+'/';

		// Récupération de la liste des Services
		$.ajax({
			url: `${agentUrl}${data.currentService}/${data.currentApi}/${data.currentOpe}/datasets?pageNum=${pageNum}&pageSize=${dataSetsPerPage}&filter=null`,
			type: "GET",
			dataType: "json",
			success: (result) => {
				data.datasets=result.page;
				data.pages=Math.ceil(result.totalSize/dataSetsPerPage);
				data.currentPage=pageNum;
				if(data.datasets.length>0){
					this.onSelectDataset(data.datasets[0]);
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
			url: `${agentUrl}${data.currentService}/${data.currentApi}/${data.currentOpe}/dataset/${dataset.key}`,
			type: "GET",
			dataType: "json",
			success: (result) => {
				data.selected.parametres=result;
				data.selected.dataset=dataset;
				this.getTemplate();
			},
			error: (x, t, m) => {
				// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
				Actions.disableAgent(data.agent);
			}
		});

	},
	
	getTemplate:function(){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port+'/';
		
		var template = data.selected.parametres['template'];
		$.ajax({
			url: `${agentUrl}${data.currentService}/${data.currentApi}/${data.currentOpe}/template/${template}`,
			type: "GET",
			success: (result) => {
				data.selected.template={name:template,content:result};
				this.trigger(data);
			},
			error: (x, t, m) => {
				// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
				Actions.disableAgent(data.agent);
			}
		});
	},
	
	getDefaultData(){
		return data;
	}
});

module.exports=DataSetsStore;