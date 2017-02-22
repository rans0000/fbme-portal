/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .directive('tree', treeDirective);

    function treeDirective () {
        var directiveObject = {
            replace: true,
            restrict: 'E',
            scope: {
                collection: '=',
                selectedFolder: '='
            },
            templateUrl: 'js/modules/common/tree/tree.directive.template.html',
            link: treeLink,
            controller: TreeController,
            controllerAs: 'tree',
            bindToController: true
        };
        
        return directiveObject;

        function treeLink (scope, element, attributes, ctrl) {
            //console.log(ctrl.collection);
        }
        
        function TreeController () {
            var vm = this;
        }
    }
})();