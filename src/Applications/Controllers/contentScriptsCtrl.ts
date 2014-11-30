/// <reference path="../Models/SeleniumCommand/Model.ts" />
/// <reference path="../Models/Message/Dispatcher.ts" />
/// <reference path="../Services/RecorderObserver.ts" />
/// <reference path="../Services/Selenium/Receiver.ts" />

module Cat.Application.Controllers {
    export class ContentScriptsCtrl {
        private messagePlaySeleniumCommandResultRepository : Models.Message.PlaySeleniumCommandResult.Repository;
        private messageAddCommentRepository : Models.Message.AddComment.Repository;
        private recorderObserver : Services.RecorderObserver;
        private messageDispatcher : Models.Message.Dispatcher;
        private SeleniumReceiver : Services.Selenium.Receiver;
        constructor (private port: chrome.runtime.Port) {
            this.messagePlaySeleniumCommandResultRepository = new Models.Message.PlaySeleniumCommandResult.Repository();
            this.messageAddCommentRepository = new Models.Message.AddComment.Repository();
            this.recorderObserver = new Services.RecorderObserver();
            this.messageDispatcher = new Models.Message.Dispatcher();
            this.SeleniumReceiver = new Services.Selenium.Receiver();
        }
        onMessage (message: Object, sender: chrome.runtime.MessageSender, sendResponse: (message: Object) => void) {
            this.messageDispatcher.dispatch(message, {
                MessagePlaySeleniumCommandExecuteModel : (message: Models.Message.PlaySeleniumCommandExecute.Model) => {
                    Recorder.deregister(this.recorderObserver, window);
                    var result = this.SeleniumReceiver.execute(message.command);
                    Recorder.register(this.recorderObserver, window);
                    var resultMessage = new Models.Message.PlaySeleniumCommandResult.Model(result);
                    sendResponse(this.messagePlaySeleniumCommandResultRepository.toObject(resultMessage));
                }
            });
        }
        private addCommand(commandName: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) {
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
            var addCommentMessage = this.messageAddCommentRepository.fromObject(message);
            this.port.postMessage(this.messageAddCommentRepository.toObject(addCommentMessage));
        }
        initialize () {
            Recorder.register(this.recorderObserver, window);
            this.recorderObserver.addListener('addCommand', (commandName: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) => {
                this.addCommand(commandName, target, value, window, insertBeforeLastCommand);
            });
            this.port.onDisconnect.addListener(() => {
                Recorder.deregister(this.recorderObserver, window);
            });
            chrome.runtime.onMessage.addListener((message: Object, sender: chrome.runtime.MessageSender, sendResponse: (message: Object) => void) => {
                this.onMessage(message, sender, sendResponse);
            });
        }
    }
}
