var React = require('react');
var Actions = require('../actions/Actions.js');
var ButtonDelete =  require('./basic/ButtonDelete.jsx');


var Service = React.createClass({
	
	select(event){
		if(!event.isDefaultPrevented()){
			Actions.selectService(this.props.service);
		}
	},
	
	remove(event){
		event.preventDefault();
	},
	
	//componentDidMount:function(){
	//		$(this.refs.tooltiped).tooltip();
	//},
	
	render: function() {
		const service=this.props.service;
		
		var changeStatus;
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
						<ButtonDelete handleClick={this.remove}/>
					</td> 
				</tr>
			 );
    }
});

module.exports = Service;