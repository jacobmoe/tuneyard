angular.module('tuneyard').directive('tyPlayer', [
'socket', '$rootScope', '$timeout', '$sce', '$window', 'soundcloud',
function(socket, $rootScope, $timeout, $sce, $window, soundcloud) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-player.html',
    link: function(scope, element) {
      scope.muted = false
      scope.track = {}

      var scIframe = $window.document.querySelector('iframe#sc-widget')
      soundcloud.init(scIframe)

      scope.playerVars = {
        controls: 0,
        autoplay: 1
      }

      scope.mute = function (youtubePlayer) {
        if (youtubePlayer) youtubePlayer.mute()
        
        soundcloud.mute()
        scope.muted = true
      }

      scope.unMute = function (youtubePlayer) {
        if (youtubePlayer) youtubePlayer.unMute()

        soundcloud.unmute()
        scope.muted = false
      }

      scope.$on('youtube.player.ready', function ($event, player) {
        if (scope.muted) player.mute()
      })

      socket.on('tracks:startNew', function (data) {
        console.log("new current track", data)

        if (data.source == 'Soundcloud') {
          soundcloud.loadTrack(data.sourceId, 0)
          scope.ytTrack = null
        } else {
          soundcloud.stop()
          scope.ytTrack = data

          if (scope.playerVars.start)
            delete scope.playerVars.start
        }

        $rootScope.$broadcast('newTrack', data)
      })

      socket.on('player:initialize', function (data) {
        console.log("init player", data)

        var startAt = Number(data.startAt).toFixed()

        if (data.source === 'Soundcloud') {
          soundcloud.loadTrack(data.sourceId, startAt)
        } else {
          scope.ytTrack = data
          scope.playerVars.start = startAt
        }

        $rootScope.$broadcast('newTrack', data)
      })

      socket.on('playlist:error', function (error) {
        console.log('playlist error', error)
      })
      
      $rootScope.$on('player:error', function (err) {
        scope.currentTrack.title = "Error: " + err.message
      })

      socket.emit('player:loaded', {playlistId: $rootScope.currentPlaylist.id})
    }
  }

}])
