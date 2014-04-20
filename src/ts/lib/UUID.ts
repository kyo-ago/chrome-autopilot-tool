module UUID {
    class InvalidUUIDFormat {};
    export class UUID {
        uuid: string;

        constructor (id: string = undefined) {
            if (!id) {
                this.uuid = [
                    this.S4(),
                    this.S4(),
                    "-",
                    this.S4(),
                    "-",
                    this.S4(),
                    "-",
                    this.S4(),
                    "-",
                    this.S4(),
                    this.S4(),
                    this.S4()
                ].join('');
                return;
            }
            var match = id.match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
            if (!match) {
                throw new InvalidUUIDFormat();
            }
            this.uuid = id;
        }

        toString () {
            return this.uuid;
        }

        static fromString (id: string) {
            return new UUID(id);
        }

        private S4() {
            var rand = 1 + Math.random();
            return ((rand * 0x10000)|0).toString(16).substring(1);
        }
    }}
