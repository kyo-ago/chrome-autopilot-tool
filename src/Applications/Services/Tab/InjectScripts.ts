module Cat.Application.Services.Tab {
    export class InjectScripts {
        private injectScript : string;
        constructor (private fileLoader) {
            this.injectScript = fileLoader.getCode();
        }
        // set double loading flag.
        private executeEnd (tabid: number, resolve: () => void) {
            chrome.tabs.executeScript(tabid, {
                'code' : 'this.extensionContentLoaded = true;'
            }, resolve);
        }
        private executeScript (tabid: number) {
            return new Promise((resolve) => {
                chrome.tabs.executeScript(tabid, {
                    'runAt' : 'document_start',
                    'code' : this.injectScript
                }, () => this.executeEnd(tabid, resolve));
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
                    this.executeScript(tabid).then(resolve);
                });
            });
        }
    }
}
