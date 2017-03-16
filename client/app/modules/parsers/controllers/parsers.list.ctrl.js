(function () {
  'use strict';
  angular
    .module('com.module.parsers')
    .controller('ParsersCtrl', function (CoreService, $state, $scope, Parser, Downlink) {


      function getParsers() {
        Parser.find({},
          function (items) {
            // items.forEach(function (item) {
            //   item.time = item.time * 1000; //to milliseconds
            // });
            $scope.parsers = items;
            console.log($scope.parsers)
          },
          function (errorResponse) { /* error */
          }
        );
      }

      getParsers();

    });
})();
