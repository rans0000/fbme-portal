/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('role.module')
        .controller('RoleController', RoleController);

    RoleController.$inject = ['roleService', '$uibModal'];

    function RoleController (roleService, $uibModal) {

        var vm = this;
        vm.roleList = [];
        vm.deletePopupData = {};
        vm.updateRolePopupData = getUpdateRolePopupData();

        vm.onDeleteRoleInitiate = onDeleteRoleInitiate;
        vm.onUpdateRoleInitiate = onUpdateRoleInitiate;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            onAllAPISuccess();
        }

        function onAllAPISuccess () {
            loadRoleList();
        }

        function loadRoleList () {
            roleService.loadRoleList()
                .then(onLoadRoleListSuccess)
                .catch(onLoadRoleListError);
        }

        function onLoadRoleListSuccess (response) {
            console.log(response);
            vm.roleList = response.items;
        }

        function onLoadRoleListError (error) {
            console.log(error);
        }

        function onDeleteRoleInitiate (roleItem) {
            vm.deletePopupData = getDeletePopupData();
            vm.deletePopupData.successResult = roleItem.id;
            vm.deletePopupData.description = 'Do you want to delete this role (' + roleItem.name + ')?';

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/common/confirmDialog/confirm.dialog.template.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    dialogData: function () {
                        return vm.deletePopupData;
                    }
                }
            });

            modalInstance.result.then(deleteRole);
        }

        function getDeletePopupData () {
            var temp = {
                headingText: 'Delete Role',
                confirmText: 'Yes',
                cancelText: 'No',
                description: '',
                successResult: '',
                cancelResult: 'cancel'
            };

            return temp;
        }

        function deleteRole (roleId) {
            var requestObj = {
                ids: [roleId]
            };
            roleService.deleteRole(requestObj)
                .then(onDeleteRoleSuccess)
                .catch(onDeleteRoleError);
        }

        function onDeleteRoleSuccess (response) {
            //@TODO: display success notification
            console.log(response);
            //reload role table
            loadRoleList();
        }

        function onDeleteRoleError (error) {
            //@TODO: display error notification
            console.log(error);
        }

        function onUpdateRoleInitiate () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/role/create-update/role.create.update.template.html',
                controller: 'RoleUpdateController',
                controllerAs: 'roleDialog',
                size: 'sm',
                resolve: {
                    dialogData: function () {
                        return vm.updateRolePopupData;
                    }
                }
            });

            modalInstance.result.then(updateRole);
        }

        function updateRole (roleObject) {
            console.log(roleObject);
        }

        function getUpdateRolePopupData () {
            var temp = {
                headingText: 'Update Role',
                confirmText: 'Update',
                cancelText: 'Cancel',
                description: '',
                successResult: '',
                cancelResult: 'cancel',
                currentPermissions: [],
                translation: null
            };

            return temp;
        }
    }
})();
