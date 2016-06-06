var React = require('react');
var ReactDOM = require('react-dom');
var Actions = require('../../../actions/Actions.js');
var TP = require('../../basic/TP.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var SE_Step_Transfert = React.createClass({

	getInitialState: function() {
		var formData = this.props.data;

		return {
			formData:formData,
			formHelper:this.formHelper('BODY_XPATH'),
			message:''
		};
	},

	componentDidMount: function(){
		this.initValidator();
	},

	componentDidUpdate: function(){
		this.initValidator();
		ReactDOM.findDOMNode(this.refs.tpName).focus();
	},
	
	initValidator: function(){
		$('#serviceEditorForm').validator();
	},

	getFormData: function(){
		var data={
			name: ReactDOM.findDOMNode(this.refs.tpName).value,
			source: ReactDOM.findDOMNode(this.refs.tpSource).value,
			path: ReactDOM.findDOMNode(this.refs.tpArg).value,
			isKey: $('#tpkey').prop('checked')
		};

		return data;
	},

	handleSubmit: function(event){
		event.preventDefault();
		Actions.submitStep(this.state.formData);
	},

	addTp: function(event){
		event.preventDefault();
		var formData=this.getFormData();
		
		var tps = this.state.formData.tps;
		for(var id in tps){
			if(tps[id].name == formData.name){
			  	this.setState({message:`${formData.name} existe déjà!`});
			  	return;
		  	}
		}
		tps.push(formData);

		//RESET TP subform
		ReactDOM.findDOMNode(this.refs.tpName).value='';
		ReactDOM.findDOMNode(this.refs.tpSource).value='BODY_XPATH';
		ReactDOM.findDOMNode(this.refs.tpArg).value='';
		$('#tpkey').prop('checked',false);
		
		this.setState({formData:{tps:tps},formHelper:this.formHelper('BODY_XPATH'),message:''});
	},

	handleDelete: function(transfertProp){
		var oldTps = this.state.formData.tps;
		var newTps = [];
		oldTps.map(function(tp,index,array) {
			if(tp.name != transfertProp.name){
				newTps.push(tp);
			}
		});
		
		this.setState({formData:{tps:newTps},message:''});
	},

	formHelper: function(source){
		var helpMessage='';
		if(source=='BODY_XPATH'){
			helpMessage='Nom du champ dans la trame: .//nomDuChamp';
		}else if(source=='QUERY'){
			helpMessage='Nom de la variable en GET.';
		}else if(source=='PATH'){
			helpMessage='Nom du champ dans le PATH.';
		}else if(source=='HEADER'){
			helpMessage='Nom du header.';
		}

		return {
			helpMessage:helpMessage
		};
	},

	handleSrcChange: function(){
		var val = ReactDOM.findDOMNode(this.refs.tpSource).value;

		this.setState({formData:this.state.formData,formHelper:this.formHelper(val),message:''});
	},

	render: function() {

		var tps = this.state.formData.tps.map(function(tp,index,array) {
			return (
				<TP tp={tp} isKey={tp.isKey} onDelete={this.handleDelete}/>
			);
			},this);

		if(this.state.message){
			var message=(
				<div id="message" className="alert alert-danger" ref="message">
					<strong>{this.state.message}</strong>
				</div>
			);
		}

		return (
			<div>
				<form id="serviceEditorForm" data-toggle="validator" role="form" action="" onSubmit={this.handleSubmit}>
					{message}
					<table className="table table-condensed table-hover">
						<thead>
							<th>TransfertProp</th>
							<td>Source</td>
							<td>Argument</td>
							<td></td>
							<td></td>
						</thead>
						<tbody>
							{tps}
							<tr> 
								<th scope="row">
									<div className="form-group form-group-sm has-feedback">
										<input type="text" pattern="^[\w-_]*$" className="form-control" id="tpName" ref="tpName" placeholder="Nom de la propriété" required/>
										<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
										<div className="help-block with-errors"></div>
									</div>
								</th> 
								<td>
									<div className="form-group form-group-sm has-feedback">
										<select className="form-control" id="tpSource" ref="tpSource" onChange={this.handleSrcChange}>
											<option value="BODY_XPATH">BODY_XPATH</option>
											<option value="QUERY">QUERY</option>
											<option value="PATH">PATH</option>
											<option value="HEADER">HEADER</option>
										</select>
										<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
										<div className="help-block with-errors"></div>
									</div>
								</td>
								<td>
									<div className="form-group form-group-sm has-feedback">
										<input type="text" className="form-control" id="tpArg" ref="tpArg" placeholder="" required/>
										<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
										<div className="help-block with-errors">{this.state.formHelper.helpMessage}</div>
									</div>
								</td>
								<td>
									<div className="checkbox">
										<div className="form-group form-group-sm">
											<label><input type="checkbox" id="tpkey" ref="tpkey"/>clé?</label>
										</div>
									</div>
								</td>
								<td>
									<button type="submit" className="btn btn-primary" onClick={this.addTp}>Ajouter</button>
								</td> 
							</tr>
						</tbody>
					</table>
				</form>
				<div className="form-group">
					<button className="btn btn-primary" ref="submitServiceEditorForm" onClick={this.handleSubmit}>Valider & Continuer</button>
				</div>
			</div>
			
		);
    }
});

module.exports = SE_Step_Transfert;