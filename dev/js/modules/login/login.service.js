/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('login.module')
        .factory('loginService', loginService);

    loginService.$inject = ['$http', 'webServiceURL', 'utils', 'userService'];

    function loginService ($http, webServiceURL, utils, userService) {
        var loginObj = {};
        loginObj.validateLoginForm = validateLoginForm;
        loginObj.requestLogin = requestLogin;
        loginObj.saveCurrentUserProfile = saveCurrentUserProfile;
        loginObj.getErrorTranslationValue = getErrorTranslationValue;
        loginObj.getAllPrivileges = getAllPrivileges;
        loginObj.setAllPrivileges = setAllPrivileges;

        return loginObj;

        function validateLoginForm (requestObj) {
            var isValid = (requestObj.name.trim() && requestObj.password.trim())? true : false;
            return isValid;
        }

        function requestLogin (requestObj) {
            var obj = {
                userName: requestObj.name,
                password: requestObj.password
            };
            var url = webServiceURL.apiBase + webServiceURL.login;
            return $http.post(url, obj);
        }

        function saveCurrentUserProfile (userProfile) {
            userService.saveCurrentUserProfile(userProfile);
        }
        
        function getErrorTranslationValue (errorcode, translation) {
            var key = utils.errorHandler(errorcode);
            var returnText = utils.translate(translation[key], []);
            return returnText;
        }
        
        function getAllPrivileges () {
            return userService.getAllPrivileges();
        }
        
        function setAllPrivileges (privileges) {
            var tempObj = {};
            var key;
            for(var ii = 0; ii < privileges.length; ++ii){
                key = privileges[ii].code;
                tempObj[key] = tempObj.value;
            }
            userService.setAllPrivileges(tempObj);
        }

    }
})();