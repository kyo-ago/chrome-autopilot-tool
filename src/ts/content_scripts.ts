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
    var messagePlaySeleniumCommandResultRepository = new ts.Application.Models.Message.PlaySeleniumCommandResult.Repository();
    var messageAddCommentRepository = new ts.Application.Models.Message.AddComment.Repository();
    var recorderObserver = new ts.Application.Services.RecorderObserver();
    var messageDispatcher = new ts.Application.Models.Message.Dispatcher();
    var SeleniumReceiver = new ts.Application.Services.Selenium.Receiver();

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
        port.onMessage.addListener((message: Object) => {
            messageDispatcher.dispatch(message, {
                MessagePlaySeleniumCommandExecuteModel : (message: ts.Application.Models.Message.PlaySeleniumCommandExecute.Model) => {
                    Recorder.deregister(recorderObserver, window);
                    var result = SeleniumReceiver.execute(message.command);
                    Recorder.register(recorderObserver, window);
                    var resultMessage = new ts.Application.Models.Message.PlaySeleniumCommandResult.Model(result);
                    port.postMessage(messagePlaySeleniumCommandResultRepository.toObject(resultMessage));
                }
            });
        });
        port.onDisconnect.addListener(() => {
            Recorder.deregister(recorderObserver, window);
        });
    });
})();
