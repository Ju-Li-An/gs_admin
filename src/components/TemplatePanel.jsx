var React = require('react');
var Reflux = require('reflux');
//var AceEditor = require('react-ace');
//var hljs = require('./highlight.js');

var Actions = require('../actions/Actions.js');
var DataSetsStore = require('../stores/DataSetsStore.js');
var Panel = require('./Panel.jsx');

var TemplatePanel = React.createClass({
	mixins: [
			Reflux.listenTo(DataSetsStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = DataSetsStore.getDefaultData();
		return {name:data.selected.template.name, content: data.selected.template.content};
	},
	
	onStoreUpdate(data){
		this.setState({name:data.selected.template.name, content: data.selected.template.content});
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
	
	render: function() {
		
		var links=(
			<div className="pull-right">
					<a href="#" onClick={this.addDataset} className="pull-right btn-add" title="Modifier le template">
						<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
					</a>
				</div>
		);
		
		var title="Template - "+this.state.name;

		
		var content = this.state.content;
		var document="";
		
		if(content){
			document = content.documentElement.outerHTML;
		}
		
		
		return (
			<Panel title={title} links={links}>
					<pre><code className="template">{document}</code></pre>
			</Panel>
		);
  }
});

module.exports = TemplatePanel;