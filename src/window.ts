/// <reference path="_loadtsd.ts" />
/// <reference path="Applications/Controllers/WindowCtrl.ts" />
/// <reference path="Applications/Services/Selenium/Sender.ts" />

var autopilotApp: ng.IModule;
var applicationServicesSeleniumSender: Cat.Application.Services.Selenium.Sender;
(() => {
    if ('undefined' !== typeof TestInitialize) {
        return;
    }
    var calledTabId = location.hash.replace(/^#/, '');
    var catchError = (messages: string[]) => {
        alert([].concat(messages).join('\n'));
    };
    var windowCtrl = new Cat.Application.Controllers.WindowCtrl(calledTabId);
    windowCtrl.initialize().then(() => {
        console.log('load success');
    }).catch(catchError);
})();
