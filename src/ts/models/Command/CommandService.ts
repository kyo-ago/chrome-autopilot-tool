/// <reference path="../../base/Service.ts" />
/// <reference path="./Command.ts" />
/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />

module Command {
    export class CommandService extends Service.Service {
        constructor() {
            super();
        }

        play(command: Command) {
            return new Promise(function (resolve) {
                command
                resolve(1);
            })
        }
    }
}
