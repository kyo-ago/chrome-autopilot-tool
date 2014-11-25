"use strict";

describe('Cat.Application.Services.RecorderObserver', () => {
    it('new',() => {
        new Cat.Application.Services.RecorderObserver();
    });
    it('addCommand',() => {
        var recorderObserver = new Cat.Application.Services.RecorderObserver();
        recorderObserver.addListener('addCommand', (command) => {
            assert(command === 'command');
        });
        recorderObserver.addCommand('command', 'target', 'value', window, true);
    });
});
