var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS = require('./ButtonGS.jsx');
var GSTooltip = require('./GSTooltip.jsx');

var Api = React.createClass({
	
	clone(a) {
	   return JSON.parse(JSON.stringify(a));
	},

	getInitialState:function(){
		return {
			editMode:false,api:this.clone(this.props.api)
		};
	},

	componentWillReceiveProps(nextProps) {
		this.setState({editMode:this.state.editMode,api:this.clone(nextProps.api)});
	},

	select(event){
		if(!event.isDefaultPrevented()){
			Actions.selectApi(this.props.api);
		}
	},

	cancel(event){
		event.preventDefault();
		this.setState({editMode:false,api:this.clone(this.props.api)});
	},

	edit(event){
		event.preventDefault();
		this.setState({editMode:true,api:this.state.api});
	},

	componentDidMount: function(){
		this.initValidator();
	},

	componentDidUpdate: function(){
		this.initValidator();
	},
	
	initValidator: function(){
		$('#apiEditorForm').validator();
	},
	
	remove(event){
		event.preventDefault();
		var r = confirm(`Etes vous sur de vouloir supprimer l'API [${this.props.api.name}]?`);
		if (r == true) {
			Actions.deleteApi(this.props.api);
		}
	},

	updateState:function(event){
		event.preventDefault();
		var api = this.state.api;
		api[event.target.id]=event.target.value;
		this.setState({editMode:true,api:api});
	},

	handleSubmit: function(event){
		event.preventDefault();
		var formData=this.state.api;
		formData.uri=(formData.uri == null || formData.uri == undefined || formData.uri == '')? '/':formData.uri;
		Actions.editApi(this.props.api,formData);
		this.setState({editMode:false,api:this.state.api});
	},
	
	render: function() {
		const api=this.props.api;
		
		var ligneActive="";
		var selectable=this.select;
		
		if(this.props.selected){
			ligneActive+=" line-selected";
			selectable="";
		}
		
		if(this.state.editMode){
			return (
				<tr className={ligneActive} onClick={selectable}>
					<td colspan="2">
						<form id="apiEditorForm" data-toggle="validator" role="form" className="form-inline" action="" onSubmit={this.handleSubmit}>
							<div className="form-group form-group-xs has-feedback">
								<GSTooltip placement="top" text="Nom">
									<input type="text" pattern="^[\w_]*$" className="form-control" id="name" placeholder="default" value={this.state.api.name} onChange={this.updateState} required/>
								</GSTooltip>
								<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
							</div>
							<div className="form-group form-group-xs has-feedback">
								<GSTooltip placement="top" text="URI">
									<input type="text" pattern="^/[/.{}_&'()^@?=+[\]\#A-z0-9]*$" className="form-control" id="uri" placeholder="/" value={this.state.api.uri}  onChange={this.updateState} />
								</GSTooltip>
								<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
							</div>
							<div className="form-group form-group-xs has-feedback">
								<GSTooltip placement="top" text="Méthode">
									<select className="form-control" id="method" onChange={this.updateState} value={this.state.api.method} >
										<option value="POST">POST</option>
										<option value="GET">GET</option>
										<option value="PUT">PUT</option>
										<option value="DELETE">DELETE</option>
										<option value="HEAD">HEAD</option>
										<option value="OPTIONS">OPTIONS</option>
										<option value="TRACE">TRACE</option>
										<option value="CONNECT">CONNECT</option>
									</select>
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
						<ButtonGS handleClick={this.cancel} tooltip='Annuler' style='remove' glyph='ban-circle'/>
					</td>
				</tr>
			);
		}else{
			return (
				<tr className={ligneActive} onClick={selectable}> 
					<td><strong>{api.name}</strong></td>
					<td><strong>{api.method}</strong> - {api.uri}</td>
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