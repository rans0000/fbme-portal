/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('RoleUpdateController', RoleUpdateController);

    RoleUpdateController.$inject = ['$uibModalInstance', 'dialogData'];

    function RoleUpdateController ($uibModalInstance, dialogData) {
        var vm = this;
        vm.activeTab = 0;
        vm.data = dialogData;
        vm.role = {
            name: '',
            description: ''
        };
        
        vm.validateRoleDetail = validateRoleDetail;
        vm.ok = ok;
        vm.cancel = cancel;
        
        //--------------------------------------
        //function declarations
        
        function validateRoleDetail () {
            var isValid =  ((vm.role.name) && (vm.role.description))? true : false;
            return isValid;
        }
        
        function ok () {
            $uibModalInstance.close(vm.data.successResult);
        }
        function cancel () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        }
    }
})();