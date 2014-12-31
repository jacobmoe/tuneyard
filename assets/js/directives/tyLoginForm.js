angular.module('tuneyard').directive('tyLoginForm', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-login-form.html',
    controller: function($scope) {
      console.log("=================")
    }
  }
})
