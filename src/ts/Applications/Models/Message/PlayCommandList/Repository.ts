/// <reference path="../../../../Models/CommandList/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />

module Message.PlayCommandList {
    export class Repository extends Message.Repository {
        commandListRepository = new CommandList.Repository();

        toObject (message: Message.PlayCommandList.Model) {
            return {
                'name' : Message.PlayCommandList.Model.name,
                'commandList' : this.commandListRepository.toObject(message.commandList)
            };
        }
        fromObject (message: any) {
            return new Message.PlayCommandList.Model(this.commandListRepository.fromObject(message));
        }
    }
}
