/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('RoleUpdateController', RoleUpdateController);

    RoleUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'roleService'];

    function RoleUpdateController ($uibModalInstance, dialogData, roleService) {
        var vm = this;
        vm.activeTab = 0;
        vm.data = dialogData;
        vm.role = {
            name: dialogData.item.name,
            description: dialogData.item.description
        };
        var permissionList = roleService.getPermissionArray(dialogData.item.privileges);
        var mode = dialogData.mode;

        vm.unselectedPermissions = permissionList.selected;
        vm.selectedPermissions = permissionList.unselected;

        vm.validateRoleDetail = validateRoleDetail;
        vm.movePermissions = movePermissions;
        vm.createUpdateRole = createUpdateRole;
        vm.nextTab = nextTab;
        vm.cancel = cancel;

        //--------------------------------------
        //function declarations

        function validateRoleDetail () {
            var isValid =  ((vm.role.name) && (vm.role.description))? true : false;
            return isValid;
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
                }
            }
        }

        function nextTab () {
            vm.activeTab = 1;
        }
        function cancel () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        }

        function createUpdateRole () {
            if(mode === 'create'){
                createRole();
            }
            else{
                updateRole();
            }
        }

        function createRole () {
            var privileges = createPermissionString(vm.selectedPermissions);
            var requestObj = {
                name: vm.role.name,
                description: vm.role.description,
                privileges: privileges
            };
            console.log(requestObj);
            roleService.createRole(requestObj)
                .then(onCreateRoleSuccess)
                .catch(onCreateRoleError);
        }

        function onCreateRoleSuccess () {
            $uibModalInstance.close();
        }

        function onCreateRoleError (error) {
            console.log(error);
        }

        function updateRole () {
            var privileges = createPermissionString(vm.selectedPermissions);
            var requestObj = {
                id: vm.data.item.id,
                name: vm.role.name,
                description: vm.role.description,
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

        function createPermissionString (Obj) {
            var privileges = '';
            var temp = [];
            for(var key in Obj){
                if(Obj.hasOwnProperty(key)){
                    temp.push(key);
                }
            }
            if(temp.length){
                privileges = temp.join(',');
            }
            
            return privileges;
        }
    }
})();