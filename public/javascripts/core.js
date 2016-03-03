var wiki = angular.module('wikiApp', ['ngMaterial'])
.controller('AppCtrl', function ($scope, $log,  $http) {
    $scope.formData = {};
    $scope.search = {};
    $scope.currentTopic = {};
    $scope.creatingTopic = false; 
    $scope.editingTopic = false;
    $scope.createTopicShowEdit = 1;
    $scope.initialHeight = 0;

    // when landing on the page, get all todos and show them
    $http.get('/api/topicTitles') 
        .success(function(data) {
            $scope.topicslist = data.sort(sortTopcis())
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    
    // when submitting the add form, send the text to the node API
    $scope.createTopic = function() {
        $http.post('/api/create/topic', {topic: $scope.formData})
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                // when landing on the page, get all todos and show them     
                var currentTopicList = $scope.topicslist;
                currentTopicList.push(data);
                $scope.topicslist = currentTopicList.sort(sortTopcis()); 
                $scope.currentTopic = data;
                $scope.creatingTopic = false;
          
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getTopic = function(topic,origin) {
      //Because sometimes we clear the search bar, we only
      //want to do this if we are not searching or searching and
      //the topic is definied
      if (!(origin==='search'&& !$scope.search.selectedTopic)){
        $http.get('api/topic', {params: topic})
            .success(function(data) {
                $scope.currentTopic = data; 
                $scope.creatingTopic = false; 
                $scope.editingTopic = false;
                $scope.search={};        
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      }
    };

    $scope.showAddTopicForm = function(){
        $scope.creatingTopic = true;
        $scope.currentTopic = {};
    };

    $scope.updateTopic = function() {
        console.log("topic edited", $scope.currentTopic);
        $http.post('/api/update/topic', {topic: $scope.currentTopic})
            .success(function(data){
                console.log(data);
                $scope.editingTopic = false;
                $scope.topicslist = data.sort(sortTopcis());
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

  $scope.searchTextChange = function (text) {
      $log.info('Text changed to ' + text);
    }

  $scope.getMatches = function (text) {
      var matches = $scope.topicslist.filter(function (topic) {
        return (topic.title.toLowerCase().indexOf(text.toLowerCase()) > -1);
      });
      return matches;
    }
})
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

