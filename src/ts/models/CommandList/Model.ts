/// <reference path="../../Base/entity.ts" />
/// <reference path="../Command/Model.ts" />
/// <reference path="../Command/Service.ts" />

module CommandList {
    export class Model extends Base.Entity {
        private commandService = new Command.Service();

        constructor (
            public commands: Command.Model[] = [],
            public name = '',
            public url = ''
        ) {
            super()
        }

        clone(commands = this.commands,
              name = this.name,
              url = this.url
            ) {
            var entity = new Model(commands, name, url);
            return super._clone(entity);
        }

        add(command: Command.Model) {
            this.commands.push(command);
        }

        getCommands() {
            return this.commands;
        }

        splice(index: number, command: Command.Model) {
            this.commands.splice(index, 1, command);
        }

        replace(id: Base.Identity, command: Command.Model) {
            this.commands = this.commands.map(
                (e) => e.identity.eq(id) ? command : e
            );
        }

        remove(command: Command.Model) {
            this.commands = this.commands.filter(
                (e) => !e.eq(command)
            );
        }

        clear() {
            // copy Entity id
            return super._clone(new Model([]));
        }
    }
}
