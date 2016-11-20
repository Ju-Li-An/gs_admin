var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');
var ServicesStore = require('./ServicesStore.js');
var Check = require('../util/check.js');

let data = {
	currentService:'',
	apis:[],
	agent:{},
	selected:-1,
	currentPage:1
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
		data.service=service;

		data.agent=storeData.agent;
		
		data.apis=service.apis;

		//Meme service que précédemment
		if(data.currentService == service.basepath){
			var searchApi = service.apis.filter(function(val){return val.name==data.selected.api.name;});

			//L'API précédemment sélectionnée existe toujours - on raffraichit les données
			if(searchApi.length == 1){
				data.selected.api=searchApi[0];
				var searchOpe = searchApi[0].operations.filter(function(val){return val.method==data.selected.operation.method;});
				if(searchOpe.length == 1){
					data.selected.operation=searchOpe[0];
				}else{
					data.selected.operation=searchApi[0].operations[0];
				}
				return this.trigger(data);
			}
		}

		//Nouveau service sélectionné, on rafraichi la liste des API et on sélectionne la première par défaut
		data.currentService=service.basepath;
		data.selected=-1;
		if(data.apis.length > 0)
			data.selected={api:data.apis[0],operation:data.apis[0].operations[0]};

		return this.trigger(data);
	},

	/**************************************************
	* Gestion des APIs
	*
	***************************************************/
	onSelectApi:function(api){
		data.selected.api=api;
		data.selected.operation=api.operations[0];
		this.trigger(data);
	},

	onEditApi:function(oldApi,newApi){
		if(oldApi.name == newApi.name
			&& oldApi.uri == newApi.uri){
			return;
		}

		var apiByUri=data.apis.filter(function(val){return newApi.uri==val.uri;});
		var apiByName=data.apis.filter(function(val){return newApi.name==val.name;});
		var apiEdited; 
		//URI changed and exists
		if(oldApi.uri != newApi.uri && apiByUri.length==1){
			Actions.notify({title: data.service.basepath, message:`API URI [${newApi.uri}] already exists.`,level:'error'});
			return this.trigger(data);
		}
		if(oldApi.name != newApi.name && apiByName.length ==1){
			Actions.notify({title: data.service.basepath, message:`API name [${newApi.name}] already exists.`,level:'error'});
			return this.trigger(data);
		}

		for(var apiId in data.apis){
			if(data.apis[apiId].name == oldApi.name){
				apiEdited = data.apis[apiId];
				apiEdited.name = newApi.name;
				apiEdited.uri = newApi.uri;
				break;
			}
		}

		this.publishApi(oldApi.name,apiEdited);
	
	},

	publishApi:function(api_name,api){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;
		$.ajax({
			url: `${agentUrl}/${data.service.basepath}/${api_name}`,
			type: "POST",
			dataType: "json",
			data: JSON.stringify(api),
			success: (d,textStatus,xhr) => {
				Actions.notify({title: data.service.basepath, message:`API [${api_name}] modifiée.`,level:'success'});
				Actions.refreshSelected(d);
			},
			error: (x, t, m) => {
				Actions.refreshServicesList(1);
				Actions.notify({title:data.service.basepath, message:x.responseText,level:'error'});
			}
		});
	},

	onDeleteApi:function(api){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;

		$.ajax({
			url: `${agentUrl}/${data.service.basepath}/${api.name}`,
			type: "DELETE",
			dataType: "json",
			success: (result) => {
				Actions.refreshSelected(result);
				Actions.notify({title: data.service.basepath, message:`API [${data.selected.api.name}] supprimée.`,level:'success'});
			},
			error: (x, t, m) => {
				Actions.refreshServicesList(1);
				Actions.notify({title: data.service.basepath,message:x.responseText,level:'error'});
			}
		});

	},

	/**************************************************
	* Gestion des Operations
	*
	***************************************************/

	onSelectOperation:function(operation){
		data.selected.operation=operation;
		this.trigger(data);
	},

	onEditOperation:function(origin,newOpe){
		if(origin.method==newOpe.method)
			return;

		var api = data.selected.api;
		if(api.operations.map(function(val){return val.method;}).includes(newOpe.method)){
			Actions.notify({title: data.service.basepath, message:`Operation [${newOpe.method}] existe déjà pour l'API [${api.name}].`,level:'error'});
			this.trigger(data);
			return;
		}

		this.publishOperation(api.name,origin.method,newOpe);

	},

	onDeleteOperation:function(operation){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;

		$.ajax({
			url: `${agentUrl}/${data.service.basepath}/${data.selected.api.name}/${operation.method}`,
			type: "DELETE",
			dataType: "json",
			success: (result) => {
				Actions.refreshSelected(result);
				Actions.notify({title: data.service.basepath, message:`API [${data.selected.api.name}] - Operation [${operation.method}] supprimée.`,level:'success'});
			},
			error: (x, t, m) => {
				Actions.refreshServicesList(1);
				Actions.notify({title: data.service.basepath,message:x.responseText,level:'error'});
			}
		});

	},

	onAddOperation:function(operation){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;
		$.ajax({
			url: `${agentUrl}/${data.service.basepath}/${data.selected.api.name}/${operation.method}`,
			type: "PUT",
			dataType: "json",
			data: JSON.stringify(operation),
			success: (d,textStatus,xhr) => {
				Actions.refreshSelected(d);
				Actions.notify({title: data.service.basepath, message:`API [${data.selected.api.name}] Operation [${operation.method}] ajoutée.`,level:'success'});
			},
			error: (x, t, m) => {
				Actions.refreshServicesList(1);
				Actions.notify({title:data.service.basepath, message:x.responseText,level:'error'});
			}
		});
	},

	publishOperation:function(api_name,method,operation){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port;
		$.ajax({
			url: `${agentUrl}/${data.service.basepath}/${api_name}/${method}`,
			type: "POST",
			dataType: "json",
			data: JSON.stringify(operation),
			success: (d,textStatus,xhr) => {
				Actions.refreshSelected(d);
				Actions.notify({title: data.service.basepath, message:`API [${api_name}] Operation [${method}] modifiée.`,level:'success'});
			},
			error: (x, t, m) => {
				Actions.refreshServicesList(1);
				Actions.notify({title:data.service.basepath, message:x.responseText,level:'error'});
			}
		});
	},

	getNewOperation:function(){
		return {
				method:'POST',
				transferProperties:[],
				parameters:[],
				keys:[],
				regExpKeys:[],
				responseType:'text/xml;charset=UTF-8',
				delay:0
		};
	},


	/**************************************************
	* Gestion des Parametres
	*
	***************************************************/
	getNewParam:function(){
		return {
				name:'',
				type:'DATE'
		};
	},


	onEditParam:function(origin,newParam){
		var operation = data.selected.operation;
		var api =  data.selected.api;

		if(origin.name!=newParam.name){

			var doublon = Check.paramExist(newParam.name,operation);

			if(doublon.exist){
				Actions.notify({title: data.service.basepath, message:doublon.message,level:'error'});
				this.trigger(data);
				return;
			}

		}

		//on remplace la propriété
		for(var id in operation.parameters){
			if(operation.parameters[id].name == origin.name){
				operation.parameters[id]=newParam;
				break;
			}
		}


		this.publishOperation(api.name,operation.method,operation);
		
	},

	onAddParam:function(newParam){
		var operation = data.selected.operation;
	
		var doublon = Check.paramExist(newParam.name,operation);

		if(doublon.exist){
			Actions.notify({title: data.service.basepath, message:doublon.message,level:'error'});
			this.trigger(data);
			return;
		}

		operation.parameters.push(newParam);

		this.publishOperation(data.selected.api.name,operation.method,operation);
	},

	onDeleteParam:function(param){
		var operation = data.selected.operation;
		
		for(var id in operation.parameters){
			if(operation.parameters[id].name == param.name){
				operation.parameters.splice(id,1);
				break;
			}
		}


		this.publishOperation(data.selected.api.name,operation.method,operation);
	},

	/**************************************************
	* Gestion des TransferProperties
	*
	***************************************************/
	getNewTp:function(){
		return {
				name:'',
				source:'BODY_XPATH',
				path:''
		};
	},

	onEditTp:function(origin,newTp){
		var operation = data.selected.operation;
		var api =  data.selected.api;

		if(origin.name!=newTp.name){
			var doublon = Check.paramExist(newTp.name,operation);

			if(doublon.exist){
				Actions.notify({title: data.service.basepath, message:doublon.message,level:'error'});
				this.trigger(data);
				return;
			}

		}

		//on remplace la propriété
		for(var id in operation.transferProperties){
			if(operation.transferProperties[id].name == origin.name){
				operation.transferProperties[id]=newTp;
				break;
			}
		}

		//gestion de la clé
		if(origin.isKey != newTp.isKey){
			if(newTp.isKey){
				operation.keys.push(newTp.name);
			}else{
				for (var id in operation.keys){
					if(operation.keys[id]==origin.name){
						operation.keys.splice(id,1);
						break;
					}
				}
			}
		}else if(origin.isKey == newTp.isKey && origin.isKey && origin.name!=newTp.name){
			for (var id in operation.keys){
				if(operation.keys[id]==origin.name){
					operation.keys[id]=newTp.name;
					break;
				}
			}
		}

		this.publishOperation(api.name,operation.method,operation);
		
	},

	onAddTp:function(newTp){
		var operation = data.selected.operation;
		
		var doublon = Check.paramExist(newTp.name,operation);

		if(doublon.exist){
			Actions.notify({title: data.service.basepath, message:doublon.message,level:'error'});
			this.trigger(data);
			return;
		}


		if(newTp.isKey)
			operation.keys.push(newTp.name);

		operation.transferProperties.push(newTp);

		this.publishOperation(data.selected.api.name,operation.method,operation);
	},

	onDeleteTp:function(tp){
		var operation = data.selected.operation;
		
		for(var id in operation.transferProperties){
			if(operation.transferProperties[id].name == tp.name){
				operation.transferProperties.splice(id,1);
				break;
			}
		}

		for (var id in operation.keys){
			if(operation.keys[id]==tp.name){
				operation.keys.splice(id,1);
				break;
			}
		}

		this.publishOperation(data.selected.api.name,operation.method,operation);
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