/// <reference path="../../../Models/SeleniumCommand/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />

module ts.Application.Models.Message.PlaySeleniumCommandResult {
    export class Repository extends Message.Repository {
        toObject (message: Model) {
            return {
                'name' : Model.messageName,
                'content' : message.command
            };
        }
        fromObject (message: Object) {
            return new Model(message['content']);
        }
    }
}
