"use strict";

describe('Cat.Application.Services.Tab.InjectScripts', () => {
    var fileLoader = new Cat.Application.Services.Tab.FileLoader([]);
    it('new',() => {
        new Cat.Application.Services.Tab.InjectScripts(fileLoader);
    });
    it('connect',() => {
        var injectScripts = new Cat.Application.Services.Tab.InjectScripts(fileLoader);
        sinonBox.spy(injectScripts, 'executeEnd');
        return injectScripts.connect(1).then(() => {
            assert((<any>injectScripts).executeEnd.calledOnce);
        });
    });
});
