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
			editMode:false,
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

	handleSubmit: function(event){
		event.preventDefault();
		var formData=this.state.api;
		formData.uri=(formData.uri == null || formData.uri == undefined || formData.uri == '')? '/':formData.uri;
		Actions.editApi(this.clone(this.props.data),formData);
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