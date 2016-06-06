var React = require('react');
var ReactDOM = require('react-dom');
var Actions = require('../../../actions/Actions.js');

var SE_Step_API = React.createClass({

	getInitialState: function() {
		var agentUrl = `${this.props.agent.hostname}:${this.props.agent.port}`;
		var formData = this.props.data;
		return {
			agentUrl: agentUrl, 
			formData:formData,
			serviceUri: `http://${agentUrl}/${this.props.prev.basepath}${formData.apiUri}`
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
			apiName: ReactDOM.findDOMNode(this.refs.apiName).value,
			apiUri: ReactDOM.findDOMNode(this.refs.apiUri).value,
			apiMethod: ReactDOM.findDOMNode(this.refs.apiMethod).value
		};

		return data;
	},

	updateState:function(){
		var formData = this.getFormData();
		
		this.setState({serviceUri:`http://${this.state.agentUrl}/${this.props.prev.basepath}${formData.apiUri}`,formData:formData});
	},

	
	handleSubmit: function(event){
		event.preventDefault();
		var formData=this.getFormData();
		formData.apiName=(formData.apiName == null || formData.apiName == undefined || formData.apiName == '')? 'default': formData.apiName;
		formData.apiUri=(formData.apiUri == null || formData.apiUri == undefined || formData.apiUri == '')? '/': formData.apiUri;
		Actions.submitStep(formData);
	},

	render: function() {
		return (
			<form id="serviceEditorForm" data-toggle="validator" role="form" action="" onSubmit={this.handleSubmit}>
				<h4><small>Votre service:</small> {this.state.serviceUri}</h4>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor ="apiName" className="control-label">Nom de l'API / opération</label>
					<input type="text" pattern="^[\w_]*$" className="form-control" id="apiName"  ref="apiName" placeholder="default" value={this.state.formData.apiName} onChange={this.updateState}/>
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors"></div>
				</div>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor ="apiUri" className="control-label">URI</label>
					<input type="text" pattern="^[/.{}_&'()^@?=+[\]\#A-z0-9]*$" className="form-control" id="apiUri" ref="apiUri" placeholder="/" value={this.state.formData.apiUri}  onChange={this.updateState} />
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors">Vous pouvez définir une URI pour cette opération. Ainsi plusieurs URI pourront être servie par votre service.</div>
				</div>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor="apiMethod" className="control-label">Méthode</label>
					<select className="form-control" id="apiMethod" ref="apiMethod" onChange={this.updateState} value={this.state.formData.apiMethod} >
						<option value="POST">POST</option>
						<option value="GET">GET</option>
						<option value="PUT">PUT</option>
						<option value="DELETE">DELETE</option>
						<option value="HEAD">HEAD</option>
						<option value="OPTIONS">OPTIONS</option>
						<option value="TRACE">TRACE</option>
						<option value="CONNECT">CONNECT</option>
					</select>
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

module.exports = SE_Step_API;