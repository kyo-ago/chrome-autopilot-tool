module Cat.Models.Command {
    export class Model extends Cat.Base.Entity.Model {
        constructor (
            public type = '',
            public target = '',
            public value = ''
        ) {
            super();
        }
    }
}
