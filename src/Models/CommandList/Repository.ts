/// <reference path="../../Base/EntityList/Repository.ts" />
/// <reference path="../Command/Repository.ts" />
/// <reference path="./Model.ts" />

module Cat.Models.CommandList {
    export class Repository extends Cat.Base.EntityList.Repository<Command.Model, Model> implements Cat.Base.Entity.Repository<Model> {
        constructor () {
            super(new Command.Repository());
        }

        toObject (commandList: Model) {
            return {
                'commandList' : super.toEntityList(commandList),
                'name' : commandList.name,
                'url' : commandList.url
            };
        }
        fromObject (commandList: Object) {
            var commandListObject = super.fromEntityList(commandList['commandList']);
            return new Model(commandListObject, commandList['name'], commandList['url']);
        }
    }
}
