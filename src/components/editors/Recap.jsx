var React = require('react');

var Recap = React.createClass({

	render: function() {

		if(this.props.data){
			var recap = this.props.data.map(function(item,index,array) {
				return(
					<p><strong>{item.label}:</strong> {item.value}</p>
				);
			});
		}
		

		return(
			<div>
				{recap}
			</div>
		);
    }
});

module.exports = Recap;