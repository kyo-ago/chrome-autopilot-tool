/// <reference path="../../base/Service.ts" />
/// <reference path="./CommandList.ts" />
/// <reference path="../../../../typings/async/async.d.ts" />

module CommandList {
    export class CommandListService extends Service.Service {
        private commandService = new Command.CommandService();
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

        playAll(commandList: CommandList.CommandList) {
            return this.playCommands(commandList.commands);
        }

        play(commandList: CommandList.CommandList, start: number, end: number) {
            return this.playCommands(commandList.commands.splice(start, end));
        }

        private playCommands (target: Command.Command[]) {
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
