(function () {
    'use strict';
    angular
        .module('com.module.devices')
        .run(function ($rootScope, Device, gettextCatalog) {
            $rootScope.addMenu(gettextCatalog.getString('Devices'), 'app.devices.list', 'ion-location');

            // Device.find(function (devices) {
            //     $rootScope.addDashboardBox(gettextCatalog.getString('Devices'), 'bg-blue', 'ion-location', devices.length, 'app.devices.list');
            // });

        });

})();
