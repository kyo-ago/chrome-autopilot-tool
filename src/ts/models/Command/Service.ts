/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />
/// <reference path="../../Base/Service.ts" />
/// <reference path="./Model.ts" />

module Command {
    export class Service extends Base.Service {
        constructor() {
            super();
        }
        play (command: Command.Model) {
            return new Promise(() => {
                //???
            })
        }
    }
}
