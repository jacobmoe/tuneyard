angular.module('tuneyard').factory('chatCommands', [
'$rootScope', 'socket',
function($rootScope, socket) {

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
  
  function process(str, playlist) {
    switch (str) {
      case 'drop':
        drop(playlist)
        return true
      case 'skip':
        skip(playlist)
        return true
      default:
        return false
    }
  }


  return {
    process: process
  }

}])
