/// <reference path="_loadtsd.ts" />
/// <reference path="Applications/Controllers/ContentScriptsCtrl.ts" />

var globalPort: chrome.runtime.Port;
(() => {
    if ('undefined' !== typeof TestInitialize) {
        return;
    }
    chrome.extension.onConnect.addListener((port: chrome.runtime.Port) => {
        globalPort = port;
        var contentScriptsCtrl = new Cat.Application.Controllers.ContentScriptsCtrl(port);
        contentScriptsCtrl.initialize();
        chrome.runtime.onMessage.addListener((message: Object, sender: chrome.runtime.MessageSender, sendResponse: (message: Object) => void) => {
            contentScriptsCtrl.onMessage(message, sender, sendResponse);
        });
        window.onunload = () => {
            port = null;
        }
    });
})();
