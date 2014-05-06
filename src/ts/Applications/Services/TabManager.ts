/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />

module ts.Application.Services {
    export class TabManager {
        private tab: chrome.tabs.Tab;
        private port: chrome.runtime.Port;
        constructor (resolveAll: (tabManager: TabManager) => any, rejectAll: (errorMessage: string) => any) {
            var resolve = () => {
                resolveAll(this);
            };
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
                    return resolve();
                } else {
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
                }
            });
        }
        connect () {
            this.port = chrome.tabs.connect(this.tab.id);
        }
        getTabId () {
            return this.tab.id;
        }
        postMessage (message: Object) {
            this.port.postMessage(message);
        }
        onMessage (callback: (message: Object) => any) {
            this.port.onMessage.addListener(callback);
        }
    }
}
