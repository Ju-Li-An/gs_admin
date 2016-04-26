var React = require('react');
var Actions = require('../actions/Actions.js');
var ButtonDelete =  require('./basic/ButtonDelete.jsx');

var Param = React.createClass({
	
	remove(event){
		event.preventDefault();
	},
	
	render: function() {
		const param=this.props.param;
		
		return (
				<tr> 
					<th scope="row">{param.name}</th> 
					<td>{param.type}</td>
					<td>
						<ButtonDelete handleClick={this.remove}/>
					</td> 
				</tr>
			 );
    }
});

module.exports = Param;