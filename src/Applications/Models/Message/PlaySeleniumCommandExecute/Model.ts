module Cat.Application.Models.Message.PlaySeleniumCommandExecute {
    export class Model extends Message.Model {
        static messageName = 'playSeleniumCommandExecute';
        constructor (public command: SeleniumCommand.Model) {
            super();
        }
    }
}
