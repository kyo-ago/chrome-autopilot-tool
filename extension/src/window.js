/// <reference path="_define.ts" />
var autopilotApp;
(function () {
    if ('undefined' !== typeof TestInitialize) {
        return;
    }
    var calledTabId = location.hash.replace(/^#/, '');
    var catchError = function (messages) {
        alert([].concat(messages).join('\n'));
    };
    var windowCtrl = new Cat.Application.Controllers.WindowCtrl(calledTabId);
    windowCtrl.initialize().then(function () {
        //        console.log('load success');
    }).catch(catchError);
})();
