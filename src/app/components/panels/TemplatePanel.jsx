var React = require('react');
var Reflux = require('reflux');
var Highlight = require('react-syntax-highlight');
var Actions = require('../../actions/Actions.js');
var DataSetsStore = require('../../stores/DataSetsStore.js');
var Panel = require('./Panel.jsx');

var TemplatePanel = React.createClass({
	mixins: [
			Reflux.listenTo(DataSetsStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = DataSetsStore.getDefaultData();
		var content= data.selected.template.content;
		return {name:data.selected.template.name, content:content, initial:content};
	},

	
	onStoreUpdate(data){
		var content= data.selected.template.content;
		this.setState({name:data.selected.template.name, content: content,initial:content});
	},
	
	render: function() {
		
		var links=(
			<div className="pull-right">
			</div>
		);
		
		var title="Template - "+this.state.name;

		var content = this.state.content;
		
		return (
			<Panel title="Aperçu du template" links={links}>
				<div>
					<Highlight
						lang='xml'
						value={this.state.content}
						/>

					<pre>
						<code
						  className='hljs textarea'
						  contentEditable='false'
						  spellCheck='false'
						  onInput={e => this.setState({ content: e.target.innerText })}>
						  {this.state.initial}
						</code>
					</pre>
		        </div>
		     </Panel>
		);
  }
});

module.exports = TemplatePanel;