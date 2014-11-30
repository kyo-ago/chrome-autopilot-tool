module Cat.Application.Models.Message.PlayCommandList {
    export class Model extends Message.Model {
        static messageName = 'playCommandList';
        constructor (public commandList: Cat.Models.CommandList.Model) {
            super();
        }
    }
}
