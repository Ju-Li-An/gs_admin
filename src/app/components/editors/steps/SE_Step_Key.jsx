var React = require('react');
var ReactDOM = require('react-dom');
var Actions = require('../../../actions/Actions.js');
var ReorderList=require('../../basic/ReorderList.jsx');
var RegExpKey=require('../../basic/RegExpKey.jsx');

var SE_Step_Key = React.createClass({

	getInitialState: function() {
		var formData= this.props.data;
		return {
			formData: formData, 
			message: ''
		};
	},

	componentDidMount: function(){
		this.initValidator();
	},

	componentDidUpdate: function(){
		this.initValidator();
		ReactDOM.findDOMNode(this.refs.regle).focus();
	},
	
	initValidator: function(){
		$('#serviceEditorForm').validator();
	},

	getFormData: function(){

		var data={
			regle: ReactDOM.findDOMNode(this.refs.regle).value,
			target: ReactDOM.findDOMNode(this.refs.target).value,
		};

		return data;
	},

	addRegle: function(event){
		event.preventDefault();
		var formData=this.getFormData();
		
		var regExpKeys = this.state.formData.regles;
		for(var id in regExpKeys){
			if(regExpKeys[id].regle == formData.regle){
			  	this.setState({formData:this.state.formData,message:`${formData.regle} existe déjà!`});
			  	return;
		  	}
		}
		regExpKeys.push(formData);

		ReactDOM.findDOMNode(this.refs.regle).value='';
		ReactDOM.findDOMNode(this.refs.target).value='';
		
		this.setState({formData:{keys:this.state.formData.keys,regles:regExpKeys},message:''});
	},

	handleSubmit: function(event){
		event.preventDefault();
		Actions.submitStep(this.state.formData);
	},

	handleReorder:function(data){
		this.setState({formData:{keys:data,regles:this.state.formData.regles}});
	},

	handleDelete: function(currentRegExpKey){
		var oldRegExpKeys = this.state.formData.regles;
		var newRegExpKeys = [];
		oldRegExpKeys.map(function(regExpKey,index,array) {
			if(regExpKey.regle != currentRegExpKey.regle){
				newRegExpKeys.push(regExpKey);
			}
		});
		
		this.setState({formData:{keys:this.state.formData.keys,regles:newRegExpKeys},message:''});
	},

	render: function() {
		var displayKey='';

		displayKey=this.state.formData.keys.join('.');
		/*for(var id in this.state.formData.keys){
			if(displayKey.length>0)displayKey+='.';
			displayKey+=this.state.formData.keys[id];
		}*/

		var regexpkeys=this.state.formData.regles.map(function(regExpKey,index,array){
			return (<RegExpKey data={regExpKey} onDelete={this.handleDelete} />);
		},this);

		return (
			<div>
				<div className="row rowKeys">
					<div className="col-lg-5">
						<h4>Ordre de la clé</h4>
						<ReorderList data={this.state.formData.keys} onReorder={this.handleReorder} />
						<h4><small>Clé du service</small>: {displayKey}</h4>
					</div>
					<div className="col-lg-7">
						<h4>Création de règles</h4>
						<form id="serviceEditorForm" data-toggle="validator" role="form" action="">
							<table className="table table-condensed table-hover">
								<thead>
									<tr>
										<th>Règle (RegExp)</th>
										<td>Jeux de données cible</td>
										<td></td>
									</tr>
								</thead>
								<tbody>
									{regexpkeys}
									
									<tr> 
										<td>
											<div className="form-group form-group-sm has-feedback">
												<input type="text" className="form-control" id="regle" ref="regle" placeholder="" required/>
												<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
												<div className="help-block with-errors"></div>
											</div>
										</td> 
										<td>
											<div className="form-group form-group-sm has-feedback">
												<input type="text" pattern="^[\w-_]*$" className="form-control" id="target" ref="target" placeholder="" required/>
												<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
												<div className="help-block with-errors"></div>
											</div>
										</td>
										<td>
											<button type="submit" className="btn btn-primary" onClick={this.addRegle}>Ajouter</button>
										</td> 
									</tr>
									
								</tbody>
							</table>
						</form>
					</div>
				</div>

				<div className="form-group">
					<button className="btn btn-primary" ref="submitServiceEditorForm" onClick={this.handleSubmit}>Créer le service</button>
				</div>
			</div>
		);
    }
});

module.exports = SE_Step_Key;