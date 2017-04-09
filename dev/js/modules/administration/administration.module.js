/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('administration.module', [])
        .config(routerConfiguration);

    routerConfiguration.$inject = ['$stateProvider'];
    function routerConfiguration ($stateProvider) {
        $stateProvider
            .state('root.administration', {
            url: '/administration',
            templateUrl: 'js/modules/administration/administration.template.html',
            controller: 'AdministrationController',
            controllerAs: 'admin'
        });
    }
})();
