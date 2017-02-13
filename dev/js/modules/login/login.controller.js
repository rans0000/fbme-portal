/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('login.module')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'loginService'];

    function LoginController ($state, loginService) {

        var vm = this;
        vm.user ={
            name: '',
            password: ''
        };

        vm.onLoginSubmit = onLoginSubmit;

        init();

        //--------------------------------------
        //function declarations

        function init () {

        }

        function onLoginSubmit () {
            var isValid = loginService.validateLoginForm(vm.user);
            if(isValid){
                loginService.requestLogin(vm.user)
                    .then(onLoginSuccess)
                    .catch(onLoginError);
            }
        }

        function onLoginSuccess (response) {
            console.log(response);
            loginService.saveCurrentUserProfile(response.items[0]);
            $state.go('dashboard');
        }

        function onLoginError (error) {
            console.log(error);
        }
    }
})();
