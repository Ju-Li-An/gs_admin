var React = require('react');
var Actions = require('../actions/Actions.js');

var Api = React.createClass({
	
	select(event){
		if(!event.isDefaultPrevented()){
			Actions.selectApi(this.props.api.id);
		}
	},
	
	remove(event){
		event.preventDefault();
	},
	
	render: function() {
		const api=this.props.api;
		
		var ligneActive="";
		var selectable=this.select;
		
		if(this.props.selected){
			ligneActive+=" line-selected";
		}
		
		return (
				<tr className={ligneActive} onClick={selectable}> 
					<th scope="row">{api.id}</th> 
					<td>{api.name}</td> 
					<td>{api.method} : {api.uri}</td> 
					<td>
						<a href="#" onClick={this.remove} className="btn-remove pull-right"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
					</td> 
				</tr>
			 );
    }
});

module.exports = Api;