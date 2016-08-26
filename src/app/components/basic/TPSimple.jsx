var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS = require('./ButtonGS.jsx');

var TPSimple = React.createClass({
	
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
					{
						tp.attr ? (
							<td>{tp.attr}</td>
						) : (<td></td>)}
					{
						tp.position ? (
							<td>{tp.position}</td>
						) : (<td></td>)}
					{
						tp.length ? (
							<td>{tp.length}</td>
						) : (<td></td>)}
					<td>
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
					</td> 
				</tr>
			 );
    }
});

module.exports = TPSimple;