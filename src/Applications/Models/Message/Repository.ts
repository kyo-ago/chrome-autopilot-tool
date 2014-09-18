/// <reference path="../../../Base/Entity/Repository.ts" />
/// <reference path="./Model.ts" />

module Cat.Application.Models.Message {
    export class Repository implements Base.Entity.Repository<Model> {
        toObject (entity: Model) {
            return {};
        }
        fromObject (object: Object) {
            return new Model();
        }
    }
}
