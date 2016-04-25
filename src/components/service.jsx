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
						<button className="btn-glyph-only btn-remove btn-xs pull-right" onClick={this.remove}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
					</td> 
				</tr>
			 );
    }
});

module.exports = Service;