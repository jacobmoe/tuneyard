angular.module('tuneyard').factory('soundcloud',
  ['$http', '$q', '$rootScope',
  function($http, $q, $rootScope) {
    
    var widget, startTime = 0, loaded = false
    
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

      widget.bind(SC.Widget.Events.PLAY, function(){
        widget.seekTo(startTime)
      })
    }
    
    function loadTrack (trackId, startAt) {
      startTime = startAt || 0
      
      var newUrl = "https://api.soundcloud.com/tracks/" + trackId

      if (widget && loaded) {
        widget.load(newUrl, options)
        return true
      } else {
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
