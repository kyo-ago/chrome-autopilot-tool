/// <reference path="./Entity.ts" />

module Base {
    export interface Repository {
        toObject (entity: Base.Entity) : Object;
        fromObject (object: any) : Base.Entity;
    }
}
