/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    ModalInstanceCtrl.$inject = ['$uibModalInstance', 'dialogData'];

    function ModalInstanceCtrl ($uibModalInstance, dialogData) {
        var vm = this;
        vm.data = dialogData;

        vm.ok = function () {
            $uibModalInstance.close(vm.data.successResult);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        };
    }
})();