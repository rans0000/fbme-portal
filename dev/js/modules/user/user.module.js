/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('user.module', ['ngStorage', 'role.module', 'branch.module', 'department.module'])
        .config(routerConfiguration);

    routerConfiguration.$inject = ['$stateProvider'];
    function routerConfiguration ($stateProvider) {
        $stateProvider
            .state('root.user', {
            url: '/user',
            templateUrl: 'js/modules/user/user.template.html',
            controller: 'UserController',
            controllerAs: 'user'
        });
    }
})();
