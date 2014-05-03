/// <reference path="../../Base/Repository.ts" />
/// <reference path="./Model.ts" />

module Command {
    export interface IModelObject {
        type: string;
        target: string;
        value: string;
    }
    export class Repository implements Base.Repository {
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
