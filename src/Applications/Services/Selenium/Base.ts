/// <reference path="../../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />

module Cat.Application.Services.Selenium {
    export class Base {
        selenium: any;
        commandFactory: any;
        currentTest: any;
        testCase: any;
        interval: number = 1;

        constructor (callback: () => void) {
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
            (<any>window).selenium = callback();

            (<any>window).editor = {
                'app' : {
                    'getOptions' : () => {
                        return {
                            'timeout' : this.interval
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
            return this.interval;
        }
        start () {
            return new Promise((resolve: () => void) => {
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

        private static errorMessage = 'selenium command xml load failed.\n';
        static setApiDocs (file: string) {
            return new Promise<void>((resolve: () => void, reject: (errorMessage: string) => void) => {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', file);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    if (xhr.status !== 0 && xhr.status !== 200) {
                        return reject(Base.errorMessage + file);
                    }
                    (<any>window).Command.apiDocuments = new Array(xhr.responseXML.documentElement);
                    resolve();
                };
                xhr.send(null);
            });
        }
    }
}
