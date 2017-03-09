(function () {
  'use strict';
  angular
    .module('com.module.messages')
    .controller('MessagesCtrl', function (CoreService, $state, $scope, Message, Device, uiGmapGoogleMapApi, uiGmapIsReady) {

      $scope.messages = [];

      getMessages();

      //------------Get Messages---------------
      // Get Messages
      function getMessages() {
        Message.find({
            filter: {
              order: 'time DESC'
            }
          },
          function (items) {

            $scope.messages = items;
            //console.log($scope.messages)
          },
          function (errorResponse) { /* error */
          }
        );
      }

      // ------- Delete Message --------

      $scope.deleteMessage = function (message) {

        console.log(message.id);

        CoreService.confirm(
          'Are you sure?',
          'Deleting this cannot be undone',
          function () {
            Message.deleteById({id: message.id}, function () {
              CoreService.toastSuccess(
                'Message deleted',
                'Your message is deleted!');
              getMessages();
            }, function (err) {
              CoreService.toastError(
                'Error deleting message',
                'Your rhino is not deleted! ' + err);
            });
          },
          function () {

          }
        );
      }

    });
})();
