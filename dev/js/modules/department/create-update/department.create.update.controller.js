/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('DepartmentUpdateController', DepartmentUpdateController);

    DepartmentUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'toastr', 'utils', 'departmentService'];

    function DepartmentUpdateController ($uibModalInstance, dialogData, toastr, utils, departmentService) {
        var vm = this;
        vm.data = dialogData;
        vm.department = {
            name: dialogData.item.name,
            code: dialogData.item.code,
            description: dialogData.item.description
        };
        var mode = dialogData.mode;

        vm.validateDepartmentDetail = validateDepartmentDetail;
        vm.createUpdateDepartment = createUpdateDepartment;
        vm.cancel = cancel;

        //--------------------------------------
        //function declarations

        function validateDepartmentDetail () {
            var isValid =  ((vm.department.name) && (vm.department.name.length <= 50))? true : false;
            return isValid;
        }
        
        function cancel () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        }

        function createUpdateDepartment () {
            if(mode === 'create'){
                createDepartment();
            }
            else{
                updateDepartment();
            }
        }

        function createDepartment () {
            var requestObj = {
                name: vm.department.name,
                description: vm.department.description,
                code: vm.department.code
            };
            console.log(requestObj);
            departmentService.createDepartment(requestObj)
                .then(onCreateDepartmentSuccess)
                .catch(onCreateDepartmentError);
        }

        function onCreateDepartmentSuccess () {
            $uibModalInstance.close();
            toastr.success('Success', 'Creating Department');
        }

        function onCreateDepartmentError (error) {
            console.log(error);
            var errorTranslation = departmentService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in creating Department');
        }

        function updateDepartment () {
            var requestObj = {
                id: vm.data.item.id,
                name: vm.department.name,
                description: vm.department.description,
                code: vm.department.code
            };
            console.log(requestObj);
            departmentService.updateDepartment(requestObj)
                .then(onUpdateDepartmentSuccess)
                .catch(onUpdateDepartmentError);
        }

        function onUpdateDepartmentSuccess () {
            $uibModalInstance.close();
            toastr.success('Success', 'Updating Department');
        }

        function onUpdateDepartmentError (error) {
            console.log(error);
            var errorTranslation = departmentService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in updating Department');
        }
    }
})();