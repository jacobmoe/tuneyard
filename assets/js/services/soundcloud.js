angular.module('tuneyard').factory('soundcloud',
  ['$http', '$q', '$rootScope', '$timeout',
  function($http, $q, $rootScope, $timeout) {

    var widget
      , scheduled
      , startAt = 0
      , loaded = false
      , attempt = 0
      , maxAttempts = 10
      , apiBaseUrl = "https://api.soundcloud.com/tracks/"
      , errorMessage = 'Something is wrong with the player. Quick, tell someone!'

    var options = {
      show_artwork: false,
      liking: false,
      sharing: false,
      auto_play: true
    }

    function init (iframe) {
      widget = SC.Widget(iframe)

      widget.bind(SC.Widget.Events.READY, function() {
        loaded = true
      })

      widget.bind(SC.Widget.Events.PLAY, function() {
        widget.seekTo(startAt * 1000)
      })
    }

    function loadTrack (trackId, startTime) {
      startAt = startTime || 0

      if (scheduled) {
        $timeout.cancel(scheduled)
        scheduled = null
      }

      if (!loaded) {
        if (attempt > maxAttempts) {
          $rootScope.$broadcast('player:error', {message: errorMessage})

          return false
        }

        attempt++

        scheduled = $timeout(function () {
          loadTrack(trackId, startAt)
        }, 1000)

        return true
      }
      
      var newUrl = apiBaseUrl + trackId

      if (widget) {
        attempt = 0

        widget.load(newUrl, options)
        return true
      } else {
        $rootScope.$broadcast('player:error', {message: errorMessage})
        return false
      }
    }

    return {
      init: init,
      loadTrack: loadTrack,
      isLoaded: function () {
        return loaded
      }
    }

  }

])
