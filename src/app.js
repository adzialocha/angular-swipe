'use strict';

var app = angular.module('app', [ 'swipe' ]);

app.controller('AppCtrl', function AppCtrl($scope) {
  $scope.message = 'Hey!';
  $scope.inputtest = '';

  $scope.swipe = function($event) {
    console.log($event);
  };

  $scope.$watch('inputtest', function(newVal) {
    $scope.message = 'Hey ' + newVal + '!';
  });
});
