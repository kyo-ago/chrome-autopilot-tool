/// <reference path="_loadtsd.ts" />

var autopilotApp: ng.IModule;
declare var Cat;
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
//        console.log('load success');
    }).catch(catchError);
})();
