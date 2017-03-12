/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .constant('webServiceURL', getWebServiceURL())
        .constant('permissions', getPermissions());

    function getWebServiceURL () {
        var temp = {
            apiBase: 'http://localhost:8080/FDocs/api/',
            login: 'auth/login.json',
            logout: 'auth/logout.json',
            
            roleList: 'role/list.json',
            roleDetails: 'role/details.json',
            roleCreate: 'role/create.json',
            roleUpdate: 'role/update.json',
            roleDelete: 'role/delete.json',
            
            branchList: 'branch/list.json',
            branchDetails: 'branch/details.json',
            branchCreate: 'branch/create.json',
            branchUpdate: 'branch/update.json',
            branchDelete: 'branch/delete.json'
        };
        return temp;
    }

    function getPermissions () {
        var temp = {
            PERSONAL_DOCS: 1,
            ADMIN: 2,
            COLLABORATION_ADMIN: 4,
            ROLE_MANAGEMENT: 8,
            BRANCH_MANAGEMENT: 16,
            DEPARTMENT_MANAGEMENT: 32,
            SETTINGS_MANAGEMENT: 64,
            USER_MANAGEMENT: 128,
            USER_GROUP_MANAGEMENT: 256
        };
        return temp;
    }

})();