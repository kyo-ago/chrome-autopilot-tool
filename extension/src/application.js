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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2FwcGxpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlcyI6WyIuLi9zcmMvX2RlZmluZS50cyIsIi4uL3NyYy9CYXNlL0lkZW50aXR5LnRzIiwiLi4vc3JjL0Jhc2UvU2VydmljZS50cyIsIi4uL3NyYy9CYXNlL1VVSUQudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL0NvbnRyb2xsZXJzL0F1dG9waWxvdC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvQ29udHJvbGxlcnMvQ29udGVudFNjcmlwdHNDdHJsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Db250cm9sbGVycy9XaW5kb3dDdHJsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9Db21tYW5kU2VsZWN0TGlzdC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvU2VydmljZXMvQ29uZmlnLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9SZWNvcmRlck9ic2VydmVyLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5L01vZGVsLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5L1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQmFzZS9FbnRpdHlMaXN0L01vZGVsLnRzIiwiLi4vc3JjL0Jhc2UvRW50aXR5TGlzdC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvTW9kZWxzL0NvbW1hbmRMaXN0L01vZGVsLnRzIiwiLi4vc3JjL01vZGVscy9Db21tYW5kTGlzdC9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvQ29tbWFuZEdyaWQvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL0Rpc3BhdGNoZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvU2VsZW5pdW1Db21tYW5kL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvU2VsZW5pdW1Db21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1NlbGVuaXVtL0Jhc2UudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1NlbGVuaXVtL1JlY2VpdmVyLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9TZWxlbml1bS9TZW5kZXIudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1RhYi9Jbml0aWFsaXplci50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvU2VydmljZXMvVGFiL0luamVjdFNjcmlwdHMudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL1NlcnZpY2VzL1RhYi9NYW5hZ2VyLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9TZXJ2aWNlcy9UYWIvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL0FkZENvbW1hbmQvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL0FkZENvbW1hbmQvUmVwb3NpdG9yeS50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvUGxheUNvbW1hbmQvTW9kZWwudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlDb21tYW5kL1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlDb21tYW5kTGlzdC9Nb2RlbC50cyIsIi4uL3NyYy9BcHBsaWNhdGlvbnMvTW9kZWxzL01lc3NhZ2UvUGxheUNvbW1hbmRMaXN0L1JlcG9zaXRvcnkudHMiLCIuLi9zcmMvQXBwbGljYXRpb25zL01vZGVscy9NZXNzYWdlL1BsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlL01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS9SZXBvc2l0b3J5LnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0L01vZGVsLnRzIiwiLi4vc3JjL0FwcGxpY2F0aW9ucy9Nb2RlbHMvTWVzc2FnZS9QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0L1JlcG9zaXRvcnkudHMiXSwibmFtZXMiOlsiQ2F0IiwiQ2F0LkJhc2UiLCJDYXQuQmFzZS5JZGVudGl0eSIsIkNhdC5CYXNlLklkZW50aXR5LmNvbnN0cnVjdG9yIiwiQ2F0LkJhc2UuSWRlbnRpdHkuZXEiLCJDYXQuQmFzZS5TZXJ2aWNlIiwiQ2F0LkJhc2UuU2VydmljZS5jb25zdHJ1Y3RvciIsIkNhdC5VVUlEIiwiQ2F0LlVVSUQuSW52YWxpZFVVSURGb3JtYXQiLCJDYXQuVVVJRC5JbnZhbGlkVVVJREZvcm1hdC5jb25zdHJ1Y3RvciIsIkNhdC5VVUlELlVVSUQiLCJDYXQuVVVJRC5VVUlELmNvbnN0cnVjdG9yIiwiQ2F0LlVVSUQuVVVJRC50b1N0cmluZyIsIkNhdC5VVUlELlVVSUQuZnJvbVN0cmluZyIsIkNhdC5VVUlELlVVSUQuUzQiLCJDYXQuQXBwbGljYXRpb24iLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuQXV0b3BpbG90IiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdC5Db250cm9sbGVyIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdC5Db250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkF1dG9waWxvdC5Db250cm9sbGVyLmJpbmRUYWJNYW5hZ2VyIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLkNvbnRlbnRTY3JpcHRzQ3RybCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuQ29udGVudFNjcmlwdHNDdHJsLm9uTWVzc2FnZSIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwuYWRkQ29tbWFuZCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5Db250ZW50U2NyaXB0c0N0cmwuaW5pdGlhbGl6ZSIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsIiwiQ2F0LkFwcGxpY2F0aW9uLkNvbnRyb2xsZXJzLldpbmRvd0N0cmwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uQ29udHJvbGxlcnMuV2luZG93Q3RybC5pbml0QW5ndWxhciIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsLmluaXRDb21tYW5kU2VsZWN0TGlzdCIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsLmluaXRUYWJJbml0aWFsaXplciIsIkNhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5XaW5kb3dDdHJsLmluaXRpYWxpemUiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29tbWFuZFNlbGVjdExpc3QubG9hZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5Db21tYW5kU2VsZWN0TGlzdC5nZXREb2NSb290IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbW1hbmRTZWxlY3RMaXN0LmdldHMiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuQ29uZmlnIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbmZpZy5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXIuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuUmVjb3JkZXJPYnNlcnZlci5nZXRVc2VyTG9nIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXIuYWRkQ29tbWFuZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5SZWNvcmRlck9ic2VydmVyLm9uVW5sb2FkRG9jdW1lbnQiLCJDYXQuQmFzZS5FbnRpdHkiLCJDYXQuQmFzZS5FbnRpdHkuTW9kZWwiLCJDYXQuQmFzZS5FbnRpdHkuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQmFzZS5FbnRpdHkuTW9kZWwuZXEiLCJDYXQuQmFzZS5FbnRpdHlMaXN0IiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbCIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsLmFkZCIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwuZ2V0TGlzdCIsIkNhdC5CYXNlLkVudGl0eUxpc3QuTW9kZWwuc3BsaWNlIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbC5yZXBsYWNlIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbC5yZW1vdmUiLCJDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsLmNsZWFyIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5SZXBvc2l0b3J5IiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkJhc2UuRW50aXR5TGlzdC5SZXBvc2l0b3J5LnRvRW50aXR5TGlzdCIsIkNhdC5CYXNlLkVudGl0eUxpc3QuUmVwb3NpdG9yeS5mcm9tRW50aXR5TGlzdCIsIkNhdC5Nb2RlbHMiLCJDYXQuTW9kZWxzLkNvbW1hbmQiLCJDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwiLCJDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuTW9kZWxzLkNvbW1hbmQuUmVwb3NpdG9yeSIsIkNhdC5Nb2RlbHMuQ29tbWFuZC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0Lk1vZGVscy5Db21tYW5kLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuTW9kZWxzLkNvbW1hbmQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0Lk1vZGVscy5Db21tYW5kTGlzdCIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuTW9kZWwiLCJDYXQuTW9kZWxzLkNvbW1hbmRMaXN0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5Nb2RlbC5jbGVhciIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeSIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeS50b09iamVjdCIsIkNhdC5Nb2RlbHMuQ29tbWFuZExpc3QuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscyIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuQ29tbWFuZEdyaWQiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLkNvbW1hbmRHcmlkLk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5Db21tYW5kR3JpZC5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuQ29tbWFuZEdyaWQuTW9kZWwuZ2V0Q29tbWFuZExpc3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIuZGlzcGF0Y2giLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kLk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuU2VsZW5pdW1Db21tYW5kLlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5TZWxlbml1bUNvbW1hbmQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLkJhc2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uQmFzZS5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5CYXNlLmdldEludGVydmFsIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLkJhc2Uuc3RhcnQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uQmFzZS5zZXRBcGlEb2NzIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyLmV4ZWN1dGUiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uUmVjZWl2ZXIuZXhlYyIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXIiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0uU2VuZGVyLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlNlbmRlci5hZGRDb21tYW5kTGlzdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXIuZXhlY3V0ZSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluaXRpYWxpemVyIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Jbml0aWFsaXplci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5pdGlhbGl6ZXIuc3RhcnQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluaXRpYWxpemVyLmdldFRhYiIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5qZWN0U2NyaXB0cyIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5qZWN0U2NyaXB0cy5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuSW5qZWN0U2NyaXB0cy5leGVjdXRlRW5kIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5JbmplY3RTY3JpcHRzLmV4ZWN1dGVTY3JpcHQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLkluamVjdFNjcmlwdHMuY29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5jb25uZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLnJlbG9hZFRhYiIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5nZXRUYWJJZCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5nZXRUYWJVUkwiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIucG9zdE1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIuc2VuZE1lc3NhZ2UiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1hbmFnZXIub25NZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5NYW5hZ2VyLm9uQ29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTWFuYWdlci5vbkRpc2Nvbm5lY3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuZ2V0VGFiSWQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLmdldFRhYlVSTCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuY2hlY2tPblVwZGF0ZWQiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLnBvc3RNZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5zZW5kTWVzc2FnZSIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwuY29ubmVjdCIsIkNhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIuTW9kZWwub25NZXNzYWdlIiwiQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYi5Nb2RlbC5vbkRpc2Nvbm5lY3QiLCJDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiLk1vZGVsLmRpc2Nvbm5lY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50Lk1vZGVsIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5SZXBvc2l0b3J5IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuUmVwb3NpdG9yeS5jb25zdHJ1Y3RvciIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5BZGRDb21tZW50LlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuQWRkQ29tbWVudC5SZXBvc2l0b3J5LmZyb21PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZExpc3QuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kTGlzdC5SZXBvc2l0b3J5LmZyb21PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5SZXBvc2l0b3J5LmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLlJlcG9zaXRvcnkudG9PYmplY3QiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeS5mcm9tT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbCIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0Lk1vZGVsLmNvbnN0cnVjdG9yIiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeSIsIkNhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0LlJlcG9zaXRvcnkuY29uc3RydWN0b3IiLCJDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5SZXBvc2l0b3J5LnRvT2JqZWN0IiwiQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeS5mcm9tT2JqZWN0Il0sIm1hcHBpbmdzIjoiQUFLTSxNQUFPLENBQUMsWUFBWSxHQUFTLE1BQU8sQ0FBQyxhQUFhLENBQUM7QUNMekQsSUFBTyxHQUFHLENBUVQ7QUFS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c0IvRCxNQUFNQSxHQUFOQSxrQkFBTUEsS0FBTkEsa0JBQU1BLFFBWTVCQTtJQUFEQSxDQUFDQSxFQVpVZixXQUFXQSxHQUFYQSxlQUFXQSxLQUFYQSxlQUFXQSxRQVlyQkE7QUFBREEsQ0FBQ0EsRUFaTSxHQUFHLEtBQUgsR0FBRyxRQVlUIiwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSBtb2R1bGUgY2hyb21lLmV4dGVuc2lvbiB7XG4gICAgdmFyIG9uQ29ubmVjdDogY2hyb21lLnJ1bnRpbWUuRXh0ZW5zaW9uQ29ubmVjdEV2ZW50O1xufVxuXG5kZWNsYXJlIGNsYXNzIEV2ZW50RW1pdHRlciBleHRlbmRzIGV2ZW50ZW1pdHRlcjIuRXZlbnRFbWl0dGVyMiB7fVxuKDxhbnk+d2luZG93KS5FdmVudEVtaXR0ZXIgPSAoPGFueT53aW5kb3cpLkV2ZW50RW1pdHRlcjI7XG5cbmRlY2xhcmUgdmFyIFRlc3RJbml0aWFsaXplOiBib29sZWFuOyIsIm1vZHVsZSBDYXQuQmFzZSB7XG4gICAgZXhwb3J0IGNsYXNzIElkZW50aXR5IHtcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyB1dWlkOiBVVUlELlVVSUQgPSBuZXcgVVVJRC5VVUlEKSB7XG4gICAgICAgIH1cbiAgICAgICAgZXEgKGU6IElkZW50aXR5KTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51dWlkLnRvU3RyaW5nKCkgPT09IGUudXVpZC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5CYXNlIHtcbiAgICBleHBvcnQgY2xhc3MgU2VydmljZSB7fVxufVxuIiwibW9kdWxlIENhdC5VVUlEIHtcbiAgICBjbGFzcyBJbnZhbGlkVVVJREZvcm1hdCB7fVxuICAgIGV4cG9ydCBjbGFzcyBVVUlEIHtcbiAgICAgICAgdXVpZDogc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yIChpZDogc3RyaW5nID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51dWlkID0gW1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUzQoKSxcbiAgICAgICAgICAgICAgICAgICAgXCItXCIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUzQoKSxcbiAgICAgICAgICAgICAgICAgICAgXCItXCIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUzQoKSxcbiAgICAgICAgICAgICAgICAgICAgXCItXCIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUzQoKSxcbiAgICAgICAgICAgICAgICAgICAgXCItXCIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUzQoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TNCgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlM0KClcbiAgICAgICAgICAgICAgICBdLmpvaW4oJycpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGlkLm1hdGNoKC9eXFx3ezh9LVxcd3s0fS1cXHd7NH0tXFx3ezR9LVxcd3sxMn0kLyk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRVVUlERm9ybWF0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnV1aWQgPSBpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvU3RyaW5nICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnV1aWQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZnJvbVN0cmluZyAoaWQ6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBVVUlEKGlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgUzQoKSB7XG4gICAgICAgICAgICB2YXIgcmFuZCA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuICgocmFuZCAqIDB4MTAwMDApfDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XG4gICAgICAgIH1cbiAgICB9fVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycy5BdXRvcGlsb3Qge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2NvcGUgZXh0ZW5kcyBuZy5JU2NvcGUge1xuICAgICAgICBwbGF5QWxsOiAoKSA9PiB2b2lkO1xuICAgICAgICBhZGRDb21tYW5kOiAoKSA9PiB2b2lkO1xuICAgICAgICBkZWxldGVDb21tYW5kOiAoY29tbWFuZDogQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsKSA9PiB2b2lkO1xuICAgICAgICBjb21tYW5kR3JpZDogQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5Db21tYW5kR3JpZC5Nb2RlbDtcbiAgICAgICAgc3RhcnRSZWNvcmRpbmc6ICgpID0+IHZvaWQ7XG4gICAgICAgIHN0b3BSZWNvcmRpbmc6ICgpID0+IHZvaWQ7XG4gICAgICAgIGNoYW5nZVNwZWVkOiAoKSA9PiB2b2lkO1xuICAgICAgICBwbGF5Q3VycmVudDogKCkgPT4gdm9pZDtcbiAgICAgICAgcGxheVN0b3A6ICgpID0+IHZvaWQ7XG4gICAgICAgIHJlY29yZGluZ1N0YXR1czogYm9vbGVhbjtcbiAgICAgICAgYmFzZVVSTDogc3RyaW5nO1xuICAgICAgICBwbGF5U3BlZWQ6IHN0cmluZztcbiAgICAgICAgc2VsZWN0TGlzdDogc3RyaW5nW107XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyIHtcbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICAkc2NvcGU6IFNjb3BlLFxuICAgICAgICAgICAgbWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIsXG4gICAgICAgICAgICBjb21tYW5kR3JpZDogQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5Db21tYW5kR3JpZC5Nb2RlbCxcbiAgICAgICAgICAgIG1lc3NhZ2VEaXNwYXRjaGVyOiBNb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyLFxuICAgICAgICAgICAgc2VsZW5pdW1TZW5kZXI6IENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXIsXG4gICAgICAgICAgICBjb21tYW5kU2VsZWN0TGlzdDogQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLkNvbW1hbmRTZWxlY3RMaXN0XG4gICAgICAgICkge1xuICAgICAgICAgICAgJHNjb3BlLmNvbW1hbmRHcmlkID0gY29tbWFuZEdyaWQ7XG4gICAgICAgICAgICAkc2NvcGUucGxheVNwZWVkID0gJzEwMCc7XG5cbiAgICAgICAgICAgICRzY29wZS5wbGF5QWxsID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVuaXVtU2VuZGVyLmFkZENvbW1hbmRMaXN0KCRzY29wZS5jb21tYW5kR3JpZC5nZXRDb21tYW5kTGlzdCgpKTtcbiAgICAgICAgICAgICAgICBzZWxlbml1bVNlbmRlci5zdGFydCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5jaGFuZ2VTcGVlZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlbml1bVNlbmRlci5pbnRlcnZhbCA9IHBhcnNlSW50KCRzY29wZS5wbGF5U3BlZWQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5hZGRDb21tYW5kID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5jb21tYW5kR3JpZC5hZGQobmV3IENhdC5Nb2RlbHMuQ29tbWFuZC5Nb2RlbCgpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUuZGVsZXRlQ29tbWFuZCA9IChjb21tYW5kKSA9PiB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbW1hbmRHcmlkLnJlbW92ZShjb21tYW5kKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUucmVjb3JkaW5nU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5zdGFydFJlY29yZGluZyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVjb3JkaW5nU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUuc3RvcFJlY29yZGluZyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVjb3JkaW5nU3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLnBsYXlDdXJyZW50ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vQFRPRE9cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUucGxheVN0b3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9AVE9ET1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RMaXN0ID0gY29tbWFuZFNlbGVjdExpc3QuZ2V0cygpLm1hcCgoZWxlbSkgPT4gZWxlbS5nZXRBdHRyaWJ1dGUoJ25hbWUnKSk7XG4gICAgICAgICAgICB0aGlzLmJpbmRUYWJNYW5hZ2VyKCRzY29wZSwgbWFuYWdlciwgbWVzc2FnZURpc3BhdGNoZXIpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgYmluZFRhYk1hbmFnZXIgKFxuICAgICAgICAgICAgJHNjb3BlOiBTY29wZSxcbiAgICAgICAgICAgIG1hbmFnZXI6IFNlcnZpY2VzLlRhYi5NYW5hZ2VyLFxuICAgICAgICAgICAgbWVzc2FnZURpc3BhdGNoZXI6IE1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBtYW5hZ2VyLm9uTWVzc2FnZSgobWVzc2FnZTogT2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZURpc3BhdGNoZXIuZGlzcGF0Y2gobWVzc2FnZSwge1xuICAgICAgICAgICAgICAgICAgICBNZXNzYWdlQWRkQ29tbWVudE1vZGVsIDogKG1lc3NhZ2U6IE1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuTW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJHNjb3BlLnJlY29yZGluZ1N0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJHNjb3BlLmNvbW1hbmRHcmlkLmdldExpc3QoKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJhc2VVUkwgPSBtYW5hZ2VyLmdldFRhYlVSTCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tbWFuZEdyaWQuYWRkKG5ldyBDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwoJ29wZW4nLCAnJywgJHNjb3BlLmJhc2VVUkwpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbW1hbmRHcmlkLmFkZChtZXNzYWdlLmNvbW1hbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycyB7XG4gICAgZXhwb3J0IGNsYXNzIENvbnRlbnRTY3JpcHRzQ3RybCB7XG4gICAgICAgIHByaXZhdGUgbWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRSZXBvc2l0b3J5IDogTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5SZXBvc2l0b3J5O1xuICAgICAgICBwcml2YXRlIG1lc3NhZ2VBZGRDb21tZW50UmVwb3NpdG9yeSA6IE1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuUmVwb3NpdG9yeTtcbiAgICAgICAgcHJpdmF0ZSByZWNvcmRlck9ic2VydmVyIDogU2VydmljZXMuUmVjb3JkZXJPYnNlcnZlcjtcbiAgICAgICAgcHJpdmF0ZSBtZXNzYWdlRGlzcGF0Y2hlciA6IE1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXI7XG4gICAgICAgIHByaXZhdGUgU2VsZW5pdW1SZWNlaXZlciA6IFNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBwb3J0OiBjaHJvbWUucnVudGltZS5Qb3J0KSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0UmVwb3NpdG9yeSA9IG5ldyBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0LlJlcG9zaXRvcnkoKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUFkZENvbW1lbnRSZXBvc2l0b3J5ID0gbmV3IE1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQuUmVwb3NpdG9yeSgpO1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlck9ic2VydmVyID0gbmV3IFNlcnZpY2VzLlJlY29yZGVyT2JzZXJ2ZXIoKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZURpc3BhdGNoZXIgPSBuZXcgTW9kZWxzLk1lc3NhZ2UuRGlzcGF0Y2hlcigpO1xuICAgICAgICAgICAgdGhpcy5TZWxlbml1bVJlY2VpdmVyID0gbmV3IFNlcnZpY2VzLlNlbGVuaXVtLlJlY2VpdmVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgb25NZXNzYWdlIChtZXNzYWdlOiBPYmplY3QsIHNlbmRlcjogY2hyb21lLnJ1bnRpbWUuTWVzc2FnZVNlbmRlciwgc2VuZFJlc3BvbnNlOiAobWVzc2FnZTogT2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VEaXNwYXRjaGVyLmRpc3BhdGNoKG1lc3NhZ2UsIHtcbiAgICAgICAgICAgICAgICBNZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVNb2RlbCA6IChtZXNzYWdlOiBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5Nb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWNvcmRlci5kZXJlZ2lzdGVyKHRoaXMucmVjb3JkZXJPYnNlcnZlciwgd2luZG93KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuU2VsZW5pdW1SZWNlaXZlci5leGVjdXRlKG1lc3NhZ2UuY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgICAgIFJlY29yZGVyLnJlZ2lzdGVyKHRoaXMucmVjb3JkZXJPYnNlcnZlciwgd2luZG93KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdE1lc3NhZ2UgPSBuZXcgTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbChyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UodGhpcy5tZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdFJlcG9zaXRvcnkudG9PYmplY3QocmVzdWx0TWVzc2FnZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgYWRkQ29tbWFuZChjb21tYW5kTmFtZTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZywgdmFsdWU6IHN0cmluZywgd2luZG93OiBXaW5kb3csIGluc2VydEJlZm9yZUxhc3RDb21tYW5kOiBib29sZWFuKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb21tYW5kJyA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJyA6IGNvbW1hbmROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhcmdldCcgOiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnIDogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ2luc2VydEJlZm9yZUxhc3RDb21tYW5kJyA6IGluc2VydEJlZm9yZUxhc3RDb21tYW5kXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBhZGRDb21tZW50TWVzc2FnZSA9IHRoaXMubWVzc2FnZUFkZENvbW1lbnRSZXBvc2l0b3J5LmZyb21PYmplY3QobWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLnBvcnQucG9zdE1lc3NhZ2UodGhpcy5tZXNzYWdlQWRkQ29tbWVudFJlcG9zaXRvcnkudG9PYmplY3QoYWRkQ29tbWVudE1lc3NhZ2UpKTtcbiAgICAgICAgfVxuICAgICAgICBpbml0aWFsaXplICgpIHtcbiAgICAgICAgICAgIFJlY29yZGVyLnJlZ2lzdGVyKHRoaXMucmVjb3JkZXJPYnNlcnZlciwgd2luZG93KTtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkZXJPYnNlcnZlci5hZGRMaXN0ZW5lcignYWRkQ29tbWFuZCcsIChjb21tYW5kTmFtZTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZywgdmFsdWU6IHN0cmluZywgd2luZG93OiBXaW5kb3csIGluc2VydEJlZm9yZUxhc3RDb21tYW5kOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDb21tYW5kKGNvbW1hbmROYW1lLCB0YXJnZXQsIHZhbHVlLCB3aW5kb3csIGluc2VydEJlZm9yZUxhc3RDb21tYW5kKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVjb3JkZXIuZGVyZWdpc3Rlcih0aGlzLnJlY29yZGVyT2JzZXJ2ZXIsIHdpbmRvdyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZTogT2JqZWN0LCBzZW5kZXI6IGNocm9tZS5ydW50aW1lLk1lc3NhZ2VTZW5kZXIsIHNlbmRSZXNwb25zZTogKG1lc3NhZ2U6IE9iamVjdCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwidmFyIGFwcGxpY2F0aW9uU2VydmljZXNTZWxlbml1bVNlbmRlcjogQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlNlbGVuaXVtLlNlbmRlcjtcblxubW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Db250cm9sbGVycyB7XG4gICAgZXhwb3J0IGNsYXNzIFdpbmRvd0N0cmwge1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBjYWxsZWRUYWJJZDogc3RyaW5nKSB7fVxuICAgICAgICBwcml2YXRlIGluaXRBbmd1bGFyIChtYW5hZ2VyLCBjb21tYW5kU2VsZWN0TGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGF1dG9waWxvdEFwcCA9IGFuZ3VsYXIubW9kdWxlKCdBdXRvcGlsb3RBcHAnLCBbJ3VpLnNvcnRhYmxlJ10pXG4gICAgICAgICAgICAgICAgICAgIC5mYWN0b3J5KCdtYW5hZ2VyJywgKCkgPT4gbWFuYWdlcilcbiAgICAgICAgICAgICAgICAgICAgLmZhY3RvcnkoJ2NvbW1hbmRTZWxlY3RMaXN0JywgKCkgPT4gY29tbWFuZFNlbGVjdExpc3QpXG4gICAgICAgICAgICAgICAgICAgIC5zZXJ2aWNlKCdtZXNzYWdlRGlzcGF0Y2hlcicsIE1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIpXG4gICAgICAgICAgICAgICAgICAgIC5mYWN0b3J5KCdzZWxlbml1bVNlbmRlcicsIChtYW5hZ2VyOiBTZXJ2aWNlcy5UYWIuTWFuYWdlciwgbWVzc2FnZURpc3BhdGNoZXI6IE1vZGVscy5NZXNzYWdlLkRpc3BhdGNoZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uU2VydmljZXNTZWxlbml1bVNlbmRlciA9IG5ldyBTZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXIobWFuYWdlciwgbWVzc2FnZURpc3BhdGNoZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcGxpY2F0aW9uU2VydmljZXNTZWxlbml1bVNlbmRlcjtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZhY3RvcnkoJ2NvbW1hbmRHcmlkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbHMuQ29tbWFuZEdyaWQuTW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvbnRyb2xsZXIoJ0F1dG9waWxvdCcsIENvbnRyb2xsZXJzLkF1dG9waWxvdC5Db250cm9sbGVyKVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmJvb3RzdHJhcChkb2N1bWVudCwgWydBdXRvcGlsb3RBcHAnXSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShhdXRvcGlsb3RBcHApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBpbml0Q29tbWFuZFNlbGVjdExpc3QgKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVuaXVtQXBpWE1MRmlsZSA9IGNocm9tZS5ydW50aW1lLmdldFVSTChTZXJ2aWNlcy5Db25maWcuc2VsZW5pdW1BcGlYTUwpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKGNvbW1hbmRTZWxlY3RMaXN0OiBTZXJ2aWNlcy5Db21tYW5kU2VsZWN0TGlzdCkgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1hbmRTZWxlY3RMaXN0ID0gbmV3IFNlcnZpY2VzLkNvbW1hbmRTZWxlY3RMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRTZWxlY3RMaXN0LmxvYWQoc2VsZW5pdW1BcGlYTUxGaWxlKS50aGVuKCgpID0+IHJlc29sdmUoY29tbWFuZFNlbGVjdExpc3QpKS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlOiAoKSA9PiB2b2lkLCByZWplY3Q6IChlcnJvck1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlcy5TZWxlbml1bS5TZW5kZXIuc2V0QXBpRG9jcyhzZWxlbml1bUFwaVhNTEZpbGUpLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLnJlYWR5KHJlc29sdmUpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGluaXRUYWJJbml0aWFsaXplciAocmVzb2x2ZSwgY2F0Y2hFcnJvcikge1xuICAgICAgICAgICAgKG5ldyBQcm9taXNlKChyZXNvbHZlOiAobWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIpID0+IHZvaWQsIHJlamVjdDogKGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGluaXRpYWxpemVyID0gbmV3IFNlcnZpY2VzLlRhYi5Jbml0aWFsaXplcih0aGlzLmNhbGxlZFRhYklkKTtcbiAgICAgICAgICAgICAgICBpbml0aWFsaXplci5zdGFydCgpLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pKS50aGVuKChtYW5hZ2VyOiBTZXJ2aWNlcy5UYWIuTWFuYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdENvbW1hbmRTZWxlY3RMaXN0KCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tbWFuZFNlbGVjdExpc3QgPSByZXN1bHRzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdEFuZ3VsYXIobWFuYWdlciwgY29tbWFuZFNlbGVjdExpc3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGNhdGNoRXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChjYXRjaEVycm9yKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGNhdGNoRXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGluaXRpYWxpemUgKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHRoaXMuaW5pdFRhYkluaXRpYWxpemVyLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcyB7XG4gICAgZXhwb3J0IGNsYXNzIENvbW1hbmRTZWxlY3RMaXN0IHtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXJyb3JNZXNzYWdlID0gJ2NvbW1hbmQgbGlzdCB4bWwgbG9hZCBmYWlsZWQuXFxuJztcbiAgICAgICAgcHJpdmF0ZSBkb2N1bWVudEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgICAgICBsb2FkIChmaWxlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGZpbGUpO1xuICAgICAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAwICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChDb21tYW5kU2VsZWN0TGlzdC5lcnJvck1lc3NhZ2UgKyBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50RWxlbWVudCA9IHhoci5yZXNwb25zZVhNTC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0RG9jUm9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0cyAoKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbCh0aGlzLmRvY3VtZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmdW5jdGlvbicpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMge1xuICAgIGV4cG9ydCBjbGFzcyBDb25maWcge1xuICAgICAgICBzdGF0aWMgaW5qZWN0U2NyaXB0cyA9IFtcbiAgICAgICAgICAgIFwic3JjL2xpYi94cGF0aC5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvbGliL2Nzcy1zZWxlY3Rvci5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3Rvb2xzLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvaHRtbHV0aWxzLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tYnJvd3NlcmRldGVjdC5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3NlbGVuaXVtLWF0b21zLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tYnJvd3NlcmJvdC5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3NlbGVuaXVtLWFwaS5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3NlbGVuaXVtLWV4ZWN1dGlvbmxvb3AuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9zZWxlbml1bS10ZXN0cnVubmVyLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tY29tbWFuZGhhbmRsZXJzLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvc2VsZW5pdW0tcnVubmVyLmpzXCIsXG4gICAgICAgICAgICBcInNyYy9zZWxlbml1bS1pZGUvcmVjb3JkZXIuanNcIixcbiAgICAgICAgICAgIFwic3JjL3NlbGVuaXVtLWlkZS9yZWNvcmRlci1oYW5kbGVycy5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvc2VsZW5pdW0taWRlL3Rlc3RDYXNlLmpzXCIsXG4gICAgICAgICAgICBcImJvd2VyX2NvbXBvbmVudHMvZXZlbnRlbWl0dGVyMi9saWIvZXZlbnRlbWl0dGVyMi5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvX2RlZmluZS5qc1wiLFxuICAgICAgICAgICAgXCJzcmMvYXBwbGljYXRpb24uanNcIixcbiAgICAgICAgICAgIFwic3JjL2NvbnRlbnRfc2NyaXB0cy5qc1wiXG4gICAgICAgIF07XG4gICAgICAgIHN0YXRpYyBzZWxlbml1bUFwaVhNTCA9ICcvc3JjL3NlbGVuaXVtLWlkZS9pZWRvYy1jb3JlLnhtbCc7XG4gICAgfVxufVxuIiwiLypcbiogTW9jayBSZWNvcmRlck9ic2VydmVyIGZvciBTZWxlbml1bSBSZWNvcmRlclxuKiAqL1xubW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcyB7XG4gICAgZXhwb3J0IGNsYXNzIFJlY29yZGVyT2JzZXJ2ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXJ7XG4gICAgICAgIHJlY29yZGluZ0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBpc1NpZGViYXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZ2V0VXNlckxvZyAoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZTtcbiAgICAgICAgfVxuICAgICAgICBhZGRDb21tYW5kIChjb21tYW5kOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCB3aW5kb3c6IFdpbmRvdywgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQ6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnYWRkQ29tbWFuZCcsIGNvbW1hbmQsIHRhcmdldCwgdmFsdWUsIHdpbmRvdywgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIG9uVW5sb2FkRG9jdW1lbnQgKGRvYzogRG9jdW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnb25VbmxvYWREb2N1bWVudCcsIGRvYyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkJhc2UuRW50aXR5IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBJZGVudGl0eSB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgaWRlbnRpdHk6IElkZW50aXR5ID0gbmV3IElkZW50aXR5KG5ldyBVVUlELlVVSUQpKSB7XG4gICAgICAgICAgICBzdXBlcihpZGVudGl0eS51dWlkKVxuICAgICAgICB9XG4gICAgICAgIGVxIChlOiBNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmVxKGUuaWRlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5CYXNlLkVudGl0eSB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXBvc2l0b3J5PE0gZXh0ZW5kcyBNb2RlbD4ge1xuICAgICAgICB0b09iamVjdCAoZW50aXR5OiBNKSA6IE9iamVjdDtcbiAgICAgICAgZnJvbU9iamVjdCAob2JqZWN0OiBPYmplY3QpIDogTTtcbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkJhc2UuRW50aXR5TGlzdCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsPEUgZXh0ZW5kcyBFbnRpdHkuTW9kZWw+IGV4dGVuZHMgRW50aXR5Lk1vZGVsIHtcbiAgICAgICAgbGlzdDogRVtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGxpc3Q6IEVbXSA9IFtdKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBhZGQoZW50aXR5OiBFKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QucHVzaChlbnRpdHkpO1xuICAgICAgICB9XG4gICAgICAgIGdldExpc3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0O1xuICAgICAgICB9XG4gICAgICAgIHNwbGljZShpbmRleDogbnVtYmVyLCBlbnRpdHk6IEUpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdC5zcGxpY2UoaW5kZXgsIDEsIGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVwbGFjZShpZGVudGl0eTogSWRlbnRpdHksIGVudGl0eTogRSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5saXN0Lm1hcChcbiAgICAgICAgICAgICAgICAoZSkgPT4gZS5pZGVudGl0eS5lcShpZGVudGl0eSkgPyBlbnRpdHkgOiBlXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJlbW92ZShlbnRpdHk6IEUpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdCA9IHRoaXMubGlzdC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKGUpID0+ICFlLmVxKGVudGl0eSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgY2xlYXIoKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQmFzZS5FbnRpdHlMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeTxCIGV4dGVuZHMgRW50aXR5Lk1vZGVsLCBNIGV4dGVuZHMgRW50aXR5TGlzdC5Nb2RlbDxFbnRpdHkuTW9kZWw+PiB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGVudGl0eVJlcG9zaXRvcnk6IEVudGl0eS5SZXBvc2l0b3J5PEI+KSB7XG4gICAgICAgIH1cbiAgICAgICAgdG9FbnRpdHlMaXN0IChlbnRpdHlMaXN0OiBNKSB7XG4gICAgICAgICAgICByZXR1cm4gZW50aXR5TGlzdC5nZXRMaXN0KCkubWFwKChlbnRpdHkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gPE0+KDxhbnk+dGhpcy5lbnRpdHlSZXBvc2l0b3J5KS50b09iamVjdChlbnRpdHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnJvbUVudGl0eUxpc3QgKGVudGl0eUxpc3Q6IE9iamVjdFtdKSB7XG4gICAgICAgICAgICByZXR1cm4gZW50aXR5TGlzdC5tYXAoKGVudGl0eSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVudGl0eVJlcG9zaXRvcnkuZnJvbU9iamVjdChlbnRpdHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0Lk1vZGVscy5Db21tYW5kIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHkuTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICBwdWJsaWMgdHlwZSA9ICcnLFxuICAgICAgICAgICAgcHVibGljIHRhcmdldCA9ICcnLFxuICAgICAgICAgICAgcHVibGljIHZhbHVlID0gJydcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5Nb2RlbHMuQ29tbWFuZCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBJTW9kZWxPYmplY3Qge1xuICAgICAgICB0eXBlOiBzdHJpbmc7XG4gICAgICAgIHRhcmdldDogc3RyaW5nO1xuICAgICAgICB2YWx1ZTogc3RyaW5nO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBpbXBsZW1lbnRzIENhdC5CYXNlLkVudGl0eS5SZXBvc2l0b3J5PE1vZGVsPiB7XG4gICAgICAgIHRvT2JqZWN0IChjb21tYW5kOiBNb2RlbCk6IElNb2RlbE9iamVjdCB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICd0eXBlJyA6IGNvbW1hbmQudHlwZSxcbiAgICAgICAgICAgICAgICAndGFyZ2V0JyA6IGNvbW1hbmQudGFyZ2V0LFxuICAgICAgICAgICAgICAgICd2YWx1ZScgOiBjb21tYW5kLnZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZyb21PYmplY3QgKGNvbW1hbmQ6IElNb2RlbE9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbChjb21tYW5kLnR5cGUsIGNvbW1hbmQudGFyZ2V0LCBjb21tYW5kLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuTW9kZWxzLkNvbW1hbmRMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHlMaXN0Lk1vZGVsPENvbW1hbmQuTW9kZWw+IHtcbiAgICAgICAgY29uc3RydWN0b3IgKFxuICAgICAgICAgICAgY29tbWFuZHM6IENvbW1hbmQuTW9kZWxbXSA9IFtdLFxuICAgICAgICAgICAgcHVibGljIG5hbWUgPSAnJyxcbiAgICAgICAgICAgIHB1YmxpYyB1cmwgPSAnJ1xuICAgICAgICApIHtcbiAgICAgICAgICAgIHN1cGVyKGNvbW1hbmRzKTtcbiAgICAgICAgfVxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy51cmwgPSAnJztcbiAgICAgICAgICAgIHN1cGVyLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0Lk1vZGVscy5Db21tYW5kTGlzdCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBDYXQuQmFzZS5FbnRpdHlMaXN0LlJlcG9zaXRvcnk8Q29tbWFuZC5Nb2RlbCwgTW9kZWw+IGltcGxlbWVudHMgQ2F0LkJhc2UuRW50aXR5LlJlcG9zaXRvcnk8TW9kZWw+IHtcbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgc3VwZXIobmV3IENvbW1hbmQuUmVwb3NpdG9yeSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvT2JqZWN0IChjb21tYW5kTGlzdDogTW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ2NvbW1hbmRMaXN0JyA6IHN1cGVyLnRvRW50aXR5TGlzdChjb21tYW5kTGlzdCksXG4gICAgICAgICAgICAgICAgJ25hbWUnIDogY29tbWFuZExpc3QubmFtZSxcbiAgICAgICAgICAgICAgICAndXJsJyA6IGNvbW1hbmRMaXN0LnVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChjb21tYW5kTGlzdDoge1xuICAgICAgICAgICAgJ2NvbW1hbmRMaXN0JyA6IE9iamVjdFtdXG4gICAgICAgICAgICAnbmFtZScgOiBzdHJpbmdcbiAgICAgICAgICAgICd1cmwnIDogc3RyaW5nXG4gICAgICAgIH0pIHtcbiAgICAgICAgICAgIHZhciBjb21tYW5kTGlzdE9iamVjdCA9IHN1cGVyLmZyb21FbnRpdHlMaXN0KGNvbW1hbmRMaXN0LmNvbW1hbmRMaXN0KTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwoY29tbWFuZExpc3RPYmplY3QsIGNvbW1hbmRMaXN0Lm5hbWUsIGNvbW1hbmRMaXN0LnVybCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5Db21tYW5kR3JpZCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgQ2F0LkJhc2UuRW50aXR5TGlzdC5Nb2RlbDxDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWw+IHtcbiAgICAgICAgZ2V0Q29tbWFuZExpc3QoKSB7XG4gICAgICAgICAgICB2YXIgY29tbWFuZHMgPSB0aGlzLmdldExpc3QoKS5maWx0ZXIoKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFjb21tYW5kLnR5cGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBjb21tYW5kTGlzdCA9IG5ldyBDYXQuTW9kZWxzLkNvbW1hbmRMaXN0Lk1vZGVsKGNvbW1hbmRzKTtcbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kTGlzdDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2Uge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGlzcGF0Y2hNYXAge1xuICAgICAgICBNZXNzYWdlQWRkQ29tbWVudE1vZGVsPyA6IChtZXNzYWdlOiBBZGRDb21tZW50Lk1vZGVsKSA9PiB2b2lkO1xuICAgICAgICBNZXNzYWdlUGxheUNvbW1hbmRNb2RlbD8gOiAobWVzc2FnZTogUGxheUNvbW1hbmQuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIE1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbD8gOiAobWVzc2FnZTogUGxheUNvbW1hbmRMaXN0Lk1vZGVsKSA9PiB2b2lkO1xuICAgICAgICBNZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVNb2RlbD8gOiAobWVzc2FnZTogUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuTW9kZWwpID0+IHZvaWQ7XG4gICAgICAgIE1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWw/IDogKG1lc3NhZ2U6IFBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuTW9kZWwpID0+IHZvaWQ7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBEaXNwYXRjaGVyIHtcbiAgICAgICAgbWVzc2FnZUFkZENvbW1lbnRNb2RlbCA9IG5ldyBBZGRDb21tZW50LlJlcG9zaXRvcnkoKTtcbiAgICAgICAgbWVzc2FnZVBsYXlDb21tYW5kTW9kZWwgPSBuZXcgUGxheUNvbW1hbmQuUmVwb3NpdG9yeSgpO1xuICAgICAgICBtZXNzYWdlUGxheUNvbW1hbmRMaXN0TW9kZWwgPSBuZXcgUGxheUNvbW1hbmRMaXN0LlJlcG9zaXRvcnkoKTtcbiAgICAgICAgbWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlTW9kZWwgPSBuZXcgUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGUuUmVwb3NpdG9yeSgpO1xuICAgICAgICBtZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdE1vZGVsID0gbmV3IFBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuUmVwb3NpdG9yeSgpO1xuXG4gICAgICAgIGRpc3BhdGNoIChtZXNzYWdlOiBPYmplY3QsIGRpc3BhdGNoZXI6IERpc3BhdGNoTWFwKSB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZVsnbmFtZSddID09IEFkZENvbW1lbnQuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VBZGRDb21tZW50TW9kZWwodGhpcy5tZXNzYWdlQWRkQ29tbWVudE1vZGVsLmZyb21PYmplY3QobWVzc2FnZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlWyduYW1lJ10gPT0gUGxheUNvbW1hbmQuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VQbGF5Q29tbWFuZE1vZGVsKHRoaXMubWVzc2FnZVBsYXlDb21tYW5kTW9kZWwuZnJvbU9iamVjdChtZXNzYWdlKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2VbJ25hbWUnXSA9PSBQbGF5Q29tbWFuZExpc3QuTW9kZWwubWVzc2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLk1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbCh0aGlzLm1lc3NhZ2VQbGF5Q29tbWFuZExpc3RNb2RlbC5mcm9tT2JqZWN0KG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZVsnbmFtZSddID09IFBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLk1vZGVsLm1lc3NhZ2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5NZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVNb2RlbCh0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZU1vZGVsLmZyb21PYmplY3QobWVzc2FnZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlWyduYW1lJ10gPT0gUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbC5tZXNzYWdlTmFtZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuTWVzc2FnZVBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHRNb2RlbCh0aGlzLm1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWwuZnJvbU9iamVjdChtZXNzYWdlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBtZXNzYWdlOiAnICsgSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2Uge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIEJhc2UuRW50aXR5Lk1vZGVsIHtcbiAgICB9XG59IiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZSB7XG4gICAgZXhwb3J0IGNsYXNzIFJlcG9zaXRvcnkgaW1wbGVtZW50cyBCYXNlLkVudGl0eS5SZXBvc2l0b3J5PE1vZGVsPiB7XG4gICAgICAgIHRvT2JqZWN0IChlbnRpdHk6IE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAob2JqZWN0OiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZCB7XG4gICAgZXhwb3J0IGNsYXNzIE1vZGVsIGV4dGVuZHMgQ2F0LkJhc2UuRW50aXR5Lk1vZGVsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKFxuICAgICAgICAgICAgcHVibGljIHR5cGUgPSAnJyxcbiAgICAgICAgICAgIHB1YmxpYyBhcmdzOiBzdHJpbmdbXSA9IFtdXG4gICAgICAgICkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLlNlbGVuaXVtQ29tbWFuZCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBJTW9kZWxPYmplY3Qge1xuICAgICAgICB0eXBlOiBzdHJpbmc7XG4gICAgICAgIGFyZ3M6IHN0cmluZ1tdO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBpbXBsZW1lbnRzIENhdC5CYXNlLkVudGl0eS5SZXBvc2l0b3J5PE1vZGVsPiB7XG4gICAgICAgIHRvT2JqZWN0IChjb21tYW5kOiBNb2RlbCk6IElNb2RlbE9iamVjdCB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICd0eXBlJyA6IGNvbW1hbmQudHlwZSxcbiAgICAgICAgICAgICAgICAnYXJncycgOiBjb21tYW5kLmFyZ3NcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAoY29tbWFuZDogSU1vZGVsT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKGNvbW1hbmQudHlwZSwgY29tbWFuZC5hcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0ge1xuICAgIGV4cG9ydCBjbGFzcyBCYXNlIHtcbiAgICAgICAgc2VsZW5pdW06IGFueTtcbiAgICAgICAgY29tbWFuZEZhY3Rvcnk6IGFueTtcbiAgICAgICAgY3VycmVudFRlc3Q6IGFueTtcbiAgICAgICAgdGVzdENhc2U6IGFueTtcbiAgICAgICAgaW50ZXJ2YWw6IG51bWJlciA9IDE7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICAvLyBmb3Igc2VsZW5pdW0tcnVubmVyXG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLmdldEJyb3dzZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdGVkQnJvd3NlcicgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY29udGVudFdpbmRvdycgOiB3aW5kb3dcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5sYXN0V2luZG93ID0gd2luZG93O1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS50ZXN0Q2FzZSA9IG5ldyAoPGFueT53aW5kb3cpLlRlc3RDYXNlO1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5zZWxlbml1bSA9IGNhbGxiYWNrKCk7XG5cbiAgICAgICAgICAgICg8YW55PndpbmRvdykuZWRpdG9yID0ge1xuICAgICAgICAgICAgICAgICdhcHAnIDoge1xuICAgICAgICAgICAgICAgICAgICAnZ2V0T3B0aW9ucycgOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0aW1lb3V0JyA6IHRoaXMuaW50ZXJ2YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICd2aWV3JyA6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3Jvd1VwZGF0ZWQnIDogKCkgPT4ge30sXG4gICAgICAgICAgICAgICAgICAgICdzY3JvbGxUb1JvdycgOiAoKSA9PiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudGVzdENhc2UgPSAoPGFueT53aW5kb3cpLnRlc3RDYXNlO1xuICAgICAgICAgICAgdGhpcy5zZWxlbml1bSA9ICg8YW55PndpbmRvdykuc2VsZW5pdW07XG4gICAgICAgICAgICB0aGlzLnNlbGVuaXVtLmJyb3dzZXJib3Quc2VsZWN0V2luZG93KG51bGwpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kRmFjdG9yeSA9IG5ldyAoPGFueT53aW5kb3cpLkNvbW1hbmRIYW5kbGVyRmFjdG9yeSgpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kRmFjdG9yeS5yZWdpc3RlckFsbCh0aGlzLnNlbGVuaXVtKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRJbnRlcnZhbCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbDtcbiAgICAgICAgfVxuICAgICAgICBzdGFydCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXN0ID0gbmV3ICg8YW55PndpbmRvdykuSURFVGVzdExvb3AodGhpcy5jb21tYW5kRmFjdG9yeSwge1xuICAgICAgICAgICAgICAgICAgICAndGVzdENvbXBsZXRlJyA6IHJlc29sdmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXN0LmdldENvbW1hbmRJbnRlcnZhbCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW50ZXJ2YWwoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZS5kZWJ1Z0NvbnRleHQucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXN0LnN0YXJ0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGVycm9yTWVzc2FnZSA9ICdzZWxlbml1bSBjb21tYW5kIHhtbCBsb2FkIGZhaWxlZC5cXG4nO1xuICAgICAgICBzdGF0aWMgc2V0QXBpRG9jcyAoZmlsZTogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQsIHJlamVjdDogKGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMCAmJiB4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoQmFzZS5lcnJvck1lc3NhZ2UgKyBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAoPGFueT53aW5kb3cpLkNvbW1hbmQuYXBpRG9jdW1lbnRzID0gbmV3IEFycmF5KHhoci5yZXNwb25zZVhNTC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5TZWxlbml1bSB7XG4gICAgZXhwb3J0IGNsYXNzIFJlY2VpdmVyIGV4dGVuZHMgQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHN1cGVyKCgpID0+ICg8YW55PndpbmRvdykuY3JlYXRlU2VsZW5pdW0obG9jYXRpb24uaHJlZiwgdHJ1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgZXJyb3JNZXNzYWdlID0gJ21pc3NpbmcgY29tbWFuZDogJztcbiAgICAgICAgZXhlY3V0ZSAobW9kZWw6IE1vZGVscy5TZWxlbml1bUNvbW1hbmQuTW9kZWwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVuaXVtW21vZGVsLnR5cGVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhlYygoKSA9PiB0aGlzLnNlbGVuaXVtW21vZGVsLnR5cGVdLmFwcGx5KHRoaXMuc2VsZW5pdW0sIG1vZGVsLmFyZ3MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjb21tYW5kTmFtZSA9ICdkbycgKyBtb2RlbC50eXBlLnJlcGxhY2UoL15cXHcvLCB3ID0+IHcudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlbml1bVtjb21tYW5kTmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5leGVjKCgpID0+IHRoaXMuc2VsZW5pdW1bY29tbWFuZE5hbWVdLmFwcGx5KHRoaXMuc2VsZW5pdW0sIG1vZGVsLmFyZ3MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSB0aGlzLmVycm9yTWVzc2FnZSArIEpTT04uc3RyaW5naWZ5KG1vZGVsKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gJ0VSUk9SICcgKyBlcnJvck1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBleGVjIChleGVjOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGV4ZWMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ09LJztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ0VSUk9SJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuU2VsZW5pdW0ge1xuICAgIGV4cG9ydCBjbGFzcyBTZW5kZXIgZXh0ZW5kcyBCYXNlIHtcbiAgICAgICAgcHJpdmF0ZSBtZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVSZXBvc2l0b3J5ID0gbmV3IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlLlJlcG9zaXRvcnkoKTtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgbWFuYWdlcjogU2VydmljZXMuVGFiLk1hbmFnZXIsIHByaXZhdGUgbWVzc2FnZURpc3BhdGNoZXI6IENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5EaXNwYXRjaGVyKSB7XG4gICAgICAgICAgICBzdXBlcigoKSA9PiBuZXcgKDxhbnk+d2luZG93KS5DaHJvbWVFeHRlbnNpb25CYWNrZWRTZWxlbml1bShtYW5hZ2VyLmdldFRhYlVSTCgpLCAnJykpO1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5zaG91bGRBYm9ydEN1cnJlbnRDb21tYW5kID0gKCkgPT4gZmFsc2U7XG4gICAgICAgICAgICBtYW5hZ2VyLm9uQ29ubmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgKDxhbnk+d2luZG93KS5zaG91bGRBYm9ydEN1cnJlbnRDb21tYW5kID0gKCkgPT4gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1hbmFnZXIub25EaXNjb25uZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAoPGFueT53aW5kb3cpLnNob3VsZEFib3J0Q3VycmVudENvbW1hbmQgPSAoKSA9PiBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGFkZENvbW1hbmRMaXN0IChjb21tYW5kTGlzdDogQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5Nb2RlbCkge1xuICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZS5jb21tYW5kcyA9IFtdO1xuICAgICAgICAgICAgY29tbWFuZExpc3QuZ2V0TGlzdCgpLmZvckVhY2goKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsQ29tbWFuZCA9IG5ldyAoPGFueT53aW5kb3cpLkNvbW1hbmQoY29tbWFuZC50eXBlLCBjb21tYW5kLnRhcmdldCwgY29tbWFuZC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXN0Q2FzZS5jb21tYW5kcy5wdXNoKHNlbENvbW1hbmQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhlY3V0ZShjb21tYW5kOiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdLCBjYWxsYmFjazogKHJlc3BvbnNlOiBzdHJpbmcsIHJlc3VsdDogYm9vbGVhbikgPT4gdm9pZCkge1xuICAgICAgICAgICAgdmFyIG1vZGVsID0gbmV3IE1vZGVscy5TZWxlbml1bUNvbW1hbmQuTW9kZWwoY29tbWFuZCwgYXJncyk7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kRXhlY3V0ZS5Nb2RlbChtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuc2VuZE1lc3NhZ2UodGhpcy5tZXNzYWdlUGxheVNlbGVuaXVtQ29tbWFuZEV4ZWN1dGVSZXBvc2l0b3J5LnRvT2JqZWN0KG1lc3NhZ2UpKS50aGVuKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlRGlzcGF0Y2hlci5kaXNwYXRjaChtZXNzYWdlLCB7XG4gICAgICAgICAgICAgICAgICAgIE1lc3NhZ2VQbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0TW9kZWwgOiAobWVzc2FnZTogTW9kZWxzLk1lc3NhZ2UuUGxheVNlbGVuaXVtQ29tbWFuZFJlc3VsdC5Nb2RlbCkgPT4gY2FsbGJhY2soJ09LJywgdHJ1ZSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIge1xuICAgIGV4cG9ydCBjbGFzcyBJbml0aWFsaXplciB7XG4gICAgICAgIHByaXZhdGUgaW5qZWN0U2NyaXB0cyA6IEluamVjdFNjcmlwdHM7XG4gICAgICAgIHByaXZhdGUgbWFuYWdlciA6IE1hbmFnZXI7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGNhbGxlZFRhYklkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBpbmplY3RTY3JpcHRzID0gQ29uZmlnLmluamVjdFNjcmlwdHM7XG4gICAgICAgICAgICB0aGlzLmluamVjdFNjcmlwdHMgPSBuZXcgSW5qZWN0U2NyaXB0cyhpbmplY3RTY3JpcHRzKTtcbiAgICAgICAgfVxuICAgICAgICBzdGFydCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0VGFiKHRoaXMuY2FsbGVkVGFiSWQpLnRoZW4oKHRhYjogY2hyb21lLnRhYnMuVGFiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlciA9IG5ldyBNYW5hZ2VyKHRhYiwgKG1hbmFnZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluamVjdFNjcmlwdHMuY29ubmVjdChtYW5hZ2VyLmdldFRhYklkKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNvbm5lY3QoKS50aGVuKCgpID0+IHJlc29sdmUodGhpcy5tYW5hZ2VyKSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgZ2V0VGFiIChjYWxsZWRUYWJJZDogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICh0YWI6IGNocm9tZS50YWJzLlRhYikgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3JNZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5nZXQocGFyc2VJbnQoY2FsbGVkVGFiSWQpLCAodGFiOiBjaHJvbWUudGFicy5UYWIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYiAmJiB0YWIuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGFiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnU2VjdXJpdHkgRXJyb3IuXFxuZG9lcyBub3QgcnVuIG9uIFwiY2hyb21lOi8vXCIgcGFnZS5cXG4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLlNlcnZpY2VzLlRhYiB7XG4gICAgZXhwb3J0IGNsYXNzIEluamVjdFNjcmlwdHMge1xuICAgICAgICBwcml2YXRlIGluamVjdFNjcmlwdHMgOiBzdHJpbmdbXTtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgaW5qZWN0U2NyaXB0c18pIHtcbiAgICAgICAgICAgIHRoaXMuaW5qZWN0U2NyaXB0cyA9IGluamVjdFNjcmlwdHNfLnNsaWNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IGRvdWJsZSBsb2FkaW5nIGZsYWcuXG4gICAgICAgIHByaXZhdGUgZXhlY3V0ZUVuZCAodGFiaWQ6IG51bWJlciwgcmVzb2x2ZTogKCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdCh0YWJpZCwge1xuICAgICAgICAgICAgICAgICdjb2RlJyA6ICd0aGlzLmV4dGVuc2lvbkNvbnRlbnRMb2FkZWQgPSB0cnVlJ1xuICAgICAgICAgICAgfSwgcmVzb2x2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBleGVjdXRlU2NyaXB0ICh0YWJpZDogbnVtYmVyLCBpbmplY3RTY3JpcHQ6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgLy/jgrPjg7zjg4njgpJ4aHLjgafjgq3jg6Pjg4Pjgrfjg6XjgZfjgaZmaWxl44Gn44Gv44Gq44GP44CBY29kZeOBp+a4oeOBl+OBpuODpuODvOOCtuWLleS9nOOCkuODluODreODg+OCr+OBl+OBpOOBpOWun+ihjOOBp+OBjeOBquOBhOOBi1xuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiaWQsIHtcbiAgICAgICAgICAgICAgICAgICAgJ3J1bkF0JyA6ICdkb2N1bWVudF9zdGFydCcsXG4gICAgICAgICAgICAgICAgICAgICdmaWxlJyA6IGluamVjdFNjcmlwdFxuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5qZWN0U2NyaXB0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGVTY3JpcHQodGFiaWQsIHRoaXMuaW5qZWN0U2NyaXB0cy5zaGlmdCgpKS50aGVuKHJlc29sdmUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUVuZCh0YWJpZCwgcmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25uZWN0KHRhYmlkOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGRvdWJsZSBsb2FkaW5nIGNoZWNrLlxuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiaWQsIHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGUnIDogJ3RoaXMuZXh0ZW5zaW9uQ29udGVudExvYWRlZCdcbiAgICAgICAgICAgICAgICB9LCAocmVzdWx0OiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggJiYgcmVzdWx0WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZVNjcmlwdCh0YWJpZCwgdGhpcy5pbmplY3RTY3JpcHRzLnNoaWZ0KCkpLnRoZW4ocmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uU2VydmljZXMuVGFiIHtcbiAgICBleHBvcnQgY2xhc3MgTWFuYWdlciB7XG4gICAgICAgIHByaXZhdGUgdGFiOiBNb2RlbDtcbiAgICAgICAgcHJpdmF0ZSBvbk1lc3NhZ2VMaXN0ZW5lcnM6IEFycmF5PChtZXNzYWdlOiBPYmplY3QpID0+IHZvaWQ+ID0gW107XG4gICAgICAgIHByaXZhdGUgb25EaXNjb25uZWN0TGlzdGVuZXJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuICAgICAgICBwcml2YXRlIG9uQ29ubmVjdExpc3RlbmVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICB0YWI6IGNocm9tZS50YWJzLlRhYixcbiAgICAgICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZTogKG1hbmFnZXI6IE1hbmFnZXIpID0+IFByb21pc2U8dm9pZD5cbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnRhYiA9IG5ldyBNb2RlbCh0YWIpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgY2xvc2VNZXNzYWdlID0gJ0Nsb3NlIHRlc3QgY2FzZT8nO1xuICAgICAgICBjb25uZWN0ICgpIHtcbiAgICAgICAgICAgIHRoaXMudGFiLmNvbm5lY3QoKTtcbiAgICAgICAgICAgIHRoaXMudGFiLmFkZExpc3RlbmVyKCdvblJlbW92ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0odGhpcy5jbG9zZU1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50YWIuYWRkTGlzdGVuZXIoJ29uVXBkYXRlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZFRhYigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgcmVsb2FkVGFiICgpIHtcbiAgICAgICAgICAgIHZhciB0YWJJZCA9IHRoaXMudGFiLmdldFRhYklkKCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6ICgpID0+IHZvaWQsIHJlamVjdDogKGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplKHRoaXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5nZXQodGFiSWQsICh0YWIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsKHRhYik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29ubmVjdExpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2VMaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiB0aGlzLnRhYi5vbk1lc3NhZ2UobGlzdGVuZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0TGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4gdGhpcy50YWIub25EaXNjb25uZWN0KGxpc3RlbmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBnZXRUYWJJZCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWIuZ2V0VGFiSWQoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRUYWJVUkwgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFiLmdldFRhYlVSTCgpO1xuICAgICAgICB9XG4gICAgICAgIHBvc3RNZXNzYWdlIChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHRoaXMudGFiLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRNZXNzYWdlIChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYi5zZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBvbk1lc3NhZ2UgKGNhbGxiYWNrOiAobWVzc2FnZTogT2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0aGlzLm9uTWVzc2FnZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHRoaXMudGFiLm9uTWVzc2FnZShjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgb25Db25uZWN0IChjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgb25EaXNjb25uZWN0IChjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3RMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICB0aGlzLnRhYi5vbkRpc2Nvbm5lY3QoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5TZXJ2aWNlcy5UYWIge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgICAgIHByaXZhdGUgcG9ydDogY2hyb21lLnJ1bnRpbWUuUG9ydDtcbiAgICAgICAgcHJpdmF0ZSBzZW5kTWVzc2FnZVJlc3BvbnNlSW50ZXJ2YWwgPSAxMDAwO1xuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICBwcml2YXRlIHRhYjogY2hyb21lLnRhYnMuVGFiXG4gICAgICAgICkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IGNocm9tZS50YWJzLmNvbm5lY3QodGhpcy50YWIuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGdldFRhYklkICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYi5pZDtcbiAgICAgICAgfVxuICAgICAgICBnZXRUYWJVUkwgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFiLnVybDtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGNoZWNrT25VcGRhdGVkICgpIHtcbiAgICAgICAgICAgIHZhciB1cGRhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICBjaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkOiBudW1iZXIsIGNoYW5nZUluZm86IGNocm9tZS50YWJzLlRhYkNoYW5nZUluZm8sIHRhYjogY2hyb21lLnRhYnMuVGFiKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFiLmlkICE9PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VJbmZvLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHVwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1cGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ29uVXBkYXRlZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcG9zdE1lc3NhZ2UgKG1lc3NhZ2U6IE9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5wb3J0LnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRNZXNzYWdlIChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGhpcy50YWIuaWQsIG1lc3NhZ2UsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoJ21pc3NpbmcgcmVzdWx0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucG9ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhYi5zdGF0dXMgIT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQuTW9kZWwocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobWVzc2FnZS5jb21tYW5kKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoc3VjY2VzcywgdGhpcy5zZW5kTWVzc2FnZVJlc3BvbnNlSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCdzZW5kTWVzc2FnZSB0aW1lb3V0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHRoaXMuc2VuZE1lc3NhZ2VSZXNwb25zZUludGVydmFsICogMTApO1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25uZWN0ICgpIHtcbiAgICAgICAgICAgIHRoaXMucG9ydC5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjaHJvbWUudGFicy5vblJlbW92ZWQuYWRkTGlzdGVuZXIoKHRhYklkOiBudW1iZXIsIHJlbW92ZUluZm86IGNocm9tZS50YWJzLlRhYlJlbW92ZUluZm8pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YWIuaWQgIT09IHRhYklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdvblJlbW92ZWQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jaGVja09uVXBkYXRlZCgpO1xuICAgICAgICB9XG4gICAgICAgIG9uTWVzc2FnZSAoY2FsbGJhY2s6IChtZXNzYWdlOiBPYmplY3QpID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRoaXMucG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIG9uRGlzY29ubmVjdCAoY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRoaXMucG9ydC5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIGRpc2Nvbm5lY3QgKCkge1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gbnVsbDtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBvcnQ7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIE1lc3NhZ2UuTW9kZWwge1xuICAgICAgICBzdGF0aWMgbWVzc2FnZU5hbWUgPSAnYWRkQ29tbWVudCc7XG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgY29tbWFuZDogQ2F0Lk1vZGVscy5Db21tYW5kLk1vZGVsLCBwdWJsaWMgaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQ6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLkFkZENvbW1lbnQge1xuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGV4dGVuZHMgTWVzc2FnZS5SZXBvc2l0b3J5IHtcbiAgICAgICAgcmVwb3NpdG9yeSA9IG5ldyBDYXQuTW9kZWxzLkNvbW1hbmQuUmVwb3NpdG9yeSgpO1xuXG4gICAgICAgIHRvT2JqZWN0IChtZXNzYWdlOiBNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZScgOiBNb2RlbC5tZXNzYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAnY29udGVudCcgOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb21tYW5kJyA6IHRoaXMucmVwb3NpdG9yeS50b09iamVjdChtZXNzYWdlLmNvbW1hbmQpLFxuICAgICAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlTGFzdENvbW1hbmQnIDogbWVzc2FnZS5pbnNlcnRCZWZvcmVMYXN0Q29tbWFuZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICB2YXIgY29tbWFuZCA9IHRoaXMucmVwb3NpdG9yeS5mcm9tT2JqZWN0KG1lc3NhZ2VbJ2NvbnRlbnQnXVsnY29tbWFuZCddKTtcbiAgICAgICAgICAgIHZhciBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCA9ICEhbWVzc2FnZVsnY29udGVudCddWydpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCddO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb2RlbChjb21tYW5kLCBpbnNlcnRCZWZvcmVMYXN0Q29tbWFuZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ3BsYXlDb21tYW5kJztcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kOiBDYXQuTW9kZWxzLkNvbW1hbmQuTW9kZWwpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlDb21tYW5kIHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIE1lc3NhZ2UuUmVwb3NpdG9yeSB7XG4gICAgICAgIHJlcG9zaXRvcnkgPSBuZXcgQ2F0Lk1vZGVscy5Db21tYW5kLlJlcG9zaXRvcnkoKTtcblxuICAgICAgICB0b09iamVjdCAobWVzc2FnZTogTW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ25hbWUnIDogTW9kZWwubWVzc2FnZU5hbWUsXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQnIDogdGhpcy5yZXBvc2l0b3J5LnRvT2JqZWN0KG1lc3NhZ2UuY29tbWFuZClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKHRoaXMucmVwb3NpdG9yeS5mcm9tT2JqZWN0KG1lc3NhZ2VbJ2NvbnRlbnQnXSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5Q29tbWFuZExpc3Qge1xuICAgIGV4cG9ydCBjbGFzcyBNb2RlbCBleHRlbmRzIE1lc3NhZ2UuTW9kZWwge1xuICAgICAgICBzdGF0aWMgbWVzc2FnZU5hbWUgPSAncGxheUNvbW1hbmRMaXN0JztcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kTGlzdDogQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5Nb2RlbCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBDYXQuQXBwbGljYXRpb24uTW9kZWxzLk1lc3NhZ2UuUGxheUNvbW1hbmRMaXN0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIE1lc3NhZ2UuUmVwb3NpdG9yeSB7XG4gICAgICAgIHJlcG9zaXRvcnkgPSBuZXcgQ2F0Lk1vZGVscy5Db21tYW5kTGlzdC5SZXBvc2l0b3J5KCk7XG5cbiAgICAgICAgdG9PYmplY3QgKG1lc3NhZ2U6IE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICduYW1lJyA6IE1vZGVsLm1lc3NhZ2VOYW1lLFxuICAgICAgICAgICAgICAgICdjb250ZW50JyA6IHRoaXMucmVwb3NpdG9yeS50b09iamVjdChtZXNzYWdlLmNvbW1hbmRMaXN0KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwodGhpcy5yZXBvc2l0b3J5LmZyb21PYmplY3QobWVzc2FnZVsnY29udGVudCddKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlIHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ3BsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlJztcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kOiBTZWxlbml1bUNvbW1hbmQuTW9kZWwpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRFeGVjdXRlIHtcbiAgICBleHBvcnQgY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIE1lc3NhZ2UuUmVwb3NpdG9yeSB7XG4gICAgICAgIHJlcG9zaXRvcnkgPSBuZXcgU2VsZW5pdW1Db21tYW5kLlJlcG9zaXRvcnkoKTtcblxuICAgICAgICB0b09iamVjdCAobWVzc2FnZTogTW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ25hbWUnIDogTW9kZWwubWVzc2FnZU5hbWUsXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQnIDogdGhpcy5yZXBvc2l0b3J5LnRvT2JqZWN0KG1lc3NhZ2UuY29tbWFuZClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnJvbU9iamVjdCAobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZGVsKHRoaXMucmVwb3NpdG9yeS5mcm9tT2JqZWN0KG1lc3NhZ2VbJ2NvbnRlbnQnXSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIENhdC5BcHBsaWNhdGlvbi5Nb2RlbHMuTWVzc2FnZS5QbGF5U2VsZW5pdW1Db21tYW5kUmVzdWx0IHtcbiAgICBleHBvcnQgY2xhc3MgTW9kZWwgZXh0ZW5kcyBNZXNzYWdlLk1vZGVsIHtcbiAgICAgICAgc3RhdGljIG1lc3NhZ2VOYW1lID0gJ3BsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQnO1xuICAgICAgICBwcml2YXRlIHZhbGlkQ29tbWFuZCA9IFtcbiAgICAgICAgICAgICdPSycsXG4gICAgICAgICAgICAnTkcnXG4gICAgICAgIF07XG4gICAgICAgIC8vcGFnZSByZWxvYWRpbmdcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBjb21tYW5kOiBzdHJpbmcgPSAnT0snKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgaWYgKCF+dGhpcy52YWxpZENvbW1hbmQuaW5kZXhPZihjb21tYW5kKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjb21tYW5kLCcrY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgQ2F0LkFwcGxpY2F0aW9uLk1vZGVscy5NZXNzYWdlLlBsYXlTZWxlbml1bUNvbW1hbmRSZXN1bHQge1xuICAgIGV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGV4dGVuZHMgTWVzc2FnZS5SZXBvc2l0b3J5IHtcbiAgICAgICAgdG9PYmplY3QgKG1lc3NhZ2U6IE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICduYW1lJyA6IE1vZGVsLm1lc3NhZ2VOYW1lLFxuICAgICAgICAgICAgICAgICdjb250ZW50JyA6IG1lc3NhZ2UuY29tbWFuZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tT2JqZWN0IChtZXNzYWdlOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9kZWwobWVzc2FnZVsnY29udGVudCddKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==