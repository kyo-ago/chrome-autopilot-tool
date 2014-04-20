/// <reference path="../lib/UUID.ts" />
var Entity;
(function (_Entity) {
    var Identity = (function () {
        function Identity(identity) {
            this.identity = identity;
        }
        Identity.prototype.eq = function (e) {
            return this.identity.toString() === e.identity.toString();
        };
        return Identity;
    })();
    _Entity.Identity = Identity;

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
    _Entity.Entity = Entity;
})(Entity || (Entity = {}));
//# sourceMappingURL=entity.js.map
