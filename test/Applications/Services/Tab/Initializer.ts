"use strict";

describe('Cat.Application.Services.Tab.Initializer', () => {
    var fileLoader = new Cat.Application.Services.Tab.FileLoader([]);
    it('new',() => {
        new Cat.Application.Services.Tab.Initializer('1', fileLoader);
    });
    it('start',() => {
        var initializer = new Cat.Application.Services.Tab.Initializer('1', fileLoader);
        return initializer.start().then((manager) => {
            assert(manager instanceof Cat.Application.Services.Tab.Manager);
        });
    });
});
