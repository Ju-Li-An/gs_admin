(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var Api = React.createClass({
	displayName: "Api",

	getInitialState: function getInitialState() {
		return { data: [] };
	},

	componentDidMount: function componentDidMount() {},

	select: function select() {
		if (this.props.onClick) {
			this.props.onClick(this.props.api);
		}
	},

	render: function render() {

		var view = React.createElement(
			"a",
			{ className: "btn btn-default btn-xs", href: "#", role: "button", onClick: this.select },
			React.createElement("span", { className: "glyphicon glyphicon-eye-open", "aria-hidden": "true" }),
			" View"
		);

		return React.createElement(
			"tr",
			null,
			React.createElement(
				"th",
				{ scope: "row" },
				this.props.index
			),
			React.createElement(
				"td",
				null,
				this.props.api.name
			),
			React.createElement(
				"td",
				null,
				this.props.api.uri
			),
			React.createElement(
				"td",
				null,
				view
			)
		);
	}

});

module.exports = Api;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Api = require('./api.jsx');
var OperationList = require('./operationList.jsx');

var ApiList = React.createClass({
	displayName: 'ApiList',

	getInitialState: function getInitialState() {
		return { selected: [] };
	},

	//componentDidMount: function() {
	//this.setState({apis: this.props.apis, selected=this.props.apis[0]});
	//},

	handleonClick: function handleonClick(api) {
		this.setState({ selected: api });
	},

	render: function render() {
		var apis = this.props.apis.map(function (api, index, array) {
			return React.createElement(Api, { index: index, api: api, onClick: this.handleonClick });
		}, this);

		var operationList;
		if (this.state.selected.operations != undefined) {
			operationList = React.createElement(OperationList, { agent: this.props.agent, operations: this.state.selected.operations, uri: this.state.selected.uri });
		}

		return React.createElement(
			'div',
			{ className: 'gs-bg-class' },
			React.createElement(
				'p',
				{ className: 'bg-primary' },
				'Service ',
				React.createElement(
					'b',
					null,
					this.props.basepath
				),
				React.createElement(
					'a',
					{ className: 'btn btn-default btn-xs pull-right', role: 'button', href: '#' },
					React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
					' Add'
				)
			),
			React.createElement(
				'table',
				{ className: 'table table-hover' },
				React.createElement(
					'thead',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'th',
							null,
							'Id'
						),
						React.createElement(
							'th',
							null,
							'Name'
						),
						React.createElement(
							'th',
							null,
							'URI'
						),
						React.createElement(
							'th',
							null,
							'Actions'
						)
					)
				),
				React.createElement(
					'tbody',
					null,
					apis
				)
			),
			operationList
		);
	}
});

module.exports = ApiList;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./api.jsx":1,"./operationList.jsx":5}],3:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
    ServiceList = require('./serviceList.jsx');

var AgentControl = React.createClass({
	displayName: 'AgentControl',


	render: function render() {
		return React.createElement(ServiceList, { agent: this.props.agent });
	}

});

ReactDOM.render(React.createElement(AgentControl, { agent: 'localhost:9080' }), document.getElementById('page-content-wrapper'));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./serviceList.jsx":7}],4:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var Operation = React.createClass({
	displayName: 'Operation',

	getInitialState: function getInitialState() {
		return { data: [] };
	},

	componentDidMount: function componentDidMount() {},

	render: function render() {

		var tp = '';
		this.props.operation.transferProperties.map(function (tprop, index, array) {
			if (index > 0) tp += ', ';
			tp += '' + tprop.name;
		});

		return React.createElement(
			'tr',
			null,
			React.createElement(
				'th',
				{ scope: 'row' },
				this.props.index
			),
			React.createElement(
				'td',
				null,
				this.props.operation.method
			),
			React.createElement('td', null),
			React.createElement(
				'td',
				null,
				tp
			),
			React.createElement('td', null),
			React.createElement('td', null)
		);
	}

});

module.exports = Operation;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Operation = require('./operation.jsx');

var OperationList = React.createClass({
	displayName: 'OperationList',

	getInitialState: function getInitialState() {
		return { selected: [] };
	},

	//componentDidMount: function() {
	//this.setState({apis: this.props.apis, selected=this.props.apis[0]});
	//},

	render: function render() {
		var operations = this.props.operations.map(function (operation, index, array) {
			return React.createElement(Operation, { index: index, operation: operation });
		});

		return React.createElement(
			'div',
			{ className: 'gs-bg-class' },
			React.createElement(
				'p',
				{ className: 'bg-primary' },
				React.createElement(
					'b',
					null,
					this.props.uri
				),
				React.createElement(
					'a',
					{ className: 'btn btn-default btn-xs pull-right', role: 'button', href: '#' },
					React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
					' Add'
				)
			),
			React.createElement(
				'table',
				{ className: 'table table-hover' },
				React.createElement(
					'thead',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'th',
							null,
							'Id'
						),
						React.createElement(
							'th',
							null,
							'method'
						),
						React.createElement(
							'th',
							null,
							'keys'
						),
						React.createElement(
							'th',
							null,
							'transferproperties'
						),
						React.createElement(
							'th',
							null,
							'parameters'
						),
						React.createElement(
							'th',
							null,
							'Actions'
						)
					)
				),
				React.createElement(
					'tbody',
					null,
					operations
				)
			)
		);
	}
});

