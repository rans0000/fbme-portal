/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('login.module')
        .factory('loginService', loginService);

    loginService.$inject = [];

    function loginService () {
        var loginObject = {};
        return loginObject;

    }
})();