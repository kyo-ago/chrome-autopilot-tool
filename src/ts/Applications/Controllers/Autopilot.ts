/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/EventEmitter2/EventEmitter2.d.ts" />
/// <reference path="../Models/AddCommentMessage/Repository.ts" />
/// <reference path="../Services/ChromeTabs.ts" />

module Autopilot {
    export interface Scope extends ng.IScope {
        ee: EventEmitter2;
    }
    export class Controller {
        constructor(private $scope: Scope, private chromeTabs, private eventEmitter) {
            $scope.ee = eventEmitter;
            chromeTabs.connect().then((callback: Function) => {
                callback((msg: any) => {
                    if (AddCommentMessage.Repository.isMessage(msg)) {
                        var message = AddCommentMessage.Repository.fromMessage(msg);
                        $scope.ee.emit('addCommand', message);
                    }
                });
            }).catch((message) => {
                alert(message);
            });
        }
    }
}
