/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../../Models/CommandList/Model.ts" />
/// <reference path="../Models/Message/AddCommand/Model.ts" />
/// <reference path="../Models/Message/PlayCommandList/Repository.ts" />
/// <reference path="../Models/Message/Dispatcher.ts" />

module Autopilot {
    export interface Scope extends ng.IScope {
        playAll: () => any;
        commandList: Models.CommandList.Model;
    }
    export class Controller {
        messagePlayCommandListRepository = new Message.PlayCommandList.Repository();

        constructor(
            $scope: Scope,
            connectTab: chrome.runtime.Port,
            commandList: Models.CommandList.Model,
            messageDispatcher: Message.Dispatcher
        ) {
            $scope.commandList = commandList;
            $scope.playAll = () => {
                var message = new Message.PlayCommandList.Model($scope.commandList);
                connectTab.postMessage(this.messagePlayCommandListRepository.toObject(message));
            };
            connectTab.onMessage.addListener((message: Object) => {
                messageDispatcher.dispatch(message, {
                    MessageAddCommentModel : (message: Message.AddComment.Model) => {
                        $scope.commandList.add(message.command);
                    }
                });
            });
        }
    }
}
