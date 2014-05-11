/// <reference path="../../../Models/SeleniumCommand/Model.ts" />
/// <reference path="../Model.ts" />

module ts.Application.Models.Message.PlaySeleniumCommandExecute {
    export class Model extends Message.Model {
        static messageName = 'playSeleniumCommandExecute';
        constructor (public command: SeleniumCommand.Model) {
            super();
        }
    }
}
