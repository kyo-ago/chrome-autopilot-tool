chrome.browserAction.onClicked.addListener(function (calledTab) {
    var createWindow = function () {
        chrome.windows.create({
            'url': '/src/html/window.html#' + calledTab.id,
            'type': 'panel',
            'focused': false,
            'top': 0,
            'left': 0,
            'height': 500,
            'width': 300
        }, function (win) {
            localStorage['windowId'] = win.id;
            if (!win.tabs || !win.tabs.length) {
                return;
            }
            var postCalledTabId = function (tab) {
                if (tab.status === 'complete') {
                    chrome.tabs.connect(tab.id, {
                        'name': calledTab.id + ''
                    });
                    return;
                }
                setTimeout(function () {
                    return postCalledTabId(tab);
                }, 100);
            };
            win.tabs.forEach(function (tab) {
                return postCalledTabId(tab);
            });
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
