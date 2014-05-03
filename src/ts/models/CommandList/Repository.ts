/// <reference path="../Command/Repository.ts" />
/// <reference path="./Model.ts" />

module CommandList {
    export class Repository implements Base.Repository {
        commandRepository = new Command.Repository();

        toObject (commandList: Model) {
            var commands = commandList.commands.map((command) => {
                return this.commandRepository.toObject(command);
            });
            return {
                'commands' : commands,
                'name' : commandList.name,
                'url' : commandList.url
            };
        }
        fromObject (commandList: any) {
            var commands = commandList.commands.map((command) => {
                return this.commandRepository.fromObject({
                    'type' : command.type,
                    'target' : command.target,
                    'value' : command.value
                });
            });
            return new Model(commands, commandList.name, commandList.url);
        }
    }
}
