(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.core.controller:HomeCtrl
   * @description Dashboard
   * @requires $scope
   * @requires $rootScope
   **/
  angular
    .module('com.module.core')
    .controller('HomeCtrl', function ($scope, $rootScope, LoopBackAuth, User, Device, Message, uiGmapGoogleMapApi, CoreService, uiGmapIsReady) {

      $scope.fakeData = false;

      // ------- Build boxes --------
      $rootScope.dashboardBox = [];

      Message.find(function (messages) {
        $rootScope.addDashboardBox('Messages', 'bg-red', 'ion-chatbubble-working', messages.length, 'app.messages.list');
      });
      Device.find(function (devices) {
        $rootScope.addDashboardBox('Devices', 'bg-blue', 'ion-location', devices.length, 'app.devices.list');
      });

      $scope.count = {};
      $scope.boxes = $rootScope.dashboardBox;

    });

})();
