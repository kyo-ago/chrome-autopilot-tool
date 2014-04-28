/// <reference path="../../DefinitelyTyped/EventEmitter2/EventEmitter2.d.ts" />
/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />

class ChromeTabs {
    private ee: EventEmitter2 = new EventEmitter2();
    connect () {
        this.ee = new EventEmitter2();
        return new Promise((resolve, reject) => {
            chrome.tabs.query({
                'active': true,
                'windowType': 'normal'
            }, (tabs) => {
                var tab = tabs[0];
                if (tab.url.match(/^chrome:/)) {
                    return reject('Security Error.\ndoes not run on "chrome://" page.');
                }
                var port = <any>chrome.tabs.connect(tab.id, {
                    'name' : 'open'
                });
                port.onMessage.addListener((msg: any) => {
                    this.ee.emit('message', msg);
                });
                resolve((callback : (msg: any) => any) => {
                    this.ee.addListener('message', callback);
                });
            });
        });
    }
}