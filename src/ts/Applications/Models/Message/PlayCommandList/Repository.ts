/// <reference path="../../../../Models/CommandList/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />

module ts.Application.Models.Message.PlayCommandList {
    export class Repository extends Message.Repository {
        commandListRepository = new ts.Models.CommandList.Repository();

        toObject (message: Model) {
            return {
                'name' : Model.messageName,
                'commandList' : this.commandListRepository.toObject(message.commandList)
            };
        }
        fromObject (message: Object) {
            return new Model(this.commandListRepository.fromObject(message['commandList']));
        }
    }
}
