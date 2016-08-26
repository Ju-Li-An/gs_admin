var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var SE_Step_Service = require('../components/editors/steps/SE_Step_Service.jsx');
var SE_Step_API = require('../components/editors/steps/SE_Step_API.jsx');
var SE_Step_Prop = require('../components/editors/steps/SE_Step_Prop.jsx');
var SE_Step_Param = require('../components/editors/steps/SE_Step_Param.jsx');
var SE_Step_Transfert = require('../components/editors/steps/SE_Step_Transfert.jsx');
var SE_Step_Key = require('../components/editors/steps/SE_Step_Key.jsx');
var ServicesStore = require('./ServicesStore.js');

let data = {
	service:{},
	steps:[],
	currentStep:0
};

var ServiceCreatorStore = Reflux.createStore({
	listenables: Actions,
	
	init: function() {
        this.listenTo(ServicesStore, this.onServicesStoreChange);
    },

    onServicesStoreChange:function (storeData){
		if(storeData.selected===-1){
			return;
		}
		data.selected = storeData.selected;
		data.agent=storeData.agent;
	},

	onCreateService: function(agent){
		this.trigger(this.getDefaultData(agent));
	},

	onEditService: function(service,agent){
		this.getDefaultData(agent);
		data.service=service;
		this.trigger(data);
	},

	onSelectStep: function(stepIndex){
		data.steps[data.currentStep].active=false;
		data.steps[stepIndex].active=true;
		data.currentStep=stepIndex;
		this.trigger(data);
	},

	publishService:function(){
		var agentUrl='http://'+data.agent.hostname+':'+data.agent.port+'/';

		if(data.mode=='addApi'){
			$.ajax({
				url: `${agentUrl}${data.service.basepath}/${data.steps[1].data.apiName}`,
				type: "PUT",
				dataType: "json",
				data: JSON.stringify(data.service),
				success: (d,textStatus,xhr) => {
					data.status='success';
					data.message=`API ${data.steps[1].data.apiName} créé.`;
					data.saved=d;
					console.log("publishService");
					console.log(d);
					Actions.notify({title: data.service.basepath,message:data.message,level:'success'});
					this.trigger(data);
				},
				error: (x, t, m) => {
					data.status='danger';
					data.message=x.responseText;
					this.trigger(data);
				}
			});


		}else{
			$.ajax({
				url: `${agentUrl}${data.service.basepath}`,
				type: "POST",
				dataType: "text",
				data: JSON.stringify(data.service),
				success: (d,textStatus,xhr) => {
					data.status='success';
					data.message=`Service ${data.service.basepath} créé.`;
					Actions.notify({title: data.service.basepath,message:'Service créé.',level:'success'});
					this.trigger(data);
				},
				error: (x, t, m) => {
					data.status='danger';
					data.message=x.responseText;

					this.trigger(data);
				}
			});
		}
	},

	onSubmitStep: function(formData){
		//SERVICE
		switch(data.currentStep){
			case 0:
				data.steps[0].data.appName=formData.appName;
				data.steps[0].data.serviceName=formData.serviceName;
				data.steps[0].data.serviceVersion=formData.serviceVersion;
				//RECAP
				data.steps[0].recap=[{label:'Service',value:data.service.basepath}];

				//Init next Step
				data.steps[1].prev.basepath=`${formData.appName}_${formData.serviceName}_v${formData.serviceVersion}`;
				break;
			case 1:
				///STEP
				data.steps[1].data.apiName=formData.apiName;
				data.steps[1].data.apiUri=formData.apiUri;
				data.steps[1].data.apiMethod=formData.apiMethod;
				
				//RECAP
				data.steps[1].recap=[{label:'Méthode',value:formData.apiMethod},{label:'URI',value:formData.apiUri}];
				break;
			case 2:
				///STEP
				data.steps[2].data.responseType=formData.responseType;
				data.steps[2].data.delay=formData.delay;

				//RECAP
				data.steps[2].recap=[{label:'Delay',value:formData.delay+" ms"},{label:'Réponse format',value:formData.responseType}];
				break;
			case 3:
				data.steps[3].data.params=formData.params;

				break;
			case 4:
				data.steps[4].data.tps=formData.tps;
				var keys=[];
				
				keys=formData.tps.map(function(tp,index,array){
					if(tp.isKey){
						return tp.name;
					}
				}).filter(function(element){
					return element!=undefined;
				});
				
				data.steps[5].data.keys=keys;
				break;
			case 5:
				data.steps[5].data.keys=formData.keys;
				data.steps[5].data.regles=formData.regles;

				data.steps[5].recap=[{label:'Clé',value:formData.keys.join('.')}];

				if(!this.buildService()){
					this.trigger(data);
					return;
				}

				this.publishService();
				return;
		}
		
		data.steps[data.currentStep].active=false;
		data.steps[data.currentStep].complete=true;
		data.currentStep++;
		data.steps[data.currentStep].active=true;
		data.steps[data.currentStep].enable=true;

		this.trigger(data);
	},

	buildService:function(){
		var api;
		if(data.mode=='createService'){
			data.service=this.getNewService();
			api = this.getNewApi();
			api.name=data.steps[1].data.apiName;
			api.uri=data.steps[1].data.apiUri;
			api.operations[0].method=data.steps[1].data.apiMethod;
			api.operations[0].responseType=`text/${data.steps[2].data.responseType};charset=UTF-8`;
			api.operations[0].delay=parseInt(data.steps[2].data.delay);
			api.operations[0].parameters=data.steps[3].data.params;
			api.operations[0].transferProperties=data.steps[4].data.tps;
			api.operations[0].keys=data.steps[5].data.keys;
			api.operations[0].regExpKeys=data.steps[5].data.regles;
			
			data.service.apis.push(api);
		
			data.service.basepath=`${data.steps[0].data.appName}_${data.steps[0].data.serviceName}_v${data.steps[0].data.serviceVersion}`;
			
		}else{
			data.service=JSON.parse(JSON.stringify(data.selected));

			var apiNames = data.service.apis.map(function(val){return val.name;});
			if(apiNames.includes(data.steps[1].data.apiName)){
				data.status='error';
				data.message=`API ${data.steps[1].data.apiName} existe déjà.`;
				return false;
			}

			var apiUris = data.service.apis.map(function(val){return val.uri;});
			if(apiUris.includes(data.steps[1].data.apiUri)){
				data.status='error';
				data.message=`API URI ${data.steps[1].data.apiUri} existe déjà.`;
				return false;
			}
			
			api = this.getNewApi();
			api.name=data.steps[1].data.apiName;
			api.uri=data.steps[1].data.apiUri;
			api.operations[0].method=data.steps[1].data.apiMethod;
			api.operations[0].responseType=`text/${data.steps[2].data.responseType};charset=UTF-8`;
			api.operations[0].delay=parseInt(data.steps[2].data.delay);
			api.operations[0].parameters=data.steps[3].data.params;
			api.operations[0].transferProperties=data.steps[4].data.tps;
			api.operations[0].keys=data.steps[5].data.keys;
			api.operations[0].regExpKeys=data.steps[5].data.regles;
			

			data.service.apis.push(api);
			
		}
		return true;

	},

	getNewApi:function(){
		return {
			name:'default',
			uri:'/',
			operations:[{
				method:'POST',
				transferProperties:[],
				parameters:[],
				keys:[],
				regExpKeys:[],
				responseType:'text/xml;charset=UTF-8',
				delay:0
			}]
		};
	},

	getNewService:function(){
		return {
			basepath:'',
			state:'stopped',
			apis:[]
		};
	},


	getDefaultData: function(mode){
		
		data.status='';
		data.message='';
		data.mode=mode;

		data.steps=[
			{title:'Service',complete:false,active:true, enable:true,render:SE_Step_Service,data:{appName:'',serviceName:'',serviceVersion:''},recap:[]},
			{title:'API / Opération',complete:false,active:false,enable:false, render:SE_Step_API,data:{apiName:'',apiUri:'',apiMethod:'POST'},prev:{basepath:''},recap:[]},
			{title:'Propriétés',complete:false,active:false,enable:false, render:SE_Step_Prop,data:{responseType:'',delay:''},recap:[]},
			{title:'Paramètres',complete:false,active:false,enable:false, render:SE_Step_Param,data:{params:[]},recap:[]},
			{title:'Transferts',complete:false,active:false,enable:false, render:SE_Step_Transfert,data:{tps:[]},recap:[]},
			{title:'Clés et règles',complete:false,active:false,enable:false, render:SE_Step_Key,data:{keys:[],regles:[]},recap:[]}
		];

		if(mode=='addApi'){
			data.currentStep=1;
			data.steps[0].active=false;
			data.steps[0].enable=false;
			data.steps[1].active=true;
			data.steps[1].enable=true;
			data.steps[1].prev.basepath=data.selected.basepath;
		}else{
			data.currentStep=0;
		}

		return data;
	}
});


module.exports = ServiceCreatorStore;