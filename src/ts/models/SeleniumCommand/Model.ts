/// <reference path="../../Base/Entity/Model.ts" />

module Models.SeleniumCommand {
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
