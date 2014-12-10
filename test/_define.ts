declare module chrome.tabs {
    export function newTab() : chrome.tabs.Tab;
}
var sinonBox = sinon.sandbox.create();
beforeEach(() => {
    sinonBox.useFakeServer();
    sinonBox.server.autoRespond = true;
    sinonBox.server.autoRespondAfter = 0;
});
afterEach(sinonBox.restore.bind(sinonBox));
