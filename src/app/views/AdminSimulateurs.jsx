var React = require('react');
var AgentsPanel = require('../components/panels/AgentsPanel.jsx');
var ServicesPanel = require('../components/panels/ServicesPanel.jsx');
var ApisPanel = require('../components/panels/ApisPanel.jsx');
var OperationsPanel = require('../components/panels/OperationsPanel.jsx');
var TPsPanel = require('../components/panels/TPsPanel.jsx');
var ParamsPanel = require('../components/panels/ParamsPanel.jsx');
var PropsPanel = require('../components/panels/PropsPanel.jsx');
var DataSetsPanel = require('../components/panels/DataSetsPanel.jsx');
var DataSetDetailsPanel = require('../components/panels/DataSetDetailsPanel.jsx');
var TemplatePanel = require('../components/panels/TemplatePanel.jsx');
var Editor = require('../components/editors/Editor.jsx');
var NotifyStore = require('../stores/NotifyStore.js');
import NotificationSystem from 'react-notification-system';
var Glyphicon = require('react-bootstrap').Glyphicon;

var style = {
  Containers: { 
    DefaultStyle: { 
      padding: '25px 10px 10px 10px'
    }
  }
}

var AdminSimulateurs = React.createClass({
	mixins: [
			Reflux.listenTo(NotifyStore, 'onStoreUpdate')
	],
	_notificationSystem: null,

	getInitialState: function() {
		return({history:[]});
	},

	onStoreUpdate:function(data){
		this._notificationSystem.addNotification(data.notification);

		this.setState({history:data.history});
	},

	displayHistory:function(event){
		event.preventDefault();
	},

	componentDidMount() {
		$.ajaxSetup({timeout:1000});
		this._notificationSystem = this.refs.notificationSystem;
	},

	render: function() {

		return(
			<div id="grid">
				<div id="page-content-header">
					<div className="profil pull-right">
						JuLiAn  <Glyphicon glyph="bell" />{this.state.history.length}
					</div>	
				</div>
				<NotificationSystem ref="notificationSystem" style={style} allowHTML='true'/>
				<div className="row">
					<div className="col-lg-3">
						<AgentsPanel/>
					</div>
					<div className="col-lg-4">
						<ServicesPanel/>
					</div>
					<div className="col-lg-3">
						<ApisPanel/>
					</div>
					<div className="col-lg-2">
						<OperationsPanel/>
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

				<Editor/>
				
			</div>
		);
	
	}

});

module.exports = AdminSimulateurs;