/// <reference path="../../../../Models/Command/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />

module Message.AddComment {
    export class Repository extends Message.Repository {
        commandRepository = new Command.Repository();

        toObject (message: Message.AddComment.Model) {
            return {
                'name' : Message.AddComment.Model.name,
                'command' : this.commandRepository.toObject(message.command),
                'insertBeforeLastCommand' : message.insertBeforeLastCommand
            };
        }
        fromObject (message: any) {
            var command = this.commandRepository.fromObject(message.command);
            var insertBeforeLastCommand = !!message.insertBeforeLastCommand;
            return new Message.AddComment.Model(command, insertBeforeLastCommand);
        }
    }
}
