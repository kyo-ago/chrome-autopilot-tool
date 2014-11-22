module Cat.Application.Services.Tab {
    export class InjectScripts {
        private injectScripts : string[];
        constructor (private injectScripts_) {
            this.injectScripts = injectScripts_.slice();
        }
        connect(tabid: number) {
            return new Promise<void>((resolve: () => void) => {
                var executeScript = (injectScript: string) => {
                    //コードをxhrでキャッシュしてfileではなく、codeで渡してユーザ動作をブロックしつつ実行できないか
                    chrome.tabs.executeScript(tabid, {
                        'runAt' : 'document_start',
                        'file' : injectScript
                    }, () => {
                        if (this.injectScripts.length) {
                            return executeScript(this.injectScripts.shift());
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
                    executeScript(this.injectScripts.shift());
                });
            });
        }
    }
}
