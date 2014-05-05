/// <reference path="../Identity" />

module Base.Entity {
    export class Model extends Identity {
        constructor (public identity: Identity = new Identity(new UUID.UUID)) {
            super(identity.uuid)
        }
        eq (e: Model): boolean {
            return super.eq(e.identity);
        }
    }
}
