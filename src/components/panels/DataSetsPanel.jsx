var React = require('react');
var Reflux = require('reflux');
var Actions = require('../../actions/Actions.js');
var DataSetsStore = require('../../stores/DataSetsStore.js');
var DataSet = require('../basic/DataSet.jsx');
var Panel = require('./Panel.jsx');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var DataSetsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(DataSetsStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = DataSetsStore.getDefaultData();
		return {datasets: data.datasets, selected: data.selected, pages:data.pages, currentPage:data.currentPage,filter:data.filter};
	},
	
	onStoreUpdate(data){
		this.setState({datasets: data.datasets, selected: data.selected, pages:data.pages, currentPage:data.currentPage,filter:data.filter});
	},
	
	next:function(event){
		event.preventDefault();
		Actions.refreshDatasetsList(this.state.currentPage+1);
	},
	
	previous:function(event){
		event.preventDefault();
		Actions.refreshDatasetsList(this.state.currentPage-1);
	},
	
	//TODO
	addDataset(event){
		event.preventDefault();
	},
	
	handleSearch:function(filter){
		Actions.changeDataSetFilter(filter);
	},
	

	render: function() {
		var datasets = this.state.datasets.map(function(dataset,index,array) {
			return (
				<DataSet dataset={dataset} selected={dataset.key==this.state.selected.dataset.key}/>
			);
		},this);
		
		var linkPrevious;
		if(this.state.currentPage!=1){
			linkPrevious=(
					<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.previous}><Glyphicon glyph="menu-left" /></Button>
				);
		}
		
		var linkNext;
		if(this.state.currentPage!=this.state.pages){
			linkNext=(
				<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.next}><Glyphicon glyph="menu-right" /></Button>
			);
		}
		
		var links=(
			<div className="pull-right">
				{this.state.currentPage} / { this.state.pages}
				{ linkPrevious }
				{ linkNext }
				<Button href="#" bsStyle="add" bsSize="xsmall" onClick={this.addDataset}><Glyphicon glyph="plus" /></Button>
			</div>
		);
	
		return (
			<Panel title="DataSets" links={links} search={this.handleSearch}>
					<table className="table table-condensed table-hover">
						<tbody>
							{datasets}
						</tbody>
					</table>
			</Panel>
		);
  }
});

module.exports = DataSetsPanel;