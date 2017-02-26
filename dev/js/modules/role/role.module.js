/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('role.module', [])
        .config(routerConfiguration);

    routerConfiguration.$inject = ['$stateProvider'];
    function routerConfiguration ($stateProvider) {
        $stateProvider
            .state('root.role', {
            url: '/role',
            templateUrl: 'js/modules/role/role.template.html',
            controller: 'RoleController',
            controllerAs: 'role'
        });
    }
})();
