angular.module('tuneyard').factory('chatCommands', [
'$rootScope', '$http', 'socket', 'Playlist', 'socket',
function($rootScope, $http, socket, Playlist, socket) {

  var commandsHelp = {
    'drop': 'Remove current track from playlist',
    'skip': 'Skip current track',
    'add to PLAYLIST_NAME': 'Add current track to playlist',
    'show sources': 'Show all sources',
    'add subreddit SUB_NAME': 'Add source to playlist',
    'remove subreddit SUB_NAME': 'Remove source from playlist'
  }

  var sources = {
    reddit: "http://www.reddit.com/r/"
  }

  function help() {
    var content = ["<strong>Help</strong>"]
    content.push("<ul class='help-items'>")
    content.push('<li>To add a new track, paste a link to a youtube video')
    content.push(' or a soundcloud song.</li>')
    content.push('<li>You can add sources that will add tracks for you.')
    content.push(' Only reddit is supported so far.</li>')
    content.push('<li>Sources are checked for new tracks every two hours.</li>')
    content.push('</ul>')
    content.push("<strong>Commands</strong>")
    content.push("<ul class='help-items'>")

    Object.keys(commandsHelp).forEach(function (key) {
      content.push("<li><div class='help-command'>" + key + "</div>")
      content.push(commandsHelp[key] + '</li>')
    })

    content.push('</ul>')

    socket.emit('messages:create', {content: content.join('')})
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
    socket.emit('playlists:skipTrack:request', {playlistId: playlist.id})
  }

  function showSources(playlist) {
    playlist.getSources(function (err, result) {
      if (err) {
        socket.emit('messages:create', {content: "no sources in this playlist"})
      } else {
        var contentList = result.map(function (s) {
          if (s.type == 'reddit') return s.name
          else return s.url
        })

        var content = '<strong>Subreddits:</strong><br>' + contentList.join('<br>')
        socket.emit('messages:create', {content: content})
      }
    })
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

  function remove(playlist, director, name) {
    switch (director) {
      case 'subreddit':
        playlist.getSources(function (err, sources) {
          var index = _.findIndex(sources, {type: 'reddit', name: name})
          removeSource(playlist, index)
        })
        break
      default:
        socket.emit('notices:send', {content: "can't remove that"})
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

    playlist.addSource(params, function (err, result) {
      if (err) {
        socket.emit('notices:send', {content: 'no subreddit with that name'})
      } else {
        socket.emit('messages:create', {
          content: '/r/' + params.name + ' added to sources'
        })
      }
    })
  }

  function removeSource(playlist, index, cb) {
    playlist.deleteSource(index, function (err, obj) {
      if (err) {
        socket.emit('notices:send', {content: 'not a source'})
      } else {
        socket.emit('messages:create', {content: 'removed from sources'})
      }
    })
  }

  function process(str, playlist) {
    var regex = /^add ([\w-]*) ([\w-]*$)/
    var match = str.match(regex)

    if (match) {
      add(playlist, match[1], match[2])
      return true
    }

    regex = /^remove ([\w-]*) ([\w-]*$)/
    match = str.match(regex)

    if (match) {
      remove(playlist, match[1], match[2])
      return true
    }

    switch (str) {
      case 'drop':
        drop(playlist)
        return true
      case 'skip':
        skip(playlist)
        return true
      case 'help':
        help()
        return true
      case 'show sources':
        showSources(playlist)
        return true
    }

    return false
  }

  return {
    process: process
  }

}])
