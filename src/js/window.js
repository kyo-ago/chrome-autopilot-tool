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
var ts;
(function (ts) {
    (function (Application) {
        (function (Models) {
            (function (Message) {
                (function (PlaySeleniumCommandResult) {
                    var Model = (function (_super) {
                        __extends(Model, _super);
                        function Model(command) {
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
            var TabManager = (function () {
                function TabManager(calledTabId, initialize, resolve, reject) {
                    var _this = this;
                    this.initialize = function () {
                    };
                    this.onMessageListeners = [];
                    this.onDisconnectListeners = [];
                    this.onConnectListeners = [];
                    this.closeMessage = 'Close test case?';
                    this.initialize = initialize;
                    this.getTab(calledTabId).then(function (tab) {
                        _this.tab = tab;
                        _this.initialize(_this).then(function () {
                            _this.connectTab();
                            resolve(_this);
                        }).catch(reject);
                    }).catch(reject);
                }
                TabManager.prototype.getTab = function (calledTabId) {
                    return new Promise(function (resolve, rejectAll) {
                        var reject = function () {
                            rejectAll('Security Error.\ndoes not run on "chrome://" page.\n');
                        };
                        chrome.tabs.get(parseInt(calledTabId), function (tab) {
                            if (tab && tab.id) {
                                resolve(tab);
                            } else {
                                reject();
                            }
                        });
                    });
                };

                TabManager.prototype.connectTab = function () {
                    var _this = this;
                    this.port = chrome.tabs.connect(this.tab.id);
                    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
                        if (_this.tab.id !== tabId) {
                            return;
                        }
                        if (confirm(_this.closeMessage)) {
                            window.close();
                        }
                    });
                    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
                        if (_this.tab.id !== tabId) {
                            return;
                        }
                        if (changeInfo.status !== 'complete') {
                            return;
                        }
                        _this.reloadTab();
                    });
                };
                TabManager.prototype.reloadTab = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.initialize(_this).then(function () {
                            _this.port = chrome.tabs.connect(_this.tab.id);
                            _this.onConnectListeners.forEach(function (listener) {
                                return listener();
                            });
                            _this.onMessageListeners.forEach(function (listener) {
                                return _this.port.onMessage.addListener(listener);
                            });
                            _this.onDisconnectListeners.forEach(function (listener) {
                                return _this.port.onDisconnect.addListener(listener);
                            });
                            resolve();
                        }).catch(reject);
                    });
                };
                TabManager.prototype.getTabId = function () {
                    return this.tab.id;
                };
                TabManager.prototype.getTabURL = function () {
                    return this.tab.url;
                };
                TabManager.prototype.postMessage = function (message) {
                    this.port.postMessage(message);
                };
                TabManager.prototype.sendMessage = function (message, callback) {
                    chrome.tabs.sendMessage(this.tab.id, message, callback);
                };
                TabManager.prototype.onMessage = function (callback) {
                    this.onMessageListeners.push(callback);
                    this.port.onMessage.addListener(callback);
                };
                TabManager.prototype.onConnect = function (callback) {
                    this.onConnectListeners.push(callback);
                };
                TabManager.prototype.onDisconnect = function (callback) {
                    this.onDisconnectListeners.push(callback);
                    this.port.onDisconnect.addListener(callback);
                };
                return TabManager;
            })();
            Services.TabManager = TabManager;
        })(Application.Services || (Application.Services = {}));
        var Services = Application.Services;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
var ts;
(function (ts) {
    (function (Application) {
        (function (Services) {
            (function (Selenium) {
                var Base = (function () {
                    function Base(callback) {
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
                                        'timeout': 1
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
                        return 1;
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
var ts;
(function (ts) {
    (function (Application) {
        (function (Services) {
            (function (Selenium) {
                var Sender = (function (_super) {
                    __extends(Sender, _super);
                    function Sender(tabManager, messageDispatcher) {
                        _super.call(this, function () {
                            return new window.ChromeExtensionBackedSelenium(tabManager.getTabURL(), '');
                        });
                        this.tabManager = tabManager;
                        this.messageDispatcher = messageDispatcher;
                        this.messagePlaySeleniumCommandExecuteRepository = new Application.Models.Message.PlaySeleniumCommandExecute.Repository();
                        window.shouldAbortCurrentCommand = function () {
                            return true;
                        };
                        tabManager.onConnect(function () {
                            window.shouldAbortCurrentCommand = function () {
                                return true;
                            };
                        });
                        tabManager.onDisconnect(function () {
                            window.shouldAbortCurrentCommand = function () {
                                return false;
                            };
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
                        this.tabManager.sendMessage(this.messagePlaySeleniumCommandExecuteRepository.toObject(message), function (message) {
                            _this.messageDispatcher.dispatch(message, {
                                MessagePlaySeleniumCommandResultModel: function (message) {
                                    return callback('OK', true);
                                }
                            });
                        });
                    };
                    return Sender;
                })(Selenium.Base);
                Selenium.Sender = Sender;
            })(Services.Selenium || (Services.Selenium = {}));
            var Selenium = Services.Selenium;
        })(Application.Services || (Application.Services = {}));
        var Services = Application.Services;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
var ts;
(function (ts) {
    (function (Application) {
        (function (Controllers) {
            (function (Autopilot) {
                var Controller = (function () {
                    function Controller($scope, tabManager, commandList, messageDispatcher, seleniumSender) {
                        $scope.commandList = commandList;
                        $scope.playAll = function () {
                            seleniumSender.addCommandList($scope.commandList);
                            seleniumSender.start();
                        };
                        tabManager.onMessage(function (message) {
                            messageDispatcher.dispatch(message, {
                                MessageAddCommentModel: function (message) {
                                    $scope.$apply(function () {
                                        $scope.commandList.add(message.command);
                                    });
                                }
                            });
                        });
                    }
                    return Controller;
                })();
                Autopilot.Controller = Controller;
            })(Controllers.Autopilot || (Controllers.Autopilot = {}));
            var Autopilot = Controllers.Autopilot;
        })(Application.Controllers || (Application.Controllers = {}));
        var Controllers = Application.Controllers;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
var ts;
(function (ts) {
    (function (Application) {
        (function (Services) {
            var InjectScripts = (function () {
                function InjectScripts() {
                }
                InjectScripts.connect = function (tabid, injectScripts_) {
                    var injectScripts = injectScripts_.slice();
                    return new Promise(function (resolve) {
                        var executeScript = function (injectScript) {
                            chrome.tabs.executeScript(tabid, {
                                'file': injectScript
                            }, function () {
                                if (injectScripts.length) {
                                    return executeScript(injectScripts.shift());
                                }
                                chrome.tabs.executeScript(tabid, {
                                    'code': 'this.extensionContentLoaded = true'
                                }, function () {
                                    resolve();
                                });
                            });
                        };
                        chrome.tabs.executeScript(tabid, {
                            'code': 'this.extensionContentLoaded'
                        }, function (result) {
                            if (result && result.length && result[0]) {
                                return resolve();
                            }
                            executeScript(injectScripts.shift());
                        });
                    });
                };
                return InjectScripts;
            })();
            Services.InjectScripts = InjectScripts;
        })(Application.Services || (Application.Services = {}));
        var Services = Application.Services;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
var ts;
(function (ts) {
    (function (Application) {
        (function (Services) {
            var Config = (function () {
                function Config() {
                }
                Config.injectScripts = [
                    "src/js/lib/xpath.js",
                    "src/js/selenium-ide/tools.js",
                    "src/js/selenium-ide/htmlutils.js",
                    "src/js/selenium-ide/selenium-browserdetect.js",
                    "src/js/selenium-ide/selenium-atoms.js",
                    "src/js/selenium-ide/selenium-browserbot.js",
                    "src/js/selenium-ide/selenium-api.js",
                    "src/js/selenium-ide/selenium-executionloop.js",
                    "src/js/selenium-ide/selenium-testrunner.js",
                    "src/js/selenium-ide/selenium-commandhandlers.js",
                    "src/js/selenium-ide/selenium-runner.js",
                    "src/js/selenium-ide/recorder.js",
                    "src/js/selenium-ide/recorder-handlers.js",
                    "src/js/selenium-ide/testCase.js",
                    "src/js/content_scripts.js"
                ];
                Config.seleniumApiXML = '/src/js/selenium-ide/iedoc-core.xml';
                return Config;
            })();
            Services.Config = Config;
        })(Application.Services || (Application.Services = {}));
        var Services = Application.Services;
    })(ts.Application || (ts.Application = {}));
    var Application = ts.Application;
})(ts || (ts = {}));
var calledTabId = location.hash.replace(/^#/, '');

var autopilotApp;
var catchError = function (messages) {
    alert([].concat(messages).join('\n'));
};
var applicationServicesSeleniumSender;
(new Promise(function (resolve, reject) {
    new ts.Application.Services.TabManager(calledTabId, function (tabManager) {
        var injectScripts = ts.Application.Services.Config.injectScripts;
        return ts.Application.Services.InjectScripts.connect(tabManager.getTabId(), injectScripts);
    }, resolve, reject);
})).then(function (tabManager) {
    Promise.all([
        new Promise(function (resolve, reject) {
            var file = chrome.runtime.getURL(ts.Application.Services.Config.seleniumApiXML);
            ts.Application.Services.Selenium.Sender.loadFile(file).then(resolve).catch(reject);
        }),
        new Promise(function (resolve) {
            angular.element(document).ready(resolve);
        })
    ]).then(function () {
        autopilotApp = angular.module('AutopilotApp', ['ui.sortable']).factory('tabManager', function () {
            return tabManager;
        }).service('messageDispatcher', ts.Application.Models.Message.Dispatcher).factory('seleniumSender', function (tabManager, messageDispatcher) {
            applicationServicesSeleniumSender = new ts.Application.Services.Selenium.Sender(tabManager, messageDispatcher);
            return applicationServicesSeleniumSender;
        }).factory('commandList', function () {
            return new ts.Models.CommandList.Model();
        }).controller('Autopilot', ts.Application.Controllers.Autopilot.Controller);
        angular.bootstrap(document, ['AutopilotApp']);
    }).catch(catchError);
}).catch(catchError);
