angular.module('tuneyard').directive('tyPlayer', [
'socket', '$rootScope',
function(socket, $rootScope) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-player.html',
    link: function(scope, element) {
      socket.on('tracks:startNew', function (data) {
        scope.messages.push(data)
      })
    }
  }

}])
