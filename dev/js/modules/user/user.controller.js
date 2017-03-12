/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('user.module')
        .controller('UserController', UserController);

    UserController.$inject = ['userService', '$uibModal', 'toastr'];

    function UserController (userService, $uibModal, toastr) {

        var vm = this;
        vm.userList = [];
        vm.isExpandedState = true;
        vm.deletePopupData = {};
        vm.updateUserPopupData = getUpdateUserPopupData();
        vm.createUserPopupData = getCreateUserPopupData();
        //vm.itemTree = userService.getSidenavItems();
        //vm.selectedFolder = vm.itemTree[0];
        vm.searchOptions = getSearchOptions();
        vm.advSearch = getAdvSearchOptions();
        vm.idList = '';

        vm.onDeleteUserInitiate = onDeleteUserInitiate;
        vm.onUpdateUserInitiate = onUpdateUserInitiate;
        vm.onCreateUserInitiate = onCreateUserInitiate;
        vm.loadUserData = loadUserData;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            onAllAPISuccess();
            userService.getSidenavItems()
                .then(populateSidenav);
        }

        function onAllAPISuccess () {
            loadUserList();
        }

        function loadUserList () {
            userService.loadUserList(vm.searchOptions)
                .then(onLoadUserListSuccess)
                .catch(onLoadUserListError);
        }

        function onLoadUserListSuccess (response) {
            //console.log(response);
            vm.userList = response.items;
            vm.searchOptions.totalItems = response.totalNumPages;
        }

        function onLoadUserListError (error) {
            //console.log(error);
            var errorTranslation = userService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at listing User');
        }

        function onDeleteUserInitiate (userItem) {
            vm.deletePopupData = getDeletePopupData();
            vm.deletePopupData.successResult = userItem.id;
            vm.deletePopupData.description = 'Do you want to delete this user (' + userItem.name + ')?';

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

            modalInstance.result.then(deleteUser);
        }

        function getDeletePopupData () {
            var temp = {
                headingText: 'Delete User',
                confirmText: 'Yes',
                cancelText: 'No',
                description: '',
                successResult: '',
                cancelResult: 'cancel'
            };

            return temp;
        }

        function deleteUser (userId) {
            var requestObj = {
                ids: [userId]
            };
            userService.deleteUser(requestObj)
                .then(onDeleteUserSuccess)
                .catch(onDeleteUserError);
        }

        function onDeleteUserSuccess (response) {
            console.log(response);
            toastr.success('Deleted the user', 'Delete User');
            //reload user table
            loadUserList();
        }

        function onDeleteUserError (error) {
            var errorTranslation = userService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at listing User');
        }

        function onUpdateUserInitiate (item) {
            var requestObj = {
                id: item.id
            };
            userService.loadUserDetails(requestObj)
                .then(onLoadUserDetailsSuccess)
                .catch(onLoadUserDetailsError);
        }

        function onLoadUserDetailsSuccess (response) {
            vm.updateUserPopupData.item = response.items[0];
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/user/create-update/user.create.update.template.html',
                controller: 'UserUpdateController',
                controllerAs: 'userDialog',
                size: 'md',
                resolve: {
                    dialogData: function () {
                        return vm.updateUserPopupData;
                    }
                }
            });

            modalInstance.result.then(onUpdateUserSuccess);
        }

        function onLoadUserDetailsError (error) {
            console.log(error);
            var errorTranslation = userService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at loading User details');
        }

        function onUpdateUserSuccess () {
            //update tree
            loadUserList();
        }

        function getUpdateUserPopupData () {
            var temp = {
                headingText: 'Update User',
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

        function onCreateUserInitiate () {
            vm.createUserPopupData.item = {
                name: '',
                code: '',
                description: ''
            };
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/user/create-update/user.create.update.template.html',
                controller: 'UserUpdateController',
                controllerAs: 'userDialog',
                size: 'md',
                resolve: {
                    dialogData: function () {
                        return vm.createUserPopupData;
                    }
                }
            });

            modalInstance.result.then(onCreateUserSuccess);
        }

        function onCreateUserSuccess () {
            //update tree
            loadUserList();
        }

        function getCreateUserPopupData () {
            var temp = {
                headingText: 'Create User',
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

        function loadUserData () {
            var temp = vm.idList
            .split(/\s*,\s*/)
            .map(function (item) {
                return parseInt(item.trim(), 10);
            })
            .filter(function (item) {
                return !isNaN(item);
            })
            .join(',');
            vm.searchOptions.createdByUserIds = temp || undefined;
            loadUserList();
        }

        function getSearchOptions () {
            var nowDate = new Date();
            var fromDate = new Date(nowDate);
            fromDate.setFullYear(fromDate.getFullYear() - 1);

            var temp = {
                totalItems: 0,
                page : 1,
                pageSize: 30,
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
    }
})();
