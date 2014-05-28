/// <reference path="../../Base/EntityList/Model.ts" />
/// <reference path="../Command/Model.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ts;
(function (ts) {
    (function (Models) {
        (function (CommandList) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(commands, name, url) {
                    if (typeof commands === "undefined") { commands = []; }
                    if (typeof name === "undefined") { name = ''; }
                    if (typeof url === "undefined") { url = ''; }
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
            })(ts.Base.EntityList.Model);
            CommandList.Model = Model;
        })(Models.CommandList || (Models.CommandList = {}));
        var CommandList = Models.CommandList;
    })(ts.Models || (ts.Models = {}));
    var Models = ts.Models;
})(ts || (ts = {}));
