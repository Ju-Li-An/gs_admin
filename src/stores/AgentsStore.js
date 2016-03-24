var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');

let data = {
	agents: [{"id":0,"hostname":"localhost","port":"9080","status":1},
			{"id":1,"hostname":"localhost","port":"9081","status":0},
			{"id":2,"hostname":"10.44.208.85","port":"9080","status":1},
			{"id":3,"hostname":"10.44.208.85","port":"9081","status":1},
			{"id":4,"hostname":"10.44.208.85","port":"9081","status":1}],
	selected:-1,
	currentPage:1,
};

var AgentsStore = Reflux.createStore({
	listenables: Actions,
	
	onSelectAgent: function(agent){
		data.selected=agent;
		this.trigger(data);
	},
	
	
	onRefreshAgentList: function(){
		data.selected=-1;
		for(var index in data.agents){
			if(data.agents[index].status===1){
				data.selected=data.agents[index];
				break;
			}
		}
		this.trigger(data);
	},
	
	onDisableAgent: function(agent){
		data.agents[agent.id].status=0;
		this.onRefreshAgentList();
	},
	
	getDefaultData(){
		this.onRefreshAgentList();
		return data;
	}
});

module.exports = AgentsStore;