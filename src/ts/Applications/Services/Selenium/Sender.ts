/// <reference path="../../../Models/CommandList/Model.ts" />
/// <reference path="../../Models/Message/PlaySeleniumCommandExecute/Repository.ts" />
/// <reference path="../../Models/Message/Dispatcher.ts" />
/// <reference path="../TabManager.ts" />
/// <reference path="./Base.ts" />

module ts.Application.Services.Selenium {
    export class Sender extends Base {
        private messagePlaySeleniumCommandExecuteRepository = new Models.Message.PlaySeleniumCommandExecute.Repository();
        constructor (private tabManager: Services.TabManager, private messageDispatcher: ts.Application.Models.Message.Dispatcher) {
            super(() => new (<any>window).ChromeExtensionBackedSelenium(tabManager.getTabURL(), ''))
        }
        addCommandList (commandList: ts.Models.CommandList.Model) {
            commandList.getList().forEach((command) => {
                var selCommand = new (<any>window).Command(command.type, command.target, command.value);
                this.testCase.commands.push(selCommand);
            });
        }
        execute(command: string, args: string[], callback: (response: string, result: boolean) => any) {
            var model = new Models.SeleniumCommand.Model(command, args);
            var message = new Models.Message.PlaySeleniumCommandExecute.Model(model);
            this.tabManager.postMessage(this.messagePlaySeleniumCommandExecuteRepository.toObject(message));
            this.tabManager.onMessage((message: Object) => {
                this.messageDispatcher.dispatch(message, {
                    MessagePlaySeleniumCommandResultModel : (message: Models.Message.PlaySeleniumCommandResult.Model) => callback('OK', true)
                });
            });
        }
    }
}
