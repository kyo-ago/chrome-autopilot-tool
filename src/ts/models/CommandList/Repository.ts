/// <reference path="../../Base/EntityList/Repository.ts" />
/// <reference path="../Command/Repository.ts" />
/// <reference path="./Model.ts" />

module ts.Models.CommandList {
    export class Repository extends ts.Base.EntityList.Repository<Command.Model, Model> implements ts.Base.Entity.Repository<Model> {
        constructor () {
            super(new Command.Repository());
        }

        toObject (commandList: Model) {
            return {
                'commands' : super.toEntityList(commandList),
                'name' : commandList.name,
                'url' : commandList.url
            };
        }
        fromObject (commandList: Object) {
            return new Model(super.fromEntityList(commandList['commands']), commandList['name'], commandList['url']);
        }
    }
}
