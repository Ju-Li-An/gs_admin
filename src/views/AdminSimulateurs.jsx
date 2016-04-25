var React = require('react');
var AgentsPanel = require('../components/AgentsPanel.jsx');
var ServicesPanel = require('../components/ServicesPanel.jsx');
var ApisPanel = require('../components/ApisPanel.jsx');
var TPsPanel = require('../components/TPsPanel.jsx');
var ParamsPanel = require('../components/ParamsPanel.jsx');
var PropsPanel = require('../components/PropsPanel.jsx');
var DataSetsPanel = require('../components/DataSetsPanel.jsx');
var DataSetDetailsPanel = require('../components/DataSetDetailsPanel.jsx');
var TemplatePanel = require('../components/TemplatePanel.jsx');

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
					<div className="col-lg-4">
						<ServicesPanel/>
					</div>
					<div className="col-lg-5">
						<ApisPanel/>
					</div>
				</div>
				
				<div className="row">
					<div className="col-lg-5">
						<TPsPanel/>
					</div>
					<div className="col-lg-4">
						<ParamsPanel/>
					</div>
					<div className="col-lg-3">
						<PropsPanel/>
					</div>
				</div>
				
				<div className="row">
					<div className="col-lg-4">
						<DataSetsPanel/>
					</div>
					<div className="col-lg-3">
						<DataSetDetailsPanel/>
					</div>
					<div className="col-lg-5">
						<TemplatePanel/>
					</div>
				</div>
			</div>
		);
	
	}

});

module.exports = AdminSimulateurs;