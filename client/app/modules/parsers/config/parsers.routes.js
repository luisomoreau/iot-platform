(function () {
    'use strict';
    angular
        .module('com.module.parsers')
        .config(function ($stateProvider) {
                $stateProvider
                    .state('app.parsers', {
                        abstract: true,
                        url: '/parsers',
                        templateUrl: 'modules/parsers/views/main.html'
                    })
                    .state('app.parsers.list', {
                        url: '',
                        templateUrl: 'modules/parsers/views/list.html',
                        controllerAs: 'ctrl',
                        controller: 'ParsersCtrl'
                    })
                  .state('app.parsers.edit', {
                    url: '/:id/edit',
                    templateUrl: 'modules/parsers/views/edit.html',
                    controllerAs: 'ctrl',
                    controller: function ($state, Parser, parser) {
                      console.log(parser);
                      this.parser = parser;
                      this.submit = function () {
                        parser.$save().then(function () {
                          $state.go('^.list');
                        });
                      };
                    },
                    resolve: {
                      parser: function ($stateParams, Parser) {
                        console.log($stateParams.id);
                        return Parser.findById({
                          id: $stateParams.id
                        }).$promise;
                      }
                    }
                  })
            }
        );

})();
