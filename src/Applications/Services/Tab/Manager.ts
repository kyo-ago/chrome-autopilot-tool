module Cat.Application.Services.Tab {
    export class Manager {
        private tab: Model;
        private onMessageListeners: Array<(message: Object) => void> = [];
        private onDisconnectListeners: Array<() => void> = [];
        private onConnectListeners: Array<() => void> = [];

        constructor (
            tab: chrome.tabs.Tab,
            private initialize: (manager: Manager) => Promise<void>
        ) {
            this.tab = new Model(tab);
        }
        private closeMessage = 'Close test case?';
        connect () {
            this.tab.connect();
            this.tab.addListener('onRemoved', () => {
                if (confirm(this.closeMessage)) {
                    window.close();
                }
            });
            this.tab.addListener('onUpdated', () => {
                this.reloadTab();
            });
            return this.initialize(this);
        }
        private reloadTab () {
            var tabId = this.tab.getTabId();
            return new Promise((resolve: () => void, reject: (errorMessage: string) => void) => {
                this.initialize(this).then(() => {
                    chrome.tabs.get(tabId, (tab) => {
                        this.tab = new Model(tab);
                        this.onConnectListeners.forEach(listener => listener());
                        this.onMessageListeners.forEach(listener => this.tab.onMessage(listener));
                        this.onDisconnectListeners.forEach(listener => this.tab.onDisconnect(listener));
                        resolve();
                    });
                }).catch(reject);
            });
        }
        getTabId () {
            return this.tab.getTabId();
        }
        getTabURL () {
            return this.tab.getTabURL();
        }
        postMessage (message: Object) {
            this.tab.postMessage(message);
        }
        sendMessage (message: Object) {
            return this.tab.sendMessage(message);
        }
        onMessage (callback: (message: Object) => void) {
            this.onMessageListeners.push(callback);
            this.tab.onMessage(callback);
        }
        onConnect (callback: () => void) {
            this.onConnectListeners.push(callback);
        }
        onDisconnect (callback: () => void) {
            this.onDisconnectListeners.push(callback);
            this.tab.onDisconnect(callback);
        }
    }
}
