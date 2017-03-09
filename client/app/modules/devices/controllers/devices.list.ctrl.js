(function () {
  'use strict';
  angular
    .module('com.module.devices')
    .controller('DevicesCtrl', function (CoreService, $state, $scope, Device, Downlink) {


      function getDevices() {
        Device.find({},
          function (items) {
            // items.forEach(function (item) {
            //   item.time = item.time * 1000; //to milliseconds
            // });
            $scope.devices = items;
            console.log($scope.devices)
          },
          function (errorResponse) { /* error */
          }
        );
      }

      getDevices();

    });
})();
