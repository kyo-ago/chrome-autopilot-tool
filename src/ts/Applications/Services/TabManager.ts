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
            initialize: (tabManager: TabManager) => Promise<any>,
            resolve: (tabManager: TabManager) => any,
            reject: (errorMessage: string) => any
        ) {
            this.initialize = initialize;
            this.getTab().then(() => {
                this.initialize(this).then(() => {
                    this.connectTab();
                    resolve(this);
                }).catch(reject);
            }).catch(reject);
        }
        private getTab () {
            return new Promise((resolve: () => any, rejectAll: (errorMessage: string) => any) => {
                var reject = () => {
                    rejectAll('Security Error.\ndoes not run on "chrome://" page.\n');
                };
                chrome.tabs.query({
                    'active' : true,
                    'windowType' : 'normal',
                    'lastFocusedWindow' : true
                }, (tabs) => {
                    this.tab = tabs[0];
                    if (this.tab && this.tab.id) {
                        chrome.storage.local.set({
                            'lastFocusedWindowId' : this.tab.windowId,
                            'lastFocusedWindowUrl' : this.tab.url
                        }); // Ignore callback.
                        resolve();
                        return;
                    }
                    chrome.storage.local.get(['lastFocusedWindowId', 'lastFocusedWindowUrl'], (lastFocusedWindow: Object) => {
                        if (!lastFocusedWindow['lastFocusedWindowId']) {
                            return reject();
                        }
                        chrome.tabs.query({
                            'active' : true,
                            'url' : lastFocusedWindow['lastFocusedWindowUrl'],
                            'windowId': lastFocusedWindow['lastFocusedWindowId']
                        }, (tabs) => {
                            this.tab = tabs[0];
                            if (this.tab) {
                                return resolve();
                            }
                            return reject();
                        });
                    });
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
