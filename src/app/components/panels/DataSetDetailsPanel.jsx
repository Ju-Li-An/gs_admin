var React = require('react');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var DataSetsStore = require('../../stores/DataSetsStore.js');
var Panel = require('./Panel.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Data = require('../basic/Data.jsx');


var DataSetDetailsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(DataSetsStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = DataSetsStore.getDefaultData();
		return {
			dataset:data.selected.dataset,
			details:data.selected.details
		};
	},
	
	onStoreUpdate(data){
		this.setState({
			dataset:data.selected.dataset,
			details:data.selected.details
		});
	},

	addDataset(event){
		event.preventDefault();
	},

	showAddForm(event){
		this.setState({showAddForm:true});
	},

	handleCancelAdd(event){
		this.setState({showAddForm:false});
	},

	handleAddData(dataKey,dataValue){
		Actions.addData(dataKey,dataValue);
		this.setState({showAddForm:false});
	},

	handleEditData(oldDataKey,dataKey,dataValue){
		Actions.editData(oldDataKey,dataKey,dataValue);
	},

	handleDeleteData(dataKey){
		Actions.deleteData(dataKey);
	},
	
	render: function() {
		
		var details = this.state.details;
		
		if(details.data != undefined){
			var dataset=Object.keys(details.data).map(function (key) {
				var item={key:key,value:details.data[key]};
				return (
					<Data item={item} onEdit={this.handleEditData} onDelete={this.handleDeleteData}/>
				);
			},this);
		}

		if(this.state.showAddForm){
			var addForm = (<Data item={null} onCancelAdd={this.handleCancelAdd} onAdd={this.handleAddData} onEdit={this.handleEditData} />);
		}


		var linkAdd=(
			<div className="pull-right">
					<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.showAddForm}><Glyphicon glyph="plus" /></Button>
				</div>
		);

		var title="DataSet ["+this.state.dataset.value+"] Contenu ";
		
		return (
			<Panel title={title} links={null}>
				<table className="table table-condensed table-hover">
					<tbody>
						<tr> <th scope="row">template</th> <td>{details.template}</td></tr>
						<tr> <th scope="row">delay</th> <td>{details.delay}</td> </tr>
					</tbody>
				</table>
				<h5>Données {linkAdd} </h5>
				<table className="table table-condensed table-hover">
					<tbody>
						{dataset}
						{addForm}
					</tbody>
				</table>
			</Panel>
		);
  }
});

module.exports = DataSetDetailsPanel;