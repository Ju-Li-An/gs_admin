var React = require('react');
var ReactDOM = require('react-dom');
var Actions = require('../../../actions/Actions.js');
var Param = require('../../basic/Param.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var SE_Step_Param = React.createClass({

	getInitialState: function() {
		var formData = this.props.data;
		return {
			formData:formData,
			formHelper:this.formHelper('DATE'),
			message:''
		};
	},

	componentDidMount: function(){
		this.initValidator();
	},

	componentDidUpdate: function(){
		this.initValidator();
		ReactDOM.findDOMNode(this.refs.paramName).focus();
	},
	
	initValidator: function(){
		$('#serviceEditorForm').validator();
	},

	getFormData: function(){
		var data={
			name: ReactDOM.findDOMNode(this.refs.paramName).value,
			type: ReactDOM.findDOMNode(this.refs.paramType).value,
			arg: ReactDOM.findDOMNode(this.refs.paramArg).value,
			arg2: ReactDOM.findDOMNode(this.refs.paramArg2)!=null?ReactDOM.findDOMNode(this.refs.paramArg2).value:null
		};

		return data;
	},

	handleSubmit: function(event){
		event.preventDefault();
		Actions.submitStep(this.state.formData);
	},

	addParam: function(event){
		event.preventDefault();
		var formData=this.getFormData();
		
		var params = this.state.formData.params;
		for(var id in params){
			if(params[id].name == formData.name){
			  	this.setState({message:`${formData.name} existe déjà!`});
			  	return;
		  	}
		}
		params.push(formData);

		//RESET TP subform
		ReactDOM.findDOMNode(this.refs.paramName).value='';
		ReactDOM.findDOMNode(this.refs.paramType).value='DATE';
		ReactDOM.findDOMNode(this.refs.paramArg).value='';
		if(ReactDOM.findDOMNode(this.refs.paramArg2)!=null)
			ReactDOM.findDOMNode(this.refs.paramArg2).value='';
		
		this.setState({formData:{params:params},formHelper:this.formHelper('DATE'),message:''});
	},

	handleDelete: function(parameter){
		var oldParams = this.state.formData.params;
		var newParams = [];
		oldParams.map(function(param,index,array) {
			if(param.name != parameter.name){
				newParams.push(param);
			}
		});
		
		this.setState({formData:{params:newParams},message:''});
	},

	formHelper: function(type){
		var helpMessage='';
		var helpMessage2='';
		var patternCheck='';
		var placeHolder='';
		var placeHolder2='';
		if(type=='DATE'){
			helpMessage='Format de date. Exemple: dd/mm/yyyy.';
			patternCheck='^[\w-_.]*$';
			placeHolder='dd/mm/yyyy';
		}else if(type=='COUNTER'){
			helpMessage='Valeur de départ du compteur.';
			patternCheck='^[0-9]*$';
			placeHolder='0';
		}else if(type=='RANDOM_NUMERIC'){
			helpMessage='Longueur du nombre à générer.';
			patternCheck='^[0-9]*$';
			placeHolder='5';
		}else if(type=='RANDOM_ALPHANUM'){
			helpMessage='Longueur de la chaine à générer.';
			patternCheck='^[0-9]*$';
			placeHolder='5';
			helpMessage2='Liste des caractères: ABCD12981add';
			placeHolder2='ABCDEFGHIJKLMNOPQRSTUVWXZ';
		}

		return {
			helpMessage:helpMessage,
			helpMessage2:helpMessage2,
			patternCheck:patternCheck,
			placeHolder:placeHolder,
			placeHolder2:placeHolder2
		};
	},

	handleTypeChange: function(){
		var val = ReactDOM.findDOMNode(this.refs.paramType).value;

		this.setState({
			formData:this.state.formData,
			formHelper:this.formHelper(val),
			message:''
		});

	},

	render: function() {


		var params = this.state.formData.params.map(function(param,index,array) {
			return (
				<Param param={param} onDelete={this.handleDelete}/>
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
							<tr>
								<th>Paramètre</th>
								<td>Type</td>
								<td>Arg 1</td>
								<td>Arg 2</td>
								<td></td>
							</tr>
						</thead>
						<tbody>
							{params}
							<tr> 
								<th scope="row">
									<div className="form-group form-group-sm has-feedback">
										<input type="text" pattern="^[\w-_]*$" className="form-control" id="paramName" ref="paramName" placeholder="Nom du paramètre" required/>
										<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
										<div className="help-block with-errors"></div>
									</div>
								</th> 
								<td>
									<div className="form-group form-group-sm has-feedback">
										<select className="form-control" id="paramType" ref="paramType" onChange={this.handleTypeChange}>
											<option value="DATE">DATE</option>
											<option value="COUNTER">COUNTER</option>
											<option value="RANDOM_NUMERIC">RANDOM_NUMERIC</option>
											<option value="RANDOM_ALPHANUM">RANDOM_ALPHANUM</option>
										</select>
										<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
										<div className="help-block with-errors"></div>
									</div>
								</td>
								<td>
									<div className="form-group form-group-sm has-feedback">
										<input type="text" pattern={this.state.formHelper.patternCheck} className="form-control" id="paramArg" ref="paramArg" placeholder={this.state.formHelper.placeHolder} required/>
										<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
										<div className="help-block with-errors">{this.state.formHelper.helpMessage}</div>
									</div>
								</td>
								{
									this.state.formHelper.helpMessage2 ? (
										<td>
											<div className="form-group form-group-sm has-feedback">
												<input type="text" className="form-control" id="paramArg2" ref="paramArg2" placeholder={this.state.formHelper.placeHolder2} required/>
												<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
												<div className="help-block with-errors">{this.state.formHelper.helpMessage2}</div>
											</div>
										</td>

									):<td></td>
								}
								<td>
									<button type="submit" className="btn btn-primary" onClick={this.addParam}>Ajouter</button>
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

module.exports = SE_Step_Param;