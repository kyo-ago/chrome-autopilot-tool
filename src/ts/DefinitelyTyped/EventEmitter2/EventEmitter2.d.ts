declare class EventEmitter2 {
    addListener(name: string, listener: Function): EventEmitter2;
    emit(name: string, arg?: any): EventEmitter2;
}
