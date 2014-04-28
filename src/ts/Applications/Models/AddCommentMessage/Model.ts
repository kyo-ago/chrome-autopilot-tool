/// <reference path="../../../Models/Command/Model.ts" />

module AddCommentMessage {
    export class Model {
        public static name = 'AddCommentMessage';
        constructor (public command: Command.Model, public insertBeforeLastCommand: boolean) {
        }
        equals (message: any) {
            return message.name === name;
        }
    }
}
