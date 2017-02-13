/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .constant('webServiceURL', getWebServiceURL());
    
    function getWebServiceURL () {
        var temp = {
            apiBase: 'http://127.0.0.1:8080/',
            login: 'api/auth/login.json'
        };
        return temp;
    }

})();