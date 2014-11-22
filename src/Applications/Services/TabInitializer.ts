/// <reference path="Tab/InjectScripts.ts" />
/// <reference path="Config.ts" />
/// <reference path="Tab/TabManager" />

module Cat.Application.Services {
    export class TabInitializer {
        private injectScripts : Tab.InjectScripts;
        private tabManager : Tab.TabManager;
        constructor (private calledTabId: string) {
            var injectScripts = Config.injectScripts;
            this.injectScripts = new Tab.InjectScripts(injectScripts);
            this.tabManager = new Tab.TabManager(this.calledTabId, (tabManager: Tab.TabManager) => {
                return this.injectScripts.connect(tabManager.getTabId());
            });
        }
        start () {
            return this.tabManager.connect();
        }
    }
}
