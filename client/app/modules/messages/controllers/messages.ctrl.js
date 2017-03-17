(function () {
  'use strict';
  angular
    .module('com.module.messages')
    .controller('MessagesCtrl', function (CoreService, $state, $scope, Message, Device, uiGmapGoogleMapApi, uiGmapIsReady, DTOptionsBuilder, DTColumnDefBuilder) {

      $scope.expandParsedData = true;

      $scope.expand = function(){
        $scope.expandParsedData = !$scope.expandParsedData;
      }

      $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(50).withOption('order', [[0, 'desc']]);

      //------------Get Messages---------------

      $scope.messages = [];

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

      getMessages();

      $scope.refreshMessages = function(){
        getMessages()
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

      // ------------- Maps ---------------

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
          zoom: 14,
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
