module Cat.Application.Models.Message.PlaySeleniumCommandExecute {
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
