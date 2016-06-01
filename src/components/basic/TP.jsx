var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonDelete = require('./ButtonDelete.jsx');

var TP = React.createClass({
	
	remove(event){
		event.preventDefault();
		this.props.onDelete(this.props.tp);
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
						<ButtonDelete handleClick={this.remove}/>
					</td> 
				</tr>
			 );
    }
});

module.exports = TP;