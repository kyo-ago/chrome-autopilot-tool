/**
 * Created by kyo on 8/12/14.
 */

function getCssSelector () {

    "use strict";
    var main = {};

    main.getElementSelector = function (element) {
        if (element && element.id) {
            return '#' + element.id
        }
        var selector = main.getElementTreeSelector(element);
        return selector ? 'css=' + selector : selector;
    };

    main.getElementTreeSelector = function (element) {
        var paths = [];
        for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
            var index = 0;
            for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) {
                    continue
                }
                if (sibling.nodeName === element.nodeName) {
                    ++index
                }
            }
            var tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
            var pathIndex = (index ? ":nth-child(" + (index+1) + ")" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? paths.join(" ") : null;
    };
    return main;
}
