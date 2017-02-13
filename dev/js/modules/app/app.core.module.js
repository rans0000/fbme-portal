/*jshint browser: true*/
/*global angular: true*/
/*global jQuery: true*/

(function(){
    'use strict';

    angular.module('app.core.module', [
        'ui.router',
        'ui.bootstrap',
        'headerArea.module',
        'ui.bootstrap.contextMenu',
        'login.module',
        'dashboard.module',
        'role.module'
    ])
        .config(routerConfiguration)
        .factory('httpRequestInterceptor', httpRequestInterceptor)
        .config(debugConfiguration)
        .factory('jQuery', jQueryService);


    routerConfiguration.$inject = ['$stateProvider', '$urlRouterProvider'];
    function routerConfiguration ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

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
        $urlRouterProvider.otherwise('/login');
    }
    
    httpRequestInterceptor.$inject = ['$q'];
    function httpRequestInterceptor ($q) {
        var interceptObject = {};
        //interceptObject.request = interceptRequest;
        interceptObject.response = interceptResponseSuccess;
        interceptObject.responseError = interceptResponseError;
        return interceptObject;

        function interceptResponseSuccess (response) {
            var returnValue;
            //response.data.header.responseCode is FD200 for success
            if(response.data.header && response.data.header.responseCode !== 'FD200'){
                returnValue = $q.reject(response);
            }
            else{
                returnValue = response.data.body? response.data.body : {};
            }
            return returnValue;
        }

        function interceptResponseError (response) {
            return $q.reject(response);
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