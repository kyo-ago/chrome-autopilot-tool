/// <reference path="../../Base/EntityList/Model.ts" />
/// <reference path="../Command/Model.ts" />

export module ts.Models.CommandList {
    export class Model extends ts.Base.EntityList.Model<Command.Model> {
        constructor (
            commands: Command.Model[] = [],
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
