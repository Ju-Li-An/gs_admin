exports.list=function(agentUrl,pageNum,servicesPerPage,filter,callback){
	$.ajax({
		url: `${agentUrl}/list?pageNum=${pageNum}&pageSize=${servicesPerPage}&filter=${filter}`,
		type: "GET",
		dataType: "json",
		success: (result) => {
			callback(null,result);
		}
	}).fail(function(){
		// Si l'agent n'a pas répondu, on le désactive dans le Panel Agent
		callback("Echec de la récupération des services");
	});
};

exports.get=function(agentUrl,basepath,callback){
	$.ajax({
		url: `${agentUrl}/${basepath}`,
		type: "GET",
		dataType: "json",
		success: (result) => {
			callback(null,result);
		},
		error: (x, t, m) => {
			callback("Echec de la récupération du service");
		}
	});
};
