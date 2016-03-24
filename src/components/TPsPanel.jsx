var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var ApisStore = require('../stores/ApisStore.js');
var TP = require('./TP.jsx');
var Panel = require('./Panel.jsx');

var TPsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ApisStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = ApisStore.getDefaultData();
		return {tps: [],keys:[]};
	},
	
	onStoreUpdate(data){
		this.setState({tps: data.selected.transferProperties,keys:data.selected.keys});
	},
	
	addTp:function(){
	
	},

	render: function() {
		var tps = this.state.tps.map(function(tp,index,array) {
			var tpKey=0;
			for(var idKey in this.state.keys){
				if(this.state.keys[idKey].name == tp.name){
					tpKey=1;
					break;
				}
			}
			return (
				<TP tp={tp} isKey={tpKey}/>
			);
		},this);
	
		var links=(
			<a href="#" onClick={this.addTp} className="pull-right btn-add" title="Ajouter une Transfert Property">
				<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
			</a>
		);
		
		return (
			<Panel title="Transfert(s)" links={links}>
				<table className="table table-condensed table-hover">
					<tbody>
						{tps}
					</tbody>
				</table>
			</Panel>
		);
    }
});

module.exports = TPsPanel;