/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />

class InjectScripts {
    connect(tabid: number, injectScripts_: string[]) {
        var injectScripts = injectScripts_.slice();
        return new Promise((resolve: () => any) => {
            var executeScript = (injectScript: string) => {
                chrome.tabs.executeScript(tabid, {
                    'file' : injectScript
                }, () => {
                    if (injectScripts.length) {
                        return executeScript(injectScripts.shift());
                    }
                    chrome.tabs.executeScript(tabid, {
                        'code' : 'this.extensionContentLoaded = true'
                    }, () => {
                        resolve();
                    });
                });
            };
            chrome.tabs.executeScript(tabid, {
                'code' : 'this.extensionContentLoaded'
            }, (result: any[]) => {
//                if (result && result.length && result[0]) {
//                    return resolve();
//                }
                executeScript(injectScripts.shift());
            });
        });
    }
}