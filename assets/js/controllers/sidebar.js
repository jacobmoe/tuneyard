angular.module('tuneyard').controller('SidebarCtrl',
  ['$scope', '$rootScope', '$window',
  function($scope, $rootScope, $window) {
    $scope.sidebarOpen = false
    
    $scope.toggleOpen = function () {
      $scope.sidebarOpen = !$scope.sidebarOpen
    }
    
  }
])
