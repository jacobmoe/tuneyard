angular.module('tuneyard').factory('auth',
  ['$http', '$q', '$rootScope',
  function($http, $q, $rootScope) {

    var currentUser

    function authChanged() {
      $rootScope.$broadcast('auth-changed', currentUser)
    }

    function getUser() {
      var deferred = $q.defer()

      if (currentUser) {
        deferred.resolve(currentUser)
      } else {
        $http.get('/api/sessions')
          .success(function(user) {
            currentUser = user
            deferred.resolve(user)
          })
          .error(function(err) {
            deferred.reject(err)
          })
      }

      return deferred.promise
    }

    function setUser(user) {
      currentUser = user
    }

    function clear() {
      currentUser = null
    }

    function logout () {
      return $http.delete('/api/sessions')
      .success(function (res) {
        currentUser = null
        authChanged()
        return res
      })
    }

    function login(data) {
      var deferred = $q.defer()

      $http.post('/api/sessions', data)
      .success(function (res) {
        currentUser = res
        deferred.resolve(res)
        authChanged()
      })
      .error(function (err) {
        deferred.reject(err)
      })

      return deferred.promise
    }

    return {
      setUser: setUser,
      getUser: getUser,
      clear: clear,
      logout: logout,
      login: login
    }

  }

])
