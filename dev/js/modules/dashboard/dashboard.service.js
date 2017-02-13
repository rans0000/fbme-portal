/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('dashboard.module')
        .factory('dashboardService', dashboardService);

    dashboardService.$inject = [];

    function dashboardService () {
        var dashObject = {};
        return dashObject;
    }
})();