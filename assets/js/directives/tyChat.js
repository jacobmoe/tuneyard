angular.module('tuneyard').directive('tyChat', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-chat.html',
    controller: ['$scope', '$rootScope', 'socket', function($scope, $rootScope, socket) {
      $scope.currentMessage = ''
      $scope.messages = []
      
      $scope.newMessage = function () {
        socket.emit('add-new-message', {
          content: $scope.currentMessage,
          account: $rootScope.currentUser._id
        })
        $scope.currentMessage = ''
      }
      
      socket.on('new-message', function (data) {
        $scope.messages.push(data)
      })
      
      socket.on('init-messages', function (data) {
        $scope.messages = data
      })

    }]
  }
})
