declare module chrome.extension {
    var onConnect: runtime.ExtensionConnectEvent;
}
declare class EventEmitter extends eventemitter2.EventEmitter2 {
}
declare var TestInitialize: boolean;
declare module Cat.Base {
    class Identity {
        uuid: UUID.UUID;
        constructor(uuid?: UUID.UUID);
        eq(e: Identity): boolean;
    }
}
declare module Cat.Base {
    class Service {
    }
}
declare module Cat.UUID {
    class UUID {
        uuid: string;
        constructor(id?: string);
        toString(): string;
        static fromString(id: string): UUID;
        private S4();
    }
}
declare module Cat.Application.Controllers.Autopilot {
    interface Scope extends ng.IScope {
        playAll: () => void;
        addCommand: () => void;
        deleteCommand: (command: Cat.Models.Command.Model) => void;
        commandGrid: Models.CommandGrid.Model;
        startRecording: () => void;
        stopRecording: () => void;
        changeSpeed: () => void;
        playCurrent: () => void;
        playStop: () => void;
        recordingStatus: boolean;
        baseURL: string;
        playSpeed: string;
        selectList: string[];
    }
    class Controller {
        constructor($scope: Scope, manager: Services.Tab.Manager, commandGrid: Models.CommandGrid.Model, messageDispatcher: Models.Message.Dispatcher, seleniumSender: Services.Selenium.Sender, commandSelectList: Services.CommandSelectList);
        private bindTabManager($scope, manager, messageDispatcher);
    }
}
declare module Cat.Application.Controllers {
    class ContentScriptsCtrl {
        private port;
        private messagePlaySeleniumCommandResultRepository;
        private messageAddCommentRepository;
        private recorderObserver;
        private messageDispatcher;
        private SeleniumReceiver;
        constructor(port: chrome.runtime.Port);
        onMessage(message: Object, sender: chrome.runtime.MessageSender, sendResponse: (message: Object) => void): void;
        private addCommand(commandName, target, value, window, insertBeforeLastCommand);
        initialize(): void;
    }
}
declare var applicationServicesSeleniumSender: Cat.Application.Services.Selenium.Sender;
declare module Cat.Application.Controllers {
    class WindowCtrl {
        private calledTabId;
        constructor(calledTabId: string);
        private initAngular(manager, commandSelectList);
        private initCommandSelectList();
        private initTabInitializer(resolve, catchError);
        initialize(): Promise<{}>;
    }
}
declare module Cat.Application.Services {
    class CommandSelectList {
        private static errorMessage;
        private documentElement;
        load(file: string): Promise<void>;
        getDocRoot(): HTMLElement;
        gets(): HTMLElement[];
    }
}
declare module Cat.Application.Services {
    class Config {
        static injectScripts: string[];
        static seleniumApiXML: string;
    }
}
declare module Cat.Application.Services {
    class RecorderObserver extends EventEmitter {
        recordingEnabled: boolean;
        isSidebar: boolean;
        getUserLog(): Console;
        addCommand(command: string, target: string, value: string, window: Window, insertBeforeLastCommand: boolean): void;
        onUnloadDocument(doc: Document): void;
    }
}
declare module Cat.Base.Entity {
    class Model extends Identity {
        identity: Identity;
        constructor(identity?: Identity);
        eq(e: Model): boolean;
    }
}
declare module Cat.Base.Entity {
    interface Repository<M extends Model> {
        toObject(entity: M): Object;
        fromObject(object: Object): M;
    }
}
declare module Cat.Base.EntityList {
    class Model<E extends Entity.Model> extends Entity.Model {
        list: E[];
        constructor(list?: E[]);
        add(entity: E): void;
        getList(): E[];
        splice(index: number, entity: E): void;
        replace(identity: Identity, entity: E): void;
        remove(entity: E): void;
        clear(): void;
    }
}
declare module Cat.Base.EntityList {
    class Repository<B extends Entity.Model, M extends Model<Entity.Model>> {
        private entityRepository;
        constructor(entityRepository: Entity.Repository<B>);
        toEntityList(entityList: M): M[];
        fromEntityList(entityList: Object[]): B[];
    }
}
declare module Cat.Models.Command {
    class Model extends Base.Entity.Model {
        type: string;
        target: string;
        value: string;
        constructor(type?: string, target?: string, value?: string);
    }
}
declare module Cat.Models.Command {
    interface IModelObject {
        type: string;
        target: string;
        value: string;
    }
    class Repository implements Base.Entity.Repository<Model> {
        toObject(command: Model): IModelObject;
        fromObject(command: IModelObject): Model;
    }
}
declare module Cat.Models.CommandList {
    class Model extends Base.EntityList.Model<Command.Model> {
        name: string;
        url: string;
        constructor(commands?: Command.Model[], name?: string, url?: string);
        clear(): void;
    }
}
declare module Cat.Models.CommandList {
    class Repository extends Base.EntityList.Repository<Command.Model, Model> implements Base.Entity.Repository<Model> {
        constructor();
        toObject(commandList: Model): {
            'commandList': Model[];
            'name': string;
            'url': string;
        };
        fromObject(commandList: {
            'commandList': Object[];
            'name': string;
            'url': string;
        }): Model;
    }
}
declare module Cat.Application.Models.CommandGrid {
    class Model extends Base.EntityList.Model<Cat.Models.Command.Model> {
        getCommandList(): Cat.Models.CommandList.Model;
    }
}
declare module Cat.Application.Models.Message {
    interface DispatchMap {
        MessageAddCommentModel?: (message: AddComment.Model) => void;
        MessagePlayCommandModel?: (message: PlayCommand.Model) => void;
        MessagePlayCommandListModel?: (message: PlayCommandList.Model) => void;
        MessagePlaySeleniumCommandExecuteModel?: (message: PlaySeleniumCommandExecute.Model) => void;
        MessagePlaySeleniumCommandResultModel?: (message: PlaySeleniumCommandResult.Model) => void;
    }
    class Dispatcher {
        messageAddCommentModel: AddComment.Repository;
        messagePlayCommandModel: PlayCommand.Repository;
        messagePlayCommandListModel: PlayCommandList.Repository;
        messagePlaySeleniumCommandExecuteModel: PlaySeleniumCommandExecute.Repository;
        messagePlaySeleniumCommandResultModel: PlaySeleniumCommandResult.Repository;
        dispatch(message: Object, dispatcher: DispatchMap): void;
    }
}
declare module Cat.Application.Models.Message {
    class Model extends Base.Entity.Model {
    }
}
declare module Cat.Application.Models.Message {
    class Repository implements Base.Entity.Repository<Model> {
        toObject(entity: Model): {};
        fromObject(object: Object): Model;
    }
}
declare module Cat.Application.Models.SeleniumCommand {
    class Model extends Base.Entity.Model {
        type: string;
        args: string[];
        constructor(type?: string, args?: string[]);
    }
}
declare module Cat.Application.Models.SeleniumCommand {
    interface IModelObject {
        type: string;
        args: string[];
    }
    class Repository implements Base.Entity.Repository<Model> {
        toObject(command: Model): IModelObject;
        fromObject(command: IModelObject): Model;
    }
}
declare module Cat.Application.Services.Selenium {
    class Base {
        selenium: any;
        commandFactory: any;
        currentTest: any;
        testCase: any;
        interval: number;
        constructor(callback: () => void);
        getInterval(): number;
        start(): Promise<{}>;
        private static errorMessage;
        static setApiDocs(file: string): Promise<void>;
    }
}
declare module Cat.Application.Services.Selenium {
    class Receiver extends Base {
        constructor();
        private errorMessage;
        execute(model: Models.SeleniumCommand.Model): string;
        private exec(exec);
    }
}
declare module Cat.Application.Services.Selenium {
    class Sender extends Base {
        private manager;
        private messageDispatcher;
        private messagePlaySeleniumCommandExecuteRepository;
        constructor(manager: Tab.Manager, messageDispatcher: Models.Message.Dispatcher);
        addCommandList(commandList: Cat.Models.CommandList.Model): void;
        execute(command: string, args: string[], callback: (response: string, result: boolean) => void): void;
    }
}
declare module Cat.Application.Services.Tab {
    class FileLoader {
        private injectScripts;
        private injectScript;
        constructor(injectScripts: any);
        getCode(): string;
        gets(): Promise<{}>;
    }
}
declare module Cat.Application.Services.Tab {
    class Initializer {
        private calledTabId;
        private fileLoader;
        private injectScripts;
        private manager;
        constructor(calledTabId: string, fileLoader: FileLoader);
        start(): Promise<{}>;
        private getTab(calledTabId);
    }
}
declare module Cat.Application.Services.Tab {
    class InjectScripts {
        private fileLoader;
        private injectScript;
        constructor(fileLoader: any);
        private executeEnd(tabid, resolve);
        private executeScript(tabid);
        connect(tabid: number): Promise<void>;
    }
}
declare module Cat.Application.Services.Tab {
    class Manager {
        private initialize;
        private tab;
        private onMessageListeners;
        private onDisconnectListeners;
        private onConnectListeners;
        constructor(tab: chrome.tabs.Tab, initialize: (manager: Manager) => Promise<void>);
        private closeMessage;
        connect(): Promise<void>;
        private reloadTab();
        getTabId(): number;
        getTabURL(): string;
        postMessage(message: Object): void;
        sendMessage(message: Object): Promise<{}>;
        onMessage(callback: (message: Object) => void): void;
        onConnect(callback: () => void): void;
        onDisconnect(callback: () => void): void;
    }
}
declare module Cat.Application.Services.Tab {
    class Model extends EventEmitter {
        private tab;
        private port;
        private sendMessageResponseInterval;
        constructor(tab: chrome.tabs.Tab);
        getTabId(): number;
        getTabURL(): string;
        private checkOnUpdated();
        postMessage(message: Object): void;
        sendMessage(message: Object): Promise<{}>;
        connect(): void;
        onMessage(callback: (message: Object) => void): void;
        onDisconnect(callback: () => void): void;
        private disconnect();
    }
}
declare module Cat.Application.Models.Message.AddComment {
    class Model extends Message.Model {
        command: Cat.Models.Command.Model;
        insertBeforeLastCommand: boolean;
        static messageName: string;
        constructor(command: Cat.Models.Command.Model, insertBeforeLastCommand: boolean);
    }
}
declare module Cat.Application.Models.Message.AddComment {
    class Repository extends Message.Repository {
        repository: Cat.Models.Command.Repository;
        toObject(message: Model): {
            'name': string;
            'content': {
                'command': Cat.Models.Command.IModelObject;
                'insertBeforeLastCommand': boolean;
            };
        };
        fromObject(message: Object): Model;
    }
}
declare module Cat.Application.Models.Message.PlayCommand {
    class Model extends Message.Model {
        command: Cat.Models.Command.Model;
        static messageName: string;
        constructor(command: Cat.Models.Command.Model);
    }
}
declare module Cat.Application.Models.Message.PlayCommand {
    class Repository extends Message.Repository {
        repository: Cat.Models.Command.Repository;
        toObject(message: Model): {
            'name': string;
            'content': Cat.Models.Command.IModelObject;
        };
        fromObject(message: Object): Model;
    }
}
declare module Cat.Application.Models.Message.PlayCommandList {
    class Model extends Message.Model {
        commandList: Cat.Models.CommandList.Model;
        static messageName: string;
        constructor(commandList: Cat.Models.CommandList.Model);
    }
}
declare module Cat.Application.Models.Message.PlayCommandList {
    class Repository extends Message.Repository {
        repository: Cat.Models.CommandList.Repository;
        toObject(message: Model): {
            'name': string;
            'content': {
                'commandList': Cat.Models.CommandList.Model[];
                'name': string;
                'url': string;
            };
        };
        fromObject(message: Object): Model;
    }
}
declare module Cat.Application.Models.Message.PlaySeleniumCommandExecute {
    class Model extends Message.Model {
        command: SeleniumCommand.Model;
        static messageName: string;
        constructor(command: SeleniumCommand.Model);
    }
}
declare module Cat.Application.Models.Message.PlaySeleniumCommandExecute {
    class Repository extends Message.Repository {
        repository: SeleniumCommand.Repository;
        toObject(message: Model): {
            'name': string;
            'content': SeleniumCommand.IModelObject;
        };
        fromObject(message: Object): Model;
    }
}
declare module Cat.Application.Models.Message.PlaySeleniumCommandResult {
    class Model extends Message.Model {
        command: string;
        static messageName: string;
        private validCommand;
        constructor(command?: string);
    }
}
declare module Cat.Application.Models.Message.PlaySeleniumCommandResult {
    class Repository extends Message.Repository {
        toObject(message: Model): {
            'name': string;
            'content': string;
        };
        fromObject(message: Object): Model;
    }
}
