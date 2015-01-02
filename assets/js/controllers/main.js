angular.module('tuneyard').controller('MainCtrl',
  ['$scope', '$rootScope', 'auth', 'socket',
  function($scope, $rootScope, auth, socket) {
    $rootScope.$on('auth-changed', function (event, data) {
      $rootScope.currentUser = data
    })

    auth.getUser().then(function (user) {
      $rootScope.currentUser = user
    })
    
    $rootScope.$on('newTrack', function (event, data) {
      $rootScope.currentTrack = data
    })

    $scope.logout = function () {
      auth.logout().then(function () {
        console.log('logged out')
      })
    }
    
    socket.on('playlists:current', function (data) {
      $rootScope.currentPlaylistId = data
    })

    socket.emit('playlists:getCurrent', {playlistName: 'default'})
  }
])
