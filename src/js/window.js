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
        function Identity(identity) {
            this.identity = identity;
        }
        Identity.prototype.eq = function (e) {
            return this.identity.toString() === e.identity.toString();
        };
        return Identity;
    })();
    Base.Identity = Identity;

    var Entity = (function () {
        function Entity(identity) {
            if (typeof identity === "undefined") { identity = undefined; }
            this.identity = identity;
            this.identity = identity || new Identity(new UUID.UUID);
        }
        Entity.prototype.eq = function (e) {
            return this.identity.eq(e.identity);
        };

        Entity.prototype._clone = function (e) {
            e.identity = this.identity;
            return e;
        };
        return Entity;
    })();
    Base.Entity = Entity;
})(Base || (Base = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Command;
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
        Model.prototype.clone = function (type, target, value) {
            if (typeof type === "undefined") { type = this.type; }
            if (typeof target === "undefined") { target = this.target; }
            if (typeof value === "undefined") { value = this.value; }
            var entity = new Model(type, target, value);
            return _super.prototype._clone.call(this, entity);
        };
        return Model;
    })(Base.Entity);
    Command.Model = Model;
})(Command || (Command = {}));
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
})(Command || (Command = {}));
var AddCommentMessage;
(function (AddCommentMessage) {
    var Model = (function () {
        function Model(command, insertBeforeLastCommand) {
            this.command = command;
            this.insertBeforeLastCommand = insertBeforeLastCommand;
        }
        Model.prototype.equals = function (message) {
            return message.name === name;
        };
        Model.name = 'AddCommentMessage';
        return Model;
    })();
    AddCommentMessage.Model = Model;
})(AddCommentMessage || (AddCommentMessage = {}));
var AddCommentMessage;
(function (AddCommentMessage) {
    var Repository = (function () {
        function Repository() {
        }
        Repository.toMessage = function (command, insertBeforeLastCommand) {
            return {
                'name': AddCommentMessage.Model.name,
                'command': (new Command.Repository()).toObject(command),
                'insertBeforeLastCommand': insertBeforeLastCommand
            };
        };
        Repository.isMessage = function (msg) {
            return msg.name === AddCommentMessage.Model.name;
        };
        Repository.fromMessage = function (msg) {
            var command = (new Command.Repository()).fromObject(msg.command);
            return new AddCommentMessage.Model(command, msg.insertBeforeLastCommand);
        };
        return Repository;
    })();
    AddCommentMessage.Repository = Repository;
})(AddCommentMessage || (AddCommentMessage = {}));
var ChromeTabs = (function () {
    function ChromeTabs() {
        this.ee = new EventEmitter2();
    }
    ChromeTabs.prototype.connect = function () {
        var _this = this;
        this.ee = new EventEmitter2();
        return new Promise(function (resolve, reject) {
            chrome.tabs.query({
                'active': true,
                'windowType': 'normal'
            }, function (tabs) {
                var tab = tabs[0];
                if (tab.url.match(/^chrome:/)) {
                    return reject('Security Error.\ndoes not run on "chrome://" page.');
                }
                var port = chrome.tabs.connect(tab.id, {
                    'name': 'open'
                });
                port.onMessage.addListener(function (msg) {
                    _this.ee.emit('message', msg);
                });
                resolve(function (callback) {
                    _this.ee.addListener('message', callback);
                });
            });
        });
    };
    return ChromeTabs;
})();
var Autopilot;
(function (Autopilot) {
    var Controller = (function () {
        function Controller($scope, chromeTabs, eventEmitter) {
            this.$scope = $scope;
            this.chromeTabs = chromeTabs;
            this.eventEmitter = eventEmitter;
            $scope.ee = eventEmitter;
            chromeTabs.connect().then(function (callback) {
                callback(function (msg) {
                    if (AddCommentMessage.Repository.isMessage(msg)) {
                        var message = AddCommentMessage.Repository.fromMessage(msg);
                        $scope.ee.emit('addCommand', message);
                    }
                });
            }).catch(function (message) {
                alert(message);
            });
        }
        return Controller;
    })();
    Autopilot.Controller = Controller;
})(Autopilot || (Autopilot = {}));
var Base;
(function (Base) {
    var Service = (function () {
        function Service() {
        }
        return Service;
    })();
    Base.Service = Service;
})(Base || (Base = {}));
var Command;
(function (Command) {
    var Service = (function (_super) {
        __extends(Service, _super);
        function Service() {
            _super.call(this);
        }
        Service.prototype.play = function (command) {
            return new Promise(function () {
            });
        };
        return Service;
    })(Base.Service);
    Command.Service = Service;
})(Command || (Command = {}));
var CommandList;
(function (CommandList) {
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(commands, name, url) {
            if (typeof commands === "undefined") { commands = []; }
            if (typeof name === "undefined") { name = ''; }
            if (typeof url === "undefined") { url = ''; }
            _super.call(this);
            this.commands = commands;
            this.name = name;
            this.url = url;
            this.commandService = new Command.Service();
        }
        Model.prototype.clone = function (commands, name, url) {
            if (typeof commands === "undefined") { commands = this.commands; }
            if (typeof name === "undefined") { name = this.name; }
            if (typeof url === "undefined") { url = this.url; }
            var entity = new Model(commands, name, url);
            return _super.prototype._clone.call(this, entity);
        };

        Model.prototype.add = function (command) {
            this.commands.push(command);
        };

        Model.prototype.getCommands = function () {
            return this.commands;
        };

        Model.prototype.splice = function (index, command) {
            this.commands.splice(index, 1, command);
        };

        Model.prototype.replace = function (id, command) {
            this.commands = this.commands.map(function (e) {
                return e.identity.eq(id) ? command : e;
            });
        };

        Model.prototype.remove = function (command) {
            this.commands = this.commands.filter(function (e) {
                return !e.eq(command);
            });
        };

        Model.prototype.clear = function () {
            return _super.prototype._clone.call(this, new Model([]));
        };
        return Model;
    })(Base.Entity);
    CommandList.Model = Model;
})(CommandList || (CommandList = {}));
var CommandList;
(function (CommandList) {
    var Controller = (function () {
        function Controller($scope, eventEmitter) {
            this.$scope = $scope;
            this.eventEmitter = eventEmitter;
            $scope.ee = eventEmitter;
            $scope.commandList = new CommandList.Model();
            $scope.ee.addListener('addCommand', function (message) {
                $scope.$apply(function () {
                    $scope.commandList.add(message.command);
                });
            });
        }
        return Controller;
    })();
    CommandList.Controller = Controller;
})(CommandList || (CommandList = {}));
var Directives;
(function (Directives) {
    var CommandList = (function () {
        function CommandList() {
        }
        CommandList.directive = function () {
            return {
                'restrict': 'E',
                'transclude': 'element',
                'replace': true,
                'link': function ($scope, $element, $attr, ctrl, $transclude) {
                    $scope.$watchCollection('commandList.commands', function (newValue) {
                        console.log(newValue, $element);
                    });
                }
            };
        };
        return CommandList;
    })();
    Directives.CommandList = CommandList;
})(Directives || (Directives = {}));
angular.module('Autopilot', []).factory('chromeTabs', function () {
    return new ChromeTabs();
}).factory('eventEmitter', function () {
    return new EventEmitter2();
}).directive('commandList', Directives.CommandList.directive).controller('Autopilot', Autopilot.Controller).controller('CommandList', CommandList.Controller);
