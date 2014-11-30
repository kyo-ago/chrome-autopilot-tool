module Cat.Application.Models.Message {
    export interface DispatchMap {
        MessageAddCommentModel? : (message: AddComment.Model) => void;
        MessagePlayCommandModel? : (message: PlayCommand.Model) => void;
        MessagePlayCommandListModel? : (message: PlayCommandList.Model) => void;
        MessagePlaySeleniumCommandExecuteModel? : (message: PlaySeleniumCommandExecute.Model) => void;
        MessagePlaySeleniumCommandResultModel? : (message: PlaySeleniumCommandResult.Model) => void;
    }
    export class Dispatcher {
        messageAddCommentModel = new AddComment.Repository();
        messagePlayCommandModel = new PlayCommand.Repository();
        messagePlayCommandListModel = new PlayCommandList.Repository();
        messagePlaySeleniumCommandExecuteModel = new PlaySeleniumCommandExecute.Repository();
        messagePlaySeleniumCommandResultModel = new PlaySeleniumCommandResult.Repository();

        dispatch (message: Object, dispatcher: DispatchMap) {
            if (message['name'] == AddComment.Model.messageName) {
                dispatcher.MessageAddCommentModel(this.messageAddCommentModel.fromObject(message));
            } else if (message['name'] == PlayCommand.Model.messageName) {
                dispatcher.MessagePlayCommandModel(this.messagePlayCommandModel.fromObject(message));
            } else if (message['name'] == PlayCommandList.Model.messageName) {
                dispatcher.MessagePlayCommandListModel(this.messagePlayCommandListModel.fromObject(message));
            } else if (message['name'] == PlaySeleniumCommandExecute.Model.messageName) {
                dispatcher.MessagePlaySeleniumCommandExecuteModel(this.messagePlaySeleniumCommandExecuteModel.fromObject(message));
            } else if (message['name'] == PlaySeleniumCommandResult.Model.messageName) {
                dispatcher.MessagePlaySeleniumCommandResultModel(this.messagePlaySeleniumCommandResultModel.fromObject(message));
            } else {
                throw new Error('Invalid message: ' + JSON.stringify(message));
            }
        }
    }
}