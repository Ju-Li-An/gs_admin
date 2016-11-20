var React = require('react');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var ApisStore = require('../../stores/ApisStore.js');
var Param = require('../basic/Param.jsx');
var Panel = require('./Panel.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var ParamsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ApisStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		return {params: []};
	},
	
	onStoreUpdate(data){
		if(data.selected===-1)
			this.setState({params: [],tpNames: [],showAddForm:this.state.showAddForm});
		else
			this.setState({
				params: data.selected.operation.parameters,
				tpNames:data.selected.operation.transferProperties.map(function(val){
					return val.name;
				}),
				showAddForm:this.state.showAddForm
			});
	},
	
	showAddParam(event){
		this.setState({params: this.state.params,
			tpNames:this.state.tpNames,
			showAddForm:true});
	},

	handleCancelAdd(event){
		this.setState({params: this.state.params,
			tpNames:this.state.tpNames,
			showAddForm:false});
	},

	handleAddParam(param){
		Actions.addParam(param);
		this.setState({params: this.state.params,
			tpNames:this.state.tpNames,
			showAddForm:false});
	},

	handleEditParam(origin,nouveau){
		Actions.editParam(origin,nouveau);
	},

	handleDeleteParam(param){
		Actions.deleteParam(param);
	},

			
	render: function() {
		var params = this.state.params.map(function(param,index,array) {
			return (
				<Param param={param} tpNames={this.state.tpNames} onEdit={this.handleEditParam} onDelete={this.handleDeleteParam} className={this.state.params.length>1?"tdEdit":""}/>
			);
		},this);
		
		var links=(
			<div className="pull-right">
				<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.showAddParam}><Glyphicon glyph="plus" /></Button>
			</div>
		);

		if(this.state.showAddForm){
			var addParamForm = (<Param param={null} tpNames={this.state.tpNames} onCancelAdd={this.handleCancelAdd} onAdd={this.handleAddParam} onDelete={this.handleDeleteParam} onEdit={this.handleEditParam} className={this.state.params.length>1?"tdEdit":""}/>);
		}
	
		return (
			<Panel title="Paramètre(s)" links={links}>
				<table className="table table-condensed table-hover">
					<tbody>
						{params}
						{addParamForm}
					</tbody>
				</table>
			</Panel>
		);
    }
});

module.exports = ParamsPanel;