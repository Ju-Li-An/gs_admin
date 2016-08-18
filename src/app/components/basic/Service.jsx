var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS =  require('./ButtonGS.jsx');
var GSTooltip = require('./GSTooltip.jsx');
const BASEPATH_DELIMITER='_';

var Service = React.createClass({

	getInitialState:function(){
		return({editMode:false,data:this.extractData(this.props.service.basepath)});
	},

	extractData: function(basepath){
		return {
			appName: basepath.split(BASEPATH_DELIMITER)[0],
			serviceName: basepath.split(BASEPATH_DELIMITER)[1],
			serviceVersion: basepath.split(BASEPATH_DELIMITER)[2].substring(1),
		};
	},

	componentWillReceiveProps(nextProps) {
		this.setState({editMode:this.state.editMode,data:this.extractData(nextProps.service.basepath)});
	},
	
	select(event){
		if(!event.isDefaultPrevented()){
			Actions.selectService(this.props.service);
		}
	},

	stop(event){
		event.preventDefault();
		Actions.stopService(this.props.service.basepath);
	},

	start(event){
		event.preventDefault();
		Actions.startService(this.props.service.basepath);
	},
	
	remove(event){
		event.preventDefault();
		var r = confirm("Etes vous sur de vouloir supprimer le service?");
		if (r == true) {
		   Actions.deleteService(this.props.service.basepath);
		} 
	},

	cancel(event){
		event.preventDefault();
		this.setState({editMode:false,data:this.extractData(this.props.service.basepath)});
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

	edit(event){
		event.preventDefault();
		this.setState({editMode:true,data:this.state.data});
	},

	handleSubmit: function(event){
		event.preventDefault();
		var formData=this.state.data;
		formData.serviceVersion=(formData.serviceVersion == null || formData.serviceVersion == undefined || formData.serviceVersion == '')? '0':formData.serviceVersion;
		Actions.editService(this.props.service.basepath,formData);
		this.setState({editMode:false,data:this.state.data});
	},

	updateState:function(event){
		event.preventDefault();
		var data = this.state.data;
		data[event.target.id]=event.target.value;
		this.setState({editMode:true,data:data});
	},

	render: function() {
		const service=this.props.service;
		
		var ligneActive="";
		var selectable=this.select;

		
		if(!service.status){
			ligneActive="active stopped";
		}
		if(this.props.selected){
			ligneActive+=" line-selected";
			selectable="";
		}

		
		if(this.state.editMode){
			return (
				<tr className={ligneActive} onClick={selectable}>
					<td>
						<form id="serviceEditorForm" data-toggle="validator" className="form-inline" role="form" action="" onSubmit={this.handleSubmit}>
							<div className="form-group form-group-xs has-feedback">
								<GSTooltip placement="top" text="Application">
									<input type="text" pattern="^[\w]{1,}$" className="form-control" id="appName" placeholder="APPLICATION" onChange={this.updateState} value={this.state.data.appName} required/>
								</GSTooltip>
								<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
							</div>
							<div className="form-group form-group-xs has-feedback">
								<GSTooltip placement="top" text="Service">
									<input type="text" pattern="^[\w]{1,}$" className="form-control" id="serviceName" placeholder="SERVICE" onChange={this.updateState} value={this.state.data.serviceName} required/>
								</GSTooltip>
								<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
							</div>
							<div className="form-group form-group-xs has-feedback">
								<GSTooltip placement="top" text="Version">
									<input type="text" pattern="^[.-\d]*$" className="form-control" id="serviceVersion" placeholder="0" onChange={this.updateState} value={this.state.data.serviceVersion} />
								</GSTooltip>
								<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
							</div>
							<div className="form-group">
								<button type="submit" className="btn btn-primary btn-xs" ref="submitServiceEditorForm">Valider</button>
							</div>
						</form>
					</td>
					<td>
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
						<ButtonGS handleClick={service.status?this.stop:this.start} tooltip={service.status?'Stop':'Start'} style='add' glyph={service.status?'stop':'play'}/>
						<ButtonGS handleClick={this.cancel} tooltip='Annuler' style='remove' glyph='ban-circle'/>
					</td>
				</tr>
			);
		}else{
			return (
					<tr className={ligneActive} onClick={selectable}> 
						<th scope="row">{service.basepath}</th> 
						<td>
							<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
							<ButtonGS handleClick={service.status?this.stop:this.start} tooltip={service.status?'Stop':'Start'} style='add' glyph={service.status?'stop':'play'}/>
							<ButtonGS handleClick={this.edit} tooltip='Editer' style='add' glyph='pencil'/>
						</td> 
					</tr>
				 );
		}
    }
});

module.exports = Service;