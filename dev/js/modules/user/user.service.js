/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('user.module')
        .factory('userService', userService);

    userService.$inject = ['$http', 'webServiceURL', 'utils'];

    function userService ($http, webServiceURL, utils) {
        var userObj = {};
        var currentUserProfile;
        
        userObj.saveCurrentUserProfile = saveCurrentUserProfile;
        userObj.getAllCurrentUserProfile = getAllCurrentUserProfile;
        userObj.getCurrentUserProfile = getCurrentUserProfile;
        userObj.hasPermission = hasPermission;
        userObj.loadUserList = loadUserList;
        userObj.loadUserDetails = loadUserDetails;
        userObj.createUser = createUser;
        userObj.updateUser = updateUser;
        userObj.deleteUser = deleteUser;
        userObj.getSidenavItems = getSidenavItems;
        userObj.getErrorTranslationValue = getErrorTranslationValue;

        return userObj;

        //--------------------------------------
        //function declarations
        
        function saveCurrentUserProfile (userProfile) {
            currentUserProfile = angular.copy(userProfile);
            currentUserProfile.privilegeArray = currentUserProfile.privileges.split(',');
            userProfile = null;
        }
        
        function getAllCurrentUserProfile () {
            return angular.copy(currentUserProfile);
        }
        
        function getCurrentUserProfile (property) {
            var value;
            if(currentUserProfile.hasOwnProperty){
                value = currentUserProfile[property];
            }
            else{
                throw {message: 'Missing property in Current user profile'};
            }
            return value;
        }
        
        function hasPermission (permissionString) {
            var isValid = (currentUserProfile.privilegeArray.indexOf(permissionString) === -1)? false: true;
            return isValid;
        }

        function loadUserList (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.userList;
            var tempObj = angular.copy(requestObj);
            tempObj.createdDateFrom = utils.getDateString(requestObj.createdDateFrom);
            tempObj.createdDateTo = utils.getDateString(requestObj.createdDateTo);
            //return $http.get(url, {params: tempObj});
            return $http.get(url);
        }

        function deleteUser (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.userDelete;
            return $http.post(url, requestObj);
        }

        function createUser (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.userCreate;
            return $http.post(url, requestObj);
        }

        function updateUser (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.userUpdate;
            return $http.post(url, requestObj);
        }

        function loadUserDetails (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.userDetails;
            return $http.get(url, requestObj);
        }

        function getSidenavItems () {
            return utils.loadSideMenu('administration');
        }
        
        function getErrorTranslationValue (errorcode) {
            return utils.errorHandler(errorcode);
        }
    }
})();