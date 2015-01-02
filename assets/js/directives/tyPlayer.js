angular.module('tuneyard').directive('tyPlayer', [
'socket', '$rootScope',
function(socket, $rootScope) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-player.html',
    link: function(scope, element) {
      scope.track = {}

      scope.playerVars = {
        controls: 0,
        autoplay: 1
      }

      socket.emit('player:loaded', {playlist: 'default'})

      socket.on('tracks:startNew', function (data) {
        console.log("new current track", data)
        scope.track = data
        delete scope.playerVars.start
      })
      
      socket.on('player:initialize', function (data) {
        console.log("init player", data)
        scope.track = data
        scope.playerVars.start = data.startAt
      })

      socket.on('playlist:error', function (error) {
        console.log('playlist error', error)
      })
    }
  }

}])
