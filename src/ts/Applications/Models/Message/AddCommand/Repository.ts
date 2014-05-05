/// <reference path="../../../../Models/Command/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />

module ts.Application.Models.Message.AddComment {
    export class Repository extends Message.Repository {
        commandRepository = new ts.Models.Command.Repository();

        toObject (message: Model) {
            return {
                'name' : Model.name,
                'command' : this.commandRepository.toObject(message.command),
                'insertBeforeLastCommand' : message.insertBeforeLastCommand
            };
        }
        fromObject (message: any) {
            var command = this.commandRepository.fromObject(message.command);
            var insertBeforeLastCommand = !!message.insertBeforeLastCommand;
            return new Model(command, insertBeforeLastCommand);
        }
    }
}
