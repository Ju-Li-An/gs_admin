var React = require('react');
var PropTypes = require('react').PropTypes;
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var Reflux = require('reflux');


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
						<li><Link to="/simulateurs"><span>Simulateurs</span></Link></li>
						<li><a href="#">Statistiques</a></li>
						<li><a href="#">Aide</a></li>
					</ul>
				</div>
				<a href="#" id="menu-toggle" onClick={this.toggleMenu} className="glyphicon glyphicon-menu-hamburger"></a>
				<div id="page-content-wrapper">
					{ this.props.children } 
				</div>
			</div>
		);
	}

});

module.exports=App;
