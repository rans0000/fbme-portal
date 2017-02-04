/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('login.module')
        .controller('LoginController', LoginController);

    LoginController.$inject = [];

    function LoginController () {

        var vm = this;
        vm.status = true;

        //--------------------------------------
        //function declarations
    }
})();
