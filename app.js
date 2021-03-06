var JSON = require('JSON');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require("request-promise");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/west');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected to mongodb!');
});
var Schema = mongoose.Schema;
var PythonShell = require('python-shell');
 

var multer = require('multer');
var upload = multer();

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var verve = new Schema({
    sensor1: Number,
    sensor2: Number,
    sensor3: Number,
    sensor4: Number,
    sensor5: Number,
    sensor6: Number,
    sensor7: Number,
    sensor8: Number,
    timestamp: Number
});

var team = new Schema({
    teamName: String,
    challenges_completed: Number,
    energy_used: Number,
    challengeNumber: Number,
    updated_at : Number,
    energy_generated: Number,
    total_energy: Number
});

var data = new Schema({
    sensorId : Number, 
    value : Number, 
    timePolled : Number, 
    last_seen : Number 
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/cleardatabase',function(req,res){
    res.sendfile("public/clearDatabase.html");
})

app.get('/cleardatabase1234',function(req,res){
    var model = mongoose.model('team', team, 'teams');
    var model2 = mongoose.model('vSensors', verve);
    var model3 = mongoose.model('data', data, 'ids');
    model.find({}).remove().exec();
    model2.find({}).remove().exec();
    model3.find({}).remove().exec();
    
    res.send("database cleared!")
});


// error handler
app.get("/", function(req,res){
	res.sendfile('public/index.html');
});

app.post("/postVerve",function(req,res){// recieves data from verve and stores it into mongo
    //console.log(req.body);
    var Verve = mongoose.model('vSensors', verve);
    var verveEntry = new Verve(req.body);
    verveEntry.save(function(err) {
      if (err) res.status(500).send('{"error": "something went wrong"}');
      else res.status(201).send(JSON.stringify(req.body));
    });
});

app.post("/postTeams", upload.array(), function(req,res){ // initializes teams from the  first start page
	var teamsArray = req.body.teams;
  var challengeNumber = 0;
	var model = mongoose.model('team', team, 'teams');
    model.findOne({},{}, { sort: { 'challengeNumber' : -1 } }, function(err, post) {
        if(post != null && post.challengeNumber != null)
        challengeNumber = post.challengeNumber + 1;
        else
          challengeNumber = 1;
    }).then(function(){
  teamsArray.forEach(function(teamName){
      var doc = new model({
          teamName: teamName,
          challenges_completed: 0,
          energy_used: 0,
          challengeNumber: challengeNumber,
          updated_at: parseInt(Math.floor(Date.now() / 1000)) ,
          energy_generated: 0,
          total_energy: 0
          }
       );
       doc.save(function(err) {
          if (err) throw err;
          //console.log("save successful"); 
       });
  });
});

	
});

app.get("/getVerve",function(req,res){           //gets the most recent value from the verve dataset
         var model = mongoose.model('vSensors', verve);
         model.findOne({},{}, { sort: { 'timestamp' : -1 } }, function(err, post) {
              //console.log(post);
              if(err) res.status(500).send(err);
              if(post != null){
                res.status(200).send(post);
              }else res.status(200).send("no data available");
         });
});

app.get("/getLeaderboard", function(req,res){//gets an updated list of the most recent teams from the database
      var challengeNumber=0;
      var array = [];
      var model = mongoose.model('teams', team, 'teams');
    model.findOne({},{}, { sort: { 'challengeNumber' : -1 } }, function(err, post) {
        if(post != null)
        challengeNumber = post.challengeNumber;
    
    }).then(function(){
      model.find({'challengeNumber' : challengeNumber },{},{sort:{ 'score': -1 }}, function(err, values) {
        values.forEach(function(thing){
        console.log(thing);
				array.push(thing);
        });
      }).then(function(){
        
        
         res.send(array);
    });
     });
});

app.post("/mostRecentValue",function(req,res){
    var challenge = req.body.challenge;
    var sensor = "";
    /*
    movie Station sensorId: 23231
    game station #2 - sensorId: 52415
    game station #1 - sensorId: 11229
    blower - sensorId: 29574
    ["Air Pong","River Rapids","Obstacle course"];
    */
    switch(challenge) {
    case "River Rapids":
        sensor = 11229;
        break;
    case "Obstacle course":
        sensor = 52415;  
        break;
    case "Air Pong":
        sensor = 29574;
        break;
    case "movieStation":
        sensor = 23231;
        break;
    default:
        //console.log("Please use a valid http request from the front end");
        res.send("Incorect challenge specified");
        return;
    }
    var model = mongoose.model('data', data, 'ids');
    model.findOne({'sensorId': sensor},{}, { sort: { 'timePolled' : -1 } }, function(err, post) {
        if(err) throw err;
        res.send(post);
    });
});

app.post("/updateLeaderboard",function(req,res){
        //console.log(req.body);
        var model = mongoose.model('team', team, 'teams');
        model.findById(req.body._id, function (err, result) {
            if (err) return handleError(err);
      
            result.challenges_completed = req.body.challenges_completed;
            result.energy_used = req.body.energy_used;
            result.score = req.body.score;
            result.total_energy = req.body.total_energy;
            result.energy_generated = req.body.energy_generated;
            result.updated_at = parseInt(Math.floor(Date.now() / 1000));
            result.save(function (err, update) {
                if (err) return handleError(err);
                res.send(update);
            });
        });

});
 
module.exports = app;
app.listen(8080, function () {
  console.log('1kwchallenge app listening on port 8080!');
});



/*
app.get("/averages", function(req,res){
	var array = [];
	var model = mongoose.model('average2', avgS, 'averages');
		model.find().exec(function(err,avgs){
			avgs.forEach(function(thing){
				array.push(thing);
			});
			res.send(array);
		});
});


app.get("/idList", function(req,res){
	var array = [];
	var model = mongoose.model('average3', idList, 'averages');
		model.find({type: "idList"}).exec(function(err,ids){
			res.send(ids[0]);
		});
});

app.get("/allValues", function(req,res){
	var array = [];
	var model = mongoose.model('id', values, 'ids');
		model.find().exec(function(err,values){
			values.forEach(function(thing){
				array.push(thing);
			});
			res.send(array);
		});
});


app.get("/doPython", function(req,res){
	PythonShell.run('py/hdwStats.py', function (err) {
  		if (err) throw err;
  		res.send('avgs Calculated');
	});
});

*/