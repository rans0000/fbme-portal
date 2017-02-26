/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('headerArea.module')
        .controller('HeaderAreaController', HeaderAreaController);

    HeaderAreaController.$inject = ['headerAreaService'];

    function HeaderAreaController (headerAreaService) {

        var vm = this;
        vm.currentUser = {};
        
        init();

        //--------------------------------------
        //function declarations
        
        function init () {
            vm.currentUser = headerAreaService.populateCurrentUserObj();
        }
    }
})();
