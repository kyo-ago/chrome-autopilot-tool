var ts;
(function (ts) {
    (function (_UUID) {
        var InvalidUUIDFormat = (function () {
            function InvalidUUIDFormat() {
            }
            return InvalidUUIDFormat;
        })();
        var UUID = (function () {
            function UUID(id) {
                if (typeof id === "undefined") { id = undefined; }
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
    })(ts.UUID || (ts.UUID = {}));
    var UUID = ts.UUID;
})(ts || (ts = {}));
/// <reference path="UUID" />
var ts;
(function (ts) {
    (function (Base) {
        var Identity = (function () {
            function Identity(uuid) {
                if (typeof uuid === "undefined") { uuid = new ts.UUID.UUID; }
                this.uuid = uuid;
            }
            Identity.prototype.eq = function (e) {
                return this.uuid.toString() === e.uuid.toString();
            };
            return Identity;
        })();
        Base.Identity = Identity;
    })(ts.Base || (ts.Base = {}));
    var Base = ts.Base;
})(ts || (ts = {}));
/// <reference path="../Identity" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ts;
(function (ts) {
    (function (Base) {
        (function (Entity) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(identity) {
                    if (typeof identity === "undefined") { identity = new Base.Identity(new ts.UUID.UUID); }
                    _super.call(this, identity.uuid);
                    this.identity = identity;
                }
                Model.prototype.eq = function (e) {
                    return _super.prototype.eq.call(this, e.identity);
                };
                return Model;
            })(Base.Identity);
            Entity.Model = Model;
        })(Base.Entity || (Base.Entity = {}));
        var Entity = Base.Entity;
    })(ts.Base || (ts.Base = {}));
    var Base = ts.Base;
})(ts || (ts = {}));
/// <reference path="../../Base/Entity/Model.ts" />
var ts;
(function (ts) {
    (function (Models) {
        (function (Command) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(type, target, value) {
                    if (typeof type === "undefined") { type = ''; }
                    if (typeof target === "undefined") { target = ''; }
                    if (typeof value === "undefined") { value = ''; }
                    _super.call(this);
                    this.type = type;
                    this.target = target;
                    this.value = value;
                }
                return Model;
            })(ts.Base.Entity.Model);
            Command.Model = Model;
        })(Models.Command || (Models.Command = {}));
        var Command = Models.Command;
    })(ts.Models || (ts.Models = {}));
    var Models = ts.Models;
})(ts || (ts = {}));
/// <reference path="../../../Base/Entity/Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (SeleniumCommand) {
                var Model = (function (_super) {
                    __extends(Model, _super);
                    function Model(type, args) {
                        if (typeof type === "undefined") { type = ''; }
                        if (typeof args === "undefined") { args = []; }
                        _super.call(this);
                        this.type = type;
                        this.args = args;
                    }
                    return Model;
                })(ts.Base.Entity.Model);
                SeleniumCommand.Model = Model;
            })(Models.SeleniumCommand || (Models.SeleniumCommand = {}));
            var SeleniumCommand = Models.SeleniumCommand;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="./Model.ts" />
/// <reference path="../../Base/Entity/Repository.ts" />
/// <reference path="./Model.ts" />
var ts;
(function (ts) {
    (function (Models) {
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
        })(Models.Command || (Models.Command = {}));
        var Command = Models.Command;
    })(ts.Models || (ts.Models = {}));
    var Models = ts.Models;
})(ts || (ts = {}));
/// <reference path="../../../Base/Entity/Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
                var Model = (function (_super) {
                    __extends(Model, _super);
                    function Model() {
                        _super.apply(this, arguments);
                    }
                    return Model;
                })(ts.Base.Entity.Model);
                Message.Model = Model;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../Base/Entity/Repository.ts" />
