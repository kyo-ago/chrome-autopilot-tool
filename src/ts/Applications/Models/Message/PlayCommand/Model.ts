/// <reference path="../../../../Models/Command/Model.ts" />
/// <reference path="../Model.ts" />

module ts.Application.Models.Message.PlayCommand {
    export class Model extends Message.Model {
        static messageName = 'playCommand';
        constructor (public command: ts.Models.Command.Model) {
            super();
        }
    }
}
