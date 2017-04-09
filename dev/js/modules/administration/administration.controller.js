/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('administration.module')
        .controller('AdministrationController', AdministrationController);

    AdministrationController.$inject = ['administrationService', 'toastr', 'utils'];

    function AdministrationController (administrationService, toastr, utils) {

        var vm = this;
        vm.administrationList = [];
        vm.isExpandedState = true;
        vm.isLoading = false;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            var lang = utils.getLanguage();
            utils.getTranslation(lang)
                .then(onAllAPISuccess);
            administrationService.getSidenavItems()
                .then(populateSidenav);
        }

        function onAllAPISuccess (response) {
            vm.translation = response;
        }

        function populateSidenav (response) {
            vm.itemTree = response;
            vm.selectedFolder = vm.itemTree[0];
        }
        
    }
})();
