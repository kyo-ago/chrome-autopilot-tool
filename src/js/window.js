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
var Message;
(function (Message) {
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model() {
            _super.apply(this, arguments);
        }
        return Model;
    })(Base.Entity);
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
    (function (AddComment) {
        var Repository = (function (_super) {
            __extends(Repository, _super);
            function Repository() {
                _super.apply(this, arguments);
                this.commandRepository = new Command.Repository();
            }
            Repository.prototype.toObject = function (message) {
                return {
                    'name': Message.AddComment.Model.name,
                    'command': this.commandRepository.toObject(message.command),
                    'insertBeforeLastCommand': message.insertBeforeLastCommand
                };
            };
            Repository.prototype.fromObject = function (message) {
                var command = this.commandRepository.fromObject(message.command);
                var insertBeforeLastCommand = !!message.insertBeforeLastCommand;
                return new Message.AddComment.Model(command, insertBeforeLastCommand);
            };
            return Repository;
        })(Message.Repository);
        AddComment.Repository = Repository;
    })(Message.AddComment || (Message.AddComment = {}));
    var AddComment = Message.AddComment;
})(Message || (Message = {}));
var Message;
(function (Message) {
    var Manager = (function () {
        function Manager() {
            this.messageAddCommentModel = new Message.AddComment.Repository();
        }
        Manager.prototype.dispatch = function (message, dispatcher) {
            if (message.name == Message.AddComment.Model.name) {
                dispatcher.MessageAddCommentModel(this.messageAddCommentModel.fromObject(message));
            }
        };
        return Manager;
    })();
    Message.Manager = Manager;
})(Message || (Message = {}));
var Autopilot;
(function (Autopilot) {
    var Controller = (function () {
        function Controller($scope, chromeTabs, commandList, messageManage) {
            $scope.commandList = commandList;
            $scope.playAll = function () {
                chromeTabs.postMessage({
                    'name': 'playAll',
                    'commands': JSON.stringify($scope.commandList.commands)
                });
            };
            chromeTabs.onMessage.addListener(function (msg) {
                messageManage.dispatch(msg, {
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

var ChromeTabs = (function () {
    function ChromeTabs() {
        this.errorMessage = 'Security Error.\ndoes not run on "chrome://" page.\n';
    }
    ChromeTabs.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            chrome.tabs.query({
                'active': true,
                'windowType': 'normal'
            }, function (tabs) {
                var tab = tabs[0];
                if (tab.url.match(/^chrome:/)) {
                    return reject(_this.errorMessage);
                }
                var port = chrome.tabs.connect(tab.id);
                resolve(port);
            });
        });
    };
    return ChromeTabs;
})();
var autopilotApp;
Promise.all([
    new Promise(function (resolve, reject) {
        (new ChromeTabs()).connect().then(resolve).catch(reject);
    }),
    new Promise(function (resolve, reject) {
        angular.element(document).ready(resolve);
    })
]).then(function (results) {
    var port = results[0];
    autopilotApp = angular.module('AutopilotApp', ['ui.sortable']).factory('chromeTabs', function () {
        return port;
    }).service('commandList', CommandList.Model).service('messageManage', Message.Manager).controller('Autopilot', Autopilot.Controller);
    angular.bootstrap(document, ['AutopilotApp']);
}).catch(function (messages) {
    alert(messages.join('\n'));
});
