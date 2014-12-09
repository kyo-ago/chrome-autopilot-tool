module Cat.Application.Services.Tab {
    export class FileLoader {
        private injectScript : string;
        constructor (private injectScripts) {
        }
        getCode () {
            return this.injectScript;
        }
        gets () {
            return new Promise((resolve: () => void) => {
                Promise.all(this.injectScripts.map((scp: string) => {
                    return <any>jQuery.get('/'+scp);
                })).then((results) => {
                    this.injectScript = results.join(';\n');
                    resolve();
                });
            });
        }
    }
}
