module Cat.Application.Services.Tab {
    export class Model extends EventEmitter {
        private port: chrome.runtime.Port;
        private sendMessageResponseInterval = 1000;
        constructor (
            private tab: chrome.tabs.Tab
        ) {
            super();
            this.port = chrome.tabs.connect(this.tab.id);
        }
        getTabId () {
            return this.tab.id;
        }
        getTabURL () {
            return this.tab.url;
        }
        private checkOnUpdated () {
            var updated = false;
            chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
                if (this.tab.id !== tabId) {
                    return;
                }
                this.disconnect();
                if (changeInfo.status === 'complete') {
                    updated = false;
                    return;
                }
                if (updated) {
                    return;
                }
                updated = true;
                this.emit('onUpdated');
            });
        }
        postMessage (message: Object) {
            this.port.postMessage(message);
        }
        sendMessage (message: Object) {
            return new Promise((resolve, reject) => {
                chrome.tabs.sendMessage(this.tab.id, message, (result) => {
                    if (!result) {
                        return reject('missing result');
                    }
                    var success = () => {
                        if (!this.port) {
                            return;
                        }
                        if (this.tab.status !== 'complete') {
                            return;
                        }
                        clearTimeout(timeout);
                        clearInterval(interval);
                        var message = new Models.Message.PlaySeleniumCommandResult.Model(result);
                        resolve(message.command);
                    };
                    var interval = setInterval(success, this.sendMessageResponseInterval);
                    var timeout = setTimeout(() => {
                        clearInterval(interval);
                        return reject('sendMessage timeout');
                    }, this.sendMessageResponseInterval * 10);
                    success();
                });
            });
        }
        connect () {
            this.port.onDisconnect.addListener(() => {
                this.disconnect();
            });
            chrome.tabs.onRemoved.addListener((tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
                if (this.tab.id !== tabId) {
                    return;
                }
                this.emit('onRemoved');
            });
            this.checkOnUpdated();
        }
        onMessage (callback: (message: Object) => void) {
            this.port.onMessage.addListener(callback);
        }
        onDisconnect (callback: () => void) {
            this.port.onDisconnect.addListener(callback);
        }
        disconnect () {
            this.port = null;
            delete this.port;
        }
    }
}
