/// <reference path="_loadtsd.ts" />
/// <reference path="Applications/Controllers/Autopilot.ts" />
/// <reference path="Applications/Services/TabManager.ts" />
/// <reference path="Applications/Services/InjectScripts.ts" />
/// <reference path="Applications/Services/Config.ts" />
/// <reference path="Applications/Services/Selenium/Sender.ts" />
/// <reference path="Applications/Models/CommandGrid/Model.ts" />

var autopilotApp: ng.IModule;
var applicationServicesSeleniumSender: Cat.Application.Services.Selenium.Sender;
(() => {
    if ('undefined' === typeof chrome) {
        return;
    }
    var calledTabId = location.hash.replace(/^#/, '');
    var catchError = (messages: string[]) => {
        alert([].concat(messages).join('\n'));
    };
    (new Promise<Cat.Application.Services.TabManager>((resolve: (tabManager: Cat.Application.Services.TabManager) => void, reject: (errorMessage: string) => void) => {
        new Cat.Application.Services.TabManager(calledTabId, (tabManager: Cat.Application.Services.TabManager) => {
            var injectScripts = Cat.Application.Services.Config.injectScripts;
            return Cat.Application.Services.InjectScripts.connect(tabManager.getTabId(), injectScripts);
        }, resolve, reject);
    })).then((tabManager: Cat.Application.Services.TabManager) => {
        var commandSelectList = new Cat.Application.Services.CommandSelectList();
        var seleniumApiXMLFile = chrome.runtime.getURL(Cat.Application.Services.Config.seleniumApiXML);
        Promise.all<void>([
            new Promise<void>((resolve: () => void, reject: (errorMessage: string) => void) => {
                Cat.Application.Services.Selenium.Sender.setApiDocs(seleniumApiXMLFile).then(resolve).catch(reject);
            }),
            new Promise<void>((resolve: () => void, reject: (errorMessage: string) => void) => {
                commandSelectList.load(seleniumApiXMLFile).then(resolve).catch(reject);
            }),
            new Promise<void>((resolve: () => void) => {
                angular.element(document).ready(resolve);
            })
        ]).then(() => {
            autopilotApp = angular.module('AutopilotApp', ['ui.sortable'])
                .factory('tabManager', () => {
                    return tabManager;
                })
                .factory('commandSelectList', () => {
                    return commandSelectList;
                })
                .service('messageDispatcher', Cat.Application.Models.Message.Dispatcher)
                .factory('seleniumSender', (tabManager: Cat.Application.Services.TabManager, messageDispatcher: Cat.Application.Models.Message.Dispatcher) => {
                    applicationServicesSeleniumSender = new Cat.Application.Services.Selenium.Sender(tabManager, messageDispatcher);
                    return applicationServicesSeleniumSender;
                })
                .factory('commandGrid', () => {
                    return new Cat.Application.Models.CommandGrid.Model();
                })
                .controller('Autopilot', Cat.Application.Controllers.Autopilot.Controller)
            ;
            angular.bootstrap(document, ['AutopilotApp']);
        }).catch(catchError);
    }).catch(catchError);
})();
