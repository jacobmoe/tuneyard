angular.module('tuneyard').factory('chatCommands', [
'$rootScope', '$http', 'socket', 'Playlist', 'socket',
function($rootScope, $http, socket, Playlist, socket) {
  
  var sources = {
    reddit: "http://www.reddit.com/r/"
  }

  function drop(playlist) {
    if ($rootScope.currentTrack) {
      var index = $rootScope.currentTrack.index

      playlist.deleteTrack(index, function (err, data) {
        socket.emit('messages:create', {content: 'Track dropped'})
        socket.emit('playlists:trackDropped', {
          index: index,
          playlistId: playlist.id
        })
      })
    }
  }

  function skip(playlist) {
    socket.emit('playlists:skipTrack', {playlistId: playlist.id})
  }

  function add(playlist, director, name) {
    switch (director) {
      case 'to':
        addTrackToPlaylist(name)
        break
      case 'subreddit':
        var url = 'http://reddit.com/r/' + name + '.json'
        var params = { type: 'reddit', name: name, url: url }
        addSource(playlist, params)
        break
      default:
        socket.emit('notices:send', {content: "can't add that"})
    }
  }
  
  function addTrackToPlaylist(newPlaylistName) {
    var newPlaylist = Playlist.new({name: newPlaylistName})

    newPlaylist.insertTrack($rootScope.currentTrack, function (err, result) {
      if (err) {
        socket.emit('notices:send', {content: 'no playlist with that name'})
      } else {
        socket.emit('messages:create', {
          content: $rootScope.currentTrack.title + ' added to ' + newPlaylistName
        })
      }
    })
  }
  
  function addSource(playlist, params) {
    var apiUrl = '/api/playlists/' + playlist.name + '/sources'

    $http.post(apiUrl, params).success(function(data) {
      socket.emit('messages:create', {
        content: '/r/' + params.name + ' added to sources'
      })
    })
    .error(function(data) {
      socket.emit('notices:send', {content: 'no subreddit with that name'})
    })
  }

  function process(str, playlist) {
    var regex = /^add ([\w-]*) ([\w-]*$)/
    var match = str.match(regex)

    if (match) {
      add(playlist, match[1], match[2])
      return true
    }

    switch (str) {
      case 'drop':
        drop(playlist)
        return true
      case 'skip':
        skip(playlist)
        return true
    }

    return false
  }

  return {
    process: process
  }

}])
