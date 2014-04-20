/// <reference path="../../base/entity.ts" />
/// <reference path="../../../../typings/es6-promises/es6-promises.d.ts" />

module Command {
    export class Command extends Entity.Entity {
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
            var entity = new Command(type, target, value);
            return super._clone(entity);
        }
    }
}
