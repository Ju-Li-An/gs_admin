var React = require('react');
var GSTooltip = require('../basic/GSTooltip.jsx');
var Formsy = require('formsy-react');


var GSSelect = React.createClass({
	
	// Add the Formsy Mixin
    mixins: [Formsy.Mixin],

    changeValue(event) {
      this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
    },

	render: function() {
	
		const className = 'form-group form-group-xs ' + (this.props.className || ' ') +
      		(this.showRequired() ? ' required' : this.showError() ? ' error' : '');

      	const errorMessage = this.getErrorMessage();

      	//var opt = this.props.options;
      	//opt.push({title:,value:});

      	const options = this.props.options.map((option, i) => (
	      <option key={option.title+option.value} value={option.value}>
	        {option.title}
	      </option>
	    ));


	    if(this.props.label!=undefined){
      		return (
      			<div className={className}>
      				<label htmlFor={this.props.name} className="control-label col-sm-2">{this.props.label}</label>
      				<div className="col-sm-10">
      					<select name={this.props.name} className="form-control" onChange={this.changeValue} value={this.getValue()}>
				          {options}
				        </select>
				        <span className='validation-error'>{errorMessage}</span>
				    </div>
				</div>
      		);
      	}else{
			return (
				<div className={className}>
					<GSTooltip placement="top" text={this.props.tooltip}>
						<select name={this.props.name} className="form-control" onChange={this.changeValue} value={this.getValue()}>
				          {options}
				        </select>
					</GSTooltip>
					<span className='validation-error'>{errorMessage}</span>
				</div>

			);
		}
    }
});

module.exports = GSSelect;
