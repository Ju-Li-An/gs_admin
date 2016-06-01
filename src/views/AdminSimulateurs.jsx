var React = require('react');
var AgentsPanel = require('../components/panels/AgentsPanel.jsx');
var ServicesPanel = require('../components/panels/ServicesPanel.jsx');
var ApisPanel = require('../components/panels/ApisPanel.jsx');
var TPsPanel = require('../components/panels/TPsPanel.jsx');
var ParamsPanel = require('../components/panels/ParamsPanel.jsx');
var PropsPanel = require('../components/panels/PropsPanel.jsx');
var DataSetsPanel = require('../components/panels/DataSetsPanel.jsx');
var DataSetDetailsPanel = require('../components/panels/DataSetDetailsPanel.jsx');
var TemplatePanel = require('../components/panels/TemplatePanel.jsx');

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