/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('RoleUpdateController', RoleUpdateController);

    RoleUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'permissions'];

    function RoleUpdateController ($uibModalInstance, dialogData, permissions) {
        var vm = this;
        vm.activeTab = 0;
        vm.data = dialogData;
        vm.role = {
            name: '',
            description: ''
        };
        vm.appPermissions = permissions;
        vm.unselectedPermissions = {blue: false, green: true};
        vm.selectedPermissions = {};

        vm.validateRoleDetail = validateRoleDetail;
        vm.movePermissions = movePermissions;
        vm.ok = ok;
        vm.cancel = cancel;

        //--------------------------------------
        //function declarations

        function validateRoleDetail () {
            var isValid =  ((vm.role.name) && (vm.role.description))? true : false;
            return !isValid;
        }

        function movePermissions (item1, item2, forceMove) {
            if(!Object.keys(item1).length){
                return;
            }
            for(var key in item1){
                if(item1.hasOwnProperty(key)){
                    if(item1[key] || forceMove){
                        item2[key] = false;
                        delete item1[key];
                    }
                    else{
                        item1[key] = false;
                    }
                }
            }
        }

        function ok () {
            $uibModalInstance.close(vm.data.successResult);
        }
        function cancel () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        }
    }
})();