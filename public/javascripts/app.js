(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var PropTypes = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null).PropTypes;
var Router = (typeof window !== "undefined" ? window['ReactRouter'] : typeof global !== "undefined" ? global['ReactRouter'] : null).Router;
var Route = (typeof window !== "undefined" ? window['ReactRouter'] : typeof global !== "undefined" ? global['ReactRouter'] : null).Route;
var Link = (typeof window !== "undefined" ? window['ReactRouter'] : typeof global !== "undefined" ? global['ReactRouter'] : null).Link;

var App = React.createClass({
	displayName: 'App',


	propTypes: {
		children: PropTypes.object
	},

	getInitialState: function getInitialState() {
		return { menuToggle: "" };
	},

	toggleMenu: function toggleMenu(event) {
		event.preventDefault();
		if (this.state.menuToggle == 'toggled') this.setState({ menuToggle: "" });else this.setState({ menuToggle: "toggled" });
	},

	render: function render() {
		return React.createElement(
			'div',
			{ id: 'wrapper', className: this.state.menuToggle },
			React.createElement(
				'div',
				{ id: 'sidebar-wrapper' },
				React.createElement(
					'ul',
					{ className: 'sidebar-nav' },
					React.createElement(
						'li',
						{ className: 'sidebar-brand' },
						React.createElement(
							Link,
							{ to: '/' },
							React.createElement(
								'span',
								null,
								'Gen&SiS'
							)
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							Link,
							{ to: '/simulateurs' },
							React.createElement(
								'span',
								null,
								'Simulateurs'
							)
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ href: '#' },
							'Statistiques'
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ href: '#' },
							'Aide'
						)
					)
				)
			),
			React.createElement('a', { href: '#', id: 'menu-toggle', onClick: this.toggleMenu, className: 'glyphicon glyphicon-menu-hamburger' }),
			React.createElement(
				'div',
				{ id: 'page-content-wrapper' },
				this.props.children
			)
		);
	}

});

module.exports = App;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
"use strict";

var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);

var Actions = Reflux.createActions([
// SERVICES ACTIONS
"updateServices", "selectService",

// API ACTIONS
"selectApi",

// AGENT ACTIONS
"selectAgent", "disableAgent", "refreshAgentList"]);

module.exports = Actions;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Actions = require('../actions/Actions.js');

var Agent = React.createClass({
	displayName: 'Agent',
	select: function select(event) {
		if (!event.isDefaultPrevented()) {
			Actions.selectAgent(this.props.agent.id);
		}
	},
	remove: function remove(event) {
		event.preventDefault();
	},


	render: function render() {
		var agent = this.props.agent;

		var changeStatus;
		var ligneActive = "";
		var selectable = "";

		if (!agent.status) {
			ligneActive = "active stopped";
		} else if (this.props.selected) {
			ligneActive += " line-selected";
		} else {
			selectable = this.select;
		}

		return React.createElement(
			'tr',
			{ className: ligneActive, onClick: selectable },
			React.createElement(
				'th',
				{ scope: 'row' },
				agent.id
			),
			React.createElement(
				'td',
				null,
				agent.hostname
			),
			React.createElement(
				'td',
				null,
				agent.port
			),
			React.createElement(
				'td',
				null,
				React.createElement(
					'a',
					{ href: '#', onClick: this.remove, className: 'btn-remove pull-right' },
					React.createElement('span', { className: 'glyphicon glyphicon-remove', 'aria-hidden': 'true' })
				)
			)
		);
	}
});

module.exports = Agent;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2}],4:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var AgentsStore = require('../stores/AgentsStore.js');
var Agent = require('./Agent.jsx');
var Panel = require('./Panel.jsx');

