/// <reference path="../../Base/Entity/Model.ts" />

module ts.Models.Command {
    export class Model extends ts.Base.Entity.Model {
        constructor (
            public type = '',
            public target = '',
            public value = ''
        ) {
            super();
        }
    }
}
