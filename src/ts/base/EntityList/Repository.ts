/// <reference path="./Model.ts" />
/// <reference path="../Entity/Repository.ts" />

module ts.Base.EntityList {
    export class Repository<B extends Entity.Model, M extends EntityList.Model<Entity.Model>> {
        constructor (private entityRepository: Entity.Repository<B>) {
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
