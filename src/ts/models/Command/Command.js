/// <reference path="../../base/entity.ts" />
/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Command;
(function (_Command) {
    var Command = (function (_super) {
        __extends(Command, _super);
        function Command(type, target, value) {
            if (typeof type === "undefined") { type = ''; }
            if (typeof target === "undefined") { target = ''; }
            if (typeof value === "undefined") { value = ''; }
            _super.call(this);
            this.type = type;
            this.target = target;
            this.value = value;
        }
        Command.prototype.clone = function (type, target, value) {
            if (typeof type === "undefined") { type = this.type; }
            if (typeof target === "undefined") { target = this.target; }
            if (typeof value === "undefined") { value = this.value; }
            var entity = new Command(type, target, value);
            return _super.prototype._clone.call(this, entity);
        };
        return Command;
    })(Entity.Entity);
    _Command.Command = Command;
})(Command || (Command = {}));
//# sourceMappingURL=Command.js.map
