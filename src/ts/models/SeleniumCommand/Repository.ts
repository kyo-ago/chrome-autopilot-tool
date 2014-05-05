/// <reference path="../../Base/Entity/Repository.ts" />
/// <reference path="./Model.ts" />

module Models.SeleniumCommand {
    export interface IModelObject {
        type: string;
        target: string;
        value: string;
    }
    export class Repository implements Base.Entity.Repository<Model> {
        toObject (command: Model): IModelObject {
            return {
                'type' : command.type,
                'target' : command.target,
                'value' : command.value
            };
        }
        fromObject (command: IModelObject) {
            return new Model(command.type, command.target, command.value);
        }
    }
}