module.exports = OperationList;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./operation.jsx":4}],6:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var Service = React.createClass({
	displayName: 'Service',

	getInitialState: function getInitialState() {
		return { data: [] };
	},

	stop: function stop() {
		$.ajax({
			url: 'http://' + this.props.agent + '/stop/' + this.state.data.basepath,
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({ data: data });
			}.bind(this),
			error: function (xhr, status, err) {
				console.error('http://' + this.props.agent + '/stop/' + this.state.data.basepath, status, err.toString());
			}.bind(this)
		});
	},
	start: function start() {
		$.ajax({
			url: 'http://' + this.props.agent + '/start/' + this.state.data.basepath,
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({ data: data });
			}.bind(this),
			error: function (xhr, status, err) {
				console.error('http://' + this.props.agent + '/start/' + this.state.data.basepath, status, err.toString());
			}.bind(this)
		});
	},
	remove: function remove() {
		if (confirm('Etes vous certains de vouloir supprimer le service?')) {}
	},
	componentDidMount: function componentDidMount() {
		$.ajax({
			url: 'http://' + this.props.agent + '/' + this.props.name,
			dataType: 'json',
			cache: false,
			success: function (data) {
				console.log(data);
				this.setState({ data: data });
			}.bind(this),
			error: function (xhr, status, err) {
				console.error('http://' + this.props.agent + '/' + this.props.name, status, err.toString());
			}.bind(this)
		});
	},
	show: function show() {
		if (this.props.onClick) {
			this.props.onClick(this.state.data);
		}
	},
	render: function render() {
		var changeStatus;
		if (this.state.data.state == 'running') {
			changeStatus = React.createElement(
				'a',
				{ className: 'btn btn-warning btn-xs', href: '#', role: 'button', onClick: this.stop },
				React.createElement('span', { className: 'glyphicon glyphicon-stop', 'aria-hidden': 'true' }),
				' Stop'
			);
		} else {
			changeStatus = React.createElement(
				'a',
				{ className: 'btn btn-success btn-xs', href: '#', role: 'button', onClick: this.start },
				React.createElement('span', { className: 'glyphicon glyphicon-play', 'aria-hidden': 'true' }),
				' Start'
			);
		}
		var del = React.createElement(
			'a',
			{ className: 'btn btn-danger btn-xs pull-right', href: '#', role: 'button', onClick: this.remove },
			React.createElement('span', { className: 'glyphicon glyphicon-trash', 'aria-hidden': 'true' }),
			' Delete'
		);

		var view = React.createElement(
			'a',
			{ className: 'btn btn-default btn-xs', href: '#', role: 'button', onClick: this.show },
			React.createElement('span', { className: 'glyphicon glyphicon-eye-open', 'aria-hidden': 'true' }),
			' View'
		);

		return React.createElement(
			'tr',
			null,
			React.createElement(
				'th',
				{ scope: 'row' },
				this.props.index
			),
			React.createElement(
				'td',
				null,
				this.state.data.basepath
			),
			React.createElement(
				'td',
				null,
				this.state.data.state
			),
			React.createElement(
				'td',
				null,
				view,
				' ',
				changeStatus,
				' ',
				del
			)
		);
	}
});

module.exports = Service;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
(function (global){
'use strict';

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var Service = require('./service.jsx');
var ApiList = require('./apiList.jsx');

var ServiceList = React.createClass({
	displayName: 'ServiceList',

	getInitialState: function getInitialState() {
		return { services: [], selected: [] };
	},

	componentDidMount: function componentDidMount() {
		$.ajax({
			url: 'http://' + this.props.agent + '/list',
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({ services: data, selected: [] });
			}.bind(this),
			error: function (xhr, status, err) {
				//console.error(`http://${this.props.agent}/list`, status, err.toString());
			}.bind(this)
		});
	},

	handleonClick: function handleonClick(service) {
		this.setState({ services: this.state.services, selected: service });
	},

	render: function render() {
		var services = this.state.services.map(function (service, index, array) {
			return React.createElement(Service, { agent: this.props.agent, name: service, index: index, onClick: this.handleonClick });
		}, this);

		var apiList;
		if (this.state.selected.apis != undefined) {
			apiList = React.createElement(ApiList, { agent: this.props.agent, apis: this.state.selected.apis, basepath: this.state.selected.basepath });
		}

		return React.createElement(
			'div',
			{ className: 'gs-bg-class' },
			React.createElement(
				'p',
				{ className: 'bg-primary' },
				'Liste des services - http://',
				this.props.agent,
				' ',
				React.createElement(
					'a',
					{ className: 'btn btn-default btn-xs pull-right', role: 'button', href: '#' },
					React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
					' Add'
				)
			),
			React.createElement(
				'table',
				{ className: 'table table-hover' },
				React.createElement(
					'thead',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'th',
							null,
							'Id'
						),
						React.createElement(
							'th',
							null,
							'Service'
						),
						React.createElement(
							'th',
							null,
							'Status'
						),
						React.createElement(
							'th',
							null,
							'Actions'
						)
					)
				),
				React.createElement(
					'tbody',
					null,
					services
				)
			),
			apiList
		);
	}

});

module.exports = ServiceList;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./apiList.jsx":2,"./service.jsx":6}]},{},[3]);
