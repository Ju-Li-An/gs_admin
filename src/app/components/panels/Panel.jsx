var React = require('react');
var PropTypes = require('react').PropTypes;

var Panel = React.createClass({

	propTypes: {
        children: PropTypes.object
   },

	onchange:function(event){
		this.props.search(event.target.value);
	},
		
	render: function() {
		var searchBox;
		if(this.props.search){
			searchBox=(
					<input type="text" onKeyUp={this.onchange} className="form-control searchbox" placeholder="Search for..."/>
				);
		}
		
		return (
				<div className="panel panel-default">
					<div className="panel-heading">
						<form className="form-inline">
							<div className="form-group">
								{this.props.title}
							</div>
							<div className="form-group">
								{searchBox}
							</div>
							<div className="form-group pull-right">
								{this.props.links}
							</div>
						</form>
					</div>
					<div className="panel-body">
						{this.props.children}
					</div>
				</div>
		);
    }
});

module.exports = Panel;