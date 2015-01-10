angular.module('tuneyard').directive('tyPlayer', [
'socket', '$rootScope', '$timeout', '$sce',
function(socket, $rootScope, $timeout, $sce) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-player.html',
    link: function(scope, element) {
      scope.muted = false
      scope.track = {}

      //"?url=https://api.soundcloud.com/tracks/39804767&show_artwork=false&liking=false&sharing=false&auto_play=true"
      
      scope.scPlayerBase = $sce.trustAsResourceUrl("https://w.soundcloud.com/player?url=https://api.soundcloud.com/tracks/39804767&show_artwork=false&liking=false&sharing=false&auto_play=true")

      var iframeElement = document.querySelector('iframe#sc-widget')
      var scWidget        = SC.Widget(iframeElement)

      var newUrl = "https://api.soundcloud.com/tracks/39804766"

      // widget.load(newUrl)

      scWidget.bind(SC.Widget.Events.READY, function() {
        scWidget.load(newUrl, {
          show_artwork: false,
          liking: false,
          sharing: false,
          auto_play: true
        })
      })

      scWidget.bind(SC.Widget.Events.PLAY, function(){
        scWidget.seekTo(10000)
      });

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
