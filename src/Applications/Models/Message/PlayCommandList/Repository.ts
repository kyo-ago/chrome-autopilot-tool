module Cat.Application.Models.Message.PlayCommandList {
    export class Repository extends Message.Repository {
        repository = new Cat.Models.CommandList.Repository();

        toObject (message: Model) {
            return {
                'name' : Model.messageName,
                'content' : this.repository.toObject(message.commandList)
            };
        }
        fromObject (message: Object) {
            return new Model(this.repository.fromObject(message['content']));
        }
    }
}
