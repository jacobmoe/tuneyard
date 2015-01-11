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

  function add(newPlaylistName) {
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
  
  function addSource(name, identifier) {
    if (name === 'reddit') {
      var url = sources.reddit + identifier

      $http.post(url).success(function(data) {
        debugger
      })
      .error(function(data) {
        debugger
        socket.emit('notices:send', {content: 'no subreddit with that name'})
      })
    } else {
      socket.emit('notices:send', {content: 'no source with that name'})
    }
  }

  function process(str, playlist) {
    var regex = /^add to ([\w-]*$)/
    var match = str.match(regex)

    if (match) {
      add(match[1], playlist)
      return true
    }

    regex = /^add source ([\w-]*) ([\w-]*$)/
    match = str.match(regex)

    debugger

    if (match) {
      addSource(match[1], match[2], playlist)
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
