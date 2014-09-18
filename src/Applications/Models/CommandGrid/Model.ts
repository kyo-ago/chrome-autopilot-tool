/// <reference path="../../../Models/CommandList/Model.ts" />

module Cat.Application.Models.CommandGrid {
    export class Model extends Cat.Base.EntityList.Model<Cat.Models.Command.Model> {
        getCommandList() {
            var commands = this.getList().filter((command) => {
                return !!command.type;
            });
            var commandList = new Cat.Models.CommandList.Model(commands);
            return commandList;
        }
    }
}
