var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');

let data = {
	agents: [],
	selected:-1,
	currentPage:1,
};

var AgentsStore = Reflux.createStore({
	listenables: Actions,
	
	onSelectAgent: function(agent){
		data.selected=agent;
		this.trigger(data);
	},
	
	onDeleteAgent:function(agent){
		if(data.selected.hostname==agent.hostname && data.selected.port==agent.port){
			data.selected=-1;
		}
		$.ajax({
			url: `http://localhost:3000/agent`,
			type: "DELETE",
			dataType: "json",
			data: agent,
			success: (d,textStatus,xhr) => {
				data.agents=d;
				this.refreshSelected();
			},
			error: (x, t, m) => {
				Actions.notify({title: 'Error',message:'Impossible de supprimer un agent.',level:'error'});
			}
		});
	},
	
	onRefreshAgentList: function(){
		data.selected=-1;

		$.ajax({
			url: `http://localhost:3000/agents`,
			type: "GET",
			dataType: "json",
			success: (d,textStatus,xhr) => {
				data.agents=d;
				this.refreshSelected();
			},
			error: (x, t, m) => {
				Actions.notify({title: 'Error',message:'Impossible de récupérer la liste des agents.',level:'error'});
			}
		});

		
	},

	refreshSelected:function(){
		if(data.selected==-1){
			for(var index in data.agents){
				if(data.agents[index].status===1){
					data.selected=data.agents[index];
					break;
				}
			}
		}
		this.trigger(data);
	},
	
	onDisableAgent: function(agent){
		console.log(agent);
		if(data.selected.hostname==agent.hostname && data.selected.port==agent.port){
			data.selected=-1;
		}
		$.ajax({
			url: `http://localhost:3000/agent/disable`,
			type: "PUT",
			dataType: "json",
			data: agent,
			success: (d,textStatus,xhr) => {
				data.agents=d;
				this.refreshSelected();
			},
			error: (x, t, m) => {
				Actions.notify({title: 'Error',message:`Impossible d'inactiver l'agent ${agent.hostname}:${agent.port}`,level:'error'});
			}
		});
	},
	
	getDefaultData(){
		this.onRefreshAgentList();
		return data;
	}
});

module.exports = AgentsStore;