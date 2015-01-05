angular.module('tuneyard').directive('tyPlayer', [
'socket', '$rootScope', '$timeout',
function(socket, $rootScope, $timeout) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-player.html',
    link: function(scope, element) {
      scope.muted = false
      scope.track = {}

      scope.playerVars = {
        controls: 0,
        autoplay: 1
      }
      
      scope.mute = function (youtubePlayer) {
        youtubePlayer.mute()
        scope.muted = true
      }

      scope.unMute = function (youtubePlayer) {
        youtubePlayer.unMute()
        scope.muted = false
      }

      scope.$on('youtube.player.ready', function ($event, player) {
        if (scope.muted) player.mute()
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

      socket.emit('player:loaded', {playlistId: $rootScope.currentPlaylist.id})
    }
  }

}])
