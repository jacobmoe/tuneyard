angular.module('tuneyard').factory('Playlist', [
'$http',
function($http) {
  
  function Playlist(id) {
    this.id = id
  }
  
  Playlist.prototype.insertTrack = function (track, done) {
    $http.post('/api/playlists/' + this.id + '/tracks', track)
    .success(function(data) { done(null, data) })
    .error(function(err) { done(err) })
  }

  Playlist.prototype.getTrack = function (index, done) {
    $http.get('/api/playlists/' + this.id + '/tracks/' + index)
    .success(function(data) { done(null, data) })
    .error(function(err) { done(err) })
  }

  Playlist.prototype.deleteTrack = function (index, done) {
    $http.delete('/api/playlists/' + this.id + '/tracks/' + index)
    .success(function(data) { done(null, data) })
    .error(function(err) { done(err) })
  }

  function initialize(id) {
    return new Playlist(id)
  }

  return {
    new: initialize
  }

  }

])
