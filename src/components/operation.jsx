var React = require('react');

var Operation = React.createClass({
	getInitialState: function() {
			return {data: []};
	},
	
	componentDidMount: function() {
		
	},
	
	render: function() {
	
		var tp=''
		this.props.operation.transferProperties.map(function(tprop,index, array) {
			if(index>0)
				tp+=', ';
			tp+=`${tprop.name}`
		});
		
		return (
			<tr> 
				<th scope="row">{this.props.index}</th>
				<td>{this.props.operation.method}</td>
				<td></td>
				<td>{tp}</td>
				<td></td>
				<td></td>
			</tr>
		);
	}
	
});

module.exports=Operation;