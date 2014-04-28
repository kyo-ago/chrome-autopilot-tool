/// <reference path="../../Models/Command/Model.ts" />

module Command {
    export class Repository {
        toObject (command: Model) {
            return {
                'type' : command.type,
                'target' : command.target,
                'value' : command.value
            };
        }
        fromObject (command: any) {
            return new Model(command.type, command.target, command.value);
        }
    }
}
