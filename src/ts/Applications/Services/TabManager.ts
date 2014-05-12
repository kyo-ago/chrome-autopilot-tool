/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />

module ts.Application.Services {
    export class TabManager {
        private tab: chrome.tabs.Tab;
        private port: chrome.runtime.Port;
        private initialize: Function = () => {};
        private onMessageListeners: Function[] = [];
        private onDisconnectListeners: Function[] = [];
        private onConnectListeners: Function[] = [];

        constructor (
            calledTabId: string,
            initialize: (tabManager: TabManager) => Promise<any>,
            resolve: (tabManager: TabManager) => any,
            reject: (errorMessage: string) => any
        ) {
            this.initialize = initialize;
            this.getTab(calledTabId).then((tab: chrome.tabs.Tab) => {
                this.tab = tab;
                this.initialize(this).then(() => {
                    this.connectTab();
                    resolve(this);
                }).catch(reject);
            }).catch(reject);
        }
        private getTab (calledTabId: string) {
            return new Promise((resolve: (tab: chrome.tabs.Tab) => any, rejectAll: (errorMessage: string) => any) => {
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
            chrome.tabs.onRemoved.addListener((tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
                if (this.tab.id !== tabId) {
                    return;
                }
                if (confirm(this.closeMessage)) {
                    window.close();
                }
            });
            chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
                if (this.tab.id !== tabId) {
                    return;
                }
                if (changeInfo.status !== 'complete') {
                    return;
                }
                this.reloadTab();
            });
        }
        private reloadTab () {
            return new Promise((resolve: () => any, reject: (errorMessage: string) => any) => {
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
            // chrome.tabs.sendMessageで通信してcallback受け取る
            this.port.postMessage(message);
        }
        onMessage (callback: (message: Object) => any) {
            this.onMessageListeners.push(callback);
            this.port.onMessage.addListener(callback);
        }
        onConnect (callback: () => any) {
            this.onConnectListeners.push(callback);
        }
        onDisconnect (callback: () => any) {
            this.onDisconnectListeners.push(callback);
            this.port.onDisconnect.addListener(callback);
        }
    }
}
