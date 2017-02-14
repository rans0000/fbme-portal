/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .constant('webServiceURL', getWebServiceURL());
    
    function getWebServiceURL () {
        var temp = {
            apiBase: 'http://localhost:8090/',
            login: 'api/auth/login',
            roleList: 'api/role/list'
        };
        return temp;
    }

})();