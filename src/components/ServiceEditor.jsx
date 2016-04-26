var React = require('react');
var ReactDOM = require('react-dom');
var Actions = require('../actions/Actions.js');


var ServiceEditor = React.createClass({

	getInitialState: function() {
		return {type: '', message: ''};
	},
	

	handleSubmit:function(event){
		event.preventDefault();
		var formData = {
			appName: ReactDOM.findDOMNode(this.refs.appName).value,
			serviceName: ReactDOM.findDOMNode(this.refs.serviceName).value,
			serviceVersion: ReactDOM.findDOMNode(this.refs.serviceVersion).value
		};
		console.log(formData);
		this.setState({type: 'info', message: 'Sending...'});
		Actions.submitService(formData);
		
	},

	componentDidMount(){
		this.initValidator();
	},
	
	componentWillUnmount(){
		ReactDOM.findDOMNode(this.refs.appName).value='';
		ReactDOM.findDOMNode(this.refs.serviceName).value='';
		ReactDOM.findDOMNode(this.refs.serviceVersion).value='';
	},
	
	componentDidUpdate(){
		this.initValidator();
	},
	
	initValidator(){
		var form= $('#serviceEditorForm').validator();
	},
	
	render: function() {
	
		if (this.state.type && this.state.message) {
			var classString = 'alert alert-' + this.state.type;
			var status = (
									<div id="status" className={classString} ref="status">
									 {this.state.message}
									</div>
			);
		}
	
		return (
			<div>
				{status}
				<form id="serviceEditorForm" data-toggle="validator" role="form" action="" onSubmit={this.handleSubmit}>
					<div className="form-group form-group-sm has-feedback">
						<label htmlFor ="appName" className="control-label">Nom de l'application *</label>
						<input type="text" className="form-control" id="appName" ref="appName" placeholder="" required/>
						<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
						<div className="help-block with-errors"></div>
					</div>
					<div className="form-group form-group-sm has-feedback">
						<label htmlFor ="serviceName" className="control-label">Nom du service *</label>
						<input type="text" className="form-control" id="serviceName"  ref="serviceName" placeholder="" required/>
						<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
						<div className="help-block with-errors"></div>
					</div>
					<div className="form-group form-group-sm has-feedback">
						<label htmlFor ="serviceVersion" className="control-label">Version du service *</label>
						<input type="text" className="form-control" id="serviceVersion"  ref="serviceVersion" placeholder="" required/>
						<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
						<div className="help-block with-errors"></div>
					</div>
					<h4> API </h4>
					<div className="form-group form-group-sm has-feedback">
						<label htmlFor ="apiName" className="control-label">Nom de l'API/ opération</label>
						<input type="text" className="form-control" id="apiName"  ref="apiName" placeholder="default"/>
						<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
						<div className="help-block with-errors"></div>
					</div>
					<div className="form-group form-group-sm has-feedback">
						<label htmlFor ="apiUri" className="control-label">URI</label>
						<input type="text" className="form-control" id="apiUri"  ref="apiUri" placeholder="/"/>
						<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
						<div className="help-block with-errors">Vous pouvez définir une URI pour cette opération. Ainsi plusieurs URI pourront être servie par votre service.</div>
					</div>
					<div className="form-group form-group-sm has-feedback">
						<label htmlFor ="apiMethod" className="control-label">Méthode</label>
						<select className="form-control" id="apiMethod" ref="apiMethod">
							<option>POST</option>
							<option>GET</option>
							<option>PUT</option>
							<option>DELETE</option>
							<option>HEAD</option>
							<option>OPTIONS</option>
							<option>TRACE</option>
							<option>CONNECT</option>
						</select>
						<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
						<div className="help-block with-errors"></div>
					</div>
					<div className="form-group">
						<button type="submit" className="btn btn-primary" ref="submitServiceEditorForm">Valider</button>
					</div>
				</form>
			</div>
		);
	}
});

module.exports = ServiceEditor;