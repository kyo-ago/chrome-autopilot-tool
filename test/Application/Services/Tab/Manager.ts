/// <reference path="../../../../src/Applications/Services/Tab/InjectScripts.ts" />

"use strict";

describe('Cat.Application.Services.Tab.Manager', () => {
    var tab = chrome.tabs.newTab();
    it('new',() => {
        new Cat.Application.Services.Tab.Manager(tab, (manager) => new Promise<void>((resolve) => resolve()));
    });
    it('connect',(done) => {
        var spy = sinon.spy((resolve) => resolve());
        var manager = new Cat.Application.Services.Tab.Manager(tab, (manager) => new Promise<void>(spy));
        manager.connect();
        setTimeout(() => {
            assert(spy.callCount === 1);
            done();
        });
    });
    it('onUpdated',(done) => {
        sinon.spy(chrome.tabs.onUpdated, 'addListener');
        var spy = sinon.spy((resolve) => resolve());
        var manager = new Cat.Application.Services.Tab.Manager(tab, (manager) => new Promise<void>(spy));
        manager.connect();
        var handler = (<SinonSpy>chrome.tabs.onUpdated.addListener).lastCall.args[0];
        handler(tab.id, {
            status : 'loading'
        });
        setTimeout(() => {
            assert(spy.callCount === 2);
            sinon.restore(chrome.tabs.onUpdated.addListener);
            done();
        });
    });
});
