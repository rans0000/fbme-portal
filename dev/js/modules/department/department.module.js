/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('department.module', [])
        .config(routerConfiguration);

    routerConfiguration.$inject = ['$stateProvider'];
    function routerConfiguration ($stateProvider) {
        $stateProvider
            .state('root.department', {
            url: '/administration/department',
            templateUrl: 'js/modules/department/department.template.html',
            controller: 'DepartmentController',
            controllerAs: 'dept'
        });
    }
})();
