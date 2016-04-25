var React = require('react');
var Actions = require('../actions/Actions.js');

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
						<a href="#" onClick={this.remove} className="btn-remove pull-right"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
					</td> 
				</tr>
			 );
    }
});

module.exports = DataSet;