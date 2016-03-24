var React = require('react');
var Actions = require('../actions/Actions.js');

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
						<a href="#" onClick={this.remove} className="btn-remove pull-right"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
					</td> 
				</tr>
			 );
    }
});

module.exports = Param;