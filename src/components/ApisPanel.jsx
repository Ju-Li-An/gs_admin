var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var ApisStore = require('../stores/ApisStore.js');
var Api = require('./Api.jsx');
var Panel = require('./Panel.jsx');

var ApisPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ApisStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = ApisStore.getDefaultData();
		return {apis: data.apis, selected: data.selected};
	},
	
	onStoreUpdate(data){
		this.setState({apis: data.apis,selected:data.selected});
	},


	render: function() {
		var apis = this.state.apis.map(function(api,index,array) {
			return (
				<Api api={api} selected={api.name==this.state.selected.name}/>
			);
		},this);
	
		var links=(
			<div className="pull-right">
					<a href="#" onClick={this.addApi} className="pull-right btn-add" title="Ajouter une API / Opération">
						<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
					</a>
			</div>
		);
		
		
		return (
			<Panel title="Apis / Opérations" links={links}>
				<table className="table table-condensed table-hover">
					<tbody>
						{apis}
					</tbody>
				</table>
			</Panel>
		);
    }
});

module.exports = ApisPanel;