/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('branch.module', [])
        .config(routerConfiguration);

    routerConfiguration.$inject = ['$stateProvider'];
    function routerConfiguration ($stateProvider) {
        $stateProvider
            .state('root.branch', {
            url: '/administration/branch',
            templateUrl: 'js/modules/branch/branch.template.html',
            controller: 'BranchController',
            controllerAs: 'branch'
        });
    }
})();
