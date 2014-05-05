/// <reference path="./Model.ts" />
/// <reference path="../Entity/Repository.ts" />

module Base.EntityList {
    export class Repository<B extends Base.Entity.Model, M extends Base.EntityList.Model<Base.Entity.Model>> {
        constructor (private entityRepository: Base.Entity.Repository<B>) {
        }
        toEntityList (entityList: M) {
            return entityList.getList().map((entity) => {
                return <M>(<any>this.entityRepository).toObject(entity);
            });
        }
        fromEntityList (entityList: Object[]) {
            return entityList.map((entity) => {
                return this.entityRepository.fromObject(entity);
            });
        }
    }
}
