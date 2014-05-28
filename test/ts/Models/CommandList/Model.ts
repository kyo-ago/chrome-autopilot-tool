/// <reference path="../../../../src/ts/Models/CommandList/Model.ts" />
/// <reference path="../../DefinitelyTyped/expect.js/expect.js.d.ts" />
/// <reference path="../../DefinitelyTyped/mocha/mocha.d.ts" />

"use strict";

describe('ts.Models.CommandList', () => {
    it('new',() => {
        new ts.Models.CommandList.Model();
    });
    describe('properties', () => {
        var testList = [new ts.Models.Command.Model];
        var commnadList = new ts.Models.CommandList.Model(testList, 'name', 'url');
        it('list',() => {
            expect(commnadList.getList()).to.eql(testList);
        });
        it('name',() => {
            expect(commnadList.name).to.eql('name');
        });
        it('url',() => {
            expect(commnadList.url).to.eql('url');
        });
    });
});
