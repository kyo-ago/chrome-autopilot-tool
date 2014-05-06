/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />

module ts.Application.Services {
    export class SeleniumIDE {
        selenium: any;
        commandFactory: any;
        currentTest: any;
        testCase: any;
        constructor () {
            // for selenium-runner
            (<any>window).getBrowser = function () { return { 'selectedBrowser' : { 'contentWindow' : window } } };
            (<any>window).lastWindow = window;
            (<any>window).testCase = new (<any>window).TestCase;
            (<any>window).selenium = (<any>window).createSelenium(location.href, true);

            this.testCase = (<any>window).testCase;
            this.selenium = (<any>window).selenium;

            this.selenium.browserbot.selectWindow(null);
            this.commandFactory = new (<any>window).CommandHandlerFactory();
            this.commandFactory.registerAll(this.selenium);
        }
        getInterval () {
            return 1;
        }
        start () {
            this.currentTest = new (<any>window).IDETestLoop(this.commandFactory, {});
            this.currentTest.getCommandInterval = () => {
                return this.getInterval();
            };

            this.testCase.debugContext.reset();
            this.currentTest.start();
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
                        return reject(SeleniumIDE.errorMessage + file);
                    }
                    (<any>window).Command.apiDocuments = new Array(xhr.responseXML.documentElement);
                    resolve();
                };
                xhr.send(null);
            });
        }
    }
}
