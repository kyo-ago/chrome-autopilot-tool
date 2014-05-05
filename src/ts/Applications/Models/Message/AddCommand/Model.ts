/// <reference path="../../../../Models/Command/Model.ts" />
/// <reference path="../Model.ts" />

module ts.Application.Models.Message.AddComment {
    export class Model extends Message.Model {
        static name = 'addComment';
        constructor (public command: ts.Models.Command.Model, public insertBeforeLastCommand: boolean) {
            super();
        }
    }
}
