/// <reference path="../../DefinitelyTyped/es6-promises/es6-promises.d.ts" />

class LoadSeleniumCommandXML {
    private errorMessage = 'selenium command xml load failed.\n';
    loadFile (file: string) {
        return new Promise((resolve: () => any, reject: (errorMessage: string) => any) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', file);
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 0 || xhr.status !== 200) {
                    return reject(this.errorMessage + file);
                }
                (<any>window).Command.apiDocuments = new Array(xhr.responseXML.documentElement);
                resolve();
            };
            xhr.send(null);
        });
    }
}