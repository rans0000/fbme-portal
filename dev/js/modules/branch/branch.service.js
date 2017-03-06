/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('branch.module')
        .factory('branchService', branchService);

    branchService.$inject = ['$http', 'webServiceURL', 'utils', 'permissions'];

    function branchService ($http, webServiceURL, utils, permissions) {
        var branchObj = {};
        branchObj.loadBranchList = loadBranchList;
        branchObj.loadBranchDetails = loadBranchDetails;
        branchObj.createBranch = createBranch;
        branchObj.updateBranch = updateBranch;
        branchObj.deleteBranch = deleteBranch;
        branchObj.getPermissionArray = getPermissionArray;
        branchObj.getSidenavItems = getSidenavItems;
        branchObj.getErrorTranslationValue = getErrorTranslationValue;

        return branchObj;

        //--------------------------------------
        //function declarations

        function loadBranchList (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.branchList;
            return $http.get(url, {params: requestObj});
        }

        function deleteBranch (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.branchdelete;
            return $http.post(url, requestObj);
        }

        function createBranch (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.branchCreate;
            return $http.post(url, requestObj);
        }

        function updateBranch (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.branchUpdate;
            return $http.post(url, requestObj);
        }

        function loadBranchDetails (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.branchDetails;
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

        function getSidenavItems () {
            return utils.loadSideMenu('administration');
        }
        
        function getErrorTranslationValue (errorcode) {
            return utils.errorHandler(errorcode);
        }
    }
})();