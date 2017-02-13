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
        userObj.getCurrentUserProfile = getCurrentUserProfile;
        userObj.hasPermission = hasPermission;

        return userObj;

        //--------------------------------------
        //function declarations

        function saveCurrentUserProfile (userProfile) {
            currentUserProfile = angular.copy(userProfile);
            currentUserProfile.privilegeArray = currentUserProfile.privileges.split(',');
        }
        
        function getCurrentUserProfile () {
            return angular.copy(currentUserProfile);
        }
        
        function hasPermission (permissionString) {
            var isValid = (currentUserProfile.privilegeArray.indexOf(permissionString) === -1)? false: true;
            return isValid;
        }
    }

})();