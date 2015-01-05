angular.module('tuneyard').controller('BodyCtrl',
  ['$scope', '$rootScope', 'socket',
  function($scope, $rootScope, socket) {

    $rootScope.$on('auth-changed', function (event, data) {
      $rootScope.currentUser = data
    })

    $rootScope.$on('newTrack', function (event, data) {
      $rootScope.currentTrack = data
    })

    $scope.logout = function () {
      auth.logout().then(function () {
        console.log('logged out')
      })
    }
  }
])
