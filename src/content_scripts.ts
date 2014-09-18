/// <reference path="DefinitelyTyped/Selenium/recorder.d.ts" />
/// <reference path="DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="Models/Command/Model.ts" />
/// <reference path="Applications/Models/SeleniumCommand/Model.ts" />
/// <reference path="Applications/Models/Message/Dispatcher.ts" />
/// <reference path="Applications/Services/RecorderObserver.ts" />
/// <reference path="Applications/Services/Selenium/Receiver.ts" />

declare module chrome.extension {
    var onConnect: chrome.runtime.ExtensionConnectEvent;
}

var globalPort: chrome.runtime.Port;
(() => {
    if ('undefined' === typeof chrome) {
        return;
    }
    var messagePlaySeleniumCommandResultRepository = new Cat.Application.Models.Message.PlaySeleniumCommandResult.Repository();
    var messageAddCommentRepository = new Cat.Application.Models.Message.AddComment.Repository();
    var recorderObserver = new Cat.Application.Services.RecorderObserver();
    var messageDispatcher = new Cat.Application.Models.Message.Dispatcher();
    var SeleniumReceiver = new Cat.Application.Services.Selenium.Receiver();

    chrome.extension.onConnect.addListener((port: chrome.runtime.Port) => {
        globalPort = port;
        Recorder.register(recorderObserver, window);
        recorderObserver.addCommand = (commandName: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) => {
            var message = {
                'content' : {
                    'command' : {
                        'type' : commandName,
                        'target' : target,
                        'value' : value
                    },
                    'insertBeforeLastCommand' : insertBeforeLastCommand
                }
            };
            var addCommentMessage = messageAddCommentRepository.fromObject(message);
            port.postMessage(messageAddCommentRepository.toObject(addCommentMessage));
        };
        chrome.runtime.onMessage.addListener((message: Object, sender: chrome.runtime.MessageSender, sendResponse: (message: Object) => any) => {
            messageDispatcher.dispatch(message, {
                MessagePlaySeleniumCommandExecuteModel : (message: Cat.Application.Models.Message.PlaySeleniumCommandExecute.Model) => {
                    Recorder.deregister(recorderObserver, window);
                    var result = SeleniumReceiver.execute(message.command);
                    Recorder.register(recorderObserver, window);
                    var resultMessage = new Cat.Application.Models.Message.PlaySeleniumCommandResult.Model(result);
                    sendResponse(messagePlaySeleniumCommandResultRepository.toObject(resultMessage));
                }
            });
        });
        port.onDisconnect.addListener(() => {
            Recorder.deregister(recorderObserver, window);
        });
        window.onunload = () => {
            port = null;
        }
    });
})();
