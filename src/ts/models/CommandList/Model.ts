/// <reference path="../../Base/EntityList/Model.ts" />
/// <reference path="../Command/Model.ts" />

module Models.CommandList {
    export class Model extends Base.EntityList.Model<Models.Command.Model> {
        constructor (
            private commands: Models.Command.Model[] = [],
            public name = '',
            public url = ''
        ) {
            super(commands);
        }
        clear() {
            this.name = '';
            this.url = '';
            super.clear();
        }
    }
}
