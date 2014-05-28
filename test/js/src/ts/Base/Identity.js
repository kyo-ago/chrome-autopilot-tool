/// <reference path="UUID" />
var ts;
(function (ts) {
    (function (Base) {
        var Identity = (function () {
            function Identity(uuid) {
                if (typeof uuid === "undefined") { uuid = new ts.UUID.UUID; }
                this.uuid = uuid;
            }
            Identity.prototype.eq = function (e) {
                return this.uuid.toString() === e.uuid.toString();
            };
            return Identity;
        })();
        Base.Identity = Identity;
    })(ts.Base || (ts.Base = {}));
    var Base = ts.Base;
})(ts || (ts = {}));
