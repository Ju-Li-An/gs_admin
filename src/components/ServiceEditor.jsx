var React = require('react');

var ServiceEditor = React.createClass({

	handleSubmit:function(event){
		 if (event.isDefaultPrevented()) {
			console.log(event.target);
		}
	},


	render: function() {
	
		return (
			<form id="serviceEditorForm" data-toggle="validator" role="form" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor ="appName" className="control-label">Nom de l'application</label>
					<input type="text" className="form-control" id="appName" placeholder="BIOSPDC" required/>
				</div>
				<div className="form-group has-feedback">
					<label htmlFor ="serviceName" className="control-label">Nom du service</label>
					<input type="text" className="form-control" id="serviceName" placeholder="parcInstalle" required/>
					<span className="glyphicon form-control-feedback" aria-hidden="true"></span>
					<div className="help-block with-errors">Hey look, this one has feedback icons!</div>
				</div>
				<div className="form-group">
					<label htmlFor ="serviceVersion" className="control-label">Version du service</label>
					<input type="text" className="form-control" id="serviceVersion" placeholder="1" required/>
				</div>
				 <div className="form-group">
					<div className="checkbox">
						<label>
							<input type="checkbox" id="terms" data-error="Before you wreck yourself" required/>
							Check yourself
						</label>
						<div className="help-block with-errors"></div>
					</div>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-primary">Valider</button>
				</div>
			</form>
		);
    }
});

module.exports = ServiceEditor;