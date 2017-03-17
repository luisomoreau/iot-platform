(function () {
    'use strict';
    angular
        .module('com.module.devices')
        .config(function ($stateProvider) {
                $stateProvider
                    .state('app.devices', {
                        abstract: true,
                        url: '/devices',
                        templateUrl: 'modules/devices/views/main.html'
                    })
                    .state('app.devices.list', {
                        url: '',
                        templateUrl: 'modules/devices/views/list.html',
                        controllerAs: 'ctrl',
                        controller: 'DevicesCtrl'
                    })
                  .state('app.devices.edit', {
                    url: '/:id/edit',
                    templateUrl: 'modules/devices/views/edit.html',
                    controllerAs: 'ctrl',
                    controller: function ($state, Device, Parser, device) {
                      console.log(device);
                      this.device = device;
                      this.submit = function () {
                        device.$save().then(function () {
                          $state.go('^.list');
                        });
                      };
                      this.parsers =  Parser.find({
                        filter: {order: 'created DESC'}
                      });

                    },
                    resolve: {
                      device: function ($stateParams, Device) {
                        console.log($stateParams.id);
                        return Device.findById({
                          id: $stateParams.id
                        }).$promise;
                      }
                    }
                  })
            }
        );

})();
