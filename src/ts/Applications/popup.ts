/// <reference path="../DefinitelyTyped/chrome/chrome.d.ts" />

interface Storage {
    windowId: string;
}

(() => {
    var createWindow = function () {
        return chrome.windows.create({
            'url': '/src/html/window.html',
            'type': 'panel',
            'focused': false,
            'top': 0,
            'left': 0,
            'height': 500,
            'width': 300
        }, function(win) {
            return localStorage.windowId = win.id+'';
        });
    };
    if (!localStorage.windowId) {
        return createWindow();
    }
    chrome.windows.get(parseInt(localStorage.windowId), (win) => {
        if (!win) {
            return createWindow();
        }
        chrome.windows.update(win.id, {
            'focused': true
        });
    });
})();