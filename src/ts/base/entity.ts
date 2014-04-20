/// <reference path="../lib/UUID.ts" />
module Entity {
    export class Identity {
        private identity: UUID.UUID;
        constructor (identity: UUID.UUID) {
            this.identity = identity;
        }

        eq (e: Identity) {
            return this.identity.toString() === e.identity.toString();
        }
    }

    export class Entity {
        constructor (public identity: Identity = undefined) {
            this.identity = identity || new Identity(new UUID.UUID);
        }

        eq (e: Entity): boolean {

            return this.identity.eq(e.identity);
        }

        _clone (e: Entity) {
            e.identity = this.identity;
            return e;
        }
    }
}
