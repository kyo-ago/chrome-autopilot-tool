class RecorderObserver {
    recordingEnabled: boolean = true;
    isSidebar: boolean = false;
    getUserLog () {
        return console;
    }
    addCommand (command: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) {
    }
    onUnloadDocument (doc: Document) {
    }
}
