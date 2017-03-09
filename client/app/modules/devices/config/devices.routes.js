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
            }
        );

})();
