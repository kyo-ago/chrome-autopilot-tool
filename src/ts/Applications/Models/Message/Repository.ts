/// <reference path="../../../Base/Repository.ts" />
/// <reference path="./Model.ts" />

module Message {
    export class Repository implements Base.Repository {
        toObject (entity: Model) {
            return {};
        }
        fromObject (object: any) {
            return new Model();
        }
    }
}
