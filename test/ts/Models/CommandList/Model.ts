/// <reference path="../../../../src/ts/Models/CommandList/Model.ts" />

"use strict";

describe('ts.Models.CommandList', () => {
    it('new',() => {
        new ts.Models.CommandList.Model();
    });
    describe('properties', () => {
        var testList = [new ts.Models.Command.Model];
        var commnadList = new ts.Models.CommandList.Model(testList, 'name', 'url');
        assert(commnadList.getList() === testList);
        assert(commnadList.name === 'name');
        assert(commnadList.url === 'url');
    });
});
