/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('user.module')
        .factory('userService', userService);

    userService.$inject = ['$http', '$q', 'webServiceURL', 'utils', '$sessionStorage', 'permissions', 'roleService', 'branchService', 'departmentService'];

    function userService ($http, $q, webServiceURL, utils, $sessionStorage, permissions, roleService,  branchService,  departmentService) {
        var userObj = {};
        var currentUserProfile;
        
        userObj.loadUserList = loadUserList;
        userObj.loadUserDetails = loadUserDetails;
        userObj.createUser = createUser;
        userObj.updateUser = updateUser;
        userObj.deleteUser = deleteUser;
        userObj.getRoleBranchDeptData = getRoleBranchDeptData;
        userObj.getSidenavItems = getSidenavItems;
        userObj.getErrorTranslationValue = getErrorTranslationValue;
        userObj.saveCurrentUserProfile = saveCurrentUserProfile;
        userObj.getAllCurrentUserProfile = getAllCurrentUserProfile;
        userObj.getCurrentUserProfile = getCurrentUserProfile;
        userObj.hasPermission = hasPermission;
        userObj.getAllPrivileges = getAllPrivileges;
        userObj.setAllPrivileges = setAllPrivileges;

        return userObj;

        //--------------------------------------
        //function declarations
        
        function saveCurrentUserProfile (userProfile) {
            currentUserProfile = angular.copy(userProfile);
            currentUserProfile.privilegeArray = currentUserProfile.privileges.split(',');
            $sessionStorage.privilegeArray = currentUserProfile.privilegeArray;
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
            var privilegeArray = currentUserProfile.privilegeArray || $sessionStorage.privilegeArray;
            var isValid = (privilegeArray.indexOf(permissionString) === -1)? false: true;
            return isValid;
        }

        function loadUserList (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.userList;
            var tempObj = utils.prepareListRequest(requestObj);

            return $http.get(url, {params: tempObj});
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
        
        function getRoleBranchDeptData () {
            var reqObj = {
                roleList: roleService.loadRoleList(),
                branchList: branchService.loadBranchList(),
                departmentList: departmentService.loadDepartmentList()
            };
            return $q.all(reqObj);
        }
        
        function getAllPrivileges () {
            var url = webServiceURL.apiBase + webServiceURL.allPrivileges;
            return $http.get(url);
        }
        
        function setAllPrivileges (privileges) {
            permissions = privileges;
        }
    }
})();