/// <reference path="../../../../src/Applications/Services/Tab/Initializer.ts" />

"use strict";

describe('Cat.Application.Services.Tab.Initializer', () => {
    it('new',() => {
        new Cat.Application.Services.Tab.Initializer('1');
    });
    it('start',(done) => {
        var initializer = new Cat.Application.Services.Tab.Initializer('1');
        initializer.start().then((manager) => {
            assert(manager instanceof Cat.Application.Services.Tab.Manager);
            done();
        }).catch(console.error.bind(console));
    });
});
