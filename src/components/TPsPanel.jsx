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
		var title="Transfert(s) - key: ";
		
		// Peut être optimisé en inversant la recherche des clés.
		var tps = this.state.tps.map(function(tp,index,array) {
			
			var tpKey=0;
			for(var idKey in this.state.keys){
				if(this.state.keys[idKey].name == tp.name){
					tpKey=1;
					title+=tp.name+".";
					break;
				}
			}
			return (
				<TP tp={tp} isKey={tpKey}/>
			);
		},this);
	
		var links=(
			<div className="pull-right">
					<a href="#" onClick={this.addTp} className="pull-right btn-add" title="Ajouter une Transfert Property">
						<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
					</a>
			</div>
		);
		
		return (
			<Panel title={title} links={links}>
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