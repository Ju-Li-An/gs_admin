var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS =  require('./ButtonGS.jsx');
var ApisStore = require('../../stores/ApisStore.js');
var Formsy = require('formsy-react');
var GSInput = require('../form/GSInput.jsx');
var GSSelect = require('../form/GSSelect.jsx');

var Param = React.createClass({
	
	clone(a) {
	   return JSON.parse(JSON.stringify(a));
	},

	getInitialState:function(){
		if(this.props.onCancelAdd!=undefined){
			return {
				editMode:true,
				canSubmit:false,
				param:ApisStore.getNewParam()
			}
		}
		return {
			editMode:false,
			canSubmit:false,
			param:this.clone(this.props.param)
		};
	},

	componentWillReceiveProps(nextProps) {
		this.setState({editMode:this.state.editMode,param:this.clone(nextProps.param)});
	},

	remove(event){
		event.preventDefault();
		this.props.onDelete(this.state.param);
	},

	edit(event){
		event.preventDefault();
		this.setState({editMode:true,param:this.state.param});
	},

	cancel(event){
		event.preventDefault();
		if(this.props.onCancelAdd!=undefined){
			this.props.onCancelAdd();
		}
		this.setState({
			editMode:false,
			param:this.clone(this.props.param)
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
		if(model.type!=this.state.param.type)
			this.setState({editMode:true,param:model});
	},
	

	handleSubmit:function(model){
		event.preventDefault();
		if(this.props.onCancelAdd==undefined){
			this.props.onEdit(this.props.param,model);
			this.setState({editMode:false,param:model});
		}
		else
			this.props.onAdd(model);	

	},
	
	render: function() {
		const param=this.props.param;

		if(this.state.editMode){
			if(this.props.tpNames!=undefined){
				var tps = this.props.tpNames.map(function(val){
					return {title:val,value:val};
				});
			}

			var opts=[
					{title:'DATE',value:'DATE'},
					{title:'RANDOM_ALPHANUM',value:'RANDOM_ALPHANUM'},
					{title:'COUNTER',value:'COUNTER'},
					{title:'MSG_SIZE',value:'MSG_SIZE'},
					{title:'PADSTR',value:'PADSTR'},
					{title:'TLV',value:'TLV'}
				];
			if(tps!=undefined && tps.length>0){
				opts.push({title:'TPPART',value:'TPPART'});
			}

			return (
				<tr> 
					<td colSpan="3">
						<Formsy.Form onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton} onChange={this.saveCurrentValuesToLocalStorage} className="form-inline">
							<GSInput tooltip="Nom" name="name" value={this.state.param.name} className="group-normal" required />
							<GSSelect tooltip="Type" name="type" value={this.state.param.type} className="group-normal" options={opts} required />

							{this.state.param.type=='DATE'? (<GSInput tooltip="Format" name="format" value={this.state.param.format} className="group-normal" required />):null}
							{this.state.param.type=='RANDOM_ALPHANUM'? (<GSInput tooltip="Longueur" name="len" value={this.state.param.len} className="group-small" required />):null}
							{this.state.param.type=='RANDOM_ALPHANUM'? (<GSInput tooltip="Charset" name="charset" value={this.state.param.charset} className="group-normal" required />):null}
							{this.state.param.type=='TPPART'? (<GSSelect tooltip="Source" name="source" value={this.state.param.source!=undefined?this.state.param.source:tps[0].value} options={tps} className="group-normal" required />):null}
							{this.state.param.type=='TPPART'? (<GSInput tooltip="Index début" name="start" value={this.state.param.start} className="group-small" validations="isInt" validationError="Entier" required />):null}
							{this.state.param.type=='TPPART'? (<GSInput tooltip="Index fin" name="end" value={this.state.param.end} className="group-small" validations="isInt" required />):null}
							{this.state.param.type=='COUNTER'? (<GSInput tooltip="Valeur initiale" name="start" value={this.state.param.start} className="group-normal" required />):null}
							{this.state.param.type=='MSG_SIZE'? (<GSInput tooltip="Longueur" name="len" value={this.state.param.len} className="group-normal" required />):null}
							{this.state.param.type=='TLV'? (<GSInput tooltip="Valeur" name="value" value={this.state.param.value} className="group-normal" required />):null}
							{this.state.param.type=='PADSTR'? (<GSInput tooltip="Caractère" name="char" value={this.state.param.char} className="group-xsmall"/>):null}
							{this.state.param.type=='PADSTR'? (<GSInput tooltip="Valeur" name="value" value={this.state.param.value} className="group-normal" required />):null}
							{this.state.param.type=='PADSTR'? (<GSInput tooltip="Longueur" name="len" value={this.state.param.len} className="group-xsmall" validations="isInt" required />):null}
							{this.state.param.type=='PADSTR'? (<GSInput tooltip="Sens (Right ou Left)" name="way" value={this.state.param.way} className="group-xsmall" required />):null}

					        <div className="form-group group-normal">
								<button type="submit" disabled={!this.state.canSubmit} className="btn btn-primary btn-xs">Valider</button>
							</div>
				        </Formsy.Form>
					</td>
					<td className="paramButtons">
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
			var data ='';
			data += param.format!=undefined?'format = '+param.format:'';
			data += param.charset!=undefined?'charset = '+param.charset:'';
			data += param.len!=undefined?', longueur = '+param.len:'';
			data += param.source!=undefined?'source = '+param.source:'';
			data += param.start!=undefined?', début = '+param.start:'';
			data += param.end!=undefined?', fin = '+param.end:'';
			data += param.sens!=undefined?', sens = '+param.way:'';
			data += param.value!=undefined?', valeur = '+param.value:'';
			return (
				<tr> 
					<td><strong>{param.name}</strong></td> 
					<td>{param.type}</td>
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

module.exports = Param;