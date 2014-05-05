/// <reference path="../DefinitelyTyped/Selenium/recorder.d.ts" />
/// <reference path="../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../Models/Command/Model.ts" />
/// <reference path="./Services/RecorderObserver.ts" />
/// <reference path="./Models/Message/AddCommand/Repository.ts" />
/// <reference path="./Models/Message/Dispatcher.ts" />

declare module chrome.extension {
    var onConnect: chrome.runtime.ExtensionConnectEvent;
}

// for selenium-runner
(<any>window).getBrowser = function () { return { 'selectedBrowser' : { 'contentWindow' : window } } };
(<any>window).lastWindow = window;

var globalPort;
setInterval(() => {
    // break point(for debugger)
    console.debug(undefined);
}, 3000);

(() => {
    var recorderObserver = new RecorderObserver();
    var messageAddCommentRepository = new Message.AddComment.Repository();
    var messageDispatcher = new Message.Dispatcher();
    var selenium = (<any>window).createSelenium(location.href, true);

    chrome.extension.onConnect.addListener((port: chrome.runtime.Port) => {
        globalPort = port;
        Recorder.register(recorderObserver, window);
        recorderObserver.addCommand = (commandName: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) => {
            var message = {
                'command' : {
                    'type' : commandName,
                    'target' : target,
                    'value' : value
                },
                'insertBeforeLastCommand' : insertBeforeLastCommand
            };
            var addCommentMessage = messageAddCommentRepository.fromObject(message);
            port.postMessage(messageAddCommentRepository.toObject(addCommentMessage));
        };
        port.onMessage.addListener((message: Object) => {
            messageDispatcher.dispatch(message, {
                MessagePlayCommandListModel : (message: Message.PlayCommandList.Model) => {
                    message.commandList
//                    message.commandList
//                    selenium.doType("//*[@id=\"inputtext\"]","aaa");
                }
            });
        });
    });
})();
