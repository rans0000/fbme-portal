/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .directive('branch', branchDirective);

    branchDirective.$inject = ['$compile', 'jQuery', '$state'];
    function branchDirective ($compile, $, $state) {
        var directiveObject = {
            replace: true,
            restrict: 'E',
            scope: {
                item: '=',
                selectedFolder: '='
            },
            templateUrl: 'js/modules/common/tree/branch.directive.template.html',
            link: branchLink,
            controller: TreeBranchController,
            controllerAs: 'branch',
            bindToController: true
        };

        TreeBranchController.$inject = ['$scope'];

        return directiveObject;

        function branchLink (scope, element, attributes, ctrl) {
            var $element = $(element);

            ctrl.toggleOpenState = toggleOpenState;

            if(angular.isArray(scope.branch.item.children)){
                $compile('<tree collection="branch.item.children" selected-folder="tree.selectedFolder"></tree>')(scope, function (cloned) {
                    element.append(cloned);
                });
            }

            function toggleOpenState (event) {
                event.stopPropagation();
                ctrl.isOpen = !ctrl.isOpen;
                if(ctrl.isOpen){
                    $element.children('.menu-tree').slideDown(200);
                }
                else{
                    scope.$emit('folderOpened');
                    $element.children('.menu-tree').slideUp(200);
                }
            }
        }

        function TreeBranchController ($scope) {
            var vm = this;
            console.log(vm);
            vm.isActive = vm.item === vm.selectedFolder;
            vm.isOpen = vm.isActive;
            if(vm.item.hasOwnProperty('sref') && ($state.is(vm.item.sref)) ){
                vm.isActive = true;
            }
            vm.onItemClick = onItemClick;
            vm.hasInnerFolder = checkForInnerFolder();
            //vm.toggleOpenState = toggleOpenState;
            $scope.$on('folderSelectFromExplorer', onFolderSelect);
            $scope.$on('folderOpened', folderOpenedLitener);

            function onItemClick (item) {
                if(item.hasOwnProperty('sref')){
                    $state.go(item.sref);
                }
                else{
                    $scope.$emit('folderSelectFromTree', item);
                }
            }

            function onFolderSelect (event, item) {
                if(item === vm.item){
                    vm.isActive = true;
                    vm.isOpen = true;
                    $scope.$emit('folderOpened');
                }
                else{
                    vm.isActive = false;
                }
            }

            function folderOpenedLitener () {
                //console.log(vm.item.title);
            }

            function checkForInnerFolder () {
                var hasFolder = false;
                angular.forEach(vm.item.children, function (item) {
                    if(item.type === 'Folder'){
                        hasFolder = true;
                    }
                });
                return hasFolder;
            }
        }
    }
})();