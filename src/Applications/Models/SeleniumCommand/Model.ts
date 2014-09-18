/// <reference path="../../../Base/Entity/Model.ts" />

module Cat.Application.Models.SeleniumCommand {
    export class Model extends Cat.Base.Entity.Model {
        constructor (
            public type = '',
            public args: string[] = []
        ) {
            super();
        }
    }
}
