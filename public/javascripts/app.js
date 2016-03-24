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

// TP ACTIONS
"selectTp",

// Datasets ACTIONS
"selectDataset", "refreshDatasetsList",

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
			Actions.selectAgent(this.props.agent);
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
			return React.createElement(Agent, { agent: agent, selected: agent.id == this.state.selected.id });
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
},{"../actions/Actions.js":2,"../stores/AgentsStore.js":21,"./Agent.jsx":3,"./Panel.jsx":10}],5:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Actions = require('../actions/Actions.js');

var Api = React.createClass({
	displayName: 'Api',
	select: function select(event) {
		if (!event.isDefaultPrevented()) {
			Actions.selectApi(this.props.api);
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
			return React.createElement(Api, { api: api, selected: api.name == this.state.selected.name });
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
},{"../actions/Actions.js":2,"../stores/ApisStore.js":22,"./Api.jsx":5,"./Panel.jsx":10}],7:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Actions = require('../actions/Actions.js');

var DataSet = React.createClass({
	displayName: 'DataSet',
	select: function select(event) {
		if (!event.isDefaultPrevented()) {
			Actions.selectDataset(this.props.dataset);
		}
	},
	remove: function remove(event) {
		event.preventDefault();
	},


	render: function render() {
		var dataset = this.props.dataset;

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
				dataset.value
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

module.exports = DataSet;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2}],8:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var DataSetsStore = require('../stores/DataSetsStore.js');
var Panel = require('./Panel.jsx');

var DataSetDetailsPanel = React.createClass({
	displayName: 'DataSetDetailsPanel',

	mixins: [Reflux.listenTo(DataSetsStore, 'onStoreUpdate')],

	getInitialState: function getInitialState() {
		var data = DataSetsStore.getDefaultData();
		return { dataset: data.selected.dataset, parametres: data.selected.parametres };
	},

	onStoreUpdate: function onStoreUpdate(data) {
		this.setState({ dataset: data.selected.dataset, parametres: data.selected.parametres });
	},


	render: function render() {

		var obj = this.state.parametres;
		var parameters;
		if (obj != undefined) {
			parameters = Object.keys(obj).map(function (key) {
				return React.createElement(
					'tr',
					null,
					React.createElement(
						'th',
						{ scope: 'row' },
						key
					),
					React.createElement(
						'td',
						null,
						obj[key]
					)
				);
			});
		}

		var links = React.createElement(
			'a',
			{ href: '#', onClick: this.addDataset, className: 'pull-right btn-add', title: 'Ajouter un jdd' },
			React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' })
		);

		var title = "Detail - " + this.state.dataset.value;

		return React.createElement(
			Panel,
			{ title: title, links: links },
			React.createElement(
				'div',
				{ className: 'table' },
				React.createElement(
					'td',
					null,
					React.createElement(
						'table',
						{ className: 'table table-condensed table-hover' },
						React.createElement(
							'tbody',
							null,
							parameters
						)
					)
				)
			)
		);
	}
});

module.exports = DataSetDetailsPanel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"../stores/DataSetsStore.js":23,"./Panel.jsx":10}],9:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var DataSetsStore = require('../stores/DataSetsStore.js');
var DataSet = require('./DataSet.jsx');
var Panel = require('./Panel.jsx');

var DataSetsPanel = React.createClass({
	displayName: 'DataSetsPanel',

	mixins: [Reflux.listenTo(DataSetsStore, 'onStoreUpdate')],

	getInitialState: function getInitialState() {
		var data = DataSetsStore.getDefaultData();
		return { datasets: data.datasets, selected: data.selected, pages: data.pages, currentPage: data.currentPage };
	},

	onStoreUpdate: function onStoreUpdate(data) {
		this.setState({ datasets: data.datasets, selected: data.selected, pages: data.pages, currentPage: data.currentPage });
	},


	next: function next() {
		Actions.refreshDatasetsList(this.state.currentPage + 1);
	},

	previous: function previous() {
		Actions.refreshDatasetsList(this.state.currentPage - 1);
	},

	render: function render() {
		var datasets = this.state.datasets.map(function (dataset, index, array) {
			return React.createElement(DataSet, { dataset: dataset, selected: dataset.key == this.state.selected.dataset.key });
		}, this);

		var linkPrevious;
		if (this.state.currentPage != 1) {
			linkPrevious = React.createElement(
				'a',
				{ href: '#', onClick: this.previous, className: 'btn-add', title: 'Précédent' },
				React.createElement('span', { className: 'glyphicon glyphicon-menu-left', 'aria-hidden': 'true' })
			);
		}

		var linkNext;
		if (this.state.currentPage != this.state.pages) {
			linkNext = React.createElement(
				'a',
				{ href: '#', onClick: this.next, className: 'btn-add', title: 'Suivant' },
				React.createElement('span', { className: 'glyphicon glyphicon-menu-right', 'aria-hidden': 'true' })
			);
		}

		var links = React.createElement(
			'div',
			{ className: 'pull-right' },
			linkPrevious,
			linkNext,
			React.createElement(
				'a',
				{ href: '#', onClick: this.addDataset, className: 'btn-add', title: 'Ajouter un jdd' },
				React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' })
			)
		);

		return React.createElement(
			Panel,
			{ title: 'DataSets', links: links },
			React.createElement(
				'div',
				{ className: 'table' },
				React.createElement(
					'td',
					null,
					React.createElement(
						'table',
						{ className: 'table table-condensed table-hover' },
						React.createElement(
							'tbody',
							null,
							datasets
						)
					)
				)
			)
		);
	}
});

module.exports = DataSetsPanel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"../stores/DataSetsStore.js":23,"./DataSet.jsx":7,"./Panel.jsx":10}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Actions = require('../actions/Actions.js');

