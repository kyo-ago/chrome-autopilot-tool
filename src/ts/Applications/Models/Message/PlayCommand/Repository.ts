/// <reference path="../../../../Models/Command/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />

module ts.Application.Models.Message.PlayCommand {
    export class Repository extends Message.Repository {
        repository = new ts.Models.Command.Repository();

        toObject (message: Model) {
            return {
                'name' : Model.messageName,
                'content' : this.repository.toObject(message.command)
            };
        }
        fromObject (message: Object) {
            return new Model(this.repository.fromObject(message['content']));
        }
    }
}
