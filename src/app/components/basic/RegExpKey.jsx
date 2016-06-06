var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS =  require('./ButtonGS.jsx');

var RegExpKey = React.createClass({
	
	remove(event){
		event.preventDefault();
		this.props.onDelete(this.props.data);
	},
	
	render: function() {
		const regexpkey=this.props.data;
		
		return (
				<tr> 
					<th scope="row">{regexpkey.regle}</th> 
					<td>{regexpkey.target}</td>
					<td>
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
					</td> 
				</tr>
			 );
    }
});

module.exports = RegExpKey;