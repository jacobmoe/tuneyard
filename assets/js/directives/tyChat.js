angular.module('tuneyard').directive('tyChat', [
'socket', '$rootScope', 'Playlist', 'originParser', '$timeout', 'chatCommands', '$sce',
function(socket, $rootScope, Playlist, originParser, $timeout, chatCommands, $sce) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-chat.html',
    link: function(scope, element) {
      scope.messages = []

      scope.$on('newMessageEntered', function (event, message) {
        var playlist = Playlist.new($rootScope.currentPlaylist)

        socket.emit('messages:create', {
          content: message,
          account: $rootScope.currentUser._id
        })

        if (!chatCommands.process(message, playlist)) {
          var originData = originParser.parse(message)

          if (originData) {
            playlist.insertTrack(originData, function (err, data) {
              if (err) {
                var contents = [
                  "Something went wrong.",
                  "Maybe that track isn't streamable."
                ]

                socket.emit('messages:create', {
                  content: contents.join(' ')
                })
              } else {
                socket.emit('messages:create', {
                  content: 'New track added: ' + data.title
                })
              }
            })
          }
        }
      })

      scope.$watchCollection('messages', function () {
        scrollToChatBottom()
      })

      scope.$on('sidebarOpened', function () {
        scrollToChatBottom()
      })

      scope.trustedHtml = function (content) {
        return $sce.trustAsHtml(content)
      }

      socket.on('messages:display', function (data) {
        scope.messages.push(data)

        $rootScope.$broadcast('messages:display', data)
      })

      socket.on('messages:init', function (data) {
        scope.messages = _.sortBy(data, function (m) {
          return new Date(m.createdAt)
        })
      })

      socket.on('notices:new', function (data) {
        console.log('new notice', data)
        data.type = 'notice'

        scope.messages.push(data)
      })

      function scrollToChatBottom() {
        $timeout(function () {
          var chatBox = element.find('.chatBox')[0]
          if (!chatBox) return

          chatBox.scrollTop = chatBox.scrollHeight
        }, 50)

      }

      socket.emit('messages:init:client', {
        user: $rootScope.currentUser,
        playlist: $rootScope.currentPlaylist
      })
    }
  }

}])
