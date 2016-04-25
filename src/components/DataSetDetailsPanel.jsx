var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var DataSetsStore = require('../stores/DataSetsStore.js');
var Panel = require('./Panel.jsx');

var DataSetDetailsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(DataSetsStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = DataSetsStore.getDefaultData();
		return {dataset:data.selected.dataset,parametres:data.selected.parametres};
	},
	
	onStoreUpdate(data){
		this.setState({dataset:data.selected.dataset,parametres:data.selected.parametres});
	},


	render: function() {
		
		var obj = this.state.parametres;
		var parameters;
		if(obj !=undefined){
			parameters=Object.keys(obj).map(function (key) {
				return (
					<tr> 
						<th scope="row">{key}</th> 
						<td>{obj[key]}</td>
					</tr>
				);
			});
		}

		var links=(
			<div className="pull-right">
					<a href="#" onClick={this.addDataset} className="pull-right btn-add" title="Ajouter un jdd">
						<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
					</a>
				</div>
		);
		
		var title="Detail - "+this.state.dataset.value;
		
		return (
			<Panel title={title} links={links}>
				<table className="table table-condensed table-hover">
					<tbody>
						{parameters}
					</tbody>
				</table>
			</Panel>
		);
  }
});

module.exports = DataSetDetailsPanel;