/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('department.module')
        .factory('departmentService', departmentService);

    departmentService.$inject = ['$http', 'webServiceURL', 'utils'];

    function departmentService ($http, webServiceURL, utils) {
        var departmentObject = {};
        departmentObject.loadDepartmentList = loadDepartmentList;
        departmentObject.loadDepartmentDetails = loadDepartmentDetails;
        departmentObject.createDepartment = createDepartment;
        departmentObject.updateDepartment = updateDepartment;
        departmentObject.deleteDepartment = deleteDepartment;
        departmentObject.getSidenavItems = getSidenavItems;
        departmentObject.getErrorTranslationValue = getErrorTranslationValue;

        return departmentObject;

        //--------------------------------------
        //function declarations

        function loadDepartmentList (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.departmentList;
            var tempObj = utils.prepareListRequest(requestObj);

            return $http.get(url, {params: tempObj});
        }

        function deleteDepartment (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.departmentDelete;
            return $http.post(url, requestObj);
        }

        function createDepartment (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.departmentCreate;
            return $http.post(url, requestObj);
        }

        function updateDepartment (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.departmentUpdate;
            return $http.post(url, requestObj);
        }

        function loadDepartmentDetails (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.departmentDetails;
            return $http.get(url, {params: requestObj});
        }

        function getSidenavItems () {
            return utils.loadSideMenu('administration');
        }
        
        function getErrorTranslationValue (errorcode) {
            return utils.errorHandler(errorcode);
        }
    }
})();