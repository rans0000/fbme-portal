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
        vm.isExpandedState = true;
        vm.deletePopupData = {};
        vm.updateRolePopupData = getUpdateRolePopupData();
        vm.createRolePopupData = getCreateRolePopupData();
        vm.searchOptions = getSearchOptions();

        vm.onDeleteRoleInitiate = onDeleteRoleInitiate;
        vm.onUpdateRoleInitiate = onUpdateRoleInitiate;
        vm.onCreateRoleInitiate = onCreateRoleInitiate;
        vm.loadRoleData = loadRoleData;

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
            roleService.loadRoleList(vm.searchOptions)
                .then(onLoadRoleListSuccess)
                .catch(onLoadRoleListError);
        }

        function onLoadRoleListSuccess (response) {
            //console.log(response);
            vm.roleList = response.items;
            vm.searchOptions.totalItems = response.totalNumPages;
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

        function onUpdateRoleInitiate (item) {
            var requestObj = {
                id: item.id
            };
            roleService.loadRoleDetails(requestObj)
                .then(onLoadRoleDetailsSuccess)
                .catch(onLoadRoleDetailsError);
        }

        function onLoadRoleDetailsSuccess (response) {
            vm.updateRolePopupData.item = response.items[0];
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

            modalInstance.result.then(onUpdateRoleSuccess);
        }

        function onLoadRoleDetailsError (error) {
            console.log(error);
        }

        function onUpdateRoleSuccess () {
            //update tree
            loadRoleList();
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
                item: null,
                mode: 'update',
                translation: null
            };

            return temp;
        }

        function onCreateRoleInitiate () {
            vm.createRolePopupData.item = {
                name: '',
                description: '',
                privileges: ''
            };
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/role/create-update/role.create.update.template.html',
                controller: 'RoleUpdateController',
                controllerAs: 'roleDialog',
                size: 'sm',
                resolve: {
                    dialogData: function () {
                        return vm.createRolePopupData;
                    }
                }
            });

            modalInstance.result.then(onCreateRoleSuccess);
        }

        function onCreateRoleSuccess () {
            //update tree
            loadRoleList();
        }

        function getCreateRolePopupData () {
            var temp = {
                headingText: 'Create Role',
                confirmText: 'Create',
                cancelText: 'Cancel',
                description: '',
                successResult: '',
                cancelResult: 'cancel',
                currentPermissions: [],
                item: null,
                mode: 'create',
                translation: null
            };

            return temp;
        }
        
        function loadRoleData () {
            loadRoleList();
        }

        function getSearchOptions () {
            var temp ={
                totalItems: 90,
                page : 1,
                pageSize: 30,
                sortBy: 'name',
                sortOrder: 'A',
                searchText: '',
                createdByUserIds: []
            };
            return temp;
        }
    }
})();
