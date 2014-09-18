/// <reference path="../../../Models/CommandList/Model.ts" />
/// <reference path="../../Models/Message/PlaySeleniumCommandExecute/Repository.ts" />
/// <reference path="../../Models/Message/Dispatcher.ts" />
/// <reference path="../TabManager.ts" />
/// <reference path="./Base.ts" />

module Cat.Application.Services.Selenium {
    export class Sender extends Base {
        private messagePlaySeleniumCommandExecuteRepository = new Models.Message.PlaySeleniumCommandExecute.Repository();
        constructor (private tabManager: Services.TabManager, private messageDispatcher: Cat.Application.Models.Message.Dispatcher) {
            super(() => new (<any>window).ChromeExtensionBackedSelenium(tabManager.getTabURL(), ''));
            (<any>window).shouldAbortCurrentCommand = () => false;
            tabManager.onConnect(() => {
                (<any>window).shouldAbortCurrentCommand = () => false;
            });
            tabManager.onDisconnect(() => {
                (<any>window).shouldAbortCurrentCommand = () => false;
            });
        }
        addCommandList (commandList: Cat.Models.CommandList.Model) {
            this.testCase.commands = [];
            commandList.getList().forEach((command) => {
                var selCommand = new (<any>window).Command(command.type, command.target, command.value);
                this.testCase.commands.push(selCommand);
            });
        }
        execute(command: string, args: string[], callback: (response: string, result: boolean) => any) {
            var model = new Models.SeleniumCommand.Model(command, args);
            var message = new Models.Message.PlaySeleniumCommandExecute.Model(model);
            this.tabManager.sendMessage(this.messagePlaySeleniumCommandExecuteRepository.toObject(message), (message) => {
                this.messageDispatcher.dispatch(message, {
                    MessagePlaySeleniumCommandResultModel : (message: Models.Message.PlaySeleniumCommandResult.Model) => callback('OK', true)
                });
            });
        }
    }
}