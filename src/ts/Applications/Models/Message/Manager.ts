/// <reference path="./AddCommand/Repository.ts" />

module Message {
    export interface Dispatcher {
        MessageAddCommentModel : (message: Message.AddComment.Model) => any;
    }
    export class Manager {
        messageAddCommentModel = new Message.AddComment.Repository();

        dispatch (message: any, dispatcher: Dispatcher) {
            if (message.name == Message.AddComment.Model.name) {
                dispatcher.MessageAddCommentModel(this.messageAddCommentModel.fromObject(message));
            }
        }
    }
}