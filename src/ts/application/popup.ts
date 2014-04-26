/// <reference path="../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="./Controller/Autopilot.ts" />
/// <reference path="./Controller/ComandList.ts" />

angular.module('Autopilot', [])
    .controller('Autopilot', Autopilot.Controller)
    .controller('ComandList', ComandList.Controller)
;