var AgentsPanel = React.createClass({
	displayName: 'AgentsPanel',

	mixins: [Reflux.listenTo(AgentsStore, 'onStoreUpdate')],

	getInitialState: function getInitialState() {
		var data = AgentsStore.getDefaultData();
		return { agents: data.agents, selected: data.selected };
	},

	onStoreUpdate: function onStoreUpdate(data) {
		this.setState({ agents: data.agents, selected: data.selected });
	},
	addAgent: function addAgent() {},
	refreshList: function refreshList() {
		Actions.refreshAgentList();
	},


	render: function render() {
		var agents = this.state.agents.map(function (agent, index, array) {
			return React.createElement(Agent, { agent: agent, selected: agent.id == this.state.selected });
		}, this);

		var links = React.createElement(
			'div',
			{ className: 'pull-right' },
			React.createElement(
				'a',
				{ href: '#', onClick: this.refreshList, className: 'btn-add', title: 'Actualiser la liste' },
				React.createElement('span', { className: 'glyphicon glyphicon-refresh', 'aria-hidden': 'true' })
			),
			React.createElement(
				'a',
				{ href: '#', onClick: this.addAgent, className: 'btn-add', title: 'Ajouter un agent' },
				React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' })
			)
		);

		return React.createElement(
			Panel,
			{ title: 'GeneSiS Agents', links: links },
			React.createElement(
				'table',
				{ className: 'table table-condensed table-hover' },
				React.createElement(
					'tbody',
					null,
					agents
				)
			)
		);
	}
});

module.exports = AgentsPanel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"../stores/AgentsStore.js":12,"./Agent.jsx":3,"./Panel.jsx":7}],5:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Actions = require('../actions/Actions.js');

var Api = React.createClass({
	displayName: 'Api',
	select: function select(event) {
		if (!event.isDefaultPrevented()) {
			Actions.selectApi(this.props.api.id);
		}
	},
	remove: function remove(event) {
		event.preventDefault();
	},


	render: function render() {
		var api = this.props.api;

		var ligneActive = "";
		var selectable = this.select;

		if (this.props.selected) {
			ligneActive += " line-selected";
		}

		return React.createElement(
			'tr',
			{ className: ligneActive, onClick: selectable },
			React.createElement(
				'th',
				{ scope: 'row' },
				api.id
			),
			React.createElement(
				'td',
				null,
				api.name
			),
			React.createElement(
				'td',
				null,
				api.method,
				' : ',
				api.uri
			),
			React.createElement(
				'td',
				null,
				React.createElement(
					'a',
					{ href: '#', onClick: this.remove, className: 'btn-remove pull-right' },
					React.createElement('span', { className: 'glyphicon glyphicon-remove', 'aria-hidden': 'true' })
				)
			)
		);
	}
});

module.exports = Api;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2}],6:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var ApisStore = require('../stores/ApisStore.js');
var Api = require('./Api.jsx');
var Panel = require('./Panel.jsx');

var ApisPanel = React.createClass({
	displayName: 'ApisPanel',

	mixins: [Reflux.listenTo(ApisStore, 'onStoreUpdate')],

	getInitialState: function getInitialState() {
		var data = ApisStore.getDefaultData();
		return { apis: data.apis, selected: data.selected };
	},

	onStoreUpdate: function onStoreUpdate(data) {
		this.setState({ apis: data.apis, selected: data.selected });
	},


	render: function render() {
		var apis = this.state.apis.map(function (api, index, array) {
			return React.createElement(Api, { api: api, selected: index == this.state.selected });
		}, this);

		var links = React.createElement(
			'a',
			{ href: '#', onClick: this.addApi, className: 'pull-right btn-add', title: 'Ajouter une API / Opération' },
			React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' })
		);

		return React.createElement(
			Panel,
			{ title: 'Apis / Opérations', links: links },
			React.createElement(
				'table',
				{ className: 'table table-condensed table-hover' },
				React.createElement(
					'tbody',
					null,
					apis
				)
			)
		);
	}
});

module.exports = ApisPanel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"../stores/ApisStore.js":13,"./Api.jsx":5,"./Panel.jsx":7}],7:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var PropTypes = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null).PropTypes;

var Panel = React.createClass({
	displayName: 'Panel',


	propTypes: {
		children: PropTypes.object
	},

	render: function render() {

		return React.createElement(
			'div',
			{ className: 'panel panel-default' },
			React.createElement(
				'div',
				{ className: 'panel-heading' },
				this.props.title,
				this.props.links
			),
			React.createElement(
				'div',
				{ className: 'panel-body' },
				this.props.children
			)
		);
	}
});

module.exports = Panel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Actions = require('../actions/Actions.js');

