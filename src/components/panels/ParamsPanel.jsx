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
		var data = ApisStore.getDefaultData();
		return {params: []};
	},
	
	onStoreUpdate(data){
		this.setState({params: data.selected.parameters});
	},
	
	//TODO
	addParam:function(event){
		event.preventDefault();
	},

	render: function() {
		var params = this.state.params.map(function(param,index,array) {
			return (
				<Param param={param} selected=''/>
			);
		},this);
		
		var links=(
			<div className="pull-right">
				<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.addParam}><Glyphicon glyph="plus" /></Button>
			</div>
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