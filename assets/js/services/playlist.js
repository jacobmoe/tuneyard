angular.module('tuneyard').factory('Playlist', [
'$http',
function($http) {
  
  function Playlist(data) {
    this.id = data.id
    this.name = data.name
  }
  
  Playlist.prototype.insertTrack = function (track, done) {
    $http.post('/api/playlists/' + this.name + '/tracks', track)
    .success(function(data) { done(null, data) })
    .error(function(err) { done(err) })
  }

  Playlist.prototype.getTrack = function (index, done) {
    $http.get('/api/playlists/' + this.name + '/tracks/' + index)
    .success(function(data) { done(null, data) })
    .error(function(err) { done(err) })
  }

  Playlist.prototype.deleteTrack = function (index, done) {
    $http.delete('/api/playlists/' + this.name + '/tracks/' + index)
    .success(function(data) { done(null, data) })
    .error(function(err) { done(err) })
  }

  function initialize(params) {
    return new Playlist(params)
  }

  return {
    new: initialize
  }

  }

])
