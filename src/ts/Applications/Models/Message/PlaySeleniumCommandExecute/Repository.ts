/// <reference path="../../../Models/SeleniumCommand/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />

module ts.Application.Models.Message.PlaySeleniumCommandExecute {
    export class Repository extends Message.Repository {
        repository = new SeleniumCommand.Repository();

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
