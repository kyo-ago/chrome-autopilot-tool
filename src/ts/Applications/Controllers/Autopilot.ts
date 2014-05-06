/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../../Models/CommandList/Model.ts" />
/// <reference path="../Models/Message/AddCommand/Model.ts" />
/// <reference path="../Models/Message/PlayCommandList/Repository.ts" />
/// <reference path="../Models/Message/Dispatcher.ts" />

module ts.Application.Controllers.Autopilot {
    export interface Scope extends ng.IScope {
        playAll: () => any;
        commandList: ts.Models.CommandList.Model;
    }
    export class Controller {
        messagePlayCommandListRepository = new Models.Message.PlayCommandList.Repository();

        constructor(
            $scope: Scope,
            connectTab: chrome.runtime.Port,
            commandList: ts.Models.CommandList.Model,
            messageDispatcher: Models.Message.Dispatcher
        ) {
            $scope.commandList = commandList;
            $scope.playAll = () => {
                var message = new Models.Message.PlayCommandList.Model($scope.commandList);
                connectTab.postMessage(this.messagePlayCommandListRepository.toObject(message));
            };
            connectTab.onMessage.addListener((message: Object) => {
                messageDispatcher.dispatch(message, {
                    MessageAddCommentModel : (message: Models.Message.AddComment.Model) => {
                        $scope.$apply(() => {
                            $scope.commandList.add(message.command);
                        });
                    }
                });
            });

        }
    }
}
