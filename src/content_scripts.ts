/// <reference path="_define.ts" />

var globalPort: chrome.runtime.Port;
declare var Cat;
(() => {
    if ('undefined' !== typeof TestInitialize) {
        return;
    }
    chrome.extension.onConnect.addListener((port: chrome.runtime.Port) => {
        globalPort = port;
        var contentScriptsCtrl = new Cat.Application.Controllers.ContentScriptsCtrl(port);
        contentScriptsCtrl.initialize();
        window.onunload = () => {
            port = null;
        }
    });
})();
