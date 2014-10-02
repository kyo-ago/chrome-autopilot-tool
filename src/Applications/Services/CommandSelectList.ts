/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />

module Cat.Application.Services {
    export class CommandSelectList {
        private static errorMessage = 'command list xml load failed.\n';
        private documentElement: HTMLElement;
        load (file: string) {
            return new Promise<void>((resolve: () => void, reject: (errorMessage: string) => void) => {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', file);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    if (xhr.status !== 0 && xhr.status !== 200) {
                        return reject(CommandSelectList.errorMessage + file);
                    }
                    this.documentElement = xhr.responseXML.documentElement;
                    resolve();
                };
                xhr.send(null);
            });
        }
        getDocRoot () {
            return this.documentElement;
        }
        gets (): HTMLElement[] {
            return [].slice.call(this.documentElement.querySelectorAll('function'));
        }
    }
}
