module Cat.Application.Services.Tab {
    export class InjectScripts {
        private injectScripts : string[];
        constructor (private injectScripts_) {
            this.injectScripts = injectScripts_.slice();
        }
        // set double loading flag.
        private executeEnd (tabid: number, resolve: () => void) {
            chrome.tabs.executeScript(tabid, {
                'code' : 'this.extensionContentLoaded = true'
            }, resolve);
        }
        private executeScript (tabid: number, injectScript: string) {
            return new Promise((resolve) => {
                //コードをxhrでキャッシュしてfileではなく、codeで渡してユーザ動作をブロックしつつ実行できないか
                chrome.tabs.executeScript(tabid, {
                    'runAt' : 'document_start',
                    'file' : injectScript
                }, () => {
                    if (this.injectScripts.length) {
                        return this.executeScript(tabid, this.injectScripts.shift()).then(resolve);
                    }
                    this.executeEnd(tabid, resolve);
                });
            });
        }
        connect(tabid: number) {
            return new Promise<void>((resolve: () => void) => {
                // double loading check.
                chrome.tabs.executeScript(tabid, {
                    'code' : 'this.extensionContentLoaded'
                }, (result: any[]) => {
                    if (result && result.length && result[0]) {
                        return resolve();
                    }
                    this.executeScript(tabid, this.injectScripts.shift()).then(resolve);
                });
            });
        }
    }
}
