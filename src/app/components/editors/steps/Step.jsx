var React = require('react');
var Actions = require('../../../actions/Actions.js');
var Glyphicon = require('react-bootstrap').Glyphicon;

var Step = React.createClass({

	select:function(event){
		event.preventDefault();
		if(this.props.enable && !this.props.active)
			Actions.selectStep(this.props.index);
	},

	render: function() {
		if(this.props.complete && !this.props.active){
			return(<li className="alert-success"><a href="#" onClick={this.select} className="text-muted" ><Glyphicon glyph="ok-sign"/> {this.props.title}</a></li>);
		}
		if(this.props.active && !this.props.complete){
			return(<li className="active"><a className="text-muted" onClick={this.select}  >{this.props.title}</a></li>);
		}
		if(this.props.active && this.props.complete){
			return(<li className="active"><a className="text-muted" onClick={this.select}  ><Glyphicon glyph="ok-sign"/> {this.props.title}</a></li>);
		}
		if(this.props.enable){
			return(<li><a href="#" onClick={this.select} className="text-muted" >{this.props.title}</a></li>);
		}
		return(<li className="disabled"><a className="text-muted" onClick={this.select} >{this.props.title}</a></li>);
    }
});

module.exports = Step;