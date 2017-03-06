/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('headerArea.module')
        .controller('HeaderAreaController', HeaderAreaController);

    HeaderAreaController.$inject = ['headerAreaService', '$state'];

    function HeaderAreaController (headerAreaService, $state) {

        var vm = this;
        vm.currentUser = {};

        vm.onLogoutInitiated = onLogoutInitiated;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            vm.currentUser = headerAreaService.populateCurrentUserObj();
        }

        function onLogoutInitiated () {
            headerAreaService.logout()
                .then(onLogoutSuccess)
                .catch(onLogoutError);
        }

        function onLogoutSuccess () {
            $state.go('login');
        }

        function onLogoutError (error) {
            console.log(error);
        }
    }
})();
