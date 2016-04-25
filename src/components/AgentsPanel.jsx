var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var AgentsStore = require('../stores/AgentsStore.js');
var Agent = require('./Agent.jsx');
var Panel =  require('./Panel.jsx');

var AgentsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(AgentsStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = AgentsStore.getDefaultData();
		return {agents: data.agents, selected: data.selected};
	},
	
	onStoreUpdate(data){
		this.setState({agents: data.agents,selected:data.selected} );
	},
	
	addAgent(){
	},
	
	refreshList(){
		Actions.refreshAgentList();
	},
	
	render: function() {
		var agents = this.state.agents.map(function(agent,index,array) {
			return (
				<Agent agent={agent} selected={agent.id==this.state.selected.id}/>
			);
		},this);
		
		var links=(
			<div className="pull-right">
				<a href="#" onClick={this.refreshList} className="btn-add" title="Actualiser la liste">
					<span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
				</a>

				<a href="#" onClick={this.addAgent} className="btn-add" title="Ajouter un agent">
					<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
				</a>
			</div>
		);
		
		return (
			<Panel title="GeneSiS Agents" links={links}>
				<table className="table table-condensed table-hover">
					<tbody>
						{agents}
					</tbody>
				</table>
			</Panel>
		);
    }
});

module.exports = AgentsPanel;