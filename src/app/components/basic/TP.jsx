var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS = require('./ButtonGS.jsx');
var GSTooltip = require('./GSTooltip.jsx');
var ApisStore = require('../../stores/ApisStore.js');

var TP = React.createClass({
	
	clone(a) {
	   return JSON.parse(JSON.stringify(a));
	},

	getInitialState:function(){
		if(this.props.onCancelAdd!=undefined){
			return {
				editMode:true,
				tp:ApisStore.getNewTp()
			}
		}
		return {
			editMode:false,
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

	componentDidMount: function(){
		this.initValidator();
	},

	componentDidUpdate: function(){
		this.initValidator();
	},
	
	initValidator: function(){
		$('#tpEditorForm').validator();
	},

	updateState:function(event){
		var tp = this.state.tp;
		if(event.target.id=="isKey")
			tp["isKey"]=!tp["isKey"];
		else
			tp[event.target.id]=event.target.value;
		this.setState({editMode:true,tp:tp});
	},

	handleSubmit:function(event){
		event.preventDefault();
		if(this.props.onCancelAdd==undefined){
			Actions.editTp(this.props.tp,this.state.tp);
			this.setState({editMode:false,tp:this.state.tp});
		}
		else
			this.props.onAdd(this.state.tp);	

	},
	
	render: function() {
		const tp=this.props.tp;
		
		var keyClassName=this.props.isKey?"info":"";
		

		if(this.state.editMode){
			return (
				<tr> 
					<td colSpan="4">
						<form id="tpEditorForm" data-toggle="validator" role="form" action="" className="form-inline" onSubmit={this.handleSubmit}>
							
								<div className="form-group form-group-xs has-feedback">
									<GSTooltip placement="top" text="Nom">
										<input type="text" pattern="^[\w-_]*$" className="form-control" id="name" placeholder="Nom de la propriété" value={this.state.tp.name} onChange={this.updateState} required/>
									</GSTooltip>
									<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
								</div>
							
							
								<div className="form-group form-group-xs has-feedback">
									<GSTooltip placement="top" text="Source">
										<select className="form-control" id="source" onChange={this.updateState} value={this.state.tp.source}>
											<option value="BODY_XPATH">BODY_XPATH</option>
											<option value="QUERY">QUERY</option>
											<option value="PATH">PATH</option>
											<option value="HEADER">HEADER</option>
										</select>
									</GSTooltip>
									<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
								</div>

							{
								this.state.tp.source!='POSITION'? (
									<div className="form-group form-group-xs has-feedback">
										<GSTooltip placement="top" text="XPath or Path">
											<input type="text" className="form-control" id="path" placeholder="" value={this.state.tp.path} onChange={this.updateState} required/>
										</GSTooltip>
										<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
									</div>
								):null
							}		
								
		
							{
								this.state.tp.source=='BODY_XPATH'? (
									
										<div className="form-group form-group-xs has-feedback">
											<GSTooltip placement="top" text="Attribut">
												<input type="text" className="form-control" id="attr" placeholder="" value={this.state.tp.attr} onChange={this.updateState}/>
											</GSTooltip>
											<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
										</div>
									
								):null
							}

							{
								this.state.tp.source=='POSITION'? (
									
										<div className="form-group form-group-xs has-feedback">
											<GSTooltip placement="top" text="Position">
												<input type="text" className="form-control" id="position" placeholder="" value={this.state.tp.position} onChange={this.updateState} required/>
											</GSTooltip>
											<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
										</div>

								):null
							}

							{
								this.state.tp.source=='POSITION'? (
									
										<div className="form-group form-group-xs has-feedback">
											<GSTooltip placement="top" text="Longueur">
												<input type="text" className="form-control" id="length" placeholder="" value={this.state.tp.length} onChange={this.updateState} required/>
											</GSTooltip>
											<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
										</div>
									
								):null
							}

						
								<div className="checkbox">
									<div className="form-group form-group-xs">
										<label><input type="checkbox" id="isKey" checked={this.state.tp.isKey} onChange={this.updateState} />clé?</label>
									</div>
								</div>
							

							
								<div className="form-group">
									<button type="submit" className="btn btn-primary btn-xs" ref="submitTpEditorForm">Valider</button>
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
				<tr className={keyClassName}> 
					<th scope="row">{tp.name}</th> 
					<td>{tp.source}</td>
					<td>{tp.path}</td>
					{
						tp.attr ? (
							<td>{tp.attr}</td>
						) : null}
					{
						tp.position ? (
							<td>{tp.position}</td>
						) : null}
					{
						tp.length ? (
							<td>{tp.length}</td>
						) : null}
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