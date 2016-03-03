// A lot of this code came from my todo app, which borrowed heavily from https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular


// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var path = require('path');

var index = require('./routes/index'); //all the routes

// configuring the app =================
// Heroku app mongo
mongoose.connect(process.env.MONGOLAB_URI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected!');
});     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all the topic titles (for the nav bar)
app.get('/api/topicTitles', index.getTopicTitles);

// create topic and send back the new topic
app.post('/api/create/topic', index.createTopic);

//Get all the information for one topic
app.get('/api/topic', index.getTopic)

// update topic
app.post('/api/update/topic', index.updateTopic)

// application -------------------------------------------------------------
// render index.html when we navigate 
app.get('*', index.home);

// listen (start app with node server.js) ======================================
PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("App listening on port " + PORT);
