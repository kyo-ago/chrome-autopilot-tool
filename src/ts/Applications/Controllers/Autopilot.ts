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
        deleteCommand: (command: ts.Models.Command.Model) => any;
        commandGrid: ts.Application.Models.CommandGrid.Model;
        startRecording: () => any;
        stopRecording: () => any;
        changeSpeed: () => any;
        playCurrent: () => any;
        playStop: () => any;
        recordingStatus: boolean;
        baseURL: string;
        playSpeed: string;
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
            $scope.playSpeed = '100';

            $scope.playAll = () => {
                seleniumSender.addCommandList($scope.commandGrid.getCommandList());
                seleniumSender.start();
            };
            $scope.changeSpeed = () => {
                seleniumSender.interval = parseInt($scope.playSpeed);
            };
            $scope.addCommand = () => {
                $scope.commandGrid.add(new ts.Models.Command.Model());
            };
            $scope.deleteCommand = (command) => {
                $scope.commandGrid.remove(command);
            };
            $scope.recordingStatus = true;
            $scope.startRecording = () => {
                $scope.recordingStatus = true;
            };
            $scope.stopRecording = () => {
                $scope.recordingStatus = false;
            };
            $scope.playCurrent = () => {
                //@TODO
            };
            $scope.playStop = () => {
                //@TODO
            };
            tabManager.onMessage((message: Object) => {
                messageDispatcher.dispatch(message, {
                    MessageAddCommentModel : (message: Models.Message.AddComment.Model) => {
                        if (!$scope.recordingStatus) {
                            return;
                        }
                        $scope.$apply(() => {
                            if (!$scope.commandGrid.getList().length) {
                                $scope.baseURL = tabManager.getTabURL();
                                $scope.commandGrid.add(new ts.Models.Command.Model('open', '', $scope.baseURL));
                            }
                            $scope.commandGrid.add(message.command);
                        });
                    }
                });
            });
        }
    }
}
