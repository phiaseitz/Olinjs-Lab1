var Topic = require('./../models/topicModel');

var routes = {};

var getQuery = function(status){
	queryJson = {}
	if (status === 'Active') {
		queryJson.completed = false;
	} else if (status === 'Completed') {
		queryJson.completed = true;
	}

	return queryJson;
}

routes.getTopicTitles = function(req, res, next) {
    Topic.find({}, 'id title', function(err, topics) {
        console.log(topics);
        if (err)
            res.send(err);
        res.json(topics); // return all todos in JSON format
    });
}

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

routes.getTopic = function (req, res, next){
    console.log(req.query);
    Topic.findById(req.query._id, function(err, topic){
        if (err)
            res.send(err);

        res.json(topic);
    })
}

routes.updateTopic = function (req, res, next){
    console.log(req.body);

    Topic.findById(req.body.topic._id, function(err, topic){
        topic.title = req.body.topic.title;
        topic.content = req.body.topic.content;

        topic.save(function (err, updatedTopic){
            if (err)
                res.send(err);
            //Return all the titles of the topics in the db. 
            Topic.find({}, 'id title', function(err, topics) {
                console.log(topics);
                if (err)
                    res.send(err);

                res.json(topics); // return all todos in JSON format
            });
        })

        if (err)
            res.send(err);
    })
}

routes.home = function(req, res, next) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
}

module.exports = routes;