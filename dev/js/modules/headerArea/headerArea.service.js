/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('headerArea.module')
        .factory('headerAreaService', headerAreaService);

    headerAreaService.$inject = [];

    function headerAreaService () {
        var headerObj = {};
        return headerObj;
    }
})();