angular.module('tuneyard').directive('tyChat', [
'socket', '$rootScope',
function(socket, $rootScope) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/assets/templates/directives/ty-chat.html',
    link: function(scope, element) {
      scope.currentMessage = ''
      scope.messages = []

      scope.newMessage = function () {
        socket.emit('add-new-message', {
          content: scope.currentMessage,
          account: $rootScope.currentUser._id
        })
        scope.currentMessage = ''
      }

      scope.isLast = function (index) {
        return index === scope.messages.length - 1
      }
      
      scope.$watchCollection('messages', function () {
        scrollToChatBottom()
      })
      
      socket.on('new-message', function (data) {
        scope.messages.push(data)
      })

      socket.on('init-messages', function (data) {
        scope.messages = _.sortBy(data, function (m) {
          return new Date(m.createdAt)
        })
      })

      socket.on('notice:userConnected', function (data) {
        scope.messages.push({
          type: 'notice',
          content: data.name + ' connected'
        })
      })

      socket.on('tracks:new', function (data) {
        scope.messages.push({
          type: 'notice',
          content: 'New track added: ' + data.title
        })
      })

      function scrollToChatBottom() {
        var chatBox = element.find('.chatBox')[0]
        if (!chatBox) return

        chatBox.scrollTop = chatBox.scrollHeight
      }

      socket.emit('init-chat', $rootScope.currentUser)
    }
  }

}])
