"use strict";

describe('Cat.Application.Services.Tab.Manager', () => {
    var tab = chrome.tabs.newTab();
    it('new',() => {
        new Cat.Application.Services.Tab.Manager(tab, (manager) => new Promise<void>((resolve) => resolve()));
    });
    it('connect',() => {
        var spy = sinonBox.spy((resolve) => resolve());
        var manager = new Cat.Application.Services.Tab.Manager(tab, (manager) => new Promise<void>(spy));
        manager.connect();
        assert(spy.callCount === 1);
    });
    it('onUpdated',(done) => {
        sinonBox.spy(chrome.tabs.onUpdated, 'addListener');
        var spy = sinonBox.spy((resolve) => resolve());
        var manager = new Cat.Application.Services.Tab.Manager(tab, (manager) => new Promise<void>(spy));
        manager.connect().then(() => {
            var handler = (<SinonSpy>chrome.tabs.onUpdated.addListener).lastCall.args[0];
            handler(tab.id, {
                status : 'loading'
            });
            assert(spy.callCount === 2);
            done();
        });
    });
});
