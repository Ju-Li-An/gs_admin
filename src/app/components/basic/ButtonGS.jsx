var React = require('react');
var Tooltip = require('react-bootstrap').Tooltip;
var Button = require('react-bootstrap').Button;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Glyphicon = require('react-bootstrap').Glyphicon;


var ButtonGS = React.createClass({
	
	render: function() {
	
		var button=(
			<Button href="#" bsStyle={this.props.style} bsSize="xsmall" onClick={this.props.handleClick}><Glyphicon glyph={this.props.glyph} /></Button>
		);
		
		if(this.props.tooltip){
			const tooltip= (
				<Tooltip>{this.props.tooltip}</Tooltip>
			);
			
			button=(
				<OverlayTrigger placement="top" overlay={tooltip}>
						{ button }
				</OverlayTrigger>
			);
		}
		
		return (
				<div className="pull-right">
						{ button }
				</div>
					
			 );
    }
});

module.exports = ButtonGS;