/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('headerArea.module')
        .factory('headerAreaService', headerAreaService);

    headerAreaService.$inject = ['userService'];

    function headerAreaService (userService) {
        var headerObj = {};
        headerObj.populateCurrentUserObj = populateCurrentUserObj;
        return headerObj;
        
        //--------------------------------------
        //function declarations
        
        function populateCurrentUserObj () {
            return userService.getAllCurrentUserProfile();
        }
        
    }
})();