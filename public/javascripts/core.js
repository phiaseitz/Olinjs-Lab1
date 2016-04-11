// Awesome work on execution, clarity of code and documentation. Please look at a different approach that you might take 
// in structuring your frontend to be more scalable with more controllers:

// var wiki = angular.module('myWiki', ['ngMaterial', 'ngRoute']);

// A way to make your code more modular in more complex application is to create this route handler that allows you
// to use different controllers on different routes according to your needs. To do so you need to require "ngRoute" in your 
// modulus, as shown in line 4, above. Once you've done this, you can initialize a routeProvider that handles the different
// cases, as shown below:

// app.config(function ($routeProvider, $locationProvider) {
//   $routeProvider.when("/", {
//       templateUrl : "../wiki.html",
//       controller: "mainController"
//     });
// });

// To add a final note on that - I would like it if you were able to not have all of your "views" code in index.html. As simple
// ng-view div could be present at index.html that is ready to handle all incoming views by a suite of html files under a views 
// dir in your public dir. Let me know if you have any questions on this and I am happy to explain :)

// Create the controller. This is what controls the app. 
var wiki = angular.module('wikiApp', ['ngMaterial'])
.controller('AppCtrl', function ($scope, $log,  $http) {
    // Define basecase variables
    $scope.formData = {};
    $scope.search = {};
    $scope.currentTopic = {};
    $scope.creatingTopic = false; 
    $scope.editingTopic = false;
    $scope.createTopicShowEdit = 1;
    $scope.initialHeight = 0;

    // when landing on the page, get all topic titles and show them
    $http.get('/api/topicTitles') 
        .success(function(data) {
            $scope.topicslist = data.sort(sortTopcis())
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    
    // When we create a new topic, we add the new topic to the list of current topics, and resort the list
    $scope.createTopic = function() {
        $http.post('/api/create/topic', {topic: $scope.formData})
            .success(function(data) {
                $scope.formData = {}; // clear the form data
                
                //add the new topic to the current topic list 
                var currentTopicList = $scope.topicslist;
                currentTopicList.push(data);
                // reset the topic list
                $scope.topicslist = currentTopicList.sort(sortTopcis()); 
                // show the current topic
                $scope.currentTopic = data;
                // now we are no longer creating a topic
                $scope.creatingTopic = false;
          
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    // Get the formation for a topoc
    $scope.getTopic = function(topic,origin) {
      //Because sometimes we clear the search bar, we only
      //want to do this if we are not searching or searching and
      //the topic is definied
      if (!(origin==='search'&& !$scope.search.selectedTopic)){
        $http.get('api/topic', {params: topic})
            .success(function(data) {
                // The set the topic we are viewing
                $scope.currentTopic = data; 
                // we are no lnger creating/editing a topic. 
                $scope.creatingTopic = false; 
                $scope.editingTopic = false;
                // clear the search form
                $scope.search={};        
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      }
    };

    // after we click on the create new topic "button", show the add topic form
    $scope.showAddTopicForm = function(){
        $scope.creatingTopic = true;
        $scope.currentTopic = {};
    };

    // Save a topic that we have edited
    $scope.updateTopic = function() {
        console.log("topic edited", $scope.currentTopic);
        $http.post('/api/update/topic', {topic: $scope.currentTopic})
            .success(function(data){
                // we are no longer editing, and resort the topics. 
                $scope.editingTopic = false;
                $scope.topicslist = data.sort(sortTopcis());
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    //Get the matches for the current search query
    $scope.getMatches = function (text) {
      var matches = $scope.topicslist.filter(function (topic) {
        // Only return titles where the search query is a substring of the title
        return (topic.title.toLowerCase().indexOf(text.toLowerCase()) > -1);
      });
      return matches;
    }
})
// Se themes
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink')
    .warnPalette('red');
})
//from: http://stackoverflow.com/questions/17772260/textarea-auto-height
//This causes some weird "bouncing" when the input is only one line long. 
//I'm not entirely sure how to fix this, but we'll see. 
.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;

                var resize = function() {
                    console.log('resizing....');
                    // console.log($scope.ini)
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                $scope.$watch('currentTopic', function (val) {
                   resize();
                });
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
]);

// Nice, simple and elegant.
//This is the sort topics function that sorts topics alphabetically ignoring case of the object. 
function sortTopcis() {
  return function(t1, t2) {
    if (t1.title.toLowerCase() < t2.title.toLowerCase()){
      return -1
    } else if (t1.title.toLowerCase() > t2.title.toLowerCase()){
      return 1
    } else {
      return 0
    }
  }
};

