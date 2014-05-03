/// <reference path="../DefinitelyTyped/Selenium/recorder.d.ts" />
/// <reference path="../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../Models/Command/Model.ts" />
/// <reference path="./Services/RecorderObserver.ts" />
/// <reference path="./Models/Message/AddCommand/Repository.ts" />

declare module chrome.extension {
    var onConnect: chrome.runtime.ExtensionConnectEvent;
}

(() => {
    var observer = new RecorderObserver();
    var messageAddCommentRepository = new Message.AddComment.Repository();
    chrome.extension.onConnect.addListener((port: chrome.runtime.Port) => {
        Recorder.register(observer, window);
        observer.addCommand = (commandName: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) => {
            var addCommentMessage = messageAddCommentRepository.fromObject({
                'command' : {
                    'type' : commandName,
                    'target' : target,
                    'value' : value
                },
                'insertBeforeLastCommand' : insertBeforeLastCommand
            });
            port.postMessage(messageAddCommentRepository.toObject(addCommentMessage));
            port.onMessage.addListener((a,b) => {
            });
        };
    });
})();

/*
 (<any>window).getBrowser = function () { return { 'selectedBrowser' : { 'contentWindow' : window } } };
 (<any>window).lastWindow = window;
 var aaa = createSelenium(location.href, true);
 aaa.doType("//*[@id=\"inputtext\"]","aaa")
 * */