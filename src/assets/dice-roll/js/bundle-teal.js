(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = 'function' == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = 'MODULE_NOT_FOUND'), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = 'function' == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [function (require, module, exports) {}, {}],
    2: [
      function (require, module, exports) {
        (function (process) {
          // .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
          // backported and transplited with Babel, with backwards-compat fixes

          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          // resolves . and .. elements in a path array with directory names there
          // must be no slashes, empty elements, or device names (c:\) in the array
          // (so also no leading and trailing slashes - it does not distinguish
          // relative and absolute paths)
          function normalizeArray(parts, allowAboveRoot) {
            // if the path tries to go above the root, `up` ends up > 0
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
              var last = parts[i];
              if (last === '.') {
                parts.splice(i, 1);
              } else if (last === '..') {
                parts.splice(i, 1);
                up++;
              } else if (up) {
                parts.splice(i, 1);
                up--;
              }
            }

            // if the path is allowed to go above the root, restore leading ..s
            if (allowAboveRoot) {
              for (; up--; up) {
                parts.unshift('..');
              }
            }

            return parts;
          }

          // path.resolve([from ...], to)
          // posix version
          exports.resolve = function () {
            var resolvedPath = '',
              resolvedAbsolute = false;

            for (
              var i = arguments.length - 1;
              i >= -1 && !resolvedAbsolute;
              i--
            ) {
              var path = i >= 0 ? arguments[i] : process.cwd();

              // Skip empty and invalid entries
              if (typeof path !== 'string') {
                throw new TypeError(
                  'Arguments to path.resolve must be strings'
                );
              } else if (!path) {
                continue;
              }

              resolvedPath = path + '/' + resolvedPath;
              resolvedAbsolute = path.charAt(0) === '/';
            }

            // At this point the path should be resolved to a full absolute path, but
            // handle relative paths to be safe (might happen when process.cwd() fails)

            // Normalize the path
            resolvedPath = normalizeArray(
              filter(resolvedPath.split('/'), function (p) {
                return !!p;
              }),
              !resolvedAbsolute
            ).join('/');

            return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
          };

          // path.normalize(path)
          // posix version
          exports.normalize = function (path) {
            var isAbsolute = exports.isAbsolute(path),
              trailingSlash = substr(path, -1) === '/';

            // Normalize the path
            path = normalizeArray(
              filter(path.split('/'), function (p) {
                return !!p;
              }),
              !isAbsolute
            ).join('/');

            if (!path && !isAbsolute) {
              path = '.';
            }
            if (path && trailingSlash) {
              path += '/';
            }

            return (isAbsolute ? '/' : '') + path;
          };

          // posix version
          exports.isAbsolute = function (path) {
            return path.charAt(0) === '/';
          };

          // posix version
          exports.join = function () {
            var paths = Array.prototype.slice.call(arguments, 0);
            return exports.normalize(
              filter(paths, function (p, index) {
                if (typeof p !== 'string') {
                  throw new TypeError('Arguments to path.join must be strings');
                }
                return p;
              }).join('/')
            );
          };

          // path.relative(from, to)
          // posix version
          exports.relative = function (from, to) {
            from = exports.resolve(from).substr(1);
            to = exports.resolve(to).substr(1);

            function trim(arr) {
              var start = 0;
              for (; start < arr.length; start++) {
                if (arr[start] !== '') break;
              }

              var end = arr.length - 1;
              for (; end >= 0; end--) {
                if (arr[end] !== '') break;
              }

              if (start > end) return [];
              return arr.slice(start, end - start + 1);
            }

            var fromParts = trim(from.split('/'));
            var toParts = trim(to.split('/'));

            var length = Math.min(fromParts.length, toParts.length);
            var samePartsLength = length;
            for (var i = 0; i < length; i++) {
              if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
              }
            }

            var outputParts = [];
            for (var i = samePartsLength; i < fromParts.length; i++) {
              outputParts.push('..');
            }

            outputParts = outputParts.concat(toParts.slice(samePartsLength));

            return outputParts.join('/');
          };

          exports.sep = '/';
          exports.delimiter = ':';

          exports.dirname = function (path) {
            if (typeof path !== 'string') path = path + '';
            if (path.length === 0) return '.';
            var code = path.charCodeAt(0);
            var hasRoot = code === 47; /*/*/
            var end = -1;
            var matchedSlash = true;
            for (var i = path.length - 1; i >= 1; --i) {
              code = path.charCodeAt(i);
              if (code === 47 /*/*/) {
                if (!matchedSlash) {
                  end = i;
                  break;
                }
              } else {
                // We saw the first non-path separator
                matchedSlash = false;
              }
            }

            if (end === -1) return hasRoot ? '/' : '.';
            if (hasRoot && end === 1) {
              // return '//';
              // Backwards-compat fix:
              return '/';
            }
            return path.slice(0, end);
          };

          function basename(path) {
            if (typeof path !== 'string') path = path + '';

            var start = 0;
            var end = -1;
            var matchedSlash = true;
            var i;

            for (i = path.length - 1; i >= 0; --i) {
              if (path.charCodeAt(i) === 47 /*/*/) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // path component
                matchedSlash = false;
                end = i + 1;
              }
            }

            if (end === -1) return '';
            return path.slice(start, end);
          }

          // Uses a mixed approach for backwards-compatibility, as ext behavior changed
          // in new Node.js versions, so only basename() above is backported here
          exports.basename = function (path, ext) {
            var f = basename(path);
            if (ext && f.substr(-1 * ext.length) === ext) {
              f = f.substr(0, f.length - ext.length);
            }
            return f;
          };

          exports.extname = function (path) {
            if (typeof path !== 'string') path = path + '';
            var startDot = -1;
            var startPart = 0;
            var end = -1;
            var matchedSlash = true;
            // Track the state of characters (if any) we see before our first dot and
            // after any path separator we find
            var preDotState = 0;
            for (var i = path.length - 1; i >= 0; --i) {
              var code = path.charCodeAt(i);
              if (code === 47 /*/*/) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                  startPart = i + 1;
                  break;
                }
                continue;
              }
              if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
              }
              if (code === 46 /*.*/) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1) startDot = i;
                else if (preDotState !== 1) preDotState = 1;
              } else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
              }
            }

            if (
              startDot === -1 ||
              end === -1 ||
              // We saw a non-dot character immediately before the dot
              preDotState === 0 ||
              // The (right-most) trimmed path component is exactly '..'
              (preDotState === 1 &&
                startDot === end - 1 &&
                startDot === startPart + 1)
            ) {
              return '';
            }
            return path.slice(startDot, end);
          };

          function filter(xs, f) {
            if (xs.filter) return xs.filter(f);
            var res = [];
            for (var i = 0; i < xs.length; i++) {
              if (f(xs[i], i, xs)) res.push(xs[i]);
            }
            return res;
          }

          // String.prototype.substr - negative index don't work in IE8
          var substr =
            'ab'.substr(-1) === 'b'
              ? function (str, start, len) {
                  return str.substr(start, len);
                }
              : function (str, start, len) {
                  if (start < 0) start = str.length + start;
                  return str.substr(start, len);
                };
        }.call(this, require('_process')));
      },
      { _process: 3 },
    ],
    3: [
      function (require, module, exports) {
        // shim for using process in browser
        var process = (module.exports = {});

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
          throw new Error('setTimeout has not been defined');
        }
        function defaultClearTimeout() {
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
        })();
        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
          }
          // if setTimeout wasn't available but was latter defined
          if (
            (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
            setTimeout
          ) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
          }
          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
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
          if (
            (cachedClearTimeout === defaultClearTimeout ||
              !cachedClearTimeout) &&
            clearTimeout
          ) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
          }
          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
            } catch (e) {
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
          while (len) {
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

        process.listeners = function (name) {
          return [];
        };

        process.binding = function (name) {
          throw new Error('process.binding is not supported');
        };

        process.cwd = function () {
          return '/';
        };
        process.chdir = function (dir) {
          throw new Error('process.chdir is not supported');
        };
        process.umask = function () {
          return 0;
        };
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        if (typeof Object.create === 'function') {
          // implementation from standard node.js 'util' module
          module.exports = function inherits(ctor, superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            });
          };
        } else {
          // old school shim for old browsers
          module.exports = function inherits(ctor, superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function () {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          };
        }
      },
      {},
    ],
    5: [
      function (require, module, exports) {
        module.exports = function isBuffer(arg) {
          return (
            arg &&
            typeof arg === 'object' &&
            typeof arg.copy === 'function' &&
            typeof arg.fill === 'function' &&
            typeof arg.readUInt8 === 'function'
          );
        };
      },
      {},
    ],
    6: [
      function (require, module, exports) {
        (function (process, global) {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          var formatRegExp = /%[sdj%]/g;
          exports.format = function (f) {
            if (!isString(f)) {
              var objects = [];
              for (var i = 0; i < arguments.length; i++) {
                objects.push(inspect(arguments[i]));
              }
              return objects.join(' ');
            }

            var i = 1;
            var args = arguments;
            var len = args.length;
            var str = String(f).replace(formatRegExp, function (x) {
              if (x === '%%') return '%';
              if (i >= len) return x;
              switch (x) {
                case '%s':
                  return String(args[i++]);
                case '%d':
                  return Number(args[i++]);
                case '%j':
                  try {
                    return JSON.stringify(args[i++]);
                  } catch (_) {
                    return '[Circular]';
                  }
                default:
                  return x;
              }
            });
            for (var x = args[i]; i < len; x = args[++i]) {
              if (isNull(x) || !isObject(x)) {
                str += ' ' + x;
              } else {
                str += ' ' + inspect(x);
              }
            }
            return str;
          };

          // Mark that a method should not be used.
          // Returns a modified function which warns once by default.
          // If --no-deprecation is set, then it is a no-op.
          exports.deprecate = function (fn, msg) {
            // Allow for deprecating things in the process of starting up.
            if (isUndefined(global.process)) {
              return function () {
                return exports.deprecate(fn, msg).apply(this, arguments);
              };
            }

            if (process.noDeprecation === true) {
              return fn;
            }

            var warned = false;
            function deprecated() {
              if (!warned) {
                if (process.throwDeprecation) {
                  throw new Error(msg);
                } else if (process.traceDeprecation) {
                  console.trace(msg);
                } else {
                  console.error(msg);
                }
                warned = true;
              }
              return fn.apply(this, arguments);
            }

            return deprecated;
          };

          var debugs = {};
          var debugEnviron;
          exports.debuglog = function (set) {
            if (isUndefined(debugEnviron))
              debugEnviron = process.env.NODE_DEBUG || '';
            set = set.toUpperCase();
            if (!debugs[set]) {
              if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                var pid = process.pid;
                debugs[set] = function () {
                  var msg = exports.format.apply(exports, arguments);
                  console.error('%s %d: %s', set, pid, msg);
                };
              } else {
                debugs[set] = function () {};
              }
            }
            return debugs[set];
          };

          /**
           * Echos the value of a value. Trys to print the value out
           * in the best way possible given the different types.
           *
           * @param {Object} obj The object to print out.
           * @param {Object} opts Optional options object that alters the output.
           */
          /* legacy: obj, showHidden, depth, colors*/
          function inspect(obj, opts) {
            // default options
            var ctx = {
              seen: [],
              stylize: stylizeNoColor,
            };
            // legacy...
            if (arguments.length >= 3) ctx.depth = arguments[2];
            if (arguments.length >= 4) ctx.colors = arguments[3];
            if (isBoolean(opts)) {
              // legacy...
              ctx.showHidden = opts;
            } else if (opts) {
              // got an "options" object
              exports._extend(ctx, opts);
            }
            // set default options
            if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
            if (isUndefined(ctx.depth)) ctx.depth = 2;
            if (isUndefined(ctx.colors)) ctx.colors = false;
            if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
            if (ctx.colors) ctx.stylize = stylizeWithColor;
            return formatValue(ctx, obj, ctx.depth);
          }
          exports.inspect = inspect;

          // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
          inspect.colors = {
            bold: [1, 22],
            italic: [3, 23],
            underline: [4, 24],
            inverse: [7, 27],
            white: [37, 39],
            grey: [90, 39],
            black: [30, 39],
            blue: [34, 39],
            cyan: [36, 39],
            green: [32, 39],
            magenta: [35, 39],
            red: [31, 39],
            yellow: [33, 39],
          };

          // Don't use 'blue' not visible on cmd.exe
          inspect.styles = {
            special: 'cyan',
            number: 'yellow',
            boolean: 'yellow',
            undefined: 'grey',
            null: 'bold',
            string: 'green',
            date: 'magenta',
            // "name": intentionally not styling
            regexp: 'red',
          };

          function stylizeWithColor(str, styleType) {
            var style = inspect.styles[styleType];

            if (style) {
              return (
                '\u001b[' +
                inspect.colors[style][0] +
                'm' +
                str +
                '\u001b[' +
                inspect.colors[style][1] +
                'm'
              );
            } else {
              return str;
            }
          }

          function stylizeNoColor(str, styleType) {
            return str;
          }

          function arrayToHash(array) {
            var hash = {};

            array.forEach(function (val, idx) {
              hash[val] = true;
            });

            return hash;
          }

          function formatValue(ctx, value, recurseTimes) {
            // Provide a hook for user-specified inspect functions.
            // Check that value is an object with an inspect function on it
            if (
              ctx.customInspect &&
              value &&
              isFunction(value.inspect) &&
              // Filter out the util module, it's inspect function is special
              value.inspect !== exports.inspect &&
              // Also filter out any prototype objects using the circular check.
              !(value.constructor && value.constructor.prototype === value)
            ) {
              var ret = value.inspect(recurseTimes, ctx);
              if (!isString(ret)) {
                ret = formatValue(ctx, ret, recurseTimes);
              }
              return ret;
            }

            // Primitive types cannot have properties
            var primitive = formatPrimitive(ctx, value);
            if (primitive) {
              return primitive;
            }

            // Look up the keys of the object.
            var keys = Object.keys(value);
            var visibleKeys = arrayToHash(keys);

            if (ctx.showHidden) {
              keys = Object.getOwnPropertyNames(value);
            }

            // IE doesn't make error fields non-enumerable
            // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
            if (
              isError(value) &&
              (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)
            ) {
              return formatError(value);
            }

            // Some type of object without properties can be shortcutted.
            if (keys.length === 0) {
              if (isFunction(value)) {
                var name = value.name ? ': ' + value.name : '';
                return ctx.stylize('[Function' + name + ']', 'special');
              }
              if (isRegExp(value)) {
                return ctx.stylize(
                  RegExp.prototype.toString.call(value),
                  'regexp'
                );
              }
              if (isDate(value)) {
                return ctx.stylize(Date.prototype.toString.call(value), 'date');
              }
              if (isError(value)) {
                return formatError(value);
              }
            }

            var base = '',
              array = false,
              braces = ['{', '}'];

            // Make Array say that they are Array
            if (isArray(value)) {
              array = true;
              braces = ['[', ']'];
            }

            // Make functions say that they are functions
            if (isFunction(value)) {
              var n = value.name ? ': ' + value.name : '';
              base = ' [Function' + n + ']';
            }

            // Make RegExps say that they are RegExps
            if (isRegExp(value)) {
              base = ' ' + RegExp.prototype.toString.call(value);
            }

            // Make dates with properties first say the date
            if (isDate(value)) {
              base = ' ' + Date.prototype.toUTCString.call(value);
            }

            // Make error with message first say the error
            if (isError(value)) {
              base = ' ' + formatError(value);
            }

            if (keys.length === 0 && (!array || value.length == 0)) {
              return braces[0] + base + braces[1];
            }

            if (recurseTimes < 0) {
              if (isRegExp(value)) {
                return ctx.stylize(
                  RegExp.prototype.toString.call(value),
                  'regexp'
                );
              } else {
                return ctx.stylize('[Object]', 'special');
              }
            }

            ctx.seen.push(value);

            var output;
            if (array) {
              output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
            } else {
              output = keys.map(function (key) {
                return formatProperty(
                  ctx,
                  value,
                  recurseTimes,
                  visibleKeys,
                  key,
                  array
                );
              });
            }

            ctx.seen.pop();

            return reduceToSingleString(output, base, braces);
          }

          function formatPrimitive(ctx, value) {
            if (isUndefined(value))
              return ctx.stylize('undefined', 'undefined');
            if (isString(value)) {
              var simple =
                "'" +
                JSON.stringify(value)
                  .replace(/^"|"$/g, '')
                  .replace(/'/g, "\\'")
                  .replace(/\\"/g, '"') +
                "'";
              return ctx.stylize(simple, 'string');
            }
            if (isNumber(value)) return ctx.stylize('' + value, 'number');
            if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
            // For some reason typeof null is "object", so special case here.
            if (isNull(value)) return ctx.stylize('null', 'null');
          }

          function formatError(value) {
            return '[' + Error.prototype.toString.call(value) + ']';
          }

          function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
            var output = [];
            for (var i = 0, l = value.length; i < l; ++i) {
              if (hasOwnProperty(value, String(i))) {
                output.push(
                  formatProperty(
                    ctx,
                    value,
                    recurseTimes,
                    visibleKeys,
                    String(i),
                    true
                  )
                );
              } else {
                output.push('');
              }
            }
            keys.forEach(function (key) {
              if (!key.match(/^\d+$/)) {
                output.push(
                  formatProperty(
                    ctx,
                    value,
                    recurseTimes,
                    visibleKeys,
                    key,
                    true
                  )
                );
              }
            });
            return output;
          }

          function formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            key,
            array
          ) {
            var name, str, desc;
            desc = Object.getOwnPropertyDescriptor(value, key) || {
              value: value[key],
            };
            if (desc.get) {
              if (desc.set) {
                str = ctx.stylize('[Getter/Setter]', 'special');
              } else {
                str = ctx.stylize('[Getter]', 'special');
              }
            } else {
              if (desc.set) {
                str = ctx.stylize('[Setter]', 'special');
              }
            }
            if (!hasOwnProperty(visibleKeys, key)) {
              name = '[' + key + ']';
            }
            if (!str) {
              if (ctx.seen.indexOf(desc.value) < 0) {
                if (isNull(recurseTimes)) {
                  str = formatValue(ctx, desc.value, null);
                } else {
                  str = formatValue(ctx, desc.value, recurseTimes - 1);
                }
                if (str.indexOf('\n') > -1) {
                  if (array) {
                    str = str
                      .split('\n')
                      .map(function (line) {
                        return '  ' + line;
                      })
                      .join('\n')
                      .substr(2);
                  } else {
                    str =
                      '\n' +
                      str
                        .split('\n')
                        .map(function (line) {
                          return '   ' + line;
                        })
                        .join('\n');
                  }
                }
              } else {
                str = ctx.stylize('[Circular]', 'special');
              }
            }
            if (isUndefined(name)) {
              if (array && key.match(/^\d+$/)) {
                return str;
              }
              name = JSON.stringify('' + key);
              if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                name = name.substr(1, name.length - 2);
                name = ctx.stylize(name, 'name');
              } else {
                name = name
                  .replace(/'/g, "\\'")
                  .replace(/\\"/g, '"')
                  .replace(/(^"|"$)/g, "'");
                name = ctx.stylize(name, 'string');
              }
            }

            return name + ': ' + str;
          }

          function reduceToSingleString(output, base, braces) {
            var numLinesEst = 0;
            var length = output.reduce(function (prev, cur) {
              numLinesEst++;
              if (cur.indexOf('\n') >= 0) numLinesEst++;
              return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
            }, 0);

            if (length > 60) {
              return (
                braces[0] +
                (base === '' ? '' : base + '\n ') +
                ' ' +
                output.join(',\n  ') +
                ' ' +
                braces[1]
              );
            }

            return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
          }

          // NOTE: These type checking functions intentionally don't use `instanceof`
          // because it is fragile and can be easily faked with `Object.create()`.
          function isArray(ar) {
            return Array.isArray(ar);
          }
          exports.isArray = isArray;

          function isBoolean(arg) {
            return typeof arg === 'boolean';
          }
          exports.isBoolean = isBoolean;

          function isNull(arg) {
            return arg === null;
          }
          exports.isNull = isNull;

          function isNullOrUndefined(arg) {
            return arg == null;
          }
          exports.isNullOrUndefined = isNullOrUndefined;

          function isNumber(arg) {
            return typeof arg === 'number';
          }
          exports.isNumber = isNumber;

          function isString(arg) {
            return typeof arg === 'string';
          }
          exports.isString = isString;

          function isSymbol(arg) {
            return typeof arg === 'symbol';
          }
          exports.isSymbol = isSymbol;

          function isUndefined(arg) {
            return arg === void 0;
          }
          exports.isUndefined = isUndefined;

          function isRegExp(re) {
            return isObject(re) && objectToString(re) === '[object RegExp]';
          }
          exports.isRegExp = isRegExp;

          function isObject(arg) {
            return typeof arg === 'object' && arg !== null;
          }
          exports.isObject = isObject;

          function isDate(d) {
            return isObject(d) && objectToString(d) === '[object Date]';
          }
          exports.isDate = isDate;

          function isError(e) {
            return (
              isObject(e) &&
              (objectToString(e) === '[object Error]' || e instanceof Error)
            );
          }
          exports.isError = isError;

          function isFunction(arg) {
            return typeof arg === 'function';
          }
          exports.isFunction = isFunction;

          function isPrimitive(arg) {
            return (
              arg === null ||
              typeof arg === 'boolean' ||
              typeof arg === 'number' ||
              typeof arg === 'string' ||
              typeof arg === 'symbol' || // ES6 symbol
              typeof arg === 'undefined'
            );
          }
          exports.isPrimitive = isPrimitive;

          exports.isBuffer = require('./support/isBuffer');

          function objectToString(o) {
            return Object.prototype.toString.call(o);
          }

          function pad(n) {
            return n < 10 ? '0' + n.toString(10) : n.toString(10);
          }

          var months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];

          // 26 Feb 16:19:34
          function timestamp() {
            var d = new Date();
            var time = [
              pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds()),
            ].join(':');
            return [d.getDate(), months[d.getMonth()], time].join(' ');
          }

          // log is just a thin wrapper to console.log that prepends a timestamp
          exports.log = function () {
            console.log(
              '%s - %s',
              timestamp(),
              exports.format.apply(exports, arguments)
            );
          };

          /**
           * Inherit the prototype methods from one constructor into another.
           *
           * The Function.prototype.inherits from lang.js rewritten as a standalone
           * function (not on Function.prototype). NOTE: If this file is to be loaded
           * during bootstrapping this function needs to be rewritten using some native
           * functions as prototype setup using normal JavaScript does not work as
           * expected during bootstrapping (see mirror.js in r114903).
           *
           * @param {function} ctor Constructor function which needs to inherit the
           *     prototype.
           * @param {function} superCtor Constructor function to inherit prototype from.
           */
          exports.inherits = require('inherits');

          exports._extend = function (origin, add) {
            // Don't do anything if add isn't an object
            if (!add || !isObject(add)) return origin;

            var keys = Object.keys(add);
            var i = keys.length;
            while (i--) {
              origin[keys[i]] = add[keys[i]];
            }
            return origin;
          };

          function hasOwnProperty(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
          }
        }.call(
          this,
          require('_process'),
          typeof global !== 'undefined'
            ? global
            : typeof self !== 'undefined'
            ? self
            : typeof window !== 'undefined'
            ? window
            : {}
        ));
      },
      { './support/isBuffer': 5, _process: 3, inherits: 4 },
    ],
    7: [
      function (require, module, exports) {
        module.exports = Attribute;

        var escapeHTML = require('./escape');

        function Attribute(name, value) {
          this.name = name;
          this.value = value;
        }

        Attribute.prototype = {
          nodeType: 2,

          toString: function () {
            if (typeof this.value == 'boolean') {
              return this.value ? ' ' + this.name : '';
            }
            return ' ' + this.name + '="' + escapeHTML(this.value) + '"';
          },
        };
      },
      { './escape': 16 },
    ],
    8: [
      function (require, module, exports) {
        module.exports = ClassList;

        function ClassList(element) {
          this.element = element;
        }

        ClassList.prototype = {
          get tokens() {
            var s = this.element.className;
            return s === '' ? [] : s.split(' ');
          },

          contains: function (token) {
            return this.tokens.indexOf(token) > -1;
          },

          add: function (token) {
            var list = this.tokens;
            if (list.indexOf(token) > -1) return;

            list.push(token);
            this.element.className = list.join(' ').trim();
          },

          remove: function (token) {
            var list = this.tokens,
              index = list.indexOf(token);

            if (index > -1) {
              list.splice(index, 1);
              this.element.className = list.join(' ').trim();
            }
          },

          toggle: function toggle(token) {
            if (this.contains(token)) {
              this.remove(token);
              return false;
            }
            this.add(token);
            return true;
          },
        };
      },
      {},
    ],
    9: [
      function (require, module, exports) {
        module.exports = Comment;

        function Comment(document, nodeValue) {
          this.ownerDocument = document;
          this.nodeValue = nodeValue;
        }

        Comment.prototype = {
          nodeType: 8,

          toString: function () {
            return '<!--' + this.nodeValue + '-->';
          },
        };
      },
      {},
    ],
    10: [
      function (require, module, exports) {
        module.exports = Document;

        var DocumentType = require('./DocumentType'),
          DocumentFragment = require('./DocumentFragment'),
          Element = require('./Element'),
          TextNode = require('./TextNode'),
          Comment = require('./Comment');

        function Document(type) {
          this.doctype = new DocumentType(type);
          this.childNodes = [];
        }

        Document.prototype = {
          nodeType: 9,

          appendChild: Element.prototype.appendChild,

          createElement: function (nodeName) {
            return new Element(this, nodeName);
          },

          createTextNode: function (nodeValue) {
            return new TextNode(this, nodeValue);
          },

          createComment: function (nodeValue) {
            return new Comment(this, nodeValue);
          },

          createDocumentFragment: function () {
            return new DocumentFragment(this);
          },

          toString: function () {
            return this.doctype + '\n' + this.childNodes.join('');
          },

          get outerHTML() {
            return this.toString();
          },
        };
      },
      {
        './Comment': 9,
        './DocumentFragment': 11,
        './DocumentType': 12,
        './Element': 13,
        './TextNode': 15,
      },
    ],
    11: [
      function (require, module, exports) {
        module.exports = DocumentFragment;

        var Node = require('./Node');

        function DocumentFragment(document) {
          Node.call(this, document, '#document-fragment');
        }

        DocumentFragment.prototype = Object.create(Node.prototype, {
          nodeType: { value: 11 },
        });
      },
      { './Node': 14 },
    ],
    12: [
      function (require, module, exports) {
        module.exports = DocumentType;

        function DocumentType(name) {
          this.name = name || 'html';
        }

        DocumentType.prototype = {
          nodeType: 10,

          toString: function () {
            return '<!DOCTYPE ' + this.name + '>';
          },
        };
      },
      {},
    ],
    13: [
      function (require, module, exports) {
        module.exports = Element;

        var Attribute = require('./Attribute'),
          ClassList = require('./ClassList'),
          Node = require('./Node');

        function Element(document, nodeName) {
          Node.call(this, document, nodeName);
          this.attrByName = {};
          this.attributes = [];
        }

        Element.prototype = Object.create(Node.prototype, {
          nodeType: { value: 1 },

          setAttribute: {
            value: function (name, value) {
              var attr = this.attrByName[name];
              if (!attr) {
                attr = new Attribute(name);
                this.attributes.push(attr);
                this.attrByName[name] = attr;
              }
              attr.value = value;
            },
          },

          removeAttribute: {
            value: function (name) {
              var attr = this.attrByName[name];
              if (attr) {
                this.attrByName[name] = undefined;
                this.attributes.splice(this.attributes.indexOf(attr), 1);
              }
            },
          },

          getAttribute: {
            value: function (name) {
              var attr = this.attrByName[name];
              return (attr && attr.value) || '';
            },
          },

          id: {
            get: function () {
              return this.getAttribute('id');
            },
            set: function (v) {
              this.setAttribute('id', v);
            },
          },

          className: {
            get: function () {
              return this.getAttribute('class');
            },
            set: function (v) {
              if (v) this.setAttribute('class', v);
              else this.removeAttribute('class');
            },
          },

          classList: {
            get: function () {
              if (!this._classList) this._classList = new ClassList(this);
              return this._classList;
            },
          },

          outerHTML: {
            get: function () {
              var nodeName = this.nodeName.toLowerCase(),
                attributes = this.attributes.join(''),
                html = '<' + nodeName + attributes + '>';

              if (!Element.empty[nodeName]) {
                html += this.innerHTML + '</' + nodeName + '>';
              }
              return html;
            },
          },

          toString: {
            value: function () {
              return this.outerHTML;
            },
          },
        });

        Element.empty = {
          area: true,
          br: true,
          col: true,
          embed: true,
          frame: true,
          hr: true,
          img: true,
          input: true,
          link: true,
          meta: true,
          param: true,
          source: true,
          wbr: true,
        };
      },
      { './Attribute': 7, './ClassList': 8, './Node': 14 },
    ],
    14: [
      function (require, module, exports) {
        module.exports = Node;

        function Node(document, nodeName) {
          this.ownerDocument = document;
          this.nodeName = nodeName.toUpperCase();
          this.childNodes = [];
        }

        Node.prototype = {
          get firstChild() {
            var c = this.childNodes;
            return c.length === 0 ? null : c[0];
          },

          get lastChild() {
            var c = this.childNodes;
            return c.length === 0 ? null : c[c.length - 1];
          },

          get previousSibling() {
            if (!this.parentNode) return null;
            var sibs = this.parentNode.childNodes;
            var i = sibs.indexOf(this);
            return i === 0 ? null : sibs[i - 1];
          },

          get nextSibling() {
            if (!this.parentNode) return null;
            var sibs = this.parentNode.childNodes;
            var i = sibs.indexOf(this);
            return i + 1 === sibs.length ? null : sibs[i + 1];
          },

          appendChild: function (child) {
            this.childNodes.push(child);
            child.parentNode = this;
          },

          removeChild: function (child) {
            var i = this.childNodes.indexOf(child);
            if (i == -1) {
              throw new Error(
                'NOT_FOUND_ERR (8): the object can not be found here'
              );
            }
            this.childNodes.splice(i, 1);
            child.parentNode = null;
            return child;
          },

          insertBefore: function (child, refChild) {
            if (!refChild) return this.appendChild(child);
            var i = this.childNodes.indexOf(refChild);
            if (i == -1) {
              throw new Error(
                'NOT_FOUND_ERR (8): the object can not be found here'
              );
            }
            this.childNodes.splice(i, 0, child);
            child.parentNode = this;
            return child;
          },

          set innerHTML(s) {
            this.childNodes = [];
            this._innerHTML = s;
          },

          get innerHTML() {
            return this._innerHTML || this.childNodes.join('');
          },

          toString: function () {
            return this.innerHTML;
          },
        };
      },
      {},
    ],
    15: [
      function (require, module, exports) {
        module.exports = TextNode;

        var escapeHTML = require('./escape');

        var hasRawContent = {
          STYLE: true,
          SCRIPT: true,
          XMP: true,
          IFRAME: true,
          NOEMBED: true,
          NOFRAMES: true,
          PLAINTEXT: true,
          NOSCRIPT: true,
        };

        function TextNode(document, nodeValue) {
          this.ownerDocument = document;
          this.nodeValue = nodeValue;
        }

        TextNode.prototype = {
          nodeType: 3,

          nodeName: '#text',

          toString: function () {
            var nodeValue = this.nodeValue,
              parentNode = this.parentNode;

            if (parentNode && !hasRawContent[parentNode.nodeName]) {
              nodeValue = escapeHTML(nodeValue);
            }

            return nodeValue;
          },
        };
      },
      { './escape': 16 },
    ],
    16: [
      function (require, module, exports) {
        var entities = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
        };

        var pattern = new RegExp(Object.keys(entities).join('|'), 'g');

        module.exports = function (s) {
          return ('' + s).replace(pattern, function (character) {
            return entities[character];
          });
        };
      },
      {},
    ],
    17: [
      function (require, module, exports) {
        var Document = require('./Document');

        module.exports = exports = function () {
          return new Document();
        };

        exports.Document = Document;
        exports.Attribute = require('./Attribute');
        exports.ClassList = require('./ClassList');
        exports.Comment = require('./Comment');
        exports.DocumentFragment = require('./DocumentFragment');
        exports.DocumentType = require('./DocumentType');
        exports.Element = require('./Element');
        exports.TextNode = require('./TextNode');
        exports.escape = require('./escape');
      },
      {
        './Attribute': 7,
        './ClassList': 8,
        './Comment': 9,
        './Document': 10,
        './DocumentFragment': 11,
        './DocumentType': 12,
        './Element': 13,
        './TextNode': 15,
        './escape': 16,
      },
    ],
    18: [
      function (require, module, exports) {
        (function (process) {
          'use strict';

          var isWindows = process.platform === 'win32';

          // Regex to split a windows path into three parts: [*, device, slash,
          // tail] windows-only
          var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

          // Regex to split the tail part of the above into [*, dir, basename, ext]
          var splitTailRe = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

          var win32 = {};

          // Function to split a filename into [root, dir, basename, ext]
          function win32SplitPath(filename) {
            // Separate device+slash from tail
            var result = splitDeviceRe.exec(filename),
              device = (result[1] || '') + (result[2] || ''),
              tail = result[3] || '';
            // Split the tail into dir, basename and extension
            var result2 = splitTailRe.exec(tail),
              dir = result2[1],
              basename = result2[2],
              ext = result2[3];
            return [device, dir, basename, ext];
          }

          win32.parse = function (pathString) {
            if (typeof pathString !== 'string') {
              throw new TypeError(
                "Parameter 'pathString' must be a string, not " +
                  typeof pathString
              );
            }
            var allParts = win32SplitPath(pathString);
            if (!allParts || allParts.length !== 4) {
              throw new TypeError("Invalid path '" + pathString + "'");
            }
            return {
              root: allParts[0],
              dir: allParts[0] + allParts[1].slice(0, -1),
              base: allParts[2],
              ext: allParts[3],
              name: allParts[2].slice(
                0,
                allParts[2].length - allParts[3].length
              ),
            };
          };

          // Split a filename into [root, dir, basename, ext], unix version
          // 'root' is just a slash, or nothing.
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          var posix = {};

          function posixSplitPath(filename) {
            return splitPathRe.exec(filename).slice(1);
          }

          posix.parse = function (pathString) {
            if (typeof pathString !== 'string') {
              throw new TypeError(
                "Parameter 'pathString' must be a string, not " +
                  typeof pathString
              );
            }
            var allParts = posixSplitPath(pathString);
            if (!allParts || allParts.length !== 4) {
              throw new TypeError("Invalid path '" + pathString + "'");
            }
            allParts[1] = allParts[1] || '';
            allParts[2] = allParts[2] || '';
            allParts[3] = allParts[3] || '';

            return {
              root: allParts[0],
              dir: allParts[0] + allParts[1].slice(0, -1),
              base: allParts[2],
              ext: allParts[3],
              name: allParts[2].slice(
                0,
                allParts[2].length - allParts[3].length
              ),
            };
          };

          if (isWindows) module.exports = win32.parse;
          /* posix */ else module.exports = posix.parse;

          module.exports.posix = posix.parse;
          module.exports.win32 = win32.parse;
        }.call(this, require('_process')));
      },
      { _process: 3 },
    ],
    19: [
      function (require, module, exports) {
        var async = require('./lib/async');
        async.core = require('./lib/core');
        async.isCore = require('./lib/is-core');
        async.sync = require('./lib/sync');

        module.exports = async;
      },
      {
        './lib/async': 20,
        './lib/core': 23,
        './lib/is-core': 24,
        './lib/sync': 27,
      },
    ],
    20: [
      function (require, module, exports) {
        (function (process) {
          var fs = require('fs');
          var path = require('path');
          var caller = require('./caller.js');
          var nodeModulesPaths = require('./node-modules-paths.js');
          var normalizeOptions = require('./normalize-options.js');
          var isCore = require('./is-core');

          var realpathFS =
            fs.realpath && typeof fs.realpath.native === 'function'
              ? fs.realpath.native
              : fs.realpath;

          var defaultIsFile = function isFile(file, cb) {
            fs.stat(file, function (err, stat) {
              if (!err) {
                return cb(null, stat.isFile() || stat.isFIFO());
              }
              if (err.code === 'ENOENT' || err.code === 'ENOTDIR')
                return cb(null, false);
              return cb(err);
            });
          };

          var defaultIsDir = function isDirectory(dir, cb) {
            fs.stat(dir, function (err, stat) {
              if (!err) {
                return cb(null, stat.isDirectory());
              }
              if (err.code === 'ENOENT' || err.code === 'ENOTDIR')
                return cb(null, false);
              return cb(err);
            });
          };

          var defaultRealpath = function realpath(x, cb) {
            realpathFS(x, function (realpathErr, realPath) {
              if (realpathErr && realpathErr.code !== 'ENOENT') cb(realpathErr);
              else cb(null, realpathErr ? x : realPath);
            });
          };

          var maybeRealpath = function maybeRealpath(realpath, x, opts, cb) {
            if (opts && opts.preserveSymlinks === false) {
              realpath(x, cb);
            } else {
              cb(null, x);
            }
          };

          var getPackageCandidates = function getPackageCandidates(
            x,
            start,
            opts
          ) {
            var dirs = nodeModulesPaths(start, opts, x);
            for (var i = 0; i < dirs.length; i++) {
              dirs[i] = path.join(dirs[i], x);
            }
            return dirs;
          };

          module.exports = function resolve(x, options, callback) {
            var cb = callback;
            var opts = options;
            if (typeof options === 'function') {
              cb = opts;
              opts = {};
            }
            if (typeof x !== 'string') {
              var err = new TypeError('Path must be a string.');
              return process.nextTick(function () {
                cb(err);
              });
            }

            opts = normalizeOptions(x, opts);

            var isFile = opts.isFile || defaultIsFile;
            var isDirectory = opts.isDirectory || defaultIsDir;
            var readFile = opts.readFile || fs.readFile;
            var realpath = opts.realpath || defaultRealpath;
            var packageIterator = opts.packageIterator;

            var extensions = opts.extensions || ['.js'];
            var basedir = opts.basedir || path.dirname(caller());
            var parent = opts.filename || basedir;

            opts.paths = opts.paths || [];

            // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
            var absoluteStart = path.resolve(basedir);

            maybeRealpath(realpath, absoluteStart, opts, function (
              err,
              realStart
            ) {
              if (err) cb(err);
              else init(realStart);
            });

            var res;
            function init(basedir) {
              if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
                res = path.resolve(basedir, x);
                if (x === '.' || x === '..' || x.slice(-1) === '/') res += '/';
                if (/\/$/.test(x) && res === basedir) {
                  loadAsDirectory(res, opts.package, onfile);
                } else loadAsFile(res, opts.package, onfile);
              } else if (isCore(x)) {
                return cb(null, x);
              } else
                loadNodeModules(x, basedir, function (err, n, pkg) {
                  if (err) cb(err);
                  else if (n) {
                    return maybeRealpath(realpath, n, opts, function (
                      err,
                      realN
                    ) {
                      if (err) {
                        cb(err);
                      } else {
                        cb(null, realN, pkg);
                      }
                    });
                  } else {
                    var moduleError = new Error(
                      "Cannot find module '" + x + "' from '" + parent + "'"
                    );
                    moduleError.code = 'MODULE_NOT_FOUND';
                    cb(moduleError);
                  }
                });
            }

            function onfile(err, m, pkg) {
              if (err) cb(err);
              else if (m) cb(null, m, pkg);
              else
                loadAsDirectory(res, function (err, d, pkg) {
                  if (err) cb(err);
                  else if (d) {
                    maybeRealpath(realpath, d, opts, function (err, realD) {
                      if (err) {
                        cb(err);
                      } else {
                        cb(null, realD, pkg);
                      }
                    });
                  } else {
                    var moduleError = new Error(
                      "Cannot find module '" + x + "' from '" + parent + "'"
                    );
                    moduleError.code = 'MODULE_NOT_FOUND';
                    cb(moduleError);
                  }
                });
            }

            function loadAsFile(x, thePackage, callback) {
              var loadAsFilePackage = thePackage;
              var cb = callback;
              if (typeof loadAsFilePackage === 'function') {
                cb = loadAsFilePackage;
                loadAsFilePackage = undefined;
              }

              var exts = [''].concat(extensions);
              load(exts, x, loadAsFilePackage);

              function load(exts, x, loadPackage) {
                if (exts.length === 0) return cb(null, undefined, loadPackage);
                var file = x + exts[0];

                var pkg = loadPackage;
                if (pkg) onpkg(null, pkg);
                else loadpkg(path.dirname(file), onpkg);

                function onpkg(err, pkg_, dir) {
                  pkg = pkg_;
                  if (err) return cb(err);
                  if (dir && pkg && opts.pathFilter) {
                    var rfile = path.relative(dir, file);
                    var rel = rfile.slice(0, rfile.length - exts[0].length);
                    var r = opts.pathFilter(pkg, x, rel);
                    if (r)
                      return load(
                        [''].concat(extensions.slice()),
                        path.resolve(dir, r),
                        pkg
                      );
                  }
                  isFile(file, onex);
                }
                function onex(err, ex) {
                  if (err) return cb(err);
                  if (ex) return cb(null, file, pkg);
                  load(exts.slice(1), x, pkg);
                }
              }
            }

            function loadpkg(dir, cb) {
              if (dir === '' || dir === '/') return cb(null);
              if (process.platform === 'win32' && /^\w:[/\\]*$/.test(dir)) {
                return cb(null);
              }
              if (/[/\\]node_modules[/\\]*$/.test(dir)) return cb(null);

              maybeRealpath(realpath, dir, opts, function (unwrapErr, pkgdir) {
                if (unwrapErr) return loadpkg(path.dirname(dir), cb);
                var pkgfile = path.join(pkgdir, 'package.json');
                isFile(pkgfile, function (err, ex) {
                  // on err, ex is false
                  if (!ex) return loadpkg(path.dirname(dir), cb);

                  readFile(pkgfile, function (err, body) {
                    if (err) cb(err);
                    try {
                      var pkg = JSON.parse(body);
                    } catch (jsonErr) {}

                    if (pkg && opts.packageFilter) {
                      pkg = opts.packageFilter(pkg, pkgfile);
                    }
                    cb(null, pkg, dir);
                  });
                });
              });
            }

            function loadAsDirectory(x, loadAsDirectoryPackage, callback) {
              var cb = callback;
              var fpkg = loadAsDirectoryPackage;
              if (typeof fpkg === 'function') {
                cb = fpkg;
                fpkg = opts.package;
              }

              maybeRealpath(realpath, x, opts, function (unwrapErr, pkgdir) {
                if (unwrapErr) return cb(unwrapErr);
                var pkgfile = path.join(pkgdir, 'package.json');
                isFile(pkgfile, function (err, ex) {
                  if (err) return cb(err);
                  if (!ex) return loadAsFile(path.join(x, 'index'), fpkg, cb);

                  readFile(pkgfile, function (err, body) {
                    if (err) return cb(err);
                    try {
                      var pkg = JSON.parse(body);
                    } catch (jsonErr) {}

                    if (pkg && opts.packageFilter) {
                      pkg = opts.packageFilter(pkg, pkgfile);
                    }

                    if (pkg && pkg.main) {
                      if (typeof pkg.main !== 'string') {
                        var mainError = new TypeError(
                          'package “' + pkg.name + '” `main` must be a string'
                        );
                        mainError.code = 'INVALID_PACKAGE_MAIN';
                        return cb(mainError);
                      }
                      if (pkg.main === '.' || pkg.main === './') {
                        pkg.main = 'index';
                      }
                      loadAsFile(path.resolve(x, pkg.main), pkg, function (
                        err,
                        m,
                        pkg
                      ) {
                        if (err) return cb(err);
                        if (m) return cb(null, m, pkg);
                        if (!pkg)
                          return loadAsFile(path.join(x, 'index'), pkg, cb);

                        var dir = path.resolve(x, pkg.main);
                        loadAsDirectory(dir, pkg, function (err, n, pkg) {
                          if (err) return cb(err);
                          if (n) return cb(null, n, pkg);
                          loadAsFile(path.join(x, 'index'), pkg, cb);
                        });
                      });
                      return;
                    }

                    loadAsFile(path.join(x, '/index'), pkg, cb);
                  });
                });
              });
            }

            function processDirs(cb, dirs) {
              if (dirs.length === 0) return cb(null, undefined);
              var dir = dirs[0];

              isDirectory(path.dirname(dir), isdir);

              function isdir(err, isdir) {
                if (err) return cb(err);
                if (!isdir) return processDirs(cb, dirs.slice(1));
                loadAsFile(dir, opts.package, onfile);
              }

              function onfile(err, m, pkg) {
                if (err) return cb(err);
                if (m) return cb(null, m, pkg);
                loadAsDirectory(dir, opts.package, ondir);
              }

              function ondir(err, n, pkg) {
                if (err) return cb(err);
                if (n) return cb(null, n, pkg);
                processDirs(cb, dirs.slice(1));
              }
            }
            function loadNodeModules(x, start, cb) {
              var thunk = function () {
                return getPackageCandidates(x, start, opts);
              };
              processDirs(
                cb,
                packageIterator
                  ? packageIterator(x, start, thunk, opts)
                  : thunk()
              );
            }
          };
        }.call(this, require('_process')));
      },
      {
        './caller.js': 21,
        './is-core': 24,
        './node-modules-paths.js': 25,
        './normalize-options.js': 26,
        _process: 3,
        fs: 1,
        path: 2,
      },
    ],
    21: [
      function (require, module, exports) {
        module.exports = function () {
          // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
          var origPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = function (_, stack) {
            return stack;
          };
          var stack = new Error().stack;
          Error.prepareStackTrace = origPrepareStackTrace;
          return stack[2].getFileName();
        };
      },
      {},
    ],
    22: [
      function (require, module, exports) {
        module.exports = {
          assert: true,
          async_hooks: '>= 8',
          buffer_ieee754: '< 0.9.7',
          buffer: true,
          child_process: true,
          cluster: true,
          console: true,
          constants: true,
          crypto: true,
          _debug_agent: '>= 1 && < 8',
          _debugger: '< 8',
          dgram: true,
          dns: true,
          domain: true,
          events: true,
          freelist: '< 6',
          fs: true,
          'fs/promises': ['>= 10 && < 10.1', '>= 14'],
          _http_agent: '>= 0.11.1',
          _http_client: '>= 0.11.1',
          _http_common: '>= 0.11.1',
          _http_incoming: '>= 0.11.1',
          _http_outgoing: '>= 0.11.1',
          _http_server: '>= 0.11.1',
          http: true,
          http2: '>= 8.8',
          https: true,
          inspector: '>= 8.0.0',
          _linklist: '< 8',
          module: true,
          net: true,
          'node-inspect/lib/_inspect': '>= 7.6.0 && < 12',
          'node-inspect/lib/internal/inspect_client': '>= 7.6.0 && < 12',
          'node-inspect/lib/internal/inspect_repl': '>= 7.6.0 && < 12',
          os: true,
          path: true,
          perf_hooks: '>= 8.5',
          process: '>= 1',
          punycode: true,
          querystring: true,
          readline: true,
          repl: true,
          smalloc: '>= 0.11.5 && < 3',
          _stream_duplex: '>= 0.9.4',
          _stream_transform: '>= 0.9.4',
          _stream_wrap: '>= 1.4.1',
          _stream_passthrough: '>= 0.9.4',
          _stream_readable: '>= 0.9.4',
          _stream_writable: '>= 0.9.4',
          stream: true,
          string_decoder: true,
          sys: true,
          timers: true,
          _tls_common: '>= 0.11.13',
          _tls_legacy: '>= 0.11.3 && < 10',
          _tls_wrap: '>= 0.11.3',
          tls: true,
          trace_events: '>= 10',
          tty: true,
          url: true,
          util: true,
          'v8/tools/arguments': '>= 10 && < 12',
          'v8/tools/codemap': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
          'v8/tools/consarray': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
          'v8/tools/csvparser': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
          'v8/tools/logreader': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
          'v8/tools/profile_view': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
          'v8/tools/splaytree': ['>= 4.4.0 && < 5', '>= 5.2.0 && < 12'],
          v8: '>= 1',
          vm: true,
          wasi: '>= 13.4 && < 13.5',
          worker_threads: '>= 11.7',
          zlib: true,
        };
      },
      {},
    ],
    23: [
      function (require, module, exports) {
        (function (process) {
          var current =
            (process.versions &&
              process.versions.node &&
              process.versions.node.split('.')) ||
            [];

          function specifierIncluded(specifier) {
            var parts = specifier.split(' ');
            var op = parts.length > 1 ? parts[0] : '=';
            var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split(
              '.'
            );

            for (var i = 0; i < 3; ++i) {
              var cur = Number(current[i] || 0);
              var ver = Number(versionParts[i] || 0);
              if (cur === ver) {
                continue; // eslint-disable-line no-restricted-syntax, no-continue
              }
              if (op === '<') {
                return cur < ver;
              } else if (op === '>=') {
                return cur >= ver;
              } else {
                return false;
              }
            }
            return op === '>=';
          }

          function matchesRange(range) {
            var specifiers = range.split(/ ?&& ?/);
            if (specifiers.length === 0) {
              return false;
            }
            for (var i = 0; i < specifiers.length; ++i) {
              if (!specifierIncluded(specifiers[i])) {
                return false;
              }
            }
            return true;
          }

          function versionIncluded(specifierValue) {
            if (typeof specifierValue === 'boolean') {
              return specifierValue;
            }
            if (specifierValue && typeof specifierValue === 'object') {
              for (var i = 0; i < specifierValue.length; ++i) {
                if (matchesRange(specifierValue[i])) {
                  return true;
                }
              }
              return false;
            }
            return matchesRange(specifierValue);
          }

          var data = require('./core.json');

          var core = {};
          for (var mod in data) {
            // eslint-disable-line no-restricted-syntax
            if (Object.prototype.hasOwnProperty.call(data, mod)) {
              core[mod] = versionIncluded(data[mod]);
            }
          }
          module.exports = core;
        }.call(this, require('_process')));
      },
      { './core.json': 22, _process: 3 },
    ],
    24: [
      function (require, module, exports) {
        var core = require('./core');

        module.exports = function isCore(x) {
          return Object.prototype.hasOwnProperty.call(core, x);
        };
      },
      { './core': 23 },
    ],
    25: [
      function (require, module, exports) {
        var path = require('path');
        var parse = path.parse || require('path-parse');

        var getNodeModulesDirs = function getNodeModulesDirs(
          absoluteStart,
          modules
        ) {
          var prefix = '/';
          if (/^([A-Za-z]:)/.test(absoluteStart)) {
            prefix = '';
          } else if (/^\\\\/.test(absoluteStart)) {
            prefix = '\\\\';
          }

          var paths = [absoluteStart];
          var parsed = parse(absoluteStart);
          while (parsed.dir !== paths[paths.length - 1]) {
            paths.push(parsed.dir);
            parsed = parse(parsed.dir);
          }

          return paths.reduce(function (dirs, aPath) {
            return dirs.concat(
              modules.map(function (moduleDir) {
                return path.resolve(prefix, aPath, moduleDir);
              })
            );
          }, []);
        };

        module.exports = function nodeModulesPaths(start, opts, request) {
          var modules =
            opts && opts.moduleDirectory
              ? [].concat(opts.moduleDirectory)
              : ['node_modules'];

          if (opts && typeof opts.paths === 'function') {
            return opts.paths(
              request,
              start,
              function () {
                return getNodeModulesDirs(start, modules);
              },
              opts
            );
          }

          var dirs = getNodeModulesDirs(start, modules);
          return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
        };
      },
      { path: 2, 'path-parse': 18 },
    ],
    26: [
      function (require, module, exports) {
        module.exports = function (x, opts) {
          /**
           * This file is purposefully a passthrough. It's expected that third-party
           * environments will override it at runtime in order to inject special logic
           * into `resolve` (by manipulating the options). One such example is the PnP
           * code path in Yarn.
           */

          return opts || {};
        };
      },
      {},
    ],
    27: [
      function (require, module, exports) {
        (function (process) {
          var isCore = require('./is-core');
          var fs = require('fs');
          var path = require('path');
          var caller = require('./caller.js');
          var nodeModulesPaths = require('./node-modules-paths.js');
          var normalizeOptions = require('./normalize-options.js');

          var realpathFS =
            fs.realpathSync && typeof fs.realpathSync.native === 'function'
              ? fs.realpathSync.native
              : fs.realpathSync;

          var defaultIsFile = function isFile(file) {
            try {
              var stat = fs.statSync(file);
            } catch (e) {
              if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR'))
                return false;
              throw e;
            }
            return stat.isFile() || stat.isFIFO();
          };

          var defaultIsDir = function isDirectory(dir) {
            try {
              var stat = fs.statSync(dir);
            } catch (e) {
              if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR'))
                return false;
              throw e;
            }
            return stat.isDirectory();
          };

          var defaultRealpathSync = function realpathSync(x) {
            try {
              return realpathFS(x);
            } catch (realpathErr) {
              if (realpathErr.code !== 'ENOENT') {
                throw realpathErr;
              }
            }
            return x;
          };

          var maybeRealpathSync = function maybeRealpathSync(
            realpathSync,
            x,
            opts
          ) {
            if (opts && opts.preserveSymlinks === false) {
              return realpathSync(x);
            }
            return x;
          };

          var getPackageCandidates = function getPackageCandidates(
            x,
            start,
            opts
          ) {
            var dirs = nodeModulesPaths(start, opts, x);
            for (var i = 0; i < dirs.length; i++) {
              dirs[i] = path.join(dirs[i], x);
            }
            return dirs;
          };

          module.exports = function resolveSync(x, options) {
            if (typeof x !== 'string') {
              throw new TypeError('Path must be a string.');
            }
            var opts = normalizeOptions(x, options);

            var isFile = opts.isFile || defaultIsFile;
            var readFileSync = opts.readFileSync || fs.readFileSync;
            var isDirectory = opts.isDirectory || defaultIsDir;
            var realpathSync = opts.realpathSync || defaultRealpathSync;
            var packageIterator = opts.packageIterator;

            var extensions = opts.extensions || ['.js'];
            var basedir = opts.basedir || path.dirname(caller());
            var parent = opts.filename || basedir;

            opts.paths = opts.paths || [];

            // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
            var absoluteStart = maybeRealpathSync(
              realpathSync,
              path.resolve(basedir),
              opts
            );

            if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
              var res = path.resolve(absoluteStart, x);
              if (x === '.' || x === '..' || x.slice(-1) === '/') res += '/';
              var m = loadAsFileSync(res) || loadAsDirectorySync(res);
              if (m) return maybeRealpathSync(realpathSync, m, opts);
            } else if (isCore(x)) {
              return x;
            } else {
              var n = loadNodeModulesSync(x, absoluteStart);
              if (n) return maybeRealpathSync(realpathSync, n, opts);
            }

            var err = new Error(
              "Cannot find module '" + x + "' from '" + parent + "'"
            );
            err.code = 'MODULE_NOT_FOUND';
            throw err;

            function loadAsFileSync(x) {
              var pkg = loadpkg(path.dirname(x));

              if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
                var rfile = path.relative(pkg.dir, x);
                var r = opts.pathFilter(pkg.pkg, x, rfile);
                if (r) {
                  x = path.resolve(pkg.dir, r); // eslint-disable-line no-param-reassign
                }
              }

              if (isFile(x)) {
                return x;
              }

              for (var i = 0; i < extensions.length; i++) {
                var file = x + extensions[i];
                if (isFile(file)) {
                  return file;
                }
              }
            }

            function loadpkg(dir) {
              if (dir === '' || dir === '/') return;
              if (process.platform === 'win32' && /^\w:[/\\]*$/.test(dir)) {
                return;
              }
              if (/[/\\]node_modules[/\\]*$/.test(dir)) return;

              var pkgfile = path.join(
                maybeRealpathSync(realpathSync, dir, opts),
                'package.json'
              );

              if (!isFile(pkgfile)) {
                return loadpkg(path.dirname(dir));
              }

              var body = readFileSync(pkgfile);

              try {
                var pkg = JSON.parse(body);
              } catch (jsonErr) {}

              if (pkg && opts.packageFilter) {
                // v2 will pass pkgfile
                pkg = opts.packageFilter(pkg, /*pkgfile,*/ dir); // eslint-disable-line spaced-comment
              }

              return { pkg: pkg, dir: dir };
            }

            function loadAsDirectorySync(x) {
              var pkgfile = path.join(
                maybeRealpathSync(realpathSync, x, opts),
                '/package.json'
              );
              if (isFile(pkgfile)) {
                try {
                  var body = readFileSync(pkgfile, 'UTF8');
                  var pkg = JSON.parse(body);
                } catch (e) {}

                if (pkg && opts.packageFilter) {
                  // v2 will pass pkgfile
                  pkg = opts.packageFilter(pkg, /*pkgfile,*/ x); // eslint-disable-line spaced-comment
                }

                if (pkg && pkg.main) {
                  if (typeof pkg.main !== 'string') {
                    var mainError = new TypeError(
                      'package “' + pkg.name + '” `main` must be a string'
                    );
                    mainError.code = 'INVALID_PACKAGE_MAIN';
                    throw mainError;
                  }
                  if (pkg.main === '.' || pkg.main === './') {
                    pkg.main = 'index';
                  }
                  try {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                    var n = loadAsDirectorySync(path.resolve(x, pkg.main));
                    if (n) return n;
                  } catch (e) {}
                }
              }

              return loadAsFileSync(path.join(x, '/index'));
            }

            function loadNodeModulesSync(x, start) {
              var thunk = function () {
                return getPackageCandidates(x, start, opts);
              };
              var dirs = packageIterator
                ? packageIterator(x, start, thunk, opts)
                : thunk();

              for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                if (isDirectory(path.dirname(dir))) {
                  var m = loadAsFileSync(dir);
                  if (m) return m;
                  var n = loadAsDirectorySync(dir);
                  if (n) return n;
                }
              }
            }
          };
        }.call(this, require('_process')));
      },
      {
        './caller.js': 21,
        './is-core': 24,
        './node-modules-paths.js': 25,
        './normalize-options.js': 26,
        _process: 3,
        fs: 1,
        path: 2,
      },
    ],
    28: [
      function (require, module, exports) {
        (function (process) {
          var fs = require('fs');
          var path = require('path');

          var dommy = require('dommy');
          var resolve = require('resolve');

          var handler = require('./lib/handler');
          var runtime = require('./lib/runtime');
          var util = require('./lib/util');

          module.exports = function (tl, opts) {
            if (!opts) opts = {};

            var cache = {};

            var api = {
              setRuntime: function (file) {
                handler._context.runtime = file;
                runtime = this.require(file);
              },

              serialize: function (el) {
                return '' + el;
              },

              require: function (file) {
                var dir = path.dirname(file);
                function resolveFile(f) {
                  return resolve.sync(f, {
                    basedir: dir,
                    paths: require.main.paths,
                    extensions: ['.tl', '.js'],
                  });
                }
                var mod = cache[file];
                if (!mod) {
                  var code;
                  if (path.extname(file) != '.tl') {
                    code = fs.readFileSync(resolveFile(file), 'utf8');
                  } else code = this.get(file);
                  var exports = {};
                  var module = { exports: exports };
                  var self = this;
                  var ctx = {
                    document: dommy(),
                    Element: dommy.Element,
                    TextNode: dommy.TextNode,
                    console: console,
                    process: process,
                    module: module,
                    exports: exports,
                    require: function (f) {
                      return self.require(resolveFile(f));
                    },
                  };
                  /*eslint no-with:0, no-eval:0 */
                  with (ctx) {
                    eval(code + '\n//# sourceURL=' + file);
                  }
                  mod = cache[file] = module.exports;
                }
                return mod;
              },

              /**
               * ref: a reference to an element, e.g. "el/foo"
               * data: template data
               */
              render: function (ref, data) {
                return this.renderFile(tl.resolve(ref), data);
              },

              /**
               * file: absolute path to a .tl file
               * data: template data
               */
              renderFile: function (file, data) {
                var comp = this.require(file);
                var props = {};
                this.getProps(comp).forEach(function (n) {
                  props[n] = data[n];
                });
                var el = this.renderComponent(comp, props);
                var html = '';
                var dt = this.getDoctype(el);
                if (dt) {
                  html = '<!DOCTYPE ' + dt + '>';
                }
                return html + runtime(dommy(), util).serialize(el);
              },

              /**
               * comp: a require()'d component function
               * props: template props
               */
              renderComponent: function (comp, props) {
                return comp(props);
              },

              /**
               * Returns all properties supported by the given component.
               */
              getProps: function (comp) {
                return comp.props;
              },

              /**
               * el: a rendered element
               */
              getDoctype: function (el) {
                return el.doctype;
              },
            };

            tl.templates.registerCompiler(handler, {
              name: 'js',
              extension: '.js',
              api: api,
            });

            if (opts.requireExtension !== false) {
              require.extensions['.tl'] = function (module, file) {
                module.exports = tl.templates.js.require(file);
              };
            }

            tl.on('process', function (files) {
              files.forEach(function (f) {
                cache[f] = require.cache[f] = undefined;
              });
            });
          };
        }.call(this, require('_process')));
      },
      {
        './lib/handler': 30,
        './lib/runtime': 31,
        './lib/util': 32,
        _process: 3,
        dommy: 17,
        fs: 1,
        path: 2,
        resolve: 19,
      },
    ],
    29: [
      function (require, module, exports) {
        exports.decorate = function (el, className, attrs) {
          if (className) exports.addClass(el, className);
          exports.setAttributes(el, attrs);
          return el;
        };

        exports.setAttributes = function (el, attrs) {
          for (var n in attrs) {
            var val = attrs[n];
            if (val) el.setAttribute(n, val);
          }
          return el;
        };

        /**
         * Add `className` to the element's classList. If a third argument is passed
         * the class is only added if the value is truthy.
         */
        exports.addClass = function (el, className, add) {
          if (arguments.length == 2 || add) {
            var cls = (el.className || '').split(' ');
            if (!~cls.indexOf(className)) cls.push(className);
            el.className = cls.join(' ').trim();
          }
          return el;
        };

        /**
         * Append `child` to `el`. If child is not a Node, create a TextNode.
         */
        exports.append = function append(el, child) {
          if (child === undefined || child === null) return;
          if (child.forEach) {
            child.forEach(function (c) {
              append(el, c);
            });
          } else if (child.children) {
            child.children.forEach(function (c) {
              append(el, c);
            });
          } else {
            el.appendChild(
              child.nodeType ? child : el.ownerDocument.createTextNode(child)
            );
          }
        };
      },
      {},
    ],
    30: [
      function (require, module, exports) {
        var f = require('util').format;
        var uniqs = require('uniqs');

        module.exports = {
          _context: {
            runtime: require.resolve('./runtime'),
          },

          root: function (node) {
            // skip settings and mixins
            if (!node.root || node.root.type == 'mixin') return;

            this.visit(node.settings);

            var root = this.visit(node.root, { ast: node });
            var runtime = this.runtime;

            return join(
              f('var u=require("%s")', require.resolve('./util')),
              f('var d=require("%s")(document, u)', runtime),
              f('var props=%s', this.visit(uniqs(node.vars, node.states))),
              f(
                'module.exports=d.component(function(scope){\n return %s\n}, %j, props, %j)',
                root,
                node.file,
                node.doctype
              )
            );
          },

          _string: function (s) {
            return JSON.stringify(s);
          },

          _boolean: function (value) {
            return JSON.stringify(value);
          },

          _number: function (value) {
            return JSON.stringify(value);
          },

          _object: function (o) {
            if (Array.isArray(o)) {
              return f('[%s]', o.map(this.visit, this));
            }
            return object(
              Object.keys(o).map(function (k) {
                return { name: k, value: o[k] };
              }),
              this.visit.bind(this)
            );
          },

          value: function (node) {
            return f('%s.join("")', this.visit(node.tokens));
          },

          element: function (node) {
            var ast = this.ast;
            var attrs = object(node.attributes, this.visit.bind(this));
            var className = this.visit(node.class || '');

            if (node == ast.root) {
              var states = {};
              for (var s in node.states) {
                states[node.states[s]] = { type: 'variable', name: s };
              }
              attrs = f(
                'u.root(%s,scope,props,%s,%s,d)',
                className,
                this.visit(states),
                attrs
              );
            } else if (node.class) {
              attrs = f('u.sub(%s)', [className, attrs].filter(Boolean));
            }

            return f(
              'd.el(%s,%s,%s)',
              this.visit(node.name),
              attrs,
              this.visit(node.children || [])
            );
          },

          comment: function (node) {
            return 'd.comment(' + this.visit(node.text) + ')';
          },

          html: function (node) {
            return 'd.html(' + this.visit(node.html) + ')';
          },

          serialize: function (node) {
            return 'd.serialize(' + this.visit(node.content) + ')';
          },

          attribute: function (node) {
            return f('{name:%j,value:%s}', node.name, this.visit(node.value));
          },

          variable: function (node) {
            return f('scope[%j]', node.name);
          },

          scopeVariable: function () {
            return 'scope';
          },

          if: function (node) {
            var s = f(
              'if(u.truthy(%s)) { return %s }',
              this.visit(node.condition),
              this.visit(node.consequent)
            );

            if (node.alternate) {
              s += f('else { return %s }', this.visit(node.alternate));
            }
            return iife(s);
          },

          for: function (node) {
            return f(
              'u.each(%s, scope, function(scope) { return %s })',
              this.visit(node.expression),
              this.visit(node.body)
            );
          },

          path: function (node) {
            return f('require(%j)', node.file);
          },
        };

        // Code generation helpers

        function object(props, visit) {
          if (!props) return '{}';
          props = props.map(function (p) {
            return f('"%s":%s', p.name, visit(p.value));
          });
          return f('{%s}', props);
        }

        function iife(/* ... */) {
          return f('(function(){%s}())', join.apply(this, arguments));
        }

        function join() {
          return Array.prototype.concat
            .apply([], arguments)
            .filter(Boolean)
            .join(';\n');
        }
      },
      { uniqs: 33, util: 6 },
    ],
    31: [
      function (require, module, exports) {
        module.exports = function (document, u) {
          return {
            component: function (fn, displayName, known, doctype) {
              var comp = function (data) {
                if (arguments.length > 1) {
                  data.children = Array.prototype.slice.call(arguments, 1);
                }
                var el = fn(data);
                if (!el.doctype) el.doctype = doctype;
                return el;
              };
              comp.props = known;
              return comp;
            },

            el: function (tag, attrs, children) {
              var el;
              children = u.flatten(children || []).filter(function (c) {
                return c !== undefined;
              });
              if (typeof tag == 'function') {
                el = tag.apply(this, [attrs].concat(children));
              } else if (typeof tag == 'string') {
                el = document.createElement(tag);
                u.dom.setAttributes(el, attrs);
                u.dom.append(el, children);
              } else {
                throw new Error('Not a string: ' + tag);
              }
              return el;
            },

            comment: function (txt) {
              return document.createComment(txt);
            },

            html: function (html) {
              var f = document.createDocumentFragment();
              f.innerHTML = u.flatten([html]).join('');
              return f;
            },

            serialize: function (content) {
              var f = document.createDocumentFragment();
              u.dom.append(f, content);
              return f.innerHTML;
            },
          };
        };
      },
      {},
    ],
    32: [
      function (require, module, exports) {
        exports.dom = require('./domutils');
        exports.flatten = flatten;

        function flatten(list) {
          if (!list) return;
          return list.reduce(function (acc, item) {
            if (Array.isArray(item)) return acc.concat(flatten(item));
            return acc.concat(item);
          }, []);
        }

        exports.truthy = function (v) {
          if (Array.isArray(v)) return v.length;
          return !!v;
        };

        /**
         * className the component's CSS class name
         * props the runtime properties passed to the component
         * known list of known vars/states
         * states map from state names to values
         * attrs map of locally defined attributes
         */
        exports.root = function (
          className,
          props,
          known,
          states,
          localAttrs,
          runtime
        ) {
          if (!props) props = {};
          if (!localAttrs) localAttrs = {};

          var attr = {};
          for (var n in localAttrs) {
            attr[n] = localAttrs[n];
          }

          var cls = [className, props.class, localAttrs.class];
          for (var s in states) {
            if (exports.truthy(states[s])) cls.push(s);
          }

          var validate = (runtime && runtime.isSupportedAttr) || Boolean;
          Object.keys(props).forEach(function (p) {
            var v = props[p];
            if (!~known.indexOf(p) && validate(p)) {
              attr[p] = v;
            }
          });

          attr.class = cls.filter(Boolean).join(' ');
          return attr;
        };

        exports.sub = function (className, attrs) {
          if (!attrs) attrs = {};
          attrs.class = exports.addClass(className, attrs.class);
          return attrs;
        };

        exports.addClass = function (cls, add) {
          var c = cls || '';
          return cls && add ? c + ' ' + add : c || add || '';
        };

        /**
         * Invoke the iterator function for each item in the list and return the results.
         */
        exports.each = function (list, scope, iterator) {
          if (list) return list.map(iterator);
        };
      },
      { './domutils': 29 },
    ],
    33: [
      function (require, module, exports) {
        module.exports = function uniqs() {
          var list = Array.prototype.concat.apply([], arguments);
          return list.filter(function (item, i) {
            return i == list.indexOf(item);
          });
        };
      },
      {},
    ],
  },
  {},
  [28]
);
