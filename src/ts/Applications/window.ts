/// <reference path="../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="./Controllers/Autopilot.ts" />
/// <reference path="./Services/ConnectTab.ts" />
/// <reference path="./Services/InjectScripts.ts" />
/// <reference path="./Services/Config.ts" />
/// <reference path="./Services/SeleniumIDE.ts" />

var autopilotApp: ng.IModule;
var catchError = (messages: string[]) => {
    alert([].concat(messages).join('\n'));
};
(new Promise((resolve: (tabId: number) => any, reject: () => any) => {
    (new ts.Application.Services.ConnectTab()).connect().then(resolve).catch(reject);
})).then((tabid: number) => {
    Promise.all([
        new Promise((resolve: () => any, reject: (errorMessage: string) => any) => {
            var file = chrome.runtime.getURL(ts.Application.Services.Config.seleniumApiXML);
            ts.Application.Services.SeleniumIDE.loadFile(file).then(resolve).catch(reject);
        }),
        new Promise((resolve: () => any, reject: (errorMessage: string) => any) => {
            var injectScripts = ts.Application.Services.Config.injectScripts;
            (new ts.Application.Services.InjectScripts()).connect(tabid, injectScripts).then(resolve).catch(reject);
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
                return new ts.Models.CommandList.Model();
            })
            .service('messageDispatcher', ts.Application.Models.Message.Dispatcher)
            .controller('Autopilot', ts.Application.Controllers.Autopilot.Controller)
        ;
        angular.bootstrap(document, ['AutopilotApp']);
    }).catch(catchError);
}).catch(catchError);
