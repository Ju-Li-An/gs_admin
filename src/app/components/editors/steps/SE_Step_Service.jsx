var React = require('react');
var ReactDOM = require('react-dom');
var Actions = require('../../../actions/Actions.js');

var SE_Step_Service = React.createClass({

	getInitialState: function() {
		var agentUrl = `${this.props.agent.hostname}:${this.props.agent.port}`;
		var formData = this.props.data;

		return {
			agentUrl: agentUrl, 
			serviceUri: `http://${agentUrl}/${this.getBasePath(formData)}`,
			formData: formData
		};
	},

	componentDidMount: function(){
		this.initValidator();
	},

	componentDidUpdate: function(){
		this.initValidator();
	},
	
	initValidator: function(){
		$('#serviceEditorForm').validator();
	},

	getFormData: function(){
		var data={
			appName: ReactDOM.findDOMNode(this.refs.appName).value,
			serviceName: ReactDOM.findDOMNode(this.refs.serviceName).value,
			serviceVersion: ReactDOM.findDOMNode(this.refs.serviceVersion).value,
		};

		return data;
	},


	updateState:function(){
		var formData = this.getFormData();
		var serviceUri = this.getBasePath(formData);
		this.setState({serviceUri:`http://${this.state.agentUrl}/${serviceUri}`,formData:formData});
	},

	getBasePath: function(formData){
		var basepath;
		(formData.appName == null || formData.appName == undefined || formData.appName == '')? basepath='[APPLI]':basepath=formData.appName;
		(formData.serviceName == null || formData.serviceName == undefined || formData.serviceName == '')? basepath+='_[SERVICE]':basepath+='_'+formData.serviceName;
		(formData.serviceVersion == null || formData.serviceVersion == undefined || formData.serviceVersion == '')? basepath+='_v0':basepath+='_v'+formData.serviceVersion;

		return basepath;
	},

	handleSubmit: function(event){
		event.preventDefault();
		var formData=this.getFormData();
		formData.serviceVersion=(formData.serviceVersion == null || formData.serviceVersion == undefined || formData.serviceVersion == '')? '0':formData.serviceVersion;
		Actions.submitStep(formData);
	},

	render: function() {
		return (
			<form id="serviceEditorForm" data-toggle="validator" role="form" action="" onSubmit={this.handleSubmit}>
				<h4><small>Votre service:</small> {this.state.serviceUri}</h4>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor ="appName" className="control-label">Nom de l'application*</label>
					<input type="text" pattern="^[\w]{1,}$" className="form-control" id="appName" ref="appName" placeholder="APPLICATION" onChange={this.updateState} value={this.state.formData.appName} required/>
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors"></div>
				</div>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor ="serviceName" className="control-label">Nom du service *</label>
					<input type="text" pattern="^[\w]{1,}$" className="form-control" id="serviceName"  ref="serviceName" placeholder="SERVICE" onChange={this.updateState} value={this.state.formData.serviceName} required/>
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors"></div>
				</div>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor ="serviceVersion" className="control-label">Version du service</label>
					<input type="text" pattern="^[.-\d]*$" className="form-control" id="serviceVersion" ref="serviceVersion" placeholder="0" onChange={this.updateState} value={this.state.formData.serviceVersion} />
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors"></div>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-primary" ref="submitServiceEditorForm">Valider & Continuer</button>
				</div>
			</form>
		);
    }
});

module.exports = SE_Step_Service;