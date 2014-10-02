/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../Models/Message/PlaySeleniumCommandResult/Repository.ts" />

module Cat.Application.Services {
    export class TabManager {
        private tab: chrome.tabs.Tab;
        private port: chrome.runtime.Port;
        private onMessageListeners: Function[] = [];
        private onDisconnectListeners: Function[] = [];
        private onConnectListeners: Function[] = [];
        private sendMessageResponseInterval = 1000;

        constructor (
            calledTabId: string,
            private initialize: (tabManager: TabManager) => Promise<void>,
            resolve: (tabManager: TabManager) => void,
            reject: (errorMessage: string) => void
        ) {
            this.getTab(calledTabId).then((tab: chrome.tabs.Tab) => {
                this.tab = tab;
                this.initialize(this).then(() => {
                    this.connectTab();
                    resolve(this);
                }).catch(reject);
            }).catch(reject);
        }
        private getTab (calledTabId: string) {
            return new Promise((resolve: (tab: chrome.tabs.Tab) => void, rejectAll: (errorMessage: string) => void) => {
                var reject = () => {
                    rejectAll('Security Error.\ndoes not run on "chrome://" page.\n');
                };
                chrome.tabs.get(parseInt(calledTabId), (tab: chrome.tabs.Tab) => {
                    if (tab && tab.id) {
                        resolve(tab);
                    } else {
                        reject();
                    }
                });
            });
        }
        private closeMessage = 'Close test case?';
        private connectTab () {
            this.port = chrome.tabs.connect(this.tab.id);
            this.port.onDisconnect.addListener(() => {
                this.port = null;
                delete this.port;
            });
            chrome.tabs.onRemoved.addListener((tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
                if (this.tab.id !== tabId) {
                    return;
                }
                if (confirm(this.closeMessage)) {
                    window.close();
                }
            });
            var updated = false;
            chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
                if (this.tab.id !== tabId) {
                    return;
                }
                this.port = null;
                delete this.port;
                if (changeInfo.status === 'complete') {
                    updated = false;
                    return;
                }
                if (updated) {
                    return;
                }
                updated = true;

                this.reloadTab();
            });
        }
        private reloadTab () {
            return new Promise((resolve: () => void, reject: (errorMessage: string) => void) => {
                this.initialize(this).then(() => {
                    this.port = chrome.tabs.connect(this.tab.id);
                    this.onConnectListeners.forEach(listener => listener());
                    this.onMessageListeners.forEach(listener => this.port.onMessage.addListener(listener));
                    this.onDisconnectListeners.forEach(listener => this.port.onDisconnect.addListener(listener));
                    resolve();
                }).catch(reject);
            });
        }
        getTabId () {
            return this.tab.id;
        }
        getTabURL () {
            return this.tab.url;
        }
        postMessage (message: Object) {
            this.port.postMessage(message);
        }
        sendMessage (message: Object, callback: (message: Object) => void) {
            chrome.tabs.sendMessage(this.tab.id, message, (result) => {
                if (!result) {
                    throw new Error('missing result');
                    return;
                }
                var interval = setInterval(() => {
                    if (!this.port) {
                        return;
                    }
                    if (this.tab.status !== 'complete') {
                        return;
                    }
                    clearInterval(interval);
                    var message = new Models.Message.PlaySeleniumCommandResult.Model(result);
                    callback(message.command);
                }, this.sendMessageResponseInterval);
            });
        }
        onMessage (callback: (message: Object) => void) {
            this.onMessageListeners.push(callback);
            this.port.onMessage.addListener(callback);
        }
        onConnect (callback: () => void) {
            this.onConnectListeners.push(callback);
        }
        onDisconnect (callback: () => void) {
            this.onDisconnectListeners.push(callback);
            this.port.onDisconnect.addListener(callback);
        }
    }
}
