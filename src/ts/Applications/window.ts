/// <reference path="../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../DefinitelyTyped/EventEmitter2/EventEmitter2.d.ts" />
/// <reference path="./Controllers/Autopilot.ts" />
/// <reference path="./Controllers/ComandList.ts" />
/// <reference path="./Services/ChromeTabs.ts" />

angular.module('Autopilot', [])
    .factory('chromeTabs', function () {
        return new ChromeTabs();
    })
    .factory('eventEmitter', () => {
        return new EventEmitter2();
    })
    .controller('Autopilot', Autopilot.Controller)
    .controller('ComandList', ComandList.Controller)
;
