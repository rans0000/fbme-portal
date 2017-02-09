/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('role.module')
        .factory('roleService', roleService);

    roleService.$inject = [];

    function roleService () {
        var roleObject = {};
        return roleObject;
    }
})();