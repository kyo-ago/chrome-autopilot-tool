module Cat.Application.Services {
    export class Config {
        static injectScripts = [
            "src/lib/xpath.js",
            "src/lib/css-selector.js",
            "src/selenium-ide/tools.js",
            "src/selenium-ide/htmlutils.js",
            "src/selenium-ide/selenium-browserdetect.js",
            "src/selenium-ide/selenium-atoms.js",
            "src/selenium-ide/selenium-browserbot.js",
            "src/selenium-ide/selenium-api.js",
            "src/selenium-ide/selenium-executionloop.js",
            "src/selenium-ide/selenium-testrunner.js",
            "src/selenium-ide/selenium-commandhandlers.js",
            "src/selenium-ide/selenium-runner.js",
            "src/selenium-ide/recorder.js",
            "src/selenium-ide/recorder-handlers.js",
            "src/selenium-ide/testCase.js",
            "bower_components/eventemitter2/lib/eventemitter2.js",
            "src/_define.js",
            "src/application.js",
            "src/content_scripts.js"
        ];
        static seleniumApiXML = '/src/selenium-ide/iedoc-core.xml';
    }
}
