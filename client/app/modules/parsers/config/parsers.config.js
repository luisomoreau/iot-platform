(function () {
    'use strict';
    angular
        .module('com.module.parsers')
        .run(function ($rootScope, Parser, gettextCatalog) {
            $rootScope.addMenu(gettextCatalog.getString('Parsers'), 'app.parsers.list', 'ion-code');

            // Parser.find(function (parsers) {
            //     $rootScope.addDashboardBox(gettextCatalog.getString('Parsers'), 'bg-blue', 'ion-location', parsers.length, 'app.parsers.list');
            // });

        });

})();
