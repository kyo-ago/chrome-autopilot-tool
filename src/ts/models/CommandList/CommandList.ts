/// <reference path="../../base/entity.ts" />
/// <reference path="../Command/Command.ts" />
/// <reference path="../Command/CommandService.ts" />

module CommandList {
    export class CommandList extends Entity.Entity {
        private commandService = new Command.CommandService();

        constructor (
            public commands: Command.Command[],
            public name = '',
            public url = ''
        ) {
            super()
        }

        clone(commands = this.commands,
              name = this.name,
              url = this.url
            ) {
            var entity = new CommandList(commands, name, url);
            return super._clone(entity);
        }

        add(command: Command.Command) {
            this.commands.push(command);
            return this.clone();
        }

        splice(index: number, command: Command.Command) {
            this.commands.splice(index, 1, command);
            return this.clone();
        }

        replace(id: Entity.Identity, command: Command.Command) {
            var commands = this.commands.map(
                (e) => e.identity.eq(id) ? command : e
            );
            return this.clone(commands);
        }

        remove(command: Command.Command) {
            var commands = this.commands.filter(
                (e) => !e.eq(command)
            );
            return this.clone(commands);
        }

        clear() {
            return super._clone(new CommandList([]));
        }

        play(target: number) {
            return this.commandService.play(this.commands[target]);
        }
    }
}
