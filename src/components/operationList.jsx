var React = require('react');
var Operation = require('./operation.jsx');

var OperationList = React.createClass({
		getInitialState: function() {
			return {selected:[]};
		},
		
		//componentDidMount: function() {
				//this.setState({apis: this.props.apis, selected=this.props.apis[0]});
		//},
	
		render: function(){
			var operations = this.props.operations.map(function(operation,index,array) {
				return (
					<Operation index={index} operation={operation}/>
				);
			});
			
			return(
				<div className="gs-bg-class">
					<p className="bg-primary">
						<b>{this.props.uri}</b>
						<a className="btn btn-default btn-xs pull-right" role="button" href="#" ><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add</a>
					</p>
					<table className="table table-hover">
						<thead>
							<tr> 
								<th>Id</th> 
								<th>method</th> 
								<th>keys</th>
								<th>transferproperties</th>
								<th>parameters</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{operations}
						</tbody>
					</table>
				</div>
			);
		}
});

module.exports=OperationList;