/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('branch.module')
        .controller('BranchController', BranchController);

    BranchController.$inject = ['branchService', '$uibModal', 'toastr', 'utils'];

    function BranchController (branchService, $uibModal, toastr, utils) {

        var vm = this;
        vm.branchList = [];
        vm.isExpandedState = true;
        vm.deletePopupData = {};
        vm.updateBranchPopupData = getUpdateBranchPopupData();
        vm.createBranchPopupData = getCreateBranchPopupData();
        vm.searchOptions = getSearchOptions();
        vm.advSearch = getAdvSearchOptions();
        vm.idList = '';
        vm.isLoading = false;

        vm.onDeleteBranchInitiate = onDeleteBranchInitiate;
        vm.onUpdateBranchInitiate = onUpdateBranchInitiate;
        vm.onCreateBranchInitiate = onCreateBranchInitiate;
        vm.loadBranchData = loadBranchData;
        vm.onSortByPropertyInitiate = onSortByPropertyInitiate;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            var lang = utils.getLanguage();
            utils.getTranslation(lang)
                .then(onAllAPISuccess);
            branchService.getSidenavItems()
                .then(populateSidenav);
        }

        function onAllAPISuccess (response) {
            vm.translation = response;
            loadBranchList();
        }

        function loadBranchList () {
            vm.isLoading = true;
            branchService.loadBranchList(vm.searchOptions)
                .then(onLoadBranchListSuccess)
                .catch(onLoadBranchListError);
        }

        function onLoadBranchListSuccess (response) {
            //console.log(response);
            vm.isLoading = false;
            vm.branchList = response.items;
            vm.searchOptions.totalItems = response.totalNumItems;
        }

        function onLoadBranchListError (error) {
            //console.log(error);
            vm.isLoading = false;
            vm.branchList = [];
            var errorTranslation = branchService.getErrorTranslationValue(error.header.responseCode, vm.translation);
            toastr.error(errorTranslation, 'Error at listing Branch');
        }

        function onDeleteBranchInitiate (branchItem) {
            vm.deletePopupData = getDeletePopupData();
            vm.deletePopupData.successResult = branchItem.id;
            vm.deletePopupData.description = 'Do you want to delete this branch (' + branchItem.name + ')?';

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

            modalInstance.result.then(deleteBranch);
        }

        function getDeletePopupData () {
            var temp = {
                headingText: 'Delete Branch',
                confirmText: 'Yes',
                cancelText: 'No',
                description: '',
                successResult: '',
                cancelResult: 'cancel'
            };

            return temp;
        }

        function deleteBranch (branchId) {
            var requestObj = {
                ids: [branchId]
            };
            vm.isLoading = true;
            branchService.deleteBranch(requestObj)
                .then(onDeleteBranchSuccess)
                .catch(onDeleteBranchError);
        }

        function onDeleteBranchSuccess (response) {
            console.log(response);
            vm.isLoading = false;
            toastr.success('Deleted the branch', 'Delete Branch');
            //reload branch table
            loadBranchList();
        }

        function onDeleteBranchError (error) {
            vm.isLoading = false;
            var errorTranslation = branchService.getErrorTranslationValue(error.header.responseCode, vm.translation);
            toastr.error(errorTranslation, 'Error at listing Branch');
        }

        function onUpdateBranchInitiate (item) {
            var requestObj = {
                id: item.id
            };
            branchService.loadBranchDetails(requestObj)
                .then(onLoadBranchDetailsSuccess)
                .catch(onLoadBranchDetailsError);
        }

        function onLoadBranchDetailsSuccess (response) {
            vm.updateBranchPopupData.item = response.items[0];
            vm.updateBranchPopupData.translation = vm.translation;
            
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/branch/create-update/branch.create.update.template.html',
                controller: 'BranchUpdateController',
                controllerAs: 'branchDialog',
                size: 'sm',
                resolve: {
                    dialogData: function () {
                        return vm.updateBranchPopupData;
                    }
                }
            });

            modalInstance.result.then(onUpdateBranchSuccess);
        }

        function onLoadBranchDetailsError (error) {
            console.log(error);
            var errorTranslation = branchService.getErrorTranslationValue(error.header.responseCode, vm.translation);
            toastr.error(errorTranslation, 'Error at loading Branch details');
        }

        function onUpdateBranchSuccess () {
            //update tree
            loadBranchList();
        }

        function getUpdateBranchPopupData () {
            var temp = {
                headingText: 'Modify Branch',
                confirmText: 'Save',
                cancelText: 'Cancel',
                description: '',
                successResult: '',
                cancelResult: 'cancel',
                item: null,
                mode: 'update',
                translation: null
            };

            return temp;
        }

        function onCreateBranchInitiate () {
            vm.createBranchPopupData.item = {
                name: '',
                code: undefined,
                address1: undefined,
                address2: undefined,
                address3: undefined,
                address4: undefined,
                zip: undefined
            };
            vm.createBranchPopupData.translation = vm.translation;
            
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/branch/create-update/branch.create.update.template.html',
                controller: 'BranchUpdateController',
                controllerAs: 'branchDialog',
                size: 'sm',
                resolve: {
                    dialogData: function () {
                        return vm.createBranchPopupData;
                    }
                }
            });

            modalInstance.result.then(onCreateBranchSuccess);
        }

        function onCreateBranchSuccess () {
            //update tree
            loadBranchList();
        }

        function getCreateBranchPopupData () {
            var temp = {
                headingText: 'Create Branch',
                confirmText: 'Save',
                cancelText: 'Cancel',
                description: '',
                successResult: '',
                cancelResult: 'cancel',
                item: null,
                mode: 'create',
                translation: null
            };

            return temp;
        }

        function loadBranchData () {
            var temp;
            if(vm.idList){
                temp = vm.idList
                    .split(/\s*,\s*/)
                    .map(function (item) {
                    return parseInt(item.trim(), 10);
                });
            }
            vm.searchOptions.createdByUserIds = temp || undefined;
            loadBranchList();
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
            loadBranchList();
        }
    }
})();
