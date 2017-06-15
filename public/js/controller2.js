var app = angular.module('myApp',[]);

app.controller('mainController', ['$scope','$http','$interval', function($scope, $http, $interval){

	$scope.challengeNumber = 0;
	$scope.test2 = [];
	$scope.teamName = '';
	$scope.teams = [];
	$scope.error = "";
  $scope.leaderBoard = "";
  $scope.currentTeam = "";
  $scope.currentChallenge = "Air Pong";
  $scope.challenges = ["Air Pong","River Rapids","Obstacle course"];
  $scope.startTime = 0;
  $scope.endTime = 0;
  

	$scope.addToList = function(){
			var index = $scope.teams.indexOf($scope.teamName);
			if(index < 0 && $scope.teamName != ""){
				$scope.teams.push($scope.teamName);
				$scope.error = "";
				$scope.clearInput();

			}else{
				$scope.error = "No duplicate or blank names!";
			}


	}
	$scope.clearInput = function(){
		$scope.teamName = "";

	}
  $scope.generateGraph = function(team){
      $scope.currentTeam = team;
  }

	$scope.deleteTeam = function(team){
				var index = $scope.teams.indexOf(team);
				$scope.teams.splice(index, 1);
	}
	$scope.postTeams = function(){
				var deferred = $q.defer();
				var data = {teams: $scope.teams};
				$http.post('/postTeams', data)
				.success(function (data, status, headers, config) {
								deferred.resolve(data);
					$scope.PostDataResponse = data;
				})
					.error(function(data,status,headers,config){
					$scope.ResponseDetails = JSON.stringify({data: data});
				});
	}
  $scope.updateLeaderboard = function(){
      $scope.currentTeam.challenges_completed = 99;
      $scope.leaderBoard.sort(function(a, b) {
            return parseFloat(a.score) - parseFloat(b.score);
      });
      if($scope.currentTeam != ""){
          $scope.error = "";
          var data = $scope.currentTeam;
    				$http.post('/updateLeaderboard', data)
    				.success(function (data, status, headers, config) {
    					$scope.PostDataResponse = data;
    				})
    					.error(function(data,status,headers,config){
    					$scope.ResponseDetails = JSON.stringify({data: data});
    				});
      }else{
      $scope.error = "please pick team to update"}
  
  }
 
  $scope.refreshLeaderBoard = function(){
        $http.get('/getLeaderboard')
				.success(function (data) {
          console.log(data);
          if(data.length != 0 && data[0].challengeNumber == $scope.challengeNumber){
					$scope.leaderBoard = data;
          }
          $scope.challengeNumber =  data[0].challengeNumber;
				})
					.error(function(data,status,headers,config){
					$scope.ResponseDetails = JSON.stringify({data: data});
				});
  }
  $scope.refreshLeaderBoard();
$interval(function(){
      $scope.refreshLeaderBoard();
  },50,5);
  
  $scope.selectChallenge = function(challenge){
    $scope.currentChallenge = challenge;
}
  $scope.logScore = function(){
  
  
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

