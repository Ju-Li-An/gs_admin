var React = require('react');
var AgentsPanel = require('../components/AgentsPanel.jsx');
var ServicesPanel = require('../components/ServicesPanel.jsx');
var ApisPanel = require('../components/ApisPanel.jsx');

var AdminSimulateurs = React.createClass({

	componentDidMount() {
		$.ajaxSetup({timeout:1000});
	},
	
	render: function() {
		return(
			<div id="grid">
				<div className="row">
					<div className="col-lg-3">
						<AgentsPanel/>
					</div>
					<div className="col-lg-5">
						<ServicesPanel/>
					</div>
					<div className="col-lg-4">
						<ApisPanel/>
					</div>
				</div>
				
				<div className="row">
					<div className="col-lg-3">
						<div className="panel panel-default">
							<div className="panel-heading">Propriétés</div>
							<div className="panel-body"></div>
						</div>
					</div>
					<div className="col-lg-5">
						<div className="panel panel-default">
							<div className="panel-heading">Transfert Properties</div>
							<div className="panel-body"></div>
						</div>
					</div>
					<div className="col-lg-4">
						<div className="panel panel-default">
							<div className="panel-heading">Paramètres</div>
							<div className="panel-body"></div>
						</div>
					</div>
				</div>
				
				<div className="row">
					<div className="col-lg-6">
						<div className="panel panel-default">
							<div className="panel-heading">Templates</div>
							<div className="panel-body"></div>
						</div>
					</div>
					<div className="col-lg-6">
						<div className="panel panel-default">
							<div className="panel-heading">DataSets</div>
							<div className="panel-body"></div>
						</div>
					</div>
				</div>
			</div>
		);
	
	}

});

module.exports = AdminSimulateurs;