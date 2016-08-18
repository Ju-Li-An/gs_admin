var React = require('react');
var Tooltip = require('react-bootstrap').Tooltip;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;


var GSTooltip = React.createClass({
	
	render: function() {
	
		const tooltip= (
			<Tooltip>{this.props.text}</Tooltip>
		);
			
		
		return (
				<OverlayTrigger placement={this.props.placement} overlay={tooltip}>
						{this.props.children}
				</OverlayTrigger>
					
			 );
    }
});

module.exports = GSTooltip;