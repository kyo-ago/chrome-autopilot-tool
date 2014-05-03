/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />

declare module chrome.tabs {
    export function connect(tabId: number, connectInfo?: ConnectInfo): chrome.runtime.Port;
}

class ChromeTabs {
    private errorMessage = 'Security Error.\ndoes not run on "chrome://" page.\n';
    connect() {
        return new Promise((resolve: (port: chrome.runtime.Port) => any, reject: (message: string) => any) => {
            chrome.tabs.query({
                'active': true,
                'windowType': 'normal'
            }, (tabs) => {
                var tab = tabs[0];
                if (tab.url.match(/^chrome:/)) {
                    return reject(this.errorMessage);
                }
                var port = <any>chrome.tabs.connect(tab.id);
                resolve(port);
            });
        });
    }
}