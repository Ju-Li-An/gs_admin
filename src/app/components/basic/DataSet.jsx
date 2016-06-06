var React = require('react');
var Actions = require('../../actions/Actions.js');
var ButtonGS = require('./ButtonGS.jsx');

var DataSet = React.createClass({
	
	select(event){
		if(!event.isDefaultPrevented()){
			Actions.selectDataset(this.props.dataset);
		}
	},
	
	remove(event){
		event.preventDefault();
	},
	
	render: function() {
		const dataset=this.props.dataset;
		
		var ligneActive="";
		var selectable=this.select;
		
		if(this.props.selected){
			ligneActive+=" line-selected";
			selectable="";
		}
		
		return (
				<tr className={ligneActive} onClick={selectable}> 
					<th scope="row">{dataset.value}</th> 
					<td>
						<ButtonGS handleClick={this.remove} tooltip='Supprimer' style='remove' glyph='remove'/>
					</td> 
				</tr>
			 );
    }
});

module.exports = DataSet;