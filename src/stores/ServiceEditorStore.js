var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var SE_Step_Service = require('../components/editors/steps/SE_Step_Service.jsx');
var SE_Step_API = require('../components/editors/steps/SE_Step_API.jsx');
var SE_Step_Prop = require('../components/editors/steps/SE_Step_Prop.jsx');
var SE_Step_Param = require('../components/editors/steps/SE_Step_Param.jsx');
var SE_Step_Transfert = require('../components/editors/steps/SE_Step_Transfert.jsx');
var SE_Step_Key = require('../components/editors/steps/SE_Step_Key.jsx');

let data = {
	service:{},
	steps:[],
	currentStep:0
};

var ServiceEditorStore = Reflux.createStore({
	listenables: Actions,
	
	onCreateService: function(agent){
		this.trigger(this.getDefaultData(agent));
	},

	onEditService: function(service){
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

		// Récupération de la liste des Services
		$.ajax({
			url: `${agentUrl}${data.service.basepath}`,
			type: "POST",
			dataType: "text",
			data: JSON.stringify(data.service),
			success: (d,textStatus,xhr) => {
				data.status='success';
				data.message=`Service ${data.service.basepath} créé.`;
				console.log("AJAX OK");
				this.trigger(data);
			},
			error: (x, t, m) => {
				data.status='danger';
				data.message=x.responseText;
				this.trigger(data);
			}
		});
	},

	onSubmitStep: function(formData){
		//SERVICE
		switch(data.currentStep){
			case 0:
				data.steps[0].data.appName=formData.appName;
				data.steps[0].data.serviceName=formData.serviceName;
				data.steps[0].data.serviceVersion=formData.serviceVersion;
				//SERVICE
				data.service.basepath=`${formData.appName}_${formData.serviceName}_v${formData.serviceVersion}`;
				//RECAP
				data.steps[0].recap=[{label:'Service',value:data.service.basepath}];

				//Init next Step
				data.steps[1].prev.basepath=data.service.basepath;
				break;
			case 1:
				///STEP
				data.steps[1].data.apiName=formData.apiName;
				data.steps[1].data.apiUri=formData.apiUri;
				data.steps[1].data.apiMethod=formData.apiMethod;
				//SERVICE
				data.service.apis[0].name=formData.apiName;
				data.service.apis[0].uri=formData.apiUri;
				data.service.apis[0].operations[0].method=formData.apiMethod;
				//RECAP
				data.steps[1].recap=[{label:'Méthode',value:formData.apiMethod},{label:'URI',value:formData.apiUri}];
				break;
			case 2:
				///STEP
				data.steps[2].data.responseType=formData.responseType;
				data.steps[2].data.delay=formData.delay;
				//SERVICE
				data.service.apis[0].operations[0].responseType=`text/${formData.responseType};charset=UTF-8`;
				data.service.apis[0].operations[0].delay=formData.delay;
				//RECAP
				data.steps[2].recap=[{label:'Delay',value:formData.delay+" ms"},{label:'Réponse format',value:formData.responseType}];
				break;
			case 3:
				data.steps[3].data.params=formData.params;

				data.service.apis[0].operations[0].parameters=formData.params;
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

				data.service.apis[0].operations[0].transferProperties=formData.tps;
				break;
			case 5:
				data.steps[5].data.keys=formData.keys;
				data.steps[5].data.regles=formData.regles;

				data.service.apis[0].operations[0].keys=formData.keys;
				data.service.apis[0].operations[0].regExpKeys=formData.regles;
				data.steps[5].recap=[{label:'Clé',value:formData.keys.join('.')}];

				this.publishService();
				return;
		}
		
		data.steps[data.currentStep].active=false;
		data.steps[data.currentStep].complete=true;
		data.currentStep++;
		data.steps[data.currentStep].active=true;
		data.steps[data.currentStep].enable=true;
		console.log("NEXT STEP");
		this.trigger(data);
	},

	getDefaultData: function(agent){
		data.agent=agent;
		
		data.status='';
		data.message='';

		data.steps=[
			{title:'Service',complete:false,active:true, enable:true,render:SE_Step_Service,data:{appName:'',serviceName:'',serviceVersion:''},recap:[]},
			{title:'API / Opération',complete:false,active:false,enable:false, render:SE_Step_API,data:{apiName:'',apiUri:'',apiMethod:'POST'},prev:{basepath:''},recap:[]},
			{title:'Propriétés',complete:false,active:false,enable:false, render:SE_Step_Prop,data:{responseType:'',delay:''},recap:[]},
			{title:'Paramètres',complete:false,active:false,enable:false, render:SE_Step_Param,data:{params:[]},recap:[]},
			{title:'Transferts',complete:false,active:false,enable:false, render:SE_Step_Transfert,data:{tps:[]},recap:[]},
			{title:'Clés et règles',complete:false,active:false,enable:false, render:SE_Step_Key,data:{keys:[],regles:[]},recap:[]}
		];

		data.currentStep=0;

		data.service={
			basepath:'',
			state:'stopped',
			apis:[{
				name:'default',
				uri:'/',
				operations:[{
					method:'POST',
					transferProperties:[],
					parameters:[],
					keys:[],
					regExpKeys:[],
					responseType:'text/xml;charset=UTF-8',
					delay:'0'
				}]
			}]
		};

		return data;
	}
});


module.exports = ServiceEditorStore;