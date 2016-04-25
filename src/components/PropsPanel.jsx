var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var ApisStore = require('../stores/ApisStore.js');
var Panel = require('./Panel.jsx');

var PropsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ApisStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		return {
				responseType: '',
				delay:0,
				errorTemplate:'',
				regExpKeys:[]
			};
	},
	
	onStoreUpdate(data){
		this.setState({
				responseType: data.selected.responseType,
				delay:data.selected.delay,
				errorTemplate:data.selected.errorTemplate,
				regExpKeys:data.selected.regExpKeys
			});
	},

	render: function() {
		
		var links=(
			<div className="pull-right">
					<a href="#" className="pull-right btn-add" title="Editer les propriétés">
						<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
					</a>
				</div>
		);
		
		
		var regExps = this.state.regExpKeys.map((regExpKey,index,array)=>{
			return(
					<tr> 
						<th scope="row">RegExp n°{index}</th> 
						<td>{regExpKey.regle}</td> 
						<td>{regExpKey.target}</td> 
					</tr>
			);
		});
		
		
		return (
			<Panel title="Propriétés / Règles" links={links}>
					<div>
						<div><strong>Response Type: </strong>{this.state.responseType}</div>
						<div><strong>Delay: </strong>{this.state.delay} ms</div>
						<div><strong>Error Template: </strong>{this.state.errorTemplate}</div>
						<table className="table table-condensed">
							<tbody>
								{regExps}
							</tbody>
						</table>
					</div>
			</Panel>
		);
    }
});

module.exports = PropsPanel;