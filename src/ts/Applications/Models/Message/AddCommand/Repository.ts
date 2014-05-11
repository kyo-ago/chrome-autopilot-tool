/// <reference path="../../../../Models/Command/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />

module ts.Application.Models.Message.AddComment {
    export class Repository extends Message.Repository {
        repository = new ts.Models.Command.Repository();

        toObject (message: Model) {
            return {
                'name' : Model.messageName,
                'content' : {
                    'command' : this.repository.toObject(message.command),
                    'insertBeforeLastCommand' : message.insertBeforeLastCommand
                }
            };
        }
        fromObject (message: Object) {
            var command = this.repository.fromObject(message['content']['command']);
            var insertBeforeLastCommand = !!message['content']['insertBeforeLastCommand'];
            return new Model(command, insertBeforeLastCommand);
        }
    }
}
