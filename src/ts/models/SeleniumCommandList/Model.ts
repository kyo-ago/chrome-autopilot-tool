/// <reference path="../../Base/EntityList/Model.ts" />
/// <reference path="../SeleniumCommand/Model.ts" />

module Models.SeleniumCommandList {
    export class Model extends Base.EntityList.Model<Models.SeleniumCommand.Model> {
        constructor (
            private commands: SeleniumCommand.Model[] = [],
            public name = '',
            public url = ''
        ) {
            super(commands)
        }
        clear() {
            this.name = '';
            this.url = '';
            super.clear();
        }
    }
}