/// <reference path="./Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
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
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../../Models/Command/Model.ts" />
/// <reference path="../Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
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
                })(Message.AddComment || (Message.AddComment = {}));
                var AddComment = Message.AddComment;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../../Models/Command/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
                (function (AddComment) {
                    var Repository = (function (_super) {
                        __extends(Repository, _super);
                        function Repository() {
                            _super.apply(this, arguments);
                            this.repository = new ts.Models.Command.Repository();
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
                })(Message.AddComment || (Message.AddComment = {}));
                var AddComment = Message.AddComment;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../../Models/Command/Model.ts" />
/// <reference path="../Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
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
                })(Message.PlayCommand || (Message.PlayCommand = {}));
                var PlayCommand = Message.PlayCommand;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../../Models/Command/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
                (function (PlayCommand) {
                    var Repository = (function (_super) {
                        __extends(Repository, _super);
                        function Repository() {
                            _super.apply(this, arguments);
                            this.repository = new ts.Models.Command.Repository();
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
                })(Message.PlayCommand || (Message.PlayCommand = {}));
                var PlayCommand = Message.PlayCommand;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../Identity" />
/// <reference path="../Entity/Model.ts" />
var ts;
(function (ts) {
    (function (Base) {
        (function (EntityList) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(list) {
                    if (typeof list === "undefined") { list = []; }
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
                    this.list = this.list.map(function (e) {
                        return e.identity.eq(identity) ? entity : e;
                    });
                };
                Model.prototype.remove = function (entity) {
                    this.list = this.list.filter(function (e) {
                        return !e.eq(entity);
                    });
                };
                Model.prototype.clear = function () {
                    this.list = [];
                };
                return Model;
            })(Base.Entity.Model);
            EntityList.Model = Model;
        })(Base.EntityList || (Base.EntityList = {}));
        var EntityList = Base.EntityList;
    })(ts.Base || (ts.Base = {}));
    var Base = ts.Base;
})(ts || (ts = {}));
/// <reference path="./Model.ts" />
/// <reference path="../Entity/Repository.ts" />
var ts;
(function (ts) {
    (function (Base) {
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
        })(Base.EntityList || (Base.EntityList = {}));
        var EntityList = Base.EntityList;
    })(ts.Base || (ts.Base = {}));
    var Base = ts.Base;
})(ts || (ts = {}));
/// <reference path="../../Base/EntityList/Model.ts" />
/// <reference path="../Command/Model.ts" />
var ts;
(function (ts) {
    (function (Models) {
        (function (CommandList) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(commands, name, url) {
                    if (typeof commands === "undefined") { commands = []; }
                    if (typeof name === "undefined") { name = ''; }
                    if (typeof url === "undefined") { url = ''; }
                    _super.call(this, commands);
                    this.commands = commands;
                    this.name = name;
                    this.url = url;
                }
                Model.prototype.clear = function () {
                    this.name = '';
                    this.url = '';
                    _super.prototype.clear.call(this);
                };
                return Model;
            })(ts.Base.EntityList.Model);
            CommandList.Model = Model;
        })(Models.CommandList || (Models.CommandList = {}));
        var CommandList = Models.CommandList;
    })(ts.Models || (ts.Models = {}));
    var Models = ts.Models;
})(ts || (ts = {}));
/// <reference path="../../Base/EntityList/Repository.ts" />
/// <reference path="../Command/Repository.ts" />
/// <reference path="./Model.ts" />
var ts;
(function (ts) {
    (function (Models) {
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
                    var commandListObject = _super.prototype.fromEntityList.call(this, commandList['commandList']);
                    return new CommandList.Model(commandListObject, commandList['name'], commandList['url']);
                };
                return Repository;
            })(ts.Base.EntityList.Repository);
            CommandList.Repository = Repository;
        })(Models.CommandList || (Models.CommandList = {}));
        var CommandList = Models.CommandList;
    })(ts.Models || (ts.Models = {}));
    var Models = ts.Models;
})(ts || (ts = {}));
/// <reference path="../../../../Models/CommandList/Model.ts" />
/// <reference path="../Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
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
                })(Message.PlayCommandList || (Message.PlayCommandList = {}));
                var PlayCommandList = Message.PlayCommandList;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../../Models/CommandList/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
                (function (PlayCommandList) {
                    var Repository = (function (_super) {
                        __extends(Repository, _super);
                        function Repository() {
                            _super.apply(this, arguments);
                            this.repository = new ts.Models.CommandList.Repository();
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
                })(Message.PlayCommandList || (Message.PlayCommandList = {}));
                var PlayCommandList = Message.PlayCommandList;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../Base/Entity/Repository.ts" />
/// <reference path="./Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
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
            })(Models.SeleniumCommand || (Models.SeleniumCommand = {}));
            var SeleniumCommand = Models.SeleniumCommand;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../Models/SeleniumCommand/Model.ts" />
/// <reference path="../Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
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
                })(Message.PlaySeleniumCommandExecute || (Message.PlaySeleniumCommandExecute = {}));
                var PlaySeleniumCommandExecute = Message.PlaySeleniumCommandExecute;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../Models/SeleniumCommand/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
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
                })(Message.PlaySeleniumCommandExecute || (Message.PlaySeleniumCommandExecute = {}));
                var PlaySeleniumCommandExecute = Message.PlaySeleniumCommandExecute;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../Models/SeleniumCommand/Model.ts" />
