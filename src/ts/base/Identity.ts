/// <reference path="UUID" />

module ts.Base {
    export class Identity {
        constructor (public uuid: UUID.UUID = new UUID.UUID) {
        }
        eq (e: Identity): boolean {
            return this.uuid.toString() === e.uuid.toString();
        }
    }
}
