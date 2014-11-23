/// <reference path="Tab/InjectScripts.ts" />
/// <reference path="Config.ts" />
/// <reference path="Tab/Manager" />

module Cat.Application.Services {
    export class TabInitializer {
        private injectScripts : Tab.InjectScripts;
        private manager : Tab.Manager;
        constructor (private calledTabId: string) {
            var injectScripts = Config.injectScripts;
            this.injectScripts = new Tab.InjectScripts(injectScripts);
        }
        start () {
            return new Promise((resolve, reject) => {
                this.getTab(this.calledTabId).then((tab: chrome.tabs.Tab) => {
                    this.manager = new Tab.Manager(tab, (manager) => {
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