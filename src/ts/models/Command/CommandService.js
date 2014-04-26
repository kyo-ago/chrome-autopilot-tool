/// <reference path="../../base/Service.ts" />
/// <reference path="./Command.ts" />
/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Command;
(function (Command) {
    var CommandService = (function (_super) {
        __extends(CommandService, _super);
        function CommandService() {
            _super.call(this);
        }
        CommandService.prototype.play = function (command) {
            return new Promise(function (resolve) {
                command;
                resolve(1);
            });
        };
        return CommandService;
    })(Service.Service);
    Command.CommandService = CommandService;
})(Command || (Command = {}));
//# sourceMappingURL=CommandService.js.map
