"use strict";

describe('Cat.Application.Services.Tab.Initializer', () => {
    it('new',() => {
        new Cat.Application.Services.Tab.Initializer('1');
    });
    it('start',() => {
        var initializer = new Cat.Application.Services.Tab.Initializer('1');
        return initializer.start().then((manager) => {
            assert(manager instanceof Cat.Application.Services.Tab.Manager);
        });
    });
});
