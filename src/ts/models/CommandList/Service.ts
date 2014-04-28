/// <reference path="../../DefinitelyTyped/async/async.d.ts" />
/// <reference path="../../Base/Service.ts" />
/// <reference path="../Command/Model.ts" />
/// <reference path="./Model.ts" />

module CommandList {
    export class Service extends Base.Service {
        private commandService = new Command.Service();
        private playStop: boolean = false;

        constructor(public playInterval: number = 0) {
            super();
        }

        stop() {
            this.playStop = true;
        }

        changeInterval(newInterval: number) {
            this.playInterval = newInterval;
        }

        playAll(commandList: CommandList.Model) {
            return this.playCommands(commandList.commands);
        }

        play(commandList: CommandList.Model, start: number, end: number) {
            return this.playCommands(commandList.commands.splice(start, end));
        }

        private playCommands (target: Command.Model[]) {
            var that = this;
            return new Promise((resolve, reject) => {
                var callbacks = target.map((command) => {
                    return function (done: Function): void {
                        if (that.playStop) {
                            return reject(undefined);
                        }
                        that.commandService.play(command).then((...args) => done(null, args))
                    };
                });
                async.series(callbacks, (error, ...args) => resolve(args));
            });
        }
    }
}
