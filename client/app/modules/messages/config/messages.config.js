(function () {
    'use strict';
    angular
        .module('com.module.messages')
        .run(function ($rootScope, Message, gettextCatalog) {
            $rootScope.addMenu(gettextCatalog.getString('Messages'), 'app.messages.list', 'fa-wechat');

            // Message.find(function (messages) {
            //     $rootScope.addDashboardBox(gettextCatalog.getString('Messages'), 'bg-red', 'ion-chatbubble-working', messages.length, 'app.messages.list');
            // });

        });

})();
