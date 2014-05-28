/// <reference path="../../../../src/ts/Models/CommandList/Model.ts" />
/// <reference path="../../DefinitelyTyped/expect.js/expect.js.d.ts" />
/// <reference path="../../DefinitelyTyped/mocha/mocha.d.ts" />
"use strict";

describe('ts.Models.CommandList', function () {
    it('new', function () {
        new ts.Models.CommandList.Model();
    });
    describe('properties', function () {
        var testList = [new ts.Models.Command.Model];
        var commnadList = new ts.Models.CommandList.Model(testList, 'name', 'url');
        it('list', function () {
            expect(commnadList.getList()).to.eql(testList);
        });
        it('name', function () {
            expect(commnadList.name).to.eql('name');
        });
        it('url', function () {
            expect(commnadList.url).to.eql('url');
        });
    });
});
//# sourceMappingURL=Model.js.map
