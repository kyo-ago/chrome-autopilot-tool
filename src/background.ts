/// <reference path="_loadtsd.ts" />
(() => {
    if ('undefined' !== typeof TestInitialize) {
        return;
    }
    chrome.browserAction.onClicked.addListener((calledTab: chrome.tabs.Tab) => {
        var createWindow = () => {
            chrome.windows.create({
                'url': '/html/window.html#' + calledTab.id,
                'type': 'panel',
                'focused': false,
                'top': 0,
                'left': 0,
                'height': 500,
                'width': 300
            }, (win) => {
                localStorage['windowId'] = win.id
            });
        };
        var windowId = localStorage['windowId'] - 0;
        if (!windowId) {
            return createWindow();
        }
        chrome.windows.get(windowId, (win) => {
            if (!win) {
                return createWindow();
            }
            chrome.windows.update(win.id, {
                'focused': true
            });
        });
    });
})();