/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('RoleUpdateController', RoleUpdateController);

    RoleUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'toastr', 'utils', 'roleService'];

    function RoleUpdateController ($uibModalInstance, dialogData, toastr, utils, roleService) {
        var vm = this;
        vm.activeTab = 0;
        vm.data = dialogData;
        vm.isLoading = false;
        vm.role = {
            name: dialogData.item.name,
            description: dialogData.item.description
        };
        var permissionList = roleService.getPermissionArray(dialogData.item.privileges);
        var mode = dialogData.mode;
        vm.translation = dialogData.translation;

        vm.unselectedPermissions = permissionList.selected;
        vm.selectedPermissions = permissionList.unselected;

        vm.validateRoleDetailTab1 = validateRoleDetailTab1;
        vm.validateRoleDetailTab2 = validateRoleDetailTab2;
        vm.movePermissions = movePermissions;
        vm.createUpdateRole = createUpdateRole;
        vm.nextTab = nextTab;
        vm.cancel = cancel;
        vm.translate = translate;

        //--------------------------------------
        //function declarations

        function validateRoleDetailTab1 () {
            var isValid =  ((vm.role.name) && (vm.role.name.length <= 50))? true : false;
            return isValid;
        }
        
        function validateRoleDetailTab2 () {
            return Object.getOwnPropertyNames(vm.selectedPermissions).length;
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
            vm.isLoading = true;
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
            vm.isLoading = false;
            toastr.success('Success', 'Creating Role');
        }

        function onCreateRoleError (error) {
            console.log(error);
            vm.isLoading = false;
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode, vm.translation);
            toastr.error(errorTranslation, 'Error while creating Role');
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
            vm.isLoading = false;
            $uibModalInstance.close();
            toastr.success('Success', 'Modifying Role Success');
        }

        function onUpdateRoleError (error) {
            vm.isLoading = false;
            console.log(error);
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode, vm.translation);
            toastr.error(errorTranslation, 'Error in modifying Role');
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
        
        function translate (key) {
            var returnText = vm.translation.hasOwnProperty(key)? vm.translation[key]: 'UNKNOWN KEY';
            return returnText;
        }
    }
})();