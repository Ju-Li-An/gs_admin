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
	pages:1,
	notification:{}
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

	adminService:function(action,basepath){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;

		$.ajax({
			url: `${agentUrl}/${action}/${basepath}`,
			type: "GET",
			dataType: "text",
			success: (result) => {
				var srv = JSON.parse(result);
		
				if(data.selected.basepath==srv.basepath){
					data.selected=srv;
					data.selected.status=srv.state=='stopped'?0:1;
				}
				for(var id in data.services){
					if(data.services[id].basepath==srv.basepath){
						data.services[id].state=srv.state;
						data.services[id].status=srv.state=='stopped'?0:1;
						break;
					}
				}

				this.trigger(data);
				Actions.notify({title: basepath,message:'Service '+srv.state,level:action=='start'?'success':'warning'});
			},
			error: (x, t, m) => {
				this.onRefreshServicesList(1);
				Actions.notify({title: basepath,message:x.responseText,level:'error'});
			}
		});
	},

	onStopService:function(basepath){
		this.adminService('stop',basepath);
	},

	onStartService:function(basepath){
		this.adminService('start',basepath);
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
							var service={basepath:srv.basepath,state:srv.state};
							if(srv.state=='running'){
								srv.status=1;
								if(data.selected==-1){
									data.selected=srv;
								}
								service.status=1;
							}
							else{
								service.status=0;
							}
							data.services.push(service);
							
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
			Actions.notify({title: 'Error',message:'Agent inaccessible:'+data.agent.hostname+':'+data.agent.port,level:'error'});
		});
	},

	onDeleteService:function(basepath){

		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;

		$.ajax({
			url: `${agentUrl}/${basepath}`,
			type: "DELETE",
			dataType: "text",
			success: (result) => {
				if(data.selected.basepath==basepath){
					this.onRefreshServicesList(1);
				}else{
					var services = data.services.filter(function(element){
						return element.basepath!=basepath;
					});
					data.services=services;
					this.trigger(data);
				}
				Actions.notify({title: basepath, message:'Service supprimé.',level:'success'});
			},
			error: (x, t, m) => {
				this.onRefreshServicesList(1);
				Actions.notify({title: basepath,message:x.responseText,level:'error'});
			}
		});

	},
	
	// Change le service sélectionné
	onSelectService:function(service){

		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;

		$.ajax({
			url: `${agentUrl}/${service.basepath}`,
			type: "GET",
			dataType: "json",
			success: (srv) => {
				if(srv.state=='running'){
					srv.status=1;
				}
				else{
					srv.status=0;
				}
				data.selected=srv;
				
				this.trigger(data);
			},
			error: (x, t, m) => {
				this.onRefreshServicesList(1);
				Actions.notify({title: service.basepath,message:x.responseText,level:'error'});
			}
		});

	},

	onEditService:function(basepath,serviceDesc){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;

		//var srcBasepath = data.selected.basepath;
		//var destSrv = JSON.parse(JSON.stringify(data.selected));
		var destbasepath = `${serviceDesc.appName}_${serviceDesc.serviceName}_v${serviceDesc.serviceVersion}`;
		var destSrv={basepath:destbasepath};

		if(basepath==destbasepath){
			//Actions.closeEditor();
			return;
		}

		$.ajax({
			url: `${agentUrl}/${basepath}`,
			type: "POST",
			dataType: "text",
			data: JSON.stringify(destSrv),
			success: (d,textStatus,xhr) => {
				this.onRefreshServicesList(1);
				//Actions.closeEditor();
				Actions.notify({title: basepath, message:'Service modifié.',level:'success'});
			},
			error: (x, t, m) => {
				this.onRefreshServicesList(1);
				//Actions.closeEditor();
				Actions.notify({title: basepath, message:x.responseText,level:'error'});
			}
		});
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