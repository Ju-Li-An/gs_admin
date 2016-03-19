var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var ServicesStore = require('../stores/ServicesStore.js');
var Service = require('./Service.jsx');
var Panel = require('./Panel.jsx');

var ServicesPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ServicesStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = ServicesStore.getDefaultData();
		return {services: data.services, selected: data.selected};
	},
	
	onStoreUpdate(data){
		this.setState({services: data.services,selected:data.selected});
	},


	render: function() {
		var services = this.state.services.map(function(service,index,array) {
			return (
				<Service service={service} selected={index==this.state.selected}/>
			);
		},this);
		
		var links=(
			<a href="#" onClick={this.addService} className="pull-right btn-add" title="Ajouter un service">
				<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
			</a>
		);
		
		return (
			<Panel title="Services" links={links}>
				<table className="table table-condensed table-hover">
					<tbody>
						{services}
					</tbody>
				</table>
			</Panel>
		);
    }
});

module.exports = ServicesPanel;