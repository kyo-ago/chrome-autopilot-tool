window.EventEmitter = window.EventEmitter2;
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
                        var fileLoader = new Application.Services.Tab.FileLoader(Application.Services.Config.injectScripts);
                        fileLoader.gets().then(function () {
                            var initializer = new Application.Services.Tab.Initializer(_this.calledTabId, fileLoader);
                            initializer.start().then(resolve).catch(reject);
                        }).catch(reject);
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
            var Config = (function () {
                function Config() {
                }
                Config.injectScripts = [
                    "src/lib/xpath.js",
                    "src/lib/css-selector.js",
                    "src/selenium-ide/tools.js",
                    "src/selenium-ide/htmlutils.js",
                    "src/selenium-ide/selenium-browserdetect.js",
                    "src/selenium-ide/selenium-atoms.js",
                    "src/selenium-ide/selenium-browserbot.js",
                    "src/selenium-ide/selenium-api.js",
                    "src/selenium-ide/selenium-executionloop.js",
                    "src/selenium-ide/selenium-testrunner.js",
                    "src/selenium-ide/selenium-commandhandlers.js",
                    "src/selenium-ide/selenium-runner.js",
                    "src/selenium-ide/recorder.js",
                    "src/selenium-ide/recorder-handlers.js",
                    "src/selenium-ide/testCase.js",
                    "bower_components/eventemitter2/lib/eventemitter2.js",
                    "src/_define.js",
                    "src/application.js",
                    "src/content_scripts.js"
                ];
                Config.seleniumApiXML = '/src/selenium-ide/iedoc-core.xml';
                return Config;
            })();
            Services.Config = Config;
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Cat.Application || (Cat.Application = {}));
})(Cat || (Cat = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Tab;
            (function (Tab) {
                var FileLoader = (function () {
                    function FileLoader(injectScripts) {
                        this.injectScripts = injectScripts;
                    }
                    FileLoader.prototype.getCode = function () {
                        return this.injectScript;
                    };
                    FileLoader.prototype.gets = function () {
                        var _this = this;
                        return new Promise(function (resolve) {
                            Promise.all(_this.injectScripts.map(function (scp) {
                                return jQuery.get('/' + scp);
                            })).then(function (results) {
                                _this.injectScript = results.join(';\n');
                                resolve();
                            });
                        });
                    };
                    return FileLoader;
                })();
                Tab.FileLoader = FileLoader;
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
            var Tab;
            (function (Tab) {
                var Initializer = (function () {
                    function Initializer(calledTabId, fileLoader) {
                        this.calledTabId = calledTabId;
                        this.fileLoader = fileLoader;
                        this.injectScripts = new Tab.InjectScripts(fileLoader);
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
var Cat;
(function (Cat) {
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var Tab;
            (function (Tab) {
                var InjectScripts = (function () {
                    function InjectScripts(fileLoader) {
                        this.fileLoader = fileLoader;
                        this.injectScript = fileLoader.getCode();
                    }
                    // set double loading flag.
                    InjectScripts.prototype.executeEnd = function (tabid, resolve) {
                        chrome.tabs.executeScript(tabid, {
                            'code': 'this.extensionContentLoaded = true;'
                        }, resolve);
                    };
                    InjectScripts.prototype.executeScript = function (tabid) {
                        var _this = this;
                        return new Promise(function (resolve) {
                            chrome.tabs.executeScript(tabid, {
                                'runAt': 'document_start',
                                'code': _this.injectScript
                            }, function () { return _this.executeEnd(tabid, resolve); });
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
                                _this.executeScript(tabid).then(resolve);
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
                        return this.initialize(this).then(function () {
                            _this.tab.connect();
                            _this.tab.addListener('onRemoved', function () {
                                if (confirm(_this.closeMessage)) {
                                    window.close();
                                }
                            });
                            _this.tab.addListener('onUpdated', function () {
                                _this.reloadTab();
                            });
                        });
                    };
                    Manager.prototype.reloadTab = function () {
                        var _this = this;
                        var tabId = this.tab.getTabId();
                        return new Promise(function (resolve, reject) {
                            _this.initialize(_this).then(function () {
                                chrome.tabs.get(tabId, function (tab) {
                                    _this.tab = new Tab.Model(tab);
                                    _this.tab.connect();
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
            var Tab;
            (function (Tab) {
                var Model = (function (_super) {
                    __extends(Model, _super);
                    function Model(tab) {
                        _super.call(this);
                        this.tab = tab;
                        this.sendMessageResponseInterval = 1000;
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
                        this.port = chrome.tabs.connect(this.tab.id);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2FwcGxpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlcyI6WyIuLi9zcmMvX2RlZmluZS50cyIsIi4uL3NyYy9CYXNlL0lkZW50aXR5LnRzIiwiLi4vc3JjL0Jhc2UvU2VydmljZS50cyIsIi4uL3NyYy9CYXNlL1VVSUQudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL0NvbnRyb2xsZXJzL0F1dG9waWxvdC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvQ29udHJvbGxlcnMvQ29udGVudFNjcmlwdHNDdHJsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Db250cm9sbGVycy9XaW5kb3dDdHJsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9Db21tYW5kU2VsZWN0TGlzdC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvU2VydmljZXMvQ29uZmlnLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9SZWNvcmRlck9ic2VydmVyLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5L01vZGVsLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5L1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQmFzZS9FbnRpdHlMaXN0L01vZGVsLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5TGlzdC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvTW9kZWxzL0NvbW1hbmRMaXN0L01vZGVsLnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kTGlzdC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvQ29tbWFuZEdyaWQvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL0Rpc3BhdGNoZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvU2VsZW5pdW1Db21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvU2VsZW5pdW1Db21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1NlbGVuaXVtL0Jhc2UudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1NlbGVuaXVtL1JlY2VpdmVyLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9TZWxlbml1bS9TZW5kZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1RhYi9GaWxlTG9hZGVyLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9UYWIvSW5pdGlhbGl6ZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1RhYi9JbmplY3RTY3JpcHRzLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9UYWIvTWFuYWdlci50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvU2VydmljZXMvVGFiL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9BZGRDb21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9BZGRDb21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlDb21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5Q29tbWFuZC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5Q29tbWFuZExpc3QvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlDb21tYW5kTGlzdC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS9Nb2RlbC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUvUmVwb3NpdG9yeS50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC9Nb2RlbC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC9SZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbIkNhdCIsIkNhdC5CYXNlIiwiQ2F0LkJhc2UuSWRlbnRpdHkiLCJDYXQuQmFzZS5JZGVudGl0eS5jb25zdHJ1Y3RvciIsIkNhdC5CYXNlLklkZW50aXR5LmVxIiwiQ2F0LkJhc2UuU2VydmljZSIsIkNhdC5CYXNlLlNlcnZpY2UuY29uc3RydWN0b3IiLCJDYXQuVVVJRCIsIkNhdC5VVUlELkludmFsaWRVVUlERm9ybWF0IiwiQ2F0LlVVSUQuSW52YWxpZFVVSURGb3JtYXQuY29uc3RydWN0b3IiLCJDYXQuVVVJRC5VVUlEIiwiQ2F0LlVVSUQuVVVJRC5jb25zdHJ1Y3RvciIsIkNhdC5VVUlELlVVSUQudG9TdHJpbmciLCJDYXQuVVVJRC5VVUlELmZyb21TdHJpbmciLCJDYXQuVVVJRC5VVUlELlM0IiwiQ2F0LkFwcGxpY2F0aW9uIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5BdXRvcGlsb3QuQ29udHJvbGxlciIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5BdXRvcGlsb3QuQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5BdXRvcGlsb3QuQ29udHJvbGxlci5iaW5kVGFiTWFuYWdlciIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuQ29udGVudFNjcmlwdHNDdHJsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkNvbnRlbnRTY3JpcHRzQ3RybC5vbk1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuQ29udGVudFNjcmlwdHNDdHJsLmFkZENvbW1hbmQiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuQ29udGVudFNjcmlwdHNDdHJsLmluaXRpYWxpemUiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLldpbmRvd0N0cmwuaW5pdEFuZ3VsYXIiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybC5pbml0Q29tbWFuZFNlbGVjdExpc3QiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybC5pbml0VGFiSW5pdGlhbGl6ZXIiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybC5pbml0aWFsaXplIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbW1hbmRTZWxlY3RMaXN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbW1hbmRTZWxlY3RMaXN0LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbW1hbmRTZWxlY3RMaXN0LmxvYWQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QuZ2V0RG9jUm9vdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5Db21tYW5kU2VsZWN0TGlzdC5nZXRzIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbmZpZyIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5Db25maWcuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuUmVjb3JkZXJPYnNlcnZlciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXIuZ2V0VXNlckxvZyIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyLmFkZENvbW1hbmQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuUmVjb3JkZXJPYnNlcnZlci5vblVubG9hZERvY3VtZW50IiwiQ2F0LkJhc2UuRW50aXR5IiwiQ2F0LkJhc2UuRW50aXR5Lk1vZGVsIiwiQ2F0LkJhc2UuRW50aXR5Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkJhc2UuRW50aXR5Lk1vZGVsLmVxIiwiQ2F0LkJhc2UuRW50aXR5TGlzdCIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbC5hZGQiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsLmdldExpc3QiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsLnNwbGljZSIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwucmVwbGFjZSIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwucmVtb3ZlIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbC5jbGVhciIsIkNhdC5CYXNlLkVudGl0eUxpc3QuUmVwb3NpdG9yeSIsIkNhdC5CYXNlLkVudGl0eUxpc3QuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5CYXNlLkVudGl0eUxpc3QuUmVwb3NpdG9yeS50b0VudGl0eUxpc3QiLCJDYXQuQmFzZS5FbnRpdHlMaXN0LlJlcG9zaXRvcnkuZnJvbUVudGl0eUxpc3QiLCJDYXQuTW9kZWxzIiwiQ2F0Lk1vZGVscy5Db21tYW5kIiwiQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsIiwiQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0Lk1vZGVscy5Db21tYW5kLlJlcG9zaXRvcnkiLCJDYXQuTW9kZWxzLkNvbW1hbmQuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5Nb2RlbHMuQ29tbWFuZC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0Lk1vZGVscy5Db21tYW5kLlJlcG9zaXRvcnkuZnJvbU9iamVjdCIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QiLCJDYXQuTW9kZWxzLkNvbW1hbmRMaXN0Lk1vZGVsIiwiQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuTW9kZWwuY2xlYXIiLCJDYXQuTW9kZWxzLkNvbW1hbmRMaXN0LlJlcG9zaXRvcnkiLCJDYXQuTW9kZWxzLkNvbW1hbmRMaXN0LlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuTW9kZWxzLkNvbW1hbmRMaXN0LlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuTW9kZWxzLkNvbW1hbmRMaXN0LlJlcG9zaXRvcnkuZnJvbU9iamVjdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5Db21tYW5kR3JpZC5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuQ29tbWFuZEdyaWQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsLmdldENvbW1hbmRMaXN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyLmRpc3BhdGNoIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlJlcG9zaXRvcnkiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlJlcG9zaXRvcnkuZnJvbU9iamVjdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kLlJlcG9zaXRvcnkiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQuUmVwb3NpdG9yeS50b09iamVjdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kLlJlcG9zaXRvcnkuZnJvbU9iamVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5CYXNlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLkJhc2UuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uQmFzZS5nZXRJbnRlcnZhbCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5CYXNlLnN0YXJ0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLkJhc2Uuc2V0QXBpRG9jcyIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5SZWNlaXZlciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5SZWNlaXZlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5SZWNlaXZlci5leGVjdXRlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyLmV4ZWMiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlNlbmRlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXIuYWRkQ29tbWFuZExpc3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyLmV4ZWN1dGUiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5GaWxlTG9hZGVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5GaWxlTG9hZGVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5GaWxlTG9hZGVyLmdldENvZGUiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkZpbGVMb2FkZXIuZ2V0cyIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5pdGlhbGl6ZXIiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluaXRpYWxpemVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Jbml0aWFsaXplci5zdGFydCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5pdGlhbGl6ZXIuZ2V0VGFiIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5JbmplY3RTY3JpcHRzIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5JbmplY3RTY3JpcHRzLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5JbmplY3RTY3JpcHRzLmV4ZWN1dGVFbmQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluamVjdFNjcmlwdHMuZXhlY3V0ZVNjcmlwdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5qZWN0U2NyaXB0cy5jb25uZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLmNvbm5lY3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIucmVsb2FkVGFiIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLmdldFRhYklkIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLmdldFRhYlVSTCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5wb3N0TWVzc2FnZSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5zZW5kTWVzc2FnZSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5vbk1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIub25Db25uZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLm9uRGlzY29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5nZXRUYWJJZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuZ2V0VGFiVVJMIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5jaGVja09uVXBkYXRlZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwucG9zdE1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLnNlbmRNZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5jb25uZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5vbk1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLm9uRGlzY29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuZGlzY29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50LlJlcG9zaXRvcnkiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuUmVwb3NpdG9yeS50b09iamVjdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50LlJlcG9zaXRvcnkuZnJvbU9iamVjdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZC5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZC5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZC5SZXBvc2l0b3J5IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kLlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuUmVwb3NpdG9yeS50b09iamVjdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZC5SZXBvc2l0b3J5LmZyb21PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZExpc3QuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0LlJlcG9zaXRvcnkiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0LlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0LlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0LlJlcG9zaXRvcnkuZnJvbU9iamVjdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5SZXBvc2l0b3J5IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeS50b09iamVjdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5SZXBvc2l0b3J5LmZyb21PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0Lk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5SZXBvc2l0b3J5IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0LlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5SZXBvc2l0b3J5LmZyb21PYmplY3QiXSwibWFwcGluZ3MiOiJBQUtNLE1BQU8sQ0FBQyxZQUFZLEdBQVMsTUFBTyxDQUFDLGFBQWEsQ0FBQztBQ0x6RCxJQUFPLEdBQUcsQ0FRVDtBQVJELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxJQUFJQSxDQVFkQTtJQVJVQSxXQUFBQSxJQUFJQSxFQUFDQSxDQUFDQTtRQUNiQyxJQUFhQSxRQUFRQTtZQUNqQkMsU0FEU0EsUUFBUUEsQ0FDR0EsSUFBK0JBO2dCQUF0Q0Msb0JBQXNDQSxHQUF0Q0EsV0FBNkJBLFFBQUlBLENBQUNBLElBQUlBO2dCQUEvQkEsU0FBSUEsR0FBSkEsSUFBSUEsQ0FBMkJBO1lBQ25EQSxDQUFDQTtZQUNERCxxQkFBRUEsR0FBRkEsVUFBSUEsQ0FBV0E7Z0JBQ1hFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1lBQ3REQSxDQUFDQTtZQUNMRixlQUFDQTtRQUFEQSxDQUFDQSxBQU5ERCxJQU1DQTtRQU5ZQSxhQUFRQSxHQUFSQSxRQU1aQSxDQUFBQTtJQUNMQSxDQUFDQSxFQVJVRCxJQUFJQSxHQUFKQSxRQUFJQSxLQUFKQSxRQUFJQSxRQVFkQTtBQUFEQSxDQUFDQSxFQVJNLEdBQUcsS0FBSCxHQUFHLFFBUVQ7QUNSRCxJQUFPLEdBQUcsQ0FFVDtBQUZELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxJQUFJQSxDQUVkQTtJQUZVQSxXQUFBQSxJQUFJQSxFQUFDQSxDQUFDQTtRQUNiQyxJQUFhQSxPQUFPQTtZQUFwQkksU0FBYUEsT0FBT0E7WUFBRUMsQ0FBQ0E7WUFBREQs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NEJBQ3BCRSxNQUFNQSxDQUFDQTtnQ0FDSEEsTUFBTUEsRUFBR0EsK0JBQUtBLENBQUNBLFdBQVdBO2dDQUMxQkEsU0FBU0EsRUFBR0EsT0FBT0EsQ0FBQ0EsT0FBT0E7NkJBQzlCQSxDQUFDQTt3QkFDTkEsQ0FBQ0E7d0JBQ0RGLCtCQUFVQSxHQUFWQSxVQUFZQSxPQUFlQTs0QkFDdkJHLE1BQU1BLENBQUNBLElBQUlBLCtCQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekNBLENBQUNBO3dCQUNMSCxpQkFBQ0E7b0JBQURBLENBQUNBLEFBVkRILEVBQWdDQSxPQUFPQSxDQUFDQSxVQUFVQSxFQVVqREE7b0JBVllBLG9DQUFVQSxHQUFWQSxVQVVaQSxDQUFBQTtnQkFDTEEsQ0FBQ0EsRUFacUMvRix5QkFBeUJBLEdBQXpCQSxpQ0FBeUJBLEtBQXpCQSxpQ0FBeUJBLFFBWTlEQTtZQUFEQSxDQUFDQSxFQVo2QkwsT0FBT0EsR0FBUEEsY0FBT0EsS0FBUEEsY0FBT0EsUUFZcENBO1FBQURBLENBQUNBLEVBWnNCL0QsTUFBTUEsR0FBTkEsa0JBQU1BLEtBQU5BLGtCQUFNQSxRQVk1QkE7SUFBREEsQ0FBQ0EsRUFaVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUFZckJBO0FBQURBLENBQUNBLEVBWk0sR0FBRyxLQUFILEdBQUcsUUFZVCIsInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgbW9kdWxlIGNocm9tZS5leHRlbnNpb24ge1xuICAgIHZhciBvbkNvbm5lY3Q6IGNocm9tZS5ydW50aW1lLkV4dGVuc2lvbkNvbm5lY3RFdmVudDtcbn1cblxuZGVjbGFyZSBjbGFzcyBFdmVudEVtaXR0ZXIgZXh0ZW5kcyBldmVudGVtaXR0ZXIyLkV2ZW50RW1pdHRlcjIge31cbig8YW55PndpbmRvdykuRXZlbnRFbWl0dGVyID0gKDxhbnk+d2luZG93KS5FdmVudEVtaXR0ZXIyO1xuXG5kZWNsYXJlIHZhciBUZXN0SW5pdGlhbGl6ZTogYm9vbGVhbjsiLCJtb2R1bGUgQ2F0LkJhc2Uge1xuICAgIGV4cG9ydCBjbGFzcyBJZGVudGl0eSB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgdXVpZDogVVVJRC5VVUlEID0gbmV3IFVVSUQuVVVJRCkge1xuICAgICAgICB9XG4gICAgICAgIGVxIChlOiBJZGVudGl0eSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXVpZC50b1N0cmluZygpID09PSBlLnV1aWQudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQmFzZSB7XG4gICAgZXhwb3J0IGNsYXNzIFNlcnZpY2Uge31cbn1cbiIsIm1vZHVsZSBDYXQuVVVJRCB7XG4gICAgY2xhc3MgSW52YWxpZFVVSURGb3JtYXQge31cbiAgICBleHBvcnQgY2xhc3MgVVVJRCB7XG4gICAgICAgIHV1aWQ6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3RvciAoaWQ6IHN0cmluZyA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXVpZCA9IFtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUzQoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpXG4gICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBpZC5tYXRjaCgvXlxcd3s4fS1cXHd7NH0tXFx3ezR9LVxcd3s0fS1cXHd7MTJ9JC8pO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkVVVJREZvcm1hdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51dWlkID0gaWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0b1N0cmluZyAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51dWlkO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGZyb21TdHJpbmcgKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVVJRChpZCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIFM0KCkge1xuICAgICAgICAgICAgdmFyIHJhbmQgPSAxICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHJldHVybiAoKHJhbmQgKiAweDEwMDAwKXwwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgfX1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuQXV0b3BpbG90IHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIFNjb3BlIGV4dGVuZHMgbmcuSVNjb3BlIHtcbiAgICAgICAgcGxheUFsbDogKCkgPT4gdm9pZDtcbiAgICAgICAgYWRkQ29tbWFuZDogKCkgPT4gdm9pZDtcbiAgICAgICAgZGVsZXRlQ29tbWFuZDogKGNvbW1hbmQ6IENhdC5Nb2RlbHMuQ29tbWFuZC5Nb2RlbCkgPT4gdm9pZDtcbiAgICAgICAgY29tbWFuZEdyaWQ6IENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuQ29tbWFuZEdyaWQuTW9kZWw7XG4gICAgICAgIHN0YXJ0UmVjb3JkaW5nOiAoKSA9PiB2b2lkO1xuICAgICAgICBzdG9wUmVjb3JkaW5nOiAoKSA9PiB2b2lkO1xuICAgICAgICBjaGFuZ2VTcGVlZDogKCkgPT4gdm9pZDtcbiAgICAgICAgcGxheUN1cnJlbnQ6ICgpID0+IHZvaWQ7XG4gICAgICAgIHBsYXlTdG9wOiAoKSA9PiB2b2lkO1xuICAgICAgICByZWNvcmRpbmdTdGF0dXM6IGJvb2xlYW47XG4gICAgICAgIGJhc2VVUkw6IHN0cmluZztcbiAgICAgICAgcGxheVNwZWVkOiBzdHJpbmc7XG4gICAgICAgIHNlbGVjdExpc3Q6IHN0cmluZ1tdO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgQ29udHJvbGxlciB7XG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgJHNjb3BlOiBTY29wZSxcbiAgICAgICAgICAgIG1hbmFnZXI6IFNlcnZpY2VzLlRhYi5NYW5hZ2VyLFxuICAgICAgICAgICAgY29tbWFuZEdyaWQ6IENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuQ29tbWFuZEdyaWQuTW9kZWwsXG4gICAgICAgICAgICBtZXNzYWdlRGlzcGF0Y2hlcjogTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlcixcbiAgICAgICAgICAgIHNlbGVuaXVtU2VuZGVyOiBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyLFxuICAgICAgICAgICAgY29tbWFuZFNlbGVjdExpc3Q6IENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5Db21tYW5kU2VsZWN0TGlzdFxuICAgICAgICApIHtcbiAgICAgICAgICAgICRzY29wZS5jb21tYW5kR3JpZCA9IGNvbW1hbmRHcmlkO1xuICAgICAgICAgICAgJHNjb3BlLnBsYXlTcGVlZCA9ICcxMDAnO1xuXG4gICAgICAgICAgICAkc2NvcGUucGxheUFsbCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlbml1bVNlbmRlci5hZGRDb21tYW5kTGlzdCgkc2NvcGUuY29tbWFuZEdyaWQuZ2V0Q29tbWFuZExpc3QoKSk7XG4gICAgICAgICAgICAgICAgc2VsZW5pdW1TZW5kZXIuc3RhcnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUuY2hhbmdlU3BlZWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZW5pdW1TZW5kZXIuaW50ZXJ2YWwgPSBwYXJzZUludCgkc2NvcGUucGxheVNwZWVkKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUuYWRkQ29tbWFuZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29tbWFuZEdyaWQuYWRkKG5ldyBDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwoKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZUNvbW1hbmQgPSAoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5jb21tYW5kR3JpZC5yZW1vdmUoY29tbWFuZCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLnJlY29yZGluZ1N0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUuc3RhcnRSZWNvcmRpbmcgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlY29yZGluZ1N0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLnN0b3BSZWNvcmRpbmcgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlY29yZGluZ1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5wbGF5Q3VycmVudCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvL0BUT0RPXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLnBsYXlTdG9wID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vQFRPRE9cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0TGlzdCA9IGNvbW1hbmRTZWxlY3RMaXN0LmdldHMoKS5tYXAoKGVsZW0pID0+IGVsZW0uZ2V0QXR0cmlidXRlKCduYW1lJykpO1xuICAgICAgICAgICAgdGhpcy5iaW5kVGFiTWFuYWdlcigkc2NvcGUsIG1hbmFnZXIsIG1lc3NhZ2VEaXNwYXRjaGVyKTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGJpbmRUYWJNYW5hZ2VyIChcbiAgICAgICAgICAgICRzY29wZTogU2NvcGUsXG4gICAgICAgICAgICBtYW5hZ2VyOiBTZXJ2aWNlcy5UYWIuTWFuYWdlcixcbiAgICAgICAgICAgIG1lc3NhZ2VEaXNwYXRjaGVyOiBNb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyXG4gICAgICAgICkge1xuICAgICAgICAgICAgbWFuYWdlci5vbk1lc3NhZ2UoKG1lc3NhZ2U6IE9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VEaXNwYXRjaGVyLmRpc3BhdGNoKG1lc3NhZ2UsIHtcbiAgICAgICAgICAgICAgICAgICAgTWVzc2FnZUFkZENvbW1lbnRNb2RlbCA6IChtZXNzYWdlOiBNb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50Lk1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISRzY29wZS5yZWNvcmRpbmdTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISRzY29wZS5jb21tYW5kR3JpZC5nZXRMaXN0KCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5iYXNlVVJMID0gbWFuYWdlci5nZXRUYWJVUkwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbW1hbmRHcmlkLmFkZChuZXcgQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsKCdvcGVuJywgJycsICRzY29wZS5iYXNlVVJMKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21tYW5kR3JpZC5hZGQobWVzc2FnZS5jb21tYW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMge1xuICAgIGV4cG9ydCBjbGFzcyBDb250ZW50U2NyaXB0c0N0cmwge1xuICAgICAgICBwcml2YXRlIG1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0UmVwb3NpdG9yeSA6IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeTtcbiAgICAgICAgcHJpdmF0ZSBtZXNzYWdlQWRkQ29tbWVudFJlcG9zaXRvcnkgOiBNb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50LlJlcG9zaXRvcnk7XG4gICAgICAgIHByaXZhdGUgcmVjb3JkZXJPYnNlcnZlciA6IFNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXI7XG4gICAgICAgIHByaXZhdGUgbWVzc2FnZURpc3BhdGNoZXIgOiBNb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyO1xuICAgICAgICBwcml2YXRlIFNlbGVuaXVtUmVjZWl2ZXIgOiBTZXJ2aWNlcy5TZWxlbml1bS5SZWNlaXZlcjtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgcG9ydDogY2hyb21lLnJ1bnRpbWUuUG9ydCkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdFJlcG9zaXRvcnkgPSBuZXcgTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5SZXBvc2l0b3J5KCk7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VBZGRDb21tZW50UmVwb3NpdG9yeSA9IG5ldyBNb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50LlJlcG9zaXRvcnkoKTtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkZXJPYnNlcnZlciA9IG5ldyBTZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyKCk7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VEaXNwYXRjaGVyID0gbmV3IE1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIoKTtcbiAgICAgICAgICAgIHRoaXMuU2VsZW5pdW1SZWNlaXZlciA9IG5ldyBTZXJ2aWNlcy5TZWxlbml1bS5SZWNlaXZlcigpO1xuICAgICAgICB9XG4gICAgICAgIG9uTWVzc2FnZSAobWVzc2FnZTogT2JqZWN0LCBzZW5kZXI6IGNocm9tZS5ydW50aW1lLk1lc3NhZ2VTZW5kZXIsIHNlbmRSZXNwb25zZTogKG1lc3NhZ2U6IE9iamVjdCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlRGlzcGF0Y2hlci5kaXNwYXRjaChtZXNzYWdlLCB7XG4gICAgICAgICAgICAgICAgTWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlTW9kZWwgOiAobWVzc2FnZTogTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVjb3JkZXIuZGVyZWdpc3Rlcih0aGlzLnJlY29yZGVyT2JzZXJ2ZXIsIHdpbmRvdyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLlNlbGVuaXVtUmVjZWl2ZXIuZXhlY3V0ZShtZXNzYWdlLmNvbW1hbmQpO1xuICAgICAgICAgICAgICAgICAgICBSZWNvcmRlci5yZWdpc3Rlcih0aGlzLnJlY29yZGVyT2JzZXJ2ZXIsIHdpbmRvdyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHRNZXNzYWdlID0gbmV3IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuTW9kZWwocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHRoaXMubWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRSZXBvc2l0b3J5LnRvT2JqZWN0KHJlc3VsdE1lc3NhZ2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGFkZENvbW1hbmQoY29tbWFuZE5hbWU6IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHdpbmRvdzogV2luZG93LCBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZDogYm9vbGVhbikge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQnIDoge1xuICAgICAgICAgICAgICAgICAgICAnY29tbWFuZCcgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZScgOiBjb21tYW5kTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YXJnZXQnIDogdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJyA6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCcgOiBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgYWRkQ29tbWVudE1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VBZGRDb21tZW50UmVwb3NpdG9yeS5mcm9tT2JqZWN0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5wb3J0LnBvc3RNZXNzYWdlKHRoaXMubWVzc2FnZUFkZENvbW1lbnRSZXBvc2l0b3J5LnRvT2JqZWN0KGFkZENvbW1lbnRNZXNzYWdlKSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdGlhbGl6ZSAoKSB7XG4gICAgICAgICAgICBSZWNvcmRlci5yZWdpc3Rlcih0aGlzLnJlY29yZGVyT2JzZXJ2ZXIsIHdpbmRvdyk7XG4gICAgICAgICAgICB0aGlzLnJlY29yZGVyT2JzZXJ2ZXIuYWRkTGlzdGVuZXIoJ2FkZENvbW1hbmQnLCAoY29tbWFuZE5hbWU6IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHdpbmRvdzogV2luZG93LCBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZDogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tbWFuZChjb21tYW5kTmFtZSwgdGFyZ2V0LCB2YWx1ZSwgd2luZG93LCBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucG9ydC5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIFJlY29yZGVyLmRlcmVnaXN0ZXIodGhpcy5yZWNvcmRlck9ic2VydmVyLCB3aW5kb3cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2U6IE9iamVjdCwgc2VuZGVyOiBjaHJvbWUucnVudGltZS5NZXNzYWdlU2VuZGVyLCBzZW5kUmVzcG9uc2U6IChtZXNzYWdlOiBPYmplY3QpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInZhciBhcHBsaWNhdGlvblNlcnZpY2VzU2VsZW5pdW1TZW5kZXI6IENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXI7XG5cbm1vZHVsZSBDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMge1xuICAgIGV4cG9ydCBjbGFzcyBXaW5kb3dDdHJsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgY2FsbGVkVGFiSWQ6IHN0cmluZykge31cbiAgICAgICAgcHJpdmF0ZSBpbml0QW5ndWxhciAobWFuYWdlciwgY29tbWFuZFNlbGVjdExpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBhdXRvcGlsb3RBcHAgPSBhbmd1bGFyLm1vZHVsZSgnQXV0b3BpbG90QXBwJywgWyd1aS5zb3J0YWJsZSddKVxuICAgICAgICAgICAgICAgICAgICAuZmFjdG9yeSgnbWFuYWdlcicsICgpID0+IG1hbmFnZXIpXG4gICAgICAgICAgICAgICAgICAgIC5mYWN0b3J5KCdjb21tYW5kU2VsZWN0TGlzdCcsICgpID0+IGNvbW1hbmRTZWxlY3RMaXN0KVxuICAgICAgICAgICAgICAgICAgICAuc2VydmljZSgnbWVzc2FnZURpc3BhdGNoZXInLCBNb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyKVxuICAgICAgICAgICAgICAgICAgICAuZmFjdG9yeSgnc2VsZW5pdW1TZW5kZXInLCAobWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIsIG1lc3NhZ2VEaXNwYXRjaGVyOiBNb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBsaWNhdGlvblNlcnZpY2VzU2VsZW5pdW1TZW5kZXIgPSBuZXcgU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyKG1hbmFnZXIsIG1lc3NhZ2VEaXNwYXRjaGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHBsaWNhdGlvblNlcnZpY2VzU2VsZW5pdW1TZW5kZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5mYWN0b3J5KCdjb21tYW5kR3JpZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb250cm9sbGVyKCdBdXRvcGlsb3QnLCBDb250cm9sbGVycy5BdXRvcGlsb3QuQ29udHJvbGxlcilcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5ib290c3RyYXAoZG9jdW1lbnQsIFsnQXV0b3BpbG90QXBwJ10pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoYXV0b3BpbG90QXBwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgaW5pdENvbW1hbmRTZWxlY3RMaXN0ICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxlbml1bUFwaVhNTEZpbGUgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoU2VydmljZXMuQ29uZmlnLnNlbGVuaXVtQXBpWE1MKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmU6IChjb21tYW5kU2VsZWN0TGlzdDogU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QpID0+IHZvaWQsIHJlamVjdDogKGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21tYW5kU2VsZWN0TGlzdCA9IG5ldyBTZXJ2aWNlcy5Db21tYW5kU2VsZWN0TGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICBjb21tYW5kU2VsZWN0TGlzdC5sb2FkKHNlbGVuaXVtQXBpWE1MRmlsZSkudGhlbigoKSA9PiByZXNvbHZlKGNvbW1hbmRTZWxlY3RMaXN0KSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyLnNldEFwaURvY3Moc2VsZW5pdW1BcGlYTUxGaWxlKS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeShyZXNvbHZlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBpbml0VGFiSW5pdGlhbGl6ZXIgKHJlc29sdmUsIGNhdGNoRXJyb3IpIHtcbiAgICAgICAgICAgIChuZXcgUHJvbWlzZSgocmVzb2x2ZTogKG1hbmFnZXI6IFNlcnZpY2VzLlRhYi5NYW5hZ2VyKSA9PiB2b2lkLCByZWplY3Q6IChlcnJvck1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBmaWxlTG9hZGVyID0gbmV3IFNlcnZpY2VzLlRhYi5GaWxlTG9hZGVyKFNlcnZpY2VzLkNvbmZpZy5pbmplY3RTY3JpcHRzKTtcbiAgICAgICAgICAgICAgICBmaWxlTG9hZGVyLmdldHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRpYWxpemVyID0gbmV3IFNlcnZpY2VzLlRhYi5Jbml0aWFsaXplcih0aGlzLmNhbGxlZFRhYklkLCBmaWxlTG9hZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbGl6ZXIuc3RhcnQoKS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pKS50aGVuKChtYW5hZ2VyOiBTZXJ2aWNlcy5UYWIuTWFuYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdENvbW1hbmRTZWxlY3RMaXN0KCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tbWFuZFNlbGVjdExpc3QgPSByZXN1bHRzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdEFuZ3VsYXIobWFuYWdlciwgY29tbWFuZFNlbGVjdExpc3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGNhdGNoRXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChjYXRjaEVycm9yKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGNhdGNoRXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGluaXRpYWxpemUgKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHRoaXMuaW5pdFRhYkluaXRpYWxpemVyLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcyB7XG4gICAgZXhwb3J0IGNsYXNzIENvbW1hbmRTZWxlY3RMaXN0IHtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXJyb3JNZXNzYWdlID0gJ2NvbW1hbmQgbGlzdCB4bWwgbG9hZCBmYWlsZWQuXFxuJztcbiAgICAgICAgcHJpdmF0ZSBkb2N1bWVudEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgICAgICBsb2FkIChmaWxlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGZpbGUpO1xuICAgICAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAwICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChDb21tYW5kU2VsZWN0TGlzdC5lcnJvck1lc3NhZ2UgKyBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50RWxlbWVudCA9IHhoci5yZXNwb25zZVhNTC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0RG9jUm9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0cyAoKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbCh0aGlzLmRvY3VtZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmdW5jdGlvbicpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMge1xuICAgIGV4cG9ydCBjbGFzcyBDb25maWcge1xuICAgICAgICBzdGF0aWMgaW5qZWN0U2NyaXB0cyA9IFtcbiAgICAgICAgICAgIFwic3JjL2xpYi94cGF0aC5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvbGliL2Nzcy1zZWxlY3Rvci5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3Rvb2xzLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvaHRtbHV0aWxzLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tYnJvd3NlcmRldGVjdC5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3NlbGVuaXVtLWF0b21zLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tYnJvd3NlcmJvdC5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3NlbGVuaXVtLWFwaS5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3NlbGVuaXVtLWV4ZWN1dGlvbmxvb3AuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9zZWxlbml1bS10ZXN0cnVubmVyLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tY29tbWFuZGhhbmRsZXJzLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tcnVubmVyLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvcmVjb3JkZXIuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9yZWNvcmRlci1oYW5kbGVycy5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3Rlc3RDYXNlLmpzXCIsXG4gICAgICAgICAgICBcImJvd2VyX2NvbXBvbmVudHMvZXZlbnRlbWl0dGVyMi9saWIvZXZlbnRlbWl0dGVyMi5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvX2RlZmluZS5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvYXBwbGljYXRpb24uanNcIixcbiAgICAgICAgICAgIFwic3JjL2NvbnRlbnRfc2NyaXB0cy5qc1wiXG4gICAgICAgIF07XG4gICAgICAgIHN0YXRpYyBzZWxlbml1bUFwaVhNTCA9ICcvc3JjL3NlbGVuaXVtLWlkZS9pZWRvYy1jb3JlLnhtbCc7XG4gICAgfVxufVxuIiwiLypcbiogTW9jayBSZWNvcmRlck9ic2VydmVyIGZvciBTZWxlbml1bSBSZWNvcmRlclxuKiAqL1xubW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcyB7XG4gICAgZXhwb3J0IGNsYXNzIFJlY29yZGVyT2JzZXJ2ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXJ7XG4gICAgICAgIHJlY29yZGluZ0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBpc1NpZGViYXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZ2V0VXNlckxvZyAoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZTtcbiAgICAgICAgfVxuICAgICAgICBhZGRDb21tYW5kIChjb21tYW5kOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCB3aW5kb3c6IFdpbmRvdywgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQ6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnYWRkQ29tbWFuZCcsIGNvbW1hbmQsIHRhcmdldCwgdmFsdWUsIHdpbmRvdywgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIG9uVW5sb2FkRG9jdW1lbnQgKGRvYzogRG9jdW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnb25VbmxvYWREb2N1bWVudCcsIGRvYyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkJhc2UuRW50aXR5IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBJZGVudGl0eSB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgaWRlbnRpdHk6IElkZW50aXR5ID0gbmV3IElkZW50aXR5KG5ldyBVVUlELlVVSUQpKSB7XG4gICAgICAgICAgICBzdXBlcihpZGVudGl0eS51dWlkKVxuICAgICAgICB9XG4gICAgICAgIGVxIChlOiBNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmVxKGUuaWRlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5CYXNlLkVudGl0eSB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXBvc2l0b3J5PE0gZXh0ZW5kcyBNb2RlbD4ge1xuICAgICAgICB0b09iamVjdCAoZW50aXR5OiBNKSA6IE9iamVjdDtcbiAgICAgICAgZnJvbU9iamVjdCAob2JqZWN0OiBPYmplY3QpIDogTTtcbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkJhc2UuRW50aXR5TGlzdCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsPEUgZXh0ZW5kcyBFbnRpdHkuTW9kZWw+IGV4dGVuZHMgRW50aXR5Lk1vZGVsIHtcbiAgICAgICAgbGlzdDogRVtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGxpc3Q6IEVbXSA9IFtdKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBhZGQoZW50aXR5OiBFKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QucHVzaChlbnRpdHkpO1xuICAgICAgICB9XG4gICAgICAgIGdldExpc3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0O1xuICAgICAgICB9XG4gICAgICAgIHNwbGljZShpbmRleDogbnVtYmVyLCBlbnRpdHk6IEUpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdC5zcGxpY2UoaW5kZXgsIDEsIGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVwbGFjZShpZGVudGl0eTogSWRlbnRpdHksIGVudGl0eTogRSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5saXN0Lm1hcChcbiAgICAgICAgICAgICAgICAoZSkgPT4gZS5pZGVudGl0eS5lcShpZGVudGl0eSkgPyBlbnRpdHkgOiBlXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJlbW92ZShlbnRpdHk6IEUpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdCA9IHRoaXMubGlzdC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKGUpID0+ICFlLmVxKGVudGl0eSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgY2xlYXIoKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQmFzZS5FbnRpdHlMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeTxCIGV4dGVuZHMgRW50aXR5Lk1vZGVsLCBNIGV4dGVuZHMgRW50aXR5TGlzdC5Nb2RlbDxFbnRpdHkuTW9kZWw+PiB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGVudGl0eVJlcG9zaXRvcnk6IEVudGl0eS5SZXBvc2l0b3J5PEI+KSB7XG4gICAgICAgIH1cbiAgICAgICAgdG9FbnRpdHlMaXN0IChlbnRpdHlMaXN0OiBNKSB7XG4gICAgICAgICAgICByZXR1cm4gZW50aXR5TGlzdC5nZXRMaXN0KCkubWFwKChlbnRpdHkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gPE0+KDxhbnk+dGhpcy5lbnRpdHlSZXBvc2l0b3J5KS50b09iamVjdChlbnRpdHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnJvbUVudGl0eUxpc3QgKGVudGl0eUxpc3Q6IE9iamVjdFtdKSB7XG4gICAgICAgICAgICByZXR1cm4gZW50aXR5TGlzdC5tYXAoKGVudGl0eSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVudGl0eVJlcG9zaXRvcnkuZnJvbU9iamVjdChlbnRpdHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0Lk1vZGVscy5Db21tYW5kIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHkuTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICBwdWJsaWMgdHlwZSA9ICcnLFxuICAgICAgICAgICAgcHVibGljIHRhcmdldCA9ICcnLFxuICAgICAgICAgICAgcHVibGljIHZhbHVlID0gJydcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5Nb2RlbHMuQ29tbWFuZCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBJTW9kZWxPYmplY3Qge1xuICAgICAgICB0eXBlOiBzdHJpbmc7XG4gICAgICAgIHRhcmdldDogc3RyaW5nO1xuICAgICAgICB2YWx1ZTogc3RyaW5nO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBpbXBsZW1lbnRzIENhdC5CYXNlLkVudGl0eS5SZXBvc2l0b3J5PE1vZGVsPiB7XG4gICAgICAgIHRvT2JqZWN0IChjb21tYW5kOiBNb2RlbCk6IElNb2RlbE9iamVjdCB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICd0eXBlJyA6IGNvbW1hbmQudHlwZSxcbiAgICAgICAgICAgICAgICAndGFyZ2V0JyA6IGNvbW1hbmQudGFyZ2V0LFxuICAgICAgICAgICAgICAgICd2YWx1ZScgOiBjb21tYW5kLnZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZyb21PYmplY3QgKGNvbW1hbmQ6IElNb2RlbE9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbChjb21tYW5kLnR5cGUsIGNvbW1hbmQudGFyZ2V0LCBjb21tYW5kLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuTW9kZWxzLkNvbW1hbmRMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsPENvbW1hbmQuTW9kZWw+IHtcbiAgICAgICAgY29uc3RydWN0b3IgKFxuICAgICAgICAgICAgY29tbWFuZHM6IENvbW1hbmQuTW9kZWxbXSA9IFtdLFxuICAgICAgICAgICAgcHVibGljIG5hbWUgPSAnJyxcbiAgICAgICAgICAgIHB1YmxpYyB1cmwgPSAnJ1xuICAgICAgICApIHtcbiAgICAgICAgICAgIHN1cGVyKGNvbW1hbmRzKTtcbiAgICAgICAgfVxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy51cmwgPSAnJztcbiAgICAgICAgICAgIHN1cGVyLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0Lk1vZGVscy5Db21tYW5kTGlzdCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHlMaXN0LlJlcG9zaXRvcnk8Q29tbWFuZC5Nb2RlbCwgTW9kZWw+IGltcGxlbWVudHMgQ2F0LkJhc2UuRW50aXR5LlJlcG9zaXRvcnk8TW9kZWw+IHtcbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgc3VwZXIobmV3IENvbW1hbmQuUmVwb3NpdG9yeSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvT2JqZWN0IChjb21tYW5kTGlzdDogTW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ2NvbW1hbmRMaXN0JyA6IHN1cGVyLnRvRW50aXR5TGlzdChjb21tYW5kTGlzdCksXG4gICAgICAgICAgICAgICAgJ25hbWUnIDogY29tbWFuZExpc3QubmFtZSxcbiAgICAgICAgICAgICAgICAndXJsJyA6IGNvbW1hbmRMaXN0LnVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChjb21tYW5kTGlzdDoge1xuICAgICAgICAgICAgJ2NvbW1hbmRMaXN0JyA6IE9iamVjdFtdXG4gICAgICAgICAgICAnbmFtZScgOiBzdHJpbmdcbiAgICAgICAgICAgICd1cmwnIDogc3RyaW5nXG4gICAgICAgIH0pIHtcbiAgICAgICAgICAgIHZhciBjb21tYW5kTGlzdE9iamVjdCA9IHN1cGVyLmZyb21FbnRpdHlMaXN0KGNvbW1hbmRMaXN0LmNvbW1hbmRMaXN0KTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwoY29tbWFuZExpc3RPYmplY3QsIGNvbW1hbmRMaXN0Lm5hbWUsIGNvbW1hbmRMaXN0LnVybCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5Db21tYW5kR3JpZCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbDxDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWw+IHtcbiAgICAgICAgZ2V0Q29tbWFuZExpc3QoKSB7XG4gICAgICAgICAgICB2YXIgY29tbWFuZHMgPSB0aGlzLmdldExpc3QoKS5maWx0ZXIoKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFjb21tYW5kLnR5cGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBjb21tYW5kTGlzdCA9IG5ldyBDYXQuTW9kZWxzLkNvbW1hbmRMaXN0Lk1vZGVsKGNvbW1hbmRzKTtcbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kTGlzdDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2Uge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGlzcGF0Y2hNYXAge1xuICAgICAgICBNZXNzYWdlQWRkQ29tbWVudE1vZGVsPyA6IChtZXNzYWdlOiBBZGRDb21tZW50Lk1vZGVsKSA9PiB2b2lkO1xuICAgICAgICBNZXNzYWdlUGxheUNvbW1hbmRNb2RlbD8gOiAobWVzc2FnZTogUGxheUNvbW1hbmQuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIE1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbD8gOiAobWVzc2FnZTogUGxheUNvbW1hbmRMaXN0Lk1vZGVsKSA9PiB2b2lkO1xuICAgICAgICBNZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVNb2RlbD8gOiAobWVzc2FnZTogUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIE1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWw/IDogKG1lc3NhZ2U6IFBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuTW9kZWwpID0+IHZvaWQ7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBEaXNwYXRjaGVyIHtcbiAgICAgICAgbWVzc2FnZUFkZENvbW1lbnRNb2RlbCA9IG5ldyBBZGRDb21tZW50LlJlcG9zaXRvcnkoKTtcbiAgICAgICAgbWVzc2FnZVBsYXlDb21tYW5kTW9kZWwgPSBuZXcgUGxheUNvbW1hbmQuUmVwb3NpdG9yeSgpO1xuICAgICAgICBtZXNzYWdlUGxheUNvbW1hbmRMaXN0TW9kZWwgPSBuZXcgUGxheUNvbW1hbmRMaXN0LlJlcG9zaXRvcnkoKTtcbiAgICAgICAgbWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlTW9kZWwgPSBuZXcgUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeSgpO1xuICAgICAgICBtZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdE1vZGVsID0gbmV3IFBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeSgpO1xuXG4gICAgICAgIGRpc3BhdGNoIChtZXNzYWdlOiBPYmplY3QsIGRpc3BhdGNoZXI6IERpc3BhdGNoTWFwKSB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZVsnbmFtZSddID09IEFkZENvbW1lbnQuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VBZGRDb21tZW50TW9kZWwodGhpcy5tZXNzYWdlQWRkQ29tbWVudE1vZGVsLmZyb21PYmplY3QobWVzc2FnZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlWyduYW1lJ10gPT0gUGxheUNvbW1hbmQuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VQbGF5Q29tbWFuZE1vZGVsKHRoaXMubWVzc2FnZVBsYXlDb21tYW5kTW9kZWwuZnJvbU9iamVjdChtZXNzYWdlKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2VbJ25hbWUnXSA9PSBQbGF5Q29tbWFuZExpc3QuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbCh0aGlzLm1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbC5mcm9tT2JqZWN0KG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZVsnbmFtZSddID09IFBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLk1vZGVsLm1lc3NhZ2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5NZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVNb2RlbCh0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZU1vZGVsLmZyb21PYmplY3QobWVzc2FnZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlWyduYW1lJ10gPT0gUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbC5tZXNzYWdlTmFtZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuTWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRNb2RlbCh0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWwuZnJvbU9iamVjdChtZXNzYWdlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBtZXNzYWdlOiAnICsgSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2Uge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIEJhc2UuRW50aXR5Lk1vZGVsIHtcbiAgICB9XG59IiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZSB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgaW1wbGVtZW50cyBCYXNlLkVudGl0eS5SZXBvc2l0b3J5PE1vZGVsPiB7XG4gICAgICAgIHRvT2JqZWN0IChlbnRpdHk6IE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAob2JqZWN0OiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgQ2F0LkJhc2UuRW50aXR5Lk1vZGVsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKFxuICAgICAgICAgICAgcHVibGljIHR5cGUgPSAnJyxcbiAgICAgICAgICAgIHB1YmxpYyBhcmdzOiBzdHJpbmdbXSA9IFtdXG4gICAgICAgICkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBJTW9kZWxPYmplY3Qge1xuICAgICAgICB0eXBlOiBzdHJpbmc7XG4gICAgICAgIGFyZ3M6IHN0cmluZ1tdO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBpbXBsZW1lbnRzIENhdC5CYXNlLkVudGl0eS5SZXBvc2l0b3J5PE1vZGVsPiB7XG4gICAgICAgIHRvT2JqZWN0IChjb21tYW5kOiBNb2RlbCk6IElNb2RlbE9iamVjdCB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICd0eXBlJyA6IGNvbW1hbmQudHlwZSxcbiAgICAgICAgICAgICAgICAnYXJncycgOiBjb21tYW5kLmFyZ3NcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAoY29tbWFuZDogSU1vZGVsT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKGNvbW1hbmQudHlwZSwgY29tbWFuZC5hcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0ge1xuICAgIGV4cG9ydCBjbGFzcyBCYXNlIHtcbiAgICAgICAgc2VsZW5pdW06IGFueTtcbiAgICAgICAgY29tbWFuZEZhY3Rvcnk6IGFueTtcbiAgICAgICAgY3VycmVudFRlc3Q6IGFueTtcbiAgICAgICAgdGVzdENhc2U6IGFueTtcbiAgICAgICAgaW50ZXJ2YWw6IG51bWJlciA9IDE7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICAvLyBmb3Igc2VsZW5pdW0tcnVubmVyXG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLmdldEJyb3dzZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdGVkQnJvd3NlcicgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY29udGVudFdpbmRvdycgOiB3aW5kb3dcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5sYXN0V2luZG93ID0gd2luZG93O1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS50ZXN0Q2FzZSA9IG5ldyAoPGFueT53aW5kb3cpLlRlc3RDYXNlO1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5zZWxlbml1bSA9IGNhbGxiYWNrKCk7XG5cbiAgICAgICAgICAgICg8YW55PndpbmRvdykuZWRpdG9yID0ge1xuICAgICAgICAgICAgICAgICdhcHAnIDoge1xuICAgICAgICAgICAgICAgICAgICAnZ2V0T3B0aW9ucycgOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0aW1lb3V0JyA6IHRoaXMuaW50ZXJ2YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICd2aWV3JyA6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3Jvd1VwZGF0ZWQnIDogKCkgPT4ge30sXG4gICAgICAgICAgICAgICAgICAgICdzY3JvbGxUb1JvdycgOiAoKSA9PiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudGVzdENhc2UgPSAoPGFueT53aW5kb3cpLnRlc3RDYXNlO1xuICAgICAgICAgICAgdGhpcy5zZWxlbml1bSA9ICg8YW55PndpbmRvdykuc2VsZW5pdW07XG4gICAgICAgICAgICB0aGlzLnNlbGVuaXVtLmJyb3dzZXJib3Quc2VsZWN0V2luZG93KG51bGwpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kRmFjdG9yeSA9IG5ldyAoPGFueT53aW5kb3cpLkNvbW1hbmRIYW5kbGVyRmFjdG9yeSgpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kRmFjdG9yeS5yZWdpc3RlckFsbCh0aGlzLnNlbGVuaXVtKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRJbnRlcnZhbCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbDtcbiAgICAgICAgfVxuICAgICAgICBzdGFydCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXN0ID0gbmV3ICg8YW55PndpbmRvdykuSURFVGVzdExvb3AodGhpcy5jb21tYW5kRmFjdG9yeSwge1xuICAgICAgICAgICAgICAgICAgICAndGVzdENvbXBsZXRlJyA6IHJlc29sdmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXN0LmdldENvbW1hbmRJbnRlcnZhbCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW50ZXJ2YWwoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZS5kZWJ1Z0NvbnRleHQucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXN0LnN0YXJ0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGVycm9yTWVzc2FnZSA9ICdzZWxlbml1bSBjb21tYW5kIHhtbCBsb2FkIGZhaWxlZC5cXG4nO1xuICAgICAgICBzdGF0aWMgc2V0QXBpRG9jcyAoZmlsZTogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQsIHJlamVjdDogKGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMCAmJiB4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoQmFzZS5lcnJvck1lc3NhZ2UgKyBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAoPGFueT53aW5kb3cpLkNvbW1hbmQuYXBpRG9jdW1lbnRzID0gbmV3IEFycmF5KHhoci5yZXNwb25zZVhNTC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bSB7XG4gICAgZXhwb3J0IGNsYXNzIFJlY2VpdmVyIGV4dGVuZHMgQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHN1cGVyKCgpID0+ICg8YW55PndpbmRvdykuY3JlYXRlU2VsZW5pdW0obG9jYXRpb24uaHJlZiwgdHJ1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgZXJyb3JNZXNzYWdlID0gJ21pc3NpbmcgY29tbWFuZDogJztcbiAgICAgICAgZXhlY3V0ZSAobW9kZWw6IE1vZGVscy5TZWxlbml1bUNvbW1hbmQuTW9kZWwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVuaXVtW21vZGVsLnR5cGVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlYygoKSA9PiB0aGlzLnNlbGVuaXVtW21vZGVsLnR5cGVdLmFwcGx5KHRoaXMuc2VsZW5pdW0sIG1vZGVsLmFyZ3MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjb21tYW5kTmFtZSA9ICdkbycgKyBtb2RlbC50eXBlLnJlcGxhY2UoL15cXHcvLCB3ID0+IHcudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlbml1bVtjb21tYW5kTmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5leGVjKCgpID0+IHRoaXMuc2VsZW5pdW1bY29tbWFuZE5hbWVdLmFwcGx5KHRoaXMuc2VsZW5pdW0sIG1vZGVsLmFyZ3MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSB0aGlzLmVycm9yTWVzc2FnZSArIEpTT04uc3RyaW5naWZ5KG1vZGVsKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gJ0VSUk9SICcgKyBlcnJvck1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBleGVjIChleGVjOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGV4ZWMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ09LJztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ0VSUk9SJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0ge1xuICAgIGV4cG9ydCBjbGFzcyBTZW5kZXIgZXh0ZW5kcyBCYXNlIHtcbiAgICAgICAgcHJpdmF0ZSBtZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVSZXBvc2l0b3J5ID0gbmV3IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLlJlcG9zaXRvcnkoKTtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgbWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIsIHByaXZhdGUgbWVzc2FnZURpc3BhdGNoZXI6IENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyKSB7XG4gICAgICAgICAgICBzdXBlcigoKSA9PiBuZXcgKDxhbnk+d2luZG93KS5DaHJvbWVFeHRlbnNpb25CYWNrZWRTZWxlbml1bShtYW5hZ2VyLmdldFRhYlVSTCgpLCAnJykpO1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5zaG91bGRBYm9ydEN1cnJlbnRDb21tYW5kID0gKCkgPT4gZmFsc2U7XG4gICAgICAgICAgICBtYW5hZ2VyLm9uQ29ubmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgKDxhbnk+d2luZG93KS5zaG91bGRBYm9ydEN1cnJlbnRDb21tYW5kID0gKCkgPT4gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1hbmFnZXIub25EaXNjb25uZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAoPGFueT53aW5kb3cpLnNob3VsZEFib3J0Q3VycmVudENvbW1hbmQgPSAoKSA9PiBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGFkZENvbW1hbmRMaXN0IChjb21tYW5kTGlzdDogQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5Nb2RlbCkge1xuICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZS5jb21tYW5kcyA9IFtdO1xuICAgICAgICAgICAgY29tbWFuZExpc3QuZ2V0TGlzdCgpLmZvckVhY2goKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsQ29tbWFuZCA9IG5ldyAoPGFueT53aW5kb3cpLkNvbW1hbmQoY29tbWFuZC50eXBlLCBjb21tYW5kLnRhcmdldCwgY29tbWFuZC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZS5jb21tYW5kcy5wdXNoKHNlbENvbW1hbmQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhlY3V0ZShjb21tYW5kOiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdLCBjYWxsYmFjazogKHJlc3BvbnNlOiBzdHJpbmcsIHJlc3VsdDogYm9vbGVhbikgPT4gdm9pZCkge1xuICAgICAgICAgICAgdmFyIG1vZGVsID0gbmV3IE1vZGVscy5TZWxlbml1bUNvbW1hbmQuTW9kZWwoY29tbWFuZCwgYXJncyk7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5Nb2RlbChtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuc2VuZE1lc3NhZ2UodGhpcy5tZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVSZXBvc2l0b3J5LnRvT2JqZWN0KG1lc3NhZ2UpKS50aGVuKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlRGlzcGF0Y2hlci5kaXNwYXRjaChtZXNzYWdlLCB7XG4gICAgICAgICAgICAgICAgICAgIE1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWwgOiAobWVzc2FnZTogTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbCkgPT4gY2FsbGJhY2soJ09LJywgdHJ1ZSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIge1xuICAgIGV4cG9ydCBjbGFzcyBGaWxlTG9hZGVyIHtcbiAgICAgICAgcHJpdmF0ZSBpbmplY3RTY3JpcHQgOiBzdHJpbmc7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGluamVjdFNjcmlwdHMpIHtcbiAgICAgICAgfVxuICAgICAgICBnZXRDb2RlICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluamVjdFNjcmlwdDtcbiAgICAgICAgfVxuICAgICAgICBnZXRzICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKHRoaXMuaW5qZWN0U2NyaXB0cy5tYXAoKHNjcDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8YW55PmpRdWVyeS5nZXQoJy8nK3NjcCk7XG4gICAgICAgICAgICAgICAgfSkpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmplY3RTY3JpcHQgPSByZXN1bHRzLmpvaW4oJztcXG4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYiB7XG4gICAgZXhwb3J0IGNsYXNzIEluaXRpYWxpemVyIHtcbiAgICAgICAgcHJpdmF0ZSBpbmplY3RTY3JpcHRzIDogSW5qZWN0U2NyaXB0cztcbiAgICAgICAgcHJpdmF0ZSBtYW5hZ2VyIDogTWFuYWdlcjtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgY2FsbGVkVGFiSWQ6IHN0cmluZywgcHJpdmF0ZSBmaWxlTG9hZGVyOiBGaWxlTG9hZGVyKSB7XG4gICAgICAgICAgICB0aGlzLmluamVjdFNjcmlwdHMgPSBuZXcgSW5qZWN0U2NyaXB0cyhmaWxlTG9hZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBzdGFydCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0VGFiKHRoaXMuY2FsbGVkVGFiSWQpLnRoZW4oKHRhYjogY2hyb21lLnRhYnMuVGFiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlciA9IG5ldyBNYW5hZ2VyKHRhYiwgKG1hbmFnZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluamVjdFNjcmlwdHMuY29ubmVjdChtYW5hZ2VyLmdldFRhYklkKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNvbm5lY3QoKS50aGVuKCgpID0+IHJlc29sdmUodGhpcy5tYW5hZ2VyKSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgZ2V0VGFiIChjYWxsZWRUYWJJZDogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICh0YWI6IGNocm9tZS50YWJzLlRhYikgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5nZXQocGFyc2VJbnQoY2FsbGVkVGFiSWQpLCAodGFiOiBjaHJvbWUudGFicy5UYWIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYiAmJiB0YWIuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGFiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnU2VjdXJpdHkgRXJyb3IuXFxuZG9lcyBub3QgcnVuIG9uIFwiY2hyb21lOi8vXCIgcGFnZS5cXG4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYiB7XG4gICAgZXhwb3J0IGNsYXNzIEluamVjdFNjcmlwdHMge1xuICAgICAgICBwcml2YXRlIGluamVjdFNjcmlwdCA6IHN0cmluZztcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgZmlsZUxvYWRlcikge1xuICAgICAgICAgICAgdGhpcy5pbmplY3RTY3JpcHQgPSBmaWxlTG9hZGVyLmdldENvZGUoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgZG91YmxlIGxvYWRpbmcgZmxhZy5cbiAgICAgICAgcHJpdmF0ZSBleGVjdXRlRW5kICh0YWJpZDogbnVtYmVyLCByZXNvbHZlOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICBjaHJvbWUudGFicy5leGVjdXRlU2NyaXB0KHRhYmlkLCB7XG4gICAgICAgICAgICAgICAgJ2NvZGUnIDogJ3RoaXMuZXh0ZW5zaW9uQ29udGVudExvYWRlZCA9IHRydWU7J1xuICAgICAgICAgICAgfSwgcmVzb2x2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBleGVjdXRlU2NyaXB0ICh0YWJpZDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5leGVjdXRlU2NyaXB0KHRhYmlkLCB7XG4gICAgICAgICAgICAgICAgICAgICdydW5BdCcgOiAnZG9jdW1lbnRfc3RhcnQnLFxuICAgICAgICAgICAgICAgICAgICAnY29kZScgOiB0aGlzLmluamVjdFNjcmlwdFxuICAgICAgICAgICAgICAgIH0sICgpID0+IHRoaXMuZXhlY3V0ZUVuZCh0YWJpZCwgcmVzb2x2ZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdCh0YWJpZDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBkb3VibGUgbG9hZGluZyBjaGVjay5cbiAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5leGVjdXRlU2NyaXB0KHRhYmlkLCB7XG4gICAgICAgICAgICAgICAgICAgICdjb2RlJyA6ICd0aGlzLmV4dGVuc2lvbkNvbnRlbnRMb2FkZWQnXG4gICAgICAgICAgICAgICAgfSwgKHJlc3VsdDogYW55W10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoICYmIHJlc3VsdFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGVTY3JpcHQodGFiaWQpLnRoZW4ocmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiIHtcbiAgICBleHBvcnQgY2xhc3MgTWFuYWdlciB7XG4gICAgICAgIHByaXZhdGUgdGFiOiBNb2RlbDtcbiAgICAgICAgcHJpdmF0ZSBvbk1lc3NhZ2VMaXN0ZW5lcnM6IEFycmF5PChtZXNzYWdlOiBPYmplY3QpID0+IHZvaWQ+ID0gW107XG4gICAgICAgIHByaXZhdGUgb25EaXNjb25uZWN0TGlzdGVuZXJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuICAgICAgICBwcml2YXRlIG9uQ29ubmVjdExpc3RlbmVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICB0YWI6IGNocm9tZS50YWJzLlRhYixcbiAgICAgICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZTogKG1hbmFnZXI6IE1hbmFnZXIpID0+IFByb21pc2U8dm9pZD5cbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnRhYiA9IG5ldyBNb2RlbCh0YWIpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgY2xvc2VNZXNzYWdlID0gJ0Nsb3NlIHRlc3QgY2FzZT8nO1xuICAgICAgICBjb25uZWN0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxpemUodGhpcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWIuY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFiLmFkZExpc3RlbmVyKCdvblJlbW92ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maXJtKHRoaXMuY2xvc2VNZXNzYWdlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYi5hZGRMaXN0ZW5lcignb25VcGRhdGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZFRhYigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSByZWxvYWRUYWIgKCkge1xuICAgICAgICAgICAgdmFyIHRhYklkID0gdGhpcy50YWIuZ2V0VGFiSWQoKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemUodGhpcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLmdldCh0YWJJZCwgKHRhYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWIgPSBuZXcgTW9kZWwodGFiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFiLmNvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Db25uZWN0TGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gbGlzdGVuZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZUxpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IHRoaXMudGFiLm9uTWVzc2FnZShsaXN0ZW5lcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3RMaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiB0aGlzLnRhYi5vbkRpc2Nvbm5lY3QobGlzdGVuZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGdldFRhYklkICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYi5nZXRUYWJJZCgpO1xuICAgICAgICB9XG4gICAgICAgIGdldFRhYlVSTCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWIuZ2V0VGFiVVJMKCk7XG4gICAgICAgIH1cbiAgICAgICAgcG9zdE1lc3NhZ2UgKG1lc3NhZ2U6IE9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy50YWIucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VuZE1lc3NhZ2UgKG1lc3NhZ2U6IE9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFiLnNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIG9uTWVzc2FnZSAoY2FsbGJhY2s6IChtZXNzYWdlOiBPYmplY3QpID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgdGhpcy50YWIub25NZXNzYWdlKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBvbkNvbm5lY3QgKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ29ubmVjdExpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBvbkRpc2Nvbm5lY3QgKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdExpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHRoaXMudGFiLm9uRGlzY29ubmVjdChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYiB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICAgICAgcHJpdmF0ZSBwb3J0OiBjaHJvbWUucnVudGltZS5Qb3J0O1xuICAgICAgICBwcml2YXRlIHNlbmRNZXNzYWdlUmVzcG9uc2VJbnRlcnZhbCA9IDEwMDA7XG4gICAgICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgICAgIHByaXZhdGUgdGFiOiBjaHJvbWUudGFicy5UYWJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgICAgIGdldFRhYklkICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYi5pZDtcbiAgICAgICAgfVxuICAgICAgICBnZXRUYWJVUkwgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFiLnVybDtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGNoZWNrT25VcGRhdGVkICgpIHtcbiAgICAgICAgICAgIHZhciB1cGRhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICBjaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkOiBudW1iZXIsIGNoYW5nZUluZm86IGNocm9tZS50YWJzLlRhYkNoYW5nZUluZm8sIHRhYjogY2hyb21lLnRhYnMuVGFiKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFiLmlkICE9PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VJbmZvLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHVwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1cGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ29uVXBkYXRlZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcG9zdE1lc3NhZ2UgKG1lc3NhZ2U6IE9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5wb3J0LnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRNZXNzYWdlIChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGhpcy50YWIuaWQsIG1lc3NhZ2UsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoJ21pc3NpbmcgcmVzdWx0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucG9ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhYi5zdGF0dXMgIT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuTW9kZWwocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobWVzc2FnZS5jb21tYW5kKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoc3VjY2VzcywgdGhpcy5zZW5kTWVzc2FnZVJlc3BvbnNlSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCdzZW5kTWVzc2FnZSB0aW1lb3V0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHRoaXMuc2VuZE1lc3NhZ2VSZXNwb25zZUludGVydmFsICogMTApO1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25uZWN0ICgpIHtcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IGNocm9tZS50YWJzLmNvbm5lY3QodGhpcy50YWIuaWQpO1xuICAgICAgICAgICAgdGhpcy5wb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNocm9tZS50YWJzLm9uUmVtb3ZlZC5hZGRMaXN0ZW5lcigodGFiSWQ6IG51bWJlciwgcmVtb3ZlSW5mbzogY2hyb21lLnRhYnMuVGFiUmVtb3ZlSW5mbykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhYi5pZCAhPT0gdGFiSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ29uUmVtb3ZlZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNoZWNrT25VcGRhdGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgb25NZXNzYWdlIChjYWxsYmFjazogKG1lc3NhZ2U6IE9iamVjdCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5wb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgb25EaXNjb25uZWN0IChjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5wb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBkaXNjb25uZWN0ICgpIHtcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IG51bGw7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5wb3J0O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ2FkZENvbW1lbnQnO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHVibGljIGNvbW1hbmQ6IENhdC5Nb2RlbHMuQ29tbWFuZC5Nb2RlbCwgcHVibGljIGluc2VydEJlZm9yZUxhc3RDb21tYW5kOiBib29sZWFuKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50IHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIE1lc3NhZ2UuUmVwb3NpdG9yeSB7XG4gICAgICAgIHJlcG9zaXRvcnkgPSBuZXcgQ2F0Lk1vZGVscy5Db21tYW5kLlJlcG9zaXRvcnkoKTtcblxuICAgICAgICB0b09iamVjdCAobWVzc2FnZTogTW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ25hbWUnIDogTW9kZWwubWVzc2FnZU5hbWUsXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQnIDoge1xuICAgICAgICAgICAgICAgICAgICAnY29tbWFuZCcgOiB0aGlzLnJlcG9zaXRvcnkudG9PYmplY3QobWVzc2FnZS5jb21tYW5kKSxcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEJlZm9yZUxhc3RDb21tYW5kJyA6IG1lc3NhZ2UuaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZyb21PYmplY3QgKG1lc3NhZ2U6IE9iamVjdCkge1xuICAgICAgICAgICAgdmFyIGNvbW1hbmQgPSB0aGlzLnJlcG9zaXRvcnkuZnJvbU9iamVjdChtZXNzYWdlWydjb250ZW50J11bJ2NvbW1hbmQnXSk7XG4gICAgICAgICAgICB2YXIgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQgPSAhIW1lc3NhZ2VbJ2NvbnRlbnQnXVsnaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQnXTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwoY29tbWFuZCwgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgTWVzc2FnZS5Nb2RlbCB7XG4gICAgICAgIHN0YXRpYyBtZXNzYWdlTmFtZSA9ICdwbGF5Q29tbWFuZCc7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgY29tbWFuZDogQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBNZXNzYWdlLlJlcG9zaXRvcnkge1xuICAgICAgICByZXBvc2l0b3J5ID0gbmV3IENhdC5Nb2RlbHMuQ29tbWFuZC5SZXBvc2l0b3J5KCk7XG5cbiAgICAgICAgdG9PYmplY3QgKG1lc3NhZ2U6IE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICduYW1lJyA6IE1vZGVsLm1lc3NhZ2VOYW1lLFxuICAgICAgICAgICAgICAgICdjb250ZW50JyA6IHRoaXMucmVwb3NpdG9yeS50b09iamVjdChtZXNzYWdlLmNvbW1hbmQpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZyb21PYmplY3QgKG1lc3NhZ2U6IE9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbCh0aGlzLnJlcG9zaXRvcnkuZnJvbU9iamVjdChtZXNzYWdlWydjb250ZW50J10pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ3BsYXlDb21tYW5kTGlzdCc7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgY29tbWFuZExpc3Q6IENhdC5Nb2RlbHMuQ29tbWFuZExpc3QuTW9kZWwpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBNZXNzYWdlLlJlcG9zaXRvcnkge1xuICAgICAgICByZXBvc2l0b3J5ID0gbmV3IENhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeSgpO1xuXG4gICAgICAgIHRvT2JqZWN0IChtZXNzYWdlOiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZScgOiBNb2RlbC5tZXNzYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiB0aGlzLnJlcG9zaXRvcnkudG9PYmplY3QobWVzc2FnZS5jb21tYW5kTGlzdClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKHRoaXMucmVwb3NpdG9yeS5mcm9tT2JqZWN0KG1lc3NhZ2VbJ2NvbnRlbnQnXSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZSB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgTWVzc2FnZS5Nb2RlbCB7XG4gICAgICAgIHN0YXRpYyBtZXNzYWdlTmFtZSA9ICdwbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZSc7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgY29tbWFuZDogU2VsZW5pdW1Db21tYW5kLk1vZGVsKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZSB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBNZXNzYWdlLlJlcG9zaXRvcnkge1xuICAgICAgICByZXBvc2l0b3J5ID0gbmV3IFNlbGVuaXVtQ29tbWFuZC5SZXBvc2l0b3J5KCk7XG5cbiAgICAgICAgdG9PYmplY3QgKG1lc3NhZ2U6IE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICduYW1lJyA6IE1vZGVsLm1lc3NhZ2VOYW1lLFxuICAgICAgICAgICAgICAgICdjb250ZW50JyA6IHRoaXMucmVwb3NpdG9yeS50b09iamVjdChtZXNzYWdlLmNvbW1hbmQpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZyb21PYmplY3QgKG1lc3NhZ2U6IE9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbCh0aGlzLnJlcG9zaXRvcnkuZnJvbU9iamVjdChtZXNzYWdlWydjb250ZW50J10pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgTWVzc2FnZS5Nb2RlbCB7XG4gICAgICAgIHN0YXRpYyBtZXNzYWdlTmFtZSA9ICdwbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0JztcbiAgICAgICAgcHJpdmF0ZSB2YWxpZENvbW1hbmQgPSBbXG4gICAgICAgICAgICAnT0snLFxuICAgICAgICAgICAgJ05HJ1xuICAgICAgICBdO1xuICAgICAgICAvL3BhZ2UgcmVsb2FkaW5nXG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgY29tbWFuZDogc3RyaW5nID0gJ09LJykge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIGlmICghfnRoaXMudmFsaWRDb21tYW5kLmluZGV4T2YoY29tbWFuZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY29tbWFuZCwnK2NvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIE1lc3NhZ2UuUmVwb3NpdG9yeSB7XG4gICAgICAgIHRvT2JqZWN0IChtZXNzYWdlOiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZScgOiBNb2RlbC5tZXNzYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiBtZXNzYWdlLmNvbW1hbmRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKG1lc3NhZ2VbJ2NvbnRlbnQnXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=