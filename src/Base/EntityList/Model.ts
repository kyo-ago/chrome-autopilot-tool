/// <reference path="../Identity" />
/// <reference path="../Entity/Model.ts" />

module Cat.Base.EntityList {
    export class Model<E extends Entity.Model> extends Entity.Model {
        list: E[];

        constructor(list: E[] = []) {
            this.list = list;
            super();
        }
        add(entity: E) {
            this.list.push(entity);
        }
        getList() {
            return this.list;
        }
        splice(index: number, entity: E) {
            this.list.splice(index, 1, entity);
        }
        replace(identity: Identity, entity: E) {
            this.list = this.list.map(
                (e) => e.identity.eq(identity) ? entity : e
            );
        }
        remove(entity: E) {
            this.list = this.list.filter(
                (e) => !e.eq(entity)
            );
        }
        clear() {
            this.list = [];
        }
    }
}
