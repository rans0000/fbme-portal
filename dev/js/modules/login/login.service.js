/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('login.module')
        .factory('loginService', loginService);

    loginService.$inject = ['$http', 'webServiceURL', 'userService'];

    function loginService ($http, webServiceURL, userService) {
        var loginObj = {};
        loginObj.validateLoginForm = validateLoginForm;
        loginObj.requestLogin = requestLogin;
        loginObj.saveCurrentUserProfile = saveCurrentUserProfile;
        
        return loginObj;
        
        function validateLoginForm (requestObj) {
            var isValid = (requestObj.name.trim() && requestObj.password.trim())? true : false;
            return isValid;
        }
        
        function requestLogin (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.login;
            return $http.post(url, requestObj);
        }
        
        function saveCurrentUserProfile (userProfile) {
            userService.saveCurrentUserProfile(userProfile);
        }

    }
})();