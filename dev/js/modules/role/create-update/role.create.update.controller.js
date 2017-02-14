/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('RoleCreateUpdateController', RoleCreateUpdateController);

    RoleCreateUpdateController.$inject = ['$uibModalInstance', 'dialogData'];

    function RoleCreateUpdateController ($uibModalInstance, dialogData) {
        var vm = this;
        vm.data = dialogData;
        
        //--------------------------------------
        //function declarations
        
        vm.ok = function () {
            $uibModalInstance.close(vm.data.successResult);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        };
    }
})();