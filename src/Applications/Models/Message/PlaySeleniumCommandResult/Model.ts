/// <reference path="../../SeleniumCommand/Model.ts" />
/// <reference path="../Model.ts" />

module Cat.Application.Models.Message.PlaySeleniumCommandResult {
    export class Model extends Message.Model {
        static messageName = 'playSeleniumCommandResult';
        //page reloading
        constructor (public command: string = 'OK') {
            super();
        }
    }
}
