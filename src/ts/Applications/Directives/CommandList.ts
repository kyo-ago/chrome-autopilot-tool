/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />

module Directives {
    export class CommandList {
        static directive(): ng.IDirective {
            return {
                'restrict' : 'E',
                'transclude' : 'element',
                'replace' : true,
                'link' : ($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attr: ng.IAttributes, ctrl: any, $transclude: ng.ITranscludeFunction) => {
                    $scope.$watchCollection('commandList.commands', (newValue: any) => {
                        console.log(newValue, $element)
                    });
                }
            };
        }
    }
}
