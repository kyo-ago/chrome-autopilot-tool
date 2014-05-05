/// <reference path="./Model.ts" />

module ts.Base.Entity {
    export interface Repository<M extends Model> {
        toObject (entity: M) : Object;
        fromObject (object: Object) : M;
    }
}
