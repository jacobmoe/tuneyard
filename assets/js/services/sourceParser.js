angular.module('tuneyard').factory('sourceParser', ['$rootScope', function($rootScope) {

    // http://stackoverflow.com/a/10315969/624466
    function youtubeId(url) {
      var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
      return (url.match(p)) ? RegExp.$1 : null
    }

    function parse(url) {
      if (youtubeId(url)) {
        return {
          source: 'Youtube',
          sourceId: youtubeId(url)
        }
      }
    }

    return {
      parse: parse
    }

  }

])
