/*
* Mock RecorderObserver for Selenium Recorder
* */
module Cat.Application.Services {
    export class RecorderObserver extends EventEmitter{
        recordingEnabled: boolean = true;
        isSidebar: boolean = false;
        getUserLog () {
            return console;
        }
        addCommand (command: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) {
            this.emit('addCommand', command, target, value, window, insertBeforeLastCommand);
        }
        onUnloadDocument (doc: Document) {
            this.emit('onUnloadDocument', doc);
        }
    }
}
