/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/Selenium/recorder.d.ts" />

module Autopilot {
    export interface Scope extends ng.IScope {
    }
    export class Controller {
        constructor(private $scope: Scope) {
        }
    }
}
