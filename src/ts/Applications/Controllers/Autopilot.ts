/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../Models/CommandList/Model.ts" />
/// <reference path="../Models/Message/AddCommand/Model.ts" />
/// <reference path="../Models/Message/Dispatcher.ts" />
/// <reference path="../Services/TabManager.ts" />
/// <reference path="../Services/Selenium/Sender.ts" />

module ts.Application.Controllers.Autopilot {
    export interface Scope extends ng.IScope {
        playAll: () => any;
        commandList: ts.Models.CommandList.Model;
    }
    export class Controller {
        constructor(
            $scope: Scope,
            tabManager: Services.TabManager,
            commandList: ts.Models.CommandList.Model,
            messageDispatcher: Models.Message.Dispatcher,
            seleniumSender: ts.Application.Services.Selenium.Sender
        ) {
            $scope.commandList = commandList;
            $scope.playAll = () => {
                seleniumSender.addCommandList($scope.commandList);
                seleniumSender.start();
            };
            tabManager.onMessage((message: Object) => {
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
