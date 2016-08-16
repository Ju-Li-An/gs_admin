var React = require('react');
var ReactDOM = require('react-dom');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var ServicesStore = require('../../stores/ServicesStore.js');

const BASEPATH_DELIMITER='_';

var ServiceEditor = React.createClass({
	mixins: [
		Reflux.listenTo(ServicesStore, 'onStoreUpdate')
	],

	componentDidMount: function(){
		this.initValidator();
	},

	componentDidUpdate: function(){
		this.initValidator();
	},
	
	initValidator: function(){
		$('#serviceEditorForm').validator();
	},


	getInitialState: function() {
		return this.extractData(ServicesStore.getDefaultData().selected.basepath);
	},

	onStoreUpdate: function(data){
		this.setState(this.extractData(data.selected.basepath));
	},

	extractData: function(basepath){
		return {
			appName: basepath.split(BASEPATH_DELIMITER)[0],
			serviceName: basepath.split(BASEPATH_DELIMITER)[1],
			serviceVersion: basepath.split(BASEPATH_DELIMITER)[2].substring(1),
		};
	},

	getFormData: function(){
		var data={
			appName: ReactDOM.findDOMNode(this.refs.appName).value,
			serviceName: ReactDOM.findDOMNode(this.refs.serviceName).value,
			serviceVersion: ReactDOM.findDOMNode(this.refs.serviceVersion).value,
		};

		return data;
	},

	handleSubmit: function(event){
		event.preventDefault();
		var formData=this.getFormData();
		formData.serviceVersion=(formData.serviceVersion == null || formData.serviceVersion == undefined || formData.serviceVersion == '')? '0':formData.serviceVersion;
		Actions.editService(formData);
	},

	updateState:function(){
		this.setState(this.getFormData());
	},

	render:function(){
		return (
			<form id="serviceEditorForm" data-toggle="validator" role="form" action="" onSubmit={this.handleSubmit}>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor ="appName" className="control-label">Nom de l'application*</label>
					<input type="text" pattern="^[\w]{1,}$" className="form-control" id="appName" ref="appName" placeholder="APPLICATION" onChange={this.updateState} value={this.state.appName} required/>
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors"></div>
				</div>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor ="serviceName" className="control-label">Nom du service *</label>
					<input type="text" pattern="^[\w]{1,}$" className="form-control" id="serviceName"  ref="serviceName" placeholder="SERVICE" onChange={this.updateState} value={this.state.serviceName} required/>
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors"></div>
				</div>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor ="serviceVersion" className="control-label">Version du service</label>
					<input type="text" pattern="^[.-\d]*$" className="form-control" id="serviceVersion" ref="serviceVersion" placeholder="0" onChange={this.updateState} value={this.state.serviceVersion} />
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors"></div>
				</div>
				<div className="form-group">
					<button type="button" className="btn btn-default" onClick={this.props.onCancel}>Annuler</button>
					<button type="submit" className="btn btn-primary" ref="submitServiceEditorForm">Valider</button>
				</div>
			</form>
		);


	}

});

module.exports = ServiceEditor;