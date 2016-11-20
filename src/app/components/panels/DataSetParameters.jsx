var React = require('react');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var DataSetsStore = require('../../stores/DataSetsStore.js');
var Panel = require('./Panel.jsx');
var Button = require('react-bootstrap').Button;
var ButtonGS =  require('../basic//ButtonGS.jsx');
var Glyphicon = require('react-bootstrap').Glyphicon;
var Param = require('../basic/Param.jsx');
var Formsy = require('formsy-react');
var GSInput = require('../form/GSInput.jsx');
var GSSelect = require('../form/GSSelect.jsx');

var DataSetParameters = React.createClass({
	mixins: [
			Reflux.listenTo(DataSetsStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = DataSetsStore.getDefaultData();
		return {
			dataset:data.selected.dataset,
			parameters:data.selected.details.parameters,
			tpNames:data.operation.transferProperties!=undefined?data.operation.transferProperties.map(function(val){return val.name;}):null,
			callback:data.selected.details.callback,
			editCallbackMode:false,
			canSubmit: false
		};
	},
	
	onStoreUpdate(data){
		this.setState({
			dataset:data.selected.dataset,
			parameters:data.selected.details.parameters,
			tpNames:data.operation.transferProperties!=undefined?data.operation.transferProperties.map(function(val){return val.name;}):null,
			callback:data.selected.details.callback,
			editCallbackMode:false,
			canSubmit: false
		});
	},

	showAddParamForm(event){
		this.setState({showAddParamForm:true});
	},

	handleCancelAdd(event){
		this.setState({showAddParamForm:false});
	},

	handleAddParam(param){
		Actions.addDSParam(param);
		this.setState({showAddParamForm:false});
	},

	handleEditParam(origin,nouveau){
		Actions.editDSParam(origin,nouveau);
	},

	handleDeleteParam(param){
		Actions.deleteDSParam(param);
	},

	toggleCallback(){
		if(this.state.callback!=undefined)
			this.state.callback.enable=!this.state.callback.enable;
		else
			this.state.callback={"enable":true};

		if(!this.state.callback.enable)
			Actions.disableCallback();

		this.setState({callback:this.state.callback,editCallbackMode:this.state.callback.enable});
	},

	editCallback(){
		this.setState({editCallbackMode:true});
	},

	cancel(){
		if(this.state.callback.hostname!=undefined)
			this.state.callback.enable=true;
		else
			this.state.callback.enable=false;
		this.setState({editCallbackMode:false});
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
		//this.setState({callback:model});
	},
	

	handleSubmit:function(model){
		event.preventDefault();
		Actions.editCallback(model);
		this.setState({editCallbackMode:false});
	},

	
	render: function() {


		if(this.state.parameters !=undefined){
			var params = this.state.parameters.map(function(param,index,array) {
				return (
					<Param param={param} tpNames={this.state.tpNames} onEdit={this.handleEditParam} onDelete={this.handleDeleteParam} />
				);
			},this);
		}

		var linkaddParam=(
			<div className="pull-right">
					<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.showAddParamForm}><Glyphicon glyph="plus" /></Button>
				</div>
		);

		if(this.state.callback!=undefined && this.state.callback.enable){
			var opts=[
					{title:'',value:''},
					{title:'POST',value:'POST'},
					{title:'GET',value:'GET'},
					{title:'PUT',value:'PUT'},
					{title:'DELETE',value:'DELETE'},
					{title:'HEAD',value:'HEAD'},
					{title:'OPTIONS',value:'OPTIONS'},
					{title:'TRACE',value:'TRACE'},
					{title:'CONNECT',value:'CONNECT'}

				];

			if(this.state.editCallbackMode){
				var callback=(
					<tbody>
						<tr>
							<td>
								<Formsy.Form onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton} onChange={this.saveCurrentValuesToLocalStorage} className="form-horizontal">
									<GSInput tooltip="hostname" name="hostname" value={this.state.callback.hostname} label="Hostname" required />
									<GSInput tooltip="port" name="port" value={this.state.callback.port} label="Port" validations="isInt" validationError="Entier" required />
									<GSInput tooltip="uri" name="uri" value={this.state.callback.uri} label="URI" required />
									<GSSelect tooltip="methode" name="method" value={this.state.callback.method} label="Méthode" options={opts} required />
									<GSInput tooltip="template" name="template" value={this.state.callback.template} label="Template" required />
									<GSInput tooltip="delay" name="delay" value={this.state.callback.delay} label="Delay (ms)" validations="isInt" validationError="Entier" />

									<button type="submit" disabled={!this.state.canSubmit} className="btn btn-primary btn-xs">Valider</button>
									
								</Formsy.Form>
							</td>
						</tr>
					</tbody>
				);
			}else{
				if(this.state.callback.headers!=undefined && this.state.callback.headers.length>0){
					var headers=this.state.callback.headers.map(function(val){
						return (
							<div>
								{val.name}:{val.value}
							</div>
						)}
					);
				}
				
				var callback=(
					<tbody>
						<tr><td><strong>URL: </strong></td><td>{this.state.callback.method} - http://{this.state.callback.hostname}:{this.state.callback.port}{this.state.callback.uri}</td></tr>
						<tr><td><strong>Template: </strong></td><td>{this.state.callback.template}</td></tr>
						<tr><td><strong>Delay: </strong></td><td>{this.state.callback.delay} ms</td></tr>
						<tr><td><strong>Headers: </strong></td><td>{headers}</td></tr>
					</tbody>
					
				);
			}
		}

		if(this.state.showAddParamForm){
			var addParamForm = (<Param param={null} tpNames={this.state.tpNames} onCancelAdd={this.handleCancelAdd} onAdd={this.handleAddParam} onEdit={this.handleEditParam}/>);
		}
		
		var title="DataSet ["+this.state.dataset.value+"] Paramètre(s)";
		
		return (
			<Panel title={title} links={null}>
				<h5>Paramètres {linkaddParam} </h5>
				<table className="table table-condensed table-hover">
					<tbody>
						{params}
						{addParamForm}
					</tbody>
				</table>
				<h5>Callback 
					<ButtonGS handleClick={this.toggleCallback} tooltip='Activer/Désactiver' style='add' glyph='off'/>
					{

						this.state.editCallbackMode?
						(
							<ButtonGS handleClick={this.cancel} tooltip='Annuler' style='remove' glyph='ban-circle'/>
						):this.state.callback!=undefined && this.state.callback.enable?(
							<ButtonGS handleClick={this.editCallback} tooltip='Editer' style='add' glyph='pencil'/> 
						):(null)
					}

				</h5>
				<table className="table table-condensed table-hover">
					{callback}
				</table>
			</Panel>
		);
  }
});

module.exports = DataSetParameters;