var Param = React.createClass({
	displayName: 'Param',
	remove: function remove(event) {
		event.preventDefault();
	},


	render: function render() {
		var param = this.props.param;

		return React.createElement(
			'tr',
			null,
			React.createElement(
				'th',
				{ scope: 'row' },
				param.name
			),
			React.createElement(
				'td',
				null,
				param.type
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

module.exports = Param;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2}],12:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var ApisStore = require('../stores/ApisStore.js');
var Param = require('./Param.jsx');
var Panel = require('./Panel.jsx');

var ParamsPanel = React.createClass({
	displayName: 'ParamsPanel',

	mixins: [Reflux.listenTo(ApisStore, 'onStoreUpdate')],

	getInitialState: function getInitialState() {
		var data = ApisStore.getDefaultData();
		return { params: [] };
	},

	onStoreUpdate: function onStoreUpdate(data) {
		this.setState({ params: data.selected.parameters });
	},


	addParam: function addParam() {},

	render: function render() {
		var params = this.state.params.map(function (param, index, array) {
			return React.createElement(Param, { param: param, selected: '' });
		}, this);

		var links = React.createElement(
			'a',
			{ href: '#', onClick: this.addParam, className: 'pull-right btn-add', title: 'Ajouter un paramètre' },
			React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' })
		);

		return React.createElement(
			Panel,
			{ title: 'Paramètre(s)', links: links },
			React.createElement(
				'table',
				{ className: 'table table-condensed table-hover' },
				React.createElement(
					'tbody',
					null,
					params
				)
			)
		);
	}
});

module.exports = ParamsPanel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"../stores/ApisStore.js":22,"./Panel.jsx":10,"./Param.jsx":11}],13:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var ApisStore = require('../stores/ApisStore.js');
var Panel = require('./Panel.jsx');

var PropsPanel = React.createClass({
	displayName: 'PropsPanel',

	mixins: [Reflux.listenTo(ApisStore, 'onStoreUpdate')],

	getInitialState: function getInitialState() {
		return {
			responseType: '',
			delay: 0,
			errorTemplate: '',
			regExpKeys: []
		};
	},

	onStoreUpdate: function onStoreUpdate(data) {
		this.setState({
			responseType: data.selected.responseType,
			delay: data.selected.delay,
			errorTemplate: data.selected.errorTemplate,
			regExpKeys: data.selected.regExpKeys
		});
	},


	render: function render() {

		var links = React.createElement(
			'a',
			{ href: '#', className: 'pull-right btn-add', title: 'Editer les propriétés' },
			React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' })
		);

		var regExps = this.state.regExpKeys.map(function (regExpKey, index, array) {
			return React.createElement(
				'tr',
				null,
				React.createElement(
					'th',
					{ scope: 'row' },
					'RegExp n°',
					index
				),
				React.createElement(
					'td',
					null,
					regExpKey.regle
				),
				React.createElement(
					'td',
					null,
					regExpKey.target
				)
			);
		});

		return React.createElement(
			Panel,
			{ title: 'Propriétés / Règles', links: links },
			React.createElement(
				'div',
				null,
				React.createElement(
					'strong',
					null,
					'Response Type: '
				),
				this.state.responseType
			),
			React.createElement(
				'div',
				null,
				React.createElement(
					'strong',
					null,
					'Delay: '
				),
				this.state.delay,
				' ms'
			),
			React.createElement(
				'div',
				null,
				React.createElement(
					'strong',
					null,
					'Error Template: '
				),
				this.state.errorTemplate
			),
			React.createElement(
				'table',
				{ className: 'table table-condensed' },
				React.createElement(
					'tbody',
					null,
					regExps
				)
			)
		);
	}
});

module.exports = PropsPanel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"../stores/ApisStore.js":22,"./Panel.jsx":10}],14:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Actions = require('../actions/Actions.js');

