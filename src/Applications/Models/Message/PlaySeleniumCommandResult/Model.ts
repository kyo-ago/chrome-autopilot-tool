/// <reference path="../../SeleniumCommand/Model.ts" />
/// <reference path="../Model.ts" />

module Cat.Application.Models.Message.PlaySeleniumCommandResult {
    export class Model extends Message.Model {
        static messageName = 'playSeleniumCommandResult';
        private validCommand = [
            'OK',
            'NG'
        ];
        //page reloading
        constructor (public command: string = 'OK') {
            super();
            if (!~this.validCommand.indexOf(command)) {
                throw new Error('invalid command,'+command);
            }
        }
    }
}