/// <reference path="../Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
                (function (PlaySeleniumCommandResult) {
                    var Model = (function (_super) {
                        __extends(Model, _super);
                        //page reloading
                        function Model(command) {
                            if (typeof command === "undefined") { command = 'OK'; }
                            _super.call(this);
                            this.command = command;
                        }
                        Model.messageName = 'playSeleniumCommandResult';
                        return Model;
                    })(Message.Model);
                    PlaySeleniumCommandResult.Model = Model;
                })(Message.PlaySeleniumCommandResult || (Message.PlaySeleniumCommandResult = {}));
                var PlaySeleniumCommandResult = Message.PlaySeleniumCommandResult;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../Models/SeleniumCommand/Repository.ts" />
/// <reference path="../Repository.ts" />
/// <reference path="./Model.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
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
                })(Message.PlaySeleniumCommandResult || (Message.PlaySeleniumCommandResult = {}));
                var PlaySeleniumCommandResult = Message.PlaySeleniumCommandResult;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="./AddCommand/Repository.ts" />
/// <reference path="./PlayCommand/Repository.ts" />
/// <reference path="./PlayCommandList/Repository.ts" />
/// <reference path="./PlaySeleniumCommandExecute/Repository.ts" />
/// <reference path="./PlaySeleniumCommandResult/Repository.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
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
                        if (message.name == Message.AddComment.Model.messageName) {
                            dispatcher.MessageAddCommentModel && dispatcher.MessageAddCommentModel(this.messageAddCommentModel.fromObject(message));
                        } else if (message.name == Message.PlayCommand.Model.messageName) {
                            dispatcher.MessagePlayCommandModel && dispatcher.MessagePlayCommandModel(this.messagePlayCommandModel.fromObject(message));
                        } else if (message.name == Message.PlayCommandList.Model.messageName) {
                            dispatcher.MessagePlayCommandListModel && dispatcher.MessagePlayCommandListModel(this.messagePlayCommandListModel.fromObject(message));
                        } else if (message.name == Message.PlaySeleniumCommandExecute.Model.messageName) {
                            dispatcher.MessagePlaySeleniumCommandExecuteModel && dispatcher.MessagePlaySeleniumCommandExecuteModel(this.messagePlaySeleniumCommandExecuteModel.fromObject(message));
                        } else if (message.name == Message.PlaySeleniumCommandResult.Model.messageName) {
                            dispatcher.MessagePlaySeleniumCommandResultModel && dispatcher.MessagePlaySeleniumCommandResultModel(this.messagePlaySeleniumCommandResultModel.fromObject(message));
                        } else {
                            throw new Error('Invalid message: ' + JSON.stringify(message));
                        }
                    };
                    return Dispatcher;
                })();
                Message.Dispatcher = Dispatcher;
            })(Models.Message || (Models.Message = {}));
            var Message = Models.Message;
        })(Application.Models || (Application.Models = {}));
        var Models = Application.Models;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
