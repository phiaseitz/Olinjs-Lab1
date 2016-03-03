var mongoose = require('mongoose');

var Topic = mongoose.Schema({
    title : String,
    content: String,
});

module.exports = mongoose.model('topic', Topic);