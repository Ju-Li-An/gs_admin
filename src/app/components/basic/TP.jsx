var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS = require('./ButtonGS.jsx');
var ApisStore = require('../../stores/ApisStore.js');
var Formsy = require('formsy-react');
var GSInput = require('../form/GSInput.jsx');
var GSSelect = require('../form/GSSelect.jsx');

var TP = React.createClass({
	
	clone(a) {
	   return JSON.parse(JSON.stringify(a));
	},

	getInitialState:function(){
		if(this.props.onCancelAdd!=undefined){
			return {
				editMode:true,
				canSubmit:false,
				tp:ApisStore.getNewTp()
			}
		}
		return {
			editMode:false,
			canSubmit:false,
			tp:this.clone(this.props.tp)
		};
	},

	componentWillReceiveProps(nextProps) {
		this.setState({editMode:this.state.editMode,tp:this.clone(nextProps.tp)});
	},

	remove(event){
		event.preventDefault();
		Actions.deleteTp(this.state.tp);
	},

	edit(event){
		event.preventDefault();
		this.setState({editMode:true,tp:this.state.tp});
	},

	cancel(event){
		event.preventDefault();
		if(this.props.onCancelAdd!=undefined){
			this.props.onCancelAdd();
		}
		this.setState({
			editMode:false,
			tp:this.clone(this.props.tp)
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

	handleSubmit:function(model){
		event.preventDefault();
		if(this.props.onCancelAdd==undefined){
			Actions.editTp(this.props.tp,model);
			this.setState({editMode:false,tp:model});
		}
		else
			this.props.onAdd(model);	
	},

	saveCurrentValuesToLocalStorage:function(model){
		if(model.source!=this.state.tp.source)
			this.setState({editMode:true,tp:model});
	},
	
	render: function() {
		const tp=this.props.tp;
		
		var keyClassName=this.props.isKey?"info":"";

		if(this.state.editMode){
			return (
				<tr> 
					<td colSpan="3">
						<Formsy.Form onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton} onChange={this.saveCurrentValuesToLocalStorage} className="form-inline">
							<GSInput tooltip="Nom" name="name" value={this.state.tp.name} className="group-normal" required />
							<GSSelect tooltip="Source" name="source" value={this.state.tp.source} options={[
								{title:'BODY_XPATH',value:'BODY_XPATH'},
								{title:'QUERY',value:'QUERY'},
								{title:'PATH',value:'PATH'},
								{title:'POSITION',value:'POSITION'},
								{title:'TLV',value:'TLV'},
								{title:'HEADER',value:'HEADER'}
							]} className="group-normal" required />

							{this.state.tp.source=='BODY_XPATH'? (<GSInput tooltip="XPath" name="path" value={this.state.tp.path} className="group-normal" required />):null}
							{this.state.tp.source=='BODY_XPATH'? (<GSInput tooltip="Attribut" name="attr" value={this.state.tp.attr} className="group-normal" />):null}
							{this.state.tp.source=='QUERY'? (<GSInput tooltip="Nom du champ: http://..../?champ=value" name="path" value={this.state.tp.path} className="group-normal" required />):null}
							{this.state.tp.source=='PATH'? (<GSInput tooltip="Element de l'URI (pathElt): http://host:port/{pathElt}/?champ=value" name="path" value={this.state.tp.path} className="group-normal" required />):null}
							{this.state.tp.source=='POSITION'? (<GSInput tooltip="Index début" name="position" value={this.state.tp.position} validations="isInt" validationError="Entier" className="group-small" required />):null}
							{this.state.tp.source=='POSITION'? (<GSInput tooltip="Longueur" name="length" value={this.state.tp.length} validations="isInt" className="group-small" required />):null}
							{this.state.tp.source=='TLV'? (<GSInput tooltip="Nom du champ TLV" name="path" value={this.state.tp.path} className="group-normal" required />):null}
							{this.state.tp.source=='HEADER'? (<GSInput tooltip="Nom du champ HEADER" name="path" value={this.state.tp.path} className="group-normal" required />):null}

							<GSInput type="checkbox" tooltip="Clé" name="isKey" className="group-small" value={this.state.tp.isKey} />

					        <div className="form-group className="group-small>
								<button type="submit" disabled={!this.state.canSubmit} className="btn btn-primary btn-xs">Valider</button>
							</div>
				        </Formsy.Form>
					</td>
					<td className="paramButtons">
						{
							this.props.onCancelAdd==undefined?(
								<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>):(null)
						}
						<ButtonGS handleClick={this.cancel} tooltip='Annuler' style='remove' glyph='ban-circle'/>
					</td>
				</tr>
				);

		}else{
			var data ='';
			data += tp.path?'path = '+tp.path:'';
			data += tp.attr?', attribut = '+tp.attr:'';
			data += tp.position?'position = '+tp.position:'';
			data += tp.length?', longueur = '+tp.length:'';
			return (
				<tr className={keyClassName}> 
					<th scope="row">{tp.name}</th> 
					<td>{tp.source}</td>
					<td>{data}</td>
					<td>
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
						<ButtonGS handleClick={this.edit} tooltip='Editer' style='add' glyph='pencil'/>
					</td> 
				</tr>
			 );
		}
    }
});

module.exports = TP;