var Service = React.createClass({
	displayName: 'Service',
	select: function select(event) {
		if (!event.isDefaultPrevented()) {
			Actions.selectService(this.props.service);
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
},{"../actions/Actions.js":2}],15:[function(require,module,exports){
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
			return React.createElement(Service, { service: service, selected: service.basepath === this.state.selected.basepath });
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
},{"../actions/Actions.js":2,"../stores/ServicesStore.js":24,"./Panel.jsx":10,"./Service.jsx":14}],16:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Actions = require('../actions/Actions.js');

var TP = React.createClass({
	displayName: 'TP',
	remove: function remove(event) {
		event.preventDefault();
	},


	render: function render() {
		var tp = this.props.tp;

		var keyClassName = this.props.isKey ? "info" : "";

		return React.createElement(
			'tr',
			{ className: keyClassName },
			React.createElement(
				'th',
				{ scope: 'row' },
				tp.name
			),
			React.createElement(
				'td',
				null,
				tp.source
			),
			tp.path ? React.createElement(
				'td',
				null,
				tp.path
			) : React.createElement('td', null),
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

module.exports = TP;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2}],17:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var ApisStore = require('../stores/ApisStore.js');
var TP = require('./TP.jsx');
var Panel = require('./Panel.jsx');

var TPsPanel = React.createClass({
	displayName: 'TPsPanel',

	mixins: [Reflux.listenTo(ApisStore, 'onStoreUpdate')],

	getInitialState: function getInitialState() {
		var data = ApisStore.getDefaultData();
		return { tps: [], keys: [] };
	},

	onStoreUpdate: function onStoreUpdate(data) {
		this.setState({ tps: data.selected.transferProperties, keys: data.selected.keys });
	},


	addTp: function addTp() {},

	render: function render() {
		var tps = this.state.tps.map(function (tp, index, array) {
			var tpKey = 0;
			for (var idKey in this.state.keys) {
				if (this.state.keys[idKey].name == tp.name) {
					tpKey = 1;
					break;
				}
			}
			return React.createElement(TP, { tp: tp, isKey: tpKey });
		}, this);

		var links = React.createElement(
			'a',
			{ href: '#', onClick: this.addTp, className: 'pull-right btn-add', title: 'Ajouter une Transfert Property' },
			React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' })
		);

		return React.createElement(
			Panel,
			{ title: 'Transfert(s)', links: links },
			React.createElement(
				'table',
				{ className: 'table table-condensed table-hover' },
				React.createElement(
					'tbody',
					null,
					tps
				)
			)
		);
	}
});

module.exports = TPsPanel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"../stores/ApisStore.js":22,"./Panel.jsx":10,"./TP.jsx":16}],18:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
//var AceEditor = require('react-ace');
//var hljs = require('./highlight.js');

var Actions = require('../actions/Actions.js');
var DataSetsStore = require('../stores/DataSetsStore.js');
var Panel = require('./Panel.jsx');

var TemplatePanel = React.createClass({
	displayName: 'TemplatePanel',

	mixins: [Reflux.listenTo(DataSetsStore, 'onStoreUpdate')],

	getInitialState: function getInitialState() {
		var data = DataSetsStore.getDefaultData();
		return { name: data.selected.template.name, content: data.selected.template.content };
	},

	onStoreUpdate: function onStoreUpdate(data) {
		this.setState({ name: data.selected.template.name, content: data.selected.template.content });
	},

	/*componentDidMount: function () {
    this.highlightCode();
  },
  componentDidUpdate: function () {
    this.highlightCode();
  },
 
 highlightCode: function () {
    var domNode = ReactDOM.findDOMNode(this);
    var nodes = domNode.querySelectorAll('pre code');
    if (nodes.length > 0) {
      for (var i = 0; i < nodes.length; i=i+1) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  },*/

	render: function render() {

		var links = React.createElement(
			'a',
			{ href: '#', onClick: this.addDataset, className: 'pull-right btn-add', title: 'Modifier le template' },
			React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' })
		);

		var title = "Template - " + this.state.name;

		var content = this.state.content;
		var document = "";

		if (content) {
			document = content.documentElement.outerHTML;
		}

		return React.createElement(
			Panel,
			{ title: title, links: links },
			React.createElement(
				'pre',
				null,
				React.createElement(
					'code',
					{ className: 'template' },
					document
				)
			)
		);
	}
});

module.exports = TemplatePanel;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"../stores/DataSetsStore.js":23,"./Panel.jsx":10}],19:[function(require,module,exports){
(function (global){
'use strict';

var ReactDOM = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);
var routes = require('./routes.jsx');

ReactDOM.render(routes, document.getElementById('app'));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./routes.jsx":20}],20:[function(require,module,exports){
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
},{"./App.jsx":1,"./views/AdminSimulateurs.jsx":25}],21:[function(require,module,exports){
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

	onSelectAgent: function onSelectAgent(agent) {
		data.selected = agent;
		this.trigger(data);
	},

	onRefreshAgentList: function onRefreshAgentList() {
		data.selected = -1;
		for (var index in data.agents) {
			if (data.agents[index].status === 1) {
				data.selected = data.agents[index];
				break;
			}
		}
		this.trigger(data);
	},

	onDisableAgent: function onDisableAgent(agent) {
		data.agents[agent.id].status = 0;
		this.onRefreshAgentList();
	},

	getDefaultData: function getDefaultData() {
		this.onRefreshAgentList();
		return data;
	}
});

module.exports = AgentsStore;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2}],22:[function(require,module,exports){
(function (global){
'use strict';

var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var ServicesStore = require('./ServicesStore.js');

var data = {
	currentService: '',
	apis: [],
	agent: {},
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
		var service = storeData.selected;
		data.agent = storeData.agent;
		data.currentService = service.basepath;

		data.apis = [];
		data.selected = -1;

		service.apis.map(function (api) {
			api.operations.map(function (operation) {
				operation.name = api.name;
				operation.uri = api.uri, operation.id = data.apis.length;
				data.apis.push(operation);
			});
		});

		if (data.apis.length > 0) data.selected = data.apis[0];

		this.trigger(data);
	},

	onSelectApi: function onSelectApi(api) {
		data.selected = api;
		this.trigger(data);
	},

	getDefaultData: function getDefaultData() {
		return data;
	}
});

module.exports = ApisStore;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"./ServicesStore.js":24}],23:[function(require,module,exports){
(function (global){
'use strict';

var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var ApisStore = require('./ApisStore.js');

var dataSetsPerPage = 8;

var data = {
	datasets: [],
	currentService: '',
	currentApi: '',
	currentOpe: '',
	agent: {},
	selected: { dataset: {}, parametres: {}, template: {} },
	currentPage: 1,
	pages: 1
};

var DataSetsStore = Reflux.createStore({

	init: function init() {
		this.listenToMany(Actions);
		this.listenTo(ApisStore, this.onApisStoreChange);
	},

	onApisStoreChange: function onApisStoreChange(storeData) {
		if (storeData.selected === -1) {
			return;
		}
		data.agent = storeData.agent;
		data.currentService = storeData.currentService;
		data.currentApi = storeData.selected.name;
		data.currentOpe = storeData.selected.method;

		//si le statut de l'agent est arrêté, on ne tente pas l'appel pour afficher les services
		if (!data.agent.status) {
			return;
		}

		// Rafrachissement de la liste des JDDs
		this.onRefreshDatasetsList(1);
	},

	onRefreshDatasetsList: function onRefreshDatasetsList(pageNum) {
		var _this = this;

		data.datasets = [];
		data.selected = {};
		var count = 0;

		var agentUrl = 'http://' + data.agent.hostname + ':' + data.agent.port + '/';

		// Récupération de la liste des Services
		$.ajax({
			url: '' + agentUrl + data.currentService + '/' + data.currentApi + '/' + data.currentOpe + '/datasets?pageNum=' + pageNum + '&pageSize=' + dataSetsPerPage + '&filter=null',
			type: "GET",
			dataType: "json",
			success: function success(result) {
				data.datasets = result.page;
				data.pages = Math.ceil(result.totalSize / dataSetsPerPage);
				data.currentPage = pageNum;
				if (data.datasets.length > 0) {
					_this.onSelectDataset(data.datasets[0]);
				}
			},
			error: function error(x, t, m) {
				// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
				Actions.disableAgent(data.agent);
			}
		});
	},

	// Change le service sélectionné
	onSelectDataset: function onSelectDataset(dataset) {
		var _this2 = this;

		var agentUrl = 'http://' + data.agent.hostname + ':' + data.agent.port + '/';

		// Récupération de la liste des Services
		$.ajax({
			url: '' + agentUrl + data.currentService + '/' + data.currentApi + '/' + data.currentOpe + '/dataset/' + dataset.key,
			type: "GET",
			dataType: "json",
			success: function success(result) {
				data.selected.parametres = result;
				data.selected.dataset = dataset;
				_this2.getTemplate();
			},
			error: function error(x, t, m) {
				// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
				Actions.disableAgent(data.agent);
			}
		});
	},

	getTemplate: function getTemplate() {
		var _this3 = this;

		var agentUrl = 'http://' + data.agent.hostname + ':' + data.agent.port + '/';

		var template = data.selected.parametres['template'];
		$.ajax({
			url: '' + agentUrl + data.currentService + '/' + data.currentApi + '/' + data.currentOpe + '/template/' + template,
			type: "GET",
			success: function success(result) {
				data.selected.template = { name: template, content: result };
				_this3.trigger(data);
			},
			error: function error(x, t, m) {
				// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
				Actions.disableAgent(data.agent);
			}
		});
	},

	getDefaultData: function getDefaultData() {
		return data;
	}
});

module.exports = DataSetsStore;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"./ApisStore.js":22}],24:[function(require,module,exports){
(function (global){
'use strict';

var Reflux = (typeof window !== "undefined" ? window['Reflux'] : typeof global !== "undefined" ? global['Reflux'] : null);
var Actions = require('../actions/Actions.js');
var AgentsStore = require('./AgentsStore.js');

var data = {
	services: [],
	agent: {},
	selected: -1,
	currentPage: 1
};

var ServicesStore = Reflux.createStore({

	init: function init() {
		this.listenToMany(Actions);
		this.listenTo(AgentsStore, this.onAgentsStoreChange);
	},

	//En cas de changement sur les données des agents
	onAgentsStoreChange: function onAgentsStoreChange(storeData) {
		if (storeData.selected === -1) {
			return;
		}
		data.agent = storeData.selected;

		//si le statut de l'agent est arrêté, on ne tente pas l'appel pour afficher les services
		if (!data.agent.status) {
			return;
		}

		// Rafrachissement de la liste des services après changement de l'agent
		this.onRefreshServiceList();
	},

	onRefreshServiceList: function onRefreshServiceList() {
		var _this = this;

		data.services = [];
		data.selected = -1;
		var count = 0;

		var agentUrl = 'http://' + data.agent.hostname + ':' + data.agent.port + '/';

		// Récupération de la liste des Services
		$.ajax({
			url: agentUrl + 'list',
			type: "GET",
			dataType: "json",
			context: data.agent,
			success: function success(result) {

				// Pour chaque servie, récupération de sa configuration
				result.forEach(function (res, index, array) {
					$.ajax({
						url: agentUrl + res,
						type: "GET",
						dataType: "json",
						success: function success(srv) {
							var id = count++;
							if (srv.state == 'running') {
								srv.status = 1;
								if (data.selected == -1) data.selected = srv;
							} else {
								srv.status = 0;
							}
							data.services.push(srv);

							// Lorsqu'on a terminé la liste
							if (id == array.length - 1) {
								_this.trigger(data);
							}
						}
					});
				});
			}
		}).fail(function () {
			// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
			Actions.disableAgent(this);
		});
	},

	// Change le service sélectionné
	onSelectService: function onSelectService(service) {
		data.selected = service;
		this.trigger(data);
	},

	getDefaultData: function getDefaultData() {
		return data;
	}
});

module.exports = ServicesStore;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions.js":2,"./AgentsStore.js":21}],25:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
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
					{ className: 'col-lg-4' },
					React.createElement(ServicesPanel, null)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-5' },
					React.createElement(ApisPanel, null)
				)
			),
			React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-lg-5' },
					React.createElement(TPsPanel, null)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-4' },
					React.createElement(ParamsPanel, null)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-3' },
					React.createElement(PropsPanel, null)
				)
			),
			React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-lg-3' },
					React.createElement(DataSetsPanel, null)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-3' },
					React.createElement(DataSetDetailsPanel, null)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-6' },
					React.createElement(TemplatePanel, null)
				)
			)
		);
	}

});

module.exports = AdminSimulateurs;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../components/AgentsPanel.jsx":4,"../components/ApisPanel.jsx":6,"../components/DataSetDetailsPanel.jsx":8,"../components/DataSetsPanel.jsx":9,"../components/ParamsPanel.jsx":12,"../components/PropsPanel.jsx":13,"../components/ServicesPanel.jsx":15,"../components/TPsPanel.jsx":17,"../components/TemplatePanel.jsx":18}]},{},[19]);
