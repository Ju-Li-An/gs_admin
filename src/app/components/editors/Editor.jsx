var React = require('react');
var Reflux = require('reflux');
var Modal = require('react-bootstrap').Modal;
var EditorStore = require('../../stores/EditorStore.js');
var ServiceCreator = require('./ServiceCreator.jsx');
var Actions = require('../../actions/Actions.js');

var Editor = React.createClass({

	mixins: [
			Reflux.listenTo(EditorStore, 'onStoreUpdate')
	],


	getInitialState:function(){
		return EditorStore.getDefaultData();
	},

	onStoreUpdate:function(data){
		this.setState(data);
	},

	closeEditor:function(event){
		if(event)
			event.preventDefault();
		Actions.closeEditor();
	},

	getModalContent:function(){
		switch (this.state.type){
			case 'serviceCreator':
				return (<ServiceCreator agent={this.state.agent} onCancel={this.closeEditor} mode='createService'/>);
				break;
			case 'apiCreator':
				return (<ServiceCreator agent={this.state.agent} onCancel={this.closeEditor} mode='addApi'/>);
				break;
		}
		return;
	},

	
	render: function() {

		var content=this.getModalContent();

		return (
			<Modal bsSize={this.state.size} show={this.state.show} onHide={this.closeEditor}>
				<Modal.Header closeButton>
					<Modal.Title>{this.state.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{content}
				</Modal.Body>
			</Modal>
		);
    }
});

module.exports = Editor;