/// <reference path="../../Base/EntityList/Repository.ts" />
/// <reference path="../SeleniumCommand/Repository.ts" />
/// <reference path="./Model.ts" />

module Models.SeleniumCommandList {
    export class Repository extends Base.EntityList.Repository<SeleniumCommand.Model, Model> implements Base.Entity.Repository<Model> {
        seleniumIDECommandObject: any;

        constructor () {
            super(new SeleniumCommand.Repository());
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
