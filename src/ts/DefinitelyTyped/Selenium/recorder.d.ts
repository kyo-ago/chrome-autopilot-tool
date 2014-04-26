interface RegisterObserver {
    addCommand: (command: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean) => any;
    recordingEnabled: boolean;
    isSidebar: boolean;
    getUserLog: () => Console;
    onUnloadDocument: (doc: Document) => any;
}
declare class Recorder{
    static WINDOW_RECORDER_PROPERTY: string;
    static record(recorder: Recorder, command: string, target: string, value: string);
    static addEventHandler(handlerName: string, eventName: string, handler: Function, options: Object);
    static removeEventHandler(handlerName: string);
    static decorateEventHandler(handlerName: string, eventName: string, decorator: Function, options: Object);
    static register(observer: RegisterObserver, window: Window);
    static deregister(observer: RegisterObserver, window: Window);
    static get(window: Window);
    static registerAll(observer: RegisterObserver);
    static deregisterAll(observer: RegisterObserver);
    static registerForWindow(window: Window, observer: RegisterObserver);
    static deregisterForWindow(window: Window, observer: RegisterObserver);
    static forEachWindow(handler: Function);
    static forEachTab(window: Window, handler: Function);
    static forEachFrame(window: Window, handler: Function);

    window: Window;
    observers: any[];

    constructor(window: Window);

    getWrappedWindow(): Window;
    reattachWindowMethods();
    parseEventKey(eventKey: string): {
        eventName: string;
        capture: boolean;
    };
    registerUnloadListener();
    attach();
    detach();
    record(command: string, target: string, value: string, insertBeforeLastCommand);
    findLocator(element: HTMLElement);
    findLocators(elements: HTMLElement[]);
    deregister(observer: Function);
}