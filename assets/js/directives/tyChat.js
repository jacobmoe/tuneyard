angular.module('tuneyard').directive('tyChat', [
'socket', '$rootScope', 'Playlist', 'sourceParser', '$timeout', 'chatCommands',
function(socket, $rootScope, Playlist, sourceParser, $timeout, chatCommands) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-chat.html',
    link: function(scope, element) {

      scope.currentMessage = ''
      scope.messages = []

      scope.newMessage = function () {
        var playlist = Playlist.new($rootScope.currentPlaylist)

        socket.emit('messages:create', {
          content: scope.currentMessage,
          account: $rootScope.currentUser._id
        })

        if (!chatCommands.process(scope.currentMessage, playlist)) {
          var sourceData = sourceParser.parse(scope.currentMessage)

          if (sourceData) {
            playlist.insertTrack(sourceData, function (err, data) {
              socket.emit('messages:create', {
                content: 'New track added: ' + data.title
              })
            })
          }
        }

        scope.currentMessage = ''
      }

      scope.$watchCollection('messages', function () {
        scrollToChatBottom()
      })

      socket.on('messages:display', function (data) {
        scope.messages.push(data)
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

      socket.emit('messages:init:client', $rootScope.currentUser)
    }
  }

}])
