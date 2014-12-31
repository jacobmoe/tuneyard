angular.module('tuneyard').directive('tyChat', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-chat.html',
    controller: ['$scope', 'socket', function($scope, socket) {
      
      $scope.newMessage = function () {
        debugger
      }

    }]
  }
})
