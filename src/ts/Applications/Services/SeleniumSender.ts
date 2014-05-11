/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../Models/CommandList/Model.ts" />
/// <reference path="./TabManager.ts" />

module ts.Application.Services {
    export class SeleniumSender {
        selenium: any;
        commandFactory: any;
        currentTest: any;
        testCase: any;

        constructor (private tabManager: Services.TabManager) {
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
            (<any>window).selenium = new (<any>window).ChromeExtensionBackedSelenium(tabManager.getTabURL(), '');

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
        execute(command: string, args: string[], callback: (response: string, result: boolean) => any) {
            this.tabManager.postMessage({});
            debugger;
        }

        private static errorMessage = 'selenium command xml load failed.\n';
        static loadFile (file: string) {
            return new Promise((resolve: () => any, reject: (errorMessage: string) => any) => {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', file);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    if (xhr.status !== 0 && xhr.status !== 200) {
                        return reject(SeleniumSender.errorMessage + file);
                    }
                    (<any>window).Command.apiDocuments = new Array(xhr.responseXML.documentElement);
                    resolve();
                };
                xhr.send(null);
            });
        }
    }
}
