var React = require('react');
var Actions = require('../actions/Actions.js');
var ButtonDelete = require('./basic/ButtonDelete.jsx');

var Agent = React.createClass({
	
	select(event){
		if(!event.isDefaultPrevented()){
			Actions.selectAgent(this.props.agent);
		}
	},
	
	remove(event){
		event.preventDefault();
	},
	
	render: function() {
		const agent=this.props.agent;
		
		var changeStatus;
		var ligneActive="";
		var selectable="";
		
		if(!agent.status){
			ligneActive="active stopped";
		}else if(this.props.selected){
			ligneActive+=" line-selected";
		}else{
			selectable=this.select;
		}

		return (
				<tr className={ligneActive} onClick={selectable}> 
					<th scope="row">{agent.id}</th> 
					<td>{agent.hostname}</td> 
					<td>{agent.port}</td> 
					<td>
						<ButtonDelete handleClick={this.remove}/>
					</td> 
				</tr>
			 );
    }
});

module.exports = Agent;