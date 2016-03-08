var React = require('react');

var Api = React.createClass({
	getInitialState: function() {
			return {data: []};
	},
	
	componentDidMount: function() {
		
	},
	
	select: function(){
		if(this.props.onClick){
			this.props.onClick(this.props.api);
		}
	},
	
	render: function() {
	
		 var view = <a className="btn btn-default btn-xs" href="#" role="button" onClick={this.select}><span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span> View</a>;
		 
		return (
			<tr> 
				<th scope="row">{this.props.index}</th>
				<td>{this.props.api.name}</td>
				<td>{this.props.api.uri}</td>
				<td>{view}</td>
			</tr>
		);
	}
	
});

module.exports=Api;