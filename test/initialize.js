var TestInitialize = true;
if (!this.chrome) {
    var chrome = {};
}
var chromeEvent = function () {
    return {
        'addListener' : function () {},
        'removeListener' : function () {}
    };
};
if (!chrome.tabs) {
    chrome.tabs = {
        'get' : function (tabId, callback) {
            setTimeout(callback.bind(this, {'id' : 1}));
        },
        'executeScript' : function (tabid, param, callback) {
            setTimeout(callback);
        },
        'connect' : function () {
            return {
                'postMessage' : function () {},
                'onMessage' : chromeEvent(),
                'onDisconnect' : chromeEvent()
            };
        },
        'onRemoved' : chromeEvent(),
        'onUpdated' : chromeEvent()
    };
}
