window.EventEmitter = window.EventEmitter2;
/// <reference path="_loadtsd.ts" />
var globalPort;
(function () {
    if ('undefined' !== typeof TestInitialize) {
        return;
    }
    chrome.extension.onConnect.addListener(function (port) {
        globalPort = port;
        var contentScriptsCtrl = new Cat.Application.Controllers.ContentScriptsCtrl(port);
        contentScriptsCtrl.initialize();
        window.onunload = function () {
            port = null;
        };
    });
})();
