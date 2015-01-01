angular.module('tuneyard').controller('SidebarCtrl',
  ['$scope', '$rootScope', '$window',
  function($scope, $rootScope, $window) {
    $scope.sidebarOpen = true
    
    $scope.toggleOpen = function () {
      $scope.sidebarOpen = !$scope.sidebarOpen
    }
    
  }
])
