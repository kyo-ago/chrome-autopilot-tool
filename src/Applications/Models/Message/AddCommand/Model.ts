module Cat.Application.Models.Message.AddComment {
    export class Model extends Message.Model {
        static messageName = 'addComment';
        constructor (public command: Cat.Models.Command.Model, public insertBeforeLastCommand: boolean) {
            super();
        }
    }
}
