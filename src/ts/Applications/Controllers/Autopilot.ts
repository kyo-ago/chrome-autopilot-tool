/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../../Models/CommandList/Model.ts" />
/// <reference path="../Services/ChromeTabs.ts" />
/// <reference path="../Models/Message/Manager.ts" />
/// <reference path="../../Models/CommandList/Model.ts" />
/// <reference path="../Models/Message/AddCommand/Model.ts" />

module Autopilot {
    export interface Scope extends ng.IScope {
        playAll: () => any;
        commandList: CommandList.Model;
    }
    export class Controller {
        constructor($scope: Scope, chromeTabs: chrome.runtime.Port, commandList: CommandList.Model, messageManage: Message.Manager) {
            $scope.commandList = commandList;
            $scope.playAll = () => {
                chromeTabs.postMessage({
                    'name' : 'playAll',
                    'commands' : JSON.stringify($scope.commandList.commands)
                });
            };
            chromeTabs.onMessage.addListener((msg: Object) => {
                messageManage.dispatch(msg, {
                    MessageAddCommentModel : (message: Message.AddComment.Model) => {
                        $scope.commandList.add(message.command);
                    }
                });
            });
        }
    }
}
