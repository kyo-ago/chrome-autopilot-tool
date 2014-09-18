/// <reference path="DefinitelyTyped/chrome/chrome.d.ts" />
(function () {
    if ('undefined' === typeof chrome) {
        return;
    }
    chrome.browserAction.onClicked.addListener(function (calledTab) {
        var createWindow = function () {
            chrome.windows.create({
                'url': '/html/window.html#' + calledTab.id,
                'type': 'panel',
                'focused': false,
                'top': 0,
                'left': 0,
                'height': 500,
                'width': 300
            }, function (win) {
                localStorage['windowId'] = win.id;
            });
        };
        var windowId = localStorage['windowId'] - 0;
        if (!windowId) {
            return createWindow();
        }
        chrome.windows.get(windowId, function (win) {
            if (!win) {
                return createWindow();
            }
            chrome.windows.update(win.id, {
                'focused': true
            });
        });
    });
})();