var Service = React.createClass({
	displayName: 'Service',
	select: function select(event) {
		if (!event.isDefaultPrevented()) {
			Actions.selectService(this.props.service.id);
		}
	},
	remove: function remove(event) {
		event.preventDefault();
	},


	render: function render() {
		var service = this.props.service;

		var changeStatus;
		var ligneActive = "";
		var selectable = this.select;

		if (!service.status) {
			ligneActive = "active stopped";
		}
		if (this.props.selected) {
			ligneActive += " line-selected";
			selectable = "";
		}

		return React.createElement(
			'tr',
			{ className: ligneActive, onClick: selectable },
			React.createElement(
				'th',
				{ scope: 'row' },
				service.id
			),
			React.createElement(
				'td',
				null,
				service.basepath
			),
			React.createElement(
				'td',
				null,
				React.createElement(
					'a',
					{ href: '#', onClick: this.remove, className: 'btn-remove pull-right' },
					React.createElement('span', { className: 'glyphicon glyphicon-remove', 'aria-hidden': 'true' })
				)
			)
		);
	}
});

module.exports = Service;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2}],9:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var ServicesStore = require('../stores/ServicesStore.js');
var Service = require('./Service.jsx');
var Panel = require('./Panel.jsx');

var ServicesPanel = React.createClass({
	displayName: 'ServicesPanel',

	mixins: [Reflux.listenTo(ServicesStore, 'onStoreUpdate')],

	getInitialState: function getInitialState() {
		var data = ServicesStore.getDefaultData();
		return { services: data.services, selected: data.selected };
	},

	onStoreUpdate: function onStoreUpdate(data) {
		this.setState({ services: data.services, selected: data.selected });
	},


	render: function render() {
		var services = this.state.services.map(function (service, index, array) {
			return React.createElement(Service, { service: service, selected: index == this.state.selected });
		}, this);

		var links = React.createElement(
			'a',
			{ href: '#', onClick: this.addService, className: 'pull-right btn-add', title: 'Ajouter un service' },
			React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' })
		);

		return React.createElement(
			Panel,
			{ title: 'Services', links: links },
			React.createElement(
				'table',
				{ className: 'table table-condensed table-hover' },
				React.createElement(
					'tbody',
					null,
					services
				)
			)
		);
	}
});

