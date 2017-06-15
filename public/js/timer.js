var app = angular.module('stopwatchApp',[]);

app.controller('stopwatchController', ['$scope','$http', '$timeout', function($scope, $http, $timeout){
  var timeoutId;
  $scope.seconds = 0;
  $scope.minutes = 0;
  $scope.running = false;

  $scope.stop = function() {
    $timeout.cancel(timeoutId);
    $scope.running = false;
  };
  
  $scope.start = function() {
    timer();
    $scope.running = true;
  };
  
  $scope.clear = function() {
    $scope.seconds = 0;
    $scope.minutes = 0;
  };
  
  function timer() {
    timeoutId = $timeout(function() {
      console.log($scope.seconds);
      updateTime(); // update Model
      timer();
    }, 1000);
  }
  
  function updateTime() {
    $scope.seconds++;
    if ($scope.seconds === 60) {
      $scope.seconds = 0;
      $scope.minutes++;
    }
  }
}]);


/*
  $scope.prepareData = function(type){
    var deferred = $q.defer();
    var promises = [];
    //deferred.resolve(['timeStamp', type]);
    //promises.push(deferred.promise);
    $scope.PostDataResponse.forEach(function(response){
      var deferred = $q.defer();
      if ( type == response.type){
        deferred.resolve([new Date(response.timeStamp*1000),response.value*100000]);
        promises.push(deferred.promise);
      }
    });
    return $q.all(promises).then(function(data){
      $scope.data.push(data);
    });
    };

    $scope.uniqueArray = function(charts){
      var unique = charts.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      });
      $scope.unique = unique;
    };

    $scope.post = function(){
      var deferred = $q.defer();
      var data = {
              range: $scope.daterange,
        id: $scope.currentId
      };
      $http.post('/valuesInrange', data)
      .success(function (data, status, headers, config) {
              deferred.resolve(data);

        $scope.PostDataResponse = data;
      })
        .error(function(data,status,headers,config){
        $scope.ResponseDetails = JSON.stringify({data: data});
      });
      $scope.unique = [];//this is to clear the old charts for a new query
      $scope.PostDataResponse = {}; // this is to clear data from other query
      $scope.data = [];
      return deferred.promise;
    };


    $scope.getIds = function(){
        $http.get('/idList')
      .success(function(data){
        $scope.idList = data.ids;
        })
      .error(function(data,status,headers,config){
        $scope.ResponseDetails = JSON.stringify({data: data});
        });
    };

    $scope.selectId = function(id){
      $scope.currentId = id;
    }
    */
/*

angular.module('stopwatch', []).
  directive('khs', function($timeout) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
        var timeoutId;
        $scope.seconds = 0;
        $scope.minutes = 0;
        $scope.running = false;
 
        $scope.stop = function() {
          $timeout.cancel(timeoutId);
          $scope.running = false;
        };
        
        $scope.start = function() {
          timer();
          $scope.running = true;
        };
        
        $scope.clear = function() {
          $scope.seconds = 0;
          $scope.minutes = 0;
        };
        
        function timer() {
          timeoutId = $timeout(function() {
            console.log($scope.seconds);
            updateTime(); // update Model
            timer();
          }, 1000);
        }
        
        function updateTime() {
          $scope.seconds++;
          if ($scope.seconds === 60) {
            $scope.seconds = 0;
            $scope.minutes++;
          }
        }
      },
      template:
        '<div class="blueborder">' +
          '<div>{{minutes|numberpad:2}}:{{seconds|numberpad:2}}</div><br/>' +
          '<input type="button" ng-model="startButton" ng-click="start()" ng-disabled="running" value="START" />' +
          '<input type="button" ng-model="stopButton" ng-click="stop()" ng-disabled="!running" value="STOP" />' +
          '<input type="button" ng-model="clearButton" ng-click="clear()" ng-disabled="running" value="CLEAR" />' +
        '</div>',
      replace: true
    };
  }).
  filter('numberpad', function() {
    return function(input, places) {
      var out = "";
      if (places) {
        var placesLength = parseInt(places, 10);
        var inputLength = input.toString().length;
      
        for (var i = 0; i < (placesLength - inputLength); i++) {
          out = '0' + out;
        }
        out = out + input;
      }
      return out;
    };
  });  
*/