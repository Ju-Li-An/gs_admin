var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/Actions.js');
var DataSetsStore = require('../stores/DataSetsStore.js');
var DataSet = require('./DataSet.jsx');
var Panel = require('./Panel.jsx');

var DataSetsPanel = React.createClass({
	mixins: [
			Reflux.listenTo(DataSetsStore, 'onStoreUpdate')
	],
	
	getInitialState: function() {
		var data = DataSetsStore.getDefaultData();
		return {datasets: data.datasets, selected: data.selected, pages:data.pages, currentPage:data.currentPage};
	},
	
	onStoreUpdate(data){
		this.setState({datasets: data.datasets, selected: data.selected, pages:data.pages, currentPage:data.currentPage});
	},
	
	next:function(){
		Actions.refreshDatasetsList(this.state.currentPage+1);
	},
	
	previous:function(){
		Actions.refreshDatasetsList(this.state.currentPage-1);
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
					<a href="#" onClick={this.previous} className="btn-add" title="Précédent">
						<span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
					</a>
				);
		}
		
		var linkNext;
		if(this.state.currentPage!=this.state.pages){
			linkNext=(
				<a href="#" onClick={this.next} className="btn-add" title="Suivant">
						<span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
				</a>
			);
		}

		var links=(
			<div className="pull-right">
					{ linkPrevious }
					{ linkNext }
				 <a href="#" onClick={this.addDataset} className="btn-add" title="Ajouter un jdd">
					<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
				</a>
			</div>
		);
	
		
		return (
			<Panel title="DataSets" links={links}>
				<div className="table">
					<td>
						<table className="table table-condensed table-hover">
							<tbody>
								{datasets}
							</tbody>
						</table>
					</td>
				</div>
			</Panel>
		);
  }
});

module.exports = DataSetsPanel;