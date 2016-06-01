var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');
var AgentsStore = require('./AgentsStore.js');
var SrvService = require('../services/SrvService.js');

let servicesPerPage = 10;

let data = {
	services:[],
	agent:{},
	selected:-1,
	currentPage:1,
	filter:'',
	pages:1
};

var ServicesStore = Reflux.createStore({

	init: function() {
		this.listenToMany(Actions);
        this.listenTo(AgentsStore, this.onAgentsStoreChange);
    },
	
	//En cas de changement sur les données des agents
	onAgentsStoreChange:function (storeData){
		if(storeData.selected===-1){
			this.initData();
			this.trigger(data);
			return;
		}
		data.agent = storeData.selected;
		
		//si le statut de l'agent est arrêté, on ne tente pas l'appel pour afficher les services
		if(!data.agent.status){
			return;
		}
		
		// Rafraichissement de la liste des services après changement de l'agent
		this.onRefreshServicesList(1);
		
	},
	
	onChangeServiceFilter:function(filter){
		if(filter != data.filter){
			data.filter=filter;
			this.onRefreshServicesList(1);
		}
	},
	
	onRefreshServicesList:function(pageNum){
		
		data.services=[];
		data.selected=-1;
		var count=0;
		
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;

		/*SrvService.list(data.agent,pageNum,servicesPerPage,data.filter,(err,srvList)=>{
			if(err){
				Actions.disableAgent(this);
				return;
			}

			data.currentPage=pageNum;
			data.pages=Math.ceil(srvList.totalSize/servicesPerPage);

			srvList.page.forEach((res,index,array) => {
				SrvService.get(agentUrl,res.value,(err,srvData)=>{
					var id=count++;
					if(srvData.state=='running'){
						srvData.status=1;
						if(data.selected==-1)
							data.selected=srvData;
					}
					else{
						srvData.status=0;
					}
					data.services.push(srvData);
					
					// Lorsqu'on a terminé la liste
					if(id==array.length-1){
						this.trigger(data);
					}
				});
			});
		});*/


		// Récupération de la liste des Services
		$.ajax({
			url: `${agentUrl}/list?pageNum=${pageNum}&pageSize=${servicesPerPage}&filter=${data.filter}`,
			type: "GET",
			dataType: "json",
			context: data.agent,
			success: (result) => {
			
				data.currentPage=pageNum;
			
				if(result.totalSize==0){
					data.pages=1;
					this.trigger(data);
					return;
				}

				data.pages=Math.ceil(result.totalSize/servicesPerPage);
			
				// Pour chaque service, récupération de sa configuration
				result.page.forEach((res,index,array) => {
					$.ajax({
						url: `${agentUrl}/${res.value}`,
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

	onDeleteService:function(service){

		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;

		$.ajax({
			url: `${agentUrl}/${service}`,
			type: "DELETE",
			dataType: "text",
			success: (result) => {
				this.onRefreshServicesList(1);
			}
		});

	},
	
	// Change le service sélectionné
	onSelectService:function(service){
		data.selected=service;
		this.trigger(data);
	},

	initData: function(){
		data = {
			services:[],
			agent:{},
			selected:-1,
			currentPage:1,
			filter:'',
			pages:1
		};
	},
	
	getDefaultData(){
		return data;
	}
});

module.exports=ServicesStore;