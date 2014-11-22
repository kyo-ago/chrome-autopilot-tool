/// <reference path="../../../src/Applications/Services/TabInitializer.ts" />

"use strict";

describe('Cat.Application.Services.TabInitializer', () => {
    it('new',() => {
        new Cat.Application.Services.TabInitializer('1');
    });
    it('start',(done) => {
        var tabInitializer = new Cat.Application.Services.TabInitializer('1');
        tabInitializer.start().then((tabManager) => {
            assert(tabManager instanceof Cat.Application.Services.Tab.TabManager);
            done();
        }).catch(console.error.bind(console));
    });
});
