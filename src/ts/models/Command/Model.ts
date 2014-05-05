/// <reference path="../../Base/Entity/Model.ts" />

module Models.Command {
    export class Model extends Base.Entity.Model {
        constructor (
            public type = '',
            public target = '',
            public value = ''
        ) {
            super();
        }
    }
}
