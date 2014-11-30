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
var Cat;
(function (Cat) {
    var Base;
    (function (Base) {
        var Service = (function () {
            function Service() {
            }
            return Service;
        })();
        Base.Service = Service;
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
/*
* Mock RecorderObserver for Selenium Recorder
* */
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var RecorderObserver = (function (_super) {
                __extends(RecorderObserver, _super);
                function RecorderObserver() {
                    _super.apply(this, arguments);
                    this.recordingEnabled = true;
                    this.isSidebar = false;
                }
                RecorderObserver.prototype.getUserLog = function () {
                    return console;
                };
                RecorderObserver.prototype.addCommand = function (command, target, value, window, insertBeforeLastCommand) {
                    this.emit('addCommand', command, target, value, window, insertBeforeLastCommand);
                };
                RecorderObserver.prototype.onUnloadDocument = function (doc) {
                    this.emit('onUnloadDocument', doc);
                };
                return RecorderObserver;
            })(EventEmitter);
            Services.RecorderObserver = RecorderObserver;
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../../Models/SeleniumCommand/Model.ts" />
/// <reference path="./Base.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Selenium;
            (function (Selenium) {
                var Receiver = (function (_super) {
                    __extends(Receiver, _super);
                    function Receiver() {
                        _super.call(this, function () { return window.createSelenium(location.href, true); });
                        this.errorMessage = 'missing command: ';
                    }
                    Receiver.prototype.execute = function (model) {
                        var _this = this;
                        if (this.selenium[model.type]) {
                            return this.exec(function () { return _this.selenium[model.type].apply(_this.selenium, model.args); });
                        }
                        var commandName = 'do' + model.type.replace(/^\w/, function (w) { return w.toUpperCase(); });
                        if (this.selenium[commandName]) {
                            return this.exec(function () { return _this.selenium[commandName].apply(_this.selenium, model.args); });
                        }
                        var errorMessage = this.errorMessage + JSON.stringify(model);
                        setTimeout(function () {
                            throw new Error(errorMessage);
                        });
                        return 'ERROR ' + errorMessage;
                    };
                    Receiver.prototype.exec = function (exec) {
                        try {
                            exec();
                            return 'OK';
                        }
                        catch (e) {
                            setTimeout(function () {
                                throw e;
                            });
                            return 'ERROR';
                        }
                    };
                    return Receiver;
                })(Selenium.Base);
                Selenium.Receiver = Receiver;
            })(Selenium = Services.Selenium || (Services.Selenium = {}));
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="../Models/SeleniumCommand/Model.ts" />
/// <reference path="../Models/Message/Dispatcher.ts" />
/// <reference path="../Services/RecorderObserver.ts" />
/// <reference path="../Services/Selenium/Receiver.ts" />
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Controllers;
        (function (Controllers) {
            var ContentScriptsCtrl = (function () {
                function ContentScriptsCtrl(port) {
                    this.port = port;
                    this.messagePlaySeleniumCommandResultRepository = new Application.Models.Message.PlaySeleniumCommandResult.Repository();
                    this.messageAddCommentRepository = new Application.Models.Message.AddComment.Repository();
                    this.recorderObserver = new Application.Services.RecorderObserver();
                    this.messageDispatcher = new Application.Models.Message.Dispatcher();
                    this.SeleniumReceiver = new Application.Services.Selenium.Receiver();
                }
                ContentScriptsCtrl.prototype.onMessage = function (message, sender, sendResponse) {
                    var _this = this;
                    this.messageDispatcher.dispatch(message, {
                        MessagePlaySeleniumCommandExecuteModel: function (message) {
                            Recorder.deregister(_this.recorderObserver, window);
                            var result = _this.SeleniumReceiver.execute(message.command);
                            Recorder.register(_this.recorderObserver, window);
                            var resultMessage = new Application.Models.Message.PlaySeleniumCommandResult.Model(result);
                            sendResponse(_this.messagePlaySeleniumCommandResultRepository.toObject(resultMessage));
                        }
                    });
                };
                ContentScriptsCtrl.prototype.addCommand = function (commandName, target, value, window, insertBeforeLastCommand) {
                    var message = {
                        'content': {
                            'command': {
                                'type': commandName,
                                'target': target,
                                'value': value
                            },
                            'insertBeforeLastCommand': insertBeforeLastCommand
                        }
                    };
                    var addCommentMessage = this.messageAddCommentRepository.fromObject(message);
                    this.port.postMessage(this.messageAddCommentRepository.toObject(addCommentMessage));
                };
                ContentScriptsCtrl.prototype.initialize = function () {
                    var _this = this;
                    Recorder.register(this.recorderObserver, window);
                    this.recorderObserver.addListener('addCommand', function (commandName, target, value, window, insertBeforeLastCommand) {
                        _this.addCommand(commandName, target, value, window, insertBeforeLastCommand);
                    });
                    this.port.onDisconnect.addListener(function () {
                        Recorder.deregister(_this.recorderObserver, window);
                    });
                    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                        _this.onMessage(message, sender, sendResponse);
                    });
                };
                return ContentScriptsCtrl;
            })();
            Controllers.ContentScriptsCtrl = ContentScriptsCtrl;
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
                    "js/application.js",
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
var applicationServicesSeleniumSender;
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
                WindowCtrl.prototype.initAngular = function (manager, commandSelectList) {
                    return new Promise(function (resolve) {
                        var autopilotApp = angular.module('AutopilotApp', ['ui.sortable']).factory('manager', function () { return manager; }).factory('commandSelectList', function () { return commandSelectList; }).service('messageDispatcher', Application.Models.Message.Dispatcher).factory('seleniumSender', function (manager, messageDispatcher) {
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
                            commandSelectList.load(seleniumApiXMLFile).then(function () { return resolve(commandSelectList); }).catch(reject);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2FwcGxpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlcyI6WyIuLi9zcmMvX2RlZmluZS50cyIsIi4uL3NyYy9CYXNlL1VVSUQudHMiLCIuLi9zcmMvQmFzZS9JZGVudGl0eS50cyIsIi4uL3NyYy9CYXNlL1NlcnZpY2UudHMiLCIuLi9zcmMvQmFzZS9FbnRpdHkvTW9kZWwudHMiLCIuLi9zcmMvTW9kZWxzL0NvbW1hbmQvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9BZGRDb21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5L1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvTW9kZWxzL0NvbW1hbmQvUmVwb3NpdG9yeS50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvUmVwb3NpdG9yeS50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvQWRkQ29tbWFuZC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5Q29tbWFuZC9Nb2RlbC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvUGxheUNvbW1hbmQvUmVwb3NpdG9yeS50cyIsIi4uL3NyYy9CYXNlL0VudGl0eUxpc3QvTW9kZWwudHMiLCIuLi9zcmMvQmFzZS9FbnRpdHlMaXN0L1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvTW9kZWxzL0NvbW1hbmRMaXN0L01vZGVsLnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kTGlzdC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5Q29tbWFuZExpc3QvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlDb21tYW5kTGlzdC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvU2VsZW5pdW1Db21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvU2VsZW5pdW1Db21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0L01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0L1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL0Rpc3BhdGNoZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1RhYi9Nb2RlbC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvU2VydmljZXMvVGFiL01hbmFnZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL0NvbW1hbmRTZWxlY3RMaXN0LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9TZWxlbml1bS9CYXNlLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9TZWxlbml1bS9TZW5kZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9Db21tYW5kR3JpZC9Nb2RlbC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvQ29udHJvbGxlcnMvQXV0b3BpbG90LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9SZWNvcmRlck9ic2VydmVyLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9TZWxlbml1bS9SZWNlaXZlci50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvQ29udHJvbGxlcnMvQ29udGVudFNjcmlwdHNDdHJsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9Db25maWcudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1RhYi9JbmplY3RTY3JpcHRzLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9UYWIvSW5pdGlhbGl6ZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL0NvbnRyb2xsZXJzL1dpbmRvd0N0cmwudHMiXSwibmFtZXMiOlsiQ2F0IiwiQ2F0LlVVSUQiLCJDYXQuVVVJRC5JbnZhbGlkVVVJREZvcm1hdCIsIkNhdC5VVUlELkludmFsaWRVVUlERm9ybWF0LmNvbnN0cnVjdG9yIiwiQ2F0LlVVSUQuVVVJRCIsIkNhdC5VVUlELlVVSUQuY29uc3RydWN0b3IiLCJDYXQuVVVJRC5VVUlELnRvU3RyaW5nIiwiQ2F0LlVVSUQuVVVJRC5mcm9tU3RyaW5nIiwiQ2F0LlVVSUQuVVVJRC5TNCIsIkNhdC5CYXNlIiwiQ2F0LkJhc2UuSWRlbnRpdHkiLCJDYXQuQmFzZS5JZGVudGl0eS5jb25zdHJ1Y3RvciIsIkNhdC5CYXNlLklkZW50aXR5LmVxIiwiQ2F0LkJhc2UuU2VydmljZSIsIkNhdC5CYXNlLlNlcnZpY2UuY29uc3RydWN0b3IiLCJDYXQuQmFzZS5FbnRpdHkiLCJDYXQuQmFzZS5FbnRpdHkuTW9kZWwiLCJDYXQuQmFzZS5FbnRpdHkuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQmFzZS5FbnRpdHkuTW9kZWwuZXEiLCJDYXQuTW9kZWxzIiwiQ2F0Lk1vZGVscy5Db21tYW5kIiwiQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsIiwiQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscyIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5Nb2RlbHMuQ29tbWFuZC5SZXBvc2l0b3J5IiwiQ2F0Lk1vZGVscy5Db21tYW5kLlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuTW9kZWxzLkNvbW1hbmQuUmVwb3NpdG9yeS50b09iamVjdCIsIkNhdC5Nb2RlbHMuQ29tbWFuZC5SZXBvc2l0b3J5LmZyb21PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50LlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kLk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kLk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kLlJlcG9zaXRvcnkiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kLlJlcG9zaXRvcnkuZnJvbU9iamVjdCIsIkNhdC5CYXNlLkVudGl0eUxpc3QiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwuYWRkIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbC5nZXRMaXN0IiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbC5zcGxpY2UiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsLnJlcGxhY2UiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsLnJlbW92ZSIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwuY2xlYXIiLCJDYXQuQmFzZS5FbnRpdHlMaXN0LlJlcG9zaXRvcnkiLCJDYXQuQmFzZS5FbnRpdHlMaXN0LlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQmFzZS5FbnRpdHlMaXN0LlJlcG9zaXRvcnkudG9FbnRpdHlMaXN0IiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5SZXBvc2l0b3J5LmZyb21FbnRpdHlMaXN0IiwiQ2F0Lk1vZGVscy5Db21tYW5kTGlzdCIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuTW9kZWwiLCJDYXQuTW9kZWxzLkNvbW1hbmRMaXN0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5Nb2RlbC5jbGVhciIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeSIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeS50b09iamVjdCIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZExpc3QuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5LmZyb21PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kLk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5SZXBvc2l0b3J5IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5SZXBvc2l0b3J5LmZyb21PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0LlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyLmRpc3BhdGNoIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYiIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5nZXRUYWJJZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuZ2V0VGFiVVJMIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5jaGVja09uVXBkYXRlZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwucG9zdE1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLnNlbmRNZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5jb25uZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5vbk1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLm9uRGlzY29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuZGlzY29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5jb25uZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLnJlbG9hZFRhYiIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5nZXRUYWJJZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5nZXRUYWJVUkwiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIucG9zdE1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIuc2VuZE1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIub25NZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLm9uQ29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5vbkRpc2Nvbm5lY3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QubG9hZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5Db21tYW5kU2VsZWN0TGlzdC5nZXREb2NSb290IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbW1hbmRTZWxlY3RMaXN0LmdldHMiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0iLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uQmFzZSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5CYXNlLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLkJhc2UuZ2V0SW50ZXJ2YWwiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uQmFzZS5zdGFydCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5CYXNlLnNldEFwaURvY3MiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlNlbmRlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXIuYWRkQ29tbWFuZExpc3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyLmV4ZWN1dGUiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5Db21tYW5kR3JpZC5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuQ29tbWFuZEdyaWQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsLmdldENvbW1hbmRMaXN0IiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5BdXRvcGlsb3QuQ29udHJvbGxlciIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5BdXRvcGlsb3QuQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5BdXRvcGlsb3QuQ29udHJvbGxlci5iaW5kVGFiTWFuYWdlciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXIuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuUmVjb3JkZXJPYnNlcnZlci5nZXRVc2VyTG9nIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXIuYWRkQ29tbWFuZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyLm9uVW5sb2FkRG9jdW1lbnQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uUmVjZWl2ZXIiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uUmVjZWl2ZXIuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uUmVjZWl2ZXIuZXhlY3V0ZSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5SZWNlaXZlci5leGVjIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkNvbnRlbnRTY3JpcHRzQ3RybCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuQ29udGVudFNjcmlwdHNDdHJsLm9uTWVzc2FnZSIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwuYWRkQ29tbWFuZCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwuaW5pdGlhbGl6ZSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5Db25maWciLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29uZmlnLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5JbmplY3RTY3JpcHRzIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5JbmplY3RTY3JpcHRzLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5JbmplY3RTY3JpcHRzLmV4ZWN1dGVFbmQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluamVjdFNjcmlwdHMuZXhlY3V0ZVNjcmlwdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5qZWN0U2NyaXB0cy5jb25uZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Jbml0aWFsaXplciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5pdGlhbGl6ZXIuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluaXRpYWxpemVyLnN0YXJ0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Jbml0aWFsaXplci5nZXRUYWIiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLldpbmRvd0N0cmwuaW5pdEFuZ3VsYXIiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybC5pbml0Q29tbWFuZFNlbGVjdExpc3QiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybC5pbml0VGFiSW5pdGlhbGl6ZXIiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybC5pbml0aWFsaXplIl0sIm1hcHBpbmdzIjoiQUFLTSxNQUFPLENBQUMsWUFBWSxHQUFTLE1BQU8sQ0FBQyxhQUFhLENBQUM7QUNMekQsSUFBTyxHQUFHLENBMENKO0FB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QkFBa0JBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzREEsQ0FBQ0E7Z0JBQ0xMLGlCQUFDQTtZQUFEQSxDQUFDQSxBQXJERDlCLElBcURDQTtZQXJEWUEsc0JBQVVBLEdBQVZBLFVBcURaQSxDQUFBQTtRQUNMQSxDQUFDQSxFQXZEc0IxSCxXQUFXQSxHQUFYQSx1QkFBV0EsS0FBWEEsdUJBQVdBLFFBdURqQ0E7SUFBREEsQ0FBQ0EsRUF2RFV2QixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQXVEckJBO0FBQURBLENBQUNBLEVBdkRNLEdBQUcsS0FBSCxHQUFHLFFBdURUIiwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSBtb2R1bGUgY2hyb21lLmV4dGVuc2lvbiB7XG4gICAgdmFyIG9uQ29ubmVjdDogY2hyb21lLnJ1bnRpbWUuRXh0ZW5zaW9uQ29ubmVjdEV2ZW50O1xufVxuXG5kZWNsYXJlIGNsYXNzIEV2ZW50RW1pdHRlciBleHRlbmRzIGV2ZW50ZW1pdHRlcjIuRXZlbnRFbWl0dGVyMiB7fVxuKDxhbnk+d2luZG93KS5FdmVudEVtaXR0ZXIgPSAoPGFueT53aW5kb3cpLkV2ZW50RW1pdHRlcjI7XG5cbmRlY2xhcmUgdmFyIFRlc3RJbml0aWFsaXplOiBib29sZWFuOyIsIm1vZHVsZSBDYXQuVVVJRCB7XG4gICAgY2xhc3MgSW52YWxpZFVVSURGb3JtYXQge31cbiAgICBleHBvcnQgY2xhc3MgVVVJRCB7XG4gICAgICAgIHV1aWQ6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3RvciAoaWQ6IHN0cmluZyA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXVpZCA9IFtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUzQoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpXG4gICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBpZC5tYXRjaCgvXlxcd3s4fS1cXHd7NH0tXFx3ezR9LVxcd3s0fS1cXHd7MTJ9JC8pO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkVVVJREZvcm1hdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51dWlkID0gaWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0b1N0cmluZyAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51dWlkO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGZyb21TdHJpbmcgKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVVJRChpZCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIFM0KCkge1xuICAgICAgICAgICAgdmFyIHJhbmQgPSAxICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHJldHVybiAoKHJhbmQgKiAweDEwMDAwKXwwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgfX1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJVVUlEXCIgLz5cblxubW9kdWxlIENhdC5CYXNlIHtcbiAgICBleHBvcnQgY2xhc3MgSWRlbnRpdHkge1xuICAgICAgICBjb25zdHJ1Y3RvciAocHVibGljIHV1aWQ6IFVVSUQuVVVJRCA9IG5ldyBVVUlELlVVSUQpIHtcbiAgICAgICAgfVxuICAgICAgICBlcSAoZTogSWRlbnRpdHkpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnV1aWQudG9TdHJpbmcoKSA9PT0gZS51dWlkLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkJhc2Uge1xuICAgIGV4cG9ydCBjbGFzcyBTZXJ2aWNlIHt9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vSWRlbnRpdHlcIiAvPlxuXG5tb2R1bGUgQ2F0LkJhc2UuRW50aXR5IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBJZGVudGl0eSB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgaWRlbnRpdHk6IElkZW50aXR5ID0gbmV3IElkZW50aXR5KG5ldyBVVUlELlVVSUQpKSB7XG4gICAgICAgICAgICBzdXBlcihpZGVudGl0eS51dWlkKVxuICAgICAgICB9XG4gICAgICAgIGVxIChlOiBNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmVxKGUuaWRlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0Jhc2UvRW50aXR5L01vZGVsLnRzXCIgLz5cblxubW9kdWxlIENhdC5Nb2RlbHMuQ29tbWFuZCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgQ2F0LkJhc2UuRW50aXR5Lk1vZGVsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKFxuICAgICAgICAgICAgcHVibGljIHR5cGUgPSAnJyxcbiAgICAgICAgICAgIHB1YmxpYyB0YXJnZXQgPSAnJyxcbiAgICAgICAgICAgIHB1YmxpYyB2YWx1ZSA9ICcnXG4gICAgICAgICkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9CYXNlL0VudGl0eS9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2Uge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIEJhc2UuRW50aXR5Lk1vZGVsIHtcbiAgICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL01vZGVscy9Db21tYW5kL01vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgTWVzc2FnZS5Nb2RlbCB7XG4gICAgICAgIHN0YXRpYyBtZXNzYWdlTmFtZSA9ICdhZGRDb21tZW50JztcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kOiBDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwsIHB1YmxpYyBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZDogYm9vbGVhbikge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL01vZGVsLnRzXCIgLz5cblxubW9kdWxlIENhdC5CYXNlLkVudGl0eSB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXBvc2l0b3J5PE0gZXh0ZW5kcyBNb2RlbD4ge1xuICAgICAgICB0b09iamVjdCAoZW50aXR5OiBNKSA6IE9iamVjdDtcbiAgICAgICAgZnJvbU9iamVjdCAob2JqZWN0OiBPYmplY3QpIDogTTtcbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vQmFzZS9FbnRpdHkvUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuTW9kZWxzLkNvbW1hbmQge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU1vZGVsT2JqZWN0IHtcbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICB0YXJnZXQ6IHN0cmluZztcbiAgICAgICAgdmFsdWU6IHN0cmluZztcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgaW1wbGVtZW50cyBDYXQuQmFzZS5FbnRpdHkuUmVwb3NpdG9yeTxNb2RlbD4ge1xuICAgICAgICB0b09iamVjdCAoY29tbWFuZDogTW9kZWwpOiBJTW9kZWxPYmplY3Qge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAndHlwZScgOiBjb21tYW5kLnR5cGUsXG4gICAgICAgICAgICAgICAgJ3RhcmdldCcgOiBjb21tYW5kLnRhcmdldCxcbiAgICAgICAgICAgICAgICAndmFsdWUnIDogY29tbWFuZC52YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChjb21tYW5kOiBJTW9kZWxPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwoY29tbWFuZC50eXBlLCBjb21tYW5kLnRhcmdldCwgY29tbWFuZC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vQmFzZS9FbnRpdHkvUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2Uge1xuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGltcGxlbWVudHMgQmFzZS5FbnRpdHkuUmVwb3NpdG9yeTxNb2RlbD4ge1xuICAgICAgICB0b09iamVjdCAoZW50aXR5OiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgICAgIGZyb21PYmplY3QgKG9iamVjdDogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vTW9kZWxzL0NvbW1hbmQvUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBNZXNzYWdlLlJlcG9zaXRvcnkge1xuICAgICAgICByZXBvc2l0b3J5ID0gbmV3IENhdC5Nb2RlbHMuQ29tbWFuZC5SZXBvc2l0b3J5KCk7XG5cbiAgICAgICAgdG9PYmplY3QgKG1lc3NhZ2U6IE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICduYW1lJyA6IE1vZGVsLm1lc3NhZ2VOYW1lLFxuICAgICAgICAgICAgICAgICdjb250ZW50JyA6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbW1hbmQnIDogdGhpcy5yZXBvc2l0b3J5LnRvT2JqZWN0KG1lc3NhZ2UuY29tbWFuZCksXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCcgOiBtZXNzYWdlLmluc2VydEJlZm9yZUxhc3RDb21tYW5kXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHZhciBjb21tYW5kID0gdGhpcy5yZXBvc2l0b3J5LmZyb21PYmplY3QobWVzc2FnZVsnY29udGVudCddWydjb21tYW5kJ10pO1xuICAgICAgICAgICAgdmFyIGluc2VydEJlZm9yZUxhc3RDb21tYW5kID0gISFtZXNzYWdlWydjb250ZW50J11bJ2luc2VydEJlZm9yZUxhc3RDb21tYW5kJ107XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKGNvbW1hbmQsIGluc2VydEJlZm9yZUxhc3RDb21tYW5kKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9Nb2RlbHMvQ29tbWFuZC9Nb2RlbC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vTW9kZWwudHNcIiAvPlxuXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ3BsYXlDb21tYW5kJztcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kOiBDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vTW9kZWxzL0NvbW1hbmQvUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQge1xuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGV4dGVuZHMgTWVzc2FnZS5SZXBvc2l0b3J5IHtcbiAgICAgICAgcmVwb3NpdG9yeSA9IG5ldyBDYXQuTW9kZWxzLkNvbW1hbmQuUmVwb3NpdG9yeSgpO1xuXG4gICAgICAgIHRvT2JqZWN0IChtZXNzYWdlOiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZScgOiBNb2RlbC5tZXNzYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiB0aGlzLnJlcG9zaXRvcnkudG9PYmplY3QobWVzc2FnZS5jb21tYW5kKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwodGhpcy5yZXBvc2l0b3J5LmZyb21PYmplY3QobWVzc2FnZVsnY29udGVudCddKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vSWRlbnRpdHlcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0VudGl0eS9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQmFzZS5FbnRpdHlMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWw8RSBleHRlbmRzIEVudGl0eS5Nb2RlbD4gZXh0ZW5kcyBFbnRpdHkuTW9kZWwge1xuICAgICAgICBsaXN0OiBFW107XG5cbiAgICAgICAgY29uc3RydWN0b3IobGlzdDogRVtdID0gW10pIHtcbiAgICAgICAgICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgICAgIGFkZChlbnRpdHk6IEUpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdC5wdXNoKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0TGlzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3Q7XG4gICAgICAgIH1cbiAgICAgICAgc3BsaWNlKGluZGV4OiBudW1iZXIsIGVudGl0eTogRSkge1xuICAgICAgICAgICAgdGhpcy5saXN0LnNwbGljZShpbmRleCwgMSwgZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgICByZXBsYWNlKGlkZW50aXR5OiBJZGVudGl0eSwgZW50aXR5OiBFKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmxpc3QubWFwKFxuICAgICAgICAgICAgICAgIChlKSA9PiBlLmlkZW50aXR5LmVxKGlkZW50aXR5KSA/IGVudGl0eSA6IGVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlKGVudGl0eTogRSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5saXN0LmZpbHRlcihcbiAgICAgICAgICAgICAgICAoZSkgPT4gIWUuZXEoZW50aXR5KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdCA9IFtdO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vTW9kZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0VudGl0eS9SZXBvc2l0b3J5LnRzXCIgLz5cblxubW9kdWxlIENhdC5CYXNlLkVudGl0eUxpc3Qge1xuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5PEIgZXh0ZW5kcyBFbnRpdHkuTW9kZWwsIE0gZXh0ZW5kcyBFbnRpdHlMaXN0Lk1vZGVsPEVudGl0eS5Nb2RlbD4+IHtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgZW50aXR5UmVwb3NpdG9yeTogRW50aXR5LlJlcG9zaXRvcnk8Qj4pIHtcbiAgICAgICAgfVxuICAgICAgICB0b0VudGl0eUxpc3QgKGVudGl0eUxpc3Q6IE0pIHtcbiAgICAgICAgICAgIHJldHVybiBlbnRpdHlMaXN0LmdldExpc3QoKS5tYXAoKGVudGl0eSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiA8TT4oPGFueT50aGlzLmVudGl0eVJlcG9zaXRvcnkpLnRvT2JqZWN0KGVudGl0eSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tRW50aXR5TGlzdCAoZW50aXR5TGlzdDogT2JqZWN0W10pIHtcbiAgICAgICAgICAgIHJldHVybiBlbnRpdHlMaXN0Lm1hcCgoZW50aXR5KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW50aXR5UmVwb3NpdG9yeS5mcm9tT2JqZWN0KGVudGl0eSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9CYXNlL0VudGl0eUxpc3QvTW9kZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0NvbW1hbmQvTW9kZWwudHNcIiAvPlxuXG5tb2R1bGUgQ2F0Lk1vZGVscy5Db21tYW5kTGlzdCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbDxDb21tYW5kLk1vZGVsPiB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgICAgIGNvbW1hbmRzOiBDb21tYW5kLk1vZGVsW10gPSBbXSxcbiAgICAgICAgICAgIHB1YmxpYyBuYW1lID0gJycsXG4gICAgICAgICAgICBwdWJsaWMgdXJsID0gJydcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzdXBlcihjb21tYW5kcyk7XG4gICAgICAgIH1cbiAgICAgICAgY2xlYXIoKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAnJztcbiAgICAgICAgICAgIHRoaXMudXJsID0gJyc7XG4gICAgICAgICAgICBzdXBlci5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0Jhc2UvRW50aXR5TGlzdC9SZXBvc2l0b3J5LnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Db21tYW5kL1JlcG9zaXRvcnkudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vTW9kZWwudHNcIiAvPlxuXG5tb2R1bGUgQ2F0Lk1vZGVscy5Db21tYW5kTGlzdCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHlMaXN0LlJlcG9zaXRvcnk8Q29tbWFuZC5Nb2RlbCwgTW9kZWw+IGltcGxlbWVudHMgQ2F0LkJhc2UuRW50aXR5LlJlcG9zaXRvcnk8TW9kZWw+IHtcbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgc3VwZXIobmV3IENvbW1hbmQuUmVwb3NpdG9yeSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvT2JqZWN0IChjb21tYW5kTGlzdDogTW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ2NvbW1hbmRMaXN0JyA6IHN1cGVyLnRvRW50aXR5TGlzdChjb21tYW5kTGlzdCksXG4gICAgICAgICAgICAgICAgJ25hbWUnIDogY29tbWFuZExpc3QubmFtZSxcbiAgICAgICAgICAgICAgICAndXJsJyA6IGNvbW1hbmRMaXN0LnVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChjb21tYW5kTGlzdDoge1xuICAgICAgICAgICAgJ2NvbW1hbmRMaXN0JyA6IE9iamVjdFtdXG4gICAgICAgICAgICAnbmFtZScgOiBzdHJpbmdcbiAgICAgICAgICAgICd1cmwnIDogc3RyaW5nXG4gICAgICAgIH0pIHtcbiAgICAgICAgICAgIHZhciBjb21tYW5kTGlzdE9iamVjdCA9IHN1cGVyLmZyb21FbnRpdHlMaXN0KGNvbW1hbmRMaXN0LmNvbW1hbmRMaXN0KTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwoY29tbWFuZExpc3RPYmplY3QsIGNvbW1hbmRMaXN0Lm5hbWUsIGNvbW1hbmRMaXN0LnVybCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vTW9kZWxzL0NvbW1hbmRMaXN0L01vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ3BsYXlDb21tYW5kTGlzdCc7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgY29tbWFuZExpc3Q6IENhdC5Nb2RlbHMuQ29tbWFuZExpc3QuTW9kZWwpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vTW9kZWxzL0NvbW1hbmRMaXN0L1JlcG9zaXRvcnkudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1JlcG9zaXRvcnkudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vTW9kZWwudHNcIiAvPlxuXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBNZXNzYWdlLlJlcG9zaXRvcnkge1xuICAgICAgICByZXBvc2l0b3J5ID0gbmV3IENhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeSgpO1xuXG4gICAgICAgIHRvT2JqZWN0IChtZXNzYWdlOiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZScgOiBNb2RlbC5tZXNzYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiB0aGlzLnJlcG9zaXRvcnkudG9PYmplY3QobWVzc2FnZS5jb21tYW5kTGlzdClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKHRoaXMucmVwb3NpdG9yeS5mcm9tT2JqZWN0KG1lc3NhZ2VbJ2NvbnRlbnQnXSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL0Jhc2UvRW50aXR5L01vZGVsLnRzXCIgLz5cblxubW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHkuTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICBwdWJsaWMgdHlwZSA9ICcnLFxuICAgICAgICAgICAgcHVibGljIGFyZ3M6IHN0cmluZ1tdID0gW11cbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL0Jhc2UvRW50aXR5L1JlcG9zaXRvcnkudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vTW9kZWwudHNcIiAvPlxuXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU1vZGVsT2JqZWN0IHtcbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICBhcmdzOiBzdHJpbmdbXTtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgaW1wbGVtZW50cyBDYXQuQmFzZS5FbnRpdHkuUmVwb3NpdG9yeTxNb2RlbD4ge1xuICAgICAgICB0b09iamVjdCAoY29tbWFuZDogTW9kZWwpOiBJTW9kZWxPYmplY3Qge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAndHlwZScgOiBjb21tYW5kLnR5cGUsXG4gICAgICAgICAgICAgICAgJ2FyZ3MnIDogY29tbWFuZC5hcmdzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZyb21PYmplY3QgKGNvbW1hbmQ6IElNb2RlbE9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbChjb21tYW5kLnR5cGUsIGNvbW1hbmQuYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vU2VsZW5pdW1Db21tYW5kL01vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIE1lc3NhZ2UuTW9kZWwge1xuICAgICAgICBzdGF0aWMgbWVzc2FnZU5hbWUgPSAncGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUnO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHVibGljIGNvbW1hbmQ6IFNlbGVuaXVtQ29tbWFuZC5Nb2RlbCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9TZWxlbml1bUNvbW1hbmQvUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUge1xuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGV4dGVuZHMgTWVzc2FnZS5SZXBvc2l0b3J5IHtcbiAgICAgICAgcmVwb3NpdG9yeSA9IG5ldyBTZWxlbml1bUNvbW1hbmQuUmVwb3NpdG9yeSgpO1xuXG4gICAgICAgIHRvT2JqZWN0IChtZXNzYWdlOiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZScgOiBNb2RlbC5tZXNzYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiB0aGlzLnJlcG9zaXRvcnkudG9PYmplY3QobWVzc2FnZS5jb21tYW5kKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwodGhpcy5yZXBvc2l0b3J5LmZyb21PYmplY3QobWVzc2FnZVsnY29udGVudCddKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vU2VsZW5pdW1Db21tYW5kL01vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgTWVzc2FnZS5Nb2RlbCB7XG4gICAgICAgIHN0YXRpYyBtZXNzYWdlTmFtZSA9ICdwbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0JztcbiAgICAgICAgcHJpdmF0ZSB2YWxpZENvbW1hbmQgPSBbXG4gICAgICAgICAgICAnT0snLFxuICAgICAgICAgICAgJ05HJ1xuICAgICAgICBdO1xuICAgICAgICAvL3BhZ2UgcmVsb2FkaW5nXG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgY29tbWFuZDogc3RyaW5nID0gJ09LJykge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIGlmICghfnRoaXMudmFsaWRDb21tYW5kLmluZGV4T2YoY29tbWFuZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY29tbWFuZCwnK2NvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL1NlbGVuaXVtQ29tbWFuZC9SZXBvc2l0b3J5LnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9SZXBvc2l0b3J5LnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL01vZGVsLnRzXCIgLz5cblxubW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIE1lc3NhZ2UuUmVwb3NpdG9yeSB7XG4gICAgICAgIHRvT2JqZWN0IChtZXNzYWdlOiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZScgOiBNb2RlbC5tZXNzYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiBtZXNzYWdlLmNvbW1hbmRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKG1lc3NhZ2VbJ2NvbnRlbnQnXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9BZGRDb21tYW5kL1JlcG9zaXRvcnkudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vUGxheUNvbW1hbmQvUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9QbGF5Q29tbWFuZExpc3QvUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS9SZXBvc2l0b3J5LnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1BsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQvUmVwb3NpdG9yeS50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2Uge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGlzcGF0Y2hNYXAge1xuICAgICAgICBNZXNzYWdlQWRkQ29tbWVudE1vZGVsPyA6IChtZXNzYWdlOiBBZGRDb21tZW50Lk1vZGVsKSA9PiB2b2lkO1xuICAgICAgICBNZXNzYWdlUGxheUNvbW1hbmRNb2RlbD8gOiAobWVzc2FnZTogUGxheUNvbW1hbmQuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIE1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbD8gOiAobWVzc2FnZTogUGxheUNvbW1hbmRMaXN0Lk1vZGVsKSA9PiB2b2lkO1xuICAgICAgICBNZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVNb2RlbD8gOiAobWVzc2FnZTogUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIE1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWw/IDogKG1lc3NhZ2U6IFBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuTW9kZWwpID0+IHZvaWQ7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBEaXNwYXRjaGVyIHtcbiAgICAgICAgbWVzc2FnZUFkZENvbW1lbnRNb2RlbCA9IG5ldyBBZGRDb21tZW50LlJlcG9zaXRvcnkoKTtcbiAgICAgICAgbWVzc2FnZVBsYXlDb21tYW5kTW9kZWwgPSBuZXcgUGxheUNvbW1hbmQuUmVwb3NpdG9yeSgpO1xuICAgICAgICBtZXNzYWdlUGxheUNvbW1hbmRMaXN0TW9kZWwgPSBuZXcgUGxheUNvbW1hbmRMaXN0LlJlcG9zaXRvcnkoKTtcbiAgICAgICAgbWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlTW9kZWwgPSBuZXcgUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeSgpO1xuICAgICAgICBtZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdE1vZGVsID0gbmV3IFBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeSgpO1xuXG4gICAgICAgIGRpc3BhdGNoIChtZXNzYWdlOiBPYmplY3QsIGRpc3BhdGNoZXI6IERpc3BhdGNoTWFwKSB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZVsnbmFtZSddID09IEFkZENvbW1lbnQuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VBZGRDb21tZW50TW9kZWwodGhpcy5tZXNzYWdlQWRkQ29tbWVudE1vZGVsLmZyb21PYmplY3QobWVzc2FnZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlWyduYW1lJ10gPT0gUGxheUNvbW1hbmQuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VQbGF5Q29tbWFuZE1vZGVsKHRoaXMubWVzc2FnZVBsYXlDb21tYW5kTW9kZWwuZnJvbU9iamVjdChtZXNzYWdlKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2VbJ25hbWUnXSA9PSBQbGF5Q29tbWFuZExpc3QuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbCh0aGlzLm1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbC5mcm9tT2JqZWN0KG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZVsnbmFtZSddID09IFBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLk1vZGVsLm1lc3NhZ2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5NZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVNb2RlbCh0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZU1vZGVsLmZyb21PYmplY3QobWVzc2FnZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlWyduYW1lJ10gPT0gUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbC5tZXNzYWdlTmFtZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuTWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRNb2RlbCh0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWwuZnJvbU9iamVjdChtZXNzYWdlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBtZXNzYWdlOiAnICsgSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0L1JlcG9zaXRvcnkudHNcIiAvPlxuXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYiB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICAgICAgcHJpdmF0ZSBwb3J0OiBjaHJvbWUucnVudGltZS5Qb3J0O1xuICAgICAgICBwcml2YXRlIHNlbmRNZXNzYWdlUmVzcG9uc2VJbnRlcnZhbCA9IDEwMDA7XG4gICAgICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgICAgIHByaXZhdGUgdGFiOiBjaHJvbWUudGFicy5UYWJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gY2hyb21lLnRhYnMuY29ubmVjdCh0aGlzLnRhYi5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0VGFiSWQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFiLmlkO1xuICAgICAgICB9XG4gICAgICAgIGdldFRhYlVSTCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWIudXJsO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgY2hlY2tPblVwZGF0ZWQgKCkge1xuICAgICAgICAgICAgdmFyIHVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiSWQ6IG51bWJlciwgY2hhbmdlSW5mbzogY2hyb21lLnRhYnMuVGFiQ2hhbmdlSW5mbywgdGFiOiBjaHJvbWUudGFicy5UYWIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YWIuaWQgIT09IHRhYklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZUluZm8uc3RhdHVzID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnb25VcGRhdGVkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBwb3N0TWVzc2FnZSAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLnBvcnQucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VuZE1lc3NhZ2UgKG1lc3NhZ2U6IE9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0aGlzLnRhYi5pZCwgbWVzc2FnZSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdCgnbWlzc2luZyByZXN1bHQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudGFiLnN0YXR1cyAhPT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbChyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtZXNzYWdlLmNvbW1hbmQpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChzdWNjZXNzLCB0aGlzLnNlbmRNZXNzYWdlUmVzcG9uc2VJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoJ3NlbmRNZXNzYWdlIHRpbWVvdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcy5zZW5kTWVzc2FnZVJlc3BvbnNlSW50ZXJ2YWwgKiAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbm5lY3QgKCkge1xuICAgICAgICAgICAgdGhpcy5wb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNocm9tZS50YWJzLm9uUmVtb3ZlZC5hZGRMaXN0ZW5lcigodGFiSWQ6IG51bWJlciwgcmVtb3ZlSW5mbzogY2hyb21lLnRhYnMuVGFiUmVtb3ZlSW5mbykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhYi5pZCAhPT0gdGFiSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ29uUmVtb3ZlZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNoZWNrT25VcGRhdGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgb25NZXNzYWdlIChjYWxsYmFjazogKG1lc3NhZ2U6IE9iamVjdCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5wb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgb25EaXNjb25uZWN0IChjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5wb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZGlzY29ubmVjdCAoKSB7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBudWxsO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMucG9ydDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJNb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiIHtcbiAgICBleHBvcnQgY2xhc3MgTWFuYWdlciB7XG4gICAgICAgIHByaXZhdGUgdGFiOiBNb2RlbDtcbiAgICAgICAgcHJpdmF0ZSBvbk1lc3NhZ2VMaXN0ZW5lcnM6IEFycmF5PChtZXNzYWdlOiBPYmplY3QpID0+IHZvaWQ+ID0gW107XG4gICAgICAgIHByaXZhdGUgb25EaXNjb25uZWN0TGlzdGVuZXJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuICAgICAgICBwcml2YXRlIG9uQ29ubmVjdExpc3RlbmVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICB0YWI6IGNocm9tZS50YWJzLlRhYixcbiAgICAgICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZTogKG1hbmFnZXI6IE1hbmFnZXIpID0+IFByb21pc2U8dm9pZD5cbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnRhYiA9IG5ldyBNb2RlbCh0YWIpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgY2xvc2VNZXNzYWdlID0gJ0Nsb3NlIHRlc3QgY2FzZT8nO1xuICAgICAgICBjb25uZWN0ICgpIHtcbiAgICAgICAgICAgIHRoaXMudGFiLmNvbm5lY3QoKTtcbiAgICAgICAgICAgIHRoaXMudGFiLmFkZExpc3RlbmVyKCdvblJlbW92ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0odGhpcy5jbG9zZU1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50YWIuYWRkTGlzdGVuZXIoJ29uVXBkYXRlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZFRhYigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgcmVsb2FkVGFiICgpIHtcbiAgICAgICAgICAgIHZhciB0YWJJZCA9IHRoaXMudGFiLmdldFRhYklkKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQsIHJlamVjdDogKGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplKHRoaXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5nZXQodGFiSWQsICh0YWIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsKHRhYik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29ubmVjdExpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2VMaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiB0aGlzLnRhYi5vbk1lc3NhZ2UobGlzdGVuZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0TGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gdGhpcy50YWIub25EaXNjb25uZWN0KGxpc3RlbmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBnZXRUYWJJZCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWIuZ2V0VGFiSWQoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRUYWJVUkwgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFiLmdldFRhYlVSTCgpO1xuICAgICAgICB9XG4gICAgICAgIHBvc3RNZXNzYWdlIChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHRoaXMudGFiLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRNZXNzYWdlIChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYi5zZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBvbk1lc3NhZ2UgKGNhbGxiYWNrOiAobWVzc2FnZTogT2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0aGlzLm9uTWVzc2FnZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHRoaXMudGFiLm9uTWVzc2FnZShjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgb25Db25uZWN0IChjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgb25EaXNjb25uZWN0IChjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3RMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICB0aGlzLnRhYi5vbkRpc2Nvbm5lY3QoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcyB7XG4gICAgZXhwb3J0IGNsYXNzIENvbW1hbmRTZWxlY3RMaXN0IHtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXJyb3JNZXNzYWdlID0gJ2NvbW1hbmQgbGlzdCB4bWwgbG9hZCBmYWlsZWQuXFxuJztcbiAgICAgICAgcHJpdmF0ZSBkb2N1bWVudEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgICAgICBsb2FkIChmaWxlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGZpbGUpO1xuICAgICAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAwICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChDb21tYW5kU2VsZWN0TGlzdC5lcnJvck1lc3NhZ2UgKyBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50RWxlbWVudCA9IHhoci5yZXNwb25zZVhNTC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0RG9jUm9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0cyAoKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbCh0aGlzLmRvY3VtZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmdW5jdGlvbicpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0ge1xuICAgIGV4cG9ydCBjbGFzcyBCYXNlIHtcbiAgICAgICAgc2VsZW5pdW06IGFueTtcbiAgICAgICAgY29tbWFuZEZhY3Rvcnk6IGFueTtcbiAgICAgICAgY3VycmVudFRlc3Q6IGFueTtcbiAgICAgICAgdGVzdENhc2U6IGFueTtcbiAgICAgICAgaW50ZXJ2YWw6IG51bWJlciA9IDE7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICAvLyBmb3Igc2VsZW5pdW0tcnVubmVyXG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLmdldEJyb3dzZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdGVkQnJvd3NlcicgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY29udGVudFdpbmRvdycgOiB3aW5kb3dcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5sYXN0V2luZG93ID0gd2luZG93O1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS50ZXN0Q2FzZSA9IG5ldyAoPGFueT53aW5kb3cpLlRlc3RDYXNlO1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5zZWxlbml1bSA9IGNhbGxiYWNrKCk7XG5cbiAgICAgICAgICAgICg8YW55PndpbmRvdykuZWRpdG9yID0ge1xuICAgICAgICAgICAgICAgICdhcHAnIDoge1xuICAgICAgICAgICAgICAgICAgICAnZ2V0T3B0aW9ucycgOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0aW1lb3V0JyA6IHRoaXMuaW50ZXJ2YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICd2aWV3JyA6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3Jvd1VwZGF0ZWQnIDogKCkgPT4ge30sXG4gICAgICAgICAgICAgICAgICAgICdzY3JvbGxUb1JvdycgOiAoKSA9PiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudGVzdENhc2UgPSAoPGFueT53aW5kb3cpLnRlc3RDYXNlO1xuICAgICAgICAgICAgdGhpcy5zZWxlbml1bSA9ICg8YW55PndpbmRvdykuc2VsZW5pdW07XG4gICAgICAgICAgICB0aGlzLnNlbGVuaXVtLmJyb3dzZXJib3Quc2VsZWN0V2luZG93KG51bGwpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kRmFjdG9yeSA9IG5ldyAoPGFueT53aW5kb3cpLkNvbW1hbmRIYW5kbGVyRmFjdG9yeSgpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kRmFjdG9yeS5yZWdpc3RlckFsbCh0aGlzLnNlbGVuaXVtKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRJbnRlcnZhbCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbDtcbiAgICAgICAgfVxuICAgICAgICBzdGFydCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXN0ID0gbmV3ICg8YW55PndpbmRvdykuSURFVGVzdExvb3AodGhpcy5jb21tYW5kRmFjdG9yeSwge1xuICAgICAgICAgICAgICAgICAgICAndGVzdENvbXBsZXRlJyA6IHJlc29sdmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXN0LmdldENvbW1hbmRJbnRlcnZhbCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW50ZXJ2YWwoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZS5kZWJ1Z0NvbnRleHQucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXN0LnN0YXJ0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGVycm9yTWVzc2FnZSA9ICdzZWxlbml1bSBjb21tYW5kIHhtbCBsb2FkIGZhaWxlZC5cXG4nO1xuICAgICAgICBzdGF0aWMgc2V0QXBpRG9jcyAoZmlsZTogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQsIHJlamVjdDogKGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMCAmJiB4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoQmFzZS5lcnJvck1lc3NhZ2UgKyBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAoPGFueT53aW5kb3cpLkNvbW1hbmQuYXBpRG9jdW1lbnRzID0gbmV3IEFycmF5KHhoci5yZXNwb25zZVhNTC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL01vZGVscy9Db21tYW5kTGlzdC9Nb2RlbC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vTW9kZWxzL01lc3NhZ2UvUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUvUmVwb3NpdG9yeS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vTW9kZWxzL01lc3NhZ2UvRGlzcGF0Y2hlci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vVGFiL01hbmFnZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vQmFzZS50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0ge1xuICAgIGV4cG9ydCBjbGFzcyBTZW5kZXIgZXh0ZW5kcyBCYXNlIHtcbiAgICAgICAgcHJpdmF0ZSBtZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVSZXBvc2l0b3J5ID0gbmV3IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLlJlcG9zaXRvcnkoKTtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgbWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIsIHByaXZhdGUgbWVzc2FnZURpc3BhdGNoZXI6IENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyKSB7XG4gICAgICAgICAgICBzdXBlcigoKSA9PiBuZXcgKDxhbnk+d2luZG93KS5DaHJvbWVFeHRlbnNpb25CYWNrZWRTZWxlbml1bShtYW5hZ2VyLmdldFRhYlVSTCgpLCAnJykpO1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5zaG91bGRBYm9ydEN1cnJlbnRDb21tYW5kID0gKCkgPT4gZmFsc2U7XG4gICAgICAgICAgICBtYW5hZ2VyLm9uQ29ubmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgKDxhbnk+d2luZG93KS5zaG91bGRBYm9ydEN1cnJlbnRDb21tYW5kID0gKCkgPT4gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1hbmFnZXIub25EaXNjb25uZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAoPGFueT53aW5kb3cpLnNob3VsZEFib3J0Q3VycmVudENvbW1hbmQgPSAoKSA9PiBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGFkZENvbW1hbmRMaXN0IChjb21tYW5kTGlzdDogQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5Nb2RlbCkge1xuICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZS5jb21tYW5kcyA9IFtdO1xuICAgICAgICAgICAgY29tbWFuZExpc3QuZ2V0TGlzdCgpLmZvckVhY2goKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsQ29tbWFuZCA9IG5ldyAoPGFueT53aW5kb3cpLkNvbW1hbmQoY29tbWFuZC50eXBlLCBjb21tYW5kLnRhcmdldCwgY29tbWFuZC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZS5jb21tYW5kcy5wdXNoKHNlbENvbW1hbmQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhlY3V0ZShjb21tYW5kOiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdLCBjYWxsYmFjazogKHJlc3BvbnNlOiBzdHJpbmcsIHJlc3VsdDogYm9vbGVhbikgPT4gdm9pZCkge1xuICAgICAgICAgICAgdmFyIG1vZGVsID0gbmV3IE1vZGVscy5TZWxlbml1bUNvbW1hbmQuTW9kZWwoY29tbWFuZCwgYXJncyk7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5Nb2RlbChtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuc2VuZE1lc3NhZ2UodGhpcy5tZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVSZXBvc2l0b3J5LnRvT2JqZWN0KG1lc3NhZ2UpKS50aGVuKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlRGlzcGF0Y2hlci5kaXNwYXRjaChtZXNzYWdlLCB7XG4gICAgICAgICAgICAgICAgICAgIE1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWwgOiAobWVzc2FnZTogTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbCkgPT4gY2FsbGJhY2soJ09LJywgdHJ1ZSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL01vZGVscy9Db21tYW5kTGlzdC9Nb2RlbC50c1wiIC8+XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsPENhdC5Nb2RlbHMuQ29tbWFuZC5Nb2RlbD4ge1xuICAgICAgICBnZXRDb21tYW5kTGlzdCgpIHtcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHRoaXMuZ2V0TGlzdCgpLmZpbHRlcigoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWNvbW1hbmQudHlwZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNvbW1hbmRMaXN0ID0gbmV3IENhdC5Nb2RlbHMuQ29tbWFuZExpc3QuTW9kZWwoY29tbWFuZHMpO1xuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRMaXN0O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL01vZGVscy9NZXNzYWdlL0FkZENvbW1hbmQvTW9kZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL01vZGVscy9NZXNzYWdlL0Rpc3BhdGNoZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1NlcnZpY2VzL1RhYi9NYW5hZ2VyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9TZXJ2aWNlcy9Db21tYW5kU2VsZWN0TGlzdC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vU2VydmljZXMvU2VsZW5pdW0vU2VuZGVyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Nb2RlbHMvQ29tbWFuZEdyaWQvTW9kZWwudHNcIiAvPlxuXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBTY29wZSBleHRlbmRzIG5nLklTY29wZSB7XG4gICAgICAgIHBsYXlBbGw6ICgpID0+IHZvaWQ7XG4gICAgICAgIGFkZENvbW1hbmQ6ICgpID0+IHZvaWQ7XG4gICAgICAgIGRlbGV0ZUNvbW1hbmQ6IChjb21tYW5kOiBDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIGNvbW1hbmRHcmlkOiBDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsO1xuICAgICAgICBzdGFydFJlY29yZGluZzogKCkgPT4gdm9pZDtcbiAgICAgICAgc3RvcFJlY29yZGluZzogKCkgPT4gdm9pZDtcbiAgICAgICAgY2hhbmdlU3BlZWQ6ICgpID0+IHZvaWQ7XG4gICAgICAgIHBsYXlDdXJyZW50OiAoKSA9PiB2b2lkO1xuICAgICAgICBwbGF5U3RvcDogKCkgPT4gdm9pZDtcbiAgICAgICAgcmVjb3JkaW5nU3RhdHVzOiBib29sZWFuO1xuICAgICAgICBiYXNlVVJMOiBzdHJpbmc7XG4gICAgICAgIHBsYXlTcGVlZDogc3RyaW5nO1xuICAgICAgICBzZWxlY3RMaXN0OiBzdHJpbmdbXTtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXIge1xuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgICRzY29wZTogU2NvcGUsXG4gICAgICAgICAgICBtYW5hZ2VyOiBTZXJ2aWNlcy5UYWIuTWFuYWdlcixcbiAgICAgICAgICAgIGNvbW1hbmRHcmlkOiBDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsLFxuICAgICAgICAgICAgbWVzc2FnZURpc3BhdGNoZXI6IE1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIsXG4gICAgICAgICAgICBzZWxlbml1bVNlbmRlcjogQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlNlbmRlcixcbiAgICAgICAgICAgIGNvbW1hbmRTZWxlY3RMaXN0OiBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3RcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAkc2NvcGUuY29tbWFuZEdyaWQgPSBjb21tYW5kR3JpZDtcbiAgICAgICAgICAgICRzY29wZS5wbGF5U3BlZWQgPSAnMTAwJztcblxuICAgICAgICAgICAgJHNjb3BlLnBsYXlBbGwgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZW5pdW1TZW5kZXIuYWRkQ29tbWFuZExpc3QoJHNjb3BlLmNvbW1hbmRHcmlkLmdldENvbW1hbmRMaXN0KCkpO1xuICAgICAgICAgICAgICAgIHNlbGVuaXVtU2VuZGVyLnN0YXJ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLmNoYW5nZVNwZWVkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVuaXVtU2VuZGVyLmludGVydmFsID0gcGFyc2VJbnQoJHNjb3BlLnBsYXlTcGVlZCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLmFkZENvbW1hbmQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbW1hbmRHcmlkLmFkZChuZXcgQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsKCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5kZWxldGVDb21tYW5kID0gKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29tbWFuZEdyaWQucmVtb3ZlKGNvbW1hbmQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5yZWNvcmRpbmdTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLnN0YXJ0UmVjb3JkaW5nID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5yZWNvcmRpbmdTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5zdG9wUmVjb3JkaW5nID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5yZWNvcmRpbmdTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUucGxheUN1cnJlbnQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9AVE9ET1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5wbGF5U3RvcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvL0BUT0RPXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdExpc3QgPSBjb21tYW5kU2VsZWN0TGlzdC5nZXRzKCkubWFwKChlbGVtKSA9PiBlbGVtLmdldEF0dHJpYnV0ZSgnbmFtZScpKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFRhYk1hbmFnZXIoJHNjb3BlLCBtYW5hZ2VyLCBtZXNzYWdlRGlzcGF0Y2hlcik7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBiaW5kVGFiTWFuYWdlciAoXG4gICAgICAgICAgICAkc2NvcGU6IFNjb3BlLFxuICAgICAgICAgICAgbWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIsXG4gICAgICAgICAgICBtZXNzYWdlRGlzcGF0Y2hlcjogTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlclxuICAgICAgICApIHtcbiAgICAgICAgICAgIG1hbmFnZXIub25NZXNzYWdlKChtZXNzYWdlOiBPYmplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlRGlzcGF0Y2hlci5kaXNwYXRjaChtZXNzYWdlLCB7XG4gICAgICAgICAgICAgICAgICAgIE1lc3NhZ2VBZGRDb21tZW50TW9kZWwgOiAobWVzc2FnZTogTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5Nb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkc2NvcGUucmVjb3JkaW5nU3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkc2NvcGUuY29tbWFuZEdyaWQuZ2V0TGlzdCgpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYmFzZVVSTCA9IG1hbmFnZXIuZ2V0VGFiVVJMKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21tYW5kR3JpZC5hZGQobmV3IENhdC5Nb2RlbHMuQ29tbWFuZC5Nb2RlbCgnb3BlbicsICcnLCAkc2NvcGUuYmFzZVVSTCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tbWFuZEdyaWQuYWRkKG1lc3NhZ2UuY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKlxuKiBNb2NrIFJlY29yZGVyT2JzZXJ2ZXIgZm9yIFNlbGVuaXVtIFJlY29yZGVyXG4qICovXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzIHtcbiAgICBleHBvcnQgY2xhc3MgUmVjb3JkZXJPYnNlcnZlciBleHRlbmRzIEV2ZW50RW1pdHRlcntcbiAgICAgICAgcmVjb3JkaW5nRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgIGlzU2lkZWJhcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBnZXRVc2VyTG9nICgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlO1xuICAgICAgICB9XG4gICAgICAgIGFkZENvbW1hbmQgKGNvbW1hbmQ6IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHdpbmRvdzogV2luZG93LCBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZDogYm9vbGVhbikge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdhZGRDb21tYW5kJywgY29tbWFuZCwgdGFyZ2V0LCB2YWx1ZSwgd2luZG93LCBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgb25VbmxvYWREb2N1bWVudCAoZG9jOiBEb2N1bWVudCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdvblVubG9hZERvY3VtZW50JywgZG9jKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9Nb2RlbHMvU2VsZW5pdW1Db21tYW5kL01vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL0Jhc2UudHNcIiAvPlxuXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtIHtcbiAgICBleHBvcnQgY2xhc3MgUmVjZWl2ZXIgZXh0ZW5kcyBCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgc3VwZXIoKCkgPT4gKDxhbnk+d2luZG93KS5jcmVhdGVTZWxlbml1bShsb2NhdGlvbi5ocmVmLCB0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBlcnJvck1lc3NhZ2UgPSAnbWlzc2luZyBjb21tYW5kOiAnO1xuICAgICAgICBleGVjdXRlIChtb2RlbDogTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5Nb2RlbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZW5pdW1bbW9kZWwudHlwZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5leGVjKCgpID0+IHRoaXMuc2VsZW5pdW1bbW9kZWwudHlwZV0uYXBwbHkodGhpcy5zZWxlbml1bSwgbW9kZWwuYXJncykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvbW1hbmROYW1lID0gJ2RvJyArIG1vZGVsLnR5cGUucmVwbGFjZSgvXlxcdy8sIHcgPT4gdy50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVuaXVtW2NvbW1hbmROYW1lXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWMoKCkgPT4gdGhpcy5zZWxlbml1bVtjb21tYW5kTmFtZV0uYXBwbHkodGhpcy5zZWxlbml1bSwgbW9kZWwuYXJncykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IHRoaXMuZXJyb3JNZXNzYWdlICsgSlNPTi5zdHJpbmdpZnkobW9kZWwpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAnRVJST1IgJyArIGVycm9yTWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGV4ZWMgKGV4ZWM6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZXhlYygpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnT0snO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAnRVJST1InO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL01vZGVscy9TZWxlbml1bUNvbW1hbmQvTW9kZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL01vZGVscy9NZXNzYWdlL0Rpc3BhdGNoZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1NlcnZpY2VzL1JlY29yZGVyT2JzZXJ2ZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1NlcnZpY2VzL1NlbGVuaXVtL1JlY2VpdmVyLnRzXCIgLz5cblxubW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycyB7XG4gICAgZXhwb3J0IGNsYXNzIENvbnRlbnRTY3JpcHRzQ3RybCB7XG4gICAgICAgIHByaXZhdGUgbWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRSZXBvc2l0b3J5IDogTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5SZXBvc2l0b3J5O1xuICAgICAgICBwcml2YXRlIG1lc3NhZ2VBZGRDb21tZW50UmVwb3NpdG9yeSA6IE1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuUmVwb3NpdG9yeTtcbiAgICAgICAgcHJpdmF0ZSByZWNvcmRlck9ic2VydmVyIDogU2VydmljZXMuUmVjb3JkZXJPYnNlcnZlcjtcbiAgICAgICAgcHJpdmF0ZSBtZXNzYWdlRGlzcGF0Y2hlciA6IE1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXI7XG4gICAgICAgIHByaXZhdGUgU2VsZW5pdW1SZWNlaXZlciA6IFNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBwb3J0OiBjaHJvbWUucnVudGltZS5Qb3J0KSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0UmVwb3NpdG9yeSA9IG5ldyBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0LlJlcG9zaXRvcnkoKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUFkZENvbW1lbnRSZXBvc2l0b3J5ID0gbmV3IE1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuUmVwb3NpdG9yeSgpO1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlck9ic2VydmVyID0gbmV3IFNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXIoKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZURpc3BhdGNoZXIgPSBuZXcgTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlcigpO1xuICAgICAgICAgICAgdGhpcy5TZWxlbml1bVJlY2VpdmVyID0gbmV3IFNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgb25NZXNzYWdlIChtZXNzYWdlOiBPYmplY3QsIHNlbmRlcjogY2hyb21lLnJ1bnRpbWUuTWVzc2FnZVNlbmRlciwgc2VuZFJlc3BvbnNlOiAobWVzc2FnZTogT2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VEaXNwYXRjaGVyLmRpc3BhdGNoKG1lc3NhZ2UsIHtcbiAgICAgICAgICAgICAgICBNZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVNb2RlbCA6IChtZXNzYWdlOiBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5Nb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWNvcmRlci5kZXJlZ2lzdGVyKHRoaXMucmVjb3JkZXJPYnNlcnZlciwgd2luZG93KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuU2VsZW5pdW1SZWNlaXZlci5leGVjdXRlKG1lc3NhZ2UuY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgICAgIFJlY29yZGVyLnJlZ2lzdGVyKHRoaXMucmVjb3JkZXJPYnNlcnZlciwgd2luZG93KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdE1lc3NhZ2UgPSBuZXcgTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbChyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UodGhpcy5tZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdFJlcG9zaXRvcnkudG9PYmplY3QocmVzdWx0TWVzc2FnZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgYWRkQ29tbWFuZChjb21tYW5kTmFtZTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZywgdmFsdWU6IHN0cmluZywgd2luZG93OiBXaW5kb3csIGluc2VydEJlZm9yZUxhc3RDb21tYW5kOiBib29sZWFuKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb21tYW5kJyA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJyA6IGNvbW1hbmROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhcmdldCcgOiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnIDogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEJlZm9yZUxhc3RDb21tYW5kJyA6IGluc2VydEJlZm9yZUxhc3RDb21tYW5kXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBhZGRDb21tZW50TWVzc2FnZSA9IHRoaXMubWVzc2FnZUFkZENvbW1lbnRSZXBvc2l0b3J5LmZyb21PYmplY3QobWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLnBvcnQucG9zdE1lc3NhZ2UodGhpcy5tZXNzYWdlQWRkQ29tbWVudFJlcG9zaXRvcnkudG9PYmplY3QoYWRkQ29tbWVudE1lc3NhZ2UpKTtcbiAgICAgICAgfVxuICAgICAgICBpbml0aWFsaXplICgpIHtcbiAgICAgICAgICAgIFJlY29yZGVyLnJlZ2lzdGVyKHRoaXMucmVjb3JkZXJPYnNlcnZlciwgd2luZG93KTtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkZXJPYnNlcnZlci5hZGRMaXN0ZW5lcignYWRkQ29tbWFuZCcsIChjb21tYW5kTmFtZTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZywgdmFsdWU6IHN0cmluZywgd2luZG93OiBXaW5kb3csIGluc2VydEJlZm9yZUxhc3RDb21tYW5kOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDb21tYW5kKGNvbW1hbmROYW1lLCB0YXJnZXQsIHZhbHVlLCB3aW5kb3csIGluc2VydEJlZm9yZUxhc3RDb21tYW5kKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVjb3JkZXIuZGVyZWdpc3Rlcih0aGlzLnJlY29yZGVyT2JzZXJ2ZXIsIHdpbmRvdyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZTogT2JqZWN0LCBzZW5kZXI6IGNocm9tZS5ydW50aW1lLk1lc3NhZ2VTZW5kZXIsIHNlbmRSZXNwb25zZTogKG1lc3NhZ2U6IE9iamVjdCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcyB7XG4gICAgZXhwb3J0IGNsYXNzIENvbmZpZyB7XG4gICAgICAgIHN0YXRpYyBpbmplY3RTY3JpcHRzID0gW1xuICAgICAgICAgICAgXCJqcy9saWIveHBhdGguanNcIixcbiAgICAgICAgICAgIFwianMvbGliL2Nzcy1zZWxlY3Rvci5qc1wiLFxuICAgICAgICAgICAgXCJqcy9zZWxlbml1bS1pZGUvdG9vbHMuanNcIixcbiAgICAgICAgICAgIFwianMvc2VsZW5pdW0taWRlL2h0bWx1dGlscy5qc1wiLFxuICAgICAgICAgICAgXCJqcy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tYnJvd3NlcmRldGVjdC5qc1wiLFxuICAgICAgICAgICAgXCJqcy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tYXRvbXMuanNcIixcbiAgICAgICAgICAgIFwianMvc2VsZW5pdW0taWRlL3NlbGVuaXVtLWJyb3dzZXJib3QuanNcIixcbiAgICAgICAgICAgIFwianMvc2VsZW5pdW0taWRlL3NlbGVuaXVtLWFwaS5qc1wiLFxuICAgICAgICAgICAgXCJqcy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tZXhlY3V0aW9ubG9vcC5qc1wiLFxuICAgICAgICAgICAgXCJqcy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tdGVzdHJ1bm5lci5qc1wiLFxuICAgICAgICAgICAgXCJqcy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tY29tbWFuZGhhbmRsZXJzLmpzXCIsXG4gICAgICAgICAgICBcImpzL3NlbGVuaXVtLWlkZS9zZWxlbml1bS1ydW5uZXIuanNcIixcbiAgICAgICAgICAgIFwianMvc2VsZW5pdW0taWRlL3JlY29yZGVyLmpzXCIsXG4gICAgICAgICAgICBcImpzL3NlbGVuaXVtLWlkZS9yZWNvcmRlci1oYW5kbGVycy5qc1wiLFxuICAgICAgICAgICAgXCJqcy9zZWxlbml1bS1pZGUvdGVzdENhc2UuanNcIixcbiAgICAgICAgICAgIFwiYm93ZXJfY29tcG9uZW50cy9ldmVudGVtaXR0ZXIyL2xpYi9ldmVudGVtaXR0ZXIyLmpzXCIsXG4gICAgICAgICAgICBcImpzL2FwcGxpY2F0aW9uLmpzXCIsXG4gICAgICAgICAgICBcImpzL2NvbnRlbnRfc2NyaXB0cy5qc1wiXG4gICAgICAgIF07XG4gICAgICAgIHN0YXRpYyBzZWxlbml1bUFwaVhNTCA9ICcvanMvc2VsZW5pdW0taWRlL2llZG9jLWNvcmUueG1sJztcbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYiB7XG4gICAgZXhwb3J0IGNsYXNzIEluamVjdFNjcmlwdHMge1xuICAgICAgICBwcml2YXRlIGluamVjdFNjcmlwdHMgOiBzdHJpbmdbXTtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgaW5qZWN0U2NyaXB0c18pIHtcbiAgICAgICAgICAgIHRoaXMuaW5qZWN0U2NyaXB0cyA9IGluamVjdFNjcmlwdHNfLnNsaWNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IGRvdWJsZSBsb2FkaW5nIGZsYWcuXG4gICAgICAgIHByaXZhdGUgZXhlY3V0ZUVuZCAodGFiaWQ6IG51bWJlciwgcmVzb2x2ZTogKCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdCh0YWJpZCwge1xuICAgICAgICAgICAgICAgICdjb2RlJyA6ICd0aGlzLmV4dGVuc2lvbkNvbnRlbnRMb2FkZWQgPSB0cnVlJ1xuICAgICAgICAgICAgfSwgcmVzb2x2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBleGVjdXRlU2NyaXB0ICh0YWJpZDogbnVtYmVyLCBpbmplY3RTY3JpcHQ6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgLy/jgrPjg7zjg4njgpJ4aHLjgafjgq3jg6Pjg4Pjgrfjg6XjgZfjgaZmaWxl44Gn44Gv44Gq44GP44CBY29kZeOBp+a4oeOBl+OBpuODpuODvOOCtuWLleS9nOOCkuODluODreODg+OCr+OBl+OBpOOBpOWun+ihjOOBp+OBjeOBquOBhOOBi1xuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiaWQsIHtcbiAgICAgICAgICAgICAgICAgICAgJ3J1bkF0JyA6ICdkb2N1bWVudF9zdGFydCcsXG4gICAgICAgICAgICAgICAgICAgICdmaWxlJyA6IGluamVjdFNjcmlwdFxuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5qZWN0U2NyaXB0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGVTY3JpcHQodGFiaWQsIHRoaXMuaW5qZWN0U2NyaXB0cy5zaGlmdCgpKS50aGVuKHJlc29sdmUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUVuZCh0YWJpZCwgcmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25uZWN0KHRhYmlkOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGRvdWJsZSBsb2FkaW5nIGNoZWNrLlxuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiaWQsIHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGUnIDogJ3RoaXMuZXh0ZW5zaW9uQ29udGVudExvYWRlZCdcbiAgICAgICAgICAgICAgICB9LCAocmVzdWx0OiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggJiYgcmVzdWx0WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZVNjcmlwdCh0YWJpZCwgdGhpcy5pbmplY3RTY3JpcHRzLnNoaWZ0KCkpLnRoZW4ocmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJJbmplY3RTY3JpcHRzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Db25maWcudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk1hbmFnZXJcIiAvPlxuXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYiB7XG4gICAgZXhwb3J0IGNsYXNzIEluaXRpYWxpemVyIHtcbiAgICAgICAgcHJpdmF0ZSBpbmplY3RTY3JpcHRzIDogSW5qZWN0U2NyaXB0cztcbiAgICAgICAgcHJpdmF0ZSBtYW5hZ2VyIDogTWFuYWdlcjtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgY2FsbGVkVGFiSWQ6IHN0cmluZykge1xuICAgICAgICAgICAgdmFyIGluamVjdFNjcmlwdHMgPSBDb25maWcuaW5qZWN0U2NyaXB0cztcbiAgICAgICAgICAgIHRoaXMuaW5qZWN0U2NyaXB0cyA9IG5ldyBJbmplY3RTY3JpcHRzKGluamVjdFNjcmlwdHMpO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRUYWIodGhpcy5jYWxsZWRUYWJJZCkudGhlbigodGFiOiBjaHJvbWUudGFicy5UYWIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyID0gbmV3IE1hbmFnZXIodGFiLCAobWFuYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5qZWN0U2NyaXB0cy5jb25uZWN0KG1hbmFnZXIuZ2V0VGFiSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIuY29ubmVjdCgpLnRoZW4oKCkgPT4gcmVzb2x2ZSh0aGlzLm1hbmFnZXIpKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBnZXRUYWIgKGNhbGxlZFRhYklkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKHRhYjogY2hyb21lLnRhYnMuVGFiKSA9PiB2b2lkLCByZWplY3Q6IChlcnJvck1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLmdldChwYXJzZUludChjYWxsZWRUYWJJZCksICh0YWI6IGNocm9tZS50YWJzLlRhYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFiICYmIHRhYi5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0YWIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdTZWN1cml0eSBFcnJvci5cXG5kb2VzIG5vdCBydW4gb24gXCJjaHJvbWU6Ly9cIiBwYWdlLlxcbicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdXRvcGlsb3QudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1NlcnZpY2VzL0NvbmZpZy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vU2VydmljZXMvVGFiL0luaXRpYWxpemVyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9TZXJ2aWNlcy9TZWxlbml1bS9TZW5kZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL01vZGVscy9Db21tYW5kR3JpZC9Nb2RlbC50c1wiIC8+XG5cbnZhciBhcHBsaWNhdGlvblNlcnZpY2VzU2VsZW5pdW1TZW5kZXI6IENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXI7XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMge1xuICAgIGV4cG9ydCBjbGFzcyBXaW5kb3dDdHJsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgY2FsbGVkVGFiSWQ6IHN0cmluZykge31cbiAgICAgICAgcHJpdmF0ZSBpbml0QW5ndWxhciAobWFuYWdlciwgY29tbWFuZFNlbGVjdExpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBhdXRvcGlsb3RBcHAgPSBhbmd1bGFyLm1vZHVsZSgnQXV0b3BpbG90QXBwJywgWyd1aS5zb3J0YWJsZSddKVxuICAgICAgICAgICAgICAgICAgICAuZmFjdG9yeSgnbWFuYWdlcicsICgpID0+IG1hbmFnZXIpXG4gICAgICAgICAgICAgICAgICAgIC5mYWN0b3J5KCdjb21tYW5kU2VsZWN0TGlzdCcsICgpID0+IGNvbW1hbmRTZWxlY3RMaXN0KVxuICAgICAgICAgICAgICAgICAgICAuc2VydmljZSgnbWVzc2FnZURpc3BhdGNoZXInLCBNb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyKVxuICAgICAgICAgICAgICAgICAgICAuZmFjdG9yeSgnc2VsZW5pdW1TZW5kZXInLCAobWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIsIG1lc3NhZ2VEaXNwYXRjaGVyOiBNb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBsaWNhdGlvblNlcnZpY2VzU2VsZW5pdW1TZW5kZXIgPSBuZXcgU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyKG1hbmFnZXIsIG1lc3NhZ2VEaXNwYXRjaGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHBsaWNhdGlvblNlcnZpY2VzU2VsZW5pdW1TZW5kZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5mYWN0b3J5KCdjb21tYW5kR3JpZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb250cm9sbGVyKCdBdXRvcGlsb3QnLCBDb250cm9sbGVycy5BdXRvcGlsb3QuQ29udHJvbGxlcilcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5ib290c3RyYXAoZG9jdW1lbnQsIFsnQXV0b3BpbG90QXBwJ10pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoYXV0b3BpbG90QXBwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgaW5pdENvbW1hbmRTZWxlY3RMaXN0ICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxlbml1bUFwaVhNTEZpbGUgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoU2VydmljZXMuQ29uZmlnLnNlbGVuaXVtQXBpWE1MKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmU6IChjb21tYW5kU2VsZWN0TGlzdDogU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QpID0+IHZvaWQsIHJlamVjdDogKGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21tYW5kU2VsZWN0TGlzdCA9IG5ldyBTZXJ2aWNlcy5Db21tYW5kU2VsZWN0TGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICBjb21tYW5kU2VsZWN0TGlzdC5sb2FkKHNlbGVuaXVtQXBpWE1MRmlsZSkudGhlbigoKSA9PiByZXNvbHZlKGNvbW1hbmRTZWxlY3RMaXN0KSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyLnNldEFwaURvY3Moc2VsZW5pdW1BcGlYTUxGaWxlKS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeShyZXNvbHZlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBpbml0VGFiSW5pdGlhbGl6ZXIgKHJlc29sdmUsIGNhdGNoRXJyb3IpIHtcbiAgICAgICAgICAgIChuZXcgUHJvbWlzZSgocmVzb2x2ZTogKG1hbmFnZXI6IFNlcnZpY2VzLlRhYi5NYW5hZ2VyKSA9PiB2b2lkLCByZWplY3Q6IChlcnJvck1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBpbml0aWFsaXplciA9IG5ldyBTZXJ2aWNlcy5UYWIuSW5pdGlhbGl6ZXIodGhpcy5jYWxsZWRUYWJJZCk7XG4gICAgICAgICAgICAgICAgaW5pdGlhbGl6ZXIuc3RhcnQoKS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICB9KSkudGhlbigobWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRDb21tYW5kU2VsZWN0TGlzdCgpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRTZWxlY3RMaXN0ID0gcmVzdWx0cy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRBbmd1bGFyKG1hbmFnZXIsIGNvbW1hbmRTZWxlY3RMaXN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChjYXRjaEVycm9yKVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goY2F0Y2hFcnJvcik7XG4gICAgICAgICAgICB9KS5jYXRjaChjYXRjaEVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBpbml0aWFsaXplICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSh0aGlzLmluaXRUYWJJbml0aWFsaXplci5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==