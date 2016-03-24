var React = require('react');
var Actions = require('../actions/Actions.js');

var TP = React.createClass({
	
	remove(event){
		event.preventDefault();
	},
	
	render: function() {
		const tp=this.props.tp;
		
		var keyClassName=this.props.isKey?"info":"";
			
		return (
				<tr className={keyClassName}> 
					<th scope="row">{tp.name}</th> 
					<td>{tp.source}</td>
					{
						tp.path ? (
							<td>{tp.path}</td>
						) : (<td></td>)}
					<td>
						<a href="#" onClick={this.remove} className="btn-remove pull-right"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
					</td> 
				</tr>
			 );
    }
});

module.exports = TP;