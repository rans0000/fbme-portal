/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .factory('userService', userService);

    function userService () {
        var userObj = {};
        var currentUserProfile;

        userObj.saveCurrentUserProfile = saveCurrentUserProfile;
        userObj.getAllCurrentUserProfile = getAllCurrentUserProfile;
        userObj.getCurrentUserProfile = getCurrentUserProfile;
        userObj.hasPermission = hasPermission;

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
    }

})();