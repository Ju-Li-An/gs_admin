var React = require('react');
var Api = require('./api.jsx');
var OperationList = require('./operationList.jsx');

var ApiList = React.createClass({
		getInitialState: function() {
			return {selected:[]};
		},
		
		//componentDidMount: function() {
				//this.setState({apis: this.props.apis, selected=this.props.apis[0]});
		//},
		
		handleonClick: function(api){
			this.setState({selected:api});
		},
	
		render: function(){
			var apis = this.props.apis.map(function(api,index,array) {
				return (
					<Api index={index} api={api} onClick={this.handleonClick}/>
				);
			},this);
			
			var operationList;
			if(this.state.selected.operations != undefined ){
				operationList=<OperationList agent={this.props.agent} operations={this.state.selected.operations} uri={this.state.selected.uri} />;
			}
		
			return(
				<div className="gs-bg-class">
					<p className="bg-primary">
						Service <b>{this.props.basepath}</b>
						<a className="btn btn-default btn-xs pull-right" role="button" href="#" ><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add</a>
					</p>
					<table className="table table-hover">
						<thead>
							<tr> 
								<th>Id</th> 
								<th>Name</th> 
								<th>URI</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{apis}
						</tbody>
					</table>
					{operationList}
				</div>
			);
		}
});

module.exports=ApiList;