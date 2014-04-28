/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/EventEmitter2/EventEmitter2.d.ts" />
/// <reference path="../../Models/CommandList/Model.ts" />
/// <reference path="../Models/AddCommentMessage/Model.ts" />

module ComandList {
    export interface Scope extends ng.IScope {
        ee: EventEmitter2;
        commandList: CommandList.Model;
    }
    export class Controller {
        constructor(private $scope: Scope, private eventEmitter) {
            $scope.ee = eventEmitter;
            $scope.commandList = new CommandList.Model();
            $scope.ee.addListener('addCommand', (message: AddCommentMessage.Model) => {
                $scope.commandList.add(message.command);
            });
        }
    }
}
