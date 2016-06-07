var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS =  require('./ButtonGS.jsx');


var Service = React.createClass({

	getInitialState:function(){
		return({edit:false});
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
		Actions.deleteService(this.props.service.basepath);
	},

	edit(event){
		event.preventDefault();
		this.setState({edit:true});
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
		
		return (
				<tr className={ligneActive} onClick={selectable}> 
					<th scope="row">{service.basepath}</th> 
					<td>
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
						<ButtonGS handleClick={service.status?this.stop:this.start} tooltip={service.status?'Stop':'Start'} style='add' glyph={service.status?'stop':'play'}/>
					</td> 
				</tr>
			 );
    }
});

module.exports = Service;