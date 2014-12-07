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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2FwcGxpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlcyI6WyIuLi9zcmMvX2RlZmluZS50cyIsIi4uL3NyYy9CYXNlL0lkZW50aXR5LnRzIiwiLi4vc3JjL0Jhc2UvU2VydmljZS50cyIsIi4uL3NyYy9CYXNlL1VVSUQudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL0NvbnRyb2xsZXJzL0F1dG9waWxvdC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvQ29udHJvbGxlcnMvQ29udGVudFNjcmlwdHNDdHJsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Db250cm9sbGVycy9XaW5kb3dDdHJsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9Db21tYW5kU2VsZWN0TGlzdC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvU2VydmljZXMvQ29uZmlnLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9SZWNvcmRlck9ic2VydmVyLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5L01vZGVsLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5L1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQmFzZS9FbnRpdHlMaXN0L01vZGVsLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5TGlzdC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvTW9kZWxzL0NvbW1hbmRMaXN0L01vZGVsLnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kTGlzdC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvQ29tbWFuZEdyaWQvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL0Rpc3BhdGNoZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvU2VsZW5pdW1Db21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvU2VsZW5pdW1Db21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1NlbGVuaXVtL0Jhc2UudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1NlbGVuaXVtL1JlY2VpdmVyLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9TZWxlbml1bS9TZW5kZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1RhYi9Jbml0aWFsaXplci50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvU2VydmljZXMvVGFiL0luamVjdFNjcmlwdHMudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1RhYi9NYW5hZ2VyLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9UYWIvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL0FkZENvbW1hbmQvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL0FkZENvbW1hbmQvUmVwb3NpdG9yeS50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvUGxheUNvbW1hbmQvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlDb21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlDb21tYW5kTGlzdC9Nb2RlbC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvUGxheUNvbW1hbmRMaXN0L1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0L01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0L1JlcG9zaXRvcnkudHMiXSwibmFtZXMiOlsiQ2F0IiwiQ2F0LkJhc2UiLCJDYXQuQmFzZS5JZGVudGl0eSIsIkNhdC5CYXNlLklkZW50aXR5LmNvbnN0cnVjdG9yIiwiQ2F0LkJhc2UuSWRlbnRpdHkuZXEiLCJDYXQuQmFzZS5TZXJ2aWNlIiwiQ2F0LkJhc2UuU2VydmljZS5jb25zdHJ1Y3RvciIsIkNhdC5VVUlEIiwiQ2F0LlVVSUQuSW52YWxpZFVVSURGb3JtYXQiLCJDYXQuVVVJRC5JbnZhbGlkVVVJREZvcm1hdC5jb25zdHJ1Y3RvciIsIkNhdC5VVUlELlVVSUQiLCJDYXQuVVVJRC5VVUlELmNvbnN0cnVjdG9yIiwiQ2F0LlVVSUQuVVVJRC50b1N0cmluZyIsIkNhdC5VVUlELlVVSUQuZnJvbVN0cmluZyIsIkNhdC5VVUlELlVVSUQuUzQiLCJDYXQuQXBwbGljYXRpb24iLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuQXV0b3BpbG90IiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdC5Db250cm9sbGVyIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdC5Db250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdC5Db250cm9sbGVyLmJpbmRUYWJNYW5hZ2VyIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkNvbnRlbnRTY3JpcHRzQ3RybCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuQ29udGVudFNjcmlwdHNDdHJsLm9uTWVzc2FnZSIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwuYWRkQ29tbWFuZCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwuaW5pdGlhbGl6ZSIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLldpbmRvd0N0cmwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybC5pbml0QW5ndWxhciIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsLmluaXRDb21tYW5kU2VsZWN0TGlzdCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsLmluaXRUYWJJbml0aWFsaXplciIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsLmluaXRpYWxpemUiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QubG9hZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5Db21tYW5kU2VsZWN0TGlzdC5nZXREb2NSb290IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbW1hbmRTZWxlY3RMaXN0LmdldHMiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29uZmlnIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbmZpZy5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXIuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuUmVjb3JkZXJPYnNlcnZlci5nZXRVc2VyTG9nIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXIuYWRkQ29tbWFuZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyLm9uVW5sb2FkRG9jdW1lbnQiLCJDYXQuQmFzZS5FbnRpdHkiLCJDYXQuQmFzZS5FbnRpdHkuTW9kZWwiLCJDYXQuQmFzZS5FbnRpdHkuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQmFzZS5FbnRpdHkuTW9kZWwuZXEiLCJDYXQuQmFzZS5FbnRpdHlMaXN0IiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbCIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsLmFkZCIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwuZ2V0TGlzdCIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwuc3BsaWNlIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbC5yZXBsYWNlIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbC5yZW1vdmUiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsLmNsZWFyIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5SZXBvc2l0b3J5IiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5SZXBvc2l0b3J5LnRvRW50aXR5TGlzdCIsIkNhdC5CYXNlLkVudGl0eUxpc3QuUmVwb3NpdG9yeS5mcm9tRW50aXR5TGlzdCIsIkNhdC5Nb2RlbHMiLCJDYXQuTW9kZWxzLkNvbW1hbmQiLCJDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwiLCJDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuTW9kZWxzLkNvbW1hbmQuUmVwb3NpdG9yeSIsIkNhdC5Nb2RlbHMuQ29tbWFuZC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0Lk1vZGVscy5Db21tYW5kLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuTW9kZWxzLkNvbW1hbmQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0Lk1vZGVscy5Db21tYW5kTGlzdCIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuTW9kZWwiLCJDYXQuTW9kZWxzLkNvbW1hbmRMaXN0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5Nb2RlbC5jbGVhciIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeSIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeS50b09iamVjdCIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscyIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuQ29tbWFuZEdyaWQiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5Db21tYW5kR3JpZC5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuQ29tbWFuZEdyaWQuTW9kZWwuZ2V0Q29tbWFuZExpc3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIuZGlzcGF0Y2giLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kLk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kLlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLkJhc2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uQmFzZS5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5CYXNlLmdldEludGVydmFsIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLkJhc2Uuc3RhcnQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uQmFzZS5zZXRBcGlEb2NzIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyLmV4ZWN1dGUiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uUmVjZWl2ZXIuZXhlYyIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXIiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlNlbmRlci5hZGRDb21tYW5kTGlzdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXIuZXhlY3V0ZSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluaXRpYWxpemVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Jbml0aWFsaXplci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5pdGlhbGl6ZXIuc3RhcnQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluaXRpYWxpemVyLmdldFRhYiIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5qZWN0U2NyaXB0cyIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5qZWN0U2NyaXB0cy5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5qZWN0U2NyaXB0cy5leGVjdXRlRW5kIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5JbmplY3RTY3JpcHRzLmV4ZWN1dGVTY3JpcHQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluamVjdFNjcmlwdHMuY29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5jb25uZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLnJlbG9hZFRhYiIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5nZXRUYWJJZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5nZXRUYWJVUkwiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIucG9zdE1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIuc2VuZE1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIub25NZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLm9uQ29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5vbkRpc2Nvbm5lY3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuZ2V0VGFiSWQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLmdldFRhYlVSTCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuY2hlY2tPblVwZGF0ZWQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLnBvc3RNZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5zZW5kTWVzc2FnZSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuY29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwub25NZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5vbkRpc2Nvbm5lY3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLmRpc2Nvbm5lY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50Lk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5SZXBvc2l0b3J5IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50LlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5SZXBvc2l0b3J5LmZyb21PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZExpc3QuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5LmZyb21PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0LlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0Il0sIm1hcHBpbmdzIjoiQUFLTSxNQUFPLENBQUMsWUFBWSxHQUFTLE1BQU8sQ0FBQyxhQUFhLENBQUM7QUNMekQsSUFBTyxHQUFHLENBUVQ7QUFSRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsSUFBSUEsQ0FRZEE7SUFSVUEsV0FBQUEsSUFBSUEsRUFBQ0EsQ0FBQ0E7UUFDYkMsSUFBYUEsUUFBUUE7WUFDakJDLFNBRFNBLFFBQVFBLENBQ0dBLElBQStCQTtnQkFBdENDLG9CQUFzQ0EsR0FBdENBLFdBQTZCQSxRQUFJQSxDQUFDQSxJQUFJQTtnQkFBL0JBLFNBQUlBLEdBQUpBLElBQUlBLENBQTJCQTtZQUNuREEsQ0FBQ0E7WUFDREQscUJBQUVBLEdBQUZBLFVBQUlBLENBQVdBO2dCQUNYRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtZQUN0REEsQ0FBQ0E7WUFDTEYsZUFBQ0E7UUFBREEsQ0FBQ0EsQUFOREQsSUFNQ0E7UUFOWUEsYUFBUUEsR0FBUkEsUUFNWkEsQ0FBQUE7SUFDTEEsQ0FBQ0EsRUFSVUQsSUFBSUEsR0FBSkEsUUFBSUEsS0FBSkEsUUFBSUEsUUFRZEE7QUFBREEsQ0FBQ0EsRUFSTSxHQUFHLEtBQUgsR0FBRyxRQVFUO0FDUkQsSUFBTyxHQUFHLENBRVQ7QUFGRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsSUFBSUEsQ0FFZEE7SUFGVUEsV0FBQUEsSUFBSUEsRUFBQ0EsQ0FBQ0E7UUFDYkMsSUFBYUEsT0FBT0E7WUFBcEJJLFNBQWFBLE9BQU9BO1lBQUVDLENBQUNBO1lBQURELGNBQUNBO1FBQURBLENBQUNBLEFBQXZCSixJQUF1QkE7UUFBVkEsWUFBT0EsR0FBUEEsT0FBVUEsQ0FBQUE7SUFDM0JBLENBQUNBLEVBRlVELElBQUlBLEdBQUpBLFFBQUlBLEtBQUpBLFFBQUlBLFFBRWRBO0FBQURBLENBQUNBLEVBRk0sR0FBRyxLQUFILEdBQUcsUUFFVDtBQ0ZELElBQU8sR0FBRyxDQTBDSjtBQTFDTixXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsSUFBSUEsQ0EwQ1RBO0lBMUNLQSxXQUFBQSxLQUFJQSxFQUFDQSxDQUFDQTtRQUNiTyxJQUFNQSxpQkFBaUJBO1lBQXZCQyxTQUFNQSxpQkFBaUJBO1lBQUVDLENBQUNBO1lBQURELHdCQUFDQTtRQUFEQSxDQUFDQSxBQUExQkQsSUFBMEJBO1FBQzFCQSxJQUFhQSxJQUFJQTtZQUdiRyxTQUhTQSxJQUFJQSxDQUdBQSxFQUFzQkE7Z0JBQXRCQyxrQkFBc0JBLEdBQXRCQSxjQUFzQkE7Z0JBQy9CQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDTkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0E7d0JBQ1JBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBO3dCQUNUQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQTt3QkFDVEEsR0FBR0E7d0JBQ0hBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBO3dCQUNUQSxHQUFHQTt3QkFDSEEsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUE7d0JBQ1RBLEdBQUdBO3dCQUNIQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQTt3QkFDVEEsR0FBR0E7d0JBQ0hBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBO3dCQUNUQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQTt3QkFDVEEsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUE7cUJBQ1pBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO29CQUNYQSxNQUFNQSxDQUFDQTtnQkFDWEEsQ0FBQ0E7Z0JBQ0RBLElBQUlBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBLGtDQUFrQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDVEEsTUFBTUEsSUFBSUEsaUJBQWlCQSxFQUFFQSxDQUFDQTtnQkFDbENBLENBQUNBO2dCQUNEQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNuQkEsQ0FBQ0E7WUFFREQsdUJBQVFBLEdBQVJBO2dCQUNJRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUNyQkEsQ0FBQ0E7WUFFTUYsZUFBVUEsR0FBakJBLFVBQW1CQSxFQUFVQTtnQkFDekJHLE1BQU1BLENBQUNBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQTtZQUVPSCxpQkFBRUEsR0FBVkE7Z0JBQ0lJLElBQUlBLElBQUlBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO2dCQUM3QkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsT0FBT0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMURBLENBQUNBO1lBQ0xKLFdBQUNBO1FBQURBLENBQUNBLEFBeENESCxJQXdDQ0E7UUF4Q1lBLFVBQUlBLEdBQUpBLElBd0NaQSxDQUFBQTtJQUFBQSxDQUFDQSxFQTFDS1AsSUFBSUEsR0FBSkEsUUFBSUEsS0FBSkEsUUFBSUEsUUEwQ1RBO0FBQURBLENBQUNBLEVBMUNDLEdBQUcsS0FBSCxHQUFHLFFBMENKO0FDMUNOLElBQU8sR0FBRyxDQWdGVDtBQWhGRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0FnRnJCQTtJQWhGVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsV0FBV0EsQ0FnRmpDQTtRQWhGc0JBLFdBQUFBLFdBQVdBO1lBQUNDLElBQUFBLFNBQVNBLENBZ0YzQ0E7WUFoRmtDQSxXQUFBQSxTQUFTQSxFQUFDQSxDQUFDQTtnQkFnQjFDQyxJQUFhQSxVQUFVQTtvQkFDbkJDLFNBRFNBLFVBQVVBLENBRWZBLE1BQWFBLEVBQ2JBLE9BQTZCQSxFQUM3QkEsV0FBcURBLEVBQ3JEQSxpQkFBNENBLEVBQzVDQSxjQUF3REEsRUFDeERBLGlCQUE2REE7d0JBRTdEQyxNQUFNQSxDQUFDQSxXQUFXQSxHQUFHQSxXQUFXQSxDQUFDQTt3QkFDakNBLE1BQU1BLENBQUNBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBO3dCQUV6QkEsTUFBTUEsQ0FBQ0EsT0FBT0EsR0FBR0E7NEJBQ2JBLGNBQWNBLENBQUNBLGNBQWNBLENBQUNBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBLENBQUNBOzRCQUNuRUEsY0FBY0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7d0JBQzNCQSxDQUFDQSxDQUFDQTt3QkFDRkEsTUFBTUEsQ0FBQ0EsV0FBV0EsR0FBR0E7NEJBQ2pCQSxjQUFjQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTt3QkFDekRBLENBQUNBLENBQUNBO3dCQUNGQSxNQUFNQSxDQUFDQSxVQUFVQSxHQUFHQTs0QkFDaEJBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLENBQUNBO3dCQUMzREEsQ0FBQ0EsQ0FBQ0E7d0JBQ0ZBLE1BQU1BLENBQUNBLGFBQWFBLEdBQUdBLFVBQUNBLE9BQU9BOzRCQUMzQkEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3ZDQSxDQUFDQSxDQUFDQTt3QkFDRkEsTUFBTUEsQ0FBQ0EsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0E7d0JBQzlCQSxNQUFNQSxDQUFDQSxjQUFjQSxHQUFHQTs0QkFDcEJBLE1BQU1BLENBQUNBLGVBQWVBLEdBQUdBLElBQUlBLENBQUNBO3dCQUNsQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ0ZBLE1BQU1BLENBQUNBLGFBQWFBLEdBQUdBOzRCQUNuQkEsTUFBTUEsQ0FBQ0EsZUFBZUEsR0FBR0EsS0FBS0EsQ0FBQ0E7d0JBQ25DQSxDQUFDQSxDQUFDQTt3QkFDRkEsTUFBTUEsQ0FBQ0EsV0FBV0EsR0FBR0E7NEJBQ2pCQSxPQUFPQTt3QkFDWEEsQ0FBQ0EsQ0FBQ0E7d0JBQ0ZBLE1BQU1BLENBQUNBLFFBQVFBLEdBQUdBOzRCQUNkQSxPQUFPQTt3QkFDWEEsQ0FBQ0EsQ0FBQ0E7d0JBQ0ZBLE1BQU1BLENBQUNBLFVBQVVBLEdBQUdBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQ0EsSUFBSUEsSUFBS0EsT0FBQUEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsRUFBekJBLENBQXlCQSxDQUFDQSxDQUFDQTt3QkFDdEZBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLE1BQU1BLEVBQUVBLE9BQU9BLEVBQUVBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0E7b0JBQzVEQSxDQUFDQTtvQkFDT0QsbUNBQWNBLEdBQXRCQSxVQUNJQSxNQUFhQSxFQUNiQSxPQUE2QkEsRUFDN0JBLGlCQUE0Q0E7d0JBRTVDRSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFDQSxPQUFlQTs0QkFDOUJBLGlCQUFpQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsRUFBRUE7Z0NBQ2hDQSxzQkFBc0JBLEVBQUdBLFVBQUNBLE9BQXdDQTtvQ0FDOURBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBO3dDQUMxQkEsTUFBTUEsQ0FBQ0E7b0NBQ1hBLENBQUNBO29DQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTt3Q0FDVkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NENBQ3ZDQSxNQUFNQSxDQUFDQSxPQUFPQSxHQUFHQSxPQUFPQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTs0Q0FDckNBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLEVBQUVBLEVBQUVBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO3dDQUNyRkEsQ0FBQ0E7d0NBQ0RBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO29DQUM1Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQ1BBLENBQUNBOzZCQUNKQSxDQUFDQSxDQUFDQTt3QkFDUEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLENBQUNBO29CQUNMRixpQkFBQ0E7Z0JBQURBLENBQUNBLEFBL0RERCxJQStEQ0E7Z0JBL0RZQSxvQkFBVUEsR0FBVkEsVUErRFpBLENBQUFBO1lBQ0xBLENBQUNBLEVBaEZrQ0QsU0FBU0EsR0FBVEEscUJBQVNBLEtBQVRBLHFCQUFTQSxRQWdGM0NBO1FBQURBLENBQUNBLEVBaEZzQkQsV0FBV0EsR0FBWEEsdUJBQVdBLEtBQVhBLHVCQUFXQSxRQWdGakNBO0lBQURBLENBQUNBLEVBaEZVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQWdGckJBO0FBQURBLENBQUNBLEVBaEZNLEdBQUcsS0FBSCxHQUFHLFFBZ0ZUO0FDaEZELElBQU8sR0FBRyxDQW9EVDtBQXBERCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0FvRHJCQTtJQXBEVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsV0FBV0EsQ0FvRGpDQTtRQXBEc0JBLFdBQUFBLFdBQVdBLEVBQUNBLENBQUNBO1lBQ2hDQyxJQUFhQSxrQkFBa0JBO2dCQU0zQkssU0FOU0Esa0JBQWtCQSxDQU1OQSxJQUF5QkE7b0JBQXpCQyxTQUFJQSxHQUFKQSxJQUFJQSxDQUFxQkE7b0JBQzFDQSxJQUFJQSxDQUFDQSwwQ0FBMENBLEdBQUdBLElBQUlBLGtCQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSx5QkFBeUJBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO29CQUM1R0EsSUFBSUEsQ0FBQ0EsMkJBQTJCQSxHQUFHQSxJQUFJQSxrQkFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7b0JBQzlFQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLElBQUlBLG9CQUFRQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLENBQUNBO29CQUN4REEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxHQUFHQSxJQUFJQSxrQkFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7b0JBQ3pEQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLElBQUlBLG9CQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtnQkFDN0RBLENBQUNBO2dCQUNERCxzQ0FBU0EsR0FBVEEsVUFBV0EsT0FBZUEsRUFBRUEsTUFBb0NBLEVBQUVBLFlBQXVDQTtvQkFBekdFLGlCQVVDQTtvQkFUR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQTt3QkFDckNBLHNDQUFzQ0EsRUFBR0EsVUFBQ0EsT0FBd0RBOzRCQUM5RkEsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTs0QkFDbkRBLElBQUlBLE1BQU1BLEdBQUdBLEtBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7NEJBQzVEQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFJQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBOzRCQUNqREEsSUFBSUEsYUFBYUEsR0FBR0EsSUFBSUEsa0JBQU1BLENBQUNBLE9BQU9BLENBQUNBLHlCQUF5QkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7NEJBQy9FQSxZQUFZQSxDQUFDQSxLQUFJQSxDQUFDQSwwQ0FBMENBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBO3dCQUMxRkEsQ0FBQ0E7cUJBQ0pBLENBQUNBLENBQUNBO2dCQUNQQSxDQUFDQTtnQkFDT0YsdUNBQVVBLEdBQWxCQSxVQUFtQkEsV0FBbUJBLEVBQUVBLE1BQWNBLEVBQUVBLEtBQWFBLEVBQUVBLE1BQWNBLEVBQUVBLHVCQUFnQ0E7b0JBQ25IRyxJQUFJQSxPQUFPQSxHQUFHQTt3QkFDVkEsU0FBU0EsRUFBR0E7NEJBQ1JBLFNBQVNBLEVBQUdBO2dDQUNSQSxNQUFNQSxFQUFHQSxXQUFXQTtnQ0FDcEJBLFFBQVFBLEVBQUdBLE1BQU1BO2dDQUNqQkEsT0FBT0EsRUFBR0EsS0FBS0E7NkJBQ2xCQTs0QkFDREEseUJBQXlCQSxFQUFHQSx1QkFBdUJBO3lCQUN0REE7cUJBQ0pBLENBQUNBO29CQUNGQSxJQUFJQSxpQkFBaUJBLEdBQUdBLElBQUlBLENBQUNBLDJCQUEyQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBQzdFQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSwyQkFBMkJBLENBQUNBLFFBQVFBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hGQSxDQUFDQTtnQkFDREgsdUNBQVVBLEdBQVZBO29CQUFBSSxpQkFXQ0E7b0JBVkdBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFdBQVdBLENBQUNBLFlBQVlBLEVBQUVBLFVBQUNBLFdBQW1CQSxFQUFFQSxNQUFjQSxFQUFFQSxLQUFhQSxFQUFFQSxNQUFjQSxFQUFFQSx1QkFBZ0NBO3dCQUNqSkEsS0FBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsV0FBV0EsRUFBRUEsTUFBTUEsRUFBRUEsS0FBS0EsRUFBRUEsTUFBTUEsRUFBRUEsdUJBQXVCQSxDQUFDQSxDQUFDQTtvQkFDakZBLENBQUNBLENBQUNBLENBQUNBO29CQUNIQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxXQUFXQSxDQUFDQTt3QkFDL0JBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLEtBQUlBLENBQUNBLGdCQUFnQkEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZEQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDSEEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsVUFBQ0EsT0FBZUEsRUFBRUEsTUFBb0NBLEVBQUVBLFlBQXVDQTt3QkFDaElBLEtBQUlBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLEVBQUVBLE1BQU1BLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBO29CQUNsREEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLENBQUNBO2dCQUNMSix5QkFBQ0E7WUFBREEsQ0FBQ0EsQUFsRERMLElBa0RDQTtZQWxEWUEsOEJBQWtCQSxHQUFsQkEsa0JBa0RaQSxDQUFBQTtRQUNMQSxDQUFDQSxFQXBEc0JELFdBQVdBLEdBQVhBLHVCQUFXQSxLQUFYQSx1QkFBV0EsUUFvRGpDQTtJQUFEQSxDQUFDQSxFQXBEVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUFvRHJCQTtBQUFEQSxDQUFDQSxFQXBETSxHQUFHLEtBQUgsR0FBRyxRQW9EVDtBQ3BERCxJQUFJLGlDQUEyRSxDQUFDO0FBRWhGLElBQU8sR0FBRyxDQXVEVDtBQXZERCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0F1RHJCQTtJQXZEVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsV0FBV0EsQ0F1RGpDQTtRQXZEc0JBLFdBQUFBLFdBQVdBLEVBQUNBLENBQUNBO1lBQ2hDQyxJQUFhQSxVQUFVQTtnQkFDbkJVLFNBRFNBLFVBQVVBLENBQ0VBLFdBQW1CQTtvQkFBbkJDLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFRQTtnQkFBR0EsQ0FBQ0E7Z0JBQ3BDRCxnQ0FBV0EsR0FBbkJBLFVBQXFCQSxPQUFPQSxFQUFFQSxpQkFBaUJBO29CQUMzQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsT0FBT0EsQ0FBQ0EsVUFBQ0EsT0FBT0E7d0JBQ3ZCQSxJQUFJQSxZQUFZQSxHQUFHQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUM3REEsT0FBT0EsQ0FBQ0EsU0FBU0EsRUFBRUEsY0FBTUEsY0FBT0EsRUFBUEEsQ0FBT0EsQ0FBQ0EsQ0FDakNBLE9BQU9BLENBQUNBLG1CQUFtQkEsRUFBRUEsY0FBTUEsd0JBQWlCQSxFQUFqQkEsQ0FBaUJBLENBQUNBLENBQ3JEQSxPQUFPQSxDQUFDQSxtQkFBbUJBLEVBQUVBLGtCQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUN2REEsT0FBT0EsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxVQUFDQSxPQUE2QkEsRUFBRUEsaUJBQTRDQTs0QkFDbkdBLGlDQUFpQ0EsR0FBR0EsSUFBSUEsb0JBQVFBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLEVBQUVBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0E7NEJBQzdGQSxNQUFNQSxDQUFDQSxpQ0FBaUNBLENBQUNBO3dCQUM3Q0EsQ0FBQ0EsQ0FBQ0EsQ0FDREEsT0FBT0EsQ0FBQ0EsYUFBYUEsRUFBRUE7NEJBQ3BCQSxNQUFNQSxDQUFDQSxJQUFJQSxrQkFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7d0JBQzFDQSxDQUFDQSxDQUFDQSxDQUNEQSxVQUFVQSxDQUFDQSxXQUFXQSxFQUFFQSxXQUFXQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUM3REE7d0JBQ0RBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBO3dCQUM5Q0EsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7b0JBQzFCQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDUEEsQ0FBQ0E7Z0JBQ09GLDBDQUFxQkEsR0FBN0JBO29CQUNJRyxJQUFJQSxrQkFBa0JBLEdBQUdBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLG9CQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtvQkFDL0VBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBO3dCQUNmQSxJQUFJQSxPQUFPQSxDQUFDQSxVQUFDQSxPQUFnRUEsRUFBRUEsTUFBc0NBOzRCQUNqSEEsSUFBSUEsaUJBQWlCQSxHQUFHQSxJQUFJQSxvQkFBUUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTs0QkFDekRBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFNQSxPQUFBQSxPQUFPQSxDQUFDQSxpQkFBaUJBLENBQUNBLEVBQTFCQSxDQUEwQkEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7d0JBQ3BHQSxDQUFDQSxDQUFDQTt3QkFDRkEsSUFBSUEsT0FBT0EsQ0FBQ0EsVUFBQ0EsT0FBbUJBLEVBQUVBLE1BQXNDQTs0QkFDcEVBLG9CQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxrQkFBa0JBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO3dCQUN4RkEsQ0FBQ0EsQ0FBQ0E7d0JBQ0ZBLElBQUlBLE9BQU9BLENBQUNBLFVBQUNBLE9BQW1CQTs0QkFDNUJBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO3dCQUM3Q0EsQ0FBQ0EsQ0FBQ0E7cUJBQ0xBLENBQUNBLENBQUNBO2dCQUNQQSxDQUFDQTtnQkFDT0gsdUNBQWtCQSxHQUExQkEsVUFBNEJBLE9BQU9BLEVBQUVBLFVBQVVBO29CQUEvQ0ksaUJBYUNBO29CQVpHQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxVQUFDQSxPQUFnREEsRUFBRUEsTUFBc0NBO3dCQUNsR0EsSUFBSUEsV0FBV0EsR0FBR0EsSUFBSUEsb0JBQVFBLENBQUNBLEdBQUdBLENBQUNBLFdBQVdBLENBQUNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO3dCQUNqRUEsV0FBV0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3BEQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFDQSxPQUE2QkE7d0JBQ25DQSxLQUFJQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLFVBQUNBLE9BQU9BOzRCQUN0Q0EsSUFBSUEsaUJBQWlCQSxHQUFHQSxPQUFPQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTs0QkFDeENBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLEVBQUVBLGlCQUFpQkEsQ0FBQ0EsQ0FDdkNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQ2JBLEtBQUtBLENBQUNBLFVBQVVBLENBQUNBLENBQ3JCQTt3QkFDTEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3pCQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtnQkFDekJBLENBQUNBO2dCQUNESiwrQkFBVUEsR0FBVkE7b0JBQ0lLLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNEQSxDQUFDQTtnQkFDTEwsaUJBQUNBO1lBQURBLENBQUNBLEFBckREVixJQXFEQ0E7WUFyRFlBLHNCQUFVQSxHQUFWQSxVQXFEWkEsQ0FBQUE7UUFDTEEsQ0FBQ0EsRUF2RHNCRCxXQUFXQSxHQUFYQSx1QkFBV0EsS0FBWEEsdUJBQVdBLFFBdURqQ0E7SUFBREEsQ0FBQ0EsRUF2RFVmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBdURyQkE7QUFBREEsQ0FBQ0EsRUF2RE0sR0FBRyxLQUFILEdBQUcsUUF1RFQ7QUN6REQsSUFBTyxHQUFHLENBNEJUO0FBNUJELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxXQUFXQSxDQTRCckJBO0lBNUJVQSxXQUFBQSxXQUFXQTtRQUFDZSxJQUFBQSxRQUFRQSxDQTRCOUJBO1FBNUJzQkEsV0FBQUEsUUFBUUEsRUFBQ0EsQ0FBQ0E7WUFDN0JpQixJQUFhQSxpQkFBaUJBO2dCQUE5QkMsU0FBYUEsaUJBQWlCQTtnQkEwQjlCQyxDQUFDQTtnQkF2QkdELGdDQUFJQSxHQUFKQSxVQUFNQSxJQUFZQTtvQkFBbEJFLGlCQWdCQ0E7b0JBZkdBLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQU9BLFVBQUNBLE9BQW1CQSxFQUFFQSxNQUFzQ0E7d0JBQ2pGQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxjQUFjQSxFQUFFQSxDQUFDQTt3QkFDL0JBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO3dCQUN0QkEsR0FBR0EsQ0FBQ0Esa0JBQWtCQSxHQUFHQTs0QkFDckJBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLFVBQVVBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dDQUN2QkEsTUFBTUEsQ0FBQ0E7NEJBQ1hBLENBQUNBOzRCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxLQUFLQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQSxNQUFNQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDekNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLGlCQUFpQkEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ3pEQSxDQUFDQTs0QkFDREEsS0FBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsR0FBR0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsZUFBZUEsQ0FBQ0E7NEJBQ3ZEQSxPQUFPQSxFQUFFQSxDQUFDQTt3QkFDZEEsQ0FBQ0EsQ0FBQ0E7d0JBQ0ZBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLENBQUNBO2dCQUNERixzQ0FBVUEsR0FBVkE7b0JBQ0lHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO2dCQUNoQ0EsQ0FBQ0E7Z0JBQ0RILGdDQUFJQSxHQUFKQTtvQkFDSUksTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUVBLENBQUNBO2dCQXhCY0osOEJBQVlBLEdBQUdBLGlDQUFpQ0EsQ0FBQ0E7Z0JBeUJwRUEsd0JBQUNBO1lBQURBLENBQUNBLEFBMUJERCxJQTBCQ0E7WUExQllBLDBCQUFpQkEsR0FBakJBLGlCQTBCWkEsQ0FBQUE7UUFDTEEsQ0FBQ0EsRUE1QnNCakIsUUFBUUEsR0FBUkEsb0JBQVFBLEtBQVJBLG9CQUFRQSxRQTRCOUJBO0lBQURBLENBQUNBLEVBNUJVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQTRCckJBO0FBQURBLENBQUNBLEVBNUJNLEdBQUcsS0FBSCxHQUFHLFFBNEJUO0FDNUJELElBQU8sR0FBRyxDQXlCVDtBQXpCRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0F5QnJCQTtJQXpCVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsUUFBUUEsQ0F5QjlCQTtRQXpCc0JBLFdBQUFBLFFBQVFBLEVBQUNBLENBQUNBO1lBQzdCaUIsSUFBYUEsTUFBTUE7Z0JBQW5CTSxTQUFhQSxNQUFNQTtnQkF1Qm5CQyxDQUFDQTtnQkF0QlVELG9CQUFhQSxHQUFHQTtvQkFDbkJBLGtCQUFrQkE7b0JBQ2xCQSx5QkFBeUJBO29CQUN6QkEsMkJBQTJCQTtvQkFDM0JBLCtCQUErQkE7b0JBQy9CQSw0Q0FBNENBO29CQUM1Q0Esb0NBQW9DQTtvQkFDcENBLHlDQUF5Q0E7b0JBQ3pDQSxrQ0FBa0NBO29CQUNsQ0EsNENBQTRDQTtvQkFDNUNBLHlDQUF5Q0E7b0JBQ3pDQSw4Q0FBOENBO29CQUM5Q0EscUNBQXFDQTtvQkFDckNBLDhCQUE4QkE7b0JBQzlCQSx1Q0FBdUNBO29CQUN2Q0EsOEJBQThCQTtvQkFDOUJBLHFEQUFxREE7b0JBQ3JEQSxnQkFBZ0JBO29CQUNoQkEsb0JBQW9CQTtvQkFDcEJBLHdCQUF3QkE7aUJBQzNCQSxDQUFDQTtnQkFDS0EscUJBQWNBLEdBQUdBLGtDQUFrQ0EsQ0FBQ0E7Z0JBQy9EQSxhQUFDQTtZQUFEQSxDQUFDQSxBQXZCRE4sSUF1QkNBO1lBdkJZQSxlQUFNQSxHQUFOQSxNQXVCWkEsQ0FBQUE7UUFDTEEsQ0FBQ0EsRUF6QnNCakIsUUFBUUEsR0FBUkEsb0JBQVFBLEtBQVJBLG9CQUFRQSxRQXlCOUJBO0lBQURBLENBQUNBLEVBekJVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQXlCckJBO0FBQURBLENBQUNBLEVBekJNLEdBQUcsS0FBSCxHQUFHLFFBeUJUOzs7Ozs7O0FDdEJELEFBSEE7O0lBRUk7QUFDSixJQUFPLEdBQUcsQ0FjVDtBQWRELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxXQUFXQSxDQWNyQkE7SUFkVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsUUFBUUEsQ0FjOUJBO1FBZHNCQSxXQUFBQSxRQUFRQSxFQUFDQSxDQUFDQTtZQUM3QmlCLElBQWFBLGdCQUFnQkE7Z0JBQVNRLFVBQXpCQSxnQkFBZ0JBLFVBQXFCQTtnQkFBbERBLFNBQWFBLGdCQUFnQkE7b0JBQVNDLDhCQUFZQTtvQkFDOUNBLHFCQUFnQkEsR0FBWUEsSUFBSUEsQ0FBQ0E7b0JBQ2pDQSxjQUFTQSxHQUFZQSxLQUFLQSxDQUFDQTtnQkFVL0JBLENBQUNBO2dCQVRHRCxxQ0FBVUEsR0FBVkE7b0JBQ0lFLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO2dCQUNuQkEsQ0FBQ0E7Z0JBQ0RGLHFDQUFVQSxHQUFWQSxVQUFZQSxPQUFlQSxFQUFFQSxNQUFjQSxFQUFFQSxLQUFhQSxFQUFFQSxNQUFjQSxFQUFFQSx1QkFBZ0NBO29CQUN4R0csSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsT0FBT0EsRUFBRUEsTUFBTUEsRUFBRUEsS0FBS0EsRUFBRUEsTUFBTUEsRUFBRUEsdUJBQXVCQSxDQUFDQSxDQUFDQTtnQkFDckZBLENBQUNBO2dCQUNESCwyQ0FBZ0JBLEdBQWhCQSxVQUFrQkEsR0FBYUE7b0JBQzNCSSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUN2Q0EsQ0FBQ0E7Z0JBQ0xKLHVCQUFDQTtZQUFEQSxDQUFDQSxBQVpEUixFQUFzQ0EsWUFBWUEsRUFZakRBO1lBWllBLHlCQUFnQkEsR0FBaEJBLGdCQVlaQSxDQUFBQTtRQUNMQSxDQUFDQSxFQWRzQmpCLFFBQVFBLEdBQVJBLG9CQUFRQSxLQUFSQSxvQkFBUUEsUUFjOUJBO0lBQURBLENBQUNBLEVBZFVmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBY3JCQTtBQUFEQSxDQUFDQSxFQWRNLEdBQUcsS0FBSCxHQUFHLFFBY1Q7QUNqQkQsSUFBTyxHQUFHLENBU1Q7QUFURCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsSUFBSUEsQ0FTZEE7SUFUVUEsV0FBQUEsSUFBSUE7UUFBQ0MsSUFBQUEsTUFBTUEsQ0FTckJBO1FBVGVBLFdBQUFBLE1BQU1BLEVBQUNBLENBQUNBO1lBQ3BCNEMsSUFBYUEsS0FBS0E7Z0JBQVNDLFVBQWRBLEtBQUtBLFVBQWlCQTtnQkFDL0JBLFNBRFNBLEtBQUtBLENBQ01BLFFBQWdEQTtvQkFBdkRDLHdCQUF1REEsR0FBdkRBLGVBQWdDQSxhQUFRQSxDQUFDQSxJQUFJQSxRQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtvQkFDaEVBLGtCQUFNQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFBQTtvQkFESkEsYUFBUUEsR0FBUkEsUUFBUUEsQ0FBd0NBO2dCQUVwRUEsQ0FBQ0E7Z0JBQ0RELGtCQUFFQSxHQUFGQSxVQUFJQSxDQUFRQTtvQkFDUkUsTUFBTUEsQ0FBQ0EsZ0JBQUtBLENBQUNBLEVBQUVBLFlBQUNBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUNoQ0EsQ0FBQ0E7Z0JBQ0xGLFlBQUNBO1lBQURBLENBQUNBLEFBUERELEVBQTJCQSxhQUFRQSxFQU9sQ0E7WUFQWUEsWUFBS0EsR0FBTEEsS0FPWkEsQ0FBQUE7UUFDTEEsQ0FBQ0EsRUFUZTVDLE1BQU1BLEdBQU5BLFdBQU1BLEtBQU5BLFdBQU1BLFFBU3JCQTtJQUFEQSxDQUFDQSxFQVRVRCxJQUFJQSxHQUFKQSxRQUFJQSxLQUFKQSxRQUFJQSxRQVNkQTtBQUFEQSxDQUFDQSxFQVRNLEdBQUcsS0FBSCxHQUFHLFFBU1Q7QUVURCxJQUFPLEdBQUcsQ0ErQlQ7QUEvQkQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLElBQUlBLENBK0JkQTtJQS9CVUEsV0FBQUEsSUFBSUE7UUFBQ0MsSUFBQUEsVUFBVUEsQ0ErQnpCQTtRQS9CZUEsV0FBQUEsVUFBVUEsRUFBQ0EsQ0FBQ0E7WUFDeEJnRCxJQUFhQSxLQUFLQTtnQkFBaUNDLFVBQXRDQSxLQUFLQSxVQUE2Q0E7Z0JBRzNEQSxTQUhTQSxLQUFLQSxDQUdGQSxJQUFjQTtvQkFBZEMsb0JBQWNBLEdBQWRBLFNBQWNBO29CQUN0QkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ2pCQSxpQkFBT0EsQ0FBQ0E7Z0JBQ1pBLENBQUNBO2dCQUNERCxtQkFBR0EsR0FBSEEsVUFBSUEsTUFBU0E7b0JBQ1RFLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2dCQUMzQkEsQ0FBQ0E7Z0JBQ0RGLHVCQUFPQSxHQUFQQTtvQkFDSUcsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7Z0JBQ3JCQSxDQUFDQTtnQkFDREgsc0JBQU1BLEdBQU5BLFVBQU9BLEtBQWFBLEVBQUVBLE1BQVNBO29CQUMzQkksSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZDQSxDQUFDQTtnQkFDREosdUJBQU9BLEdBQVBBLFVBQVFBLFFBQWtCQSxFQUFFQSxNQUFTQTtvQkFDakNLLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQ3JCQSxVQUFDQSxDQUFDQSxJQUFLQSxPQUFBQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxNQUFNQSxHQUFHQSxDQUFDQSxFQUFwQ0EsQ0FBb0NBLENBQzlDQSxDQUFDQTtnQkFDTkEsQ0FBQ0E7Z0JBQ0RMLHNCQUFNQSxHQUFOQSxVQUFPQSxNQUFTQTtvQkFDWk0sSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FDeEJBLFVBQUNBLENBQUNBLElBQUtBLFFBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLE1BQU1BLENBQUNBLEVBQWJBLENBQWFBLENBQ3ZCQSxDQUFDQTtnQkFDTkEsQ0FBQ0E7Z0JBQ0ROLHFCQUFLQSxHQUFMQTtvQkFDSU8sSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ25CQSxDQUFDQTtnQkFDTFAsWUFBQ0E7WUFBREEsQ0FBQ0EsQUE3QkRELEVBQW1EQSxXQUFNQSxDQUFDQSxLQUFLQSxFQTZCOURBO1lBN0JZQSxnQkFBS0EsR0FBTEEsS0E2QlpBLENBQUFBO1FBQ0xBLENBQUNBLEVBL0JlaEQsVUFBVUEsR0FBVkEsZUFBVUEsS0FBVkEsZUFBVUEsUUErQnpCQTtJQUFEQSxDQUFDQSxFQS9CVUQsSUFBSUEsR0FBSkEsUUFBSUEsS0FBSkEsUUFBSUEsUUErQmRBO0FBQURBLENBQUNBLEVBL0JNLEdBQUcsS0FBSCxHQUFHLFFBK0JUO0FDL0JELElBQU8sR0FBRyxDQWVUO0FBZkQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLElBQUlBLENBZWRBO0lBZlVBLFdBQUFBLElBQUlBO1FBQUNDLElBQUFBLFVBQVVBLENBZXpCQTtRQWZlQSxXQUFBQSxVQUFVQSxFQUFDQSxDQUFDQTtZQUN4QmdELElBQWFBLFVBQVVBO2dCQUNuQlMsU0FEU0EsVUFBVUEsQ0FDRUEsZ0JBQXNDQTtvQkFBdENDLHFCQUFnQkEsR0FBaEJBLGdCQUFnQkEsQ0FBc0JBO2dCQUMzREEsQ0FBQ0E7Z0JBQ0RELGlDQUFZQSxHQUFaQSxVQUFjQSxVQUFhQTtvQkFBM0JFLGlCQUlDQTtvQkFIR0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQ0EsTUFBTUE7d0JBQ25DQSxNQUFNQSxDQUFVQSxLQUFJQSxDQUFDQSxnQkFBaUJBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUM1REEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLENBQUNBO2dCQUNERixtQ0FBY0EsR0FBZEEsVUFBZ0JBLFVBQW9CQTtvQkFBcENHLGlCQUlDQTtvQkFIR0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQ0EsTUFBTUE7d0JBQ3pCQSxNQUFNQSxDQUFDQSxLQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUNwREEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLENBQUNBO2dCQUNMSCxpQkFBQ0E7WUFBREEsQ0FBQ0EsQUFiRFQsSUFhQ0E7WUFiWUEscUJBQVVBLEdBQVZBLFVBYVpBLENBQUFBO1FBQ0xBLENBQUNBLEVBZmVoRCxVQUFVQSxHQUFWQSxlQUFVQSxLQUFWQSxlQUFVQSxRQWV6QkE7SUFBREEsQ0FBQ0EsRUFmVUQsSUFBSUEsR0FBSkEsUUFBSUEsS0FBSkEsUUFBSUEsUUFlZEE7QUFBREEsQ0FBQ0EsRUFmTSxHQUFHLEtBQUgsR0FBRyxRQWVUO0FDZkQsSUFBTyxHQUFHLENBVVQ7QUFWRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsTUFBTUEsQ0FVaEJBO0lBVlVBLFdBQUFBLE1BQU1BO1FBQUM4RCxJQUFBQSxPQUFPQSxDQVV4QkE7UUFWaUJBLFdBQUFBLE9BQU9BLEVBQUNBLENBQUNBO1lBQ3ZCQyxJQUFhQSxLQUFLQTtnQkFBU0MsVUFBZEEsS0FBS0EsVUFBOEJBO2dCQUM1Q0EsU0FEU0EsS0FBS0EsQ0FFSEEsSUFBU0EsRUFDVEEsTUFBV0EsRUFDWEEsS0FBVUE7b0JBRmpCQyxvQkFBZ0JBLEdBQWhCQSxTQUFnQkE7b0JBQ2hCQSxzQkFBa0JBLEdBQWxCQSxXQUFrQkE7b0JBQ2xCQSxxQkFBaUJBLEdBQWpCQSxVQUFpQkE7b0JBRWpCQSxpQkFBT0EsQ0FBQ0E7b0JBSkRBLFNBQUlBLEdBQUpBLElBQUlBLENBQUtBO29CQUNUQSxXQUFNQSxHQUFOQSxNQUFNQSxDQUFLQTtvQkFDWEEsVUFBS0EsR0FBTEEsS0FBS0EsQ0FBS0E7Z0JBR3JCQSxDQUFDQTtnQkFDTEQsWUFBQ0E7WUFBREEsQ0FBQ0EsQUFSREQsRUFBMkJBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEVBUS9DQTtZQVJZQSxhQUFLQSxHQUFMQSxLQVFaQSxDQUFBQTtRQUNMQSxDQUFDQSxFQVZpQkQsT0FBT0EsR0FBUEEsY0FBT0EsS0FBUEEsY0FBT0EsUUFVeEJBO0lBQURBLENBQUNBLEVBVlU5RCxNQUFNQSxHQUFOQSxVQUFNQSxLQUFOQSxVQUFNQSxRQVVoQkE7QUFBREEsQ0FBQ0EsRUFWTSxHQUFHLEtBQUgsR0FBRyxRQVVUO0FDVkQsSUFBTyxHQUFHLENBa0JUO0FBbEJELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxNQUFNQSxDQWtCaEJBO0lBbEJVQSxXQUFBQSxNQUFNQTtRQUFDOEQsSUFBQUEsT0FBT0EsQ0FrQnhCQTtRQWxCaUJBLFdBQUFBLE9BQU9BLEVBQUNBLENBQUNBO1lBTXZCQyxJQUFhQSxVQUFVQTtnQkFBdkJHLFNBQWFBLFVBQVVBO2dCQVd2QkMsQ0FBQ0E7Z0JBVkdELDZCQUFRQSxHQUFSQSxVQUFVQSxPQUFjQTtvQkFDcEJFLE1BQU1BLENBQUNBO3dCQUNIQSxNQUFNQSxFQUFHQSxPQUFPQSxDQUFDQSxJQUFJQTt3QkFDckJBLFFBQVFBLEVBQUdBLE9BQU9BLENBQUNBLE1BQU1BO3dCQUN6QkEsT0FBT0EsRUFBR0EsT0FBT0EsQ0FBQ0EsS0FBS0E7cUJBQzFCQSxDQUFDQTtnQkFDTkEsQ0FBQ0E7Z0JBQ0RGLCtCQUFVQSxHQUFWQSxVQUFZQSxPQUFxQkE7b0JBQzdCRyxNQUFNQSxDQUFDQSxJQUFJQSxhQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDbEVBLENBQUNBO2dCQUNMSCxpQkFBQ0E7WUFBREEsQ0FBQ0EsQUFYREgsSUFXQ0E7WUFYWUEsa0JBQVVBLEdBQVZBLFVBV1pBLENBQUFBO1FBQ0xBLENBQUNBLEVBbEJpQkQsT0FBT0EsR0FBUEEsY0FBT0EsS0FBUEEsY0FBT0EsUUFrQnhCQTtJQUFEQSxDQUFDQSxFQWxCVTlELE1BQU1BLEdBQU5BLFVBQU1BLEtBQU5BLFVBQU1BLFFBa0JoQkE7QUFBREEsQ0FBQ0EsRUFsQk0sR0FBRyxLQUFILEdBQUcsUUFrQlQ7QUNsQkQsSUFBTyxHQUFHLENBZVQ7QUFmRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsTUFBTUEsQ0FlaEJBO0lBZlVBLFdBQUFBLE1BQU1BO1FBQUM4RCxJQUFBQSxXQUFXQSxDQWU1QkE7UUFmaUJBLFdBQUFBLFdBQVdBLEVBQUNBLENBQUNBO1lBQzNCUSxJQUFhQSxLQUFLQTtnQkFBU0MsVUFBZEEsS0FBS0EsVUFBaURBO2dCQUMvREEsU0FEU0EsS0FBS0EsQ0FFVkEsUUFBOEJBLEVBQ3ZCQSxJQUFTQSxFQUNUQSxHQUFRQTtvQkFGZkMsd0JBQThCQSxHQUE5QkEsYUFBOEJBO29CQUM5QkEsb0JBQWdCQSxHQUFoQkEsU0FBZ0JBO29CQUNoQkEsbUJBQWVBLEdBQWZBLFFBQWVBO29CQUVmQSxrQkFBTUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBSFRBLFNBQUlBLEdBQUpBLElBQUlBLENBQUtBO29CQUNUQSxRQUFHQSxHQUFIQSxHQUFHQSxDQUFLQTtnQkFHbkJBLENBQUNBO2dCQUNERCxxQkFBS0EsR0FBTEE7b0JBQ0lFLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDZEEsZ0JBQUtBLENBQUNBLEtBQUtBLFdBQUVBLENBQUNBO2dCQUNsQkEsQ0FBQ0E7Z0JBQ0xGLFlBQUNBO1lBQURBLENBQUNBLEFBYkRELEVBQTJCQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxFQWFuREE7WUFiWUEsaUJBQUtBLEdBQUxBLEtBYVpBLENBQUFBO1FBQ0xBLENBQUNBLEVBZmlCUixXQUFXQSxHQUFYQSxrQkFBV0EsS0FBWEEsa0JBQVdBLFFBZTVCQTtJQUFEQSxDQUFDQSxFQWZVOUQsTUFBTUEsR0FBTkEsVUFBTUEsS0FBTkEsVUFBTUEsUUFlaEJBO0FBQURBLENBQUNBLEVBZk0sR0FBRyxLQUFILEdBQUcsUUFlVDtBQ2ZELElBQU8sR0FBRyxDQXNCVDtBQXRCRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsTUFBTUEsQ0FzQmhCQTtJQXRCVUEsV0FBQUEsTUFBTUE7UUFBQzhELElBQUFBLFdBQVdBLENBc0I1QkE7UUF0QmlCQSxXQUFBQSxXQUFXQSxFQUFDQSxDQUFDQTtZQUMzQlEsSUFBYUEsVUFBVUE7Z0JBQVNJLFVBQW5CQSxVQUFVQSxVQUE2REE7Z0JBQ2hGQSxTQURTQSxVQUFVQTtvQkFFZkMsa0JBQU1BLElBQUlBLGNBQU9BLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBLENBQUNBO2dCQUNwQ0EsQ0FBQ0E7Z0JBRURELDZCQUFRQSxHQUFSQSxVQUFVQSxXQUFrQkE7b0JBQ3hCRSxNQUFNQSxDQUFDQTt3QkFDSEEsYUFBYUEsRUFBR0EsZ0JBQUtBLENBQUNBLFlBQVlBLFlBQUNBLFdBQVdBLENBQUNBO3dCQUMvQ0EsTUFBTUEsRUFBR0EsV0FBV0EsQ0FBQ0EsSUFBSUE7d0JBQ3pCQSxLQUFLQSxFQUFHQSxXQUFXQSxDQUFDQSxHQUFHQTtxQkFDMUJBLENBQUNBO2dCQUNOQSxDQUFDQTtnQkFDREYsK0JBQVVBLEdBQVZBLFVBQVlBLFdBSVhBO29CQUNHRyxJQUFJQSxpQkFBaUJBLEdBQUdBLGdCQUFLQSxDQUFDQSxjQUFjQSxZQUFDQSxXQUFXQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtvQkFDdEVBLE1BQU1BLENBQUNBLElBQUlBLGlCQUFLQSxDQUFDQSxpQkFBaUJBLEVBQUVBLFdBQVdBLENBQUNBLElBQUlBLEVBQUVBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUMzRUEsQ0FBQ0E7Z0JBQ0xILGlCQUFDQTtZQUFEQSxDQUFDQSxBQXBCREosRUFBZ0NBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLFVBQVVBLEVBb0I3REE7WUFwQllBLHNCQUFVQSxHQUFWQSxVQW9CWkEsQ0FBQUE7UUFDTEEsQ0FBQ0EsRUF0QmlCUixXQUFXQSxHQUFYQSxrQkFBV0EsS0FBWEEsa0JBQVdBLFFBc0I1QkE7SUFBREEsQ0FBQ0EsRUF0QlU5RCxNQUFNQSxHQUFOQSxVQUFNQSxLQUFOQSxVQUFNQSxRQXNCaEJBO0FBQURBLENBQUNBLEVBdEJNLEdBQUcsS0FBSCxHQUFHLFFBc0JUO0FDdEJELElBQU8sR0FBRyxDQVVUO0FBVkQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLFdBQVdBLENBVXJCQTtJQVZVQSxXQUFBQSxXQUFXQTtRQUFDZSxJQUFBQSxNQUFNQSxDQVU1QkE7UUFWc0JBLFdBQUFBLE1BQU1BO1lBQUMrRCxJQUFBQSxXQUFXQSxDQVV4Q0E7WUFWNkJBLFdBQUFBLFdBQVdBLEVBQUNBLENBQUNBO2dCQUN2Q0MsSUFBYUEsS0FBS0E7b0JBQVNDLFVBQWRBLEtBQUtBLFVBQTREQTtvQkFBOUVBLFNBQWFBLEtBQUtBO3dCQUFTQyw4QkFBbURBO29CQVE5RUEsQ0FBQ0E7b0JBUEdELDhCQUFjQSxHQUFkQTt3QkFDSUUsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBQ0EsT0FBT0E7NEJBQ3pDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQTt3QkFDMUJBLENBQUNBLENBQUNBLENBQUNBO3dCQUNIQSxJQUFJQSxXQUFXQSxHQUFHQSxJQUFJQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTt3QkFDN0RBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO29CQUN2QkEsQ0FBQ0E7b0JBQ0xGLFlBQUNBO2dCQUFEQSxDQUFDQSxBQVJERCxFQUEyQkEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsRUFRbkRBO2dCQVJZQSxpQkFBS0EsR0FBTEEsS0FRWkEsQ0FBQUE7WUFDTEEsQ0FBQ0EsRUFWNkJELFdBQVdBLEdBQVhBLGtCQUFXQSxLQUFYQSxrQkFBV0EsUUFVeENBO1FBQURBLENBQUNBLEVBVnNCL0QsTUFBTUEsR0FBTkEsa0JBQU1BLEtBQU5BLGtCQUFNQSxRQVU1QkE7SUFBREEsQ0FBQ0EsRUFWVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUFVckJBO0FBQURBLENBQUNBLEVBVk0sR0FBRyxLQUFILEdBQUcsUUFVVDtBQ1ZELElBQU8sR0FBRyxDQStCVDtBQS9CRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0ErQnJCQTtJQS9CVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsTUFBTUEsQ0ErQjVCQTtRQS9Cc0JBLFdBQUFBLE1BQU1BO1lBQUMrRCxJQUFBQSxPQUFPQSxDQStCcENBO1lBL0I2QkEsV0FBQUEsT0FBT0EsRUFBQ0EsQ0FBQ0E7Z0JBUW5DSyxJQUFhQSxVQUFVQTtvQkFBdkJDLFNBQWFBLFVBQVVBO3dCQUNuQkMsMkJBQXNCQSxHQUFHQSxJQUFJQSxrQkFBVUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7d0JBQ3JEQSw0QkFBdUJBLEdBQUdBLElBQUlBLG1CQUFXQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTt3QkFDdkRBLGdDQUEyQkEsR0FBR0EsSUFBSUEsdUJBQWVBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO3dCQUMvREEsMkNBQXNDQSxHQUFHQSxJQUFJQSxrQ0FBMEJBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO3dCQUNyRkEsMENBQXFDQSxHQUFHQSxJQUFJQSxpQ0FBeUJBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO29CQWlCdkZBLENBQUNBO29CQWZHRCw2QkFBUUEsR0FBUkEsVUFBVUEsT0FBZUEsRUFBRUEsVUFBdUJBO3dCQUM5Q0UsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsa0JBQVVBLENBQUNBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBOzRCQUNsREEsVUFBVUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxJQUFJQSxDQUFDQSxzQkFBc0JBLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO3dCQUN2RkEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLG1CQUFXQSxDQUFDQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDMURBLFVBQVVBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxVQUFVQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekZBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSx1QkFBZUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQzlEQSxVQUFVQSxDQUFDQSwyQkFBMkJBLENBQUNBLElBQUlBLENBQUNBLDJCQUEyQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2pHQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsa0NBQTBCQSxDQUFDQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDekVBLFVBQVVBLENBQUNBLHNDQUFzQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esc0NBQXNDQSxDQUFDQSxVQUFVQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDdkhBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxpQ0FBeUJBLENBQUNBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBOzRCQUN4RUEsVUFBVUEsQ0FBQ0EscUNBQXFDQSxDQUFDQSxJQUFJQSxDQUFDQSxxQ0FBcUNBLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO3dCQUNySEEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUNKQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxtQkFBbUJBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO3dCQUNuRUEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUNMRixpQkFBQ0E7Z0JBQURBLENBQUNBLEFBdEJERCxJQXNCQ0E7Z0JBdEJZQSxrQkFBVUEsR0FBVkEsVUFzQlpBLENBQUFBO1lBQ0xBLENBQUNBLEVBL0I2QkwsT0FBT0EsR0FBUEEsY0FBT0EsS0FBUEEsY0FBT0EsUUErQnBDQTtRQUFEQSxDQUFDQSxFQS9Cc0IvRCxNQUFNQSxHQUFOQSxrQkFBTUEsS0FBTkEsa0JBQU1BLFFBK0I1QkE7SUFBREEsQ0FBQ0EsRUEvQlVmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBK0JyQkE7QUFBREEsQ0FBQ0EsRUEvQk0sR0FBRyxLQUFILEdBQUcsUUErQlQ7QUMvQkQsSUFBTyxHQUFHLENBR1Q7QUFIRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0FHckJBO0lBSFVBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLE1BQU1BLENBRzVCQTtRQUhzQkEsV0FBQUEsTUFBTUE7WUFBQytELElBQUFBLE9BQU9BLENBR3BDQTtZQUg2QkEsV0FBQUEsT0FBT0EsRUFBQ0EsQ0FBQ0E7Z0JBQ25DSyxJQUFhQSxLQUFLQTtvQkFBU0ksVUFBZEEsS0FBS0EsVUFBMEJBO29CQUE1Q0EsU0FBYUEsS0FBS0E7d0JBQVNDLDhCQUFpQkE7b0JBQzVDQSxDQUFDQTtvQkFBREQsWUFBQ0E7Z0JBQURBLENBQUNBLEFBRERKLEVBQTJCQSxRQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxFQUMzQ0E7Z0JBRFlBLGFBQUtBLEdBQUxBLEtBQ1pBLENBQUFBO1lBQ0xBLENBQUNBLEVBSDZCTCxPQUFPQSxHQUFQQSxjQUFPQSxLQUFQQSxjQUFPQSxRQUdwQ0E7UUFBREEsQ0FBQ0EsRUFIc0IvRCxNQUFNQSxHQUFOQSxrQkFBTUEsS0FBTkEsa0JBQU1BLFFBRzVCQTtJQUFEQSxDQUFDQSxFQUhVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQUdyQkE7QUFBREEsQ0FBQ0EsRUFITSxHQUFHLEtBQUgsR0FBRyxRQUdUO0FDSEQsSUFBTyxHQUFHLENBU1Q7QUFURCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0FTckJBO0lBVFVBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLE1BQU1BLENBUzVCQTtRQVRzQkEsV0FBQUEsTUFBTUE7WUFBQytELElBQUFBLE9BQU9BLENBU3BDQTtZQVQ2QkEsV0FBQUEsT0FBT0EsRUFBQ0EsQ0FBQ0E7Z0JBQ25DSyxJQUFhQSxVQUFVQTtvQkFBdkJNLFNBQWFBLFVBQVVBO29CQU92QkMsQ0FBQ0E7b0JBTkdELDZCQUFRQSxHQUFSQSxVQUFVQSxNQUFhQTt3QkFDbkJFLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO29CQUNkQSxDQUFDQTtvQkFDREYsK0JBQVVBLEdBQVZBLFVBQVlBLE1BQWNBO3dCQUN0QkcsTUFBTUEsQ0FBQ0EsSUFBSUEsYUFBS0EsRUFBRUEsQ0FBQ0E7b0JBQ3ZCQSxDQUFDQTtvQkFDTEgsaUJBQUNBO2dCQUFEQSxDQUFDQSxBQVBETixJQU9DQTtnQkFQWUEsa0JBQVVBLEdBQVZBLFVBT1pBLENBQUFBO1lBQ0xBLENBQUNBLEVBVDZCTCxPQUFPQSxHQUFQQSxjQUFPQSxLQUFQQSxjQUFPQSxRQVNwQ0E7UUFBREEsQ0FBQ0EsRUFUc0IvRCxNQUFNQSxHQUFOQSxrQkFBTUEsS0FBTkEsa0JBQU1BLFFBUzVCQTtJQUFEQSxDQUFDQSxFQVRVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQVNyQkE7QUFBREEsQ0FBQ0EsRUFUTSxHQUFHLEtBQUgsR0FBRyxRQVNUO0FDVEQsSUFBTyxHQUFHLENBU1Q7QUFURCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0FTckJBO0lBVFVBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLE1BQU1BLENBUzVCQTtRQVRzQkEsV0FBQUEsTUFBTUE7WUFBQytELElBQUFBLGVBQWVBLENBUzVDQTtZQVQ2QkEsV0FBQUEsZUFBZUEsRUFBQ0EsQ0FBQ0E7Z0JBQzNDZSxJQUFhQSxLQUFLQTtvQkFBU0MsVUFBZEEsS0FBS0EsVUFBOEJBO29CQUM1Q0EsU0FEU0EsS0FBS0EsQ0FFSEEsSUFBU0EsRUFDVEEsSUFBbUJBO3dCQUQxQkMsb0JBQWdCQSxHQUFoQkEsU0FBZ0JBO3dCQUNoQkEsb0JBQTBCQSxHQUExQkEsU0FBMEJBO3dCQUUxQkEsaUJBQU9BLENBQUNBO3dCQUhEQSxTQUFJQSxHQUFKQSxJQUFJQSxDQUFLQTt3QkFDVEEsU0FBSUEsR0FBSkEsSUFBSUEsQ0FBZUE7b0JBRzlCQSxDQUFDQTtvQkFDTEQsWUFBQ0E7Z0JBQURBLENBQUNBLEFBUERELEVBQTJCQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxFQU8vQ0E7Z0JBUFlBLHFCQUFLQSxHQUFMQSxLQU9aQSxDQUFBQTtZQUNMQSxDQUFDQSxFQVQ2QmYsZUFBZUEsR0FBZkEsc0JBQWVBLEtBQWZBLHNCQUFlQSxRQVM1Q0E7UUFBREEsQ0FBQ0EsRUFUc0IvRCxNQUFNQSxHQUFOQSxrQkFBTUEsS0FBTkEsa0JBQU1BLFFBUzVCQTtJQUFEQSxDQUFDQSxFQVRVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQVNyQkE7QUFBREEsQ0FBQ0EsRUFUTSxHQUFHLEtBQUgsR0FBRyxRQVNUO0FDVEQsSUFBTyxHQUFHLENBZ0JUO0FBaEJELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxXQUFXQSxDQWdCckJBO0lBaEJVQSxXQUFBQSxXQUFXQTtRQUFDZSxJQUFBQSxNQUFNQSxDQWdCNUJBO1FBaEJzQkEsV0FBQUEsTUFBTUE7WUFBQytELElBQUFBLGVBQWVBLENBZ0I1Q0E7WUFoQjZCQSxXQUFBQSxlQUFlQSxFQUFDQSxDQUFDQTtnQkFLM0NlLElBQWFBLFVBQVVBO29CQUF2QkcsU0FBYUEsVUFBVUE7b0JBVXZCQyxDQUFDQTtvQkFUR0QsNkJBQVFBLEdBQVJBLFVBQVVBLE9BQWNBO3dCQUNwQkUsTUFBTUEsQ0FBQ0E7NEJBQ0hBLE1BQU1BLEVBQUdBLE9BQU9BLENBQUNBLElBQUlBOzRCQUNyQkEsTUFBTUEsRUFBR0EsT0FBT0EsQ0FBQ0EsSUFBSUE7eUJBQ3hCQSxDQUFDQTtvQkFDTkEsQ0FBQ0E7b0JBQ0RGLCtCQUFVQSxHQUFWQSxVQUFZQSxPQUFxQkE7d0JBQzdCRyxNQUFNQSxDQUFDQSxJQUFJQSxxQkFBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsRUFBRUEsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxDQUFDQTtvQkFDTEgsaUJBQUNBO2dCQUFEQSxDQUFDQSxBQVZESCxJQVVDQTtnQkFWWUEsMEJBQVVBLEdBQVZBLFVBVVpBLENBQUFBO1lBQ0xBLENBQUNBLEVBaEI2QmYsZUFBZUEsR0FBZkEsc0JBQWVBLEtBQWZBLHNCQUFlQSxRQWdCNUNBO1FBQURBLENBQUNBLEVBaEJzQi9ELE1BQU1BLEdBQU5BLGtCQUFNQSxLQUFOQSxrQkFBTUEsUUFnQjVCQTtJQUFEQSxDQUFDQSxFQWhCVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUFnQnJCQTtBQUFEQSxDQUFDQSxFQWhCTSxHQUFHLEtBQUgsR0FBRyxRQWdCVDtBQ2hCRCxJQUFPLEdBQUcsQ0E2RVQ7QUE3RUQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLFdBQVdBLENBNkVyQkE7SUE3RVVBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLFFBQVFBLENBNkU5QkE7UUE3RXNCQSxXQUFBQSxRQUFRQTtZQUFDaUIsSUFBQUEsUUFBUUEsQ0E2RXZDQTtZQTdFK0JBLFdBQUFBLFFBQVFBLEVBQUNBLENBQUNBO2dCQUN0Q29FLElBQWFBLElBQUlBO29CQU9iQyxTQVBTQSxJQUFJQSxDQU9BQSxRQUFvQkE7d0JBUHJDQyxpQkEyRUNBO3dCQXRFR0EsYUFBUUEsR0FBV0EsQ0FBQ0EsQ0FBQ0E7d0JBSWpCQSxBQURBQSxzQkFBc0JBO3dCQUNoQkEsTUFBT0EsQ0FBQ0EsVUFBVUEsR0FBR0E7NEJBQ3ZCQSxNQUFNQSxDQUFDQTtnQ0FDSEEsaUJBQWlCQSxFQUFHQTtvQ0FDaEJBLGVBQWVBLEVBQUdBLE1BQU1BO2lDQUMzQkE7NkJBQ0pBLENBQUNBO3dCQUNOQSxDQUFDQSxDQUFDQTt3QkFDSUEsTUFBT0EsQ0FBQ0EsVUFBVUEsR0FBR0EsTUFBTUEsQ0FBQ0E7d0JBQzVCQSxNQUFPQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFVQSxNQUFPQSxDQUFDQSxRQUFRQSxDQUFDQTt3QkFDOUNBLE1BQU9BLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLEVBQUVBLENBQUNBO3dCQUU5QkEsTUFBT0EsQ0FBQ0EsTUFBTUEsR0FBR0E7NEJBQ25CQSxLQUFLQSxFQUFHQTtnQ0FDSkEsWUFBWUEsRUFBR0E7b0NBQ1hBLE1BQU1BLENBQUNBO3dDQUNIQSxTQUFTQSxFQUFHQSxLQUFJQSxDQUFDQSxRQUFRQTtxQ0FDNUJBLENBQUNBO2dDQUNOQSxDQUFDQTs2QkFDSkE7NEJBQ0RBLE1BQU1BLEVBQUdBO2dDQUNMQSxZQUFZQSxFQUFHQTtnQ0FBT0EsQ0FBQ0E7Z0NBQ3ZCQSxhQUFhQSxFQUFHQTtnQ0FBT0EsQ0FBQ0E7NkJBQzNCQTt5QkFDSkEsQ0FBQ0E7d0JBRUZBLElBQUlBLENBQUNBLFFBQVFBLEdBQVNBLE1BQU9BLENBQUNBLFFBQVFBLENBQUNBO3dCQUN2Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBU0EsTUFBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7d0JBQ3ZDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDNUNBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLElBQVVBLE1BQU9BLENBQUNBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7d0JBQ2hFQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQkFDbkRBLENBQUNBO29CQUNERCwwQkFBV0EsR0FBWEE7d0JBQ0lFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO29CQUN6QkEsQ0FBQ0E7b0JBQ0RGLG9CQUFLQSxHQUFMQTt3QkFBQUcsaUJBWUNBO3dCQVhHQSxNQUFNQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxVQUFDQSxPQUFtQkE7NEJBQ25DQSxLQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFVQSxNQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFJQSxDQUFDQSxjQUFjQSxFQUFFQTtnQ0FDbEVBLGNBQWNBLEVBQUdBLE9BQU9BOzZCQUMzQkEsQ0FBQ0EsQ0FBQ0E7NEJBQ0hBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLGtCQUFrQkEsR0FBR0E7Z0NBQ2xDQSxNQUFNQSxDQUFDQSxLQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTs0QkFDOUJBLENBQUNBLENBQUNBOzRCQUVGQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxZQUFZQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTs0QkFDbkNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO3dCQUM3QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLENBQUNBO29CQUdNSCxlQUFVQSxHQUFqQkEsVUFBbUJBLElBQVlBO3dCQUMzQkksTUFBTUEsQ0FBQ0EsSUFBSUEsT0FBT0EsQ0FBT0EsVUFBQ0EsT0FBbUJBLEVBQUVBLE1BQXNDQTs0QkFDakZBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLGNBQWNBLEVBQUVBLENBQUNBOzRCQUMvQkEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ3RCQSxHQUFHQSxDQUFDQSxrQkFBa0JBLEdBQUdBO2dDQUNyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBVUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQ3ZCQSxNQUFNQSxDQUFDQTtnQ0FDWEEsQ0FBQ0E7Z0NBQ0RBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEtBQUtBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLE1BQU1BLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29DQUN6Q0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0NBQzVDQSxDQUFDQTtnQ0FDS0EsTUFBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7Z0NBQ2hGQSxPQUFPQSxFQUFFQSxDQUFDQTs0QkFDZEEsQ0FBQ0EsQ0FBQ0E7NEJBQ0ZBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLENBQUNBO29CQWpCY0osaUJBQVlBLEdBQUdBLHFDQUFxQ0EsQ0FBQ0E7b0JBa0J4RUEsV0FBQ0E7Z0JBQURBLENBQUNBLEFBM0VERCxJQTJFQ0E7Z0JBM0VZQSxhQUFJQSxHQUFKQSxJQTJFWkEsQ0FBQUE7WUFDTEEsQ0FBQ0EsRUE3RStCcEUsUUFBUUEsR0FBUkEsaUJBQVFBLEtBQVJBLGlCQUFRQSxRQTZFdkNBO1FBQURBLENBQUNBLEVBN0VzQmpCLFFBQVFBLEdBQVJBLG9CQUFRQSxLQUFSQSxvQkFBUUEsUUE2RTlCQTtJQUFEQSxDQUFDQSxFQTdFVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUE2RXJCQTtBQUFEQSxDQUFDQSxFQTdFTSxHQUFHLEtBQUgsR0FBRyxRQTZFVDtBQzdFRCxJQUFPLEdBQUcsQ0FnQ1Q7QUFoQ0QsV0FBTyxHQUFHO0lBQUNBLElBQUFBLFdBQVdBLENBZ0NyQkE7SUFoQ1VBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLFFBQVFBLENBZ0M5QkE7UUFoQ3NCQSxXQUFBQSxRQUFRQTtZQUFDaUIsSUFBQUEsUUFBUUEsQ0FnQ3ZDQTtZQWhDK0JBLFdBQUFBLFFBQVFBLEVBQUNBLENBQUNBO2dCQUN0Q29FLElBQWFBLFFBQVFBO29CQUFTTSxVQUFqQkEsUUFBUUEsVUFBYUE7b0JBQzlCQSxTQURTQSxRQUFRQTt3QkFFYkMsa0JBQU1BLGNBQU1BLE9BQU1BLE1BQU9BLENBQUNBLGNBQWNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLEVBQWpEQSxDQUFpREEsQ0FBQ0EsQ0FBQ0E7d0JBRTNEQSxpQkFBWUEsR0FBR0EsbUJBQW1CQSxDQUFDQTtvQkFEM0NBLENBQUNBO29CQUVERCwwQkFBT0EsR0FBUEEsVUFBU0EsS0FBbUNBO3dCQUE1Q0UsaUJBYUNBO3dCQVpHQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDNUJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGNBQU1BLE9BQUFBLEtBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEtBQUlBLENBQUNBLFFBQVFBLEVBQUVBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEVBQTFEQSxDQUEwREEsQ0FBQ0EsQ0FBQ0E7d0JBQ3ZGQSxDQUFDQTt3QkFDREEsSUFBSUEsV0FBV0EsR0FBR0EsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsRUFBRUEsVUFBQUEsQ0FBSUEsSUFBQ0EsT0FBQUEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsRUFBRUEsRUFBZkEsQ0FBZUEsQ0FBQ0EsQ0FBQ0E7d0JBQ3pFQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDN0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGNBQU1BLE9BQUFBLEtBQUlBLENBQUNBLFFBQVFBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEtBQUlBLENBQUNBLFFBQVFBLEVBQUVBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEVBQTNEQSxDQUEyREEsQ0FBQ0EsQ0FBQ0E7d0JBQ3hGQSxDQUFDQTt3QkFDREEsSUFBSUEsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7d0JBQzdEQSxVQUFVQSxDQUFDQTs0QkFDUEEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7d0JBQ2xDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDSEEsTUFBTUEsQ0FBQ0EsUUFBUUEsR0FBR0EsWUFBWUEsQ0FBQ0E7b0JBQ25DQSxDQUFDQTtvQkFDT0YsdUJBQUlBLEdBQVpBLFVBQWNBLElBQWdCQTt3QkFDMUJHLElBQUFBLENBQUNBOzRCQUNHQSxJQUFJQSxFQUFFQSxDQUFDQTs0QkFDUEEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7d0JBQ2hCQSxDQUFFQTt3QkFBQUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBVEEsQ0FBQ0E7NEJBQ0NBLFVBQVVBLENBQUNBO2dDQUNQQSxNQUFNQSxDQUFDQSxDQUFDQTs0QkFDWkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ0hBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO3dCQUNuQkEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUNMSCxlQUFDQTtnQkFBREEsQ0FBQ0EsQUE5QkROLEVBQThCQSxhQUFJQSxFQThCakNBO2dCQTlCWUEsaUJBQVFBLEdBQVJBLFFBOEJaQSxDQUFBQTtZQUNMQSxDQUFDQSxFQWhDK0JwRSxRQUFRQSxHQUFSQSxpQkFBUUEsS0FBUkEsaUJBQVFBLFFBZ0N2Q0E7UUFBREEsQ0FBQ0EsRUFoQ3NCakIsUUFBUUEsR0FBUkEsb0JBQVFBLEtBQVJBLG9CQUFRQSxRQWdDOUJBO0lBQURBLENBQUNBLEVBaENVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQWdDckJBO0FBQURBLENBQUNBLEVBaENNLEdBQUcsS0FBSCxHQUFHLFFBZ0NUO0FDaENELElBQU8sR0FBRyxDQThCVDtBQTlCRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0E4QnJCQTtJQTlCVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsUUFBUUEsQ0E4QjlCQTtRQTlCc0JBLFdBQUFBLFFBQVFBO1lBQUNpQixJQUFBQSxRQUFRQSxDQThCdkNBO1lBOUIrQkEsV0FBQUEsUUFBUUEsRUFBQ0EsQ0FBQ0E7Z0JBQ3RDb0UsSUFBYUEsTUFBTUE7b0JBQVNVLFVBQWZBLE1BQU1BLFVBQWFBO29CQUU1QkEsU0FGU0EsTUFBTUEsQ0FFTUEsT0FBNkJBLEVBQVVBLGlCQUE0REE7d0JBQ3BIQyxrQkFBTUEsY0FBTUEsV0FBVUEsTUFBT0EsQ0FBQ0EsNkJBQTZCQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUF4RUEsQ0FBd0VBLENBQUNBLENBQUNBO3dCQURyRUEsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBc0JBO3dCQUFVQSxzQkFBaUJBLEdBQWpCQSxpQkFBaUJBLENBQTJDQTt3QkFEaEhBLGdEQUEyQ0EsR0FBR0EsSUFBSUEsa0JBQU1BLENBQUNBLE9BQU9BLENBQUNBLDBCQUEwQkEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7d0JBR3ZHQSxNQUFPQSxDQUFDQSx5QkFBeUJBLEdBQUdBLGNBQU1BLFlBQUtBLEVBQUxBLENBQUtBLENBQUNBO3dCQUN0REEsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0E7NEJBQ1JBLE1BQU9BLENBQUNBLHlCQUF5QkEsR0FBR0EsY0FBTUEsWUFBS0EsRUFBTEEsQ0FBS0EsQ0FBQ0E7d0JBQzFEQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDSEEsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0E7NEJBQ1hBLE1BQU9BLENBQUNBLHlCQUF5QkEsR0FBR0EsY0FBTUEsWUFBS0EsRUFBTEEsQ0FBS0EsQ0FBQ0E7d0JBQzFEQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0E7b0JBQ0RELCtCQUFjQSxHQUFkQSxVQUFnQkEsV0FBeUNBO3dCQUF6REUsaUJBTUNBO3dCQUxHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxHQUFHQSxFQUFFQSxDQUFDQTt3QkFDNUJBLFdBQVdBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLFVBQUNBLE9BQU9BOzRCQUNsQ0EsSUFBSUEsVUFBVUEsR0FBR0EsSUFBVUEsTUFBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsRUFBRUEsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3hGQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTt3QkFDNUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNQQSxDQUFDQTtvQkFDREYsd0JBQU9BLEdBQVBBLFVBQVFBLE9BQWVBLEVBQUVBLElBQWNBLEVBQUVBLFFBQXFEQTt3QkFBOUZHLGlCQVFDQTt3QkFQR0EsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsa0JBQU1BLENBQUNBLGVBQWVBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO3dCQUM1REEsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsa0JBQU1BLENBQUNBLE9BQU9BLENBQUNBLDBCQUEwQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pFQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSwyQ0FBMkNBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQUNBLE9BQU9BOzRCQUN0R0EsS0FBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQTtnQ0FDckNBLHFDQUFxQ0EsRUFBR0EsVUFBQ0EsT0FBdURBLElBQUtBLE9BQUFBLFFBQVFBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLEVBQXBCQSxDQUFvQkE7NkJBQzVIQSxDQUFDQSxDQUFDQTt3QkFDUEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLENBQUNBO29CQUNMSCxhQUFDQTtnQkFBREEsQ0FBQ0EsQUE1QkRWLEVBQTRCQSxhQUFJQSxFQTRCL0JBO2dCQTVCWUEsZUFBTUEsR0FBTkEsTUE0QlpBLENBQUFBO1lBQ0xBLENBQUNBLEVBOUIrQnBFLFFBQVFBLEdBQVJBLGlCQUFRQSxLQUFSQSxpQkFBUUEsUUE4QnZDQTtRQUFEQSxDQUFDQSxFQTlCc0JqQixRQUFRQSxHQUFSQSxvQkFBUUEsS0FBUkEsb0JBQVFBLFFBOEI5QkE7SUFBREEsQ0FBQ0EsRUE5QlVmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBOEJyQkE7QUFBREEsQ0FBQ0EsRUE5Qk0sR0FBRyxLQUFILEdBQUcsUUE4QlQ7QUM5QkQsSUFBTyxHQUFHLENBOEJUO0FBOUJELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxXQUFXQSxDQThCckJBO0lBOUJVQSxXQUFBQSxXQUFXQTtRQUFDZSxJQUFBQSxRQUFRQSxDQThCOUJBO1FBOUJzQkEsV0FBQUEsUUFBUUE7WUFBQ2lCLElBQUFBLEdBQUdBLENBOEJsQ0E7WUE5QitCQSxXQUFBQSxHQUFHQSxFQUFDQSxDQUFDQTtnQkFDakNrRixJQUFhQSxXQUFXQTtvQkFHcEJDLFNBSFNBLFdBQVdBLENBR0NBLFdBQW1CQTt3QkFBbkJDLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFRQTt3QkFDcENBLElBQUlBLGFBQWFBLEdBQUdBLGVBQU1BLENBQUNBLGFBQWFBLENBQUNBO3dCQUN6Q0EsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsaUJBQWFBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO29CQUMxREEsQ0FBQ0E7b0JBQ0RELDJCQUFLQSxHQUFMQTt3QkFBQUUsaUJBU0NBO3dCQVJHQSxNQUFNQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxVQUFDQSxPQUFPQSxFQUFFQSxNQUFNQTs0QkFDL0JBLEtBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQUNBLEdBQW9CQTtnQ0FDcERBLEtBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLFdBQU9BLENBQUNBLEdBQUdBLEVBQUVBLFVBQUNBLE9BQU9BO29DQUNwQ0EsTUFBTUEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0NBQzFEQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDSEEsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBTUEsT0FBQUEsT0FBT0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsRUFBckJBLENBQXFCQSxDQUFDQSxDQUFDQTs0QkFDN0RBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO3dCQUNyQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLENBQUNBO29CQUNPRiw0QkFBTUEsR0FBZEEsVUFBZ0JBLFdBQW1CQTt3QkFDL0JHLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLFVBQUNBLE9BQXVDQSxFQUFFQSxNQUFzQ0E7NEJBQy9GQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxVQUFDQSxHQUFvQkE7Z0NBQ3hEQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQ0FDaEJBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dDQUNqQkEsQ0FBQ0E7Z0NBQUNBLElBQUlBLENBQUNBLENBQUNBO29DQUNKQSxNQUFNQSxDQUFDQSxzREFBc0RBLENBQUNBLENBQUNBO2dDQUNuRUEsQ0FBQ0E7NEJBQ0xBLENBQUNBLENBQUNBLENBQUNBO3dCQUNQQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0E7b0JBQ0xILGtCQUFDQTtnQkFBREEsQ0FBQ0EsQUE1QkRELElBNEJDQTtnQkE1QllBLGVBQVdBLEdBQVhBLFdBNEJaQSxDQUFBQTtZQUNMQSxDQUFDQSxFQTlCK0JsRixHQUFHQSxHQUFIQSxZQUFHQSxLQUFIQSxZQUFHQSxRQThCbENBO1FBQURBLENBQUNBLEVBOUJzQmpCLFFBQVFBLEdBQVJBLG9CQUFRQSxLQUFSQSxvQkFBUUEsUUE4QjlCQTtJQUFEQSxDQUFDQSxFQTlCVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUE4QnJCQTtBQUFEQSxDQUFDQSxFQTlCTSxHQUFHLEtBQUgsR0FBRyxRQThCVDtBQzlCRCxJQUFPLEdBQUcsQ0F3Q1Q7QUF4Q0QsV0FBTyxHQUFHO0lBQUNBLElBQUFBLFdBQVdBLENBd0NyQkE7SUF4Q1VBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLFFBQVFBLENBd0M5QkE7UUF4Q3NCQSxXQUFBQSxRQUFRQTtZQUFDaUIsSUFBQUEsR0FBR0EsQ0F3Q2xDQTtZQXhDK0JBLFdBQUFBLEdBQUdBLEVBQUNBLENBQUNBO2dCQUNqQ2tGLElBQWFBLGFBQWFBO29CQUV0QkssU0FGU0EsYUFBYUEsQ0FFREEsY0FBY0E7d0JBQWRDLG1CQUFjQSxHQUFkQSxjQUFjQSxDQUFBQTt3QkFDL0JBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLGNBQWNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO29CQUNoREEsQ0FBQ0E7b0JBQ0RELDJCQUEyQkE7b0JBQ25CQSxrQ0FBVUEsR0FBbEJBLFVBQW9CQSxLQUFhQSxFQUFFQSxPQUFtQkE7d0JBQ2xERSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxFQUFFQTs0QkFDN0JBLE1BQU1BLEVBQUdBLG9DQUFvQ0E7eUJBQ2hEQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtvQkFDaEJBLENBQUNBO29CQUNPRixxQ0FBYUEsR0FBckJBLFVBQXVCQSxLQUFhQSxFQUFFQSxZQUFvQkE7d0JBQTFERyxpQkFhQ0E7d0JBWkdBLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLFVBQUNBLE9BQU9BOzRCQUV2QkEsQUFEQUEsc0RBQXNEQTs0QkFDdERBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLEVBQUVBO2dDQUM3QkEsT0FBT0EsRUFBR0EsZ0JBQWdCQTtnQ0FDMUJBLE1BQU1BLEVBQUdBLFlBQVlBOzZCQUN4QkEsRUFBRUE7Z0NBQ0NBLEVBQUVBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLGFBQWFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO29DQUM1QkEsTUFBTUEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsRUFBRUEsS0FBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7Z0NBQy9FQSxDQUFDQTtnQ0FDREEsS0FBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3BDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDUEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLENBQUNBO29CQUNESCwrQkFBT0EsR0FBUEEsVUFBUUEsS0FBYUE7d0JBQXJCSSxpQkFZQ0E7d0JBWEdBLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQU9BLFVBQUNBLE9BQW1CQTs0QkFFekNBLEFBREFBLHdCQUF3QkE7NEJBQ3hCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxFQUFFQTtnQ0FDN0JBLE1BQU1BLEVBQUdBLDZCQUE2QkE7NkJBQ3pDQSxFQUFFQSxVQUFDQSxNQUFhQTtnQ0FDYkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsSUFBSUEsTUFBTUEsQ0FBQ0EsTUFBTUEsSUFBSUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQ3ZDQSxNQUFNQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtnQ0FDckJBLENBQUNBO2dDQUNEQSxLQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxFQUFFQSxLQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTs0QkFDeEVBLENBQUNBLENBQUNBLENBQUNBO3dCQUNQQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0E7b0JBQ0xKLG9CQUFDQTtnQkFBREEsQ0FBQ0EsQUF0Q0RMLElBc0NDQTtnQkF0Q1lBLGlCQUFhQSxHQUFiQSxhQXNDWkEsQ0FBQUE7WUFDTEEsQ0FBQ0EsRUF4QytCbEYsR0FBR0EsR0FBSEEsWUFBR0EsS0FBSEEsWUFBR0EsUUF3Q2xDQTtRQUFEQSxDQUFDQSxFQXhDc0JqQixRQUFRQSxHQUFSQSxvQkFBUUEsS0FBUkEsb0JBQVFBLFFBd0M5QkE7SUFBREEsQ0FBQ0EsRUF4Q1VmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBd0NyQkE7QUFBREEsQ0FBQ0EsRUF4Q00sR0FBRyxLQUFILEdBQUcsUUF3Q1Q7QUN4Q0QsSUFBTyxHQUFHLENBaUVUO0FBakVELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxXQUFXQSxDQWlFckJBO0lBakVVQSxXQUFBQSxXQUFXQTtRQUFDZSxJQUFBQSxRQUFRQSxDQWlFOUJBO1FBakVzQkEsV0FBQUEsUUFBUUE7WUFBQ2lCLElBQUFBLEdBQUdBLENBaUVsQ0E7WUFqRStCQSxXQUFBQSxHQUFHQSxFQUFDQSxDQUFDQTtnQkFDakNrRixJQUFhQSxPQUFPQTtvQkFNaEJVLFNBTlNBLE9BQU9BLENBT1pBLEdBQW9CQSxFQUNaQSxVQUErQ0E7d0JBQS9DQyxlQUFVQSxHQUFWQSxVQUFVQSxDQUFxQ0E7d0JBTm5EQSx1QkFBa0JBLEdBQXFDQSxFQUFFQSxDQUFDQTt3QkFDMURBLDBCQUFxQkEsR0FBc0JBLEVBQUVBLENBQUNBO3dCQUM5Q0EsdUJBQWtCQSxHQUFzQkEsRUFBRUEsQ0FBQ0E7d0JBUTNDQSxpQkFBWUEsR0FBR0Esa0JBQWtCQSxDQUFDQTt3QkFGdENBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLFNBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUM5QkEsQ0FBQ0E7b0JBRURELHlCQUFPQSxHQUFQQTt3QkFBQUUsaUJBWUNBO3dCQVhHQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQTs0QkFDOUJBLEtBQUlBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBOzRCQUNuQkEsS0FBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsV0FBV0EsRUFBRUE7Z0NBQzlCQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQ0FDN0JBLE1BQU1BLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO2dDQUNuQkEsQ0FBQ0E7NEJBQ0xBLENBQUNBLENBQUNBLENBQUNBOzRCQUNIQSxLQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxXQUFXQSxDQUFDQSxXQUFXQSxFQUFFQTtnQ0FDOUJBLEtBQUlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBOzRCQUNyQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ1BBLENBQUNBLENBQUNBLENBQUNBO29CQUNQQSxDQUFDQTtvQkFDT0YsMkJBQVNBLEdBQWpCQTt3QkFBQUcsaUJBYUNBO3dCQVpHQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTt3QkFDaENBLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLFVBQUNBLE9BQW1CQSxFQUFFQSxNQUFzQ0E7NEJBQzNFQSxLQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQTtnQ0FDdkJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLEVBQUVBLFVBQUNBLEdBQUdBO29DQUN2QkEsS0FBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEsU0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0NBQzFCQSxLQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLE9BQU9BLENBQUNBLFVBQUFBLFFBQVdBLElBQUNBLE9BQUFBLFFBQVFBLEVBQUVBLEVBQVZBLENBQVVBLENBQUNBLENBQUNBO29DQUN4REEsS0FBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFBQSxRQUFXQSxJQUFDQSxPQUFBQSxLQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxFQUE1QkEsQ0FBNEJBLENBQUNBLENBQUNBO29DQUMxRUEsS0FBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFBQSxRQUFXQSxJQUFDQSxPQUFBQSxLQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxZQUFZQSxDQUFDQSxRQUFRQSxDQUFDQSxFQUEvQkEsQ0FBK0JBLENBQUNBLENBQUNBO29DQUNoRkEsT0FBT0EsRUFBRUEsQ0FBQ0E7Z0NBQ2RBLENBQUNBLENBQUNBLENBQUNBOzRCQUNQQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTt3QkFDckJBLENBQUNBLENBQUNBLENBQUNBO29CQUNQQSxDQUFDQTtvQkFDREgsMEJBQVFBLEdBQVJBO3dCQUNJSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtvQkFDL0JBLENBQUNBO29CQUNESiwyQkFBU0EsR0FBVEE7d0JBQ0lLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO29CQUNoQ0EsQ0FBQ0E7b0JBQ0RMLDZCQUFXQSxHQUFYQSxVQUFhQSxPQUFlQTt3QkFDeEJNLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO29CQUNsQ0EsQ0FBQ0E7b0JBQ0ROLDZCQUFXQSxHQUFYQSxVQUFhQSxPQUFlQTt3QkFDeEJPLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO29CQUN6Q0EsQ0FBQ0E7b0JBQ0RQLDJCQUFTQSxHQUFUQSxVQUFXQSxRQUFtQ0E7d0JBQzFDUSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO3dCQUN2Q0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBQ2pDQSxDQUFDQTtvQkFDRFIsMkJBQVNBLEdBQVRBLFVBQVdBLFFBQW9CQTt3QkFDM0JTLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBQzNDQSxDQUFDQTtvQkFDRFQsOEJBQVlBLEdBQVpBLFVBQWNBLFFBQW9CQTt3QkFDOUJVLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7d0JBQzFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxZQUFZQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQkFDcENBLENBQUNBO29CQUNMVixjQUFDQTtnQkFBREEsQ0FBQ0EsQUEvRERWLElBK0RDQTtnQkEvRFlBLFdBQU9BLEdBQVBBLE9BK0RaQSxDQUFBQTtZQUNMQSxDQUFDQSxFQWpFK0JsRixHQUFHQSxHQUFIQSxZQUFHQSxLQUFIQSxZQUFHQSxRQWlFbENBO1FBQURBLENBQUNBLEVBakVzQmpCLFFBQVFBLEdBQVJBLG9CQUFRQSxLQUFSQSxvQkFBUUEsUUFpRTlCQTtJQUFEQSxDQUFDQSxFQWpFVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUFpRXJCQTtBQUFEQSxDQUFDQSxFQWpFTSxHQUFHLEtBQUgsR0FBRyxRQWlFVDtBQ2pFRCxJQUFPLEdBQUcsQ0F1RlQ7QUF2RkQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLFdBQVdBLENBdUZyQkE7SUF2RlVBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLFFBQVFBLENBdUY5QkE7UUF2RnNCQSxXQUFBQSxRQUFRQTtZQUFDaUIsSUFBQUEsR0FBR0EsQ0F1RmxDQTtZQXZGK0JBLFdBQUFBLEdBQUdBLEVBQUNBLENBQUNBO2dCQUNqQ2tGLElBQWFBLEtBQUtBO29CQUFTcUIsVUFBZEEsS0FBS0EsVUFBcUJBO29CQUduQ0EsU0FIU0EsS0FBS0EsQ0FJRkEsR0FBb0JBO3dCQUU1QkMsaUJBQU9BLENBQUNBO3dCQUZBQSxRQUFHQSxHQUFIQSxHQUFHQSxDQUFpQkE7d0JBRnhCQSxnQ0FBMkJBLEdBQUdBLElBQUlBLENBQUNBO3dCQUt2Q0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxDQUFDQTtvQkFDREQsd0JBQVFBLEdBQVJBO3dCQUNJRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQTtvQkFDdkJBLENBQUNBO29CQUNERix5QkFBU0EsR0FBVEE7d0JBQ0lHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBO29CQUN4QkEsQ0FBQ0E7b0JBQ09ILDhCQUFjQSxHQUF0QkE7d0JBQUFJLGlCQWlCQ0E7d0JBaEJHQSxJQUFJQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQTt3QkFDcEJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFdBQVdBLENBQUNBLFVBQUNBLEtBQWFBLEVBQUVBLFVBQXFDQSxFQUFFQSxHQUFvQkE7NEJBQ3pHQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDeEJBLE1BQU1BLENBQUNBOzRCQUNYQSxDQUFDQTs0QkFDREEsS0FBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7NEJBQ2xCQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxLQUFLQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDbkNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBO2dDQUNoQkEsTUFBTUEsQ0FBQ0E7NEJBQ1hBLENBQUNBOzRCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDVkEsTUFBTUEsQ0FBQ0E7NEJBQ1hBLENBQUNBOzRCQUNEQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTs0QkFDZkEsS0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7d0JBQzNCQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0E7b0JBQ0RKLDJCQUFXQSxHQUFYQSxVQUFhQSxPQUFlQTt3QkFDeEJLLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO29CQUNuQ0EsQ0FBQ0E7b0JBQ0RMLDJCQUFXQSxHQUFYQSxVQUFhQSxPQUFlQTt3QkFBNUJNLGlCQTBCQ0E7d0JBekJHQSxNQUFNQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxVQUFDQSxPQUFPQSxFQUFFQSxNQUFNQTs0QkFDL0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLE9BQU9BLEVBQUVBLFVBQUNBLE1BQU1BO2dDQUNqREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQ1ZBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0E7Z0NBQ3BDQSxDQUFDQTtnQ0FDREEsSUFBSUEsT0FBT0EsR0FBR0E7b0NBQ1ZBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO3dDQUNiQSxNQUFNQSxDQUFDQTtvQ0FDWEEsQ0FBQ0E7b0NBQ0RBLEVBQUVBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEtBQUtBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO3dDQUNqQ0EsTUFBTUEsQ0FBQ0E7b0NBQ1hBLENBQUNBO29DQUNEQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtvQ0FDdEJBLGFBQWFBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO29DQUN4QkEsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsa0JBQU1BLENBQUNBLE9BQU9BLENBQUNBLHlCQUF5QkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0NBQ3pFQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtnQ0FDN0JBLENBQUNBLENBQUNBO2dDQUNGQSxJQUFJQSxRQUFRQSxHQUFHQSxXQUFXQSxDQUFDQSxPQUFPQSxFQUFFQSxLQUFJQSxDQUFDQSwyQkFBMkJBLENBQUNBLENBQUNBO2dDQUN0RUEsSUFBSUEsT0FBT0EsR0FBR0EsVUFBVUEsQ0FBQ0E7b0NBQ3JCQSxhQUFhQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQ0FDeEJBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0E7Z0NBQ3pDQSxDQUFDQSxFQUFFQSxLQUFJQSxDQUFDQSwyQkFBMkJBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBO2dDQUMxQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7NEJBQ2RBLENBQUNBLENBQUNBLENBQUNBO3dCQUNQQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0E7b0JBQ0ROLHVCQUFPQSxHQUFQQTt3QkFBQU8saUJBV0NBO3dCQVZHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxXQUFXQSxDQUFDQTs0QkFDL0JBLEtBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO3dCQUN0QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ0hBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFdBQVdBLENBQUNBLFVBQUNBLEtBQWFBLEVBQUVBLFVBQXFDQTs0QkFDbkZBLEVBQUVBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dDQUN4QkEsTUFBTUEsQ0FBQ0E7NEJBQ1hBLENBQUNBOzRCQUNEQSxLQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTt3QkFDM0JBLENBQUNBLENBQUNBLENBQUNBO3dCQUNIQSxJQUFJQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtvQkFDMUJBLENBQUNBO29CQUNEUCx5QkFBU0EsR0FBVEEsVUFBV0EsUUFBbUNBO3dCQUMxQ1EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBQzlDQSxDQUFDQTtvQkFDRFIsNEJBQVlBLEdBQVpBLFVBQWNBLFFBQW9CQTt3QkFDOUJTLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO29CQUNqREEsQ0FBQ0E7b0JBQ09ULDBCQUFVQSxHQUFsQkE7d0JBQ0lVLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO3dCQUNqQkEsT0FBT0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7b0JBQ3JCQSxDQUFDQTtvQkFDTFYsWUFBQ0E7Z0JBQURBLENBQUNBLEFBckZEckIsRUFBMkJBLFlBQVlBLEVBcUZ0Q0E7Z0JBckZZQSxTQUFLQSxHQUFMQSxLQXFGWkEsQ0FBQUE7WUFDTEEsQ0FBQ0EsRUF2RitCbEYsR0FBR0EsR0FBSEEsWUFBR0EsS0FBSEEsWUFBR0EsUUF1RmxDQTtRQUFEQSxDQUFDQSxFQXZGc0JqQixRQUFRQSxHQUFSQSxvQkFBUUEsS0FBUkEsb0JBQVFBLFFBdUY5QkE7SUFBREEsQ0FBQ0EsRUF2RlVmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBdUZyQkE7QUFBREEsQ0FBQ0EsRUF2Rk0sR0FBRyxLQUFILEdBQUcsUUF1RlQ7QUN2RkQsSUFBTyxHQUFHLENBT1Q7QUFQRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0FPckJBO0lBUFVBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLE1BQU1BLENBTzVCQTtRQVBzQkEsV0FBQUEsTUFBTUE7WUFBQytELElBQUFBLE9BQU9BLENBT3BDQTtZQVA2QkEsV0FBQUEsT0FBT0E7Z0JBQUNLLElBQUFBLFVBQVVBLENBTy9DQTtnQkFQcUNBLFdBQUFBLFVBQVVBLEVBQUNBLENBQUNBO29CQUM5QytELElBQWFBLEtBQUtBO3dCQUFTQyxVQUFkQSxLQUFLQSxVQUFzQkE7d0JBRXBDQSxTQUZTQSxLQUFLQSxDQUVNQSxPQUFpQ0EsRUFBU0EsdUJBQWdDQTs0QkFDMUZDLGlCQUFPQSxDQUFDQTs0QkFEUUEsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBMEJBOzRCQUFTQSw0QkFBdUJBLEdBQXZCQSx1QkFBdUJBLENBQVNBO3dCQUU5RkEsQ0FBQ0E7d0JBSE1ELGlCQUFXQSxHQUFHQSxZQUFZQSxDQUFDQTt3QkFJdENBLFlBQUNBO29CQUFEQSxDQUFDQSxBQUxERCxFQUEyQkEsT0FBT0EsQ0FBQ0EsS0FBS0EsRUFLdkNBO29CQUxZQSxnQkFBS0EsR0FBTEEsS0FLWkEsQ0FBQUE7Z0JBQ0xBLENBQUNBLEVBUHFDL0QsVUFBVUEsR0FBVkEsa0JBQVVBLEtBQVZBLGtCQUFVQSxRQU8vQ0E7WUFBREEsQ0FBQ0EsRUFQNkJMLE9BQU9BLEdBQVBBLGNBQU9BLEtBQVBBLGNBQU9BLFFBT3BDQTtRQUFEQSxDQUFDQSxFQVBzQi9ELE1BQU1BLEdBQU5BLGtCQUFNQSxLQUFOQSxrQkFBTUEsUUFPNUJBO0lBQURBLENBQUNBLEVBUFVmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBT3JCQTtBQUFEQSxDQUFDQSxFQVBNLEdBQUcsS0FBSCxHQUFHLFFBT1Q7QUNQRCxJQUFPLEdBQUcsQ0FtQlQ7QUFuQkQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLFdBQVdBLENBbUJyQkE7SUFuQlVBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLE1BQU1BLENBbUI1QkE7UUFuQnNCQSxXQUFBQSxNQUFNQTtZQUFDK0QsSUFBQUEsT0FBT0EsQ0FtQnBDQTtZQW5CNkJBLFdBQUFBLE9BQU9BO2dCQUFDSyxJQUFBQSxVQUFVQSxDQW1CL0NBO2dCQW5CcUNBLFdBQUFBLFVBQVVBLEVBQUNBLENBQUNBO29CQUM5QytELElBQWFBLFVBQVVBO3dCQUFTRyxVQUFuQkEsVUFBVUEsVUFBMkJBO3dCQUFsREEsU0FBYUEsVUFBVUE7NEJBQVNDLDhCQUFrQkE7NEJBQzlDQSxlQUFVQSxHQUFHQSxJQUFJQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTt3QkFnQnJEQSxDQUFDQTt3QkFkR0QsNkJBQVFBLEdBQVJBLFVBQVVBLE9BQWNBOzRCQUNwQkUsTUFBTUEsQ0FBQ0E7Z0NBQ0hBLE1BQU1BLEVBQUdBLGdCQUFLQSxDQUFDQSxXQUFXQTtnQ0FDMUJBLFNBQVNBLEVBQUdBO29DQUNSQSxTQUFTQSxFQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtvQ0FDckRBLHlCQUF5QkEsRUFBR0EsT0FBT0EsQ0FBQ0EsdUJBQXVCQTtpQ0FDOURBOzZCQUNKQSxDQUFDQTt3QkFDTkEsQ0FBQ0E7d0JBQ0RGLCtCQUFVQSxHQUFWQSxVQUFZQSxPQUFlQTs0QkFDdkJHLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBOzRCQUN4RUEsSUFBSUEsdUJBQXVCQSxHQUFHQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSx5QkFBeUJBLENBQUNBLENBQUNBOzRCQUM5RUEsTUFBTUEsQ0FBQ0EsSUFBSUEsZ0JBQUtBLENBQUNBLE9BQU9BLEVBQUVBLHVCQUF1QkEsQ0FBQ0EsQ0FBQ0E7d0JBQ3ZEQSxDQUFDQTt3QkFDTEgsaUJBQUNBO29CQUFEQSxDQUFDQSxBQWpCREgsRUFBZ0NBLE9BQU9BLENBQUNBLFVBQVVBLEVBaUJqREE7b0JBakJZQSxxQkFBVUEsR0FBVkEsVUFpQlpBLENBQUFBO2dCQUNMQSxDQUFDQSxFQW5CcUMvRCxVQUFVQSxHQUFWQSxrQkFBVUEsS0FBVkEsa0JBQVVBLFFBbUIvQ0E7WUFBREEsQ0FBQ0EsRUFuQjZCTCxPQUFPQSxHQUFQQSxjQUFPQSxLQUFQQSxjQUFPQSxRQW1CcENBO1FBQURBLENBQUNBLEVBbkJzQi9ELE1BQU1BLEdBQU5BLGtCQUFNQSxLQUFOQSxrQkFBTUEsUUFtQjVCQTtJQUFEQSxDQUFDQSxFQW5CVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUFtQnJCQTtBQUFEQSxDQUFDQSxFQW5CTSxHQUFHLEtBQUgsR0FBRyxRQW1CVDtBQ25CRCxJQUFPLEdBQUcsQ0FPVDtBQVBELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxXQUFXQSxDQU9yQkE7SUFQVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsTUFBTUEsQ0FPNUJBO1FBUHNCQSxXQUFBQSxNQUFNQTtZQUFDK0QsSUFBQUEsT0FBT0EsQ0FPcENBO1lBUDZCQSxXQUFBQSxPQUFPQTtnQkFBQ0ssSUFBQUEsV0FBV0EsQ0FPaERBO2dCQVBxQ0EsV0FBQUEsV0FBV0EsRUFBQ0EsQ0FBQ0E7b0JBQy9Dc0UsSUFBYUEsS0FBS0E7d0JBQVNDLFVBQWRBLEtBQUtBLFVBQXNCQTt3QkFFcENBLFNBRlNBLEtBQUtBLENBRU1BLE9BQWlDQTs0QkFDakRDLGlCQUFPQSxDQUFDQTs0QkFEUUEsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBMEJBO3dCQUVyREEsQ0FBQ0E7d0JBSE1ELGlCQUFXQSxHQUFHQSxhQUFhQSxDQUFDQTt3QkFJdkNBLFlBQUNBO29CQUFEQSxDQUFDQSxBQUxERCxFQUEyQkEsT0FBT0EsQ0FBQ0EsS0FBS0EsRUFLdkNBO29CQUxZQSxpQkFBS0EsR0FBTEEsS0FLWkEsQ0FBQUE7Z0JBQ0xBLENBQUNBLEVBUHFDdEUsV0FBV0EsR0FBWEEsbUJBQVdBLEtBQVhBLG1CQUFXQSxRQU9oREE7WUFBREEsQ0FBQ0EsRUFQNkJMLE9BQU9BLEdBQVBBLGNBQU9BLEtBQVBBLGNBQU9BLFFBT3BDQTtRQUFEQSxDQUFDQSxFQVBzQi9ELE1BQU1BLEdBQU5BLGtCQUFNQSxLQUFOQSxrQkFBTUEsUUFPNUJBO0lBQURBLENBQUNBLEVBUFVmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBT3JCQTtBQUFEQSxDQUFDQSxFQVBNLEdBQUcsS0FBSCxHQUFHLFFBT1Q7QUNQRCxJQUFPLEdBQUcsQ0FjVDtBQWRELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxXQUFXQSxDQWNyQkE7SUFkVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsTUFBTUEsQ0FjNUJBO1FBZHNCQSxXQUFBQSxNQUFNQTtZQUFDK0QsSUFBQUEsT0FBT0EsQ0FjcENBO1lBZDZCQSxXQUFBQSxPQUFPQTtnQkFBQ0ssSUFBQUEsV0FBV0EsQ0FjaERBO2dCQWRxQ0EsV0FBQUEsV0FBV0EsRUFBQ0EsQ0FBQ0E7b0JBQy9Dc0UsSUFBYUEsVUFBVUE7d0JBQVNHLFVBQW5CQSxVQUFVQSxVQUEyQkE7d0JBQWxEQSxTQUFhQSxVQUFVQTs0QkFBU0MsOEJBQWtCQTs0QkFDOUNBLGVBQVVBLEdBQUdBLElBQUlBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO3dCQVdyREEsQ0FBQ0E7d0JBVEdELDZCQUFRQSxHQUFSQSxVQUFVQSxPQUFjQTs0QkFDcEJFLE1BQU1BLENBQUNBO2dDQUNIQSxNQUFNQSxFQUFHQSxpQkFBS0EsQ0FBQ0EsV0FBV0E7Z0NBQzFCQSxTQUFTQSxFQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTs2QkFDeERBLENBQUNBO3dCQUNOQSxDQUFDQTt3QkFDREYsK0JBQVVBLEdBQVZBLFVBQVlBLE9BQWVBOzRCQUN2QkcsTUFBTUEsQ0FBQ0EsSUFBSUEsaUJBQUtBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNyRUEsQ0FBQ0E7d0JBQ0xILGlCQUFDQTtvQkFBREEsQ0FBQ0EsQUFaREgsRUFBZ0NBLE9BQU9BLENBQUNBLFVBQVVBLEVBWWpEQTtvQkFaWUEsc0JBQVVBLEdBQVZBLFVBWVpBLENBQUFBO2dCQUNMQSxDQUFDQSxFQWRxQ3RFLFdBQVdBLEdBQVhBLG1CQUFXQSxLQUFYQSxtQkFBV0EsUUFjaERBO1lBQURBLENBQUNBLEVBZDZCTCxPQUFPQSxHQUFQQSxjQUFPQSxLQUFQQSxjQUFPQSxRQWNwQ0E7UUFBREEsQ0FBQ0EsRUFkc0IvRCxNQUFNQSxHQUFOQSxrQkFBTUEsS0FBTkEsa0JBQU1BLFFBYzVCQTtJQUFEQSxDQUFDQSxFQWRVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQWNyQkE7QUFBREEsQ0FBQ0EsRUFkTSxHQUFHLEtBQUgsR0FBRyxRQWNUO0FDZEQsSUFBTyxHQUFHLENBT1Q7QUFQRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0FPckJBO0lBUFVBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLE1BQU1BLENBTzVCQTtRQVBzQkEsV0FBQUEsTUFBTUE7WUFBQytELElBQUFBLE9BQU9BLENBT3BDQTtZQVA2QkEsV0FBQUEsT0FBT0E7Z0JBQUNLLElBQUFBLGVBQWVBLENBT3BEQTtnQkFQcUNBLFdBQUFBLGVBQWVBLEVBQUNBLENBQUNBO29CQUNuRDZFLElBQWFBLEtBQUtBO3dCQUFTQyxVQUFkQSxLQUFLQSxVQUFzQkE7d0JBRXBDQSxTQUZTQSxLQUFLQSxDQUVNQSxXQUF5Q0E7NEJBQ3pEQyxpQkFBT0EsQ0FBQ0E7NEJBRFFBLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUE4QkE7d0JBRTdEQSxDQUFDQTt3QkFITUQsaUJBQVdBLEdBQUdBLGlCQUFpQkEsQ0FBQ0E7d0JBSTNDQSxZQUFDQTtvQkFBREEsQ0FBQ0EsQUFMREQsRUFBMkJBLE9BQU9BLENBQUNBLEtBQUtBLEVBS3ZDQTtvQkFMWUEscUJBQUtBLEdBQUxBLEtBS1pBLENBQUFBO2dCQUNMQSxDQUFDQSxFQVBxQzdFLGVBQWVBLEdBQWZBLHVCQUFlQSxLQUFmQSx1QkFBZUEsUUFPcERBO1lBQURBLENBQUNBLEVBUDZCTCxPQUFPQSxHQUFQQSxjQUFPQSxLQUFQQSxjQUFPQSxRQU9wQ0E7UUFBREEsQ0FBQ0EsRUFQc0IvRCxNQUFNQSxHQUFOQSxrQkFBTUEsS0FBTkEsa0JBQU1BLFFBTzVCQTtJQUFEQSxDQUFDQSxFQVBVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQU9yQkE7QUFBREEsQ0FBQ0EsRUFQTSxHQUFHLEtBQUgsR0FBRyxRQU9UO0FDUEQsSUFBTyxHQUFHLENBY1Q7QUFkRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsV0FBV0EsQ0FjckJBO0lBZFVBLFdBQUFBLFdBQVdBO1FBQUNlLElBQUFBLE1BQU1BLENBYzVCQTtRQWRzQkEsV0FBQUEsTUFBTUE7WUFBQytELElBQUFBLE9BQU9BLENBY3BDQTtZQWQ2QkEsV0FBQUEsT0FBT0E7Z0JBQUNLLElBQUFBLGVBQWVBLENBY3BEQTtnQkFkcUNBLFdBQUFBLGVBQWVBLEVBQUNBLENBQUNBO29CQUNuRDZFLElBQWFBLFVBQVVBO3dCQUFTRyxVQUFuQkEsVUFBVUEsVUFBMkJBO3dCQUFsREEsU0FBYUEsVUFBVUE7NEJBQVNDLDhCQUFrQkE7NEJBQzlDQSxlQUFVQSxHQUFHQSxJQUFJQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTt3QkFXekRBLENBQUNBO3dCQVRHRCw2QkFBUUEsR0FBUkEsVUFBVUEsT0FBY0E7NEJBQ3BCRSxNQUFNQSxDQUFDQTtnQ0FDSEEsTUFBTUEsRUFBR0EscUJBQUtBLENBQUNBLFdBQVdBO2dDQUMxQkEsU0FBU0EsRUFBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7NkJBQzVEQSxDQUFDQTt3QkFDTkEsQ0FBQ0E7d0JBQ0RGLCtCQUFVQSxHQUFWQSxVQUFZQSxPQUFlQTs0QkFDdkJHLE1BQU1BLENBQUNBLElBQUlBLHFCQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckVBLENBQUNBO3dCQUNMSCxpQkFBQ0E7b0JBQURBLENBQUNBLEFBWkRILEVBQWdDQSxPQUFPQSxDQUFDQSxVQUFVQSxFQVlqREE7b0JBWllBLDBCQUFVQSxHQUFWQSxVQVlaQSxDQUFBQTtnQkFDTEEsQ0FBQ0EsRUFkcUM3RSxlQUFlQSxHQUFmQSx1QkFBZUEsS0FBZkEsdUJBQWVBLFFBY3BEQTtZQUFEQSxDQUFDQSxFQWQ2QkwsT0FBT0EsR0FBUEEsY0FBT0EsS0FBUEEsY0FBT0EsUUFjcENBO1FBQURBLENBQUNBLEVBZHNCL0QsTUFBTUEsR0FBTkEsa0JBQU1BLEtBQU5BLGtCQUFNQSxRQWM1QkE7SUFBREEsQ0FBQ0EsRUFkVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUFjckJBO0FBQURBLENBQUNBLEVBZE0sR0FBRyxLQUFILEdBQUcsUUFjVDtBQ2RELElBQU8sR0FBRyxDQU9UO0FBUEQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLFdBQVdBLENBT3JCQTtJQVBVQSxXQUFBQSxXQUFXQTtRQUFDZSxJQUFBQSxNQUFNQSxDQU81QkE7UUFQc0JBLFdBQUFBLE1BQU1BO1lBQUMrRCxJQUFBQSxPQUFPQSxDQU9wQ0E7WUFQNkJBLFdBQUFBLE9BQU9BO2dCQUFDSyxJQUFBQSwwQkFBMEJBLENBTy9EQTtnQkFQcUNBLFdBQUFBLDBCQUEwQkEsRUFBQ0EsQ0FBQ0E7b0JBQzlEb0YsSUFBYUEsS0FBS0E7d0JBQVNDLFVBQWRBLEtBQUtBLFVBQXNCQTt3QkFFcENBLFNBRlNBLEtBQUtBLENBRU1BLE9BQThCQTs0QkFDOUNDLGlCQUFPQSxDQUFDQTs0QkFEUUEsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBdUJBO3dCQUVsREEsQ0FBQ0E7d0JBSE1ELGlCQUFXQSxHQUFHQSw0QkFBNEJBLENBQUNBO3dCQUl0REEsWUFBQ0E7b0JBQURBLENBQUNBLEFBTERELEVBQTJCQSxPQUFPQSxDQUFDQSxLQUFLQSxFQUt2Q0E7b0JBTFlBLGdDQUFLQSxHQUFMQSxLQUtaQSxDQUFBQTtnQkFDTEEsQ0FBQ0EsRUFQcUNwRiwwQkFBMEJBLEdBQTFCQSxrQ0FBMEJBLEtBQTFCQSxrQ0FBMEJBLFFBTy9EQTtZQUFEQSxDQUFDQSxFQVA2QkwsT0FBT0EsR0FBUEEsY0FBT0EsS0FBUEEsY0FBT0EsUUFPcENBO1FBQURBLENBQUNBLEVBUHNCL0QsTUFBTUEsR0FBTkEsa0JBQU1BLEtBQU5BLGtCQUFNQSxRQU81QkE7SUFBREEsQ0FBQ0EsRUFQVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUFPckJBO0FBQURBLENBQUNBLEVBUE0sR0FBRyxLQUFILEdBQUcsUUFPVDtBQ1BELElBQU8sR0FBRyxDQWNUO0FBZEQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLFdBQVdBLENBY3JCQTtJQWRVQSxXQUFBQSxXQUFXQTtRQUFDZSxJQUFBQSxNQUFNQSxDQWM1QkE7UUFkc0JBLFdBQUFBLE1BQU1BO1lBQUMrRCxJQUFBQSxPQUFPQSxDQWNwQ0E7WUFkNkJBLFdBQUFBLE9BQU9BO2dCQUFDSyxJQUFBQSwwQkFBMEJBLENBYy9EQTtnQkFkcUNBLFdBQUFBLDBCQUEwQkEsRUFBQ0EsQ0FBQ0E7b0JBQzlEb0YsSUFBYUEsVUFBVUE7d0JBQVNHLFVBQW5CQSxVQUFVQSxVQUEyQkE7d0JBQWxEQSxTQUFhQSxVQUFVQTs0QkFBU0MsOEJBQWtCQTs0QkFDOUNBLGVBQVVBLEdBQUdBLElBQUlBLHNCQUFlQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTt3QkFXbERBLENBQUNBO3dCQVRHRCw2QkFBUUEsR0FBUkEsVUFBVUEsT0FBY0E7NEJBQ3BCRSxNQUFNQSxDQUFDQTtnQ0FDSEEsTUFBTUEsRUFBR0EsZ0NBQUtBLENBQUNBLFdBQVdBO2dDQUMxQkEsU0FBU0EsRUFBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7NkJBQ3hEQSxDQUFDQTt3QkFDTkEsQ0FBQ0E7d0JBQ0RGLCtCQUFVQSxHQUFWQSxVQUFZQSxPQUFlQTs0QkFDdkJHLE1BQU1BLENBQUNBLElBQUlBLGdDQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckVBLENBQUNBO3dCQUNMSCxpQkFBQ0E7b0JBQURBLENBQUNBLEFBWkRILEVBQWdDQSxPQUFPQSxDQUFDQSxVQUFVQSxFQVlqREE7b0JBWllBLHFDQUFVQSxHQUFWQSxVQVlaQSxDQUFBQTtnQkFDTEEsQ0FBQ0EsRUFkcUNwRiwwQkFBMEJBLEdBQTFCQSxrQ0FBMEJBLEtBQTFCQSxrQ0FBMEJBLFFBYy9EQTtZQUFEQSxDQUFDQSxFQWQ2QkwsT0FBT0EsR0FBUEEsY0FBT0EsS0FBUEEsY0FBT0EsUUFjcENBO1FBQURBLENBQUNBLEVBZHNCL0QsTUFBTUEsR0FBTkEsa0JBQU1BLEtBQU5BLGtCQUFNQSxRQWM1QkE7SUFBREEsQ0FBQ0EsRUFkVWYsV0FBV0EsR0FBWEEsZUFBV0EsS0FBWEEsZUFBV0EsUUFjckJBO0FBQURBLENBQUNBLEVBZE0sR0FBRyxLQUFILEdBQUcsUUFjVDtBQ2RELElBQU8sR0FBRyxDQWVUO0FBZkQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLFdBQVdBLENBZXJCQTtJQWZVQSxXQUFBQSxXQUFXQTtRQUFDZSxJQUFBQSxNQUFNQSxDQWU1QkE7UUFmc0JBLFdBQUFBLE1BQU1BO1lBQUMrRCxJQUFBQSxPQUFPQSxDQWVwQ0E7WUFmNkJBLFdBQUFBLE9BQU9BO2dCQUFDSyxJQUFBQSx5QkFBeUJBLENBZTlEQTtnQkFmcUNBLFdBQUFBLHlCQUF5QkEsRUFBQ0EsQ0FBQ0E7b0JBQzdEMkYsSUFBYUEsS0FBS0E7d0JBQVNDLFVBQWRBLEtBQUtBLFVBQXNCQTt3QkFNcENBLGdCQUFnQkE7d0JBQ2hCQSxTQVBTQSxLQUFLQSxDQU9NQSxPQUFzQkE7NEJBQTdCQyx1QkFBNkJBLEdBQTdCQSxjQUE2QkE7NEJBQ3RDQSxpQkFBT0EsQ0FBQ0E7NEJBRFFBLFlBQU9BLEdBQVBBLE9BQU9BLENBQWVBOzRCQUxsQ0EsaUJBQVlBLEdBQUdBO2dDQUNuQkEsSUFBSUE7Z0NBQ0pBLElBQUlBOzZCQUNQQSxDQUFDQTs0QkFJRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQ3ZDQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxrQkFBa0JBLEdBQUNBLE9BQU9BLENBQUNBLENBQUNBOzRCQUNoREEsQ0FBQ0E7d0JBQ0xBLENBQUNBO3dCQVhNRCxpQkFBV0EsR0FBR0EsMkJBQTJCQSxDQUFDQTt3QkFZckRBLFlBQUNBO29CQUFEQSxDQUFDQSxBQWJERCxFQUEyQkEsT0FBT0EsQ0FBQ0EsS0FBS0EsRUFhdkNBO29CQWJZQSwrQkFBS0EsR0FBTEEsS0FhWkEsQ0FBQUE7Z0JBQ0xBLENBQUNBLEVBZnFDM0YseUJBQXlCQSxHQUF6QkEsaUNBQXlCQSxLQUF6QkEsaUNBQXlCQSxRQWU5REE7WUFBREEsQ0FBQ0EsRUFmNkJMLE9BQU9BLEdBQVBBLGNBQU9BLEtBQVBBLGNBQU9BLFFBZXBDQTtRQUFEQSxDQUFDQSxFQWZzQi9ELE1BQU1BLEdBQU5BLGtCQUFNQSxLQUFOQSxrQkFBTUEsUUFlNUJBO0lBQURBLENBQUNBLEVBZlVmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBZXJCQTtBQUFEQSxDQUFDQSxFQWZNLEdBQUcsS0FBSCxHQUFHLFFBZVQ7QUNmRCxJQUFPLEdBQUcsQ0FZVDtBQVpELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxXQUFXQSxDQVlyQkE7SUFaVUEsV0FBQUEsV0FBV0E7UUFBQ2UsSUFBQUEsTUFBTUEsQ0FZNUJBO1FBWnNCQSxXQUFBQSxNQUFNQTtZQUFDK0QsSUFBQUEsT0FBT0EsQ0FZcENBO1lBWjZCQSxXQUFBQSxPQUFPQTtnQkFBQ0ssSUFBQUEseUJBQXlCQSxDQVk5REE7Z0JBWnFDQSxXQUFBQSx5QkFBeUJBLEVBQUNBLENBQUNBO29CQUM3RDJGLElBQWFBLFVBQVVBO3dCQUFTRyxVQUFuQkEsVUFBVUEsVUFBMkJBO3dCQUFsREEsU0FBYUEsVUFBVUE7NEJBQVNDLDhCQUFrQkE7d0JBVWxEQSxDQUFDQTt3QkFUR0QsNkJBQVFBLEdBQVJBLFVBQVVBLE9BQWNBOzRCQUNwQkUsTUFBTUEsQ0FBQ0E7Z0NBQ0hBLE1BQU1BLEVBQUdBLCtCQUFLQSxDQUFDQSxXQUFXQTtnQ0FDMUJBLFNBQVNBLEVBQUdBLE9BQU9BLENBQUNBLE9BQU9BOzZCQUM5QkEsQ0FBQ0E7d0JBQ05BLENBQUNBO3dCQUNERiwrQkFBVUEsR0FBVkEsVUFBWUEsT0FBZUE7NEJBQ3ZCRyxNQUFNQSxDQUFDQSxJQUFJQSwrQkFBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pDQSxDQUFDQTt3QkFDTEgsaUJBQUNBO29CQUFEQSxDQUFDQSxBQVZESCxFQUFnQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsRUFVakRBO29CQVZZQSxvQ0FBVUEsR0FBVkEsVUFVWkEsQ0FBQUE7Z0JBQ0xBLENBQUNBLEVBWnFDM0YseUJBQXlCQSxHQUF6QkEsaUNBQXlCQSxLQUF6QkEsaUNBQXlCQSxRQVk5REE7WUFBREEsQ0FBQ0EsRUFaNkJMLE9BQU9BLEdBQVBBLGNBQU9BLEtBQVBBLGNBQU9BLFFBWXBDQTtRQUFEQSxDQUFDQSxFQVpzQi9ELE1BQU1BLEdBQU5BLGtCQUFNQSxLQUFOQSxrQkFBTUEsUUFZNUJBO0lBQURBLENBQUNBLEVBWlVmLFdBQVdBLEdBQVhBLGVBQVdBLEtBQVhBLGVBQVdBLFFBWXJCQTtBQUFEQSxDQUFDQSxFQVpNLEdBQUcsS0FBSCxHQUFHLFFBWVQiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIG1vZHVsZSBjaHJvbWUuZXh0ZW5zaW9uIHtcbiAgICB2YXIgb25Db25uZWN0OiBjaHJvbWUucnVudGltZS5FeHRlbnNpb25Db25uZWN0RXZlbnQ7XG59XG5cbmRlY2xhcmUgY2xhc3MgRXZlbnRFbWl0dGVyIGV4dGVuZHMgZXZlbnRlbWl0dGVyMi5FdmVudEVtaXR0ZXIyIHt9XG4oPGFueT53aW5kb3cpLkV2ZW50RW1pdHRlciA9ICg8YW55PndpbmRvdykuRXZlbnRFbWl0dGVyMjtcblxuZGVjbGFyZSB2YXIgVGVzdEluaXRpYWxpemU6IGJvb2xlYW47IiwibW9kdWxlIENhdC5CYXNlIHtcbiAgICBleHBvcnQgY2xhc3MgSWRlbnRpdHkge1xuICAgICAgICBjb25zdHJ1Y3RvciAocHVibGljIHV1aWQ6IFVVSUQuVVVJRCA9IG5ldyBVVUlELlVVSUQpIHtcbiAgICAgICAgfVxuICAgICAgICBlcSAoZTogSWRlbnRpdHkpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnV1aWQudG9TdHJpbmcoKSA9PT0gZS51dWlkLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkJhc2Uge1xuICAgIGV4cG9ydCBjbGFzcyBTZXJ2aWNlIHt9XG59XG4iLCJtb2R1bGUgQ2F0LlVVSUQge1xuICAgIGNsYXNzIEludmFsaWRVVUlERm9ybWF0IHt9XG4gICAgZXhwb3J0IGNsYXNzIFVVSUQge1xuICAgICAgICB1dWlkOiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKGlkOiBzdHJpbmcgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnV1aWQgPSBbXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUzQoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpLFxuICAgICAgICAgICAgICAgICAgICBcIi1cIixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpLFxuICAgICAgICAgICAgICAgICAgICBcIi1cIixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpLFxuICAgICAgICAgICAgICAgICAgICBcIi1cIixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpLFxuICAgICAgICAgICAgICAgICAgICBcIi1cIixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUzQoKVxuICAgICAgICAgICAgICAgIF0uam9pbignJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1hdGNoID0gaWQubWF0Y2goL15cXHd7OH0tXFx3ezR9LVxcd3s0fS1cXHd7NH0tXFx3ezEyfSQvKTtcbiAgICAgICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFVVSURGb3JtYXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXVpZCA9IGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9TdHJpbmcgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXVpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBmcm9tU3RyaW5nIChpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFVVSUQoaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBTNCgpIHtcbiAgICAgICAgICAgIHZhciByYW5kID0gMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICByZXR1cm4gKChyYW5kICogMHgxMDAwMCl8MCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuICAgIH19XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBTY29wZSBleHRlbmRzIG5nLklTY29wZSB7XG4gICAgICAgIHBsYXlBbGw6ICgpID0+IHZvaWQ7XG4gICAgICAgIGFkZENvbW1hbmQ6ICgpID0+IHZvaWQ7XG4gICAgICAgIGRlbGV0ZUNvbW1hbmQ6IChjb21tYW5kOiBDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIGNvbW1hbmRHcmlkOiBDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsO1xuICAgICAgICBzdGFydFJlY29yZGluZzogKCkgPT4gdm9pZDtcbiAgICAgICAgc3RvcFJlY29yZGluZzogKCkgPT4gdm9pZDtcbiAgICAgICAgY2hhbmdlU3BlZWQ6ICgpID0+IHZvaWQ7XG4gICAgICAgIHBsYXlDdXJyZW50OiAoKSA9PiB2b2lkO1xuICAgICAgICBwbGF5U3RvcDogKCkgPT4gdm9pZDtcbiAgICAgICAgcmVjb3JkaW5nU3RhdHVzOiBib29sZWFuO1xuICAgICAgICBiYXNlVVJMOiBzdHJpbmc7XG4gICAgICAgIHBsYXlTcGVlZDogc3RyaW5nO1xuICAgICAgICBzZWxlY3RMaXN0OiBzdHJpbmdbXTtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXIge1xuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgICRzY29wZTogU2NvcGUsXG4gICAgICAgICAgICBtYW5hZ2VyOiBTZXJ2aWNlcy5UYWIuTWFuYWdlcixcbiAgICAgICAgICAgIGNvbW1hbmRHcmlkOiBDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsLFxuICAgICAgICAgICAgbWVzc2FnZURpc3BhdGNoZXI6IE1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIsXG4gICAgICAgICAgICBzZWxlbml1bVNlbmRlcjogQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlNlbmRlcixcbiAgICAgICAgICAgIGNvbW1hbmRTZWxlY3RMaXN0OiBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3RcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAkc2NvcGUuY29tbWFuZEdyaWQgPSBjb21tYW5kR3JpZDtcbiAgICAgICAgICAgICRzY29wZS5wbGF5U3BlZWQgPSAnMTAwJztcblxuICAgICAgICAgICAgJHNjb3BlLnBsYXlBbGwgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZW5pdW1TZW5kZXIuYWRkQ29tbWFuZExpc3QoJHNjb3BlLmNvbW1hbmRHcmlkLmdldENvbW1hbmRMaXN0KCkpO1xuICAgICAgICAgICAgICAgIHNlbGVuaXVtU2VuZGVyLnN0YXJ0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLmNoYW5nZVNwZWVkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVuaXVtU2VuZGVyLmludGVydmFsID0gcGFyc2VJbnQoJHNjb3BlLnBsYXlTcGVlZCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLmFkZENvbW1hbmQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbW1hbmRHcmlkLmFkZChuZXcgQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsKCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5kZWxldGVDb21tYW5kID0gKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29tbWFuZEdyaWQucmVtb3ZlKGNvbW1hbmQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5yZWNvcmRpbmdTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLnN0YXJ0UmVjb3JkaW5nID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5yZWNvcmRpbmdTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5zdG9wUmVjb3JkaW5nID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5yZWNvcmRpbmdTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUucGxheUN1cnJlbnQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9AVE9ET1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5wbGF5U3RvcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvL0BUT0RPXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdExpc3QgPSBjb21tYW5kU2VsZWN0TGlzdC5nZXRzKCkubWFwKChlbGVtKSA9PiBlbGVtLmdldEF0dHJpYnV0ZSgnbmFtZScpKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFRhYk1hbmFnZXIoJHNjb3BlLCBtYW5hZ2VyLCBtZXNzYWdlRGlzcGF0Y2hlcik7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBiaW5kVGFiTWFuYWdlciAoXG4gICAgICAgICAgICAkc2NvcGU6IFNjb3BlLFxuICAgICAgICAgICAgbWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIsXG4gICAgICAgICAgICBtZXNzYWdlRGlzcGF0Y2hlcjogTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlclxuICAgICAgICApIHtcbiAgICAgICAgICAgIG1hbmFnZXIub25NZXNzYWdlKChtZXNzYWdlOiBPYmplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlRGlzcGF0Y2hlci5kaXNwYXRjaChtZXNzYWdlLCB7XG4gICAgICAgICAgICAgICAgICAgIE1lc3NhZ2VBZGRDb21tZW50TW9kZWwgOiAobWVzc2FnZTogTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5Nb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkc2NvcGUucmVjb3JkaW5nU3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkc2NvcGUuY29tbWFuZEdyaWQuZ2V0TGlzdCgpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYmFzZVVSTCA9IG1hbmFnZXIuZ2V0VGFiVVJMKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21tYW5kR3JpZC5hZGQobmV3IENhdC5Nb2RlbHMuQ29tbWFuZC5Nb2RlbCgnb3BlbicsICcnLCAkc2NvcGUuYmFzZVVSTCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tbWFuZEdyaWQuYWRkKG1lc3NhZ2UuY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzIHtcbiAgICBleHBvcnQgY2xhc3MgQ29udGVudFNjcmlwdHNDdHJsIHtcbiAgICAgICAgcHJpdmF0ZSBtZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdFJlcG9zaXRvcnkgOiBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0LlJlcG9zaXRvcnk7XG4gICAgICAgIHByaXZhdGUgbWVzc2FnZUFkZENvbW1lbnRSZXBvc2l0b3J5IDogTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5SZXBvc2l0b3J5O1xuICAgICAgICBwcml2YXRlIHJlY29yZGVyT2JzZXJ2ZXIgOiBTZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyO1xuICAgICAgICBwcml2YXRlIG1lc3NhZ2VEaXNwYXRjaGVyIDogTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlcjtcbiAgICAgICAgcHJpdmF0ZSBTZWxlbml1bVJlY2VpdmVyIDogU2VydmljZXMuU2VsZW5pdW0uUmVjZWl2ZXI7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIHBvcnQ6IGNocm9tZS5ydW50aW1lLlBvcnQpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRSZXBvc2l0b3J5ID0gbmV3IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeSgpO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlQWRkQ29tbWVudFJlcG9zaXRvcnkgPSBuZXcgTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5SZXBvc2l0b3J5KCk7XG4gICAgICAgICAgICB0aGlzLnJlY29yZGVyT2JzZXJ2ZXIgPSBuZXcgU2VydmljZXMuUmVjb3JkZXJPYnNlcnZlcigpO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlRGlzcGF0Y2hlciA9IG5ldyBNb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyKCk7XG4gICAgICAgICAgICB0aGlzLlNlbGVuaXVtUmVjZWl2ZXIgPSBuZXcgU2VydmljZXMuU2VsZW5pdW0uUmVjZWl2ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBvbk1lc3NhZ2UgKG1lc3NhZ2U6IE9iamVjdCwgc2VuZGVyOiBjaHJvbWUucnVudGltZS5NZXNzYWdlU2VuZGVyLCBzZW5kUmVzcG9uc2U6IChtZXNzYWdlOiBPYmplY3QpID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZURpc3BhdGNoZXIuZGlzcGF0Y2gobWVzc2FnZSwge1xuICAgICAgICAgICAgICAgIE1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZU1vZGVsIDogKG1lc3NhZ2U6IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLk1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlY29yZGVyLmRlcmVnaXN0ZXIodGhpcy5yZWNvcmRlck9ic2VydmVyLCB3aW5kb3cpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5TZWxlbml1bVJlY2VpdmVyLmV4ZWN1dGUobWVzc2FnZS5jb21tYW5kKTtcbiAgICAgICAgICAgICAgICAgICAgUmVjb3JkZXIucmVnaXN0ZXIodGhpcy5yZWNvcmRlck9ic2VydmVyLCB3aW5kb3cpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0TWVzc2FnZSA9IG5ldyBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0Lk1vZGVsKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0UmVwb3NpdG9yeS50b09iamVjdChyZXN1bHRNZXNzYWdlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBhZGRDb21tYW5kKGNvbW1hbmROYW1lOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCB3aW5kb3c6IFdpbmRvdywgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQ6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgICAgICAgICAgICdjb250ZW50JyA6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbW1hbmQnIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnIDogY29tbWFuZE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFyZ2V0JyA6IHRhcmdldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZScgOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQnIDogaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGFkZENvbW1lbnRNZXNzYWdlID0gdGhpcy5tZXNzYWdlQWRkQ29tbWVudFJlcG9zaXRvcnkuZnJvbU9iamVjdChtZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZSh0aGlzLm1lc3NhZ2VBZGRDb21tZW50UmVwb3NpdG9yeS50b09iamVjdChhZGRDb21tZW50TWVzc2FnZSkpO1xuICAgICAgICB9XG4gICAgICAgIGluaXRpYWxpemUgKCkge1xuICAgICAgICAgICAgUmVjb3JkZXIucmVnaXN0ZXIodGhpcy5yZWNvcmRlck9ic2VydmVyLCB3aW5kb3cpO1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlck9ic2VydmVyLmFkZExpc3RlbmVyKCdhZGRDb21tYW5kJywgKGNvbW1hbmROYW1lOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCB3aW5kb3c6IFdpbmRvdywgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQ6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENvbW1hbmQoY29tbWFuZE5hbWUsIHRhcmdldCwgdmFsdWUsIHdpbmRvdywgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBvcnQub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWNvcmRlci5kZXJlZ2lzdGVyKHRoaXMucmVjb3JkZXJPYnNlcnZlciwgd2luZG93KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlOiBPYmplY3QsIHNlbmRlcjogY2hyb21lLnJ1bnRpbWUuTWVzc2FnZVNlbmRlciwgc2VuZFJlc3BvbnNlOiAobWVzc2FnZTogT2JqZWN0KSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJ2YXIgYXBwbGljYXRpb25TZXJ2aWNlc1NlbGVuaXVtU2VuZGVyOiBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyO1xuXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzIHtcbiAgICBleHBvcnQgY2xhc3MgV2luZG93Q3RybCB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGNhbGxlZFRhYklkOiBzdHJpbmcpIHt9XG4gICAgICAgIHByaXZhdGUgaW5pdEFuZ3VsYXIgKG1hbmFnZXIsIGNvbW1hbmRTZWxlY3RMaXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgYXV0b3BpbG90QXBwID0gYW5ndWxhci5tb2R1bGUoJ0F1dG9waWxvdEFwcCcsIFsndWkuc29ydGFibGUnXSlcbiAgICAgICAgICAgICAgICAgICAgLmZhY3RvcnkoJ21hbmFnZXInLCAoKSA9PiBtYW5hZ2VyKVxuICAgICAgICAgICAgICAgICAgICAuZmFjdG9yeSgnY29tbWFuZFNlbGVjdExpc3QnLCAoKSA9PiBjb21tYW5kU2VsZWN0TGlzdClcbiAgICAgICAgICAgICAgICAgICAgLnNlcnZpY2UoJ21lc3NhZ2VEaXNwYXRjaGVyJywgTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlcilcbiAgICAgICAgICAgICAgICAgICAgLmZhY3RvcnkoJ3NlbGVuaXVtU2VuZGVyJywgKG1hbmFnZXI6IFNlcnZpY2VzLlRhYi5NYW5hZ2VyLCBtZXNzYWdlRGlzcGF0Y2hlcjogTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbGljYXRpb25TZXJ2aWNlc1NlbGVuaXVtU2VuZGVyID0gbmV3IFNlcnZpY2VzLlNlbGVuaXVtLlNlbmRlcihtYW5hZ2VyLCBtZXNzYWdlRGlzcGF0Y2hlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBwbGljYXRpb25TZXJ2aWNlc1NlbGVuaXVtU2VuZGVyO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmFjdG9yeSgnY29tbWFuZEdyaWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVscy5Db21tYW5kR3JpZC5Nb2RlbCgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY29udHJvbGxlcignQXV0b3BpbG90JywgQ29udHJvbGxlcnMuQXV0b3BpbG90LkNvbnRyb2xsZXIpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuYm9vdHN0cmFwKGRvY3VtZW50LCBbJ0F1dG9waWxvdEFwcCddKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGF1dG9waWxvdEFwcCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGluaXRDb21tYW5kU2VsZWN0TGlzdCAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZW5pdW1BcGlYTUxGaWxlID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFNlcnZpY2VzLkNvbmZpZy5zZWxlbml1bUFwaVhNTCk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlOiAoY29tbWFuZFNlbGVjdExpc3Q6IFNlcnZpY2VzLkNvbW1hbmRTZWxlY3RMaXN0KSA9PiB2b2lkLCByZWplY3Q6IChlcnJvck1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tbWFuZFNlbGVjdExpc3QgPSBuZXcgU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZFNlbGVjdExpc3QubG9hZChzZWxlbml1bUFwaVhNTEZpbGUpLnRoZW4oKCkgPT4gcmVzb2x2ZShjb21tYW5kU2VsZWN0TGlzdCkpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQsIHJlamVjdDogKGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFNlcnZpY2VzLlNlbGVuaXVtLlNlbmRlci5zZXRBcGlEb2NzKHNlbGVuaXVtQXBpWE1MRmlsZSkudGhlbihyZXNvbHZlKS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkucmVhZHkocmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgaW5pdFRhYkluaXRpYWxpemVyIChyZXNvbHZlLCBjYXRjaEVycm9yKSB7XG4gICAgICAgICAgICAobmV3IFByb21pc2UoKHJlc29sdmU6IChtYW5hZ2VyOiBTZXJ2aWNlcy5UYWIuTWFuYWdlcikgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgaW5pdGlhbGl6ZXIgPSBuZXcgU2VydmljZXMuVGFiLkluaXRpYWxpemVyKHRoaXMuY2FsbGVkVGFiSWQpO1xuICAgICAgICAgICAgICAgIGluaXRpYWxpemVyLnN0YXJ0KCkudGhlbihyZXNvbHZlKS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgfSkpLnRoZW4oKG1hbmFnZXI6IFNlcnZpY2VzLlRhYi5NYW5hZ2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Q29tbWFuZFNlbGVjdExpc3QoKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21tYW5kU2VsZWN0TGlzdCA9IHJlc3VsdHMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0QW5ndWxhcihtYW5hZ2VyLCBjb21tYW5kU2VsZWN0TGlzdClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goY2F0Y2hFcnJvcilcbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGNhdGNoRXJyb3IpO1xuICAgICAgICAgICAgfSkuY2F0Y2goY2F0Y2hFcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdGlhbGl6ZSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UodGhpcy5pbml0VGFiSW5pdGlhbGl6ZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzIHtcbiAgICBleHBvcnQgY2xhc3MgQ29tbWFuZFNlbGVjdExpc3Qge1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBlcnJvck1lc3NhZ2UgPSAnY29tbWFuZCBsaXN0IHhtbCBsb2FkIGZhaWxlZC5cXG4nO1xuICAgICAgICBwcml2YXRlIGRvY3VtZW50RWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgICAgIGxvYWQgKGZpbGU6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlOiAoKSA9PiB2b2lkLCByZWplY3Q6IChlcnJvck1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB4aHIub3BlbignR0VUJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgIT09IDAgJiYgeGhyLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KENvbW1hbmRTZWxlY3RMaXN0LmVycm9yTWVzc2FnZSArIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRFbGVtZW50ID0geGhyLnJlc3BvbnNlWE1MLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBnZXREb2NSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBnZXRzICgpOiBIVE1MRWxlbWVudFtdIHtcbiAgICAgICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKHRoaXMuZG9jdW1lbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Z1bmN0aW9uJykpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcyB7XG4gICAgZXhwb3J0IGNsYXNzIENvbmZpZyB7XG4gICAgICAgIHN0YXRpYyBpbmplY3RTY3JpcHRzID0gW1xuICAgICAgICAgICAgXCJzcmMvbGliL3hwYXRoLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9saWIvY3NzLXNlbGVjdG9yLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvdG9vbHMuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9odG1sdXRpbHMuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9zZWxlbml1bS1icm93c2VyZGV0ZWN0LmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tYXRvbXMuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9zZWxlbml1bS1icm93c2VyYm90LmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tYXBpLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tZXhlY3V0aW9ubG9vcC5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3NlbGVuaXVtLXRlc3RydW5uZXIuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9zZWxlbml1bS1jb21tYW5kaGFuZGxlcnMuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9zZWxlbml1bS1ydW5uZXIuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9yZWNvcmRlci5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3JlY29yZGVyLWhhbmRsZXJzLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvdGVzdENhc2UuanNcIixcbiAgICAgICAgICAgIFwiYm93ZXJfY29tcG9uZW50cy9ldmVudGVtaXR0ZXIyL2xpYi9ldmVudGVtaXR0ZXIyLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9fZGVmaW5lLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9hcHBsaWNhdGlvbi5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvY29udGVudF9zY3JpcHRzLmpzXCJcbiAgICAgICAgXTtcbiAgICAgICAgc3RhdGljIHNlbGVuaXVtQXBpWE1MID0gJy9zcmMvc2VsZW5pdW0taWRlL2llZG9jLWNvcmUueG1sJztcbiAgICB9XG59XG4iLCIvKlxuKiBNb2NrIFJlY29yZGVyT2JzZXJ2ZXIgZm9yIFNlbGVuaXVtIFJlY29yZGVyXG4qICovXG5tb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzIHtcbiAgICBleHBvcnQgY2xhc3MgUmVjb3JkZXJPYnNlcnZlciBleHRlbmRzIEV2ZW50RW1pdHRlcntcbiAgICAgICAgcmVjb3JkaW5nRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgIGlzU2lkZWJhcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBnZXRVc2VyTG9nICgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlO1xuICAgICAgICB9XG4gICAgICAgIGFkZENvbW1hbmQgKGNvbW1hbmQ6IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHdpbmRvdzogV2luZG93LCBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZDogYm9vbGVhbikge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdhZGRDb21tYW5kJywgY29tbWFuZCwgdGFyZ2V0LCB2YWx1ZSwgd2luZG93LCBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgb25VbmxvYWREb2N1bWVudCAoZG9jOiBEb2N1bWVudCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdvblVubG9hZERvY3VtZW50JywgZG9jKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQmFzZS5FbnRpdHkge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIElkZW50aXR5IHtcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBpZGVudGl0eTogSWRlbnRpdHkgPSBuZXcgSWRlbnRpdHkobmV3IFVVSUQuVVVJRCkpIHtcbiAgICAgICAgICAgIHN1cGVyKGlkZW50aXR5LnV1aWQpXG4gICAgICAgIH1cbiAgICAgICAgZXEgKGU6IE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuZXEoZS5pZGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkJhc2UuRW50aXR5IHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlcG9zaXRvcnk8TSBleHRlbmRzIE1vZGVsPiB7XG4gICAgICAgIHRvT2JqZWN0IChlbnRpdHk6IE0pIDogT2JqZWN0O1xuICAgICAgICBmcm9tT2JqZWN0IChvYmplY3Q6IE9iamVjdCkgOiBNO1xuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQmFzZS5FbnRpdHlMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWw8RSBleHRlbmRzIEVudGl0eS5Nb2RlbD4gZXh0ZW5kcyBFbnRpdHkuTW9kZWwge1xuICAgICAgICBsaXN0OiBFW107XG5cbiAgICAgICAgY29uc3RydWN0b3IobGlzdDogRVtdID0gW10pIHtcbiAgICAgICAgICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgICAgIGFkZChlbnRpdHk6IEUpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdC5wdXNoKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0TGlzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3Q7XG4gICAgICAgIH1cbiAgICAgICAgc3BsaWNlKGluZGV4OiBudW1iZXIsIGVudGl0eTogRSkge1xuICAgICAgICAgICAgdGhpcy5saXN0LnNwbGljZShpbmRleCwgMSwgZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgICByZXBsYWNlKGlkZW50aXR5OiBJZGVudGl0eSwgZW50aXR5OiBFKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmxpc3QubWFwKFxuICAgICAgICAgICAgICAgIChlKSA9PiBlLmlkZW50aXR5LmVxKGlkZW50aXR5KSA/IGVudGl0eSA6IGVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlKGVudGl0eTogRSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5saXN0LmZpbHRlcihcbiAgICAgICAgICAgICAgICAoZSkgPT4gIWUuZXEoZW50aXR5KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdCA9IFtdO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5CYXNlLkVudGl0eUxpc3Qge1xuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5PEIgZXh0ZW5kcyBFbnRpdHkuTW9kZWwsIE0gZXh0ZW5kcyBFbnRpdHlMaXN0Lk1vZGVsPEVudGl0eS5Nb2RlbD4+IHtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgZW50aXR5UmVwb3NpdG9yeTogRW50aXR5LlJlcG9zaXRvcnk8Qj4pIHtcbiAgICAgICAgfVxuICAgICAgICB0b0VudGl0eUxpc3QgKGVudGl0eUxpc3Q6IE0pIHtcbiAgICAgICAgICAgIHJldHVybiBlbnRpdHlMaXN0LmdldExpc3QoKS5tYXAoKGVudGl0eSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiA8TT4oPGFueT50aGlzLmVudGl0eVJlcG9zaXRvcnkpLnRvT2JqZWN0KGVudGl0eSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tRW50aXR5TGlzdCAoZW50aXR5TGlzdDogT2JqZWN0W10pIHtcbiAgICAgICAgICAgIHJldHVybiBlbnRpdHlMaXN0Lm1hcCgoZW50aXR5KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW50aXR5UmVwb3NpdG9yeS5mcm9tT2JqZWN0KGVudGl0eSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuTW9kZWxzLkNvbW1hbmQge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIENhdC5CYXNlLkVudGl0eS5Nb2RlbCB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgICAgIHB1YmxpYyB0eXBlID0gJycsXG4gICAgICAgICAgICBwdWJsaWMgdGFyZ2V0ID0gJycsXG4gICAgICAgICAgICBwdWJsaWMgdmFsdWUgPSAnJ1xuICAgICAgICApIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0Lk1vZGVscy5Db21tYW5kIHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIElNb2RlbE9iamVjdCB7XG4gICAgICAgIHR5cGU6IHN0cmluZztcbiAgICAgICAgdGFyZ2V0OiBzdHJpbmc7XG4gICAgICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGltcGxlbWVudHMgQ2F0LkJhc2UuRW50aXR5LlJlcG9zaXRvcnk8TW9kZWw+IHtcbiAgICAgICAgdG9PYmplY3QgKGNvbW1hbmQ6IE1vZGVsKTogSU1vZGVsT2JqZWN0IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnIDogY29tbWFuZC50eXBlLFxuICAgICAgICAgICAgICAgICd0YXJnZXQnIDogY29tbWFuZC50YXJnZXQsXG4gICAgICAgICAgICAgICAgJ3ZhbHVlJyA6IGNvbW1hbmQudmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAoY29tbWFuZDogSU1vZGVsT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKGNvbW1hbmQudHlwZSwgY29tbWFuZC50YXJnZXQsIGNvbW1hbmQudmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5Nb2RlbHMuQ29tbWFuZExpc3Qge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIENhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWw8Q29tbWFuZC5Nb2RlbD4ge1xuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICBjb21tYW5kczogQ29tbWFuZC5Nb2RlbFtdID0gW10sXG4gICAgICAgICAgICBwdWJsaWMgbmFtZSA9ICcnLFxuICAgICAgICAgICAgcHVibGljIHVybCA9ICcnXG4gICAgICAgICkge1xuICAgICAgICAgICAgc3VwZXIoY29tbWFuZHMpO1xuICAgICAgICB9XG4gICAgICAgIGNsZWFyKCkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gJyc7XG4gICAgICAgICAgICB0aGlzLnVybCA9ICcnO1xuICAgICAgICAgICAgc3VwZXIuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuTW9kZWxzLkNvbW1hbmRMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIENhdC5CYXNlLkVudGl0eUxpc3QuUmVwb3NpdG9yeTxDb21tYW5kLk1vZGVsLCBNb2RlbD4gaW1wbGVtZW50cyBDYXQuQmFzZS5FbnRpdHkuUmVwb3NpdG9yeTxNb2RlbD4ge1xuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICBzdXBlcihuZXcgQ29tbWFuZC5SZXBvc2l0b3J5KCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9PYmplY3QgKGNvbW1hbmRMaXN0OiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnY29tbWFuZExpc3QnIDogc3VwZXIudG9FbnRpdHlMaXN0KGNvbW1hbmRMaXN0KSxcbiAgICAgICAgICAgICAgICAnbmFtZScgOiBjb21tYW5kTGlzdC5uYW1lLFxuICAgICAgICAgICAgICAgICd1cmwnIDogY29tbWFuZExpc3QudXJsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZyb21PYmplY3QgKGNvbW1hbmRMaXN0OiB7XG4gICAgICAgICAgICAnY29tbWFuZExpc3QnIDogT2JqZWN0W11cbiAgICAgICAgICAgICduYW1lJyA6IHN0cmluZ1xuICAgICAgICAgICAgJ3VybCcgOiBzdHJpbmdcbiAgICAgICAgfSkge1xuICAgICAgICAgICAgdmFyIGNvbW1hbmRMaXN0T2JqZWN0ID0gc3VwZXIuZnJvbUVudGl0eUxpc3QoY29tbWFuZExpc3QuY29tbWFuZExpc3QpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbChjb21tYW5kTGlzdE9iamVjdCwgY29tbWFuZExpc3QubmFtZSwgY29tbWFuZExpc3QudXJsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsPENhdC5Nb2RlbHMuQ29tbWFuZC5Nb2RlbD4ge1xuICAgICAgICBnZXRDb21tYW5kTGlzdCgpIHtcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHRoaXMuZ2V0TGlzdCgpLmZpbHRlcigoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWNvbW1hbmQudHlwZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNvbW1hbmRMaXN0ID0gbmV3IENhdC5Nb2RlbHMuQ29tbWFuZExpc3QuTW9kZWwoY29tbWFuZHMpO1xuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRMaXN0O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZSB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBEaXNwYXRjaE1hcCB7XG4gICAgICAgIE1lc3NhZ2VBZGRDb21tZW50TW9kZWw/IDogKG1lc3NhZ2U6IEFkZENvbW1lbnQuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIE1lc3NhZ2VQbGF5Q29tbWFuZE1vZGVsPyA6IChtZXNzYWdlOiBQbGF5Q29tbWFuZC5Nb2RlbCkgPT4gdm9pZDtcbiAgICAgICAgTWVzc2FnZVBsYXlDb21tYW5kTGlzdE1vZGVsPyA6IChtZXNzYWdlOiBQbGF5Q29tbWFuZExpc3QuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIE1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZU1vZGVsPyA6IChtZXNzYWdlOiBQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5Nb2RlbCkgPT4gdm9pZDtcbiAgICAgICAgTWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRNb2RlbD8gOiAobWVzc2FnZTogUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbCkgPT4gdm9pZDtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIERpc3BhdGNoZXIge1xuICAgICAgICBtZXNzYWdlQWRkQ29tbWVudE1vZGVsID0gbmV3IEFkZENvbW1lbnQuUmVwb3NpdG9yeSgpO1xuICAgICAgICBtZXNzYWdlUGxheUNvbW1hbmRNb2RlbCA9IG5ldyBQbGF5Q29tbWFuZC5SZXBvc2l0b3J5KCk7XG4gICAgICAgIG1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbCA9IG5ldyBQbGF5Q29tbWFuZExpc3QuUmVwb3NpdG9yeSgpO1xuICAgICAgICBtZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVNb2RlbCA9IG5ldyBQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5SZXBvc2l0b3J5KCk7XG4gICAgICAgIG1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWwgPSBuZXcgUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5SZXBvc2l0b3J5KCk7XG5cbiAgICAgICAgZGlzcGF0Y2ggKG1lc3NhZ2U6IE9iamVjdCwgZGlzcGF0Y2hlcjogRGlzcGF0Y2hNYXApIHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlWyduYW1lJ10gPT0gQWRkQ29tbWVudC5Nb2RlbC5tZXNzYWdlTmFtZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuTWVzc2FnZUFkZENvbW1lbnRNb2RlbCh0aGlzLm1lc3NhZ2VBZGRDb21tZW50TW9kZWwuZnJvbU9iamVjdChtZXNzYWdlKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2VbJ25hbWUnXSA9PSBQbGF5Q29tbWFuZC5Nb2RlbC5tZXNzYWdlTmFtZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuTWVzc2FnZVBsYXlDb21tYW5kTW9kZWwodGhpcy5tZXNzYWdlUGxheUNvbW1hbmRNb2RlbC5mcm9tT2JqZWN0KG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZVsnbmFtZSddID09IFBsYXlDb21tYW5kTGlzdC5Nb2RlbC5tZXNzYWdlTmFtZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuTWVzc2FnZVBsYXlDb21tYW5kTGlzdE1vZGVsKHRoaXMubWVzc2FnZVBsYXlDb21tYW5kTGlzdE1vZGVsLmZyb21PYmplY3QobWVzc2FnZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlWyduYW1lJ10gPT0gUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZU1vZGVsKHRoaXMubWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlTW9kZWwuZnJvbU9iamVjdChtZXNzYWdlKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2VbJ25hbWUnXSA9PSBQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0Lk1vZGVsLm1lc3NhZ2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5NZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdE1vZGVsKHRoaXMubWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRNb2RlbC5mcm9tT2JqZWN0KG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1lc3NhZ2U6ICcgKyBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZSB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgQmFzZS5FbnRpdHkuTW9kZWwge1xuICAgIH1cbn0iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlIHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBpbXBsZW1lbnRzIEJhc2UuRW50aXR5LlJlcG9zaXRvcnk8TW9kZWw+IHtcbiAgICAgICAgdG9PYmplY3QgKGVudGl0eTogTW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChvYmplY3Q6IE9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHkuTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICBwdWJsaWMgdHlwZSA9ICcnLFxuICAgICAgICAgICAgcHVibGljIGFyZ3M6IHN0cmluZ1tdID0gW11cbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kIHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIElNb2RlbE9iamVjdCB7XG4gICAgICAgIHR5cGU6IHN0cmluZztcbiAgICAgICAgYXJnczogc3RyaW5nW107XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGltcGxlbWVudHMgQ2F0LkJhc2UuRW50aXR5LlJlcG9zaXRvcnk8TW9kZWw+IHtcbiAgICAgICAgdG9PYmplY3QgKGNvbW1hbmQ6IE1vZGVsKTogSU1vZGVsT2JqZWN0IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnIDogY29tbWFuZC50eXBlLFxuICAgICAgICAgICAgICAgICdhcmdzJyA6IGNvbW1hbmQuYXJnc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChjb21tYW5kOiBJTW9kZWxPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwoY29tbWFuZC50eXBlLCBjb21tYW5kLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bSB7XG4gICAgZXhwb3J0IGNsYXNzIEJhc2Uge1xuICAgICAgICBzZWxlbml1bTogYW55O1xuICAgICAgICBjb21tYW5kRmFjdG9yeTogYW55O1xuICAgICAgICBjdXJyZW50VGVzdDogYW55O1xuICAgICAgICB0ZXN0Q2FzZTogYW55O1xuICAgICAgICBpbnRlcnZhbDogbnVtYmVyID0gMTtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgICAgIC8vIGZvciBzZWxlbml1bS1ydW5uZXJcbiAgICAgICAgICAgICg8YW55PndpbmRvdykuZ2V0QnJvd3NlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAnc2VsZWN0ZWRCcm93c2VyJyA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb250ZW50V2luZG93JyA6IHdpbmRvd1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLmxhc3RXaW5kb3cgPSB3aW5kb3c7XG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLnRlc3RDYXNlID0gbmV3ICg8YW55PndpbmRvdykuVGVzdENhc2U7XG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLnNlbGVuaXVtID0gY2FsbGJhY2soKTtcblxuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5lZGl0b3IgPSB7XG4gICAgICAgICAgICAgICAgJ2FwcCcgOiB7XG4gICAgICAgICAgICAgICAgICAgICdnZXRPcHRpb25zJyA6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RpbWVvdXQnIDogdGhpcy5pbnRlcnZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ3ZpZXcnIDoge1xuICAgICAgICAgICAgICAgICAgICAncm93VXBkYXRlZCcgOiAoKSA9PiB7fSxcbiAgICAgICAgICAgICAgICAgICAgJ3Njcm9sbFRvUm93JyA6ICgpID0+IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZSA9ICg8YW55PndpbmRvdykudGVzdENhc2U7XG4gICAgICAgICAgICB0aGlzLnNlbGVuaXVtID0gKDxhbnk+d2luZG93KS5zZWxlbml1bTtcbiAgICAgICAgICAgIHRoaXMuc2VsZW5pdW0uYnJvd3NlcmJvdC5zZWxlY3RXaW5kb3cobnVsbCk7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRGYWN0b3J5ID0gbmV3ICg8YW55PndpbmRvdykuQ29tbWFuZEhhbmRsZXJGYWN0b3J5KCk7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRGYWN0b3J5LnJlZ2lzdGVyQWxsKHRoaXMuc2VsZW5pdW0pO1xuICAgICAgICB9XG4gICAgICAgIGdldEludGVydmFsICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmludGVydmFsO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRlc3QgPSBuZXcgKDxhbnk+d2luZG93KS5JREVUZXN0TG9vcCh0aGlzLmNvbW1hbmRGYWN0b3J5LCB7XG4gICAgICAgICAgICAgICAgICAgICd0ZXN0Q29tcGxldGUnIDogcmVzb2x2ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRlc3QuZ2V0Q29tbWFuZEludGVydmFsID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnRlcnZhbCgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRlc3RDYXNlLmRlYnVnQ29udGV4dC5yZXNldCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRlc3Quc3RhcnQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXJyb3JNZXNzYWdlID0gJ3NlbGVuaXVtIGNvbW1hbmQgeG1sIGxvYWQgZmFpbGVkLlxcbic7XG4gICAgICAgIHN0YXRpYyBzZXRBcGlEb2NzIChmaWxlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGZpbGUpO1xuICAgICAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAwICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChCYXNlLmVycm9yTWVzc2FnZSArIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICg8YW55PndpbmRvdykuQ29tbWFuZC5hcGlEb2N1bWVudHMgPSBuZXcgQXJyYXkoeGhyLnJlc3BvbnNlWE1MLmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtIHtcbiAgICBleHBvcnQgY2xhc3MgUmVjZWl2ZXIgZXh0ZW5kcyBCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgc3VwZXIoKCkgPT4gKDxhbnk+d2luZG93KS5jcmVhdGVTZWxlbml1bShsb2NhdGlvbi5ocmVmLCB0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBlcnJvck1lc3NhZ2UgPSAnbWlzc2luZyBjb21tYW5kOiAnO1xuICAgICAgICBleGVjdXRlIChtb2RlbDogTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5Nb2RlbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZW5pdW1bbW9kZWwudHlwZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5leGVjKCgpID0+IHRoaXMuc2VsZW5pdW1bbW9kZWwudHlwZV0uYXBwbHkodGhpcy5zZWxlbml1bSwgbW9kZWwuYXJncykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvbW1hbmROYW1lID0gJ2RvJyArIG1vZGVsLnR5cGUucmVwbGFjZSgvXlxcdy8sIHcgPT4gdy50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVuaXVtW2NvbW1hbmROYW1lXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWMoKCkgPT4gdGhpcy5zZWxlbml1bVtjb21tYW5kTmFtZV0uYXBwbHkodGhpcy5zZWxlbml1bSwgbW9kZWwuYXJncykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IHRoaXMuZXJyb3JNZXNzYWdlICsgSlNPTi5zdHJpbmdpZnkobW9kZWwpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAnRVJST1IgJyArIGVycm9yTWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGV4ZWMgKGV4ZWM6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZXhlYygpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnT0snO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAnRVJST1InO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bSB7XG4gICAgZXhwb3J0IGNsYXNzIFNlbmRlciBleHRlbmRzIEJhc2Uge1xuICAgICAgICBwcml2YXRlIG1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZVJlcG9zaXRvcnkgPSBuZXcgTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeSgpO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBtYW5hZ2VyOiBTZXJ2aWNlcy5UYWIuTWFuYWdlciwgcHJpdmF0ZSBtZXNzYWdlRGlzcGF0Y2hlcjogQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIpIHtcbiAgICAgICAgICAgIHN1cGVyKCgpID0+IG5ldyAoPGFueT53aW5kb3cpLkNocm9tZUV4dGVuc2lvbkJhY2tlZFNlbGVuaXVtKG1hbmFnZXIuZ2V0VGFiVVJMKCksICcnKSk7XG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLnNob3VsZEFib3J0Q3VycmVudENvbW1hbmQgPSAoKSA9PiBmYWxzZTtcbiAgICAgICAgICAgIG1hbmFnZXIub25Db25uZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAoPGFueT53aW5kb3cpLnNob3VsZEFib3J0Q3VycmVudENvbW1hbmQgPSAoKSA9PiBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWFuYWdlci5vbkRpc2Nvbm5lY3QoKCkgPT4ge1xuICAgICAgICAgICAgICAgICg8YW55PndpbmRvdykuc2hvdWxkQWJvcnRDdXJyZW50Q29tbWFuZCA9ICgpID0+IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYWRkQ29tbWFuZExpc3QgKGNvbW1hbmRMaXN0OiBDYXQuTW9kZWxzLkNvbW1hbmRMaXN0Lk1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnRlc3RDYXNlLmNvbW1hbmRzID0gW107XG4gICAgICAgICAgICBjb21tYW5kTGlzdC5nZXRMaXN0KCkuZm9yRWFjaCgoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzZWxDb21tYW5kID0gbmV3ICg8YW55PndpbmRvdykuQ29tbWFuZChjb21tYW5kLnR5cGUsIGNvbW1hbmQudGFyZ2V0LCBjb21tYW5kLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRlc3RDYXNlLmNvbW1hbmRzLnB1c2goc2VsQ29tbWFuZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBleGVjdXRlKGNvbW1hbmQ6IHN0cmluZywgYXJnczogc3RyaW5nW10sIGNhbGxiYWNrOiAocmVzcG9uc2U6IHN0cmluZywgcmVzdWx0OiBib29sZWFuKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSBuZXcgTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5Nb2RlbChjb21tYW5kLCBhcmdzKTtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLk1vZGVsKG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5zZW5kTWVzc2FnZSh0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZVJlcG9zaXRvcnkudG9PYmplY3QobWVzc2FnZSkpLnRoZW4oKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VEaXNwYXRjaGVyLmRpc3BhdGNoKG1lc3NhZ2UsIHtcbiAgICAgICAgICAgICAgICAgICAgTWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRNb2RlbCA6IChtZXNzYWdlOiBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0Lk1vZGVsKSA9PiBjYWxsYmFjaygnT0snLCB0cnVlKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYiB7XG4gICAgZXhwb3J0IGNsYXNzIEluaXRpYWxpemVyIHtcbiAgICAgICAgcHJpdmF0ZSBpbmplY3RTY3JpcHRzIDogSW5qZWN0U2NyaXB0cztcbiAgICAgICAgcHJpdmF0ZSBtYW5hZ2VyIDogTWFuYWdlcjtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgY2FsbGVkVGFiSWQ6IHN0cmluZykge1xuICAgICAgICAgICAgdmFyIGluamVjdFNjcmlwdHMgPSBDb25maWcuaW5qZWN0U2NyaXB0cztcbiAgICAgICAgICAgIHRoaXMuaW5qZWN0U2NyaXB0cyA9IG5ldyBJbmplY3RTY3JpcHRzKGluamVjdFNjcmlwdHMpO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRUYWIodGhpcy5jYWxsZWRUYWJJZCkudGhlbigodGFiOiBjaHJvbWUudGFicy5UYWIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyID0gbmV3IE1hbmFnZXIodGFiLCAobWFuYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5qZWN0U2NyaXB0cy5jb25uZWN0KG1hbmFnZXIuZ2V0VGFiSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIuY29ubmVjdCgpLnRoZW4oKCkgPT4gcmVzb2x2ZSh0aGlzLm1hbmFnZXIpKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBnZXRUYWIgKGNhbGxlZFRhYklkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKHRhYjogY2hyb21lLnRhYnMuVGFiKSA9PiB2b2lkLCByZWplY3Q6IChlcnJvck1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLmdldChwYXJzZUludChjYWxsZWRUYWJJZCksICh0YWI6IGNocm9tZS50YWJzLlRhYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFiICYmIHRhYi5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0YWIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdTZWN1cml0eSBFcnJvci5cXG5kb2VzIG5vdCBydW4gb24gXCJjaHJvbWU6Ly9cIiBwYWdlLlxcbicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiIHtcbiAgICBleHBvcnQgY2xhc3MgSW5qZWN0U2NyaXB0cyB7XG4gICAgICAgIHByaXZhdGUgaW5qZWN0U2NyaXB0cyA6IHN0cmluZ1tdO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBpbmplY3RTY3JpcHRzXykge1xuICAgICAgICAgICAgdGhpcy5pbmplY3RTY3JpcHRzID0gaW5qZWN0U2NyaXB0c18uc2xpY2UoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgZG91YmxlIGxvYWRpbmcgZmxhZy5cbiAgICAgICAgcHJpdmF0ZSBleGVjdXRlRW5kICh0YWJpZDogbnVtYmVyLCByZXNvbHZlOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICBjaHJvbWUudGFicy5leGVjdXRlU2NyaXB0KHRhYmlkLCB7XG4gICAgICAgICAgICAgICAgJ2NvZGUnIDogJ3RoaXMuZXh0ZW5zaW9uQ29udGVudExvYWRlZCA9IHRydWUnXG4gICAgICAgICAgICB9LCByZXNvbHZlKTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGV4ZWN1dGVTY3JpcHQgKHRhYmlkOiBudW1iZXIsIGluamVjdFNjcmlwdDogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAvL+OCs+ODvOODieOCknhocuOBp+OCreODo+ODg+OCt+ODpeOBl+OBpmZpbGXjgafjga/jgarjgY/jgIFjb2Rl44Gn5rih44GX44Gm44Om44O844K25YuV5L2c44KS44OW44Ot44OD44Kv44GX44Gk44Gk5a6f6KGM44Gn44GN44Gq44GE44GLXG4gICAgICAgICAgICAgICAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdCh0YWJpZCwge1xuICAgICAgICAgICAgICAgICAgICAncnVuQXQnIDogJ2RvY3VtZW50X3N0YXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgJ2ZpbGUnIDogaW5qZWN0U2NyaXB0XG4gICAgICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmplY3RTY3JpcHRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZVNjcmlwdCh0YWJpZCwgdGhpcy5pbmplY3RTY3JpcHRzLnNoaWZ0KCkpLnRoZW4ocmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlRW5kKHRhYmlkLCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbm5lY3QodGFiaWQ6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZG91YmxlIGxvYWRpbmcgY2hlY2suXG4gICAgICAgICAgICAgICAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdCh0YWJpZCwge1xuICAgICAgICAgICAgICAgICAgICAnY29kZScgOiAndGhpcy5leHRlbnNpb25Db250ZW50TG9hZGVkJ1xuICAgICAgICAgICAgICAgIH0sIChyZXN1bHQ6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lmxlbmd0aCAmJiByZXN1bHRbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlU2NyaXB0KHRhYmlkLCB0aGlzLmluamVjdFNjcmlwdHMuc2hpZnQoKSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIge1xuICAgIGV4cG9ydCBjbGFzcyBNYW5hZ2VyIHtcbiAgICAgICAgcHJpdmF0ZSB0YWI6IE1vZGVsO1xuICAgICAgICBwcml2YXRlIG9uTWVzc2FnZUxpc3RlbmVyczogQXJyYXk8KG1lc3NhZ2U6IE9iamVjdCkgPT4gdm9pZD4gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBvbkRpc2Nvbm5lY3RMaXN0ZW5lcnM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG4gICAgICAgIHByaXZhdGUgb25Db25uZWN0TGlzdGVuZXJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgICAgIHRhYjogY2hyb21lLnRhYnMuVGFiLFxuICAgICAgICAgICAgcHJpdmF0ZSBpbml0aWFsaXplOiAobWFuYWdlcjogTWFuYWdlcikgPT4gUHJvbWlzZTx2b2lkPlxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsKHRhYik7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBjbG9zZU1lc3NhZ2UgPSAnQ2xvc2UgdGVzdCBjYXNlPyc7XG4gICAgICAgIGNvbm5lY3QgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSh0aGlzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYi5jb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YWIuYWRkTGlzdGVuZXIoJ29uUmVtb3ZlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0odGhpcy5jbG9zZU1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMudGFiLmFkZExpc3RlbmVyKCdvblVwZGF0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVsb2FkVGFiKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIHJlbG9hZFRhYiAoKSB7XG4gICAgICAgICAgICB2YXIgdGFiSWQgPSB0aGlzLnRhYi5nZXRUYWJJZCgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiAoKSA9PiB2b2lkLCByZWplY3Q6IChlcnJvck1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh0aGlzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnRhYnMuZ2V0KHRhYklkLCAodGFiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYiA9IG5ldyBNb2RlbCh0YWIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RMaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlTGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gdGhpcy50YWIub25NZXNzYWdlKGxpc3RlbmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdExpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IHRoaXMudGFiLm9uRGlzY29ubmVjdChsaXN0ZW5lcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0VGFiSWQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFiLmdldFRhYklkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0VGFiVVJMICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYi5nZXRUYWJVUkwoKTtcbiAgICAgICAgfVxuICAgICAgICBwb3N0TWVzc2FnZSAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLnRhYi5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBzZW5kTWVzc2FnZSAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWIuc2VuZE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25NZXNzYWdlIChjYWxsYmFjazogKG1lc3NhZ2U6IE9iamVjdCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICB0aGlzLnRhYi5vbk1lc3NhZ2UoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIG9uQ29ubmVjdCAoY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRoaXMub25Db25uZWN0TGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIG9uRGlzY29ubmVjdCAoY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0TGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgdGhpcy50YWIub25EaXNjb25uZWN0KGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgICAgICBwcml2YXRlIHBvcnQ6IGNocm9tZS5ydW50aW1lLlBvcnQ7XG4gICAgICAgIHByaXZhdGUgc2VuZE1lc3NhZ2VSZXNwb25zZUludGVydmFsID0gMTAwMDtcbiAgICAgICAgY29uc3RydWN0b3IgKFxuICAgICAgICAgICAgcHJpdmF0ZSB0YWI6IGNocm9tZS50YWJzLlRhYlxuICAgICAgICApIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBjaHJvbWUudGFicy5jb25uZWN0KHRoaXMudGFiLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRUYWJJZCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWIuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0VGFiVVJMICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYi51cmw7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBjaGVja09uVXBkYXRlZCAoKSB7XG4gICAgICAgICAgICB2YXIgdXBkYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKCh0YWJJZDogbnVtYmVyLCBjaGFuZ2VJbmZvOiBjaHJvbWUudGFicy5UYWJDaGFuZ2VJbmZvLCB0YWI6IGNocm9tZS50YWJzLlRhYikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhYi5pZCAhPT0gdGFiSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlSW5mby5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdvblVwZGF0ZWQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHBvc3RNZXNzYWdlIChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBzZW5kTWVzc2FnZSAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRoaXMudGFiLmlkLCBtZXNzYWdlLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCdtaXNzaW5nIHJlc3VsdCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50YWIuc3RhdHVzICE9PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0Lk1vZGVsKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG1lc3NhZ2UuY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKHN1Y2Nlc3MsIHRoaXMuc2VuZE1lc3NhZ2VSZXNwb25zZUludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdCgnc2VuZE1lc3NhZ2UgdGltZW91dCcpO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLnNlbmRNZXNzYWdlUmVzcG9uc2VJbnRlcnZhbCAqIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdCAoKSB7XG4gICAgICAgICAgICB0aGlzLnBvcnQub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2hyb21lLnRhYnMub25SZW1vdmVkLmFkZExpc3RlbmVyKCh0YWJJZDogbnVtYmVyLCByZW1vdmVJbmZvOiBjaHJvbWUudGFicy5UYWJSZW1vdmVJbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFiLmlkICE9PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnb25SZW1vdmVkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tPblVwZGF0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgICBvbk1lc3NhZ2UgKGNhbGxiYWNrOiAobWVzc2FnZTogT2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0aGlzLnBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBvbkRpc2Nvbm5lY3QgKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0aGlzLnBvcnQub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGRpc2Nvbm5lY3QgKCkge1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gbnVsbDtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBvcnQ7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIE1lc3NhZ2UuTW9kZWwge1xuICAgICAgICBzdGF0aWMgbWVzc2FnZU5hbWUgPSAnYWRkQ29tbWVudCc7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgY29tbWFuZDogQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsLCBwdWJsaWMgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQ6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQge1xuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGV4dGVuZHMgTWVzc2FnZS5SZXBvc2l0b3J5IHtcbiAgICAgICAgcmVwb3NpdG9yeSA9IG5ldyBDYXQuTW9kZWxzLkNvbW1hbmQuUmVwb3NpdG9yeSgpO1xuXG4gICAgICAgIHRvT2JqZWN0IChtZXNzYWdlOiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZScgOiBNb2RlbC5tZXNzYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb21tYW5kJyA6IHRoaXMucmVwb3NpdG9yeS50b09iamVjdChtZXNzYWdlLmNvbW1hbmQpLFxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQnIDogbWVzc2FnZS5pbnNlcnRCZWZvcmVMYXN0Q29tbWFuZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICB2YXIgY29tbWFuZCA9IHRoaXMucmVwb3NpdG9yeS5mcm9tT2JqZWN0KG1lc3NhZ2VbJ2NvbnRlbnQnXVsnY29tbWFuZCddKTtcbiAgICAgICAgICAgIHZhciBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCA9ICEhbWVzc2FnZVsnY29udGVudCddWydpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCddO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbChjb21tYW5kLCBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ3BsYXlDb21tYW5kJztcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kOiBDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kIHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIE1lc3NhZ2UuUmVwb3NpdG9yeSB7XG4gICAgICAgIHJlcG9zaXRvcnkgPSBuZXcgQ2F0Lk1vZGVscy5Db21tYW5kLlJlcG9zaXRvcnkoKTtcblxuICAgICAgICB0b09iamVjdCAobWVzc2FnZTogTW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ25hbWUnIDogTW9kZWwubWVzc2FnZU5hbWUsXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQnIDogdGhpcy5yZXBvc2l0b3J5LnRvT2JqZWN0KG1lc3NhZ2UuY29tbWFuZClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKHRoaXMucmVwb3NpdG9yeS5mcm9tT2JqZWN0KG1lc3NhZ2VbJ2NvbnRlbnQnXSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZExpc3Qge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIE1lc3NhZ2UuTW9kZWwge1xuICAgICAgICBzdGF0aWMgbWVzc2FnZU5hbWUgPSAncGxheUNvbW1hbmRMaXN0JztcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kTGlzdDogQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5Nb2RlbCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIE1lc3NhZ2UuUmVwb3NpdG9yeSB7XG4gICAgICAgIHJlcG9zaXRvcnkgPSBuZXcgQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5SZXBvc2l0b3J5KCk7XG5cbiAgICAgICAgdG9PYmplY3QgKG1lc3NhZ2U6IE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICduYW1lJyA6IE1vZGVsLm1lc3NhZ2VOYW1lLFxuICAgICAgICAgICAgICAgICdjb250ZW50JyA6IHRoaXMucmVwb3NpdG9yeS50b09iamVjdChtZXNzYWdlLmNvbW1hbmRMaXN0KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwodGhpcy5yZXBvc2l0b3J5LmZyb21PYmplY3QobWVzc2FnZVsnY29udGVudCddKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ3BsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlJztcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kOiBTZWxlbml1bUNvbW1hbmQuTW9kZWwpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlIHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIE1lc3NhZ2UuUmVwb3NpdG9yeSB7XG4gICAgICAgIHJlcG9zaXRvcnkgPSBuZXcgU2VsZW5pdW1Db21tYW5kLlJlcG9zaXRvcnkoKTtcblxuICAgICAgICB0b09iamVjdCAobWVzc2FnZTogTW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ25hbWUnIDogTW9kZWwubWVzc2FnZU5hbWUsXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQnIDogdGhpcy5yZXBvc2l0b3J5LnRvT2JqZWN0KG1lc3NhZ2UuY29tbWFuZClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKHRoaXMucmVwb3NpdG9yeS5mcm9tT2JqZWN0KG1lc3NhZ2VbJ2NvbnRlbnQnXSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ3BsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQnO1xuICAgICAgICBwcml2YXRlIHZhbGlkQ29tbWFuZCA9IFtcbiAgICAgICAgICAgICdPSycsXG4gICAgICAgICAgICAnTkcnXG4gICAgICAgIF07XG4gICAgICAgIC8vcGFnZSByZWxvYWRpbmdcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kOiBzdHJpbmcgPSAnT0snKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgaWYgKCF+dGhpcy52YWxpZENvbW1hbmQuaW5kZXhPZihjb21tYW5kKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjb21tYW5kLCcrY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQge1xuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGV4dGVuZHMgTWVzc2FnZS5SZXBvc2l0b3J5IHtcbiAgICAgICAgdG9PYmplY3QgKG1lc3NhZ2U6IE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICduYW1lJyA6IE1vZGVsLm1lc3NhZ2VOYW1lLFxuICAgICAgICAgICAgICAgICdjb250ZW50JyA6IG1lc3NhZ2UuY29tbWFuZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwobWVzc2FnZVsnY29udGVudCddKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==