"use strict";

describe('Cat.Models.CommandList.Model', () => {
    it('new',() => {
        new Cat.Models.CommandList.Model();
    });
    describe('properties', () => {
        var testList = [new Cat.Models.Command.Model];
        var target = new Cat.Models.CommandList.Model(testList, 'name', 'url');
        assert(target.getList() === testList);
        assert(target.name === 'name');
        assert(target.url === 'url');
    });
});
