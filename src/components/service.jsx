var React = require('react');
var Actions = require('../actions/Actions.js');

var Service = React.createClass({
	
	select(event){
		if(!event.isDefaultPrevented()){
			Actions.selectService(this.props.service);
		}
	},
	
	remove(event){
		event.preventDefault();
	},
	
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
						<a href="#" onClick={this.remove} className="btn-remove pull-right"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
					</td> 
				</tr>
			 );
    }
});

module.exports = Service;