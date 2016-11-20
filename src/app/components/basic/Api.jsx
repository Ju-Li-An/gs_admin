var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS = require('./ButtonGS.jsx');
var Formsy = require('formsy-react');
var GSInput = require('../form/GSInput.jsx');
var GSSelect = require('../form/GSSelect.jsx');

var Api = React.createClass({
	
	clone(a) {
	   return JSON.parse(JSON.stringify(a));
	},

	getInitialState:function(){
		return {
			editMode:false,
			canSubmit:false,
			api:this.clone(this.props.data),
		};
	},

	componentWillReceiveProps(nextProps) {
		this.setState({editMode:this.state.editMode,api:this.clone(nextProps.data)});
	},

	select(event){
		if(!event.isDefaultPrevented()){
			Actions.selectApi(this.props.data);
		}
	},

	cancel(event){
		event.preventDefault();
		this.setState({editMode:false,api:this.clone(this.props.data)});
	},

	edit(event){
		event.preventDefault();
		this.setState({editMode:true,api:this.state.api});
	},
	
	remove(event){
		event.preventDefault();
		var r = confirm(`Etes vous sur de vouloir supprimer l'API [${this.props.data.name}] ?`);
		if (r == true) {
			Actions.deleteApi(this.props.data);
		}
	},

	updateState:function(event){
		event.preventDefault();
		var data = this.state.api;
		data[event.target.id]=event.target.value;
		this.setState({editMode:true,data:data});
	},

	enableButton() {
      this.setState({
        canSubmit: true
      });
    },

    disableButton() {
      this.setState({
        canSubmit: false
      });
    },

     saveCurrentValuesToLocalStorage:function(model){
		this.setState({editMode:true,param:model});
	},

	handleSubmit: function(model){
		event.preventDefault();
		model.uri=(model.uri == null || model.uri == undefined || model.uri == '')? '/':model.uri;
		Actions.editApi(this.clone(this.props.data),model);
		this.setState({editMode:false,api:this.state.api});
	},
	
	render: function() {
		const data=this.props.data;
		
		var ligneActive="";
		var selectable=this.select;
		
		if(this.props.selected){
			ligneActive+=" line-selected";
			selectable="";
		}
		
		if(this.state.editMode){
			return (
				<tr className={ligneActive} onClick={selectable}>
					<td colSpan="2">
						<Formsy.Form onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton} onChange={this.saveCurrentValuesToLocalStorage} className="form-inline">
							<GSInput tooltip="Nom" name="name" value={this.state.api.name} className="group-large" required />
							<GSInput tooltip="URI" name="uri" value={this.state.api.uri} className="group-large" required />
							
							<div className="form-group group-normal">
								<button type="submit" disabled={!this.state.canSubmit} className="btn btn-primary btn-xs">Valider</button>
							</div>
						</Formsy.Form>
					</td>
					<td className="paramButtons">
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
						<ButtonGS handleClick={this.cancel} tooltip='Annuler' style='remove' glyph='ban-circle'/>
					</td>
				</tr>
			);
		}else{
			return (
				<tr className={ligneActive} onClick={selectable}> 
					<td><strong>{data.name}</strong></td>
					<td>{data.uri}</td>
					<td>
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
						<ButtonGS handleClick={this.edit} tooltip='Editer' style='add' glyph='pencil'/>
					</td> 
				</tr>
			 );
		}
    }
});

module.exports = Api;