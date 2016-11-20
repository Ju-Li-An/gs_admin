var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS =  require('./ButtonGS.jsx');

var ParamSimple = React.createClass({
	
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
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
					</td> 
				</tr>
			 );
    }
});

module.exports = ParamSimple;