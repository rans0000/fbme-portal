/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('BranchUpdateController', BranchUpdateController);

    BranchUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'toastr', 'utils', 'branchService'];

    function BranchUpdateController ($uibModalInstance, dialogData, toastr, utils, branchService) {
        var vm = this;
        vm.data = dialogData;
        vm.branch = {
            name: dialogData.item.name,
            description: dialogData.item.description
        };
        var mode = dialogData.mode;

        vm.validateBranchDetail = validateBranchDetail;
        vm.createUpdateBranch = createUpdateBranch;
        vm.cancel = cancel;

        //--------------------------------------
        //function declarations

        function validateBranchDetail () {
            var isValid =  false;
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
            var requestObj = {
                name: vm.branch.name,
                description: vm.branch.description,
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
            $uibModalInstance.close();
            toastr.success('Success', 'Updating Branch');
        }

        function onUpdateBranchError (error) {
            console.log(error);
            var errorTranslation = branchService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in updating Branch');
        }
    }
})();