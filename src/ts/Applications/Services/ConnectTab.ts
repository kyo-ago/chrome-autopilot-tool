/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />

module ts.Application.Services {
    export class ConnectTab {
        private errorMessage = 'Security Error.\ndoes not run on "chrome://" page.\n';
        connect() {
            return new Promise((resolve: (tabId: number) => any, rejectAll: (errorMessage: string) => any) => {
                var reject = () => {
                    rejectAll(this.errorMessage);
                };
                chrome.tabs.query({
                    'active' : true,
                    'windowType' : 'normal',
                    'lastFocusedWindow' : true
                }, (tabs) => {
                    var tab = tabs[0];
                    if (tab) {
                        chrome.storage.local.set({
                            'lastFocusedWindowId' : tab.windowId,
                            'lastFocusedWindowUrl' : tab.url
                        }); // Ignore callback.
                        return resolve(tab.id);
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
                                var tab = tabs[0];
                                if (tab) {
                                    return resolve(tab.id);
                                }
                                return reject();
                            });
                        });
                    }
                });
            });
        }
    }
}
