var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonDelete = require('./ButtonDelete.jsx');

var Api = React.createClass({
	
	select(event){
		if(!event.isDefaultPrevented()){
			Actions.selectApi(this.props.api);
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
					<th scope="row">{api.name}</th> 
					<td>{api.method} : {api.uri}</td> 
					<td>
						<ButtonDelete handleClick={this.remove}/>
					</td> 
				</tr>
			 );
    }
});

module.exports = Api;