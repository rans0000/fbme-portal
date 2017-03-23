/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('department.module')
        .controller('DepartmentController', DepartmentController);

    DepartmentController.$inject = ['departmentService', '$uibModal', 'toastr'];

    function DepartmentController (departmentService, $uibModal, toastr) {

        var vm = this;
        vm.departmentList = [];
        vm.isExpandedState = true;
        vm.deletePopupData = {};
        vm.updateDepartmentPopupData = getUpdateDepartmentPopupData();
        vm.createDepartmentPopupData = getCreateDepartmentPopupData();
        //vm.itemTree = departmentService.getSidenavItems();
        //vm.selectedFolder = vm.itemTree[0];
        vm.searchOptions = getSearchOptions();
        vm.advSearch = getAdvSearchOptions();
        vm.idList = '';

        vm.onDeleteDepartmentInitiate = onDeleteDepartmentInitiate;
        vm.onUpdateDepartmentInitiate = onUpdateDepartmentInitiate;
        vm.onCreateDepartmentInitiate = onCreateDepartmentInitiate;
        vm.loadDepartmentData = loadDepartmentData;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            onAllAPISuccess();
            departmentService.getSidenavItems()
                .then(populateSidenav);
        }

        function onAllAPISuccess () {
            loadDepartmentList();
        }

        function loadDepartmentList () {
            departmentService.loadDepartmentList(vm.searchOptions)
                .then(onLoadDepartmentListSuccess)
                .catch(onLoadDepartmentListError);
        }

        function onLoadDepartmentListSuccess (response) {
            //console.log(response);
            vm.departmentList = response.items;
            vm.searchOptions.totalItems = response.totalNumItems;
        }

        function onLoadDepartmentListError (error) {
            //console.log(error);
            var errorTranslation = departmentService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at listing Department');
        }

        function onDeleteDepartmentInitiate (departmentItem) {
            vm.deletePopupData = getDeletePopupData();
            vm.deletePopupData.successResult = departmentItem.id;
            vm.deletePopupData.description = 'Do you want to delete this department (' + departmentItem.name + ')?';

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

            modalInstance.result.then(deleteDepartment);
        }

        function getDeletePopupData () {
            var temp = {
                headingText: 'Delete Department',
                confirmText: 'Yes',
                cancelText: 'No',
                description: '',
                successResult: '',
                cancelResult: 'cancel'
            };

            return temp;
        }

        function deleteDepartment (departmentId) {
            var requestObj = {
                ids: [departmentId]
            };
            departmentService.deleteDepartment(requestObj)
                .then(onDeleteDepartmentSuccess)
                .catch(onDeleteDepartmentError);
        }

        function onDeleteDepartmentSuccess (response) {
            console.log(response);
            toastr.success('Deleted the department', 'Delete Department');
            //reload department table
            loadDepartmentList();
        }

        function onDeleteDepartmentError (error) {
            var errorTranslation = departmentService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at listing Department');
        }

        function onUpdateDepartmentInitiate (item) {
            var requestObj = {
                id: item.id
            };
            departmentService.loadDepartmentDetails(requestObj)
                .then(onLoadDepartmentDetailsSuccess)
                .catch(onLoadDepartmentDetailsError);
        }

        function onLoadDepartmentDetailsSuccess (response) {
            vm.updateDepartmentPopupData.item = response.items[0];
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/department/create-update/department.create.update.template.html',
                controller: 'DepartmentUpdateController',
                controllerAs: 'deptDialog',
                size: 'md',
                resolve: {
                    dialogData: function () {
                        return vm.updateDepartmentPopupData;
                    }
                }
            });

            modalInstance.result.then(onUpdateDepartmentSuccess);
        }

        function onLoadDepartmentDetailsError (error) {
            console.log(error);
            var errorTranslation = departmentService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at loading Department details');
        }

        function onUpdateDepartmentSuccess () {
            //update tree
            loadDepartmentList();
        }

        function getUpdateDepartmentPopupData () {
            var temp = {
                headingText: 'Update Department',
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

        function onCreateDepartmentInitiate () {
            vm.createDepartmentPopupData.item = {
                name: '',
                code: '',
                description: ''
            };
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/department/create-update/department.create.update.template.html',
                controller: 'DepartmentUpdateController',
                controllerAs: 'deptDialog',
                size: 'md',
                resolve: {
                    dialogData: function () {
                        return vm.createDepartmentPopupData;
                    }
                }
            });

            modalInstance.result.then(onCreateDepartmentSuccess);
        }

        function onCreateDepartmentSuccess () {
            //update tree
            loadDepartmentList();
        }

        function getCreateDepartmentPopupData () {
            var temp = {
                headingText: 'Create Department',
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

        function loadDepartmentData () {
            var temp;
            if(vm.idList){
                temp = vm.idList
                    .split(/\s*,\s*/)
                    .map(function (item) {
                    return parseInt(item.trim(), 10);
                });
            }
            vm.searchOptions.createdByUserIds = temp || undefined;
            loadDepartmentList();
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
