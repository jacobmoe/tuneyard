angular.module('tuneyard').directive('tyPlayer', [
'socket', '$rootScope',
function(socket, $rootScope) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-player.html',
    link: function(scope, element) {
      socket.emit('player:loaded', {playlist: 'default'})

      socket.on('tracks:startNew', function (data) {
        console.log("new current track", data)
      })
      
      socket.on('player:initialize', function (data) {
        debugger
        console.log("init player", data)
      })

      socket.on('playlist:error', function (error) {
        console.log('playlist error', error)
      })
    }
  }

}])
