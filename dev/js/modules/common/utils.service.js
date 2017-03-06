/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .factory('utils', utilsFactory);

    utilsFactory.$inject = ['$q', '$http', '$localStorage'];
    function utilsFactory ($q, $http, $localStorage) {
        var utilsObj = {};
        var allTranslations;
        utilsObj.getLanguage = getLanguage;
        utilsObj.setLanguage = setLanguage;
        utilsObj.getCss = getCss;
        utilsObj.setCss = setCss;
        utilsObj.getTranslation = getTranslation;
        utilsObj.getLanguagesAvailable = getLanguagesAvailable;
        utilsObj.errorHandler = errorHandler;
        utilsObj.loadSideMenu = loadSideMenu;
        return utilsObj;

        //--------------------------------------
        //function declarations

        function getLanguage () {
            $localStorage.lang = $localStorage.lang || 'en-US';
            return $localStorage.lang;
        }

        function setLanguage (lang) {
            $localStorage.lang = lang;
        }

        function getCss () {
            $localStorage.css = $localStorage.css || 'lang-en';
            return $localStorage.css;
        }

        function setCss (css) {
            $localStorage.css = css;
        }

        function getTranslation (lang) {
            var temp = allTranslations? $q.resolve(allTranslations) : loadTranslation(lang);
            return temp;
        }
        function loadTranslation (lang) {
            var url = 'data/translations/translations.all-' + lang + '.json';
            return $http.get(url)
                .then(function (response) {
                return response.data.translation;
            })
                .catch(function (error) {
                return $q.reject(error);
            });
        }

        function getLanguagesAvailable () {
            return [
                {name: 'English', langCode: 'en-US', css: 'lang-en', direction: 'ltr'},
                {name: 'العَرَبِيَّة', langCode: 'ar', css: 'lang-ar', direction: 'rtl'}
            ];
        }

        function errorHandler (errorCode) {
            var errStr;
            switch(errorCode){
                case 'FD200': errStr = 'cmcm_Success';break;
                case 'FD207': errStr = 'cmcm_MultipleStatusCodes';break;
                case 'FD400': errStr = 'cmcm_BadRequest';break;
                case 'FD500': errStr = 'cmcm_ServerError';break;
                case 'FD401': errStr = 'cmcm_UnauthorizedAccess';break;
                case 'FD501': errStr = 'cmcm_UnsupportedOperation';break;
                case 'FD412': errStr = 'cmcm_LoginRequired';break;
                case 'FD406': errStr = 'cmcm_InvalidCredentials';break;
                case 'FD101': errStr = 'cmcm_ValidUserNameRequired';break;
                case 'FD102': errStr = 'cmcm_ValidPasswordRequired';break;
                case 'FD103': errStr = 'cmcm_ValidNameRequired';break;
                case 'FD104': errStr = 'cmcm_ValidDescriptionRequired';break;
                case 'FD105': errStr = 'cmcm_ValidIdRequired';break;
                case 'FD106': errStr = 'cmcm_ValidIdsRequired';break;
                case 'FD107': errStr = 'cmcm_ValidPageRequired';break;
                case 'FD108': errStr = 'cmcm_ValidPageSizeRequired';break;
                case 'FD109': errStr = 'cmcm_ValidSortByRequired';break;
                case 'FD110': errStr = 'cmcm_NameNotAvailable';break;
                case 'FD111': errStr = 'cmcm_RoleIsInUse';break;
                case 'FD112': errStr = 'cmcm_RoleNotFound';break;
                case 'FD113': errStr = 'cmcm_CodeNotAvailable';break;
                case 'FD114': errStr = 'cmcm_ValidCodeRequired';break;
                case 'FD115': errStr = 'cmcm_ValidAddress1Required';break;
                case 'FD116': errStr = 'cmcm_ValidAddress2Required';break;
                case 'FD117': errStr = 'cmcm_ValidAddress3Required';break;
                case 'FD118': errStr = 'cmcm_ValidAddress4Required';break;
                case 'FD119': errStr = 'cmcm_ValidZipRequired';break;
                case 'FD120': errStr = 'cmcm_BranchNotFound';break;
                case 'FD121': errStr = 'cmcm_DepartmentNotFound';break;
                case 'FD122': errStr = 'cmcm_ValidFirstNameRequired';break;
                case 'FD123': errStr = 'cmcm_ValidMiddleNameRequired';break;
                case 'FD124': errStr = 'cmcm_ValidLastNameRequired';break;
                case 'FD125': errStr = 'cmcm_ValidEmailRequired';break;
                case 'FD126': errStr = 'cmcm_ValidTimeZoneRequired';break;
                case 'FD127': errStr = 'cmcm_ValidActivationDateRequired';break;
                case 'FD128': errStr = 'cmcm_ValidDateFormatRequired';break;
                case 'FD129': errStr = 'cmcm_UserNameNotAvailable';break;
                case 'FD130': errStr = 'cmcm_EmailIdNotAvailable';break;
                case 'FD131': errStr = 'cmcm_UserNotFound';break;
                default: errStr = 'cmcm_UnknownError';break;
            }
            return errStr;
        }

        function loadSideMenu (module) {
            return $http.get('data/menu-data.json')
                .then(function (response) {
                var temp = module? response.data[module] : response.data;
                return temp;
            })
                .catch(function (error) {
                return error;
            });
        }
    }
})();