/// <reference path="../../../src/Models/CommandList/Repository.ts" />

"use strict";

describe('Cat.Models.CommandList.Repository', () => {
    it('new',() => {
        new Cat.Models.CommandList.Repository();
    });
    function getCommandList () {
        var testList = [new Cat.Models.Command.Model];
        return new Cat.Models.CommandList.Model(testList, 'name', 'url');
    }
    describe('toObject', () => {
        var repo = new Cat.Models.CommandList.Repository();
        var target = repo.toObject(getCommandList());
        assert(target.commandList.length === 1);
        assert(target.name === 'name');
        assert(target.url === 'url');
    });
    describe('fromObject', () => {
        var repo = new Cat.Models.CommandList.Repository();
        var target = repo.fromObject(repo.toObject(getCommandList()));
        assert(target.name === 'name');
        assert(target.url === 'url');
    });
});
