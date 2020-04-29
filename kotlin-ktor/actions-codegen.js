(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process,global){
(function() {
  var f = global.__fuse = global.__fuse || {};
  var modules = f.modules = f.modules || {}; f.dt = function (x) { return x && x.__esModule ? x : { "default": x }; };

  f.bundle = function(collection, fn) {
    for (var num in collection) {
      modules[num] = collection[num];
    }
    fn ? fn() : void 0;
  };
  f.c = {};
  f.r = function(id) {
    var cached = f.c[id];
    if (cached) return cached.m.exports;
    var module = modules[id];
    if (!module) {
      
      throw new Error('Module ' + id + ' was not found');
    }
    cached = f.c[id] = {};
    cached.exports = {};
    cached.m = { exports: cached.exports };
    module(f.r, cached.exports, cached.m);
    return cached.m.exports;
  }; 
})();
__fuse.bundle({

// node_modules/common-tags/es/index.js @19
19: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
exports.TemplateTag = TemplateTag_1d.default;
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
exports.trimResultTransformer = trimResultTransformer_1d.default;
var stripIndentTransformer_1 = __fusereq(23);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
exports.stripIndentTransformer = stripIndentTransformer_1d.default;
var replaceResultTransformer_1 = __fusereq(24);
var replaceResultTransformer_1d = __fuse.dt(replaceResultTransformer_1);
exports.replaceResultTransformer = replaceResultTransformer_1d.default;
var replaceSubstitutionTransformer_1 = __fusereq(25);
var replaceSubstitutionTransformer_1d = __fuse.dt(replaceSubstitutionTransformer_1);
exports.replaceSubstitutionTransformer = replaceSubstitutionTransformer_1d.default;
var replaceStringTransformer_1 = __fusereq(26);
var replaceStringTransformer_1d = __fuse.dt(replaceStringTransformer_1);
exports.replaceStringTransformer = replaceStringTransformer_1d.default;
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
exports.inlineArrayTransformer = inlineArrayTransformer_1d.default;
var splitStringTransformer_1 = __fusereq(28);
var splitStringTransformer_1d = __fuse.dt(splitStringTransformer_1);
exports.splitStringTransformer = splitStringTransformer_1d.default;
var removeNonPrintingValuesTransformer_1 = __fusereq(29);
var removeNonPrintingValuesTransformer_1d = __fuse.dt(removeNonPrintingValuesTransformer_1);
exports.removeNonPrintingValuesTransformer = removeNonPrintingValuesTransformer_1d.default;
var commaLists_1 = __fusereq(30);
var commaLists_1d = __fuse.dt(commaLists_1);
exports.commaLists = commaLists_1d.default;
var commaListsAnd_1 = __fusereq(31);
var commaListsAnd_1d = __fuse.dt(commaListsAnd_1);
exports.commaListsAnd = commaListsAnd_1d.default;
var commaListsOr_1 = __fusereq(32);
var commaListsOr_1d = __fuse.dt(commaListsOr_1);
exports.commaListsOr = commaListsOr_1d.default;
var html_1 = __fusereq(33);
var html_1d = __fuse.dt(html_1);
exports.html = html_1d.default;
var codeBlock_1 = __fusereq(34);
var codeBlock_1d = __fuse.dt(codeBlock_1);
exports.codeBlock = codeBlock_1d.default;
var source_1 = __fusereq(35);
var source_1d = __fuse.dt(source_1);
exports.source = source_1d.default;
var safeHtml_1 = __fusereq(36);
var safeHtml_1d = __fuse.dt(safeHtml_1);
exports.safeHtml = safeHtml_1d.default;
var oneLine_1 = __fusereq(37);
var oneLine_1d = __fuse.dt(oneLine_1);
exports.oneLine = oneLine_1d.default;
var oneLineTrim_1 = __fusereq(38);
var oneLineTrim_1d = __fuse.dt(oneLineTrim_1);
exports.oneLineTrim = oneLineTrim_1d.default;
var oneLineCommaLists_1 = __fusereq(39);
var oneLineCommaLists_1d = __fuse.dt(oneLineCommaLists_1);
exports.oneLineCommaLists = oneLineCommaLists_1d.default;
var oneLineCommaListsOr_1 = __fusereq(40);
var oneLineCommaListsOr_1d = __fuse.dt(oneLineCommaListsOr_1);
exports.oneLineCommaListsOr = oneLineCommaListsOr_1d.default;
var oneLineCommaListsAnd_1 = __fusereq(41);
var oneLineCommaListsAnd_1d = __fuse.dt(oneLineCommaListsAnd_1);
exports.oneLineCommaListsAnd = oneLineCommaListsAnd_1d.default;
var inlineLists_1 = __fusereq(42);
var inlineLists_1d = __fuse.dt(inlineLists_1);
exports.inlineLists = inlineLists_1d.default;
var oneLineInlineLists_1 = __fusereq(43);
var oneLineInlineLists_1d = __fuse.dt(oneLineInlineLists_1);
exports.oneLineInlineLists = oneLineInlineLists_1d.default;
var stripIndent_1 = __fusereq(44);
var stripIndent_1d = __fuse.dt(stripIndent_1);
exports.stripIndent = stripIndent_1d.default;
var stripIndents_1 = __fusereq(45);
var stripIndents_1d = __fuse.dt(stripIndents_1);
exports.stripIndents = stripIndents_1d.default;

},

// node_modules/common-tags/es/TemplateTag/index.js @21
21: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(55);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
exports.default = TemplateTag_1d.default;

},

// node_modules/common-tags/es/trimResultTransformer/index.js @22
22: function(__fusereq, exports, module){
exports.__esModule = true;
var trimResultTransformer_1 = __fusereq(56);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
exports.default = trimResultTransformer_1d.default;

},

// node_modules/common-tags/es/stripIndentTransformer/index.js @23
23: function(__fusereq, exports, module){
exports.__esModule = true;
var stripIndentTransformer_1 = __fusereq(57);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
exports.default = stripIndentTransformer_1d.default;

},

// node_modules/common-tags/es/replaceResultTransformer/index.js @24
24: function(__fusereq, exports, module){
exports.__esModule = true;
var replaceResultTransformer_1 = __fusereq(58);
var replaceResultTransformer_1d = __fuse.dt(replaceResultTransformer_1);
exports.default = replaceResultTransformer_1d.default;

},

// node_modules/common-tags/es/replaceSubstitutionTransformer/index.js @25
25: function(__fusereq, exports, module){
exports.__esModule = true;
var replaceSubstitutionTransformer_1 = __fusereq(59);
var replaceSubstitutionTransformer_1d = __fuse.dt(replaceSubstitutionTransformer_1);
exports.default = replaceSubstitutionTransformer_1d.default;

},

// node_modules/common-tags/es/replaceStringTransformer/index.js @26
26: function(__fusereq, exports, module){
exports.__esModule = true;
var replaceStringTransformer_1 = __fusereq(60);
var replaceStringTransformer_1d = __fuse.dt(replaceStringTransformer_1);
exports.default = replaceStringTransformer_1d.default;

},

// node_modules/common-tags/es/inlineArrayTransformer/index.js @27
27: function(__fusereq, exports, module){
exports.__esModule = true;
var inlineArrayTransformer_1 = __fusereq(61);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
exports.default = inlineArrayTransformer_1d.default;

},

// node_modules/common-tags/es/splitStringTransformer/index.js @28
28: function(__fusereq, exports, module){
exports.__esModule = true;
var splitStringTransformer_1 = __fusereq(62);
var splitStringTransformer_1d = __fuse.dt(splitStringTransformer_1);
exports.default = splitStringTransformer_1d.default;

},

// node_modules/common-tags/es/removeNonPrintingValuesTransformer/index.js @29
29: function(__fusereq, exports, module){
exports.__esModule = true;
var removeNonPrintingValuesTransformer_1 = __fusereq(63);
var removeNonPrintingValuesTransformer_1d = __fuse.dt(removeNonPrintingValuesTransformer_1);
exports.default = removeNonPrintingValuesTransformer_1d.default;

},

// node_modules/common-tags/es/commaLists/index.js @30
30: function(__fusereq, exports, module){
exports.__esModule = true;
var commaLists_1 = __fusereq(64);
var commaLists_1d = __fuse.dt(commaLists_1);
exports.default = commaLists_1d.default;

},

// node_modules/common-tags/es/commaListsAnd/index.js @31
31: function(__fusereq, exports, module){
exports.__esModule = true;
var commaListsAnd_1 = __fusereq(65);
var commaListsAnd_1d = __fuse.dt(commaListsAnd_1);
exports.default = commaListsAnd_1d.default;

},

// node_modules/common-tags/es/commaListsOr/index.js @32
32: function(__fusereq, exports, module){
exports.__esModule = true;
var commaListsOr_1 = __fusereq(66);
var commaListsOr_1d = __fuse.dt(commaListsOr_1);
exports.default = commaListsOr_1d.default;

},

// node_modules/common-tags/es/html/index.js @33
33: function(__fusereq, exports, module){
exports.__esModule = true;
var html_1 = __fusereq(67);
var html_1d = __fuse.dt(html_1);
exports.default = html_1d.default;

},

// node_modules/common-tags/es/codeBlock/index.js @34
34: function(__fusereq, exports, module){
exports.__esModule = true;
var html_1 = __fusereq(33);
var html_1d = __fuse.dt(html_1);
exports.default = html_1d.default;

},

// node_modules/common-tags/es/source/index.js @35
35: function(__fusereq, exports, module){
exports.__esModule = true;
var html_1 = __fusereq(33);
var html_1d = __fuse.dt(html_1);
exports.default = html_1d.default;

},

// node_modules/common-tags/es/safeHtml/index.js @36
36: function(__fusereq, exports, module){
exports.__esModule = true;
var safeHtml_1 = __fusereq(68);
var safeHtml_1d = __fuse.dt(safeHtml_1);
exports.default = safeHtml_1d.default;

},

// node_modules/common-tags/es/oneLine/index.js @37
37: function(__fusereq, exports, module){
exports.__esModule = true;
var oneLine_1 = __fusereq(69);
var oneLine_1d = __fuse.dt(oneLine_1);
exports.default = oneLine_1d.default;

},

// node_modules/common-tags/es/oneLineTrim/index.js @38
38: function(__fusereq, exports, module){
exports.__esModule = true;
var oneLineTrim_1 = __fusereq(70);
var oneLineTrim_1d = __fuse.dt(oneLineTrim_1);
exports.default = oneLineTrim_1d.default;

},

// node_modules/common-tags/es/oneLineCommaLists/index.js @39
39: function(__fusereq, exports, module){
exports.__esModule = true;
var oneLineCommaLists_1 = __fusereq(71);
var oneLineCommaLists_1d = __fuse.dt(oneLineCommaLists_1);
exports.default = oneLineCommaLists_1d.default;

},

// node_modules/common-tags/es/oneLineCommaListsOr/index.js @40
40: function(__fusereq, exports, module){
exports.__esModule = true;
var oneLineCommaListsOr_1 = __fusereq(72);
var oneLineCommaListsOr_1d = __fuse.dt(oneLineCommaListsOr_1);
exports.default = oneLineCommaListsOr_1d.default;

},

// node_modules/common-tags/es/oneLineCommaListsAnd/index.js @41
41: function(__fusereq, exports, module){
exports.__esModule = true;
var oneLineCommaListsAnd_1 = __fusereq(73);
var oneLineCommaListsAnd_1d = __fuse.dt(oneLineCommaListsAnd_1);
exports.default = oneLineCommaListsAnd_1d.default;

},

// node_modules/common-tags/es/inlineLists/index.js @42
42: function(__fusereq, exports, module){
exports.__esModule = true;
var inlineLists_1 = __fusereq(74);
var inlineLists_1d = __fuse.dt(inlineLists_1);
exports.default = inlineLists_1d.default;

},

// node_modules/common-tags/es/oneLineInlineLists/index.js @43
43: function(__fusereq, exports, module){
exports.__esModule = true;
var oneLineInlineLists_1 = __fusereq(75);
var oneLineInlineLists_1d = __fuse.dt(oneLineInlineLists_1);
exports.default = oneLineInlineLists_1d.default;

},

// node_modules/common-tags/es/stripIndent/index.js @44
44: function(__fusereq, exports, module){
exports.__esModule = true;
var stripIndent_1 = __fusereq(76);
var stripIndent_1d = __fuse.dt(stripIndent_1);
exports.default = stripIndent_1d.default;

},

// node_modules/common-tags/es/stripIndents/index.js @45
45: function(__fusereq, exports, module){
exports.__esModule = true;
var stripIndents_1 = __fusereq(77);
var stripIndents_1d = __fuse.dt(stripIndents_1);
exports.default = stripIndents_1d.default;

},

// node_modules/common-tags/es/TemplateTag/TemplateTag.js @55
55: function(__fusereq, exports, module){
exports.__esModule = true;
var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if (("value" in descriptor)) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();
var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']);
function _taggedTemplateLiteral(strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var TemplateTag = (function () {
  function TemplateTag() {
    var _this = this;
    for (var _len = arguments.length, transformers = Array(_len), _key = 0; _key < _len; _key++) {
      transformers[_key] = arguments[_key];
    }
    _classCallCheck(this, TemplateTag);
    this.tag = function (strings) {
      for (var _len2 = arguments.length, expressions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        expressions[_key2 - 1] = arguments[_key2];
      }
      if (typeof strings === 'function') {
        return _this.interimTag.bind(_this, strings);
      }
      if (typeof strings === 'string') {
        return _this.transformEndResult(strings);
      }
      strings = strings.map(_this.transformString.bind(_this));
      return _this.transformEndResult(strings.reduce(_this.processSubstitutions.bind(_this, expressions)));
    };
    if (transformers.length > 0 && Array.isArray(transformers[0])) {
      transformers = transformers[0];
    }
    this.transformers = transformers.map(function (transformer) {
      return typeof transformer === 'function' ? transformer() : transformer;
    });
    return this.tag;
  }
  _createClass(TemplateTag, [{
    key: 'interimTag',
    value: function interimTag(previousTag, template) {
      for (var _len3 = arguments.length, substitutions = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        substitutions[_key3 - 2] = arguments[_key3];
      }
      return this.tag(_templateObject, previousTag.apply(undefined, [template].concat(substitutions)));
    }
  }, {
    key: 'processSubstitutions',
    value: function processSubstitutions(substitutions, resultSoFar, remainingPart) {
      var substitution = this.transformSubstitution(substitutions.shift(), resultSoFar);
      return ('').concat(resultSoFar, substitution, remainingPart);
    }
  }, {
    key: 'transformString',
    value: function transformString(str) {
      var cb = function cb(res, transform) {
        return transform.onString ? transform.onString(res) : res;
      };
      return this.transformers.reduce(cb, str);
    }
  }, {
    key: 'transformSubstitution',
    value: function transformSubstitution(substitution, resultSoFar) {
      var cb = function cb(res, transform) {
        return transform.onSubstitution ? transform.onSubstitution(res, resultSoFar) : res;
      };
      return this.transformers.reduce(cb, substitution);
    }
  }, {
    key: 'transformEndResult',
    value: function transformEndResult(endResult) {
      var cb = function cb(res, transform) {
        return transform.onEndResult ? transform.onEndResult(res) : res;
      };
      return this.transformers.reduce(cb, endResult);
    }
  }]);
  return TemplateTag;
})();
exports.default = TemplateTag;

},

// node_modules/common-tags/es/trimResultTransformer/trimResultTransformer.js @56
56: function(__fusereq, exports, module){
exports.__esModule = true;
var trimResultTransformer = function trimResultTransformer() {
  var side = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return {
    onEndResult: function onEndResult(endResult) {
      if (side === '') {
        return endResult.trim();
      }
      side = side.toLowerCase();
      if (side === 'start' || side === 'left') {
        return endResult.replace(/^\s*/, '');
      }
      if (side === 'end' || side === 'right') {
        return endResult.replace(/\s*$/, '');
      }
      throw new Error('Side not supported: ' + side);
    }
  };
};
exports.default = trimResultTransformer;

},

// node_modules/common-tags/es/stripIndentTransformer/stripIndentTransformer.js @57
57: function(__fusereq, exports, module){
exports.__esModule = true;
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}
var stripIndentTransformer = function stripIndentTransformer() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'initial';
  return {
    onEndResult: function onEndResult(endResult) {
      if (type === 'initial') {
        var match = endResult.match(/^[^\S\n]*(?=\S)/gm);
        var indent = match && Math.min.apply(Math, _toConsumableArray(match.map(function (el) {
          return el.length;
        })));
        if (indent) {
          var regexp = new RegExp('^.{' + indent + '}', 'gm');
          return endResult.replace(regexp, '');
        }
        return endResult;
      }
      if (type === 'all') {
        return endResult.replace(/^[^\S\n]+/gm, '');
      }
      throw new Error('Unknown type: ' + type);
    }
  };
};
exports.default = stripIndentTransformer;

},

// node_modules/common-tags/es/replaceResultTransformer/replaceResultTransformer.js @58
58: function(__fusereq, exports, module){
exports.__esModule = true;
var replaceResultTransformer = function replaceResultTransformer(replaceWhat, replaceWith) {
  return {
    onEndResult: function onEndResult(endResult) {
      if (replaceWhat == null || replaceWith == null) {
        throw new Error('replaceResultTransformer requires at least 2 arguments.');
      }
      return endResult.replace(replaceWhat, replaceWith);
    }
  };
};
exports.default = replaceResultTransformer;

},

// node_modules/common-tags/es/replaceSubstitutionTransformer/replaceSubstitutionTransformer.js @59
59: function(__fusereq, exports, module){
exports.__esModule = true;
var replaceSubstitutionTransformer = function replaceSubstitutionTransformer(replaceWhat, replaceWith) {
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      if (replaceWhat == null || replaceWith == null) {
        throw new Error('replaceSubstitutionTransformer requires at least 2 arguments.');
      }
      if (substitution == null) {
        return substitution;
      } else {
        return substitution.toString().replace(replaceWhat, replaceWith);
      }
    }
  };
};
exports.default = replaceSubstitutionTransformer;

},

// node_modules/common-tags/es/replaceStringTransformer/replaceStringTransformer.js @60
60: function(__fusereq, exports, module){
exports.__esModule = true;
var replaceStringTransformer = function replaceStringTransformer(replaceWhat, replaceWith) {
  return {
    onString: function onString(str) {
      if (replaceWhat == null || replaceWith == null) {
        throw new Error('replaceStringTransformer requires at least 2 arguments.');
      }
      return str.replace(replaceWhat, replaceWith);
    }
  };
};
exports.default = replaceStringTransformer;

},

// node_modules/common-tags/es/inlineArrayTransformer/inlineArrayTransformer.js @61
61: function(__fusereq, exports, module){
exports.__esModule = true;
var defaults = {
  separator: '',
  conjunction: '',
  serial: false
};
var inlineArrayTransformer = function inlineArrayTransformer() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      if (Array.isArray(substitution)) {
        var arrayLength = substitution.length;
        var separator = opts.separator;
        var conjunction = opts.conjunction;
        var serial = opts.serial;
        var indent = resultSoFar.match(/(\n?[^\S\n]+)$/);
        if (indent) {
          substitution = substitution.join(separator + indent[1]);
        } else {
          substitution = substitution.join(separator + ' ');
        }
        if (conjunction && arrayLength > 1) {
          var separatorIndex = substitution.lastIndexOf(separator);
          substitution = substitution.slice(0, separatorIndex) + (serial ? separator : '') + ' ' + conjunction + substitution.slice(separatorIndex + 1);
        }
      }
      return substitution;
    }
  };
};
exports.default = inlineArrayTransformer;

},

// node_modules/common-tags/es/splitStringTransformer/splitStringTransformer.js @62
62: function(__fusereq, exports, module){
exports.__esModule = true;
var splitStringTransformer = function splitStringTransformer(splitBy) {
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      if (splitBy != null && typeof splitBy === 'string') {
        if (typeof substitution === 'string' && substitution.includes(splitBy)) {
          substitution = substitution.split(splitBy);
        }
      } else {
        throw new Error('You need to specify a string character to split by.');
      }
      return substitution;
    }
  };
};
exports.default = splitStringTransformer;

},

// node_modules/common-tags/es/removeNonPrintingValuesTransformer/removeNonPrintingValuesTransformer.js @63
63: function(__fusereq, exports, module){
exports.__esModule = true;
var isValidValue = function isValidValue(x) {
  return x != null && !Number.isNaN(x) && typeof x !== 'boolean';
};
var removeNonPrintingValuesTransformer = function removeNonPrintingValuesTransformer() {
  return {
    onSubstitution: function onSubstitution(substitution) {
      if (Array.isArray(substitution)) {
        return substitution.filter(isValidValue);
      }
      if (isValidValue(substitution)) {
        return substitution;
      }
      return '';
    }
  };
};
exports.default = removeNonPrintingValuesTransformer;

},

// node_modules/common-tags/es/commaLists/commaLists.js @64
64: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var stripIndentTransformer_1 = __fusereq(23);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var commaLists = new TemplateTag_1d.default(inlineArrayTransformer_1d.default({
  separator: ','
}), stripIndentTransformer_1d.default, trimResultTransformer_1d.default);
exports.default = commaLists;

},

// node_modules/common-tags/es/commaListsAnd/commaListsAnd.js @65
65: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var stripIndentTransformer_1 = __fusereq(23);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var commaListsAnd = new TemplateTag_1d.default(inlineArrayTransformer_1d.default({
  separator: ',',
  conjunction: 'and'
}), stripIndentTransformer_1d.default, trimResultTransformer_1d.default);
exports.default = commaListsAnd;

},

// node_modules/common-tags/es/commaListsOr/commaListsOr.js @66
66: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var stripIndentTransformer_1 = __fusereq(23);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var commaListsOr = new TemplateTag_1d.default(inlineArrayTransformer_1d.default({
  separator: ',',
  conjunction: 'or'
}), stripIndentTransformer_1d.default, trimResultTransformer_1d.default);
exports.default = commaListsOr;

},

// node_modules/common-tags/es/html/html.js @67
67: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var stripIndentTransformer_1 = __fusereq(23);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var splitStringTransformer_1 = __fusereq(28);
var splitStringTransformer_1d = __fuse.dt(splitStringTransformer_1);
var removeNonPrintingValuesTransformer_1 = __fusereq(29);
var removeNonPrintingValuesTransformer_1d = __fuse.dt(removeNonPrintingValuesTransformer_1);
var html = new TemplateTag_1d.default(splitStringTransformer_1d.default('\n'), removeNonPrintingValuesTransformer_1d.default, inlineArrayTransformer_1d.default, stripIndentTransformer_1d.default, trimResultTransformer_1d.default);
exports.default = html;

},

// node_modules/common-tags/es/safeHtml/safeHtml.js @68
68: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var stripIndentTransformer_1 = __fusereq(23);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var splitStringTransformer_1 = __fusereq(28);
var splitStringTransformer_1d = __fuse.dt(splitStringTransformer_1);
var replaceSubstitutionTransformer_1 = __fusereq(25);
var replaceSubstitutionTransformer_1d = __fuse.dt(replaceSubstitutionTransformer_1);
var safeHtml = new TemplateTag_1d.default(splitStringTransformer_1d.default('\n'), inlineArrayTransformer_1d.default, stripIndentTransformer_1d.default, trimResultTransformer_1d.default, replaceSubstitutionTransformer_1d.default(/&/g, '&amp;'), replaceSubstitutionTransformer_1d.default(/</g, '&lt;'), replaceSubstitutionTransformer_1d.default(/>/g, '&gt;'), replaceSubstitutionTransformer_1d.default(/"/g, '&quot;'), replaceSubstitutionTransformer_1d.default(/'/g, '&#x27;'), replaceSubstitutionTransformer_1d.default(/`/g, '&#x60;'));
exports.default = safeHtml;

},

// node_modules/common-tags/es/oneLine/oneLine.js @69
69: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var replaceResultTransformer_1 = __fusereq(24);
var replaceResultTransformer_1d = __fuse.dt(replaceResultTransformer_1);
var oneLine = new TemplateTag_1d.default(replaceResultTransformer_1d.default(/(?:\n(?:\s*))+/g, ' '), trimResultTransformer_1d.default);
exports.default = oneLine;

},

// node_modules/common-tags/es/oneLineTrim/oneLineTrim.js @70
70: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var replaceResultTransformer_1 = __fusereq(24);
var replaceResultTransformer_1d = __fuse.dt(replaceResultTransformer_1);
var oneLineTrim = new TemplateTag_1d.default(replaceResultTransformer_1d.default(/(?:\n\s*)/g, ''), trimResultTransformer_1d.default);
exports.default = oneLineTrim;

},

// node_modules/common-tags/es/oneLineCommaLists/oneLineCommaLists.js @71
71: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var replaceResultTransformer_1 = __fusereq(24);
var replaceResultTransformer_1d = __fuse.dt(replaceResultTransformer_1);
var oneLineCommaLists = new TemplateTag_1d.default(inlineArrayTransformer_1d.default({
  separator: ','
}), replaceResultTransformer_1d.default(/(?:\s+)/g, ' '), trimResultTransformer_1d.default);
exports.default = oneLineCommaLists;

},

// node_modules/common-tags/es/oneLineCommaListsOr/oneLineCommaListsOr.js @72
72: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var replaceResultTransformer_1 = __fusereq(24);
var replaceResultTransformer_1d = __fuse.dt(replaceResultTransformer_1);
var oneLineCommaListsOr = new TemplateTag_1d.default(inlineArrayTransformer_1d.default({
  separator: ',',
  conjunction: 'or'
}), replaceResultTransformer_1d.default(/(?:\s+)/g, ' '), trimResultTransformer_1d.default);
exports.default = oneLineCommaListsOr;

},

// node_modules/common-tags/es/oneLineCommaListsAnd/oneLineCommaListsAnd.js @73
73: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var replaceResultTransformer_1 = __fusereq(24);
var replaceResultTransformer_1d = __fuse.dt(replaceResultTransformer_1);
var oneLineCommaListsAnd = new TemplateTag_1d.default(inlineArrayTransformer_1d.default({
  separator: ',',
  conjunction: 'and'
}), replaceResultTransformer_1d.default(/(?:\s+)/g, ' '), trimResultTransformer_1d.default);
exports.default = oneLineCommaListsAnd;

},

// node_modules/common-tags/es/inlineLists/inlineLists.js @74
74: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var stripIndentTransformer_1 = __fusereq(23);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var inlineLists = new TemplateTag_1d.default(inlineArrayTransformer_1d.default, stripIndentTransformer_1d.default, trimResultTransformer_1d.default);
exports.default = inlineLists;

},

// node_modules/common-tags/es/oneLineInlineLists/oneLineInlineLists.js @75
75: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var inlineArrayTransformer_1 = __fusereq(27);
var inlineArrayTransformer_1d = __fuse.dt(inlineArrayTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var replaceResultTransformer_1 = __fusereq(24);
var replaceResultTransformer_1d = __fuse.dt(replaceResultTransformer_1);
var oneLineInlineLists = new TemplateTag_1d.default(inlineArrayTransformer_1d.default, replaceResultTransformer_1d.default(/(?:\s+)/g, ' '), trimResultTransformer_1d.default);
exports.default = oneLineInlineLists;

},

// node_modules/common-tags/es/stripIndent/stripIndent.js @76
76: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var stripIndentTransformer_1 = __fusereq(23);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var stripIndent = new TemplateTag_1d.default(stripIndentTransformer_1d.default, trimResultTransformer_1d.default);
exports.default = stripIndent;

},

// node_modules/common-tags/es/stripIndents/stripIndents.js @77
77: function(__fusereq, exports, module){
exports.__esModule = true;
var TemplateTag_1 = __fusereq(21);
var TemplateTag_1d = __fuse.dt(TemplateTag_1);
var stripIndentTransformer_1 = __fusereq(23);
var stripIndentTransformer_1d = __fuse.dt(stripIndentTransformer_1);
var trimResultTransformer_1 = __fusereq(22);
var trimResultTransformer_1d = __fuse.dt(trimResultTransformer_1);
var stripIndents = new TemplateTag_1d.default(stripIndentTransformer_1d.default('all'), trimResultTransformer_1d.default);
exports.default = stripIndents;

},

// src/templates/typescriptExpress.ts @10
10: function(__fusereq, exports, module){
var _1_;
var _2_;
exports.__esModule = true;
var common_tags_1 = __fusereq(19);
const sampleValues = {
  'Int': 1111,
  'String': '"<sample value>"',
  'Boolean': false,
  'Float': 11.11,
  'ID': 1111
};
exports.typescriptExpressTemplate = params => {
  const {actionArgs, actionName, returnType, typeDefs, derive, typeMap} = params;
  const returnTypeDef = typeMap.types[returnType];
  const baseTemplate = common_tags_1.html`
    import { Request, Response } from 'express'
    ${typeDefs}

    function ${actionName}Handler(args: ${actionName}Args): ${returnType} {
      return {
        ${returnTypeDef.map(f => {
    return `${f.getName()}: ${sampleValues[f.getType().getTypename()] || sampleValues["String"]}`;
  }).join(',\n')},
      }
    }

    // Request Handler
    app.post('/${actionName}', async (req: Request, res: Response) => {
      // get request input
      const params: ${actionName}Args = req.body.input

      // run some business logic
      const result = ${actionName}Handler(params)

      /*
      // In case of errors:
      return res.status(400).json({
        message: "error happened"
      })
      */

      // success
      return res.json(result)
    })
  `;
  const hasuraOperation = ' `' + ((_1_ = derive) === null || _1_ === void 0 ? void 0 : _1_.operation) + '`\n\n';
  const derivedTemplate = common_tags_1.html`
    import { Request, Response } from 'express'
    import fetch from 'node-fetch'
    ${typeDefs}
    const HASURA_OPERATION =` + hasuraOperation + common_tags_1.html`

    const execute = async (variables) => {
      const fetchResponse = await fetch('http://localhost:8080/v1/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: HASURA_OPERATION,
          variables,
        }),
      })
      const data = await fetchResponse.json()
      console.log('DEBUG: ', data)
      return data
    }

    // Request Handler
    app.post('/${actionName}', async (req: Request, res: Response) => {
      // get request input
      const params: ${actionName}Args = req.body.input
      // execute the parent operation in Hasura
      const { data, errors } = await execute(params)
      if (errors) return res.status(400).json(errors[0])
      // run some business logic

      // success
      return res.json(data)
    })
  `;
  if ((_2_ = derive) === null || _2_ === void 0 ? void 0 : _2_.operation) return derivedTemplate; else return baseTemplate;
};

},

// src/templates/javascriptExpress.ts @11
11: function(__fusereq, exports, module){
var _1_;
var _2_;
exports.__esModule = true;
var common_tags_1 = __fusereq(19);
const sampleValues = {
  'Int': 1111,
  'String': '"<sample value>"',
  'Boolean': false,
  'Float': 11.11,
  'ID': 1111
};
exports.javascriptExpressTemplate = params => {
  const {actionArgs, actionName, returnType, typeDefs, derive, typeMap} = params;
  const returnTypeDef = typeMap.types[returnType];
  const baseTemplate = common_tags_1.html`
    ${typeDefs}

    function ${actionName}Handler(args) {
      return {
        ${returnTypeDef.map(f => {
    return `${f.getName()}: ${sampleValues[f.getType().getTypename()] || sampleValues["String"]}`;
  }).join(',\n')},
      }
    }

    // Request Handler
    app.post('/${actionName}', async (req, res) => {
      // get request input
      const params = req.body.input

      // run some business logic
      const result = ${actionName}Handler(params)

      /*
      // In case of errors:
      return res.status(400).json({
        message: "error happened"
      })
      */

      // success
      return res.json(result)
    })
  `;
  const hasuraOperation = ' `' + ((_1_ = derive) === null || _1_ === void 0 ? void 0 : _1_.operation) + '`\n\n';
  const derivedTemplate = common_tags_1.html`
    import fetch from 'node-fetch'
    ${typeDefs}
    const HASURA_OPERATION =` + hasuraOperation + common_tags_1.html`

    const execute = async (variables) => {
      const fetchResponse = await fetch('http://localhost:8080/v1/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: HASURA_OPERATION,
          variables,
        }),
      })
      const data = await fetchResponse.json()
      console.log('DEBUG: ', data)
      return data
    }

    // Request Handler
    app.post('/${actionName}', async (req, res) => {
      // get request input
      const params = req.body.input
      // execute the parent operation in Hasura
      const { data, errors } = await execute(params)
      if (errors) return res.status(400).json(errors[0])
      // run some business logic

      // success
      return res.json(data)
    })
  `;
  if ((_2_ = derive) === null || _2_ === void 0 ? void 0 : _2_.operation) return derivedTemplate; else return baseTemplate;
};

},

// src/types.ts @17
17: function(__fusereq, exports, module){
var ScalarTypes;
(function (ScalarTypes) {
  ScalarTypes["ID"] = "ID";
  ScalarTypes["INT"] = "Int";
  ScalarTypes["FLOAT"] = "Float";
  ScalarTypes["STRING"] = "String";
  ScalarTypes["BOOLEAN"] = "Boolean";
})(ScalarTypes || (ScalarTypes = {}))
exports.ScalarTypes = ScalarTypes;

},

// node_modules/graphql/index.mjs @20
20: function(__fusereq, exports, module){
exports.__esModule = true;
var version_mjs_1 = __fusereq(46);
exports.version = version_mjs_1.version;
exports.versionInfo = version_mjs_1.versionInfo;
var graphql_mjs_1 = __fusereq(47);
exports.graphql = graphql_mjs_1.graphql;
exports.graphqlSync = graphql_mjs_1.graphqlSync;
var index_mjs_1 = __fusereq(48);
exports.GraphQLSchema = index_mjs_1.GraphQLSchema;
exports.GraphQLDirective = index_mjs_1.GraphQLDirective;
exports.GraphQLScalarType = index_mjs_1.GraphQLScalarType;
exports.GraphQLObjectType = index_mjs_1.GraphQLObjectType;
exports.GraphQLInterfaceType = index_mjs_1.GraphQLInterfaceType;
exports.GraphQLUnionType = index_mjs_1.GraphQLUnionType;
exports.GraphQLEnumType = index_mjs_1.GraphQLEnumType;
exports.GraphQLInputObjectType = index_mjs_1.GraphQLInputObjectType;
exports.GraphQLList = index_mjs_1.GraphQLList;
exports.GraphQLNonNull = index_mjs_1.GraphQLNonNull;
exports.specifiedScalarTypes = index_mjs_1.specifiedScalarTypes;
exports.GraphQLInt = index_mjs_1.GraphQLInt;
exports.GraphQLFloat = index_mjs_1.GraphQLFloat;
exports.GraphQLString = index_mjs_1.GraphQLString;
exports.GraphQLBoolean = index_mjs_1.GraphQLBoolean;
exports.GraphQLID = index_mjs_1.GraphQLID;
exports.specifiedDirectives = index_mjs_1.specifiedDirectives;
exports.GraphQLIncludeDirective = index_mjs_1.GraphQLIncludeDirective;
exports.GraphQLSkipDirective = index_mjs_1.GraphQLSkipDirective;
exports.GraphQLDeprecatedDirective = index_mjs_1.GraphQLDeprecatedDirective;
exports.TypeKind = index_mjs_1.TypeKind;
exports.DEFAULT_DEPRECATION_REASON = index_mjs_1.DEFAULT_DEPRECATION_REASON;
exports.introspectionTypes = index_mjs_1.introspectionTypes;
exports.__Schema = index_mjs_1.__Schema;
exports.__Directive = index_mjs_1.__Directive;
exports.__DirectiveLocation = index_mjs_1.__DirectiveLocation;
exports.__Type = index_mjs_1.__Type;
exports.__Field = index_mjs_1.__Field;
exports.__InputValue = index_mjs_1.__InputValue;
exports.__EnumValue = index_mjs_1.__EnumValue;
exports.__TypeKind = index_mjs_1.__TypeKind;
exports.SchemaMetaFieldDef = index_mjs_1.SchemaMetaFieldDef;
exports.TypeMetaFieldDef = index_mjs_1.TypeMetaFieldDef;
exports.TypeNameMetaFieldDef = index_mjs_1.TypeNameMetaFieldDef;
exports.isSchema = index_mjs_1.isSchema;
exports.isDirective = index_mjs_1.isDirective;
exports.isType = index_mjs_1.isType;
exports.isScalarType = index_mjs_1.isScalarType;
exports.isObjectType = index_mjs_1.isObjectType;
exports.isInterfaceType = index_mjs_1.isInterfaceType;
exports.isUnionType = index_mjs_1.isUnionType;
exports.isEnumType = index_mjs_1.isEnumType;
exports.isInputObjectType = index_mjs_1.isInputObjectType;
exports.isListType = index_mjs_1.isListType;
exports.isNonNullType = index_mjs_1.isNonNullType;
exports.isInputType = index_mjs_1.isInputType;
exports.isOutputType = index_mjs_1.isOutputType;
exports.isLeafType = index_mjs_1.isLeafType;
exports.isCompositeType = index_mjs_1.isCompositeType;
exports.isAbstractType = index_mjs_1.isAbstractType;
exports.isWrappingType = index_mjs_1.isWrappingType;
exports.isNullableType = index_mjs_1.isNullableType;
exports.isNamedType = index_mjs_1.isNamedType;
exports.isRequiredArgument = index_mjs_1.isRequiredArgument;
exports.isRequiredInputField = index_mjs_1.isRequiredInputField;
exports.isSpecifiedScalarType = index_mjs_1.isSpecifiedScalarType;
exports.isIntrospectionType = index_mjs_1.isIntrospectionType;
exports.isSpecifiedDirective = index_mjs_1.isSpecifiedDirective;
exports.assertSchema = index_mjs_1.assertSchema;
exports.assertDirective = index_mjs_1.assertDirective;
exports.assertType = index_mjs_1.assertType;
exports.assertScalarType = index_mjs_1.assertScalarType;
exports.assertObjectType = index_mjs_1.assertObjectType;
exports.assertInterfaceType = index_mjs_1.assertInterfaceType;
exports.assertUnionType = index_mjs_1.assertUnionType;
exports.assertEnumType = index_mjs_1.assertEnumType;
exports.assertInputObjectType = index_mjs_1.assertInputObjectType;
exports.assertListType = index_mjs_1.assertListType;
exports.assertNonNullType = index_mjs_1.assertNonNullType;
exports.assertInputType = index_mjs_1.assertInputType;
exports.assertOutputType = index_mjs_1.assertOutputType;
exports.assertLeafType = index_mjs_1.assertLeafType;
exports.assertCompositeType = index_mjs_1.assertCompositeType;
exports.assertAbstractType = index_mjs_1.assertAbstractType;
exports.assertWrappingType = index_mjs_1.assertWrappingType;
exports.assertNullableType = index_mjs_1.assertNullableType;
exports.assertNamedType = index_mjs_1.assertNamedType;
exports.getNullableType = index_mjs_1.getNullableType;
exports.getNamedType = index_mjs_1.getNamedType;
exports.validateSchema = index_mjs_1.validateSchema;
exports.assertValidSchema = index_mjs_1.assertValidSchema;
var index_mjs_2 = __fusereq(49);
exports.Source = index_mjs_2.Source;
exports.getLocation = index_mjs_2.getLocation;
exports.printLocation = index_mjs_2.printLocation;
exports.printSourceLocation = index_mjs_2.printSourceLocation;
exports.Lexer = index_mjs_2.Lexer;
exports.TokenKind = index_mjs_2.TokenKind;
exports.parse = index_mjs_2.parse;
exports.parseValue = index_mjs_2.parseValue;
exports.parseType = index_mjs_2.parseType;
exports.print = index_mjs_2.print;
exports.visit = index_mjs_2.visit;
exports.visitInParallel = index_mjs_2.visitInParallel;
exports.getVisitFn = index_mjs_2.getVisitFn;
exports.BREAK = index_mjs_2.BREAK;
exports.Kind = index_mjs_2.Kind;
exports.DirectiveLocation = index_mjs_2.DirectiveLocation;
exports.isDefinitionNode = index_mjs_2.isDefinitionNode;
exports.isExecutableDefinitionNode = index_mjs_2.isExecutableDefinitionNode;
exports.isSelectionNode = index_mjs_2.isSelectionNode;
exports.isValueNode = index_mjs_2.isValueNode;
exports.isTypeNode = index_mjs_2.isTypeNode;
exports.isTypeSystemDefinitionNode = index_mjs_2.isTypeSystemDefinitionNode;
exports.isTypeDefinitionNode = index_mjs_2.isTypeDefinitionNode;
exports.isTypeSystemExtensionNode = index_mjs_2.isTypeSystemExtensionNode;
exports.isTypeExtensionNode = index_mjs_2.isTypeExtensionNode;
var index_mjs_3 = __fusereq(50);
exports.execute = index_mjs_3.execute;
exports.defaultFieldResolver = index_mjs_3.defaultFieldResolver;
exports.defaultTypeResolver = index_mjs_3.defaultTypeResolver;
exports.responsePathAsArray = index_mjs_3.responsePathAsArray;
exports.getDirectiveValues = index_mjs_3.getDirectiveValues;
var index_mjs_4 = __fusereq(51);
exports.subscribe = index_mjs_4.subscribe;
exports.createSourceEventStream = index_mjs_4.createSourceEventStream;
var index_mjs_5 = __fusereq(52);
exports.validate = index_mjs_5.validate;
exports.ValidationContext = index_mjs_5.ValidationContext;
exports.specifiedRules = index_mjs_5.specifiedRules;
exports.ExecutableDefinitionsRule = index_mjs_5.ExecutableDefinitionsRule;
exports.FieldsOnCorrectTypeRule = index_mjs_5.FieldsOnCorrectTypeRule;
exports.FragmentsOnCompositeTypesRule = index_mjs_5.FragmentsOnCompositeTypesRule;
exports.KnownArgumentNamesRule = index_mjs_5.KnownArgumentNamesRule;
exports.KnownDirectivesRule = index_mjs_5.KnownDirectivesRule;
exports.KnownFragmentNamesRule = index_mjs_5.KnownFragmentNamesRule;
exports.KnownTypeNamesRule = index_mjs_5.KnownTypeNamesRule;
exports.LoneAnonymousOperationRule = index_mjs_5.LoneAnonymousOperationRule;
exports.NoFragmentCyclesRule = index_mjs_5.NoFragmentCyclesRule;
exports.NoUndefinedVariablesRule = index_mjs_5.NoUndefinedVariablesRule;
exports.NoUnusedFragmentsRule = index_mjs_5.NoUnusedFragmentsRule;
exports.NoUnusedVariablesRule = index_mjs_5.NoUnusedVariablesRule;
exports.OverlappingFieldsCanBeMergedRule = index_mjs_5.OverlappingFieldsCanBeMergedRule;
exports.PossibleFragmentSpreadsRule = index_mjs_5.PossibleFragmentSpreadsRule;
exports.ProvidedRequiredArgumentsRule = index_mjs_5.ProvidedRequiredArgumentsRule;
exports.ScalarLeafsRule = index_mjs_5.ScalarLeafsRule;
exports.SingleFieldSubscriptionsRule = index_mjs_5.SingleFieldSubscriptionsRule;
exports.UniqueArgumentNamesRule = index_mjs_5.UniqueArgumentNamesRule;
exports.UniqueDirectivesPerLocationRule = index_mjs_5.UniqueDirectivesPerLocationRule;
exports.UniqueFragmentNamesRule = index_mjs_5.UniqueFragmentNamesRule;
exports.UniqueInputFieldNamesRule = index_mjs_5.UniqueInputFieldNamesRule;
exports.UniqueOperationNamesRule = index_mjs_5.UniqueOperationNamesRule;
exports.UniqueVariableNamesRule = index_mjs_5.UniqueVariableNamesRule;
exports.ValuesOfCorrectTypeRule = index_mjs_5.ValuesOfCorrectTypeRule;
exports.VariablesAreInputTypesRule = index_mjs_5.VariablesAreInputTypesRule;
exports.VariablesInAllowedPositionRule = index_mjs_5.VariablesInAllowedPositionRule;
exports.LoneSchemaDefinitionRule = index_mjs_5.LoneSchemaDefinitionRule;
exports.UniqueOperationTypesRule = index_mjs_5.UniqueOperationTypesRule;
exports.UniqueTypeNamesRule = index_mjs_5.UniqueTypeNamesRule;
exports.UniqueEnumValueNamesRule = index_mjs_5.UniqueEnumValueNamesRule;
exports.UniqueFieldDefinitionNamesRule = index_mjs_5.UniqueFieldDefinitionNamesRule;
exports.UniqueDirectiveNamesRule = index_mjs_5.UniqueDirectiveNamesRule;
exports.PossibleTypeExtensionsRule = index_mjs_5.PossibleTypeExtensionsRule;
var index_mjs_6 = __fusereq(53);
exports.GraphQLError = index_mjs_6.GraphQLError;
exports.syntaxError = index_mjs_6.syntaxError;
exports.locatedError = index_mjs_6.locatedError;
exports.printError = index_mjs_6.printError;
exports.formatError = index_mjs_6.formatError;
var index_mjs_7 = __fusereq(54);
exports.getIntrospectionQuery = index_mjs_7.getIntrospectionQuery;
exports.getOperationAST = index_mjs_7.getOperationAST;
exports.getOperationRootType = index_mjs_7.getOperationRootType;
exports.introspectionFromSchema = index_mjs_7.introspectionFromSchema;
exports.buildClientSchema = index_mjs_7.buildClientSchema;
exports.buildASTSchema = index_mjs_7.buildASTSchema;
exports.buildSchema = index_mjs_7.buildSchema;
exports.getDescription = index_mjs_7.getDescription;
exports.extendSchema = index_mjs_7.extendSchema;
exports.lexicographicSortSchema = index_mjs_7.lexicographicSortSchema;
exports.printSchema = index_mjs_7.printSchema;
exports.printType = index_mjs_7.printType;
exports.printIntrospectionSchema = index_mjs_7.printIntrospectionSchema;
exports.typeFromAST = index_mjs_7.typeFromAST;
exports.valueFromAST = index_mjs_7.valueFromAST;
exports.valueFromASTUntyped = index_mjs_7.valueFromASTUntyped;
exports.astFromValue = index_mjs_7.astFromValue;
exports.TypeInfo = index_mjs_7.TypeInfo;
exports.visitWithTypeInfo = index_mjs_7.visitWithTypeInfo;
exports.coerceInputValue = index_mjs_7.coerceInputValue;
exports.concatAST = index_mjs_7.concatAST;
exports.separateOperations = index_mjs_7.separateOperations;
exports.stripIgnoredCharacters = index_mjs_7.stripIgnoredCharacters;
exports.isEqualType = index_mjs_7.isEqualType;
exports.isTypeSubTypeOf = index_mjs_7.isTypeSubTypeOf;
exports.doTypesOverlap = index_mjs_7.doTypesOverlap;
exports.assertValidName = index_mjs_7.assertValidName;
exports.isValidNameError = index_mjs_7.isValidNameError;
exports.BreakingChangeType = index_mjs_7.BreakingChangeType;
exports.DangerousChangeType = index_mjs_7.DangerousChangeType;
exports.findBreakingChanges = index_mjs_7.findBreakingChanges;
exports.findDangerousChanges = index_mjs_7.findDangerousChanges;
exports.findDeprecatedUsages = index_mjs_7.findDeprecatedUsages;

},

// node_modules/graphql/version.mjs @46
46: function(__fusereq, exports, module){
exports.__esModule = true;
exports.version = '15.0.0';
exports.versionInfo = Object.freeze({
  major: 15,
  minor: 0,
  patch: 0,
  preReleaseTag: null
});

},

// node_modules/graphql/graphql.mjs @47
47: function(__fusereq, exports, module){
exports.__esModule = true;
var isPromise_mjs_1 = __fusereq(78);
var isPromise_mjs_1d = __fuse.dt(isPromise_mjs_1);
var parser_mjs_1 = __fusereq(79);
var validate_mjs_1 = __fusereq(80);
var validate_mjs_2 = __fusereq(81);
var execute_mjs_1 = __fusereq(82);
function graphql(argsOrSchema, source, rootValue, contextValue, variableValues, operationName, fieldResolver, typeResolver) {
  var _arguments = arguments;
  return new Promise(function (resolve) {
    return resolve(_arguments.length === 1 ? graphqlImpl(argsOrSchema) : graphqlImpl({
      schema: argsOrSchema,
      source: source,
      rootValue: rootValue,
      contextValue: contextValue,
      variableValues: variableValues,
      operationName: operationName,
      fieldResolver: fieldResolver,
      typeResolver: typeResolver
    }));
  });
}
exports.graphql = graphql;
function graphqlSync(argsOrSchema, source, rootValue, contextValue, variableValues, operationName, fieldResolver, typeResolver) {
  var result = arguments.length === 1 ? graphqlImpl(argsOrSchema) : graphqlImpl({
    schema: argsOrSchema,
    source: source,
    rootValue: rootValue,
    contextValue: contextValue,
    variableValues: variableValues,
    operationName: operationName,
    fieldResolver: fieldResolver,
    typeResolver: typeResolver
  });
  if (isPromise_mjs_1d.default(result)) {
    throw new Error('GraphQL execution failed to complete synchronously.');
  }
  return result;
}
exports.graphqlSync = graphqlSync;
function graphqlImpl(args) {
  var schema = args.schema, source = args.source, rootValue = args.rootValue, contextValue = args.contextValue, variableValues = args.variableValues, operationName = args.operationName, fieldResolver = args.fieldResolver, typeResolver = args.typeResolver;
  var schemaValidationErrors = validate_mjs_2.validateSchema(schema);
  if (schemaValidationErrors.length > 0) {
    return {
      errors: schemaValidationErrors
    };
  }
  var document;
  try {
    document = parser_mjs_1.parse(source);
  } catch (syntaxError) {
    return {
      errors: [syntaxError]
    };
  }
  var validationErrors = validate_mjs_1.validate(schema, document);
  if (validationErrors.length > 0) {
    return {
      errors: validationErrors
    };
  }
  return execute_mjs_1.execute({
    schema: schema,
    document: document,
    rootValue: rootValue,
    contextValue: contextValue,
    variableValues: variableValues,
    operationName: operationName,
    fieldResolver: fieldResolver,
    typeResolver: typeResolver
  });
}

},

// node_modules/graphql/type/index.mjs @48
48: function(__fusereq, exports, module){
exports.__esModule = true;
var schema_mjs_1 = __fusereq(83);
exports.isSchema = schema_mjs_1.isSchema;
exports.assertSchema = schema_mjs_1.assertSchema;
exports.GraphQLSchema = schema_mjs_1.GraphQLSchema;
var definition_mjs_1 = __fusereq(84);
exports.isType = definition_mjs_1.isType;
exports.isScalarType = definition_mjs_1.isScalarType;
exports.isObjectType = definition_mjs_1.isObjectType;
exports.isInterfaceType = definition_mjs_1.isInterfaceType;
exports.isUnionType = definition_mjs_1.isUnionType;
exports.isEnumType = definition_mjs_1.isEnumType;
exports.isInputObjectType = definition_mjs_1.isInputObjectType;
exports.isListType = definition_mjs_1.isListType;
exports.isNonNullType = definition_mjs_1.isNonNullType;
exports.isInputType = definition_mjs_1.isInputType;
exports.isOutputType = definition_mjs_1.isOutputType;
exports.isLeafType = definition_mjs_1.isLeafType;
exports.isCompositeType = definition_mjs_1.isCompositeType;
exports.isAbstractType = definition_mjs_1.isAbstractType;
exports.isWrappingType = definition_mjs_1.isWrappingType;
exports.isNullableType = definition_mjs_1.isNullableType;
exports.isNamedType = definition_mjs_1.isNamedType;
exports.isRequiredArgument = definition_mjs_1.isRequiredArgument;
exports.isRequiredInputField = definition_mjs_1.isRequiredInputField;
exports.assertType = definition_mjs_1.assertType;
exports.assertScalarType = definition_mjs_1.assertScalarType;
exports.assertObjectType = definition_mjs_1.assertObjectType;
exports.assertInterfaceType = definition_mjs_1.assertInterfaceType;
exports.assertUnionType = definition_mjs_1.assertUnionType;
exports.assertEnumType = definition_mjs_1.assertEnumType;
exports.assertInputObjectType = definition_mjs_1.assertInputObjectType;
exports.assertListType = definition_mjs_1.assertListType;
exports.assertNonNullType = definition_mjs_1.assertNonNullType;
exports.assertInputType = definition_mjs_1.assertInputType;
exports.assertOutputType = definition_mjs_1.assertOutputType;
exports.assertLeafType = definition_mjs_1.assertLeafType;
exports.assertCompositeType = definition_mjs_1.assertCompositeType;
exports.assertAbstractType = definition_mjs_1.assertAbstractType;
exports.assertWrappingType = definition_mjs_1.assertWrappingType;
exports.assertNullableType = definition_mjs_1.assertNullableType;
exports.assertNamedType = definition_mjs_1.assertNamedType;
exports.getNullableType = definition_mjs_1.getNullableType;
exports.getNamedType = definition_mjs_1.getNamedType;
exports.GraphQLScalarType = definition_mjs_1.GraphQLScalarType;
exports.GraphQLObjectType = definition_mjs_1.GraphQLObjectType;
exports.GraphQLInterfaceType = definition_mjs_1.GraphQLInterfaceType;
exports.GraphQLUnionType = definition_mjs_1.GraphQLUnionType;
exports.GraphQLEnumType = definition_mjs_1.GraphQLEnumType;
exports.GraphQLInputObjectType = definition_mjs_1.GraphQLInputObjectType;
exports.GraphQLList = definition_mjs_1.GraphQLList;
exports.GraphQLNonNull = definition_mjs_1.GraphQLNonNull;
var directives_mjs_1 = __fusereq(85);
exports.isDirective = directives_mjs_1.isDirective;
exports.assertDirective = directives_mjs_1.assertDirective;
exports.GraphQLDirective = directives_mjs_1.GraphQLDirective;
exports.isSpecifiedDirective = directives_mjs_1.isSpecifiedDirective;
exports.specifiedDirectives = directives_mjs_1.specifiedDirectives;
exports.GraphQLIncludeDirective = directives_mjs_1.GraphQLIncludeDirective;
exports.GraphQLSkipDirective = directives_mjs_1.GraphQLSkipDirective;
exports.GraphQLDeprecatedDirective = directives_mjs_1.GraphQLDeprecatedDirective;
exports.DEFAULT_DEPRECATION_REASON = directives_mjs_1.DEFAULT_DEPRECATION_REASON;
var scalars_mjs_1 = __fusereq(86);
exports.isSpecifiedScalarType = scalars_mjs_1.isSpecifiedScalarType;
exports.specifiedScalarTypes = scalars_mjs_1.specifiedScalarTypes;
exports.GraphQLInt = scalars_mjs_1.GraphQLInt;
exports.GraphQLFloat = scalars_mjs_1.GraphQLFloat;
exports.GraphQLString = scalars_mjs_1.GraphQLString;
exports.GraphQLBoolean = scalars_mjs_1.GraphQLBoolean;
exports.GraphQLID = scalars_mjs_1.GraphQLID;
var introspection_mjs_1 = __fusereq(87);
exports.isIntrospectionType = introspection_mjs_1.isIntrospectionType;
exports.introspectionTypes = introspection_mjs_1.introspectionTypes;
exports.__Schema = introspection_mjs_1.__Schema;
exports.__Directive = introspection_mjs_1.__Directive;
exports.__DirectiveLocation = introspection_mjs_1.__DirectiveLocation;
exports.__Type = introspection_mjs_1.__Type;
exports.__Field = introspection_mjs_1.__Field;
exports.__InputValue = introspection_mjs_1.__InputValue;
exports.__EnumValue = introspection_mjs_1.__EnumValue;
exports.__TypeKind = introspection_mjs_1.__TypeKind;
exports.TypeKind = introspection_mjs_1.TypeKind;
exports.SchemaMetaFieldDef = introspection_mjs_1.SchemaMetaFieldDef;
exports.TypeMetaFieldDef = introspection_mjs_1.TypeMetaFieldDef;
exports.TypeNameMetaFieldDef = introspection_mjs_1.TypeNameMetaFieldDef;
var validate_mjs_1 = __fusereq(81);
exports.validateSchema = validate_mjs_1.validateSchema;
exports.assertValidSchema = validate_mjs_1.assertValidSchema;

},

// node_modules/graphql/language/index.mjs @49
49: function(__fusereq, exports, module){
exports.__esModule = true;
var source_mjs_1 = __fusereq(88);
exports.Source = source_mjs_1.Source;
var location_mjs_1 = __fusereq(89);
exports.getLocation = location_mjs_1.getLocation;
var printLocation_mjs_1 = __fusereq(90);
exports.printLocation = printLocation_mjs_1.printLocation;
exports.printSourceLocation = printLocation_mjs_1.printSourceLocation;
var kinds_mjs_1 = __fusereq(91);
exports.Kind = kinds_mjs_1.Kind;
var tokenKind_mjs_1 = __fusereq(92);
exports.TokenKind = tokenKind_mjs_1.TokenKind;
var lexer_mjs_1 = __fusereq(93);
exports.Lexer = lexer_mjs_1.Lexer;
var parser_mjs_1 = __fusereq(79);
exports.parse = parser_mjs_1.parse;
exports.parseValue = parser_mjs_1.parseValue;
exports.parseType = parser_mjs_1.parseType;
var printer_mjs_1 = __fusereq(94);
exports.print = printer_mjs_1.print;
var visitor_mjs_1 = __fusereq(95);
exports.visit = visitor_mjs_1.visit;
exports.visitInParallel = visitor_mjs_1.visitInParallel;
exports.getVisitFn = visitor_mjs_1.getVisitFn;
exports.BREAK = visitor_mjs_1.BREAK;
var predicates_mjs_1 = __fusereq(96);
exports.isDefinitionNode = predicates_mjs_1.isDefinitionNode;
exports.isExecutableDefinitionNode = predicates_mjs_1.isExecutableDefinitionNode;
exports.isSelectionNode = predicates_mjs_1.isSelectionNode;
exports.isValueNode = predicates_mjs_1.isValueNode;
exports.isTypeNode = predicates_mjs_1.isTypeNode;
exports.isTypeSystemDefinitionNode = predicates_mjs_1.isTypeSystemDefinitionNode;
exports.isTypeDefinitionNode = predicates_mjs_1.isTypeDefinitionNode;
exports.isTypeSystemExtensionNode = predicates_mjs_1.isTypeSystemExtensionNode;
exports.isTypeExtensionNode = predicates_mjs_1.isTypeExtensionNode;
var directiveLocation_mjs_1 = __fusereq(97);
exports.DirectiveLocation = directiveLocation_mjs_1.DirectiveLocation;

},

// node_modules/graphql/execution/index.mjs @50
50: function(__fusereq, exports, module){
exports.__esModule = true;
var Path_mjs_1 = __fusereq(98);
exports.responsePathAsArray = Path_mjs_1.pathToArray;
var execute_mjs_1 = __fusereq(82);
exports.execute = execute_mjs_1.execute;
exports.defaultFieldResolver = execute_mjs_1.defaultFieldResolver;
exports.defaultTypeResolver = execute_mjs_1.defaultTypeResolver;
var values_mjs_1 = __fusereq(99);
exports.getDirectiveValues = values_mjs_1.getDirectiveValues;

},

// node_modules/graphql/subscription/index.mjs @51
51: function(__fusereq, exports, module){
exports.__esModule = true;
var subscribe_mjs_1 = __fusereq(100);
exports.subscribe = subscribe_mjs_1.subscribe;
exports.createSourceEventStream = subscribe_mjs_1.createSourceEventStream;

},

// node_modules/graphql/validation/index.mjs @52
52: function(__fusereq, exports, module){
exports.__esModule = true;
var validate_mjs_1 = __fusereq(80);
exports.validate = validate_mjs_1.validate;
var ValidationContext_mjs_1 = __fusereq(101);
exports.ValidationContext = ValidationContext_mjs_1.ValidationContext;
var specifiedRules_mjs_1 = __fusereq(102);
exports.specifiedRules = specifiedRules_mjs_1.specifiedRules;
var ExecutableDefinitionsRule_mjs_1 = __fusereq(103);
exports.ExecutableDefinitionsRule = ExecutableDefinitionsRule_mjs_1.ExecutableDefinitionsRule;
var FieldsOnCorrectTypeRule_mjs_1 = __fusereq(104);
exports.FieldsOnCorrectTypeRule = FieldsOnCorrectTypeRule_mjs_1.FieldsOnCorrectTypeRule;
var FragmentsOnCompositeTypesRule_mjs_1 = __fusereq(105);
exports.FragmentsOnCompositeTypesRule = FragmentsOnCompositeTypesRule_mjs_1.FragmentsOnCompositeTypesRule;
var KnownArgumentNamesRule_mjs_1 = __fusereq(106);
exports.KnownArgumentNamesRule = KnownArgumentNamesRule_mjs_1.KnownArgumentNamesRule;
var KnownDirectivesRule_mjs_1 = __fusereq(107);
exports.KnownDirectivesRule = KnownDirectivesRule_mjs_1.KnownDirectivesRule;
var KnownFragmentNamesRule_mjs_1 = __fusereq(108);
exports.KnownFragmentNamesRule = KnownFragmentNamesRule_mjs_1.KnownFragmentNamesRule;
var KnownTypeNamesRule_mjs_1 = __fusereq(109);
exports.KnownTypeNamesRule = KnownTypeNamesRule_mjs_1.KnownTypeNamesRule;
var LoneAnonymousOperationRule_mjs_1 = __fusereq(110);
exports.LoneAnonymousOperationRule = LoneAnonymousOperationRule_mjs_1.LoneAnonymousOperationRule;
var NoFragmentCyclesRule_mjs_1 = __fusereq(111);
exports.NoFragmentCyclesRule = NoFragmentCyclesRule_mjs_1.NoFragmentCyclesRule;
var NoUndefinedVariablesRule_mjs_1 = __fusereq(112);
exports.NoUndefinedVariablesRule = NoUndefinedVariablesRule_mjs_1.NoUndefinedVariablesRule;
var NoUnusedFragmentsRule_mjs_1 = __fusereq(113);
exports.NoUnusedFragmentsRule = NoUnusedFragmentsRule_mjs_1.NoUnusedFragmentsRule;
var NoUnusedVariablesRule_mjs_1 = __fusereq(114);
exports.NoUnusedVariablesRule = NoUnusedVariablesRule_mjs_1.NoUnusedVariablesRule;
var OverlappingFieldsCanBeMergedRule_mjs_1 = __fusereq(115);
exports.OverlappingFieldsCanBeMergedRule = OverlappingFieldsCanBeMergedRule_mjs_1.OverlappingFieldsCanBeMergedRule;
var PossibleFragmentSpreadsRule_mjs_1 = __fusereq(116);
exports.PossibleFragmentSpreadsRule = PossibleFragmentSpreadsRule_mjs_1.PossibleFragmentSpreadsRule;
var ProvidedRequiredArgumentsRule_mjs_1 = __fusereq(117);
exports.ProvidedRequiredArgumentsRule = ProvidedRequiredArgumentsRule_mjs_1.ProvidedRequiredArgumentsRule;
var ScalarLeafsRule_mjs_1 = __fusereq(118);
exports.ScalarLeafsRule = ScalarLeafsRule_mjs_1.ScalarLeafsRule;
var SingleFieldSubscriptionsRule_mjs_1 = __fusereq(119);
exports.SingleFieldSubscriptionsRule = SingleFieldSubscriptionsRule_mjs_1.SingleFieldSubscriptionsRule;
var UniqueArgumentNamesRule_mjs_1 = __fusereq(120);
exports.UniqueArgumentNamesRule = UniqueArgumentNamesRule_mjs_1.UniqueArgumentNamesRule;
var UniqueDirectivesPerLocationRule_mjs_1 = __fusereq(121);
exports.UniqueDirectivesPerLocationRule = UniqueDirectivesPerLocationRule_mjs_1.UniqueDirectivesPerLocationRule;
var UniqueFragmentNamesRule_mjs_1 = __fusereq(122);
exports.UniqueFragmentNamesRule = UniqueFragmentNamesRule_mjs_1.UniqueFragmentNamesRule;
var UniqueInputFieldNamesRule_mjs_1 = __fusereq(123);
exports.UniqueInputFieldNamesRule = UniqueInputFieldNamesRule_mjs_1.UniqueInputFieldNamesRule;
var UniqueOperationNamesRule_mjs_1 = __fusereq(124);
exports.UniqueOperationNamesRule = UniqueOperationNamesRule_mjs_1.UniqueOperationNamesRule;
var UniqueVariableNamesRule_mjs_1 = __fusereq(125);
exports.UniqueVariableNamesRule = UniqueVariableNamesRule_mjs_1.UniqueVariableNamesRule;
var ValuesOfCorrectTypeRule_mjs_1 = __fusereq(126);
exports.ValuesOfCorrectTypeRule = ValuesOfCorrectTypeRule_mjs_1.ValuesOfCorrectTypeRule;
var VariablesAreInputTypesRule_mjs_1 = __fusereq(127);
exports.VariablesAreInputTypesRule = VariablesAreInputTypesRule_mjs_1.VariablesAreInputTypesRule;
var VariablesInAllowedPositionRule_mjs_1 = __fusereq(128);
exports.VariablesInAllowedPositionRule = VariablesInAllowedPositionRule_mjs_1.VariablesInAllowedPositionRule;
var LoneSchemaDefinitionRule_mjs_1 = __fusereq(129);
exports.LoneSchemaDefinitionRule = LoneSchemaDefinitionRule_mjs_1.LoneSchemaDefinitionRule;
var UniqueOperationTypesRule_mjs_1 = __fusereq(130);
exports.UniqueOperationTypesRule = UniqueOperationTypesRule_mjs_1.UniqueOperationTypesRule;
var UniqueTypeNamesRule_mjs_1 = __fusereq(131);
exports.UniqueTypeNamesRule = UniqueTypeNamesRule_mjs_1.UniqueTypeNamesRule;
var UniqueEnumValueNamesRule_mjs_1 = __fusereq(132);
exports.UniqueEnumValueNamesRule = UniqueEnumValueNamesRule_mjs_1.UniqueEnumValueNamesRule;
var UniqueFieldDefinitionNamesRule_mjs_1 = __fusereq(133);
exports.UniqueFieldDefinitionNamesRule = UniqueFieldDefinitionNamesRule_mjs_1.UniqueFieldDefinitionNamesRule;
var UniqueDirectiveNamesRule_mjs_1 = __fusereq(134);
exports.UniqueDirectiveNamesRule = UniqueDirectiveNamesRule_mjs_1.UniqueDirectiveNamesRule;
var PossibleTypeExtensionsRule_mjs_1 = __fusereq(135);
exports.PossibleTypeExtensionsRule = PossibleTypeExtensionsRule_mjs_1.PossibleTypeExtensionsRule;

},

// node_modules/graphql/error/index.mjs @53
53: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
exports.GraphQLError = GraphQLError_mjs_1.GraphQLError;
exports.printError = GraphQLError_mjs_1.printError;
var syntaxError_mjs_1 = __fusereq(137);
exports.syntaxError = syntaxError_mjs_1.syntaxError;
var locatedError_mjs_1 = __fusereq(138);
exports.locatedError = locatedError_mjs_1.locatedError;
var formatError_mjs_1 = __fusereq(139);
exports.formatError = formatError_mjs_1.formatError;

},

// node_modules/graphql/utilities/index.mjs @54
54: function(__fusereq, exports, module){
exports.__esModule = true;
var getIntrospectionQuery_mjs_1 = __fusereq(140);
exports.getIntrospectionQuery = getIntrospectionQuery_mjs_1.getIntrospectionQuery;
var getOperationAST_mjs_1 = __fusereq(141);
exports.getOperationAST = getOperationAST_mjs_1.getOperationAST;
var getOperationRootType_mjs_1 = __fusereq(142);
exports.getOperationRootType = getOperationRootType_mjs_1.getOperationRootType;
var introspectionFromSchema_mjs_1 = __fusereq(143);
exports.introspectionFromSchema = introspectionFromSchema_mjs_1.introspectionFromSchema;
var buildClientSchema_mjs_1 = __fusereq(144);
exports.buildClientSchema = buildClientSchema_mjs_1.buildClientSchema;
var buildASTSchema_mjs_1 = __fusereq(145);
exports.buildASTSchema = buildASTSchema_mjs_1.buildASTSchema;
exports.buildSchema = buildASTSchema_mjs_1.buildSchema;
var extendSchema_mjs_1 = __fusereq(146);
exports.extendSchema = extendSchema_mjs_1.extendSchema;
exports.getDescription = extendSchema_mjs_1.getDescription;
var lexicographicSortSchema_mjs_1 = __fusereq(147);
exports.lexicographicSortSchema = lexicographicSortSchema_mjs_1.lexicographicSortSchema;
var printSchema_mjs_1 = __fusereq(148);
exports.printSchema = printSchema_mjs_1.printSchema;
exports.printType = printSchema_mjs_1.printType;
exports.printIntrospectionSchema = printSchema_mjs_1.printIntrospectionSchema;
var typeFromAST_mjs_1 = __fusereq(149);
exports.typeFromAST = typeFromAST_mjs_1.typeFromAST;
var valueFromAST_mjs_1 = __fusereq(150);
exports.valueFromAST = valueFromAST_mjs_1.valueFromAST;
var valueFromASTUntyped_mjs_1 = __fusereq(151);
exports.valueFromASTUntyped = valueFromASTUntyped_mjs_1.valueFromASTUntyped;
var astFromValue_mjs_1 = __fusereq(152);
exports.astFromValue = astFromValue_mjs_1.astFromValue;
var TypeInfo_mjs_1 = __fusereq(153);
exports.TypeInfo = TypeInfo_mjs_1.TypeInfo;
exports.visitWithTypeInfo = TypeInfo_mjs_1.visitWithTypeInfo;
var coerceInputValue_mjs_1 = __fusereq(154);
exports.coerceInputValue = coerceInputValue_mjs_1.coerceInputValue;
var concatAST_mjs_1 = __fusereq(155);
exports.concatAST = concatAST_mjs_1.concatAST;
var separateOperations_mjs_1 = __fusereq(156);
exports.separateOperations = separateOperations_mjs_1.separateOperations;
var stripIgnoredCharacters_mjs_1 = __fusereq(157);
exports.stripIgnoredCharacters = stripIgnoredCharacters_mjs_1.stripIgnoredCharacters;
var typeComparators_mjs_1 = __fusereq(158);
exports.isEqualType = typeComparators_mjs_1.isEqualType;
exports.isTypeSubTypeOf = typeComparators_mjs_1.isTypeSubTypeOf;
exports.doTypesOverlap = typeComparators_mjs_1.doTypesOverlap;
var assertValidName_mjs_1 = __fusereq(159);
exports.assertValidName = assertValidName_mjs_1.assertValidName;
exports.isValidNameError = assertValidName_mjs_1.isValidNameError;
var findBreakingChanges_mjs_1 = __fusereq(160);
exports.BreakingChangeType = findBreakingChanges_mjs_1.BreakingChangeType;
exports.DangerousChangeType = findBreakingChanges_mjs_1.DangerousChangeType;
exports.findBreakingChanges = findBreakingChanges_mjs_1.findBreakingChanges;
exports.findDangerousChanges = findBreakingChanges_mjs_1.findDangerousChanges;
var findDeprecatedUsages_mjs_1 = __fusereq(161);
exports.findDeprecatedUsages = findDeprecatedUsages_mjs_1.findDeprecatedUsages;

},

// node_modules/graphql/jsutils/isPromise.mjs @78
78: function(__fusereq, exports, module){
exports.__esModule = true;
function isPromise(value) {
  return typeof (value === null || value === void 0 ? void 0 : value.then) === 'function';
}
exports.default = isPromise;

},

// node_modules/graphql/language/parser.mjs @79
79: function(__fusereq, exports, module){
exports.__esModule = true;
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var syntaxError_mjs_1 = __fusereq(137);
var kinds_mjs_1 = __fusereq(91);
var source_mjs_1 = __fusereq(88);
var directiveLocation_mjs_1 = __fusereq(97);
var tokenKind_mjs_1 = __fusereq(92);
var lexer_mjs_1 = __fusereq(93);
var ast_mjs_1 = __fusereq(164);
function parse(source, options) {
  var parser = new Parser(source, options);
  return parser.parseDocument();
}
exports.parse = parse;
function parseValue(source, options) {
  var parser = new Parser(source, options);
  parser.expectToken(tokenKind_mjs_1.TokenKind.SOF);
  var value = parser.parseValueLiteral(false);
  parser.expectToken(tokenKind_mjs_1.TokenKind.EOF);
  return value;
}
exports.parseValue = parseValue;
function parseType(source, options) {
  var parser = new Parser(source, options);
  parser.expectToken(tokenKind_mjs_1.TokenKind.SOF);
  var type = parser.parseTypeReference();
  parser.expectToken(tokenKind_mjs_1.TokenKind.EOF);
  return type;
}
exports.parseType = parseType;
var Parser = (function () {
  function Parser(source, options) {
    var sourceObj = typeof source === 'string' ? new source_mjs_1.Source(source) : source;
    sourceObj instanceof source_mjs_1.Source || devAssert_mjs_1d.default(0, ("Must provide Source. Received: ").concat(inspect_mjs_1d.default(sourceObj), "."));
    this._lexer = new lexer_mjs_1.Lexer(sourceObj);
    this._options = options;
  }
  var _proto = Parser.prototype;
  _proto.parseName = function parseName() {
    var token = this.expectToken(tokenKind_mjs_1.TokenKind.NAME);
    return {
      kind: kinds_mjs_1.Kind.NAME,
      value: token.value,
      loc: this.loc(token)
    };
  };
  _proto.parseDocument = function parseDocument() {
    var start = this._lexer.token;
    return {
      kind: kinds_mjs_1.Kind.DOCUMENT,
      definitions: this.many(tokenKind_mjs_1.TokenKind.SOF, this.parseDefinition, tokenKind_mjs_1.TokenKind.EOF),
      loc: this.loc(start)
    };
  };
  _proto.parseDefinition = function parseDefinition() {
    if (this.peek(tokenKind_mjs_1.TokenKind.NAME)) {
      switch (this._lexer.token.value) {
        case 'query':
        case 'mutation':
        case 'subscription':
          return this.parseOperationDefinition();
        case 'fragment':
          return this.parseFragmentDefinition();
        case 'schema':
        case 'scalar':
        case 'type':
        case 'interface':
        case 'union':
        case 'enum':
        case 'input':
        case 'directive':
          return this.parseTypeSystemDefinition();
        case 'extend':
          return this.parseTypeSystemExtension();
      }
    } else if (this.peek(tokenKind_mjs_1.TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    } else if (this.peekDescription()) {
      return this.parseTypeSystemDefinition();
    }
    throw this.unexpected();
  };
  _proto.parseOperationDefinition = function parseOperationDefinition() {
    var start = this._lexer.token;
    if (this.peek(tokenKind_mjs_1.TokenKind.BRACE_L)) {
      return {
        kind: kinds_mjs_1.Kind.OPERATION_DEFINITION,
        operation: 'query',
        name: undefined,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet(),
        loc: this.loc(start)
      };
    }
    var operation = this.parseOperationType();
    var name;
    if (this.peek(tokenKind_mjs_1.TokenKind.NAME)) {
      name = this.parseName();
    }
    return {
      kind: kinds_mjs_1.Kind.OPERATION_DEFINITION,
      operation: operation,
      name: name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  };
  _proto.parseOperationType = function parseOperationType() {
    var operationToken = this.expectToken(tokenKind_mjs_1.TokenKind.NAME);
    switch (operationToken.value) {
      case 'query':
        return 'query';
      case 'mutation':
        return 'mutation';
      case 'subscription':
        return 'subscription';
    }
    throw this.unexpected(operationToken);
  };
  _proto.parseVariableDefinitions = function parseVariableDefinitions() {
    return this.optionalMany(tokenKind_mjs_1.TokenKind.PAREN_L, this.parseVariableDefinition, tokenKind_mjs_1.TokenKind.PAREN_R);
  };
  _proto.parseVariableDefinition = function parseVariableDefinition() {
    var start = this._lexer.token;
    return {
      kind: kinds_mjs_1.Kind.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(tokenKind_mjs_1.TokenKind.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(tokenKind_mjs_1.TokenKind.EQUALS) ? this.parseValueLiteral(true) : undefined,
      directives: this.parseDirectives(true),
      loc: this.loc(start)
    };
  };
  _proto.parseVariable = function parseVariable() {
    var start = this._lexer.token;
    this.expectToken(tokenKind_mjs_1.TokenKind.DOLLAR);
    return {
      kind: kinds_mjs_1.Kind.VARIABLE,
      name: this.parseName(),
      loc: this.loc(start)
    };
  };
  _proto.parseSelectionSet = function parseSelectionSet() {
    var start = this._lexer.token;
    return {
      kind: kinds_mjs_1.Kind.SELECTION_SET,
      selections: this.many(tokenKind_mjs_1.TokenKind.BRACE_L, this.parseSelection, tokenKind_mjs_1.TokenKind.BRACE_R),
      loc: this.loc(start)
    };
  };
  _proto.parseSelection = function parseSelection() {
    return this.peek(tokenKind_mjs_1.TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
  };
  _proto.parseField = function parseField() {
    var start = this._lexer.token;
    var nameOrAlias = this.parseName();
    var alias;
    var name;
    if (this.expectOptionalToken(tokenKind_mjs_1.TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }
    return {
      kind: kinds_mjs_1.Kind.FIELD,
      alias: alias,
      name: name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(tokenKind_mjs_1.TokenKind.BRACE_L) ? this.parseSelectionSet() : undefined,
      loc: this.loc(start)
    };
  };
  _proto.parseArguments = function parseArguments(isConst) {
    var item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(tokenKind_mjs_1.TokenKind.PAREN_L, item, tokenKind_mjs_1.TokenKind.PAREN_R);
  };
  _proto.parseArgument = function parseArgument() {
    var start = this._lexer.token;
    var name = this.parseName();
    this.expectToken(tokenKind_mjs_1.TokenKind.COLON);
    return {
      kind: kinds_mjs_1.Kind.ARGUMENT,
      name: name,
      value: this.parseValueLiteral(false),
      loc: this.loc(start)
    };
  };
  _proto.parseConstArgument = function parseConstArgument() {
    var start = this._lexer.token;
    return {
      kind: kinds_mjs_1.Kind.ARGUMENT,
      name: this.parseName(),
      value: (this.expectToken(tokenKind_mjs_1.TokenKind.COLON), this.parseValueLiteral(true)),
      loc: this.loc(start)
    };
  };
  _proto.parseFragment = function parseFragment() {
    var start = this._lexer.token;
    this.expectToken(tokenKind_mjs_1.TokenKind.SPREAD);
    var hasTypeCondition = this.expectOptionalKeyword('on');
    if (!hasTypeCondition && this.peek(tokenKind_mjs_1.TokenKind.NAME)) {
      return {
        kind: kinds_mjs_1.Kind.FRAGMENT_SPREAD,
        name: this.parseFragmentName(),
        directives: this.parseDirectives(false),
        loc: this.loc(start)
      };
    }
    return {
      kind: kinds_mjs_1.Kind.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : undefined,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  };
  _proto.parseFragmentDefinition = function parseFragmentDefinition() {
    var _this$_options;
    var start = this._lexer.token;
    this.expectKeyword('fragment');
    if (((_this$_options = this._options) === null || _this$_options === void 0 ? void 0 : _this$_options.experimentalFragmentVariables) === true) {
      return {
        kind: kinds_mjs_1.Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet(),
        loc: this.loc(start)
      };
    }
    return {
      kind: kinds_mjs_1.Kind.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  };
  _proto.parseFragmentName = function parseFragmentName() {
    if (this._lexer.token.value === 'on') {
      throw this.unexpected();
    }
    return this.parseName();
  };
  _proto.parseValueLiteral = function parseValueLiteral(isConst) {
    var token = this._lexer.token;
    switch (token.kind) {
      case tokenKind_mjs_1.TokenKind.BRACKET_L:
        return this.parseList(isConst);
      case tokenKind_mjs_1.TokenKind.BRACE_L:
        return this.parseObject(isConst);
      case tokenKind_mjs_1.TokenKind.INT:
        this._lexer.advance();
        return {
          kind: kinds_mjs_1.Kind.INT,
          value: token.value,
          loc: this.loc(token)
        };
      case tokenKind_mjs_1.TokenKind.FLOAT:
        this._lexer.advance();
        return {
          kind: kinds_mjs_1.Kind.FLOAT,
          value: token.value,
          loc: this.loc(token)
        };
      case tokenKind_mjs_1.TokenKind.STRING:
      case tokenKind_mjs_1.TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();
      case tokenKind_mjs_1.TokenKind.NAME:
        this._lexer.advance();
        switch (token.value) {
          case 'true':
            return {
              kind: kinds_mjs_1.Kind.BOOLEAN,
              value: true,
              loc: this.loc(token)
            };
          case 'false':
            return {
              kind: kinds_mjs_1.Kind.BOOLEAN,
              value: false,
              loc: this.loc(token)
            };
          case 'null':
            return {
              kind: kinds_mjs_1.Kind.NULL,
              loc: this.loc(token)
            };
          default:
            return {
              kind: kinds_mjs_1.Kind.ENUM,
              value: token.value,
              loc: this.loc(token)
            };
        }
      case tokenKind_mjs_1.TokenKind.DOLLAR:
        if (!isConst) {
          return this.parseVariable();
        }
        break;
    }
    throw this.unexpected();
  };
  _proto.parseStringLiteral = function parseStringLiteral() {
    var token = this._lexer.token;
    this._lexer.advance();
    return {
      kind: kinds_mjs_1.Kind.STRING,
      value: token.value,
      block: token.kind === tokenKind_mjs_1.TokenKind.BLOCK_STRING,
      loc: this.loc(token)
    };
  };
  _proto.parseList = function parseList(isConst) {
    var _this = this;
    var start = this._lexer.token;
    var item = function item() {
      return _this.parseValueLiteral(isConst);
    };
    return {
      kind: kinds_mjs_1.Kind.LIST,
      values: this.any(tokenKind_mjs_1.TokenKind.BRACKET_L, item, tokenKind_mjs_1.TokenKind.BRACKET_R),
      loc: this.loc(start)
    };
  };
  _proto.parseObject = function parseObject(isConst) {
    var _this2 = this;
    var start = this._lexer.token;
    var item = function item() {
      return _this2.parseObjectField(isConst);
    };
    return {
      kind: kinds_mjs_1.Kind.OBJECT,
      fields: this.any(tokenKind_mjs_1.TokenKind.BRACE_L, item, tokenKind_mjs_1.TokenKind.BRACE_R),
      loc: this.loc(start)
    };
  };
  _proto.parseObjectField = function parseObjectField(isConst) {
    var start = this._lexer.token;
    var name = this.parseName();
    this.expectToken(tokenKind_mjs_1.TokenKind.COLON);
    return {
      kind: kinds_mjs_1.Kind.OBJECT_FIELD,
      name: name,
      value: this.parseValueLiteral(isConst),
      loc: this.loc(start)
    };
  };
  _proto.parseDirectives = function parseDirectives(isConst) {
    var directives = [];
    while (this.peek(tokenKind_mjs_1.TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }
    return directives;
  };
  _proto.parseDirective = function parseDirective(isConst) {
    var start = this._lexer.token;
    this.expectToken(tokenKind_mjs_1.TokenKind.AT);
    return {
      kind: kinds_mjs_1.Kind.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst),
      loc: this.loc(start)
    };
  };
  _proto.parseTypeReference = function parseTypeReference() {
    var start = this._lexer.token;
    var type;
    if (this.expectOptionalToken(tokenKind_mjs_1.TokenKind.BRACKET_L)) {
      type = this.parseTypeReference();
      this.expectToken(tokenKind_mjs_1.TokenKind.BRACKET_R);
      type = {
        kind: kinds_mjs_1.Kind.LIST_TYPE,
        type: type,
        loc: this.loc(start)
      };
    } else {
      type = this.parseNamedType();
    }
    if (this.expectOptionalToken(tokenKind_mjs_1.TokenKind.BANG)) {
      return {
        kind: kinds_mjs_1.Kind.NON_NULL_TYPE,
        type: type,
        loc: this.loc(start)
      };
    }
    return type;
  };
  _proto.parseNamedType = function parseNamedType() {
    var start = this._lexer.token;
    return {
      kind: kinds_mjs_1.Kind.NAMED_TYPE,
      name: this.parseName(),
      loc: this.loc(start)
    };
  };
  _proto.parseTypeSystemDefinition = function parseTypeSystemDefinition() {
    var keywordToken = this.peekDescription() ? this._lexer.lookahead() : this._lexer.token;
    if (keywordToken.kind === tokenKind_mjs_1.TokenKind.NAME) {
      switch (keywordToken.value) {
        case 'schema':
          return this.parseSchemaDefinition();
        case 'scalar':
          return this.parseScalarTypeDefinition();
        case 'type':
          return this.parseObjectTypeDefinition();
        case 'interface':
          return this.parseInterfaceTypeDefinition();
        case 'union':
          return this.parseUnionTypeDefinition();
        case 'enum':
          return this.parseEnumTypeDefinition();
        case 'input':
          return this.parseInputObjectTypeDefinition();
        case 'directive':
          return this.parseDirectiveDefinition();
      }
    }
    throw this.unexpected(keywordToken);
  };
  _proto.peekDescription = function peekDescription() {
    return this.peek(tokenKind_mjs_1.TokenKind.STRING) || this.peek(tokenKind_mjs_1.TokenKind.BLOCK_STRING);
  };
  _proto.parseDescription = function parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  };
  _proto.parseSchemaDefinition = function parseSchemaDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('schema');
    var directives = this.parseDirectives(true);
    var operationTypes = this.many(tokenKind_mjs_1.TokenKind.BRACE_L, this.parseOperationTypeDefinition, tokenKind_mjs_1.TokenKind.BRACE_R);
    return {
      kind: kinds_mjs_1.Kind.SCHEMA_DEFINITION,
      description: description,
      directives: directives,
      operationTypes: operationTypes,
      loc: this.loc(start)
    };
  };
  _proto.parseOperationTypeDefinition = function parseOperationTypeDefinition() {
    var start = this._lexer.token;
    var operation = this.parseOperationType();
    this.expectToken(tokenKind_mjs_1.TokenKind.COLON);
    var type = this.parseNamedType();
    return {
      kind: kinds_mjs_1.Kind.OPERATION_TYPE_DEFINITION,
      operation: operation,
      type: type,
      loc: this.loc(start)
    };
  };
  _proto.parseScalarTypeDefinition = function parseScalarTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('scalar');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    return {
      kind: kinds_mjs_1.Kind.SCALAR_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      loc: this.loc(start)
    };
  };
  _proto.parseObjectTypeDefinition = function parseObjectTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('type');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    return {
      kind: kinds_mjs_1.Kind.OBJECT_TYPE_DEFINITION,
      description: description,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  };
  _proto.parseImplementsInterfaces = function parseImplementsInterfaces() {
    var types = [];
    if (this.expectOptionalKeyword('implements')) {
      this.expectOptionalToken(tokenKind_mjs_1.TokenKind.AMP);
      do {
        var _this$_options2;
        types.push(this.parseNamedType());
      } while (this.expectOptionalToken(tokenKind_mjs_1.TokenKind.AMP) || ((_this$_options2 = this._options) === null || _this$_options2 === void 0 ? void 0 : _this$_options2.allowLegacySDLImplementsInterfaces) === true && this.peek(tokenKind_mjs_1.TokenKind.NAME));
    }
    return types;
  };
  _proto.parseFieldsDefinition = function parseFieldsDefinition() {
    var _this$_options3;
    if (((_this$_options3 = this._options) === null || _this$_options3 === void 0 ? void 0 : _this$_options3.allowLegacySDLEmptyFields) === true && this.peek(tokenKind_mjs_1.TokenKind.BRACE_L) && this._lexer.lookahead().kind === tokenKind_mjs_1.TokenKind.BRACE_R) {
      this._lexer.advance();
      this._lexer.advance();
      return [];
    }
    return this.optionalMany(tokenKind_mjs_1.TokenKind.BRACE_L, this.parseFieldDefinition, tokenKind_mjs_1.TokenKind.BRACE_R);
  };
  _proto.parseFieldDefinition = function parseFieldDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    var args = this.parseArgumentDefs();
    this.expectToken(tokenKind_mjs_1.TokenKind.COLON);
    var type = this.parseTypeReference();
    var directives = this.parseDirectives(true);
    return {
      kind: kinds_mjs_1.Kind.FIELD_DEFINITION,
      description: description,
      name: name,
      arguments: args,
      type: type,
      directives: directives,
      loc: this.loc(start)
    };
  };
  _proto.parseArgumentDefs = function parseArgumentDefs() {
    return this.optionalMany(tokenKind_mjs_1.TokenKind.PAREN_L, this.parseInputValueDef, tokenKind_mjs_1.TokenKind.PAREN_R);
  };
  _proto.parseInputValueDef = function parseInputValueDef() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    this.expectToken(tokenKind_mjs_1.TokenKind.COLON);
    var type = this.parseTypeReference();
    var defaultValue;
    if (this.expectOptionalToken(tokenKind_mjs_1.TokenKind.EQUALS)) {
      defaultValue = this.parseValueLiteral(true);
    }
    var directives = this.parseDirectives(true);
    return {
      kind: kinds_mjs_1.Kind.INPUT_VALUE_DEFINITION,
      description: description,
      name: name,
      type: type,
      defaultValue: defaultValue,
      directives: directives,
      loc: this.loc(start)
    };
  };
  _proto.parseInterfaceTypeDefinition = function parseInterfaceTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('interface');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    return {
      kind: kinds_mjs_1.Kind.INTERFACE_TYPE_DEFINITION,
      description: description,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  };
  _proto.parseUnionTypeDefinition = function parseUnionTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('union');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var types = this.parseUnionMemberTypes();
    return {
      kind: kinds_mjs_1.Kind.UNION_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      types: types,
      loc: this.loc(start)
    };
  };
  _proto.parseUnionMemberTypes = function parseUnionMemberTypes() {
    var types = [];
    if (this.expectOptionalToken(tokenKind_mjs_1.TokenKind.EQUALS)) {
      this.expectOptionalToken(tokenKind_mjs_1.TokenKind.PIPE);
      do {
        types.push(this.parseNamedType());
      } while (this.expectOptionalToken(tokenKind_mjs_1.TokenKind.PIPE));
    }
    return types;
  };
  _proto.parseEnumTypeDefinition = function parseEnumTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('enum');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var values = this.parseEnumValuesDefinition();
    return {
      kind: kinds_mjs_1.Kind.ENUM_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      values: values,
      loc: this.loc(start)
    };
  };
  _proto.parseEnumValuesDefinition = function parseEnumValuesDefinition() {
    return this.optionalMany(tokenKind_mjs_1.TokenKind.BRACE_L, this.parseEnumValueDefinition, tokenKind_mjs_1.TokenKind.BRACE_R);
  };
  _proto.parseEnumValueDefinition = function parseEnumValueDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    return {
      kind: kinds_mjs_1.Kind.ENUM_VALUE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      loc: this.loc(start)
    };
  };
  _proto.parseInputObjectTypeDefinition = function parseInputObjectTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('input');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var fields = this.parseInputFieldsDefinition();
    return {
      kind: kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  };
  _proto.parseInputFieldsDefinition = function parseInputFieldsDefinition() {
    return this.optionalMany(tokenKind_mjs_1.TokenKind.BRACE_L, this.parseInputValueDef, tokenKind_mjs_1.TokenKind.BRACE_R);
  };
  _proto.parseTypeSystemExtension = function parseTypeSystemExtension() {
    var keywordToken = this._lexer.lookahead();
    if (keywordToken.kind === tokenKind_mjs_1.TokenKind.NAME) {
      switch (keywordToken.value) {
        case 'schema':
          return this.parseSchemaExtension();
        case 'scalar':
          return this.parseScalarTypeExtension();
        case 'type':
          return this.parseObjectTypeExtension();
        case 'interface':
          return this.parseInterfaceTypeExtension();
        case 'union':
          return this.parseUnionTypeExtension();
        case 'enum':
          return this.parseEnumTypeExtension();
        case 'input':
          return this.parseInputObjectTypeExtension();
      }
    }
    throw this.unexpected(keywordToken);
  };
  _proto.parseSchemaExtension = function parseSchemaExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('schema');
    var directives = this.parseDirectives(true);
    var operationTypes = this.optionalMany(tokenKind_mjs_1.TokenKind.BRACE_L, this.parseOperationTypeDefinition, tokenKind_mjs_1.TokenKind.BRACE_R);
    if (directives.length === 0 && operationTypes.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: kinds_mjs_1.Kind.SCHEMA_EXTENSION,
      directives: directives,
      operationTypes: operationTypes,
      loc: this.loc(start)
    };
  };
  _proto.parseScalarTypeExtension = function parseScalarTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('scalar');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    if (directives.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: kinds_mjs_1.Kind.SCALAR_TYPE_EXTENSION,
      name: name,
      directives: directives,
      loc: this.loc(start)
    };
  };
  _proto.parseObjectTypeExtension = function parseObjectTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('type');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: kinds_mjs_1.Kind.OBJECT_TYPE_EXTENSION,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  };
  _proto.parseInterfaceTypeExtension = function parseInterfaceTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('interface');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: kinds_mjs_1.Kind.INTERFACE_TYPE_EXTENSION,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  };
  _proto.parseUnionTypeExtension = function parseUnionTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('union');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var types = this.parseUnionMemberTypes();
    if (directives.length === 0 && types.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: kinds_mjs_1.Kind.UNION_TYPE_EXTENSION,
      name: name,
      directives: directives,
      types: types,
      loc: this.loc(start)
    };
  };
  _proto.parseEnumTypeExtension = function parseEnumTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('enum');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var values = this.parseEnumValuesDefinition();
    if (directives.length === 0 && values.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: kinds_mjs_1.Kind.ENUM_TYPE_EXTENSION,
      name: name,
      directives: directives,
      values: values,
      loc: this.loc(start)
    };
  };
  _proto.parseInputObjectTypeExtension = function parseInputObjectTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('input');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var fields = this.parseInputFieldsDefinition();
    if (directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_EXTENSION,
      name: name,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  };
  _proto.parseDirectiveDefinition = function parseDirectiveDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('directive');
    this.expectToken(tokenKind_mjs_1.TokenKind.AT);
    var name = this.parseName();
    var args = this.parseArgumentDefs();
    var repeatable = this.expectOptionalKeyword('repeatable');
    this.expectKeyword('on');
    var locations = this.parseDirectiveLocations();
    return {
      kind: kinds_mjs_1.Kind.DIRECTIVE_DEFINITION,
      description: description,
      name: name,
      arguments: args,
      repeatable: repeatable,
      locations: locations,
      loc: this.loc(start)
    };
  };
  _proto.parseDirectiveLocations = function parseDirectiveLocations() {
    this.expectOptionalToken(tokenKind_mjs_1.TokenKind.PIPE);
    var locations = [];
    do {
      locations.push(this.parseDirectiveLocation());
    } while (this.expectOptionalToken(tokenKind_mjs_1.TokenKind.PIPE));
    return locations;
  };
  _proto.parseDirectiveLocation = function parseDirectiveLocation() {
    var start = this._lexer.token;
    var name = this.parseName();
    if (directiveLocation_mjs_1.DirectiveLocation[name.value] !== undefined) {
      return name;
    }
    throw this.unexpected(start);
  };
  _proto.loc = function loc(startToken) {
    var _this$_options4;
    if (((_this$_options4 = this._options) === null || _this$_options4 === void 0 ? void 0 : _this$_options4.noLocation) !== true) {
      return new ast_mjs_1.Location(startToken, this._lexer.lastToken, this._lexer.source);
    }
  };
  _proto.peek = function peek(kind) {
    return this._lexer.token.kind === kind;
  };
  _proto.expectToken = function expectToken(kind) {
    var token = this._lexer.token;
    if (token.kind === kind) {
      this._lexer.advance();
      return token;
    }
    throw syntaxError_mjs_1.syntaxError(this._lexer.source, token.start, ("Expected ").concat(getTokenKindDesc(kind), ", found ").concat(getTokenDesc(token), "."));
  };
  _proto.expectOptionalToken = function expectOptionalToken(kind) {
    var token = this._lexer.token;
    if (token.kind === kind) {
      this._lexer.advance();
      return token;
    }
    return undefined;
  };
  _proto.expectKeyword = function expectKeyword(value) {
    var token = this._lexer.token;
    if (token.kind === tokenKind_mjs_1.TokenKind.NAME && token.value === value) {
      this._lexer.advance();
    } else {
      throw syntaxError_mjs_1.syntaxError(this._lexer.source, token.start, ("Expected \"").concat(value, "\", found ").concat(getTokenDesc(token), "."));
    }
  };
  _proto.expectOptionalKeyword = function expectOptionalKeyword(value) {
    var token = this._lexer.token;
    if (token.kind === tokenKind_mjs_1.TokenKind.NAME && token.value === value) {
      this._lexer.advance();
      return true;
    }
    return false;
  };
  _proto.unexpected = function unexpected(atToken) {
    var token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
    return syntaxError_mjs_1.syntaxError(this._lexer.source, token.start, ("Unexpected ").concat(getTokenDesc(token), "."));
  };
  _proto.any = function any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    var nodes = [];
    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }
    return nodes;
  };
  _proto.optionalMany = function optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      var nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    return [];
  };
  _proto.many = function many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    var nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));
    return nodes;
  };
  return Parser;
})();
function getTokenDesc(token) {
  var value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? (" \"").concat(value, "\"") : '');
}
function getTokenKindDesc(kind) {
  return lexer_mjs_1.isPunctuatorTokenKind(kind) ? ("\"").concat(kind, "\"") : kind;
}

},

// node_modules/graphql/validation/validate.mjs @80
80: function(__fusereq, exports, module){
exports.__esModule = true;
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var visitor_mjs_1 = __fusereq(95);
var validate_mjs_1 = __fusereq(81);
var TypeInfo_mjs_1 = __fusereq(153);
var specifiedRules_mjs_1 = __fusereq(102);
var ValidationContext_mjs_1 = __fusereq(101);
function validate(schema, documentAST) {
  var rules = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : specifiedRules_mjs_1.specifiedRules;
  var typeInfo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new TypeInfo_mjs_1.TypeInfo(schema);
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
    maxErrors: undefined
  };
  documentAST || devAssert_mjs_1d.default(0, 'Must provide document.');
  validate_mjs_1.assertValidSchema(schema);
  var abortObj = Object.freeze({});
  var errors = [];
  var context = new ValidationContext_mjs_1.ValidationContext(schema, documentAST, typeInfo, function (error) {
    if (options.maxErrors != null && errors.length >= options.maxErrors) {
      errors.push(new GraphQLError_mjs_1.GraphQLError('Too many validation errors, error limit reached. Validation aborted.'));
      throw abortObj;
    }
    errors.push(error);
  });
  var visitor = visitor_mjs_1.visitInParallel(rules.map(function (rule) {
    return rule(context);
  }));
  try {
    visitor_mjs_1.visit(documentAST, TypeInfo_mjs_1.visitWithTypeInfo(typeInfo, visitor));
  } catch (e) {
    if (e !== abortObj) {
      throw e;
    }
  }
  return errors;
}
exports.validate = validate;
function validateSDL(documentAST, schemaToExtend) {
  var rules = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : specifiedRules_mjs_1.specifiedSDLRules;
  var errors = [];
  var context = new ValidationContext_mjs_1.SDLValidationContext(documentAST, schemaToExtend, function (error) {
    errors.push(error);
  });
  var visitors = rules.map(function (rule) {
    return rule(context);
  });
  visitor_mjs_1.visit(documentAST, visitor_mjs_1.visitInParallel(visitors));
  return errors;
}
exports.validateSDL = validateSDL;
function assertValidSDL(documentAST) {
  var errors = validateSDL(documentAST);
  if (errors.length !== 0) {
    throw new Error(errors.map(function (error) {
      return error.message;
    }).join('\n\n'));
  }
}
exports.assertValidSDL = assertValidSDL;
function assertValidSDLExtension(documentAST, schema) {
  var errors = validateSDL(documentAST, schema);
  if (errors.length !== 0) {
    throw new Error(errors.map(function (error) {
      return error.message;
    }).join('\n\n'));
  }
}
exports.assertValidSDLExtension = assertValidSDLExtension;

},

// node_modules/graphql/type/validate.mjs @81
81: function(__fusereq, exports, module){
exports.__esModule = true;
var find_mjs_1 = __fusereq(165);
var find_mjs_1d = __fuse.dt(find_mjs_1);
var flatMap_mjs_1 = __fusereq(166);
var flatMap_mjs_1d = __fuse.dt(flatMap_mjs_1);
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var locatedError_mjs_1 = __fusereq(138);
var assertValidName_mjs_1 = __fusereq(159);
var typeComparators_mjs_1 = __fusereq(158);
var directives_mjs_1 = __fusereq(85);
var introspection_mjs_1 = __fusereq(87);
var schema_mjs_1 = __fusereq(83);
var definition_mjs_1 = __fusereq(84);
function validateSchema(schema) {
  schema_mjs_1.assertSchema(schema);
  if (schema.__validationErrors) {
    return schema.__validationErrors;
  }
  var context = new SchemaValidationContext(schema);
  validateRootTypes(context);
  validateDirectives(context);
  validateTypes(context);
  var errors = context.getErrors();
  schema.__validationErrors = errors;
  return errors;
}
exports.validateSchema = validateSchema;
function assertValidSchema(schema) {
  var errors = validateSchema(schema);
  if (errors.length !== 0) {
    throw new Error(errors.map(function (error) {
      return error.message;
    }).join('\n\n'));
  }
}
exports.assertValidSchema = assertValidSchema;
var SchemaValidationContext = (function () {
  function SchemaValidationContext(schema) {
    this._errors = [];
    this.schema = schema;
  }
  var _proto = SchemaValidationContext.prototype;
  _proto.reportError = function reportError(message, nodes) {
    var _nodes = Array.isArray(nodes) ? nodes.filter(Boolean) : nodes;
    this.addError(new GraphQLError_mjs_1.GraphQLError(message, _nodes));
  };
  _proto.addError = function addError(error) {
    this._errors.push(error);
  };
  _proto.getErrors = function getErrors() {
    return this._errors;
  };
  return SchemaValidationContext;
})();
function validateRootTypes(context) {
  var schema = context.schema;
  var queryType = schema.getQueryType();
  if (!queryType) {
    context.reportError('Query root type must be provided.', schema.astNode);
  } else if (!definition_mjs_1.isObjectType(queryType)) {
    context.reportError(("Query root type must be Object type, it cannot be ").concat(inspect_mjs_1d.default(queryType), "."), getOperationTypeNode(schema, queryType, 'query'));
  }
  var mutationType = schema.getMutationType();
  if (mutationType && !definition_mjs_1.isObjectType(mutationType)) {
    context.reportError('Mutation root type must be Object type if provided, it cannot be ' + ("").concat(inspect_mjs_1d.default(mutationType), "."), getOperationTypeNode(schema, mutationType, 'mutation'));
  }
  var subscriptionType = schema.getSubscriptionType();
  if (subscriptionType && !definition_mjs_1.isObjectType(subscriptionType)) {
    context.reportError('Subscription root type must be Object type if provided, it cannot be ' + ("").concat(inspect_mjs_1d.default(subscriptionType), "."), getOperationTypeNode(schema, subscriptionType, 'subscription'));
  }
}
function getOperationTypeNode(schema, type, operation) {
  var operationNodes = getAllSubNodes(schema, function (node) {
    return node.operationTypes;
  });
  for (var _i2 = 0; _i2 < operationNodes.length; _i2++) {
    var node = operationNodes[_i2];
    if (node.operation === operation) {
      return node.type;
    }
  }
  return type.astNode;
}
function validateDirectives(context) {
  for (var _i4 = 0, _context$schema$getDi2 = context.schema.getDirectives(); _i4 < _context$schema$getDi2.length; _i4++) {
    var directive = _context$schema$getDi2[_i4];
    if (!directives_mjs_1.isDirective(directive)) {
      context.reportError(("Expected directive but got: ").concat(inspect_mjs_1d.default(directive), "."), directive === null || directive === void 0 ? void 0 : directive.astNode);
      continue;
    }
    validateName(context, directive);
    for (var _i6 = 0, _directive$args2 = directive.args; _i6 < _directive$args2.length; _i6++) {
      var arg = _directive$args2[_i6];
      validateName(context, arg);
      if (!definition_mjs_1.isInputType(arg.type)) {
        context.reportError(("The type of @").concat(directive.name, "(").concat(arg.name, ":) must be Input Type ") + ("but got: ").concat(inspect_mjs_1d.default(arg.type), "."), arg.astNode);
      }
    }
  }
}
function validateName(context, node) {
  var error = assertValidName_mjs_1.isValidNameError(node.name);
  if (error) {
    context.addError(locatedError_mjs_1.locatedError(error, node.astNode));
  }
}
function validateTypes(context) {
  var validateInputObjectCircularRefs = createInputObjectCircularRefsValidator(context);
  var typeMap = context.schema.getTypeMap();
  for (var _i8 = 0, _objectValues2 = objectValues_mjs_1d.default(typeMap); _i8 < _objectValues2.length; _i8++) {
    var type = _objectValues2[_i8];
    if (!definition_mjs_1.isNamedType(type)) {
      context.reportError(("Expected GraphQL named type but got: ").concat(inspect_mjs_1d.default(type), "."), type.astNode);
      continue;
    }
    if (!introspection_mjs_1.isIntrospectionType(type)) {
      validateName(context, type);
    }
    if (definition_mjs_1.isObjectType(type)) {
      validateFields(context, type);
      validateInterfaces(context, type);
    } else if (definition_mjs_1.isInterfaceType(type)) {
      validateFields(context, type);
      validateInterfaces(context, type);
    } else if (definition_mjs_1.isUnionType(type)) {
      validateUnionMembers(context, type);
    } else if (definition_mjs_1.isEnumType(type)) {
      validateEnumValues(context, type);
    } else if (definition_mjs_1.isInputObjectType(type)) {
      validateInputFields(context, type);
      validateInputObjectCircularRefs(type);
    }
  }
}
function validateFields(context, type) {
  var fields = objectValues_mjs_1d.default(type.getFields());
  if (fields.length === 0) {
    context.reportError(("Type ").concat(type.name, " must define one or more fields."), getAllNodes(type));
  }
  for (var _i10 = 0; _i10 < fields.length; _i10++) {
    var field = fields[_i10];
    validateName(context, field);
    if (!definition_mjs_1.isOutputType(field.type)) {
      var _field$astNode;
      context.reportError(("The type of ").concat(type.name, ".").concat(field.name, " must be Output Type ") + ("but got: ").concat(inspect_mjs_1d.default(field.type), "."), (_field$astNode = field.astNode) === null || _field$astNode === void 0 ? void 0 : _field$astNode.type);
    }
    for (var _i12 = 0, _field$args2 = field.args; _i12 < _field$args2.length; _i12++) {
      var arg = _field$args2[_i12];
      var argName = arg.name;
      validateName(context, arg);
      if (!definition_mjs_1.isInputType(arg.type)) {
        var _arg$astNode;
        context.reportError(("The type of ").concat(type.name, ".").concat(field.name, "(").concat(argName, ":) must be Input ") + ("Type but got: ").concat(inspect_mjs_1d.default(arg.type), "."), (_arg$astNode = arg.astNode) === null || _arg$astNode === void 0 ? void 0 : _arg$astNode.type);
      }
    }
  }
}
function validateInterfaces(context, type) {
  var ifaceTypeNames = Object.create(null);
  for (var _i14 = 0, _type$getInterfaces2 = type.getInterfaces(); _i14 < _type$getInterfaces2.length; _i14++) {
    var iface = _type$getInterfaces2[_i14];
    if (!definition_mjs_1.isInterfaceType(iface)) {
      context.reportError(("Type ").concat(inspect_mjs_1d.default(type), " must only implement Interface types, ") + ("it cannot implement ").concat(inspect_mjs_1d.default(iface), "."), getAllImplementsInterfaceNodes(type, iface));
      continue;
    }
    if (type === iface) {
      context.reportError(("Type ").concat(type.name, " cannot implement itself because it would create a circular reference."), getAllImplementsInterfaceNodes(type, iface));
      continue;
    }
    if (ifaceTypeNames[iface.name]) {
      context.reportError(("Type ").concat(type.name, " can only implement ").concat(iface.name, " once."), getAllImplementsInterfaceNodes(type, iface));
      continue;
    }
    ifaceTypeNames[iface.name] = true;
    validateTypeImplementsAncestors(context, type, iface);
    validateTypeImplementsInterface(context, type, iface);
  }
}
function validateTypeImplementsInterface(context, type, iface) {
  var typeFieldMap = type.getFields();
  for (var _i16 = 0, _objectValues4 = objectValues_mjs_1d.default(iface.getFields()); _i16 < _objectValues4.length; _i16++) {
    var ifaceField = _objectValues4[_i16];
    var fieldName = ifaceField.name;
    var typeField = typeFieldMap[fieldName];
    if (!typeField) {
      context.reportError(("Interface field ").concat(iface.name, ".").concat(fieldName, " expected but ").concat(type.name, " does not provide it."), [ifaceField.astNode].concat(getAllNodes(type)));
      continue;
    }
    if (!typeComparators_mjs_1.isTypeSubTypeOf(context.schema, typeField.type, ifaceField.type)) {
      context.reportError(("Interface field ").concat(iface.name, ".").concat(fieldName, " expects type ") + ("").concat(inspect_mjs_1d.default(ifaceField.type), " but ").concat(type.name, ".").concat(fieldName, " ") + ("is type ").concat(inspect_mjs_1d.default(typeField.type), "."), [ifaceField.astNode.type, typeField.astNode.type]);
    }
    var _loop = function _loop(_i18, _ifaceField$args2) {
      var ifaceArg = _ifaceField$args2[_i18];
      var argName = ifaceArg.name;
      var typeArg = find_mjs_1d.default(typeField.args, function (arg) {
        return arg.name === argName;
      });
      if (!typeArg) {
        context.reportError(("Interface field argument ").concat(iface.name, ".").concat(fieldName, "(").concat(argName, ":) expected but ").concat(type.name, ".").concat(fieldName, " does not provide it."), [ifaceArg.astNode, typeField.astNode]);
        return "continue";
      }
      if (!typeComparators_mjs_1.isEqualType(ifaceArg.type, typeArg.type)) {
        context.reportError(("Interface field argument ").concat(iface.name, ".").concat(fieldName, "(").concat(argName, ":) ") + ("expects type ").concat(inspect_mjs_1d.default(ifaceArg.type), " but ") + ("").concat(type.name, ".").concat(fieldName, "(").concat(argName, ":) is type ") + ("").concat(inspect_mjs_1d.default(typeArg.type), "."), [ifaceArg.astNode.type, typeArg.astNode.type]);
      }
    };
    for (var _i18 = 0, _ifaceField$args2 = ifaceField.args; _i18 < _ifaceField$args2.length; _i18++) {
      var _ret = _loop(_i18, _ifaceField$args2);
      if (_ret === "continue") continue;
    }
    var _loop2 = function _loop2(_i20, _typeField$args2) {
      var typeArg = _typeField$args2[_i20];
      var argName = typeArg.name;
      var ifaceArg = find_mjs_1d.default(ifaceField.args, function (arg) {
        return arg.name === argName;
      });
      if (!ifaceArg && definition_mjs_1.isRequiredArgument(typeArg)) {
        context.reportError(("Object field ").concat(type.name, ".").concat(fieldName, " includes required argument ").concat(argName, " that is missing from the Interface field ").concat(iface.name, ".").concat(fieldName, "."), [typeArg.astNode, ifaceField.astNode]);
      }
    };
    for (var _i20 = 0, _typeField$args2 = typeField.args; _i20 < _typeField$args2.length; _i20++) {
      _loop2(_i20, _typeField$args2);
    }
  }
}
function validateTypeImplementsAncestors(context, type, iface) {
  var ifaceInterfaces = type.getInterfaces();
  for (var _i22 = 0, _iface$getInterfaces2 = iface.getInterfaces(); _i22 < _iface$getInterfaces2.length; _i22++) {
    var transitive = _iface$getInterfaces2[_i22];
    if (ifaceInterfaces.indexOf(transitive) === -1) {
      context.reportError(transitive === type ? ("Type ").concat(type.name, " cannot implement ").concat(iface.name, " because it would create a circular reference.") : ("Type ").concat(type.name, " must implement ").concat(transitive.name, " because it is implemented by ").concat(iface.name, "."), [].concat(getAllImplementsInterfaceNodes(iface, transitive), getAllImplementsInterfaceNodes(type, iface)));
    }
  }
}
function validateUnionMembers(context, union) {
  var memberTypes = union.getTypes();
  if (memberTypes.length === 0) {
    context.reportError(("Union type ").concat(union.name, " must define one or more member types."), getAllNodes(union));
  }
  var includedTypeNames = Object.create(null);
  for (var _i24 = 0; _i24 < memberTypes.length; _i24++) {
    var memberType = memberTypes[_i24];
    if (includedTypeNames[memberType.name]) {
      context.reportError(("Union type ").concat(union.name, " can only include type ").concat(memberType.name, " once."), getUnionMemberTypeNodes(union, memberType.name));
      continue;
    }
    includedTypeNames[memberType.name] = true;
    if (!definition_mjs_1.isObjectType(memberType)) {
      context.reportError(("Union type ").concat(union.name, " can only include Object types, ") + ("it cannot include ").concat(inspect_mjs_1d.default(memberType), "."), getUnionMemberTypeNodes(union, String(memberType)));
    }
  }
}
function validateEnumValues(context, enumType) {
  var enumValues = enumType.getValues();
  if (enumValues.length === 0) {
    context.reportError(("Enum type ").concat(enumType.name, " must define one or more values."), getAllNodes(enumType));
  }
  for (var _i26 = 0; _i26 < enumValues.length; _i26++) {
    var enumValue = enumValues[_i26];
    var valueName = enumValue.name;
    validateName(context, enumValue);
    if (valueName === 'true' || valueName === 'false' || valueName === 'null') {
      context.reportError(("Enum type ").concat(enumType.name, " cannot include value: ").concat(valueName, "."), enumValue.astNode);
    }
  }
}
function validateInputFields(context, inputObj) {
  var fields = objectValues_mjs_1d.default(inputObj.getFields());
  if (fields.length === 0) {
    context.reportError(("Input Object type ").concat(inputObj.name, " must define one or more fields."), getAllNodes(inputObj));
  }
  for (var _i28 = 0; _i28 < fields.length; _i28++) {
    var field = fields[_i28];
    validateName(context, field);
    if (!definition_mjs_1.isInputType(field.type)) {
      var _field$astNode2;
      context.reportError(("The type of ").concat(inputObj.name, ".").concat(field.name, " must be Input Type ") + ("but got: ").concat(inspect_mjs_1d.default(field.type), "."), (_field$astNode2 = field.astNode) === null || _field$astNode2 === void 0 ? void 0 : _field$astNode2.type);
    }
  }
}
function createInputObjectCircularRefsValidator(context) {
  var visitedTypes = Object.create(null);
  var fieldPath = [];
  var fieldPathIndexByTypeName = Object.create(null);
  return detectCycleRecursive;
  function detectCycleRecursive(inputObj) {
    if (visitedTypes[inputObj.name]) {
      return;
    }
    visitedTypes[inputObj.name] = true;
    fieldPathIndexByTypeName[inputObj.name] = fieldPath.length;
    var fields = objectValues_mjs_1d.default(inputObj.getFields());
    for (var _i30 = 0; _i30 < fields.length; _i30++) {
      var field = fields[_i30];
      if (definition_mjs_1.isNonNullType(field.type) && definition_mjs_1.isInputObjectType(field.type.ofType)) {
        var fieldType = field.type.ofType;
        var cycleIndex = fieldPathIndexByTypeName[fieldType.name];
        fieldPath.push(field);
        if (cycleIndex === undefined) {
          detectCycleRecursive(fieldType);
        } else {
          var cyclePath = fieldPath.slice(cycleIndex);
          var pathStr = cyclePath.map(function (fieldObj) {
            return fieldObj.name;
          }).join('.');
          context.reportError(("Cannot reference Input Object \"").concat(fieldType.name, "\" within itself through a series of non-null fields: \"").concat(pathStr, "\"."), cyclePath.map(function (fieldObj) {
            return fieldObj.astNode;
          }));
        }
        fieldPath.pop();
      }
    }
    fieldPathIndexByTypeName[inputObj.name] = undefined;
  }
}
function getAllNodes(object) {
  var astNode = object.astNode, extensionASTNodes = object.extensionASTNodes;
  return astNode ? extensionASTNodes ? [astNode].concat(extensionASTNodes) : [astNode] : extensionASTNodes !== null && extensionASTNodes !== void 0 ? extensionASTNodes : [];
}
function getAllSubNodes(object, getter) {
  return flatMap_mjs_1d.default(getAllNodes(object), function (item) {
    var _getter;
    return (_getter = getter(item)) !== null && _getter !== void 0 ? _getter : [];
  });
}
function getAllImplementsInterfaceNodes(type, iface) {
  return getAllSubNodes(type, function (typeNode) {
    return typeNode.interfaces;
  }).filter(function (ifaceNode) {
    return ifaceNode.name.value === iface.name;
  });
}
function getUnionMemberTypeNodes(union, typeName) {
  return getAllSubNodes(union, function (unionNode) {
    return unionNode.types;
  }).filter(function (typeNode) {
    return typeNode.name.value === typeName;
  });
}

},

// node_modules/graphql/execution/execute.mjs @82
82: function(__fusereq, exports, module){
exports.__esModule = true;
var arrayFrom_mjs_1 = __fusereq(168);
var arrayFrom_mjs_1d = __fuse.dt(arrayFrom_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var memoize3_mjs_1 = __fusereq(169);
var memoize3_mjs_1d = __fuse.dt(memoize3_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var isPromise_mjs_1 = __fusereq(78);
var isPromise_mjs_1d = __fuse.dt(isPromise_mjs_1);
var isObjectLike_mjs_1 = __fusereq(171);
var isObjectLike_mjs_1d = __fuse.dt(isObjectLike_mjs_1);
var isCollection_mjs_1 = __fusereq(172);
var isCollection_mjs_1d = __fuse.dt(isCollection_mjs_1);
var promiseReduce_mjs_1 = __fusereq(173);
var promiseReduce_mjs_1d = __fuse.dt(promiseReduce_mjs_1);
var promiseForObject_mjs_1 = __fusereq(174);
var promiseForObject_mjs_1d = __fuse.dt(promiseForObject_mjs_1);
var Path_mjs_1 = __fusereq(98);
var GraphQLError_mjs_1 = __fusereq(136);
var locatedError_mjs_1 = __fusereq(138);
var kinds_mjs_1 = __fusereq(91);
var validate_mjs_1 = __fusereq(81);
var introspection_mjs_1 = __fusereq(87);
var directives_mjs_1 = __fusereq(85);
var definition_mjs_1 = __fusereq(84);
var typeFromAST_mjs_1 = __fusereq(149);
var getOperationRootType_mjs_1 = __fusereq(142);
var values_mjs_1 = __fusereq(99);
function execute(argsOrSchema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, typeResolver) {
  return arguments.length === 1 ? executeImpl(argsOrSchema) : executeImpl({
    schema: argsOrSchema,
    document: document,
    rootValue: rootValue,
    contextValue: contextValue,
    variableValues: variableValues,
    operationName: operationName,
    fieldResolver: fieldResolver,
    typeResolver: typeResolver
  });
}
exports.execute = execute;
function executeImpl(args) {
  var schema = args.schema, document = args.document, rootValue = args.rootValue, contextValue = args.contextValue, variableValues = args.variableValues, operationName = args.operationName, fieldResolver = args.fieldResolver, typeResolver = args.typeResolver;
  assertValidExecutionArguments(schema, document, variableValues);
  var exeContext = buildExecutionContext(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, typeResolver);
  if (Array.isArray(exeContext)) {
    return {
      errors: exeContext
    };
  }
  var data = executeOperation(exeContext, exeContext.operation, rootValue);
  return buildResponse(exeContext, data);
}
function buildResponse(exeContext, data) {
  if (isPromise_mjs_1d.default(data)) {
    return data.then(function (resolved) {
      return buildResponse(exeContext, resolved);
    });
  }
  return exeContext.errors.length === 0 ? {
    data: data
  } : {
    errors: exeContext.errors,
    data: data
  };
}
function assertValidExecutionArguments(schema, document, rawVariableValues) {
  document || devAssert_mjs_1d.default(0, 'Must provide document.');
  validate_mjs_1.assertValidSchema(schema);
  rawVariableValues == null || isObjectLike_mjs_1d.default(rawVariableValues) || devAssert_mjs_1d.default(0, 'Variables must be provided as an Object where each property is a variable value. Perhaps look to see if an unparsed JSON string was provided.');
}
exports.assertValidExecutionArguments = assertValidExecutionArguments;
function buildExecutionContext(schema, document, rootValue, contextValue, rawVariableValues, operationName, fieldResolver, typeResolver) {
  var _definition$name, _operation$variableDe;
  var operation;
  var fragments = Object.create(null);
  for (var _i2 = 0, _document$definitions2 = document.definitions; _i2 < _document$definitions2.length; _i2++) {
    var definition = _document$definitions2[_i2];
    switch (definition.kind) {
      case kinds_mjs_1.Kind.OPERATION_DEFINITION:
        if (operationName == null) {
          if (operation !== undefined) {
            return [new GraphQLError_mjs_1.GraphQLError('Must provide operation name if query contains multiple operations.')];
          }
          operation = definition;
        } else if (((_definition$name = definition.name) === null || _definition$name === void 0 ? void 0 : _definition$name.value) === operationName) {
          operation = definition;
        }
        break;
      case kinds_mjs_1.Kind.FRAGMENT_DEFINITION:
        fragments[definition.name.value] = definition;
        break;
    }
  }
  if (!operation) {
    if (operationName != null) {
      return [new GraphQLError_mjs_1.GraphQLError(("Unknown operation named \"").concat(operationName, "\"."))];
    }
    return [new GraphQLError_mjs_1.GraphQLError('Must provide an operation.')];
  }
  var variableDefinitions = (_operation$variableDe = operation.variableDefinitions) !== null && _operation$variableDe !== void 0 ? _operation$variableDe : [];
  var coercedVariableValues = values_mjs_1.getVariableValues(schema, variableDefinitions, rawVariableValues !== null && rawVariableValues !== void 0 ? rawVariableValues : {}, {
    maxErrors: 50
  });
  if (coercedVariableValues.errors) {
    return coercedVariableValues.errors;
  }
  return {
    schema: schema,
    fragments: fragments,
    rootValue: rootValue,
    contextValue: contextValue,
    operation: operation,
    variableValues: coercedVariableValues.coerced,
    fieldResolver: fieldResolver !== null && fieldResolver !== void 0 ? fieldResolver : exports.defaultFieldResolver,
    typeResolver: typeResolver !== null && typeResolver !== void 0 ? typeResolver : exports.defaultTypeResolver,
    errors: []
  };
}
exports.buildExecutionContext = buildExecutionContext;
function executeOperation(exeContext, operation, rootValue) {
  var type = getOperationRootType_mjs_1.getOperationRootType(exeContext.schema, operation);
  var fields = collectFields(exeContext, type, operation.selectionSet, Object.create(null), Object.create(null));
  var path = undefined;
  try {
    var result = operation.operation === 'mutation' ? executeFieldsSerially(exeContext, type, rootValue, path, fields) : executeFields(exeContext, type, rootValue, path, fields);
    if (isPromise_mjs_1d.default(result)) {
      return result.then(undefined, function (error) {
        exeContext.errors.push(error);
        return Promise.resolve(null);
      });
    }
    return result;
  } catch (error) {
    exeContext.errors.push(error);
    return null;
  }
}
function executeFieldsSerially(exeContext, parentType, sourceValue, path, fields) {
  return promiseReduce_mjs_1d.default(Object.keys(fields), function (results, responseName) {
    var fieldNodes = fields[responseName];
    var fieldPath = Path_mjs_1.addPath(path, responseName);
    var result = resolveField(exeContext, parentType, sourceValue, fieldNodes, fieldPath);
    if (result === undefined) {
      return results;
    }
    if (isPromise_mjs_1d.default(result)) {
      return result.then(function (resolvedResult) {
        results[responseName] = resolvedResult;
        return results;
      });
    }
    results[responseName] = result;
    return results;
  }, Object.create(null));
}
function executeFields(exeContext, parentType, sourceValue, path, fields) {
  var results = Object.create(null);
  var containsPromise = false;
  for (var _i4 = 0, _Object$keys2 = Object.keys(fields); _i4 < _Object$keys2.length; _i4++) {
    var responseName = _Object$keys2[_i4];
    var fieldNodes = fields[responseName];
    var fieldPath = Path_mjs_1.addPath(path, responseName);
    var result = resolveField(exeContext, parentType, sourceValue, fieldNodes, fieldPath);
    if (result !== undefined) {
      results[responseName] = result;
      if (!containsPromise && isPromise_mjs_1d.default(result)) {
        containsPromise = true;
      }
    }
  }
  if (!containsPromise) {
    return results;
  }
  return promiseForObject_mjs_1d.default(results);
}
function collectFields(exeContext, runtimeType, selectionSet, fields, visitedFragmentNames) {
  for (var _i6 = 0, _selectionSet$selecti2 = selectionSet.selections; _i6 < _selectionSet$selecti2.length; _i6++) {
    var selection = _selectionSet$selecti2[_i6];
    switch (selection.kind) {
      case kinds_mjs_1.Kind.FIELD:
        {
          if (!shouldIncludeNode(exeContext, selection)) {
            continue;
          }
          var name = getFieldEntryKey(selection);
          if (!fields[name]) {
            fields[name] = [];
          }
          fields[name].push(selection);
          break;
        }
      case kinds_mjs_1.Kind.INLINE_FRAGMENT:
        {
          if (!shouldIncludeNode(exeContext, selection) || !doesFragmentConditionMatch(exeContext, selection, runtimeType)) {
            continue;
          }
          collectFields(exeContext, runtimeType, selection.selectionSet, fields, visitedFragmentNames);
          break;
        }
      case kinds_mjs_1.Kind.FRAGMENT_SPREAD:
        {
          var fragName = selection.name.value;
          if (visitedFragmentNames[fragName] || !shouldIncludeNode(exeContext, selection)) {
            continue;
          }
          visitedFragmentNames[fragName] = true;
          var fragment = exeContext.fragments[fragName];
          if (!fragment || !doesFragmentConditionMatch(exeContext, fragment, runtimeType)) {
            continue;
          }
          collectFields(exeContext, runtimeType, fragment.selectionSet, fields, visitedFragmentNames);
          break;
        }
    }
  }
  return fields;
}
exports.collectFields = collectFields;
function shouldIncludeNode(exeContext, node) {
  var skip = values_mjs_1.getDirectiveValues(directives_mjs_1.GraphQLSkipDirective, node, exeContext.variableValues);
  if ((skip === null || skip === void 0 ? void 0 : skip.if) === true) {
    return false;
  }
  var include = values_mjs_1.getDirectiveValues(directives_mjs_1.GraphQLIncludeDirective, node, exeContext.variableValues);
  if ((include === null || include === void 0 ? void 0 : include.if) === false) {
    return false;
  }
  return true;
}
function doesFragmentConditionMatch(exeContext, fragment, type) {
  var typeConditionNode = fragment.typeCondition;
  if (!typeConditionNode) {
    return true;
  }
  var conditionalType = typeFromAST_mjs_1.typeFromAST(exeContext.schema, typeConditionNode);
  if (conditionalType === type) {
    return true;
  }
  if (definition_mjs_1.isAbstractType(conditionalType)) {
    return exeContext.schema.isSubType(conditionalType, type);
  }
  return false;
}
function getFieldEntryKey(node) {
  return node.alias ? node.alias.value : node.name.value;
}
function resolveField(exeContext, parentType, source, fieldNodes, path) {
  var _fieldDef$resolve;
  var fieldNode = fieldNodes[0];
  var fieldName = fieldNode.name.value;
  var fieldDef = getFieldDef(exeContext.schema, parentType, fieldName);
  if (!fieldDef) {
    return;
  }
  var resolveFn = (_fieldDef$resolve = fieldDef.resolve) !== null && _fieldDef$resolve !== void 0 ? _fieldDef$resolve : exeContext.fieldResolver;
  var info = buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path);
  var result = resolveFieldValueOrError(exeContext, fieldDef, fieldNodes, resolveFn, source, info);
  return completeValueCatchingError(exeContext, fieldDef.type, fieldNodes, info, path, result);
}
function buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path) {
  return {
    fieldName: fieldDef.name,
    fieldNodes: fieldNodes,
    returnType: fieldDef.type,
    parentType: parentType,
    path: path,
    schema: exeContext.schema,
    fragments: exeContext.fragments,
    rootValue: exeContext.rootValue,
    operation: exeContext.operation,
    variableValues: exeContext.variableValues
  };
}
exports.buildResolveInfo = buildResolveInfo;
function resolveFieldValueOrError(exeContext, fieldDef, fieldNodes, resolveFn, source, info) {
  try {
    var args = values_mjs_1.getArgumentValues(fieldDef, fieldNodes[0], exeContext.variableValues);
    var _contextValue = exeContext.contextValue;
    var result = resolveFn(source, args, _contextValue, info);
    return isPromise_mjs_1d.default(result) ? result.then(undefined, asErrorInstance) : result;
  } catch (error) {
    return asErrorInstance(error);
  }
}
exports.resolveFieldValueOrError = resolveFieldValueOrError;
function asErrorInstance(error) {
  if (error instanceof Error) {
    return error;
  }
  return new Error('Unexpected error value: ' + inspect_mjs_1d.default(error));
}
function completeValueCatchingError(exeContext, returnType, fieldNodes, info, path, result) {
  try {
    var completed;
    if (isPromise_mjs_1d.default(result)) {
      completed = result.then(function (resolved) {
        return completeValue(exeContext, returnType, fieldNodes, info, path, resolved);
      });
    } else {
      completed = completeValue(exeContext, returnType, fieldNodes, info, path, result);
    }
    if (isPromise_mjs_1d.default(completed)) {
      return completed.then(undefined, function (error) {
        return handleFieldError(error, fieldNodes, path, returnType, exeContext);
      });
    }
    return completed;
  } catch (error) {
    return handleFieldError(error, fieldNodes, path, returnType, exeContext);
  }
}
function handleFieldError(rawError, fieldNodes, path, returnType, exeContext) {
  var error = locatedError_mjs_1.locatedError(asErrorInstance(rawError), fieldNodes, Path_mjs_1.pathToArray(path));
  if (definition_mjs_1.isNonNullType(returnType)) {
    throw error;
  }
  exeContext.errors.push(error);
  return null;
}
function completeValue(exeContext, returnType, fieldNodes, info, path, result) {
  if (result instanceof Error) {
    throw result;
  }
  if (definition_mjs_1.isNonNullType(returnType)) {
    var completed = completeValue(exeContext, returnType.ofType, fieldNodes, info, path, result);
    if (completed === null) {
      throw new Error(("Cannot return null for non-nullable field ").concat(info.parentType.name, ".").concat(info.fieldName, "."));
    }
    return completed;
  }
  if (result == null) {
    return null;
  }
  if (definition_mjs_1.isListType(returnType)) {
    return completeListValue(exeContext, returnType, fieldNodes, info, path, result);
  }
  if (definition_mjs_1.isLeafType(returnType)) {
    return completeLeafValue(returnType, result);
  }
  if (definition_mjs_1.isAbstractType(returnType)) {
    return completeAbstractValue(exeContext, returnType, fieldNodes, info, path, result);
  }
  if (definition_mjs_1.isObjectType(returnType)) {
    return completeObjectValue(exeContext, returnType, fieldNodes, info, path, result);
  }
  invariant_mjs_1d.default(false, 'Cannot complete value of unexpected output type: ' + inspect_mjs_1d.default(returnType));
}
function completeListValue(exeContext, returnType, fieldNodes, info, path, result) {
  if (!isCollection_mjs_1d.default(result)) {
    throw new GraphQLError_mjs_1.GraphQLError(("Expected Iterable, but did not find one for field \"").concat(info.parentType.name, ".").concat(info.fieldName, "\"."));
  }
  var itemType = returnType.ofType;
  var containsPromise = false;
  var completedResults = arrayFrom_mjs_1d.default(result, function (item, index) {
    var fieldPath = Path_mjs_1.addPath(path, index);
    var completedItem = completeValueCatchingError(exeContext, itemType, fieldNodes, info, fieldPath, item);
    if (!containsPromise && isPromise_mjs_1d.default(completedItem)) {
      containsPromise = true;
    }
    return completedItem;
  });
  return containsPromise ? Promise.all(completedResults) : completedResults;
}
function completeLeafValue(returnType, result) {
  var serializedResult = returnType.serialize(result);
  if (serializedResult === undefined) {
    throw new Error(("Expected a value of type \"").concat(inspect_mjs_1d.default(returnType), "\" but ") + ("received: ").concat(inspect_mjs_1d.default(result)));
  }
  return serializedResult;
}
function completeAbstractValue(exeContext, returnType, fieldNodes, info, path, result) {
  var _returnType$resolveTy;
  var resolveTypeFn = (_returnType$resolveTy = returnType.resolveType) !== null && _returnType$resolveTy !== void 0 ? _returnType$resolveTy : exeContext.typeResolver;
  var contextValue = exeContext.contextValue;
  var runtimeType = resolveTypeFn(result, contextValue, info, returnType);
  if (isPromise_mjs_1d.default(runtimeType)) {
    return runtimeType.then(function (resolvedRuntimeType) {
      return completeObjectValue(exeContext, ensureValidRuntimeType(resolvedRuntimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result);
    });
  }
  return completeObjectValue(exeContext, ensureValidRuntimeType(runtimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result);
}
function ensureValidRuntimeType(runtimeTypeOrName, exeContext, returnType, fieldNodes, info, result) {
  var runtimeType = typeof runtimeTypeOrName === 'string' ? exeContext.schema.getType(runtimeTypeOrName) : runtimeTypeOrName;
  if (!definition_mjs_1.isObjectType(runtimeType)) {
    throw new GraphQLError_mjs_1.GraphQLError(("Abstract type \"").concat(returnType.name, "\" must resolve to an Object type at runtime for field \"").concat(info.parentType.name, ".").concat(info.fieldName, "\" with ") + ("value ").concat(inspect_mjs_1d.default(result), ", received \"").concat(inspect_mjs_1d.default(runtimeType), "\". ") + ("Either the \"").concat(returnType.name, "\" type should provide a \"resolveType\" function or each possible type should provide an \"isTypeOf\" function."), fieldNodes);
  }
  if (!exeContext.schema.isSubType(returnType, runtimeType)) {
    throw new GraphQLError_mjs_1.GraphQLError(("Runtime Object type \"").concat(runtimeType.name, "\" is not a possible type for \"").concat(returnType.name, "\"."), fieldNodes);
  }
  return runtimeType;
}
function completeObjectValue(exeContext, returnType, fieldNodes, info, path, result) {
  if (returnType.isTypeOf) {
    var isTypeOf = returnType.isTypeOf(result, exeContext.contextValue, info);
    if (isPromise_mjs_1d.default(isTypeOf)) {
      return isTypeOf.then(function (resolvedIsTypeOf) {
        if (!resolvedIsTypeOf) {
          throw invalidReturnTypeError(returnType, result, fieldNodes);
        }
        return collectAndExecuteSubfields(exeContext, returnType, fieldNodes, path, result);
      });
    }
    if (!isTypeOf) {
      throw invalidReturnTypeError(returnType, result, fieldNodes);
    }
  }
  return collectAndExecuteSubfields(exeContext, returnType, fieldNodes, path, result);
}
function invalidReturnTypeError(returnType, result, fieldNodes) {
  return new GraphQLError_mjs_1.GraphQLError(("Expected value of type \"").concat(returnType.name, "\" but got: ").concat(inspect_mjs_1d.default(result), "."), fieldNodes);
}
function collectAndExecuteSubfields(exeContext, returnType, fieldNodes, path, result) {
  var subFieldNodes = collectSubfields(exeContext, returnType, fieldNodes);
  return executeFields(exeContext, returnType, result, path, subFieldNodes);
}
var collectSubfields = memoize3_mjs_1d.default(_collectSubfields);
function _collectSubfields(exeContext, returnType, fieldNodes) {
  var subFieldNodes = Object.create(null);
  var visitedFragmentNames = Object.create(null);
  for (var _i8 = 0; _i8 < fieldNodes.length; _i8++) {
    var node = fieldNodes[_i8];
    if (node.selectionSet) {
      subFieldNodes = collectFields(exeContext, returnType, node.selectionSet, subFieldNodes, visitedFragmentNames);
    }
  }
  return subFieldNodes;
}
exports.defaultTypeResolver = function defaultTypeResolver(value, contextValue, info, abstractType) {
  if (isObjectLike_mjs_1d.default(value) && typeof value.__typename === 'string') {
    return value.__typename;
  }
  var possibleTypes = info.schema.getPossibleTypes(abstractType);
  var promisedIsTypeOfResults = [];
  for (var i = 0; i < possibleTypes.length; i++) {
    var type = possibleTypes[i];
    if (type.isTypeOf) {
      var isTypeOfResult = type.isTypeOf(value, contextValue, info);
      if (isPromise_mjs_1d.default(isTypeOfResult)) {
        promisedIsTypeOfResults[i] = isTypeOfResult;
      } else if (isTypeOfResult) {
        return type;
      }
    }
  }
  if (promisedIsTypeOfResults.length) {
    return Promise.all(promisedIsTypeOfResults).then(function (isTypeOfResults) {
      for (var _i9 = 0; _i9 < isTypeOfResults.length; _i9++) {
        if (isTypeOfResults[_i9]) {
          return possibleTypes[_i9];
        }
      }
    });
  }
};
exports.defaultFieldResolver = function defaultFieldResolver(source, args, contextValue, info) {
  if (isObjectLike_mjs_1d.default(source) || typeof source === 'function') {
    var property = source[info.fieldName];
    if (typeof property === 'function') {
      return source[info.fieldName](args, contextValue, info);
    }
    return property;
  }
};
function getFieldDef(schema, parentType, fieldName) {
  if (fieldName === introspection_mjs_1.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
    return introspection_mjs_1.SchemaMetaFieldDef;
  } else if (fieldName === introspection_mjs_1.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return introspection_mjs_1.TypeMetaFieldDef;
  } else if (fieldName === introspection_mjs_1.TypeNameMetaFieldDef.name) {
    return introspection_mjs_1.TypeNameMetaFieldDef;
  }
  return parentType.getFields()[fieldName];
}
exports.getFieldDef = getFieldDef;

},

// node_modules/graphql/type/schema.mjs @83
83: function(__fusereq, exports, module){
exports.__esModule = true;
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if (("value" in descriptor)) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
var find_mjs_1 = __fusereq(165);
var find_mjs_1d = __fuse.dt(find_mjs_1);
var arrayFrom_mjs_1 = __fusereq(168);
var arrayFrom_mjs_1d = __fuse.dt(arrayFrom_mjs_1);
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var symbols_mjs_1 = __fusereq(175);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var toObjMap_mjs_1 = __fusereq(176);
var toObjMap_mjs_1d = __fuse.dt(toObjMap_mjs_1);
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var instanceOf_mjs_1 = __fusereq(177);
var instanceOf_mjs_1d = __fuse.dt(instanceOf_mjs_1);
var isObjectLike_mjs_1 = __fusereq(171);
var isObjectLike_mjs_1d = __fuse.dt(isObjectLike_mjs_1);
var introspection_mjs_1 = __fusereq(87);
var directives_mjs_1 = __fusereq(85);
var definition_mjs_1 = __fusereq(84);
function isSchema(schema) {
  return instanceOf_mjs_1d.default(schema, exports.GraphQLSchema);
}
exports.isSchema = isSchema;
function assertSchema(schema) {
  if (!isSchema(schema)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(schema), " to be a GraphQL schema."));
  }
  return schema;
}
exports.assertSchema = assertSchema;
exports.GraphQLSchema = (function () {
  function GraphQLSchema(config) {
    var _config$directives;
    this.__validationErrors = config.assumeValid === true ? [] : undefined;
    isObjectLike_mjs_1d.default(config) || devAssert_mjs_1d.default(0, 'Must provide configuration object.');
    !config.types || Array.isArray(config.types) || devAssert_mjs_1d.default(0, ("\"types\" must be Array if provided but got: ").concat(inspect_mjs_1d.default(config.types), "."));
    !config.directives || Array.isArray(config.directives) || devAssert_mjs_1d.default(0, '"directives" must be Array if provided but got: ' + ("").concat(inspect_mjs_1d.default(config.directives), "."));
    this.description = config.description;
    this.extensions = config.extensions && toObjMap_mjs_1d.default(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = config.extensionASTNodes;
    this._queryType = config.query;
    this._mutationType = config.mutation;
    this._subscriptionType = config.subscription;
    this._directives = (_config$directives = config.directives) !== null && _config$directives !== void 0 ? _config$directives : directives_mjs_1.specifiedDirectives;
    var allReferencedTypes = new Set(config.types);
    if (config.types != null) {
      for (var _i2 = 0, _config$types2 = config.types; _i2 < _config$types2.length; _i2++) {
        var type = _config$types2[_i2];
        allReferencedTypes.delete(type);
        collectReferencedTypes(type, allReferencedTypes);
      }
    }
    if (this._queryType != null) {
      collectReferencedTypes(this._queryType, allReferencedTypes);
    }
    if (this._mutationType != null) {
      collectReferencedTypes(this._mutationType, allReferencedTypes);
    }
    if (this._subscriptionType != null) {
      collectReferencedTypes(this._subscriptionType, allReferencedTypes);
    }
    for (var _i4 = 0, _this$_directives2 = this._directives; _i4 < _this$_directives2.length; _i4++) {
      var directive = _this$_directives2[_i4];
      if (directives_mjs_1.isDirective(directive)) {
        for (var _i6 = 0, _directive$args2 = directive.args; _i6 < _directive$args2.length; _i6++) {
          var arg = _directive$args2[_i6];
          collectReferencedTypes(arg.type, allReferencedTypes);
        }
      }
    }
    collectReferencedTypes(introspection_mjs_1.__Schema, allReferencedTypes);
    this._typeMap = Object.create(null);
    this._subTypeMap = Object.create(null);
    this._implementationsMap = Object.create(null);
    for (var _i8 = 0, _arrayFrom2 = arrayFrom_mjs_1d.default(allReferencedTypes); _i8 < _arrayFrom2.length; _i8++) {
      var namedType = _arrayFrom2[_i8];
      if (namedType == null) {
        continue;
      }
      var typeName = namedType.name;
      typeName || devAssert_mjs_1d.default(0, 'One of the provided types for building the Schema is missing a name.');
      if (this._typeMap[typeName] !== undefined) {
        throw new Error(("Schema must contain uniquely named types but contains multiple types named \"").concat(typeName, "\"."));
      }
      this._typeMap[typeName] = namedType;
      if (definition_mjs_1.isInterfaceType(namedType)) {
        for (var _i10 = 0, _namedType$getInterfa2 = namedType.getInterfaces(); _i10 < _namedType$getInterfa2.length; _i10++) {
          var iface = _namedType$getInterfa2[_i10];
          if (definition_mjs_1.isInterfaceType(iface)) {
            var implementations = this._implementationsMap[iface.name];
            if (implementations === undefined) {
              implementations = this._implementationsMap[iface.name] = {
                objects: [],
                interfaces: []
              };
            }
            implementations.interfaces.push(namedType);
          }
        }
      } else if (definition_mjs_1.isObjectType(namedType)) {
        for (var _i12 = 0, _namedType$getInterfa4 = namedType.getInterfaces(); _i12 < _namedType$getInterfa4.length; _i12++) {
          var _iface = _namedType$getInterfa4[_i12];
          if (definition_mjs_1.isInterfaceType(_iface)) {
            var _implementations = this._implementationsMap[_iface.name];
            if (_implementations === undefined) {
              _implementations = this._implementationsMap[_iface.name] = {
                objects: [],
                interfaces: []
              };
            }
            _implementations.objects.push(namedType);
          }
        }
      }
    }
  }
  var _proto = GraphQLSchema.prototype;
  _proto.getQueryType = function getQueryType() {
    return this._queryType;
  };
  _proto.getMutationType = function getMutationType() {
    return this._mutationType;
  };
  _proto.getSubscriptionType = function getSubscriptionType() {
    return this._subscriptionType;
  };
  _proto.getTypeMap = function getTypeMap() {
    return this._typeMap;
  };
  _proto.getType = function getType(name) {
    return this.getTypeMap()[name];
  };
  _proto.getPossibleTypes = function getPossibleTypes(abstractType) {
    return definition_mjs_1.isUnionType(abstractType) ? abstractType.getTypes() : this.getImplementations(abstractType).objects;
  };
  _proto.getImplementations = function getImplementations(interfaceType) {
    var implementations = this._implementationsMap[interfaceType.name];
    return implementations !== null && implementations !== void 0 ? implementations : {
      objects: [],
      interfaces: []
    };
  };
  _proto.isPossibleType = function isPossibleType(abstractType, possibleType) {
    return this.isSubType(abstractType, possibleType);
  };
  _proto.isSubType = function isSubType(abstractType, maybeSubType) {
    var map = this._subTypeMap[abstractType.name];
    if (map === undefined) {
      map = Object.create(null);
      if (definition_mjs_1.isUnionType(abstractType)) {
        for (var _i14 = 0, _abstractType$getType2 = abstractType.getTypes(); _i14 < _abstractType$getType2.length; _i14++) {
          var type = _abstractType$getType2[_i14];
          map[type.name] = true;
        }
      } else {
        var implementations = this.getImplementations(abstractType);
        for (var _i16 = 0, _implementations$obje2 = implementations.objects; _i16 < _implementations$obje2.length; _i16++) {
          var _type = _implementations$obje2[_i16];
          map[_type.name] = true;
        }
        for (var _i18 = 0, _implementations$inte2 = implementations.interfaces; _i18 < _implementations$inte2.length; _i18++) {
          var _type2 = _implementations$inte2[_i18];
          map[_type2.name] = true;
        }
      }
      this._subTypeMap[abstractType.name] = map;
    }
    return map[maybeSubType.name] !== undefined;
  };
  _proto.getDirectives = function getDirectives() {
    return this._directives;
  };
  _proto.getDirective = function getDirective(name) {
    return find_mjs_1d.default(this.getDirectives(), function (directive) {
      return directive.name === name;
    });
  };
  _proto.toConfig = function toConfig() {
    var _this$extensionASTNod;
    return {
      description: this.description,
      query: this.getQueryType(),
      mutation: this.getMutationType(),
      subscription: this.getSubscriptionType(),
      types: objectValues_mjs_1d.default(this.getTypeMap()),
      directives: this.getDirectives().slice(),
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: (_this$extensionASTNod = this.extensionASTNodes) !== null && _this$extensionASTNod !== void 0 ? _this$extensionASTNod : [],
      assumeValid: this.__validationErrors !== undefined
    };
  };
  _createClass(GraphQLSchema, [{
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'GraphQLSchema';
    }
  }]);
  return GraphQLSchema;
})();
function collectReferencedTypes(type, typeSet) {
  var namedType = definition_mjs_1.getNamedType(type);
  if (!typeSet.has(namedType)) {
    typeSet.add(namedType);
    if (definition_mjs_1.isUnionType(namedType)) {
      for (var _i20 = 0, _namedType$getTypes2 = namedType.getTypes(); _i20 < _namedType$getTypes2.length; _i20++) {
        var memberType = _namedType$getTypes2[_i20];
        collectReferencedTypes(memberType, typeSet);
      }
    } else if (definition_mjs_1.isObjectType(namedType) || definition_mjs_1.isInterfaceType(namedType)) {
      for (var _i22 = 0, _namedType$getInterfa6 = namedType.getInterfaces(); _i22 < _namedType$getInterfa6.length; _i22++) {
        var interfaceType = _namedType$getInterfa6[_i22];
        collectReferencedTypes(interfaceType, typeSet);
      }
      for (var _i24 = 0, _objectValues2 = objectValues_mjs_1d.default(namedType.getFields()); _i24 < _objectValues2.length; _i24++) {
        var field = _objectValues2[_i24];
        collectReferencedTypes(field.type, typeSet);
        for (var _i26 = 0, _field$args2 = field.args; _i26 < _field$args2.length; _i26++) {
          var arg = _field$args2[_i26];
          collectReferencedTypes(arg.type, typeSet);
        }
      }
    } else if (definition_mjs_1.isInputObjectType(namedType)) {
      for (var _i28 = 0, _objectValues4 = objectValues_mjs_1d.default(namedType.getFields()); _i28 < _objectValues4.length; _i28++) {
        var _field = _objectValues4[_i28];
        collectReferencedTypes(_field.type, typeSet);
      }
    }
  }
  return typeSet;
}

},

// node_modules/graphql/type/definition.mjs @84
84: function(__fusereq, exports, module){
exports.__esModule = true;
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if (("value" in descriptor)) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
var objectEntries_mjs_1 = __fusereq(178);
var objectEntries_mjs_1d = __fuse.dt(objectEntries_mjs_1);
var symbols_mjs_1 = __fusereq(175);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var keyMap_mjs_1 = __fusereq(179);
var keyMap_mjs_1d = __fuse.dt(keyMap_mjs_1);
var mapValue_mjs_1 = __fusereq(180);
var mapValue_mjs_1d = __fuse.dt(mapValue_mjs_1);
var toObjMap_mjs_1 = __fusereq(176);
var toObjMap_mjs_1d = __fuse.dt(toObjMap_mjs_1);
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var keyValMap_mjs_1 = __fusereq(181);
var keyValMap_mjs_1d = __fuse.dt(keyValMap_mjs_1);
var instanceOf_mjs_1 = __fusereq(177);
var instanceOf_mjs_1d = __fuse.dt(instanceOf_mjs_1);
var didYouMean_mjs_1 = __fusereq(182);
var didYouMean_mjs_1d = __fuse.dt(didYouMean_mjs_1);
var isObjectLike_mjs_1 = __fusereq(171);
var isObjectLike_mjs_1d = __fuse.dt(isObjectLike_mjs_1);
var identityFunc_mjs_1 = __fusereq(183);
var identityFunc_mjs_1d = __fuse.dt(identityFunc_mjs_1);
var defineToJSON_mjs_1 = __fusereq(184);
var defineToJSON_mjs_1d = __fuse.dt(defineToJSON_mjs_1);
var suggestionList_mjs_1 = __fusereq(185);
var suggestionList_mjs_1d = __fuse.dt(suggestionList_mjs_1);
var kinds_mjs_1 = __fusereq(91);
var printer_mjs_1 = __fusereq(94);
var GraphQLError_mjs_1 = __fusereq(136);
var valueFromASTUntyped_mjs_1 = __fusereq(151);
function isType(type) {
  return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isInputObjectType(type) || isListType(type) || isNonNullType(type);
}
exports.isType = isType;
function assertType(type) {
  if (!isType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL type."));
  }
  return type;
}
exports.assertType = assertType;
function isScalarType(type) {
  return instanceOf_mjs_1d.default(type, exports.GraphQLScalarType);
}
exports.isScalarType = isScalarType;
function assertScalarType(type) {
  if (!isScalarType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL Scalar type."));
  }
  return type;
}
exports.assertScalarType = assertScalarType;
function isObjectType(type) {
  return instanceOf_mjs_1d.default(type, exports.GraphQLObjectType);
}
exports.isObjectType = isObjectType;
function assertObjectType(type) {
  if (!isObjectType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL Object type."));
  }
  return type;
}
exports.assertObjectType = assertObjectType;
function isInterfaceType(type) {
  return instanceOf_mjs_1d.default(type, exports.GraphQLInterfaceType);
}
exports.isInterfaceType = isInterfaceType;
function assertInterfaceType(type) {
  if (!isInterfaceType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL Interface type."));
  }
  return type;
}
exports.assertInterfaceType = assertInterfaceType;
function isUnionType(type) {
  return instanceOf_mjs_1d.default(type, exports.GraphQLUnionType);
}
exports.isUnionType = isUnionType;
function assertUnionType(type) {
  if (!isUnionType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL Union type."));
  }
  return type;
}
exports.assertUnionType = assertUnionType;
function isEnumType(type) {
  return instanceOf_mjs_1d.default(type, exports.GraphQLEnumType);
}
exports.isEnumType = isEnumType;
function assertEnumType(type) {
  if (!isEnumType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL Enum type."));
  }
  return type;
}
exports.assertEnumType = assertEnumType;
function isInputObjectType(type) {
  return instanceOf_mjs_1d.default(type, exports.GraphQLInputObjectType);
}
exports.isInputObjectType = isInputObjectType;
function assertInputObjectType(type) {
  if (!isInputObjectType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL Input Object type."));
  }
  return type;
}
exports.assertInputObjectType = assertInputObjectType;
function isListType(type) {
  return instanceOf_mjs_1d.default(type, GraphQLList);
}
exports.isListType = isListType;
function assertListType(type) {
  if (!isListType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL List type."));
  }
  return type;
}
exports.assertListType = assertListType;
function isNonNullType(type) {
  return instanceOf_mjs_1d.default(type, GraphQLNonNull);
}
exports.isNonNullType = isNonNullType;
function assertNonNullType(type) {
  if (!isNonNullType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL Non-Null type."));
  }
  return type;
}
exports.assertNonNullType = assertNonNullType;
function isInputType(type) {
  return isScalarType(type) || isEnumType(type) || isInputObjectType(type) || isWrappingType(type) && isInputType(type.ofType);
}
exports.isInputType = isInputType;
function assertInputType(type) {
  if (!isInputType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL input type."));
  }
  return type;
}
exports.assertInputType = assertInputType;
function isOutputType(type) {
  return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isWrappingType(type) && isOutputType(type.ofType);
}
exports.isOutputType = isOutputType;
function assertOutputType(type) {
  if (!isOutputType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL output type."));
  }
  return type;
}
exports.assertOutputType = assertOutputType;
function isLeafType(type) {
  return isScalarType(type) || isEnumType(type);
}
exports.isLeafType = isLeafType;
function assertLeafType(type) {
  if (!isLeafType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL leaf type."));
  }
  return type;
}
exports.assertLeafType = assertLeafType;
function isCompositeType(type) {
  return isObjectType(type) || isInterfaceType(type) || isUnionType(type);
}
exports.isCompositeType = isCompositeType;
function assertCompositeType(type) {
  if (!isCompositeType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL composite type."));
  }
  return type;
}
exports.assertCompositeType = assertCompositeType;
function isAbstractType(type) {
  return isInterfaceType(type) || isUnionType(type);
}
exports.isAbstractType = isAbstractType;
function assertAbstractType(type) {
  if (!isAbstractType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL abstract type."));
  }
  return type;
}
exports.assertAbstractType = assertAbstractType;
function GraphQLList(ofType) {
  if (this instanceof GraphQLList) {
    this.ofType = assertType(ofType);
  } else {
    return new GraphQLList(ofType);
  }
}
exports.GraphQLList = GraphQLList;
GraphQLList.prototype.toString = function toString() {
  return '[' + String(this.ofType) + ']';
};
Object.defineProperty(GraphQLList.prototype, symbols_mjs_1.SYMBOL_TO_STRING_TAG, {
  get: function get() {
    return 'GraphQLList';
  }
});
defineToJSON_mjs_1d.default(GraphQLList);
function GraphQLNonNull(ofType) {
  if (this instanceof GraphQLNonNull) {
    this.ofType = assertNullableType(ofType);
  } else {
    return new GraphQLNonNull(ofType);
  }
}
exports.GraphQLNonNull = GraphQLNonNull;
GraphQLNonNull.prototype.toString = function toString() {
  return String(this.ofType) + '!';
};
Object.defineProperty(GraphQLNonNull.prototype, symbols_mjs_1.SYMBOL_TO_STRING_TAG, {
  get: function get() {
    return 'GraphQLNonNull';
  }
});
defineToJSON_mjs_1d.default(GraphQLNonNull);
function isWrappingType(type) {
  return isListType(type) || isNonNullType(type);
}
exports.isWrappingType = isWrappingType;
function assertWrappingType(type) {
  if (!isWrappingType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL wrapping type."));
  }
  return type;
}
exports.assertWrappingType = assertWrappingType;
function isNullableType(type) {
  return isType(type) && !isNonNullType(type);
}
exports.isNullableType = isNullableType;
function assertNullableType(type) {
  if (!isNullableType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL nullable type."));
  }
  return type;
}
exports.assertNullableType = assertNullableType;
function getNullableType(type) {
  if (type) {
    return isNonNullType(type) ? type.ofType : type;
  }
}
exports.getNullableType = getNullableType;
function isNamedType(type) {
  return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isInputObjectType(type);
}
exports.isNamedType = isNamedType;
function assertNamedType(type) {
  if (!isNamedType(type)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(type), " to be a GraphQL named type."));
  }
  return type;
}
exports.assertNamedType = assertNamedType;
function getNamedType(type) {
  if (type) {
    var unwrappedType = type;
    while (isWrappingType(unwrappedType)) {
      unwrappedType = unwrappedType.ofType;
    }
    return unwrappedType;
  }
}
exports.getNamedType = getNamedType;
function resolveThunk(thunk) {
  return typeof thunk === 'function' ? thunk() : thunk;
}
function undefineIfEmpty(arr) {
  return arr && arr.length > 0 ? arr : undefined;
}
exports.GraphQLScalarType = (function () {
  function GraphQLScalarType(config) {
    var _config$parseValue, _config$serialize, _config$parseLiteral;
    var parseValue = (_config$parseValue = config.parseValue) !== null && _config$parseValue !== void 0 ? _config$parseValue : identityFunc_mjs_1d.default;
    this.name = config.name;
    this.description = config.description;
    this.serialize = (_config$serialize = config.serialize) !== null && _config$serialize !== void 0 ? _config$serialize : identityFunc_mjs_1d.default;
    this.parseValue = parseValue;
    this.parseLiteral = (_config$parseLiteral = config.parseLiteral) !== null && _config$parseLiteral !== void 0 ? _config$parseLiteral : function (node) {
      return parseValue(valueFromASTUntyped_mjs_1.valueFromASTUntyped(node));
    };
    this.extensions = config.extensions && toObjMap_mjs_1d.default(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = undefineIfEmpty(config.extensionASTNodes);
    typeof config.name === 'string' || devAssert_mjs_1d.default(0, 'Must provide name.');
    config.serialize == null || typeof config.serialize === 'function' || devAssert_mjs_1d.default(0, ("").concat(this.name, " must provide \"serialize\" function. If this custom Scalar is also used as an input type, ensure \"parseValue\" and \"parseLiteral\" functions are also provided."));
    if (config.parseLiteral) {
      typeof config.parseValue === 'function' && typeof config.parseLiteral === 'function' || devAssert_mjs_1d.default(0, ("").concat(this.name, " must provide both \"parseValue\" and \"parseLiteral\" functions."));
    }
  }
  var _proto = GraphQLScalarType.prototype;
  _proto.toConfig = function toConfig() {
    var _this$extensionASTNod;
    return {
      name: this.name,
      description: this.description,
      serialize: this.serialize,
      parseValue: this.parseValue,
      parseLiteral: this.parseLiteral,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: (_this$extensionASTNod = this.extensionASTNodes) !== null && _this$extensionASTNod !== void 0 ? _this$extensionASTNod : []
    };
  };
  _proto.toString = function toString() {
    return this.name;
  };
  _createClass(GraphQLScalarType, [{
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'GraphQLScalarType';
    }
  }]);
  return GraphQLScalarType;
})();
defineToJSON_mjs_1d.default(exports.GraphQLScalarType);
exports.GraphQLObjectType = (function () {
  function GraphQLObjectType(config) {
    this.name = config.name;
    this.description = config.description;
    this.isTypeOf = config.isTypeOf;
    this.extensions = config.extensions && toObjMap_mjs_1d.default(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = undefineIfEmpty(config.extensionASTNodes);
    this._fields = defineFieldMap.bind(undefined, config);
    this._interfaces = defineInterfaces.bind(undefined, config);
    typeof config.name === 'string' || devAssert_mjs_1d.default(0, 'Must provide name.');
    config.isTypeOf == null || typeof config.isTypeOf === 'function' || devAssert_mjs_1d.default(0, ("").concat(this.name, " must provide \"isTypeOf\" as a function, ") + ("but got: ").concat(inspect_mjs_1d.default(config.isTypeOf), "."));
  }
  var _proto2 = GraphQLObjectType.prototype;
  _proto2.getFields = function getFields() {
    if (typeof this._fields === 'function') {
      this._fields = this._fields();
    }
    return this._fields;
  };
  _proto2.getInterfaces = function getInterfaces() {
    if (typeof this._interfaces === 'function') {
      this._interfaces = this._interfaces();
    }
    return this._interfaces;
  };
  _proto2.toConfig = function toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      isTypeOf: this.isTypeOf,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes || []
    };
  };
  _proto2.toString = function toString() {
    return this.name;
  };
  _createClass(GraphQLObjectType, [{
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'GraphQLObjectType';
    }
  }]);
  return GraphQLObjectType;
})();
defineToJSON_mjs_1d.default(exports.GraphQLObjectType);
function defineInterfaces(config) {
  var _resolveThunk;
  var interfaces = (_resolveThunk = resolveThunk(config.interfaces)) !== null && _resolveThunk !== void 0 ? _resolveThunk : [];
  Array.isArray(interfaces) || devAssert_mjs_1d.default(0, ("").concat(config.name, " interfaces must be an Array or a function which returns an Array."));
  return interfaces;
}
function defineFieldMap(config) {
  var fieldMap = resolveThunk(config.fields);
  isPlainObj(fieldMap) || devAssert_mjs_1d.default(0, ("").concat(config.name, " fields must be an object with field names as keys or a function which returns such an object."));
  return mapValue_mjs_1d.default(fieldMap, function (fieldConfig, fieldName) {
    var _fieldConfig$args;
    isPlainObj(fieldConfig) || devAssert_mjs_1d.default(0, ("").concat(config.name, ".").concat(fieldName, " field config must be an object."));
    !(('isDeprecated' in fieldConfig)) || devAssert_mjs_1d.default(0, ("").concat(config.name, ".").concat(fieldName, " should provide \"deprecationReason\" instead of \"isDeprecated\"."));
    fieldConfig.resolve == null || typeof fieldConfig.resolve === 'function' || devAssert_mjs_1d.default(0, ("").concat(config.name, ".").concat(fieldName, " field resolver must be a function if ") + ("provided, but got: ").concat(inspect_mjs_1d.default(fieldConfig.resolve), "."));
    var argsConfig = (_fieldConfig$args = fieldConfig.args) !== null && _fieldConfig$args !== void 0 ? _fieldConfig$args : {};
    isPlainObj(argsConfig) || devAssert_mjs_1d.default(0, ("").concat(config.name, ".").concat(fieldName, " args must be an object with argument names as keys."));
    var args = objectEntries_mjs_1d.default(argsConfig).map(function (_ref) {
      var argName = _ref[0], argConfig = _ref[1];
      return {
        name: argName,
        description: argConfig.description,
        type: argConfig.type,
        defaultValue: argConfig.defaultValue,
        extensions: argConfig.extensions && toObjMap_mjs_1d.default(argConfig.extensions),
        astNode: argConfig.astNode
      };
    });
    return {
      name: fieldName,
      description: fieldConfig.description,
      type: fieldConfig.type,
      args: args,
      resolve: fieldConfig.resolve,
      subscribe: fieldConfig.subscribe,
      isDeprecated: fieldConfig.deprecationReason != null,
      deprecationReason: fieldConfig.deprecationReason,
      extensions: fieldConfig.extensions && toObjMap_mjs_1d.default(fieldConfig.extensions),
      astNode: fieldConfig.astNode
    };
  });
}
function isPlainObj(obj) {
  return isObjectLike_mjs_1d.default(obj) && !Array.isArray(obj);
}
function fieldsToFieldsConfig(fields) {
  return mapValue_mjs_1d.default(fields, function (field) {
    return {
      description: field.description,
      type: field.type,
      args: argsToArgsConfig(field.args),
      resolve: field.resolve,
      subscribe: field.subscribe,
      deprecationReason: field.deprecationReason,
      extensions: field.extensions,
      astNode: field.astNode
    };
  });
}
function argsToArgsConfig(args) {
  return keyValMap_mjs_1d.default(args, function (arg) {
    return arg.name;
  }, function (arg) {
    return {
      description: arg.description,
      type: arg.type,
      defaultValue: arg.defaultValue,
      extensions: arg.extensions,
      astNode: arg.astNode
    };
  });
}
exports.argsToArgsConfig = argsToArgsConfig;
function isRequiredArgument(arg) {
  return isNonNullType(arg.type) && arg.defaultValue === undefined;
}
exports.isRequiredArgument = isRequiredArgument;
exports.GraphQLInterfaceType = (function () {
  function GraphQLInterfaceType(config) {
    this.name = config.name;
    this.description = config.description;
    this.resolveType = config.resolveType;
    this.extensions = config.extensions && toObjMap_mjs_1d.default(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = undefineIfEmpty(config.extensionASTNodes);
    this._fields = defineFieldMap.bind(undefined, config);
    this._interfaces = defineInterfaces.bind(undefined, config);
    typeof config.name === 'string' || devAssert_mjs_1d.default(0, 'Must provide name.');
    config.resolveType == null || typeof config.resolveType === 'function' || devAssert_mjs_1d.default(0, ("").concat(this.name, " must provide \"resolveType\" as a function, ") + ("but got: ").concat(inspect_mjs_1d.default(config.resolveType), "."));
  }
  var _proto3 = GraphQLInterfaceType.prototype;
  _proto3.getFields = function getFields() {
    if (typeof this._fields === 'function') {
      this._fields = this._fields();
    }
    return this._fields;
  };
  _proto3.getInterfaces = function getInterfaces() {
    if (typeof this._interfaces === 'function') {
      this._interfaces = this._interfaces();
    }
    return this._interfaces;
  };
  _proto3.toConfig = function toConfig() {
    var _this$extensionASTNod2;
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: (_this$extensionASTNod2 = this.extensionASTNodes) !== null && _this$extensionASTNod2 !== void 0 ? _this$extensionASTNod2 : []
    };
  };
  _proto3.toString = function toString() {
    return this.name;
  };
  _createClass(GraphQLInterfaceType, [{
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'GraphQLInterfaceType';
    }
  }]);
  return GraphQLInterfaceType;
})();
defineToJSON_mjs_1d.default(exports.GraphQLInterfaceType);
exports.GraphQLUnionType = (function () {
  function GraphQLUnionType(config) {
    this.name = config.name;
    this.description = config.description;
    this.resolveType = config.resolveType;
    this.extensions = config.extensions && toObjMap_mjs_1d.default(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = undefineIfEmpty(config.extensionASTNodes);
    this._types = defineTypes.bind(undefined, config);
    typeof config.name === 'string' || devAssert_mjs_1d.default(0, 'Must provide name.');
    config.resolveType == null || typeof config.resolveType === 'function' || devAssert_mjs_1d.default(0, ("").concat(this.name, " must provide \"resolveType\" as a function, ") + ("but got: ").concat(inspect_mjs_1d.default(config.resolveType), "."));
  }
  var _proto4 = GraphQLUnionType.prototype;
  _proto4.getTypes = function getTypes() {
    if (typeof this._types === 'function') {
      this._types = this._types();
    }
    return this._types;
  };
  _proto4.toConfig = function toConfig() {
    var _this$extensionASTNod3;
    return {
      name: this.name,
      description: this.description,
      types: this.getTypes(),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: (_this$extensionASTNod3 = this.extensionASTNodes) !== null && _this$extensionASTNod3 !== void 0 ? _this$extensionASTNod3 : []
    };
  };
  _proto4.toString = function toString() {
    return this.name;
  };
  _createClass(GraphQLUnionType, [{
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'GraphQLUnionType';
    }
  }]);
  return GraphQLUnionType;
})();
defineToJSON_mjs_1d.default(exports.GraphQLUnionType);
function defineTypes(config) {
  var types = resolveThunk(config.types);
  Array.isArray(types) || devAssert_mjs_1d.default(0, ("Must provide Array of types or a function which returns such an array for Union ").concat(config.name, "."));
  return types;
}
exports.GraphQLEnumType = (function () {
  function GraphQLEnumType(config) {
    this.name = config.name;
    this.description = config.description;
    this.extensions = config.extensions && toObjMap_mjs_1d.default(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = undefineIfEmpty(config.extensionASTNodes);
    this._values = defineEnumValues(this.name, config.values);
    this._valueLookup = new Map(this._values.map(function (enumValue) {
      return [enumValue.value, enumValue];
    }));
    this._nameLookup = keyMap_mjs_1d.default(this._values, function (value) {
      return value.name;
    });
    typeof config.name === 'string' || devAssert_mjs_1d.default(0, 'Must provide name.');
  }
  var _proto5 = GraphQLEnumType.prototype;
  _proto5.getValues = function getValues() {
    return this._values;
  };
  _proto5.getValue = function getValue(name) {
    return this._nameLookup[name];
  };
  _proto5.serialize = function serialize(outputValue) {
    var enumValue = this._valueLookup.get(outputValue);
    if (enumValue === undefined) {
      throw new GraphQLError_mjs_1.GraphQLError(("Enum \"").concat(this.name, "\" cannot represent value: ").concat(inspect_mjs_1d.default(outputValue)));
    }
    return enumValue.name;
  };
  _proto5.parseValue = function parseValue(inputValue) {
    if (typeof inputValue !== 'string') {
      var valueStr = inspect_mjs_1d.default(inputValue);
      throw new GraphQLError_mjs_1.GraphQLError(("Enum \"").concat(this.name, "\" cannot represent non-string value: ").concat(valueStr, ".") + didYouMeanEnumValue(this, valueStr));
    }
    var enumValue = this.getValue(inputValue);
    if (enumValue == null) {
      throw new GraphQLError_mjs_1.GraphQLError(("Value \"").concat(inputValue, "\" does not exist in \"").concat(this.name, "\" enum.") + didYouMeanEnumValue(this, inputValue));
    }
    return enumValue.value;
  };
  _proto5.parseLiteral = function parseLiteral(valueNode, _variables) {
    if (valueNode.kind !== kinds_mjs_1.Kind.ENUM) {
      var valueStr = printer_mjs_1.print(valueNode);
      throw new GraphQLError_mjs_1.GraphQLError(("Enum \"").concat(this.name, "\" cannot represent non-enum value: ").concat(valueStr, ".") + didYouMeanEnumValue(this, valueStr), valueNode);
    }
    var enumValue = this.getValue(valueNode.value);
    if (enumValue == null) {
      var _valueStr = printer_mjs_1.print(valueNode);
      throw new GraphQLError_mjs_1.GraphQLError(("Value \"").concat(_valueStr, "\" does not exist in \"").concat(this.name, "\" enum.") + didYouMeanEnumValue(this, _valueStr), valueNode);
    }
    return enumValue.value;
  };
  _proto5.toConfig = function toConfig() {
    var _this$extensionASTNod4;
    var values = keyValMap_mjs_1d.default(this.getValues(), function (value) {
      return value.name;
    }, function (value) {
      return {
        description: value.description,
        value: value.value,
        deprecationReason: value.deprecationReason,
        extensions: value.extensions,
        astNode: value.astNode
      };
    });
    return {
      name: this.name,
      description: this.description,
      values: values,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: (_this$extensionASTNod4 = this.extensionASTNodes) !== null && _this$extensionASTNod4 !== void 0 ? _this$extensionASTNod4 : []
    };
  };
  _proto5.toString = function toString() {
    return this.name;
  };
  _createClass(GraphQLEnumType, [{
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'GraphQLEnumType';
    }
  }]);
  return GraphQLEnumType;
})();
defineToJSON_mjs_1d.default(exports.GraphQLEnumType);
function didYouMeanEnumValue(enumType, unknownValueStr) {
  var allNames = enumType.getValues().map(function (value) {
    return value.name;
  });
  var suggestedValues = suggestionList_mjs_1d.default(unknownValueStr, allNames);
  return didYouMean_mjs_1d.default('the enum value', suggestedValues);
}
function defineEnumValues(typeName, valueMap) {
  isPlainObj(valueMap) || devAssert_mjs_1d.default(0, ("").concat(typeName, " values must be an object with value names as keys."));
  return objectEntries_mjs_1d.default(valueMap).map(function (_ref2) {
    var valueName = _ref2[0], valueConfig = _ref2[1];
    isPlainObj(valueConfig) || devAssert_mjs_1d.default(0, ("").concat(typeName, ".").concat(valueName, " must refer to an object with a \"value\" key ") + ("representing an internal value but got: ").concat(inspect_mjs_1d.default(valueConfig), "."));
    !(('isDeprecated' in valueConfig)) || devAssert_mjs_1d.default(0, ("").concat(typeName, ".").concat(valueName, " should provide \"deprecationReason\" instead of \"isDeprecated\"."));
    return {
      name: valueName,
      description: valueConfig.description,
      value: valueConfig.value !== undefined ? valueConfig.value : valueName,
      isDeprecated: valueConfig.deprecationReason != null,
      deprecationReason: valueConfig.deprecationReason,
      extensions: valueConfig.extensions && toObjMap_mjs_1d.default(valueConfig.extensions),
      astNode: valueConfig.astNode
    };
  });
}
exports.GraphQLInputObjectType = (function () {
  function GraphQLInputObjectType(config) {
    this.name = config.name;
    this.description = config.description;
    this.extensions = config.extensions && toObjMap_mjs_1d.default(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = undefineIfEmpty(config.extensionASTNodes);
    this._fields = defineInputFieldMap.bind(undefined, config);
    typeof config.name === 'string' || devAssert_mjs_1d.default(0, 'Must provide name.');
  }
  var _proto6 = GraphQLInputObjectType.prototype;
  _proto6.getFields = function getFields() {
    if (typeof this._fields === 'function') {
      this._fields = this._fields();
    }
    return this._fields;
  };
  _proto6.toConfig = function toConfig() {
    var _this$extensionASTNod5;
    var fields = mapValue_mjs_1d.default(this.getFields(), function (field) {
      return {
        description: field.description,
        type: field.type,
        defaultValue: field.defaultValue,
        extensions: field.extensions,
        astNode: field.astNode
      };
    });
    return {
      name: this.name,
      description: this.description,
      fields: fields,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: (_this$extensionASTNod5 = this.extensionASTNodes) !== null && _this$extensionASTNod5 !== void 0 ? _this$extensionASTNod5 : []
    };
  };
  _proto6.toString = function toString() {
    return this.name;
  };
  _createClass(GraphQLInputObjectType, [{
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'GraphQLInputObjectType';
    }
  }]);
  return GraphQLInputObjectType;
})();
defineToJSON_mjs_1d.default(exports.GraphQLInputObjectType);
function defineInputFieldMap(config) {
  var fieldMap = resolveThunk(config.fields);
  isPlainObj(fieldMap) || devAssert_mjs_1d.default(0, ("").concat(config.name, " fields must be an object with field names as keys or a function which returns such an object."));
  return mapValue_mjs_1d.default(fieldMap, function (fieldConfig, fieldName) {
    !(('resolve' in fieldConfig)) || devAssert_mjs_1d.default(0, ("").concat(config.name, ".").concat(fieldName, " field has a resolve property, but Input Types cannot define resolvers."));
    return {
      name: fieldName,
      description: fieldConfig.description,
      type: fieldConfig.type,
      defaultValue: fieldConfig.defaultValue,
      extensions: fieldConfig.extensions && toObjMap_mjs_1d.default(fieldConfig.extensions),
      astNode: fieldConfig.astNode
    };
  });
}
function isRequiredInputField(field) {
  return isNonNullType(field.type) && field.defaultValue === undefined;
}
exports.isRequiredInputField = isRequiredInputField;

},

// node_modules/graphql/type/directives.mjs @85
85: function(__fusereq, exports, module){
exports.__esModule = true;
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if (("value" in descriptor)) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
var objectEntries_mjs_1 = __fusereq(178);
var objectEntries_mjs_1d = __fuse.dt(objectEntries_mjs_1);
var symbols_mjs_1 = __fusereq(175);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var toObjMap_mjs_1 = __fusereq(176);
var toObjMap_mjs_1d = __fuse.dt(toObjMap_mjs_1);
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var instanceOf_mjs_1 = __fusereq(177);
var instanceOf_mjs_1d = __fuse.dt(instanceOf_mjs_1);
var defineToJSON_mjs_1 = __fusereq(184);
var defineToJSON_mjs_1d = __fuse.dt(defineToJSON_mjs_1);
var isObjectLike_mjs_1 = __fusereq(171);
var isObjectLike_mjs_1d = __fuse.dt(isObjectLike_mjs_1);
var directiveLocation_mjs_1 = __fusereq(97);
var scalars_mjs_1 = __fusereq(86);
var definition_mjs_1 = __fusereq(84);
function isDirective(directive) {
  return instanceOf_mjs_1d.default(directive, exports.GraphQLDirective);
}
exports.isDirective = isDirective;
function assertDirective(directive) {
  if (!isDirective(directive)) {
    throw new Error(("Expected ").concat(inspect_mjs_1d.default(directive), " to be a GraphQL directive."));
  }
  return directive;
}
exports.assertDirective = assertDirective;
exports.GraphQLDirective = (function () {
  function GraphQLDirective(config) {
    var _config$isRepeatable, _config$args;
    this.name = config.name;
    this.description = config.description;
    this.locations = config.locations;
    this.isRepeatable = (_config$isRepeatable = config.isRepeatable) !== null && _config$isRepeatable !== void 0 ? _config$isRepeatable : false;
    this.extensions = config.extensions && toObjMap_mjs_1d.default(config.extensions);
    this.astNode = config.astNode;
    config.name || devAssert_mjs_1d.default(0, 'Directive must be named.');
    Array.isArray(config.locations) || devAssert_mjs_1d.default(0, ("@").concat(config.name, " locations must be an Array."));
    var args = (_config$args = config.args) !== null && _config$args !== void 0 ? _config$args : {};
    isObjectLike_mjs_1d.default(args) && !Array.isArray(args) || devAssert_mjs_1d.default(0, ("@").concat(config.name, " args must be an object with argument names as keys."));
    this.args = objectEntries_mjs_1d.default(args).map(function (_ref) {
      var argName = _ref[0], argConfig = _ref[1];
      return {
        name: argName,
        description: argConfig.description,
        type: argConfig.type,
        defaultValue: argConfig.defaultValue,
        extensions: argConfig.extensions && toObjMap_mjs_1d.default(argConfig.extensions),
        astNode: argConfig.astNode
      };
    });
  }
  var _proto = GraphQLDirective.prototype;
  _proto.toConfig = function toConfig() {
    return {
      name: this.name,
      description: this.description,
      locations: this.locations,
      args: definition_mjs_1.argsToArgsConfig(this.args),
      isRepeatable: this.isRepeatable,
      extensions: this.extensions,
      astNode: this.astNode
    };
  };
  _proto.toString = function toString() {
    return '@' + this.name;
  };
  _createClass(GraphQLDirective, [{
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'GraphQLDirective';
    }
  }]);
  return GraphQLDirective;
})();
defineToJSON_mjs_1d.default(exports.GraphQLDirective);
exports.GraphQLIncludeDirective = new exports.GraphQLDirective({
  name: 'include',
  description: 'Directs the executor to include this field or fragment only when the `if` argument is true.',
  locations: [directiveLocation_mjs_1.DirectiveLocation.FIELD, directiveLocation_mjs_1.DirectiveLocation.FRAGMENT_SPREAD, directiveLocation_mjs_1.DirectiveLocation.INLINE_FRAGMENT],
  args: {
    if: {
      type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLBoolean),
      description: 'Included when true.'
    }
  }
});
exports.GraphQLSkipDirective = new exports.GraphQLDirective({
  name: 'skip',
  description: 'Directs the executor to skip this field or fragment when the `if` argument is true.',
  locations: [directiveLocation_mjs_1.DirectiveLocation.FIELD, directiveLocation_mjs_1.DirectiveLocation.FRAGMENT_SPREAD, directiveLocation_mjs_1.DirectiveLocation.INLINE_FRAGMENT],
  args: {
    if: {
      type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLBoolean),
      description: 'Skipped when true.'
    }
  }
});
exports.DEFAULT_DEPRECATION_REASON = 'No longer supported';
exports.GraphQLDeprecatedDirective = new exports.GraphQLDirective({
  name: 'deprecated',
  description: 'Marks an element of a GraphQL schema as no longer supported.',
  locations: [directiveLocation_mjs_1.DirectiveLocation.FIELD_DEFINITION, directiveLocation_mjs_1.DirectiveLocation.ENUM_VALUE],
  args: {
    reason: {
      type: scalars_mjs_1.GraphQLString,
      description: 'Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).',
      defaultValue: exports.DEFAULT_DEPRECATION_REASON
    }
  }
});
exports.specifiedDirectives = Object.freeze([exports.GraphQLIncludeDirective, exports.GraphQLSkipDirective, exports.GraphQLDeprecatedDirective]);
function isSpecifiedDirective(directive) {
  return exports.specifiedDirectives.some(function (_ref2) {
    var name = _ref2.name;
    return name === directive.name;
  });
}
exports.isSpecifiedDirective = isSpecifiedDirective;

},

// node_modules/graphql/type/scalars.mjs @86
86: function(__fusereq, exports, module){
exports.__esModule = true;
var isFinite_mjs_1 = __fusereq(186);
var isFinite_mjs_1d = __fuse.dt(isFinite_mjs_1);
var isInteger_mjs_1 = __fusereq(187);
var isInteger_mjs_1d = __fuse.dt(isInteger_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var isObjectLike_mjs_1 = __fusereq(171);
var isObjectLike_mjs_1d = __fuse.dt(isObjectLike_mjs_1);
var kinds_mjs_1 = __fusereq(91);
var printer_mjs_1 = __fusereq(94);
var GraphQLError_mjs_1 = __fusereq(136);
var definition_mjs_1 = __fusereq(84);
var MAX_INT = 2147483647;
var MIN_INT = -2147483648;
function serializeInt(outputValue) {
  var coercedValue = serializeObject(outputValue);
  if (typeof coercedValue === 'boolean') {
    return coercedValue ? 1 : 0;
  }
  var num = coercedValue;
  if (typeof coercedValue === 'string' && coercedValue !== '') {
    num = Number(coercedValue);
  }
  if (!isInteger_mjs_1d.default(num)) {
    throw new GraphQLError_mjs_1.GraphQLError(("Int cannot represent non-integer value: ").concat(inspect_mjs_1d.default(coercedValue)));
  }
  if (num > MAX_INT || num < MIN_INT) {
    throw new GraphQLError_mjs_1.GraphQLError('Int cannot represent non 32-bit signed integer value: ' + inspect_mjs_1d.default(coercedValue));
  }
  return num;
}
function coerceInt(inputValue) {
  if (!isInteger_mjs_1d.default(inputValue)) {
    throw new GraphQLError_mjs_1.GraphQLError(("Int cannot represent non-integer value: ").concat(inspect_mjs_1d.default(inputValue)));
  }
  if (inputValue > MAX_INT || inputValue < MIN_INT) {
    throw new GraphQLError_mjs_1.GraphQLError(("Int cannot represent non 32-bit signed integer value: ").concat(inputValue));
  }
  return inputValue;
}
exports.GraphQLInt = new definition_mjs_1.GraphQLScalarType({
  name: 'Int',
  description: 'The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.',
  serialize: serializeInt,
  parseValue: coerceInt,
  parseLiteral: function parseLiteral(valueNode) {
    if (valueNode.kind !== kinds_mjs_1.Kind.INT) {
      throw new GraphQLError_mjs_1.GraphQLError(("Int cannot represent non-integer value: ").concat(printer_mjs_1.print(valueNode)), valueNode);
    }
    var num = parseInt(valueNode.value, 10);
    if (num > MAX_INT || num < MIN_INT) {
      throw new GraphQLError_mjs_1.GraphQLError(("Int cannot represent non 32-bit signed integer value: ").concat(valueNode.value), valueNode);
    }
    return num;
  }
});
function serializeFloat(outputValue) {
  var coercedValue = serializeObject(outputValue);
  if (typeof coercedValue === 'boolean') {
    return coercedValue ? 1 : 0;
  }
  var num = coercedValue;
  if (typeof coercedValue === 'string' && coercedValue !== '') {
    num = Number(coercedValue);
  }
  if (!isFinite_mjs_1d.default(num)) {
    throw new GraphQLError_mjs_1.GraphQLError(("Float cannot represent non numeric value: ").concat(inspect_mjs_1d.default(coercedValue)));
  }
  return num;
}
function coerceFloat(inputValue) {
  if (!isFinite_mjs_1d.default(inputValue)) {
    throw new GraphQLError_mjs_1.GraphQLError(("Float cannot represent non numeric value: ").concat(inspect_mjs_1d.default(inputValue)));
  }
  return inputValue;
}
exports.GraphQLFloat = new definition_mjs_1.GraphQLScalarType({
  name: 'Float',
  description: 'The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).',
  serialize: serializeFloat,
  parseValue: coerceFloat,
  parseLiteral: function parseLiteral(valueNode) {
    if (valueNode.kind !== kinds_mjs_1.Kind.FLOAT && valueNode.kind !== kinds_mjs_1.Kind.INT) {
      throw new GraphQLError_mjs_1.GraphQLError(("Float cannot represent non numeric value: ").concat(printer_mjs_1.print(valueNode)), valueNode);
    }
    return parseFloat(valueNode.value);
  }
});
function serializeObject(outputValue) {
  if (isObjectLike_mjs_1d.default(outputValue)) {
    if (typeof outputValue.valueOf === 'function') {
      var valueOfResult = outputValue.valueOf();
      if (!isObjectLike_mjs_1d.default(valueOfResult)) {
        return valueOfResult;
      }
    }
    if (typeof outputValue.toJSON === 'function') {
      return outputValue.toJSON();
    }
  }
  return outputValue;
}
function serializeString(outputValue) {
  var coercedValue = serializeObject(outputValue);
  if (typeof coercedValue === 'string') {
    return coercedValue;
  }
  if (typeof coercedValue === 'boolean') {
    return coercedValue ? 'true' : 'false';
  }
  if (isFinite_mjs_1d.default(coercedValue)) {
    return coercedValue.toString();
  }
  throw new GraphQLError_mjs_1.GraphQLError(("String cannot represent value: ").concat(inspect_mjs_1d.default(outputValue)));
}
function coerceString(inputValue) {
  if (typeof inputValue !== 'string') {
    throw new GraphQLError_mjs_1.GraphQLError(("String cannot represent a non string value: ").concat(inspect_mjs_1d.default(inputValue)));
  }
  return inputValue;
}
exports.GraphQLString = new definition_mjs_1.GraphQLScalarType({
  name: 'String',
  description: 'The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.',
  serialize: serializeString,
  parseValue: coerceString,
  parseLiteral: function parseLiteral(valueNode) {
    if (valueNode.kind !== kinds_mjs_1.Kind.STRING) {
      throw new GraphQLError_mjs_1.GraphQLError(("String cannot represent a non string value: ").concat(printer_mjs_1.print(valueNode)), valueNode);
    }
    return valueNode.value;
  }
});
function serializeBoolean(outputValue) {
  var coercedValue = serializeObject(outputValue);
  if (typeof coercedValue === 'boolean') {
    return coercedValue;
  }
  if (isFinite_mjs_1d.default(coercedValue)) {
    return coercedValue !== 0;
  }
  throw new GraphQLError_mjs_1.GraphQLError(("Boolean cannot represent a non boolean value: ").concat(inspect_mjs_1d.default(coercedValue)));
}
function coerceBoolean(inputValue) {
  if (typeof inputValue !== 'boolean') {
    throw new GraphQLError_mjs_1.GraphQLError(("Boolean cannot represent a non boolean value: ").concat(inspect_mjs_1d.default(inputValue)));
  }
  return inputValue;
}
exports.GraphQLBoolean = new definition_mjs_1.GraphQLScalarType({
  name: 'Boolean',
  description: 'The `Boolean` scalar type represents `true` or `false`.',
  serialize: serializeBoolean,
  parseValue: coerceBoolean,
  parseLiteral: function parseLiteral(valueNode) {
    if (valueNode.kind !== kinds_mjs_1.Kind.BOOLEAN) {
      throw new GraphQLError_mjs_1.GraphQLError(("Boolean cannot represent a non boolean value: ").concat(printer_mjs_1.print(valueNode)), valueNode);
    }
    return valueNode.value;
  }
});
function serializeID(outputValue) {
  var coercedValue = serializeObject(outputValue);
  if (typeof coercedValue === 'string') {
    return coercedValue;
  }
  if (isInteger_mjs_1d.default(coercedValue)) {
    return String(coercedValue);
  }
  throw new GraphQLError_mjs_1.GraphQLError(("ID cannot represent value: ").concat(inspect_mjs_1d.default(outputValue)));
}
function coerceID(inputValue) {
  if (typeof inputValue === 'string') {
    return inputValue;
  }
  if (isInteger_mjs_1d.default(inputValue)) {
    return inputValue.toString();
  }
  throw new GraphQLError_mjs_1.GraphQLError(("ID cannot represent value: ").concat(inspect_mjs_1d.default(inputValue)));
}
exports.GraphQLID = new definition_mjs_1.GraphQLScalarType({
  name: 'ID',
  description: 'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
  serialize: serializeID,
  parseValue: coerceID,
  parseLiteral: function parseLiteral(valueNode) {
    if (valueNode.kind !== kinds_mjs_1.Kind.STRING && valueNode.kind !== kinds_mjs_1.Kind.INT) {
      throw new GraphQLError_mjs_1.GraphQLError('ID cannot represent a non-string and non-integer value: ' + printer_mjs_1.print(valueNode), valueNode);
    }
    return valueNode.value;
  }
});
exports.specifiedScalarTypes = Object.freeze([exports.GraphQLString, exports.GraphQLInt, exports.GraphQLFloat, exports.GraphQLBoolean, exports.GraphQLID]);
function isSpecifiedScalarType(type) {
  return exports.specifiedScalarTypes.some(function (_ref) {
    var name = _ref.name;
    return type.name === name;
  });
}
exports.isSpecifiedScalarType = isSpecifiedScalarType;

},

// node_modules/graphql/type/introspection.mjs @87
87: function(__fusereq, exports, module){
exports.__esModule = true;
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var printer_mjs_1 = __fusereq(94);
var directiveLocation_mjs_1 = __fusereq(97);
var astFromValue_mjs_1 = __fusereq(152);
var scalars_mjs_1 = __fusereq(86);
var definition_mjs_1 = __fusereq(84);
exports.__Schema = new definition_mjs_1.GraphQLObjectType({
  name: '__Schema',
  description: 'A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.',
  fields: function fields() {
    return {
      description: {
        type: scalars_mjs_1.GraphQLString,
        resolve: function resolve(schema) {
          return schema.description;
        }
      },
      types: {
        description: 'A list of all types supported by this server.',
        type: definition_mjs_1.GraphQLNonNull(definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__Type))),
        resolve: function resolve(schema) {
          return objectValues_mjs_1d.default(schema.getTypeMap());
        }
      },
      queryType: {
        description: 'The type that query operations will be rooted at.',
        type: definition_mjs_1.GraphQLNonNull(exports.__Type),
        resolve: function resolve(schema) {
          return schema.getQueryType();
        }
      },
      mutationType: {
        description: 'If this server supports mutation, the type that mutation operations will be rooted at.',
        type: exports.__Type,
        resolve: function resolve(schema) {
          return schema.getMutationType();
        }
      },
      subscriptionType: {
        description: 'If this server support subscription, the type that subscription operations will be rooted at.',
        type: exports.__Type,
        resolve: function resolve(schema) {
          return schema.getSubscriptionType();
        }
      },
      directives: {
        description: 'A list of all directives supported by this server.',
        type: definition_mjs_1.GraphQLNonNull(definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__Directive))),
        resolve: function resolve(schema) {
          return schema.getDirectives();
        }
      }
    };
  }
});
exports.__Directive = new definition_mjs_1.GraphQLObjectType({
  name: '__Directive',
  description: "A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\nIn some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.",
  fields: function fields() {
    return {
      name: {
        type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLString),
        resolve: function resolve(directive) {
          return directive.name;
        }
      },
      description: {
        type: scalars_mjs_1.GraphQLString,
        resolve: function resolve(directive) {
          return directive.description;
        }
      },
      isRepeatable: {
        type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLBoolean),
        resolve: function resolve(directive) {
          return directive.isRepeatable;
        }
      },
      locations: {
        type: definition_mjs_1.GraphQLNonNull(definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__DirectiveLocation))),
        resolve: function resolve(directive) {
          return directive.locations;
        }
      },
      args: {
        type: definition_mjs_1.GraphQLNonNull(definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__InputValue))),
        resolve: function resolve(directive) {
          return directive.args;
        }
      }
    };
  }
});
exports.__DirectiveLocation = new definition_mjs_1.GraphQLEnumType({
  name: '__DirectiveLocation',
  description: 'A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.',
  values: {
    QUERY: {
      value: directiveLocation_mjs_1.DirectiveLocation.QUERY,
      description: 'Location adjacent to a query operation.'
    },
    MUTATION: {
      value: directiveLocation_mjs_1.DirectiveLocation.MUTATION,
      description: 'Location adjacent to a mutation operation.'
    },
    SUBSCRIPTION: {
      value: directiveLocation_mjs_1.DirectiveLocation.SUBSCRIPTION,
      description: 'Location adjacent to a subscription operation.'
    },
    FIELD: {
      value: directiveLocation_mjs_1.DirectiveLocation.FIELD,
      description: 'Location adjacent to a field.'
    },
    FRAGMENT_DEFINITION: {
      value: directiveLocation_mjs_1.DirectiveLocation.FRAGMENT_DEFINITION,
      description: 'Location adjacent to a fragment definition.'
    },
    FRAGMENT_SPREAD: {
      value: directiveLocation_mjs_1.DirectiveLocation.FRAGMENT_SPREAD,
      description: 'Location adjacent to a fragment spread.'
    },
    INLINE_FRAGMENT: {
      value: directiveLocation_mjs_1.DirectiveLocation.INLINE_FRAGMENT,
      description: 'Location adjacent to an inline fragment.'
    },
    VARIABLE_DEFINITION: {
      value: directiveLocation_mjs_1.DirectiveLocation.VARIABLE_DEFINITION,
      description: 'Location adjacent to a variable definition.'
    },
    SCHEMA: {
      value: directiveLocation_mjs_1.DirectiveLocation.SCHEMA,
      description: 'Location adjacent to a schema definition.'
    },
    SCALAR: {
      value: directiveLocation_mjs_1.DirectiveLocation.SCALAR,
      description: 'Location adjacent to a scalar definition.'
    },
    OBJECT: {
      value: directiveLocation_mjs_1.DirectiveLocation.OBJECT,
      description: 'Location adjacent to an object type definition.'
    },
    FIELD_DEFINITION: {
      value: directiveLocation_mjs_1.DirectiveLocation.FIELD_DEFINITION,
      description: 'Location adjacent to a field definition.'
    },
    ARGUMENT_DEFINITION: {
      value: directiveLocation_mjs_1.DirectiveLocation.ARGUMENT_DEFINITION,
      description: 'Location adjacent to an argument definition.'
    },
    INTERFACE: {
      value: directiveLocation_mjs_1.DirectiveLocation.INTERFACE,
      description: 'Location adjacent to an interface definition.'
    },
    UNION: {
      value: directiveLocation_mjs_1.DirectiveLocation.UNION,
      description: 'Location adjacent to a union definition.'
    },
    ENUM: {
      value: directiveLocation_mjs_1.DirectiveLocation.ENUM,
      description: 'Location adjacent to an enum definition.'
    },
    ENUM_VALUE: {
      value: directiveLocation_mjs_1.DirectiveLocation.ENUM_VALUE,
      description: 'Location adjacent to an enum value definition.'
    },
    INPUT_OBJECT: {
      value: directiveLocation_mjs_1.DirectiveLocation.INPUT_OBJECT,
      description: 'Location adjacent to an input object type definition.'
    },
    INPUT_FIELD_DEFINITION: {
      value: directiveLocation_mjs_1.DirectiveLocation.INPUT_FIELD_DEFINITION,
      description: 'Location adjacent to an input object field definition.'
    }
  }
});
exports.__Type = new definition_mjs_1.GraphQLObjectType({
  name: '__Type',
  description: 'The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name and description, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.',
  fields: function fields() {
    return {
      kind: {
        type: definition_mjs_1.GraphQLNonNull(exports.__TypeKind),
        resolve: function resolve(type) {
          if (definition_mjs_1.isScalarType(type)) {
            return exports.TypeKind.SCALAR;
          }
          if (definition_mjs_1.isObjectType(type)) {
            return exports.TypeKind.OBJECT;
          }
          if (definition_mjs_1.isInterfaceType(type)) {
            return exports.TypeKind.INTERFACE;
          }
          if (definition_mjs_1.isUnionType(type)) {
            return exports.TypeKind.UNION;
          }
          if (definition_mjs_1.isEnumType(type)) {
            return exports.TypeKind.ENUM;
          }
          if (definition_mjs_1.isInputObjectType(type)) {
            return exports.TypeKind.INPUT_OBJECT;
          }
          if (definition_mjs_1.isListType(type)) {
            return exports.TypeKind.LIST;
          }
          if (definition_mjs_1.isNonNullType(type)) {
            return exports.TypeKind.NON_NULL;
          }
          invariant_mjs_1d.default(false, ("Unexpected type: \"").concat(inspect_mjs_1d.default(type), "\"."));
        }
      },
      name: {
        type: scalars_mjs_1.GraphQLString,
        resolve: function resolve(type) {
          return type.name !== undefined ? type.name : undefined;
        }
      },
      description: {
        type: scalars_mjs_1.GraphQLString,
        resolve: function resolve(type) {
          return type.description !== undefined ? type.description : undefined;
        }
      },
      fields: {
        type: definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__Field)),
        args: {
          includeDeprecated: {
            type: scalars_mjs_1.GraphQLBoolean,
            defaultValue: false
          }
        },
        resolve: function resolve(type, _ref) {
          var includeDeprecated = _ref.includeDeprecated;
          if (definition_mjs_1.isObjectType(type) || definition_mjs_1.isInterfaceType(type)) {
            var fields = objectValues_mjs_1d.default(type.getFields());
            if (!includeDeprecated) {
              fields = fields.filter(function (field) {
                return !field.isDeprecated;
              });
            }
            return fields;
          }
          return null;
        }
      },
      interfaces: {
        type: definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__Type)),
        resolve: function resolve(type) {
          if (definition_mjs_1.isObjectType(type) || definition_mjs_1.isInterfaceType(type)) {
            return type.getInterfaces();
          }
        }
      },
      possibleTypes: {
        type: definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__Type)),
        resolve: function resolve(type, _args, _context, _ref2) {
          var schema = _ref2.schema;
          if (definition_mjs_1.isAbstractType(type)) {
            return schema.getPossibleTypes(type);
          }
        }
      },
      enumValues: {
        type: definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__EnumValue)),
        args: {
          includeDeprecated: {
            type: scalars_mjs_1.GraphQLBoolean,
            defaultValue: false
          }
        },
        resolve: function resolve(type, _ref3) {
          var includeDeprecated = _ref3.includeDeprecated;
          if (definition_mjs_1.isEnumType(type)) {
            var values = type.getValues();
            if (!includeDeprecated) {
              values = values.filter(function (value) {
                return !value.isDeprecated;
              });
            }
            return values;
          }
        }
      },
      inputFields: {
        type: definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__InputValue)),
        resolve: function resolve(type) {
          if (definition_mjs_1.isInputObjectType(type)) {
            return objectValues_mjs_1d.default(type.getFields());
          }
        }
      },
      ofType: {
        type: exports.__Type,
        resolve: function resolve(type) {
          return type.ofType !== undefined ? type.ofType : undefined;
        }
      }
    };
  }
});
exports.__Field = new definition_mjs_1.GraphQLObjectType({
  name: '__Field',
  description: 'Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.',
  fields: function fields() {
    return {
      name: {
        type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLString),
        resolve: function resolve(field) {
          return field.name;
        }
      },
      description: {
        type: scalars_mjs_1.GraphQLString,
        resolve: function resolve(field) {
          return field.description;
        }
      },
      args: {
        type: definition_mjs_1.GraphQLNonNull(definition_mjs_1.GraphQLList(definition_mjs_1.GraphQLNonNull(exports.__InputValue))),
        resolve: function resolve(field) {
          return field.args;
        }
      },
      type: {
        type: definition_mjs_1.GraphQLNonNull(exports.__Type),
        resolve: function resolve(field) {
          return field.type;
        }
      },
      isDeprecated: {
        type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLBoolean),
        resolve: function resolve(field) {
          return field.isDeprecated;
        }
      },
      deprecationReason: {
        type: scalars_mjs_1.GraphQLString,
        resolve: function resolve(field) {
          return field.deprecationReason;
        }
      }
    };
  }
});
exports.__InputValue = new definition_mjs_1.GraphQLObjectType({
  name: '__InputValue',
  description: 'Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.',
  fields: function fields() {
    return {
      name: {
        type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLString),
        resolve: function resolve(inputValue) {
          return inputValue.name;
        }
      },
      description: {
        type: scalars_mjs_1.GraphQLString,
        resolve: function resolve(inputValue) {
          return inputValue.description;
        }
      },
      type: {
        type: definition_mjs_1.GraphQLNonNull(exports.__Type),
        resolve: function resolve(inputValue) {
          return inputValue.type;
        }
      },
      defaultValue: {
        type: scalars_mjs_1.GraphQLString,
        description: 'A GraphQL-formatted string representing the default value for this input value.',
        resolve: function resolve(inputValue) {
          var type = inputValue.type, defaultValue = inputValue.defaultValue;
          var valueAST = astFromValue_mjs_1.astFromValue(defaultValue, type);
          return valueAST ? printer_mjs_1.print(valueAST) : null;
        }
      }
    };
  }
});
exports.__EnumValue = new definition_mjs_1.GraphQLObjectType({
  name: '__EnumValue',
  description: 'One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.',
  fields: function fields() {
    return {
      name: {
        type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLString),
        resolve: function resolve(enumValue) {
          return enumValue.name;
        }
      },
      description: {
        type: scalars_mjs_1.GraphQLString,
        resolve: function resolve(enumValue) {
          return enumValue.description;
        }
      },
      isDeprecated: {
        type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLBoolean),
        resolve: function resolve(enumValue) {
          return enumValue.isDeprecated;
        }
      },
      deprecationReason: {
        type: scalars_mjs_1.GraphQLString,
        resolve: function resolve(enumValue) {
          return enumValue.deprecationReason;
        }
      }
    };
  }
});
exports.TypeKind = Object.freeze({
  SCALAR: 'SCALAR',
  OBJECT: 'OBJECT',
  INTERFACE: 'INTERFACE',
  UNION: 'UNION',
  ENUM: 'ENUM',
  INPUT_OBJECT: 'INPUT_OBJECT',
  LIST: 'LIST',
  NON_NULL: 'NON_NULL'
});
exports.__TypeKind = new definition_mjs_1.GraphQLEnumType({
  name: '__TypeKind',
  description: 'An enum describing what kind of type a given `__Type` is.',
  values: {
    SCALAR: {
      value: exports.TypeKind.SCALAR,
      description: 'Indicates this type is a scalar.'
    },
    OBJECT: {
      value: exports.TypeKind.OBJECT,
      description: 'Indicates this type is an object. `fields` and `interfaces` are valid fields.'
    },
    INTERFACE: {
      value: exports.TypeKind.INTERFACE,
      description: 'Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields.'
    },
    UNION: {
      value: exports.TypeKind.UNION,
      description: 'Indicates this type is a union. `possibleTypes` is a valid field.'
    },
    ENUM: {
      value: exports.TypeKind.ENUM,
      description: 'Indicates this type is an enum. `enumValues` is a valid field.'
    },
    INPUT_OBJECT: {
      value: exports.TypeKind.INPUT_OBJECT,
      description: 'Indicates this type is an input object. `inputFields` is a valid field.'
    },
    LIST: {
      value: exports.TypeKind.LIST,
      description: 'Indicates this type is a list. `ofType` is a valid field.'
    },
    NON_NULL: {
      value: exports.TypeKind.NON_NULL,
      description: 'Indicates this type is a non-null. `ofType` is a valid field.'
    }
  }
});
exports.SchemaMetaFieldDef = {
  name: '__schema',
  type: definition_mjs_1.GraphQLNonNull(exports.__Schema),
  description: 'Access the current type schema of this server.',
  args: [],
  resolve: function resolve(_source, _args, _context, _ref4) {
    var schema = _ref4.schema;
    return schema;
  },
  isDeprecated: false,
  deprecationReason: undefined,
  extensions: undefined,
  astNode: undefined
};
exports.TypeMetaFieldDef = {
  name: '__type',
  type: exports.__Type,
  description: 'Request the type information of a single type.',
  args: [{
    name: 'name',
    description: undefined,
    type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLString),
    defaultValue: undefined,
    extensions: undefined,
    astNode: undefined
  }],
  resolve: function resolve(_source, _ref5, _context, _ref6) {
    var name = _ref5.name;
    var schema = _ref6.schema;
    return schema.getType(name);
  },
  isDeprecated: false,
  deprecationReason: undefined,
  extensions: undefined,
  astNode: undefined
};
exports.TypeNameMetaFieldDef = {
  name: '__typename',
  type: definition_mjs_1.GraphQLNonNull(scalars_mjs_1.GraphQLString),
  description: 'The name of the current Object type at runtime.',
  args: [],
  resolve: function resolve(_source, _args, _context, _ref7) {
    var parentType = _ref7.parentType;
    return parentType.name;
  },
  isDeprecated: false,
  deprecationReason: undefined,
  extensions: undefined,
  astNode: undefined
};
exports.introspectionTypes = Object.freeze([exports.__Schema, exports.__Directive, exports.__DirectiveLocation, exports.__Type, exports.__Field, exports.__InputValue, exports.__EnumValue, exports.__TypeKind]);
function isIntrospectionType(type) {
  return exports.introspectionTypes.some(function (_ref8) {
    var name = _ref8.name;
    return type.name === name;
  });
}
exports.isIntrospectionType = isIntrospectionType;

},

// node_modules/graphql/language/source.mjs @88
88: function(__fusereq, exports, module){
exports.__esModule = true;
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if (("value" in descriptor)) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
var symbols_mjs_1 = __fusereq(175);
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
exports.Source = (function () {
  function Source(body) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GraphQL request';
    var locationOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      line: 1,
      column: 1
    };
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    this.locationOffset.line > 0 || devAssert_mjs_1d.default(0, 'line in locationOffset is 1-indexed and must be positive.');
    this.locationOffset.column > 0 || devAssert_mjs_1d.default(0, 'column in locationOffset is 1-indexed and must be positive.');
  }
  _createClass(Source, [{
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'Source';
    }
  }]);
  return Source;
})();

},

// node_modules/graphql/language/location.mjs @89
89: function(__fusereq, exports, module){
function getLocation(source, position) {
  var lineRegexp = /\r\n|[\n\r]/g;
  var line = 1;
  var column = position + 1;
  var match;
  while ((match = lineRegexp.exec(source.body)) && match.index < position) {
    line += 1;
    column = position + 1 - (match.index + match[0].length);
  }
  return {
    line: line,
    column: column
  };
}
exports.getLocation = getLocation;

},

// node_modules/graphql/language/printLocation.mjs @90
90: function(__fusereq, exports, module){
exports.__esModule = true;
var location_mjs_1 = __fusereq(89);
function printLocation(location) {
  return printSourceLocation(location.source, location_mjs_1.getLocation(location.source, location.start));
}
exports.printLocation = printLocation;
function printSourceLocation(source, sourceLocation) {
  var firstLineColumnOffset = source.locationOffset.column - 1;
  var body = whitespace(firstLineColumnOffset) + source.body;
  var lineIndex = sourceLocation.line - 1;
  var lineOffset = source.locationOffset.line - 1;
  var lineNum = sourceLocation.line + lineOffset;
  var columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  var columnNum = sourceLocation.column + columnOffset;
  var locationStr = ("").concat(source.name, ":").concat(lineNum, ":").concat(columnNum, "\n");
  var lines = body.split(/\r\n|[\n\r]/g);
  var locationLine = lines[lineIndex];
  if (locationLine.length > 120) {
    var subLineIndex = Math.floor(columnNum / 80);
    var subLineColumnNum = columnNum % 80;
    var subLines = [];
    for (var i = 0; i < locationLine.length; i += 80) {
      subLines.push(locationLine.slice(i, i + 80));
    }
    return locationStr + printPrefixedLines([[("").concat(lineNum), subLines[0]]].concat(subLines.slice(1, subLineIndex + 1).map(function (subLine) {
      return ['', subLine];
    }), [[' ', whitespace(subLineColumnNum - 1) + '^'], ['', subLines[subLineIndex + 1]]]));
  }
  return locationStr + printPrefixedLines([[("").concat(lineNum - 1), lines[lineIndex - 1]], [("").concat(lineNum), locationLine], ['', whitespace(columnNum - 1) + '^'], [("").concat(lineNum + 1), lines[lineIndex + 1]]]);
}
exports.printSourceLocation = printSourceLocation;
function printPrefixedLines(lines) {
  var existingLines = lines.filter(function (_ref) {
    var _ = _ref[0], line = _ref[1];
    return line !== undefined;
  });
  var padLen = Math.max.apply(Math, existingLines.map(function (_ref2) {
    var prefix = _ref2[0];
    return prefix.length;
  }));
  return existingLines.map(function (_ref3) {
    var prefix = _ref3[0], line = _ref3[1];
    return leftPad(padLen, prefix) + (line ? ' | ' + line : ' |');
  }).join('\n');
}
function whitespace(len) {
  return Array(len + 1).join(' ');
}
function leftPad(len, str) {
  return whitespace(len - str.length) + str;
}

},

// node_modules/graphql/language/kinds.mjs @91
91: function(__fusereq, exports, module){
exports.__esModule = true;
exports.Kind = Object.freeze({
  NAME: 'Name',
  DOCUMENT: 'Document',
  OPERATION_DEFINITION: 'OperationDefinition',
  VARIABLE_DEFINITION: 'VariableDefinition',
  SELECTION_SET: 'SelectionSet',
  FIELD: 'Field',
  ARGUMENT: 'Argument',
  FRAGMENT_SPREAD: 'FragmentSpread',
  INLINE_FRAGMENT: 'InlineFragment',
  FRAGMENT_DEFINITION: 'FragmentDefinition',
  VARIABLE: 'Variable',
  INT: 'IntValue',
  FLOAT: 'FloatValue',
  STRING: 'StringValue',
  BOOLEAN: 'BooleanValue',
  NULL: 'NullValue',
  ENUM: 'EnumValue',
  LIST: 'ListValue',
  OBJECT: 'ObjectValue',
  OBJECT_FIELD: 'ObjectField',
  DIRECTIVE: 'Directive',
  NAMED_TYPE: 'NamedType',
  LIST_TYPE: 'ListType',
  NON_NULL_TYPE: 'NonNullType',
  SCHEMA_DEFINITION: 'SchemaDefinition',
  OPERATION_TYPE_DEFINITION: 'OperationTypeDefinition',
  SCALAR_TYPE_DEFINITION: 'ScalarTypeDefinition',
  OBJECT_TYPE_DEFINITION: 'ObjectTypeDefinition',
  FIELD_DEFINITION: 'FieldDefinition',
  INPUT_VALUE_DEFINITION: 'InputValueDefinition',
  INTERFACE_TYPE_DEFINITION: 'InterfaceTypeDefinition',
  UNION_TYPE_DEFINITION: 'UnionTypeDefinition',
  ENUM_TYPE_DEFINITION: 'EnumTypeDefinition',
  ENUM_VALUE_DEFINITION: 'EnumValueDefinition',
  INPUT_OBJECT_TYPE_DEFINITION: 'InputObjectTypeDefinition',
  DIRECTIVE_DEFINITION: 'DirectiveDefinition',
  SCHEMA_EXTENSION: 'SchemaExtension',
  SCALAR_TYPE_EXTENSION: 'ScalarTypeExtension',
  OBJECT_TYPE_EXTENSION: 'ObjectTypeExtension',
  INTERFACE_TYPE_EXTENSION: 'InterfaceTypeExtension',
  UNION_TYPE_EXTENSION: 'UnionTypeExtension',
  ENUM_TYPE_EXTENSION: 'EnumTypeExtension',
  INPUT_OBJECT_TYPE_EXTENSION: 'InputObjectTypeExtension'
});

},

// node_modules/graphql/language/tokenKind.mjs @92
92: function(__fusereq, exports, module){
exports.__esModule = true;
exports.TokenKind = Object.freeze({
  SOF: '<SOF>',
  EOF: '<EOF>',
  BANG: '!',
  DOLLAR: '$',
  AMP: '&',
  PAREN_L: '(',
  PAREN_R: ')',
  SPREAD: '...',
  COLON: ':',
  EQUALS: '=',
  AT: '@',
  BRACKET_L: '[',
  BRACKET_R: ']',
  BRACE_L: '{',
  PIPE: '|',
  BRACE_R: '}',
  NAME: 'Name',
  INT: 'Int',
  FLOAT: 'Float',
  STRING: 'String',
  BLOCK_STRING: 'BlockString',
  COMMENT: 'Comment'
});

},

// node_modules/graphql/language/lexer.mjs @93
93: function(__fusereq, exports, module){
exports.__esModule = true;
var syntaxError_mjs_1 = __fusereq(137);
var ast_mjs_1 = __fusereq(164);
var blockString_mjs_1 = __fusereq(188);
var tokenKind_mjs_1 = __fusereq(92);
exports.Lexer = (function () {
  function Lexer(source) {
    var startOfFileToken = new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.SOF, 0, 0, 0, 0, null);
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }
  var _proto = Lexer.prototype;
  _proto.advance = function advance() {
    this.lastToken = this.token;
    var token = this.token = this.lookahead();
    return token;
  };
  _proto.lookahead = function lookahead() {
    var token = this.token;
    if (token.kind !== tokenKind_mjs_1.TokenKind.EOF) {
      do {
        var _token$next;
        token = (_token$next = token.next) !== null && _token$next !== void 0 ? _token$next : token.next = readToken(this, token);
      } while (token.kind === tokenKind_mjs_1.TokenKind.COMMENT);
    }
    return token;
  };
  return Lexer;
})();
function isPunctuatorTokenKind(kind) {
  return kind === tokenKind_mjs_1.TokenKind.BANG || kind === tokenKind_mjs_1.TokenKind.DOLLAR || kind === tokenKind_mjs_1.TokenKind.AMP || kind === tokenKind_mjs_1.TokenKind.PAREN_L || kind === tokenKind_mjs_1.TokenKind.PAREN_R || kind === tokenKind_mjs_1.TokenKind.SPREAD || kind === tokenKind_mjs_1.TokenKind.COLON || kind === tokenKind_mjs_1.TokenKind.EQUALS || kind === tokenKind_mjs_1.TokenKind.AT || kind === tokenKind_mjs_1.TokenKind.BRACKET_L || kind === tokenKind_mjs_1.TokenKind.BRACKET_R || kind === tokenKind_mjs_1.TokenKind.BRACE_L || kind === tokenKind_mjs_1.TokenKind.PIPE || kind === tokenKind_mjs_1.TokenKind.BRACE_R;
}
exports.isPunctuatorTokenKind = isPunctuatorTokenKind;
function printCharCode(code) {
  return isNaN(code) ? tokenKind_mjs_1.TokenKind.EOF : code < 0x007f ? JSON.stringify(String.fromCharCode(code)) : ("\"\\u").concat(('00' + code.toString(16).toUpperCase()).slice(-4), "\"");
}
function readToken(lexer, prev) {
  var source = lexer.source;
  var body = source.body;
  var bodyLength = body.length;
  var pos = positionAfterWhitespace(body, prev.end, lexer);
  var line = lexer.line;
  var col = 1 + pos - lexer.lineStart;
  if (pos >= bodyLength) {
    return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.EOF, bodyLength, bodyLength, line, col, prev);
  }
  var code = body.charCodeAt(pos);
  switch (code) {
    case 33:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.BANG, pos, pos + 1, line, col, prev);
    case 35:
      return readComment(source, pos, line, col, prev);
    case 36:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.DOLLAR, pos, pos + 1, line, col, prev);
    case 38:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.AMP, pos, pos + 1, line, col, prev);
    case 40:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.PAREN_L, pos, pos + 1, line, col, prev);
    case 41:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.PAREN_R, pos, pos + 1, line, col, prev);
    case 46:
      if (body.charCodeAt(pos + 1) === 46 && body.charCodeAt(pos + 2) === 46) {
        return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.SPREAD, pos, pos + 3, line, col, prev);
      }
      break;
    case 58:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.COLON, pos, pos + 1, line, col, prev);
    case 61:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.EQUALS, pos, pos + 1, line, col, prev);
    case 64:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.AT, pos, pos + 1, line, col, prev);
    case 91:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.BRACKET_L, pos, pos + 1, line, col, prev);
    case 93:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.BRACKET_R, pos, pos + 1, line, col, prev);
    case 123:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.BRACE_L, pos, pos + 1, line, col, prev);
    case 124:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.PIPE, pos, pos + 1, line, col, prev);
    case 125:
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.BRACE_R, pos, pos + 1, line, col, prev);
    case 65:
    case 66:
    case 67:
    case 68:
    case 69:
    case 70:
    case 71:
    case 72:
    case 73:
    case 74:
    case 75:
    case 76:
    case 77:
    case 78:
    case 79:
    case 80:
    case 81:
    case 82:
    case 83:
    case 84:
    case 85:
    case 86:
    case 87:
    case 88:
    case 89:
    case 90:
    case 95:
    case 97:
    case 98:
    case 99:
    case 100:
    case 101:
    case 102:
    case 103:
    case 104:
    case 105:
    case 106:
    case 107:
    case 108:
    case 109:
    case 110:
    case 111:
    case 112:
    case 113:
    case 114:
    case 115:
    case 116:
    case 117:
    case 118:
    case 119:
    case 120:
    case 121:
    case 122:
      return readName(source, pos, line, col, prev);
    case 45:
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return readNumber(source, pos, code, line, col, prev);
    case 34:
      if (body.charCodeAt(pos + 1) === 34 && body.charCodeAt(pos + 2) === 34) {
        return readBlockString(source, pos, line, col, prev, lexer);
      }
      return readString(source, pos, line, col, prev);
  }
  throw syntaxError_mjs_1.syntaxError(source, pos, unexpectedCharacterMessage(code));
}
function unexpectedCharacterMessage(code) {
  if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
    return ("Cannot contain the invalid character ").concat(printCharCode(code), ".");
  }
  if (code === 39) {
    return 'Unexpected single quote character (\'), did you mean to use a double quote (")?';
  }
  return ("Cannot parse the unexpected character ").concat(printCharCode(code), ".");
}
function positionAfterWhitespace(body, startPosition, lexer) {
  var bodyLength = body.length;
  var position = startPosition;
  while (position < bodyLength) {
    var code = body.charCodeAt(position);
    if (code === 9 || code === 32 || code === 44 || code === 0xfeff) {
      ++position;
    } else if (code === 10) {
      ++position;
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 13) {
      if (body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }
      ++lexer.line;
      lexer.lineStart = position;
    } else {
      break;
    }
  }
  return position;
}
function readComment(source, start, line, col, prev) {
  var body = source.body;
  var code;
  var position = start;
  do {
    code = body.charCodeAt(++position);
  } while (!isNaN(code) && (code > 0x001f || code === 0x0009));
  return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.COMMENT, start, position, line, col, prev, body.slice(start + 1, position));
}
function readNumber(source, start, firstCode, line, col, prev) {
  var body = source.body;
  var code = firstCode;
  var position = start;
  var isFloat = false;
  if (code === 45) {
    code = body.charCodeAt(++position);
  }
  if (code === 48) {
    code = body.charCodeAt(++position);
    if (code >= 48 && code <= 57) {
      throw syntaxError_mjs_1.syntaxError(source, position, ("Invalid number, unexpected digit after 0: ").concat(printCharCode(code), "."));
    }
  } else {
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46) {
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 69 || code === 101) {
    isFloat = true;
    code = body.charCodeAt(++position);
    if (code === 43 || code === 45) {
      code = body.charCodeAt(++position);
    }
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46 || isNameStart(code)) {
    throw syntaxError_mjs_1.syntaxError(source, position, ("Invalid number, expected digit but got: ").concat(printCharCode(code), "."));
  }
  return new ast_mjs_1.Token(isFloat ? tokenKind_mjs_1.TokenKind.FLOAT : tokenKind_mjs_1.TokenKind.INT, start, position, line, col, prev, body.slice(start, position));
}
function readDigits(source, start, firstCode) {
  var body = source.body;
  var position = start;
  var code = firstCode;
  if (code >= 48 && code <= 57) {
    do {
      code = body.charCodeAt(++position);
    } while (code >= 48 && code <= 57);
    return position;
  }
  throw syntaxError_mjs_1.syntaxError(source, position, ("Invalid number, expected digit but got: ").concat(printCharCode(code), "."));
}
function readString(source, start, line, col, prev) {
  var body = source.body;
  var position = start + 1;
  var chunkStart = position;
  var code = 0;
  var value = '';
  while (position < body.length && !isNaN(code = body.charCodeAt(position)) && code !== 0x000a && code !== 0x000d) {
    if (code === 34) {
      value += body.slice(chunkStart, position);
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.STRING, start, position + 1, line, col, prev, value);
    }
    if (code < 0x0020 && code !== 0x0009) {
      throw syntaxError_mjs_1.syntaxError(source, position, ("Invalid character within String: ").concat(printCharCode(code), "."));
    }
    ++position;
    if (code === 92) {
      value += body.slice(chunkStart, position - 1);
      code = body.charCodeAt(position);
      switch (code) {
        case 34:
          value += '"';
          break;
        case 47:
          value += '/';
          break;
        case 92:
          value += '\\';
          break;
        case 98:
          value += '\b';
          break;
        case 102:
          value += '\f';
          break;
        case 110:
          value += '\n';
          break;
        case 114:
          value += '\r';
          break;
        case 116:
          value += '\t';
          break;
        case 117:
          {
            var charCode = uniCharCode(body.charCodeAt(position + 1), body.charCodeAt(position + 2), body.charCodeAt(position + 3), body.charCodeAt(position + 4));
            if (charCode < 0) {
              var invalidSequence = body.slice(position + 1, position + 5);
              throw syntaxError_mjs_1.syntaxError(source, position, ("Invalid character escape sequence: \\u").concat(invalidSequence, "."));
            }
            value += String.fromCharCode(charCode);
            position += 4;
            break;
          }
        default:
          throw syntaxError_mjs_1.syntaxError(source, position, ("Invalid character escape sequence: \\").concat(String.fromCharCode(code), "."));
      }
      ++position;
      chunkStart = position;
    }
  }
  throw syntaxError_mjs_1.syntaxError(source, position, 'Unterminated string.');
}
function readBlockString(source, start, line, col, prev, lexer) {
  var body = source.body;
  var position = start + 3;
  var chunkStart = position;
  var code = 0;
  var rawValue = '';
  while (position < body.length && !isNaN(code = body.charCodeAt(position))) {
    if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
      rawValue += body.slice(chunkStart, position);
      return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.BLOCK_STRING, start, position + 3, line, col, prev, blockString_mjs_1.dedentBlockStringValue(rawValue));
    }
    if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
      throw syntaxError_mjs_1.syntaxError(source, position, ("Invalid character within String: ").concat(printCharCode(code), "."));
    }
    if (code === 10) {
      ++position;
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 13) {
      if (body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
      rawValue += body.slice(chunkStart, position) + '"""';
      position += 4;
      chunkStart = position;
    } else {
      ++position;
    }
  }
  throw syntaxError_mjs_1.syntaxError(source, position, 'Unterminated string.');
}
function uniCharCode(a, b, c, d) {
  return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
}
function char2hex(a) {
  return a >= 48 && a <= 57 ? a - 48 : a >= 65 && a <= 70 ? a - 55 : a >= 97 && a <= 102 ? a - 87 : -1;
}
function readName(source, start, line, col, prev) {
  var body = source.body;
  var bodyLength = body.length;
  var position = start + 1;
  var code = 0;
  while (position !== bodyLength && !isNaN(code = body.charCodeAt(position)) && (code === 95 || code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122)) {
    ++position;
  }
  return new ast_mjs_1.Token(tokenKind_mjs_1.TokenKind.NAME, start, position, line, col, prev, body.slice(start, position));
}
function isNameStart(code) {
  return code === 95 || code >= 65 && code <= 90 || code >= 97 && code <= 122;
}

},

// node_modules/graphql/language/printer.mjs @94
94: function(__fusereq, exports, module){
exports.__esModule = true;
var visitor_mjs_1 = __fusereq(95);
var blockString_mjs_1 = __fusereq(188);
function print(ast) {
  return visitor_mjs_1.visit(ast, {
    leave: printDocASTReducer
  });
}
exports.print = print;
var printDocASTReducer = {
  Name: function Name(node) {
    return node.value;
  },
  Variable: function Variable(node) {
    return '$' + node.name;
  },
  Document: function Document(node) {
    return join(node.definitions, '\n\n') + '\n';
  },
  OperationDefinition: function OperationDefinition(node) {
    var op = node.operation;
    var name = node.name;
    var varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
    var directives = join(node.directives, ' ');
    var selectionSet = node.selectionSet;
    return !name && !directives && !varDefs && op === 'query' ? selectionSet : join([op, join([name, varDefs]), directives, selectionSet], ' ');
  },
  VariableDefinition: function VariableDefinition(_ref) {
    var variable = _ref.variable, type = _ref.type, defaultValue = _ref.defaultValue, directives = _ref.directives;
    return variable + ': ' + type + wrap(' = ', defaultValue) + wrap(' ', join(directives, ' '));
  },
  SelectionSet: function SelectionSet(_ref2) {
    var selections = _ref2.selections;
    return block(selections);
  },
  Field: function Field(_ref3) {
    var alias = _ref3.alias, name = _ref3.name, args = _ref3.arguments, directives = _ref3.directives, selectionSet = _ref3.selectionSet;
    return join([wrap('', alias, ': ') + name + wrap('(', join(args, ', '), ')'), join(directives, ' '), selectionSet], ' ');
  },
  Argument: function Argument(_ref4) {
    var name = _ref4.name, value = _ref4.value;
    return name + ': ' + value;
  },
  FragmentSpread: function FragmentSpread(_ref5) {
    var name = _ref5.name, directives = _ref5.directives;
    return '...' + name + wrap(' ', join(directives, ' '));
  },
  InlineFragment: function InlineFragment(_ref6) {
    var typeCondition = _ref6.typeCondition, directives = _ref6.directives, selectionSet = _ref6.selectionSet;
    return join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' ');
  },
  FragmentDefinition: function FragmentDefinition(_ref7) {
    var name = _ref7.name, typeCondition = _ref7.typeCondition, variableDefinitions = _ref7.variableDefinitions, directives = _ref7.directives, selectionSet = _ref7.selectionSet;
    return ("fragment ").concat(name).concat(wrap('(', join(variableDefinitions, ', '), ')'), " ") + ("on ").concat(typeCondition, " ").concat(wrap('', join(directives, ' '), ' ')) + selectionSet;
  },
  IntValue: function IntValue(_ref8) {
    var value = _ref8.value;
    return value;
  },
  FloatValue: function FloatValue(_ref9) {
    var value = _ref9.value;
    return value;
  },
  StringValue: function StringValue(_ref10, key) {
    var value = _ref10.value, isBlockString = _ref10.block;
    return isBlockString ? blockString_mjs_1.printBlockString(value, key === 'description' ? '' : '  ') : JSON.stringify(value);
  },
  BooleanValue: function BooleanValue(_ref11) {
    var value = _ref11.value;
    return value ? 'true' : 'false';
  },
  NullValue: function NullValue() {
    return 'null';
  },
  EnumValue: function EnumValue(_ref12) {
    var value = _ref12.value;
    return value;
  },
  ListValue: function ListValue(_ref13) {
    var values = _ref13.values;
    return '[' + join(values, ', ') + ']';
  },
  ObjectValue: function ObjectValue(_ref14) {
    var fields = _ref14.fields;
    return '{' + join(fields, ', ') + '}';
  },
  ObjectField: function ObjectField(_ref15) {
    var name = _ref15.name, value = _ref15.value;
    return name + ': ' + value;
  },
  Directive: function Directive(_ref16) {
    var name = _ref16.name, args = _ref16.arguments;
    return '@' + name + wrap('(', join(args, ', '), ')');
  },
  NamedType: function NamedType(_ref17) {
    var name = _ref17.name;
    return name;
  },
  ListType: function ListType(_ref18) {
    var type = _ref18.type;
    return '[' + type + ']';
  },
  NonNullType: function NonNullType(_ref19) {
    var type = _ref19.type;
    return type + '!';
  },
  SchemaDefinition: addDescription(function (_ref20) {
    var directives = _ref20.directives, operationTypes = _ref20.operationTypes;
    return join(['schema', join(directives, ' '), block(operationTypes)], ' ');
  }),
  OperationTypeDefinition: function OperationTypeDefinition(_ref21) {
    var operation = _ref21.operation, type = _ref21.type;
    return operation + ': ' + type;
  },
  ScalarTypeDefinition: addDescription(function (_ref22) {
    var name = _ref22.name, directives = _ref22.directives;
    return join(['scalar', name, join(directives, ' ')], ' ');
  }),
  ObjectTypeDefinition: addDescription(function (_ref23) {
    var name = _ref23.name, interfaces = _ref23.interfaces, directives = _ref23.directives, fields = _ref23.fields;
    return join(['type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
  }),
  FieldDefinition: addDescription(function (_ref24) {
    var name = _ref24.name, args = _ref24.arguments, type = _ref24.type, directives = _ref24.directives;
    return name + (hasMultilineItems(args) ? wrap('(\n', indent(join(args, '\n')), '\n)') : wrap('(', join(args, ', '), ')')) + ': ' + type + wrap(' ', join(directives, ' '));
  }),
  InputValueDefinition: addDescription(function (_ref25) {
    var name = _ref25.name, type = _ref25.type, defaultValue = _ref25.defaultValue, directives = _ref25.directives;
    return join([name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')], ' ');
  }),
  InterfaceTypeDefinition: addDescription(function (_ref26) {
    var name = _ref26.name, interfaces = _ref26.interfaces, directives = _ref26.directives, fields = _ref26.fields;
    return join(['interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
  }),
  UnionTypeDefinition: addDescription(function (_ref27) {
    var name = _ref27.name, directives = _ref27.directives, types = _ref27.types;
    return join(['union', name, join(directives, ' '), types && types.length !== 0 ? '= ' + join(types, ' | ') : ''], ' ');
  }),
  EnumTypeDefinition: addDescription(function (_ref28) {
    var name = _ref28.name, directives = _ref28.directives, values = _ref28.values;
    return join(['enum', name, join(directives, ' '), block(values)], ' ');
  }),
  EnumValueDefinition: addDescription(function (_ref29) {
    var name = _ref29.name, directives = _ref29.directives;
    return join([name, join(directives, ' ')], ' ');
  }),
  InputObjectTypeDefinition: addDescription(function (_ref30) {
    var name = _ref30.name, directives = _ref30.directives, fields = _ref30.fields;
    return join(['input', name, join(directives, ' '), block(fields)], ' ');
  }),
  DirectiveDefinition: addDescription(function (_ref31) {
    var name = _ref31.name, args = _ref31.arguments, repeatable = _ref31.repeatable, locations = _ref31.locations;
    return 'directive @' + name + (hasMultilineItems(args) ? wrap('(\n', indent(join(args, '\n')), '\n)') : wrap('(', join(args, ', '), ')')) + (repeatable ? ' repeatable' : '') + ' on ' + join(locations, ' | ');
  }),
  SchemaExtension: function SchemaExtension(_ref32) {
    var directives = _ref32.directives, operationTypes = _ref32.operationTypes;
    return join(['extend schema', join(directives, ' '), block(operationTypes)], ' ');
  },
  ScalarTypeExtension: function ScalarTypeExtension(_ref33) {
    var name = _ref33.name, directives = _ref33.directives;
    return join(['extend scalar', name, join(directives, ' ')], ' ');
  },
  ObjectTypeExtension: function ObjectTypeExtension(_ref34) {
    var name = _ref34.name, interfaces = _ref34.interfaces, directives = _ref34.directives, fields = _ref34.fields;
    return join(['extend type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
  },
  InterfaceTypeExtension: function InterfaceTypeExtension(_ref35) {
    var name = _ref35.name, interfaces = _ref35.interfaces, directives = _ref35.directives, fields = _ref35.fields;
    return join(['extend interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
  },
  UnionTypeExtension: function UnionTypeExtension(_ref36) {
    var name = _ref36.name, directives = _ref36.directives, types = _ref36.types;
    return join(['extend union', name, join(directives, ' '), types && types.length !== 0 ? '= ' + join(types, ' | ') : ''], ' ');
  },
  EnumTypeExtension: function EnumTypeExtension(_ref37) {
    var name = _ref37.name, directives = _ref37.directives, values = _ref37.values;
    return join(['extend enum', name, join(directives, ' '), block(values)], ' ');
  },
  InputObjectTypeExtension: function InputObjectTypeExtension(_ref38) {
    var name = _ref38.name, directives = _ref38.directives, fields = _ref38.fields;
    return join(['extend input', name, join(directives, ' '), block(fields)], ' ');
  }
};
function addDescription(cb) {
  return function (node) {
    return join([node.description, cb(node)], '\n');
  };
}
function join(maybeArray) {
  var _maybeArray$filter$jo;
  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter(function (x) {
    return x;
  }).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : '';
}
function block(array) {
  return array && array.length !== 0 ? '{\n' + indent(join(array, '\n')) + '\n}' : '';
}
function wrap(start, maybeString) {
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return maybeString ? start + maybeString + end : '';
}
function indent(maybeString) {
  return maybeString && '  ' + maybeString.replace(/\n/g, '\n  ');
}
function isMultiline(string) {
  return string.indexOf('\n') !== -1;
}
function hasMultilineItems(maybeArray) {
  return maybeArray && maybeArray.some(isMultiline);
}

},

// node_modules/graphql/language/visitor.mjs @95
95: function(__fusereq, exports, module){
exports.__esModule = true;
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var ast_mjs_1 = __fusereq(164);
exports.QueryDocumentKeys = {
  Name: [],
  Document: ['definitions'],
  OperationDefinition: ['name', 'variableDefinitions', 'directives', 'selectionSet'],
  VariableDefinition: ['variable', 'type', 'defaultValue', 'directives'],
  Variable: ['name'],
  SelectionSet: ['selections'],
  Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
  Argument: ['name', 'value'],
  FragmentSpread: ['name', 'directives'],
  InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
  FragmentDefinition: ['name', 'variableDefinitions', 'typeCondition', 'directives', 'selectionSet'],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ['values'],
  ObjectValue: ['fields'],
  ObjectField: ['name', 'value'],
  Directive: ['name', 'arguments'],
  NamedType: ['name'],
  ListType: ['type'],
  NonNullType: ['type'],
  SchemaDefinition: ['description', 'directives', 'operationTypes'],
  OperationTypeDefinition: ['type'],
  ScalarTypeDefinition: ['description', 'name', 'directives'],
  ObjectTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
  FieldDefinition: ['description', 'name', 'arguments', 'type', 'directives'],
  InputValueDefinition: ['description', 'name', 'type', 'defaultValue', 'directives'],
  InterfaceTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
  UnionTypeDefinition: ['description', 'name', 'directives', 'types'],
  EnumTypeDefinition: ['description', 'name', 'directives', 'values'],
  EnumValueDefinition: ['description', 'name', 'directives'],
  InputObjectTypeDefinition: ['description', 'name', 'directives', 'fields'],
  DirectiveDefinition: ['description', 'name', 'arguments', 'locations'],
  SchemaExtension: ['directives', 'operationTypes'],
  ScalarTypeExtension: ['name', 'directives'],
  ObjectTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  InterfaceTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  UnionTypeExtension: ['name', 'directives', 'types'],
  EnumTypeExtension: ['name', 'directives', 'values'],
  InputObjectTypeExtension: ['name', 'directives', 'fields']
};
exports.BREAK = Object.freeze({});
function visit(root, visitor) {
  var visitorKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : exports.QueryDocumentKeys;
  var stack = undefined;
  var inArray = Array.isArray(root);
  var keys = [root];
  var index = -1;
  var edits = [];
  var node = undefined;
  var key = undefined;
  var parent = undefined;
  var path = [];
  var ancestors = [];
  var newRoot = root;
  do {
    index++;
    var isLeaving = index === keys.length;
    var isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray) {
          node = node.slice();
        } else {
          var clone = {};
          for (var _i2 = 0, _Object$keys2 = Object.keys(node); _i2 < _Object$keys2.length; _i2++) {
            var k = _Object$keys2[_i2];
            clone[k] = node[k];
          }
          node = clone;
        }
        var editOffset = 0;
        for (var ii = 0; ii < edits.length; ii++) {
          var editKey = edits[ii][0];
          var editValue = edits[ii][1];
          if (inArray) {
            editKey -= editOffset;
          }
          if (inArray && editValue === null) {
            node.splice(editKey, 1);
            editOffset++;
          } else {
            node[editKey] = editValue;
          }
        }
      }
      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? inArray ? index : keys[index] : undefined;
      node = parent ? parent[key] : newRoot;
      if (node === null || node === undefined) {
        continue;
      }
      if (parent) {
        path.push(key);
      }
    }
    var result = void 0;
    if (!Array.isArray(node)) {
      if (!ast_mjs_1.isNode(node)) {
        throw new Error(("Invalid AST Node: ").concat(inspect_mjs_1d.default(node), "."));
      }
      var visitFn = getVisitFn(visitor, node.kind, isLeaving);
      if (visitFn) {
        result = visitFn.call(visitor, node, key, parent, path, ancestors);
        if (result === exports.BREAK) {
          break;
        }
        if (result === false) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== undefined) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (ast_mjs_1.isNode(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
    }
    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }
    if (isLeaving) {
      path.pop();
    } else {
      var _visitorKeys$node$kin;
      stack = {
        inArray: inArray,
        index: index,
        keys: keys,
        edits: edits,
        prev: stack
      };
      inArray = Array.isArray(node);
      keys = inArray ? node : (_visitorKeys$node$kin = visitorKeys[node.kind]) !== null && _visitorKeys$node$kin !== void 0 ? _visitorKeys$node$kin : [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== undefined);
  if (edits.length !== 0) {
    newRoot = edits[edits.length - 1][1];
  }
  return newRoot;
}
exports.visit = visit;
function visitInParallel(visitors) {
  var skipping = new Array(visitors.length);
  return {
    enter: function enter(node) {
      for (var i = 0; i < visitors.length; i++) {
        if (skipping[i] == null) {
          var fn = getVisitFn(visitors[i], node.kind, false);
          if (fn) {
            var result = fn.apply(visitors[i], arguments);
            if (result === false) {
              skipping[i] = node;
            } else if (result === exports.BREAK) {
              skipping[i] = exports.BREAK;
            } else if (result !== undefined) {
              return result;
            }
          }
        }
      }
    },
    leave: function leave(node) {
      for (var i = 0; i < visitors.length; i++) {
        if (skipping[i] == null) {
          var fn = getVisitFn(visitors[i], node.kind, true);
          if (fn) {
            var result = fn.apply(visitors[i], arguments);
            if (result === exports.BREAK) {
              skipping[i] = exports.BREAK;
            } else if (result !== undefined && result !== false) {
              return result;
            }
          }
        } else if (skipping[i] === node) {
          skipping[i] = null;
        }
      }
    }
  };
}
exports.visitInParallel = visitInParallel;
function getVisitFn(visitor, kind, isLeaving) {
  var kindVisitor = visitor[kind];
  if (kindVisitor) {
    if (!isLeaving && typeof kindVisitor === 'function') {
      return kindVisitor;
    }
    var kindSpecificVisitor = isLeaving ? kindVisitor.leave : kindVisitor.enter;
    if (typeof kindSpecificVisitor === 'function') {
      return kindSpecificVisitor;
    }
  } else {
    var specificVisitor = isLeaving ? visitor.leave : visitor.enter;
    if (specificVisitor) {
      if (typeof specificVisitor === 'function') {
        return specificVisitor;
      }
      var specificKindVisitor = specificVisitor[kind];
      if (typeof specificKindVisitor === 'function') {
        return specificKindVisitor;
      }
    }
  }
}
exports.getVisitFn = getVisitFn;

},

// node_modules/graphql/language/predicates.mjs @96
96: function(__fusereq, exports, module){
exports.__esModule = true;
var kinds_mjs_1 = __fusereq(91);
function isDefinitionNode(node) {
  return isExecutableDefinitionNode(node) || isTypeSystemDefinitionNode(node) || isTypeSystemExtensionNode(node);
}
exports.isDefinitionNode = isDefinitionNode;
function isExecutableDefinitionNode(node) {
  return node.kind === kinds_mjs_1.Kind.OPERATION_DEFINITION || node.kind === kinds_mjs_1.Kind.FRAGMENT_DEFINITION;
}
exports.isExecutableDefinitionNode = isExecutableDefinitionNode;
function isSelectionNode(node) {
  return node.kind === kinds_mjs_1.Kind.FIELD || node.kind === kinds_mjs_1.Kind.FRAGMENT_SPREAD || node.kind === kinds_mjs_1.Kind.INLINE_FRAGMENT;
}
exports.isSelectionNode = isSelectionNode;
function isValueNode(node) {
  return node.kind === kinds_mjs_1.Kind.VARIABLE || node.kind === kinds_mjs_1.Kind.INT || node.kind === kinds_mjs_1.Kind.FLOAT || node.kind === kinds_mjs_1.Kind.STRING || node.kind === kinds_mjs_1.Kind.BOOLEAN || node.kind === kinds_mjs_1.Kind.NULL || node.kind === kinds_mjs_1.Kind.ENUM || node.kind === kinds_mjs_1.Kind.LIST || node.kind === kinds_mjs_1.Kind.OBJECT;
}
exports.isValueNode = isValueNode;
function isTypeNode(node) {
  return node.kind === kinds_mjs_1.Kind.NAMED_TYPE || node.kind === kinds_mjs_1.Kind.LIST_TYPE || node.kind === kinds_mjs_1.Kind.NON_NULL_TYPE;
}
exports.isTypeNode = isTypeNode;
function isTypeSystemDefinitionNode(node) {
  return node.kind === kinds_mjs_1.Kind.SCHEMA_DEFINITION || isTypeDefinitionNode(node) || node.kind === kinds_mjs_1.Kind.DIRECTIVE_DEFINITION;
}
exports.isTypeSystemDefinitionNode = isTypeSystemDefinitionNode;
function isTypeDefinitionNode(node) {
  return node.kind === kinds_mjs_1.Kind.SCALAR_TYPE_DEFINITION || node.kind === kinds_mjs_1.Kind.OBJECT_TYPE_DEFINITION || node.kind === kinds_mjs_1.Kind.INTERFACE_TYPE_DEFINITION || node.kind === kinds_mjs_1.Kind.UNION_TYPE_DEFINITION || node.kind === kinds_mjs_1.Kind.ENUM_TYPE_DEFINITION || node.kind === kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_DEFINITION;
}
exports.isTypeDefinitionNode = isTypeDefinitionNode;
function isTypeSystemExtensionNode(node) {
  return node.kind === kinds_mjs_1.Kind.SCHEMA_EXTENSION || isTypeExtensionNode(node);
}
exports.isTypeSystemExtensionNode = isTypeSystemExtensionNode;
function isTypeExtensionNode(node) {
  return node.kind === kinds_mjs_1.Kind.SCALAR_TYPE_EXTENSION || node.kind === kinds_mjs_1.Kind.OBJECT_TYPE_EXTENSION || node.kind === kinds_mjs_1.Kind.INTERFACE_TYPE_EXTENSION || node.kind === kinds_mjs_1.Kind.UNION_TYPE_EXTENSION || node.kind === kinds_mjs_1.Kind.ENUM_TYPE_EXTENSION || node.kind === kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_EXTENSION;
}
exports.isTypeExtensionNode = isTypeExtensionNode;

},

// node_modules/graphql/language/directiveLocation.mjs @97
97: function(__fusereq, exports, module){
exports.__esModule = true;
exports.DirectiveLocation = Object.freeze({
  QUERY: 'QUERY',
  MUTATION: 'MUTATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  FIELD: 'FIELD',
  FRAGMENT_DEFINITION: 'FRAGMENT_DEFINITION',
  FRAGMENT_SPREAD: 'FRAGMENT_SPREAD',
  INLINE_FRAGMENT: 'INLINE_FRAGMENT',
  VARIABLE_DEFINITION: 'VARIABLE_DEFINITION',
  SCHEMA: 'SCHEMA',
  SCALAR: 'SCALAR',
  OBJECT: 'OBJECT',
  FIELD_DEFINITION: 'FIELD_DEFINITION',
  ARGUMENT_DEFINITION: 'ARGUMENT_DEFINITION',
  INTERFACE: 'INTERFACE',
  UNION: 'UNION',
  ENUM: 'ENUM',
  ENUM_VALUE: 'ENUM_VALUE',
  INPUT_OBJECT: 'INPUT_OBJECT',
  INPUT_FIELD_DEFINITION: 'INPUT_FIELD_DEFINITION'
});

},

// node_modules/graphql/jsutils/Path.mjs @98
98: function(__fusereq, exports, module){
function addPath(prev, key) {
  return {
    prev: prev,
    key: key
  };
}
exports.addPath = addPath;
function pathToArray(path) {
  var flattened = [];
  var curr = path;
  while (curr) {
    flattened.push(curr.key);
    curr = curr.prev;
  }
  return flattened.reverse();
}
exports.pathToArray = pathToArray;

},

// node_modules/graphql/execution/values.mjs @99
99: function(__fusereq, exports, module){
exports.__esModule = true;
var find_mjs_1 = __fusereq(165);
var find_mjs_1d = __fuse.dt(find_mjs_1);
var keyMap_mjs_1 = __fusereq(179);
var keyMap_mjs_1d = __fuse.dt(keyMap_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var printPathArray_mjs_1 = __fusereq(189);
var printPathArray_mjs_1d = __fuse.dt(printPathArray_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
var printer_mjs_1 = __fusereq(94);
var definition_mjs_1 = __fusereq(84);
var typeFromAST_mjs_1 = __fusereq(149);
var valueFromAST_mjs_1 = __fusereq(150);
var coerceInputValue_mjs_1 = __fusereq(154);
function getVariableValues(schema, varDefNodes, inputs, options) {
  var errors = [];
  var maxErrors = options === null || options === void 0 ? void 0 : options.maxErrors;
  try {
    var coerced = coerceVariableValues(schema, varDefNodes, inputs, function (error) {
      if (maxErrors != null && errors.length >= maxErrors) {
        throw new GraphQLError_mjs_1.GraphQLError('Too many errors processing variables, error limit reached. Execution aborted.');
      }
      errors.push(error);
    });
    if (errors.length === 0) {
      return {
        coerced: coerced
      };
    }
  } catch (error) {
    errors.push(error);
  }
  return {
    errors: errors
  };
}
exports.getVariableValues = getVariableValues;
function coerceVariableValues(schema, varDefNodes, inputs, onError) {
  var coercedValues = {};
  var _loop = function _loop(_i2) {
    var varDefNode = varDefNodes[_i2];
    var varName = varDefNode.variable.name.value;
    var varType = typeFromAST_mjs_1.typeFromAST(schema, varDefNode.type);
    if (!definition_mjs_1.isInputType(varType)) {
      var varTypeStr = printer_mjs_1.print(varDefNode.type);
      onError(new GraphQLError_mjs_1.GraphQLError(("Variable \"$").concat(varName, "\" expected value of type \"").concat(varTypeStr, "\" which cannot be used as an input type."), varDefNode.type));
      return "continue";
    }
    if (!hasOwnProperty(inputs, varName)) {
      if (varDefNode.defaultValue) {
        coercedValues[varName] = valueFromAST_mjs_1.valueFromAST(varDefNode.defaultValue, varType);
      } else if (definition_mjs_1.isNonNullType(varType)) {
        var _varTypeStr = inspect_mjs_1d.default(varType);
        onError(new GraphQLError_mjs_1.GraphQLError(("Variable \"$").concat(varName, "\" of required type \"").concat(_varTypeStr, "\" was not provided."), varDefNode));
      }
      return "continue";
    }
    var value = inputs[varName];
    if (value === null && definition_mjs_1.isNonNullType(varType)) {
      var _varTypeStr2 = inspect_mjs_1d.default(varType);
      onError(new GraphQLError_mjs_1.GraphQLError(("Variable \"$").concat(varName, "\" of non-null type \"").concat(_varTypeStr2, "\" must not be null."), varDefNode));
      return "continue";
    }
    coercedValues[varName] = coerceInputValue_mjs_1.coerceInputValue(value, varType, function (path, invalidValue, error) {
      var prefix = ("Variable \"$").concat(varName, "\" got invalid value ") + inspect_mjs_1d.default(invalidValue);
      if (path.length > 0) {
        prefix += (" at \"").concat(varName).concat(printPathArray_mjs_1d.default(path), "\"");
      }
      onError(new GraphQLError_mjs_1.GraphQLError(prefix + '; ' + error.message, varDefNode, undefined, undefined, undefined, error.originalError));
    });
  };
  for (var _i2 = 0; _i2 < varDefNodes.length; _i2++) {
    var _ret = _loop(_i2);
    if (_ret === "continue") continue;
  }
  return coercedValues;
}
function getArgumentValues(def, node, variableValues) {
  var _node$arguments;
  var coercedValues = {};
  var argumentNodes = (_node$arguments = node.arguments) !== null && _node$arguments !== void 0 ? _node$arguments : [];
  var argNodeMap = keyMap_mjs_1d.default(argumentNodes, function (arg) {
    return arg.name.value;
  });
  for (var _i4 = 0, _def$args2 = def.args; _i4 < _def$args2.length; _i4++) {
    var argDef = _def$args2[_i4];
    var name = argDef.name;
    var argType = argDef.type;
    var argumentNode = argNodeMap[name];
    if (!argumentNode) {
      if (argDef.defaultValue !== undefined) {
        coercedValues[name] = argDef.defaultValue;
      } else if (definition_mjs_1.isNonNullType(argType)) {
        throw new GraphQLError_mjs_1.GraphQLError(("Argument \"").concat(name, "\" of required type \"").concat(inspect_mjs_1d.default(argType), "\" ") + 'was not provided.', node);
      }
      continue;
    }
    var valueNode = argumentNode.value;
    var isNull = valueNode.kind === kinds_mjs_1.Kind.NULL;
    if (valueNode.kind === kinds_mjs_1.Kind.VARIABLE) {
      var variableName = valueNode.name.value;
      if (variableValues == null || !hasOwnProperty(variableValues, variableName)) {
        if (argDef.defaultValue !== undefined) {
          coercedValues[name] = argDef.defaultValue;
        } else if (definition_mjs_1.isNonNullType(argType)) {
          throw new GraphQLError_mjs_1.GraphQLError(("Argument \"").concat(name, "\" of required type \"").concat(inspect_mjs_1d.default(argType), "\" ") + ("was provided the variable \"$").concat(variableName, "\" which was not provided a runtime value."), valueNode);
        }
        continue;
      }
      isNull = variableValues[variableName] == null;
    }
    if (isNull && definition_mjs_1.isNonNullType(argType)) {
      throw new GraphQLError_mjs_1.GraphQLError(("Argument \"").concat(name, "\" of non-null type \"").concat(inspect_mjs_1d.default(argType), "\" ") + 'must not be null.', valueNode);
    }
    var coercedValue = valueFromAST_mjs_1.valueFromAST(valueNode, argType, variableValues);
    if (coercedValue === undefined) {
      throw new GraphQLError_mjs_1.GraphQLError(("Argument \"").concat(name, "\" has invalid value ").concat(printer_mjs_1.print(valueNode), "."), valueNode);
    }
    coercedValues[name] = coercedValue;
  }
  return coercedValues;
}
exports.getArgumentValues = getArgumentValues;
function getDirectiveValues(directiveDef, node, variableValues) {
  var directiveNode = node.directives && find_mjs_1d.default(node.directives, function (directive) {
    return directive.name.value === directiveDef.name;
  });
  if (directiveNode) {
    return getArgumentValues(directiveDef, directiveNode, variableValues);
  }
}
exports.getDirectiveValues = getDirectiveValues;
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},

// node_modules/graphql/subscription/subscribe.mjs @100
100: function(__fusereq, exports, module){
exports.__esModule = true;
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
var symbols_mjs_1 = __fusereq(175);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var Path_mjs_1 = __fusereq(98);
var GraphQLError_mjs_1 = __fusereq(136);
var locatedError_mjs_1 = __fusereq(138);
var execute_mjs_1 = __fusereq(82);
var getOperationRootType_mjs_1 = __fusereq(142);
var mapAsyncIterator_mjs_1 = __fusereq(190);
var mapAsyncIterator_mjs_1d = __fuse.dt(mapAsyncIterator_mjs_1);
function subscribe(argsOrSchema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, subscribeFieldResolver) {
  return arguments.length === 1 ? subscribeImpl(argsOrSchema) : subscribeImpl({
    schema: argsOrSchema,
    document: document,
    rootValue: rootValue,
    contextValue: contextValue,
    variableValues: variableValues,
    operationName: operationName,
    fieldResolver: fieldResolver,
    subscribeFieldResolver: subscribeFieldResolver
  });
}
exports.subscribe = subscribe;
function reportGraphQLError(error) {
  if (error instanceof GraphQLError_mjs_1.GraphQLError) {
    return {
      errors: [error]
    };
  }
  throw error;
}
function subscribeImpl(args) {
  var schema = args.schema, document = args.document, rootValue = args.rootValue, contextValue = args.contextValue, variableValues = args.variableValues, operationName = args.operationName, fieldResolver = args.fieldResolver, subscribeFieldResolver = args.subscribeFieldResolver;
  var sourcePromise = createSourceEventStream(schema, document, rootValue, contextValue, variableValues, operationName, subscribeFieldResolver);
  var mapSourceToResponse = function mapSourceToResponse(payload) {
    return execute_mjs_1.execute({
      schema: schema,
      document: document,
      rootValue: payload,
      contextValue: contextValue,
      variableValues: variableValues,
      operationName: operationName,
      fieldResolver: fieldResolver
    });
  };
  return sourcePromise.then(function (resultOrStream) {
    return isAsyncIterable(resultOrStream) ? mapAsyncIterator_mjs_1d.default(resultOrStream, mapSourceToResponse, reportGraphQLError) : resultOrStream;
  });
}
function createSourceEventStream(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver) {
  execute_mjs_1.assertValidExecutionArguments(schema, document, variableValues);
  try {
    var _fieldDef$subscribe;
    var exeContext = execute_mjs_1.buildExecutionContext(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver);
    if (Array.isArray(exeContext)) {
      return Promise.resolve({
        errors: exeContext
      });
    }
    var type = getOperationRootType_mjs_1.getOperationRootType(schema, exeContext.operation);
    var fields = execute_mjs_1.collectFields(exeContext, type, exeContext.operation.selectionSet, Object.create(null), Object.create(null));
    var responseNames = Object.keys(fields);
    var responseName = responseNames[0];
    var fieldNodes = fields[responseName];
    var fieldNode = fieldNodes[0];
    var fieldName = fieldNode.name.value;
    var fieldDef = execute_mjs_1.getFieldDef(schema, type, fieldName);
    if (!fieldDef) {
      throw new GraphQLError_mjs_1.GraphQLError(("The subscription field \"").concat(fieldName, "\" is not defined."), fieldNodes);
    }
    var resolveFn = (_fieldDef$subscribe = fieldDef.subscribe) !== null && _fieldDef$subscribe !== void 0 ? _fieldDef$subscribe : exeContext.fieldResolver;
    var path = Path_mjs_1.addPath(undefined, responseName);
    var info = execute_mjs_1.buildResolveInfo(exeContext, fieldDef, fieldNodes, type, path);
    var result = execute_mjs_1.resolveFieldValueOrError(exeContext, fieldDef, fieldNodes, resolveFn, rootValue, info);
    return Promise.resolve(result).then(function (eventStream) {
      if (eventStream instanceof Error) {
        return {
          errors: [locatedError_mjs_1.locatedError(eventStream, fieldNodes, Path_mjs_1.pathToArray(path))]
        };
      }
      if (isAsyncIterable(eventStream)) {
        return eventStream;
      }
      throw new Error('Subscription field must return Async Iterable. ' + ("Received: ").concat(inspect_mjs_1d.default(eventStream), "."));
    });
  } catch (error) {
    return error instanceof GraphQLError_mjs_1.GraphQLError ? Promise.resolve({
      errors: [error]
    }) : Promise.reject(error);
  }
}
exports.createSourceEventStream = createSourceEventStream;
function isAsyncIterable(maybeAsyncIterable) {
  if (maybeAsyncIterable == null || _typeof(maybeAsyncIterable) !== 'object') {
    return false;
  }
  return typeof maybeAsyncIterable[symbols_mjs_1.SYMBOL_ASYNC_ITERATOR] === 'function';
}

},

// node_modules/graphql/validation/ValidationContext.mjs @101
101: function(__fusereq, exports, module){
exports.__esModule = true;
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived), result;
    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
var kinds_mjs_1 = __fusereq(91);
var visitor_mjs_1 = __fusereq(95);
var TypeInfo_mjs_1 = __fusereq(153);
exports.ASTValidationContext = (function () {
  function ASTValidationContext(ast, onError) {
    this._ast = ast;
    this._fragments = undefined;
    this._fragmentSpreads = new Map();
    this._recursivelyReferencedFragments = new Map();
    this._onError = onError;
  }
  var _proto = ASTValidationContext.prototype;
  _proto.reportError = function reportError(error) {
    this._onError(error);
  };
  _proto.getDocument = function getDocument() {
    return this._ast;
  };
  _proto.getFragment = function getFragment(name) {
    var fragments = this._fragments;
    if (!fragments) {
      this._fragments = fragments = this.getDocument().definitions.reduce(function (frags, statement) {
        if (statement.kind === kinds_mjs_1.Kind.FRAGMENT_DEFINITION) {
          frags[statement.name.value] = statement;
        }
        return frags;
      }, Object.create(null));
    }
    return fragments[name];
  };
  _proto.getFragmentSpreads = function getFragmentSpreads(node) {
    var spreads = this._fragmentSpreads.get(node);
    if (!spreads) {
      spreads = [];
      var setsToVisit = [node];
      while (setsToVisit.length !== 0) {
        var set = setsToVisit.pop();
        for (var _i2 = 0, _set$selections2 = set.selections; _i2 < _set$selections2.length; _i2++) {
          var selection = _set$selections2[_i2];
          if (selection.kind === kinds_mjs_1.Kind.FRAGMENT_SPREAD) {
            spreads.push(selection);
          } else if (selection.selectionSet) {
            setsToVisit.push(selection.selectionSet);
          }
        }
      }
      this._fragmentSpreads.set(node, spreads);
    }
    return spreads;
  };
  _proto.getRecursivelyReferencedFragments = function getRecursivelyReferencedFragments(operation) {
    var fragments = this._recursivelyReferencedFragments.get(operation);
    if (!fragments) {
      fragments = [];
      var collectedNames = Object.create(null);
      var nodesToVisit = [operation.selectionSet];
      while (nodesToVisit.length !== 0) {
        var node = nodesToVisit.pop();
        for (var _i4 = 0, _this$getFragmentSpre2 = this.getFragmentSpreads(node); _i4 < _this$getFragmentSpre2.length; _i4++) {
          var spread = _this$getFragmentSpre2[_i4];
          var fragName = spread.name.value;
          if (collectedNames[fragName] !== true) {
            collectedNames[fragName] = true;
            var fragment = this.getFragment(fragName);
            if (fragment) {
              fragments.push(fragment);
              nodesToVisit.push(fragment.selectionSet);
            }
          }
        }
      }
      this._recursivelyReferencedFragments.set(operation, fragments);
    }
    return fragments;
  };
  return ASTValidationContext;
})();
exports.SDLValidationContext = (function (_ASTValidationContext) {
  _inheritsLoose(SDLValidationContext, _ASTValidationContext);
  var _super = _createSuper(SDLValidationContext);
  function SDLValidationContext(ast, schema, onError) {
    var _this;
    _this = _ASTValidationContext.call(this, ast, onError) || this;
    _this._schema = schema;
    return _this;
  }
  var _proto2 = SDLValidationContext.prototype;
  _proto2.getSchema = function getSchema() {
    return this._schema;
  };
  return SDLValidationContext;
})(exports.ASTValidationContext);
exports.ValidationContext = (function (_ASTValidationContext2) {
  _inheritsLoose(ValidationContext, _ASTValidationContext2);
  var _super2 = _createSuper(ValidationContext);
  function ValidationContext(schema, ast, typeInfo, onError) {
    var _this2;
    _this2 = _ASTValidationContext2.call(this, ast, onError) || this;
    _this2._schema = schema;
    _this2._typeInfo = typeInfo;
    _this2._variableUsages = new Map();
    _this2._recursiveVariableUsages = new Map();
    return _this2;
  }
  var _proto3 = ValidationContext.prototype;
  _proto3.getSchema = function getSchema() {
    return this._schema;
  };
  _proto3.getVariableUsages = function getVariableUsages(node) {
    var usages = this._variableUsages.get(node);
    if (!usages) {
      var newUsages = [];
      var typeInfo = new TypeInfo_mjs_1.TypeInfo(this._schema);
      visitor_mjs_1.visit(node, TypeInfo_mjs_1.visitWithTypeInfo(typeInfo, {
        VariableDefinition: function VariableDefinition() {
          return false;
        },
        Variable: function Variable(variable) {
          newUsages.push({
            node: variable,
            type: typeInfo.getInputType(),
            defaultValue: typeInfo.getDefaultValue()
          });
        }
      }));
      usages = newUsages;
      this._variableUsages.set(node, usages);
    }
    return usages;
  };
  _proto3.getRecursiveVariableUsages = function getRecursiveVariableUsages(operation) {
    var usages = this._recursiveVariableUsages.get(operation);
    if (!usages) {
      usages = this.getVariableUsages(operation);
      for (var _i6 = 0, _this$getRecursivelyR2 = this.getRecursivelyReferencedFragments(operation); _i6 < _this$getRecursivelyR2.length; _i6++) {
        var frag = _this$getRecursivelyR2[_i6];
        usages = usages.concat(this.getVariableUsages(frag));
      }
      this._recursiveVariableUsages.set(operation, usages);
    }
    return usages;
  };
  _proto3.getType = function getType() {
    return this._typeInfo.getType();
  };
  _proto3.getParentType = function getParentType() {
    return this._typeInfo.getParentType();
  };
  _proto3.getInputType = function getInputType() {
    return this._typeInfo.getInputType();
  };
  _proto3.getParentInputType = function getParentInputType() {
    return this._typeInfo.getParentInputType();
  };
  _proto3.getFieldDef = function getFieldDef() {
    return this._typeInfo.getFieldDef();
  };
  _proto3.getDirective = function getDirective() {
    return this._typeInfo.getDirective();
  };
  _proto3.getArgument = function getArgument() {
    return this._typeInfo.getArgument();
  };
  return ValidationContext;
})(exports.ASTValidationContext);

},

// node_modules/graphql/validation/specifiedRules.mjs @102
102: function(__fusereq, exports, module){
exports.__esModule = true;
var ExecutableDefinitionsRule_mjs_1 = __fusereq(103);
var UniqueOperationNamesRule_mjs_1 = __fusereq(124);
var LoneAnonymousOperationRule_mjs_1 = __fusereq(110);
var SingleFieldSubscriptionsRule_mjs_1 = __fusereq(119);
var KnownTypeNamesRule_mjs_1 = __fusereq(109);
var FragmentsOnCompositeTypesRule_mjs_1 = __fusereq(105);
var VariablesAreInputTypesRule_mjs_1 = __fusereq(127);
var ScalarLeafsRule_mjs_1 = __fusereq(118);
var FieldsOnCorrectTypeRule_mjs_1 = __fusereq(104);
var UniqueFragmentNamesRule_mjs_1 = __fusereq(122);
var KnownFragmentNamesRule_mjs_1 = __fusereq(108);
var NoUnusedFragmentsRule_mjs_1 = __fusereq(113);
var PossibleFragmentSpreadsRule_mjs_1 = __fusereq(116);
var NoFragmentCyclesRule_mjs_1 = __fusereq(111);
var UniqueVariableNamesRule_mjs_1 = __fusereq(125);
var NoUndefinedVariablesRule_mjs_1 = __fusereq(112);
var NoUnusedVariablesRule_mjs_1 = __fusereq(114);
var KnownDirectivesRule_mjs_1 = __fusereq(107);
var UniqueDirectivesPerLocationRule_mjs_1 = __fusereq(121);
var KnownArgumentNamesRule_mjs_1 = __fusereq(106);
var UniqueArgumentNamesRule_mjs_1 = __fusereq(120);
var ValuesOfCorrectTypeRule_mjs_1 = __fusereq(126);
var ProvidedRequiredArgumentsRule_mjs_1 = __fusereq(117);
var VariablesInAllowedPositionRule_mjs_1 = __fusereq(128);
var OverlappingFieldsCanBeMergedRule_mjs_1 = __fusereq(115);
var UniqueInputFieldNamesRule_mjs_1 = __fusereq(123);
var LoneSchemaDefinitionRule_mjs_1 = __fusereq(129);
var UniqueOperationTypesRule_mjs_1 = __fusereq(130);
var UniqueTypeNamesRule_mjs_1 = __fusereq(131);
var UniqueEnumValueNamesRule_mjs_1 = __fusereq(132);
var UniqueFieldDefinitionNamesRule_mjs_1 = __fusereq(133);
var UniqueDirectiveNamesRule_mjs_1 = __fusereq(134);
var PossibleTypeExtensionsRule_mjs_1 = __fusereq(135);
exports.specifiedRules = Object.freeze([ExecutableDefinitionsRule_mjs_1.ExecutableDefinitionsRule, UniqueOperationNamesRule_mjs_1.UniqueOperationNamesRule, LoneAnonymousOperationRule_mjs_1.LoneAnonymousOperationRule, SingleFieldSubscriptionsRule_mjs_1.SingleFieldSubscriptionsRule, KnownTypeNamesRule_mjs_1.KnownTypeNamesRule, FragmentsOnCompositeTypesRule_mjs_1.FragmentsOnCompositeTypesRule, VariablesAreInputTypesRule_mjs_1.VariablesAreInputTypesRule, ScalarLeafsRule_mjs_1.ScalarLeafsRule, FieldsOnCorrectTypeRule_mjs_1.FieldsOnCorrectTypeRule, UniqueFragmentNamesRule_mjs_1.UniqueFragmentNamesRule, KnownFragmentNamesRule_mjs_1.KnownFragmentNamesRule, NoUnusedFragmentsRule_mjs_1.NoUnusedFragmentsRule, PossibleFragmentSpreadsRule_mjs_1.PossibleFragmentSpreadsRule, NoFragmentCyclesRule_mjs_1.NoFragmentCyclesRule, UniqueVariableNamesRule_mjs_1.UniqueVariableNamesRule, NoUndefinedVariablesRule_mjs_1.NoUndefinedVariablesRule, NoUnusedVariablesRule_mjs_1.NoUnusedVariablesRule, KnownDirectivesRule_mjs_1.KnownDirectivesRule, UniqueDirectivesPerLocationRule_mjs_1.UniqueDirectivesPerLocationRule, KnownArgumentNamesRule_mjs_1.KnownArgumentNamesRule, UniqueArgumentNamesRule_mjs_1.UniqueArgumentNamesRule, ValuesOfCorrectTypeRule_mjs_1.ValuesOfCorrectTypeRule, ProvidedRequiredArgumentsRule_mjs_1.ProvidedRequiredArgumentsRule, VariablesInAllowedPositionRule_mjs_1.VariablesInAllowedPositionRule, OverlappingFieldsCanBeMergedRule_mjs_1.OverlappingFieldsCanBeMergedRule, UniqueInputFieldNamesRule_mjs_1.UniqueInputFieldNamesRule]);
exports.specifiedSDLRules = Object.freeze([LoneSchemaDefinitionRule_mjs_1.LoneSchemaDefinitionRule, UniqueOperationTypesRule_mjs_1.UniqueOperationTypesRule, UniqueTypeNamesRule_mjs_1.UniqueTypeNamesRule, UniqueEnumValueNamesRule_mjs_1.UniqueEnumValueNamesRule, UniqueFieldDefinitionNamesRule_mjs_1.UniqueFieldDefinitionNamesRule, UniqueDirectiveNamesRule_mjs_1.UniqueDirectiveNamesRule, KnownTypeNamesRule_mjs_1.KnownTypeNamesRule, KnownDirectivesRule_mjs_1.KnownDirectivesRule, UniqueDirectivesPerLocationRule_mjs_1.UniqueDirectivesPerLocationRule, PossibleTypeExtensionsRule_mjs_1.PossibleTypeExtensionsRule, KnownArgumentNamesRule_mjs_1.KnownArgumentNamesOnDirectivesRule, UniqueArgumentNamesRule_mjs_1.UniqueArgumentNamesRule, UniqueInputFieldNamesRule_mjs_1.UniqueInputFieldNamesRule, ProvidedRequiredArgumentsRule_mjs_1.ProvidedRequiredArgumentsOnDirectivesRule]);

},

// node_modules/graphql/validation/rules/ExecutableDefinitionsRule.mjs @103
103: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
var predicates_mjs_1 = __fusereq(96);
function ExecutableDefinitionsRule(context) {
  return {
    Document: function Document(node) {
      for (var _i2 = 0, _node$definitions2 = node.definitions; _i2 < _node$definitions2.length; _i2++) {
        var definition = _node$definitions2[_i2];
        if (!predicates_mjs_1.isExecutableDefinitionNode(definition)) {
          var defName = definition.kind === kinds_mjs_1.Kind.SCHEMA_DEFINITION || definition.kind === kinds_mjs_1.Kind.SCHEMA_EXTENSION ? 'schema' : '"' + definition.name.value + '"';
          context.reportError(new GraphQLError_mjs_1.GraphQLError(("The ").concat(defName, " definition is not executable."), definition));
        }
      }
      return false;
    }
  };
}
exports.ExecutableDefinitionsRule = ExecutableDefinitionsRule;

},

// node_modules/graphql/validation/rules/FieldsOnCorrectTypeRule.mjs @104
104: function(__fusereq, exports, module){
exports.__esModule = true;
var arrayFrom_mjs_1 = __fusereq(168);
var arrayFrom_mjs_1d = __fuse.dt(arrayFrom_mjs_1);
var didYouMean_mjs_1 = __fusereq(182);
var didYouMean_mjs_1d = __fuse.dt(didYouMean_mjs_1);
var suggestionList_mjs_1 = __fusereq(185);
var suggestionList_mjs_1d = __fuse.dt(suggestionList_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var definition_mjs_1 = __fusereq(84);
function FieldsOnCorrectTypeRule(context) {
  return {
    Field: function Field(node) {
      var type = context.getParentType();
      if (type) {
        var fieldDef = context.getFieldDef();
        if (!fieldDef) {
          var schema = context.getSchema();
          var fieldName = node.name.value;
          var suggestion = didYouMean_mjs_1d.default('to use an inline fragment on', getSuggestedTypeNames(schema, type, fieldName));
          if (suggestion === '') {
            suggestion = didYouMean_mjs_1d.default(getSuggestedFieldNames(type, fieldName));
          }
          context.reportError(new GraphQLError_mjs_1.GraphQLError(("Cannot query field \"").concat(fieldName, "\" on type \"").concat(type.name, "\".") + suggestion, node));
        }
      }
    }
  };
}
exports.FieldsOnCorrectTypeRule = FieldsOnCorrectTypeRule;
function getSuggestedTypeNames(schema, type, fieldName) {
  if (!definition_mjs_1.isAbstractType(type)) {
    return [];
  }
  var suggestedTypes = new Set();
  var usageCount = Object.create(null);
  for (var _i2 = 0, _schema$getPossibleTy2 = schema.getPossibleTypes(type); _i2 < _schema$getPossibleTy2.length; _i2++) {
    var possibleType = _schema$getPossibleTy2[_i2];
    if (!possibleType.getFields()[fieldName]) {
      continue;
    }
    suggestedTypes.add(possibleType);
    usageCount[possibleType.name] = 1;
    for (var _i4 = 0, _possibleType$getInte2 = possibleType.getInterfaces(); _i4 < _possibleType$getInte2.length; _i4++) {
      var _usageCount$possibleI;
      var possibleInterface = _possibleType$getInte2[_i4];
      if (!possibleInterface.getFields()[fieldName]) {
        continue;
      }
      suggestedTypes.add(possibleInterface);
      usageCount[possibleInterface.name] = ((_usageCount$possibleI = usageCount[possibleInterface.name]) !== null && _usageCount$possibleI !== void 0 ? _usageCount$possibleI : 0) + 1;
    }
  }
  return arrayFrom_mjs_1d.default(suggestedTypes).sort(function (typeA, typeB) {
    var usageCountDiff = usageCount[typeB.name] - usageCount[typeA.name];
    if (usageCountDiff !== 0) {
      return usageCountDiff;
    }
    if (definition_mjs_1.isInterfaceType(typeA) && schema.isSubType(typeA, typeB)) {
      return -1;
    }
    if (definition_mjs_1.isInterfaceType(typeB) && schema.isSubType(typeB, typeA)) {
      return 1;
    }
    return typeA.name.localeCompare(typeB.name);
  }).map(function (x) {
    return x.name;
  });
}
function getSuggestedFieldNames(type, fieldName) {
  if (definition_mjs_1.isObjectType(type) || definition_mjs_1.isInterfaceType(type)) {
    var possibleFieldNames = Object.keys(type.getFields());
    return suggestionList_mjs_1d.default(fieldName, possibleFieldNames);
  }
  return [];
}

},

// node_modules/graphql/validation/rules/FragmentsOnCompositeTypesRule.mjs @105
105: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
var printer_mjs_1 = __fusereq(94);
var definition_mjs_1 = __fusereq(84);
var typeFromAST_mjs_1 = __fusereq(149);
function FragmentsOnCompositeTypesRule(context) {
  return {
    InlineFragment: function InlineFragment(node) {
      var typeCondition = node.typeCondition;
      if (typeCondition) {
        var type = typeFromAST_mjs_1.typeFromAST(context.getSchema(), typeCondition);
        if (type && !definition_mjs_1.isCompositeType(type)) {
          var typeStr = printer_mjs_1.print(typeCondition);
          context.reportError(new GraphQLError_mjs_1.GraphQLError(("Fragment cannot condition on non composite type \"").concat(typeStr, "\"."), typeCondition));
        }
      }
    },
    FragmentDefinition: function FragmentDefinition(node) {
      var type = typeFromAST_mjs_1.typeFromAST(context.getSchema(), node.typeCondition);
      if (type && !definition_mjs_1.isCompositeType(type)) {
        var typeStr = printer_mjs_1.print(node.typeCondition);
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Fragment \"").concat(node.name.value, "\" cannot condition on non composite type \"").concat(typeStr, "\"."), node.typeCondition));
      }
    }
  };
}
exports.FragmentsOnCompositeTypesRule = FragmentsOnCompositeTypesRule;

},

// node_modules/graphql/validation/rules/KnownArgumentNamesRule.mjs @106
106: function(__fusereq, exports, module){
exports.__esModule = true;
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if ((key in obj)) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var didYouMean_mjs_1 = __fusereq(182);
var didYouMean_mjs_1d = __fuse.dt(didYouMean_mjs_1);
var suggestionList_mjs_1 = __fusereq(185);
var suggestionList_mjs_1d = __fuse.dt(suggestionList_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
var directives_mjs_1 = __fusereq(85);
function KnownArgumentNamesRule(context) {
  return _objectSpread({}, KnownArgumentNamesOnDirectivesRule(context), {
    Argument: function Argument(argNode) {
      var argDef = context.getArgument();
      var fieldDef = context.getFieldDef();
      var parentType = context.getParentType();
      if (!argDef && fieldDef && parentType) {
        var argName = argNode.name.value;
        var knownArgsNames = fieldDef.args.map(function (arg) {
          return arg.name;
        });
        var suggestions = suggestionList_mjs_1d.default(argName, knownArgsNames);
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Unknown argument \"").concat(argName, "\" on field \"").concat(parentType.name, ".").concat(fieldDef.name, "\".") + didYouMean_mjs_1d.default(suggestions), argNode));
      }
    }
  });
}
exports.KnownArgumentNamesRule = KnownArgumentNamesRule;
function KnownArgumentNamesOnDirectivesRule(context) {
  var directiveArgs = Object.create(null);
  var schema = context.getSchema();
  var definedDirectives = schema ? schema.getDirectives() : directives_mjs_1.specifiedDirectives;
  for (var _i2 = 0; _i2 < definedDirectives.length; _i2++) {
    var directive = definedDirectives[_i2];
    directiveArgs[directive.name] = directive.args.map(function (arg) {
      return arg.name;
    });
  }
  var astDefinitions = context.getDocument().definitions;
  for (var _i4 = 0; _i4 < astDefinitions.length; _i4++) {
    var def = astDefinitions[_i4];
    if (def.kind === kinds_mjs_1.Kind.DIRECTIVE_DEFINITION) {
      var _def$arguments;
      var argsNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
      directiveArgs[def.name.value] = argsNodes.map(function (arg) {
        return arg.name.value;
      });
    }
  }
  return {
    Directive: function Directive(directiveNode) {
      var directiveName = directiveNode.name.value;
      var knownArgs = directiveArgs[directiveName];
      if (directiveNode.arguments && knownArgs) {
        for (var _i6 = 0, _directiveNode$argume2 = directiveNode.arguments; _i6 < _directiveNode$argume2.length; _i6++) {
          var argNode = _directiveNode$argume2[_i6];
          var argName = argNode.name.value;
          if (knownArgs.indexOf(argName) === -1) {
            var suggestions = suggestionList_mjs_1d.default(argName, knownArgs);
            context.reportError(new GraphQLError_mjs_1.GraphQLError(("Unknown argument \"").concat(argName, "\" on directive \"@").concat(directiveName, "\".") + didYouMean_mjs_1d.default(suggestions), argNode));
          }
        }
      }
      return false;
    }
  };
}
exports.KnownArgumentNamesOnDirectivesRule = KnownArgumentNamesOnDirectivesRule;

},

// node_modules/graphql/validation/rules/KnownDirectivesRule.mjs @107
107: function(__fusereq, exports, module){
exports.__esModule = true;
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
var directiveLocation_mjs_1 = __fusereq(97);
var directives_mjs_1 = __fusereq(85);
function KnownDirectivesRule(context) {
  var locationsMap = Object.create(null);
  var schema = context.getSchema();
  var definedDirectives = schema ? schema.getDirectives() : directives_mjs_1.specifiedDirectives;
  for (var _i2 = 0; _i2 < definedDirectives.length; _i2++) {
    var directive = definedDirectives[_i2];
    locationsMap[directive.name] = directive.locations;
  }
  var astDefinitions = context.getDocument().definitions;
  for (var _i4 = 0; _i4 < astDefinitions.length; _i4++) {
    var def = astDefinitions[_i4];
    if (def.kind === kinds_mjs_1.Kind.DIRECTIVE_DEFINITION) {
      locationsMap[def.name.value] = def.locations.map(function (name) {
        return name.value;
      });
    }
  }
  return {
    Directive: function Directive(node, _key, _parent, _path, ancestors) {
      var name = node.name.value;
      var locations = locationsMap[name];
      if (!locations) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Unknown directive \"@").concat(name, "\"."), node));
        return;
      }
      var candidateLocation = getDirectiveLocationForASTPath(ancestors);
      if (candidateLocation && locations.indexOf(candidateLocation) === -1) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Directive \"@").concat(name, "\" may not be used on ").concat(candidateLocation, "."), node));
      }
    }
  };
}
exports.KnownDirectivesRule = KnownDirectivesRule;
function getDirectiveLocationForASTPath(ancestors) {
  var appliedTo = ancestors[ancestors.length - 1];
  !Array.isArray(appliedTo) || invariant_mjs_1d.default(0);
  switch (appliedTo.kind) {
    case kinds_mjs_1.Kind.OPERATION_DEFINITION:
      return getDirectiveLocationForOperation(appliedTo.operation);
    case kinds_mjs_1.Kind.FIELD:
      return directiveLocation_mjs_1.DirectiveLocation.FIELD;
    case kinds_mjs_1.Kind.FRAGMENT_SPREAD:
      return directiveLocation_mjs_1.DirectiveLocation.FRAGMENT_SPREAD;
    case kinds_mjs_1.Kind.INLINE_FRAGMENT:
      return directiveLocation_mjs_1.DirectiveLocation.INLINE_FRAGMENT;
    case kinds_mjs_1.Kind.FRAGMENT_DEFINITION:
      return directiveLocation_mjs_1.DirectiveLocation.FRAGMENT_DEFINITION;
    case kinds_mjs_1.Kind.VARIABLE_DEFINITION:
      return directiveLocation_mjs_1.DirectiveLocation.VARIABLE_DEFINITION;
    case kinds_mjs_1.Kind.SCHEMA_DEFINITION:
    case kinds_mjs_1.Kind.SCHEMA_EXTENSION:
      return directiveLocation_mjs_1.DirectiveLocation.SCHEMA;
    case kinds_mjs_1.Kind.SCALAR_TYPE_DEFINITION:
    case kinds_mjs_1.Kind.SCALAR_TYPE_EXTENSION:
      return directiveLocation_mjs_1.DirectiveLocation.SCALAR;
    case kinds_mjs_1.Kind.OBJECT_TYPE_DEFINITION:
    case kinds_mjs_1.Kind.OBJECT_TYPE_EXTENSION:
      return directiveLocation_mjs_1.DirectiveLocation.OBJECT;
    case kinds_mjs_1.Kind.FIELD_DEFINITION:
      return directiveLocation_mjs_1.DirectiveLocation.FIELD_DEFINITION;
    case kinds_mjs_1.Kind.INTERFACE_TYPE_DEFINITION:
    case kinds_mjs_1.Kind.INTERFACE_TYPE_EXTENSION:
      return directiveLocation_mjs_1.DirectiveLocation.INTERFACE;
    case kinds_mjs_1.Kind.UNION_TYPE_DEFINITION:
    case kinds_mjs_1.Kind.UNION_TYPE_EXTENSION:
      return directiveLocation_mjs_1.DirectiveLocation.UNION;
    case kinds_mjs_1.Kind.ENUM_TYPE_DEFINITION:
    case kinds_mjs_1.Kind.ENUM_TYPE_EXTENSION:
      return directiveLocation_mjs_1.DirectiveLocation.ENUM;
    case kinds_mjs_1.Kind.ENUM_VALUE_DEFINITION:
      return directiveLocation_mjs_1.DirectiveLocation.ENUM_VALUE;
    case kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
    case kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_EXTENSION:
      return directiveLocation_mjs_1.DirectiveLocation.INPUT_OBJECT;
    case kinds_mjs_1.Kind.INPUT_VALUE_DEFINITION:
      {
        var parentNode = ancestors[ancestors.length - 3];
        return parentNode.kind === kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_DEFINITION ? directiveLocation_mjs_1.DirectiveLocation.INPUT_FIELD_DEFINITION : directiveLocation_mjs_1.DirectiveLocation.ARGUMENT_DEFINITION;
      }
  }
}
function getDirectiveLocationForOperation(operation) {
  switch (operation) {
    case 'query':
      return directiveLocation_mjs_1.DirectiveLocation.QUERY;
    case 'mutation':
      return directiveLocation_mjs_1.DirectiveLocation.MUTATION;
    case 'subscription':
      return directiveLocation_mjs_1.DirectiveLocation.SUBSCRIPTION;
  }
  invariant_mjs_1d.default(false, 'Unexpected operation: ' + inspect_mjs_1d.default(operation));
}

},

// node_modules/graphql/validation/rules/KnownFragmentNamesRule.mjs @108
108: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function KnownFragmentNamesRule(context) {
  return {
    FragmentSpread: function FragmentSpread(node) {
      var fragmentName = node.name.value;
      var fragment = context.getFragment(fragmentName);
      if (!fragment) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Unknown fragment \"").concat(fragmentName, "\"."), node.name));
      }
    }
  };
}
exports.KnownFragmentNamesRule = KnownFragmentNamesRule;

},

// node_modules/graphql/validation/rules/KnownTypeNamesRule.mjs @109
109: function(__fusereq, exports, module){
exports.__esModule = true;
var didYouMean_mjs_1 = __fusereq(182);
var didYouMean_mjs_1d = __fuse.dt(didYouMean_mjs_1);
var suggestionList_mjs_1 = __fusereq(185);
var suggestionList_mjs_1d = __fuse.dt(suggestionList_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var predicates_mjs_1 = __fusereq(96);
var scalars_mjs_1 = __fusereq(86);
function KnownTypeNamesRule(context) {
  var schema = context.getSchema();
  var existingTypesMap = schema ? schema.getTypeMap() : Object.create(null);
  var definedTypes = Object.create(null);
  for (var _i2 = 0, _context$getDocument$2 = context.getDocument().definitions; _i2 < _context$getDocument$2.length; _i2++) {
    var def = _context$getDocument$2[_i2];
    if (predicates_mjs_1.isTypeDefinitionNode(def)) {
      definedTypes[def.name.value] = true;
    }
  }
  var typeNames = Object.keys(existingTypesMap).concat(Object.keys(definedTypes));
  return {
    NamedType: function NamedType(node, _1, parent, _2, ancestors) {
      var typeName = node.name.value;
      if (!existingTypesMap[typeName] && !definedTypes[typeName]) {
        var _ancestors$;
        var definitionNode = (_ancestors$ = ancestors[2]) !== null && _ancestors$ !== void 0 ? _ancestors$ : parent;
        var isSDL = definitionNode != null && isSDLNode(definitionNode);
        if (isSDL && isSpecifiedScalarName(typeName)) {
          return;
        }
        var suggestedTypes = suggestionList_mjs_1d.default(typeName, isSDL ? specifiedScalarsNames.concat(typeNames) : typeNames);
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Unknown type \"").concat(typeName, "\".") + didYouMean_mjs_1d.default(suggestedTypes), node));
      }
    }
  };
}
exports.KnownTypeNamesRule = KnownTypeNamesRule;
var specifiedScalarsNames = scalars_mjs_1.specifiedScalarTypes.map(function (type) {
  return type.name;
});
function isSpecifiedScalarName(typeName) {
  return specifiedScalarsNames.indexOf(typeName) !== -1;
}
function isSDLNode(value) {
  return !Array.isArray(value) && (predicates_mjs_1.isTypeSystemDefinitionNode(value) || predicates_mjs_1.isTypeSystemExtensionNode(value));
}

},

// node_modules/graphql/validation/rules/LoneAnonymousOperationRule.mjs @110
110: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
function LoneAnonymousOperationRule(context) {
  var operationCount = 0;
  return {
    Document: function Document(node) {
      operationCount = node.definitions.filter(function (definition) {
        return definition.kind === kinds_mjs_1.Kind.OPERATION_DEFINITION;
      }).length;
    },
    OperationDefinition: function OperationDefinition(node) {
      if (!node.name && operationCount > 1) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError('This anonymous operation must be the only defined operation.', node));
      }
    }
  };
}
exports.LoneAnonymousOperationRule = LoneAnonymousOperationRule;

},

// node_modules/graphql/validation/rules/NoFragmentCyclesRule.mjs @111
111: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function NoFragmentCyclesRule(context) {
  var visitedFrags = Object.create(null);
  var spreadPath = [];
  var spreadPathIndexByName = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      detectCycleRecursive(node);
      return false;
    }
  };
  function detectCycleRecursive(fragment) {
    if (visitedFrags[fragment.name.value]) {
      return;
    }
    var fragmentName = fragment.name.value;
    visitedFrags[fragmentName] = true;
    var spreadNodes = context.getFragmentSpreads(fragment.selectionSet);
    if (spreadNodes.length === 0) {
      return;
    }
    spreadPathIndexByName[fragmentName] = spreadPath.length;
    for (var _i2 = 0; _i2 < spreadNodes.length; _i2++) {
      var spreadNode = spreadNodes[_i2];
      var spreadName = spreadNode.name.value;
      var cycleIndex = spreadPathIndexByName[spreadName];
      spreadPath.push(spreadNode);
      if (cycleIndex === undefined) {
        var spreadFragment = context.getFragment(spreadName);
        if (spreadFragment) {
          detectCycleRecursive(spreadFragment);
        }
      } else {
        var cyclePath = spreadPath.slice(cycleIndex);
        var viaPath = cyclePath.slice(0, -1).map(function (s) {
          return '"' + s.name.value + '"';
        }).join(', ');
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Cannot spread fragment \"").concat(spreadName, "\" within itself") + (viaPath !== '' ? (" via ").concat(viaPath, ".") : '.'), cyclePath));
      }
      spreadPath.pop();
    }
    spreadPathIndexByName[fragmentName] = undefined;
  }
}
exports.NoFragmentCyclesRule = NoFragmentCyclesRule;

},

// node_modules/graphql/validation/rules/NoUndefinedVariablesRule.mjs @112
112: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function NoUndefinedVariablesRule(context) {
  var variableNameDefined = Object.create(null);
  return {
    OperationDefinition: {
      enter: function enter() {
        variableNameDefined = Object.create(null);
      },
      leave: function leave(operation) {
        var usages = context.getRecursiveVariableUsages(operation);
        for (var _i2 = 0; _i2 < usages.length; _i2++) {
          var _ref2 = usages[_i2];
          var node = _ref2.node;
          var varName = node.name.value;
          if (variableNameDefined[varName] !== true) {
            context.reportError(new GraphQLError_mjs_1.GraphQLError(operation.name ? ("Variable \"$").concat(varName, "\" is not defined by operation \"").concat(operation.name.value, "\".") : ("Variable \"$").concat(varName, "\" is not defined."), [node, operation]));
          }
        }
      }
    },
    VariableDefinition: function VariableDefinition(node) {
      variableNameDefined[node.variable.name.value] = true;
    }
  };
}
exports.NoUndefinedVariablesRule = NoUndefinedVariablesRule;

},

// node_modules/graphql/validation/rules/NoUnusedFragmentsRule.mjs @113
113: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function NoUnusedFragmentsRule(context) {
  var operationDefs = [];
  var fragmentDefs = [];
  return {
    OperationDefinition: function OperationDefinition(node) {
      operationDefs.push(node);
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      fragmentDefs.push(node);
      return false;
    },
    Document: {
      leave: function leave() {
        var fragmentNameUsed = Object.create(null);
        for (var _i2 = 0; _i2 < operationDefs.length; _i2++) {
          var operation = operationDefs[_i2];
          for (var _i4 = 0, _context$getRecursive2 = context.getRecursivelyReferencedFragments(operation); _i4 < _context$getRecursive2.length; _i4++) {
            var fragment = _context$getRecursive2[_i4];
            fragmentNameUsed[fragment.name.value] = true;
          }
        }
        for (var _i6 = 0; _i6 < fragmentDefs.length; _i6++) {
          var fragmentDef = fragmentDefs[_i6];
          var fragName = fragmentDef.name.value;
          if (fragmentNameUsed[fragName] !== true) {
            context.reportError(new GraphQLError_mjs_1.GraphQLError(("Fragment \"").concat(fragName, "\" is never used."), fragmentDef));
          }
        }
      }
    }
  };
}
exports.NoUnusedFragmentsRule = NoUnusedFragmentsRule;

},

// node_modules/graphql/validation/rules/NoUnusedVariablesRule.mjs @114
114: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function NoUnusedVariablesRule(context) {
  var variableDefs = [];
  return {
    OperationDefinition: {
      enter: function enter() {
        variableDefs = [];
      },
      leave: function leave(operation) {
        var variableNameUsed = Object.create(null);
        var usages = context.getRecursiveVariableUsages(operation);
        for (var _i2 = 0; _i2 < usages.length; _i2++) {
          var _ref2 = usages[_i2];
          var node = _ref2.node;
          variableNameUsed[node.name.value] = true;
        }
        for (var _i4 = 0, _variableDefs2 = variableDefs; _i4 < _variableDefs2.length; _i4++) {
          var variableDef = _variableDefs2[_i4];
          var variableName = variableDef.variable.name.value;
          if (variableNameUsed[variableName] !== true) {
            context.reportError(new GraphQLError_mjs_1.GraphQLError(operation.name ? ("Variable \"$").concat(variableName, "\" is never used in operation \"").concat(operation.name.value, "\".") : ("Variable \"$").concat(variableName, "\" is never used."), variableDef));
          }
        }
      }
    },
    VariableDefinition: function VariableDefinition(def) {
      variableDefs.push(def);
    }
  };
}
exports.NoUnusedVariablesRule = NoUnusedVariablesRule;

},

// node_modules/graphql/validation/rules/OverlappingFieldsCanBeMergedRule.mjs @115
115: function(__fusereq, exports, module){
exports.__esModule = true;
var find_mjs_1 = __fusereq(165);
var find_mjs_1d = __fuse.dt(find_mjs_1);
var objectEntries_mjs_1 = __fusereq(178);
var objectEntries_mjs_1d = __fuse.dt(objectEntries_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
var printer_mjs_1 = __fusereq(94);
var definition_mjs_1 = __fusereq(84);
var typeFromAST_mjs_1 = __fusereq(149);
function reasonMessage(reason) {
  if (Array.isArray(reason)) {
    return reason.map(function (_ref) {
      var responseName = _ref[0], subReason = _ref[1];
      return ("subfields \"").concat(responseName, "\" conflict because ") + reasonMessage(subReason);
    }).join(' and ');
  }
  return reason;
}
function OverlappingFieldsCanBeMergedRule(context) {
  var comparedFragmentPairs = new PairSet();
  var cachedFieldsAndFragmentNames = new Map();
  return {
    SelectionSet: function SelectionSet(selectionSet) {
      var conflicts = findConflictsWithinSelectionSet(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, context.getParentType(), selectionSet);
      for (var _i2 = 0; _i2 < conflicts.length; _i2++) {
        var _ref3 = conflicts[_i2];
        var _ref2$ = _ref3[0];
        var responseName = _ref2$[0];
        var reason = _ref2$[1];
        var fields1 = _ref3[1];
        var fields2 = _ref3[2];
        var reasonMsg = reasonMessage(reason);
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Fields \"").concat(responseName, "\" conflict because ").concat(reasonMsg, ". Use different aliases on the fields to fetch both if this was intentional."), fields1.concat(fields2)));
      }
    }
  };
}
exports.OverlappingFieldsCanBeMergedRule = OverlappingFieldsCanBeMergedRule;
function findConflictsWithinSelectionSet(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, parentType, selectionSet) {
  var conflicts = [];
  var _getFieldsAndFragment = getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType, selectionSet), fieldMap = _getFieldsAndFragment[0], fragmentNames = _getFieldsAndFragment[1];
  collectConflictsWithin(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, fieldMap);
  if (fragmentNames.length !== 0) {
    for (var i = 0; i < fragmentNames.length; i++) {
      collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, false, fieldMap, fragmentNames[i]);
      for (var j = i + 1; j < fragmentNames.length; j++) {
        collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, false, fragmentNames[i], fragmentNames[j]);
      }
    }
  }
  return conflicts;
}
function collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap, fragmentName) {
  var fragment = context.getFragment(fragmentName);
  if (!fragment) {
    return;
  }
  var _getReferencedFieldsA = getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment), fieldMap2 = _getReferencedFieldsA[0], fragmentNames2 = _getReferencedFieldsA[1];
  if (fieldMap === fieldMap2) {
    return;
  }
  collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap, fieldMap2);
  for (var i = 0; i < fragmentNames2.length; i++) {
    collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap, fragmentNames2[i]);
  }
}
function collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fragmentName1, fragmentName2) {
  if (fragmentName1 === fragmentName2) {
    return;
  }
  if (comparedFragmentPairs.has(fragmentName1, fragmentName2, areMutuallyExclusive)) {
    return;
  }
  comparedFragmentPairs.add(fragmentName1, fragmentName2, areMutuallyExclusive);
  var fragment1 = context.getFragment(fragmentName1);
  var fragment2 = context.getFragment(fragmentName2);
  if (!fragment1 || !fragment2) {
    return;
  }
  var _getReferencedFieldsA2 = getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment1), fieldMap1 = _getReferencedFieldsA2[0], fragmentNames1 = _getReferencedFieldsA2[1];
  var _getReferencedFieldsA3 = getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment2), fieldMap2 = _getReferencedFieldsA3[0], fragmentNames2 = _getReferencedFieldsA3[1];
  collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap1, fieldMap2);
  for (var j = 0; j < fragmentNames2.length; j++) {
    collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fragmentName1, fragmentNames2[j]);
  }
  for (var i = 0; i < fragmentNames1.length; i++) {
    collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fragmentNames1[i], fragmentName2);
  }
}
function findConflictsBetweenSubSelectionSets(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, parentType1, selectionSet1, parentType2, selectionSet2) {
  var conflicts = [];
  var _getFieldsAndFragment2 = getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType1, selectionSet1), fieldMap1 = _getFieldsAndFragment2[0], fragmentNames1 = _getFieldsAndFragment2[1];
  var _getFieldsAndFragment3 = getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType2, selectionSet2), fieldMap2 = _getFieldsAndFragment3[0], fragmentNames2 = _getFieldsAndFragment3[1];
  collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap1, fieldMap2);
  if (fragmentNames2.length !== 0) {
    for (var j = 0; j < fragmentNames2.length; j++) {
      collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap1, fragmentNames2[j]);
    }
  }
  if (fragmentNames1.length !== 0) {
    for (var i = 0; i < fragmentNames1.length; i++) {
      collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fieldMap2, fragmentNames1[i]);
    }
  }
  for (var _i3 = 0; _i3 < fragmentNames1.length; _i3++) {
    for (var _j = 0; _j < fragmentNames2.length; _j++) {
      collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, fragmentNames1[_i3], fragmentNames2[_j]);
    }
  }
  return conflicts;
}
function collectConflictsWithin(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, fieldMap) {
  for (var _i5 = 0, _objectEntries2 = objectEntries_mjs_1d.default(fieldMap); _i5 < _objectEntries2.length; _i5++) {
    var _ref5 = _objectEntries2[_i5];
    var responseName = _ref5[0];
    var fields = _ref5[1];
    if (fields.length > 1) {
      for (var i = 0; i < fields.length; i++) {
        for (var j = i + 1; j < fields.length; j++) {
          var conflict = findConflict(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, false, responseName, fields[i], fields[j]);
          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  }
}
function collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, fieldMap1, fieldMap2) {
  for (var _i7 = 0, _Object$keys2 = Object.keys(fieldMap1); _i7 < _Object$keys2.length; _i7++) {
    var responseName = _Object$keys2[_i7];
    var fields2 = fieldMap2[responseName];
    if (fields2) {
      var fields1 = fieldMap1[responseName];
      for (var i = 0; i < fields1.length; i++) {
        for (var j = 0; j < fields2.length; j++) {
          var conflict = findConflict(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, responseName, fields1[i], fields2[j]);
          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  }
}
function findConflict(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, responseName, field1, field2) {
  var parentType1 = field1[0], node1 = field1[1], def1 = field1[2];
  var parentType2 = field2[0], node2 = field2[1], def2 = field2[2];
  var areMutuallyExclusive = parentFieldsAreMutuallyExclusive || parentType1 !== parentType2 && definition_mjs_1.isObjectType(parentType1) && definition_mjs_1.isObjectType(parentType2);
  if (!areMutuallyExclusive) {
    var _node1$arguments, _node2$arguments;
    var name1 = node1.name.value;
    var name2 = node2.name.value;
    if (name1 !== name2) {
      return [[responseName, ("\"").concat(name1, "\" and \"").concat(name2, "\" are different fields")], [node1], [node2]];
    }
    var args1 = (_node1$arguments = node1.arguments) !== null && _node1$arguments !== void 0 ? _node1$arguments : [];
    var args2 = (_node2$arguments = node2.arguments) !== null && _node2$arguments !== void 0 ? _node2$arguments : [];
    if (!sameArguments(args1, args2)) {
      return [[responseName, 'they have differing arguments'], [node1], [node2]];
    }
  }
  var type1 = def1 === null || def1 === void 0 ? void 0 : def1.type;
  var type2 = def2 === null || def2 === void 0 ? void 0 : def2.type;
  if (type1 && type2 && doTypesConflict(type1, type2)) {
    return [[responseName, ("they return conflicting types \"").concat(inspect_mjs_1d.default(type1), "\" and \"").concat(inspect_mjs_1d.default(type2), "\"")], [node1], [node2]];
  }
  var selectionSet1 = node1.selectionSet;
  var selectionSet2 = node2.selectionSet;
  if (selectionSet1 && selectionSet2) {
    var conflicts = findConflictsBetweenSubSelectionSets(context, cachedFieldsAndFragmentNames, comparedFragmentPairs, areMutuallyExclusive, definition_mjs_1.getNamedType(type1), selectionSet1, definition_mjs_1.getNamedType(type2), selectionSet2);
    return subfieldConflicts(conflicts, responseName, node1, node2);
  }
}
function sameArguments(arguments1, arguments2) {
  if (arguments1.length !== arguments2.length) {
    return false;
  }
  return arguments1.every(function (argument1) {
    var argument2 = find_mjs_1d.default(arguments2, function (argument) {
      return argument.name.value === argument1.name.value;
    });
    if (!argument2) {
      return false;
    }
    return sameValue(argument1.value, argument2.value);
  });
}
function sameValue(value1, value2) {
  return printer_mjs_1.print(value1) === printer_mjs_1.print(value2);
}
function doTypesConflict(type1, type2) {
  if (definition_mjs_1.isListType(type1)) {
    return definition_mjs_1.isListType(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if (definition_mjs_1.isListType(type2)) {
    return true;
  }
  if (definition_mjs_1.isNonNullType(type1)) {
    return definition_mjs_1.isNonNullType(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if (definition_mjs_1.isNonNullType(type2)) {
    return true;
  }
  if (definition_mjs_1.isLeafType(type1) || definition_mjs_1.isLeafType(type2)) {
    return type1 !== type2;
  }
  return false;
}
function getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType, selectionSet) {
  var cached = cachedFieldsAndFragmentNames.get(selectionSet);
  if (!cached) {
    var nodeAndDefs = Object.create(null);
    var fragmentNames = Object.create(null);
    _collectFieldsAndFragmentNames(context, parentType, selectionSet, nodeAndDefs, fragmentNames);
    cached = [nodeAndDefs, Object.keys(fragmentNames)];
    cachedFieldsAndFragmentNames.set(selectionSet, cached);
  }
  return cached;
}
function getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment) {
  var cached = cachedFieldsAndFragmentNames.get(fragment.selectionSet);
  if (cached) {
    return cached;
  }
  var fragmentType = typeFromAST_mjs_1.typeFromAST(context.getSchema(), fragment.typeCondition);
  return getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragmentType, fragment.selectionSet);
}
function _collectFieldsAndFragmentNames(context, parentType, selectionSet, nodeAndDefs, fragmentNames) {
  for (var _i9 = 0, _selectionSet$selecti2 = selectionSet.selections; _i9 < _selectionSet$selecti2.length; _i9++) {
    var selection = _selectionSet$selecti2[_i9];
    switch (selection.kind) {
      case kinds_mjs_1.Kind.FIELD:
        {
          var fieldName = selection.name.value;
          var fieldDef = void 0;
          if (definition_mjs_1.isObjectType(parentType) || definition_mjs_1.isInterfaceType(parentType)) {
            fieldDef = parentType.getFields()[fieldName];
          }
          var responseName = selection.alias ? selection.alias.value : fieldName;
          if (!nodeAndDefs[responseName]) {
            nodeAndDefs[responseName] = [];
          }
          nodeAndDefs[responseName].push([parentType, selection, fieldDef]);
          break;
        }
      case kinds_mjs_1.Kind.FRAGMENT_SPREAD:
        fragmentNames[selection.name.value] = true;
        break;
      case kinds_mjs_1.Kind.INLINE_FRAGMENT:
        {
          var typeCondition = selection.typeCondition;
          var inlineFragmentType = typeCondition ? typeFromAST_mjs_1.typeFromAST(context.getSchema(), typeCondition) : parentType;
          _collectFieldsAndFragmentNames(context, inlineFragmentType, selection.selectionSet, nodeAndDefs, fragmentNames);
          break;
        }
    }
  }
}
function subfieldConflicts(conflicts, responseName, node1, node2) {
  if (conflicts.length > 0) {
    return [[responseName, conflicts.map(function (_ref6) {
      var reason = _ref6[0];
      return reason;
    })], conflicts.reduce(function (allFields, _ref7) {
      var fields1 = _ref7[1];
      return allFields.concat(fields1);
    }, [node1]), conflicts.reduce(function (allFields, _ref8) {
      var fields2 = _ref8[2];
      return allFields.concat(fields2);
    }, [node2])];
  }
}
var PairSet = (function () {
  function PairSet() {
    this._data = Object.create(null);
  }
  var _proto = PairSet.prototype;
  _proto.has = function has(a, b, areMutuallyExclusive) {
    var first = this._data[a];
    var result = first && first[b];
    if (result === undefined) {
      return false;
    }
    if (areMutuallyExclusive === false) {
      return result === false;
    }
    return true;
  };
  _proto.add = function add(a, b, areMutuallyExclusive) {
    _pairSetAdd(this._data, a, b, areMutuallyExclusive);
    _pairSetAdd(this._data, b, a, areMutuallyExclusive);
  };
  return PairSet;
})();
function _pairSetAdd(data, a, b, areMutuallyExclusive) {
  var map = data[a];
  if (!map) {
    map = Object.create(null);
    data[a] = map;
  }
  map[b] = areMutuallyExclusive;
}

},

// node_modules/graphql/validation/rules/PossibleFragmentSpreadsRule.mjs @116
116: function(__fusereq, exports, module){
exports.__esModule = true;
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var definition_mjs_1 = __fusereq(84);
var typeFromAST_mjs_1 = __fusereq(149);
var typeComparators_mjs_1 = __fusereq(158);
function PossibleFragmentSpreadsRule(context) {
  return {
    InlineFragment: function InlineFragment(node) {
      var fragType = context.getType();
      var parentType = context.getParentType();
      if (definition_mjs_1.isCompositeType(fragType) && definition_mjs_1.isCompositeType(parentType) && !typeComparators_mjs_1.doTypesOverlap(context.getSchema(), fragType, parentType)) {
        var parentTypeStr = inspect_mjs_1d.default(parentType);
        var fragTypeStr = inspect_mjs_1d.default(fragType);
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Fragment cannot be spread here as objects of type \"").concat(parentTypeStr, "\" can never be of type \"").concat(fragTypeStr, "\"."), node));
      }
    },
    FragmentSpread: function FragmentSpread(node) {
      var fragName = node.name.value;
      var fragType = getFragmentType(context, fragName);
      var parentType = context.getParentType();
      if (fragType && parentType && !typeComparators_mjs_1.doTypesOverlap(context.getSchema(), fragType, parentType)) {
        var parentTypeStr = inspect_mjs_1d.default(parentType);
        var fragTypeStr = inspect_mjs_1d.default(fragType);
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Fragment \"").concat(fragName, "\" cannot be spread here as objects of type \"").concat(parentTypeStr, "\" can never be of type \"").concat(fragTypeStr, "\"."), node));
      }
    }
  };
}
exports.PossibleFragmentSpreadsRule = PossibleFragmentSpreadsRule;
function getFragmentType(context, name) {
  var frag = context.getFragment(name);
  if (frag) {
    var type = typeFromAST_mjs_1.typeFromAST(context.getSchema(), frag.typeCondition);
    if (definition_mjs_1.isCompositeType(type)) {
      return type;
    }
  }
}

},

// node_modules/graphql/validation/rules/ProvidedRequiredArgumentsRule.mjs @117
117: function(__fusereq, exports, module){
exports.__esModule = true;
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if ((key in obj)) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var keyMap_mjs_1 = __fusereq(179);
var keyMap_mjs_1d = __fuse.dt(keyMap_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
var printer_mjs_1 = __fusereq(94);
var directives_mjs_1 = __fusereq(85);
var definition_mjs_1 = __fusereq(84);
function ProvidedRequiredArgumentsRule(context) {
  return _objectSpread({}, ProvidedRequiredArgumentsOnDirectivesRule(context), {
    Field: {
      leave: function leave(fieldNode) {
        var _fieldNode$arguments;
        var fieldDef = context.getFieldDef();
        if (!fieldDef) {
          return false;
        }
        var argNodes = (_fieldNode$arguments = fieldNode.arguments) !== null && _fieldNode$arguments !== void 0 ? _fieldNode$arguments : [];
        var argNodeMap = keyMap_mjs_1d.default(argNodes, function (arg) {
          return arg.name.value;
        });
        for (var _i2 = 0, _fieldDef$args2 = fieldDef.args; _i2 < _fieldDef$args2.length; _i2++) {
          var argDef = _fieldDef$args2[_i2];
          var argNode = argNodeMap[argDef.name];
          if (!argNode && definition_mjs_1.isRequiredArgument(argDef)) {
            var argTypeStr = inspect_mjs_1d.default(argDef.type);
            context.reportError(new GraphQLError_mjs_1.GraphQLError(("Field \"").concat(fieldDef.name, "\" argument \"").concat(argDef.name, "\" of type \"").concat(argTypeStr, "\" is required, but it was not provided."), fieldNode));
          }
        }
      }
    }
  });
}
exports.ProvidedRequiredArgumentsRule = ProvidedRequiredArgumentsRule;
function ProvidedRequiredArgumentsOnDirectivesRule(context) {
  var requiredArgsMap = Object.create(null);
  var schema = context.getSchema();
  var definedDirectives = schema ? schema.getDirectives() : directives_mjs_1.specifiedDirectives;
  for (var _i4 = 0; _i4 < definedDirectives.length; _i4++) {
    var directive = definedDirectives[_i4];
    requiredArgsMap[directive.name] = keyMap_mjs_1d.default(directive.args.filter(definition_mjs_1.isRequiredArgument), function (arg) {
      return arg.name;
    });
  }
  var astDefinitions = context.getDocument().definitions;
  for (var _i6 = 0; _i6 < astDefinitions.length; _i6++) {
    var def = astDefinitions[_i6];
    if (def.kind === kinds_mjs_1.Kind.DIRECTIVE_DEFINITION) {
      var _def$arguments;
      var argNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
      requiredArgsMap[def.name.value] = keyMap_mjs_1d.default(argNodes.filter(isRequiredArgumentNode), function (arg) {
        return arg.name.value;
      });
    }
  }
  return {
    Directive: {
      leave: function leave(directiveNode) {
        var directiveName = directiveNode.name.value;
        var requiredArgs = requiredArgsMap[directiveName];
        if (requiredArgs) {
          var _directiveNode$argume;
          var _argNodes = (_directiveNode$argume = directiveNode.arguments) !== null && _directiveNode$argume !== void 0 ? _directiveNode$argume : [];
          var argNodeMap = keyMap_mjs_1d.default(_argNodes, function (arg) {
            return arg.name.value;
          });
          for (var _i8 = 0, _Object$keys2 = Object.keys(requiredArgs); _i8 < _Object$keys2.length; _i8++) {
            var argName = _Object$keys2[_i8];
            if (!argNodeMap[argName]) {
              var argType = requiredArgs[argName].type;
              var argTypeStr = definition_mjs_1.isType(argType) ? inspect_mjs_1d.default(argType) : printer_mjs_1.print(argType);
              context.reportError(new GraphQLError_mjs_1.GraphQLError(("Directive \"@").concat(directiveName, "\" argument \"").concat(argName, "\" of type \"").concat(argTypeStr, "\" is required, but it was not provided."), directiveNode));
            }
          }
        }
      }
    }
  };
}
exports.ProvidedRequiredArgumentsOnDirectivesRule = ProvidedRequiredArgumentsOnDirectivesRule;
function isRequiredArgumentNode(arg) {
  return arg.type.kind === kinds_mjs_1.Kind.NON_NULL_TYPE && arg.defaultValue == null;
}

},

// node_modules/graphql/validation/rules/ScalarLeafsRule.mjs @118
118: function(__fusereq, exports, module){
exports.__esModule = true;
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var definition_mjs_1 = __fusereq(84);
function ScalarLeafsRule(context) {
  return {
    Field: function Field(node) {
      var type = context.getType();
      var selectionSet = node.selectionSet;
      if (type) {
        if (definition_mjs_1.isLeafType(definition_mjs_1.getNamedType(type))) {
          if (selectionSet) {
            var fieldName = node.name.value;
            var typeStr = inspect_mjs_1d.default(type);
            context.reportError(new GraphQLError_mjs_1.GraphQLError(("Field \"").concat(fieldName, "\" must not have a selection since type \"").concat(typeStr, "\" has no subfields."), selectionSet));
          }
        } else if (!selectionSet) {
          var _fieldName = node.name.value;
          var _typeStr = inspect_mjs_1d.default(type);
          context.reportError(new GraphQLError_mjs_1.GraphQLError(("Field \"").concat(_fieldName, "\" of type \"").concat(_typeStr, "\" must have a selection of subfields. Did you mean \"").concat(_fieldName, " { ... }\"?"), node));
        }
      }
    }
  };
}
exports.ScalarLeafsRule = ScalarLeafsRule;

},

// node_modules/graphql/validation/rules/SingleFieldSubscriptionsRule.mjs @119
119: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function SingleFieldSubscriptionsRule(context) {
  return {
    OperationDefinition: function OperationDefinition(node) {
      if (node.operation === 'subscription') {
        if (node.selectionSet.selections.length !== 1) {
          context.reportError(new GraphQLError_mjs_1.GraphQLError(node.name ? ("Subscription \"").concat(node.name.value, "\" must select only one top level field.") : 'Anonymous Subscription must select only one top level field.', node.selectionSet.selections.slice(1)));
        }
      }
    }
  };
}
exports.SingleFieldSubscriptionsRule = SingleFieldSubscriptionsRule;

},

// node_modules/graphql/validation/rules/UniqueArgumentNamesRule.mjs @120
120: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function UniqueArgumentNamesRule(context) {
  var knownArgNames = Object.create(null);
  return {
    Field: function Field() {
      knownArgNames = Object.create(null);
    },
    Directive: function Directive() {
      knownArgNames = Object.create(null);
    },
    Argument: function Argument(node) {
      var argName = node.name.value;
      if (knownArgNames[argName]) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("There can be only one argument named \"").concat(argName, "\"."), [knownArgNames[argName], node.name]));
      } else {
        knownArgNames[argName] = node.name;
      }
      return false;
    }
  };
}
exports.UniqueArgumentNamesRule = UniqueArgumentNamesRule;

},

// node_modules/graphql/validation/rules/UniqueDirectivesPerLocationRule.mjs @121
121: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
var predicates_mjs_1 = __fusereq(96);
var directives_mjs_1 = __fusereq(85);
function UniqueDirectivesPerLocationRule(context) {
  var uniqueDirectiveMap = Object.create(null);
  var schema = context.getSchema();
  var definedDirectives = schema ? schema.getDirectives() : directives_mjs_1.specifiedDirectives;
  for (var _i2 = 0; _i2 < definedDirectives.length; _i2++) {
    var directive = definedDirectives[_i2];
    uniqueDirectiveMap[directive.name] = !directive.isRepeatable;
  }
  var astDefinitions = context.getDocument().definitions;
  for (var _i4 = 0; _i4 < astDefinitions.length; _i4++) {
    var def = astDefinitions[_i4];
    if (def.kind === kinds_mjs_1.Kind.DIRECTIVE_DEFINITION) {
      uniqueDirectiveMap[def.name.value] = !def.repeatable;
    }
  }
  var schemaDirectives = Object.create(null);
  var typeDirectivesMap = Object.create(null);
  return {
    enter: function enter(node) {
      if (node.directives == null) {
        return;
      }
      var seenDirectives;
      if (node.kind === kinds_mjs_1.Kind.SCHEMA_DEFINITION || node.kind === kinds_mjs_1.Kind.SCHEMA_EXTENSION) {
        seenDirectives = schemaDirectives;
      } else if (predicates_mjs_1.isTypeDefinitionNode(node) || predicates_mjs_1.isTypeExtensionNode(node)) {
        var typeName = node.name.value;
        seenDirectives = typeDirectivesMap[typeName];
        if (seenDirectives === undefined) {
          typeDirectivesMap[typeName] = seenDirectives = Object.create(null);
        }
      } else {
        seenDirectives = Object.create(null);
      }
      for (var _i6 = 0, _node$directives2 = node.directives; _i6 < _node$directives2.length; _i6++) {
        var _directive = _node$directives2[_i6];
        var directiveName = _directive.name.value;
        if (uniqueDirectiveMap[directiveName]) {
          if (seenDirectives[directiveName]) {
            context.reportError(new GraphQLError_mjs_1.GraphQLError(("The directive \"@").concat(directiveName, "\" can only be used once at this location."), [seenDirectives[directiveName], _directive]));
          } else {
            seenDirectives[directiveName] = _directive;
          }
        }
      }
    }
  };
}
exports.UniqueDirectivesPerLocationRule = UniqueDirectivesPerLocationRule;

},

// node_modules/graphql/validation/rules/UniqueFragmentNamesRule.mjs @122
122: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function UniqueFragmentNamesRule(context) {
  var knownFragmentNames = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      var fragmentName = node.name.value;
      if (knownFragmentNames[fragmentName]) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("There can be only one fragment named \"").concat(fragmentName, "\"."), [knownFragmentNames[fragmentName], node.name]));
      } else {
        knownFragmentNames[fragmentName] = node.name;
      }
      return false;
    }
  };
}
exports.UniqueFragmentNamesRule = UniqueFragmentNamesRule;

},

// node_modules/graphql/validation/rules/UniqueInputFieldNamesRule.mjs @123
123: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function UniqueInputFieldNamesRule(context) {
  var knownNameStack = [];
  var knownNames = Object.create(null);
  return {
    ObjectValue: {
      enter: function enter() {
        knownNameStack.push(knownNames);
        knownNames = Object.create(null);
      },
      leave: function leave() {
        knownNames = knownNameStack.pop();
      }
    },
    ObjectField: function ObjectField(node) {
      var fieldName = node.name.value;
      if (knownNames[fieldName]) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("There can be only one input field named \"").concat(fieldName, "\"."), [knownNames[fieldName], node.name]));
      } else {
        knownNames[fieldName] = node.name;
      }
    }
  };
}
exports.UniqueInputFieldNamesRule = UniqueInputFieldNamesRule;

},

// node_modules/graphql/validation/rules/UniqueOperationNamesRule.mjs @124
124: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function UniqueOperationNamesRule(context) {
  var knownOperationNames = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition(node) {
      var operationName = node.name;
      if (operationName) {
        if (knownOperationNames[operationName.value]) {
          context.reportError(new GraphQLError_mjs_1.GraphQLError(("There can be only one operation named \"").concat(operationName.value, "\"."), [knownOperationNames[operationName.value], operationName]));
        } else {
          knownOperationNames[operationName.value] = operationName;
        }
      }
      return false;
    },
    FragmentDefinition: function FragmentDefinition() {
      return false;
    }
  };
}
exports.UniqueOperationNamesRule = UniqueOperationNamesRule;

},

// node_modules/graphql/validation/rules/UniqueVariableNamesRule.mjs @125
125: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function UniqueVariableNamesRule(context) {
  var knownVariableNames = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition() {
      knownVariableNames = Object.create(null);
    },
    VariableDefinition: function VariableDefinition(node) {
      var variableName = node.variable.name.value;
      if (knownVariableNames[variableName]) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("There can be only one variable named \"$").concat(variableName, "\"."), [knownVariableNames[variableName], node.variable.name]));
      } else {
        knownVariableNames[variableName] = node.variable.name;
      }
    }
  };
}
exports.UniqueVariableNamesRule = UniqueVariableNamesRule;

},

// node_modules/graphql/validation/rules/ValuesOfCorrectTypeRule.mjs @126
126: function(__fusereq, exports, module){
exports.__esModule = true;
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var keyMap_mjs_1 = __fusereq(179);
var keyMap_mjs_1d = __fuse.dt(keyMap_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var didYouMean_mjs_1 = __fusereq(182);
var didYouMean_mjs_1d = __fuse.dt(didYouMean_mjs_1);
var suggestionList_mjs_1 = __fusereq(185);
var suggestionList_mjs_1d = __fuse.dt(suggestionList_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var printer_mjs_1 = __fusereq(94);
var definition_mjs_1 = __fusereq(84);
function ValuesOfCorrectTypeRule(context) {
  return {
    ListValue: function ListValue(node) {
      var type = definition_mjs_1.getNullableType(context.getParentInputType());
      if (!definition_mjs_1.isListType(type)) {
        isValidValueNode(context, node);
        return false;
      }
    },
    ObjectValue: function ObjectValue(node) {
      var type = definition_mjs_1.getNamedType(context.getInputType());
      if (!definition_mjs_1.isInputObjectType(type)) {
        isValidValueNode(context, node);
        return false;
      }
      var fieldNodeMap = keyMap_mjs_1d.default(node.fields, function (field) {
        return field.name.value;
      });
      for (var _i2 = 0, _objectValues2 = objectValues_mjs_1d.default(type.getFields()); _i2 < _objectValues2.length; _i2++) {
        var fieldDef = _objectValues2[_i2];
        var fieldNode = fieldNodeMap[fieldDef.name];
        if (!fieldNode && definition_mjs_1.isRequiredInputField(fieldDef)) {
          var typeStr = inspect_mjs_1d.default(fieldDef.type);
          context.reportError(new GraphQLError_mjs_1.GraphQLError(("Field \"").concat(type.name, ".").concat(fieldDef.name, "\" of required type \"").concat(typeStr, "\" was not provided."), node));
        }
      }
    },
    ObjectField: function ObjectField(node) {
      var parentType = definition_mjs_1.getNamedType(context.getParentInputType());
      var fieldType = context.getInputType();
      if (!fieldType && definition_mjs_1.isInputObjectType(parentType)) {
        var suggestions = suggestionList_mjs_1d.default(node.name.value, Object.keys(parentType.getFields()));
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Field \"").concat(node.name.value, "\" is not defined by type \"").concat(parentType.name, "\".") + didYouMean_mjs_1d.default(suggestions), node));
      }
    },
    NullValue: function NullValue(node) {
      var type = context.getInputType();
      if (definition_mjs_1.isNonNullType(type)) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Expected value of type \"").concat(inspect_mjs_1d.default(type), "\", found ").concat(printer_mjs_1.print(node), "."), node));
      }
    },
    EnumValue: function EnumValue(node) {
      return isValidValueNode(context, node);
    },
    IntValue: function IntValue(node) {
      return isValidValueNode(context, node);
    },
    FloatValue: function FloatValue(node) {
      return isValidValueNode(context, node);
    },
    StringValue: function StringValue(node) {
      return isValidValueNode(context, node);
    },
    BooleanValue: function BooleanValue(node) {
      return isValidValueNode(context, node);
    }
  };
}
exports.ValuesOfCorrectTypeRule = ValuesOfCorrectTypeRule;
function isValidValueNode(context, node) {
  var locationType = context.getInputType();
  if (!locationType) {
    return;
  }
  var type = definition_mjs_1.getNamedType(locationType);
  if (!definition_mjs_1.isLeafType(type)) {
    var typeStr = inspect_mjs_1d.default(locationType);
    context.reportError(new GraphQLError_mjs_1.GraphQLError(("Expected value of type \"").concat(typeStr, "\", found ").concat(printer_mjs_1.print(node), "."), node));
    return;
  }
  try {
    var parseResult = type.parseLiteral(node, undefined);
    if (parseResult === undefined) {
      var _typeStr = inspect_mjs_1d.default(locationType);
      context.reportError(new GraphQLError_mjs_1.GraphQLError(("Expected value of type \"").concat(_typeStr, "\", found ").concat(printer_mjs_1.print(node), "."), node));
    }
  } catch (error) {
    var _typeStr2 = inspect_mjs_1d.default(locationType);
    if (error instanceof GraphQLError_mjs_1.GraphQLError) {
      context.reportError(error);
    } else {
      context.reportError(new GraphQLError_mjs_1.GraphQLError(("Expected value of type \"").concat(_typeStr2, "\", found ").concat(printer_mjs_1.print(node), "; ") + error.message, node, undefined, undefined, undefined, error));
    }
  }
}

},

// node_modules/graphql/validation/rules/VariablesAreInputTypesRule.mjs @127
127: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
var printer_mjs_1 = __fusereq(94);
var definition_mjs_1 = __fusereq(84);
var typeFromAST_mjs_1 = __fusereq(149);
function VariablesAreInputTypesRule(context) {
  return {
    VariableDefinition: function VariableDefinition(node) {
      var type = typeFromAST_mjs_1.typeFromAST(context.getSchema(), node.type);
      if (type && !definition_mjs_1.isInputType(type)) {
        var variableName = node.variable.name.value;
        var typeName = printer_mjs_1.print(node.type);
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Variable \"$").concat(variableName, "\" cannot be non-input type \"").concat(typeName, "\"."), node.type));
      }
    }
  };
}
exports.VariablesAreInputTypesRule = VariablesAreInputTypesRule;

},

// node_modules/graphql/validation/rules/VariablesInAllowedPositionRule.mjs @128
128: function(__fusereq, exports, module){
exports.__esModule = true;
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
var definition_mjs_1 = __fusereq(84);
var typeFromAST_mjs_1 = __fusereq(149);
var typeComparators_mjs_1 = __fusereq(158);
function VariablesInAllowedPositionRule(context) {
  var varDefMap = Object.create(null);
  return {
    OperationDefinition: {
      enter: function enter() {
        varDefMap = Object.create(null);
      },
      leave: function leave(operation) {
        var usages = context.getRecursiveVariableUsages(operation);
        for (var _i2 = 0; _i2 < usages.length; _i2++) {
          var _ref2 = usages[_i2];
          var node = _ref2.node;
          var type = _ref2.type;
          var defaultValue = _ref2.defaultValue;
          var varName = node.name.value;
          var varDef = varDefMap[varName];
          if (varDef && type) {
            var schema = context.getSchema();
            var varType = typeFromAST_mjs_1.typeFromAST(schema, varDef.type);
            if (varType && !allowedVariableUsage(schema, varType, varDef.defaultValue, type, defaultValue)) {
              var varTypeStr = inspect_mjs_1d.default(varType);
              var typeStr = inspect_mjs_1d.default(type);
              context.reportError(new GraphQLError_mjs_1.GraphQLError(("Variable \"$").concat(varName, "\" of type \"").concat(varTypeStr, "\" used in position expecting type \"").concat(typeStr, "\"."), [varDef, node]));
            }
          }
        }
      }
    },
    VariableDefinition: function VariableDefinition(node) {
      varDefMap[node.variable.name.value] = node;
    }
  };
}
exports.VariablesInAllowedPositionRule = VariablesInAllowedPositionRule;
function allowedVariableUsage(schema, varType, varDefaultValue, locationType, locationDefaultValue) {
  if (definition_mjs_1.isNonNullType(locationType) && !definition_mjs_1.isNonNullType(varType)) {
    var hasNonNullVariableDefaultValue = varDefaultValue != null && varDefaultValue.kind !== kinds_mjs_1.Kind.NULL;
    var hasLocationDefaultValue = locationDefaultValue !== undefined;
    if (!hasNonNullVariableDefaultValue && !hasLocationDefaultValue) {
      return false;
    }
    var nullableLocationType = locationType.ofType;
    return typeComparators_mjs_1.isTypeSubTypeOf(schema, varType, nullableLocationType);
  }
  return typeComparators_mjs_1.isTypeSubTypeOf(schema, varType, locationType);
}

},

// node_modules/graphql/validation/rules/LoneSchemaDefinitionRule.mjs @129
129: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function LoneSchemaDefinitionRule(context) {
  var _ref, _ref2, _oldSchema$astNode;
  var oldSchema = context.getSchema();
  var alreadyDefined = (_ref = (_ref2 = (_oldSchema$astNode = oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.astNode) !== null && _oldSchema$astNode !== void 0 ? _oldSchema$astNode : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getQueryType()) !== null && _ref2 !== void 0 ? _ref2 : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getMutationType()) !== null && _ref !== void 0 ? _ref : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getSubscriptionType();
  var schemaDefinitionsCount = 0;
  return {
    SchemaDefinition: function SchemaDefinition(node) {
      if (alreadyDefined) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError('Cannot define a new schema within a schema extension.', node));
        return;
      }
      if (schemaDefinitionsCount > 0) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError('Must provide only one schema definition.', node));
      }
      ++schemaDefinitionsCount;
    }
  };
}
exports.LoneSchemaDefinitionRule = LoneSchemaDefinitionRule;

},

// node_modules/graphql/validation/rules/UniqueOperationTypesRule.mjs @130
130: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function UniqueOperationTypesRule(context) {
  var schema = context.getSchema();
  var definedOperationTypes = Object.create(null);
  var existingOperationTypes = schema ? {
    query: schema.getQueryType(),
    mutation: schema.getMutationType(),
    subscription: schema.getSubscriptionType()
  } : {};
  return {
    SchemaDefinition: checkOperationTypes,
    SchemaExtension: checkOperationTypes
  };
  function checkOperationTypes(node) {
    var _node$operationTypes;
    var operationTypesNodes = (_node$operationTypes = node.operationTypes) !== null && _node$operationTypes !== void 0 ? _node$operationTypes : [];
    for (var _i2 = 0; _i2 < operationTypesNodes.length; _i2++) {
      var operationType = operationTypesNodes[_i2];
      var operation = operationType.operation;
      var alreadyDefinedOperationType = definedOperationTypes[operation];
      if (existingOperationTypes[operation]) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Type for ").concat(operation, " already defined in the schema. It cannot be redefined."), operationType));
      } else if (alreadyDefinedOperationType) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("There can be only one ").concat(operation, " type in schema."), [alreadyDefinedOperationType, operationType]));
      } else {
        definedOperationTypes[operation] = operationType;
      }
    }
    return false;
  }
}
exports.UniqueOperationTypesRule = UniqueOperationTypesRule;

},

// node_modules/graphql/validation/rules/UniqueTypeNamesRule.mjs @131
131: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function UniqueTypeNamesRule(context) {
  var knownTypeNames = Object.create(null);
  var schema = context.getSchema();
  return {
    ScalarTypeDefinition: checkTypeName,
    ObjectTypeDefinition: checkTypeName,
    InterfaceTypeDefinition: checkTypeName,
    UnionTypeDefinition: checkTypeName,
    EnumTypeDefinition: checkTypeName,
    InputObjectTypeDefinition: checkTypeName
  };
  function checkTypeName(node) {
    var typeName = node.name.value;
    if (schema === null || schema === void 0 ? void 0 : schema.getType(typeName)) {
      context.reportError(new GraphQLError_mjs_1.GraphQLError(("Type \"").concat(typeName, "\" already exists in the schema. It cannot also be defined in this type definition."), node.name));
      return;
    }
    if (knownTypeNames[typeName]) {
      context.reportError(new GraphQLError_mjs_1.GraphQLError(("There can be only one type named \"").concat(typeName, "\"."), [knownTypeNames[typeName], node.name]));
    } else {
      knownTypeNames[typeName] = node.name;
    }
    return false;
  }
}
exports.UniqueTypeNamesRule = UniqueTypeNamesRule;

},

// node_modules/graphql/validation/rules/UniqueEnumValueNamesRule.mjs @132
132: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
var definition_mjs_1 = __fusereq(84);
function UniqueEnumValueNamesRule(context) {
  var schema = context.getSchema();
  var existingTypeMap = schema ? schema.getTypeMap() : Object.create(null);
  var knownValueNames = Object.create(null);
  return {
    EnumTypeDefinition: checkValueUniqueness,
    EnumTypeExtension: checkValueUniqueness
  };
  function checkValueUniqueness(node) {
    var _node$values;
    var typeName = node.name.value;
    if (!knownValueNames[typeName]) {
      knownValueNames[typeName] = Object.create(null);
    }
    var valueNodes = (_node$values = node.values) !== null && _node$values !== void 0 ? _node$values : [];
    var valueNames = knownValueNames[typeName];
    for (var _i2 = 0; _i2 < valueNodes.length; _i2++) {
      var valueDef = valueNodes[_i2];
      var valueName = valueDef.name.value;
      var existingType = existingTypeMap[typeName];
      if (definition_mjs_1.isEnumType(existingType) && existingType.getValue(valueName)) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Enum value \"").concat(typeName, ".").concat(valueName, "\" already exists in the schema. It cannot also be defined in this type extension."), valueDef.name));
      } else if (valueNames[valueName]) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Enum value \"").concat(typeName, ".").concat(valueName, "\" can only be defined once."), [valueNames[valueName], valueDef.name]));
      } else {
        valueNames[valueName] = valueDef.name;
      }
    }
    return false;
  }
}
exports.UniqueEnumValueNamesRule = UniqueEnumValueNamesRule;

},

// node_modules/graphql/validation/rules/UniqueFieldDefinitionNamesRule.mjs @133
133: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
var definition_mjs_1 = __fusereq(84);
function UniqueFieldDefinitionNamesRule(context) {
  var schema = context.getSchema();
  var existingTypeMap = schema ? schema.getTypeMap() : Object.create(null);
  var knownFieldNames = Object.create(null);
  return {
    InputObjectTypeDefinition: checkFieldUniqueness,
    InputObjectTypeExtension: checkFieldUniqueness,
    InterfaceTypeDefinition: checkFieldUniqueness,
    InterfaceTypeExtension: checkFieldUniqueness,
    ObjectTypeDefinition: checkFieldUniqueness,
    ObjectTypeExtension: checkFieldUniqueness
  };
  function checkFieldUniqueness(node) {
    var _node$fields;
    var typeName = node.name.value;
    if (!knownFieldNames[typeName]) {
      knownFieldNames[typeName] = Object.create(null);
    }
    var fieldNodes = (_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : [];
    var fieldNames = knownFieldNames[typeName];
    for (var _i2 = 0; _i2 < fieldNodes.length; _i2++) {
      var fieldDef = fieldNodes[_i2];
      var fieldName = fieldDef.name.value;
      if (hasField(existingTypeMap[typeName], fieldName)) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Field \"").concat(typeName, ".").concat(fieldName, "\" already exists in the schema. It cannot also be defined in this type extension."), fieldDef.name));
      } else if (fieldNames[fieldName]) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Field \"").concat(typeName, ".").concat(fieldName, "\" can only be defined once."), [fieldNames[fieldName], fieldDef.name]));
      } else {
        fieldNames[fieldName] = fieldDef.name;
      }
    }
    return false;
  }
}
exports.UniqueFieldDefinitionNamesRule = UniqueFieldDefinitionNamesRule;
function hasField(type, fieldName) {
  if (definition_mjs_1.isObjectType(type) || definition_mjs_1.isInterfaceType(type) || definition_mjs_1.isInputObjectType(type)) {
    return type.getFields()[fieldName];
  }
  return false;
}

},

// node_modules/graphql/validation/rules/UniqueDirectiveNamesRule.mjs @134
134: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function UniqueDirectiveNamesRule(context) {
  var knownDirectiveNames = Object.create(null);
  var schema = context.getSchema();
  return {
    DirectiveDefinition: function DirectiveDefinition(node) {
      var directiveName = node.name.value;
      if (schema === null || schema === void 0 ? void 0 : schema.getDirective(directiveName)) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Directive \"@").concat(directiveName, "\" already exists in the schema. It cannot be redefined."), node.name));
        return;
      }
      if (knownDirectiveNames[directiveName]) {
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("There can be only one directive named \"@").concat(directiveName, "\"."), [knownDirectiveNames[directiveName], node.name]));
      } else {
        knownDirectiveNames[directiveName] = node.name;
      }
      return false;
    }
  };
}
exports.UniqueDirectiveNamesRule = UniqueDirectiveNamesRule;

},

// node_modules/graphql/validation/rules/PossibleTypeExtensionsRule.mjs @135
135: function(__fusereq, exports, module){
exports.__esModule = true;
var _defKindToExtKind;
function _defineProperty(obj, key, value) {
  if ((key in obj)) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var didYouMean_mjs_1 = __fusereq(182);
var didYouMean_mjs_1d = __fuse.dt(didYouMean_mjs_1);
var suggestionList_mjs_1 = __fusereq(185);
var suggestionList_mjs_1d = __fuse.dt(suggestionList_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var kinds_mjs_1 = __fusereq(91);
var predicates_mjs_1 = __fusereq(96);
var definition_mjs_1 = __fusereq(84);
function PossibleTypeExtensionsRule(context) {
  var schema = context.getSchema();
  var definedTypes = Object.create(null);
  for (var _i2 = 0, _context$getDocument$2 = context.getDocument().definitions; _i2 < _context$getDocument$2.length; _i2++) {
    var def = _context$getDocument$2[_i2];
    if (predicates_mjs_1.isTypeDefinitionNode(def)) {
      definedTypes[def.name.value] = def;
    }
  }
  return {
    ScalarTypeExtension: checkExtension,
    ObjectTypeExtension: checkExtension,
    InterfaceTypeExtension: checkExtension,
    UnionTypeExtension: checkExtension,
    EnumTypeExtension: checkExtension,
    InputObjectTypeExtension: checkExtension
  };
  function checkExtension(node) {
    var typeName = node.name.value;
    var defNode = definedTypes[typeName];
    var existingType = schema === null || schema === void 0 ? void 0 : schema.getType(typeName);
    var expectedKind;
    if (defNode) {
      expectedKind = defKindToExtKind[defNode.kind];
    } else if (existingType) {
      expectedKind = typeToExtKind(existingType);
    }
    if (expectedKind) {
      if (expectedKind !== node.kind) {
        var kindStr = extensionKindToTypeName(node.kind);
        context.reportError(new GraphQLError_mjs_1.GraphQLError(("Cannot extend non-").concat(kindStr, " type \"").concat(typeName, "\"."), defNode ? [defNode, node] : node));
      }
    } else {
      var allTypeNames = Object.keys(definedTypes);
      if (schema) {
        allTypeNames = allTypeNames.concat(Object.keys(schema.getTypeMap()));
      }
      var suggestedTypes = suggestionList_mjs_1d.default(typeName, allTypeNames);
      context.reportError(new GraphQLError_mjs_1.GraphQLError(("Cannot extend type \"").concat(typeName, "\" because it is not defined.") + didYouMean_mjs_1d.default(suggestedTypes), node.name));
    }
  }
}
exports.PossibleTypeExtensionsRule = PossibleTypeExtensionsRule;
var defKindToExtKind = (_defKindToExtKind = {}, _defineProperty(_defKindToExtKind, kinds_mjs_1.Kind.SCALAR_TYPE_DEFINITION, kinds_mjs_1.Kind.SCALAR_TYPE_EXTENSION), _defineProperty(_defKindToExtKind, kinds_mjs_1.Kind.OBJECT_TYPE_DEFINITION, kinds_mjs_1.Kind.OBJECT_TYPE_EXTENSION), _defineProperty(_defKindToExtKind, kinds_mjs_1.Kind.INTERFACE_TYPE_DEFINITION, kinds_mjs_1.Kind.INTERFACE_TYPE_EXTENSION), _defineProperty(_defKindToExtKind, kinds_mjs_1.Kind.UNION_TYPE_DEFINITION, kinds_mjs_1.Kind.UNION_TYPE_EXTENSION), _defineProperty(_defKindToExtKind, kinds_mjs_1.Kind.ENUM_TYPE_DEFINITION, kinds_mjs_1.Kind.ENUM_TYPE_EXTENSION), _defineProperty(_defKindToExtKind, kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_DEFINITION, kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_EXTENSION), _defKindToExtKind);
function typeToExtKind(type) {
  if (definition_mjs_1.isScalarType(type)) {
    return kinds_mjs_1.Kind.SCALAR_TYPE_EXTENSION;
  }
  if (definition_mjs_1.isObjectType(type)) {
    return kinds_mjs_1.Kind.OBJECT_TYPE_EXTENSION;
  }
  if (definition_mjs_1.isInterfaceType(type)) {
    return kinds_mjs_1.Kind.INTERFACE_TYPE_EXTENSION;
  }
  if (definition_mjs_1.isUnionType(type)) {
    return kinds_mjs_1.Kind.UNION_TYPE_EXTENSION;
  }
  if (definition_mjs_1.isEnumType(type)) {
    return kinds_mjs_1.Kind.ENUM_TYPE_EXTENSION;
  }
  if (definition_mjs_1.isInputObjectType(type)) {
    return kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_EXTENSION;
  }
  invariant_mjs_1d.default(false, 'Unexpected type: ' + inspect_mjs_1d.default(type));
}
function extensionKindToTypeName(kind) {
  switch (kind) {
    case kinds_mjs_1.Kind.SCALAR_TYPE_EXTENSION:
      return 'scalar';
    case kinds_mjs_1.Kind.OBJECT_TYPE_EXTENSION:
      return 'object';
    case kinds_mjs_1.Kind.INTERFACE_TYPE_EXTENSION:
      return 'interface';
    case kinds_mjs_1.Kind.UNION_TYPE_EXTENSION:
      return 'union';
    case kinds_mjs_1.Kind.ENUM_TYPE_EXTENSION:
      return 'enum';
    case kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_EXTENSION:
      return 'input object';
  }
  invariant_mjs_1d.default(false, 'Unexpected kind: ' + inspect_mjs_1d.default(kind));
}

},

// node_modules/graphql/error/GraphQLError.mjs @136
136: function(__fusereq, exports, module){
exports.__esModule = true;
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if (("value" in descriptor)) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived), result;
    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || (function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  });
  return _setPrototypeOf(o, p);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
var isObjectLike_mjs_1 = __fusereq(171);
var isObjectLike_mjs_1d = __fuse.dt(isObjectLike_mjs_1);
var symbols_mjs_1 = __fusereq(175);
var location_mjs_1 = __fusereq(89);
var printLocation_mjs_1 = __fusereq(90);
exports.GraphQLError = (function (_Error) {
  _inherits(GraphQLError, _Error);
  var _super = _createSuper(GraphQLError);
  function GraphQLError(message, nodes, source, positions, path, originalError, extensions) {
    var _locations2, _source2, _positions2, _extensions2;
    var _this;
    _classCallCheck(this, GraphQLError);
    _this = _super.call(this, message);
    var _nodes = Array.isArray(nodes) ? nodes.length !== 0 ? nodes : undefined : nodes ? [nodes] : undefined;
    var _source = source;
    if (!_source && _nodes) {
      var _nodes$0$loc;
      _source = (_nodes$0$loc = _nodes[0].loc) === null || _nodes$0$loc === void 0 ? void 0 : _nodes$0$loc.source;
    }
    var _positions = positions;
    if (!_positions && _nodes) {
      _positions = _nodes.reduce(function (list, node) {
        if (node.loc) {
          list.push(node.loc.start);
        }
        return list;
      }, []);
    }
    if (_positions && _positions.length === 0) {
      _positions = undefined;
    }
    var _locations;
    if (positions && source) {
      _locations = positions.map(function (pos) {
        return location_mjs_1.getLocation(source, pos);
      });
    } else if (_nodes) {
      _locations = _nodes.reduce(function (list, node) {
        if (node.loc) {
          list.push(location_mjs_1.getLocation(node.loc.source, node.loc.start));
        }
        return list;
      }, []);
    }
    var _extensions = extensions;
    if (_extensions == null && originalError != null) {
      var originalExtensions = originalError.extensions;
      if (isObjectLike_mjs_1d.default(originalExtensions)) {
        _extensions = originalExtensions;
      }
    }
    Object.defineProperties(_assertThisInitialized(_this), {
      name: {
        value: 'GraphQLError'
      },
      message: {
        value: message,
        enumerable: true,
        writable: true
      },
      locations: {
        value: (_locations2 = _locations) !== null && _locations2 !== void 0 ? _locations2 : undefined,
        enumerable: _locations != null
      },
      path: {
        value: path !== null && path !== void 0 ? path : undefined,
        enumerable: path != null
      },
      nodes: {
        value: _nodes !== null && _nodes !== void 0 ? _nodes : undefined
      },
      source: {
        value: (_source2 = _source) !== null && _source2 !== void 0 ? _source2 : undefined
      },
      positions: {
        value: (_positions2 = _positions) !== null && _positions2 !== void 0 ? _positions2 : undefined
      },
      originalError: {
        value: originalError
      },
      extensions: {
        value: (_extensions2 = _extensions) !== null && _extensions2 !== void 0 ? _extensions2 : undefined,
        enumerable: _extensions != null
      }
    });
    if (originalError === null || originalError === void 0 ? void 0 : originalError.stack) {
      Object.defineProperty(_assertThisInitialized(_this), 'stack', {
        value: originalError.stack,
        writable: true,
        configurable: true
      });
      return _possibleConstructorReturn(_this);
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(_assertThisInitialized(_this), GraphQLError);
    } else {
      Object.defineProperty(_assertThisInitialized(_this), 'stack', {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }
    return _this;
  }
  _createClass(GraphQLError, [{
    key: "toString",
    value: function toString() {
      return printError(this);
    }
  }, {
    key: symbols_mjs_1.SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'Object';
    }
  }]);
  return GraphQLError;
})(_wrapNativeSuper(Error));
function printError(error) {
  var output = error.message;
  if (error.nodes) {
    for (var _i2 = 0, _error$nodes2 = error.nodes; _i2 < _error$nodes2.length; _i2++) {
      var node = _error$nodes2[_i2];
      if (node.loc) {
        output += '\n\n' + printLocation_mjs_1.printLocation(node.loc);
      }
    }
  } else if (error.source && error.locations) {
    for (var _i4 = 0, _error$locations2 = error.locations; _i4 < _error$locations2.length; _i4++) {
      var location = _error$locations2[_i4];
      output += '\n\n' + printLocation_mjs_1.printSourceLocation(error.source, location);
    }
  }
  return output;
}
exports.printError = printError;

},

// node_modules/graphql/error/syntaxError.mjs @137
137: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function syntaxError(source, position, description) {
  return new GraphQLError_mjs_1.GraphQLError(("Syntax Error: ").concat(description), undefined, source, [position]);
}
exports.syntaxError = syntaxError;

},

// node_modules/graphql/error/locatedError.mjs @138
138: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function locatedError(originalError, nodes, path) {
  var _nodes;
  if (Array.isArray(originalError.path)) {
    return originalError;
  }
  return new GraphQLError_mjs_1.GraphQLError(originalError.message, (_nodes = originalError.nodes) !== null && _nodes !== void 0 ? _nodes : nodes, originalError.source, originalError.positions, path, originalError);
}
exports.locatedError = locatedError;

},

// node_modules/graphql/error/formatError.mjs @139
139: function(__fusereq, exports, module){
exports.__esModule = true;
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
function formatError(error) {
  var _error$message;
  error || devAssert_mjs_1d.default(0, 'Received null or undefined error.');
  var message = (_error$message = error.message) !== null && _error$message !== void 0 ? _error$message : 'An unknown error occurred.';
  var locations = error.locations;
  var path = error.path;
  var extensions = error.extensions;
  return extensions ? {
    message: message,
    locations: locations,
    path: path,
    extensions: extensions
  } : {
    message: message,
    locations: locations,
    path: path
  };
}
exports.formatError = formatError;

},

// node_modules/graphql/utilities/getIntrospectionQuery.mjs @140
140: function(__fusereq, exports, module){
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if ((key in obj)) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function getIntrospectionQuery(options) {
  var optionsWithDefault = _objectSpread({
    descriptions: true,
    directiveIsRepeatable: false,
    schemaDescription: false
  }, options);
  var descriptions = optionsWithDefault.descriptions ? 'description' : '';
  var directiveIsRepeatable = optionsWithDefault.directiveIsRepeatable ? 'isRepeatable' : '';
  var schemaDescription = optionsWithDefault.schemaDescription ? descriptions : '';
  return ("\n    query IntrospectionQuery {\n      __schema {\n        ").concat(schemaDescription, "\n        queryType { name }\n        mutationType { name }\n        subscriptionType { name }\n        types {\n          ...FullType\n        }\n        directives {\n          name\n          ").concat(descriptions, "\n          ").concat(directiveIsRepeatable, "\n          locations\n          args {\n            ...InputValue\n          }\n        }\n      }\n    }\n\n    fragment FullType on __Type {\n      kind\n      name\n      ").concat(descriptions, "\n      fields(includeDeprecated: true) {\n        name\n        ").concat(descriptions, "\n        args {\n          ...InputValue\n        }\n        type {\n          ...TypeRef\n        }\n        isDeprecated\n        deprecationReason\n      }\n      inputFields {\n        ...InputValue\n      }\n      interfaces {\n        ...TypeRef\n      }\n      enumValues(includeDeprecated: true) {\n        name\n        ").concat(descriptions, "\n        isDeprecated\n        deprecationReason\n      }\n      possibleTypes {\n        ...TypeRef\n      }\n    }\n\n    fragment InputValue on __InputValue {\n      name\n      ").concat(descriptions, "\n      type { ...TypeRef }\n      defaultValue\n    }\n\n    fragment TypeRef on __Type {\n      kind\n      name\n      ofType {\n        kind\n        name\n        ofType {\n          kind\n          name\n          ofType {\n            kind\n            name\n            ofType {\n              kind\n              name\n              ofType {\n                kind\n                name\n                ofType {\n                  kind\n                  name\n                  ofType {\n                    kind\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  ");
}
exports.getIntrospectionQuery = getIntrospectionQuery;

},

// node_modules/graphql/utilities/getOperationAST.mjs @141
141: function(__fusereq, exports, module){
exports.__esModule = true;
var kinds_mjs_1 = __fusereq(91);
function getOperationAST(documentAST, operationName) {
  var operation = null;
  for (var _i2 = 0, _documentAST$definiti2 = documentAST.definitions; _i2 < _documentAST$definiti2.length; _i2++) {
    var definition = _documentAST$definiti2[_i2];
    if (definition.kind === kinds_mjs_1.Kind.OPERATION_DEFINITION) {
      var _definition$name;
      if (operationName == null) {
        if (operation) {
          return null;
        }
        operation = definition;
      } else if (((_definition$name = definition.name) === null || _definition$name === void 0 ? void 0 : _definition$name.value) === operationName) {
        return definition;
      }
    }
  }
  return operation;
}
exports.getOperationAST = getOperationAST;

},

// node_modules/graphql/utilities/getOperationRootType.mjs @142
142: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
function getOperationRootType(schema, operation) {
  if (operation.operation === 'query') {
    var queryType = schema.getQueryType();
    if (!queryType) {
      throw new GraphQLError_mjs_1.GraphQLError('Schema does not define the required query root type.', operation);
    }
    return queryType;
  }
  if (operation.operation === 'mutation') {
    var mutationType = schema.getMutationType();
    if (!mutationType) {
      throw new GraphQLError_mjs_1.GraphQLError('Schema is not configured for mutations.', operation);
    }
    return mutationType;
  }
  if (operation.operation === 'subscription') {
    var subscriptionType = schema.getSubscriptionType();
    if (!subscriptionType) {
      throw new GraphQLError_mjs_1.GraphQLError('Schema is not configured for subscriptions.', operation);
    }
    return subscriptionType;
  }
  throw new GraphQLError_mjs_1.GraphQLError('Can only have query, mutation and subscription operations.', operation);
}
exports.getOperationRootType = getOperationRootType;

},

// node_modules/graphql/utilities/introspectionFromSchema.mjs @143
143: function(__fusereq, exports, module){
exports.__esModule = true;
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if ((key in obj)) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var isPromise_mjs_1 = __fusereq(78);
var isPromise_mjs_1d = __fuse.dt(isPromise_mjs_1);
var parser_mjs_1 = __fusereq(79);
var execute_mjs_1 = __fusereq(82);
var getIntrospectionQuery_mjs_1 = __fusereq(140);
function introspectionFromSchema(schema, options) {
  var optionsWithDefaults = _objectSpread({
    directiveIsRepeatable: true,
    schemaDescription: true
  }, options);
  var document = parser_mjs_1.parse(getIntrospectionQuery_mjs_1.getIntrospectionQuery(optionsWithDefaults));
  var result = execute_mjs_1.execute({
    schema: schema,
    document: document
  });
  !isPromise_mjs_1d.default(result) && !result.errors && result.data || invariant_mjs_1d.default(0);
  return result.data;
}
exports.introspectionFromSchema = introspectionFromSchema;

},

// node_modules/graphql/utilities/buildClientSchema.mjs @144
144: function(__fusereq, exports, module){
exports.__esModule = true;
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var keyValMap_mjs_1 = __fusereq(181);
var keyValMap_mjs_1d = __fuse.dt(keyValMap_mjs_1);
var isObjectLike_mjs_1 = __fusereq(171);
var isObjectLike_mjs_1d = __fuse.dt(isObjectLike_mjs_1);
var parser_mjs_1 = __fusereq(79);
var directives_mjs_1 = __fusereq(85);
var scalars_mjs_1 = __fusereq(86);
var introspection_mjs_1 = __fusereq(87);
var schema_mjs_1 = __fusereq(83);
var definition_mjs_1 = __fusereq(84);
var valueFromAST_mjs_1 = __fusereq(150);
function buildClientSchema(introspection, options) {
  isObjectLike_mjs_1d.default(introspection) && isObjectLike_mjs_1d.default(introspection.__schema) || devAssert_mjs_1d.default(0, ("Invalid or incomplete introspection result. Ensure that you are passing \"data\" property of introspection response and no \"errors\" was returned alongside: ").concat(inspect_mjs_1d.default(introspection), "."));
  var schemaIntrospection = introspection.__schema;
  var typeMap = keyValMap_mjs_1d.default(schemaIntrospection.types, function (typeIntrospection) {
    return typeIntrospection.name;
  }, function (typeIntrospection) {
    return buildType(typeIntrospection);
  });
  for (var _i2 = 0, _ref2 = [].concat(scalars_mjs_1.specifiedScalarTypes, introspection_mjs_1.introspectionTypes); _i2 < _ref2.length; _i2++) {
    var stdType = _ref2[_i2];
    if (typeMap[stdType.name]) {
      typeMap[stdType.name] = stdType;
    }
  }
  var queryType = schemaIntrospection.queryType ? getObjectType(schemaIntrospection.queryType) : null;
  var mutationType = schemaIntrospection.mutationType ? getObjectType(schemaIntrospection.mutationType) : null;
  var subscriptionType = schemaIntrospection.subscriptionType ? getObjectType(schemaIntrospection.subscriptionType) : null;
  var directives = schemaIntrospection.directives ? schemaIntrospection.directives.map(buildDirective) : [];
  return new schema_mjs_1.GraphQLSchema({
    description: schemaIntrospection.description,
    query: queryType,
    mutation: mutationType,
    subscription: subscriptionType,
    types: objectValues_mjs_1d.default(typeMap),
    directives: directives,
    assumeValid: options === null || options === void 0 ? void 0 : options.assumeValid
  });
  function getType(typeRef) {
    if (typeRef.kind === introspection_mjs_1.TypeKind.LIST) {
      var itemRef = typeRef.ofType;
      if (!itemRef) {
        throw new Error('Decorated type deeper than introspection query.');
      }
      return definition_mjs_1.GraphQLList(getType(itemRef));
    }
    if (typeRef.kind === introspection_mjs_1.TypeKind.NON_NULL) {
      var nullableRef = typeRef.ofType;
      if (!nullableRef) {
        throw new Error('Decorated type deeper than introspection query.');
      }
      var nullableType = getType(nullableRef);
      return definition_mjs_1.GraphQLNonNull(definition_mjs_1.assertNullableType(nullableType));
    }
    return getNamedType(typeRef);
  }
  function getNamedType(typeRef) {
    var typeName = typeRef.name;
    if (!typeName) {
      throw new Error(("Unknown type reference: ").concat(inspect_mjs_1d.default(typeRef), "."));
    }
    var type = typeMap[typeName];
    if (!type) {
      throw new Error(("Invalid or incomplete schema, unknown type: ").concat(typeName, ". Ensure that a full introspection query is used in order to build a client schema."));
    }
    return type;
  }
  function getObjectType(typeRef) {
    return definition_mjs_1.assertObjectType(getNamedType(typeRef));
  }
  function getInterfaceType(typeRef) {
    return definition_mjs_1.assertInterfaceType(getNamedType(typeRef));
  }
  function buildType(type) {
    if (type != null && type.name != null && type.kind != null) {
      switch (type.kind) {
        case introspection_mjs_1.TypeKind.SCALAR:
          return buildScalarDef(type);
        case introspection_mjs_1.TypeKind.OBJECT:
          return buildObjectDef(type);
        case introspection_mjs_1.TypeKind.INTERFACE:
          return buildInterfaceDef(type);
        case introspection_mjs_1.TypeKind.UNION:
          return buildUnionDef(type);
        case introspection_mjs_1.TypeKind.ENUM:
          return buildEnumDef(type);
        case introspection_mjs_1.TypeKind.INPUT_OBJECT:
          return buildInputObjectDef(type);
      }
    }
    var typeStr = inspect_mjs_1d.default(type);
    throw new Error(("Invalid or incomplete introspection result. Ensure that a full introspection query is used in order to build a client schema: ").concat(typeStr, "."));
  }
  function buildScalarDef(scalarIntrospection) {
    return new definition_mjs_1.GraphQLScalarType({
      name: scalarIntrospection.name,
      description: scalarIntrospection.description
    });
  }
  function buildImplementationsList(implementingIntrospection) {
    if (implementingIntrospection.interfaces === null && implementingIntrospection.kind === introspection_mjs_1.TypeKind.INTERFACE) {
      return [];
    }
    if (!implementingIntrospection.interfaces) {
      var implementingIntrospectionStr = inspect_mjs_1d.default(implementingIntrospection);
      throw new Error(("Introspection result missing interfaces: ").concat(implementingIntrospectionStr, "."));
    }
    return implementingIntrospection.interfaces.map(getInterfaceType);
  }
  function buildObjectDef(objectIntrospection) {
    return new definition_mjs_1.GraphQLObjectType({
      name: objectIntrospection.name,
      description: objectIntrospection.description,
      interfaces: function interfaces() {
        return buildImplementationsList(objectIntrospection);
      },
      fields: function fields() {
        return buildFieldDefMap(objectIntrospection);
      }
    });
  }
  function buildInterfaceDef(interfaceIntrospection) {
    return new definition_mjs_1.GraphQLInterfaceType({
      name: interfaceIntrospection.name,
      description: interfaceIntrospection.description,
      interfaces: function interfaces() {
        return buildImplementationsList(interfaceIntrospection);
      },
      fields: function fields() {
        return buildFieldDefMap(interfaceIntrospection);
      }
    });
  }
  function buildUnionDef(unionIntrospection) {
    if (!unionIntrospection.possibleTypes) {
      var unionIntrospectionStr = inspect_mjs_1d.default(unionIntrospection);
      throw new Error(("Introspection result missing possibleTypes: ").concat(unionIntrospectionStr, "."));
    }
    return new definition_mjs_1.GraphQLUnionType({
      name: unionIntrospection.name,
      description: unionIntrospection.description,
      types: function types() {
        return unionIntrospection.possibleTypes.map(getObjectType);
      }
    });
  }
  function buildEnumDef(enumIntrospection) {
    if (!enumIntrospection.enumValues) {
      var enumIntrospectionStr = inspect_mjs_1d.default(enumIntrospection);
      throw new Error(("Introspection result missing enumValues: ").concat(enumIntrospectionStr, "."));
    }
    return new definition_mjs_1.GraphQLEnumType({
      name: enumIntrospection.name,
      description: enumIntrospection.description,
      values: keyValMap_mjs_1d.default(enumIntrospection.enumValues, function (valueIntrospection) {
        return valueIntrospection.name;
      }, function (valueIntrospection) {
        return {
          description: valueIntrospection.description,
          deprecationReason: valueIntrospection.deprecationReason
        };
      })
    });
  }
  function buildInputObjectDef(inputObjectIntrospection) {
    if (!inputObjectIntrospection.inputFields) {
      var inputObjectIntrospectionStr = inspect_mjs_1d.default(inputObjectIntrospection);
      throw new Error(("Introspection result missing inputFields: ").concat(inputObjectIntrospectionStr, "."));
    }
    return new definition_mjs_1.GraphQLInputObjectType({
      name: inputObjectIntrospection.name,
      description: inputObjectIntrospection.description,
      fields: function fields() {
        return buildInputValueDefMap(inputObjectIntrospection.inputFields);
      }
    });
  }
  function buildFieldDefMap(typeIntrospection) {
    if (!typeIntrospection.fields) {
      throw new Error(("Introspection result missing fields: ").concat(inspect_mjs_1d.default(typeIntrospection), "."));
    }
    return keyValMap_mjs_1d.default(typeIntrospection.fields, function (fieldIntrospection) {
      return fieldIntrospection.name;
    }, buildField);
  }
  function buildField(fieldIntrospection) {
    var type = getType(fieldIntrospection.type);
    if (!definition_mjs_1.isOutputType(type)) {
      var typeStr = inspect_mjs_1d.default(type);
      throw new Error(("Introspection must provide output type for fields, but received: ").concat(typeStr, "."));
    }
    if (!fieldIntrospection.args) {
      var fieldIntrospectionStr = inspect_mjs_1d.default(fieldIntrospection);
      throw new Error(("Introspection result missing field args: ").concat(fieldIntrospectionStr, "."));
    }
    return {
      description: fieldIntrospection.description,
      deprecationReason: fieldIntrospection.deprecationReason,
      type: type,
      args: buildInputValueDefMap(fieldIntrospection.args)
    };
  }
  function buildInputValueDefMap(inputValueIntrospections) {
    return keyValMap_mjs_1d.default(inputValueIntrospections, function (inputValue) {
      return inputValue.name;
    }, buildInputValue);
  }
  function buildInputValue(inputValueIntrospection) {
    var type = getType(inputValueIntrospection.type);
    if (!definition_mjs_1.isInputType(type)) {
      var typeStr = inspect_mjs_1d.default(type);
      throw new Error(("Introspection must provide input type for arguments, but received: ").concat(typeStr, "."));
    }
    var defaultValue = inputValueIntrospection.defaultValue != null ? valueFromAST_mjs_1.valueFromAST(parser_mjs_1.parseValue(inputValueIntrospection.defaultValue), type) : undefined;
    return {
      description: inputValueIntrospection.description,
      type: type,
      defaultValue: defaultValue
    };
  }
  function buildDirective(directiveIntrospection) {
    if (!directiveIntrospection.args) {
      var directiveIntrospectionStr = inspect_mjs_1d.default(directiveIntrospection);
      throw new Error(("Introspection result missing directive args: ").concat(directiveIntrospectionStr, "."));
    }
    if (!directiveIntrospection.locations) {
      var _directiveIntrospectionStr = inspect_mjs_1d.default(directiveIntrospection);
      throw new Error(("Introspection result missing directive locations: ").concat(_directiveIntrospectionStr, "."));
    }
    return new directives_mjs_1.GraphQLDirective({
      name: directiveIntrospection.name,
      description: directiveIntrospection.description,
      isRepeatable: directiveIntrospection.isRepeatable,
      locations: directiveIntrospection.locations.slice(),
      args: buildInputValueDefMap(directiveIntrospection.args)
    });
  }
}
exports.buildClientSchema = buildClientSchema;

},

// node_modules/graphql/utilities/buildASTSchema.mjs @145
145: function(__fusereq, exports, module){
exports.__esModule = true;
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var kinds_mjs_1 = __fusereq(91);
var parser_mjs_1 = __fusereq(79);
var validate_mjs_1 = __fusereq(80);
var schema_mjs_1 = __fusereq(83);
var directives_mjs_1 = __fusereq(85);
var extendSchema_mjs_1 = __fusereq(146);
function buildASTSchema(documentAST, options) {
  documentAST != null && documentAST.kind === kinds_mjs_1.Kind.DOCUMENT || devAssert_mjs_1d.default(0, 'Must provide valid Document AST.');
  if ((options === null || options === void 0 ? void 0 : options.assumeValid) !== true && (options === null || options === void 0 ? void 0 : options.assumeValidSDL) !== true) {
    validate_mjs_1.assertValidSDL(documentAST);
  }
  var config = extendSchema_mjs_1.extendSchemaImpl(emptySchemaConfig, documentAST, options);
  if (config.astNode == null) {
    for (var _i2 = 0, _config$types2 = config.types; _i2 < _config$types2.length; _i2++) {
      var type = _config$types2[_i2];
      switch (type.name) {
        case 'Query':
          config.query = type;
          break;
        case 'Mutation':
          config.mutation = type;
          break;
        case 'Subscription':
          config.subscription = type;
          break;
      }
    }
  }
  var directives = config.directives;
  if (!directives.some(function (directive) {
    return directive.name === 'skip';
  })) {
    directives.push(directives_mjs_1.GraphQLSkipDirective);
  }
  if (!directives.some(function (directive) {
    return directive.name === 'include';
  })) {
    directives.push(directives_mjs_1.GraphQLIncludeDirective);
  }
  if (!directives.some(function (directive) {
    return directive.name === 'deprecated';
  })) {
    directives.push(directives_mjs_1.GraphQLDeprecatedDirective);
  }
  return new schema_mjs_1.GraphQLSchema(config);
}
exports.buildASTSchema = buildASTSchema;
var emptySchemaConfig = new schema_mjs_1.GraphQLSchema({
  directives: []
}).toConfig();
function buildSchema(source, options) {
  var document = parser_mjs_1.parse(source, {
    noLocation: options === null || options === void 0 ? void 0 : options.noLocation,
    allowLegacySDLEmptyFields: options === null || options === void 0 ? void 0 : options.allowLegacySDLEmptyFields,
    allowLegacySDLImplementsInterfaces: options === null || options === void 0 ? void 0 : options.allowLegacySDLImplementsInterfaces,
    experimentalFragmentVariables: options === null || options === void 0 ? void 0 : options.experimentalFragmentVariables
  });
  return buildASTSchema(document, {
    commentDescriptions: options === null || options === void 0 ? void 0 : options.commentDescriptions,
    assumeValidSDL: options === null || options === void 0 ? void 0 : options.assumeValidSDL,
    assumeValid: options === null || options === void 0 ? void 0 : options.assumeValid
  });
}
exports.buildSchema = buildSchema;

},

// node_modules/graphql/utilities/extendSchema.mjs @146
146: function(__fusereq, exports, module){
exports.__esModule = true;
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if ((key in obj)) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var keyMap_mjs_1 = __fusereq(179);
var keyMap_mjs_1d = __fuse.dt(keyMap_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var mapValue_mjs_1 = __fusereq(180);
var mapValue_mjs_1d = __fuse.dt(mapValue_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var kinds_mjs_1 = __fusereq(91);
var tokenKind_mjs_1 = __fusereq(92);
var blockString_mjs_1 = __fusereq(188);
var predicates_mjs_1 = __fusereq(96);
var validate_mjs_1 = __fusereq(80);
var values_mjs_1 = __fusereq(99);
var scalars_mjs_1 = __fusereq(86);
var introspection_mjs_1 = __fusereq(87);
var directives_mjs_1 = __fusereq(85);
var schema_mjs_1 = __fusereq(83);
var definition_mjs_1 = __fusereq(84);
var valueFromAST_mjs_1 = __fusereq(150);
function extendSchema(schema, documentAST, options) {
  schema_mjs_1.assertSchema(schema);
  documentAST != null && documentAST.kind === kinds_mjs_1.Kind.DOCUMENT || devAssert_mjs_1d.default(0, 'Must provide valid Document AST.');
  if ((options === null || options === void 0 ? void 0 : options.assumeValid) !== true && (options === null || options === void 0 ? void 0 : options.assumeValidSDL) !== true) {
    validate_mjs_1.assertValidSDLExtension(documentAST, schema);
  }
  var schemaConfig = schema.toConfig();
  var extendedConfig = extendSchemaImpl(schemaConfig, documentAST, options);
  return schemaConfig === extendedConfig ? schema : new schema_mjs_1.GraphQLSchema(extendedConfig);
}
exports.extendSchema = extendSchema;
function extendSchemaImpl(schemaConfig, documentAST, options) {
  var _schemaDef, _schemaDef$descriptio, _schemaDef2, _options$assumeValid;
  var typeDefs = [];
  var typeExtensionsMap = Object.create(null);
  var directiveDefs = [];
  var schemaDef;
  var schemaExtensions = [];
  for (var _i2 = 0, _documentAST$definiti2 = documentAST.definitions; _i2 < _documentAST$definiti2.length; _i2++) {
    var def = _documentAST$definiti2[_i2];
    if (def.kind === kinds_mjs_1.Kind.SCHEMA_DEFINITION) {
      schemaDef = def;
    } else if (def.kind === kinds_mjs_1.Kind.SCHEMA_EXTENSION) {
      schemaExtensions.push(def);
    } else if (predicates_mjs_1.isTypeDefinitionNode(def)) {
      typeDefs.push(def);
    } else if (predicates_mjs_1.isTypeExtensionNode(def)) {
      var extendedTypeName = def.name.value;
      var existingTypeExtensions = typeExtensionsMap[extendedTypeName];
      typeExtensionsMap[extendedTypeName] = existingTypeExtensions ? existingTypeExtensions.concat([def]) : [def];
    } else if (def.kind === kinds_mjs_1.Kind.DIRECTIVE_DEFINITION) {
      directiveDefs.push(def);
    }
  }
  if (Object.keys(typeExtensionsMap).length === 0 && typeDefs.length === 0 && directiveDefs.length === 0 && schemaExtensions.length === 0 && schemaDef == null) {
    return schemaConfig;
  }
  var typeMap = Object.create(null);
  for (var _i4 = 0, _schemaConfig$types2 = schemaConfig.types; _i4 < _schemaConfig$types2.length; _i4++) {
    var existingType = _schemaConfig$types2[_i4];
    typeMap[existingType.name] = extendNamedType(existingType);
  }
  for (var _i6 = 0; _i6 < typeDefs.length; _i6++) {
    var _stdTypeMap$name;
    var typeNode = typeDefs[_i6];
    var name = typeNode.name.value;
    typeMap[name] = (_stdTypeMap$name = stdTypeMap[name]) !== null && _stdTypeMap$name !== void 0 ? _stdTypeMap$name : buildType(typeNode);
  }
  var operationTypes = _objectSpread({
    query: schemaConfig.query && replaceNamedType(schemaConfig.query),
    mutation: schemaConfig.mutation && replaceNamedType(schemaConfig.mutation),
    subscription: schemaConfig.subscription && replaceNamedType(schemaConfig.subscription)
  }, schemaDef && getOperationTypes([schemaDef]), {}, getOperationTypes(schemaExtensions));
  return _objectSpread({
    description: (_schemaDef = schemaDef) === null || _schemaDef === void 0 ? void 0 : (_schemaDef$descriptio = _schemaDef.description) === null || _schemaDef$descriptio === void 0 ? void 0 : _schemaDef$descriptio.value
  }, operationTypes, {
    types: objectValues_mjs_1d.default(typeMap),
    directives: [].concat(schemaConfig.directives.map(replaceDirective), directiveDefs.map(buildDirective)),
    extensions: undefined,
    astNode: (_schemaDef2 = schemaDef) !== null && _schemaDef2 !== void 0 ? _schemaDef2 : schemaConfig.astNode,
    extensionASTNodes: schemaConfig.extensionASTNodes.concat(schemaExtensions),
    assumeValid: (_options$assumeValid = options === null || options === void 0 ? void 0 : options.assumeValid) !== null && _options$assumeValid !== void 0 ? _options$assumeValid : false
  });
  function replaceType(type) {
    if (definition_mjs_1.isListType(type)) {
      return new definition_mjs_1.GraphQLList(replaceType(type.ofType));
    } else if (definition_mjs_1.isNonNullType(type)) {
      return new definition_mjs_1.GraphQLNonNull(replaceType(type.ofType));
    }
    return replaceNamedType(type);
  }
  function replaceNamedType(type) {
    return typeMap[type.name];
  }
  function replaceDirective(directive) {
    var config = directive.toConfig();
    return new directives_mjs_1.GraphQLDirective(_objectSpread({}, config, {
      args: mapValue_mjs_1d.default(config.args, extendArg)
    }));
  }
  function extendNamedType(type) {
    if (introspection_mjs_1.isIntrospectionType(type) || scalars_mjs_1.isSpecifiedScalarType(type)) {
      return type;
    }
    if (definition_mjs_1.isScalarType(type)) {
      return extendScalarType(type);
    }
    if (definition_mjs_1.isObjectType(type)) {
      return extendObjectType(type);
    }
    if (definition_mjs_1.isInterfaceType(type)) {
      return extendInterfaceType(type);
    }
    if (definition_mjs_1.isUnionType(type)) {
      return extendUnionType(type);
    }
    if (definition_mjs_1.isEnumType(type)) {
      return extendEnumType(type);
    }
    if (definition_mjs_1.isInputObjectType(type)) {
      return extendInputObjectType(type);
    }
    invariant_mjs_1d.default(false, 'Unexpected type: ' + inspect_mjs_1d.default(type));
  }
  function extendInputObjectType(type) {
    var _typeExtensionsMap$co;
    var config = type.toConfig();
    var extensions = (_typeExtensionsMap$co = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co !== void 0 ? _typeExtensionsMap$co : [];
    return new definition_mjs_1.GraphQLInputObjectType(_objectSpread({}, config, {
      fields: function fields() {
        return _objectSpread({}, mapValue_mjs_1d.default(config.fields, function (field) {
          return _objectSpread({}, field, {
            type: replaceType(field.type)
          });
        }), {}, buildInputFieldMap(extensions));
      },
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    }));
  }
  function extendEnumType(type) {
    var _typeExtensionsMap$ty;
    var config = type.toConfig();
    var extensions = (_typeExtensionsMap$ty = typeExtensionsMap[type.name]) !== null && _typeExtensionsMap$ty !== void 0 ? _typeExtensionsMap$ty : [];
    return new definition_mjs_1.GraphQLEnumType(_objectSpread({}, config, {
      values: _objectSpread({}, config.values, {}, buildEnumValueMap(extensions)),
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    }));
  }
  function extendScalarType(type) {
    var _typeExtensionsMap$co2;
    var config = type.toConfig();
    var extensions = (_typeExtensionsMap$co2 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co2 !== void 0 ? _typeExtensionsMap$co2 : [];
    return new definition_mjs_1.GraphQLScalarType(_objectSpread({}, config, {
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    }));
  }
  function extendObjectType(type) {
    var _typeExtensionsMap$co3;
    var config = type.toConfig();
    var extensions = (_typeExtensionsMap$co3 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co3 !== void 0 ? _typeExtensionsMap$co3 : [];
    return new definition_mjs_1.GraphQLObjectType(_objectSpread({}, config, {
      interfaces: function interfaces() {
        return [].concat(type.getInterfaces().map(replaceNamedType), buildInterfaces(extensions));
      },
      fields: function fields() {
        return _objectSpread({}, mapValue_mjs_1d.default(config.fields, extendField), {}, buildFieldMap(extensions));
      },
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    }));
  }
  function extendInterfaceType(type) {
    var _typeExtensionsMap$co4;
    var config = type.toConfig();
    var extensions = (_typeExtensionsMap$co4 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co4 !== void 0 ? _typeExtensionsMap$co4 : [];
    return new definition_mjs_1.GraphQLInterfaceType(_objectSpread({}, config, {
      interfaces: function interfaces() {
        return [].concat(type.getInterfaces().map(replaceNamedType), buildInterfaces(extensions));
      },
      fields: function fields() {
        return _objectSpread({}, mapValue_mjs_1d.default(config.fields, extendField), {}, buildFieldMap(extensions));
      },
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    }));
  }
  function extendUnionType(type) {
    var _typeExtensionsMap$co5;
    var config = type.toConfig();
    var extensions = (_typeExtensionsMap$co5 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co5 !== void 0 ? _typeExtensionsMap$co5 : [];
    return new definition_mjs_1.GraphQLUnionType(_objectSpread({}, config, {
      types: function types() {
        return [].concat(type.getTypes().map(replaceNamedType), buildUnionTypes(extensions));
      },
      extensionASTNodes: config.extensionASTNodes.concat(extensions)
    }));
  }
  function extendField(field) {
    return _objectSpread({}, field, {
      type: replaceType(field.type),
      args: mapValue_mjs_1d.default(field.args, extendArg)
    });
  }
  function extendArg(arg) {
    return _objectSpread({}, arg, {
      type: replaceType(arg.type)
    });
  }
  function getOperationTypes(nodes) {
    var opTypes = {};
    for (var _i8 = 0; _i8 < nodes.length; _i8++) {
      var _node$operationTypes;
      var node = nodes[_i8];
      var operationTypesNodes = (_node$operationTypes = node.operationTypes) !== null && _node$operationTypes !== void 0 ? _node$operationTypes : [];
      for (var _i10 = 0; _i10 < operationTypesNodes.length; _i10++) {
        var operationType = operationTypesNodes[_i10];
        opTypes[operationType.operation] = getNamedType(operationType.type);
      }
    }
    return opTypes;
  }
  function getNamedType(node) {
    var _stdTypeMap$name2;
    var name = node.name.value;
    var type = (_stdTypeMap$name2 = stdTypeMap[name]) !== null && _stdTypeMap$name2 !== void 0 ? _stdTypeMap$name2 : typeMap[name];
    if (type === undefined) {
      throw new Error(("Unknown type: \"").concat(name, "\"."));
    }
    return type;
  }
  function getWrappedType(node) {
    if (node.kind === kinds_mjs_1.Kind.LIST_TYPE) {
      return new definition_mjs_1.GraphQLList(getWrappedType(node.type));
    }
    if (node.kind === kinds_mjs_1.Kind.NON_NULL_TYPE) {
      return new definition_mjs_1.GraphQLNonNull(getWrappedType(node.type));
    }
    return getNamedType(node);
  }
  function buildDirective(node) {
    var locations = node.locations.map(function (_ref) {
      var value = _ref.value;
      return value;
    });
    return new directives_mjs_1.GraphQLDirective({
      name: node.name.value,
      description: getDescription(node, options),
      locations: locations,
      isRepeatable: node.repeatable,
      args: buildArgumentMap(node.arguments),
      astNode: node
    });
  }
  function buildFieldMap(nodes) {
    var fieldConfigMap = Object.create(null);
    for (var _i12 = 0; _i12 < nodes.length; _i12++) {
      var _node$fields;
      var node = nodes[_i12];
      var nodeFields = (_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : [];
      for (var _i14 = 0; _i14 < nodeFields.length; _i14++) {
        var field = nodeFields[_i14];
        fieldConfigMap[field.name.value] = {
          type: getWrappedType(field.type),
          description: getDescription(field, options),
          args: buildArgumentMap(field.arguments),
          deprecationReason: getDeprecationReason(field),
          astNode: field
        };
      }
    }
    return fieldConfigMap;
  }
  function buildArgumentMap(args) {
    var argsNodes = args !== null && args !== void 0 ? args : [];
    var argConfigMap = Object.create(null);
    for (var _i16 = 0; _i16 < argsNodes.length; _i16++) {
      var arg = argsNodes[_i16];
      var type = getWrappedType(arg.type);
      argConfigMap[arg.name.value] = {
        type: type,
        description: getDescription(arg, options),
        defaultValue: valueFromAST_mjs_1.valueFromAST(arg.defaultValue, type),
        astNode: arg
      };
    }
    return argConfigMap;
  }
  function buildInputFieldMap(nodes) {
    var inputFieldMap = Object.create(null);
    for (var _i18 = 0; _i18 < nodes.length; _i18++) {
      var _node$fields2;
      var node = nodes[_i18];
      var fieldsNodes = (_node$fields2 = node.fields) !== null && _node$fields2 !== void 0 ? _node$fields2 : [];
      for (var _i20 = 0; _i20 < fieldsNodes.length; _i20++) {
        var field = fieldsNodes[_i20];
        var type = getWrappedType(field.type);
        inputFieldMap[field.name.value] = {
          type: type,
          description: getDescription(field, options),
          defaultValue: valueFromAST_mjs_1.valueFromAST(field.defaultValue, type),
          astNode: field
        };
      }
    }
    return inputFieldMap;
  }
  function buildEnumValueMap(nodes) {
    var enumValueMap = Object.create(null);
    for (var _i22 = 0; _i22 < nodes.length; _i22++) {
      var _node$values;
      var node = nodes[_i22];
      var valuesNodes = (_node$values = node.values) !== null && _node$values !== void 0 ? _node$values : [];
      for (var _i24 = 0; _i24 < valuesNodes.length; _i24++) {
        var value = valuesNodes[_i24];
        enumValueMap[value.name.value] = {
          description: getDescription(value, options),
          deprecationReason: getDeprecationReason(value),
          astNode: value
        };
      }
    }
    return enumValueMap;
  }
  function buildInterfaces(nodes) {
    var interfaces = [];
    for (var _i26 = 0; _i26 < nodes.length; _i26++) {
      var _node$interfaces;
      var node = nodes[_i26];
      var interfacesNodes = (_node$interfaces = node.interfaces) !== null && _node$interfaces !== void 0 ? _node$interfaces : [];
      for (var _i28 = 0; _i28 < interfacesNodes.length; _i28++) {
        var type = interfacesNodes[_i28];
        interfaces.push(getNamedType(type));
      }
    }
    return interfaces;
  }
  function buildUnionTypes(nodes) {
    var types = [];
    for (var _i30 = 0; _i30 < nodes.length; _i30++) {
      var _node$types;
      var node = nodes[_i30];
      var typeNodes = (_node$types = node.types) !== null && _node$types !== void 0 ? _node$types : [];
      for (var _i32 = 0; _i32 < typeNodes.length; _i32++) {
        var type = typeNodes[_i32];
        types.push(getNamedType(type));
      }
    }
    return types;
  }
  function buildType(astNode) {
    var _typeExtensionsMap$na;
    var name = astNode.name.value;
    var description = getDescription(astNode, options);
    var extensionNodes = (_typeExtensionsMap$na = typeExtensionsMap[name]) !== null && _typeExtensionsMap$na !== void 0 ? _typeExtensionsMap$na : [];
    switch (astNode.kind) {
      case kinds_mjs_1.Kind.OBJECT_TYPE_DEFINITION:
        {
          var extensionASTNodes = extensionNodes;
          var allNodes = [astNode].concat(extensionASTNodes);
          return new definition_mjs_1.GraphQLObjectType({
            name: name,
            description: description,
            interfaces: function interfaces() {
              return buildInterfaces(allNodes);
            },
            fields: function fields() {
              return buildFieldMap(allNodes);
            },
            astNode: astNode,
            extensionASTNodes: extensionASTNodes
          });
        }
      case kinds_mjs_1.Kind.INTERFACE_TYPE_DEFINITION:
        {
          var _extensionASTNodes = extensionNodes;
          var _allNodes = [astNode].concat(_extensionASTNodes);
          return new definition_mjs_1.GraphQLInterfaceType({
            name: name,
            description: description,
            interfaces: function interfaces() {
              return buildInterfaces(_allNodes);
            },
            fields: function fields() {
              return buildFieldMap(_allNodes);
            },
            astNode: astNode,
            extensionASTNodes: _extensionASTNodes
          });
        }
      case kinds_mjs_1.Kind.ENUM_TYPE_DEFINITION:
        {
          var _extensionASTNodes2 = extensionNodes;
          var _allNodes2 = [astNode].concat(_extensionASTNodes2);
          return new definition_mjs_1.GraphQLEnumType({
            name: name,
            description: description,
            values: buildEnumValueMap(_allNodes2),
            astNode: astNode,
            extensionASTNodes: _extensionASTNodes2
          });
        }
      case kinds_mjs_1.Kind.UNION_TYPE_DEFINITION:
        {
          var _extensionASTNodes3 = extensionNodes;
          var _allNodes3 = [astNode].concat(_extensionASTNodes3);
          return new definition_mjs_1.GraphQLUnionType({
            name: name,
            description: description,
            types: function types() {
              return buildUnionTypes(_allNodes3);
            },
            astNode: astNode,
            extensionASTNodes: _extensionASTNodes3
          });
        }
      case kinds_mjs_1.Kind.SCALAR_TYPE_DEFINITION:
        {
          var _extensionASTNodes4 = extensionNodes;
          return new definition_mjs_1.GraphQLScalarType({
            name: name,
            description: description,
            astNode: astNode,
            extensionASTNodes: _extensionASTNodes4
          });
        }
      case kinds_mjs_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
        {
          var _extensionASTNodes5 = extensionNodes;
          var _allNodes4 = [astNode].concat(_extensionASTNodes5);
          return new definition_mjs_1.GraphQLInputObjectType({
            name: name,
            description: description,
            fields: function fields() {
              return buildInputFieldMap(_allNodes4);
            },
            astNode: astNode,
            extensionASTNodes: _extensionASTNodes5
          });
        }
    }
    invariant_mjs_1d.default(false, 'Unexpected type definition node: ' + inspect_mjs_1d.default(astNode));
  }
}
exports.extendSchemaImpl = extendSchemaImpl;
var stdTypeMap = keyMap_mjs_1d.default(scalars_mjs_1.specifiedScalarTypes.concat(introspection_mjs_1.introspectionTypes), function (type) {
  return type.name;
});
function getDeprecationReason(node) {
  var deprecated = values_mjs_1.getDirectiveValues(directives_mjs_1.GraphQLDeprecatedDirective, node);
  return deprecated === null || deprecated === void 0 ? void 0 : deprecated.reason;
}
function getDescription(node, options) {
  if (node.description) {
    return node.description.value;
  }
  if ((options === null || options === void 0 ? void 0 : options.commentDescriptions) === true) {
    var rawValue = getLeadingCommentBlock(node);
    if (rawValue !== undefined) {
      return blockString_mjs_1.dedentBlockStringValue('\n' + rawValue);
    }
  }
}
exports.getDescription = getDescription;
function getLeadingCommentBlock(node) {
  var loc = node.loc;
  if (!loc) {
    return;
  }
  var comments = [];
  var token = loc.startToken.prev;
  while (token != null && token.kind === tokenKind_mjs_1.TokenKind.COMMENT && token.next && token.prev && token.line + 1 === token.next.line && token.line !== token.prev.line) {
    var value = String(token.value);
    comments.push(value);
    token = token.prev;
  }
  return comments.length > 0 ? comments.reverse().join('\n') : undefined;
}

},

// node_modules/graphql/utilities/lexicographicSortSchema.mjs @147
147: function(__fusereq, exports, module){
exports.__esModule = true;
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if ((key in obj)) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var keyValMap_mjs_1 = __fusereq(181);
var keyValMap_mjs_1d = __fuse.dt(keyValMap_mjs_1);
var schema_mjs_1 = __fusereq(83);
var directives_mjs_1 = __fusereq(85);
var introspection_mjs_1 = __fusereq(87);
var definition_mjs_1 = __fusereq(84);
function lexicographicSortSchema(schema) {
  var schemaConfig = schema.toConfig();
  var typeMap = keyValMap_mjs_1d.default(sortByName(schemaConfig.types), function (type) {
    return type.name;
  }, sortNamedType);
  return new schema_mjs_1.GraphQLSchema(_objectSpread({}, schemaConfig, {
    types: objectValues_mjs_1d.default(typeMap),
    directives: sortByName(schemaConfig.directives).map(sortDirective),
    query: replaceMaybeType(schemaConfig.query),
    mutation: replaceMaybeType(schemaConfig.mutation),
    subscription: replaceMaybeType(schemaConfig.subscription)
  }));
  function replaceType(type) {
    if (definition_mjs_1.isListType(type)) {
      return new definition_mjs_1.GraphQLList(replaceType(type.ofType));
    } else if (definition_mjs_1.isNonNullType(type)) {
      return new definition_mjs_1.GraphQLNonNull(replaceType(type.ofType));
    }
    return replaceNamedType(type);
  }
  function replaceNamedType(type) {
    return typeMap[type.name];
  }
  function replaceMaybeType(maybeType) {
    return maybeType && replaceNamedType(maybeType);
  }
  function sortDirective(directive) {
    var config = directive.toConfig();
    return new directives_mjs_1.GraphQLDirective(_objectSpread({}, config, {
      locations: sortBy(config.locations, function (x) {
        return x;
      }),
      args: sortArgs(config.args)
    }));
  }
  function sortArgs(args) {
    return sortObjMap(args, function (arg) {
      return _objectSpread({}, arg, {
        type: replaceType(arg.type)
      });
    });
  }
  function sortFields(fieldsMap) {
    return sortObjMap(fieldsMap, function (field) {
      return _objectSpread({}, field, {
        type: replaceType(field.type),
        args: sortArgs(field.args)
      });
    });
  }
  function sortInputFields(fieldsMap) {
    return sortObjMap(fieldsMap, function (field) {
      return _objectSpread({}, field, {
        type: replaceType(field.type)
      });
    });
  }
  function sortTypes(arr) {
    return sortByName(arr).map(replaceNamedType);
  }
  function sortNamedType(type) {
    if (definition_mjs_1.isScalarType(type) || introspection_mjs_1.isIntrospectionType(type)) {
      return type;
    }
    if (definition_mjs_1.isObjectType(type)) {
      var config = type.toConfig();
      return new definition_mjs_1.GraphQLObjectType(_objectSpread({}, config, {
        interfaces: function interfaces() {
          return sortTypes(config.interfaces);
        },
        fields: function fields() {
          return sortFields(config.fields);
        }
      }));
    }
    if (definition_mjs_1.isInterfaceType(type)) {
      var _config = type.toConfig();
      return new definition_mjs_1.GraphQLInterfaceType(_objectSpread({}, _config, {
        interfaces: function interfaces() {
          return sortTypes(_config.interfaces);
        },
        fields: function fields() {
          return sortFields(_config.fields);
        }
      }));
    }
    if (definition_mjs_1.isUnionType(type)) {
      var _config2 = type.toConfig();
      return new definition_mjs_1.GraphQLUnionType(_objectSpread({}, _config2, {
        types: function types() {
          return sortTypes(_config2.types);
        }
      }));
    }
    if (definition_mjs_1.isEnumType(type)) {
      var _config3 = type.toConfig();
      return new definition_mjs_1.GraphQLEnumType(_objectSpread({}, _config3, {
        values: sortObjMap(_config3.values)
      }));
    }
    if (definition_mjs_1.isInputObjectType(type)) {
      var _config4 = type.toConfig();
      return new definition_mjs_1.GraphQLInputObjectType(_objectSpread({}, _config4, {
        fields: function fields() {
          return sortInputFields(_config4.fields);
        }
      }));
    }
    invariant_mjs_1d.default(false, 'Unexpected type: ' + inspect_mjs_1d.default(type));
  }
}
exports.lexicographicSortSchema = lexicographicSortSchema;
function sortObjMap(map, sortValueFn) {
  var sortedMap = Object.create(null);
  var sortedKeys = sortBy(Object.keys(map), function (x) {
    return x;
  });
  for (var _i2 = 0; _i2 < sortedKeys.length; _i2++) {
    var key = sortedKeys[_i2];
    var value = map[key];
    sortedMap[key] = sortValueFn ? sortValueFn(value) : value;
  }
  return sortedMap;
}
function sortByName(array) {
  return sortBy(array, function (obj) {
    return obj.name;
  });
}
function sortBy(array, mapToKey) {
  return array.slice().sort(function (obj1, obj2) {
    var key1 = mapToKey(obj1);
    var key2 = mapToKey(obj2);
    return key1.localeCompare(key2);
  });
}

},

// node_modules/graphql/utilities/printSchema.mjs @148
148: function(__fusereq, exports, module){
exports.__esModule = true;
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var printer_mjs_1 = __fusereq(94);
var blockString_mjs_1 = __fusereq(188);
var introspection_mjs_1 = __fusereq(87);
var scalars_mjs_1 = __fusereq(86);
var directives_mjs_1 = __fusereq(85);
var definition_mjs_1 = __fusereq(84);
var astFromValue_mjs_1 = __fusereq(152);
function printSchema(schema, options) {
  return printFilteredSchema(schema, function (n) {
    return !directives_mjs_1.isSpecifiedDirective(n);
  }, isDefinedType, options);
}
exports.printSchema = printSchema;
function printIntrospectionSchema(schema, options) {
  return printFilteredSchema(schema, directives_mjs_1.isSpecifiedDirective, introspection_mjs_1.isIntrospectionType, options);
}
exports.printIntrospectionSchema = printIntrospectionSchema;
function isDefinedType(type) {
  return !scalars_mjs_1.isSpecifiedScalarType(type) && !introspection_mjs_1.isIntrospectionType(type);
}
function printFilteredSchema(schema, directiveFilter, typeFilter, options) {
  var directives = schema.getDirectives().filter(directiveFilter);
  var types = objectValues_mjs_1d.default(schema.getTypeMap()).filter(typeFilter);
  return [printSchemaDefinition(schema)].concat(directives.map(function (directive) {
    return printDirective(directive, options);
  }), types.map(function (type) {
    return printType(type, options);
  })).filter(Boolean).join('\n\n') + '\n';
}
function printSchemaDefinition(schema) {
  if (schema.description == null && isSchemaOfCommonNames(schema)) {
    return;
  }
  var operationTypes = [];
  var queryType = schema.getQueryType();
  if (queryType) {
    operationTypes.push(("  query: ").concat(queryType.name));
  }
  var mutationType = schema.getMutationType();
  if (mutationType) {
    operationTypes.push(("  mutation: ").concat(mutationType.name));
  }
  var subscriptionType = schema.getSubscriptionType();
  if (subscriptionType) {
    operationTypes.push(("  subscription: ").concat(subscriptionType.name));
  }
  return printDescription({}, schema) + ("schema {\n").concat(operationTypes.join('\n'), "\n}");
}
function isSchemaOfCommonNames(schema) {
  var queryType = schema.getQueryType();
  if (queryType && queryType.name !== 'Query') {
    return false;
  }
  var mutationType = schema.getMutationType();
  if (mutationType && mutationType.name !== 'Mutation') {
    return false;
  }
  var subscriptionType = schema.getSubscriptionType();
  if (subscriptionType && subscriptionType.name !== 'Subscription') {
    return false;
  }
  return true;
}
function printType(type, options) {
  if (definition_mjs_1.isScalarType(type)) {
    return printScalar(type, options);
  }
  if (definition_mjs_1.isObjectType(type)) {
    return printObject(type, options);
  }
  if (definition_mjs_1.isInterfaceType(type)) {
    return printInterface(type, options);
  }
  if (definition_mjs_1.isUnionType(type)) {
    return printUnion(type, options);
  }
  if (definition_mjs_1.isEnumType(type)) {
    return printEnum(type, options);
  }
  if (definition_mjs_1.isInputObjectType(type)) {
    return printInputObject(type, options);
  }
  invariant_mjs_1d.default(false, 'Unexpected type: ' + inspect_mjs_1d.default(type));
}
exports.printType = printType;
function printScalar(type, options) {
  return printDescription(options, type) + ("scalar ").concat(type.name);
}
function printImplementedInterfaces(type) {
  var interfaces = type.getInterfaces();
  return interfaces.length ? ' implements ' + interfaces.map(function (i) {
    return i.name;
  }).join(' & ') : '';
}
function printObject(type, options) {
  return printDescription(options, type) + ("type ").concat(type.name) + printImplementedInterfaces(type) + printFields(options, type);
}
function printInterface(type, options) {
  return printDescription(options, type) + ("interface ").concat(type.name) + printImplementedInterfaces(type) + printFields(options, type);
}
function printUnion(type, options) {
  var types = type.getTypes();
  var possibleTypes = types.length ? ' = ' + types.join(' | ') : '';
  return printDescription(options, type) + 'union ' + type.name + possibleTypes;
}
function printEnum(type, options) {
  var values = type.getValues().map(function (value, i) {
    return printDescription(options, value, '  ', !i) + '  ' + value.name + printDeprecated(value);
  });
  return printDescription(options, type) + ("enum ").concat(type.name) + printBlock(values);
}
function printInputObject(type, options) {
  var fields = objectValues_mjs_1d.default(type.getFields()).map(function (f, i) {
    return printDescription(options, f, '  ', !i) + '  ' + printInputValue(f);
  });
  return printDescription(options, type) + ("input ").concat(type.name) + printBlock(fields);
}
function printFields(options, type) {
  var fields = objectValues_mjs_1d.default(type.getFields()).map(function (f, i) {
    return printDescription(options, f, '  ', !i) + '  ' + f.name + printArgs(options, f.args, '  ') + ': ' + String(f.type) + printDeprecated(f);
  });
  return printBlock(fields);
}
function printBlock(items) {
  return items.length !== 0 ? ' {\n' + items.join('\n') + '\n}' : '';
}
function printArgs(options, args) {
  var indentation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (args.length === 0) {
    return '';
  }
  if (args.every(function (arg) {
    return !arg.description;
  })) {
    return '(' + args.map(printInputValue).join(', ') + ')';
  }
  return '(\n' + args.map(function (arg, i) {
    return printDescription(options, arg, '  ' + indentation, !i) + '  ' + indentation + printInputValue(arg);
  }).join('\n') + '\n' + indentation + ')';
}
function printInputValue(arg) {
  var defaultAST = astFromValue_mjs_1.astFromValue(arg.defaultValue, arg.type);
  var argDecl = arg.name + ': ' + String(arg.type);
  if (defaultAST) {
    argDecl += (" = ").concat(printer_mjs_1.print(defaultAST));
  }
  return argDecl;
}
function printDirective(directive, options) {
  return printDescription(options, directive) + 'directive @' + directive.name + printArgs(options, directive.args) + (directive.isRepeatable ? ' repeatable' : '') + ' on ' + directive.locations.join(' | ');
}
function printDeprecated(fieldOrEnumVal) {
  if (!fieldOrEnumVal.isDeprecated) {
    return '';
  }
  var reason = fieldOrEnumVal.deprecationReason;
  var reasonAST = astFromValue_mjs_1.astFromValue(reason, scalars_mjs_1.GraphQLString);
  if (reasonAST && reason !== directives_mjs_1.DEFAULT_DEPRECATION_REASON) {
    return ' @deprecated(reason: ' + printer_mjs_1.print(reasonAST) + ')';
  }
  return ' @deprecated';
}
function printDescription(options, def) {
  var indentation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var firstInBlock = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var description = def.description;
  if (description == null) {
    return '';
  }
  if ((options === null || options === void 0 ? void 0 : options.commentDescriptions) === true) {
    return printDescriptionWithComments(description, indentation, firstInBlock);
  }
  var preferMultipleLines = description.length > 70;
  var blockString = blockString_mjs_1.printBlockString(description, '', preferMultipleLines);
  var prefix = indentation && !firstInBlock ? '\n' + indentation : indentation;
  return prefix + blockString.replace(/\n/g, '\n' + indentation) + '\n';
}
function printDescriptionWithComments(description, indentation, firstInBlock) {
  var prefix = indentation && !firstInBlock ? '\n' : '';
  var comment = description.split('\n').map(function (line) {
    return indentation + (line !== '' ? '# ' + line : '#');
  }).join('\n');
  return prefix + comment + '\n';
}

},

// node_modules/graphql/utilities/typeFromAST.mjs @149
149: function(__fusereq, exports, module){
exports.__esModule = true;
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var kinds_mjs_1 = __fusereq(91);
var definition_mjs_1 = __fusereq(84);
function typeFromAST(schema, typeNode) {
  var innerType;
  if (typeNode.kind === kinds_mjs_1.Kind.LIST_TYPE) {
    innerType = typeFromAST(schema, typeNode.type);
    return innerType && definition_mjs_1.GraphQLList(innerType);
  }
  if (typeNode.kind === kinds_mjs_1.Kind.NON_NULL_TYPE) {
    innerType = typeFromAST(schema, typeNode.type);
    return innerType && definition_mjs_1.GraphQLNonNull(innerType);
  }
  if (typeNode.kind === kinds_mjs_1.Kind.NAMED_TYPE) {
    return schema.getType(typeNode.name.value);
  }
  invariant_mjs_1d.default(false, 'Unexpected type node: ' + inspect_mjs_1d.default(typeNode));
}
exports.typeFromAST = typeFromAST;

},

// node_modules/graphql/utilities/valueFromAST.mjs @150
150: function(__fusereq, exports, module){
exports.__esModule = true;
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var keyMap_mjs_1 = __fusereq(179);
var keyMap_mjs_1d = __fuse.dt(keyMap_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var kinds_mjs_1 = __fusereq(91);
var definition_mjs_1 = __fusereq(84);
function valueFromAST(valueNode, type, variables) {
  if (!valueNode) {
    return;
  }
  if (valueNode.kind === kinds_mjs_1.Kind.VARIABLE) {
    var variableName = valueNode.name.value;
    if (variables == null || variables[variableName] === undefined) {
      return;
    }
    var variableValue = variables[variableName];
    if (variableValue === null && definition_mjs_1.isNonNullType(type)) {
      return;
    }
    return variableValue;
  }
  if (definition_mjs_1.isNonNullType(type)) {
    if (valueNode.kind === kinds_mjs_1.Kind.NULL) {
      return;
    }
    return valueFromAST(valueNode, type.ofType, variables);
  }
  if (valueNode.kind === kinds_mjs_1.Kind.NULL) {
    return null;
  }
  if (definition_mjs_1.isListType(type)) {
    var itemType = type.ofType;
    if (valueNode.kind === kinds_mjs_1.Kind.LIST) {
      var coercedValues = [];
      for (var _i2 = 0, _valueNode$values2 = valueNode.values; _i2 < _valueNode$values2.length; _i2++) {
        var itemNode = _valueNode$values2[_i2];
        if (isMissingVariable(itemNode, variables)) {
          if (definition_mjs_1.isNonNullType(itemType)) {
            return;
          }
          coercedValues.push(null);
        } else {
          var itemValue = valueFromAST(itemNode, itemType, variables);
          if (itemValue === undefined) {
            return;
          }
          coercedValues.push(itemValue);
        }
      }
      return coercedValues;
    }
    var coercedValue = valueFromAST(valueNode, itemType, variables);
    if (coercedValue === undefined) {
      return;
    }
    return [coercedValue];
  }
  if (definition_mjs_1.isInputObjectType(type)) {
    if (valueNode.kind !== kinds_mjs_1.Kind.OBJECT) {
      return;
    }
    var coercedObj = Object.create(null);
    var fieldNodes = keyMap_mjs_1d.default(valueNode.fields, function (field) {
      return field.name.value;
    });
    for (var _i4 = 0, _objectValues2 = objectValues_mjs_1d.default(type.getFields()); _i4 < _objectValues2.length; _i4++) {
      var field = _objectValues2[_i4];
      var fieldNode = fieldNodes[field.name];
      if (!fieldNode || isMissingVariable(fieldNode.value, variables)) {
        if (field.defaultValue !== undefined) {
          coercedObj[field.name] = field.defaultValue;
        } else if (definition_mjs_1.isNonNullType(field.type)) {
          return;
        }
        continue;
      }
      var fieldValue = valueFromAST(fieldNode.value, field.type, variables);
      if (fieldValue === undefined) {
        return;
      }
      coercedObj[field.name] = fieldValue;
    }
    return coercedObj;
  }
  if (definition_mjs_1.isLeafType(type)) {
    var result;
    try {
      result = type.parseLiteral(valueNode, variables);
    } catch (_error) {
      return;
    }
    if (result === undefined) {
      return;
    }
    return result;
  }
  invariant_mjs_1d.default(false, 'Unexpected input type: ' + inspect_mjs_1d.default(type));
}
exports.valueFromAST = valueFromAST;
function isMissingVariable(valueNode, variables) {
  return valueNode.kind === kinds_mjs_1.Kind.VARIABLE && (variables == null || variables[valueNode.name.value] === undefined);
}

},

// node_modules/graphql/utilities/valueFromASTUntyped.mjs @151
151: function(__fusereq, exports, module){
exports.__esModule = true;
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var keyValMap_mjs_1 = __fusereq(181);
var keyValMap_mjs_1d = __fuse.dt(keyValMap_mjs_1);
var kinds_mjs_1 = __fusereq(91);
function valueFromASTUntyped(valueNode, variables) {
  switch (valueNode.kind) {
    case kinds_mjs_1.Kind.NULL:
      return null;
    case kinds_mjs_1.Kind.INT:
      return parseInt(valueNode.value, 10);
    case kinds_mjs_1.Kind.FLOAT:
      return parseFloat(valueNode.value);
    case kinds_mjs_1.Kind.STRING:
    case kinds_mjs_1.Kind.ENUM:
    case kinds_mjs_1.Kind.BOOLEAN:
      return valueNode.value;
    case kinds_mjs_1.Kind.LIST:
      return valueNode.values.map(function (node) {
        return valueFromASTUntyped(node, variables);
      });
    case kinds_mjs_1.Kind.OBJECT:
      return keyValMap_mjs_1d.default(valueNode.fields, function (field) {
        return field.name.value;
      }, function (field) {
        return valueFromASTUntyped(field.value, variables);
      });
    case kinds_mjs_1.Kind.VARIABLE:
      return variables === null || variables === void 0 ? void 0 : variables[valueNode.name.value];
  }
  invariant_mjs_1d.default(false, 'Unexpected value node: ' + inspect_mjs_1d.default(valueNode));
}
exports.valueFromASTUntyped = valueFromASTUntyped;

},

// node_modules/graphql/utilities/astFromValue.mjs @152
152: function(__fusereq, exports, module){
exports.__esModule = true;
var isFinite_mjs_1 = __fusereq(186);
var isFinite_mjs_1d = __fuse.dt(isFinite_mjs_1);
var arrayFrom_mjs_1 = __fusereq(168);
var arrayFrom_mjs_1d = __fuse.dt(arrayFrom_mjs_1);
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var isObjectLike_mjs_1 = __fusereq(171);
var isObjectLike_mjs_1d = __fuse.dt(isObjectLike_mjs_1);
var isCollection_mjs_1 = __fusereq(172);
var isCollection_mjs_1d = __fuse.dt(isCollection_mjs_1);
var kinds_mjs_1 = __fusereq(91);
var scalars_mjs_1 = __fusereq(86);
var definition_mjs_1 = __fusereq(84);
function astFromValue(value, type) {
  if (definition_mjs_1.isNonNullType(type)) {
    var astValue = astFromValue(value, type.ofType);
    if ((astValue === null || astValue === void 0 ? void 0 : astValue.kind) === kinds_mjs_1.Kind.NULL) {
      return null;
    }
    return astValue;
  }
  if (value === null) {
    return {
      kind: kinds_mjs_1.Kind.NULL
    };
  }
  if (value === undefined) {
    return null;
  }
  if (definition_mjs_1.isListType(type)) {
    var itemType = type.ofType;
    if (isCollection_mjs_1d.default(value)) {
      var valuesNodes = [];
      for (var _i2 = 0, _arrayFrom2 = arrayFrom_mjs_1d.default(value); _i2 < _arrayFrom2.length; _i2++) {
        var item = _arrayFrom2[_i2];
        var itemNode = astFromValue(item, itemType);
        if (itemNode != null) {
          valuesNodes.push(itemNode);
        }
      }
      return {
        kind: kinds_mjs_1.Kind.LIST,
        values: valuesNodes
      };
    }
    return astFromValue(value, itemType);
  }
  if (definition_mjs_1.isInputObjectType(type)) {
    if (!isObjectLike_mjs_1d.default(value)) {
      return null;
    }
    var fieldNodes = [];
    for (var _i4 = 0, _objectValues2 = objectValues_mjs_1d.default(type.getFields()); _i4 < _objectValues2.length; _i4++) {
      var field = _objectValues2[_i4];
      var fieldValue = astFromValue(value[field.name], field.type);
      if (fieldValue) {
        fieldNodes.push({
          kind: kinds_mjs_1.Kind.OBJECT_FIELD,
          name: {
            kind: kinds_mjs_1.Kind.NAME,
            value: field.name
          },
          value: fieldValue
        });
      }
    }
    return {
      kind: kinds_mjs_1.Kind.OBJECT,
      fields: fieldNodes
    };
  }
  if (definition_mjs_1.isLeafType(type)) {
    var serialized = type.serialize(value);
    if (serialized == null) {
      return null;
    }
    if (typeof serialized === 'boolean') {
      return {
        kind: kinds_mjs_1.Kind.BOOLEAN,
        value: serialized
      };
    }
    if (typeof serialized === 'number' && isFinite_mjs_1d.default(serialized)) {
      var stringNum = String(serialized);
      return integerStringRegExp.test(stringNum) ? {
        kind: kinds_mjs_1.Kind.INT,
        value: stringNum
      } : {
        kind: kinds_mjs_1.Kind.FLOAT,
        value: stringNum
      };
    }
    if (typeof serialized === 'string') {
      if (definition_mjs_1.isEnumType(type)) {
        return {
          kind: kinds_mjs_1.Kind.ENUM,
          value: serialized
        };
      }
      if (type === scalars_mjs_1.GraphQLID && integerStringRegExp.test(serialized)) {
        return {
          kind: kinds_mjs_1.Kind.INT,
          value: serialized
        };
      }
      return {
        kind: kinds_mjs_1.Kind.STRING,
        value: serialized
      };
    }
    throw new TypeError(("Cannot convert value to AST: ").concat(inspect_mjs_1d.default(serialized), "."));
  }
  invariant_mjs_1d.default(false, 'Unexpected input type: ' + inspect_mjs_1d.default(type));
}
exports.astFromValue = astFromValue;
var integerStringRegExp = /^-?(?:0|[1-9][0-9]*)$/;

},

// node_modules/graphql/utilities/TypeInfo.mjs @153
153: function(__fusereq, exports, module){
exports.__esModule = true;
var find_mjs_1 = __fusereq(165);
var find_mjs_1d = __fuse.dt(find_mjs_1);
var kinds_mjs_1 = __fusereq(91);
var visitor_mjs_1 = __fusereq(95);
var ast_mjs_1 = __fusereq(164);
var definition_mjs_1 = __fusereq(84);
var introspection_mjs_1 = __fusereq(87);
var typeFromAST_mjs_1 = __fusereq(149);
exports.TypeInfo = (function () {
  function TypeInfo(schema, getFieldDefFn, initialType) {
    this._schema = schema;
    this._typeStack = [];
    this._parentTypeStack = [];
    this._inputTypeStack = [];
    this._fieldDefStack = [];
    this._defaultValueStack = [];
    this._directive = null;
    this._argument = null;
    this._enumValue = null;
    this._getFieldDef = getFieldDefFn !== null && getFieldDefFn !== void 0 ? getFieldDefFn : getFieldDef;
    if (initialType) {
      if (definition_mjs_1.isInputType(initialType)) {
        this._inputTypeStack.push(initialType);
      }
      if (definition_mjs_1.isCompositeType(initialType)) {
        this._parentTypeStack.push(initialType);
      }
      if (definition_mjs_1.isOutputType(initialType)) {
        this._typeStack.push(initialType);
      }
    }
  }
  var _proto = TypeInfo.prototype;
  _proto.getType = function getType() {
    if (this._typeStack.length > 0) {
      return this._typeStack[this._typeStack.length - 1];
    }
  };
  _proto.getParentType = function getParentType() {
    if (this._parentTypeStack.length > 0) {
      return this._parentTypeStack[this._parentTypeStack.length - 1];
    }
  };
  _proto.getInputType = function getInputType() {
    if (this._inputTypeStack.length > 0) {
      return this._inputTypeStack[this._inputTypeStack.length - 1];
    }
  };
  _proto.getParentInputType = function getParentInputType() {
    if (this._inputTypeStack.length > 1) {
      return this._inputTypeStack[this._inputTypeStack.length - 2];
    }
  };
  _proto.getFieldDef = function getFieldDef() {
    if (this._fieldDefStack.length > 0) {
      return this._fieldDefStack[this._fieldDefStack.length - 1];
    }
  };
  _proto.getDefaultValue = function getDefaultValue() {
    if (this._defaultValueStack.length > 0) {
      return this._defaultValueStack[this._defaultValueStack.length - 1];
    }
  };
  _proto.getDirective = function getDirective() {
    return this._directive;
  };
  _proto.getArgument = function getArgument() {
    return this._argument;
  };
  _proto.getEnumValue = function getEnumValue() {
    return this._enumValue;
  };
  _proto.enter = function enter(node) {
    var schema = this._schema;
    switch (node.kind) {
      case kinds_mjs_1.Kind.SELECTION_SET:
        {
          var namedType = definition_mjs_1.getNamedType(this.getType());
          this._parentTypeStack.push(definition_mjs_1.isCompositeType(namedType) ? namedType : undefined);
          break;
        }
      case kinds_mjs_1.Kind.FIELD:
        {
          var parentType = this.getParentType();
          var fieldDef;
          var fieldType;
          if (parentType) {
            fieldDef = this._getFieldDef(schema, parentType, node);
            if (fieldDef) {
              fieldType = fieldDef.type;
            }
          }
          this._fieldDefStack.push(fieldDef);
          this._typeStack.push(definition_mjs_1.isOutputType(fieldType) ? fieldType : undefined);
          break;
        }
      case kinds_mjs_1.Kind.DIRECTIVE:
        this._directive = schema.getDirective(node.name.value);
        break;
      case kinds_mjs_1.Kind.OPERATION_DEFINITION:
        {
          var type;
          switch (node.operation) {
            case 'query':
              type = schema.getQueryType();
              break;
            case 'mutation':
              type = schema.getMutationType();
              break;
            case 'subscription':
              type = schema.getSubscriptionType();
              break;
          }
          this._typeStack.push(definition_mjs_1.isObjectType(type) ? type : undefined);
          break;
        }
      case kinds_mjs_1.Kind.INLINE_FRAGMENT:
      case kinds_mjs_1.Kind.FRAGMENT_DEFINITION:
        {
          var typeConditionAST = node.typeCondition;
          var outputType = typeConditionAST ? typeFromAST_mjs_1.typeFromAST(schema, typeConditionAST) : definition_mjs_1.getNamedType(this.getType());
          this._typeStack.push(definition_mjs_1.isOutputType(outputType) ? outputType : undefined);
          break;
        }
      case kinds_mjs_1.Kind.VARIABLE_DEFINITION:
        {
          var inputType = typeFromAST_mjs_1.typeFromAST(schema, node.type);
          this._inputTypeStack.push(definition_mjs_1.isInputType(inputType) ? inputType : undefined);
          break;
        }
      case kinds_mjs_1.Kind.ARGUMENT:
        {
          var _this$getDirective;
          var argDef;
          var argType;
          var fieldOrDirective = (_this$getDirective = this.getDirective()) !== null && _this$getDirective !== void 0 ? _this$getDirective : this.getFieldDef();
          if (fieldOrDirective) {
            argDef = find_mjs_1d.default(fieldOrDirective.args, function (arg) {
              return arg.name === node.name.value;
            });
            if (argDef) {
              argType = argDef.type;
            }
          }
          this._argument = argDef;
          this._defaultValueStack.push(argDef ? argDef.defaultValue : undefined);
          this._inputTypeStack.push(definition_mjs_1.isInputType(argType) ? argType : undefined);
          break;
        }
      case kinds_mjs_1.Kind.LIST:
        {
          var listType = definition_mjs_1.getNullableType(this.getInputType());
          var itemType = definition_mjs_1.isListType(listType) ? listType.ofType : listType;
          this._defaultValueStack.push(undefined);
          this._inputTypeStack.push(definition_mjs_1.isInputType(itemType) ? itemType : undefined);
          break;
        }
      case kinds_mjs_1.Kind.OBJECT_FIELD:
        {
          var objectType = definition_mjs_1.getNamedType(this.getInputType());
          var inputFieldType;
          var inputField;
          if (definition_mjs_1.isInputObjectType(objectType)) {
            inputField = objectType.getFields()[node.name.value];
            if (inputField) {
              inputFieldType = inputField.type;
            }
          }
          this._defaultValueStack.push(inputField ? inputField.defaultValue : undefined);
          this._inputTypeStack.push(definition_mjs_1.isInputType(inputFieldType) ? inputFieldType : undefined);
          break;
        }
      case kinds_mjs_1.Kind.ENUM:
        {
          var enumType = definition_mjs_1.getNamedType(this.getInputType());
          var enumValue;
          if (definition_mjs_1.isEnumType(enumType)) {
            enumValue = enumType.getValue(node.value);
          }
          this._enumValue = enumValue;
          break;
        }
    }
  };
  _proto.leave = function leave(node) {
    switch (node.kind) {
      case kinds_mjs_1.Kind.SELECTION_SET:
        this._parentTypeStack.pop();
        break;
      case kinds_mjs_1.Kind.FIELD:
        this._fieldDefStack.pop();
        this._typeStack.pop();
        break;
      case kinds_mjs_1.Kind.DIRECTIVE:
        this._directive = null;
        break;
      case kinds_mjs_1.Kind.OPERATION_DEFINITION:
      case kinds_mjs_1.Kind.INLINE_FRAGMENT:
      case kinds_mjs_1.Kind.FRAGMENT_DEFINITION:
        this._typeStack.pop();
        break;
      case kinds_mjs_1.Kind.VARIABLE_DEFINITION:
        this._inputTypeStack.pop();
        break;
      case kinds_mjs_1.Kind.ARGUMENT:
        this._argument = null;
        this._defaultValueStack.pop();
        this._inputTypeStack.pop();
        break;
      case kinds_mjs_1.Kind.LIST:
      case kinds_mjs_1.Kind.OBJECT_FIELD:
        this._defaultValueStack.pop();
        this._inputTypeStack.pop();
        break;
      case kinds_mjs_1.Kind.ENUM:
        this._enumValue = null;
        break;
    }
  };
  return TypeInfo;
})();
function getFieldDef(schema, parentType, fieldNode) {
  var name = fieldNode.name.value;
  if (name === introspection_mjs_1.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
    return introspection_mjs_1.SchemaMetaFieldDef;
  }
  if (name === introspection_mjs_1.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return introspection_mjs_1.TypeMetaFieldDef;
  }
  if (name === introspection_mjs_1.TypeNameMetaFieldDef.name && definition_mjs_1.isCompositeType(parentType)) {
    return introspection_mjs_1.TypeNameMetaFieldDef;
  }
  if (definition_mjs_1.isObjectType(parentType) || definition_mjs_1.isInterfaceType(parentType)) {
    return parentType.getFields()[name];
  }
}
function visitWithTypeInfo(typeInfo, visitor) {
  return {
    enter: function enter(node) {
      typeInfo.enter(node);
      var fn = visitor_mjs_1.getVisitFn(visitor, node.kind, false);
      if (fn) {
        var result = fn.apply(visitor, arguments);
        if (result !== undefined) {
          typeInfo.leave(node);
          if (ast_mjs_1.isNode(result)) {
            typeInfo.enter(result);
          }
        }
        return result;
      }
    },
    leave: function leave(node) {
      var fn = visitor_mjs_1.getVisitFn(visitor, node.kind, true);
      var result;
      if (fn) {
        result = fn.apply(visitor, arguments);
      }
      typeInfo.leave(node);
      return result;
    }
  };
}
exports.visitWithTypeInfo = visitWithTypeInfo;

},

// node_modules/graphql/utilities/coerceInputValue.mjs @154
154: function(__fusereq, exports, module){
exports.__esModule = true;
var arrayFrom_mjs_1 = __fusereq(168);
var arrayFrom_mjs_1d = __fuse.dt(arrayFrom_mjs_1);
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var didYouMean_mjs_1 = __fusereq(182);
var didYouMean_mjs_1d = __fuse.dt(didYouMean_mjs_1);
var isObjectLike_mjs_1 = __fusereq(171);
var isObjectLike_mjs_1d = __fuse.dt(isObjectLike_mjs_1);
var isCollection_mjs_1 = __fusereq(172);
var isCollection_mjs_1d = __fuse.dt(isCollection_mjs_1);
var suggestionList_mjs_1 = __fusereq(185);
var suggestionList_mjs_1d = __fuse.dt(suggestionList_mjs_1);
var printPathArray_mjs_1 = __fusereq(189);
var printPathArray_mjs_1d = __fuse.dt(printPathArray_mjs_1);
var Path_mjs_1 = __fusereq(98);
var GraphQLError_mjs_1 = __fusereq(136);
var definition_mjs_1 = __fusereq(84);
function coerceInputValue(inputValue, type) {
  var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultOnError;
  return coerceInputValueImpl(inputValue, type, onError);
}
exports.coerceInputValue = coerceInputValue;
function defaultOnError(path, invalidValue, error) {
  var errorPrefix = 'Invalid value ' + inspect_mjs_1d.default(invalidValue);
  if (path.length > 0) {
    errorPrefix += (" at \"value").concat(printPathArray_mjs_1d.default(path), "\"");
  }
  error.message = errorPrefix + ': ' + error.message;
  throw error;
}
function coerceInputValueImpl(inputValue, type, onError, path) {
  if (definition_mjs_1.isNonNullType(type)) {
    if (inputValue != null) {
      return coerceInputValueImpl(inputValue, type.ofType, onError, path);
    }
    onError(Path_mjs_1.pathToArray(path), inputValue, new GraphQLError_mjs_1.GraphQLError(("Expected non-nullable type \"").concat(inspect_mjs_1d.default(type), "\" not to be null.")));
    return;
  }
  if (inputValue == null) {
    return null;
  }
  if (definition_mjs_1.isListType(type)) {
    var itemType = type.ofType;
    if (isCollection_mjs_1d.default(inputValue)) {
      return arrayFrom_mjs_1d.default(inputValue, function (itemValue, index) {
        var itemPath = Path_mjs_1.addPath(path, index);
        return coerceInputValueImpl(itemValue, itemType, onError, itemPath);
      });
    }
    return [coerceInputValueImpl(inputValue, itemType, onError, path)];
  }
  if (definition_mjs_1.isInputObjectType(type)) {
    if (!isObjectLike_mjs_1d.default(inputValue)) {
      onError(Path_mjs_1.pathToArray(path), inputValue, new GraphQLError_mjs_1.GraphQLError(("Expected type \"").concat(type.name, "\" to be an object.")));
      return;
    }
    var coercedValue = {};
    var fieldDefs = type.getFields();
    for (var _i2 = 0, _objectValues2 = objectValues_mjs_1d.default(fieldDefs); _i2 < _objectValues2.length; _i2++) {
      var field = _objectValues2[_i2];
      var fieldValue = inputValue[field.name];
      if (fieldValue === undefined) {
        if (field.defaultValue !== undefined) {
          coercedValue[field.name] = field.defaultValue;
        } else if (definition_mjs_1.isNonNullType(field.type)) {
          var typeStr = inspect_mjs_1d.default(field.type);
          onError(Path_mjs_1.pathToArray(path), inputValue, new GraphQLError_mjs_1.GraphQLError(("Field \"").concat(field.name, "\" of required type \"").concat(typeStr, "\" was not provided.")));
        }
        continue;
      }
      coercedValue[field.name] = coerceInputValueImpl(fieldValue, field.type, onError, Path_mjs_1.addPath(path, field.name));
    }
    for (var _i4 = 0, _Object$keys2 = Object.keys(inputValue); _i4 < _Object$keys2.length; _i4++) {
      var fieldName = _Object$keys2[_i4];
      if (!fieldDefs[fieldName]) {
        var suggestions = suggestionList_mjs_1d.default(fieldName, Object.keys(type.getFields()));
        onError(Path_mjs_1.pathToArray(path), inputValue, new GraphQLError_mjs_1.GraphQLError(("Field \"").concat(fieldName, "\" is not defined by type \"").concat(type.name, "\".") + didYouMean_mjs_1d.default(suggestions)));
      }
    }
    return coercedValue;
  }
  if (definition_mjs_1.isLeafType(type)) {
    var parseResult;
    try {
      parseResult = type.parseValue(inputValue);
    } catch (error) {
      if (error instanceof GraphQLError_mjs_1.GraphQLError) {
        onError(Path_mjs_1.pathToArray(path), inputValue, error);
      } else {
        onError(Path_mjs_1.pathToArray(path), inputValue, new GraphQLError_mjs_1.GraphQLError(("Expected type \"").concat(type.name, "\". ") + error.message, undefined, undefined, undefined, undefined, error));
      }
      return;
    }
    if (parseResult === undefined) {
      onError(Path_mjs_1.pathToArray(path), inputValue, new GraphQLError_mjs_1.GraphQLError(("Expected type \"").concat(type.name, "\".")));
    }
    return parseResult;
  }
  invariant_mjs_1d.default(false, 'Unexpected input type: ' + inspect_mjs_1d.default(type));
}

},

// node_modules/graphql/utilities/concatAST.mjs @155
155: function(__fusereq, exports, module){
exports.__esModule = true;
var flatMap_mjs_1 = __fusereq(166);
var flatMap_mjs_1d = __fuse.dt(flatMap_mjs_1);
function concatAST(asts) {
  return {
    kind: 'Document',
    definitions: flatMap_mjs_1d.default(asts, function (ast) {
      return ast.definitions;
    })
  };
}
exports.concatAST = concatAST;

},

// node_modules/graphql/utilities/separateOperations.mjs @156
156: function(__fusereq, exports, module){
exports.__esModule = true;
var kinds_mjs_1 = __fusereq(91);
var visitor_mjs_1 = __fusereq(95);
function separateOperations(documentAST) {
  var operations = [];
  var depGraph = Object.create(null);
  var fromName;
  visitor_mjs_1.visit(documentAST, {
    OperationDefinition: function OperationDefinition(node) {
      fromName = opName(node);
      operations.push(node);
    },
    FragmentDefinition: function FragmentDefinition(node) {
      fromName = node.name.value;
    },
    FragmentSpread: function FragmentSpread(node) {
      var toName = node.name.value;
      var dependents = depGraph[fromName];
      if (dependents === undefined) {
        dependents = depGraph[fromName] = Object.create(null);
      }
      dependents[toName] = true;
    }
  });
  var separatedDocumentASTs = Object.create(null);
  var _loop = function _loop(_i2) {
    var operation = operations[_i2];
    var operationName = opName(operation);
    var dependencies = Object.create(null);
    collectTransitiveDependencies(dependencies, depGraph, operationName);
    separatedDocumentASTs[operationName] = {
      kind: kinds_mjs_1.Kind.DOCUMENT,
      definitions: documentAST.definitions.filter(function (node) {
        return node === operation || node.kind === kinds_mjs_1.Kind.FRAGMENT_DEFINITION && dependencies[node.name.value];
      })
    };
  };
  for (var _i2 = 0; _i2 < operations.length; _i2++) {
    _loop(_i2);
  }
  return separatedDocumentASTs;
}
exports.separateOperations = separateOperations;
function opName(operation) {
  return operation.name ? operation.name.value : '';
}
function collectTransitiveDependencies(collected, depGraph, fromName) {
  var immediateDeps = depGraph[fromName];
  if (immediateDeps) {
    for (var _i4 = 0, _Object$keys2 = Object.keys(immediateDeps); _i4 < _Object$keys2.length; _i4++) {
      var toName = _Object$keys2[_i4];
      if (!collected[toName]) {
        collected[toName] = true;
        collectTransitiveDependencies(collected, depGraph, toName);
      }
    }
  }
}

},

// node_modules/graphql/utilities/stripIgnoredCharacters.mjs @157
157: function(__fusereq, exports, module){
exports.__esModule = true;
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var source_mjs_1 = __fusereq(88);
var tokenKind_mjs_1 = __fusereq(92);
var lexer_mjs_1 = __fusereq(93);
var blockString_mjs_1 = __fusereq(188);
function stripIgnoredCharacters(source) {
  var sourceObj = typeof source === 'string' ? new source_mjs_1.Source(source) : source;
  if (!(sourceObj instanceof source_mjs_1.Source)) {
    throw new TypeError(("Must provide string or Source. Received: ").concat(inspect_mjs_1d.default(sourceObj), "."));
  }
  var body = sourceObj.body;
  var lexer = new lexer_mjs_1.Lexer(sourceObj);
  var strippedBody = '';
  var wasLastAddedTokenNonPunctuator = false;
  while (lexer.advance().kind !== tokenKind_mjs_1.TokenKind.EOF) {
    var currentToken = lexer.token;
    var tokenKind = currentToken.kind;
    var isNonPunctuator = !lexer_mjs_1.isPunctuatorTokenKind(currentToken.kind);
    if (wasLastAddedTokenNonPunctuator) {
      if (isNonPunctuator || currentToken.kind === tokenKind_mjs_1.TokenKind.SPREAD) {
        strippedBody += ' ';
      }
    }
    var tokenBody = body.slice(currentToken.start, currentToken.end);
    if (tokenKind === tokenKind_mjs_1.TokenKind.BLOCK_STRING) {
      strippedBody += dedentBlockString(tokenBody);
    } else {
      strippedBody += tokenBody;
    }
    wasLastAddedTokenNonPunctuator = isNonPunctuator;
  }
  return strippedBody;
}
exports.stripIgnoredCharacters = stripIgnoredCharacters;
function dedentBlockString(blockStr) {
  var rawStr = blockStr.slice(3, -3);
  var body = blockString_mjs_1.dedentBlockStringValue(rawStr);
  var lines = body.split(/\r\n|[\n\r]/g);
  if (blockString_mjs_1.getBlockStringIndentation(lines) > 0) {
    body = '\n' + body;
  }
  var lastChar = body[body.length - 1];
  var hasTrailingQuote = lastChar === '"' && body.slice(-4) !== '\\"""';
  if (hasTrailingQuote || lastChar === '\\') {
    body += '\n';
  }
  return '"""' + body + '"""';
}

},

// node_modules/graphql/utilities/typeComparators.mjs @158
158: function(__fusereq, exports, module){
exports.__esModule = true;
var definition_mjs_1 = __fusereq(84);
function isEqualType(typeA, typeB) {
  if (typeA === typeB) {
    return true;
  }
  if (definition_mjs_1.isNonNullType(typeA) && definition_mjs_1.isNonNullType(typeB)) {
    return isEqualType(typeA.ofType, typeB.ofType);
  }
  if (definition_mjs_1.isListType(typeA) && definition_mjs_1.isListType(typeB)) {
    return isEqualType(typeA.ofType, typeB.ofType);
  }
  return false;
}
exports.isEqualType = isEqualType;
function isTypeSubTypeOf(schema, maybeSubType, superType) {
  if (maybeSubType === superType) {
    return true;
  }
  if (definition_mjs_1.isNonNullType(superType)) {
    if (definition_mjs_1.isNonNullType(maybeSubType)) {
      return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
    }
    return false;
  }
  if (definition_mjs_1.isNonNullType(maybeSubType)) {
    return isTypeSubTypeOf(schema, maybeSubType.ofType, superType);
  }
  if (definition_mjs_1.isListType(superType)) {
    if (definition_mjs_1.isListType(maybeSubType)) {
      return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
    }
    return false;
  }
  if (definition_mjs_1.isListType(maybeSubType)) {
    return false;
  }
  return definition_mjs_1.isAbstractType(superType) && (definition_mjs_1.isInterfaceType(maybeSubType) || definition_mjs_1.isObjectType(maybeSubType)) && schema.isSubType(superType, maybeSubType);
}
exports.isTypeSubTypeOf = isTypeSubTypeOf;
function doTypesOverlap(schema, typeA, typeB) {
  if (typeA === typeB) {
    return true;
  }
  if (definition_mjs_1.isAbstractType(typeA)) {
    if (definition_mjs_1.isAbstractType(typeB)) {
      return schema.getPossibleTypes(typeA).some(function (type) {
        return schema.isSubType(typeB, type);
      });
    }
    return schema.isSubType(typeA, typeB);
  }
  if (definition_mjs_1.isAbstractType(typeB)) {
    return schema.isSubType(typeB, typeA);
  }
  return false;
}
exports.doTypesOverlap = doTypesOverlap;

},

// node_modules/graphql/utilities/assertValidName.mjs @159
159: function(__fusereq, exports, module){
exports.__esModule = true;
var devAssert_mjs_1 = __fusereq(162);
var devAssert_mjs_1d = __fuse.dt(devAssert_mjs_1);
var GraphQLError_mjs_1 = __fusereq(136);
var NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
function assertValidName(name) {
  var error = isValidNameError(name);
  if (error) {
    throw error;
  }
  return name;
}
exports.assertValidName = assertValidName;
function isValidNameError(name) {
  typeof name === 'string' || devAssert_mjs_1d.default(0, 'Expected name to be a string.');
  if (name.length > 1 && name[0] === '_' && name[1] === '_') {
    return new GraphQLError_mjs_1.GraphQLError(("Name \"").concat(name, "\" must not begin with \"__\", which is reserved by GraphQL introspection."));
  }
  if (!NAME_RX.test(name)) {
    return new GraphQLError_mjs_1.GraphQLError(("Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but \"").concat(name, "\" does not."));
  }
}
exports.isValidNameError = isValidNameError;

},

// node_modules/graphql/utilities/findBreakingChanges.mjs @160
160: function(__fusereq, exports, module){
exports.__esModule = true;
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if ((key in obj)) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var objectValues_mjs_1 = __fusereq(167);
var objectValues_mjs_1d = __fuse.dt(objectValues_mjs_1);
var keyMap_mjs_1 = __fusereq(179);
var keyMap_mjs_1d = __fuse.dt(keyMap_mjs_1);
var inspect_mjs_1 = __fusereq(163);
var inspect_mjs_1d = __fuse.dt(inspect_mjs_1);
var invariant_mjs_1 = __fusereq(170);
var invariant_mjs_1d = __fuse.dt(invariant_mjs_1);
var printer_mjs_1 = __fusereq(94);
var visitor_mjs_1 = __fusereq(95);
var scalars_mjs_1 = __fusereq(86);
var definition_mjs_1 = __fusereq(84);
var astFromValue_mjs_1 = __fusereq(152);
exports.BreakingChangeType = Object.freeze({
  TYPE_REMOVED: 'TYPE_REMOVED',
  TYPE_CHANGED_KIND: 'TYPE_CHANGED_KIND',
  TYPE_REMOVED_FROM_UNION: 'TYPE_REMOVED_FROM_UNION',
  VALUE_REMOVED_FROM_ENUM: 'VALUE_REMOVED_FROM_ENUM',
  REQUIRED_INPUT_FIELD_ADDED: 'REQUIRED_INPUT_FIELD_ADDED',
  IMPLEMENTED_INTERFACE_REMOVED: 'IMPLEMENTED_INTERFACE_REMOVED',
  FIELD_REMOVED: 'FIELD_REMOVED',
  FIELD_CHANGED_KIND: 'FIELD_CHANGED_KIND',
  REQUIRED_ARG_ADDED: 'REQUIRED_ARG_ADDED',
  ARG_REMOVED: 'ARG_REMOVED',
  ARG_CHANGED_KIND: 'ARG_CHANGED_KIND',
  DIRECTIVE_REMOVED: 'DIRECTIVE_REMOVED',
  DIRECTIVE_ARG_REMOVED: 'DIRECTIVE_ARG_REMOVED',
  REQUIRED_DIRECTIVE_ARG_ADDED: 'REQUIRED_DIRECTIVE_ARG_ADDED',
  DIRECTIVE_REPEATABLE_REMOVED: 'DIRECTIVE_REPEATABLE_REMOVED',
  DIRECTIVE_LOCATION_REMOVED: 'DIRECTIVE_LOCATION_REMOVED'
});
exports.DangerousChangeType = Object.freeze({
  VALUE_ADDED_TO_ENUM: 'VALUE_ADDED_TO_ENUM',
  TYPE_ADDED_TO_UNION: 'TYPE_ADDED_TO_UNION',
  OPTIONAL_INPUT_FIELD_ADDED: 'OPTIONAL_INPUT_FIELD_ADDED',
  OPTIONAL_ARG_ADDED: 'OPTIONAL_ARG_ADDED',
  IMPLEMENTED_INTERFACE_ADDED: 'IMPLEMENTED_INTERFACE_ADDED',
  ARG_DEFAULT_VALUE_CHANGE: 'ARG_DEFAULT_VALUE_CHANGE'
});
function findBreakingChanges(oldSchema, newSchema) {
  var breakingChanges = findSchemaChanges(oldSchema, newSchema).filter(function (change) {
    return (change.type in exports.BreakingChangeType);
  });
  return breakingChanges;
}
exports.findBreakingChanges = findBreakingChanges;
function findDangerousChanges(oldSchema, newSchema) {
  var dangerousChanges = findSchemaChanges(oldSchema, newSchema).filter(function (change) {
    return (change.type in exports.DangerousChangeType);
  });
  return dangerousChanges;
}
exports.findDangerousChanges = findDangerousChanges;
function findSchemaChanges(oldSchema, newSchema) {
  return [].concat(findTypeChanges(oldSchema, newSchema), findDirectiveChanges(oldSchema, newSchema));
}
function findDirectiveChanges(oldSchema, newSchema) {
  var schemaChanges = [];
  var directivesDiff = diff(oldSchema.getDirectives(), newSchema.getDirectives());
  for (var _i2 = 0, _directivesDiff$remov2 = directivesDiff.removed; _i2 < _directivesDiff$remov2.length; _i2++) {
    var oldDirective = _directivesDiff$remov2[_i2];
    schemaChanges.push({
      type: exports.BreakingChangeType.DIRECTIVE_REMOVED,
      description: ("").concat(oldDirective.name, " was removed.")
    });
  }
  for (var _i4 = 0, _directivesDiff$persi2 = directivesDiff.persisted; _i4 < _directivesDiff$persi2.length; _i4++) {
    var _ref2 = _directivesDiff$persi2[_i4];
    var _oldDirective = _ref2[0];
    var newDirective = _ref2[1];
    var argsDiff = diff(_oldDirective.args, newDirective.args);
    for (var _i6 = 0, _argsDiff$added2 = argsDiff.added; _i6 < _argsDiff$added2.length; _i6++) {
      var newArg = _argsDiff$added2[_i6];
      if (definition_mjs_1.isRequiredArgument(newArg)) {
        schemaChanges.push({
          type: exports.BreakingChangeType.REQUIRED_DIRECTIVE_ARG_ADDED,
          description: ("A required arg ").concat(newArg.name, " on directive ").concat(_oldDirective.name, " was added.")
        });
      }
    }
    for (var _i8 = 0, _argsDiff$removed2 = argsDiff.removed; _i8 < _argsDiff$removed2.length; _i8++) {
      var oldArg = _argsDiff$removed2[_i8];
      schemaChanges.push({
        type: exports.BreakingChangeType.DIRECTIVE_ARG_REMOVED,
        description: ("").concat(oldArg.name, " was removed from ").concat(_oldDirective.name, ".")
      });
    }
    if (_oldDirective.isRepeatable && !newDirective.isRepeatable) {
      schemaChanges.push({
        type: exports.BreakingChangeType.DIRECTIVE_REPEATABLE_REMOVED,
        description: ("Repeatable flag was removed from ").concat(_oldDirective.name, ".")
      });
    }
    for (var _i10 = 0, _oldDirective$locatio2 = _oldDirective.locations; _i10 < _oldDirective$locatio2.length; _i10++) {
      var location = _oldDirective$locatio2[_i10];
      if (newDirective.locations.indexOf(location) === -1) {
        schemaChanges.push({
          type: exports.BreakingChangeType.DIRECTIVE_LOCATION_REMOVED,
          description: ("").concat(location, " was removed from ").concat(_oldDirective.name, ".")
        });
      }
    }
  }
  return schemaChanges;
}
function findTypeChanges(oldSchema, newSchema) {
  var schemaChanges = [];
  var typesDiff = diff(objectValues_mjs_1d.default(oldSchema.getTypeMap()), objectValues_mjs_1d.default(newSchema.getTypeMap()));
  for (var _i12 = 0, _typesDiff$removed2 = typesDiff.removed; _i12 < _typesDiff$removed2.length; _i12++) {
    var oldType = _typesDiff$removed2[_i12];
    schemaChanges.push({
      type: exports.BreakingChangeType.TYPE_REMOVED,
      description: scalars_mjs_1.isSpecifiedScalarType(oldType) ? ("Standard scalar ").concat(oldType.name, " was removed because it is not referenced anymore.") : ("").concat(oldType.name, " was removed.")
    });
  }
  for (var _i14 = 0, _typesDiff$persisted2 = typesDiff.persisted; _i14 < _typesDiff$persisted2.length; _i14++) {
    var _ref4 = _typesDiff$persisted2[_i14];
    var _oldType = _ref4[0];
    var newType = _ref4[1];
    if (definition_mjs_1.isEnumType(_oldType) && definition_mjs_1.isEnumType(newType)) {
      schemaChanges.push.apply(schemaChanges, findEnumTypeChanges(_oldType, newType));
    } else if (definition_mjs_1.isUnionType(_oldType) && definition_mjs_1.isUnionType(newType)) {
      schemaChanges.push.apply(schemaChanges, findUnionTypeChanges(_oldType, newType));
    } else if (definition_mjs_1.isInputObjectType(_oldType) && definition_mjs_1.isInputObjectType(newType)) {
      schemaChanges.push.apply(schemaChanges, findInputObjectTypeChanges(_oldType, newType));
    } else if (definition_mjs_1.isObjectType(_oldType) && definition_mjs_1.isObjectType(newType)) {
      schemaChanges.push.apply(schemaChanges, findFieldChanges(_oldType, newType).concat(findImplementedInterfacesChanges(_oldType, newType)));
    } else if (definition_mjs_1.isInterfaceType(_oldType) && definition_mjs_1.isInterfaceType(newType)) {
      schemaChanges.push.apply(schemaChanges, findFieldChanges(_oldType, newType).concat(findImplementedInterfacesChanges(_oldType, newType)));
    } else if (_oldType.constructor !== newType.constructor) {
      schemaChanges.push({
        type: exports.BreakingChangeType.TYPE_CHANGED_KIND,
        description: ("").concat(_oldType.name, " changed from ") + ("").concat(typeKindName(_oldType), " to ").concat(typeKindName(newType), ".")
      });
    }
  }
  return schemaChanges;
}
function findInputObjectTypeChanges(oldType, newType) {
  var schemaChanges = [];
  var fieldsDiff = diff(objectValues_mjs_1d.default(oldType.getFields()), objectValues_mjs_1d.default(newType.getFields()));
  for (var _i16 = 0, _fieldsDiff$added2 = fieldsDiff.added; _i16 < _fieldsDiff$added2.length; _i16++) {
    var newField = _fieldsDiff$added2[_i16];
    if (definition_mjs_1.isRequiredInputField(newField)) {
      schemaChanges.push({
        type: exports.BreakingChangeType.REQUIRED_INPUT_FIELD_ADDED,
        description: ("A required field ").concat(newField.name, " on input type ").concat(oldType.name, " was added.")
      });
    } else {
      schemaChanges.push({
        type: exports.DangerousChangeType.OPTIONAL_INPUT_FIELD_ADDED,
        description: ("An optional field ").concat(newField.name, " on input type ").concat(oldType.name, " was added.")
      });
    }
  }
  for (var _i18 = 0, _fieldsDiff$removed2 = fieldsDiff.removed; _i18 < _fieldsDiff$removed2.length; _i18++) {
    var oldField = _fieldsDiff$removed2[_i18];
    schemaChanges.push({
      type: exports.BreakingChangeType.FIELD_REMOVED,
      description: ("").concat(oldType.name, ".").concat(oldField.name, " was removed.")
    });
  }
  for (var _i20 = 0, _fieldsDiff$persisted2 = fieldsDiff.persisted; _i20 < _fieldsDiff$persisted2.length; _i20++) {
    var _ref6 = _fieldsDiff$persisted2[_i20];
    var _oldField = _ref6[0];
    var _newField = _ref6[1];
    var isSafe = isChangeSafeForInputObjectFieldOrFieldArg(_oldField.type, _newField.type);
    if (!isSafe) {
      schemaChanges.push({
        type: exports.BreakingChangeType.FIELD_CHANGED_KIND,
        description: ("").concat(oldType.name, ".").concat(_oldField.name, " changed type from ") + ("").concat(String(_oldField.type), " to ").concat(String(_newField.type), ".")
      });
    }
  }
  return schemaChanges;
}
function findUnionTypeChanges(oldType, newType) {
  var schemaChanges = [];
  var possibleTypesDiff = diff(oldType.getTypes(), newType.getTypes());
  for (var _i22 = 0, _possibleTypesDiff$ad2 = possibleTypesDiff.added; _i22 < _possibleTypesDiff$ad2.length; _i22++) {
    var newPossibleType = _possibleTypesDiff$ad2[_i22];
    schemaChanges.push({
      type: exports.DangerousChangeType.TYPE_ADDED_TO_UNION,
      description: ("").concat(newPossibleType.name, " was added to union type ").concat(oldType.name, ".")
    });
  }
  for (var _i24 = 0, _possibleTypesDiff$re2 = possibleTypesDiff.removed; _i24 < _possibleTypesDiff$re2.length; _i24++) {
    var oldPossibleType = _possibleTypesDiff$re2[_i24];
    schemaChanges.push({
      type: exports.BreakingChangeType.TYPE_REMOVED_FROM_UNION,
      description: ("").concat(oldPossibleType.name, " was removed from union type ").concat(oldType.name, ".")
    });
  }
  return schemaChanges;
}
function findEnumTypeChanges(oldType, newType) {
  var schemaChanges = [];
  var valuesDiff = diff(oldType.getValues(), newType.getValues());
  for (var _i26 = 0, _valuesDiff$added2 = valuesDiff.added; _i26 < _valuesDiff$added2.length; _i26++) {
    var newValue = _valuesDiff$added2[_i26];
    schemaChanges.push({
      type: exports.DangerousChangeType.VALUE_ADDED_TO_ENUM,
      description: ("").concat(newValue.name, " was added to enum type ").concat(oldType.name, ".")
    });
  }
  for (var _i28 = 0, _valuesDiff$removed2 = valuesDiff.removed; _i28 < _valuesDiff$removed2.length; _i28++) {
    var oldValue = _valuesDiff$removed2[_i28];
    schemaChanges.push({
      type: exports.BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
      description: ("").concat(oldValue.name, " was removed from enum type ").concat(oldType.name, ".")
    });
  }
  return schemaChanges;
}
function findImplementedInterfacesChanges(oldType, newType) {
  var schemaChanges = [];
  var interfacesDiff = diff(oldType.getInterfaces(), newType.getInterfaces());
  for (var _i30 = 0, _interfacesDiff$added2 = interfacesDiff.added; _i30 < _interfacesDiff$added2.length; _i30++) {
    var newInterface = _interfacesDiff$added2[_i30];
    schemaChanges.push({
      type: exports.DangerousChangeType.IMPLEMENTED_INTERFACE_ADDED,
      description: ("").concat(newInterface.name, " added to interfaces implemented by ").concat(oldType.name, ".")
    });
  }
  for (var _i32 = 0, _interfacesDiff$remov2 = interfacesDiff.removed; _i32 < _interfacesDiff$remov2.length; _i32++) {
    var oldInterface = _interfacesDiff$remov2[_i32];
    schemaChanges.push({
      type: exports.BreakingChangeType.IMPLEMENTED_INTERFACE_REMOVED,
      description: ("").concat(oldType.name, " no longer implements interface ").concat(oldInterface.name, ".")
    });
  }
  return schemaChanges;
}
function findFieldChanges(oldType, newType) {
  var schemaChanges = [];
  var fieldsDiff = diff(objectValues_mjs_1d.default(oldType.getFields()), objectValues_mjs_1d.default(newType.getFields()));
  for (var _i34 = 0, _fieldsDiff$removed4 = fieldsDiff.removed; _i34 < _fieldsDiff$removed4.length; _i34++) {
    var oldField = _fieldsDiff$removed4[_i34];
    schemaChanges.push({
      type: exports.BreakingChangeType.FIELD_REMOVED,
      description: ("").concat(oldType.name, ".").concat(oldField.name, " was removed.")
    });
  }
  for (var _i36 = 0, _fieldsDiff$persisted4 = fieldsDiff.persisted; _i36 < _fieldsDiff$persisted4.length; _i36++) {
    var _ref8 = _fieldsDiff$persisted4[_i36];
    var _oldField2 = _ref8[0];
    var newField = _ref8[1];
    schemaChanges.push.apply(schemaChanges, findArgChanges(oldType, _oldField2, newField));
    var isSafe = isChangeSafeForObjectOrInterfaceField(_oldField2.type, newField.type);
    if (!isSafe) {
      schemaChanges.push({
        type: exports.BreakingChangeType.FIELD_CHANGED_KIND,
        description: ("").concat(oldType.name, ".").concat(_oldField2.name, " changed type from ") + ("").concat(String(_oldField2.type), " to ").concat(String(newField.type), ".")
      });
    }
  }
  return schemaChanges;
}
function findArgChanges(oldType, oldField, newField) {
  var schemaChanges = [];
  var argsDiff = diff(oldField.args, newField.args);
  for (var _i38 = 0, _argsDiff$removed4 = argsDiff.removed; _i38 < _argsDiff$removed4.length; _i38++) {
    var oldArg = _argsDiff$removed4[_i38];
    schemaChanges.push({
      type: exports.BreakingChangeType.ARG_REMOVED,
      description: ("").concat(oldType.name, ".").concat(oldField.name, " arg ").concat(oldArg.name, " was removed.")
    });
  }
  for (var _i40 = 0, _argsDiff$persisted2 = argsDiff.persisted; _i40 < _argsDiff$persisted2.length; _i40++) {
    var _ref10 = _argsDiff$persisted2[_i40];
    var _oldArg = _ref10[0];
    var newArg = _ref10[1];
    var isSafe = isChangeSafeForInputObjectFieldOrFieldArg(_oldArg.type, newArg.type);
    if (!isSafe) {
      schemaChanges.push({
        type: exports.BreakingChangeType.ARG_CHANGED_KIND,
        description: ("").concat(oldType.name, ".").concat(oldField.name, " arg ").concat(_oldArg.name, " has changed type from ") + ("").concat(String(_oldArg.type), " to ").concat(String(newArg.type), ".")
      });
    } else if (_oldArg.defaultValue !== undefined) {
      if (newArg.defaultValue === undefined) {
        schemaChanges.push({
          type: exports.DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
          description: ("").concat(oldType.name, ".").concat(oldField.name, " arg ").concat(_oldArg.name, " defaultValue was removed.")
        });
      } else {
        var oldValueStr = stringifyValue(_oldArg.defaultValue, _oldArg.type);
        var newValueStr = stringifyValue(newArg.defaultValue, newArg.type);
        if (oldValueStr !== newValueStr) {
          schemaChanges.push({
            type: exports.DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
            description: ("").concat(oldType.name, ".").concat(oldField.name, " arg ").concat(_oldArg.name, " has changed defaultValue from ").concat(oldValueStr, " to ").concat(newValueStr, ".")
          });
        }
      }
    }
  }
  for (var _i42 = 0, _argsDiff$added4 = argsDiff.added; _i42 < _argsDiff$added4.length; _i42++) {
    var _newArg = _argsDiff$added4[_i42];
    if (definition_mjs_1.isRequiredArgument(_newArg)) {
      schemaChanges.push({
        type: exports.BreakingChangeType.REQUIRED_ARG_ADDED,
        description: ("A required arg ").concat(_newArg.name, " on ").concat(oldType.name, ".").concat(oldField.name, " was added.")
      });
    } else {
      schemaChanges.push({
        type: exports.DangerousChangeType.OPTIONAL_ARG_ADDED,
        description: ("An optional arg ").concat(_newArg.name, " on ").concat(oldType.name, ".").concat(oldField.name, " was added.")
      });
    }
  }
  return schemaChanges;
}
function isChangeSafeForObjectOrInterfaceField(oldType, newType) {
  if (definition_mjs_1.isListType(oldType)) {
    return definition_mjs_1.isListType(newType) && isChangeSafeForObjectOrInterfaceField(oldType.ofType, newType.ofType) || definition_mjs_1.isNonNullType(newType) && isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType);
  }
  if (definition_mjs_1.isNonNullType(oldType)) {
    return definition_mjs_1.isNonNullType(newType) && isChangeSafeForObjectOrInterfaceField(oldType.ofType, newType.ofType);
  }
  return definition_mjs_1.isNamedType(newType) && oldType.name === newType.name || definition_mjs_1.isNonNullType(newType) && isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType);
}
function isChangeSafeForInputObjectFieldOrFieldArg(oldType, newType) {
  if (definition_mjs_1.isListType(oldType)) {
    return definition_mjs_1.isListType(newType) && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType.ofType);
  }
  if (definition_mjs_1.isNonNullType(oldType)) {
    return definition_mjs_1.isNonNullType(newType) && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType.ofType) || !definition_mjs_1.isNonNullType(newType) && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType);
  }
  return definition_mjs_1.isNamedType(newType) && oldType.name === newType.name;
}
function typeKindName(type) {
  if (definition_mjs_1.isScalarType(type)) {
    return 'a Scalar type';
  }
  if (definition_mjs_1.isObjectType(type)) {
    return 'an Object type';
  }
  if (definition_mjs_1.isInterfaceType(type)) {
    return 'an Interface type';
  }
  if (definition_mjs_1.isUnionType(type)) {
    return 'a Union type';
  }
  if (definition_mjs_1.isEnumType(type)) {
    return 'an Enum type';
  }
  if (definition_mjs_1.isInputObjectType(type)) {
    return 'an Input type';
  }
  invariant_mjs_1d.default(false, 'Unexpected type: ' + inspect_mjs_1d.default(type));
}
function stringifyValue(value, type) {
  var ast = astFromValue_mjs_1.astFromValue(value, type);
  ast != null || invariant_mjs_1d.default(0);
  var sortedAST = visitor_mjs_1.visit(ast, {
    ObjectValue: function ObjectValue(objectNode) {
      var fields = [].concat(objectNode.fields).sort(function (fieldA, fieldB) {
        return fieldA.name.value.localeCompare(fieldB.name.value);
      });
      return _objectSpread({}, objectNode, {
        fields: fields
      });
    }
  });
  return printer_mjs_1.print(sortedAST);
}
function diff(oldArray, newArray) {
  var added = [];
  var removed = [];
  var persisted = [];
  var oldMap = keyMap_mjs_1d.default(oldArray, function (_ref11) {
    var name = _ref11.name;
    return name;
  });
  var newMap = keyMap_mjs_1d.default(newArray, function (_ref12) {
    var name = _ref12.name;
    return name;
  });
  for (var _i44 = 0; _i44 < oldArray.length; _i44++) {
    var oldItem = oldArray[_i44];
    var newItem = newMap[oldItem.name];
    if (newItem === undefined) {
      removed.push(oldItem);
    } else {
      persisted.push([oldItem, newItem]);
    }
  }
  for (var _i46 = 0; _i46 < newArray.length; _i46++) {
    var _newItem = newArray[_i46];
    if (oldMap[_newItem.name] === undefined) {
      added.push(_newItem);
    }
  }
  return {
    added: added,
    persisted: persisted,
    removed: removed
  };
}

},

// node_modules/graphql/utilities/findDeprecatedUsages.mjs @161
161: function(__fusereq, exports, module){
exports.__esModule = true;
var GraphQLError_mjs_1 = __fusereq(136);
var visitor_mjs_1 = __fusereq(95);
var definition_mjs_1 = __fusereq(84);
var TypeInfo_mjs_1 = __fusereq(153);
function findDeprecatedUsages(schema, ast) {
  var errors = [];
  var typeInfo = new TypeInfo_mjs_1.TypeInfo(schema);
  visitor_mjs_1.visit(ast, TypeInfo_mjs_1.visitWithTypeInfo(typeInfo, {
    Field: function Field(node) {
      var parentType = typeInfo.getParentType();
      var fieldDef = typeInfo.getFieldDef();
      if (parentType && (fieldDef === null || fieldDef === void 0 ? void 0 : fieldDef.deprecationReason) != null) {
        errors.push(new GraphQLError_mjs_1.GraphQLError(("The field \"").concat(parentType.name, ".").concat(fieldDef.name, "\" is deprecated. ") + fieldDef.deprecationReason, node));
      }
    },
    EnumValue: function EnumValue(node) {
      var type = definition_mjs_1.getNamedType(typeInfo.getInputType());
      var enumVal = typeInfo.getEnumValue();
      if (type && (enumVal === null || enumVal === void 0 ? void 0 : enumVal.deprecationReason) != null) {
        errors.push(new GraphQLError_mjs_1.GraphQLError(("The enum value \"").concat(type.name, ".").concat(enumVal.name, "\" is deprecated. ") + enumVal.deprecationReason, node));
      }
    }
  }));
  return errors;
}
exports.findDeprecatedUsages = findDeprecatedUsages;

},

// node_modules/graphql/jsutils/devAssert.mjs @162
162: function(__fusereq, exports, module){
exports.__esModule = true;
function devAssert(condition, message) {
  var booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(message);
  }
}
exports.default = devAssert;

},

// node_modules/graphql/jsutils/inspect.mjs @163
163: function(__fusereq, exports, module){
exports.__esModule = true;
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
var nodejsCustomInspectSymbol_mjs_1 = __fusereq(191);
var nodejsCustomInspectSymbol_mjs_1d = __fuse.dt(nodejsCustomInspectSymbol_mjs_1);
var MAX_ARRAY_LENGTH = 10;
var MAX_RECURSIVE_DEPTH = 2;
function inspect(value) {
  return formatValue(value, []);
}
exports.default = inspect;
function formatValue(value, seenValues) {
  switch (_typeof(value)) {
    case 'string':
      return JSON.stringify(value);
    case 'function':
      return value.name ? ("[function ").concat(value.name, "]") : '[function]';
    case 'object':
      if (value === null) {
        return 'null';
      }
      return formatObjectValue(value, seenValues);
    default:
      return String(value);
  }
}
function formatObjectValue(value, previouslySeenValues) {
  if (previouslySeenValues.indexOf(value) !== -1) {
    return '[Circular]';
  }
  var seenValues = [].concat(previouslySeenValues, [value]);
  var customInspectFn = getCustomFn(value);
  if (customInspectFn !== undefined) {
    var customValue = customInspectFn.call(value);
    if (customValue !== value) {
      return typeof customValue === 'string' ? customValue : formatValue(customValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }
  return formatObject(value, seenValues);
}
function formatObject(object, seenValues) {
  var keys = Object.keys(object);
  if (keys.length === 0) {
    return '{}';
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[' + getObjectTag(object) + ']';
  }
  var properties = keys.map(function (key) {
    var value = formatValue(object[key], seenValues);
    return key + ': ' + value;
  });
  return '{ ' + properties.join(', ') + ' }';
}
function formatArray(array, seenValues) {
  if (array.length === 0) {
    return '[]';
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[Array]';
  }
  var len = Math.min(MAX_ARRAY_LENGTH, array.length);
  var remaining = array.length - len;
  var items = [];
  for (var i = 0; i < len; ++i) {
    items.push(formatValue(array[i], seenValues));
  }
  if (remaining === 1) {
    items.push('... 1 more item');
  } else if (remaining > 1) {
    items.push(("... ").concat(remaining, " more items"));
  }
  return '[' + items.join(', ') + ']';
}
function getCustomFn(object) {
  var customInspectFn = object[String(nodejsCustomInspectSymbol_mjs_1d.default)];
  if (typeof customInspectFn === 'function') {
    return customInspectFn;
  }
  if (typeof object.inspect === 'function') {
    return object.inspect;
  }
}
function getObjectTag(object) {
  var tag = Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/]$/, '');
  if (tag === 'Object' && typeof object.constructor === 'function') {
    var name = object.constructor.name;
    if (typeof name === 'string' && name !== '') {
      return name;
    }
  }
  return tag;
}

},

// node_modules/graphql/language/ast.mjs @164
164: function(__fusereq, exports, module){
exports.__esModule = true;
var defineToJSON_mjs_1 = __fusereq(184);
var defineToJSON_mjs_1d = __fuse.dt(defineToJSON_mjs_1);
exports.Location = function Location(startToken, endToken, source) {
  this.start = startToken.start;
  this.end = endToken.end;
  this.startToken = startToken;
  this.endToken = endToken;
  this.source = source;
};
defineToJSON_mjs_1d.default(exports.Location, function () {
  return {
    start: this.start,
    end: this.end
  };
});
exports.Token = function Token(kind, start, end, line, column, prev, value) {
  this.kind = kind;
  this.start = start;
  this.end = end;
  this.line = line;
  this.column = column;
  this.value = value;
  this.prev = prev;
  this.next = null;
};
defineToJSON_mjs_1d.default(exports.Token, function () {
  return {
    kind: this.kind,
    value: this.value,
    line: this.line,
    column: this.column
  };
});
function isNode(maybeNode) {
  return maybeNode != null && typeof maybeNode.kind === 'string';
}
exports.isNode = isNode;

},

// node_modules/graphql/polyfills/find.mjs @165
165: function(__fusereq, exports, module){
exports.__esModule = true;
var find = Array.prototype.find ? function (list, predicate) {
  return Array.prototype.find.call(list, predicate);
} : function (list, predicate) {
  for (var _i2 = 0; _i2 < list.length; _i2++) {
    var value = list[_i2];
    if (predicate(value)) {
      return value;
    }
  }
};
exports.default = find;

},

// node_modules/graphql/polyfills/flatMap.mjs @166
166: function(__fusereq, exports, module){
exports.__esModule = true;
var flatMapMethod = Array.prototype.flatMap;
var flatMap = flatMapMethod ? function (list, fn) {
  return flatMapMethod.call(list, fn);
} : function (list, fn) {
  var result = [];
  for (var _i2 = 0; _i2 < list.length; _i2++) {
    var _item = list[_i2];
    var value = fn(_item);
    if (Array.isArray(value)) {
      result = result.concat(value);
    } else {
      result.push(value);
    }
  }
  return result;
};
exports.default = flatMap;

},

// node_modules/graphql/polyfills/objectValues.mjs @167
167: function(__fusereq, exports, module){
exports.__esModule = true;
var objectValues = Object.values || (function (obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
});
exports.default = objectValues;

},

// node_modules/graphql/polyfills/arrayFrom.mjs @168
168: function(__fusereq, exports, module){
exports.__esModule = true;
var symbols_mjs_1 = __fusereq(175);
var arrayFrom = Array.from || (function (obj, mapFn, thisArg) {
  if (obj == null) {
    throw new TypeError('Array.from requires an array-like object - not null or undefined');
  }
  var iteratorMethod = obj[symbols_mjs_1.SYMBOL_ITERATOR];
  if (typeof iteratorMethod === 'function') {
    var iterator = iteratorMethod.call(obj);
    var result = [];
    var step;
    for (var i = 0; !(step = iterator.next()).done; ++i) {
      result.push(mapFn.call(thisArg, step.value, i));
      if (i > 9999999) {
        throw new TypeError('Near-infinite iteration.');
      }
    }
    return result;
  }
  var length = obj.length;
  if (typeof length === 'number' && length >= 0 && length % 1 === 0) {
    var _result = [];
    for (var _i = 0; _i < length; ++_i) {
      if (Object.prototype.hasOwnProperty.call(obj, _i)) {
        _result.push(mapFn.call(thisArg, obj[_i], _i));
      }
    }
    return _result;
  }
  return [];
});
exports.default = arrayFrom;

},

// node_modules/graphql/jsutils/memoize3.mjs @169
169: function(__fusereq, exports, module){
exports.__esModule = true;
function memoize3(fn) {
  var cache0;
  function memoized(a1, a2, a3) {
    if (!cache0) {
      cache0 = new WeakMap();
    }
    var cache1 = cache0.get(a1);
    var cache2;
    if (cache1) {
      cache2 = cache1.get(a2);
      if (cache2) {
        var cachedValue = cache2.get(a3);
        if (cachedValue !== undefined) {
          return cachedValue;
        }
      }
    } else {
      cache1 = new WeakMap();
      cache0.set(a1, cache1);
    }
    if (!cache2) {
      cache2 = new WeakMap();
      cache1.set(a2, cache2);
    }
    var newValue = fn(a1, a2, a3);
    cache2.set(a3, newValue);
    return newValue;
  }
  return memoized;
}
exports.default = memoize3;

},

// node_modules/graphql/jsutils/invariant.mjs @170
170: function(__fusereq, exports, module){
exports.__esModule = true;
function invariant(condition, message) {
  var booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(message != null ? message : 'Unexpected invariant triggered.');
  }
}
exports.default = invariant;

},

// node_modules/graphql/jsutils/isObjectLike.mjs @171
171: function(__fusereq, exports, module){
exports.__esModule = true;
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
function isObjectLike(value) {
  return _typeof(value) == 'object' && value !== null;
}
exports.default = isObjectLike;

},

// node_modules/graphql/jsutils/isCollection.mjs @172
172: function(__fusereq, exports, module){
exports.__esModule = true;
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
var symbols_mjs_1 = __fusereq(175);
function isCollection(obj) {
  if (obj == null || _typeof(obj) !== 'object') {
    return false;
  }
  var length = obj.length;
  if (typeof length === 'number' && length >= 0 && length % 1 === 0) {
    return true;
  }
  return typeof obj[symbols_mjs_1.SYMBOL_ITERATOR] === 'function';
}
exports.default = isCollection;

},

// node_modules/graphql/jsutils/promiseReduce.mjs @173
173: function(__fusereq, exports, module){
exports.__esModule = true;
var isPromise_mjs_1 = __fusereq(78);
var isPromise_mjs_1d = __fuse.dt(isPromise_mjs_1);
function promiseReduce(values, callback, initialValue) {
  return values.reduce(function (previous, value) {
    return isPromise_mjs_1d.default(previous) ? previous.then(function (resolved) {
      return callback(resolved, value);
    }) : callback(previous, value);
  }, initialValue);
}
exports.default = promiseReduce;

},

// node_modules/graphql/jsutils/promiseForObject.mjs @174
174: function(__fusereq, exports, module){
exports.__esModule = true;
function promiseForObject(object) {
  var keys = Object.keys(object);
  var valuesAndPromises = keys.map(function (name) {
    return object[name];
  });
  return Promise.all(valuesAndPromises).then(function (values) {
    return values.reduce(function (resolvedObject, value, i) {
      resolvedObject[keys[i]] = value;
      return resolvedObject;
    }, Object.create(null));
  });
}
exports.default = promiseForObject;

},

// node_modules/graphql/polyfills/symbols.mjs @175
175: function(__fusereq, exports, module){
exports.__esModule = true;
exports.SYMBOL_ITERATOR = typeof Symbol === 'function' ? Symbol.iterator : '@@iterator';
exports.SYMBOL_ASYNC_ITERATOR = typeof Symbol === 'function' ? Symbol.asyncIterator : '@@asyncIterator';
exports.SYMBOL_TO_STRING_TAG = typeof Symbol === 'function' ? Symbol.toStringTag : '@@toStringTag';

},

// node_modules/graphql/jsutils/toObjMap.mjs @176
176: function(__fusereq, exports, module){
exports.__esModule = true;
var objectEntries_mjs_1 = __fusereq(178);
var objectEntries_mjs_1d = __fuse.dt(objectEntries_mjs_1);
function toObjMap(obj) {
  if (Object.getPrototypeOf(obj) === null) {
    return obj;
  }
  var map = Object.create(null);
  for (var _i2 = 0, _objectEntries2 = objectEntries_mjs_1d.default(obj); _i2 < _objectEntries2.length; _i2++) {
    var _ref2 = _objectEntries2[_i2];
    var key = _ref2[0];
    var value = _ref2[1];
    map[key] = value;
  }
  return map;
}
exports.default = toObjMap;

},

// node_modules/graphql/jsutils/instanceOf.mjs @177
177: function(__fusereq, exports, module){
exports.__esModule = true;
exports.default = process.env.NODE_ENV === 'production' ? function instanceOf(value, constructor) {
  return value instanceof constructor;
} : function instanceOf(value, constructor) {
  if (value instanceof constructor) {
    return true;
  }
  if (value) {
    var valueClass = value.constructor;
    var className = constructor.name;
    if (className && valueClass && valueClass.name === className) {
      throw new Error(("Cannot use ").concat(className, " \"").concat(value, "\" from another module or realm.\n\nEnsure that there is only one instance of \"graphql\" in the node_modules\ndirectory. If different versions of \"graphql\" are the dependencies of other\nrelied on modules, use \"resolutions\" to ensure only one version is installed.\n\nhttps://yarnpkg.com/en/docs/selective-version-resolutions\n\nDuplicate \"graphql\" modules cannot be used at the same time since different\nversions may have different capabilities and behavior. The data from one\nversion used in the function from another could produce confusing and\nspurious results."));
    }
  }
  return false;
};

},

// node_modules/graphql/polyfills/objectEntries.mjs @178
178: function(__fusereq, exports, module){
exports.__esModule = true;
var objectEntries = Object.entries || (function (obj) {
  return Object.keys(obj).map(function (key) {
    return [key, obj[key]];
  });
});
exports.default = objectEntries;

},

// node_modules/graphql/jsutils/keyMap.mjs @179
179: function(__fusereq, exports, module){
exports.__esModule = true;
function keyMap(list, keyFn) {
  return list.reduce(function (map, item) {
    map[keyFn(item)] = item;
    return map;
  }, Object.create(null));
}
exports.default = keyMap;

},

// node_modules/graphql/jsutils/mapValue.mjs @180
180: function(__fusereq, exports, module){
exports.__esModule = true;
var objectEntries_mjs_1 = __fusereq(178);
var objectEntries_mjs_1d = __fuse.dt(objectEntries_mjs_1);
function mapValue(map, fn) {
  var result = Object.create(null);
  for (var _i2 = 0, _objectEntries2 = objectEntries_mjs_1d.default(map); _i2 < _objectEntries2.length; _i2++) {
    var _ref2 = _objectEntries2[_i2];
    var _key = _ref2[0];
    var _value = _ref2[1];
    result[_key] = fn(_value, _key);
  }
  return result;
}
exports.default = mapValue;

},

// node_modules/graphql/jsutils/keyValMap.mjs @181
181: function(__fusereq, exports, module){
exports.__esModule = true;
function keyValMap(list, keyFn, valFn) {
  return list.reduce(function (map, item) {
    map[keyFn(item)] = valFn(item);
    return map;
  }, Object.create(null));
}
exports.default = keyValMap;

},

// node_modules/graphql/jsutils/didYouMean.mjs @182
182: function(__fusereq, exports, module){
exports.__esModule = true;
var MAX_SUGGESTIONS = 5;
function didYouMean(firstArg, secondArg) {
  var _ref = typeof firstArg === 'string' ? [firstArg, secondArg] : [undefined, firstArg], subMessage = _ref[0], suggestionsArg = _ref[1];
  var message = ' Did you mean ';
  if (subMessage) {
    message += subMessage + ' ';
  }
  var suggestions = suggestionsArg.map(function (x) {
    return ("\"").concat(x, "\"");
  });
  switch (suggestions.length) {
    case 0:
      return '';
    case 1:
      return message + suggestions[0] + '?';
    case 2:
      return message + suggestions[0] + ' or ' + suggestions[1] + '?';
  }
  var selected = suggestions.slice(0, MAX_SUGGESTIONS);
  var lastItem = selected.pop();
  return message + selected.join(', ') + ', or ' + lastItem + '?';
}
exports.default = didYouMean;

},

// node_modules/graphql/jsutils/identityFunc.mjs @183
183: function(__fusereq, exports, module){
exports.__esModule = true;
function identityFunc(x) {
  return x;
}
exports.default = identityFunc;

},

// node_modules/graphql/jsutils/defineToJSON.mjs @184
184: function(__fusereq, exports, module){
exports.__esModule = true;
var nodejsCustomInspectSymbol_mjs_1 = __fusereq(191);
var nodejsCustomInspectSymbol_mjs_1d = __fuse.dt(nodejsCustomInspectSymbol_mjs_1);
function defineToJSON(classObject) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : classObject.prototype.toString;
  classObject.prototype.toJSON = fn;
  classObject.prototype.inspect = fn;
  if (nodejsCustomInspectSymbol_mjs_1d.default) {
    classObject.prototype[nodejsCustomInspectSymbol_mjs_1d.default] = fn;
  }
}
exports.default = defineToJSON;

},

// node_modules/graphql/jsutils/suggestionList.mjs @185
185: function(__fusereq, exports, module){
exports.__esModule = true;
function suggestionList(input, options) {
  var optionsByDistance = Object.create(null);
  var lexicalDistance = new LexicalDistance(input);
  var threshold = Math.floor(input.length * 0.4) + 1;
  for (var _i2 = 0; _i2 < options.length; _i2++) {
    var option = options[_i2];
    var distance = lexicalDistance.measure(option, threshold);
    if (distance !== undefined) {
      optionsByDistance[option] = distance;
    }
  }
  return Object.keys(optionsByDistance).sort(function (a, b) {
    var distanceDiff = optionsByDistance[a] - optionsByDistance[b];
    return distanceDiff !== 0 ? distanceDiff : a.localeCompare(b);
  });
}
exports.default = suggestionList;
var LexicalDistance = (function () {
  function LexicalDistance(input) {
    this._input = input;
    this._inputLowerCase = input.toLowerCase();
    this._inputArray = stringToArray(this._inputLowerCase);
    this._rows = [new Array(input.length + 1).fill(0), new Array(input.length + 1).fill(0), new Array(input.length + 1).fill(0)];
  }
  var _proto = LexicalDistance.prototype;
  _proto.measure = function measure(option, threshold) {
    if (this._input === option) {
      return 0;
    }
    var optionLowerCase = option.toLowerCase();
    if (this._inputLowerCase === optionLowerCase) {
      return 1;
    }
    var a = stringToArray(optionLowerCase);
    var b = this._inputArray;
    if (a.length < b.length) {
      var tmp = a;
      a = b;
      b = tmp;
    }
    var aLength = a.length;
    var bLength = b.length;
    if (aLength - bLength > threshold) {
      return undefined;
    }
    var rows = this._rows;
    for (var j = 0; j <= bLength; j++) {
      rows[0][j] = j;
    }
    for (var i = 1; i <= aLength; i++) {
      var upRow = rows[(i - 1) % 3];
      var currentRow = rows[i % 3];
      var smallestCell = currentRow[0] = i;
      for (var _j = 1; _j <= bLength; _j++) {
        var cost = a[i - 1] === b[_j - 1] ? 0 : 1;
        var currentCell = Math.min(upRow[_j] + 1, currentRow[_j - 1] + 1, upRow[_j - 1] + cost);
        if (i > 1 && _j > 1 && a[i - 1] === b[_j - 2] && a[i - 2] === b[_j - 1]) {
          var doubleDiagonalCell = rows[(i - 2) % 3][_j - 2];
          currentCell = Math.min(currentCell, doubleDiagonalCell + 1);
        }
        if (currentCell < smallestCell) {
          smallestCell = currentCell;
        }
        currentRow[_j] = currentCell;
      }
      if (smallestCell > threshold) {
        return undefined;
      }
    }
    var distance = rows[aLength % 3][bLength];
    return distance <= threshold ? distance : undefined;
  };
  return LexicalDistance;
})();
function stringToArray(str) {
  var strLength = str.length;
  var array = new Array(strLength);
  for (var i = 0; i < strLength; ++i) {
    array[i] = str.charCodeAt(i);
  }
  return array;
}

},

// node_modules/graphql/polyfills/isFinite.mjs @186
186: function(__fusereq, exports, module){
exports.__esModule = true;
var isFinitePolyfill = Number.isFinite || (function (value) {
  return typeof value === 'number' && isFinite(value);
});
exports.default = isFinitePolyfill;

},

// node_modules/graphql/polyfills/isInteger.mjs @187
187: function(__fusereq, exports, module){
exports.__esModule = true;
var isInteger = Number.isInteger || (function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
});
exports.default = isInteger;

},

// node_modules/graphql/language/blockString.mjs @188
188: function(__fusereq, exports, module){
function dedentBlockStringValue(rawString) {
  var lines = rawString.split(/\r\n|[\n\r]/g);
  var commonIndent = getBlockStringIndentation(lines);
  if (commonIndent !== 0) {
    for (var i = 1; i < lines.length; i++) {
      lines[i] = lines[i].slice(commonIndent);
    }
  }
  while (lines.length > 0 && isBlank(lines[0])) {
    lines.shift();
  }
  while (lines.length > 0 && isBlank(lines[lines.length - 1])) {
    lines.pop();
  }
  return lines.join('\n');
}
exports.dedentBlockStringValue = dedentBlockStringValue;
function getBlockStringIndentation(lines) {
  var commonIndent = null;
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i];
    var indent = leadingWhitespace(line);
    if (indent === line.length) {
      continue;
    }
    if (commonIndent === null || indent < commonIndent) {
      commonIndent = indent;
      if (commonIndent === 0) {
        break;
      }
    }
  }
  return commonIndent === null ? 0 : commonIndent;
}
exports.getBlockStringIndentation = getBlockStringIndentation;
function leadingWhitespace(str) {
  var i = 0;
  while (i < str.length && (str[i] === ' ' || str[i] === '\t')) {
    i++;
  }
  return i;
}
function isBlank(str) {
  return leadingWhitespace(str) === str.length;
}
function printBlockString(value) {
  var indentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var preferMultipleLines = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var isSingleLine = value.indexOf('\n') === -1;
  var hasLeadingSpace = value[0] === ' ' || value[0] === '\t';
  var hasTrailingQuote = value[value.length - 1] === '"';
  var printAsMultipleLines = !isSingleLine || hasTrailingQuote || preferMultipleLines;
  var result = '';
  if (printAsMultipleLines && !(isSingleLine && hasLeadingSpace)) {
    result += '\n' + indentation;
  }
  result += indentation ? value.replace(/\n/g, '\n' + indentation) : value;
  if (printAsMultipleLines) {
    result += '\n';
  }
  return '"""' + result.replace(/"""/g, '\\"""') + '"""';
}
exports.printBlockString = printBlockString;

},

// node_modules/graphql/jsutils/printPathArray.mjs @189
189: function(__fusereq, exports, module){
exports.__esModule = true;
function printPathArray(path) {
  return path.map(function (key) {
    return typeof key === 'number' ? '[' + key.toString() + ']' : '.' + key;
  }).join('');
}
exports.default = printPathArray;

},

// node_modules/graphql/subscription/mapAsyncIterator.mjs @190
190: function(__fusereq, exports, module){
exports.__esModule = true;
function _defineProperty(obj, key, value) {
  if ((key in obj)) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var symbols_mjs_1 = __fusereq(175);
function mapAsyncIterator(iterable, callback, rejectCallback) {
  var iteratorMethod = iterable[symbols_mjs_1.SYMBOL_ASYNC_ITERATOR];
  var iterator = iteratorMethod.call(iterable);
  var $return;
  var abruptClose;
  if (typeof iterator.return === 'function') {
    $return = iterator.return;
    abruptClose = function abruptClose(error) {
      var rethrow = function rethrow() {
        return Promise.reject(error);
      };
      return $return.call(iterator).then(rethrow, rethrow);
    };
  }
  function mapResult(result) {
    return result.done ? result : asyncMapValue(result.value, callback).then(iteratorResult, abruptClose);
  }
  var mapReject;
  if (rejectCallback) {
    var reject = rejectCallback;
    mapReject = function mapReject(error) {
      return asyncMapValue(error, reject).then(iteratorResult, abruptClose);
    };
  }
  return _defineProperty({
    next: function next() {
      return iterator.next().then(mapResult, mapReject);
    },
    return: function _return() {
      return $return ? $return.call(iterator).then(mapResult, mapReject) : Promise.resolve({
        value: undefined,
        done: true
      });
    },
    throw: function _throw(error) {
      if (typeof iterator.throw === 'function') {
        return iterator.throw(error).then(mapResult, mapReject);
      }
      return Promise.reject(error).catch(abruptClose);
    }
  }, symbols_mjs_1.SYMBOL_ASYNC_ITERATOR, function () {
    return this;
  });
}
exports.default = mapAsyncIterator;
function asyncMapValue(value, callback) {
  return new Promise(function (resolve) {
    return resolve(callback(value));
  });
}
function iteratorResult(value) {
  return {
    value: value,
    done: false
  };
}

},

// node_modules/graphql/jsutils/nodejsCustomInspectSymbol.mjs @191
191: function(__fusereq, exports, module){
exports.__esModule = true;
var nodejsCustomInspectSymbol = typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('nodejs.util.inspect.custom') : undefined;
exports.default = nodejsCustomInspectSymbol;

},

// src/utils.ts @18
18: function(__fusereq, exports, module){
exports.__esModule = true;
var types_1 = __fusereq(17);
var graphql_1 = __fusereq(20);
exports.NEWLINE = '\n';
const SPACE = ' ';
exports.indent = (string, tabSize = 2) => SPACE.repeat(tabSize) + string;
exports.isScalar = type => {
  return (type.toUpperCase() in types_1.ScalarTypes);
};
exports.capitalize = str => {
  if (!str.length) return str;
  return str[0].toUpperCase() + str.substring(1);
};
exports.getRootFieldName = (operationString, shouldCapitalize = false) => {
  try {
    const doc = graphql_1.parse(operationString);
    const operation = doc.definitions[0];
    const selection = operation.selectionSet.selections[0];
    const name = selection.alias ? selection.alias.value : selection.name.value;
    return shouldCapitalize ? exports.capitalize(name) : name;
  } catch (err) {
    console.error('Got error in getRootFieldName:', err);
  }
};
exports.serialize = field => ({
  name: field.getName(),
  required: field.isNonNullType(),
  list: field.isListType(),
  type: field.getTypename()
});

},

// src/templates/goServeMux.ts @12
12: function(__fusereq, exports, module){
exports.__esModule = true;
var common_tags_1 = __fusereq(19);
var utils_1 = __fusereq(18);
const sampleValues = {
  'Int': 1111,
  'String': '"<sample value>"',
  'Boolean': false,
  'Float': 11.11,
  'ID': 1111
};
exports.goServeMuxTemplate = params => {
  const {actionArgs, actionName, returnType, typeDefs, typeMap, derive} = params;
  const returnTypeDef = typeMap.types[returnType];
  let delegationTypedefs = derive ? common_tags_1.html`

    type GraphQLRequest struct {
      Query     string               \`json:"query"\`
      Variables ${actionName}Args \`json:"variables"\`
    }
    type GraphQLData struct {
      ${utils_1.getRootFieldName(derive.operation, true)} ${returnType} \`json:"${utils_1.getRootFieldName(derive.operation)}"\`
    }
    type GraphQLResponse struct {
      Data   GraphQLData    \`json:"data,omitempty"\`
      Errors []GraphQLError \`json:"errors,omitempty"\`
    }
  ` : '';
  let executeFunc = derive ? common_tags_1.html`
    func execute(variables ${actionName}Args) (response GraphQLResponse, err error) {

      // build the request body
      reqBody := GraphQLRequest{
        Query:     "${derive.operation}",
        Variables: variables,
      }
      reqBytes, err := json.Marshal(reqBody)
      if err != nil {
        return
      }

      // make request to Hasura
      resp, err := http.Post("http://localhost:8080/v1/graphql", "application/json", bytes.NewBuffer(reqBytes))
      if err != nil {
        return
      }

      // parse the response
      respBytes, err := ioutil.ReadAll(resp.Body)
      if err != nil {
        return
      }
      err = json.Unmarshal(respBytes, &response)
      if err != nil {
        return
      }

      // return the response
      return
    }

  ` : '';
  let handlerFunc = derive ? common_tags_1.html`
    // Auto-generated function that takes the Action parameters and must return it's response type
    func ${actionName}(args ${actionName}Args) (response ${returnType}, err error) {

      hasuraResponse, err := execute(args)

      // throw if any unexpected error happens
      if err != nil {
        return
      }

      // delegate Hasura error
      if len(hasuraResponse.Errors) != 0 {
        err = errors.New(hasuraResponse.Errors[0].Message)
        return
      }

      response = hasuraResponse.Data.${utils_1.getRootFieldName(derive.operation, true)}
      return

    }

  ` : common_tags_1.html`
    // Auto-generated function that takes the Action parameters and must return it's response type
    func ${actionName}(args ${actionName}Args) (response ${returnType}, err error) {
      response =  ${returnType} {
        ${returnTypeDef.map(f => {
    return `${utils_1.capitalize(f.getName())}: ${sampleValues[f.getType().getTypename()] || sampleValues["String"]}`;
  }).join(',\n')},
      }
      return response, nil
    }
  `;
  return common_tags_1.html`

    package main

    import (
      "bytes"
      "encoding/json"
      "io/ioutil"
      "log"
      "net/http"
    )

    ${typeDefs}

    type ActionPayload struct {
      SessionVariables map[string]interface{} \`json:"session_variables"\`
      Input            ${actionName}Args \`json:"input"\`
    }

    type GraphQLError struct {
      Message string \`json:"message"\`
    }

    ${delegationTypedefs}
    
    func handler(w http.ResponseWriter, r *http.Request) {

      // set the response header as JSON
      w.Header().Set("Content-Type", "application/json")

      // read request body
      reqBody, err := ioutil.ReadAll(r.Body)
      if err != nil {
        http.Error(w, "invalid payload", http.StatusBadRequest)
        return
      }

      // parse the body as action payload
      var actionPayload ActionPayload
      err = json.Unmarshal(reqBody, &actionPayload)
      if err != nil {
        http.Error(w, "invalid payload", http.StatusBadRequest)
        return
      }

      // Send the request params to the Action's generated handler function
      result, err := ${actionName}(actionPayload.Input)

      // throw if an error happens
      if err != nil {
        errorObject := GraphQLError{
          Message: err.Error(),
        }
        errorBody, _ := json.Marshal(errorObject)
        w.WriteHeader(http.StatusBadRequest)
        w.Write(errorBody)
        return
      }

      // Write the response as JSON
      data, _ := json.Marshal(result)
      w.Write(data)

    }

    ${handlerFunc}
    ${executeFunc}

    // HTTP server for the handler
    func main() {
      mux := http.NewServeMux()
      mux.HandleFunc("/${actionName}", handler)

      err := http.ListenAndServe(":3000", mux)
      log.Fatal(err)
    }
  `;
};

},

// src/templates/http4kBasic.ts @13
13: function(__fusereq, exports, module){
exports.__esModule = true;
var common_tags_1 = __fusereq(19);
exports.kotlinHttp4kTemplate = params => {
  const {actionArgs, actionName, returnType, typeDefs} = params;
  return common_tags_1.html`
     package org.hasura.my_action_handler
 
     import org.http4k.core.Body
     import org.http4k.core.Method.DELETE
     import org.http4k.core.Method.GET
     import org.http4k.core.Method.OPTIONS
     import org.http4k.core.Method.PATCH
     import org.http4k.core.Method.POST
     import org.http4k.core.Request
     import org.http4k.core.Response
     import org.http4k.core.Status.Companion.NOT_FOUND
     import org.http4k.core.Status.Companion.OK
     import org.http4k.core.then
     import org.http4k.core.with
     import org.http4k.filter.CorsPolicy.Companion.UnsafeGlobalPermissive
     import org.http4k.filter.DebuggingFilters
     import org.http4k.filter.ServerFilters.CatchLensFailure
     import org.http4k.filter.ServerFilters.Cors
     import org.http4k.format.Jackson.auto
     import org.http4k.lens.Path
     import org.http4k.lens.string
     import org.http4k.routing.bind
     import org.http4k.routing.routes
     import org.http4k.server.Jetty
     import org.http4k.server.asServer
 
     ${typeDefs}
 
     fun main(args: Array<String>) {
         val port = if (args.isNotEmpty()) args[0] else "5000"
         val baseUrl = if (args.size > 1) args[1] else "http://localhost:$port"
 
         val ${actionName}ArgsLens = Body.auto<${actionName}Args>().toLens()
 
         fun ${actionName}Handler(${actionName}Args: ${actionName}ArgsLens): HttpHandler = { request: Request ->
             // Business logic here
             Response(OK).with(stringBody of "$${actionName}Args")
         }
 
         DebuggingFilters
             .PrintRequestAndResponse()
             .then(Cors(UnsafeGlobalPermissive))
             .then(CatchLensFailure)
             .then(routes(
                 "/{any:.*}" bind OPTIONS to  { _: Request -> Response(OK) },
                 "/" bind POST to ${actionName}Handler(${actionName}ArgsLens) },
             ))
             .asServer(Jetty(port.toInt())).start().block()
     }
  `;
};

},

// src/templates/kotlinKtor.ts @14
14: function(__fusereq, exports, module){
exports.__esModule = true;
var common_tags_1 = __fusereq(19);
exports.kotlinKtorTemplate = params => {
  const {actionArgs, actionName, typeDefs} = params;
  return common_tags_1.html`
    package org.hasura.my_action_handler

    import io.ktor.application.*
    import io.ktor.response.*
    import io.ktor.request.*
    import io.ktor.routing.*
    import io.ktor.http.*
    import com.fasterxml.jackson.databind.*
    import io.ktor.jackson.*
    import io.ktor.features.*

    ${typeDefs}

    fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

    @Suppress("unused") // Referenced in application.conf
    @kotlin.jvm.JvmOverloads
    fun Application.module(testing: Boolean = false) {
        install(ContentNegotiation) {
            jackson {
                enable(SerializationFeature.INDENT_OUTPUT)
            }
        }

        install(CORS) {
            method(HttpMethod.Options)
            method(HttpMethod.Put)
            method(HttpMethod.Delete)
            method(HttpMethod.Patch)
            header(HttpHeaders.Authorization)
            header("MyCustomHeader")
            allowCredentials = true
            anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
        }

        routing {
            post("/${actionName}") {
                val input = call.receive<${actionName}Args>()
                // Business logic here
                call.respond(mapOf("hello" to "world"))
            }
        }
    }`;
};

},

// src/templates/pythonFastAPI.ts @15
15: function(__fusereq, exports, module){
exports.__esModule = true;
var common_tags_1 = __fusereq(19);
exports.pythonFastAPITemplate = params => {
  const {actionArgs, actionName, returnType, typeDefs} = params;
  let baseTemplate = common_tags_1.html`
    class Config:
      orm_mode = True

    ${typeDefs}

    from fastapi import Body, FastAPI

    app = FastAPI()

    @app.post("/items/", response_model=${actionName}Args)
    async def ${actionName}Handler(item: ${actionName}Args = Body(...)) -> ${returnType}:
        # business logic here
  `;
  baseTemplate = baseTemplate.replace('from dataclasses', 'from pydantic.dataclasses').replace(/@dataclass/gi, '@dataclass(config=Config)');
  return baseTemplate;
};

},

// src/templates/index.ts @3
3: function(__fusereq, exports, module){
exports.__esModule = true;
var typescriptExpress_1 = __fusereq(10);
exports.typescriptExpressTemplate = typescriptExpress_1.typescriptExpressTemplate;
var javascriptExpress_1 = __fusereq(11);
exports.javascriptExpressTemplate = javascriptExpress_1.javascriptExpressTemplate;
var goServeMux_1 = __fusereq(12);
exports.goServeMuxTemplate = goServeMux_1.goServeMuxTemplate;
var http4kBasic_1 = __fusereq(13);
exports.kotlinHttp4kTemplate = http4kBasic_1.kotlinHttp4kTemplate;
var kotlinKtor_1 = __fusereq(14);
exports.kotlinKtorTemplate = kotlinKtor_1.kotlinKtorTemplate;
var pythonFastAPI_1 = __fusereq(15);
exports.pythonFastAPITemplate = pythonFastAPI_1.pythonFastAPITemplate;

},

// src/schemaTools.ts @4
4: function(__fusereq, exports, module){
exports.__esModule = true;
var utils_1 = __fusereq(18);
var graphql_extra_1 = __fusereq(16);
const makeActionArgType = field => graphql_extra_1.t.objectType({
  name: field.getName() + 'Args',
  fields: field.getArguments().map(arg => arg.node)
});
exports.addActionArgumentTypesToSchema = document => document.getObjectType(getActionType(document)).getFields().forEach(field => {
  const actionArgType = makeActionArgType(field);
  document.createObjectType(actionArgType);
});
exports.createScalarTypeDefinitioNode = (name, description) => {
  const node = {
    kind: "ScalarTypeDefinition",
    name: {
      kind: "Name",
      value: name
    },
    description: description ? {
      kind: "StringValue",
      value: description
    } : null
  };
  return node;
};
function buildTypeMap(document) {
  let res = {
    types: {},
    enums: {},
    scalars: {}
  };
  const allTypes = {};
  document.typeMap.forEach(t => {
    allTypes[t.name.value] = true;
  });
  const populatePostgresScalars = fields => {
    fields.forEach(f => {
      const fieldTypename = f.getType().getTypename();
      if (!allTypes[fieldTypename] && !utils_1.isScalar(fieldTypename)) {
        const newScalarApi = graphql_extra_1.scalarTypeApi(exports.createScalarTypeDefinitioNode(fieldTypename));
        res.scalars[fieldTypename] = newScalarApi;
        allTypes[fieldTypename] = true;
      }
    });
  };
  for (let [typeName, astNode] of document.typeMap) {
    switch (astNode.kind) {
      case 'InputObjectTypeDefinition':
        {
          const fields = graphql_extra_1.inputTypeApi(astNode).getFields();
          populatePostgresScalars(fields);
          res['types'][typeName] = fields;
          break;
        }
      case 'ObjectTypeDefinition':
        {
          const fields = graphql_extra_1.objectTypeApi(astNode).getFields();
          populatePostgresScalars(fields);
          res['types'][typeName] = fields;
          break;
        }
      case 'EnumTypeDefinition':
        {
          res['enums'][typeName] = graphql_extra_1.enumTypeApi(astNode).node.values.map(graphql_extra_1.enumValueApi);
          break;
        }
      case 'ScalarTypeDefinition':
        {
          res['scalars'][typeName] = graphql_extra_1.scalarTypeApi(astNode);
          break;
        }
    }
  }
  return res;
}
const getActionType = doc => {
  if (doc.hasType('Query')) return 'Query';
  if (doc.hasType('Mutation')) return 'Mutation'; else throw new Error('Neither Mutation or Query found in Document SDL');
};
function buildActionTypes(actionName, sdl) {
  const convertedSdl = exports.removeExtendDirectives(sdl);
  const document = graphql_extra_1.documentApi().addSDL(convertedSdl);
  exports.addActionArgumentTypesToSchema(document);
  const actionType = getActionType(document);
  const action = document.getObjectType(actionType).getField(actionName);
  let actionParams = {
    actionName: actionName,
    returnType: action.getTypename(),
    actionArgs: action.getArguments(),
    typeMap: buildTypeMap(document)
  };
  return actionParams;
}
exports.buildActionTypes = buildActionTypes;
function buildBaseTypes(sdl, makeActionArgTypes = true) {
  const convertedSdl = exports.removeExtendDirectives(sdl);
  const document = graphql_extra_1.documentApi().addSDL(convertedSdl);
  if (makeActionArgTypes) exports.addActionArgumentTypesToSchema(document);
  return buildTypeMap(document);
}
exports.buildBaseTypes = buildBaseTypes;
exports.removeExtendDirectives = sdl => sdl.replace(/extend/g, '');

},

// src/languages-functional/jsdoc.ts @6
6: function(__fusereq, exports, module){
exports.__esModule = true;
var types_1 = __fusereq(17);
var utils_1 = __fusereq(18);
var schemaTools_1 = __fusereq(4);
var common_tags_1 = __fusereq(19);
const scalarMap = {
  [types_1.ScalarTypes.ID]: `number`,
  [types_1.ScalarTypes.INT]: `number`,
  [types_1.ScalarTypes.FLOAT]: `number`,
  [types_1.ScalarTypes.STRING]: `string`,
  [types_1.ScalarTypes.BOOLEAN]: `boolean`
};
const fieldFormatter = field => {
  let {name, required, list, type} = utils_1.serialize(field);
  let T = utils_1.isScalar(type) ? scalarMap[type] : type;
  if (!required) T = `[${T}]`;
  if (list) T = `Array<${T}>`;
  return {
    name,
    type: T
  };
};
const jsdocTypeDef = (typeName, fields) => {
  const fieldDefs = fields.map(fieldFormatter).map(({name, type}) => `* @property {${type}} ${name}`).join('\n');
  return common_tags_1.html`
     /** 
       * @typedef {Object} ${typeName}
       ${fieldDefs}
       */
    `;
};
const typeMapToJSDocTypes = typeMap => Object.entries(typeMap.types).map(([typeName, fields]) => jsdocTypeDef(typeName, fields)).join('\n\n');
const jsdocEnumDef = (typeName, fields) => {
  const fieldDefs = fields.map(field => `* @property {string} ${field.getName()}`).join('\n');
  return common_tags_1.html`
      /** 
       * @enum {Object} ${typeName}
       ${fieldDefs}
       */
    `;
};
const jsdocScalarDef = scalarType => common_tags_1.html`
      /** 
       * @typedef {string} ${scalarType.getName()}
       */
    `;
const typeMapToJSDocEnums = typeMap => Object.entries(typeMap.enums).map(([typeName, fields]) => jsdocEnumDef(typeName, fields)).join('\n\n');
const typeMapToJSDocScalars = typeMap => Object.entries(typeMap.scalars).map(([_, scalarType]) => jsdocScalarDef(scalarType)).join('\n\n');
const typeMapToJSDoc = typeMap => typeMapToJSDocScalars(typeMap) + '\n\n' + typeMapToJSDocEnums(typeMap) + '\n\n' + typeMapToJSDocTypes(typeMap);
exports.graphqlSchemaToJSDoc = schema => typeMapToJSDoc(schemaTools_1.buildBaseTypes(schema));

},

// src/languages-functional/kotlin.ts @7
7: function(__fusereq, exports, module){
exports.__esModule = true;
var types_1 = __fusereq(17);
var utils_1 = __fusereq(18);
var schemaTools_1 = __fusereq(4);
var common_tags_1 = __fusereq(19);
const scalarMap = {
  [types_1.ScalarTypes.ID]: `Int`,
  [types_1.ScalarTypes.INT]: `Int`,
  [types_1.ScalarTypes.FLOAT]: `Float`,
  [types_1.ScalarTypes.STRING]: `String`,
  [types_1.ScalarTypes.BOOLEAN]: `Boolean`
};
const fieldFormatter = field => {
  let {name, required, list, type} = utils_1.serialize(field);
  let T = utils_1.isScalar(type) ? scalarMap[type] : type;
  if (!required) T = `${T}?`;
  if (list) T = `List<${T}>`;
  if (!required && list) T = `${T}?`;
  return {
    name,
    type: T
  };
};
const kotlinTypeDef = (typeName, fields) => {
  const fieldDefs = fields.map(fieldFormatter).map(({name, type}) => `var ${name}: ${type}`).join(', ');
  return `data class ${typeName}(${fieldDefs})`;
};
const typeMapToKotlinTypes = typeMap => Object.entries(typeMap.types).map(([typeName, fields]) => kotlinTypeDef(typeName, fields)).join('\n\n');
const kotlinEnumDef = (typeName, fields) => {
  const fieldDefs = fields.map(field => field.getName()).join(', ');
  return common_tags_1.html`
    enum class ${typeName} {
      ${fieldDefs}
    }`;
};
const typeMapToKotlinEnums = typeMap => Object.entries(typeMap.enums).map(([typeName, fields]) => kotlinEnumDef(typeName, fields)).join('\n\n');
const typeMapToKotlin = typeMap => typeMapToKotlinTypes(typeMap) + '\n\n' + typeMapToKotlinEnums(typeMap);
exports.graphqlSchemaToKotlin = schema => typeMapToKotlin(schemaTools_1.buildBaseTypes(schema));

},

// src/languages-functional/python.ts @8
8: function(__fusereq, exports, module){
exports.__esModule = true;
var types_1 = __fusereq(17);
var utils_1 = __fusereq(18);
var schemaTools_1 = __fusereq(4);
var common_tags_1 = __fusereq(19);
const scalarMap = {
  [types_1.ScalarTypes.ID]: `int`,
  [types_1.ScalarTypes.INT]: `int`,
  [types_1.ScalarTypes.FLOAT]: `float`,
  [types_1.ScalarTypes.STRING]: `str`,
  [types_1.ScalarTypes.BOOLEAN]: `bool`
};
const baseTypes = common_tags_1.html`
  from dataclasses import dataclass
  from typing import List, Optional
  from enum import Enum, auto
`;
const fieldFormatter = field => {
  let {name, required, list, type} = utils_1.serialize(field);
  let T = utils_1.isScalar(type) ? scalarMap[type] : type;
  if (list) T = `List[${T}]`;
  if (!required) T = `Optional[${T}]`;
  return {
    name,
    type: T
  };
};
const pythonTypeDef = (typeName, fields) => {
  const fieldDefs = fields.map(fieldFormatter).map(({name, type}) => utils_1.indent(`${name}: ${type}`)).join('\n');
  return common_tags_1.html`
      @dataclass
      class ${typeName}:
      ${fieldDefs}
    `;
};
const typeMapToPythonTypes = typeMap => Object.entries(typeMap.types).map(([typeName, fields]) => pythonTypeDef(typeName, fields)).join('\n\n');
const pythonEnumDef = (typeName, fields) => {
  const fieldDefs = fields.map(field => utils_1.indent(`${field.getName()} = auto()`)).join('\n');
  return common_tags_1.html`
      class ${typeName}(Enum):
      ${fieldDefs}
    `;
};
const typeMapToPythonEnums = typeMap => Object.entries(typeMap.enums).map(([typeName, fields]) => pythonEnumDef(typeName, fields)).join('\n\n');
const typeMapToPython = typeMap => baseTypes + '\n\n' + typeMapToPythonTypes(typeMap) + '\n\n' + typeMapToPythonEnums(typeMap);
exports.graphqlSchemaToPython = schema => typeMapToPython(schemaTools_1.buildBaseTypes(schema));

},

// src/languages-functional/typescript.ts @9
9: function(__fusereq, exports, module){
exports.__esModule = true;
var types_1 = __fusereq(17);
var utils_1 = __fusereq(18);
var schemaTools_1 = __fusereq(4);
var common_tags_1 = __fusereq(19);
const scalarMap = {
  [types_1.ScalarTypes.ID]: 'number',
  [types_1.ScalarTypes.INT]: 'number',
  [types_1.ScalarTypes.FLOAT]: 'number',
  [types_1.ScalarTypes.STRING]: 'string',
  [types_1.ScalarTypes.BOOLEAN]: 'boolean'
};
const baseTypes = common_tags_1.html`
  type Maybe<T> = T | null
`;
const fieldFormatter = field => {
  let {name, required, list, type} = utils_1.serialize(field);
  let T = utils_1.isScalar(type) ? scalarMap[type] : type;
  if (!required) T = `Maybe<${T}>`;
  if (list) T = `Array<${T}>`;
  if (!required && list) T = `Maybe<${T}>`;
  if (!required) name = `${name}?`;
  return {
    name,
    type: T
  };
};
const tsTypeDef = (typeName, fields) => {
  const fieldDefs = fields.map(fieldFormatter).map(({name, type}) => `${name}: ${type}`).join('\n');
  return common_tags_1.html`
    type ${typeName} = {
      ${fieldDefs}
    }`;
};
const typeMapToTSTypes = typeMap => Object.entries(typeMap.types).map(([typeName, fields]) => tsTypeDef(typeName, fields)).join('\n\n');
const tsEnumDef = (typeName, fields) => {
  const fieldDefs = fields.map(field => `${field.getName()} = '${field.getName()}'`).join(',\n');
  return common_tags_1.html`
    enum ${typeName} {
      ${fieldDefs}
    }`;
};
const tsScalarDef = scalarType => {
  return common_tags_1.html`
    type ${scalarType.getName()} = string`;
};
const typeMapToTSEnums = typeMap => Object.entries(typeMap.enums).map(([typeName, fields]) => tsEnumDef(typeName, fields)).join('\n\n');
const typeMapToTSScalars = typeMap => Object.entries(typeMap.scalars).map(([_, scalarType]) => tsScalarDef(scalarType)).join('\n\n');
const typeMapToTypescript = typeMap => baseTypes + '\n\n' + typeMapToTSScalars(typeMap) + '\n\n' + typeMapToTSEnums(typeMap) + '\n\n' + typeMapToTSTypes(typeMap);
exports.graphqlSchemaToTypescript = schema => typeMapToTypescript(schemaTools_1.buildBaseTypes(schema));

},

// src/languages-functional/go.ts @5
5: function(__fusereq, exports, module){
exports.__esModule = true;
var types_1 = __fusereq(17);
var utils_1 = __fusereq(18);
var schemaTools_1 = __fusereq(4);
var common_tags_1 = __fusereq(19);
const scalarMap = {
  [types_1.ScalarTypes.ID]: `int`,
  [types_1.ScalarTypes.INT]: `int`,
  [types_1.ScalarTypes.FLOAT]: `float32`,
  [types_1.ScalarTypes.STRING]: `string`,
  [types_1.ScalarTypes.BOOLEAN]: `bool`
};
const fieldFormatter = field => {
  let {name, required, list, type} = utils_1.serialize(field);
  let T = utils_1.isScalar(type) ? scalarMap[type] : type;
  if (!required) T = `*${T}`;
  if (list) T = `[]${T}`;
  return {
    name,
    type: T
  };
};
const goTypeDef = (typeName, fields) => {
  const fieldDefs = fields.map(fieldFormatter).map(({name, type}) => `${utils_1.capitalize(name)} ${type}`).join('\n');
  return common_tags_1.html`
    type ${typeName} struct {
        ${fieldDefs}
    }
  `;
};
const typeMapToGoTypes = typeMap => Object.entries(typeMap.types).map(([typeName, fields]) => goTypeDef(typeName, fields)).join('\n\n');
const goEnumDef = (typeName, fields) => {
  const fieldDefs = fields.map((field, idx) => idx == 0 ? `${utils_1.capitalize(field.getName())} ${typeName} = "${utils_1.capitalize(field.getName())}"` : `${utils_1.capitalize(field.getName())} = "${utils_1.capitalize(field.getName())}"`).join('\n');
  return common_tags_1.html`
    type ${typeName} string

    const(
        ${fieldDefs}
    )
  `;
};
const goScalarDef = scalarType => `type ${utils_1.capitalize(scalarType.getName())} string`;
const typeMapToGoEnums = typeMap => Object.entries(typeMap.enums).map(([typeName, fields]) => goEnumDef(typeName, fields)).join('\n\n');
const typeMapToGoScalars = typeMap => Object.entries(typeMap.scalars).map(([_, scalarType]) => goScalarDef(scalarType)).join('\n\n');
const typeMapToGo = typeMap => typeMapToGoScalars(typeMap) + '\n\n' + typeMapToGoEnums(typeMap) + '\n\n' + typeMapToGoTypes(typeMap);
exports.graphqlSchemaToGo = schema => typeMapToGo(schemaTools_1.buildBaseTypes(schema));

},

// src/languages-functional/index.ts @2
2: function(__fusereq, exports, module){
exports.__esModule = true;
Object.assign(exports, __fusereq(5));
Object.assign(exports, __fusereq(6));
Object.assign(exports, __fusereq(7));
Object.assign(exports, __fusereq(8));
Object.assign(exports, __fusereq(9));

},

// src/templates/kotlinKtor.codegen.ts @1
1: function(__fusereq, exports, module){
exports.__esModule = true;
var languages_functional_1 = __fusereq(2);
var templates_1 = __fusereq(3);
var schemaTools_1 = __fusereq(4);
const templater = (actionName, actionSdl, derive) => {
  const actionParams = schemaTools_1.buildActionTypes(actionName, actionSdl);
  const templateParams = {
    ...actionParams,
    derive
  };
  const codegen = templates_1.kotlinKtorTemplate({
    ...templateParams,
    typeDefs: languages_functional_1.graphqlSchemaToKotlin(actionSdl)
  });
  const response = [{
    name: actionName + 'KotlinKtor.kt',
    content: codegen
  }];
  return response;
};
globalThis.templater = templater;

},

// node_modules/graphql-extra/dist-web/index.js @16
16: function(__fusereq, exports, module){
exports.__esModule = true;
var graphql_1 = __fusereq(20);
function isAstNode(input) {
  return typeof input === 'object' && ('kind' in input) && typeof input.kind === 'string';
}
const nullable = fn => arg => {
  if (arg) {
    return fn(arg);
  }
};
const arrayable = fn => arr => arr.map(fn);
const propsOrNode = fn => props => isAstNode(props) ? props : fn(props);
const applyProps = (fn, props) => propsOrNode(fn)(props);
const applyPropsArr = (fn, props) => arrayable(propsOrNode(fn))(props);
const applyPropsNullable = (fn, props) => nullable(propsOrNode(fn))(props);
const applyPropsNullableArr = (fn, props) => nullable(arrayable(propsOrNode(fn)))(props);
const applyPropsCloned = (fn, props) => {
  const cloned = cloneDeep(props);
  return isAstNode(cloned) ? cloned : fn(cloned);
};
function cloneDeep(target) {
  if (target === null) {
    return target;
  }
  if (target instanceof Date) {
    return new Date(target.getTime());
  }
  if (Array.isArray(target)) {
    const copy = [...target];
    return copy.map(n => cloneDeep(n));
  }
  if (typeof target === 'object' && target !== ({})) {
    const copy = {
      ...target
    };
    for (const key of Object.keys(copy)) {
      copy[key] = cloneDeep(copy[key]);
    }
    return copy;
  }
  return target;
}
function getName(input) {
  if (typeof input === 'string') {
    return input;
  }
  if (('kind' in input) && input.kind === graphql_1.Kind.NAME) {
    return input.value;
  }
  if (('name' in input) && !!input.name) {
    return getName(input.name);
  }
  if (('kind' in input) && !!input.kind) {
    return input.kind;
  }
  return '???';
}
function nameNode(value) {
  return {
    kind: graphql_1.Kind.NAME,
    value
  };
}
function documentNode(definitions) {
  return {
    kind: graphql_1.Kind.DOCUMENT,
    definitions
  };
}
function operationDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.OPERATION_DEFINITION,
    operation: props.operation,
    name: applyPropsNullable(nameNode, props.name),
    variableDefinitions: applyPropsNullableArr(variableDefinitionNode, props.variableDefinitions),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    selectionSet: applyProps(selectionSetNode, props.selections)
  };
}
function variableDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.VARIABLE_DEFINITION,
    variable: applyProps(variableNode, props.variable),
    type: applyProps(typeNode, props.type),
    defaultValue: props.defaultValue,
    directives: applyPropsNullableArr(directiveNode, props.directives)
  };
}
function variableNode(name) {
  return {
    kind: graphql_1.Kind.VARIABLE,
    name: nameNode(name)
  };
}
function selectionSetNode(selections) {
  return {
    kind: graphql_1.Kind.SELECTION_SET,
    selections: selections.map(el => isAstNode(el) ? el : applyProps(fieldNode, el))
  };
}
function fieldNode(field) {
  if (typeof field === 'string') {
    return {
      kind: graphql_1.Kind.FIELD,
      name: nameNode(field)
    };
  }
  return {
    kind: graphql_1.Kind.FIELD,
    name: applyProps(nameNode, field.name),
    alias: applyPropsNullable(nameNode, field.alias),
    arguments: applyPropsNullableArr(argumentNode, field.arguments),
    directives: applyPropsNullableArr(directiveNode, field.directives),
    selectionSet: applyPropsNullable(selectionSetNode, field.selections)
  };
}
function argumentNode(props) {
  return {
    kind: graphql_1.Kind.ARGUMENT,
    name: applyProps(nameNode, props.name),
    value: props.value
  };
}
function fragmentSpreadNode(props) {
  return {
    kind: graphql_1.Kind.FRAGMENT_SPREAD,
    name: applyProps(nameNode, props.name),
    directives: applyPropsNullableArr(directiveNode, props.directives)
  };
}
function inlineFragmentNode(props) {
  return {
    kind: graphql_1.Kind.INLINE_FRAGMENT,
    typeCondition: applyPropsNullable(namedTypeNode, props.typeCondition),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    selectionSet: applyProps(selectionSetNode, props.selections)
  };
}
function fragmentDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.FRAGMENT_DEFINITION,
    name: applyProps(nameNode, props.name),
    variableDefinitions: applyPropsNullableArr(variableDefinitionNode, props.variableDefinitions),
    typeCondition: applyProps(namedTypeNode, props.typeCondition),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    selectionSet: applyProps(selectionSetNode, props.selections)
  };
}
function intValueNode(value) {
  return {
    kind: graphql_1.Kind.INT,
    value: '' + value
  };
}
function floatValueNode(value) {
  return {
    kind: graphql_1.Kind.FLOAT,
    value: '' + value
  };
}
function stringValueNode(value) {
  return {
    kind: graphql_1.Kind.STRING,
    value
  };
}
function booleanValueNode(value) {
  return {
    kind: graphql_1.Kind.BOOLEAN,
    value
  };
}
function nullValueNode() {
  return {
    kind: graphql_1.Kind.NULL
  };
}
function enumValueNode(value) {
  return {
    kind: graphql_1.Kind.ENUM,
    value
  };
}
function listValueNode(values) {
  return {
    kind: graphql_1.Kind.LIST,
    values: values
  };
}
function objectValueNode(fields) {
  return {
    kind: graphql_1.Kind.OBJECT,
    fields: fields
  };
}
function objectFieldNode(props) {
  return {
    kind: graphql_1.Kind.OBJECT_FIELD,
    name: applyProps(nameNode, props.name),
    value: props.value
  };
}
function directiveNode(directive) {
  if (typeof directive === 'string') {
    return {
      kind: graphql_1.Kind.DIRECTIVE,
      name: nameNode(directive)
    };
  }
  return {
    kind: graphql_1.Kind.DIRECTIVE,
    name: applyProps(nameNode, directive.name),
    arguments: applyPropsNullableArr(argumentNode, directive.arguments)
  };
}
function namedTypeNode(value) {
  return {
    kind: graphql_1.Kind.NAMED_TYPE,
    name: applyProps(nameNode, value)
  };
}
function listTypeNode(type) {
  const namedType = typeof type === 'string' ? namedTypeNode(type) : type;
  return {
    kind: graphql_1.Kind.LIST_TYPE,
    type: namedType
  };
}
function nonNullTypeNode(type) {
  const namedType = typeof type === 'string' ? namedTypeNode(type) : type;
  if (namedType.kind === graphql_1.Kind.NON_NULL_TYPE) {
    return namedType;
  }
  return {
    kind: graphql_1.Kind.NON_NULL_TYPE,
    type: namedType
  };
}
function typeNode(type) {
  if (typeof type === 'string') {
    return graphql_1.parseType(type);
  }
  const namedType = applyProps(namedTypeNode, type.name);
  if (!type.list && !type.nonNull) {
    return namedType;
  }
  if (type.list && !type.nonNull) {
    return listTypeNode(namedType);
  }
  if (!type.list && type.nonNull) {
    return nonNullTypeNode(namedType);
  }
  return nonNullTypeNode(listTypeNode(nonNullTypeNode(namedType)));
}
function schemaDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.SCHEMA_DEFINITION,
    directives: applyPropsNullableArr(directiveNode, props.directives),
    operationTypes: applyPropsArr(operationTypeDefinitionNode, props.operationTypes)
  };
}
function operationTypeDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.OPERATION_TYPE_DEFINITION,
    operation: props.operation,
    type: applyProps(namedTypeNode, props.type)
  };
}
function scalarTypeDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.SCALAR_TYPE_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    directives: applyPropsNullableArr(directiveNode, props.directives)
  };
}
function objectTypeDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.OBJECT_TYPE_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    interfaces: applyPropsNullableArr(namedTypeNode, props.interfaces),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    fields: applyPropsNullableArr(fieldDefinitionNode, props.fields)
  };
}
function fieldDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.FIELD_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    arguments: applyPropsNullableArr(inputValueDefinitionNode, props.arguments),
    type: applyProps(typeNode, props.type),
    directives: applyPropsNullableArr(directiveNode, props.directives)
  };
}
function inputValueDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.INPUT_VALUE_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    type: applyProps(typeNode, props.type),
    defaultValue: props.defaultValue,
    directives: applyPropsNullableArr(directiveNode, props.directives)
  };
}
function interfaceTypeDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.INTERFACE_TYPE_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    fields: applyPropsNullableArr(fieldDefinitionNode, props.fields)
  };
}
function unionTypeDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.UNION_TYPE_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    types: applyPropsNullableArr(namedTypeNode, props.types)
  };
}
function enumTypeDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.ENUM_TYPE_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    values: applyPropsNullableArr(enumValueDefinitionNode, props.values)
  };
}
function enumValueDefinitionNode(props) {
  if (typeof props === 'string') {
    return {
      kind: graphql_1.Kind.ENUM_VALUE_DEFINITION,
      name: nameNode(props)
    };
  }
  return {
    kind: graphql_1.Kind.ENUM_VALUE_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    directives: applyPropsNullableArr(directiveNode, props.directives)
  };
}
function inputObjectTypeDefinitionNode(props) {
  return {
    kind: graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    fields: applyPropsNullableArr(inputValueDefinitionNode, props.fields)
  };
}
function directiveDefinitionNode(props) {
  var _props$repeatable;
  return {
    kind: graphql_1.Kind.DIRECTIVE_DEFINITION,
    name: applyProps(nameNode, props.name),
    description: applyPropsNullable(stringValueNode, props.description),
    arguments: applyPropsNullableArr(inputValueDefinitionNode, props.arguments),
    repeatable: (_props$repeatable = props.repeatable) !== null && _props$repeatable !== void 0 ? _props$repeatable : false,
    locations: applyPropsArr(nameNode, props.locations)
  };
}
function schemaExtensionNode(props) {
  return {
    kind: graphql_1.Kind.SCHEMA_EXTENSION,
    directives: applyPropsNullableArr(directiveNode, props.directives),
    operationTypes: applyPropsArr(operationTypeDefinitionNode, props.operationTypes)
  };
}
function scalarTypeExtensionNode(props) {
  return {
    kind: graphql_1.Kind.SCALAR_TYPE_EXTENSION,
    name: applyProps(nameNode, props.name),
    directives: applyPropsNullableArr(directiveNode, props.directives)
  };
}
function objectTypeExtensionNode(props) {
  return {
    kind: graphql_1.Kind.OBJECT_TYPE_EXTENSION,
    name: applyProps(nameNode, props.name),
    interfaces: applyPropsNullableArr(namedTypeNode, props.interfaces),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    fields: applyPropsNullableArr(fieldDefinitionNode, props.fields)
  };
}
function interfaceTypeExtensionNode(props) {
  return {
    kind: graphql_1.Kind.INTERFACE_TYPE_EXTENSION,
    name: applyProps(nameNode, props.name),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    fields: applyPropsNullableArr(fieldDefinitionNode, props.fields)
  };
}
function unionTypeExtensionNode(props) {
  return {
    kind: graphql_1.Kind.UNION_TYPE_EXTENSION,
    name: applyProps(nameNode, props.name),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    types: applyPropsNullableArr(namedTypeNode, props.types)
  };
}
function enumTypeExtensionNode(props) {
  return {
    kind: graphql_1.Kind.ENUM_TYPE_EXTENSION,
    name: applyProps(nameNode, props.name),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    values: applyPropsNullableArr(enumValueDefinitionNode, props.values)
  };
}
function inputObjectTypeExtensionNode(props) {
  return {
    kind: graphql_1.Kind.INPUT_OBJECT_TYPE_EXTENSION,
    name: applyProps(nameNode, props.name),
    directives: applyPropsNullableArr(directiveNode, props.directives),
    fields: applyPropsNullableArr(inputValueDefinitionNode, props.fields)
  };
}
var ast = Object.freeze({
  __proto__: null,
  nameNode: nameNode,
  documentNode: documentNode,
  operationDefinitionNode: operationDefinitionNode,
  variableDefinitionNode: variableDefinitionNode,
  variableNode: variableNode,
  selectionSetNode: selectionSetNode,
  fieldNode: fieldNode,
  argumentNode: argumentNode,
  fragmentSpreadNode: fragmentSpreadNode,
  inlineFragmentNode: inlineFragmentNode,
  fragmentDefinitionNode: fragmentDefinitionNode,
  intValueNode: intValueNode,
  floatValueNode: floatValueNode,
  stringValueNode: stringValueNode,
  booleanValueNode: booleanValueNode,
  nullValueNode: nullValueNode,
  enumValueNode: enumValueNode,
  listValueNode: listValueNode,
  objectValueNode: objectValueNode,
  objectFieldNode: objectFieldNode,
  directiveNode: directiveNode,
  namedTypeNode: namedTypeNode,
  listTypeNode: listTypeNode,
  nonNullTypeNode: nonNullTypeNode,
  typeNode: typeNode,
  schemaDefinitionNode: schemaDefinitionNode,
  operationTypeDefinitionNode: operationTypeDefinitionNode,
  scalarTypeDefinitionNode: scalarTypeDefinitionNode,
  objectTypeDefinitionNode: objectTypeDefinitionNode,
  fieldDefinitionNode: fieldDefinitionNode,
  inputValueDefinitionNode: inputValueDefinitionNode,
  interfaceTypeDefinitionNode: interfaceTypeDefinitionNode,
  unionTypeDefinitionNode: unionTypeDefinitionNode,
  enumTypeDefinitionNode: enumTypeDefinitionNode,
  enumValueDefinitionNode: enumValueDefinitionNode,
  inputObjectTypeDefinitionNode: inputObjectTypeDefinitionNode,
  directiveDefinitionNode: directiveDefinitionNode,
  schemaExtensionNode: schemaExtensionNode,
  scalarTypeExtensionNode: scalarTypeExtensionNode,
  objectTypeExtensionNode: objectTypeExtensionNode,
  interfaceTypeExtensionNode: interfaceTypeExtensionNode,
  unionTypeExtensionNode: unionTypeExtensionNode,
  enumTypeExtensionNode: enumTypeExtensionNode,
  inputObjectTypeExtensionNode: inputObjectTypeExtensionNode
});
function isNameNode(node) {
  return node.kind === graphql_1.Kind.NAME;
}
function isDocumentNode(node) {
  return node.kind === graphql_1.Kind.DOCUMENT;
}
function isOperationDefinitionNode(node) {
  return node.kind === graphql_1.Kind.OPERATION_DEFINITION;
}
function isVariableDefinitionNode(node) {
  return node.kind === graphql_1.Kind.VARIABLE_DEFINITION;
}
function isSelectionSetNode(node) {
  return node.kind === graphql_1.Kind.SELECTION_SET;
}
function isFieldNode(node) {
  return node.kind === graphql_1.Kind.FIELD;
}
function isArgumentNode(node) {
  return node.kind === graphql_1.Kind.ARGUMENT;
}
function isFragmentSpreadNode(node) {
  return node.kind === graphql_1.Kind.FRAGMENT_SPREAD;
}
function isInlineFragmentNode(node) {
  return node.kind === graphql_1.Kind.INLINE_FRAGMENT;
}
function isFragmentDefinitionNode(node) {
  return node.kind === graphql_1.Kind.FRAGMENT_DEFINITION;
}
function isVariableNode(node) {
  return node.kind === graphql_1.Kind.VARIABLE;
}
function isIntValueNode(node) {
  return node.kind === graphql_1.Kind.INT;
}
function isFloatValueNode(node) {
  return node.kind === graphql_1.Kind.FLOAT;
}
function isStringValueNode(node) {
  return node.kind === graphql_1.Kind.STRING;
}
function isBooleanValueNode(node) {
  return node.kind === graphql_1.Kind.BOOLEAN;
}
function isNullValueNode(node) {
  return node.kind === graphql_1.Kind.NULL;
}
function iEnumValueNode(node) {
  return node.kind === graphql_1.Kind.ENUM;
}
function isListValueNode(node) {
  return node.kind === graphql_1.Kind.LIST;
}
function isObjectValueNode(node) {
  return node.kind === graphql_1.Kind.OBJECT;
}
function isObjectFieldNode(node) {
  return node.kind === graphql_1.Kind.OBJECT_FIELD;
}
function isDirectiveNode(node) {
  return node.kind === graphql_1.Kind.DIRECTIVE;
}
function isNamedTypeNode(node) {
  return node.kind === graphql_1.Kind.NAMED_TYPE;
}
function isListTypeNode(node) {
  return node.kind === graphql_1.Kind.LIST_TYPE;
}
function isNonNullTypeNode(node) {
  return node.kind === graphql_1.Kind.NON_NULL_TYPE;
}
function isSchemaDefinitionNode(node) {
  return node.kind === graphql_1.Kind.SCHEMA_DEFINITION;
}
function isOperationTypeDefinitionNode(node) {
  return node.kind === graphql_1.Kind.OPERATION_TYPE_DEFINITION;
}
function isScalarTypeDefinitionNode(node) {
  return node.kind === graphql_1.Kind.SCALAR_TYPE_DEFINITION;
}
function isObjectTypeDefinitionNode(node) {
  return node.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION;
}
function isFieldDefinitionNode(node) {
  return node.kind === graphql_1.Kind.FIELD_DEFINITION;
}
function isInputValueDefinitionNode(node) {
  return node.kind === graphql_1.Kind.INPUT_VALUE_DEFINITION;
}
function isInterfaceTypeDefinitionNode(node) {
  return node.kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION;
}
function isUnionTypeDefinitionNode(node) {
  return node.kind === graphql_1.Kind.UNION_TYPE_DEFINITION;
}
function isEnumTypeDefinitionNode(node) {
  return node.kind === graphql_1.Kind.ENUM_TYPE_DEFINITION;
}
function isEnumValueDefinitionNode(node) {
  return node.kind === graphql_1.Kind.ENUM_VALUE_DEFINITION;
}
function isInputObjectTypeDefinitionNode(node) {
  return node.kind === graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION;
}
function isDirectiveDefinitionNode(node) {
  return node.kind === graphql_1.Kind.DIRECTIVE_DEFINITION;
}
function isSchemaExtensionNode(node) {
  return node.kind === graphql_1.Kind.SCHEMA_EXTENSION;
}
function isScalarTypeExtensionNode(node) {
  return node.kind === graphql_1.Kind.SCALAR_TYPE_EXTENSION;
}
function isObjectTypeExtensionNode(node) {
  return node.kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION;
}
function isInterfaceTypeExtensionNode(node) {
  return node.kind === graphql_1.Kind.INTERFACE_TYPE_EXTENSION;
}
function isUnionTypeExtensionNode(node) {
  return node.kind === graphql_1.Kind.UNION_TYPE_EXTENSION;
}
function isEnumTypeExtensionNode(node) {
  return node.kind === graphql_1.Kind.ENUM_TYPE_EXTENSION;
}
function isInputObjectTypeExtensionNode(node) {
  return node.kind === graphql_1.Kind.INPUT_OBJECT_TYPE_EXTENSION;
}
const astKindToFunctionMap = {
  Name: nameNode,
  Document: documentNode,
  OperationDefinition: operationDefinitionNode,
  VariableDefinition: variableDefinitionNode,
  SelectionSet: selectionSetNode,
  Field: fieldNode,
  Argument: argumentNode,
  FragmentSpread: fragmentSpreadNode,
  InlineFragment: inlineFragmentNode,
  FragmentDefinition: fragmentDefinitionNode,
  Variable: variableNode,
  IntValue: intValueNode,
  FloatValue: floatValueNode,
  StringValue: stringValueNode,
  BooleanValue: booleanValueNode,
  NullValue: nullValueNode,
  EnumValue: enumValueNode,
  ListValue: listValueNode,
  ObjectValue: objectValueNode,
  ObjectField: objectFieldNode,
  Directive: directiveNode,
  NamedType: namedTypeNode,
  ListType: listTypeNode,
  NonNullType: nonNullTypeNode,
  SchemaDefinition: schemaDefinitionNode,
  OperationTypeDefinition: operationTypeDefinitionNode,
  ScalarTypeDefinition: scalarTypeDefinitionNode,
  ObjectTypeDefinition: objectTypeDefinitionNode,
  InterfaceTypeDefinition: interfaceTypeDefinitionNode,
  UnionTypeDefinition: unionTypeDefinitionNode,
  EnumValueDefinition: enumValueDefinitionNode,
  InputObjectTypeDefinition: inputObjectTypeDefinitionNode,
  FieldDefinition: fieldDefinitionNode,
  InputValueDefinition: inputValueDefinitionNode,
  EnumTypeDefinition: enumTypeDefinitionNode,
  DirectiveDefinition: directiveDefinitionNode,
  SchemaExtension: schemaExtensionNode,
  ScalarTypeExtension: scalarTypeExtensionNode,
  ObjectTypeExtension: objectTypeExtensionNode,
  InterfaceTypeExtension: interfaceTypeExtensionNode,
  UnionTypeExtension: unionTypeExtensionNode,
  EnumTypeExtension: enumTypeExtensionNode,
  InputObjectTypeExtension: inputObjectTypeExtensionNode
};
function astKindToFunction(kind) {
  return astKindToFunctionMap[kind];
}
const queryType = props => {
  return objectTypeDefinitionNode({
    name: 'Query',
    ...props
  });
};
const mutationType = props => {
  return objectTypeDefinitionNode({
    name: 'Query',
    ...props
  });
};
const subscriptionType = props => {
  return objectTypeDefinitionNode({
    name: 'Query',
    ...props
  });
};
const name = nameNode;
const document = documentNode;
const operation = operationDefinitionNode;
const variable = variableDefinitionNode;
const selections = selectionSetNode;
const field = fieldNode;
const arg = argumentNode;
const fragmentSpread = fragmentSpreadNode;
const inlineFragment = inlineFragmentNode;
const fragmentDef = fragmentDefinitionNode;
const value = {
  variable: variableNode,
  int: intValueNode,
  float: floatValueNode,
  bool: booleanValueNode,
  object: objectValueNode,
  null: nullValueNode,
  string: stringValueNode,
  enum: enumValueNode,
  list: listValueNode,
  objectField: objectFieldNode
};
const directive = directiveNode;
const type = {
  named: namedTypeNode,
  list: listTypeNode,
  nonNull: nonNullTypeNode,
  id: () => namedTypeNode('ID'),
  int: () => namedTypeNode('Int'),
  float: () => namedTypeNode('Float'),
  bool: () => namedTypeNode('Boolean'),
  string: () => namedTypeNode('String'),
  json: () => namedTypeNode('JSON'),
  date: () => namedTypeNode('Date'),
  dateTime: () => namedTypeNode('DateTime')
};
const schemaDef = schemaDefinitionNode;
const operationType = operationTypeDefinitionNode;
const scalarType = scalarTypeDefinitionNode;
const objectType = objectTypeDefinitionNode;
const interfaceType = interfaceTypeDefinitionNode;
const unionType = unionTypeDefinitionNode;
const enumType = enumTypeDefinitionNode;
const inputType = inputObjectTypeDefinitionNode;
const fieldDef = fieldDefinitionNode;
const inputVal = inputValueDefinitionNode;
const enumVal = enumValueDefinitionNode;
const directiveDef = directiveDefinitionNode;
const schemaExt = schemaExtensionNode;
const objectExt = objectTypeExtensionNode;
const interfaceExt = interfaceTypeExtensionNode;
const unionExt = unionTypeExtensionNode;
const scalarExt = scalarTypeExtensionNode;
const enumExt = enumTypeExtensionNode;
const inputObjectExt = inputObjectTypeExtensionNode;
var alias = Object.freeze({
  __proto__: null,
  queryType: queryType,
  mutationType: mutationType,
  subscriptionType: subscriptionType,
  name: name,
  document: document,
  operation: operation,
  variable: variable,
  selections: selections,
  field: field,
  arg: arg,
  fragmentSpread: fragmentSpread,
  inlineFragment: inlineFragment,
  fragmentDef: fragmentDef,
  value: value,
  directive: directive,
  type: type,
  schemaDef: schemaDef,
  operationType: operationType,
  scalarType: scalarType,
  objectType: objectType,
  interfaceType: interfaceType,
  unionType: unionType,
  enumType: enumType,
  inputType: inputType,
  fieldDef: fieldDef,
  inputVal: inputVal,
  enumVal: enumVal,
  directiveDef: directiveDef,
  schemaExt: schemaExt,
  objectExt: objectExt,
  interfaceExt: interfaceExt,
  unionExt: unionExt,
  scalarExt: scalarExt,
  enumExt: enumExt,
  inputObjectExt: inputObjectExt
});
function oneToManyGet({node, key, elementName, parentName}) {
  const res = (node[key] || []).find(el => el.name.value === elementName);
  if (!res) {
    throw Error(`${singular(key)} '${elementName}' on '${parentName}' does not exist`);
  }
  return res;
}
function oneToManyCreate({node, key, elementName, parentName, props, nodeCreateFn}) {
  if (!node[key]) {
    node[key] = [];
  }
  const property = node[key] || [];
  const index = property.findIndex(el => el.name.value === elementName);
  if (index !== -1) {
    throw Error(`${singular(key)} '${elementName}' on '${parentName}' already exist`);
  }
  property.push(applyPropsCloned(nodeCreateFn, props));
}
function oneToManyUpdate({node, key, elementName, parentName, props, nodeCreateFn}) {
  const property = node[key] || [];
  const index = property.findIndex(el => el.name.value === elementName);
  if (property.length === 0 || index === -1) {
    throw Error(`${singular(key)} '${elementName}' on '${parentName}' does not exist`);
  }
  const {kind, ...prev} = property[index];
  property[index] = nodeCreateFn({
    ...prev,
    ...cloneDeep(props)
  });
}
function oneToManyUpsert({node, key, elementName, props, nodeCreateFn}) {
  if (!node[key]) {
    node[key] = [];
  }
  const property = node[key] || [];
  const index = property.findIndex(el => el.name.value === elementName);
  const next = applyPropsCloned(nodeCreateFn, props);
  if (index === -1) {
    property[index] = next;
  } else {
    property.push(next);
  }
}
function oneToManyRemove({node, key, elementName, parentName}) {
  const property = node[key] || [];
  const index = property.findIndex(el => el.name.value === elementName);
  if (index === -1) {
    throw Error(`${singular(key)} '${elementName}' on '${parentName}' does not exist`);
  }
  property.splice(index, 1);
}
function singular(key) {
  return key.replace(/s$/, '');
}
function argumentsApiMixin(node) {
  return {
    getargnames() {
      var _node$arguments;
      return ((_node$arguments = node.arguments) !== null && _node$arguments !== void 0 ? _node$arguments : []).map(arg => arg.name.value);
    },
    hasArgument(argName) {
      return !!node.arguments && node.arguments.some(arg => arg.name.value === argName);
    },
    getArguments() {
      var _node$arguments2;
      return ((_node$arguments2 = node.arguments) !== null && _node$arguments2 !== void 0 ? _node$arguments2 : []).map(argumentApi);
    },
    getArgument(argName) {
      const arg = oneToManyGet({
        node,
        key: 'arguments',
        elementName: argName,
        parentName: node.name.value
      });
      return argumentApi(arg);
    },
    createArgument(props) {
      oneToManyCreate({
        node,
        key: 'arguments',
        elementName: getName(props.name),
        parentName: node.name.value,
        nodeCreateFn: argumentNode,
        props
      });
      return this;
    },
    updateArgument(argname, props) {
      oneToManyUpdate({
        node,
        key: 'arguments',
        elementName: argname,
        parentName: node.name.value,
        nodeCreateFn: argumentNode,
        props
      });
      return this;
    },
    upsertArgument(props) {
      oneToManyUpsert({
        node,
        key: 'arguments',
        elementName: getName(props.name),
        parentName: node.name.value,
        nodeCreateFn: argumentNode,
        props
      });
      return this;
    },
    removeArgument(argname) {
      oneToManyRemove({
        node,
        key: 'arguments',
        elementName: argname,
        parentName: node.name.value
      });
      return this;
    }
  };
}
function typeDefinitionAssertionApiMixin(node) {
  const assertionErr = kind => Error(`asserted type '${kind}', but node ${node.name.value} is '${node.kind}'`);
  return {
    isEnumType() {
      return node.kind === graphql_1.Kind.ENUM_TYPE_DEFINITION;
    },
    isInputType() {
      return node.kind === graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION;
    },
    isInterfaceType() {
      return node.kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION;
    },
    isObjectType() {
      return node.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION;
    },
    isScalarType() {
      return node.kind === graphql_1.Kind.SCALAR_TYPE_DEFINITION;
    },
    isUnionType() {
      return node.kind === graphql_1.Kind.UNION_TYPE_DEFINITION;
    },
    assertEnumType() {
      if (!this.isEnumType()) {
        throw assertionErr(graphql_1.Kind.ENUM_TYPE_DEFINITION);
      }
      return this;
    },
    assertInputType() {
      if (!this.isInputType()) {
        throw assertionErr(graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION);
      }
      return this;
    },
    assertInterfaceType() {
      if (!this.isInterfaceType()) {
        throw assertionErr(graphql_1.Kind.INTERFACE_TYPE_DEFINITION);
      }
      return this;
    },
    assertObjectType() {
      if (!this.isObjectType()) {
        throw assertionErr(graphql_1.Kind.OBJECT_TYPE_DEFINITION);
      }
      return this;
    },
    assertScalarType() {
      if (!this.isScalarType()) {
        throw assertionErr(graphql_1.Kind.SCALAR_TYPE_DEFINITION);
      }
      return this;
    },
    assertUnionType() {
      if (!this.isUnionType()) {
        throw assertionErr(graphql_1.Kind.UNION_TYPE_DEFINITION);
      }
      return this;
    }
  };
}
function typeExtensionAssertionApiMixin(node) {
  const assertionErr = kind => Error(`asserted type '${kind}', but node ${node.name.value} is '${node.kind}'`);
  return {
    isEnumExt() {
      return node.kind === graphql_1.Kind.ENUM_TYPE_EXTENSION;
    },
    isInputExt() {
      return node.kind === graphql_1.Kind.INPUT_OBJECT_TYPE_EXTENSION;
    },
    isInterfaceExt() {
      return node.kind === graphql_1.Kind.INTERFACE_TYPE_EXTENSION;
    },
    isObjectExt() {
      return node.kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION;
    },
    isScalarExt() {
      return node.kind === graphql_1.Kind.SCALAR_TYPE_EXTENSION;
    },
    isUnionExt() {
      return node.kind === graphql_1.Kind.UNION_TYPE_EXTENSION;
    },
    assertEnumExt() {
      if (!this.isEnumExt()) {
        throw assertionErr(graphql_1.Kind.ENUM_TYPE_EXTENSION);
      }
      return this;
    },
    assertInputExt() {
      if (!this.isInputExt()) {
        throw assertionErr(graphql_1.Kind.INPUT_OBJECT_TYPE_EXTENSION);
      }
      return this;
    },
    assertInterfaceExt() {
      if (!this.isInterfaceExt()) {
        throw assertionErr(graphql_1.Kind.INTERFACE_TYPE_EXTENSION);
      }
      return this;
    },
    assertObjectExt() {
      if (!this.isObjectExt()) {
        throw assertionErr(graphql_1.Kind.OBJECT_TYPE_EXTENSION);
      }
      return this;
    },
    assertScalarExt() {
      if (!this.isScalarExt()) {
        throw assertionErr(graphql_1.Kind.SCALAR_TYPE_EXTENSION);
      }
      return this;
    },
    assertUnionExt() {
      if (!this.isUnionExt()) {
        throw assertionErr(graphql_1.Kind.UNION_TYPE_EXTENSION);
      }
      return this;
    }
  };
}
function descriptionApiMixin(node) {
  const _node = node;
  return {
    hasDescription() {
      return !!node.description;
    },
    getDescription() {
      return node.description ? node.description.value : undefined;
    },
    setDescription(value) {
      if (typeof value === 'undefined') {
        _node.description = undefined;
      } else {
        _node.description = stringValueNode(value);
      }
      return this;
    }
  };
}
function directivesApiMixin(node) {
  return {
    getDirectiveNames() {
      var _node$directives;
      return ((_node$directives = node.directives) !== null && _node$directives !== void 0 ? _node$directives : []).map(dir => dir.name.value);
    },
    hasDirective(directiveName) {
      return !!node.directives && node.directives.some(dir => dir.name.value === directiveName);
    },
    getDirectives() {
      var _node$directives2;
      return ((_node$directives2 = node.directives) !== null && _node$directives2 !== void 0 ? _node$directives2 : []).map(directiveApi);
    },
    getDirective(directiveName) {
      const directive = oneToManyGet({
        node,
        key: 'directives',
        elementName: directiveName,
        parentName: getName(node)
      });
      return directiveApi(directive);
    },
    createDirective(props) {
      oneToManyCreate({
        node,
        key: 'directives',
        elementName: getName(props),
        parentName: getName(node),
        nodeCreateFn: directiveNode,
        props
      });
      return this;
    },
    updateDirective(directiveName, props) {
      oneToManyUpdate({
        node,
        key: 'directives',
        elementName: directiveName,
        parentName: getName(node),
        nodeCreateFn: directiveNode,
        props
      });
      return this;
    },
    upsertDirective(props) {
      oneToManyUpsert({
        node,
        key: 'directives',
        elementName: getName(props),
        parentName: getName(node),
        nodeCreateFn: directiveNode,
        props
      });
      return this;
    },
    removeDirective(directiveName) {
      oneToManyRemove({
        node,
        key: 'directives',
        elementName: directiveName,
        parentName: getName(node)
      });
      return this;
    }
  };
}
function fieldDefinitionsApiMixin(node) {
  return {
    getfieldnames() {
      var _node$fields;
      return ((_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : []).map(field => field.name.value);
    },
    getFields() {
      var _node$fields2;
      return ((_node$fields2 = node.fields) !== null && _node$fields2 !== void 0 ? _node$fields2 : []).map(fieldDefinitionApi);
    },
    getFieldsByTypename(typename) {
      return this.getFields().filter(field => field.getTypename() === typename);
    },
    hasField(fieldname) {
      return !!node.fields && node.fields.some(field => field.name.value === fieldname);
    },
    getField(fieldname) {
      const field = oneToManyGet({
        node,
        key: 'fields',
        elementName: fieldname,
        parentName: node.name.value
      });
      return fieldDefinitionApi(field);
    },
    createField(props) {
      oneToManyCreate({
        node,
        key: 'fields',
        elementName: getName(props.name),
        parentName: node.name.value,
        nodeCreateFn: fieldDefinitionNode,
        props
      });
      return this;
    },
    updateField(fieldname, props) {
      oneToManyUpdate({
        node,
        key: 'fields',
        elementName: fieldname,
        parentName: node.name.value,
        nodeCreateFn: fieldDefinitionNode,
        props
      });
      return this;
    },
    upsertField(props) {
      oneToManyUpsert({
        node,
        key: 'fields',
        elementName: getName(props.name),
        parentName: node.name.value,
        nodeCreateFn: fieldDefinitionNode,
        props
      });
      return this;
    },
    removeField(fieldname) {
      oneToManyRemove({
        node,
        key: 'fields',
        elementName: fieldname,
        parentName: node.name.value
      });
      return this;
    },
    getFieldTypename(fieldname) {
      return this.getField(fieldname).getTypename();
    },
    setFieldTypename(fieldname, value) {
      this.getField(fieldname).setTypename(value);
      return this;
    },
    getFieldType(fieldname) {
      return this.getField(fieldname).getType();
    },
    setFieldType(fieldname, props) {
      this.getField(fieldname).setType(props);
      return this;
    },
    getFieldArguments(fieldname) {
      return this.getField(fieldname).getArguments();
    },
    getFieldDirectives(fieldname) {
      return this.getField(fieldname).getDirectives();
    }
  };
}
function inputValuesAsArgumentsApiMixin(node) {
  return {
    getargnames() {
      var _node$arguments;
      return ((_node$arguments = node.arguments) !== null && _node$arguments !== void 0 ? _node$arguments : []).map(getName);
    },
    getArguments() {
      var _node$arguments2;
      return ((_node$arguments2 = node.arguments) !== null && _node$arguments2 !== void 0 ? _node$arguments2 : []).map(inputValueApi);
    },
    getArgumentsByTypename(typename) {
      return this.getArguments().filter(arg => arg.getTypename() === typename);
    },
    hasArgument(argname) {
      var _node$arguments3;
      return ((_node$arguments3 = node.arguments) !== null && _node$arguments3 !== void 0 ? _node$arguments3 : []).some(arg => arg.name.value === argname);
    },
    getArgument(argname) {
      const arg = oneToManyGet({
        node,
        key: 'arguments',
        elementName: argname,
        parentName: node.name.value
      });
      return inputValueApi(arg);
    },
    createArgument(props) {
      oneToManyCreate({
        node,
        key: 'arguments',
        elementName: getName(props),
        parentName: node.name.value,
        nodeCreateFn: inputValueDefinitionNode,
        props
      });
      return this;
    },
    upsertArgument(props) {
      oneToManyUpsert({
        node,
        key: 'arguments',
        elementName: getName(props),
        parentName: node.name.value,
        nodeCreateFn: inputValueDefinitionNode,
        props
      });
      return this;
    },
    updateArgument(argname, props) {
      oneToManyUpdate({
        node,
        key: 'arguments',
        elementName: argname,
        parentName: node.name.value,
        nodeCreateFn: inputValueDefinitionNode,
        props
      });
      return this;
    },
    removeArgument(argname) {
      oneToManyRemove({
        node,
        key: 'arguments',
        elementName: argname,
        parentName: node.name.value
      });
      return this;
    },
    getArgumentType(argname) {
      return this.getArgument(argname).getType();
    },
    setArgumentType(argname, props) {
      this.getArgument(argname).setType(props);
      return this;
    },
    getArgumentDefaultValue(argname) {
      return this.getArgument(argname).getDefaultValue();
    },
    setArgumentDefualtValue(argname, props) {
      this.getArgument(argname).setDefaultValue(props);
      return this;
    }
  };
}
function inputValuesAsFieldsApiMixin(node) {
  return {
    getfieldnames() {
      var _node$fields;
      return ((_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : []).map(getName);
    },
    getFields() {
      var _node$fields2;
      return ((_node$fields2 = node.fields) !== null && _node$fields2 !== void 0 ? _node$fields2 : []).map(inputValueApi);
    },
    getFieldsByTypename(typename) {
      return this.getFields().filter(field => field.getType().getTypename() === typename);
    },
    hasField(fieldname) {
      var _node$fields3;
      return ((_node$fields3 = node.fields) !== null && _node$fields3 !== void 0 ? _node$fields3 : []).some(field => field.name.value === fieldname);
    },
    getField(fieldname) {
      const arg = oneToManyGet({
        node,
        key: 'fields',
        elementName: fieldname,
        parentName: node.name.value
      });
      return inputValueApi(arg);
    },
    createField(props) {
      oneToManyCreate({
        node,
        key: 'fields',
        elementName: getName(props),
        parentName: node.name.value,
        nodeCreateFn: inputValueDefinitionNode,
        props
      });
      return this;
    },
    upsertField(props) {
      oneToManyUpsert({
        node,
        key: 'fields',
        elementName: getName(props),
        parentName: node.name.value,
        nodeCreateFn: inputValueDefinitionNode,
        props
      });
      return this;
    },
    updateField(fieldname, props) {
      oneToManyUpdate({
        node,
        key: 'fields',
        elementName: fieldname,
        parentName: node.name.value,
        nodeCreateFn: inputValueDefinitionNode,
        props
      });
      return this;
    },
    removeField(fieldname) {
      oneToManyRemove({
        node,
        key: 'fields',
        elementName: fieldname,
        parentName: node.name.value
      });
      return this;
    },
    getFieldType(fieldname) {
      return this.getField(fieldname).getType();
    },
    setFieldType(fieldname, props) {
      this.getField(fieldname).setType(props);
      return this;
    },
    getFieldDefaultValue(fieldname) {
      return this.getField(fieldname).getDefaultValue();
    },
    setFieldDefualtValue(fieldname, props) {
      this.getField(fieldname).setDefaultValue(props);
      return this;
    }
  };
}
function nameApiMixin(node) {
  const _node = node;
  return {
    getName() {
      return node.name.value;
    },
    setName(value) {
      _node.name = nameNode(value);
      return this;
    }
  };
}
function typeApiMixin(node) {
  return {
    getType() {
      return typeApi(node.type);
    },
    getTypename() {
      return this.getType().getTypename();
    },
    getNamedType() {
      return this.getType().getNamedType();
    },
    setTypename(value) {
      this.getType().setTypename(value);
      return this;
    },
    setType(props) {
      this.getType().setType(props);
      return this;
    },
    isNonNullType(deep) {
      return this.getType().isNonNull(deep);
    },
    isListType(deep) {
      return this.getType().isList(deep);
    },
    setNonNullType(value) {
      this.getType().setNonNull(value);
      return this;
    },
    setListType(value) {
      this.getType().setList(value);
      return this;
    }
  };
}
function objectTypeApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...directivesApiMixin(node),
    ...fieldDefinitionsApiMixin(node),
    ...typeDefinitionAssertionApiMixin(node)
  };
}
function interfaceTypeApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...directivesApiMixin(node),
    ...fieldDefinitionsApiMixin(node),
    ...typeDefinitionAssertionApiMixin(node)
  };
}
function unionTypeApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...directivesApiMixin(node),
    ...typeDefinitionAssertionApiMixin(node)
  };
}
function scalarTypeApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...directivesApiMixin(node),
    ...typeDefinitionAssertionApiMixin(node)
  };
}
function enumTypeApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...directivesApiMixin(node),
    ...typeDefinitionAssertionApiMixin(node)
  };
}
function inputTypeApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...directivesApiMixin(node),
    ...inputValuesAsFieldsApiMixin(node),
    ...typeDefinitionAssertionApiMixin(node)
  };
}
function objectExtApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...directivesApiMixin(node),
    ...fieldDefinitionsApiMixin(node),
    ...typeExtensionAssertionApiMixin(node)
  };
}
function interfaceExtApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...directivesApiMixin(node),
    ...fieldDefinitionsApiMixin(node),
    ...typeExtensionAssertionApiMixin(node)
  };
}
function unionExtApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...directivesApiMixin(node),
    ...typeExtensionAssertionApiMixin(node)
  };
}
function scalarExtApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...directivesApiMixin(node),
    ...typeExtensionAssertionApiMixin(node)
  };
}
function enumExtApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...directivesApiMixin(node),
    ...typeExtensionAssertionApiMixin(node)
  };
}
function inputExtApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...directivesApiMixin(node),
    ...inputValuesAsFieldsApiMixin(node),
    ...typeExtensionAssertionApiMixin(node)
  };
}
function directiveDefinitionApi(node) {
  const _node = node;
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...inputValuesAsArgumentsApiMixin(node),
    isRepeatable() {
      return node.repeatable;
    },
    setRepeatable(value) {
      _node.repeatable = value;
      return this;
    },
    getLocations() {
      return node.locations.map(getName);
    },
    setLocations(values) {
      _node.locations = applyPropsArr(nameNode, values);
      return this;
    },
    hasLocation(value) {
      const name = getName(value);
      return node.locations.some(loc => loc.value === name);
    },
    createLocation(value) {
      const next = applyProps(nameNode, value);
      if (node.locations.some(loc => loc.value === next.value)) {
        throw Error(`location '${next.value}' on ${node.name.value} already exists`);
      }
      _node.locations.push(next);
      return this;
    },
    upsertLocation(value) {
      const next = applyProps(nameNode, value);
      const index = node.locations.findIndex(loc => loc.value === next.value);
      if (index !== -1) {
        _node.locations[index] = next;
      } else {
        _node.locations.push(next);
      }
      return this;
    },
    removeLocation(value) {
      const name = getName(value);
      const index = node.locations.findIndex(loc => loc.value === name);
      if (index === -1) {
        throw Error(`location '${name}' on ${node.name.value} does not exist`);
      }
      _node.locations.splice(index, 1);
      return this;
    }
  };
}
function fieldDefinitionApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...directivesApiMixin(node),
    ...inputValuesAsArgumentsApiMixin(node),
    ...typeApiMixin(node),
    toInputValue() {
      const {kind, arguments: args, loc, ...rest} = node;
      return inputValueApi({
        kind: graphql_1.Kind.INPUT_VALUE_DEFINITION,
        ...rest
      });
    }
  };
}
function inputValueApi(node) {
  const _node = node;
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...directivesApiMixin(node),
    ...typeApiMixin(node),
    toField() {
      const {kind, defaultValue, loc, ...rest} = node;
      return fieldDefinitionApi({
        kind: graphql_1.Kind.FIELD_DEFINITION,
        ...rest
      });
    },
    getDefaultValue() {
      return node.defaultValue;
    },
    setDefaultValue(value) {
      _node.defaultValue = value;
      return this;
    }
  };
}
function typeApi(node) {
  const _node = node;
  const _getNamedType = type => type.kind === graphql_1.Kind.NAMED_TYPE ? type : _getNamedType(type.type);
  const _isNonNullDeep = type => type.kind === graphql_1.Kind.NON_NULL_TYPE ? true : type.kind === graphql_1.Kind.NAMED_TYPE ? false : _isNonNullDeep(type.type);
  const _isListDeep = type => type.kind === graphql_1.Kind.LIST_TYPE ? true : type.kind === graphql_1.Kind.NAMED_TYPE ? false : _isListDeep(type.type);
  return {
    node,
    getNamedType() {
      return _getNamedType(node);
    },
    getTypename() {
      return _getNamedType(node).name.value;
    },
    setTypename(value) {
      const namedType = _getNamedType(_node);
      namedType.name = nameNode(value);
      return this;
    },
    setType(props) {
      Object.assign(node, applyPropsCloned(typeNode, props));
      return this;
    },
    isNonNull(deep = true) {
      if (!deep) {
        return node.kind === graphql_1.Kind.NON_NULL_TYPE;
      }
      return _isNonNullDeep(node);
    },
    isList(deep = true) {
      if (!deep) {
        return node.kind === graphql_1.Kind.LIST_TYPE;
      }
      return _isListDeep(node);
    },
    setNonNull(value = true) {
      if (value && node.kind !== graphql_1.Kind.NON_NULL_TYPE) {
        Object.assign(node, nonNullTypeNode(node));
      }
      if (!value && node.kind === graphql_1.Kind.NON_NULL_TYPE) {
        Object.assign(node, node.type);
      }
      return this;
    },
    setList(value = true) {
      if (value && node.kind !== graphql_1.Kind.LIST_TYPE) {
        Object.assign(node, listTypeNode(node));
      }
      if (!value && node.kind === graphql_1.Kind.LIST_TYPE) {
        Object.assign(node, node.type);
      }
      return this;
    }
  };
}
function enumValueApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...descriptionApiMixin(node),
    ...directivesApiMixin(node)
  };
}
function directiveApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    ...argumentsApiMixin(node)
  };
}
function argumentApi(node) {
  return {
    node,
    ...nameApiMixin(node),
    getValue() {
      return node.value;
    },
    setValue(value) {
      Object.assign(node, value);
      return this;
    }
  };
}
const astKindToApiMap = {
  Document: documentApi,
  ScalarTypeDefinition: scalarTypeApi,
  ObjectTypeDefinition: objectTypeApi,
  InterfaceTypeDefinition: interfaceTypeApi,
  UnionTypeDefinition: unionTypeApi,
  EnumTypeDefinition: enumTypeApi,
  InputObjectTypeDefinition: inputTypeApi,
  FieldDefinition: fieldDefinitionApi,
  InputValueDefinition: inputValueApi,
  EnumValueDefinition: enumValueApi,
  DirectiveDefinition: directiveDefinitionApi,
  ScalarTypeExtension: scalarExtApi,
  ObjectTypeExtension: objectExtApi,
  InterfaceTypeExtension: interfaceExtApi,
  UnionTypeExtension: unionExtApi,
  EnumTypeExtension: enumExtApi,
  InputObjectTypeExtension: inputExtApi
};
function astKindToApi(kind) {
  return astKindToApiMap[kind];
}
const PARSE_OPTIONS = {
  experimentalFragmentVariables: true,
  noLocation: true
};
function normaliseSDLInput(sdl) {
  if (typeof sdl === 'string') {
    return [...graphql_1.parse(sdl, PARSE_OPTIONS).definitions];
  }
  if (Array.isArray(sdl)) {
    return sdl.flatMap(normaliseSDLInput);
  }
  if (sdl.kind === graphql_1.Kind.DOCUMENT) {
    return [...sdl.definitions];
  }
  throw Error(`invalid sdl \n ${JSON.stringify(sdl, null, 2)}`);
}
function documentApi() {
  const typeMap = new Map();
  const extMap = new Map();
  const directiveMap = new Map();
  const getNode = typename => {
    const node = typeMap.get(typename);
    if (!node) {
      throw Error(`type '${typename}' does not exist`);
    }
    return node;
  };
  const removeNode = typename => {
    const isFound = typeMap.delete(typename);
    if (!isFound) {
      throw Error(`type '${typename}' does not exist`);
    }
  };
  const getExt = typename => {
    const node = extMap.get(typename);
    if (!node) {
      throw Error(`type extension '${typename}' does not exist`);
    }
    return node;
  };
  const removeExt = typename => {
    const isFound = extMap.delete(typename);
    if (!isFound) {
      throw Error(`type extension '${typename}' does not exist`);
    }
  };
  const getNodeOfKind = (kind, typename) => {
    const node = getNode(typename);
    if (node.kind !== kind) {
      throw Error(`requested '${kind}', but type '${typename}' is '${node.kind}'`);
    }
    return node;
  };
  const createNodeOfKind = (kind, props) => {
    const typename = getName(props);
    const createFn = astKindToFunction(kind);
    const node = applyPropsCloned(createFn, props);
    if (node.kind !== kind) {
      throw Error(`creating '${kind}', but provided node '${typename}' is '${node.kind}'`);
    }
    if (typeMap.has(typename)) {
      throw Error(`type '${typename}' already exists`);
    }
    typeMap.set(typename, node);
    return node;
  };
  const getOrCreateNodeOfKind = (kind, props) => {
    const typename = getName(props);
    if (typeMap.has(typename)) {
      return getNodeOfKind(kind, typename);
    } else {
      return createNodeOfKind(kind, props);
    }
  };
  return {
    typeMap,
    extMap,
    directiveMap,
    addSDL(sdl) {
      const definitions = normaliseSDLInput(sdl);
      for (const node of definitions) {
        if (isDirectiveDefinitionNode(node)) {
          directiveMap.set(node.name.value, node);
          continue;
        }
        if (graphql_1.isTypeDefinitionNode(node)) {
          typeMap.set(node.name.value, node);
          continue;
        }
        if (graphql_1.isTypeExtensionNode(node)) {
          extMap.set(node.name.value, node);
          continue;
        }
        throw Error(`invalid definition \n ${JSON.stringify(node, null, 2)}`);
      }
      return this;
    },
    toDocument() {
      return documentNode([...directiveMap.values(), ...typeMap.values(), ...extMap.values()]);
    },
    toSDLString() {
      return graphql_1.print(this.toDocument());
    },
    cloneInstance() {
      return documentApi().addSDL(cloneDeep(this.toDocument()));
    },
    hasType(typename) {
      return typeMap.has(typename);
    },
    getType(typename) {
      const node = getNode(typename);
      const apiFn = astKindToApi(node.kind);
      return apiFn(node);
    },
    removeType(typename) {
      removeNode(typename);
      return this;
    },
    hasExt(typename) {
      return extMap.has(typename);
    },
    getExt(typename) {
      const node = getExt(typename);
      const apiFn = astKindToApi(node.kind);
      return apiFn(node);
    },
    removeExt(typename) {
      removeExt(typename);
      return this;
    },
    hasDirective(directiveName) {
      return directiveMap.has(directiveName);
    },
    getDirective(directiveName) {
      const node = directiveMap.get(directiveName);
      if (!node) {
        throw Error(`directive '${directiveName}' does not exist`);
      }
      return directiveDefinitionApi(node);
    },
    removeDirective(directiveName) {
      const isFound = extMap.delete(directiveName);
      if (!isFound) {
        throw Error(`directive '${directiveName}' does not exist`);
      }
      return this;
    },
    createDirective(props) {
      const directiveName = getName(props);
      const node = applyPropsCloned(directiveDefinitionNode, props);
      if (directiveMap.has(directiveName)) {
        throw Error(`directive '${directiveName}' already exists`);
      }
      if (node.kind !== graphql_1.Kind.DIRECTIVE_DEFINITION) {
        throw Error(`creating Directive '${directiveName}' but provided '${node.kind}'`);
      }
      directiveMap.set(directiveName, node);
      return directiveDefinitionApi(node);
    },
    getOrCreateDirective(props) {
      const directiveName = getName(props);
      if (directiveMap.has(directiveName)) {
        return this.getDirective(directiveName);
      } else {
        return this.createDirective(props);
      }
    },
    getScalarType(typename) {
      const node = getNodeOfKind(graphql_1.Kind.SCALAR_TYPE_DEFINITION, typename);
      return scalarTypeApi(node);
    },
    getObjectType(typename) {
      const node = getNodeOfKind(graphql_1.Kind.OBJECT_TYPE_DEFINITION, typename);
      return objectTypeApi(node);
    },
    getInterfaceType(typename) {
      const node = getNodeOfKind(graphql_1.Kind.INTERFACE_TYPE_DEFINITION, typename);
      return interfaceTypeApi(node);
    },
    getUnionType(typename) {
      const node = getNodeOfKind(graphql_1.Kind.UNION_TYPE_DEFINITION, typename);
      return unionTypeApi(node);
    },
    getEnumType(typename) {
      const node = getNodeOfKind(graphql_1.Kind.ENUM_TYPE_DEFINITION, typename);
      return enumTypeApi(node);
    },
    getInputType(typename) {
      const node = getNodeOfKind(graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION, typename);
      return inputTypeApi(node);
    },
    getOrCreateScalarType(props) {
      const node = getOrCreateNodeOfKind(graphql_1.Kind.SCALAR_TYPE_DEFINITION, props);
      return scalarTypeApi(node);
    },
    getOrCreateObjectType(props) {
      const node = getOrCreateNodeOfKind(graphql_1.Kind.OBJECT_TYPE_DEFINITION, props);
      return objectTypeApi(node);
    },
    getOrCreateInterfaceType(props) {
      const node = getOrCreateNodeOfKind(graphql_1.Kind.INTERFACE_TYPE_DEFINITION, props);
      return interfaceTypeApi(node);
    },
    getOrCreateUnionType(props) {
      const node = getOrCreateNodeOfKind(graphql_1.Kind.UNION_TYPE_DEFINITION, props);
      return unionTypeApi(node);
    },
    getOrCreateEnumType(props) {
      const node = getOrCreateNodeOfKind(graphql_1.Kind.ENUM_TYPE_DEFINITION, props);
      return enumTypeApi(node);
    },
    getOrCreateInputType(props) {
      const node = getOrCreateNodeOfKind(graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION, props);
      return inputTypeApi(node);
    },
    createScalarType(props) {
      const node = createNodeOfKind(graphql_1.Kind.SCALAR_TYPE_DEFINITION, props);
      return scalarTypeApi(node);
    },
    createObjectType(props) {
      const node = createNodeOfKind(graphql_1.Kind.OBJECT_TYPE_DEFINITION, props);
      return objectTypeApi(node);
    },
    createInterfaceType(props) {
      const node = createNodeOfKind(graphql_1.Kind.INTERFACE_TYPE_DEFINITION, props);
      return interfaceTypeApi(node);
    },
    createUnionType(props) {
      const node = createNodeOfKind(graphql_1.Kind.UNION_TYPE_DEFINITION, props);
      return unionTypeApi(node);
    },
    createEnumType(props) {
      const node = createNodeOfKind(graphql_1.Kind.ENUM_TYPE_DEFINITION, props);
      return enumTypeApi(node);
    },
    createInputType(props) {
      const node = createNodeOfKind(graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION, props);
      return inputTypeApi(node);
    }
  };
}
exports.AST = ast;
exports.applyProps = applyProps;
exports.applyPropsArr = applyPropsArr;
exports.applyPropsCloned = applyPropsCloned;
exports.applyPropsNullable = applyPropsNullable;
exports.applyPropsNullableArr = applyPropsNullableArr;
exports.arg = arg;
exports.argumentApi = argumentApi;
exports.argumentNode = argumentNode;
exports.arrayable = arrayable;
exports.astKindToApi = astKindToApi;
exports.astKindToApiMap = astKindToApiMap;
exports.astKindToFunction = astKindToFunction;
exports.astKindToFunctionMap = astKindToFunctionMap;
exports.booleanValueNode = booleanValueNode;
exports.cloneDeep = cloneDeep;
exports.directive = directive;
exports.directiveApi = directiveApi;
exports.directiveDef = directiveDef;
exports.directiveDefinitionApi = directiveDefinitionApi;
exports.directiveDefinitionNode = directiveDefinitionNode;
exports.directiveNode = directiveNode;
exports.document = document;
exports.documentApi = documentApi;
exports.documentNode = documentNode;
exports.enumExt = enumExt;
exports.enumExtApi = enumExtApi;
exports.enumType = enumType;
exports.enumTypeApi = enumTypeApi;
exports.enumTypeDefinitionNode = enumTypeDefinitionNode;
exports.enumTypeExtensionNode = enumTypeExtensionNode;
exports.enumVal = enumVal;
exports.enumValueApi = enumValueApi;
exports.enumValueDefinitionNode = enumValueDefinitionNode;
exports.enumValueNode = enumValueNode;
exports.field = field;
exports.fieldDef = fieldDef;
exports.fieldDefinitionApi = fieldDefinitionApi;
exports.fieldDefinitionNode = fieldDefinitionNode;
exports.fieldNode = fieldNode;
exports.floatValueNode = floatValueNode;
exports.fragmentDef = fragmentDef;
exports.fragmentDefinitionNode = fragmentDefinitionNode;
exports.fragmentSpread = fragmentSpread;
exports.fragmentSpreadNode = fragmentSpreadNode;
exports.getName = getName;
exports.iEnumValueNode = iEnumValueNode;
exports.inlineFragment = inlineFragment;
exports.inlineFragmentNode = inlineFragmentNode;
exports.inputExtApi = inputExtApi;
exports.inputObjectExt = inputObjectExt;
exports.inputObjectTypeDefinitionNode = inputObjectTypeDefinitionNode;
exports.inputObjectTypeExtensionNode = inputObjectTypeExtensionNode;
exports.inputType = inputType;
exports.inputTypeApi = inputTypeApi;
exports.inputVal = inputVal;
exports.inputValueApi = inputValueApi;
exports.inputValueDefinitionNode = inputValueDefinitionNode;
exports.intValueNode = intValueNode;
exports.interfaceExt = interfaceExt;
exports.interfaceExtApi = interfaceExtApi;
exports.interfaceType = interfaceType;
exports.interfaceTypeApi = interfaceTypeApi;
exports.interfaceTypeDefinitionNode = interfaceTypeDefinitionNode;
exports.interfaceTypeExtensionNode = interfaceTypeExtensionNode;
exports.isArgumentNode = isArgumentNode;
exports.isAstNode = isAstNode;
exports.isBooleanValueNode = isBooleanValueNode;
exports.isDirectiveDefinitionNode = isDirectiveDefinitionNode;
exports.isDirectiveNode = isDirectiveNode;
exports.isDocumentNode = isDocumentNode;
exports.isEnumTypeDefinitionNode = isEnumTypeDefinitionNode;
exports.isEnumTypeExtensionNode = isEnumTypeExtensionNode;
exports.isEnumValueDefinitionNode = isEnumValueDefinitionNode;
exports.isFieldDefinitionNode = isFieldDefinitionNode;
exports.isFieldNode = isFieldNode;
exports.isFloatValueNode = isFloatValueNode;
exports.isFragmentDefinitionNode = isFragmentDefinitionNode;
exports.isFragmentSpreadNode = isFragmentSpreadNode;
exports.isInlineFragmentNode = isInlineFragmentNode;
exports.isInputObjectTypeDefinitionNode = isInputObjectTypeDefinitionNode;
exports.isInputObjectTypeExtensionNode = isInputObjectTypeExtensionNode;
exports.isInputValueDefinitionNode = isInputValueDefinitionNode;
exports.isIntValueNode = isIntValueNode;
exports.isInterfaceTypeDefinitionNode = isInterfaceTypeDefinitionNode;
exports.isInterfaceTypeExtensionNode = isInterfaceTypeExtensionNode;
exports.isListTypeNode = isListTypeNode;
exports.isListValueNode = isListValueNode;
exports.isNameNode = isNameNode;
exports.isNamedTypeNode = isNamedTypeNode;
exports.isNonNullTypeNode = isNonNullTypeNode;
exports.isNullValueNode = isNullValueNode;
exports.isObjectFieldNode = isObjectFieldNode;
exports.isObjectTypeDefinitionNode = isObjectTypeDefinitionNode;
exports.isObjectTypeExtensionNode = isObjectTypeExtensionNode;
exports.isObjectValueNode = isObjectValueNode;
exports.isOperationDefinitionNode = isOperationDefinitionNode;
exports.isOperationTypeDefinitionNode = isOperationTypeDefinitionNode;
exports.isScalarTypeDefinitionNode = isScalarTypeDefinitionNode;
exports.isScalarTypeExtensionNode = isScalarTypeExtensionNode;
exports.isSchemaDefinitionNode = isSchemaDefinitionNode;
exports.isSchemaExtensionNode = isSchemaExtensionNode;
exports.isSelectionSetNode = isSelectionSetNode;
exports.isStringValueNode = isStringValueNode;
exports.isUnionTypeDefinitionNode = isUnionTypeDefinitionNode;
exports.isUnionTypeExtensionNode = isUnionTypeExtensionNode;
exports.isVariableDefinitionNode = isVariableDefinitionNode;
exports.isVariableNode = isVariableNode;
exports.listTypeNode = listTypeNode;
exports.listValueNode = listValueNode;
exports.mutationType = mutationType;
exports.name = name;
exports.nameNode = nameNode;
exports.namedTypeNode = namedTypeNode;
exports.nonNullTypeNode = nonNullTypeNode;
exports.nullValueNode = nullValueNode;
exports.nullable = nullable;
exports.objectExt = objectExt;
exports.objectExtApi = objectExtApi;
exports.objectFieldNode = objectFieldNode;
exports.objectType = objectType;
exports.objectTypeApi = objectTypeApi;
exports.objectTypeDefinitionNode = objectTypeDefinitionNode;
exports.objectTypeExtensionNode = objectTypeExtensionNode;
exports.objectValueNode = objectValueNode;
exports.operation = operation;
exports.operationDefinitionNode = operationDefinitionNode;
exports.operationType = operationType;
exports.operationTypeDefinitionNode = operationTypeDefinitionNode;
exports.propsOrNode = propsOrNode;
exports.queryType = queryType;
exports.scalarExt = scalarExt;
exports.scalarExtApi = scalarExtApi;
exports.scalarType = scalarType;
exports.scalarTypeApi = scalarTypeApi;
exports.scalarTypeDefinitionNode = scalarTypeDefinitionNode;
exports.scalarTypeExtensionNode = scalarTypeExtensionNode;
exports.schemaDef = schemaDef;
exports.schemaDefinitionNode = schemaDefinitionNode;
exports.schemaExt = schemaExt;
exports.schemaExtensionNode = schemaExtensionNode;
exports.selectionSetNode = selectionSetNode;
exports.selections = selections;
exports.stringValueNode = stringValueNode;
exports.subscriptionType = subscriptionType;
exports.t = alias;
exports.type = type;
exports.typeApi = typeApi;
exports.typeNode = typeNode;
exports.unionExt = unionExt;
exports.unionExtApi = unionExtApi;
exports.unionType = unionType;
exports.unionTypeApi = unionTypeApi;
exports.unionTypeDefinitionNode = unionTypeDefinitionNode;
exports.unionTypeExtensionNode = unionTypeExtensionNode;
exports.value = value;
exports.variable = variable;
exports.variableDefinitionNode = variableDefinitionNode;
exports.variableNode = variableNode;

}
}, function(){
__fuse.r(1)
})

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}]},{},[2]);
