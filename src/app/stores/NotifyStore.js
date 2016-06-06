var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');

var NotifyStore = Reflux.createStore({

	init: function() {
		this.listenToMany(Actions);
    },

    onNotify:function(notification){
    	this.trigger(notification);
    }
});

 module.exports=NotifyStore;