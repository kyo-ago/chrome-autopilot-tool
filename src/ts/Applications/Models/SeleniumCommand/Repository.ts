/// <reference path="../../../Base/Entity/Repository.ts" />
/// <reference path="./Model.ts" />

module ts.Application.Models.SeleniumCommand {
    export interface IModelObject {
        type: string;
        args: string[];
    }
    export class Repository implements ts.Base.Entity.Repository<Model> {
        toObject (command: Model): IModelObject {
            return {
                'type' : command.type,
                'args' : command.args
            };
        }
        fromObject (command: IModelObject) {
            return new Model(command.type, command.args);
        }
    }
}
