var React = require('react');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var ApisStore = require('../../stores/ApisStore.js');
var TP = require('../basic/TP.jsx');
var Panel = require('./Panel.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var TPsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ApisStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = ApisStore.getDefaultData();
		return {tps: [],keys:[],showAddForm:false};
	},
	
	onStoreUpdate(data){
		if(data.selected===-1)
			this.setState({tps: [],keys:[],showAddForm:this.state.showAddForm});
		else
			this.setState({tps: data.selected.operation.transferProperties,keys:data.selected.operation.keys,showAddForm:this.state.showAddForm});
	},

	showAddTp(event){
		this.setState({tps: this.state.tps,keys:this.state.keys,showAddForm:true});
	},

	handleCancelAdd(event){
		this.setState({tps: this.state.tps,keys:this.state.keys,showAddForm:false});
	},

	handleAddTp(tp){
		Actions.addTp(tp);
		this.setState({tps: this.state.tps,keys:this.state.keys,showAddForm:false});
	},


	render: function() {
		var title="Transfert(s) - key: ";
		
		// Peut être optimisé en inversant la recherche des clés.
		var tps = this.state.tps.map(function(tp,index,array) {
			
			var tpKey=0;
			/*if(this.state.keys.includes(tp.name)){
				if(title.length>0)
					title+='.'
				tpKey=1;
				title+=tp.name;
			}*/
			for(var idKey in this.state.keys){
				if(this.state.keys[idKey] == tp.name){
					if(title.length>0)
						title+='.'
					tpKey=1;
					title+=tp.name;
					break;
				}
			}
			return (
				<TP tp={tp} isKey={tpKey}/>
			);
		},this);

		if(this.state.showAddForm){
			var addForm = (<TP tp={null} isKey={null} onCancelAdd={this.handleCancelAdd} onAdd={this.handleAddTp}/>);
		}
	
		var links=(
			<div className="pull-right">
					<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.showAddTp}><Glyphicon glyph="plus" /></Button>
			</div>
		);
		
		return (
			<Panel title={title} links={links}>
				<table className="table table-condensed table-hover">
					<tbody>
						{tps}
						{addForm}
					</tbody>
				</table>
			</Panel>
		);
    }
});

module.exports = TPsPanel;