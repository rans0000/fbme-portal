/*jshint browser: true*/
/*global angular: true*/
/*global jQuery: true*/

(function(){
    'use strict';

    angular.module('app.core.module', [
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.contextMenu',
        'login.module',
        'role.module'
    ])
        .config(routerConfiguration)
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
            controllerAs: 'loginVM'
        })
            .state('root', {
            abstract: true,
            views: {
                '': {
                    templateUrl: 'js/modules/contentArea/contentArea.template.html'
                }/*,
                'sidemenu@root': {
                    templateUrl: 'app/modules/layout/sidemenuArea/sidemenuTemplate.html',
                    controller: 'SidemenuController',
                    controllerAs: 'sidemenuVM'
                }*/
            }
        });
        $urlRouterProvider.otherwise('/login');
    }

    function jQueryService () {
        return jQuery;
    }

    debugConfiguration.$inject = ['$compileProvider'];
    function debugConfiguration ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }

})();