/// <reference path="./AddCommand/Repository.ts" />
/// <reference path="./PlayCommandList/Repository.ts" />

module Message {
    export interface DispatchMap {
        MessageAddCommentModel? : (message: Message.AddComment.Model) => any;
        MessagePlayCommandListModel? : (message: Message.PlayCommandList.Model) => any;
    }
    export class Dispatcher {
        messageAddCommentModel = new Message.AddComment.Repository();
        messagePlayCommandListModel = new Message.PlayCommandList.Repository();

        dispatch (message: any, dispatcher: DispatchMap) {
            if (message.name == Message.AddComment.Model.name) {
                dispatcher.MessageAddCommentModel(this.messageAddCommentModel.fromObject(message));
            } else if (message.name == Message.PlayCommandList.Model.name) {
                dispatcher.MessagePlayCommandListModel(this.messagePlayCommandListModel.fromObject(message));
            }
        }
    }
}