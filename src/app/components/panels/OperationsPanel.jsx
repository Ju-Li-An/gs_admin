var React = require('react');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var ApisStore = require('../../stores/ApisStore.js');
var Operation = require('../basic/Operation.jsx');
var Panel = require('./Panel.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var OperationsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ApisStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = ApisStore.getDefaultData();

		return {operations: data.selected!=-1?data.selected.api.operations:[], selected: data.selected.operation,showAddForm:false};
	},
	
	onStoreUpdate(data){
		this.setState({operations: data.selected.api.operations,selected:data.selected.operation,showAddForm:this.state.showAddForm});
	},
	
	
	showAddOpe(event){
		this.setState({operations: this.state.operations,selected:this.state.selected,showAddForm:true});
	},

	handleAddOpe(operation){
		Actions.addOperation(operation);
		this.setState({operations: this.state.operations,selected:this.state.selected,showAddForm:false});
	},

	
	handleCancelAdd(event){
		this.setState({operations: this.state.operations,selected:this.state.selected,showAddForm:false});
	},
	

	render: function() {
		var operations = this.state.operations.map(function(operation,index,array) {
			return (
				<Operation data={operation} selected={(operation.method==this.state.selected.method)} />
			);
		},this);

		if(this.state.showAddForm){
			var addForm = (<Operation data={null} selected={false} onCancelAdd={this.handleCancelAdd} onAdd={this.handleAddOpe}/>);
		}
	
		var links=(
			<div className="pull-right">
					<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.showAddOpe}><Glyphicon glyph="plus" /></Button>
			</div>
		);
		
		return (
			<Panel title="Opérations" links={links}>
				<table className="table table-condensed table-hover">
					<tbody>
						{operations}
						{addForm}
					</tbody>
				</table>
			</Panel>
		);
    }
});

module.exports = OperationsPanel;