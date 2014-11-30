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
