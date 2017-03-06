/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('headerArea.module')
        .factory('headerAreaService', headerAreaService);

    headerAreaService.$inject = ['$http', 'webServiceURL', 'userService'];

    function headerAreaService ($http, webServiceURL, userService) {
        var headerObj = {};
        headerObj.populateCurrentUserObj = populateCurrentUserObj;
        headerObj.logout = logout;
        return headerObj;
        
        //--------------------------------------
        //function declarations
        
        function populateCurrentUserObj () {
            return userService.getAllCurrentUserProfile();
        }
        
        function logout () {
            var url = webServiceURL.apiBase + webServiceURL.logout;
            return $http.get(url);
        }
        
    }
})();