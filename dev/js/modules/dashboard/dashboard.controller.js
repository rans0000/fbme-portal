/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('dashboard.module')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [];

    function DashboardController () {

        var vm = this;
        vm.status = true;

        //--------------------------------------
        //function declarations
    }
})();
