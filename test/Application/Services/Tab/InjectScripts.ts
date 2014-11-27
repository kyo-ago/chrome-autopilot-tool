"use strict";

describe('Cat.Application.Services.Tab.InjectScripts', () => {
    it('new',() => {
        new Cat.Application.Services.Tab.InjectScripts(['']);
    });
    it('connect',() => {
        var injectScripts = new Cat.Application.Services.Tab.InjectScripts(['', '', '']);
        sinonBox.spy(injectScripts, 'executeEnd');
        return injectScripts.connect(1).then(() => {
            assert((<any>injectScripts).executeEnd.calledOnce);
        });
    });
});
