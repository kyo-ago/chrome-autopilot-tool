/// <reference path="../../Base/Entity/Model.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ts;
(function (ts) {
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
            })(ts.Base.Entity.Model);
            Command.Model = Model;
        })(Models.Command || (Models.Command = {}));
        var Command = Models.Command;
    })(ts.Models || (ts.Models = {}));
    var Models = ts.Models;
})(ts || (ts = {}));
