var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');
var AgentsStore = require('./AgentsStore.js');

let data = {
	services:[],
	selected:0,
	currentPage:1,
};

var ServicesStore = Reflux.createStore({

	init: function() {
		this.listenToMany(Actions);
        this.listenTo(AgentsStore, this.onAgentsStoreChange);
    },
	
	
	onAgentsStoreChange:function (storeData){
		if(storeData.selected===-1){
			return;
		}
		var agents = storeData.agents;
		var agent = agents[storeData.selected];
		
		//si le statut de l'agent est arrêté, on ne tente pas l'appel pour afficher les services
		if(!agent.status){
			return;
		}
		
		data.services=[];
		data.selected=-1;
		var count=0;
		$.ajax({
			url: 'http://'+agent.hostname+':'+agent.port+'/list',
			type: "GET",
			dataType: "json",
			success: (result) => {
				result.forEach((res,index,array) => {
					$.ajax({
						url: 'http://'+agent.hostname+':'+agent.port+'/'+res,
						type: "GET",
						dataType: "json",
						success: (srv) => {
							srv.id=count++;
							if(srv.state=='running'){
								srv.status=1;
								if(data.selected==-1)
									data.selected=srv.id;
							}
							else{
								srv.status=0;
							}
							data.services.push(srv);
							if(srv.id==array.length-1){
								this.trigger(data);
							}
						}
					});
				});
			},
			error: (x, t, m) => {
				Actions.disableAgent(agent.id);
			}
		});
	},
	
	onSelectService:function(id){
		data.selected=id;
		this.trigger(data);
	},
	
	getDefaultData(){
		return data;
	}
});

module.exports=ServicesStore;