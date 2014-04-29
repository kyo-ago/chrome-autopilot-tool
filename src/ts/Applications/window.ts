/// <reference path="../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../DefinitelyTyped/EventEmitter2/EventEmitter2.d.ts" />
/// <reference path="./Controllers/Autopilot.ts" />
/// <reference path="./Controllers/CommandList.ts" />
/// <reference path="./Services/ChromeTabs.ts" />

var autopilotApp = angular.module('AutopilotApp', ['ui.sortable'])
    .factory('chromeTabs', () => {
        return new ChromeTabs();
    })
    .factory('eventEmitter', () => {
        return new EventEmitter2();
    })
    .controller('Autopilot', Autopilot.Controller)
    .controller('CommandList', CommandList.Controller)
;
