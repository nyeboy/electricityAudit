/**
*  Mappodule
*
* Description
*/
var app=angular.module('app', ['httploading'])

.controller('mainCtrl',function($scope,$rootScope,$interval,$http){

	$scope.t=1;

	$scope.list=[
		{name:11,
		 type:1
		},		{name:22,
            type:2
        }

		];



	$rootScope.isShow=true;

	$interval(function(){
		$rootScope.isShow=!$rootScope.isShow;
	},3000);

})