module.exports = ServicesPanel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"../stores/ServicesStore.js":14,"./Panel.jsx":7,"./Service.jsx":8}],10:[function(require,module,exports){
(function (global){
'use strict';

var ReactDOM = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);
var routes = require('./routes.jsx');

ReactDOM.render(routes, document.getElementById('app'));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./routes.jsx":11}],11:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Router = (typeof window !== "undefined" ? window['ReactRouter'] : typeof global !== "undefined" ? global['ReactRouter'] : null).Router;
var Route = (typeof window !== "undefined" ? window['ReactRouter'] : typeof global !== "undefined" ? global['ReactRouter'] : null).Route;
var Redirect = (typeof window !== "undefined" ? window['ReactRouter'] : typeof global !== "undefined" ? global['ReactRouter'] : null).Redirect;

var App = require('./App.jsx');
var AdminSimulateurs = require('./views/AdminSimulateurs.jsx');

module.exports = React.createElement(
    Router,
    null,
    React.createElement(
        Route,
        { component: App },
        React.createElement(Route, { name: 'simulateurs', path: '/simulateurs', component: AdminSimulateurs }),
        React.createElement(Redirect, { from: '/', to: '/simulateurs' })
    )
);


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./App.jsx":1,"./views/AdminSimulateurs.jsx":15}],12:[function(require,module,exports){
(function (global){
'use strict';

var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');

var data = {
	agents: [{ "id": 0, "hostname": "localhost", "port": "9080", "status": 1 }, { "id": 1, "hostname": "localhost", "port": "9081", "status": 0 }, { "id": 2, "hostname": "10.44.208.85", "port": "9080", "status": 1 }, { "id": 3, "hostname": "10.44.208.85", "port": "9081", "status": 1 }, { "id": 4, "hostname": "10.44.208.85", "port": "9081", "status": 1 }],
	selected: -1,
	currentPage: 1
};

var AgentsStore = Reflux.createStore({
	listenables: Actions,

	onSelectAgent: function onSelectAgent(id) {
		data.selected = id;
		this.trigger(data);
	},

	onRefreshAgentList: function onRefreshAgentList() {
		data.selected = -1;
		for (var index in data.agents) {
			if (data.agents[index].status === 1) {
				data.selected = index;
				break;
			}
		}
		this.trigger(data);
	},

	onDisableAgent: function onDisableAgent(id) {
		data.agents[id].status = 0;
		this.onRefreshAgentList();
	},

	getDefaultData: function getDefaultData() {
		this.onRefreshAgentList();
		return data;
	}
});

module.exports = AgentsStore;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2}],13:[function(require,module,exports){
(function (global){
'use strict';

var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var ServicesStore = require('./ServicesStore.js');

var data = {
	apis: [],
	selected: -1,
	currentPage: 1
};

var ApisStore = Reflux.createStore({

	init: function init() {
		this.listenToMany(Actions);
		this.listenTo(ServicesStore, this.onServicesStoreChange);
	},

	onServicesStoreChange: function onServicesStoreChange(storeData) {
		if (storeData.selected === -1) {
			return;
		}
		var services = storeData.services;
		var service = services[storeData.selected];

		data.apis = [];
		data.selected = -1;

		for (var idApi in service.apis) {
			var api = service.apis[idApi];

			for (var idOperation in api.operations) {
				var operation = api.operations[idOperation];

				operation.name = api.name;
				operation.uri = api.uri, operation.id = data.apis.length;

				data.apis.push(operation);
			}
		}
		data.selected = 0;

		this.trigger(data);
	},

	onSelectApi: function onSelectApi(id) {
		data.selected = id;
		this.trigger(data);
	},

	getDefaultData: function getDefaultData() {
		return data;
	}
});

module.exports = ApisStore;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"./ServicesStore.js":14}],14:[function(require,module,exports){
(function (global){
'use strict';

var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var AgentsStore = require('./AgentsStore.js');

var data = {
	services: [],
	selected: 0,
	currentPage: 1
};

var ServicesStore = Reflux.createStore({

	init: function init() {
		this.listenToMany(Actions);
		this.listenTo(AgentsStore, this.onAgentsStoreChange);
	},

	onAgentsStoreChange: function onAgentsStoreChange(storeData) {
		var _this = this;

		if (storeData.selected === -1) {
			return;
		}
		var agents = storeData.agents;
		var agent = agents[storeData.selected];

		//si le statut de l'agent est arrêté, on ne tente pas l'appel pour afficher les services
		if (!agent.status) {
			return;
		}

		data.services = [];
		data.selected = -1;
		var count = 0;
		$.ajax({
			url: 'http://' + agent.hostname + ':' + agent.port + '/list',
			type: "GET",
			dataType: "json",
			success: function success(result) {
				result.forEach(function (res, index, array) {
					$.ajax({
						url: 'http://' + agent.hostname + ':' + agent.port + '/' + res,
						type: "GET",
						dataType: "json",
						success: function success(srv) {
							srv.id = count++;
							if (srv.state == 'running') {
								srv.status = 1;
								if (data.selected == -1) data.selected = srv.id;
							} else {
								srv.status = 0;
							}
							data.services.push(srv);
							if (srv.id == array.length - 1) {
								_this.trigger(data);
							}
						}
					});
				});
			},
			error: function error(x, t, m) {
				Actions.disableAgent(agent.id);
			}
		});
	},

	onSelectService: function onSelectService(id) {
		data.selected = id;
		this.trigger(data);
	},

	getDefaultData: function getDefaultData() {
		return data;
	}
});

module.exports = ServicesStore;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"./AgentsStore.js":12}],15:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var AgentsPanel = require('../components/AgentsPanel.jsx');
var ServicesPanel = require('../components/ServicesPanel.jsx');
var ApisPanel = require('../components/ApisPanel.jsx');

var AdminSimulateurs = React.createClass({
	displayName: 'AdminSimulateurs',
	componentDidMount: function componentDidMount() {
		$.ajaxSetup({ timeout: 1000 });
	},


	render: function render() {
		return React.createElement(
			'div',
			{ id: 'grid' },
			React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-lg-3' },
					React.createElement(AgentsPanel, null)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-5' },
					React.createElement(ServicesPanel, null)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-4' },
					React.createElement(ApisPanel, null)
				)
			),
			React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-lg-3' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							'Propriétés'
						),
						React.createElement('div', { className: 'panel-body' })
					)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-5' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							'Transfert Properties'
						),
						React.createElement('div', { className: 'panel-body' })
					)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-4' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							'Paramètres'
						),
						React.createElement('div', { className: 'panel-body' })
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-lg-6' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							'Templates'
						),
						React.createElement('div', { className: 'panel-body' })
					)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-6' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							'DataSets'
						),
						React.createElement('div', { className: 'panel-body' })
					)
				)
			)
		);
	}

});

module.exports = AdminSimulateurs;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../components/AgentsPanel.jsx":4,"../components/ApisPanel.jsx":6,"../components/ServicesPanel.jsx":9}]},{},[10]);
