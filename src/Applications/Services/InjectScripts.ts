/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />

module Cat.Application.Services {
    export class InjectScripts {
        static connect(tabid: number, injectScripts_: string[]) {
            var injectScripts = injectScripts_.slice();
            return new Promise<void>((resolve: () => void) => {
                var executeScript = (injectScript: string) => {
                    //コードをxhrでキャッシュしてfileではなく、codeで渡してユーザ動作をブロックしつつ実行できないか
                    chrome.tabs.executeScript(tabid, {
                        'runAt' : 'document_start',
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
                    if (result && result.length && result[0]) {
                        return resolve();
                    }
                    executeScript(injectScripts.shift());
                });
            });
        }
    }
}
