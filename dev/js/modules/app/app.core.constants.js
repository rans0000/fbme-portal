/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .constant('webServiceURL', getWebServiceURL())
        .constant('permissions', getPermissions());

    function getWebServiceURL () {
        var temp = {
            apiBase: 'http://localhost:8090/',
            login: 'api/auth/login.json',
            roleList: 'api/role/list.json',
            roledelete: 'api/role/delete.json'
        };
        return temp;
    }

    function getPermissions () {
        var temp = [
            {name: 'PERSONAL_DOCS', id: 1},
            {name: 'ADMIN', id: 2},
            {name: 'COLLABORATION_ADMIN', id: 4},
            {name: 'ROLE_MANAGEMENT', id: 8},
            {name: 'BRANCH_MANAGEMENT', id: 16},
            {name: 'DEPARTMENT_MANAGEMENT', id: 32},
            {name: 'SETTINGS_MANAGEMENT', id: 64},
            {name: 'USER_MANAGEMENT', id: 128},
            {name: 'USER_GROUP_MANAGEMENT', id: 256}
        ];
        return temp;
    }

})();