/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('administration.module')
        .factory('administrationService', administrationService);

    administrationService.$inject = ['$http', 'webServiceURL', 'utils', 'permissions'];

    function administrationService ($http, webServiceURL, utils, permissions) {
        var administrationObj = {};
        administrationObj.getPermissionArray = getPermissionArray;
        administrationObj.getSidenavItems = getSidenavItems;
        administrationObj.getErrorTranslationValue = getErrorTranslationValue;

        return administrationObj;

        //--------------------------------------
        //function declarations

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
        
        function getErrorTranslationValue (errorcode, translation) {
            var key = utils.errorHandler(errorcode);
            var returnText = utils.translate(translation[key], []);
            return returnText;
        }
    }
})();