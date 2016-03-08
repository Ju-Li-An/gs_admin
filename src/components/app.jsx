var React = require('react'),
    ServiceList = require('./serviceList.jsx');

var AgentControl = React.createClass({

	render: function() {
		return(<ServiceList agent={this.props.agent}/>);
	}

});

ReactDOM.render(<AgentControl agent="localhost:9080" />, document.getElementById('page-content-wrapper'));