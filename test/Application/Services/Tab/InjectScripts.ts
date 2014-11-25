/// <reference path="../../../../src/Applications/Services/Tab/InjectScripts.ts" />

"use strict";

describe('Cat.Application.Services.Tab.InjectScripts', () => {
    it('new',() => {
        new Cat.Application.Services.Tab.InjectScripts(['']);
    });
    it('connect',(done) => {
        var injectScripts = new Cat.Application.Services.Tab.InjectScripts(['', '', '']);
        sinonBox.spy(injectScripts, 'executeEnd');
        injectScripts.connect(1).then(() => {
            assert((<any>injectScripts).executeEnd.calledOnce);
            done();
        }).catch(console.error.bind(console));
    });
});
