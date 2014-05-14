/*!
* forked from https://code.google.com/p/selenium/source/browse/ide/main/src/content/webdriver-backed-selenium.js
* */

function ChromeExtensionBackedSelenium(baseUrl, webDriverBrowserString) {
    this.defaultTimeout = ChromeExtensionBackedSelenium.DEFAULT_TIMEOUT;
    this.mouseSpeed = ChromeExtensionBackedSelenium.DEFAULT_MOUSE_SPEED;
    this.baseUrl = baseUrl;
    this.browserbot = {
        baseUrl: baseUrl,
        runScheduledPollers: function() {},
        selectWindow: function () {}
    }
}

ChromeExtensionBackedSelenium.prototype.reset = function() {
    //TODO destroy the current session and establish a new one?
};

ChromeExtensionBackedSelenium.prototype.ensureNoUnhandledPopups = function() {

};

ChromeExtensionBackedSelenium.prototype.preprocessParameter = function(value) {
    var match = value.match(/^javascript\{((.|\r?\n)+)\}$/);
    if (match && match[1]) {
        //TODO Samit: need an alternative!
        return eval(match[1]).toString();
    }
    return this.replaceVariables(value);
};

/*
 * Search through str and replace all variable references ${varName} with their
 * value in storedVars.
 */
ChromeExtensionBackedSelenium.prototype.replaceVariables = function(str) {
    var stringResult = str;

    // Find all of the matching variable references
    var match = stringResult.match(/\$\{\w+\}/g);
    if (!match) {
        return stringResult;
    }

    // For each match, lookup the variable value, and replace if found
    for (var i = 0; match && i < match.length; i++) {
        var variable = match[i]; // The replacement variable, with ${}
        var name = variable.substring(2, variable.length - 1); // The replacement variable without ${}
        var replacement = storedVars[name];
        if (replacement && typeof(replacement) === 'string' && replacement.indexOf('$') != -1) {
            replacement = replacement.replace(/\$/g, '$$$$'); //double up on $'s because of the special meaning these have in 'replace'
        }
        if (replacement != undefined) {
            stringResult = stringResult.replace(variable, replacement);
        }
    }
    return stringResult;
};

function chromeExtensionBackedSeleniumBuilder() {
    for (var fn in Selenium.prototype) {
        var match = /^(get|is|do)([A-Z].+)$/.exec(fn);
        if (match) {
            var baseName = match[2];
            var isBoolean = (match[1] == "is");
            var argsLen = Selenium.prototype[fn].length;
            var cmd = (match[1] != "do") ? fn : baseName.substr(0, 1).toLowerCase() + baseName.substr(1);
            if (!ChromeExtensionBackedSelenium.prototype[fn]) {
                ChromeExtensionBackedSelenium.prototype[fn] = chromeExtensionBackedSeleniumFnBuilder(cmd, argsLen);
            }
        }
    }
    ChromeExtensionBackedSelenium.DEFAULT_TIMEOUT = Selenium.DEFAULT_TIMEOUT;
    ChromeExtensionBackedSelenium.DEFAULT_MOUSE_SPEED = Selenium.DEFAULT_MOUSE_SPEED;

    //The following do* are from selenium-runner.js
    //TODO: Samit: find a way to eliminate the copied code
    ChromeExtensionBackedSelenium.prototype.doPause = function(waitTime) {
        currentTest.pauseInterval = waitTime;
    };

    ChromeExtensionBackedSelenium.prototype.doEcho = function(message) {
        LOG.info("echo: " + message);
    };

    ChromeExtensionBackedSelenium.prototype.doSetSpeed = function(speed) {
        var milliseconds = parseInt(speed);
        if (milliseconds < 0) milliseconds = 0;
        editor.setInterval(milliseconds);
    };

    ChromeExtensionBackedSelenium.prototype.getSpeed = function() {
        return editor.getInterval();
    };

    ChromeExtensionBackedSelenium.prototype.doSetTimeout = function() {

    };

    ChromeExtensionBackedSelenium.prototype.doStore = function(value, varName) {
        storedVars[varName] = value;
    };

    ChromeExtensionBackedSelenium.prototype._elementLocator = function(sel1Locator) {
        var locator = parse_locator(sel1Locator);
        if (sel1Locator.match(/^\/\//) || locator.type == 'xpath') {
            locator.type = 'xpath';
            return locator;
        }
        if (locator.type == 'css') {
            return locator;
        }
        if (locator.type == 'id') {
            return locator;
        }
        if (locator.type == 'link') {
            locator.string = locator.string.replace(/^exact:/, '');
            return locator;
        }
        if (locator.type == 'name') {
            return locator;
        }
        return null;
    };

//  ChromeExtensionBackedSelenium.prototype.doStoreText = function(target, varName) {
//    var element = this.page().findElement(target);
//    storedVars[varName] = getText(element);
//  };
//
//  ChromeExtensionBackedSelenium.prototype.doStoreAttribute = function(target, varName) {
//    storedVars[varName] = this.page().findAttribute(target);
//  };
//
//  ChromeExtensionBackedSelenium.prototype.doStore = function(value, varName) {
//    storedVars[varName] = value;
//  };

}

function chromeExtensionBackedSeleniumFnBuilder(cmd, argsLen) {
    if (argsLen != 1) {
        return function() {
            //TODO return a promise
            var self = this;
            var cmdArgs = Array.prototype.slice.call(arguments);
            var deferred = self.remoteControlCommand(cmd, cmdArgs).done(function(response) {
                self.waitingForRemoteResult = false;
                //TODO do something with the response
                //alert("Received response to " + cmd + ": " + response);
            }).fail(function(response) {
                self.waitingForRemoteResult = false;
                //alert("Received response to " + cmd + ": " + response);
            });
            return function () {
                return !deferred.isPending();
            };
        };
    }
    //There is no difference between this and the above fn, except the argument list
    // This argument list is required for correct dispatching of the call
    return function(arg1) {
        //TODO return a promise
        var self = this;
        var cmdArgs = Array.prototype.slice.call(arguments);
        var deferred = self.remoteControlCommand(cmd, cmdArgs).done(function(response) {
            self.waitingForRemoteResult = false;
            //TODO do something with the response
            //alert("Received response to " + cmd + ": " + response);
        }).fail(function(response) {
            self.waitingForRemoteResult = false;
            //alert("Received response to " + cmd + ": " + response);
        });
        return function () {
            return !deferred.isPending();
        };
    };
}

// Populate the ChromeExtensionBackedSelenium with Selenium API functions
chromeExtensionBackedSeleniumBuilder();

ChromeExtensionBackedSelenium.prototype.remoteControlCommand = function(verb, args) {
    //TODO handle timeout stuff: timeout(@default_timeout_in_seconds) do
//  alert("Sending server request: " + requestData);
    return new Deferred(function(deferred) {
        applicationServicesSeleniumSender.execute(verb, args, function (response, success) {
            if (success) {
                if (response.substr(0, 2) === 'OK') {
                    deferred.resolve(response.substr(3)); //strip "OK," from response
                } else {
                    //TODO raise CommandError, response unless status == "OK"
                    if (response.substr(0, 5) === 'ERROR') {
                        deferred.reject(response.substr(6));   //strip "ERROR," from response
                    } else {
                        alert("Received command response (!=OK/ERROR): " + response + "\n Request Data: " + requestData);
                        deferred.reject(response);
                    }
                }
            } else {
                deferred.reject('Received an invalid status code from Selenium Server');
            }
        });
    });
};
