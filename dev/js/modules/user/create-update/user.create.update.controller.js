/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('UserUpdateController', UserUpdateController);

    UserUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'toastr', 'utils', 'userService'];

    function UserUpdateController ($uibModalInstance, dialogData, toastr, utils, userService) {
        var vm = this;
        vm.data = dialogData;
        vm.user = {
            name: dialogData.item.name,
            code: dialogData.item.code,
            description: dialogData.item.description
        };
        var mode = dialogData.mode;

        vm.validateUserDetail = validateUserDetail;
        vm.createUpdateUser = createUpdateUser;
        vm.cancel = cancel;

        //--------------------------------------
        //function declarations

        function validateUserDetail () {
            var isValid =  ((vm.user.name) && (vm.user.name.length <= 50))? true : false;
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
            var requestObj = {
                name: vm.user.name,
                description: vm.user.description,
                code: vm.user.code
            };
            console.log(requestObj);
            userService.createUser(requestObj)
                .then(onCreateUserSuccess)
                .catch(onCreateUserError);
        }

        function onCreateUserSuccess () {
            $uibModalInstance.close();
            toastr.success('Success', 'Creating User');
        }

        function onCreateUserError (error) {
            console.log(error);
            var errorTranslation = userService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in creating User');
        }

        function updateUser () {
            var requestObj = {
                id: vm.data.item.id,
                name: vm.user.name,
                description: vm.user.description,
                code: vm.user.code
            };
            console.log(requestObj);
            userService.updateUser(requestObj)
                .then(onUpdateUserSuccess)
                .catch(onUpdateUserError);
        }

        function onUpdateUserSuccess () {
            $uibModalInstance.close();
            toastr.success('Success', 'Updating User');
        }

        function onUpdateUserError (error) {
            console.log(error);
            var errorTranslation = userService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in updating User');
        }
    }
})();