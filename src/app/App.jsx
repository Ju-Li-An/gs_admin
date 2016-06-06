var React = require('react');
var PropTypes = require('react').PropTypes;
var Link = require('react-router').Link;

var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var App = React.createClass({

	propTypes: {
        children: PropTypes.object
    },
		
	getInitialState: function() {
		return {
			menuToggle:""
		};
	},

	toggleMenu: function(event) {
		event.preventDefault();
		if(this.state.menuToggle=='toggled')
			this.setState({menuToggle:""});
		else
			this.setState({menuToggle:"toggled"});
    },
	
	render: function() {

		return(
			<div id="wrapper" className={this.state.menuToggle}>
				<div id="sidebar-wrapper">
					<ul className="sidebar-nav">
						<li className="sidebar-brand"><Link to="/"><span>Gen&SiS</span></Link></li>
						<li><Link to="/Simulateurs"><span>Simulateurs</span></Link></li>
						<li><a href="#">Statistiques</a></li>
						<li><a href="#">Aide</a></li>
					</ul>
					<Button href="#" id="menu-toggle" bsStyle="simple" bsSize="xsmall" onClick={this.toggleMenu}><Glyphicon glyph="menu-hamburger" /></Button>
				</div>
				
				<div id="page-content-wrapper">
					<div id="page-content-header">
						
					</div>
					{ this.props.children } 
				</div>
			</div>
		);
	}

});

module.exports=App;
