angular.module('tuneyard').factory('Playlist', [
'$http',
function($http) {
  
  function Playlist(data) {
    this.id = data.id
    this.name = data.name,
    this.sources = data.sources
  }

  Playlist.prototype.insertTrack = function (track, done) {
    $http.post('/api/playlists/' + this.name + '/tracks', track)
    .success(function(data) {done(null, data)})
    .error(function(err) { done(err) })
  }

  Playlist.prototype.getTrack = function (index, done) {
    $http.get('/api/playlists/' + this.name + '/tracks/' + index)
    .success(function(data) {done(null, data)})
    .error(function(err) {done(err)})
  }

  Playlist.prototype.deleteTrack = function (index, done) {
    var self = this

    $http.delete('/api/playlists/' + this.name + '/tracks/' + index)
    .success(function(data) {done(null, self)})
    .error(function(err) {done(err)})
  }

  Playlist.prototype.addSource = function (source, done) {
    var self = this

    $http.post('/api/playlists/' + this.name + '/sources', source)
    .success(function(data) {
      self.sources = data.sources
      done(null, data)
    })
    .error(function(err) { done(err) })
  }

  Playlist.prototype.reload = function (done) {
    var self = this

    $http.get('/api/playlists/' + this.name)
    .success(function(data) {
      self.sources = data.sources
      done(null, self)
    })
    .error(function(err) { done(err) })
  }

  Playlist.prototype.deleteSource = function (index, done) {
    var self = this

    if (this.sources[index]) {
      $http.delete('/api/playlists/' + this.name + '/sources/' + index)
      .success(function(data) {
        self.sources = data.sources
        done(null, self)
      })
      .error(function(err) { done(err) })
    } else {
      done({message: 'source not found'})
    }
  }


  function initialize(params) {
    return new Playlist(params)
  }

  return {
    new: initialize
  }

  }

])
