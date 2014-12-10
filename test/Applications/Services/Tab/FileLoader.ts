"use strict";

describe('Cat.Application.Services.Tab.FileLoader', () => {
    it('new',() => {
        new Cat.Application.Services.Tab.FileLoader([]);
    });
    it('gets',() => {
        sinonBox.server.respondWith('/', '{}');
        var fileLoader = new Cat.Application.Services.Tab.FileLoader(['', '']);
        return fileLoader.gets().then(() => {
            assert(fileLoader.getCode() === '{};\n{}');
        });
    });
});
