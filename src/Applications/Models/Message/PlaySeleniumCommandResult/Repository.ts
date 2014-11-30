module Cat.Application.Models.Message.PlaySeleniumCommandResult {
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
