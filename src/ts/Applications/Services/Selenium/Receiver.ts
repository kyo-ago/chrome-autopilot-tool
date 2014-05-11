/// <reference path="../../Models/SeleniumCommand/Model.ts" />
/// <reference path="./Base.ts" />

module ts.Application.Services.Selenium {
    export class Receiver extends Base {
        constructor () {
            super(() => (<any>window).createSelenium(location.href, true));
        }
        private errorMessage = 'missing command: ';
        execute (model: Models.SeleniumCommand.Model) {
            if (this.selenium[model.type]) {
                return this.selenium[model.type].apply(this.selenium, model.args);
            }
            var commandName = 'do' + model.type.replace(/^\w/, w => w.toUpperCase());
            if (this.selenium[commandName]) {
                return this.selenium[commandName].apply(this.selenium, model.args);
            }
            throw new Error(this.errorMessage + JSON.stringify(model));
        }
    }
}
