var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var ApisStore = require('../stores/ApisStore.js');
var Param = require('./Param.jsx');
var Panel = require('./Panel.jsx');

var ParamsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ApisStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = ApisStore.getDefaultData();
		return {params: []};
	},
	
	onStoreUpdate(data){
		this.setState({params: data.selected.parameters});
	},
	
	addParam:function(){
	
	},

	render: function() {
		var params = this.state.params.map(function(param,index,array) {
			return (
				<Param param={param} selected=''/>
			);
		},this);
		
		var links=(
			<a href="#" onClick={this.addParam} className="pull-right btn-add" title="Ajouter un paramètre">
				<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
			</a>
		);
		
		
		return (
			<Panel title="Paramètre(s)" links={links}>
				<table className="table table-condensed table-hover">
					<tbody>
						{params}
					</tbody>
				</table>
			</Panel>
		);
    }
});

module.exports = ParamsPanel;