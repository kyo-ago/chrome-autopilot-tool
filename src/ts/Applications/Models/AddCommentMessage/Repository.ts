/// <reference path="../../../Models/Command/Model.ts" />
/// <reference path="../../../Models/Command/Repository.ts" />
/// <reference path="./Model.ts" />

module AddCommentMessage {
    export class Repository {
        static toMessage (command: Command.Model, insertBeforeLastCommand: boolean) {
            return {
                'name' : Model.name,
                'command' : (new Command.Repository()).toObject(command),
                'insertBeforeLastCommand' : insertBeforeLastCommand
            }
        }
        static isMessage (msg: any) {
            return msg.name === Model.name;
        }
        static fromMessage (msg: any) {
            var command = (new Command.Repository()).fromObject(msg.command);
            return new Model(command, msg.insertBeforeLastCommand);
        }
    }
}
