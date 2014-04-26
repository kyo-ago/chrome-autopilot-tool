/// <reference path="../../base/Service.ts" />
/// <reference path="./CommandList.ts" />
/// <reference path="../../DefinitelyTyped/async/async.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CommandList;
(function (CommandList) {
    var CommandListService = (function (_super) {
        __extends(CommandListService, _super);
        function CommandListService(playInterval) {
            if (typeof playInterval === "undefined") { playInterval = 0; }
            _super.call(this);
            this.playInterval = playInterval;
            this.commandService = new Command.CommandService();
            this.playStop = false;
        }
        CommandListService.prototype.stop = function () {
            this.playStop = true;
        };

        CommandListService.prototype.changeInterval = function (newInterval) {
            this.playInterval = newInterval;
        };

        CommandListService.prototype.playAll = function (commandList) {
            return this.playCommands(commandList.commands);
        };

        CommandListService.prototype.play = function (commandList, start, end) {
            return this.playCommands(commandList.commands.splice(start, end));
        };

        CommandListService.prototype.playCommands = function (target) {
            var that = this;
            return new Promise(function (resolve, reject) {
                var callbacks = target.map(function (command) {
                    return function (done) {
                        if (that.playStop) {
                            return reject(undefined);
                        }
                        that.commandService.play(command).then(function () {
                            var args = [];
                            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                                args[_i] = arguments[_i + 0];
                            }
                            return done(null, args);
                        });
                    };
                });
                async.series(callbacks, function (error) {
                    var args = [];
                    for (var _i = 0; _i < (arguments.length - 1); _i++) {
                        args[_i] = arguments[_i + 1];
                    }
                    return resolve(args);
                });
            });
        };
        return CommandListService;
    })(Service.Service);
    CommandList.CommandListService = CommandListService;
})(CommandList || (CommandList = {}));
//# sourceMappingURL=CommandListService.js.map
