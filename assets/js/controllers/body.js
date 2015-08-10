angular.module('tuneyard').controller('BodyCtrl',
  ['$scope', '$rootScope', 'socket',
  function($scope, $rootScope, socket) {
    $scope.$on('newTrack', function (event, data) {
      $rootScope.currentTrack = data
    })
  }
])
