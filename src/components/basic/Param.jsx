var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonDelete =  require('./ButtonDelete.jsx');

var Param = React.createClass({
	
	remove(event){
		event.preventDefault();
		this.props.onDelete(this.props.param);
	},
	
	render: function() {
		const param=this.props.param;
		
		return (
				<tr> 
					<th scope="row">{param.name}</th> 
					<td>{param.type}</td>
					{
						param.arg ? (
							<td>{param.arg}</td>
						) : (<td></td>)}
					{
						param.arg2 ? (
							<td>{param.arg2}</td>
						) : (<td></td>)}
					<td>
						<ButtonDelete handleClick={this.remove}/>
					</td> 
				</tr>
			 );
    }
});

module.exports = Param;