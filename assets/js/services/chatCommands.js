angular.module('tuneyard').factory('chatCommands', [
'$rootScope', 'socket', 'Playlist', 'socket',
function($rootScope, socket, Playlist, socket) {

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

  function process(str, playlist) {
    var regex = /^add to ([\w-]*$)/
    var match = str.match(regex)

    if (match) {
      add(match[1], playlist)
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
