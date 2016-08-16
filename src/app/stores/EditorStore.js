var Reflux = require('reflux');
var Actions= require('../actions/Actions.js');
var AgentsStore=require('./AgentsStore.js');

let data={
	show:false,
	title:'',
	type:'',
    size:'lg',
	agent:{}
};

var EditorStore = Reflux.createStore({

	init: function() {
		this.listenTo(AgentsStore, this.onAgentsStoreChange);
		this.listenToMany(Actions);
    },

    onAgentsStoreChange:function(storeData){
    	data.agent=storeData.selected;
        this.trigger(data);
    },


    onShowEditor:function(title,size,type){
    	data.show=true;
    	data.type=type;
    	data.title=title;
        data.size=size;
    	this.trigger(data);
    },

    onCloseEditor:function(){
		data.show=false;
		this.trigger(data);
    },

    getDefaultData:function(){
        return data;
    }
});

 module.exports=EditorStore;