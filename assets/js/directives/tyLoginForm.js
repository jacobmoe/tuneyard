angular.module('tuneyard').directive('tyLoginForm', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-login-form.html',
    controller: ['$scope', 'auth', function($scope, auth) {
      $scope.formData = {}
      $scope.errors = {}
      
      $scope.submit = function () {
        auth.login($scope.formData)
        .then(function (user) {
          debugger
        })
        .catch(function (err) {
          $scope.errors.login = "no dice"
        })
      }
    }]
  }
})
