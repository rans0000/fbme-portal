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

        vm.onDeleteRoleInitiate = onDeleteRoleInitiate;

        init();
        //--------------------------------------
        //function declarations

        function init () {
            onAllAPISuccess();
        }

        function onAllAPISuccess () {
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
                //templateUrl: 'myModalContent.html',
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
            roleService.deleteRole(requestObj);
        }
    }
})();
