/// <reference path="./Model.ts" />

module Base.Entity {
    export interface Repository<M extends Base.Entity.Model> {
        toObject (entity: M) : Object;
        fromObject (object: Object) : M;
    }
}
