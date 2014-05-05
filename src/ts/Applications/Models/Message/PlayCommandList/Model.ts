/// <reference path="../../../../Models/CommandList/Model.ts" />
/// <reference path="../Model.ts" />

module ts.Application.Models.Message.PlayCommandList {
    export class Model extends Message.Model {
        static name = 'playCommandList';
        constructor (public commandList: ts.Models.CommandList.Model) {
            super();
        }
    }
}
