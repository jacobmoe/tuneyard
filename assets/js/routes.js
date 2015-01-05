angular.module('tuneyard').config([
'$stateProvider', '$urlRouterProvider', '$locationProvider',
function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true)

  $urlRouterProvider.otherwise("/");

  $stateProvider
  .state('index', {
    abstract: true,
    resolve: {
      playlist: [
      '$rootScope', '$http', '$location',
      function ($rootScope, $http, $location) {
        var path = $location.path()

        if (path === '/') path = '/default'
        var url = 'api/playlists' + path + '?truncated=true'

        return $http.get(url).then(function (response) {
          $rootScope.currentPlaylist = response.data
          return response.data
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
  .state('index.default', {
    url: '/'
  })
  .state('index.custom', {
    url: '/{playlistName:(?:reddit|default)}'
  })
}])
