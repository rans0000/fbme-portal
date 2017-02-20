/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('role.module')
        .factory('roleService', roleService);

    roleService.$inject = ['$http', 'webServiceURL', 'permissions'];

    function roleService ($http, webServiceURL, permissions) {
        var roleObject = {};
        roleObject.loadRoleList = loadRoleList;
        roleObject.loadRoleDetails = loadRoleDetails;
        roleObject.createRole = createRole;
        roleObject.updateRole = updateRole;
        roleObject.deleteRole = deleteRole;
        roleObject.getPermissionArray = getPermissionArray;

        return roleObject;

        //--------------------------------------
        //function declarations

        function loadRoleList (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleList;
            var fromDate = new Date();
            var toDate = new Date(fromDate);
            toDate.setMonth(toDate.getMonth() -1);

            requestObj = requestObj || {
                page: 1,
                pageSize: 30,
                sortBy: 'name',
                sortOrder: 'A',
                searchText: '',
                createdDateFrom: fromDate.toISOString().substring(0,19),
                createdDateTo: toDate.toISOString().substring(0,19)
            };
            return $http.get(url, requestObj);
        }

        function deleteRole (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roledelete;
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
            return $http.get(url, requestObj);
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
    }
})();