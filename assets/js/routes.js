angular.module('tuneyard').config([
'$stateProvider', '$urlRouterProvider', '$locationProvider',
function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true)

  $urlRouterProvider.otherwise("/");

  $stateProvider
  .state('index', {
    url: '/{playlistName:.*}',
    resolve: {
      playlist: [
      '$rootScope', '$http', '$location', '$state', '$stateParams',
      function ($rootScope, $http, $location, $state, $stateParams) {
        var name = $stateParams.playlistName

        if (name === '') name = 'default'

        var url = 'api/playlists/' + name + '?truncated=true'

        return $http.get(url).then(function (response) {
          $rootScope.currentPlaylist = response.data
          return response.data
        })
        .catch(function (err) {
          if (name != 'default')
            $state.go('index')
        })
      }],
      currentUser: ['$rootScope', 'auth', function ($rootScope, auth) {
        return auth.getUser().then(function (user) {
          $rootScope.currentUser = user
          return user
        })
        .catch(function () {
          return null
        })
      }]
    },
    views: {
      "sidebar": {
        templateUrl: "assets/templates/sidebar.html",
        controller: 'SidebarCtrl'
      },
      "body": {
        templateUrl: "assets/templates/body.html",
        controller: 'BodyCtrl'
      }
    }
  })
}])
