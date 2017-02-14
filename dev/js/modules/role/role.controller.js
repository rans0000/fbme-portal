/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('role.module')
        .controller('RoleController', RoleController);

    RoleController.$inject = ['roleService'];

    function RoleController (roleService) {

        var vm = this;
        vm.roleList = [];

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
    }
})();
