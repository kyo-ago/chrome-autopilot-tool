/// <reference path="../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="./Controllers/Autopilot.ts" />
/// <reference path="./Services/ChromeTabs.ts" />

var autopilotApp: ng.IModule;
Promise.all([
    new Promise((resolve: (port: chrome.runtime.Port) => any, reject: (message: string) => any) => {
        (new ChromeTabs()).connect().then(resolve).catch(reject);
    }),
    new Promise((resolve: () => any, reject: () => any) => {
        angular.element(document).ready(resolve);
    })
]).then((results: any[]) => {
    var port = <chrome.runtime.Port>results[0];
    autopilotApp = angular.module('AutopilotApp', ['ui.sortable'])
        .factory('chromeTabs', () => {
            return port;
        })
        .service('commandList', CommandList.Model)
        .service('messageManage', Message.Manager)
        .controller('Autopilot', Autopilot.Controller)
    ;
    angular.bootstrap(document, ['AutopilotApp']);
}).catch((messages: string[]) => {
    alert(messages.join('\n'));
});