var ts;
(function (ts) {
    (function (Application) {
        (function (Services) {
            var RecorderObserver = (function () {
                function RecorderObserver() {
                    this.recordingEnabled = true;
                    this.isSidebar = false;
                }
                RecorderObserver.prototype.getUserLog = function () {
                    return console;
                };
                RecorderObserver.prototype.addCommand = function (command, target, value, window, insertBeforeLastCommand) {
                };
                RecorderObserver.prototype.onUnloadDocument = function (doc) {
                };
                return RecorderObserver;
            })();
            Services.RecorderObserver = RecorderObserver;
        })(Application.Services || (Application.Services = {}));
        var Services = Application.Services;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Services) {
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

                    Base.loadFile = function (file) {
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
            })(Services.Selenium || (Services.Selenium = {}));
            var Selenium = Services.Selenium;
        })(Application.Services || (Application.Services = {}));
        var Services = Application.Services;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="../../Models/SeleniumCommand/Model.ts" />
/// <reference path="./Base.ts" />
var ts;
(function (ts) {
    (function (Application) {
        (function (Services) {
            (function (Selenium) {
                var Receiver = (function (_super) {
                    __extends(Receiver, _super);
                    function Receiver() {
                        _super.call(this, function () {
                            return window.createSelenium(location.href, true);
                        });
                        this.errorMessage = 'missing command: ';
                    }
                    Receiver.prototype.execute = function (model) {
                        var _this = this;
                        if (this.selenium[model.type]) {
                            return this.exec(function () {
                                return _this.selenium[model.type].apply(_this.selenium, model.args);
                            });
                        }
                        var commandName = 'do' + model.type.replace(/^\w/, function (w) {
                            return w.toUpperCase();
                        });
                        if (this.selenium[commandName]) {
                            return this.exec(function () {
                                return _this.selenium[commandName].apply(_this.selenium, model.args);
                            });
                        }
                        var errorMessage = this.errorMessage + JSON.stringify(model);
                        setTimeout(function () {
                            throw new Error(errorMessage);
                        });
                        return 'ERROR ' + errorMessage;
                    };
                    Receiver.prototype.exec = function (exec) {
                        try  {
                            exec();
                            return 'OK';
                        } catch (e) {
                            setTimeout(function () {
                                throw e;
                            });
                            return 'ERROR';
                        }
                    };
                    return Receiver;
                })(Selenium.Base);
                Selenium.Receiver = Receiver;
            })(Services.Selenium || (Services.Selenium = {}));
            var Selenium = Services.Selenium;
        })(Application.Services || (Application.Services = {}));
        var Services = Application.Services;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
/// <reference path="DefinitelyTyped/Selenium/recorder.d.ts" />
/// <reference path="DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="Models/Command/Model.ts" />
/// <reference path="Applications/Models/SeleniumCommand/Model.ts" />
/// <reference path="Applications/Models/Message/Dispatcher.ts" />
/// <reference path="Applications/Services/RecorderObserver.ts" />
/// <reference path="Applications/Services/Selenium/Receiver.ts" />

var globalPort;
(function () {
    var messagePlaySeleniumCommandResultRepository = new ts.Application.Models.Message.PlaySeleniumCommandResult.Repository();
    var messageAddCommentRepository = new ts.Application.Models.Message.AddComment.Repository();
    var recorderObserver = new ts.Application.Services.RecorderObserver();
    var messageDispatcher = new ts.Application.Models.Message.Dispatcher();
    var SeleniumReceiver = new ts.Application.Services.Selenium.Receiver();

    chrome.extension.onConnect.addListener(function (port) {
        globalPort = port;
        Recorder.register(recorderObserver, window);
        recorderObserver.addCommand = function (commandName, target, value, window, insertBeforeLastCommand) {
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
            var addCommentMessage = messageAddCommentRepository.fromObject(message);
            port.postMessage(messageAddCommentRepository.toObject(addCommentMessage));
        };
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            messageDispatcher.dispatch(message, {
                MessagePlaySeleniumCommandExecuteModel: function (message) {
                    Recorder.deregister(recorderObserver, window);
                    var result = SeleniumReceiver.execute(message.command);
                    Recorder.register(recorderObserver, window);
                    var resultMessage = new ts.Application.Models.Message.PlaySeleniumCommandResult.Model(result);
                    sendResponse(messagePlaySeleniumCommandResultRepository.toObject(resultMessage));
                }
            });
        });
        port.onDisconnect.addListener(function () {
            Recorder.deregister(recorderObserver, window);
        });
        window.onunload = function () {
            port = null;
        };
    });
})();
