/// <reference path="../../Base/entity.ts" />
/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />

module Command {
    export class Model extends Base.Entity {
        constructor (
            public type = '',
            public target = '',
            public value = ''
        ) {
            super();
        }

        clone(type: string = this.type,
              target: string = this.target,
              value: string = this.value
            ) {
            var entity = new Model(type, target, value);
            return super._clone(entity);
        }
    }
}
