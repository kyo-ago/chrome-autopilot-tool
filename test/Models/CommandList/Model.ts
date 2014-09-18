/// <reference path="../../../src/Models/CommandList/Model.ts" />

"use strict";

describe('Cat.Models.CommandList', () => {
    it('new',() => {
        new Cat.Models.CommandList.Model();
    });
    describe('properties', () => {
        var testList = [new Cat.Models.Command.Model];
        var commnadList = new Cat.Models.CommandList.Model(testList, 'name', 'url');
        assert(commnadList.getList() === testList);
        assert(commnadList.name === 'name');
        assert(commnadList.url === 'url');
    });
});
