var TestInitialize = true;
if ('undefined' === typeof chrome) {
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
        'newTab' : function () {
            return {
                'id' : 1,
                'url' : 'http://example.com',
                'status' : 'complete'
            };
        },
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
        'sendMessage' : function (tabId, message, callback) {
            setTimeout(callback.bind(this, 'OK'));
        },
        'onRemoved' : chromeEvent(),
        'onUpdated' : chromeEvent()
    };
}
