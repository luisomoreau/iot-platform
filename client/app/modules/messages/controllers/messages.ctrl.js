(function () {
  'use strict';
  angular
    .module('com.module.messages')
    .controller('MessagesCtrl', function (CoreService, $state, $scope, Message, Device, uiGmapGoogleMapApi, uiGmapIsReady) {

      $scope.messages = [];

      $scope.buildMap = function (id, lat, long) {
        console.log('build map');
        $scope.markers = [
          {
            id: id,
            latitude: lat,
            longitude: long
          }
        ];
        $scope.showMap = true;
        $scope.loadMap($scope.markers);
      }

      $scope.showMap = false;

      getMessages();

      // $scope.refreshMessageFromBackend = function () {
      //
      //   for (var i = 0; i < 3; i++) {
      //     Message.sigfox({
      //         offset: i * 100
      //       },
      //       function (response) {
      //         CoreService.toastSuccess('Added new messages');
      //       },
      //       function (error) {
      //         CoreService.toastError('Error: ' + error);
      //       }
      //     );
      //   }
      //
      //   getMessages();
      //
      // };

      $scope.loadMap = function (markers) {

        // Map functions
        uiGmapGoogleMapApi.then(function (maps) {
          $scope.map.window.options.pixelOffset = new google.maps.Size(0, -35, 'px', 'px');
        });

        $scope.map = {
          center: {
            latitude: markers[0].latitude,
            longitude: markers[0].longitude
          },
          zoom: 12,
          options: {
            streetViewControl: false,
            scrollwheel: false,
            scaleControl: true,
            mapTypeId: google.maps.MapTypeId.TERRAIN
          },
          control: {},
          markers: markers,
          markersEvents: {
            click: function (marker, eventName, model) {
              $scope.map.window.model = model;
              $scope.map.window.show = true;
            },
            showHistory: function () {
              console.log(model);
            }
          },
          window: {
            marker: {},
            show: false,
            closeClick: function () {
              this.show = false;
            },
            options: {}
          }
        };
      }


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

      uiGmapIsReady.promise(1).then(function(instances) {
        instances.forEach(function(inst) {
          var map = inst.map;
          console.log(map);
          var uuid = map.uiGmap_id;
          console.log(uuid);
          var mapInstanceNumber = inst.instance; // Starts at 1.
          console.log(mapInstanceNumber);
        });
      });

    });
})();
