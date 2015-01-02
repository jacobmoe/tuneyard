angular.module('tuneyard').directive('tyPlayer', [
'socket', '$rootScope',
function(socket, $rootScope) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-player.html',
    link: function(scope, element) {
      var initialized

      scope.track = {}

      scope.playerVars = {
        controls: 0,
        autoplay: 1
      }
      
      $rootScope.$watch('currentPlaylistId', function () {
        var id = $rootScope.currentPlaylistId

        if (id && !initialized) {
          socket.emit('player:loaded', {playlistId: id})
          initialized = true
        }
      })

      socket.on('tracks:startNew', function (data) {
        console.log("new current track", data)
        scope.track = data
        
        if (scope.playerVars.start)
          delete scope.playerVars.start
        
        $rootScope.$broadcast('newTrack', data)
      })
      
      socket.on('player:initialize', function (data) {
        console.log("init player", data)
        scope.track = data
        scope.playerVars.start = Number(data.startAt).toFixed()

        $rootScope.$broadcast('newTrack', data)
      })

      socket.on('playlist:error', function (error) {
        console.log('playlist error', error)
      })
    }
  }

}])
