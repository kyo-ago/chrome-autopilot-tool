/// <reference path="../../base/entity.ts" />
/// <reference path="../Command/Command.ts" />
/// <reference path="../Command/CommandService.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CommandList;
(function (_CommandList) {
    var CommandList = (function (_super) {
        __extends(CommandList, _super);
        function CommandList(commands, name, url) {
            if (typeof name === "undefined") { name = ''; }
            if (typeof url === "undefined") { url = ''; }
            _super.call(this);
            this.commands = commands;
            this.name = name;
            this.url = url;
            this.commandService = new Command.CommandService();
        }
        CommandList.prototype.clone = function (commands, name, url) {
            if (typeof commands === "undefined") { commands = this.commands; }
            if (typeof name === "undefined") { name = this.name; }
            if (typeof url === "undefined") { url = this.url; }
            var entity = new CommandList(commands, name, url);
            return _super.prototype._clone.call(this, entity);
        };

        CommandList.prototype.add = function (command) {
            this.commands.push(command);
            return this.clone();
        };

        CommandList.prototype.splice = function (index, command) {
            this.commands.splice(index, 1, command);
            return this.clone();
        };

        CommandList.prototype.replace = function (id, command) {
            var commands = this.commands.map(function (e) {
                return e.identity.eq(id) ? command : e;
            });
            return this.clone(commands);
        };

        CommandList.prototype.remove = function (command) {
            var commands = this.commands.filter(function (e) {
                return !e.eq(command);
            });
            return this.clone(commands);
        };

        CommandList.prototype.clear = function () {
            return _super.prototype._clone.call(this, new CommandList([]));
        };

        CommandList.prototype.play = function (target) {
            return this.commandService.play(this.commands[target]);
        };
        return CommandList;
    })(Entity.Entity);
    _CommandList.CommandList = CommandList;
})(CommandList || (CommandList = {}));
//# sourceMappingURL=CommandList.js.map
