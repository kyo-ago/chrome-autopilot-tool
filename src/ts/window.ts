/// <reference path="DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="Applications/Controllers/Autopilot.ts" />
/// <reference path="Applications/Services/TabManager.ts" />
/// <reference path="Applications/Services/InjectScripts.ts" />
/// <reference path="Applications/Services/Config.ts" />
/// <reference path="Applications/Services/Selenium/Sender.ts" />

var calledTabId = location.hash.replace(/^#/, '');

var autopilotApp: ng.IModule;
var catchError = (messages: string[]) => {
    alert([].concat(messages).join('\n'));
};
var applicationServicesSeleniumSender: ts.Application.Services.Selenium.Sender;
(new Promise((resolve: (tabManager: ts.Application.Services.TabManager) => any, reject: (errorMessage: string) => any) => {
    new ts.Application.Services.TabManager(calledTabId, (tabManager: ts.Application.Services.TabManager) => {
        var injectScripts = ts.Application.Services.Config.injectScripts;
        return ts.Application.Services.InjectScripts.connect(tabManager.getTabId(), injectScripts);
    }, resolve, reject);
})).then((tabManager: ts.Application.Services.TabManager) => {
    Promise.all([
        new Promise((resolve: () => any, reject: (errorMessage: string) => any) => {
            var file = chrome.runtime.getURL(ts.Application.Services.Config.seleniumApiXML);
            ts.Application.Services.Selenium.Sender.loadFile(file).then(resolve).catch(reject);
        }),
        new Promise((resolve: () => any) => {
            angular.element(document).ready(resolve);
        })
    ]).then(() => {
        autopilotApp = angular.module('AutopilotApp', ['ui.sortable'])
            .factory('tabManager', () => {
                return tabManager;
            })
            .service('messageDispatcher', ts.Application.Models.Message.Dispatcher)
            .factory('seleniumSender', (tabManager: ts.Application.Services.TabManager, messageDispatcher: ts.Application.Models.Message.Dispatcher) => {
                applicationServicesSeleniumSender = new ts.Application.Services.Selenium.Sender(tabManager, messageDispatcher);
                return applicationServicesSeleniumSender;
            })
            .factory('commandList', () => {
                return new ts.Models.CommandList.Model();
            })
            .controller('Autopilot', ts.Application.Controllers.Autopilot.Controller)
        ;
        angular.bootstrap(document, ['AutopilotApp']);
    }).catch(catchError);
}).catch(catchError);
