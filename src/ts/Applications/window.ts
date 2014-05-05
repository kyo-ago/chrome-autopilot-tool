/// <reference path="../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="./Controllers/Autopilot.ts" />
/// <reference path="./Services/ConnectTab.ts" />
/// <reference path="./Services/InjectScripts.ts" />
/// <reference path="./Services/Config.ts" />
/// <reference path="./Services/LoadSeleniumCommandXML.ts" />

var autopilotApp: ng.IModule;
var catchError = (messages: string[]) => {
    alert([].concat(messages).join('\n'));
};
(new Promise((resolve: (tabId: number) => any, reject: () => any) => {
    (new ConnectTab()).connect().then(resolve).catch(reject);
})).then((tabid: number) => {
    Promise.all([
        new Promise((resolve: () => any, reject: (errorMessage: string) => any) => {
            (new LoadSeleniumCommandXML()).loadFile(Config.seleniumApiXML).then(resolve).catch(reject);
        }),
        new Promise((resolve: () => any, reject: (errorMessage: string) => any) => {
            (new InjectScripts()).connect(tabid, Config.injectScripts).then(resolve).catch(reject);
        }),
        new Promise((resolve: () => any) => {
            angular.element(document).ready(resolve);
        })
    ]).then(() => {
        autopilotApp = angular.module('AutopilotApp', ['ui.sortable'])
            .factory('connectTab', () => {
                return chrome.tabs.connect(tabid);
            })
            .factory('commandList', () => {
                return new Models.CommandList.Model();
            })
            .service('messageDispatcher', Message.Dispatcher)
            .controller('Autopilot', Autopilot.Controller)
        ;
        angular.bootstrap(document, ['AutopilotApp']);
    }).catch(catchError);
}).catch(catchError);
