angular.module('tuneyard').factory('originParser', ['$rootScope', function($rootScope) {

  // http://stackoverflow.com/a/10315969/624466
  function youtubeId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    return (url.match(p)) ? RegExp.$1 : null
  }

  function isSoundcloudUrl(url) {
    var regexp = /^https?:\/\/soundcloud.com\/([\w-]*)\/([\w-]*)$/
    return !!url.match(regexp)
  }

  function parse(url) {
    var data

    if (youtubeId(url)) {
      data = {
        origin: 'Youtube',
        originId: youtubeId(url)
      }
    } else if (isSoundcloudUrl(url)) {
      data = {
        origin: 'Soundcloud',
        originId: url
      }
    }

    return data
  }

  return {
    parse: parse
  }

}])
