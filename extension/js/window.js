/// <reference path="../typings/tsd.d.ts" />
window.EventEmitter = window.EventEmitter2;
var Cat;
(function (Cat) {
    var UUID;
    (function (_UUID) {
        var InvalidUUIDFormat = (function () {
            function InvalidUUIDFormat() {
            }
            return InvalidUUIDFormat;
        })();
        var UUID = (function () {
            function UUID(id) {
                if (id === void 0) { id = undefined; }
                if (!id) {
                    this.uuid = [
                        this.S4(),
                        this.S4(),
                        "-",
                        this.S4(),
                        "-",
                        this.S4(),
                        "-",
                        this.S4(),
                        "-",
                        this.S4(),
                        this.S4(),
                        this.S4()
                    ].join('');
                    return;
                }
                var match = id.match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
                if (!match) {
                    throw new InvalidUUIDFormat();
                }
                this.uuid = id;
            }
            UUID.prototype.toString = function () {
                return this.uuid;
            };
            UUID.fromString = function (id) {
                return new UUID(id);
            };
            UUID.prototype.S4 = function () {
                var rand = 1 + Math.random();
                return ((rand * 0x10000) | 0).toString(16).substring(1);
            };
            return UUID;
        })();
        _UUID.UUID = UUID;
    })(UUID = Cat.UUID || (Cat.UUID = {}));
})(Cat || (Cat = {}));
/// <reference path="UUID" />
var Cat;
(function (Cat) {
    var Base;
    (function (Base) {
        var Identity = (function () {
            function Identity(uuid) {
                if (uuid === void 0) { uuid = new Cat.UUID.UUID; }
                this.uuid = uuid;
            }
            Identity.prototype.eq = function (e) {
                return this.uuid.toString() === e.uuid.toString();
            };
            return Identity;
        })();
        Base.Identity = Identity;
    })(Base = Cat.Base || (Cat.Base = {}));
})(Cat || (Cat = {}));
/// <reference path="../Identity" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Cat;
(function (Cat) {
    var Base;
    (function (Base) {
        var Entity;
        (function (Entity) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(identity) {
                    if (identity === void 0) { identity = new Base.Identity(new Cat.UUID.UUID); }
                    _super.call(this, identity.uuid);
                    this.identity = identity;
                }
                Model.prototype.eq = function (e) {
                    return _super.prototype.eq.call(this, e.identity);
                };
                return Model;
            })(Base.Identity);
            Entity.Model = Model;
        })(Entity = Base.Entity || (Base.Entity = {}));
    })(Base = Cat.Base || (Cat.Base = {}));
})(Cat || (Cat = {}));
/// <reference path="../../Base/Entity/Model.ts" />
var Cat;
(function (Cat) {
    var Models;
    (function (Models) {
        var Command;
        (function (Command) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(type, target, value) {
                    if (type === void 0) { type = ''; }
                    if (target === void 0) { target = ''; }
                    if (value === void 0) { value = ''; }
                    _super.call(this);
                    this.type = type;
                    this.target = target;
                    this.value = value;
                }
                return Model;
            })(Cat.Base.Entity.Model);
            Command.Model = Model;
        })(Command = Models.Command || (Models.Command = {}));
    })(Models = Cat.Models || (Cat.Models = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../Base/Entity/Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var Model = (function (_super) {
                    __extends(Model, _super);
                    function Model() {
                        _super.apply(this, arguments);
                    }
                    return Model;
                })(Cat.Base.Entity.Model);
                Message.Model = Model;
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../../Models/Command/Model.ts" />
/// <reference path="../Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var AddComment;
                (function (AddComment) {
                    var Model = (function (_super) {
                        __extends(Model, _super);
                        function Model(command, insertBeforeLastCommand) {
                            _super.call(this);
                            this.command = command;
                            this.insertBeforeLastCommand = insertBeforeLastCommand;
                        }
                        Model.messageName = 'addComment';
                        return Model;
                    })(Message.Model);
                    AddComment.Model = Model;
                })(AddComment = Message.AddComment || (Message.AddComment = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="./Model.ts" />
/// <reference path="../../Base/Entity/Repository.ts" />
/// <reference path="./Model.ts" />
var Cat;
(function (Cat) {
    var Models;
    (function (Models) {
        var Command;
        (function (Command) {
            var Repository = (function () {
                function Repository() {
                }
                Repository.prototype.toObject = function (command) {
                    return {
                        'type': command.type,
                        'target': command.target,
                        'value': command.value
                    };
                };
                Repository.prototype.fromObject = function (command) {
                    return new Command.Model(command.type, command.target, command.value);
                };
                return Repository;
            })();
            Command.Repository = Repository;
        })(Command = Models.Command || (Models.Command = {}));
    })(Models = Cat.Models || (Cat.Models = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../Base/Entity/Repository.ts" />
/// <reference path="./Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var Repository = (function () {
                    function Repository() {
                    }
                    Repository.prototype.toObject = function (entity) {
                        return {};
                    };
                    Repository.prototype.fromObject = function (object) {
                        return new Message.Model();
                    };
                    return Repository;
                })();
                Message.Repository = Repository;
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../../Models/Command/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var AddComment;
                (function (AddComment) {
                    var Repository = (function (_super) {
                        __extends(Repository, _super);
                        function Repository() {
                            _super.apply(this, arguments);
                            this.repository = new Cat.Models.Command.Repository();
                        }
                        Repository.prototype.toObject = function (message) {
                            return {
                                'name': AddComment.Model.messageName,
                                'content': {
                                    'command': this.repository.toObject(message.command),
                                    'insertBeforeLastCommand': message.insertBeforeLastCommand
                                }
                            };
                        };
                        Repository.prototype.fromObject = function (message) {
                            var command = this.repository.fromObject(message['content']['command']);
                            var insertBeforeLastCommand = !!message['content']['insertBeforeLastCommand'];
                            return new AddComment.Model(command, insertBeforeLastCommand);
                        };
                        return Repository;
                    })(Message.Repository);
                    AddComment.Repository = Repository;
                })(AddComment = Message.AddComment || (Message.AddComment = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../../Models/Command/Model.ts" />
/// <reference path="../Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var PlayCommand;
                (function (PlayCommand) {
                    var Model = (function (_super) {
                        __extends(Model, _super);
                        function Model(command) {
                            _super.call(this);
                            this.command = command;
                        }
                        Model.messageName = 'playCommand';
                        return Model;
                    })(Message.Model);
                    PlayCommand.Model = Model;
                })(PlayCommand = Message.PlayCommand || (Message.PlayCommand = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../../Models/Command/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var PlayCommand;
                (function (PlayCommand) {
                    var Repository = (function (_super) {
                        __extends(Repository, _super);
                        function Repository() {
                            _super.apply(this, arguments);
                            this.repository = new Cat.Models.Command.Repository();
                        }
                        Repository.prototype.toObject = function (message) {
                            return {
                                'name': PlayCommand.Model.messageName,
                                'content': this.repository.toObject(message.command)
                            };
                        };
                        Repository.prototype.fromObject = function (message) {
                            return new PlayCommand.Model(this.repository.fromObject(message['content']));
                        };
                        return Repository;
                    })(Message.Repository);
                    PlayCommand.Repository = Repository;
                })(PlayCommand = Message.PlayCommand || (Message.PlayCommand = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../Identity" />
/// <reference path="../Entity/Model.ts" />
var Cat;
(function (Cat) {
    var Base;
    (function (Base) {
        var EntityList;
        (function (EntityList) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(list) {
                    if (list === void 0) { list = []; }
                    this.list = list;
                    _super.call(this);
                }
                Model.prototype.add = function (entity) {
                    this.list.push(entity);
                };
                Model.prototype.getList = function () {
                    return this.list;
                };
                Model.prototype.splice = function (index, entity) {
                    this.list.splice(index, 1, entity);
                };
                Model.prototype.replace = function (identity, entity) {
                    this.list = this.list.map(function (e) { return e.identity.eq(identity) ? entity : e; });
                };
                Model.prototype.remove = function (entity) {
                    this.list = this.list.filter(function (e) { return !e.eq(entity); });
                };
                Model.prototype.clear = function () {
                    this.list = [];
                };
                return Model;
            })(Base.Entity.Model);
            EntityList.Model = Model;
        })(EntityList = Base.EntityList || (Base.EntityList = {}));
    })(Base = Cat.Base || (Cat.Base = {}));
})(Cat || (Cat = {}));
/// <reference path="./Model.ts" />
/// <reference path="../Entity/Repository.ts" />
var Cat;
(function (Cat) {
    var Base;
    (function (Base) {
        var EntityList;
        (function (EntityList) {
            var Repository = (function () {
                function Repository(entityRepository) {
                    this.entityRepository = entityRepository;
                }
                Repository.prototype.toEntityList = function (entityList) {
                    var _this = this;
                    return entityList.getList().map(function (entity) {
                        return _this.entityRepository.toObject(entity);
                    });
                };
                Repository.prototype.fromEntityList = function (entityList) {
                    var _this = this;
                    return entityList.map(function (entity) {
                        return _this.entityRepository.fromObject(entity);
                    });
                };
                return Repository;
            })();
            EntityList.Repository = Repository;
        })(EntityList = Base.EntityList || (Base.EntityList = {}));
    })(Base = Cat.Base || (Cat.Base = {}));
})(Cat || (Cat = {}));
/// <reference path="../../Base/EntityList/Model.ts" />
/// <reference path="../Command/Model.ts" />
var Cat;
(function (Cat) {
    var Models;
    (function (Models) {
        var CommandList;
        (function (CommandList) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(commands, name, url) {
                    if (commands === void 0) { commands = []; }
                    if (name === void 0) { name = ''; }
                    if (url === void 0) { url = ''; }
                    _super.call(this, commands);
                    this.name = name;
                    this.url = url;
                }
                Model.prototype.clear = function () {
                    this.name = '';
                    this.url = '';
                    _super.prototype.clear.call(this);
                };
                return Model;
            })(Cat.Base.EntityList.Model);
            CommandList.Model = Model;
        })(CommandList = Models.CommandList || (Models.CommandList = {}));
    })(Models = Cat.Models || (Cat.Models = {}));
})(Cat || (Cat = {}));
/// <reference path="../../Base/EntityList/Repository.ts" />
/// <reference path="../Command/Repository.ts" />
/// <reference path="./Model.ts" />
var Cat;
(function (Cat) {
    var Models;
    (function (Models) {
        var CommandList;
        (function (CommandList) {
            var Repository = (function (_super) {
                __extends(Repository, _super);
                function Repository() {
                    _super.call(this, new Models.Command.Repository());
                }
                Repository.prototype.toObject = function (commandList) {
                    return {
                        'commandList': _super.prototype.toEntityList.call(this, commandList),
                        'name': commandList.name,
                        'url': commandList.url
                    };
                };
                Repository.prototype.fromObject = function (commandList) {
                    var commandListObject = _super.prototype.fromEntityList.call(this, commandList.commandList);
                    return new CommandList.Model(commandListObject, commandList.name, commandList.url);
                };
                return Repository;
            })(Cat.Base.EntityList.Repository);
            CommandList.Repository = Repository;
        })(CommandList = Models.CommandList || (Models.CommandList = {}));
    })(Models = Cat.Models || (Cat.Models = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../../Models/CommandList/Model.ts" />
/// <reference path="../Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var PlayCommandList;
                (function (PlayCommandList) {
                    var Model = (function (_super) {
                        __extends(Model, _super);
                        function Model(commandList) {
                            _super.call(this);
                            this.commandList = commandList;
                        }
                        Model.messageName = 'playCommandList';
                        return Model;
                    })(Message.Model);
                    PlayCommandList.Model = Model;
                })(PlayCommandList = Message.PlayCommandList || (Message.PlayCommandList = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../../Models/CommandList/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var PlayCommandList;
                (function (PlayCommandList) {
                    var Repository = (function (_super) {
                        __extends(Repository, _super);
                        function Repository() {
                            _super.apply(this, arguments);
                            this.repository = new Cat.Models.CommandList.Repository();
                        }
                        Repository.prototype.toObject = function (message) {
                            return {
                                'name': PlayCommandList.Model.messageName,
                                'content': this.repository.toObject(message.commandList)
                            };
                        };
                        Repository.prototype.fromObject = function (message) {
                            return new PlayCommandList.Model(this.repository.fromObject(message['content']));
                        };
                        return Repository;
                    })(Message.Repository);
                    PlayCommandList.Repository = Repository;
                })(PlayCommandList = Message.PlayCommandList || (Message.PlayCommandList = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../Base/Entity/Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var SeleniumCommand;
            (function (SeleniumCommand) {
                var Model = (function (_super) {
                    __extends(Model, _super);
                    function Model(type, args) {
                        if (type === void 0) { type = ''; }
                        if (args === void 0) { args = []; }
                        _super.call(this);
                        this.type = type;
                        this.args = args;
                    }
                    return Model;
                })(Cat.Base.Entity.Model);
                SeleniumCommand.Model = Model;
            })(SeleniumCommand = Models.SeleniumCommand || (Models.SeleniumCommand = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../Base/Entity/Repository.ts" />
/// <reference path="./Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var SeleniumCommand;
            (function (SeleniumCommand) {
                var Repository = (function () {
                    function Repository() {
                    }
                    Repository.prototype.toObject = function (command) {
                        return {
                            'type': command.type,
                            'args': command.args
                        };
                    };
                    Repository.prototype.fromObject = function (command) {
                        return new SeleniumCommand.Model(command.type, command.args);
                    };
                    return Repository;
                })();
                SeleniumCommand.Repository = Repository;
            })(SeleniumCommand = Models.SeleniumCommand || (Models.SeleniumCommand = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../SeleniumCommand/Model.ts" />
/// <reference path="../Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var PlaySeleniumCommandExecute;
                (function (PlaySeleniumCommandExecute) {
                    var Model = (function (_super) {
                        __extends(Model, _super);
                        function Model(command) {
                            _super.call(this);
                            this.command = command;
                        }
                        Model.messageName = 'playSeleniumCommandExecute';
                        return Model;
                    })(Message.Model);
                    PlaySeleniumCommandExecute.Model = Model;
                })(PlaySeleniumCommandExecute = Message.PlaySeleniumCommandExecute || (Message.PlaySeleniumCommandExecute = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../SeleniumCommand/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var PlaySeleniumCommandExecute;
                (function (PlaySeleniumCommandExecute) {
                    var Repository = (function (_super) {
                        __extends(Repository, _super);
                        function Repository() {
                            _super.apply(this, arguments);
                            this.repository = new Models.SeleniumCommand.Repository();
                        }
                        Repository.prototype.toObject = function (message) {
                            return {
                                'name': PlaySeleniumCommandExecute.Model.messageName,
                                'content': this.repository.toObject(message.command)
                            };
                        };
                        Repository.prototype.fromObject = function (message) {
                            return new PlaySeleniumCommandExecute.Model(this.repository.fromObject(message['content']));
                        };
                        return Repository;
                    })(Message.Repository);
                    PlaySeleniumCommandExecute.Repository = Repository;
                })(PlaySeleniumCommandExecute = Message.PlaySeleniumCommandExecute || (Message.PlaySeleniumCommandExecute = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../SeleniumCommand/Model.ts" />
/// <reference path="../Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var PlaySeleniumCommandResult;
                (function (PlaySeleniumCommandResult) {
                    var Model = (function (_super) {
                        __extends(Model, _super);
                        //page reloading
                        function Model(command) {
                            if (command === void 0) { command = 'OK'; }
                            _super.call(this);
                            this.command = command;
                            this.validCommand = [
                                'OK',
                                'NG'
                            ];
                            if (!~this.validCommand.indexOf(command)) {
                                throw new Error('invalid command,' + command);
                            }
                        }
                        Model.messageName = 'playSeleniumCommandResult';
                        return Model;
                    })(Message.Model);
                    PlaySeleniumCommandResult.Model = Model;
                })(PlaySeleniumCommandResult = Message.PlaySeleniumCommandResult || (Message.PlaySeleniumCommandResult = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../SeleniumCommand/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var PlaySeleniumCommandResult;
                (function (PlaySeleniumCommandResult) {
                    var Repository = (function (_super) {
                        __extends(Repository, _super);
                        function Repository() {
                            _super.apply(this, arguments);
                        }
                        Repository.prototype.toObject = function (message) {
                            return {
                                'name': PlaySeleniumCommandResult.Model.messageName,
                                'content': message.command
                            };
                        };
                        Repository.prototype.fromObject = function (message) {
                            return new PlaySeleniumCommandResult.Model(message['content']);
                        };
                        return Repository;
                    })(Message.Repository);
                    PlaySeleniumCommandResult.Repository = Repository;
                })(PlaySeleniumCommandResult = Message.PlaySeleniumCommandResult || (Message.PlaySeleniumCommandResult = {}));
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="./AddCommand/Repository.ts" />
/// <reference path="./PlayCommand/Repository.ts" />
/// <reference path="./PlayCommandList/Repository.ts" />
/// <reference path="./PlaySeleniumCommandExecute/Repository.ts" />
/// <reference path="./PlaySeleniumCommandResult/Repository.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var Message;
            (function (Message) {
                var Dispatcher = (function () {
                    function Dispatcher() {
                        this.messageAddCommentModel = new Message.AddComment.Repository();
                        this.messagePlayCommandModel = new Message.PlayCommand.Repository();
                        this.messagePlayCommandListModel = new Message.PlayCommandList.Repository();
                        this.messagePlaySeleniumCommandExecuteModel = new Message.PlaySeleniumCommandExecute.Repository();
                        this.messagePlaySeleniumCommandResultModel = new Message.PlaySeleniumCommandResult.Repository();
                    }
                    Dispatcher.prototype.dispatch = function (message, dispatcher) {
                        if (message['name'] == Message.AddComment.Model.messageName) {
                            dispatcher.MessageAddCommentModel(this.messageAddCommentModel.fromObject(message));
                        }
                        else if (message['name'] == Message.PlayCommand.Model.messageName) {
                            dispatcher.MessagePlayCommandModel(this.messagePlayCommandModel.fromObject(message));
                        }
                        else if (message['name'] == Message.PlayCommandList.Model.messageName) {
                            dispatcher.MessagePlayCommandListModel(this.messagePlayCommandListModel.fromObject(message));
                        }
                        else if (message['name'] == Message.PlaySeleniumCommandExecute.Model.messageName) {
                            dispatcher.MessagePlaySeleniumCommandExecuteModel(this.messagePlaySeleniumCommandExecuteModel.fromObject(message));
                        }
                        else if (message['name'] == Message.PlaySeleniumCommandResult.Model.messageName) {
                            dispatcher.MessagePlaySeleniumCommandResultModel(this.messagePlaySeleniumCommandResultModel.fromObject(message));
                        }
                        else {
                            throw new Error('Invalid message: ' + JSON.stringify(message));
                        }
                    };
                    return Dispatcher;
                })();
                Message.Dispatcher = Dispatcher;
            })(Message = Models.Message || (Models.Message = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../Models/Message/PlaySeleniumCommandResult/Repository.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Tab;
            (function (Tab) {
                var Model = (function (_super) {
                    __extends(Model, _super);
                    function Model(tab) {
                        _super.call(this);
                        this.tab = tab;
                        this.sendMessageResponseInterval = 1000;
                        this.port = chrome.tabs.connect(this.tab.id);
                    }
                    Model.prototype.getTabId = function () {
                        return this.tab.id;
                    };
                    Model.prototype.getTabURL = function () {
                        return this.tab.url;
                    };
                    Model.prototype.checkOnUpdated = function () {
                        var _this = this;
                        var updated = false;
                        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
                            if (_this.tab.id !== tabId) {
                                return;
                            }
                            _this.disconnect();
                            if (changeInfo.status === 'complete') {
                                updated = false;
                                return;
                            }
                            if (updated) {
                                return;
                            }
                            updated = true;
                            _this.emit('onUpdated');
                        });
                    };
                    Model.prototype.postMessage = function (message) {
                        this.port.postMessage(message);
                    };
                    Model.prototype.sendMessage = function (message) {
                        var _this = this;
                        return new Promise(function (resolve, reject) {
                            chrome.tabs.sendMessage(_this.tab.id, message, function (result) {
                                if (!result) {
                                    return reject('missing result');
                                }
                                var success = function () {
                                    if (!_this.port) {
                                        return;
                                    }
                                    if (_this.tab.status !== 'complete') {
                                        return;
                                    }
                                    clearTimeout(timeout);
                                    clearInterval(interval);
                                    var message = new Application.Models.Message.PlaySeleniumCommandResult.Model(result);
                                    resolve(message.command);
                                };
                                var interval = setInterval(success, _this.sendMessageResponseInterval);
                                var timeout = setTimeout(function () {
                                    clearInterval(interval);
                                    return reject('sendMessage timeout');
                                }, _this.sendMessageResponseInterval * 10);
                                success();
                            });
                        });
                    };
                    Model.prototype.connect = function () {
                        var _this = this;
                        this.port.onDisconnect.addListener(function () {
                            _this.disconnect();
                        });
                        chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
                            if (_this.tab.id !== tabId) {
                                return;
                            }
                            _this.emit('onRemoved');
                        });
                        this.checkOnUpdated();
                    };
                    Model.prototype.onMessage = function (callback) {
                        this.port.onMessage.addListener(callback);
                    };
                    Model.prototype.onDisconnect = function (callback) {
                        this.port.onDisconnect.addListener(callback);
                    };
                    Model.prototype.disconnect = function () {
                        this.port = null;
                        delete this.port;
                    };
                    return Model;
                })(EventEmitter);
                Tab.Model = Model;
            })(Tab = Services.Tab || (Services.Tab = {}));
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Tab;
            (function (Tab) {
                var Manager = (function () {
                    function Manager(tab, initialize) {
                        this.initialize = initialize;
                        this.onMessageListeners = [];
                        this.onDisconnectListeners = [];
                        this.onConnectListeners = [];
                        this.closeMessage = 'Close test case?';
                        this.tab = new Tab.Model(tab);
                    }
                    Manager.prototype.connect = function () {
                        var _this = this;
                        this.tab.connect();
                        this.tab.addListener('onRemoved', function () {
                            if (confirm(_this.closeMessage)) {
                                window.close();
                            }
                        });
                        this.tab.addListener('onUpdated', function () {
                            _this.reloadTab();
                        });
                        return this.initialize(this);
                    };
                    Manager.prototype.reloadTab = function () {
                        var _this = this;
                        var tabId = this.tab.getTabId();
                        return new Promise(function (resolve, reject) {
                            _this.initialize(_this).then(function () {
                                chrome.tabs.get(tabId, function (tab) {
                                    _this.tab = new Tab.Model(tab);
                                    _this.onConnectListeners.forEach(function (listener) { return listener(); });
                                    _this.onMessageListeners.forEach(function (listener) { return _this.tab.onMessage(listener); });
                                    _this.onDisconnectListeners.forEach(function (listener) { return _this.tab.onDisconnect(listener); });
                                    resolve();
                                });
                            }).catch(reject);
                        });
                    };
                    Manager.prototype.getTabId = function () {
                        return this.tab.getTabId();
                    };
                    Manager.prototype.getTabURL = function () {
                        return this.tab.getTabURL();
                    };
                    Manager.prototype.postMessage = function (message) {
                        this.tab.postMessage(message);
                    };
                    Manager.prototype.sendMessage = function (message) {
                        return this.tab.sendMessage(message);
                    };
                    Manager.prototype.onMessage = function (callback) {
                        this.onMessageListeners.push(callback);
                        this.tab.onMessage(callback);
                    };
                    Manager.prototype.onConnect = function (callback) {
                        this.onConnectListeners.push(callback);
                    };
                    Manager.prototype.onDisconnect = function (callback) {
                        this.onDisconnectListeners.push(callback);
                        this.tab.onDisconnect(callback);
                    };
                    return Manager;
                })();
                Tab.Manager = Manager;
            })(Tab = Services.Tab || (Services.Tab = {}));
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var CommandSelectList = (function () {
                function CommandSelectList() {
                }
                CommandSelectList.prototype.load = function (file) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', file);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState !== 4) {
                                return;
                            }
                            if (xhr.status !== 0 && xhr.status !== 200) {
                                return reject(CommandSelectList.errorMessage + file);
                            }
                            _this.documentElement = xhr.responseXML.documentElement;
                            resolve();
                        };
                        xhr.send(null);
                    });
                };
                CommandSelectList.prototype.getDocRoot = function () {
                    return this.documentElement;
                };
                CommandSelectList.prototype.gets = function () {
                    return [].slice.call(this.documentElement.querySelectorAll('function'));
                };
                CommandSelectList.errorMessage = 'command list xml load failed.\n';
                return CommandSelectList;
            })();
            Services.CommandSelectList = CommandSelectList;
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Selenium;
            (function (Selenium) {
                var Base = (function () {
                    function Base(callback) {
                        var _this = this;
                        this.interval = 1;
                        // for selenium-runner
                        window.getBrowser = function () {
                            return {
                                'selectedBrowser': {
                                    'contentWindow': window
                                }
                            };
                        };
                        window.lastWindow = window;
                        window.testCase = new window.TestCase;
                        window.selenium = callback();
                        window.editor = {
                            'app': {
                                'getOptions': function () {
                                    return {
                                        'timeout': _this.interval
                                    };
                                }
                            },
                            'view': {
                                'rowUpdated': function () {
                                },
                                'scrollToRow': function () {
                                }
                            }
                        };
                        this.testCase = window.testCase;
                        this.selenium = window.selenium;
                        this.selenium.browserbot.selectWindow(null);
                        this.commandFactory = new window.CommandHandlerFactory();
                        this.commandFactory.registerAll(this.selenium);
                    }
                    Base.prototype.getInterval = function () {
                        return this.interval;
                    };
                    Base.prototype.start = function () {
                        var _this = this;
                        return new Promise(function (resolve) {
                            _this.currentTest = new window.IDETestLoop(_this.commandFactory, {
                                'testComplete': resolve
                            });
                            _this.currentTest.getCommandInterval = function () {
                                return _this.getInterval();
                            };
                            _this.testCase.debugContext.reset();
                            _this.currentTest.start();
                        });
                    };
                    Base.setApiDocs = function (file) {
                        return new Promise(function (resolve, reject) {
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', file);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState !== 4) {
                                    return;
                                }
                                if (xhr.status !== 0 && xhr.status !== 200) {
                                    return reject(Base.errorMessage + file);
                                }
                                window.Command.apiDocuments = new Array(xhr.responseXML.documentElement);
                                resolve();
                            };
                            xhr.send(null);
                        });
                    };
                    Base.errorMessage = 'selenium command xml load failed.\n';
                    return Base;
                })();
                Selenium.Base = Base;
            })(Selenium = Services.Selenium || (Services.Selenium = {}));
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../Models/CommandList/Model.ts" />
/// <reference path="../../Models/Message/PlaySeleniumCommandExecute/Repository.ts" />
/// <reference path="../../Models/Message/Dispatcher.ts" />
/// <reference path="../Tab/Manager.ts" />
/// <reference path="./Base.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Selenium;
            (function (Selenium) {
                var Sender = (function (_super) {
                    __extends(Sender, _super);
                    function Sender(manager, messageDispatcher) {
                        _super.call(this, function () { return new window.ChromeExtensionBackedSelenium(manager.getTabURL(), ''); });
                        this.manager = manager;
                        this.messageDispatcher = messageDispatcher;
                        this.messagePlaySeleniumCommandExecuteRepository = new Application.Models.Message.PlaySeleniumCommandExecute.Repository();
                        window.shouldAbortCurrentCommand = function () { return false; };
                        manager.onConnect(function () {
                            window.shouldAbortCurrentCommand = function () { return false; };
                        });
                        manager.onDisconnect(function () {
                            window.shouldAbortCurrentCommand = function () { return false; };
                        });
                    }
                    Sender.prototype.addCommandList = function (commandList) {
                        var _this = this;
                        this.testCase.commands = [];
                        commandList.getList().forEach(function (command) {
                            var selCommand = new window.Command(command.type, command.target, command.value);
                            _this.testCase.commands.push(selCommand);
                        });
                    };
                    Sender.prototype.execute = function (command, args, callback) {
                        var _this = this;
                        var model = new Application.Models.SeleniumCommand.Model(command, args);
                        var message = new Application.Models.Message.PlaySeleniumCommandExecute.Model(model);
                        this.manager.sendMessage(this.messagePlaySeleniumCommandExecuteRepository.toObject(message)).then(function (message) {
                            _this.messageDispatcher.dispatch(message, {
                                MessagePlaySeleniumCommandResultModel: function (message) { return callback('OK', true); }
                            });
                        });
                    };
                    return Sender;
                })(Selenium.Base);
                Selenium.Sender = Sender;
            })(Selenium = Services.Selenium || (Services.Selenium = {}));
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../../Models/CommandList/Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Models;
        (function (Models) {
            var CommandGrid;
            (function (CommandGrid) {
                var Model = (function (_super) {
                    __extends(Model, _super);
                    function Model() {
                        _super.apply(this, arguments);
                    }
                    Model.prototype.getCommandList = function () {
                        var commands = this.getList().filter(function (command) {
                            return !!command.type;
                        });
                        var commandList = new Cat.Models.CommandList.Model(commands);
                        return commandList;
                    };
                    return Model;
                })(Cat.Base.EntityList.Model);
                CommandGrid.Model = Model;
            })(CommandGrid = Models.CommandGrid || (Models.CommandGrid = {}));
        })(Models = Application.Models || (Application.Models = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../Models/Message/AddCommand/Model.ts" />
/// <reference path="../Models/Message/Dispatcher.ts" />
/// <reference path="../Services/Tab/Manager.ts" />
/// <reference path="../Services/CommandSelectList.ts" />
/// <reference path="../Services/Selenium/Sender.ts" />
/// <reference path="../Models/CommandGrid/Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Controllers;
        (function (Controllers) {
            var Autopilot;
            (function (Autopilot) {
                var Controller = (function () {
                    function Controller($scope, manager, commandGrid, messageDispatcher, seleniumSender, commandSelectList) {
                        $scope.commandGrid = commandGrid;
                        $scope.playSpeed = '100';
                        $scope.playAll = function () {
                            seleniumSender.addCommandList($scope.commandGrid.getCommandList());
                            seleniumSender.start();
                        };
                        $scope.changeSpeed = function () {
                            seleniumSender.interval = parseInt($scope.playSpeed);
                        };
                        $scope.addCommand = function () {
                            $scope.commandGrid.add(new Cat.Models.Command.Model());
                        };
                        $scope.deleteCommand = function (command) {
                            $scope.commandGrid.remove(command);
                        };
                        $scope.recordingStatus = true;
                        $scope.startRecording = function () {
                            $scope.recordingStatus = true;
                        };
                        $scope.stopRecording = function () {
                            $scope.recordingStatus = false;
                        };
                        $scope.playCurrent = function () {
                            //@TODO
                        };
                        $scope.playStop = function () {
                            //@TODO
                        };
                        $scope.selectList = commandSelectList.gets().map(function (elem) { return elem.getAttribute('name'); });
                        this.bindTabManager($scope, manager, messageDispatcher);
                    }
                    Controller.prototype.bindTabManager = function ($scope, manager, messageDispatcher) {
                        manager.onMessage(function (message) {
                            messageDispatcher.dispatch(message, {
                                MessageAddCommentModel: function (message) {
                                    if (!$scope.recordingStatus) {
                                        return;
                                    }
                                    $scope.$apply(function () {
                                        if (!$scope.commandGrid.getList().length) {
                                            $scope.baseURL = manager.getTabURL();
                                            $scope.commandGrid.add(new Cat.Models.Command.Model('open', '', $scope.baseURL));
                                        }
                                        $scope.commandGrid.add(message.command);
                                    });
                                }
                            });
                        });
                    };
                    return Controller;
                })();
                Autopilot.Controller = Controller;
            })(Autopilot = Controllers.Autopilot || (Controllers.Autopilot = {}));
        })(Controllers = Application.Controllers || (Application.Controllers = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Config = (function () {
                function Config() {
                }
                Config.injectScripts = [
                    "js/lib/xpath.js",
                    "js/lib/css-selector.js",
                    "js/selenium-ide/tools.js",
                    "js/selenium-ide/htmlutils.js",
                    "js/selenium-ide/selenium-browserdetect.js",
                    "js/selenium-ide/selenium-atoms.js",
                    "js/selenium-ide/selenium-browserbot.js",
                    "js/selenium-ide/selenium-api.js",
                    "js/selenium-ide/selenium-executionloop.js",
                    "js/selenium-ide/selenium-testrunner.js",
                    "js/selenium-ide/selenium-commandhandlers.js",
                    "js/selenium-ide/selenium-runner.js",
                    "js/selenium-ide/recorder.js",
                    "js/selenium-ide/recorder-handlers.js",
                    "js/selenium-ide/testCase.js",
                    "bower_components/eventemitter2/lib/eventemitter2.js",
                    "js/content_scripts.js"
                ];
                Config.seleniumApiXML = '/js/selenium-ide/iedoc-core.xml';
                return Config;
            })();
            Services.Config = Config;
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Tab;
            (function (Tab) {
                var InjectScripts = (function () {
                    function InjectScripts(injectScripts_) {
                        this.injectScripts_ = injectScripts_;
                        this.injectScripts = injectScripts_.slice();
                    }
                    // set double loading flag.
                    InjectScripts.prototype.executeEnd = function (tabid, resolve) {
                        chrome.tabs.executeScript(tabid, {
                            'code': 'this.extensionContentLoaded = true'
                        }, resolve);
                    };
                    InjectScripts.prototype.executeScript = function (tabid, injectScript) {
                        var _this = this;
                        return new Promise(function (resolve) {
                            //コードをxhrでキャッシュしてfileではなく、codeで渡してユーザ動作をブロックしつつ実行できないか
                            chrome.tabs.executeScript(tabid, {
                                'runAt': 'document_start',
                                'file': injectScript
                            }, function () {
                                if (_this.injectScripts.length) {
                                    return _this.executeScript(tabid, _this.injectScripts.shift()).then(resolve);
                                }
                                _this.executeEnd(tabid, resolve);
                            });
                        });
                    };
                    InjectScripts.prototype.connect = function (tabid) {
                        var _this = this;
                        return new Promise(function (resolve) {
                            // double loading check.
                            chrome.tabs.executeScript(tabid, {
                                'code': 'this.extensionContentLoaded'
                            }, function (result) {
                                if (result && result.length && result[0]) {
                                    return resolve();
                                }
                                _this.executeScript(tabid, _this.injectScripts.shift()).then(resolve);
                            });
                        });
                    };
                    return InjectScripts;
                })();
                Tab.InjectScripts = InjectScripts;
            })(Tab = Services.Tab || (Services.Tab = {}));
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="InjectScripts.ts" />
/// <reference path="../Config.ts" />
/// <reference path="Manager" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Tab;
            (function (Tab) {
                var Initializer = (function () {
                    function Initializer(calledTabId) {
                        this.calledTabId = calledTabId;
                        var injectScripts = Services.Config.injectScripts;
                        this.injectScripts = new Tab.InjectScripts(injectScripts);
                    }
                    Initializer.prototype.start = function () {
                        var _this = this;
                        return new Promise(function (resolve, reject) {
                            _this.getTab(_this.calledTabId).then(function (tab) {
                                _this.manager = new Tab.Manager(tab, function (manager) {
                                    return _this.injectScripts.connect(manager.getTabId());
                                });
                                _this.manager.connect().then(function () { return resolve(_this.manager); });
                            }).catch(reject);
                        });
                    };
                    Initializer.prototype.getTab = function (calledTabId) {
                        return new Promise(function (resolve, reject) {
                            chrome.tabs.get(parseInt(calledTabId), function (tab) {
                                if (tab && tab.id) {
                                    resolve(tab);
                                }
                                else {
                                    reject('Security Error.\ndoes not run on "chrome://" page.\n');
                                }
                            });
                        });
                    };
                    return Initializer;
                })();
                Tab.Initializer = Initializer;
            })(Tab = Services.Tab || (Services.Tab = {}));
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="Autopilot.ts" />
/// <reference path="../Services/Config.ts" />
/// <reference path="../Services/Tab/Initializer.ts" />
/// <reference path="../Services/Selenium/Sender.ts" />
/// <reference path="../Models/CommandGrid/Model.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Controllers;
        (function (Controllers) {
            var WindowCtrl = (function () {
                function WindowCtrl(calledTabId) {
                    this.calledTabId = calledTabId;
                }
                WindowCtrl.prototype.initAngular = function (tabManager, commandSelectList) {
                    return new Promise(function (resolve) {
                        var autopilotApp = angular.module('AutopilotApp', ['ui.sortable']).factory('tabManager', function () { return tabManager; }).factory('commandSelectList', function () { return commandSelectList; }).service('messageDispatcher', Application.Models.Message.Dispatcher).factory('seleniumSender', function (manager, messageDispatcher) {
                            applicationServicesSeleniumSender = new Application.Services.Selenium.Sender(manager, messageDispatcher);
                            return applicationServicesSeleniumSender;
                        }).factory('commandGrid', function () {
                            return new Application.Models.CommandGrid.Model();
                        }).controller('Autopilot', Controllers.Autopilot.Controller);
                        angular.bootstrap(document, ['AutopilotApp']);
                        resolve(autopilotApp);
                    });
                };
                WindowCtrl.prototype.initCommandSelectList = function () {
                    var seleniumApiXMLFile = chrome.runtime.getURL(Application.Services.Config.seleniumApiXML);
                    return Promise.all([
                        new Promise(function (resolve, reject) {
                            var commandSelectList = new Application.Services.CommandSelectList();
                            commandSelectList.load(seleniumApiXMLFile).then(resolve).catch(reject);
                            return commandSelectList;
                        }),
                        new Promise(function (resolve, reject) {
                            Application.Services.Selenium.Sender.setApiDocs(seleniumApiXMLFile).then(resolve).catch(reject);
                        }),
                        new Promise(function (resolve) {
                            angular.element(document).ready(resolve);
                        })
                    ]);
                };
                WindowCtrl.prototype.initTabInitializer = function (resolve, catchError) {
                    var _this = this;
                    (new Promise(function (resolve, reject) {
                        var initializer = new Application.Services.Tab.Initializer(_this.calledTabId);
                        initializer.start().then(resolve).catch(reject);
                    })).then(function (manager) {
                        _this.initCommandSelectList().then(function (results) {
                            var commandSelectList = results.shift();
                            _this.initAngular(manager, commandSelectList).then(resolve).catch(catchError);
                        }).catch(catchError);
                    }).catch(catchError);
                };
                WindowCtrl.prototype.initialize = function () {
                    return new Promise(this.initTabInitializer.bind(this));
                };
                return WindowCtrl;
            })();
            Controllers.WindowCtrl = WindowCtrl;
        })(Controllers = Application.Controllers || (Application.Controllers = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="_loadtsd.ts" />
/// <reference path="Applications/Controllers/WindowCtrl.ts" />
/// <reference path="Applications/Services/Selenium/Sender.ts" />
var autopilotApp;
var applicationServicesSeleniumSender;
(function () {
    if ('undefined' !== typeof TestInitialize) {
        return;
    }
    var calledTabId = location.hash.replace(/^#/, '');
    var catchError = function (messages) {
        alert([].concat(messages).join('\n'));
    };
    var windowCtrl = new Cat.Application.Controllers.WindowCtrl(calledTabId);
    windowCtrl.initialize().then(function () {
        console.log('load success');
    }).catch(catchError);
})();
