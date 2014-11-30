module Cat.Application.Services.Tab {
    export class Initializer {
        private injectScripts : InjectScripts;
        private manager : Manager;
        constructor (private calledTabId: string) {
            var injectScripts = Config.injectScripts;
            this.injectScripts = new InjectScripts(injectScripts);
        }
        start () {
            return new Promise((resolve, reject) => {
                this.getTab(this.calledTabId).then((tab: chrome.tabs.Tab) => {
                    this.manager = new Manager(tab, (manager) => {
                        return this.injectScripts.connect(manager.getTabId());
                    });
                    this.manager.connect().then(() => resolve(this.manager));
                }).catch(reject);
            });
        }
        private getTab (calledTabId: string) {
            return new Promise((resolve: (tab: chrome.tabs.Tab) => void, reject: (errorMessage: string) => void) => {
                chrome.tabs.get(parseInt(calledTabId), (tab: chrome.tabs.Tab) => {
                    if (tab && tab.id) {
                        resolve(tab);
                    } else {
                        reject('Security Error.\ndoes not run on "chrome://" page.\n');
                    }
                });
            });
        }
    }
}
