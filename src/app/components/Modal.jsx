var React = require('react');
var PropTypes = require('react').PropTypes;

var Modal = React.createClass({

	propTypes: {
        children: PropTypes.object
   },

	render: function() {
	
		return (
				<div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby={this.props.title}>
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
								<h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
							</div>
							<div className="modal-body">
								{this.props.children}
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
		);
    }
});

module.exports = Modal;