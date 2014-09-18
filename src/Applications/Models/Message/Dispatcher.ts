/// <reference path="./AddCommand/Repository.ts" />
/// <reference path="./PlayCommand/Repository.ts" />
/// <reference path="./PlayCommandList/Repository.ts" />
/// <reference path="./PlaySeleniumCommandExecute/Repository.ts" />
/// <reference path="./PlaySeleniumCommandResult/Repository.ts" />

module Cat.Application.Models.Message {
    export interface DispatchMap {
        MessageAddCommentModel? : (message: AddComment.Model) => any;
        MessagePlayCommandModel? : (message: PlayCommand.Model) => any;
        MessagePlayCommandListModel? : (message: PlayCommandList.Model) => any;
        MessagePlaySeleniumCommandExecuteModel? : (message: PlaySeleniumCommandExecute.Model) => any;
        MessagePlaySeleniumCommandResultModel? : (message: PlaySeleniumCommandResult.Model) => any;
    }
    export class Dispatcher {
        messageAddCommentModel = new AddComment.Repository();
        messagePlayCommandModel = new PlayCommand.Repository();
        messagePlayCommandListModel = new PlayCommandList.Repository();
        messagePlaySeleniumCommandExecuteModel = new PlaySeleniumCommandExecute.Repository();
        messagePlaySeleniumCommandResultModel = new PlaySeleniumCommandResult.Repository();

        dispatch (message: any, dispatcher: DispatchMap) {
            if (message.name == AddComment.Model.messageName) {
                dispatcher.MessageAddCommentModel && dispatcher.MessageAddCommentModel(this.messageAddCommentModel.fromObject(message));
            } else if (message.name == PlayCommand.Model.messageName) {
                dispatcher.MessagePlayCommandModel && dispatcher.MessagePlayCommandModel(this.messagePlayCommandModel.fromObject(message));
            } else if (message.name == PlayCommandList.Model.messageName) {
                dispatcher.MessagePlayCommandListModel && dispatcher.MessagePlayCommandListModel(this.messagePlayCommandListModel.fromObject(message));
            } else if (message.name == PlaySeleniumCommandExecute.Model.messageName) {
                dispatcher.MessagePlaySeleniumCommandExecuteModel && dispatcher.MessagePlaySeleniumCommandExecuteModel(this.messagePlaySeleniumCommandExecuteModel.fromObject(message));
            } else if (message.name == PlaySeleniumCommandResult.Model.messageName) {
                dispatcher.MessagePlaySeleniumCommandResultModel && dispatcher.MessagePlaySeleniumCommandResultModel(this.messagePlaySeleniumCommandResultModel.fromObject(message));
            } else {
                throw new Error('Invalid message: ' + JSON.stringify(message));
            }
        }
    }
}