var UUID;
(function (_UUID) {
    var InvalidUUIDFormat = (function () {
        function InvalidUUIDFormat() {
        }
        return InvalidUUIDFormat;
    })();
    ;
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
})(UUID || (UUID = {}));
var Base;
(function (Base) {
    var Identity = (function () {
        function Identity(uuid) {
            if (typeof uuid === "undefined") { uuid = new UUID.UUID; }
            this.uuid = uuid;
        }
        Identity.prototype.eq = function (e) {
            return this.uuid.toString() === e.uuid.toString();
        };
        return Identity;
    })();
    Base.Identity = Identity;
})(Base || (Base = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base;
(function (Base) {
    (function (Entity) {
        var Model = (function (_super) {
            __extends(Model, _super);
            function Model(identity) {
                if (typeof identity === "undefined") { identity = new Base.Identity(new UUID.UUID); }
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
})(Base || (Base = {}));
var Base;
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
})(Base || (Base = {}));
var Models;
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
        })(Base.Entity.Model);
        Command.Model = Model;
    })(Models.Command || (Models.Command = {}));
    var Command = Models.Command;
})(Models || (Models = {}));
var Models;
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
        })(Base.EntityList.Model);
        CommandList.Model = Model;
    })(Models.CommandList || (Models.CommandList = {}));
    var CommandList = Models.CommandList;
})(Models || (Models = {}));
var Message;
(function (Message) {
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model() {
            _super.apply(this, arguments);
        }
        return Model;
    })(Base.Entity.Model);
    Message.Model = Model;
})(Message || (Message = {}));
var Message;
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
})(Message || (Message = {}));
var Base;
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
})(Base || (Base = {}));
var Models;
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
})(Models || (Models = {}));
var Models;
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
        })(Base.EntityList.Repository);
        CommandList.Repository = Repository;
    })(Models.CommandList || (Models.CommandList = {}));
    var CommandList = Models.CommandList;
})(Models || (Models = {}));
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
})(Message || (Message = {}));
var Message;
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
})(Message || (Message = {}));
var Message;
(function (Message) {
    (function (PlayCommandList) {
        var Repository = (function (_super) {
            __extends(Repository, _super);
            function Repository() {
                _super.apply(this, arguments);
                this.commandListRepository = new Models.CommandList.Repository();
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
})(Message || (Message = {}));
var Message;
(function (Message) {
    (function (AddComment) {
        var Repository = (function (_super) {
            __extends(Repository, _super);
            function Repository() {
                _super.apply(this, arguments);
                this.commandRepository = new Models.Command.Repository();
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
})(Message || (Message = {}));
var Message;
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
})(Message || (Message = {}));
var Autopilot;
(function (Autopilot) {
    var Controller = (function () {
        function Controller($scope, connectTab, commandList, messageDispatcher) {
            var _this = this;
            this.messagePlayCommandListRepository = new Message.PlayCommandList.Repository();
            $scope.commandList = commandList;
            $scope.playAll = function () {
                var message = new Message.PlayCommandList.Model($scope.commandList);
                connectTab.postMessage(_this.messagePlayCommandListRepository.toObject(message));
            };
            connectTab.onMessage.addListener(function (message) {
                messageDispatcher.dispatch(message, {
                    MessageAddCommentModel: function (message) {
                        $scope.commandList.add(message.command);
                    }
                });
            });
        }
        return Controller;
    })();
    Autopilot.Controller = Controller;
})(Autopilot || (Autopilot = {}));
var ConnectTab = (function () {
    function ConnectTab() {
        this.errorMessage = 'Security Error.\ndoes not run on "chrome://" page.\n';
    }
    ConnectTab.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, rejectAll) {
            var reject = function () {
                rejectAll(_this.errorMessage);
            };
            chrome.tabs.query({
                'active': true,
                'windowType': 'normal',
                'lastFocusedWindow': true
            }, function (tabs) {
                var tab = tabs[0];
                if (tab) {
                    chrome.storage.local.set({
                        'lastFocusedWindowId': tab.windowId,
                        'lastFocusedWindowUrl': tab.url
                    });
                    return resolve(tab.id);
                } else {
                    chrome.storage.local.get(['lastFocusedWindowId', 'lastFocusedWindowUrl'], function (lastFocusedWindow) {
                        if (!lastFocusedWindow['lastFocusedWindowId']) {
                            return reject();
                        }
                        chrome.tabs.query({
                            'active': true,
                            'url': lastFocusedWindow['lastFocusedWindowUrl'],
                            'windowId': lastFocusedWindow['lastFocusedWindowId']
                        }, function (tabs) {
                            var tab = tabs[0];
                            if (tab) {
                                return resolve(tab.id);
                            }
                            return reject();
                        });
                    });
                }
            });
        });
    };
    return ConnectTab;
})();
var InjectScripts = (function () {
    function InjectScripts() {
    }
    InjectScripts.prototype.connect = function (tabid, injectScripts_) {
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
                executeScript(injectScripts.shift());
            });
        });
    };
    return InjectScripts;
})();
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
    Config.seleniumApiXML = 'src/js/selenium-ide/iedoc-core.xml';
    return Config;
})();
var LoadSeleniumCommandXML = (function () {
    function LoadSeleniumCommandXML() {
        this.errorMessage = 'selenium command xml load failed.\n';
    }
    LoadSeleniumCommandXML.prototype.loadFile = function (file) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', file);
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 0 || xhr.status !== 200) {
                    return reject(_this.errorMessage + file);
                }
                window.Command.apiDocuments = new Array(xhr.responseXML.documentElement);
                resolve();
            };
            xhr.send(null);
        });
    };
    return LoadSeleniumCommandXML;
})();
var autopilotApp;
var catchError = function (messages) {
    alert([].concat(messages).join('\n'));
};
(new Promise(function (resolve, reject) {
    (new ConnectTab()).connect().then(resolve).catch(reject);
})).then(function (tabid) {
    Promise.all([
        new Promise(function (resolve, reject) {
            (new LoadSeleniumCommandXML()).loadFile(Config.seleniumApiXML).then(resolve).catch(reject);
        }),
        new Promise(function (resolve, reject) {
            (new InjectScripts()).connect(tabid, Config.injectScripts).then(resolve).catch(reject);
        }),
        new Promise(function (resolve) {
            angular.element(document).ready(resolve);
        })
    ]).then(function () {
        autopilotApp = angular.module('AutopilotApp', ['ui.sortable']).factory('connectTab', function () {
            return chrome.tabs.connect(tabid);
        }).factory('commandList', function () {
            return new Models.CommandList.Model();
        }).service('messageDispatcher', Message.Dispatcher).controller('Autopilot', Autopilot.Controller);
        angular.bootstrap(document, ['AutopilotApp']);
    }).catch(catchError);
}).catch(catchError);
