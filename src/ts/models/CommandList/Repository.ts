/// <reference path="../../Base/EntityList/Repository.ts" />
/// <reference path="../Command/Repository.ts" />
/// <reference path="./Model.ts" />

module Models.CommandList {
    export class Repository extends Base.EntityList.Repository<Command.Model, Model> implements Base.Entity.Repository<Model> {
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
