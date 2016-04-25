var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var ServicesStore = require('../stores/ServicesStore.js');
var Service = require('./Service.jsx');
var Panel = require('./Panel.jsx');
var Modal = require('./Modal.jsx');
var ServiceEditor = require('./ServiceEditor.jsx');

var ServicesPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ServicesStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = ServicesStore.getDefaultData();
		return {services: data.services, selected: data.selected, pages:data.pages, currentPage:data.currentPage,filter:data.filter};
	},
	
	onStoreUpdate(data){
		this.setState({services: data.services,selected:data.selected, pages:data.pages, currentPage:data.currentPage,filter:data.filter});
	},
	
	next:function(){
		Actions.refreshServicesList(this.state.currentPage+1);
	},
	
	previous:function(){
		Actions.refreshServicesList(this.state.currentPage-1);
	},
	
	addService:function(){

	},
	
	handleSearch:function(filter){
		Actions.changeServiceFilter(filter);
	},


	render: function() {
		var services = this.state.services.map(function(service,index,array) {
			return (
				<Service service={service} selected={service.basepath===this.state.selected.basepath}/>
			);
		},this);
		
		var linkPrevious;
		if(this.state.currentPage!=1){
			linkPrevious=(
					<a href="#" onClick={this.previous} className="btn-add" title="Précédent">
						<span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
					</a>
				);
		}
		
		var linkNext;
		if(this.state.currentPage!=this.state.pages){
			linkNext=(
				<a href="#" onClick={this.next} className="btn-add" title="Suivant">
						<span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
				</a>
			);
		}
		
		var linkAdd = (
			<button type="button" className="btn-glyph-only btn-xs" data-toggle="modal" data-target="#serviceEditor" aria-label="Nouveau Service">
				<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
			</button>
		);
		
		
		var links=(
			<div className="pull-right">
				{this.state.currentPage} / { this.state.pages}
				{ linkPrevious }
				{ linkNext }
				{ linkAdd }
			</div>
		);
		
		return (
			<Panel title="Services" links={links} search={this.handleSearch}>
				<div>
					<table className="table table-condensed table-hover">
						<tbody>
							{services}
						</tbody>
					</table>
					
					<Modal id='serviceEditor' title='Editeur de service'>
						<ServiceEditor/>
					</Modal>
				</div>
			
			</Panel>
		
		);
	
   }
});

module.exports = ServicesPanel;