var applicationServicesSeleniumSender: Cat.Application.Services.Selenium.Sender;

module Cat.Application.Controllers {
    export class WindowCtrl {
        constructor (private calledTabId: string) {}
        private initAngular (manager, commandSelectList) {
            return new Promise((resolve) => {
                var autopilotApp = angular.module('AutopilotApp', ['ui.sortable'])
                    .factory('manager', () => manager)
                    .factory('commandSelectList', () => commandSelectList)
                    .service('messageDispatcher', Models.Message.Dispatcher)
                    .factory('seleniumSender', (manager: Services.Tab.Manager, messageDispatcher: Models.Message.Dispatcher) => {
                        applicationServicesSeleniumSender = new Services.Selenium.Sender(manager, messageDispatcher);
                        return applicationServicesSeleniumSender;
                    })
                    .factory('commandGrid', () => {
                        return new Models.CommandGrid.Model();
                    })
                    .controller('Autopilot', Controllers.Autopilot.Controller)
                ;
                angular.bootstrap(document, ['AutopilotApp']);
                resolve(autopilotApp);
            });
        }
        private initCommandSelectList () {
            var seleniumApiXMLFile = chrome.runtime.getURL(Services.Config.seleniumApiXML);
            return Promise.all([
                new Promise((resolve: (commandSelectList: Services.CommandSelectList) => void, reject: (errorMessage: string) => void) => {
                    var commandSelectList = new Services.CommandSelectList();
                    commandSelectList.load(seleniumApiXMLFile).then(() => resolve(commandSelectList)).catch(reject);
                }),
                new Promise((resolve: () => void, reject: (errorMessage: string) => void) => {
                    Services.Selenium.Sender.setApiDocs(seleniumApiXMLFile).then(resolve).catch(reject);
                }),
                new Promise((resolve: () => void) => {
                    angular.element(document).ready(resolve);
                })
            ]);
        }
        private initTabInitializer (resolve, catchError) {
            (new Promise((resolve: (manager: Services.Tab.Manager) => void, reject: (errorMessage: string) => void) => {
                var initializer = new Services.Tab.Initializer(this.calledTabId);
                initializer.start().then(resolve).catch(reject);
            })).then((manager: Services.Tab.Manager) => {
                this.initCommandSelectList().then((results) => {
                    var commandSelectList = results.shift();
                    this.initAngular(manager, commandSelectList)
                        .then(resolve)
                        .catch(catchError)
                    ;
                }).catch(catchError);
            }).catch(catchError);
        }
        initialize () {
            return new Promise(this.initTabInitializer.bind(this));
        }
    }
}
