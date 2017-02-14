/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('role.module')
        .factory('roleService', roleService);

    roleService.$inject = ['$http', 'webServiceURL'];

    function roleService ($http, webServiceURL) {
        var roleObject = {};
        roleObject.loadRoleList = loadRoleList;

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
    }
})();