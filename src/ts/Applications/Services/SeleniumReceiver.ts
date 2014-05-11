/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../Models/CommandList/Model.ts" />

module ts.Application.Services {
    export class SeleniumReceiver {
        selenium: any;
        commandFactory: any;
        currentTest: any;
        testCase: any;

        constructor () {
            // for selenium-runner
            (<any>window).getBrowser = () => {
                return {
                    'selectedBrowser' : {
                        'contentWindow' : window
                    }
                };
            };
            (<any>window).lastWindow = window;
            (<any>window).testCase = new (<any>window).TestCase;
            (<any>window).selenium = (<any>window).createSelenium(location.href, true);

            (<any>window).editor = {
                'app' : {
                    'getOptions' : () => {
                        return {
                            'timeout' : 1
                        };
                    }
                },
                'view' : {
                    'rowUpdated' : () => {},
                    'scrollToRow' : () => {}
                }
            };

            this.testCase = (<any>window).testCase;
            this.selenium = (<any>window).selenium;
            this.selenium.browserbot.selectWindow(null);
            this.commandFactory = new (<any>window).CommandHandlerFactory();
            this.commandFactory.registerAll(this.selenium);
        }
        getInterval () {
            return 1;
        }
        addCommandList (commandList: ts.Models.CommandList.Model) {
            commandList.getList().forEach((command) => {
                var selCommand = new (<any>window).Command(command.type, command.target, command.value);
                this.testCase.commands.push(selCommand);
            });
        }
        start () {
            return new Promise((resolve: () => any) => {
                this.currentTest = new (<any>window).IDETestLoop(this.commandFactory, {
                    'testComplete' : resolve
                });
                this.currentTest.getCommandInterval = () => {
                    return this.getInterval();
                };

                this.testCase.debugContext.reset();
                this.currentTest.start();
            });
        }
    }
}
