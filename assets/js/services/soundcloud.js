angular.module('tuneyard').factory('soundcloud',
  ['$http', '$q', '$rootScope', '$timeout',
  function($http, $q, $rootScope, $timeout) {

    var widget
      , scheduled
      , startAt = 0
      , loaded = false
      , muted = false
      , attempt = 0
      , maxAttempts = 10
      , apiBaseUrl = "https://api.soundcloud.com/tracks/"
      , errorMessage = 'Something is wrong with the player. Tell someone!'

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
        widget.setVolume(100) 
      })

      widget.bind(SC.Widget.Events.PLAY, function() {
        if (muted) mute()
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
    
    function stop() {
      if (scheduled) {
        $timeout.cancel(scheduled)
        scheduled = null
      }
      
      attempt = 0

      if (widget) {
        widget.pause()
      }
    }
    
    function mute() {
      if (widget) {
        widget.setVolume(0) 
        muted = true
      }
    }

    function unmute() {
      if (widget) {
        widget.setVolume(100) 
        muted = false
      }
    }

    return {
      init: init,
      loadTrack: loadTrack,
      stop: stop,
      mute: mute,
      unmute: unmute,
      isLoaded: function () {
        return loaded
      }
    }

  }

])
