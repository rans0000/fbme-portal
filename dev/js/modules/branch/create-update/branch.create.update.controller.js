/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('BranchUpdateController', BranchUpdateController);

    BranchUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'toastr', 'utils', 'branchService'];

    function BranchUpdateController ($uibModalInstance, dialogData, toastr, utils, branchService) {
        var vm = this;
        vm.isLoading = false;
        vm.data = dialogData;
        vm.branch = {
            name: dialogData.item.name,
            code: dialogData.item.code,
            address1: dialogData.item.address1,
            address2: dialogData.item.address2,
            address3: dialogData.item.address3,
            address4: dialogData.item.address4,
            zip: dialogData.item.zip
        };
        vm.translation = dialogData.translation;
        var mode = dialogData.mode;

        vm.validateBranchDetail = validateBranchDetail;
        vm.createUpdateBranch = createUpdateBranch;
        vm.cancel = cancel;

        //--------------------------------------
        //function declarations

        function validateBranchDetail () {
            var isValid =  false;
            if(vm.branch.name !== ''){
                isValid = true;
            }
            return isValid;
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
            vm.isLoading = true;
            var requestObj = angular.copy(vm.branch);
            console.log(requestObj);
            branchService.createBranch(requestObj)
                .then(onCreateBranchSuccess)
                .catch(onCreateBranchError);
        }

        function onCreateBranchSuccess () {
            vm.isLoading = false;
            $uibModalInstance.close();
            var toastMessage = utils.translate('Successfully created {0:name}', [vm.branch.name]);
            toastr.success(toastMessage, 'Creating Branch');
        }

        function onCreateBranchError (error) {
            vm.isLoading = false;
            console.log(error);
            var errorTranslation = branchService.getErrorTranslationValue(error.header.responseCode, vm.translation);
            var toastMessage = utils.translate('Error in creating Branch {0:name}', [vm.branch.name]);
            toastr.error(errorTranslation, toastMessage);
        }

        function updateBranch () {
            vm.isLoading = true;
            var requestObj = {
                id: vm.data.item.id,
                name: vm.branch.name,
                description: vm.branch.description,
            };
            console.log(requestObj);
            branchService.updateBranch(requestObj)
                .then(onUpdateBranchSuccess)
                .catch(onUpdateBranchError);
        }

        function onUpdateBranchSuccess () {
            vm.isLoading = false;
            $uibModalInstance.close();
            var toastMessage = utils.translate('Successfully modified {0:name}', [vm.branch.name]);
            toastr.success(toastMessage, 'Modifying Branch');
        }

        function onUpdateBranchError (error) {
            console.log(error);
            vm.isLoading = false;
            var errorTranslation = branchService.getErrorTranslationValue(error.header.responseCode, vm.translation);
            var toastMessage = utils.translate('Error in modifying Branch {0:name}', [vm.branch.name]);
            toastr.error(errorTranslation, toastMessage);
        }
    }
})();