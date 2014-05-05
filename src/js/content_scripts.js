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
                        Model.name = 'addComment';
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
                            this.commandRepository = new ts.Models.Command.Repository();
                        }
                        Repository.prototype.toObject = function (message) {
                            return {
                                'name': AddComment.Model.name,
                                'command': this.commandRepository.toObject(message.command),
                                'insertBeforeLastCommand': message.insertBeforeLastCommand
                            };
                        };
                        Repository.prototype.fromObject = function (message) {
                            var command = this.commandRepository.fromObject(message.command);
                            var insertBeforeLastCommand = !!message.insertBeforeLastCommand;
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
var ts;
(function (ts) {
    (function (Base) {
        (function (EntityList) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(list) {
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
                        'commands': _super.prototype.toEntityList.call(this, commandList),
                        'name': commandList.name,
                        'url': commandList.url
                    };
                };
                Repository.prototype.fromObject = function (commandList) {
                    return new CommandList.Model(_super.prototype.fromEntityList.call(this, commandList['commands']), commandList['name'], commandList['url']);
                };
                return Repository;
            })(ts.Base.EntityList.Repository);
            CommandList.Repository = Repository;
        })(Models.CommandList || (Models.CommandList = {}));
        var CommandList = Models.CommandList;
    })(ts.Models || (ts.Models = {}));
    var Models = ts.Models;
})(ts || (ts = {}));
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
                        Model.name = 'playCommandList';
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
                            this.commandListRepository = new ts.Models.CommandList.Repository();
                        }
                        Repository.prototype.toObject = function (message) {
                            return {
                                'name': PlayCommandList.Model.name,
                                'commandList': this.commandListRepository.toObject(message.commandList)
                            };
                        };
                        Repository.prototype.fromObject = function (message) {
                            return new PlayCommandList.Model(this.commandListRepository.fromObject(message));
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
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
                var Dispatcher = (function () {
                    function Dispatcher() {
                        this.messageAddCommentModel = new Message.AddComment.Repository();
                        this.messagePlayCommandListModel = new Message.PlayCommandList.Repository();
                    }
                    Dispatcher.prototype.dispatch = function (message, dispatcher) {
                        if (message.name == Message.AddComment.Model.name) {
                            dispatcher.MessageAddCommentModel(this.messageAddCommentModel.fromObject(message));
                        } else if (message.name == Message.PlayCommandList.Model.name) {
                            dispatcher.MessagePlayCommandListModel(this.messagePlayCommandListModel.fromObject(message));
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

window.getBrowser = function () {
    return { 'selectedBrowser': { 'contentWindow': window } };
};
window.lastWindow = window;

var globalPort;
setInterval(function () {
    console.debug(undefined);
}, 3000);

(function () {
    var recorderObserver = new ts.Application.Services.RecorderObserver();
    var messageAddCommentRepository = new ts.Application.Models.Message.AddComment.Repository();
    var messageDispatcher = new ts.Application.Models.Message.Dispatcher();
    var selenium = window.createSelenium(location.href, true);
    selenium.browserbot.selectWindow(null);

    chrome.extension.onConnect.addListener(function (port) {
        globalPort = port;
        Recorder.register(recorderObserver, window);
        recorderObserver.addCommand = function (commandName, target, value, window, insertBeforeLastCommand) {
            var message = {
                'command': {
                    'type': commandName,
                    'target': target,
                    'value': value
                },
                'insertBeforeLastCommand': insertBeforeLastCommand
            };
            var addCommentMessage = messageAddCommentRepository.fromObject(message);
            port.postMessage(messageAddCommentRepository.toObject(addCommentMessage));
        };
        port.onMessage.addListener(function (message) {
            messageDispatcher.dispatch(message, {
                MessagePlayCommandListModel: function (message) {
                    message.commandList;
                }
            });
        });
    });
})();
