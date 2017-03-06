/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('BranchUpdateController', BranchUpdateController);

    BranchUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'toastr', 'utils', 'branchService'];

    function BranchUpdateController ($uibModalInstance, dialogData, toastr, utils, branchService) {
        var vm = this;
        vm.activeTab = 0;
        vm.data = dialogData;
        vm.branch = {
            name: dialogData.item.name,
            description: dialogData.item.description
        };
        var permissionList = branchService.getPermissionArray(dialogData.item.privileges);
        var mode = dialogData.mode;

        vm.unselectedPermissions = permissionList.selected;
        vm.selectedPermissions = permissionList.unselected;

        vm.validateBranchDetail = validateBranchDetail;
        vm.movePermissions = movePermissions;
        vm.createUpdateBranch = createUpdateBranch;
        vm.nextTab = nextTab;
        vm.cancel = cancel;

        //--------------------------------------
        //function declarations

        function validateBranchDetail () {
            var isValid =  ((vm.branch.name) && (vm.branch.description))? true : false;
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

        function createUpdateBranch () {
            if(mode === 'create'){
                createBranch();
            }
            else{
                updateBranch();
            }
        }

        function createBranch () {
            var privileges = createPermissionString(vm.selectedPermissions);
            var requestObj = {
                name: vm.branch.name,
                description: vm.branch.description,
                privileges: privileges
            };
            console.log(requestObj);
            branchService.createBranch(requestObj)
                .then(onCreateBranchSuccess)
                .catch(onCreateBranchError);
        }

        function onCreateBranchSuccess () {
            $uibModalInstance.close();
            toastr.success('Success', 'Creating Branch');
        }

        function onCreateBranchError (error) {
            console.log(error);
            var errorTranslation = branchService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in creating Branch');
        }

        function updateBranch () {
            var privileges = createPermissionString(vm.selectedPermissions);
            var requestObj = {
                id: vm.data.item.id,
                name: vm.branch.name,
                description: vm.branch.description,
                privileges: privileges
            };
            console.log(requestObj);
            branchService.updateBranch(requestObj)
                .then(onUpdateBranchSuccess)
                .catch(onUpdateBranchError);
        }

        function onUpdateBranchSuccess () {
            $uibModalInstance.close();
            toastr.success('Success', 'Updating Branch');
        }

        function onUpdateBranchError (error) {
            console.log(error);
            var errorTranslation = branchService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in updating Branch');
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