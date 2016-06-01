var React = require('react');
var ReactDOM = require('react-dom');
var Actions = require('../../../actions/Actions.js');

var SE_Step_Prop = React.createClass({

	getInitialState: function() {
		var formData = this.props.data;
		return { 
			formData:formData
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
			responseType: ReactDOM.findDOMNode(this.refs.responseType).value,
			delay: ReactDOM.findDOMNode(this.refs.delay).value
		};

		return data;
	},

	updateState:function(){
		var formData = this.getFormData();
		
		this.setState({formData:formData});
	},


	handleSubmit: function(event){
		event.preventDefault();
		var formData=this.getFormData();
		formData.delay=(formData.delay == null || formData.delay == undefined || formData.delay == '')? '0': formData.delay;
		Actions.submitStep(formData);
	},

	render: function() {
		return (
			<form id="serviceEditorForm" data-toggle="validator" role="form" action="" onSubmit={this.handleSubmit}>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor="delay" className="control-label">Temps de réponse (ms)</label>
					<input type="text" pattern="^[0-9]*$" className="form-control" id="delay" ref="delay" value={this.state.formData.delay} onChange={this.updateState} placeholder="0"/>
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors"></div>
				</div>
				<div className="form-group form-group-sm has-feedback">
					<label htmlFor="format" className="control-label">Format de la réponse</label>
					<select className="form-control" id="responseType" ref="responseType" value={this.state.formData.responseType} onChange={this.updateState}>
						<option value="XML">XML</option>
						<option value="JSON">JSON</option>
						<option value="TXT">TXT</option>
					</select>
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors"></div>
				</div>
				<div className="form-groups">
					<button type="submit" className="btn btn-primary" ref="submitServiceEditorForm">Valider & Continuer</button>
				</div>
			</form>
		);
    }
});

module.exports = SE_Step_Prop;