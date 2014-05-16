/// <reference path="../../../Models/CommandList/Model.ts" />

module ts.Application.Models.CommandGrid {
    export class Model extends ts.Base.EntityList.Model<ts.Models.Command.Model> {
        getCommandList() {
            var commands = this.getList().filter((command) => {
                return !!command.type;
            });
            var commandList = new ts.Models.CommandList.Model(commands);
            return commandList;
        }
    }
}
