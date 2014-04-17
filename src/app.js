var app = angular.module('app', [ 'ngSwipe' ]);

app.controller('AppCtrl', function AppCtrl($scope)
{
  $scope.message = 'Hey!';

  $scope.swipe = function ($event)
  {
    console.log($event);
  };
});