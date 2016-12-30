var path = require('path');
var Express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var agentManager=require('./agentMgr');

var app = Express();
var server;

const PATH_STYLES = path.resolve(__dirname, '../client/styles');
const PATH_DIST = path.resolve(__dirname, '../../dist');

app.use(logger('dev'));
app.use('/styles', Express.static(PATH_STYLES));
app.use(Express.static(PATH_DIST));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res)  {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.get('/agents', function(req, res)  {
  res.write(JSON.stringify(agentManager.getAgentsLst()));
  res.end();
});

app.delete('/agent', function(req, res)  {
  agentManager.deleteAgent(req.body,(err)=>{
    if(err){
       res.status(500).end(err.message);
      return;
    }
    res.write(JSON.stringify(agentManager.getAgentsLst()));
    res.end();
  });
 
});

app.put('/agent/disable',function(req, res){
  agentManager.disableAgent(req.body,(err)=>{
    if(err){
      res.status(500).end(err.message);
      return;
    }
    res.write(JSON.stringify(agentManager.getAgentsLst()));
    res.end();
  });
});

app.post('/agent/subscribe',function(req,res){
  var newAgent=req.body;
  agentManager.checkAgent(newAgent,(err,exist)=>{
    if(err)
      res.status(500).end();
    if(!exist){
      agentManager.addAgent(newAgent,(err)=>{
        if(err){
          res.status(500).end();
          return;
        }
        res.status(200).end();
        return;
      });
    }
    res.status(200).end();
    return;
  });
});

server = app.listen(process.env.PORT || 3000, function(){
  var port = server.address().port;

  console.log('Server is listening at %s', port);
});