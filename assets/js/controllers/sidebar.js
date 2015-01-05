angular.module('tuneyard').controller('SidebarCtrl',
  ['$scope', '$rootScope', 'playlist',
  function($scope, $rootScope, playlist) {
    $scope.sidebarOpen = false
    
    $scope.toggleOpen = function () {
      $scope.sidebarOpen = !$scope.sidebarOpen
    }

    $rootScope.$on('auth-changed', function (event, data) {
      $rootScope.currentUser = data
    })

    $scope.logout = function () {
      auth.logout().then(function () {
        console.log('logged out')
      })
    }
  }
])
