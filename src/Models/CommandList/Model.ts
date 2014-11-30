module Cat.Models.CommandList {
    export class Model extends Cat.Base.EntityList.Model<Command.Model> {
        constructor (
            commands: Command.Model[] = [],
            public name = '',
            public url = ''
        ) {
            super(commands);
        }
        clear() {
            this.name = '';
            this.url = '';
            super.clear();
        }
    }
}
