declare module chrome.extension {
    var onConnect: chrome.runtime.ExtensionConnectEvent;
}

declare class EventEmitter extends eventemitter2.EventEmitter2 {}
(<any>window).EventEmitter = (<any>window).EventEmitter2;

declare var TestInitialize: boolean;