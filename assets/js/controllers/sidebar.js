angular.module('tuneyard').controller('SidebarCtrl',
  ['$scope', '$rootScope', 'playlist', 'auth', '$state',
  function($scope, $rootScope, playlist, auth, $state) {
    $scope.sidebarOpen = false
    $rootScope.unread = null

    $scope.toggleOpen = function () {
      if (!$scope.sidebarOpen)
        $rootScope.unread = null

      $scope.sidebarOpen = !$scope.sidebarOpen
    }
 
    $scope.gotoPlaylist = function (name) {
      if (name === 'default') {
        $state.go('index.default', {reload: true})
      } else {
        $state.go('index.custom', {playlistName: name}, {reload: true})
      }
    }

    $rootScope.$on('auth-changed', function (event, data) {
      $rootScope.currentUser = data
    })

    $rootScope.$on('messages:display', function (event, data) {
      if ($scope.sidebarOpen) return
      if (data.content === $scope.currentUser.name + ' connected') return

      if (!$rootScope.unread) $rootScope.unread = 1
      else $rootScope.unread++
    })

    $scope.logout = function () {
      auth.logout().then(function () {
        console.log('logged out')
      })
    }
  }
])
