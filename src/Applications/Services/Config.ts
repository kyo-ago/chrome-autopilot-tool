module Cat.Application.Services {
    export class Config {
        static injectScripts = [
            "js/lib/xpath.js",
            "js/lib/css-selector.js",
            "js/selenium-ide/tools.js",
            "js/selenium-ide/htmlutils.js",
            "js/selenium-ide/selenium-browserdetect.js",
            "js/selenium-ide/selenium-atoms.js",
            "js/selenium-ide/selenium-browserbot.js",
            "js/selenium-ide/selenium-api.js",
            "js/selenium-ide/selenium-executionloop.js",
            "js/selenium-ide/selenium-testrunner.js",
            "js/selenium-ide/selenium-commandhandlers.js",
            "js/selenium-ide/selenium-runner.js",
            "js/selenium-ide/recorder.js",
            "js/selenium-ide/recorder-handlers.js",
            "js/selenium-ide/testCase.js",
            "bower_components/eventemitter2/lib/eventemitter2.js",
            "js/content_scripts.js"
        ];
        static seleniumApiXML = '/js/selenium-ide/iedoc-core.xml';
    }
}
