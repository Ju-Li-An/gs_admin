var React = require('react');
var ReactDOM = require('react-dom');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var TP = require('../basic/TP.jsx');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var ServiceEditorStore = require('../../stores/ServiceEditorStore.js');
var Step = require('./Step.jsx');
var Recap = require('./Recap.jsx');
var SE_Step_Service = require('./steps/SE_Step_Service.jsx');
var SE_Step_API = require('./steps/SE_Step_API.jsx');
var SE_Step_Prop = require('./steps/SE_Step_Prop.jsx');
var SE_Step_Param = require('./steps/SE_Step_Param.jsx');
var SE_Step_Transfert = require('./steps/SE_Step_Transfert.jsx');
var SE_Step_Key = require('./steps/SE_Step_Key.jsx');


var ServiceEditor = React.createClass({
	mixins: [
			Reflux.listenTo(ServiceEditorStore, 'onStoreUpdate')
	],

	getInitialState: function() {
		return ServiceEditorStore.getDefaultData(this.props.agent);
	},

	onStoreUpdate: function(data){
		if(data.status=='success'){
			this.props.onCancel();
			Actions.refreshServicesList(1);
		}
		this.setState(data);
	},
	
	render:function(){

		var step=this.state.steps[this.state.currentStep];
		//TODO: build the steps button
		var steps = this.state.steps.map(function(step,index,array) {
			return(
				<Step title={step.title} enable={step.enable} index={index} complete={step.complete} active={step.active}/>
			);
		});

		if (this.state.status && this.state.message) {
			var classString = 'alert alert-' + this.state.status;
			var status = (
				<div id="status" className={classString} ref="status">
					{this.state.message}
				</div>
			);
		}

		var recap = this.state.steps.map(function(step,index,array) {
			return(
				<Recap title={step.title} data={step.recap} />
			);
		});

		var currentStep = React.createElement(step.render,{agent:this.props.agent,cancel:this.props.show,data:step.data,prev:step.prev},null);

		return(
			<Modal bsSize="lg" show={this.props.show} onHide={this.props.onCancel}>
				<Modal.Header closeButton>
					<Modal.Title>WIZARD "Nouveau Service" - {step.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ul className="nav nav-stacked col-sm-2 nav-pills">
						{steps}
					</ul>
					<div className="col-md-8 se_step">
						{status}
						{currentStep}
					</div>
					<div className="col-md-2 recap">
						<h4>Récapitulatif</h4>
						{recap}
					</div>
				</Modal.Body>
			</Modal>
		);
	}

});

module.exports = ServiceEditor;