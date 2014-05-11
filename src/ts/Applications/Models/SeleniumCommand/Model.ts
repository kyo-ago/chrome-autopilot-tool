/// <reference path="../../../Base/Entity/Model.ts" />

module ts.Application.Models.SeleniumCommand {
    export class Model extends ts.Base.Entity.Model {
        constructor (
            public type = '',
            public args: string[] = []
        ) {
            super();
        }
    }
}
