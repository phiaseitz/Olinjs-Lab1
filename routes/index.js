// This file contains all the routes. For the most part, these routes are relatively straightforward.  
// Import the database stuff
var Topic = require('./../models/topicModel');

// set up the routes
var routes = {};

// Get all the topic titles and ids, so that we can create a nav bar. (We don't want to have to store all the topics in the front end)
routes.getTopicTitles = function(req, res, next) {
    Topic.find({}, 'id title', function(err, topics) {
        if (err)
            res.send(err);
        res.json(topics); // return all todos in JSON format
    });
}

// create a new topic page. This just stores the title and content that we passed in
routes.createTopic = function(req, res, next) {
    Topic.create({
        title : req.body.topic.title,
        content : req.body.topic.content
    }, function(err, topic) {
        if (err)
            res.send(err);

        res.json(topic)
    });

}

// Get all the information for a topic (by id)
routes.getTopic = function (req, res, next){
    Topic.findById(req.query._id, function(err, topic){
        if (err)
            res.send(err);

        res.json(topic);
    })
}

//Update an existing topic. 
routes.updateTopic = function (req, res, next){
    //Find the existing topic
    Topic.findById(req.body.topic._id, function(err, topic){
        // reset the topic title and content
        topic.title = req.body.topic.title;
        topic.content = req.body.topic.content;
        // save the updated topic
        topic.save(function (err, updatedTopic){
            if (err)
                res.send(err);
            //Return all the titles and ids of the topics in the db. 
            Topic.find({}, 'id title', function(err, topics) {
                if (err)
                    res.send(err);

                res.json(topics); // return all topics in JSON format
            });
        })

        if (err)
            res.send(err);
    })
}

// Load index.html when we navigate to the page. 
routes.home = function(req, res, next) {
    res.sendfile('./public/index.html'); 
}

module.exports = routes;