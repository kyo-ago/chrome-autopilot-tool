/// <reference path="../../../Models/SeleniumCommand/Model.ts" />
/// <reference path="../Model.ts" />

module ts.Application.Models.Message.PlaySeleniumCommandResult {
    export class Model extends Message.Model {
        static messageName = 'playSeleniumCommandResult';
        //page reloading
        constructor (public command: string = 'OK') {
            super();
        }
    }
}
