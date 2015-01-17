angular.module('tuneyard').controller('SidebarCtrl',
  ['$scope', '$rootScope', 'playlist', 'auth', '$state',
  function($scope, $rootScope, playlist, auth, $state) {
    $rootScope.unread = null
    $scope.currentMessage = ''
    
    $scope.toggleOpen = function () {
      if (!$rootScope.sidebarOpen) {
        $rootScope.unread = null
        $rootScope.$broadcast('sidebarOpened')
      }

      $rootScope.sidebarOpen = !$rootScope.sidebarOpen
    }
 
    $scope.gotoPlaylist = function (name) {
      $state.go('index', {playlistName: name})
    }

    $scope.addNewMessage = function () {
      $rootScope.$broadcast('newMessageEntered', $scope.currentMessage)
      $scope.currentMessage = ''
    }


    $scope.$on('auth-changed', function (event, data) {
      $rootScope.currentUser = data
    })

    $scope.$on('messages:display', function (event, data) {
      if ($rootScope.sidebarOpen) return
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
