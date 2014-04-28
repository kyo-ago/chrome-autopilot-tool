/// <reference path="../DefinitelyTyped/Selenium/recorder.d.ts" />
/// <reference path="../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../Models/Command/Model.ts" />
/// <reference path="./Models/Observer.ts" />
/// <reference path="./Models/AddCommentMessage/Repository.ts" />

declare module chrome.extension {
    var onConnect: chrome.runtime.ExtensionConnectEvent;
}

(() => {
    var observer = new Observer();
    chrome.extension.onConnect.addListener((port: chrome.runtime.Port) => {
        if (port.name !== 'open') {
            return;
        }
        Recorder.register(observer, window);
        observer.addCommand = (commandName: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) => {
            var command = new Command.Model(commandName, target, value);
            port.postMessage(AddCommentMessage.Repository.toMessage(command, insertBeforeLastCommand));
        };
    });
})();
