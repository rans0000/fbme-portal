/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('role.module')
        .controller('RoleController', RoleController);

    RoleController.$inject = ['roleService', '$uibModal', 'toastr'];

    function RoleController (roleService, $uibModal, toastr) {

        var vm = this;
        vm.roleList = [];
        vm.isExpandedState = true;
        vm.deletePopupData = {};
        vm.updateRolePopupData = getUpdateRolePopupData();
        vm.createRolePopupData = getCreateRolePopupData();
        //vm.itemTree = roleService.getSidenavItems();
        //vm.selectedFolder = vm.itemTree[0];
        vm.searchOptions = getSearchOptions();
        vm.advSearch = getAdvSearchOptions();
        vm.idList = '';
        vm.isLoading = false;

        vm.onDeleteRoleInitiate = onDeleteRoleInitiate;
        vm.onUpdateRoleInitiate = onUpdateRoleInitiate;
        vm.onCreateRoleInitiate = onCreateRoleInitiate;
        vm.loadRoleData = loadRoleData;
        vm.onSortByPropertyInitiate = onSortByPropertyInitiate;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            onAllAPISuccess();
            roleService.getSidenavItems()
                .then(populateSidenav);
        }

        function onAllAPISuccess () {
            loadRoleList();
        }

        function loadRoleList () {
            vm.isLoading = true;
            roleService.loadRoleList(vm.searchOptions)
                .then(onLoadRoleListSuccess)
                .catch(onLoadRoleListError);
        }

        function onLoadRoleListSuccess (response) {
            //console.log(response);
            vm.isLoading = false;
            vm.roleList = response.items;
            vm.searchOptions.totalItems = response.totalNumItems;
        }

        function onLoadRoleListError (error) {
            //console.log(error);
            vm.isLoading = false;
            vm.roleList = [];
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at listing Role');
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
                size: 'sm',
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
            vm.isLoading = true;
            roleService.deleteRole(requestObj)
                .then(onDeleteRoleSuccess)
                .catch(onDeleteRoleError);
        }

        function onDeleteRoleSuccess (response) {
            console.log(response);
            vm.isLoading = false;
            toastr.success('Deleted the role', 'Delete Role');
            //reload role table
            loadRoleList();
        }

        function onDeleteRoleError (error) {
            vm.isLoading = false;
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at listing Role');
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
                size: 'md',
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
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at loading Role details');
        }

        function onUpdateRoleSuccess () {
            //update tree
            loadRoleList();
        }

        function getUpdateRolePopupData () {
            var temp = {
                headingText: 'Modify Role',
                confirmText: 'Save',
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
                size: 'md',
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
                headingText: 'Create New Role',
                confirmText: 'Save',
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
            var temp;
            if(vm.idList){
                temp = vm.idList
                    .split(/\s*,\s*/)
                    .map(function (item) {
                    return parseInt(item.trim(), 10);
                });
            }
            vm.searchOptions.createdByUserIds = temp || undefined;
            loadRoleList(vm.searchOptions);
        }

        function getSearchOptions () {
            var nowDate = new Date();
            var fromDate = new Date(nowDate);
            fromDate.setFullYear(fromDate.getFullYear() - 1);

            var temp = {
                totalItems: 0,
                page : 1,
                pageSize: 10,
                sortBy: 'name',
                sortOrder: 'A',
                searchText: '',
                createdDateFrom: fromDate,
                createdDateTo: nowDate,
                createdByUserIds: []
            };
            return temp;
        }

        function getAdvSearchOptions () {
            var temp = {
                isOpen: false,
                dateCreatedFromIsOpen: false,
                dateCreatedToIsOpen: false
            };
            return temp;
        }

        function populateSidenav (response) {
            vm.itemTree = response;
            vm.selectedFolder = vm.itemTree[0];
        }
        
        function onSortByPropertyInitiate (type) {
            if(vm.searchOptions.sortBy === type){
                vm.searchOptions.sortOrder = (vm.searchOptions.sortOrder === 'A')? 'D' : 'A';
            }
            else{
                vm.searchOptions.sortBy = type;
                vm.searchOptions.sortOrder = 'A';
            }
            loadRoleList();
        }
    }
})();
