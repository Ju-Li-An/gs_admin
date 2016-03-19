var React = require('react');
var PropTypes = require('react').PropTypes;

var Panel = React.createClass({

	propTypes: {
        children: PropTypes.object
    },

	render: function() {
		
		return (
				<div className="panel panel-default">
					<div className="panel-heading">{this.props.title}
						{this.props.links}
					</div>
					<div className="panel-body">
						{this.props.children}
					</div>
				</div>
		);
    }
});

module.exports = Panel;