/// <reference path="../DefinitelyTyped/Selenium/recorder.d.ts" />
/// <reference path="../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../Models/Command/Model.ts" />
/// <reference path="./Models/SeleniumCommand/Model.ts" />
/// <reference path="./Models/Message/Dispatcher.ts" />
/// <reference path="./Services/RecorderObserver.ts" />
/// <reference path="./Services/Selenium/Receiver.ts" />

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
    var SeleniumReceiver = new ts.Application.Services.Selenium.Receiver();

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
                MessagePlaySeleniumCommandExecuteModel : (message: ts.Application.Models.Message.PlaySeleniumCommandExecute.Model) => {
                    Recorder.deregister(recorderObserver, window);
                    SeleniumReceiver.execute(message.command);
                    SeleniumReceiver.start().then(() => {
                        Recorder.register(recorderObserver, window);
                    });
                }
            });
        });
        port.onDisconnect.addListener(() => {
            Recorder.deregister(recorderObserver, window);
        });
    });
})();
