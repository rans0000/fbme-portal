/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('login.module')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'loginService', 'toastr', 'utils', '$scope'];

    function LoginController ($state, loginService, toastr, utils, $scope) {

        var vm = this;
        vm.user ={
            name: '',
            password: ''
        };
        vm.translation = {};
        vm.languagesAvailable = utils.getLanguagesAvailable();
        vm.selectedLanguage = null;

        vm.onLoginSubmit = onLoginSubmit;
        vm.onLanguageChange = onLanguageChange;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            var lang = utils.getLanguage();
            vm.selectedLanguage = vm.languagesAvailable.find(function (item) {
                return item.langCode === lang;
            });
            loadTranslation(lang);
        }

        function loadTranslation (lang) {
            utils.getTranslation(lang)
                .then(onGetTranslationSuccess)
                .catch(onGetTranslationError);
        }

        function onGetTranslationSuccess (response) {
            console.log(response);
            vm.translation = response;
        }

        function onGetTranslationError (error) {
            console.log(error);
            toastr.error(vm.translation.cmcm_TranslationLoadError);
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
            loginService.saveCurrentUserProfile(response.items[0]);
            $state.go('dashboard');
        }

        function onLoginError (error) {
            var errorTranslation = loginService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Login Error');
        }

        function onLanguageChange () {
            var langCode = vm.selectedLanguage.langCode;
            utils.setLanguage(langCode);
            loadTranslation(langCode);
            $scope.$parent.app.css = vm.selectedLanguage.css;
            utils.setCss(vm.selectedLanguage.css);
        }
    }
})();
