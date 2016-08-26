var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS = require('./ButtonGS.jsx');
var ApisStore = require('../../stores/ApisStore.js');
var GSTooltip = require('./GSTooltip.jsx');

var Operation = React.createClass({
	
	clone(a) {
	   return JSON.parse(JSON.stringify(a));
	},

	getInitialState:function(){
		if(this.props.onCancelAdd!=undefined){
			return {
				editMode:true,
				operation:ApisStore.getNewOperation()
			}
		}
		return {
			editMode:false,
			operation:this.clone(this.props.data)
		};
	},

	componentWillReceiveProps(nextProps) {
		this.setState({editMode:this.state.editMode,operation:this.clone(nextProps.data)});
	},

	select(event){
		if(!event.isDefaultPrevented() && this.props.onCancelAdd==undefined){
			Actions.selectOperation(this.props.data);
		}
	},

	cancel(event){
		event.preventDefault();
		if(this.props.onCancelAdd!=undefined){
			this.props.onCancelAdd();
		}
		this.setState({editMode:false,operation:this.clone(this.props.data)});
	},

	edit(event){
		event.preventDefault();
		this.setState({editMode:true,operation:this.state.operation});
	},

	componentDidMount: function(){
		this.initValidator();
	},

	componentDidUpdate: function(){
		this.initValidator();
	},
	
	initValidator: function(){
		$('#opeEditorForm').validator();
	},
	
	remove(event){
		event.preventDefault();
		var r = confirm(`Etes vous sur de vouloir supprimer l'Operation [${this.props.data.method}]?`);
		if (r == true) {
			Actions.deleteOperation(this.props.data);
		}
	},

	updateState:function(event){
		event.preventDefault();
		var data = this.state.operation;
		data[event.target.id]=event.target.value;
		this.setState({editMode:true,operation:data});
	},

	handleSubmit: function(event){
		event.preventDefault();
		if(this.props.onCancelAdd==undefined){
			Actions.editOperation(this.clone(this.props.data),this.state.operation);
			this.setState({editMode:false,operation:this.state.operation});
		}
		else
			this.props.onAdd(this.state.operation);	
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
					<td>
						<form id="opeEditorForm" data-toggle="validator" role="form" className="form-inline" action="" onSubmit={this.handleSubmit}>
							<div className="form-group form-group-xs has-feedback">
								<GSTooltip placement="top" text="Méthode">
									<select className="form-control" id="method" onChange={this.updateState} value={this.state.operation.method} >
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
								<button type="submit" className="btn btn-primary btn-xs" ref="submitOpeEditorForm">Valider</button>
							</div>
						</form>
					</td>
					<td>
						{
							this.props.onCancelAdd==undefined?(
								<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>):(null)
						}
						<ButtonGS handleClick={this.cancel} tooltip='Annuler' style='remove' glyph='ban-circle'/>
					</td>
				</tr>
			);
		}else{
			return (
				<tr className={ligneActive} onClick={selectable}> 
					<td><strong>{data.method}</strong></td>
					<td>
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
						<ButtonGS handleClick={this.edit} tooltip='Editer' style='add' glyph='pencil'/>
					</td> 
				</tr>
			 );
		}
    }
});

module.exports = Operation;