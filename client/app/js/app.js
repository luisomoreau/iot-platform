(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name loopbackApp
     * @description
     * # loopbackApp
     *
     * Main module of the application.
     */
    angular
        .module('loopbackApp', [
            'angular-loading-bar',
            'angular.filter',
            'angularBootstrapNavTree',
            'angularFileUpload',
            'btford.markdown',
            'oitozero.ngSweetAlert',
            'config',
            'formly',
            'formlyBootstrap',
            'lbServices',
            'monospaced.elastic',
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch',
            'ui.bootstrap',
            'ui.codemirror',
            'ui.gravatar',
            'ui.grid',
            'ui.router',
            'toasty',
            'autofields',
            'gettext',
            'angular-underscore/filters',
            'schemaForm',
            'ui.select',
            'uiGmapgoogle-maps',
            'wt.responsive',
            'datatables',
            'com.module.core',
            'com.module.devices',
            'com.module.messages',
            'com.module.parsers',
            'com.module.users',
            'com.module.browser',
            'com.module.files',
            'com.module.settings',
            'com.module.browser'


        ])
        .run(function ($rootScope, $cookies, gettextCatalog) {

            $rootScope.locales = {
                'en': {
                    lang: 'en',
                    country: 'US',
                    name: gettextCatalog.getString('English')
                }
            };

            var lang = $cookies.lang || navigator.language || navigator.userLanguage;

            $rootScope.locale = $rootScope.locales[lang];

            if (angular.isUndefined($rootScope.locale)) {
                $rootScope.locale = $rootScope.locales[lang];
                if (angular.isUndefined($rootScope.locale)) {
                    $rootScope.locale = $rootScope.locales['en'];
                }
            }

            gettextCatalog.setCurrentLanguage($rootScope.locale.lang);

        })
        .run(function (formlyConfig) {
            /*
             ngModelAttrs stuff
             */
            var ngModelAttrs = {};

            function camelize(string) {
                string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
                    return chr ? chr.toUpperCase() : '';
                });
                // Ensure 1st char is always lowercase
                return string.replace(/^([A-Z])/, function (match, chr) {
                    return chr ? chr.toLowerCase() : '';
                });
            }

            /*
             timepicker
             */
            ngModelAttrs = {};

            // attributes
            angular.forEach([
                'meridians',
                'readonly-input',
                'mousewheel',
                'arrowkeys'
            ], function (attr) {
                ngModelAttrs[camelize(attr)] = {attribute: attr};
            });

            // bindings
            angular.forEach([
                'hour-step',
                'minute-step',
                'show-meridian'
            ], function (binding) {
                ngModelAttrs[camelize(binding)] = {bound: binding};
            });

            formlyConfig.setType({
                name: 'timepicker',
                template: '<timepicker ng-model="model[options.key]"></timepicker>',
                wrapper: [
                    'bootstrapLabel',
                    'bootstrapHasError'
                ],
                defaultOptions: {
                    ngModelAttrs: ngModelAttrs,
                    templateOptions: {
                        timepickerOptions: {}
                    }
                }
            });

            formlyConfig.setType({
                name: 'datepicker',
                template: '<datepicker ng-model="model[options.key]" ></datepicker>',
                wrapper: [
                    'bootstrapLabel',
                    'bootstrapHasError'
                ],
                defaultOptions: {
                    ngModelAttrs: ngModelAttrs,
                    templateOptions: {
                        datepickerOptions: {}
                    }
                }
            });
        })
        .config(function (uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyD4Zt99xt7aUd4Sg8RUwlMGwRkRIBWC7aE'
            });
        });

})();
