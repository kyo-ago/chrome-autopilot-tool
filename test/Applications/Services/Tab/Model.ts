"use strict";

describe('Cat.Application.Services.Tab.Model', () => {
    var tab = chrome.tabs.newTab();
    it('new',() => {
        new Cat.Application.Services.Tab.Model(tab);
    });
    it('sendMessage',() => {
        var spy = sinonBox.spy((resolve) => resolve());
        var manager = new Cat.Application.Services.Tab.Model(tab);
        (<any>manager).port = true;
        return manager.sendMessage({}).then((result) => {
            assert(result === 'OK');
        });
    });
});
