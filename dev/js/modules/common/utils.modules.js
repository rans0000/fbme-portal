/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('utils.module', [])
        .factory('utils', utilsFactory);

    function utilsFactory () {
        var utilsObj = {};
        utilsObj.errorHandler = errorHandler;
        return utilsObj;

        //--------------------------------------
        //function declarations

        function errorHandler (errorCode) {
            var errStr;
            switch(errorCode){
                case 'FD200': errStr = 'Success';break;
                case 'FD207': errStr = 'MultipleStatusCodes';break;
                case 'FD400': errStr = 'BadRequest';break;
                case 'FD500': errStr = 'ServerError';break;
                case 'FD401': errStr = 'UnauthorizedAccess';break;
                case 'FD501': errStr = 'UnsupportedOperation';break;
                case 'FD412': errStr = 'LoginRequired';break;
                case 'FD406': errStr = 'InvalidCredentials';break;
                case 'FD101': errStr = 'ValidUserNameRequired';break;
                case 'FD102': errStr = 'ValidPasswordRequired';break;
                case 'FD103': errStr = 'ValidNameRequired';break;
                case 'FD104': errStr = 'ValidDescriptionRequired';break;
                case 'FD105': errStr = 'ValidIdRequired';break;
                case 'FD106': errStr = 'ValidIdsRequired';break;
                case 'FD107': errStr = 'ValidPageRequired';break;
                case 'FD108': errStr = 'ValidPageSizeRequired';break;
                case 'FD109': errStr = 'ValidSortByRequired';break;
                case 'FD110': errStr = 'NameNotAvailable';break;
                case 'FD111': errStr = 'RoleIsInUse';break;
                case 'FD112': errStr = 'RoleNotFound';break;
                case 'FD113': errStr = 'CodeNotAvailable';break;
                case 'FD114': errStr = 'ValidCodeRequired';break;
                case 'FD115': errStr = 'ValidAddress1Required';break;
                case 'FD116': errStr = 'ValidAddress2Required';break;
                case 'FD117': errStr = 'ValidAddress3Required';break;
                case 'FD118': errStr = 'ValidAddress4Required';break;
                case 'FD119': errStr = 'ValidZipRequired';break;
                case 'FD120': errStr = 'BranchNotFound';break;
                case 'FD121': errStr = 'DepartmentNotFound';break;
                case 'FD122': errStr = 'ValidFirstNameRequired';break;
                case 'FD123': errStr = 'ValidMiddleNameRequired';break;
                case 'FD124': errStr = 'ValidLastNameRequired';break;
                case 'FD125': errStr = 'ValidEmailRequired';break;
                case 'FD126': errStr = 'ValidTimeZoneRequired';break;
                case 'FD127': errStr = 'ValidActivationDateRequired';break;
                case 'FD128': errStr = 'ValidDateFormatRequired';break;
                case 'FD129': errStr = 'UserNameNotAvailable';break;
                case 'FD130': errStr = 'EmailIdNotAvailable';break;
                case 'FD131': errStr = 'UserNotFound';break;
                default: errStr = 'UnknownError';break;
            }
            return errStr;
        }
    }
})();