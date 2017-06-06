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
 


var teams = new Schema({
    teams: Schema.Types.Mixed,
    challenges_completed: Schema.Types.Mixed,
    energy_used: Schema.Types.Mixed,
    updated_at : Number
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');




// error handler
app.get("/", function(req,res){
	res.sendfile('public/index.html');
});

app.post("/postTeams", upload.array(), function(req,res){
	var teamsArray = req.body.teams;
  console.log(teamsArray);
	var model = mongoose.model('teams', teams, 'teams');
  challenges = new Array(teamsArray.length+1).join('0').split('').map(parseFloat);
	var doc = new model({
          teams: teamsArray,
          challenges_completed: challenges,
          energy_used: challenges,
          updated_at: parseInt(Math.floor(Date.now() / 1000)) 
          }
 );
  doc.save(function(err) {
      if (err) throw err;
      console.log("save successful")
  });
  res.send("success!")
});

app.get("/getLeaderboard", function(req,res){
      res.send(fetchLeaderboard);
});

function fetchLeaderboard(){
    var model = mongoose.model('teams', teams, 'teams');
    model.findOne({},{}, { sort: { 'updated_at' : -1 } }, function(err, post) {
        console.log( post );
        return post;
    });
}

module.exports = app;
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
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