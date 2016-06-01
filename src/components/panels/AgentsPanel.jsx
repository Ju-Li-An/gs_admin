var React = require('react');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var AgentsStore = require('../../stores/AgentsStore.js');
var Agent = require('../basic/Agent.jsx');
var Panel =  require('./Panel.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;


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
	
	addAgent(event){
		event.preventDefault();
	},
	
	refreshList(event){
		event.preventDefault();
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
				<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.refreshList}><Glyphicon glyph="refresh" /></Button>
				<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.addAgent}><Glyphicon glyph="plus" /></Button>
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