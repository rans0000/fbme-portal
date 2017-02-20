/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('RoleUpdateController', RoleUpdateController);

    RoleUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'permissions', 'roleService'];

    function RoleUpdateController ($uibModalInstance, dialogData, permissions, roleService) {
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
        vm.updateRole = updateRole;
        vm.nextTab = nextTab;
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

        function nextTab () {
            vm.activeTab = 1;
        }
        function cancel () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        }

        function updateRole () {
            var privileges = '';
            var temp = [];
            for(var key in vm.selectedPermissions){
                if(vm.selectedPermissions.hasOwnProperty(key)){
                    temp.push(key);
                }
            }
            if(temp.length){
                privileges = temp.join(',');
            }
            var requestObj = {
                id: vm.data.item.id,
                name: vm.data.item.createdByUserName,
                description: vm.data.item.description,
                privileges: privileges
            };
            console.log(requestObj);
            roleService.updateRole(requestObj)
                .then(onUpdateRoleSuccess)
                .catch(onUpdateRoleError);
        }

        function onUpdateRoleSuccess () {
            $uibModalInstance.close();
        }

        function onUpdateRoleError (error) {
            console.log(error);
        }
    }
})();