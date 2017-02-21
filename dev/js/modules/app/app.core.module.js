/*jshint browser: true*/
/*global angular: true*/
/*global jQuery: true*/

(function(){
    'use strict';

    angular.module('app.core.module', [
        'ui.router',
        'ui.bootstrap',
        'toastr',
        'headerArea.module',
        'ui.bootstrap.contextMenu',
        'login.module',
        'dashboard.module',
        'role.module'
    ])
        .config(routerConfiguration)
        .config(debugConfiguration)
        .factory('httpRequestInterceptor', httpRequestInterceptor)
        .factory('jQuery', jQueryService);


    routerConfiguration.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
    function routerConfiguration ($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/login');
        $httpProvider.interceptors.push('httpRequestInterceptor');

        $stateProvider
            .state('login', {
            url: '/login',
            templateUrl: 'js/modules/login/login.template.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })
            .state('root', {
            abstract: true,
            views: {
                '': {
                    templateUrl: 'js/modules/contentArea/contentArea.template.html'
                },
                'headerArea@root': {
                    templateUrl: 'js/modules/headerArea/headerArea.template.html',
                    controller: 'HeaderAreaController',
                    controllerAs: 'headerAreaVM'
                }
            }
        })
            .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'js/modules/dashboard/dashboard.template.html',
            controller: 'DashboardController',
            controllerAs: 'vm'
        });
    }

    httpRequestInterceptor.$inject = ['$q', 'webServiceURL'];
    function httpRequestInterceptor ($q, webServiceURL) {
        var interceptObject = {};
        //interceptObject.request = interceptRequest;
        interceptObject.response = interceptResponseSuccess;
        interceptObject.responseError = interceptResponseError;
        return interceptObject;

        function interceptResponseSuccess (response) {
            var returnValue = response;
            if(response.config.url.startsWith(webServiceURL.apiBase)){
                //response.data.header.responseCode is FD200 for success
                if(response.data.header && response.data.header.responseCode !== 'FD200'){
                    returnValue = $q.reject(response.data);
                }
                else{
                    returnValue = response.data.body? response.data.body : {};
                }
            }
            return returnValue;
        }

        function interceptResponseError (response) {
            var errObj = {
                header: {
                    responseCode: response.status,
                    message: response.statusText,
                    requestUrl: response.config.url
                }
            };
            return $q.reject(errObj);
        }
    }

    function jQueryService () {
        return jQuery;
    }

    debugConfiguration.$inject = ['$compileProvider'];
    function debugConfiguration ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }

})();