/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('login.module')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state'];

    function LoginController ($state) {

        var vm = this;
        vm.status = true;

        vm.onLoginSubmit = onLoginSubmit;

        init();

        //--------------------------------------
        //function declarations

        function init () {

        }

        function onLoginSubmit () {
            $state.go('dashboard');
        }        
    }
})();
