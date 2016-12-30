/*
	Copyright (C) 2016  Julien Le Fur

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
*/
var fs = require('fs');
var http = require('http');

/*
    Classe de gestion des agents GeneSiS
    Les agents signalent leur présence toutes les N secondes au manager.
    Si pas de signal au dela de 60 secondes, l'agent est considéré arrêté/injoignable.
*/
class AgentsManager{

    constructor () {
        this.agentsFile='./src/server/agents.json';
        this.timeouts=[];

        this.agentsLst=[];

        //Restauration de la sauvegarde locale de la liste des agents
        try{
            var data = fs.readFileSync(this.agentsFile);
            this.agentsLst=JSON.parse(data);
        }catch(err){
            console.log(err);
        }

        //Check du status des agents
        for(var i in this.agentsLst){
            if(this.agentsLst[i].status==1){
                var options={
                    hostname:this.agentsLst[i].hostname,
                    port:this.agentsLst[i].port,
                    path:'/list?pageNum=1&pageSize=10&filter=',
                    method:'GET'
                };
                
                var req=http.request(options,function(res){
                    res.on('end',function(){
                        if(res.statusCode!='200'){
                            this.agentsLst[i].status=0;
                        }
                        return;
                    }.bind(this));
                }.bind(this));

                req.on('error',function(e){
                    this.agentsLst[i].status=0;
                    return;
                }.bind(this));
             
                req.end();
            }
        }

        //Sauvegarde régulière des agents dans un fichier 
        setInterval((err)=>{
            fs.writeFile(this.agentsFile,JSON.stringify(this.agentsLst),(err)=>{
                if(err){
                    console.log("ERREUR: Mise a jour de la liste des agents.");
                    return;
                }
                console.log("SUCCESS: Mise a jour de la liste des agents.")
            });
        },60000);
    }


    checkAgent(agent,callback){
        for(var i in this.agentsLst){
            if(this.agentsLst[i].hostname==agent.hostname && this.agentsLst[i].port==agent.port){
                if(this.timeouts[i]!=undefined && this.timeouts[i] !=null){
                    clearTimeout(this.timeouts[i]);
                    this.timeouts[i]=null;
                }

                this.agentsLst[i].status=1;

                this.timeouts[i]=setTimeout(function(){
                    this.agentsLst[i].status=0;
                    this.timeouts[i]=null;
                    console.log("INFO: Agent arrêté");
                    console.log(this.agentsLst[i]);
                }.bind(this),30000);

                return callback(null,true);
            }
        }
        return callback(null,false);
    }

    addAgent(agent,callback){
        var id=this.agentsLst.length;

        var myAgent={
            "hostname":agent.hostname,
            "port":agent.port,
            "status":1
        };

        var timeoutId=setTimeout(function(){
            this.agentsLst[id].status=0;
            this.timeouts[id]=null;
            console.log("INFO: Agent arrêté");
            console.log(this.agentsLst[id]);
        }.bind(this),30000);

        console.log("INFO: Agent détecté");
        console.log(myAgent);

        this.agentsLst.push(myAgent);
        this.timeouts.push(timeoutId);

        return callback(null);
    }

    getAgentsLst(){
        return this.agentsLst;
    }

    deleteAgent(agent,callback){
        console.log(agent);
        for(var i in this.agentsLst){
            if(this.agentsLst[i].hostname==agent.hostname && this.agentsLst[i].port==agent.port){
                this.agentsLst.splice(i,1);
                clearTimeout(this.timeouts[i]);
                this.timeouts.splice(i,1);
                return callback(null);
            }
        }
    }

     disableAgent(agent,callback){
        for(var i in this.agentsLst){
            if(this.agentsLst[i].hostname==agent.hostname && this.agentsLst[i].port==agent.port){
                this.agentsLst[i].status=0;
                clearTimeout(this.timeouts[i]);
                return callback(null);
            }
        }
    }
}

AgentsManager.instance=null;

AgentsManager.getInstance=function(){
   if(this.instance === null){
      this.instance = new AgentsManager();
   }
   return this.instance;
}


module.exports = AgentsManager.getInstance();


