var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');
var AgentsStore = require('./AgentsStore.js');

let data = {
	services:[],
	agent:{},
	selected:-1,
	currentPage:1,
};

var ServicesStore = Reflux.createStore({

	init: function() {
		this.listenToMany(Actions);
        this.listenTo(AgentsStore, this.onAgentsStoreChange);
    },
	
	//En cas de changement sur les données des agents
	onAgentsStoreChange:function (storeData){
		if(storeData.selected===-1){
			return;
		}
		data.agent = storeData.selected;
		
		//si le statut de l'agent est arrêté, on ne tente pas l'appel pour afficher les services
		if(!data.agent.status){
			return;
		}
		
		// Rafrachissement de la liste des services après changement de l'agent
		this.onRefreshServiceList();
		
	},
	
	onRefreshServiceList:function(){
		data.services=[];
		data.selected=-1;
		var count=0;
		
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port+'/';

		// Récupération de la liste des Services
		$.ajax({
			url: agentUrl+'list',
			type: "GET",
			dataType: "json",
			context: data.agent,
			success: (result) => {
			
				// Pour chaque servie, récupération de sa configuration
				result.forEach((res,index,array) => {
					$.ajax({
						url: agentUrl+res,
						type: "GET",
						dataType: "json",
						success: (srv) => {
							var id =count++;
							if(srv.state=='running'){
								srv.status=1;
								if(data.selected==-1)
									data.selected=srv;
							}
							else{
								srv.status=0;
							}
							data.services.push(srv);
							
							// Lorsqu'on a terminé la liste
							if(id==array.length-1){
								this.trigger(data);
							}
						}
					});
				});
			}
		})
		.fail(function(){
			// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
			Actions.disableAgent(this);
		});
	},
	
	// Change le service sélectionné
	onSelectService:function(service){
		data.selected=service;
		this.trigger(data);
	},
	
	getDefaultData(){
		return data;
	}
});

module.exports=ServicesStore;