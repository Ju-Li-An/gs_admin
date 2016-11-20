var React = require('react');
var GSTooltip = require('../basic/GSTooltip.jsx');
var Formsy = require('formsy-react');


var GSInput = React.createClass({
	
    mixins: [Formsy.Mixin],

    changeValue(event) {
      this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
    },

	render: function() {
	
		const className = 'form-group form-group-xs ' + (this.props.className || ' ') +
      		(this.showRequired() ? ' required' : this.showError() ? ' error' : '');


      	const errorMessage = this.getErrorMessage();


      	if(this.props.label!=undefined){
      		return (
      			<div className={className}>
      				<label htmlFor={this.props.name} className="control-label col-sm-2">{this.props.label}</label>
      				<div className="col-sm-10">
	      				<input type={this.props.type || 'text'} 
								name={this.props.name} 
								className="form-control"
								onChange={this.changeValue} 
								value={this.getValue()}
								checked={this.props.type === 'checkbox' && this.getValue() ? 'checked' : null}/>
						<span className='validation-error'>{errorMessage}</span>
					</div>

      			</div>
      			);
      	}
      	else{
			return (
				<div className={className}>
					<GSTooltip placement="top" text={this.props.tooltip}>
						<input type={this.props.type || 'text'} 
								name={this.props.name} 
								className="form-control"
								onChange={this.changeValue} 
								value={this.getValue()}
								checked={this.props.type === 'checkbox' && this.getValue() ? 'checked' : null}/>
					</GSTooltip>
					<span className='validation-error'>{errorMessage}</span>
				</div>

			);
		}
    }
});

module.exports = GSInput;