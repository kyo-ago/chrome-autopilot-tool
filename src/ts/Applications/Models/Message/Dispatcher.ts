/// <reference path="./AddCommand/Repository.ts" />
/// <reference path="./PlayCommandList/Repository.ts" />

module ts.Application.Models.Message {
    export interface DispatchMap {
        MessageAddCommentModel? : (message: AddComment.Model) => any;
        MessagePlayCommandListModel? : (message: PlayCommandList.Model) => any;
    }
    export class Dispatcher {
        messageAddCommentModel = new AddComment.Repository();
        messagePlayCommandListModel = new PlayCommandList.Repository();

        dispatch (message: any, dispatcher: DispatchMap) {
            if (message.name == AddComment.Model.messageName) {
                dispatcher.MessageAddCommentModel(this.messageAddCommentModel.fromObject(message));
            } else if (message.name == PlayCommandList.Model.messageName) {
                dispatcher.MessagePlayCommandListModel(this.messagePlayCommandListModel.fromObject(message));
            }
        }
    }
}