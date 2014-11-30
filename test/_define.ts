declare module chrome.tabs {
    export function newTab() : chrome.tabs.Tab;
}
var sinonBox = sinon.sandbox.create();
sinonBox.useFakeTimers();
((sinonRestore) => {
    afterEach(sinonRestore);
    after(sinonRestore);
})(sinonBox.restore.bind(sinonBox));
