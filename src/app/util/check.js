

/*Vérifie si le nom du paramètre existe déjà:
- soit dans les transfertProperties
- soit dans les paramètres globaux
- soit dans les données du dataset
- soit dans les paramètres du dataset
S'il existe retourne {TRUE,"message"}
Sinon retourne {FALSE,""}
*/
exports.paramExist=function(paramName,operation,dataset) {

	if(operation!=undefined){
		if(operation.parameters.map(function(val){return val.name;}).includes(paramName)){
			return {
				"exist":true,
				"message":`Le paramètre [${paramName}] existe déjà dans les paramètres globaux`
			}
		}

		if(operation.transferProperties.map(function(val){return val.name;}).includes(paramName)){
			return {
				"exist":true,
				"message":`Le paramètre [${paramName}] existe déjà dans les transferProperties`
			}
		}
	}

	if(dataset!=undefined){
		if(dataset.data!=undefined && dataset.data.length > 0 && dataset.data.map(function(val){return val.name;}).includes(paramName)){
			return {
				"exist":true,
				"message":`Le paramètre [${paramName}] existe déjà dans les données du dataset`
			}
		}

		if(dataset.parameters!=undefined && dataset.parameters.length > 0 && dataset.parameters.map(function(val){return val.name;}).includes(paramName)){
			return {
				"exist":true,
				"message":`Le paramètre [${paramName}] existe déjà dans les paramètres du dataset`
			}
		}
	}

	return {
		"exist":false,
		"message":""
	}

}
