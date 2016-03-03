//Help from https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
//Also from http://todomvc.com/examples/angularjs/#/

// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var favicon = require('serve-favicon');
var path = require('path');

var index = require('./routes/index'); //all the routes
// configuration =================

mongoose.connect('mongodb://localhost/test');

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
app.use(favicon(path.join(__dirname,'public','images','favicon.png')));

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
app.get('/api/topicTitles', index.getTopicTitles);

// create todo and send back all todos after creation
app.post('/api/create/topic', index.createTopic);

app.get('/api/topic', index.getTopic)

app.post('/api/update/topic', index.updateTopic)

// // toggle complete status of todo
// app.post('/api/toggleTodoCompleted', index.toggleTodoCompleted);

// // save an edited todo
// app.post('/api/saveEditedTodo', index.saveTodo);

// app.post('/api/removeTodo', index.removeTodo);

// application -------------------------------------------------------------
app.get('*', index.home);

// listen (start app with node server.js) ======================================
PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("App listening on port " + PORT);
