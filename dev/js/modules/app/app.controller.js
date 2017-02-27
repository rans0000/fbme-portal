/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .controller('AppController', AppController);

    AppController.$inject = ['utils'];
    function AppController (utils) {
        var vm = this;
        vm.css = utils.getCss();
    }

})();