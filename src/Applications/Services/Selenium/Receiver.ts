/// <reference path="../../Models/SeleniumCommand/Model.ts" />
/// <reference path="./Base.ts" />

module Cat.Application.Services.Selenium {
    export class Receiver extends Base {
        constructor () {
            super(() => (<any>window).createSelenium(location.href, true));
        }
        private errorMessage = 'missing command: ';
        execute (model: Models.SeleniumCommand.Model) {
            if (this.selenium[model.type]) {
                return this.exec(() => this.selenium[model.type].apply(this.selenium, model.args));
            }
            var commandName = 'do' + model.type.replace(/^\w/, w => w.toUpperCase());
            if (this.selenium[commandName]) {
                return this.exec(() => this.selenium[commandName].apply(this.selenium, model.args));
            }
            var errorMessage = this.errorMessage + JSON.stringify(model);
            setTimeout(() => {
                throw new Error(errorMessage);
            });
            return 'ERROR ' + errorMessage;
        }
        private exec (exec: () => any) {
            try {
                exec();
                return 'OK';
            } catch (e) {
                setTimeout(() => {
                    throw e;
                });
                return 'ERROR';
            }
        }
    }
}
