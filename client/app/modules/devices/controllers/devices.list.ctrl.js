(function () {
  'use strict';
  angular
    .module('com.module.devices')
    .controller('DevicesCtrl', function (CoreService, $state, $scope, Device, Downlink) {

      $scope.edit = false;

      function getDevices() {
        Device.find({
            filter: {
              include: 'Downlink'
            }
          },
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

      // ------- Reset default downlink behaviour -------
      //
      // $scope.resetDefaultBehaviour = function (devices) {
      //   CoreService.confirm(
      //     'Are you sure?',
      //     'This means all the downlinks will be configured as default:  One position every 8 hours, One downlink configuration every 24 hours, GPS fix limit set to 60 secondes',
      //     function () {
      //       resetDownlinks(devices);
      //     },
      //     function () {
      //       cancelUpdateDownlinks();
      //     }
      //   );
      // };
      //
      // function resetDownlinks(devices){
      //   devices.forEach(function(device){
      //     Downlink.create(
      //       {fix_interval: 8},
      //       {timeout: 60},
      //       {dl_interval: 3},
      //       {deviceId: device.id}
      //     );
      //   })
      //   getDevices();
      // }
      //
      // function cancelUpdateDownlinks(){
      //   return 0;
      // }

      // ------ Update Device behaviour (downlink) -------

      var index;

      $scope.deviceSelected = {};

      $scope.getTemplate = function (device) {
        if (device.id === $scope.deviceSelected.id) return 'edit';
        else return 'display';
      };

      $scope.edit = function (device) {
        $scope.deviceSelected = angular.copy(device);
      };

      $scope.updateDownlink = function (device) {
        var create = false;
        if (!device.Downlink) {
          create = true
        }
        generateDownlinkPayload(device, create);

        $scope.deviceSelected = {};
      };

      $scope.uplinkFrequencies = [
        {value: 1, text: "1 hour"},
        {value: 2, text: "2 hours"},
        {value: 3, text: "3 hours"},
        {value: 4, text: "4 hours"},
        {value: 5, text: "5 hours"},
        {value: 6, text: "6 hours"},
        {value: 7, text: "7 hours"},
        {value: 8, text: "8 hours"},
        {value: 9, text: "9 hours"},
        {value: 10, text: "10 hours"},
        {value: 11, text: "11 hours"},
        {value: 12, text: "12 hours"},
        {value: 13, text: "13 hours"},
        {value: 14, text: "14 hours"},
        {value: 15, text: "15 hours"},
        {value: 16, text: "16 hours"},
        {value: 17, text: "17 hours"},
        {value: 18, text: "18 hours"},
        {value: 19, text: "19 hours"},
        {value: 20, text: "20 hours"},
        {value: 21, text: "21 hour"},
        {value: 22, text: "22 hours"},
        {value: 23, text: "23 hours"},
        {value: 24, text: "24 hours"}
      ];

      $scope.timeoutValues = [
        {value: 10, text: "10 seconds"},
        {value: 20, text: "20 seconds"},
        {value: 30, text: "30 seconds"},
        {value: 40, text: "40 seconds"},
        {value: 50, text: "50 seconds"},
        {value: 60, text: "60 seconds"},
        {value: 70, text: "70 seconds"},
        {value: 80, text: "80 seconds"},
        {value: 90, text: "90 seconds"},
        {value: 100, text: "100 seconds"},
        {value: 110, text: "110 seconds"},
        {value: 120, text: "120 seconds"}
      ];

      $scope.buildDLFrequencies = function(device){

        $scope.dlFrequencies = [
          {value: 1, text: device.Downlink.fix_interval * 1 + "hours"},
          {value: 2, text: device.Downlink.fix_interval * 2 + "hours"},
          {value: 3, text: device.Downlink.fix_interval * 3 + "hours"},
          {value: 4, text: device.Downlink.fix_interval * 4 + "hours"},
          {value: 5, text: device.Downlink.fix_interval * 5 + "hours"},
          {value: 6, text: device.Downlink.fix_interval * 6 + "hours"},
          {value: 7, text: device.Downlink.fix_interval * 7 + "hours"},
          {value: 8, text: device.Downlink.fix_interval * 8 + "hours"},
          {value: 9, text: device.Downlink.fix_interval * 9 + "hours"},
          {value: 10, text: device.Downlink.fix_interval * 10 + "hours"},
          {value: 11, text: device.Downlink.fix_interval * 11 + "hours"},
          {value: 12, text: device.Downlink.fix_interval * 12 + "hours"}
        ]
      };



      function generateDownlinkPayload(device, create) {
        console.log(create);

        if (create) {
          device.Downlink = {
            encrypt: false,
            fix_interval: 8,
            timeout: 60,
            dl_interval: 3,
            no_move_alert_interval: 0,
            payload: "3c08038a00ff0000",
            deviceId: device.id
          };
          Downlink.create(device.Downlink);
        } else {

          Downlink.findOne({
            filter: {
              where: {
                id: device.Downlink.id
              }
            }
          }, function(dl){

            dl.fix_interval = device.Downlink.fix_interval ? device.Downlink.fix_interval : 8;
            dl.timeout = device.Downlink.timeout ? device.Downlink.timeout : 60;
            dl.dl_interval = device.Downlink.dl_interval ? device.Downlink.dl_interval : 3;


            var timeout = dl.timeout.toString(16);
            var fix_interval;
            var dl_interval;
            if(dl.fix_interval>15){
              fix_interval = dl.fix_interval.toString(16);
            }else{
              fix_interval = 0x00 + dl.fix_interval.toString(16);
            }
            if(dl.dl_interval>15){
              dl_interval = dl.dl_interval.toString(16);
            }else {
              dl_interval = 0x00 + dl.dl_interval.toString(16);
            }
            dl.payload = timeout + fix_interval + dl_interval + "8a00ff0000";
            console.log(dl.payload);


            dl.$save();
          });
          // dl.id = device.Downlink.id;
          // dl.fix_interval = device.Downlink.fix_interval ? device.Downlink.fix_interval : 8;
          // dl.timeout = device.Downlink.timeout ? device.Downlink.timeout : 60;
          // dl.dl_interval = device.Downlink.dl_interval ? device.Downlink.dl_interval : 3;
          // dl.deviceId = device.id;

        }
      }

    });
})();
