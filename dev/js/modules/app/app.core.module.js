/*jshint browser: true*/
/*global angular: true*/
/*global jQuery: true*/

(function(){
    'use strict';

    angular.module('app.core.module', [
        'ui.router',
        'ui.bootstrap',
        'toastr',
        'ngStorage',
        'headerArea.module',
        'ui.bootstrap.contextMenu',
        'login.module',
        'dashboard.module',
        'role.module',
        'branch.module'
    ])
        .config(httpProviderConfiguration)
        .config(routerConfiguration)
        .config(debugConfiguration)
        .factory('httpRequestInterceptor', httpRequestInterceptor)
        .factory('jQuery', jQueryService);

    httpProviderConfiguration.$inject = ['$httpProvider'];
    function httpProviderConfiguration ($httpProvider) {
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        //$httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';

        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];

        /*$httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
            var key, result = [];

            if (typeof data === "string"){
                return data;
            }

            for (key in data) {
                if (data.hasOwnProperty(key)){
                    result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                }
            }
            return result.join("&");
        });*/
    }

    function param(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null){
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    }

    routerConfiguration.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
    function routerConfiguration ($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/login');
        $httpProvider.interceptors.push('httpRequestInterceptor');

        $stateProvider
            .state('login', {
            url: '/login',
            templateUrl: 'js/modules/login/login.template.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })
            .state('root', {
            abstract: true,
            views: {
                '': {
                    templateUrl: 'js/modules/contentArea/contentArea.template.html'
                },
                'headerArea@root': {
                    templateUrl: 'js/modules/headerArea/headerArea.template.html',
                    controller: 'HeaderAreaController',
                    controllerAs: 'header'
                }
            }
        })/*
            .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'js/modules/dashboard/dashboard.template.html',
            controller: 'DashboardController',
            controllerAs: 'vm'
        })*/;
    }

    httpRequestInterceptor.$inject = ['$q', 'webServiceURL'];
    function httpRequestInterceptor ($q, webServiceURL) {
        var interceptObject = {};
        //interceptObject.request = interceptRequest;
        interceptObject.response = interceptResponseSuccess;
        interceptObject.responseError = interceptResponseError;
        return interceptObject;

        function interceptResponseSuccess (response) {
            var returnValue = response;
            if(response.config.url.startsWith(webServiceURL.apiBase)){
                //response.data.header.responseCode is FD200 for success
                if(response.data.header && response.data.header.responseCode !== 'FD200'){
                    returnValue = $q.reject(response.data);
                }
                else{
                    returnValue = response.data.body? response.data.body : {};
                }
            }
            return returnValue;
        }

        function interceptResponseError (response) {
            var errObj = {
                header: {
                    responseCode: response.status,
                    message: response.statusText,
                    requestUrl: response.config.url
                }
            };
            return $q.reject(errObj);
        }
    }

    function jQueryService () {
        return jQuery;
    }

    debugConfiguration.$inject = ['$compileProvider'];
    function debugConfiguration ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }

})();