/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../Models/Message/AddCommand/Model.ts" />
/// <reference path="../Models/Message/Dispatcher.ts" />
/// <reference path="../Services/TabManager.ts" />
/// <reference path="../Services/Selenium/Sender.ts" />
/// <reference path="../Models/CommandGrid/Model.ts" />

module ts.Application.Controllers.Autopilot {
    export interface Scope extends ng.IScope {
        playAll: () => any;
        addCommand: () => any;
        commandGrid: ts.Application.Models.CommandGrid.Model;
    }
    export class Controller {
        constructor(
            $scope: Scope,
            tabManager: Services.TabManager,
            commandGrid: ts.Application.Models.CommandGrid.Model,
            messageDispatcher: Models.Message.Dispatcher,
            seleniumSender: ts.Application.Services.Selenium.Sender
        ) {
            $scope.commandGrid = commandGrid;

            $scope.commandGrid.add(new ts.Models.Command.Model('type', '//*[@id="inputtext"]', 'aaaa'))

            $scope.playAll = () => {
                seleniumSender.addCommandList($scope.commandGrid.getCommandList());
                seleniumSender.start();
            };
            $scope.addCommand = () => {
                $scope.commandGrid.add(new ts.Models.Command.Model());
            };
            tabManager.onMessage((message: Object) => {
                messageDispatcher.dispatch(message, {
                    MessageAddCommentModel : (message: Models.Message.AddComment.Model) => {
                        $scope.$apply(() => {
                            $scope.commandGrid.add(message.command);
                        });
                    }
                });
            });
        }
    }
}
