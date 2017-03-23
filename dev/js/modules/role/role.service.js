/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('role.module')
        .factory('roleService', roleService);

    roleService.$inject = ['$http', 'webServiceURL', 'utils', 'permissions'];

    function roleService ($http, webServiceURL, utils, permissions) {
        var roleObject = {};
        roleObject.loadRoleList = loadRoleList;
        roleObject.loadRoleDetails = loadRoleDetails;
        roleObject.createRole = createRole;
        roleObject.updateRole = updateRole;
        roleObject.deleteRole = deleteRole;
        roleObject.getPermissionArray = getPermissionArray;
        roleObject.getSidenavItems = getSidenavItems;
        roleObject.getErrorTranslationValue = getErrorTranslationValue;

        return roleObject;

        //--------------------------------------
        //function declarations

        function loadRoleList (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleList;
            var tempObj = utils.prepareListRequest(requestObj);

            return $http.get(url, {params: tempObj});
        }

        function deleteRole (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleDelete;
            return $http.post(url, requestObj);
        }

        function createRole (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleCreate;
            return $http.post(url, requestObj);
        }

        function updateRole (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleUpdate;
            return $http.post(url, requestObj);
        }

        function loadRoleDetails (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleDetails;
            return $http.get(url, {params: requestObj});
        }

        function getPermissionArray (privileges) {
            var temp = privileges.split(',');
            var returObj = {
                unselected: {},
                selected: {}
            };
            for(var key in permissions){
                if(temp.indexOf(key) < 0){
                    returObj.selected[key] = false;
                }
                else{
                    returObj.unselected[key] = false;
                }
            }
            return returObj;
        }

        function getSidenavItems () {
            return utils.loadSideMenu('administration');
        }

        function getErrorTranslationValue (errorcode) {
            return utils.errorHandler(errorcode);
        }
    }
})();