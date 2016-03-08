var React = require('react');
var Service = require('./service.jsx');
var ApiList = require('./apiList.jsx');

var ServiceList = React.createClass({
	getInitialState: function() {
		return {services: [], selected: []};
	},
	
	componentDidMount: function() {
		$.ajax({
			url: `http://${this.props.agent}/list`,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({services: data,selected:[]});
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error(`http://${this.props.agent}/list`, status, err.toString());
			}.bind(this)
		});
	},
	
	handleonClick: function(service){
		this.setState({services: this.state.services,selected: service});
	},

	render: function() {
		var services = this.state.services.map(function(service,index,array) {
			return (
				<Service agent={this.props.agent} name={service} index={index} onClick={this.handleonClick}/>
			);
		},this);
		
		var apiList;
		if(this.state.selected.apis != undefined ){
			apiList=<ApiList agent={this.props.agent} apis={this.state.selected.apis} basepath={this.state.selected.basepath} />;
		}
		
		return (
			<div className="gs-bg-class">
				<p className="bg-primary">Liste des services - http://{this.props.agent} <a className="btn btn-default btn-xs pull-right" role="button" href="#" ><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add</a></p>
				<table className="table table-hover">
					<thead>
						<tr> 
							<th>Id</th> 
							<th>Service</th> 
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{services}
					</tbody>
				</table>
				{apiList}
			</div>
		 );
    }

});

module.exports = ServiceList;