// This is the model for my topic. It currently has a title and content components. 
var mongoose = require('mongoose');

var Topic = mongoose.Schema({
    title : String,
    content: String,
});

module.exports = mongoose.model('topic', Topic);