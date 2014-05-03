/// <reference path="../../../../Models/Command/Model.ts" />
/// <reference path="../Model.ts" />

module Message.AddComment {
    export class Model extends Message.Model {
        static name = 'addComment';
        constructor (public command: Command.Model, public insertBeforeLastCommand: boolean) {
            super();
        }
    }
}
