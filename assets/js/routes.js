angular.module('tuneyard').config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('index', {
      url: "/",
      templateUrl: "index.html",
      resolve: {
        thing: [function () {
          debugger
        }]
      },
      views: {
        "sidebar": {
          template: "sidebar.html",
          controller: 'SidebarCtrl',
        },
        "body": {
          template: "body.html",
          controller: 'BodyCtrl'
        }
      }
    })
})
