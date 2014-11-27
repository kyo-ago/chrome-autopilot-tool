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
/// <reference path="./Model.ts" />
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
                };
                return ContentScriptsCtrl;
            })();
            Controllers.ContentScriptsCtrl = ContentScriptsCtrl;
        })(Controllers = Application.Controllers || (Application.Controllers = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
/// <reference path="_loadtsd.ts" />
/// <reference path="Applications/Controllers/ContentScriptsCtrl.ts" />
var globalPort;
(function () {
    if ('undefined' !== typeof TestInitialize) {
        return;
    }
    chrome.extension.onConnect.addListener(function (port) {
        globalPort = port;
        var contentScriptsCtrl = new Cat.Application.Controllers.ContentScriptsCtrl(port);
        contentScriptsCtrl.initialize();
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            contentScriptsCtrl.onMessage(message, sender, sendResponse);
        });
        window.onunload = function () {
            port = null;
        };
    });
})();
