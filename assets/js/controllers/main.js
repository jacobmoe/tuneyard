angular.module('tuneyard').controller('MainCtrl',
  ['$scope', '$rootScope', 'auth',
  function($scope, $rootScope, auth) {
    $rootScope.$on('auth-changed', function (event, data) {
      $rootScope.currentUser = data
    })

    auth.getUser().then(function (user) {
      $rootScope.currentUser = user
    })

    $scope.logout = function () {
      auth.logout().then(function () {
        console.log('logged out')
      })
    }
  }
])
