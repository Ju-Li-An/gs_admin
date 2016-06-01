var React = require('react');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var ServicesStore = require('../../stores/ServicesStore.js');
var Service = require('../basic/Service.jsx');
var Panel = require('./Panel.jsx');
//var Modal = require('./Modal.jsx');
var ServiceEditor = require('../editors/ServiceEditor.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;


var ServicesPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ServicesStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = ServicesStore.getDefaultData();
		return {services: data.services, selected: data.selected, pages:data.pages, currentPage:data.currentPage,filter:data.filter,showEditor: false, agent:data.agent};
	},
	
	onStoreUpdate: function(data){
		this.setState({services: data.services,selected:data.selected, pages:data.pages, currentPage:data.currentPage,filter:data.filter, agent:data.agent});
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
	
	openEditor: function() {
		Actions.createService(this.state.agent);
    	this.setState({ showEditor: true });
  	},

	closeEditor: function() {
    	this.setState({ showEditor: false });
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
				<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.previous}><Glyphicon glyph="menu-left" /></Button>
				);
		}
		
		var linkNext;
		if(this.state.currentPage!=this.state.pages){
			linkNext=(
				<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.next}><Glyphicon glyph="menu-right" /></Button>
			);
		}
		
		var linkAdd = (
			<Button bsStyle="add" bsSize="xsmall" onClick={this.openEditor}><Glyphicon glyph="plus" /></Button>
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
					<ServiceEditor show={this.state.showEditor} agent={this.state.agent} onCancel={this.closeEditor} agent={this.state.agent} />
				</div>
			</Panel>
		
		);
	
   }
});

module.exports = ServicesPanel;