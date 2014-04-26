/*!
 @license BSD
 @see https://github.com/firebug/firebug/blob/master/extension/license.txt

 Software License Agreement (BSD License)

 Copyright (c) 2009, Mozilla Foundation
 All rights reserved.

 Redistribution and use of this software in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above
 copyright notice, this list of conditions and the
 following disclaimer.

 * Redistributions in binary form must reproduce the above
 copyright notice, this list of conditions and the
 following disclaimer in the documentation and/or other
 materials provided with the distribution.

 * Neither the name of Mozilla Foundation nor the names of its
 contributors may be used to endorse or promote products
 derived from this software without specific prior
 written permission of Mozilla Foundation.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/* See license.txt for terms of usage */

function getXPath () {

    "use strict";

// ********************************************************************************************* //
// Constants

    var Xpath = {};

// ********************************************************************************************* //
// XPATH

    /**
     * Gets an XPath for an element which describes its hierarchical location.
     */
    Xpath.getElementXPath = function(element)
    {
        if (element && element.id)
            return '//*[@id="' + element.id + '"]';
        else
            return Xpath.getElementTreeXPath(element);
    };

    Xpath.getElementTreeXPath = function(element)
    {
        var paths = [];

        // Use nodeName (instead of localName) so namespace prefix is included (if any).
        for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode)
        {
            var index = 0;
            for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
            {
                // Ignore document type declaration.
                if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                    continue;

                if (sibling.nodeName == element.nodeName)
                    ++index;
            }

            var tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
            var pathIndex = (index ? "[" + (index+1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? "/" + paths.join("/") : null;
    };

    Xpath.cssToXPath = function(rule)
    {
        var regElement = /^([#.]?)([a-z0-9\\*_-]*)((\|)([a-z0-9\\*_-]*))?/i;
        var regAttr1 = /^\[([^\]]*)\]/i;
        var regAttr2 = /^\[\s*([^~=\s]+)\s*(~?=)\s*"([^"]+)"\s*\]/i;
        var regPseudo = /^:([a-z_-])+/i;
        var regCombinator = /^(\s*[>+\s])?/i;
        var regComma = /^\s*,/i;

        var index = 1;
        var parts = ["//", "*"];
        var lastRule = null;

        while (rule.length && rule != lastRule)
        {
            lastRule = rule;

            // Trim leading whitespace
            rule = rule.trim();
            if (!rule.length)
                break;

            // Match the element identifier
            var m = regElement.exec(rule);
            if (m)
            {
                if (!m[1])
                {
                    // XXXjoe Namespace ignored for now
                    if (m[5])
                        parts[index] = m[5];
                    else
                        parts[index] = m[2];
                }
                else if (m[1] == '#')
                    parts.push("[@id='" + m[2] + "']");
                else if (m[1] == '.')
                    parts.push("[contains(concat(' ',normalize-space(@class),' '), ' " + m[2] + " ')]");

                rule = rule.substr(m[0].length);
            }

            // Match attribute selectors
            m = regAttr2.exec(rule);
            if (m)
            {
                if (m[2] == "~=")
                    parts.push("[contains(@" + m[1] + ", '" + m[3] + "')]");
                else
                    parts.push("[@" + m[1] + "='" + m[3] + "']");

                rule = rule.substr(m[0].length);
            }
            else
            {
                m = regAttr1.exec(rule);
                if (m)
                {
                    parts.push("[@" + m[1] + "]");
                    rule = rule.substr(m[0].length);
                }
            }

            // Skip over pseudo-classes and pseudo-elements, which are of no use to us
            m = regPseudo.exec(rule);
            while (m)
            {
                rule = rule.substr(m[0].length);
                m = regPseudo.exec(rule);
            }

            // Match combinators
            m = regCombinator.exec(rule);
            if (m && m[0].length)
            {
                if (m[0].indexOf(">") != -1)
                    parts.push("/");
                else if (m[0].indexOf("+") != -1)
                    parts.push("/following-sibling::");
                else
                    parts.push("//");

                index = parts.length;
                parts.push("*");
                rule = rule.substr(m[0].length);
            }

            m = regComma.exec(rule);
            if (m)
            {
                parts.push(" | ", "//", "*");
                index = parts.length-1;
                rule = rule.substr(m[0].length);
            }
        }

        var xpath = parts.join("");
        return xpath;
    };

    Xpath.getElementsBySelector = function(doc, css)
    {
        var xpath = Xpath.cssToXPath(css);
        return Xpath.getElementsByXPath(doc, xpath);
    };

    Xpath.getElementsByXPath = function(doc, xpath)
    {
        try
        {
            return Xpath.evaluateXPath(doc, xpath);
        }
        catch(ex)
        {
            return [];
        }
    };

    /**
     * Evaluates an XPath expression.
     *
     * @param {Document} doc
     * @param {String} xpath The XPath expression.
     * @param {Node} contextNode The context node.
     * @param {int} resultType
     *
     * @returns {*} The result of the XPath expression, depending on resultType :<br> <ul>
     *          <li>if it is XPathResult.NUMBER_TYPE, then it returns a Number</li>
     *          <li>if it is XPathResult.STRING_TYPE, then it returns a String</li>
     *          <li>if it is XPathResult.BOOLEAN_TYPE, then it returns a boolean</li>
     *          <li>if it is XPathResult.UNORDERED_NODE_ITERATOR_TYPE
     *              or XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, then it returns an array of nodes</li>
     *          <li>if it is XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
     *              or XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, then it returns an array of nodes</li>
     *          <li>if it is XPathResult.ANY_UNORDERED_NODE_TYPE
     *              or XPathResult.FIRST_ORDERED_NODE_TYPE, then it returns a single node</li>
     *          </ul>
     */
    Xpath.evaluateXPath = function(doc, xpath, contextNode, resultType)
    {
        if (contextNode === undefined)
            contextNode = doc;

        if (resultType === undefined)
            resultType = XPathResult.ANY_TYPE;

        var result = doc.evaluate(xpath, contextNode, null, resultType, null);

        switch (result.resultType)
        {
            case XPathResult.NUMBER_TYPE:
                return result.numberValue;

            case XPathResult.STRING_TYPE:
                return result.stringValue;

            case XPathResult.BOOLEAN_TYPE:
                return result.booleanValue;

            case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
            case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
                var nodes = [];
                for (var item = result.iterateNext(); item; item = result.iterateNext())
                    nodes.push(item);
                return nodes;

            case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
            case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
                var nodes = [];
                for (var i = 0; i < result.snapshotLength; ++i)
                    nodes.push(result.snapshotItem(i));
                return nodes;

            case XPathResult.ANY_UNORDERED_NODE_TYPE:
            case XPathResult.FIRST_ORDERED_NODE_TYPE:
                return result.singleNodeValue;
        }
    };

    Xpath.getRuleMatchingElements = function(rule, doc)
    {
        var css = rule.selectorText;
        var xpath = Xpath.cssToXPath(css);
        return Xpath.getElementsByXPath(doc, xpath);
    };

// ********************************************************************************************* //
// Registration

    return Xpath;

// ********************************************************************************************* //
}
