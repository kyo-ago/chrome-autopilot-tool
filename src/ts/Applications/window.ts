/// <reference path="../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../DefinitelyTyped/EventEmitter2/EventEmitter2.d.ts" />
/// <reference path="./Controllers/Autopilot.ts" />
/// <reference path="./Controllers/CommandList.ts" />
/// <reference path="./Services/ChromeTabs.ts" />
/// <reference path="./Directives/CommandList.ts" />

angular.module('Autopilot', [])
    .factory('chromeTabs', function () {
        return new ChromeTabs();
    })
    .factory('eventEmitter', () => {
        return new EventEmitter2();
    })
    .directive('commandList', Directives.CommandList.directive)
    .controller('Autopilot', Autopilot.Controller)
    .controller('CommandList', CommandList.Controller)
;
