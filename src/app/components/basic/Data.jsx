var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS =  require('./ButtonGS.jsx');
var Formsy = require('formsy-react');
var GSInput = require('../form/GSInput.jsx');

var Data = React.createClass({
	
	clone(a) {
	   return JSON.parse(JSON.stringify(a));
	},

	getInitialState:function(){
		if(this.props.onCancelAdd!=undefined){
			return {
				editMode:true,
				canSubmit:false,
				item:{}
			}
		}
		return {
			editMode:false,
			canSubmit:false,
			item:this.clone(this.props.item)
		};
	},

	componentWillReceiveProps(nextProps) {
		this.setState({editMode:this.state.editMode,item:this.clone(nextProps.item)});
	},

	remove(event){
		event.preventDefault();
		this.props.onDelete(this.state.item.key);
	},

	edit(event){
		event.preventDefault();
		this.setState({editMode:true,item:this.state.item});
	},

	cancel(event){
		event.preventDefault();
		if(this.props.onCancelAdd!=undefined){
			this.props.onCancelAdd();
		}
		this.setState({
			editMode:false,
			item:this.clone(this.props.item)
		});
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
		this.setState({editMode:true,item:model});
	},
	

	handleSubmit:function(model){
		event.preventDefault();
		if(this.props.onCancelAdd==undefined){
			this.props.onEdit(this.props.item.key,model.key,model.value);
			this.setState({editMode:false,item:model});
		}
		else
			this.props.onAdd(model.key,model.value);	

	},
	
	render: function() {
		const item=this.props.item;

		if(this.state.editMode){
			
			return (
				<tr> 
					<td colSpan="2">
						<Formsy.Form onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton} onChange={this.saveCurrentValuesToLocalStorage} className="form-inline">
							<GSInput tooltip="Clé" name="key" value={this.state.item.key} className="group-large" required />
							<GSInput tooltip="Valeur" name="value" value={this.state.item.value} className="group-large" required />

					        <div className="form-group group-normal">
								<button type="submit" disabled={!this.state.canSubmit} className="btn btn-primary btn-xs">Valider</button>
							</div>
				        </Formsy.Form>
					</td>
					<td className="dataButtons">
						{
							this.props.onCancelAdd==undefined?(
								<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
							):(null)
						}
						<ButtonGS handleClick={this.cancel} tooltip='Annuler' style='remove' glyph='ban-circle'/>
					</td>
				</tr>
			);
		}else{
			
			return (
				<tr> 
					<td><strong>{item.key}</strong></td> 
					<td>{item.value}</td>
					<td>
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
						<ButtonGS handleClick={this.edit} tooltip='Editer' style='add' glyph='pencil'/>
					</td> 
				</tr>
			 );
		}
    }
});

module.exports = Data;