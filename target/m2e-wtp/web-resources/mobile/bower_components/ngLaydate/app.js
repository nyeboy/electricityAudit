
var app=angular.module('app', ['ngLaydate'])
.controller('appCtrl',['$scope',function ($scope) {	
        // $scope.test = 'test';
        // console.log($scope.test);
        // console.log($scope.time);
        // alert("yes");
        // $scope.fun=function(){
        // 	console.log($scope.time);
        // }

        $scope.model={
            max:'2016-11-11',
            min:'2016-10-01',

        };


        $scope.startTime='2016-11-03';

        $scope.test=function(){
        	alert($scope.startTime);
        	// alert($('#id1').val());
        }
    }]);

