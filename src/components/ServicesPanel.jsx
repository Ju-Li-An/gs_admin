var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var ServicesStore = require('../stores/ServicesStore.js');
var Service = require('./Service.jsx');
var Panel = require('./Panel.jsx');
//var Modal = require('./Modal.jsx');
var ServiceEditor = require('./ServiceEditor.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Modal = require('react-bootstrap').Modal;

var ServicesPanel = React.createClass({
	mixins: [
			Reflux.listenTo(ServicesStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = ServicesStore.getDefaultData();
		return {services: data.services, selected: data.selected, pages:data.pages, currentPage:data.currentPage,filter:data.filter,showModal: false};
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
	
	openEditor() {
    this.setState({ showModal: true });
  },

	closeEditor() {
    this.setState({ showModal: false });
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
					
					<Modal bsSize="lg" show={this.state.showModal} onHide={this.closeEditor}>
						<Modal.Header closeButton>
							<Modal.Title>Editeur de service</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<ServiceEditor/>
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={this.closeEditor}>Close</Button>
						</Modal.Footer>
					</Modal>
					
				</div>
			
			</Panel>
		
		);
	
   }
});

module.exports = ServicesPanel;