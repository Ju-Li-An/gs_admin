var React = require('react');

var Service = React.createClass({
	getInitialState: function() {
			return {data: []};
	},
	
	stop(){
		$.ajax({
			url: `http://${this.props.agent}/stop/${this.state.data.basepath}`,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(`http://${this.props.agent}/stop/${this.state.data.basepath}`, status, err.toString());
			}.bind(this)
		});
	},
	start(){
		$.ajax({
			url: `http://${this.props.agent}/start/${this.state.data.basepath}`,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(`http://${this.props.agent}/start/${this.state.data.basepath}`, status, err.toString());
			}.bind(this)
		});
	},
	
	remove(){
		if (confirm('Etes vous certains de vouloir supprimer le service?')) {

		}
	},
	
	componentDidMount() {
		$.ajax({
			url: `http://${this.props.agent}/${this.props.name}`,
			dataType: 'json',
			cache: false,
			success: function(data) {
				console.log(data);
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(`http://${this.props.agent}/${this.props.name}`, status, err.toString());
			}.bind(this)
		});
	},
	
	show(){
		if(this.props.onClick){
			this.props.onClick(this.state.data);
		}
	},
	
	render() {
		var changeStatus;
		if(this.state.data.state=='running'){
			changeStatus =<a className="btn btn-warning btn-xs"  href="#" role="button" onClick={this.stop}><span className="glyphicon glyphicon-stop" aria-hidden="true"></span> Stop</a>;
		}else{
			changeStatus =<a className="btn btn-success btn-xs" href="#" role="button" onClick={this.start}><span className="glyphicon glyphicon-play" aria-hidden="true"></span> Start</a>;
		}
		 var del = <a className="btn btn-danger btn-xs pull-right" href="#" role="button" onClick={this.remove}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a>;
		 
		 var view = <a className="btn btn-default btn-xs" href="#" role="button" onClick={this.show}><span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span> View</a>;
		
		return (
			<tr> 
				<th scope="row">{this.props.index}</th>
				<td>{this.state.data.basepath}</td>
				<td>{this.state.data.state}</td>
				<td>{view} {changeStatus} {del}</td>
			</tr>
		);
		
    }
	
});

module.exports = Service;