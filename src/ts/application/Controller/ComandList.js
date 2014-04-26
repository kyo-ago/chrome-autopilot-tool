/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/Selenium/recorder.d.ts" />
var ComandList;
(function (ComandList) {
    var Observer = (function () {
        function Observer() {
            this.recordingEnabled = false;
            this.isSidebar = false;
        }
        Observer.prototype.getUserLog = function () {
            return console;
        };
        Observer.prototype.addCommand = function (command, target, value, window, insertBeforeLastCommand) {
            console.log(11111);
        };
        Observer.prototype.onUnloadDocument = function (doc) {
        };
        return Observer;
    })();
    var Controller = (function () {
        function Controller($scope) {
            this.$scope = $scope;
            Recorder.register(new Observer(), window);
        }
        return Controller;
    })();
    ComandList.Controller = Controller;
})(ComandList || (ComandList = {}));
//# sourceMappingURL=ComandList.js.map
