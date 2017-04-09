/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('UserUpdateController', UserUpdateController);

    UserUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'toastr', 'utils', 'userService'];

    function UserUpdateController ($uibModalInstance, dialogData, toastr, utils, userService) {
        var vm = this;
        vm.isLoading = false;
        vm.data = dialogData;
        vm.user = angular.copy(dialogData.item);
        var mode = dialogData.mode;
        vm.selectedListData = {};

        vm.validateUserDetail = validateUserDetail;
        vm.createUpdateUser = createUpdateUser;
        vm.cancel = cancel;

        init();
        //--------------------------------------
        //function declarations

        function init () {
            vm.isLoading = true;
            userService.getRoleBranchDeptData()
                .then(onGetRoleBranchDeptDataSuccess)
                .catch(onGetRoleBranchDeptDataError);
        }

        function onGetRoleBranchDeptDataSuccess (response) {
            vm.isLoading = false;
            vm.selectedListData.roleList = response.roleList.items.map(copyObject);
            vm.selectedListData.branchList = response.branchList.items.map(copyObject);
            vm.selectedListData.departmentList = response.departmentList.items.map(copyObject);
            //console.log(vm.selectedListData);
        }
        function copyObject(item) {
            return {
                id: item.id,
                name: item.name
            };
        }
        function onGetRoleBranchDeptDataError (error) {
            vm.isLoading = false;
            var errorTranslation = userService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in loading data');
            //alert(error);
        }

        function validateUserDetail () {
            var isValid =  true;
            if(!vm.user.userName || (vm.user.userName.length > 50)){
                isValid =  false;
            }
            if(vm.formCreateUpdate.inputTimeZone.$viewValue && vm.formCreateUpdate.inputTimeZone.$error.pattern){
                isValid =  false;
            }
            return isValid;
        }

        function cancel () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        }

        function createUpdateUser () {
            if(mode === 'create'){
                createUser();
            }
            else{
                updateUser();
            }
        }

        function createUser () {
            vm.isLoading = true;
            var requestObj = createRequestObject(vm.user);
            console.log(requestObj);
            userService.createUser(requestObj)
                .then(onCreateUserSuccess)
                .catch(onCreateUserError);
        }

        function onCreateUserSuccess () {
            vm.isLoading = false;
            $uibModalInstance.close();
            var toastMessage = utils.translate('Successfully created {0:name}', [vm.user.name]);
            toastr.success(toastMessage, 'Creating User');
        }

        function onCreateUserError (error) {
            console.log(error);
            vm.isLoading = false;
            var errorTranslation = userService.getErrorTranslationValue(error.header.responseCode);
            var toastMessage = utils.translate('Error in creating User {0:name}', [vm.user.name]);
            toastr.error(errorTranslation, toastMessage);
        }

        function updateUser () {
            var requestObj = {
                id: vm.data.item.id,
                name: vm.user.name,
                description: vm.user.description,
                code: vm.user.code
            };
            console.log(requestObj);
            vm.isLoading = true;
            userService.updateUser(requestObj)
                .then(onUpdateUserSuccess)
                .catch(onUpdateUserError);
        }

        function onUpdateUserSuccess () {
            vm.isLoading = false;
            $uibModalInstance.close();
            var toastMessage = utils.translate('Successfully modified {0:name}', [vm.user.name]);
            toastr.success(toastMessage, 'Modify User');
        }

        function onUpdateUserError (error) {
            console.log(error);
            vm.isLoading = false;
            var errorTranslation = userService.getErrorTranslationValue(error.header.responseCode);
            var toastMessage = utils.translate('Error in modyfying User {0:name}', [vm.user.name]);
            toastr.error(errorTranslation, toastMessage);
        }

        function createRequestObject (obj) {
            var objCopy = angular.copy(obj);
            if(obj.roleIds.length){
                objCopy.roleIds = obj.roleIds.map(mapIds);
            }
            if(obj.branchIds.length){
                objCopy.branchIds = obj.branchIds.map(mapIds);
            }
            if(obj.departmentIds.length){
                objCopy.departmentIds = obj.departmentIds.map(mapIds);
            }
            var requestObj = utils.prepareListRequest(objCopy);
            return requestObj;
        }

        function mapIds (item) {
            return parseInt(item.id, 10);
        }
    }
})();