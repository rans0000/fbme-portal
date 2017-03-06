/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('dashboard.module', [])
        .config(routerConfiguration);

    routerConfiguration.$inject = ['$stateProvider'];
    function routerConfiguration ($stateProvider) {
        $stateProvider
            .state('root.dashboard', {
            url: '/dashboard',
            templateUrl: 'js/modules/dashboard/dashboard.template.html',
            controller: 'DashboardController',
            controllerAs: 'dash'
        });
    }
})();
