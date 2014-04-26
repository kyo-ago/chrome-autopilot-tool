/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/Selenium/recorder.d.ts" />

module ComandList {
    export interface Scope extends ng.IScope {}
    class Observer {
        recordingEnabled: boolean = false;
        isSidebar: boolean = false;
        getUserLog () {
            return console;
        }
        addCommand (command: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) {
            console.log(11111);
        }
        onUnloadDocument (doc: Document) {

        }
    }
    export class Controller {
        constructor(private $scope: Scope) {
            Recorder.register(new Observer(), window);
        }
    }
}
