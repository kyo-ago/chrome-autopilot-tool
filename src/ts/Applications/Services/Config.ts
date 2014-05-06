module ts.Application.Services {
    export class Config {
        static injectScripts = [
            "src/js/lib/xpath.js",
            "src/js/selenium-ide/tools.js",
            "src/js/selenium-ide/htmlutils.js",
            "src/js/selenium-ide/selenium-browserdetect.js",
            "src/js/selenium-ide/selenium-atoms.js",
            "src/js/selenium-ide/selenium-browserbot.js",
            "src/js/selenium-ide/selenium-api.js",
            "src/js/selenium-ide/selenium-executionloop.js",
            "src/js/selenium-ide/selenium-testrunner.js",
            "src/js/selenium-ide/selenium-commandhandlers.js",
            "src/js/selenium-ide/selenium-runner.js",
            "src/js/selenium-ide/recorder.js",
            "src/js/selenium-ide/recorder-handlers.js",
            "src/js/selenium-ide/testCase.js",
            "src/js/content_scripts.js"
        ];
        static seleniumApiXML = '/src/js/selenium-ide/iedoc-core.xml';
    }
}
