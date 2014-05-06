/// <reference path="../DefinitelyTyped/Selenium/recorder.d.ts" />
/// <reference path="../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../Models/Command/Model.ts" />
/// <reference path="./Models/Message/AddCommand/Repository.ts" />
/// <reference path="./Models/Message/Dispatcher.ts" />
/// <reference path="./Services/RecorderObserver.ts" />
/// <reference path="./Services/SeleniumIDE.ts" />

declare module chrome.extension {
    var onConnect: chrome.runtime.ExtensionConnectEvent;
}

var globalPort;
setInterval(() => {
    // break point(for debugger)
    console.debug(undefined);
}, 3000);

(() => {
    var recorderObserver = new ts.Application.Services.RecorderObserver();
    var messageAddCommentRepository = new ts.Application.Models.Message.AddComment.Repository();
    var messageDispatcher = new ts.Application.Models.Message.Dispatcher();
    var seleniumIDE = new ts.Application.Services.SeleniumIDE();

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
                MessagePlayCommandListModel : (message: ts.Application.Models.Message.PlayCommandList.Model) => {
                    seleniumIDE.addComment(message.commandList);
                    seleniumIDE.start();
                }
            });
        });
    });
})();
