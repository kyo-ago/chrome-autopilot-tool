/// <reference path="../../../../Models/CommandList/Model.ts" />
/// <reference path="../Model.ts" />

module Message.PlayCommandList {
    export class Model extends Message.Model {
        static name = 'playCommandList';
        constructor (public commandList: Models.CommandList.Model) {
            super();
        }
    }
}
