var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');

let maxnotif = 20;

let history=[];

var NotifyStore = Reflux.createStore({

	init: function() {
		this.listenToMany(Actions);
    },

    onNotify:function(notification){

		if(history.length >= maxnotif ){
			history.shift();
		}
		history.push({notification:notification,timestamp:new Date()});

    	this.trigger({history:history,notification:notification});
    }
});

 module.exports=NotifyStore;