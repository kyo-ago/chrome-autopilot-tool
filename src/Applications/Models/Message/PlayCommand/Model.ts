/// <reference path="../../../../Models/Command/Model.ts" />
/// <reference path="../Model.ts" />

module Cat.Application.Models.Message.PlayCommand {
    export class Model extends Message.Model {
        static messageName = 'playCommand';
        constructor (public command: Cat.Models.Command.Model) {
            super();
        }
    }
}
