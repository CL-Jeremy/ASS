(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ASS = factory());
}(this, (function () { 'use strict';

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
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function parseEffect(text) {
    var param = text.toLowerCase().trim().split(/\s*;\s*/);

    if (param[0] === 'banner') {
      return {
        name: param[0],
        delay: param[1] * 1 || 0,
        leftToRight: param[2] * 1 || 0,
        fadeAwayWidth: param[3] * 1 || 0
      };
    }

    if (/^scroll\s/.test(param[0])) {
      return {
        name: param[0],
        y1: Math.min(param[1] * 1, param[2] * 1),
        y2: Math.max(param[1] * 1, param[2] * 1),
        delay: param[3] * 1 || 0,
        fadeAwayHeight: param[4] * 1 || 0
      };
    }

    return null;
  }

  function parseDrawing(text) {
    if (!text) return [];
    return text.toLowerCase() // numbers
    .replace(/([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)/g, ' $1 ') // commands
    .replace(/([mnlbspc])/g, ' $1 ').trim().replace(/\s+/g, ' ').split(/\s(?=[mnlbspc])/).map(function (cmd) {
      return cmd.split(' ').filter(function (x, i) {
        return !(i && Number.isNaN(x * 1));
      });
    });
  }

  var numTags = ['b', 'i', 'u', 's', 'fsp', 'k', 'K', 'kf', 'ko', 'kt', 'fe', 'q', 'p', 'pbo', 'a', 'an', 'fscx', 'fscy', 'fax', 'fay', 'frx', 'fry', 'frz', 'fr', 'be', 'blur', 'bord', 'xbord', 'ybord', 'shad', 'xshad', 'yshad'];
  var numRegexs = numTags.map(function (nt) {
    return {
      name: nt,
      regex: new RegExp("^".concat(nt, "-?\\d"))
    };
  });
  function parseTag(text) {
    var tag = {};

    for (var i = 0; i < numRegexs.length; i++) {
      var _numRegexs$i = numRegexs[i],
          name = _numRegexs$i.name,
          regex = _numRegexs$i.regex;

      if (regex.test(text)) {
        tag[name] = text.slice(name.length) * 1;
        return tag;
      }
    }

    if (/^fn/.test(text)) {
      tag.fn = text.slice(2);
    } else if (/^r/.test(text)) {
      tag.r = text.slice(1);
    } else if (/^fs[\d+-]/.test(text)) {
      tag.fs = text.slice(2);
    } else if (/^\d?c&?H?[0-9a-f]+|^\d?c$/i.test(text)) {
      var _text$match = text.match(/^(\d?)c&?H?(\w*)/),
          _text$match2 = _slicedToArray(_text$match, 3),
          num = _text$match2[1],
          color = _text$match2[2];

      tag["c".concat(num || 1)] = color && "000000".concat(color).slice(-6);
    } else if (/^\da&?H?[0-9a-f]+/i.test(text)) {
      var _text$match3 = text.match(/^(\d)a&?H?(\w\w)/),
          _text$match4 = _slicedToArray(_text$match3, 3),
          _num = _text$match4[1],
          alpha = _text$match4[2];

      tag["a".concat(_num)] = alpha;
    } else if (/^alpha&?H?[0-9a-f]+/i.test(text)) {
      var _text$match5 = text.match(/^alpha&?H?([0-9a-f]+)/i);

      var _text$match6 = _slicedToArray(_text$match5, 2);

      tag.alpha = _text$match6[1];
      tag.alpha = "00".concat(tag.alpha).slice(-2);
    } else if (/^(?:pos|org|move|fad|fade)\(/.test(text)) {
      var _text$match7 = text.match(/^(\w+)\((.*?)\)?$/),
          _text$match8 = _slicedToArray(_text$match7, 3),
          key = _text$match8[1],
          value = _text$match8[2];

      tag[key] = value.trim().split(/\s*,\s*/).map(Number);
    } else if (/^i?clip/.test(text)) {
      var p = text.match(/^i?clip\((.*?)\)?$/)[1].trim().split(/\s*,\s*/);
      tag.clip = {
        inverse: /iclip/.test(text),
        scale: 1,
        drawing: null,
        dots: null
      };

      if (p.length === 1) {
        tag.clip.drawing = parseDrawing(p[0]);
      }

      if (p.length === 2) {
        tag.clip.scale = p[0] * 1;
        tag.clip.drawing = parseDrawing(p[1]);
      }

      if (p.length === 4) {
        tag.clip.dots = p.map(Number);
      }
    } else if (/^t\(/.test(text)) {
      var _p = text.match(/^t\((.*?)\)?$/)[1].trim().replace(/\\.*/, function (x) {
        return x.replace(/,/g, '\n');
      }).split(/\s*,\s*/);

      if (!_p[0]) return tag;
      tag.t = {
        t1: 0,
        t2: 0,
        accel: 1,
        tags: _p[_p.length - 1].replace(/\n/g, ',').split('\\').slice(1).map(parseTag)
      };

      if (_p.length === 2) {
        tag.t.accel = _p[0] * 1;
      }

      if (_p.length === 3) {
        tag.t.t1 = _p[0] * 1;
        tag.t.t2 = _p[1] * 1;
      }

      if (_p.length === 4) {
        tag.t.t1 = _p[0] * 1;
        tag.t.t2 = _p[1] * 1;
        tag.t.accel = _p[2] * 1;
      }
    }

    return tag;
  }

  function parseTags(text) {
    var tags = [];
    var depth = 0;
    var str = '';

    for (var i = 0; i < text.length; i++) {
      var x = text[i];
      if (x === '(') depth++;
      if (x === ')') depth--;
      if (depth < 0) depth = 0;

      if (!depth && x === '\\') {
        if (str) {
          tags.push(str);
        }

        str = '';
      } else {
        str += x;
      }
    }

    tags.push(str);
    return tags.map(parseTag);
  }

  function parseText(text) {
    var pairs = text.split(/{([^{}]*?)}/);
    var parsed = [];

    if (pairs[0].length) {
      parsed.push({
        tags: [],
        text: pairs[0],
        drawing: []
      });
    }

    for (var i = 1; i < pairs.length; i += 2) {
      var tags = parseTags(pairs[i]);
      var isDrawing = tags.reduce(function (v, tag) {
        return tag.p === undefined ? v : !!tag.p;
      }, false);
      parsed.push({
        tags,
        text: isDrawing ? '' : pairs[i + 1],
        drawing: isDrawing ? parseDrawing(pairs[i + 1]) : []
      });
    }

    return {
      raw: text,
      combined: parsed.map(function (frag) {
        return frag.text;
      }).join(''),
      parsed
    };
  }

  function parseTime(time) {
    var t = time.split(':');
    return t[0] * 3600 + t[1] * 60 + t[2] * 1;
  }

  function parseDialogue(text, format) {
    var fields = text.split(',');

    if (fields.length > format.length) {
      var textField = fields.slice(format.length - 1).join();
      fields = fields.slice(0, format.length - 1);
      fields.push(textField);
    }

    var dia = {};

    for (var i = 0; i < fields.length; i++) {
      var fmt = format[i];
      var fld = fields[i].trim();

      switch (fmt) {
        case 'Layer':
        case 'MarginL':
        case 'MarginR':
        case 'MarginV':
          dia[fmt] = fld * 1;
          break;

        case 'Start':
        case 'End':
          dia[fmt] = parseTime(fld);
          break;

        case 'Effect':
          dia[fmt] = parseEffect(fld);
          break;

        case 'Text':
          dia[fmt] = parseText(fld);
          break;

        default:
          dia[fmt] = fld;
      }
    }

    return dia;
  }

  function parseFormat(text) {
    return text.match(/Format\s*:\s*(.*)/i)[1].split(/\s*,\s*/);
  }

  var assign = Object.assign ||
  /* istanbul ignore next */
  function assign(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < sources.length; i++) {
      if (!sources[i]) continue;
      var keys = Object.keys(sources[i]);

      for (var j = 0; j < keys.length; j++) {
        // eslint-disable-next-line no-param-reassign
        target[keys[j]] = sources[i][keys[j]];
      }
    }

    return target;
  };

  function parseStyle(text, format) {
    var values = text.match(/Style\s*:\s*(.*)/i)[1].split(/\s*,\s*/);
    return assign.apply(void 0, [{}].concat(_toConsumableArray(format.map(function (fmt, idx) {
      return {
        [fmt]: values[idx]
      };
    }))));
  }

  function parse(text) {
    var tree = {
      info: {},
      styles: {
        format: [],
        style: []
      },
      events: {
        format: [],
        comment: [],
        dialogue: []
      }
    };
    var lines = text.split(/\r?\n/);
    var state = 0;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (/^;/.test(line)) continue;
      if (/^\[Script Info\]/i.test(line)) state = 1;else if (/^\[V4\+? Styles\]/i.test(line)) state = 2;else if (/^\[Events\]/i.test(line)) state = 3;else if (/^\[.*\]/.test(line)) state = 0;
      if (state === 0) continue;

      if (state === 1) {
        if (/:/.test(line)) {
          var _line$match = line.match(/(.*?)\s*:\s*(.*)/),
              _line$match2 = _slicedToArray(_line$match, 3),
              key = _line$match2[1],
              value = _line$match2[2];

          tree.info[key] = value;
        }
      }

      if (state === 2) {
        if (/^Format\s*:/i.test(line)) {
          tree.styles.format = parseFormat(line);
        }

        if (/^Style\s*:/i.test(line)) {
          tree.styles.style.push(parseStyle(line, tree.styles.format));
        }
      }

      if (state === 3) {
        if (/^Format\s*:/i.test(line)) {
          tree.events.format = parseFormat(line);
        }

        if (/^(?:Comment|Dialogue)\s*:/i.test(line)) {
          var _line$match3 = line.match(/^(\w+?)\s*:\s*(.*)/i),
              _line$match4 = _slicedToArray(_line$match3, 3),
              _key = _line$match4[1],
              _value = _line$match4[2];

          tree.events[_key.toLowerCase()].push(parseDialogue(_value, tree.events.format));
        }
      }
    }

    return tree;
  }

  function createCommand(arr) {
    var cmd = {
      type: null,
      prev: null,
      next: null,
      points: []
    };

    if (/[mnlbs]/.test(arr[0])) {
      cmd.type = arr[0].toUpperCase().replace('N', 'L').replace('B', 'C');
    }

    for (var len = arr.length - !(arr.length & 1), i = 1; i < len; i += 2) {
      cmd.points.push({
        x: arr[i] * 1,
        y: arr[i + 1] * 1
      });
    }

    return cmd;
  }

  function isValid(cmd) {
    if (!cmd.points.length || !cmd.type) {
      return false;
    }

    if (/C|S/.test(cmd.type) && cmd.points.length < 3) {
      return false;
    }

    return true;
  }

  function getViewBox(commands) {
    var _ref;

    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    (_ref = []).concat.apply(_ref, _toConsumableArray(commands.map(function (_ref2) {
      var points = _ref2.points;
      return points;
    }))).forEach(function (_ref3) {
      var x = _ref3.x,
          y = _ref3.y;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  /**
   * Convert S command to B command
   * Reference from https://github.com/d3/d3/blob/v3.5.17/src/svg/line.js#L259
   * @param  {Array}  points points
   * @param  {String} prev   type of previous command
   * @param  {String} next   type of next command
   * @return {Array}         converted commands
   */


  function s2b(points, prev, next) {
    var results = [];
    var bb1 = [0, 2 / 3, 1 / 3, 0];
    var bb2 = [0, 1 / 3, 2 / 3, 0];
    var bb3 = [0, 1 / 6, 2 / 3, 1 / 6];

    var dot4 = function dot4(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    };

    var px = [points[points.length - 1].x, points[0].x, points[1].x, points[2].x];
    var py = [points[points.length - 1].y, points[0].y, points[1].y, points[2].y];
    results.push({
      type: prev === 'M' ? 'M' : 'L',
      points: [{
        x: dot4(bb3, px),
        y: dot4(bb3, py)
      }]
    });

    for (var i = 3; i < points.length; i++) {
      px = [points[i - 3].x, points[i - 2].x, points[i - 1].x, points[i].x];
      py = [points[i - 3].y, points[i - 2].y, points[i - 1].y, points[i].y];
      results.push({
        type: 'C',
        points: [{
          x: dot4(bb1, px),
          y: dot4(bb1, py)
        }, {
          x: dot4(bb2, px),
          y: dot4(bb2, py)
        }, {
          x: dot4(bb3, px),
          y: dot4(bb3, py)
        }]
      });
    }

    if (next === 'L' || next === 'C') {
      var last = points[points.length - 1];
      results.push({
        type: 'L',
        points: [{
          x: last.x,
          y: last.y
        }]
      });
    }

    return results;
  }
  function toSVGPath(instructions) {
    return instructions.map(function (_ref4) {
      var type = _ref4.type,
          points = _ref4.points;
      return type + points.map(function (_ref5) {
        var x = _ref5.x,
            y = _ref5.y;
        return "".concat(x, ",").concat(y);
      }).join(',');
    }).join('');
  }
  function compileDrawing(rawCommands) {
    var _ref7;

    var commands = [];
    var i = 0;

    while (i < rawCommands.length) {
      var arr = rawCommands[i];
      var cmd = createCommand(arr);

      if (isValid(cmd)) {
        if (cmd.type === 'S') {
          var _points$slice$ = (commands[i - 1] || {
            points: [{
              x: 0,
              y: 0
            }]
          }).points.slice(-1)[0],
              x = _points$slice$.x,
              y = _points$slice$.y;
          cmd.points.unshift({
            x,
            y
          });
        }

        if (i) {
          cmd.prev = commands[i - 1].type;
          commands[i - 1].next = cmd.type;
        }

        commands.push(cmd);
        i++;
      } else {
        if (i && commands[i - 1].type === 'S') {
          var additionPoints = {
            p: cmd.points,
            c: commands[i - 1].points.slice(0, 3)
          };
          commands[i - 1].points = commands[i - 1].points.concat((additionPoints[arr[0]] || []).map(function (_ref6) {
            var x = _ref6.x,
                y = _ref6.y;
            return {
              x,
              y
            };
          }));
        }

        rawCommands.splice(i, 1);
      }
    }

    var instructions = (_ref7 = []).concat.apply(_ref7, _toConsumableArray(commands.map(function (_ref8) {
      var type = _ref8.type,
          points = _ref8.points,
          prev = _ref8.prev,
          next = _ref8.next;
      return type === 'S' ? s2b(points, prev, next) : {
        type,
        points
      };
    })));

    return assign({
      instructions,
      d: toSVGPath(instructions)
    }, getViewBox(commands));
  }

  var tTags = ['fs', 'clip', 'c1', 'c2', 'c3', 'c4', 'a1', 'a2', 'a3', 'a4', 'alpha', 'fscx', 'fscy', 'fax', 'fay', 'frx', 'fry', 'frz', 'fr', 'be', 'blur', 'bord', 'xbord', 'ybord', 'shad', 'xshad', 'yshad'];
  function compileTag(tag, key) {
    var presets = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var value = tag[key];

    if (value === undefined) {
      return null;
    }

    if (key === 'pos' || key === 'org') {
      return value.length === 2 ? {
        [key]: {
          x: value[0],
          y: value[1]
        }
      } : null;
    }

    if (key === 'move') {
      var _value = value,
          _value2 = _slicedToArray(_value, 6),
          x1 = _value2[0],
          y1 = _value2[1],
          x2 = _value2[2],
          y2 = _value2[3],
          _value2$ = _value2[4],
          t1 = _value2$ === void 0 ? 0 : _value2$,
          _value2$2 = _value2[5],
          t2 = _value2$2 === void 0 ? 0 : _value2$2;

      return value.length === 4 || value.length === 6 ? {
        move: {
          x1,
          y1,
          x2,
          y2,
          t1,
          t2
        }
      } : null;
    }

    if (key === 'fad' || key === 'fade') {
      if (value.length === 2) {
        var _value3 = value,
            _value4 = _slicedToArray(_value3, 2),
            _t = _value4[0],
            _t2 = _value4[1];

        return {
          fade: {
            type: 'fad',
            t1: _t,
            t2: _t2
          }
        };
      }

      if (value.length === 7) {
        var _value5 = value,
            _value6 = _slicedToArray(_value5, 7),
            a1 = _value6[0],
            a2 = _value6[1],
            a3 = _value6[2],
            _t3 = _value6[3],
            _t4 = _value6[4],
            t3 = _value6[5],
            t4 = _value6[6];

        return {
          fade: {
            type: 'fade',
            a1,
            a2,
            a3,
            t1: _t3,
            t2: _t4,
            t3,
            t4
          }
        };
      }

      return null;
    }

    if (key === 'clip') {
      var _value7 = value,
          inverse = _value7.inverse,
          scale = _value7.scale,
          drawing = _value7.drawing,
          dots = _value7.dots;

      if (drawing) {
        return {
          clip: {
            inverse,
            scale,
            drawing: compileDrawing(drawing),
            dots
          }
        };
      }

      if (dots) {
        var _dots = _slicedToArray(dots, 4),
            _x = _dots[0],
            _y = _dots[1],
            _x2 = _dots[2],
            _y2 = _dots[3];

        return {
          clip: {
            inverse,
            scale,
            drawing,
            dots: {
              x1: _x,
              y1: _y,
              x2: _x2,
              y2: _y2
            }
          }
        };
      }

      return null;
    }

    if (/^[xy]?(bord|shad)$/.test(key)) {
      value = Math.max(value, 0);
    }

    if (key === 'bord') {
      return {
        xbord: value,
        ybord: value
      };
    }

    if (key === 'shad') {
      return {
        xshad: value,
        yshad: value
      };
    }

    if (/^c\d$/.test(key)) {
      return {
        [key]: value || presets[key]
      };
    }

    if (key === 'alpha') {
      return {
        a1: value,
        a2: value,
        a3: value,
        a4: value
      };
    }

    if (key === 'fr') {
      return {
        frz: value
      };
    }

    if (key === 'fs') {
      return {
        fs: /^\+|-/.test(value) ? (value * 1 > -10 ? 1 + value / 10 : 1) * presets.fs : value * 1
      };
    }

    if (key === 'K') {
      return {
        kf: value
      };
    }

    if (key === 't') {
      var _value8 = value,
          _t5 = _value8.t1,
          accel = _value8.accel,
          tags = _value8.tags;

      var _t6 = value.t2 || (presets.end - presets.start) * 1e3;

      var compiledTag = {};
      tags.forEach(function (t) {
        var k = Object.keys(t)[0];

        if (~tTags.indexOf(k) && !(k === 'clip' && !t[k].dots)) {
          assign(compiledTag, compileTag(t, k, presets));
        }
      });
      return {
        t: {
          t1: _t5,
          t2: _t6,
          accel,
          tag: compiledTag
        }
      };
    }

    return {
      [key]: value
    };
  }

  var a2an = [null, 1, 2, 3, null, 7, 8, 9, null, 4, 5, 6];
  var globalTags = ['r', 'a', 'an', 'pos', 'org', 'move', 'fade', 'fad', 'clip'];

  function inheritTag(pTag) {
    return JSON.parse(JSON.stringify(assign({}, pTag, {
      k: undefined,
      kf: undefined,
      ko: undefined,
      kt: undefined
    })));
  }

  function compileText(_ref) {
    var styles = _ref.styles,
        style = _ref.style,
        parsed = _ref.parsed,
        start = _ref.start,
        end = _ref.end;
    var alignment;
    var pos;
    var org;
    var move;
    var fade;
    var clip;
    var slices = [];
    var slice = {
      style,
      fragments: []
    };
    var prevTag = {};

    for (var i = 0; i < parsed.length; i++) {
      var _parsed$i = parsed[i],
          tags = _parsed$i.tags,
          text = _parsed$i.text,
          drawing = _parsed$i.drawing;
      var reset = void 0;

      for (var j = 0; j < tags.length; j++) {
        var tag = tags[j];
        reset = tag.r === undefined ? reset : tag.r;
      }

      var fragment = {
        tag: reset === undefined ? inheritTag(prevTag) : {},
        text,
        drawing: drawing.length ? compileDrawing(drawing) : null
      };

      for (var _j = 0; _j < tags.length; _j++) {
        var _tag = tags[_j];
        alignment = alignment || a2an[_tag.a || 0] || _tag.an;
        pos = pos || compileTag(_tag, 'pos');
        org = org || compileTag(_tag, 'org');
        move = move || compileTag(_tag, 'move');
        fade = fade || compileTag(_tag, 'fade') || compileTag(_tag, 'fad');
        clip = compileTag(_tag, 'clip') || clip;
        var key = Object.keys(_tag)[0];

        if (key && !~globalTags.indexOf(key)) {
          var sliceTag = styles[style].tag;
          var c1 = sliceTag.c1,
              c2 = sliceTag.c2,
              c3 = sliceTag.c3,
              c4 = sliceTag.c4;
          var fs = prevTag.fs || sliceTag.fs;
          var compiledTag = compileTag(_tag, key, {
            start,
            end,
            c1,
            c2,
            c3,
            c4,
            fs
          });

          if (key === 't') {
            fragment.tag.t = fragment.tag.t || [];
            fragment.tag.t.push(compiledTag.t);
          } else {
            assign(fragment.tag, compiledTag);
          }
        }
      }

      prevTag = fragment.tag;

      if (reset !== undefined) {
        slices.push(slice);
        slice = {
          style: styles[reset] ? reset : style,
          fragments: []
        };
      }

      if (fragment.text || fragment.drawing) {
        var prev = slice.fragments[slice.fragments.length - 1] || {};

        if (prev.text && fragment.text && !Object.keys(fragment.tag).length) {
          // merge fragment to previous if its tag is empty
          prev.text += fragment.text;
        } else {
          slice.fragments.push(fragment);
        }
      }
    }

    slices.push(slice);
    return assign({
      alignment,
      slices
    }, pos, org, move, fade, clip);
  }

  function compileDialogues(_ref) {
    var styles = _ref.styles,
        dialogues = _ref.dialogues;
    var minLayer = Infinity;
    var results = [];

    for (var i = 0; i < dialogues.length; i++) {
      var dia = dialogues[i];

      if (dia.Start >= dia.End) {
        continue;
      }

      if (!styles[dia.Style]) {
        dia.Style = 'Default';
      }

      var stl = styles[dia.Style].style;
      var compiledText = compileText({
        styles,
        style: dia.Style,
        parsed: dia.Text.parsed,
        start: dia.Start,
        end: dia.End
      });
      var alignment = compiledText.alignment || stl.Alignment;
      minLayer = Math.min(minLayer, dia.Layer);
      results.push(assign({
        layer: dia.Layer,
        start: dia.Start,
        end: dia.End,
        style: dia.Style,
        name: dia.Name,
        // reset style by `\r` will not effect margin and alignment
        margin: {
          left: dia.MarginL || stl.MarginL,
          right: dia.MarginR || stl.MarginR,
          vertical: dia.MarginV || stl.MarginV
        },
        effect: dia.Effect
      }, compiledText, {
        alignment
      }));
    }

    for (var _i = 0; _i < results.length; _i++) {
      results[_i].layer -= minLayer;
    }

    return results.sort(function (a, b) {
      return a.start - b.start || a.end - b.end;
    });
  }

  // https://github.com/Aegisub/Aegisub/blob/master/src/ass_style.h

  var DEFAULT_STYLE = {
    Name: 'Default',
    Fontname: 'Arial',
    Fontsize: '20',
    PrimaryColour: '&H00FFFFFF&',
    SecondaryColour: '&H000000FF&',
    OutlineColour: '&H00000000&',
    BackColour: '&H00000000&',
    Bold: '0',
    Italic: '0',
    Underline: '0',
    StrikeOut: '0',
    ScaleX: '100',
    ScaleY: '100',
    Spacing: '0',
    Angle: '0',
    BorderStyle: '1',
    Outline: '2',
    Shadow: '2',
    Alignment: '2',
    MarginL: '10',
    MarginR: '10',
    MarginV: '10',
    Encoding: '1'
  };
  /**
   * @param {String} color
   * @returns {Array} [AA, BBGGRR]
   */

  function parseStyleColor(color) {
    if (/^(&|H|&H)[0-9a-f]{6,}/i.test(color)) {
      var _color$match = color.match(/&?H?([0-9a-f]{2})?([0-9a-f]{6})/i),
          _color$match2 = _slicedToArray(_color$match, 3),
          a = _color$match2[1],
          c = _color$match2[2];

      return [a || '00', c];
    }

    var num = parseInt(color, 10);

    if (!Number.isNaN(num)) {
      var min = -2147483648;
      var max = 2147483647;

      if (num < min) {
        return ['00', '000000'];
      }

      var aabbggrr = min <= num && num <= max ? "00000000".concat((num < 0 ? num + 4294967296 : num).toString(16)).slice(-8) : String(num).slice(0, 8);
      return [aabbggrr.slice(0, 2), aabbggrr.slice(2)];
    }

    return ['00', '000000'];
  }
  function compileStyles(_ref) {
    var info = _ref.info,
        style = _ref.style,
        defaultStyle = _ref.defaultStyle;
    var result = {};
    var styles = [assign({}, DEFAULT_STYLE, defaultStyle, {
      Name: 'Default'
    })].concat(style);

    var _loop = function _loop(i) {
      var s = styles[i]; // this behavior is same as Aegisub by black-box testing

      if (/^(\*+)Default$/.test(s.Name)) {
        s.Name = 'Default';
      }

      Object.keys(s).forEach(function (key) {
        if (key !== 'Name' && key !== 'Fontname' && !/Colour/.test(key)) {
          s[key] *= 1;
        }
      });

      var _parseStyleColor = parseStyleColor(s.PrimaryColour),
          _parseStyleColor2 = _slicedToArray(_parseStyleColor, 2),
          a1 = _parseStyleColor2[0],
          c1 = _parseStyleColor2[1];

      var _parseStyleColor3 = parseStyleColor(s.SecondaryColour),
          _parseStyleColor4 = _slicedToArray(_parseStyleColor3, 2),
          a2 = _parseStyleColor4[0],
          c2 = _parseStyleColor4[1];

      var _parseStyleColor5 = parseStyleColor(s.OutlineColour),
          _parseStyleColor6 = _slicedToArray(_parseStyleColor5, 2),
          a3 = _parseStyleColor6[0],
          c3 = _parseStyleColor6[1];

      var _parseStyleColor7 = parseStyleColor(s.BackColour),
          _parseStyleColor8 = _slicedToArray(_parseStyleColor7, 2),
          a4 = _parseStyleColor8[0],
          c4 = _parseStyleColor8[1];

      var tag = {
        fn: s.Fontname,
        fs: s.Fontsize,
        c1,
        a1,
        c2,
        a2,
        c3,
        a3,
        c4,
        a4,
        b: Math.abs(s.Bold),
        i: Math.abs(s.Italic),
        u: Math.abs(s.Underline),
        s: Math.abs(s.StrikeOut),
        fscx: s.ScaleX,
        fscy: s.ScaleY,
        fsp: s.Spacing,
        frz: s.Angle,
        xbord: s.Outline,
        ybord: s.Outline,
        xshad: s.Shadow,
        yshad: s.Shadow,
        fe: s.Encoding,
        q: /^[0-3]$/.test(info.WrapStyle) ? info.WrapStyle * 1 : 2
      };
      result[s.Name] = {
        style: s,
        tag
      };
    };

    for (var i = 0; i < styles.length; i++) {
      _loop(i);
    }

    return result;
  }

  function compile(text) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var tree = parse(text);
    var styles = compileStyles({
      info: tree.info,
      style: tree.styles.style,
      defaultStyle: options.defaultStyle || {}
    });
    return {
      info: tree.info,
      width: tree.info.PlayResX * 1 || null,
      height: tree.info.PlayResY * 1 || null,
      collisions: tree.info.Collisions || 'Normal',
      styles,
      dialogues: compileDialogues({
        styles,
        dialogues: tree.events.dialogue
      })
    };
  }

  var module = {
    exports: {}
  };

  module.exports = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _internalsCreatePropertyDescriptor = module.exports;

  var module$1 = {
    exports: {}
  };

  module$1.exports = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var _internalsIsObject = module$1.exports;

  var module$2 = {
    exports: {}
  };
  var isObject = _internalsIsObject; // `ToPrimitive` abstract operation
  // https://tc39.github.io/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string

  module$2.exports = function (input, PREFERRED_STRING) {
    if (!isObject(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var _internalsToPrimitive = module$2.exports;

  var module$3 = {
    exports: {}
  };
  var isObject$1 = _internalsIsObject;

  module$3.exports = function (it) {
    if (!isObject$1(it)) {
      throw TypeError(String(it) + ' is not an object');
    }

    return it;
  };

  var _internalsAnObject = module$3.exports;

  var module$4 = {
    exports: {}
  };

  var check = function check(it) {
    return it && it.Math == Math && it;
  }; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


  module$4.exports = // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof global == 'object' && global) || // eslint-disable-next-line no-new-func
  Function('return this')();
  var _internalsGlobal = module$4.exports;

  var module$5 = {
    exports: {}
  };
  var global$1 = _internalsGlobal;
  var isObject$2 = _internalsIsObject;
  var document$1 = global$1.document; // typeof document.createElement is 'object' in old IE

  var EXISTS = isObject$2(document$1) && isObject$2(document$1.createElement);

  module$5.exports = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  var _internalsDocumentCreateElement = module$5.exports;

  var module$6 = {
    exports: {}
  };

  module$6.exports = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var _internalsFails = module$6.exports;

  var module$7 = {
    exports: {}
  };
  var fails = _internalsFails; // Thank's IE8 for his funny defineProperty

  module$7.exports = !fails(function () {
    return Object.defineProperty({}, 1, {
      get: function get() {
        return 7;
      }
    })[1] != 7;
  });
  var _internalsDescriptors = module$7.exports;

  var module$8 = {
    exports: {}
  };
  var DESCRIPTORS = _internalsDescriptors;
  var fails$1 = _internalsFails;
  var createElement = _internalsDocumentCreateElement; // Thank's IE8 for his funny defineProperty

  module$8.exports = !DESCRIPTORS && !fails$1(function () {
    return Object.defineProperty(createElement('div'), 'a', {
      get: function get() {
        return 7;
      }
    }).a != 7;
  });
  var _internalsIe8DomDefine = module$8.exports;

  var module$9 = {
    exports: {}
  };
  var exports$1 = module$9.exports;
  var DESCRIPTORS$1 = _internalsDescriptors;
  var IE8_DOM_DEFINE = _internalsIe8DomDefine;
  var anObject = _internalsAnObject;
  var toPrimitive = _internalsToPrimitive;
  var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty

  exports$1.f = DESCRIPTORS$1 ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
      return nativeDefineProperty(O, P, Attributes);
    } catch (error) {
      /* empty */
    }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };
  var _internalsObjectDefineProperty = module$9.exports;

  var module$a = {
    exports: {}
  };
  var DESCRIPTORS$2 = _internalsDescriptors;
  var definePropertyModule = _internalsObjectDefineProperty;
  var createPropertyDescriptor = _internalsCreatePropertyDescriptor;
  module$a.exports = DESCRIPTORS$2 ? function (object, key, value) {
    return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };
  var _internalsCreateNonEnumerableProperty = module$a.exports;

  var module$b = {
    exports: {}
  };
  var hasOwnProperty = {}.hasOwnProperty;

  module$b.exports = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var _internalsHas = module$b.exports;

  var module$c = {
    exports: {}
  };
  var DESCRIPTORS$3 = _internalsDescriptors;
  var fails$2 = _internalsFails;
  var has = _internalsHas;
  var defineProperty = Object.defineProperty;
  var cache = {};

  var thrower = function thrower(it) {
    throw it;
  };

  module$c.exports = function (METHOD_NAME, options) {
    if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
    if (!options) options = {};
    var method = [][METHOD_NAME];
    var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
    var argument0 = has(options, 0) ? options[0] : thrower;
    var argument1 = has(options, 1) ? options[1] : undefined;
    return cache[METHOD_NAME] = !!method && !fails$2(function () {
      if (ACCESSORS && !DESCRIPTORS$3) return true;
      var O = {
        length: -1
      };
      if (ACCESSORS) defineProperty(O, 1, {
        enumerable: true,
        get: thrower
      });else O[1] = 1;
      method.call(O, argument0, argument1);
    });
  };

  var _internalsArrayMethodUsesToLength = module$c.exports;

  var module$d = {
    exports: {}
  };
  var fails$3 = _internalsFails;

  module$d.exports = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails$3(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal
      method.call(null, argument || function () {
        throw 1;
      }, 1);
    });
  };

  var _internalsArrayMethodIsStrict = module$d.exports;

  var module$e = {
    exports: {}
  };
  var fails$4 = _internalsFails;
  module$e.exports = !!Object.getOwnPropertySymbols && !fails$4(function () {
    // Chrome 38 Symbol has incorrect toString conversion
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });
  var _internalsNativeSymbol = module$e.exports;

  var module$f = {
    exports: {}
  };
  var NATIVE_SYMBOL = _internalsNativeSymbol;
  module$f.exports = NATIVE_SYMBOL // eslint-disable-next-line no-undef
  && !Symbol.sham // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';
  var _internalsUseSymbolAsUid = module$f.exports;

  var module$g = {
    exports: {}
  };
  var id = 0;
  var postfix = Math.random();

  module$g.exports = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var _internalsUid = module$g.exports;

  var module$h = {
    exports: {}
  };
  var global$2 = _internalsGlobal;
  var createNonEnumerableProperty = _internalsCreateNonEnumerableProperty;

  module$h.exports = function (key, value) {
    try {
      createNonEnumerableProperty(global$2, key, value);
    } catch (error) {
      global$2[key] = value;
    }

    return value;
  };

  var _internalsSetGlobal = module$h.exports;

  var module$i = {
    exports: {}
  };
  var global$3 = _internalsGlobal;
  var setGlobal = _internalsSetGlobal;
  var SHARED = '__core-js_shared__';
  var store = global$3[SHARED] || setGlobal(SHARED, {});
  module$i.exports = store;
  var _internalsSharedStore = module$i.exports;

  var module$j = {
    exports: {}
  };
  module$j.exports = false;
  var _internalsIsPure = module$j.exports;

  var module$k = {
    exports: {}
  };
  var IS_PURE = _internalsIsPure;
  var store$1 = _internalsSharedStore;
  (module$k.exports = function (key, value) {
    return store$1[key] || (store$1[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.6.5',
    mode: IS_PURE ? 'pure' : 'global',
    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
  });
  var _internalsShared = module$k.exports;

  var module$l = {
    exports: {}
  };
  var global$4 = _internalsGlobal;
  var shared = _internalsShared;
  var has$1 = _internalsHas;
  var uid = _internalsUid;
  var NATIVE_SYMBOL$1 = _internalsNativeSymbol;
  var USE_SYMBOL_AS_UID = _internalsUseSymbolAsUid;
  var WellKnownSymbolsStore = shared('wks');
  var Symbol$1 = global$4.Symbol;
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

  module$l.exports = function (name) {
    if (!has$1(WellKnownSymbolsStore, name)) {
      if (NATIVE_SYMBOL$1 && has$1(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }

    return WellKnownSymbolsStore[name];
  };

  var _internalsWellKnownSymbol = module$l.exports;

  var module$m = {
    exports: {}
  };
  var toString = {}.toString;

  module$m.exports = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var _internalsClassofRaw = module$m.exports;

  var module$n = {
    exports: {}
  };
  var classof = _internalsClassofRaw; // `IsArray` abstract operation
  // https://tc39.github.io/ecma262/#sec-isarray

  module$n.exports = Array.isArray || function isArray(arg) {
    return classof(arg) == 'Array';
  };

  var _internalsIsArray = module$n.exports;

  var module$o = {
    exports: {}
  };
  var isObject$3 = _internalsIsObject;
  var isArray = _internalsIsArray;
  var wellKnownSymbol = _internalsWellKnownSymbol;
  var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate

  module$o.exports = function (originalArray, length) {
    var C;

    if (isArray(originalArray)) {
      C = originalArray.constructor; // cross-realm fallback

      if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject$3(C)) {
        C = C[SPECIES];
        if (C === null) C = undefined;
      }
    }

    return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  var _internalsArraySpeciesCreate = module$o.exports;

  var module$p = {
    exports: {}
  };
  var ceil = Math.ceil;
  var floor = Math.floor; // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger

  module$p.exports = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  var _internalsToInteger = module$p.exports;

  var module$q = {
    exports: {}
  };
  var toInteger = _internalsToInteger;
  var min = Math.min; // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength

  module$q.exports = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var _internalsToLength = module$q.exports;

  var module$r = {
    exports: {}
  };

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  module$r.exports = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  var _internalsRequireObjectCoercible = module$r.exports;

  var module$s = {
    exports: {}
  };
  var requireObjectCoercible = _internalsRequireObjectCoercible; // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject

  module$s.exports = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var _internalsToObject = module$s.exports;

  var module$t = {
    exports: {}
  };
  var fails$5 = _internalsFails;
  var classof$1 = _internalsClassofRaw;
  var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

  module$t.exports = fails$5(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof$1(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;
  var _internalsIndexedObject = module$t.exports;

  var module$u = {
    exports: {}
  };

  module$u.exports = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    }

    return it;
  };

  var _internalsAFunction = module$u.exports;

  var module$v = {
    exports: {}
  };
  var aFunction = _internalsAFunction; // optional / simple context binding

  module$v.exports = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;

    switch (length) {
      case 0:
        return function () {
          return fn.call(that);
        };

      case 1:
        return function (a) {
          return fn.call(that, a);
        };

      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };

      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }

    return function ()
    /* ...args */
    {
      return fn.apply(that, arguments);
    };
  };

  var _internalsFunctionBindContext = module$v.exports;

  var module$w = {
    exports: {}
  };
  var bind = _internalsFunctionBindContext;
  var IndexedObject = _internalsIndexedObject;
  var toObject = _internalsToObject;
  var toLength = _internalsToLength;
  var arraySpeciesCreate = _internalsArraySpeciesCreate;
  var push = [].push; // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation

  var createMethod = function createMethod(TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject($this);
      var self = IndexedObject(O);
      var boundFunction = bind(callbackfn, that, 3);
      var length = toLength(self.length);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate;
      var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
      var value, result;

      for (; length > index; index++) {
        if (NO_HOLES || index in self) {
          value = self[index];
          result = boundFunction(value, index, O);

          if (TYPE) {
            if (IS_MAP) target[index] = result; // map
            else if (result) switch (TYPE) {
                case 3:
                  return true;
                // some

                case 5:
                  return value;
                // find

                case 6:
                  return index;
                // findIndex

                case 2:
                  push.call(target, value);
                // filter
              } else if (IS_EVERY) return false; // every
          }
        }
      }

      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  module$w.exports = {
    // `Array.prototype.forEach` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
    forEach: createMethod(0),
    // `Array.prototype.map` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.map
    map: createMethod(1),
    // `Array.prototype.filter` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.filter
    filter: createMethod(2),
    // `Array.prototype.some` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.some
    some: createMethod(3),
    // `Array.prototype.every` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.every
    every: createMethod(4),
    // `Array.prototype.find` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    find: createMethod(5),
    // `Array.prototype.findIndex` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod(6)
  };
  var _internalsArrayIteration = module$w.exports;

  var module$x = {
    exports: {}
  };
  var $forEach = _internalsArrayIteration.forEach;
  var arrayMethodIsStrict = _internalsArrayMethodIsStrict;
  var arrayMethodUsesToLength = _internalsArrayMethodUsesToLength;
  var STRICT_METHOD = arrayMethodIsStrict('forEach');
  var USES_TO_LENGTH = arrayMethodUsesToLength('forEach'); // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach

  module$x.exports = !STRICT_METHOD || !USES_TO_LENGTH ? function forEach(callbackfn
  /* , thisArg */
  ) {
    return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  } : [].forEach;
  var _internalsArrayForEach = module$x.exports;

  var module$y = {
    exports: {}
  };
  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  module$y.exports = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };
  var _internalsDomIterables = module$y.exports;

  var global$5 = _internalsGlobal;
  var DOMIterables = _internalsDomIterables;
  var forEach = _internalsArrayForEach;
  var createNonEnumerableProperty$1 = _internalsCreateNonEnumerableProperty;

  for (var COLLECTION_NAME in DOMIterables) {
    var Collection = global$5[COLLECTION_NAME];
    var CollectionPrototype = Collection && Collection.prototype; // some Chrome versions have non-configurable methods on DOMTokenList

    if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
      createNonEnumerableProperty$1(CollectionPrototype, 'forEach', forEach);
    } catch (error) {
      CollectionPrototype.forEach = forEach;
    }
  }

  var module$z = {
    exports: {}
  };
  var global$6 = _internalsGlobal;
  module$z.exports = global$6;
  var _internalsPath = module$z.exports;

  var module$A = {
    exports: {}
  };
  var path = _internalsPath;
  var global$7 = _internalsGlobal;

  var aFunction$1 = function aFunction(variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  module$A.exports = function (namespace, method) {
    return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global$7[namespace]) : path[namespace] && path[namespace][method] || global$7[namespace] && global$7[namespace][method];
  };

  var _internalsGetBuiltIn = module$A.exports;

  var module$B = {
    exports: {}
  };
  var getBuiltIn = _internalsGetBuiltIn;
  module$B.exports = getBuiltIn('navigator', 'userAgent') || '';
  var _internalsEngineUserAgent = module$B.exports;

  var module$C = {
    exports: {}
  };
  var global$8 = _internalsGlobal;
  var userAgent = _internalsEngineUserAgent;
  var process = global$8.process;
  var versions = process && process.versions;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    version = match[0] + match[1];
  } else if (userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);

    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  module$C.exports = version && +version;
  var _internalsEngineV8Version = module$C.exports;

  var module$D = {
    exports: {}
  };
  var fails$6 = _internalsFails;
  var wellKnownSymbol$1 = _internalsWellKnownSymbol;
  var V8_VERSION = _internalsEngineV8Version;
  var SPECIES$1 = wellKnownSymbol$1('species');

  module$D.exports = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return V8_VERSION >= 51 || !fails$6(function () {
      var array = [];
      var constructor = array.constructor = {};

      constructor[SPECIES$1] = function () {
        return {
          foo: 1
        };
      };

      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var _internalsArrayMethodHasSpeciesSupport = module$D.exports;

  var module$E = {
    exports: {}
  };
  var toPrimitive$1 = _internalsToPrimitive;
  var definePropertyModule$1 = _internalsObjectDefineProperty;
  var createPropertyDescriptor$1 = _internalsCreatePropertyDescriptor;

  module$E.exports = function (object, key, value) {
    var propertyKey = toPrimitive$1(key);
    if (propertyKey in object) definePropertyModule$1.f(object, propertyKey, createPropertyDescriptor$1(0, value));else object[propertyKey] = value;
  };

  var _internalsCreateProperty = module$E.exports;

  var module$F = {
    exports: {}
  };
  var toInteger$1 = _internalsToInteger;
  var max = Math.max;
  var min$1 = Math.min; // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

  module$F.exports = function (index, length) {
    var integer = toInteger$1(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  var _internalsToAbsoluteIndex = module$F.exports;

  var module$G = {
    exports: {}
  };
  var fails$7 = _internalsFails;
  var replacement = /#|\.prototype\./;

  var isForced = function isForced(feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails$7(detection) : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';
  module$G.exports = isForced;
  var _internalsIsForced = module$G.exports;

  var module$H = {
    exports: {}
  };
  // toObject with fallback for non-array-like ES3 strings
  var IndexedObject$1 = _internalsIndexedObject;
  var requireObjectCoercible$1 = _internalsRequireObjectCoercible;

  module$H.exports = function (it) {
    return IndexedObject$1(requireObjectCoercible$1(it));
  };

  var _internalsToIndexedObject = module$H.exports;

  var module$I = {
    exports: {}
  };
  var exports$2 = module$I.exports;
  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
    1: 2
  }, 1); // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

  exports$2.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;
  var _internalsObjectPropertyIsEnumerable = module$I.exports;

  var module$J = {
    exports: {}
  };
  var exports$3 = module$J.exports;
  var DESCRIPTORS$4 = _internalsDescriptors;
  var propertyIsEnumerableModule = _internalsObjectPropertyIsEnumerable;
  var createPropertyDescriptor$2 = _internalsCreatePropertyDescriptor;
  var toIndexedObject = _internalsToIndexedObject;
  var toPrimitive$2 = _internalsToPrimitive;
  var has$2 = _internalsHas;
  var IE8_DOM_DEFINE$1 = _internalsIe8DomDefine;
  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

  exports$3.f = DESCRIPTORS$4 ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive$2(P, true);
    if (IE8_DOM_DEFINE$1) try {
      return nativeGetOwnPropertyDescriptor(O, P);
    } catch (error) {
      /* empty */
    }
    if (has$2(O, P)) return createPropertyDescriptor$2(!propertyIsEnumerableModule.f.call(O, P), O[P]);
  };
  var _internalsObjectGetOwnPropertyDescriptor = module$J.exports;

  var module$K = {
    exports: {}
  };
  var exports$4 = module$K.exports;
  exports$4.f = Object.getOwnPropertySymbols;
  var _internalsObjectGetOwnPropertySymbols = module$K.exports;

  var module$L = {
    exports: {}
  };
  // IE8- don't enum bug keys
  module$L.exports = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];
  var _internalsEnumBugKeys = module$L.exports;

  var module$M = {
    exports: {}
  };
  module$M.exports = {};
  var _internalsHiddenKeys = module$M.exports;

  var module$N = {
    exports: {}
  };
  var toIndexedObject$1 = _internalsToIndexedObject;
  var toLength$1 = _internalsToLength;
  var toAbsoluteIndex = _internalsToAbsoluteIndex; // `Array.prototype.{ indexOf, includes }` methods implementation

  var createMethod$1 = function createMethod(IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$1($this);
      var length = toLength$1(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value; // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare

      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++]; // eslint-disable-next-line no-self-compare

        if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
      } else for (; length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      }
      return !IS_INCLUDES && -1;
    };
  };

  module$N.exports = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod$1(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$1(false)
  };
  var _internalsArrayIncludes = module$N.exports;

  var module$O = {
    exports: {}
  };
  var has$3 = _internalsHas;
  var toIndexedObject$2 = _internalsToIndexedObject;
  var indexOf = _internalsArrayIncludes.indexOf;
  var hiddenKeys = _internalsHiddenKeys;

  module$O.exports = function (object, names) {
    var O = toIndexedObject$2(object);
    var i = 0;
    var result = [];
    var key;

    for (key in O) {
      !has$3(hiddenKeys, key) && has$3(O, key) && result.push(key);
    } // Don't enum bug & hidden keys


    while (names.length > i) {
      if (has$3(O, key = names[i++])) {
        ~indexOf(result, key) || result.push(key);
      }
    }

    return result;
  };

  var _internalsObjectKeysInternal = module$O.exports;

  var module$P = {
    exports: {}
  };
  var exports$5 = module$P.exports;
  var internalObjectKeys = _internalsObjectKeysInternal;
  var enumBugKeys = _internalsEnumBugKeys;
  var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames

  exports$5.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return internalObjectKeys(O, hiddenKeys$1);
  };
  var _internalsObjectGetOwnPropertyNames = module$P.exports;

  var module$Q = {
    exports: {}
  };
  var getBuiltIn$1 = _internalsGetBuiltIn;
  var getOwnPropertyNamesModule = _internalsObjectGetOwnPropertyNames;
  var getOwnPropertySymbolsModule = _internalsObjectGetOwnPropertySymbols;
  var anObject$1 = _internalsAnObject; // all object keys, includes non-enumerable and symbols

  module$Q.exports = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = getOwnPropertyNamesModule.f(anObject$1(it));
    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var _internalsOwnKeys = module$Q.exports;

  var module$R = {
    exports: {}
  };
  var has$4 = _internalsHas;
  var ownKeys = _internalsOwnKeys;
  var getOwnPropertyDescriptorModule = _internalsObjectGetOwnPropertyDescriptor;
  var definePropertyModule$2 = _internalsObjectDefineProperty;

  module$R.exports = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = definePropertyModule$2.f;
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has$4(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var _internalsCopyConstructorProperties = module$R.exports;

  var module$S = {
    exports: {}
  };
  var shared$1 = _internalsShared;
  var uid$1 = _internalsUid;
  var keys = shared$1('keys');

  module$S.exports = function (key) {
    return keys[key] || (keys[key] = uid$1(key));
  };

  var _internalsSharedKey = module$S.exports;

  var module$T = {
    exports: {}
  };
  var store$2 = _internalsSharedStore;
  var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

  if (typeof store$2.inspectSource != 'function') {
    store$2.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  module$T.exports = store$2.inspectSource;
  var _internalsInspectSource = module$T.exports;

  var module$U = {
    exports: {}
  };
  var global$9 = _internalsGlobal;
  var inspectSource = _internalsInspectSource;
  var WeakMap = global$9.WeakMap;
  module$U.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));
  var _internalsNativeWeakMap = module$U.exports;

  var module$V = {
    exports: {}
  };
  var NATIVE_WEAK_MAP = _internalsNativeWeakMap;
  var global$a = _internalsGlobal;
  var isObject$4 = _internalsIsObject;
  var createNonEnumerableProperty$2 = _internalsCreateNonEnumerableProperty;
  var objectHas = _internalsHas;
  var sharedKey = _internalsSharedKey;
  var hiddenKeys$2 = _internalsHiddenKeys;
  var WeakMap$1 = global$a.WeakMap;
  var set, get, has$5;

  var enforce = function enforce(it) {
    return has$5(it) ? get(it) : set(it, {});
  };

  var getterFor = function getterFor(TYPE) {
    return function (it) {
      var state;

      if (!isObject$4(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      }

      return state;
    };
  };

  if (NATIVE_WEAK_MAP) {
    var store$3 = new WeakMap$1();
    var wmget = store$3.get;
    var wmhas = store$3.has;
    var wmset = store$3.set;

    set = function set(it, metadata) {
      wmset.call(store$3, it, metadata);
      return metadata;
    };

    get = function get(it) {
      return wmget.call(store$3, it) || {};
    };

    has$5 = function has(it) {
      return wmhas.call(store$3, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys$2[STATE] = true;

    set = function set(it, metadata) {
      createNonEnumerableProperty$2(it, STATE, metadata);
      return metadata;
    };

    get = function get(it) {
      return objectHas(it, STATE) ? it[STATE] : {};
    };

    has$5 = function has(it) {
      return objectHas(it, STATE);
    };
  }

  module$V.exports = {
    set: set,
    get: get,
    has: has$5,
    enforce: enforce,
    getterFor: getterFor
  };
  var _internalsInternalState = module$V.exports;

  var module$W = {
    exports: {}
  };
  var global$b = _internalsGlobal;
  var createNonEnumerableProperty$3 = _internalsCreateNonEnumerableProperty;
  var has$6 = _internalsHas;
  var setGlobal$1 = _internalsSetGlobal;
  var inspectSource$1 = _internalsInspectSource;
  var InternalStateModule = _internalsInternalState;
  var getInternalState = InternalStateModule.get;
  var enforceInternalState = InternalStateModule.enforce;
  var TEMPLATE = String(String).split('String');
  (module$W.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;

    if (typeof value == 'function') {
      if (typeof key == 'string' && !has$6(value, 'name')) createNonEnumerableProperty$3(value, 'name', key);
      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }

    if (O === global$b) {
      if (simple) O[key] = value;else setGlobal$1(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }

    if (simple) O[key] = value;else createNonEnumerableProperty$3(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || inspectSource$1(this);
  });
  var _internalsRedefine = module$W.exports;

  var module$X = {
    exports: {}
  };
  var global$c = _internalsGlobal;
  var getOwnPropertyDescriptor$1 = _internalsObjectGetOwnPropertyDescriptor.f;
  var createNonEnumerableProperty$4 = _internalsCreateNonEnumerableProperty;
  var redefine = _internalsRedefine;
  var setGlobal$2 = _internalsSetGlobal;
  var copyConstructorProperties = _internalsCopyConstructorProperties;
  var isForced$1 = _internalsIsForced;
  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */

  module$X.exports = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;

    if (GLOBAL) {
      target = global$c;
    } else if (STATIC) {
      target = global$c[TARGET] || setGlobal$2(TARGET, {});
    } else {
      target = (global$c[TARGET] || {}).prototype;
    }

    if (target) for (key in source) {
      sourceProperty = source[key];

      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];

      FORCED = isForced$1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      } // add a flag to not completely full polyfills


      if (options.sham || targetProperty && targetProperty.sham) {
        createNonEnumerableProperty$4(sourceProperty, 'sham', true);
      } // extend global


      redefine(target, key, sourceProperty, options);
    }
  };

  var _internalsExport = module$X.exports;

  var $ = _internalsExport;
  var toAbsoluteIndex$1 = _internalsToAbsoluteIndex;
  var toInteger$2 = _internalsToInteger;
  var toLength$2 = _internalsToLength;
  var toObject$1 = _internalsToObject;
  var arraySpeciesCreate$1 = _internalsArraySpeciesCreate;
  var createProperty = _internalsCreateProperty;
  var arrayMethodHasSpeciesSupport = _internalsArrayMethodHasSpeciesSupport;
  var arrayMethodUsesToLength$1 = _internalsArrayMethodUsesToLength;
  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
  var USES_TO_LENGTH$1 = arrayMethodUsesToLength$1('splice', {
    ACCESSORS: true,
    0: 0,
    1: 2
  });
  var max$1 = Math.max;
  var min$2 = Math.min;
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.splice
  // with adding support of @@species

  $({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1
  }, {
    splice: function splice(start, deleteCount
    /* , ...items */
    ) {
      var O = toObject$1(this);
      var len = toLength$2(O.length);
      var actualStart = toAbsoluteIndex$1(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from, to;

      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min$2(max$1(toInteger$2(deleteCount), 0), len - actualStart);
      }

      if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
        throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
      }

      A = arraySpeciesCreate$1(O, actualDeleteCount);

      for (k = 0; k < actualDeleteCount; k++) {
        from = actualStart + k;
        if (from in O) createProperty(A, k, O[from]);
      }

      A.length = actualDeleteCount;

      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from = k + actualDeleteCount;
          to = k + insertCount;
          if (from in O) O[to] = O[from];else delete O[to];
        }

        for (k = len; k > len - actualDeleteCount + insertCount; k--) {
          delete O[k - 1];
        }
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];else delete O[to];
        }
      }

      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }

      O.length = len - actualDeleteCount + insertCount;
      return A;
    }
  });

  var $$1 = _internalsExport;
  var fails$8 = _internalsFails;
  var isArray$1 = _internalsIsArray;
  var isObject$5 = _internalsIsObject;
  var toObject$2 = _internalsToObject;
  var toLength$3 = _internalsToLength;
  var createProperty$1 = _internalsCreateProperty;
  var arraySpeciesCreate$2 = _internalsArraySpeciesCreate;
  var arrayMethodHasSpeciesSupport$1 = _internalsArrayMethodHasSpeciesSupport;
  var wellKnownSymbol$2 = _internalsWellKnownSymbol;
  var V8_VERSION$1 = _internalsEngineV8Version;
  var IS_CONCAT_SPREADABLE = wellKnownSymbol$2('isConcatSpreadable');
  var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded'; // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679

  var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION$1 >= 51 || !fails$8(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });
  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$1('concat');

  var isConcatSpreadable = function isConcatSpreadable(O) {
    if (!isObject$5(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray$1(O);
  };

  var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species

  $$1({
    target: 'Array',
    proto: true,
    forced: FORCED
  }, {
    concat: function concat(arg) {
      // eslint-disable-line no-unused-vars
      var O = toObject$2(this);
      var A = arraySpeciesCreate$2(O, 0);
      var n = 0;
      var i, k, length, len, E;

      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];

        if (isConcatSpreadable(E)) {
          len = toLength$3(E.length);
          if (n + len > MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

          for (k = 0; k < len; k++, n++) {
            if (k in E) createProperty$1(A, n, E[k]);
          }
        } else {
          if (n >= MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty$1(A, n++, E);
        }
      }

      A.length = n;
      return A;
    }
  });

  var $$2 = _internalsExport;
  var $map = _internalsArrayIteration.map;
  var arrayMethodHasSpeciesSupport$2 = _internalsArrayMethodHasSpeciesSupport;
  var arrayMethodUsesToLength$2 = _internalsArrayMethodUsesToLength;
  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$2('map'); // FF49- issue

  var USES_TO_LENGTH$2 = arrayMethodUsesToLength$2('map'); // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // with adding support of @@species

  $$2({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$2
  }, {
    map: function map(callbackfn
    /* , thisArg */
    ) {
      return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var module$Y = {
    exports: {}
  };
  var wellKnownSymbol$3 = _internalsWellKnownSymbol;
  var TO_STRING_TAG = wellKnownSymbol$3('toStringTag');
  var test = {};
  test[TO_STRING_TAG] = 'z';
  module$Y.exports = String(test) === '[object z]';
  var _internalsToStringTagSupport = module$Y.exports;

  var module$Z = {
    exports: {}
  };
  var TO_STRING_TAG_SUPPORT = _internalsToStringTagSupport;
  var classofRaw = _internalsClassofRaw;
  var wellKnownSymbol$4 = _internalsWellKnownSymbol;
  var TO_STRING_TAG$1 = wellKnownSymbol$4('toStringTag'); // ES3 wrong here

  var CORRECT_ARGUMENTS = classofRaw(function () {
    return arguments;
  }()) == 'Arguments'; // fallback for IE11 Script Access Denied error

  var tryGet = function tryGet(it, key) {
    try {
      return it[key];
    } catch (error) {
      /* empty */
    }
  }; // getting tag from ES6+ `Object.prototype.toString`


  module$Z.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };
  var _internalsClassof = module$Z.exports;

  var module$_ = {
    exports: {}
  };
  var TO_STRING_TAG_SUPPORT$1 = _internalsToStringTagSupport;
  var classof$2 = _internalsClassof; // `Object.prototype.toString` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring

  module$_.exports = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
    return '[object ' + classof$2(this) + ']';
  };
  var _internalsObjectToString = module$_.exports;

  var TO_STRING_TAG_SUPPORT$2 = _internalsToStringTagSupport;
  var redefine$1 = _internalsRedefine;
  var toString$1 = _internalsObjectToString; // `Object.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring

  if (!TO_STRING_TAG_SUPPORT$2) {
    redefine$1(Object.prototype, 'toString', toString$1, {
      unsafe: true
    });
  }

  var module$$ = {
    exports: {}
  };
  var exports$6 = module$$.exports;
  var fails$9 = _internalsFails; // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
  // so we use an intermediate function.

  function RE(s, f) {
    return RegExp(s, f);
  }

  exports$6.UNSUPPORTED_Y = fails$9(function () {
    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    var re = RE('a', 'y');
    re.lastIndex = 2;
    return re.exec('abcd') != null;
  });
  exports$6.BROKEN_CARET = fails$9(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = RE('^r', 'gy');
    re.lastIndex = 2;
    return re.exec('str') != null;
  });
  var _regexpStickyHelpers = module$$.exports;

  var module$10 = {
    exports: {}
  };
  var anObject$2 = _internalsAnObject; // `RegExp.prototype.flags` getter implementation
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags

  module$10.exports = function () {
    var that = anObject$2(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.dotAll) result += 's';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  var _internalsRegexpFlags = module$10.exports;

  var module$11 = {
    exports: {}
  };
  var regexpFlags = _internalsRegexpFlags;
  var stickyHelpers = _regexpStickyHelpers;
  var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.

  var nativeReplace = String.prototype.replace;
  var patchedExec = nativeExec;

  var UPDATES_LAST_INDEX_WRONG = function () {
    var re1 = /a/;
    var re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  }();

  var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET; // nonparticipating capturing group, copied from es5-shim's String#split patch.

  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;
      var sticky = UNSUPPORTED_Y && re.sticky;
      var flags = regexpFlags.call(re);
      var source = re.source;
      var charsAdded = 0;
      var strCopy = str;

      if (sticky) {
        flags = flags.replace('y', '');

        if (flags.indexOf('g') === -1) {
          flags += 'g';
        }

        strCopy = String(str).slice(re.lastIndex); // Support anchored sticky behavior.

        if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
          source = '(?: ' + source + ')';
          strCopy = ' ' + strCopy;
          charsAdded++;
        } // ^(? + rx + ) is needed, in combination with some str slicing, to
        // simulate the 'y' flag.


        reCopy = new RegExp('^(?:' + source + ')', flags);
      }

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
      }

      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
      match = nativeExec.call(sticky ? reCopy : re, strCopy);

      if (sticky) {
        if (match) {
          match.input = match.input.slice(charsAdded);
          match[0] = match[0].slice(charsAdded);
          match.index = re.lastIndex;
          re.lastIndex += match[0].length;
        } else re.lastIndex = 0;
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }

      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  module$11.exports = patchedExec;
  var _internalsRegexpExec = module$11.exports;

  var $$3 = _internalsExport;
  var exec = _internalsRegexpExec;
  $$3({
    target: 'RegExp',
    proto: true,
    forced: /./.exec !== exec
  }, {
    exec: exec
  });

  var redefine$2 = _internalsRedefine;
  var anObject$3 = _internalsAnObject;
  var fails$a = _internalsFails;
  var flags = _internalsRegexpFlags;
  var TO_STRING = 'toString';
  var RegExpPrototype = RegExp.prototype;
  var nativeToString = RegExpPrototype[TO_STRING];
  var NOT_GENERIC = fails$a(function () {
    return nativeToString.call({
      source: 'a',
      flags: 'b'
    }) != '/a/b';
  }); // FF44- RegExp#toString has a wrong name

  var INCORRECT_NAME = nativeToString.name != TO_STRING; // `RegExp.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring

  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine$2(RegExp.prototype, TO_STRING, function toString() {
      var R = anObject$3(this);
      var p = String(R.source);
      var rf = R.flags;
      var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
      return '/' + p + '/' + f;
    }, {
      unsafe: true
    });
  }

  var module$12 = {
    exports: {}
  };
  var classof$3 = _internalsClassofRaw;
  var regexpExec = _internalsRegexpExec; // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec

  module$12.exports = function (R, S) {
    var exec = R.exec;

    if (typeof exec === 'function') {
      var result = exec.call(R, S);

      if (typeof result !== 'object') {
        throw TypeError('RegExp exec method returned something other than an Object or null');
      }

      return result;
    }

    if (classof$3(R) !== 'RegExp') {
      throw TypeError('RegExp#exec called on incompatible receiver');
    }

    return regexpExec.call(R, S);
  };

  var _internalsRegexpExecAbstract = module$12.exports;

  var module$13 = {
    exports: {}
  };
  var toInteger$3 = _internalsToInteger;
  var requireObjectCoercible$2 = _internalsRequireObjectCoercible; // `String.prototype.{ codePointAt, at }` methods implementation

  var createMethod$2 = function createMethod(CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible$2($this));
      var position = toInteger$3(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  module$13.exports = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$2(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$2(true)
  };
  var _internalsStringMultibyte = module$13.exports;

  var module$14 = {
    exports: {}
  };
  var charAt = _internalsStringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex

  module$14.exports = function (S, index, unicode) {
    return index + (unicode ? charAt(S, index).length : 1);
  };

  var _internalsAdvanceStringIndex = module$14.exports;

  var module$15 = {
    exports: {}
  };
  var redefine$3 = _internalsRedefine;
  var fails$b = _internalsFails;
  var wellKnownSymbol$5 = _internalsWellKnownSymbol;
  var regexpExec$1 = _internalsRegexpExec;
  var createNonEnumerableProperty$5 = _internalsCreateNonEnumerableProperty;
  var SPECIES$2 = wellKnownSymbol$5('species');
  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$b(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;

    re.exec = function () {
      var result = [];
      result.groups = {
        a: '7'
      };
      return result;
    };

    return ''.replace(re, '$<a>') !== '7';
  }); // IE <= 11 replaces $0 with the whole match, as if it was $&
  // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0

  var REPLACE_KEEPS_$0 = function () {
    return 'a'.replace(/./, '$0') === '$0';
  }();

  var REPLACE = wellKnownSymbol$5('replace'); // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string

  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
    if (/./[REPLACE]) {
      return /./[REPLACE]('a', '$0') === '';
    }

    return false;
  }(); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper


  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$b(function () {
    var re = /(?:)/;
    var originalExec = re.exec;

    re.exec = function () {
      return originalExec.apply(this, arguments);
    };

    var result = 'ab'.split(re);
    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
  });

  module$15.exports = function (KEY, length, exec, sham) {
    var SYMBOL = wellKnownSymbol$5(KEY);
    var DELEGATES_TO_SYMBOL = !fails$b(function () {
      // String methods call symbol-named RegEp methods
      var O = {};

      O[SYMBOL] = function () {
        return 7;
      };

      return ''[KEY](O) != 7;
    });
    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$b(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;

      if (KEY === 'split') {
        // We can't use real regex here since it causes deoptimization
        // and serious performance degradation in V8
        // https://github.com/zloirock/core-js/issues/306
        re = {}; // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.

        re.constructor = {};

        re.constructor[SPECIES$2] = function () {
          return re;
        };

        re.flags = '';
        re[SYMBOL] = /./[SYMBOL];
      }

      re.exec = function () {
        execCalled = true;
        return null;
      };

      re[SYMBOL]('');
      return !execCalled;
    });

    if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE) || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
      var nativeRegExpMethod = /./[SYMBOL];
      var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec$1) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return {
              done: true,
              value: nativeRegExpMethod.call(regexp, str, arg2)
            };
          }

          return {
            done: true,
            value: nativeMethod.call(str, regexp, arg2)
          };
        }

        return {
          done: false
        };
      }, {
        REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
        REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
      });
      var stringMethod = methods[0];
      var regexMethod = methods[1];
      redefine$3(String.prototype, KEY, stringMethod);
      redefine$3(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) {
        return regexMethod.call(string, this, arg);
      } // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) {
        return regexMethod.call(string, this);
      });
    }

    if (sham) createNonEnumerableProperty$5(RegExp.prototype[SYMBOL], 'sham', true);
  };

  var _internalsFixRegexpWellKnownSymbolLogic = module$15.exports;

  var fixRegExpWellKnownSymbolLogic = _internalsFixRegexpWellKnownSymbolLogic;
  var anObject$4 = _internalsAnObject;
  var toLength$4 = _internalsToLength;
  var requireObjectCoercible$3 = _internalsRequireObjectCoercible;
  var advanceStringIndex = _internalsAdvanceStringIndex;
  var regExpExec = _internalsRegexpExecAbstract; // @@match logic

  fixRegExpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
    return [// `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible$3(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    }, // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;
      var rx = anObject$4(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;

      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength$4(rx.lastIndex), fullUnicode);
        n++;
      }

      return n === 0 ? null : A;
    }];
  });

  var fixRegExpWellKnownSymbolLogic$1 = _internalsFixRegexpWellKnownSymbolLogic;
  var anObject$5 = _internalsAnObject;
  var toObject$3 = _internalsToObject;
  var toLength$5 = _internalsToLength;
  var toInteger$4 = _internalsToInteger;
  var requireObjectCoercible$4 = _internalsRequireObjectCoercible;
  var advanceStringIndex$1 = _internalsAdvanceStringIndex;
  var regExpExec$1 = _internalsRegexpExecAbstract;
  var max$2 = Math.max;
  var min$3 = Math.min;
  var floor$1 = Math.floor;
  var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

  var maybeToString = function maybeToString(it) {
    return it === undefined ? it : String(it);
  }; // @@replace logic


  fixRegExpWellKnownSymbolLogic$1('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
    var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
    var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
    return [// `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible$4(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined ? replacer.call(searchValue, O, replaceValue) : nativeReplace.call(String(O), searchValue, replaceValue);
    }, // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0 || typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject$5(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;

      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }

      var results = [];

      while (true) {
        var result = regExpExec$1(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex$1(S, toLength$5(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;

      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max$2(min$3(toInteger$4(result.index), S.length), 0);
        var captures = []; // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

        for (var j = 1; j < result.length; j++) {
          captures.push(maybeToString(result[j]));
        }

        var namedCaptures = result.groups;

        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }

        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }

      return accumulatedResult + S.slice(nextSourcePosition);
    }]; // https://tc39.github.io/ecma262/#sec-getsubstitution

    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

      if (namedCaptures !== undefined) {
        namedCaptures = toObject$3(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }

      return nativeReplace.call(replacement, symbols, function (match, ch) {
        var capture;

        switch (ch.charAt(0)) {
          case '$':
            return '$';

          case '&':
            return matched;

          case '`':
            return str.slice(0, position);

          case "'":
            return str.slice(tailPos);

          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;

          default:
            // \d\d?
            var n = +ch;
            if (n === 0) return match;

            if (n > m) {
              var f = floor$1(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }

            capture = captures[n - 1];
        }

        return capture === undefined ? '' : capture;
      });
    }
  });

  function alpha2opacity(a) {
    return 1 - "0x".concat(a) / 255;
  }
  function color2rgba(c) {
    var t = c.match(/(\w\w)(\w\w)(\w\w)(\w\w)/);
    var a = alpha2opacity(t[1]);
    var b = +"0x".concat(t[2]);
    var g = +"0x".concat(t[3]);
    var r = +"0x".concat(t[4]);
    return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(a, ")");
  }
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
  function createSVGEl(name) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var $el = document.createElementNS('http://www.w3.org/2000/svg', name);

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      $el.setAttributeNS(attr[0] === 'xlink:href' ? 'http://www.w3.org/1999/xlink' : null, attr[0], attr[1]);
    }

    return $el;
  }

  function getVendor(prop) {
    var style = document.body.style;
    var Prop = prop.replace(/^\w/, function (x) {
      return x.toUpperCase();
    });
    if (prop in style) return '';
    if ("webkit".concat(Prop) in style) return '-webkit-';
    if ("moz".concat(Prop) in style) return '-moz-';
    return '';
  }

  var vendor = {
    clipPath: getVendor('clipPath')
  };
  function getStyleRoot(container) {
    var rootNode = container.getRootNode ? container.getRootNode() : document;
    return rootNode === document ? rootNode.head : rootNode;
  }
  var transformTags = ['fscx', 'fscy', 'frx', 'fry', 'frz', 'fax', 'fay'];
  function initAnimation($el, keyframes, options) {
    var animation = $el.animate(keyframes, options);
    animation.pause();
    return animation;
  }
  function batchAnimate($el, action) {
    // https://caniuse.com/#feat=mdn-api_element_getanimations
    // const animations = $el.getAnimations({ subtree: true });
    $el.animations.forEach(function (animation) {
      animation[action]();
    });
  }

  function createClipPath(clip) {
    var sw = this._.scriptRes.width;
    var sh = this._.scriptRes.height;
    var d = '';

    if (clip.dots !== null) {
      var _clip$dots = clip.dots,
          x1 = _clip$dots.x1,
          y1 = _clip$dots.y1,
          x2 = _clip$dots.x2,
          y2 = _clip$dots.y2;
      x1 /= sw;
      y1 /= sh;
      x2 /= sw;
      y2 /= sh;
      d = "M".concat(x1, ",").concat(y1, "L").concat(x1, ",").concat(y2, ",").concat(x2, ",").concat(y2, ",").concat(x2, ",").concat(y1, "Z");
    }

    if (clip.drawing !== null) {
      d = clip.drawing.instructions.map(function (_ref) {
        var type = _ref.type,
            points = _ref.points;
        return type + points.map(function (_ref2) {
          var x = _ref2.x,
              y = _ref2.y;
          return "".concat(x / sw, ",").concat(y / sh);
        }).join(',');
      }).join('');
    }

    var scale = 1 / (1 << clip.scale - 1);

    if (clip.inverse) {
      d += "M0,0L0,".concat(scale, ",").concat(scale, ",").concat(scale, ",").concat(scale, ",0,0,0Z");
    }

    var id = "ASS-".concat(uuid());
    var $clipPath = createSVGEl('clipPath', [['id', id], ['clipPathUnits', 'objectBoundingBox']]);
    $clipPath.appendChild(createSVGEl('path', [['d', d], ['transform', "scale(".concat(scale, ")")], ['clip-rule', 'evenodd']]));

    this._.$defs.appendChild($clipPath);

    return {
      $clipPath,
      cssText: "".concat(vendor.clipPath, "clip-path:url(#").concat(id, ");")
    };
  }
  function setClipPath(dialogue) {
    if (!dialogue.clip) {
      return;
    }

    var $fobb = document.createElement('div');

    this._.$stage.insertBefore($fobb, dialogue.$div);

    $fobb.appendChild(dialogue.$div);
    $fobb.className = 'ASS-fix-objectBoundingBox';

    var _createClipPath$call = createClipPath.call(this, dialogue.clip),
        cssText = _createClipPath$call.cssText,
        $clipPath = _createClipPath$call.$clipPath;

    this._.$defs.appendChild($clipPath);

    $fobb.style.cssText = cssText;
    assign(dialogue, {
      $div: $fobb,
      $clipPath
    });
  }

  var module$16 = {
    exports: {}
  };
  var anObject$6 = _internalsAnObject;
  var aFunction$2 = _internalsAFunction;
  var wellKnownSymbol$6 = _internalsWellKnownSymbol;
  var SPECIES$3 = wellKnownSymbol$6('species'); // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor

  module$16.exports = function (O, defaultConstructor) {
    var C = anObject$6(O).constructor;
    var S;
    return C === undefined || (S = anObject$6(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction$2(S);
  };

  var _internalsSpeciesConstructor = module$16.exports;

  var module$17 = {
    exports: {}
  };
  var isObject$6 = _internalsIsObject;
  var classof$4 = _internalsClassofRaw;
  var wellKnownSymbol$7 = _internalsWellKnownSymbol;
  var MATCH = wellKnownSymbol$7('match'); // `IsRegExp` abstract operation
  // https://tc39.github.io/ecma262/#sec-isregexp

  module$17.exports = function (it) {
    var isRegExp;
    return isObject$6(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof$4(it) == 'RegExp');
  };

  var _internalsIsRegexp = module$17.exports;

  var fixRegExpWellKnownSymbolLogic$2 = _internalsFixRegexpWellKnownSymbolLogic;
  var isRegExp = _internalsIsRegexp;
  var anObject$7 = _internalsAnObject;
  var requireObjectCoercible$5 = _internalsRequireObjectCoercible;
  var speciesConstructor = _internalsSpeciesConstructor;
  var advanceStringIndex$2 = _internalsAdvanceStringIndex;
  var toLength$6 = _internalsToLength;
  var callRegExpExec = _internalsRegexpExecAbstract;
  var regexpExec$2 = _internalsRegexpExec;
  var fails$c = _internalsFails;
  var arrayPush = [].push;
  var min$4 = Math.min;
  var MAX_UINT32 = 0xFFFFFFFF; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

  var SUPPORTS_Y = !fails$c(function () {
    return !RegExp(MAX_UINT32, 'y');
  }); // @@split logic

  fixRegExpWellKnownSymbolLogic$2('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit;

    if ('abbc'.split(/(b)*/)[1] == 'c' || 'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function internalSplit(separator, limit) {
        var string = String(requireObjectCoercible$5(this));
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

        if (!isRegExp(separator)) {
          return nativeSplit.call(string, separator, lim);
        }

        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
        var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;

        while (match = regexpExec$2.call(separatorCopy, string)) {
          lastIndex = separatorCopy.lastIndex;

          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }

          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }

        if (lastLastIndex === string.length) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));

        return output.length > lim ? output.slice(0, lim) : output;
      }; // Chakra, V8

    } else if ('0'.split(undefined, 0).length) {
      internalSplit = function internalSplit(separator, limit) {
        return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
      };
    } else internalSplit = nativeSplit;

    return [// `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible$5(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
    }, // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;
      var rx = anObject$7(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);
      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.

      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];

      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;

        if (z === null || (e = min$4(toLength$6(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
          q = advanceStringIndex$2(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;

          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }

          q = p = e;
        }
      }

      A.push(S.slice(p));
      return A;
    }];
  }, !SUPPORTS_Y);

  var $$4 = _internalsExport;
  var $filter = _internalsArrayIteration.filter;
  var arrayMethodHasSpeciesSupport$3 = _internalsArrayMethodHasSpeciesSupport;
  var arrayMethodUsesToLength$3 = _internalsArrayMethodUsesToLength;
  var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$3('filter'); // Edge 14- issue

  var USES_TO_LENGTH$3 = arrayMethodUsesToLength$3('filter'); // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // with adding support of @@species

  $$4({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$3
  }, {
    filter: function filter(callbackfn
    /* , thisArg */
    ) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var module$18 = {
    exports: {}
  };
  var isArray$2 = _internalsIsArray;
  var toLength$7 = _internalsToLength;
  var bind$1 = _internalsFunctionBindContext; // `FlattenIntoArray` abstract operation
  // https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray

  var flattenIntoArray = function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
    var targetIndex = start;
    var sourceIndex = 0;
    var mapFn = mapper ? bind$1(mapper, thisArg, 3) : false;
    var element;

    while (sourceIndex < sourceLen) {
      if (sourceIndex in source) {
        element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

        if (depth > 0 && isArray$2(element)) {
          targetIndex = flattenIntoArray(target, original, element, toLength$7(element.length), targetIndex, depth - 1) - 1;
        } else {
          if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
          target[targetIndex] = element;
        }

        targetIndex++;
      }

      sourceIndex++;
    }

    return targetIndex;
  };

  module$18.exports = flattenIntoArray;
  var _internalsFlattenIntoArray = module$18.exports;

  var $$5 = _internalsExport;
  var flattenIntoArray$1 = _internalsFlattenIntoArray;
  var toObject$4 = _internalsToObject;
  var toLength$8 = _internalsToLength;
  var toInteger$5 = _internalsToInteger;
  var arraySpeciesCreate$3 = _internalsArraySpeciesCreate; // `Array.prototype.flat` method
  // https://github.com/tc39/proposal-flatMap

  $$5({
    target: 'Array',
    proto: true
  }, {
    flat: function flat()
    /* depthArg = 1 */
    {
      var depthArg = arguments.length ? arguments[0] : undefined;
      var O = toObject$4(this);
      var sourceLen = toLength$8(O.length);
      var A = arraySpeciesCreate$3(O, 0);
      A.length = flattenIntoArray$1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger$5(depthArg));
      return A;
    }
  });

  var module$19 = {
    exports: {}
  };
  var getBuiltIn$2 = _internalsGetBuiltIn;
  module$19.exports = getBuiltIn$2('document', 'documentElement');
  var _internalsHtml = module$19.exports;

  var module$1a = {
    exports: {}
  };
  var internalObjectKeys$1 = _internalsObjectKeysInternal;
  var enumBugKeys$1 = _internalsEnumBugKeys; // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys

  module$1a.exports = Object.keys || function keys(O) {
    return internalObjectKeys$1(O, enumBugKeys$1);
  };

  var _internalsObjectKeys = module$1a.exports;

  var module$1b = {
    exports: {}
  };
  var DESCRIPTORS$5 = _internalsDescriptors;
  var definePropertyModule$3 = _internalsObjectDefineProperty;
  var anObject$8 = _internalsAnObject;
  var objectKeys = _internalsObjectKeys; // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties

  module$1b.exports = DESCRIPTORS$5 ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$8(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;

    while (length > index) {
      definePropertyModule$3.f(O, key = keys[index++], Properties[key]);
    }

    return O;
  };
  var _internalsObjectDefineProperties = module$1b.exports;

  var module$1c = {
    exports: {}
  };
  var anObject$9 = _internalsAnObject;
  var defineProperties = _internalsObjectDefineProperties;
  var enumBugKeys$2 = _internalsEnumBugKeys;
  var hiddenKeys$3 = _internalsHiddenKeys;
  var html = _internalsHtml;
  var documentCreateElement = _internalsDocumentCreateElement;
  var sharedKey$1 = _internalsSharedKey;
  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO = sharedKey$1('IE_PROTO');

  var EmptyConstructor = function EmptyConstructor() {
    /* empty */
  };

  var scriptTag = function scriptTag(content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  }; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


  var NullProtoObjectViaActiveX = function NullProtoObjectViaActiveX(activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak

    return temp;
  }; // Create object with fake `null` prototype: use iframe Object with cleared prototype


  var NullProtoObjectViaIFrame = function NullProtoObjectViaIFrame() {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  }; // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug


  var activeXDocument;

  var _NullProtoObject = function NullProtoObject() {
    try {
      /* global ActiveXObject */
      activeXDocument = document.domain && new ActiveXObject('htmlfile');
    } catch (error) {
      /* ignore */
    }

    _NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
    var length = enumBugKeys$2.length;

    while (length--) {
      delete _NullProtoObject[PROTOTYPE][enumBugKeys$2[length]];
    }

    return _NullProtoObject();
  };

  hiddenKeys$3[IE_PROTO] = true; // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create

  module$1c.exports = Object.create || function create(O, Properties) {
    var result;

    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject$9(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

      result[IE_PROTO] = O;
    } else result = _NullProtoObject();

    return Properties === undefined ? result : defineProperties(result, Properties);
  };

  var _internalsObjectCreate = module$1c.exports;

  var module$1d = {
    exports: {}
  };
  var wellKnownSymbol$8 = _internalsWellKnownSymbol;
  var create = _internalsObjectCreate;
  var definePropertyModule$4 = _internalsObjectDefineProperty;
  var UNSCOPABLES = wellKnownSymbol$8('unscopables');
  var ArrayPrototype = Array.prototype; // Array.prototype[@@unscopables]
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

  if (ArrayPrototype[UNSCOPABLES] == undefined) {
    definePropertyModule$4.f(ArrayPrototype, UNSCOPABLES, {
      configurable: true,
      value: create(null)
    });
  } // add a key to Array.prototype[@@unscopables]


  module$1d.exports = function (key) {
    ArrayPrototype[UNSCOPABLES][key] = true;
  };

  var _internalsAddToUnscopables = module$1d.exports;

  // this method was added to unscopables after implementation
  // in popular engines, so it's moved to a separate module
  var addToUnscopables = _internalsAddToUnscopables;
  addToUnscopables('flat');

  function createSVGStroke(tag, id, scale) {
    var hasBorder = tag.xbord || tag.ybord;
    var hasShadow = tag.xshad || tag.yshad;
    var isOpaque = tag.a1 !== 'FF';
    var blur = tag.blur || tag.be || 0;
    var $filter = createSVGEl('filter', [['id', id]]);
    $filter.appendChild(createSVGEl('feGaussianBlur', [['stdDeviation', hasBorder ? 0 : blur], ['in', 'SourceGraphic'], ['result', 'sg_b']]));
    $filter.appendChild(createSVGEl('feFlood', [['flood-color', color2rgba(tag.a1 + tag.c1)], ['result', 'c1']]));
    $filter.appendChild(createSVGEl('feComposite', [['operator', 'in'], ['in', 'c1'], ['in2', 'sg_b'], ['result', 'main']]));

    if (hasBorder) {
      $filter.appendChild(createSVGEl('feMorphology', [['radius', "".concat(tag.xbord * scale, " ").concat(tag.ybord * scale)], ['operator', 'dilate'], ['in', 'SourceGraphic'], ['result', 'dil']]));
      $filter.appendChild(createSVGEl('feGaussianBlur', [['stdDeviation', blur], ['in', 'dil'], ['result', 'dil_b']]));
      $filter.appendChild(createSVGEl('feComposite', [['operator', 'out'], ['in', 'dil_b'], ['in2', 'SourceGraphic'], ['result', 'dil_b_o']]));
      $filter.appendChild(createSVGEl('feFlood', [['flood-color', color2rgba(tag.a3 + tag.c3)], ['result', 'c3']]));
      $filter.appendChild(createSVGEl('feComposite', [['operator', 'in'], ['in', 'c3'], ['in2', 'dil_b_o'], ['result', 'border']]));
    }

    if (hasShadow && (hasBorder || isOpaque)) {
      $filter.appendChild(createSVGEl('feOffset', [['dx', tag.xshad * scale], ['dy', tag.yshad * scale], ['in', hasBorder ? 'dil' : 'SourceGraphic'], ['result', 'off']]));
      $filter.appendChild(createSVGEl('feGaussianBlur', [['stdDeviation', blur], ['in', 'off'], ['result', 'off_b']]));

      if (!isOpaque) {
        $filter.appendChild(createSVGEl('feOffset', [['dx', tag.xshad * scale], ['dy', tag.yshad * scale], ['in', 'SourceGraphic'], ['result', 'sg_off']]));
        $filter.appendChild(createSVGEl('feComposite', [['operator', 'out'], ['in', 'off_b'], ['in2', 'sg_off'], ['result', 'off_b_o']]));
      }

      $filter.appendChild(createSVGEl('feFlood', [['flood-color', color2rgba(tag.a4 + tag.c4)], ['result', 'c4']]));
      $filter.appendChild(createSVGEl('feComposite', [['operator', 'in'], ['in', 'c4'], ['in2', isOpaque ? 'off_b' : 'off_b_o'], ['result', 'shadow']]));
    }

    var $merge = createSVGEl('feMerge', []);

    if (hasShadow && (hasBorder || isOpaque)) {
      $merge.appendChild(createSVGEl('feMergeNode', [['in', 'shadow']]));
    }

    if (hasBorder) {
      $merge.appendChild(createSVGEl('feMergeNode', [['in', 'border']]));
    }

    $merge.appendChild(createSVGEl('feMergeNode', [['in', 'main']]));
    $filter.appendChild($merge);
    return $filter;
  }

  function get4QuadrantPoints(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    return [[0, 0], [0, 1], [1, 0], [1, 1]].filter(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          i = _ref4[0],
          j = _ref4[1];

      return (i || x) && (j || y);
    }).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          i = _ref6[0],
          j = _ref6[1];

      return [(i || -1) * x, (j || -1) * y];
    });
  }

  function getOffsets(x, y) {
    if (x === y) return [];
    var nx = Math.min(x, y);
    var ny = Math.max(x, y); // const offsets = [[nx, ny]];
    // for (let i = 0; i < nx; i++) {
    //   for (let j = Math.round(nx + 0.5); j < ny; j++) {
    //     offsets.push([i, j]);
    //   }
    // }
    // return [].concat(...offsets.map(get4QuadrantPoints));

    return Array.from({
      length: Math.ceil(ny) - 1
    }, function (_, i) {
      return i + 1;
    }).concat(ny).map(function (n) {
      return [(ny - n) / ny * nx, n];
    }).map(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          i = _ref8[0],
          j = _ref8[1];

      return x > y ? [j, i] : [i, j];
    }).map(get4QuadrantPoints).flat();
  }

  function createCSSStroke(tag, scale) {
    var bc = color2rgba("00".concat(tag.c3));
    var bx = tag.xbord * scale;
    var by = tag.ybord * scale;
    var sc = color2rgba("00".concat(tag.c4));
    var sx = tag.xshad * scale;
    var sy = tag.yshad * scale;
    var blur = tag.blur || tag.be || 0;
    var deltaOffsets = getOffsets(bx, by);
    return [{
      key: 'border-width',
      value: "".concat(Math.min(bx, by) * 2, "px")
    }, {
      key: 'border-color',
      value: bc
    }, {
      key: 'border-opacity',
      value: alpha2opacity(tag.a3)
    }, {
      key: 'border-delta',
      value: deltaOffsets.map(function (_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2),
            x = _ref10[0],
            y = _ref10[1];

        return "".concat(x, "px ").concat(y, "px ").concat(bc);
      }).join()
    }, {
      key: 'shadow-offset',
      value: "".concat(sx, "px, ").concat(sy, "px")
    }, {
      key: 'shadow-color',
      value: sc
    }, {
      key: 'shadow-opacity',
      value: alpha2opacity(tag.a4)
    }, {
      key: 'shadow-delta',
      value: deltaOffsets.map(function (_ref11) {
        var _ref12 = _slicedToArray(_ref11, 2),
            x = _ref12[0],
            y = _ref12[1];

        return "".concat(x, "px ").concat(y, "px ").concat(sc);
      }).join()
    }, {
      key: 'blur',
      value: "blur(".concat(blur, "px)")
    }].map(function (kv) {
      return Object.assign(kv, {
        key: "--ass-".concat(kv.key)
      });
    });
  }

  function createDrawing(fragment, styleTag) {
    var tag = assign({}, styleTag, fragment.tag);
    var _fragment$drawing = fragment.drawing,
        minX = _fragment$drawing.minX,
        minY = _fragment$drawing.minY,
        width = _fragment$drawing.width,
        height = _fragment$drawing.height;
    var baseScale = this.scale / (1 << tag.p - 1);
    var scaleX = (tag.fscx ? tag.fscx / 100 : 1) * baseScale;
    var scaleY = (tag.fscy ? tag.fscy / 100 : 1) * baseScale;
    var blur = tag.blur || tag.be || 0;
    var vbx = tag.xbord + (tag.xshad < 0 ? -tag.xshad : 0) + blur;
    var vby = tag.ybord + (tag.yshad < 0 ? -tag.yshad : 0) + blur;
    var vbw = width * scaleX + 2 * tag.xbord + Math.abs(tag.xshad) + 2 * blur;
    var vbh = height * scaleY + 2 * tag.ybord + Math.abs(tag.yshad) + 2 * blur;
    var $svg = createSVGEl('svg', [['width', vbw], ['height', vbh], ['viewBox', "".concat(-vbx, " ").concat(-vby, " ").concat(vbw, " ").concat(vbh)]]);
    var strokeScale = /Yes/i.test(this.info.ScaledBorderAndShadow) ? this.scale : 1;
    var filterId = "ASS-".concat(uuid());
    var $defs = createSVGEl('defs');
    $defs.appendChild(createSVGStroke(tag, filterId, strokeScale));
    $svg.appendChild($defs);
    var symbolId = "ASS-".concat(uuid());
    var $symbol = createSVGEl('symbol', [['id', symbolId], ['viewBox', "".concat(minX, " ").concat(minY, " ").concat(width, " ").concat(height)]]);
    $symbol.appendChild(createSVGEl('path', [['d', fragment.drawing.d]]));
    $svg.appendChild($symbol);
    $svg.appendChild(createSVGEl('use', [['width', width * scaleX], ['height', height * scaleY], ['xlink:href', "#".concat(symbolId)], ['filter', "url(#".concat(filterId, ")")]]));
    $svg.style.cssText = 'position:absolute;' + "left:".concat(minX * scaleX - vbx, "px;") + "top:".concat(minY * scaleY - vby, "px;");
    return {
      $svg,
      cssText: "position:relative;width:".concat(width * scaleX, "px;height:").concat(height * scaleY, "px;")
    };
  }

  var $fixFontSize = document.createElement('div');
  $fixFontSize.className = 'ASS-fix-font-size';
  $fixFontSize.textContent = 'M';
  var cache$1 = Object.create(null);
  function getRealFontSize(fn, fs) {
    var key = "".concat(fn, "-").concat(fs);

    if (!cache$1[key]) {
      $fixFontSize.style.cssText = "line-height:normal;font-size:".concat(fs, "px;font-family:\"").concat(fn, "\",Arial;");
      cache$1[key] = fs * fs / $fixFontSize.clientHeight;
    }

    return cache$1[key];
  }

  function createTransform(tag) {
    return [// TODO: I don't know why perspective is 314, it just performances well.
    'perspective(314px)', "rotateY(".concat(tag.fry || 0, "deg)"), "rotateX(".concat(tag.frx || 0, "deg)"), "rotateZ(".concat(-tag.frz || 0, "deg)"), "scale(".concat(tag.p ? 1 : (tag.fscx || 100) / 100, ",").concat(tag.p ? 1 : (tag.fscy || 100) / 100, ")"), "skew(".concat(tag.fax || 0, "rad,").concat(tag.fay || 0, "rad)")].join(' ');
  }
  function setTransformOrigin(dialogue) {
    var alignment = dialogue.alignment,
        width = dialogue.width,
        height = dialogue.height,
        x = dialogue.x,
        y = dialogue.y,
        $div = dialogue.$div;
    var org = dialogue.org;

    if (!org) {
      org = {
        x: 0,
        y: 0
      };
      if (alignment % 3 === 1) org.x = x;
      if (alignment % 3 === 2) org.x = x + width / 2;
      if (alignment % 3 === 0) org.x = x + width;
      if (alignment <= 3) org.y = y + height;
      if (alignment >= 4 && alignment <= 6) org.y = y + height / 2;
      if (alignment >= 7) org.y = y;
    }

    for (var i = $div.childNodes.length - 1; i >= 0; i--) {
      var node = $div.childNodes[i];

      if (node.dataset.hasRotate === 'true') {
        // It's not extremely precise for offsets are round the value to an integer.
        var tox = org.x - x - node.offsetLeft;
        var toy = org.y - y - node.offsetTop;
        node.style.cssText += "transform-origin:".concat(tox, "px ").concat(toy, "px;");
      }
    }
  }

  function encodeText(text, q) {
    return text.replace(/\\h/g, ' ').replace(/\\N/g, '\n').replace(/\\n/g, q === 2 ? '\n' : ' ');
  }

  function createDialogue(dialogue) {
    var _this = this;

    var $div = document.createElement('div');
    $div.className = 'ASS-dialogue';
    var df = document.createDocumentFragment();
    var slices = dialogue.slices,
        start = dialogue.start,
        end = dialogue.end;
    var animationOptions = {
      duration: (end - start) * 1000,
      delay: Math.min(0, start - this.video.currentTime) * 1000,
      fill: 'forwards'
    };
    $div.animations = [];
    slices.forEach(function (slice) {
      var sliceTag = _this.styles[slice.style].tag;
      var borderStyle = _this.styles[slice.style].style.BorderStyle;
      slice.fragments.forEach(function (fragment) {
        var text = fragment.text,
            drawing = fragment.drawing;
        var tag = assign({}, sliceTag, fragment.tag);
        var cssText = 'display:inline-block;';
        var cssVars = [];

        if (!drawing) {
          cssText += "line-height:normal;font-family:\"".concat(tag.fn, "\",Arial;");
          cssText += "font-size:".concat(_this.scale * getRealFontSize(tag.fn, tag.fs), "px;");
          cssText += "color:".concat(color2rgba(tag.a1 + tag.c1), ";");
          var scale = /Yes/i.test(_this.info.ScaledBorderAndShadow) ? _this.scale : 1;

          if (borderStyle === 1) {
            cssVars.push.apply(cssVars, _toConsumableArray(createCSSStroke(tag, scale)));
          }

          if (borderStyle === 3) {
            // TODO: \bord0\shad16
            var bc = color2rgba(tag.a3 + tag.c3);
            var bx = tag.xbord * scale;
            var by = tag.ybord * scale;
            var sc = color2rgba(tag.a4 + tag.c4);
            var sx = tag.xshad * scale;
            var sy = tag.yshad * scale;
            cssText += "".concat(bx || by ? "background-color:".concat(bc, ";") : '') + "border:0 solid ".concat(bc, ";") + "border-width:".concat(bx, "px ").concat(by, "px;") + "margin:".concat(-bx, "px ").concat(-by, "px;") + "box-shadow:".concat(sx, "px ").concat(sy, "px ").concat(sc, ";");
          }

          cssText += tag.b ? "font-weight:".concat(tag.b === 1 ? 'bold' : tag.b, ";") : '';
          cssText += tag.i ? 'font-style:italic;' : '';
          cssText += tag.u || tag.s ? "text-decoration:".concat(tag.u ? 'underline' : '', " ").concat(tag.s ? 'line-through' : '', ";") : '';
          cssText += tag.fsp ? "letter-spacing:".concat(tag.fsp, "px;") : ''; // TODO: (tag.q === 0) and (tag.q === 3) are not implemented yet,
          // for now just handle it as (tag.q === 1)

          if (tag.q === 1 || tag.q === 0 || tag.q === 3) {
            cssText += 'word-break:break-all;white-space:normal;';
          }

          if (tag.q === 2) {
            cssText += 'word-break:normal;white-space:nowrap;';
          }
        }

        var hasTransfrom = transformTags.some(function (x) {
          return /^fsc[xy]$/.test(x) ? tag[x] !== 100 : !!tag[x];
        });

        if (hasTransfrom) {
          cssText += "transform:".concat(createTransform(tag), ";");

          if (!drawing) {
            cssText += 'transform-style:preserve-3d;word-break:normal;white-space:nowrap;';
          }
        }

        if (drawing && tag.pbo) {
          var pbo = _this.scale * -tag.pbo * (tag.fscy || 100) / 100;
          cssText += "vertical-align:".concat(pbo, "px;");
        }

        var hasRotate = /"fr[xyz]":[^0]/.test(JSON.stringify(tag));
        encodeText(text, tag.q).split('\n').forEach(function (content, idx) {
          var $span = document.createElement('span');
          $span.dataset.hasRotate = hasRotate;

          if (drawing) {
            var obj = createDrawing.call(_this, fragment, sliceTag);
            $span.style.cssText = obj.cssText;
            $span.appendChild(obj.$svg);
          } else {
            if (idx) {
              df.appendChild(document.createElement('br'));
            }

            if (!content) {
              return;
            }

            $span.textContent = content;

            if (tag.xbord || tag.ybord || tag.xshad || tag.yshad) {
              $span.dataset.stroke = content;
            }
          } // TODO: maybe it can be optimized


          $span.style.cssText += cssText;
          cssVars.forEach(function (_ref) {
            var key = _ref.key,
                value = _ref.value;
            $span.style.setProperty(key, value);
          });

          if (fragment.keyframes) {
            $div.animations.push(initAnimation($span, fragment.keyframes, animationOptions));
          }

          df.appendChild($span);
        });
      });
    });

    if (dialogue.keyframes) {
      $div.animations.push(initAnimation($div, dialogue.keyframes, animationOptions));
    }

    $div.appendChild(df);
    return $div;
  }

  var module$1e = {
    exports: {}
  };
  var fails$d = _internalsFails;
  module$1e.exports = !fails$d(function () {
    function F() {
      /* empty */
    }

    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });
  var _internalsCorrectPrototypeGetter = module$1e.exports;

  var module$1f = {
    exports: {}
  };
  var has$7 = _internalsHas;
  var toObject$5 = _internalsToObject;
  var sharedKey$2 = _internalsSharedKey;
  var CORRECT_PROTOTYPE_GETTER = _internalsCorrectPrototypeGetter;
  var IE_PROTO$1 = sharedKey$2('IE_PROTO');
  var ObjectPrototype = Object.prototype; // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof

  module$1f.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
    O = toObject$5(O);
    if (has$7(O, IE_PROTO$1)) return O[IE_PROTO$1];

    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    }

    return O instanceof Object ? ObjectPrototype : null;
  };
  var _internalsObjectGetPrototypeOf = module$1f.exports;

  var module$1g = {
    exports: {}
  };
  var getPrototypeOf = _internalsObjectGetPrototypeOf;
  var createNonEnumerableProperty$6 = _internalsCreateNonEnumerableProperty;
  var has$8 = _internalsHas;
  var wellKnownSymbol$9 = _internalsWellKnownSymbol;
  var IS_PURE$1 = _internalsIsPure;
  var ITERATOR = wellKnownSymbol$9('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  var returnThis = function returnThis() {
    return this;
  }; // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object


  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys(); // Safari 8 has buggy iterators w/o `next`

    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
      PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

  if (!IS_PURE$1 && !has$8(IteratorPrototype, ITERATOR)) {
    createNonEnumerableProperty$6(IteratorPrototype, ITERATOR, returnThis);
  }

  module$1g.exports = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };
  var _internalsIteratorsCore = module$1g.exports;

  var module$1h = {
    exports: {}
  };
  module$1h.exports = {};
  var _internalsIterators = module$1h.exports;

  var module$1i = {
    exports: {}
  };
  var defineProperty$1 = _internalsObjectDefineProperty.f;
  var has$9 = _internalsHas;
  var wellKnownSymbol$a = _internalsWellKnownSymbol;
  var TO_STRING_TAG$2 = wellKnownSymbol$a('toStringTag');

  module$1i.exports = function (it, TAG, STATIC) {
    if (it && !has$9(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
      defineProperty$1(it, TO_STRING_TAG$2, {
        configurable: true,
        value: TAG
      });
    }
  };

  var _internalsSetToStringTag = module$1i.exports;

  var module$1j = {
    exports: {}
  };
  var isObject$7 = _internalsIsObject;

  module$1j.exports = function (it) {
    if (!isObject$7(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + ' as a prototype');
    }

    return it;
  };

  var _internalsAPossiblePrototype = module$1j.exports;

  var module$1k = {
    exports: {}
  };
  var anObject$a = _internalsAnObject;
  var aPossiblePrototype = _internalsAPossiblePrototype; // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.

  /* eslint-disable no-proto */

  module$1k.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;

    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) {
      /* empty */
    }

    return function setPrototypeOf(O, proto) {
      anObject$a(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter.call(O, proto);else O.__proto__ = proto;
      return O;
    };
  }() : undefined);
  var _internalsObjectSetPrototypeOf = module$1k.exports;

  var module$1l = {
    exports: {}
  };
  var IteratorPrototype$1 = _internalsIteratorsCore.IteratorPrototype;
  var create$1 = _internalsObjectCreate;
  var createPropertyDescriptor$3 = _internalsCreatePropertyDescriptor;
  var setToStringTag = _internalsSetToStringTag;
  var Iterators = _internalsIterators;

  var returnThis$1 = function returnThis() {
    return this;
  };

  module$1l.exports = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = create$1(IteratorPrototype$1, {
      next: createPropertyDescriptor$3(1, next)
    });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
    Iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var _internalsCreateIteratorConstructor = module$1l.exports;

  var module$1m = {
    exports: {}
  };
  var $$6 = _internalsExport;
  var createIteratorConstructor = _internalsCreateIteratorConstructor;
  var getPrototypeOf$1 = _internalsObjectGetPrototypeOf;
  var setPrototypeOf = _internalsObjectSetPrototypeOf;
  var setToStringTag$1 = _internalsSetToStringTag;
  var createNonEnumerableProperty$7 = _internalsCreateNonEnumerableProperty;
  var redefine$4 = _internalsRedefine;
  var wellKnownSymbol$b = _internalsWellKnownSymbol;
  var IS_PURE$2 = _internalsIsPure;
  var Iterators$1 = _internalsIterators;
  var IteratorsCore = _internalsIteratorsCore;
  var IteratorPrototype$2 = IteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$1 = IteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$1 = wellKnownSymbol$b('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis$2 = function returnThis() {
    return this;
  };

  module$1m.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function getIterationMethod(KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];

      switch (KIND) {
        case KEYS:
          return function keys() {
            return new IteratorConstructor(this, KIND);
          };

        case VALUES:
          return function values() {
            return new IteratorConstructor(this, KIND);
          };

        case ENTRIES:
          return function entries() {
            return new IteratorConstructor(this, KIND);
          };
      }

      return function () {
        return new IteratorConstructor(this);
      };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$1] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY; // fix native

    if (anyNativeIterator) {
      CurrentIteratorPrototype = getPrototypeOf$1(anyNativeIterator.call(new Iterable()));

      if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
        if (!IS_PURE$2 && getPrototypeOf$1(CurrentIteratorPrototype) !== IteratorPrototype$2) {
          if (setPrototypeOf) {
            setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
            createNonEnumerableProperty$7(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
          }
        } // Set @@toStringTag to native iterators


        setToStringTag$1(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
        if (IS_PURE$2) Iterators$1[TO_STRING_TAG] = returnThis$2;
      }
    } // fix Array#{values, @@iterator}.name in V8 / FF


    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;

      defaultIterator = function values() {
        return nativeIterator.call(this);
      };
    } // define iterator


    if ((!IS_PURE$2 || FORCED) && IterablePrototype[ITERATOR$1] !== defaultIterator) {
      createNonEnumerableProperty$7(IterablePrototype, ITERATOR$1, defaultIterator);
    }

    Iterators$1[NAME] = defaultIterator; // export additional methods

    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine$4(IterablePrototype, KEY, methods[KEY]);
        }
      } else $$6({
        target: NAME,
        proto: true,
        forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME
      }, methods);
    }

    return methods;
  };

  var _internalsDefineIterator = module$1m.exports;

  var module$1n = {
    exports: {}
  };
  var toIndexedObject$3 = _internalsToIndexedObject;
  var addToUnscopables$1 = _internalsAddToUnscopables;
  var Iterators$2 = _internalsIterators;
  var InternalStateModule$1 = _internalsInternalState;
  var defineIterator = _internalsDefineIterator;
  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState = InternalStateModule$1.set;
  var getInternalState$1 = InternalStateModule$1.getterFor(ARRAY_ITERATOR); // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator

  module$1n.exports = defineIterator(Array, 'Array', function (iterated, kind) {
    setInternalState(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject$3(iterated),
      // target
      index: 0,
      // next index
      kind: kind // kind

    }); // `%ArrayIteratorPrototype%.next` method
    // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$1(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;

    if (!target || index >= target.length) {
      state.target = undefined;
      return {
        value: undefined,
        done: true
      };
    }

    if (kind == 'keys') return {
      value: index,
      done: false
    };
    if (kind == 'values') return {
      value: target[index],
      done: false
    };
    return {
      value: [index, target[index]],
      done: false
    };
  }, 'values'); // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject

  Iterators$2.Arguments = Iterators$2.Array; // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

  addToUnscopables$1('keys');
  addToUnscopables$1('values');
  addToUnscopables$1('entries');
  var _modulesEsArrayIterator = module$1n.exports;

  var module$1o = {
    exports: {}
  };
  var toObject$6 = _internalsToObject;
  var toAbsoluteIndex$2 = _internalsToAbsoluteIndex;
  var toLength$9 = _internalsToLength; // `Array.prototype.fill` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.fill

  module$1o.exports = function fill(value
  /* , start = 0, end = @length */
  ) {
    var O = toObject$6(this);
    var length = toLength$9(O.length);
    var argumentsLength = arguments.length;
    var index = toAbsoluteIndex$2(argumentsLength > 1 ? arguments[1] : undefined, length);
    var end = argumentsLength > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : toAbsoluteIndex$2(end, length);

    while (endPos > index) {
      O[index++] = value;
    }

    return O;
  };

  var _internalsArrayFill = module$1o.exports;

  var module$1p = {
    exports: {}
  };
  // IEEE754 conversions based on https://github.com/feross/ieee754
  // eslint-disable-next-line no-shadow-restricted-names
  var Infinity$1 = 1 / 0;
  var abs = Math.abs;
  var pow = Math.pow;
  var floor$2 = Math.floor;
  var log = Math.log;
  var LN2 = Math.LN2;

  var pack = function pack(number, mantissaLength, bytes) {
    var buffer = new Array(bytes);
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
    var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
    var index = 0;
    var exponent, mantissa, c;
    number = abs(number); // eslint-disable-next-line no-self-compare

    if (number != number || number === Infinity$1) {
      // eslint-disable-next-line no-self-compare
      mantissa = number != number ? 1 : 0;
      exponent = eMax;
    } else {
      exponent = floor$2(log(number) / LN2);

      if (number * (c = pow(2, -exponent)) < 1) {
        exponent--;
        c *= 2;
      }

      if (exponent + eBias >= 1) {
        number += rt / c;
      } else {
        number += rt * pow(2, 1 - eBias);
      }

      if (number * c >= 2) {
        exponent++;
        c /= 2;
      }

      if (exponent + eBias >= eMax) {
        mantissa = 0;
        exponent = eMax;
      } else if (exponent + eBias >= 1) {
        mantissa = (number * c - 1) * pow(2, mantissaLength);
        exponent = exponent + eBias;
      } else {
        mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
        exponent = 0;
      }
    }

    for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8) {
    }

    exponent = exponent << mantissaLength | mantissa;
    exponentLength += mantissaLength;

    for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8) {
    }

    buffer[--index] |= sign * 128;
    return buffer;
  };

  var unpack = function unpack(buffer, mantissaLength) {
    var bytes = buffer.length;
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var nBits = exponentLength - 7;
    var index = bytes - 1;
    var sign = buffer[index--];
    var exponent = sign & 127;
    var mantissa;
    sign >>= 7;

    for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8) {
    }

    mantissa = exponent & (1 << -nBits) - 1;
    exponent >>= -nBits;
    nBits += mantissaLength;

    for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8) {
    }

    if (exponent === 0) {
      exponent = 1 - eBias;
    } else if (exponent === eMax) {
      return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
    } else {
      mantissa = mantissa + pow(2, mantissaLength);
      exponent = exponent - eBias;
    }

    return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
  };

  module$1p.exports = {
    pack: pack,
    unpack: unpack
  };
  var _internalsIeee = module$1p.exports;

  var module$1q = {
    exports: {}
  };
  var toInteger$6 = _internalsToInteger;
  var toLength$a = _internalsToLength; // `ToIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-toindex

  module$1q.exports = function (it) {
    if (it === undefined) return 0;
    var number = toInteger$6(it);
    var length = toLength$a(number);
    if (number !== length) throw RangeError('Wrong length or index');
    return length;
  };

  var _internalsToIndex = module$1q.exports;

  var module$1r = {
    exports: {}
  };

  module$1r.exports = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    }

    return it;
  };

  var _internalsAnInstance = module$1r.exports;

  var module$1s = {
    exports: {}
  };
  var redefine$5 = _internalsRedefine;

  module$1s.exports = function (target, src, options) {
    for (var key in src) {
      redefine$5(target, key, src[key], options);
    }

    return target;
  };

  var _internalsRedefineAll = module$1s.exports;

  var module$1t = {
    exports: {}
  };
  module$1t.exports = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';
  var _internalsArrayBufferNative = module$1t.exports;

  var module$1u = {
    exports: {}
  };
  var global$d = _internalsGlobal;
  var DESCRIPTORS$6 = _internalsDescriptors;
  var NATIVE_ARRAY_BUFFER = _internalsArrayBufferNative;
  var createNonEnumerableProperty$8 = _internalsCreateNonEnumerableProperty;
  var redefineAll = _internalsRedefineAll;
  var fails$e = _internalsFails;
  var anInstance = _internalsAnInstance;
  var toInteger$7 = _internalsToInteger;
  var toLength$b = _internalsToLength;
  var toIndex = _internalsToIndex;
  var IEEE754 = _internalsIeee;
  var getPrototypeOf$2 = _internalsObjectGetPrototypeOf;
  var setPrototypeOf$1 = _internalsObjectSetPrototypeOf;
  var getOwnPropertyNames = _internalsObjectGetOwnPropertyNames.f;
  var defineProperty$2 = _internalsObjectDefineProperty.f;
  var arrayFill = _internalsArrayFill;
  var setToStringTag$2 = _internalsSetToStringTag;
  var InternalStateModule$2 = _internalsInternalState;
  var getInternalState$2 = InternalStateModule$2.get;
  var setInternalState$1 = InternalStateModule$2.set;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var DATA_VIEW = 'DataView';
  var PROTOTYPE$1 = 'prototype';
  var WRONG_LENGTH = 'Wrong length';
  var WRONG_INDEX = 'Wrong index';
  var NativeArrayBuffer = global$d[ARRAY_BUFFER];
  var $ArrayBuffer = NativeArrayBuffer;
  var $DataView = global$d[DATA_VIEW];
  var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$1];
  var ObjectPrototype$1 = Object.prototype;
  var RangeError$1 = global$d.RangeError;
  var packIEEE754 = IEEE754.pack;
  var unpackIEEE754 = IEEE754.unpack;

  var packInt8 = function packInt8(number) {
    return [number & 0xFF];
  };

  var packInt16 = function packInt16(number) {
    return [number & 0xFF, number >> 8 & 0xFF];
  };

  var packInt32 = function packInt32(number) {
    return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
  };

  var unpackInt32 = function unpackInt32(buffer) {
    return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
  };

  var packFloat32 = function packFloat32(number) {
    return packIEEE754(number, 23, 4);
  };

  var packFloat64 = function packFloat64(number) {
    return packIEEE754(number, 52, 8);
  };

  var addGetter = function addGetter(Constructor, key) {
    defineProperty$2(Constructor[PROTOTYPE$1], key, {
      get: function get() {
        return getInternalState$2(this)[key];
      }
    });
  };

  var get$1 = function get(view, count, index, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState$2(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState$2(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = bytes.slice(start, start + count);
    return isLittleEndian ? pack : pack.reverse();
  };

  var set$1 = function set(view, count, index, conversion, value, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState$2(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState$2(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = conversion(+value);

    for (var i = 0; i < count; i++) {
      bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
    }
  };

  if (!NATIVE_ARRAY_BUFFER) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
      var byteLength = toIndex(length);
      setInternalState$1(this, {
        bytes: arrayFill.call(new Array(byteLength), 0),
        byteLength: byteLength
      });
      if (!DESCRIPTORS$6) this.byteLength = byteLength;
    };

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      anInstance(this, $DataView, DATA_VIEW);
      anInstance(buffer, $ArrayBuffer, DATA_VIEW);
      var bufferLength = getInternalState$2(buffer).byteLength;
      var offset = toInteger$7(byteOffset);
      if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
      byteLength = byteLength === undefined ? bufferLength - offset : toLength$b(byteLength);
      if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
      setInternalState$1(this, {
        buffer: buffer,
        byteLength: byteLength,
        byteOffset: offset
      });

      if (!DESCRIPTORS$6) {
        this.buffer = buffer;
        this.byteLength = byteLength;
        this.byteOffset = offset;
      }
    };

    if (DESCRIPTORS$6) {
      addGetter($ArrayBuffer, 'byteLength');
      addGetter($DataView, 'buffer');
      addGetter($DataView, 'byteLength');
      addGetter($DataView, 'byteOffset');
    }

    redefineAll($DataView[PROTOTYPE$1], {
      getInt8: function getInt8(byteOffset) {
        return get$1(this, 1, byteOffset)[0] << 24 >> 24;
      },
      getUint8: function getUint8(byteOffset) {
        return get$1(this, 1, byteOffset)[0];
      },
      getInt16: function getInt16(byteOffset
      /* , littleEndian */
      ) {
        var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
      },
      getUint16: function getUint16(byteOffset
      /* , littleEndian */
      ) {
        var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return bytes[1] << 8 | bytes[0];
      },
      getInt32: function getInt32(byteOffset
      /* , littleEndian */
      ) {
        return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
      },
      getUint32: function getUint32(byteOffset
      /* , littleEndian */
      ) {
        return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
      },
      getFloat32: function getFloat32(byteOffset
      /* , littleEndian */
      ) {
        return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
      },
      getFloat64: function getFloat64(byteOffset
      /* , littleEndian */
      ) {
        return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
      },
      setInt8: function setInt8(byteOffset, value) {
        set$1(this, 1, byteOffset, packInt8, value);
      },
      setUint8: function setUint8(byteOffset, value) {
        set$1(this, 1, byteOffset, packInt8, value);
      },
      setInt16: function setInt16(byteOffset, value
      /* , littleEndian */
      ) {
        set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint16: function setUint16(byteOffset, value
      /* , littleEndian */
      ) {
        set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setInt32: function setInt32(byteOffset, value
      /* , littleEndian */
      ) {
        set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint32: function setUint32(byteOffset, value
      /* , littleEndian */
      ) {
        set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat32: function setFloat32(byteOffset, value
      /* , littleEndian */
      ) {
        set$1(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat64: function setFloat64(byteOffset, value
      /* , littleEndian */
      ) {
        set$1(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
      }
    });
  } else {
    if (!fails$e(function () {
      NativeArrayBuffer(1);
    }) || !fails$e(function () {
      new NativeArrayBuffer(-1); // eslint-disable-line no-new
    }) || fails$e(function () {
      new NativeArrayBuffer(); // eslint-disable-line no-new

      new NativeArrayBuffer(1.5); // eslint-disable-line no-new

      new NativeArrayBuffer(NaN); // eslint-disable-line no-new

      return NativeArrayBuffer.name != ARRAY_BUFFER;
    })) {
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance(this, $ArrayBuffer);
        return new NativeArrayBuffer(toIndex(length));
      };

      var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$1] = NativeArrayBuffer[PROTOTYPE$1];

      for (var keys$1 = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys$1.length > j;) {
        if (!((key = keys$1[j++]) in $ArrayBuffer)) {
          createNonEnumerableProperty$8($ArrayBuffer, key, NativeArrayBuffer[key]);
        }
      }

      ArrayBufferPrototype.constructor = $ArrayBuffer;
    } // WebKit bug - the same parent prototype for typed arrays and data view


    if (setPrototypeOf$1 && getPrototypeOf$2($DataViewPrototype) !== ObjectPrototype$1) {
      setPrototypeOf$1($DataViewPrototype, ObjectPrototype$1);
    } // iOS Safari 7.x bug


    var testView = new $DataView(new $ArrayBuffer(2));
    var nativeSetInt8 = $DataViewPrototype.setInt8;
    testView.setInt8(0, 2147483648);
    testView.setInt8(1, 2147483649);
    if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
      setInt8: function setInt8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      },
      setUint8: function setUint8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      }
    }, {
      unsafe: true
    });
  }

  setToStringTag$2($ArrayBuffer, ARRAY_BUFFER);
  setToStringTag$2($DataView, DATA_VIEW);
  module$1u.exports = {
    ArrayBuffer: $ArrayBuffer,
    DataView: $DataView
  };
  var _internalsArrayBuffer = module$1u.exports;

  var $$7 = _internalsExport;
  var fails$f = _internalsFails;
  var ArrayBufferModule = _internalsArrayBuffer;
  var anObject$b = _internalsAnObject;
  var toAbsoluteIndex$3 = _internalsToAbsoluteIndex;
  var toLength$c = _internalsToLength;
  var speciesConstructor$1 = _internalsSpeciesConstructor;
  var ArrayBuffer$1 = ArrayBufferModule.ArrayBuffer;
  var DataView$1 = ArrayBufferModule.DataView;
  var nativeArrayBufferSlice = ArrayBuffer$1.prototype.slice;
  var INCORRECT_SLICE = fails$f(function () {
    return !new ArrayBuffer$1(2).slice(1, undefined).byteLength;
  }); // `ArrayBuffer.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice

  $$7({
    target: 'ArrayBuffer',
    proto: true,
    unsafe: true,
    forced: INCORRECT_SLICE
  }, {
    slice: function slice(start, end) {
      if (nativeArrayBufferSlice !== undefined && end === undefined) {
        return nativeArrayBufferSlice.call(anObject$b(this), start); // FF fix
      }

      var length = anObject$b(this).byteLength;
      var first = toAbsoluteIndex$3(start, length);
      var fin = toAbsoluteIndex$3(end === undefined ? length : end, length);
      var result = new (speciesConstructor$1(this, ArrayBuffer$1))(toLength$c(fin - first));
      var viewSource = new DataView$1(this);
      var viewTarget = new DataView$1(result);
      var index = 0;

      while (first < fin) {
        viewTarget.setUint8(index++, viewSource.getUint8(first++));
      }

      return result;
    }
  });

  var module$1v = {
    exports: {}
  };
  var isObject$8 = _internalsIsObject;
  var setPrototypeOf$2 = _internalsObjectSetPrototypeOf; // makes subclassing work correct for wrapped built-ins

  module$1v.exports = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if ( // it can work only with native `setPrototypeOf`
    setPrototypeOf$2 && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' && NewTarget !== Wrapper && isObject$8(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) setPrototypeOf$2($this, NewTargetPrototype);
    return $this;
  };

  var _internalsInheritIfRequired = module$1v.exports;

  var module$1w = {
    exports: {}
  };
  var getBuiltIn$3 = _internalsGetBuiltIn;
  var definePropertyModule$5 = _internalsObjectDefineProperty;
  var wellKnownSymbol$c = _internalsWellKnownSymbol;
  var DESCRIPTORS$7 = _internalsDescriptors;
  var SPECIES$4 = wellKnownSymbol$c('species');

  module$1w.exports = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn$3(CONSTRUCTOR_NAME);
    var defineProperty = definePropertyModule$5.f;

    if (DESCRIPTORS$7 && Constructor && !Constructor[SPECIES$4]) {
      defineProperty(Constructor, SPECIES$4, {
        configurable: true,
        get: function get() {
          return this;
        }
      });
    }
  };

  var _internalsSetSpecies = module$1w.exports;

  var module$1x = {
    exports: {}
  };
  var NATIVE_ARRAY_BUFFER$1 = _internalsArrayBufferNative;
  var DESCRIPTORS$8 = _internalsDescriptors;
  var global$e = _internalsGlobal;
  var isObject$9 = _internalsIsObject;
  var has$a = _internalsHas;
  var classof$5 = _internalsClassof;
  var createNonEnumerableProperty$9 = _internalsCreateNonEnumerableProperty;
  var redefine$6 = _internalsRedefine;
  var defineProperty$3 = _internalsObjectDefineProperty.f;
  var getPrototypeOf$3 = _internalsObjectGetPrototypeOf;
  var setPrototypeOf$3 = _internalsObjectSetPrototypeOf;
  var wellKnownSymbol$d = _internalsWellKnownSymbol;
  var uid$2 = _internalsUid;
  var Int8Array$1 = global$e.Int8Array;
  var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
  var Uint8ClampedArray = global$e.Uint8ClampedArray;
  var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
  var TypedArray = Int8Array$1 && getPrototypeOf$3(Int8Array$1);
  var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf$3(Int8ArrayPrototype);
  var ObjectPrototype$2 = Object.prototype;
  var isPrototypeOf = ObjectPrototype$2.isPrototypeOf;
  var TO_STRING_TAG$3 = wellKnownSymbol$d('toStringTag');
  var TYPED_ARRAY_TAG = uid$2('TYPED_ARRAY_TAG'); // Fixing native typed arrays in Opera Presto crashes the browser, see #595

  var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER$1 && !!setPrototypeOf$3 && classof$5(global$e.opera) !== 'Opera';
  var TYPED_ARRAY_TAG_REQIRED = false;
  var NAME;
  var TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8
  };

  var isView = function isView(it) {
    var klass = classof$5(it);
    return klass === 'DataView' || has$a(TypedArrayConstructorsList, klass);
  };

  var isTypedArray = function isTypedArray(it) {
    return isObject$9(it) && has$a(TypedArrayConstructorsList, classof$5(it));
  };

  var aTypedArray = function aTypedArray(it) {
    if (isTypedArray(it)) return it;
    throw TypeError('Target is not a typed array');
  };

  var aTypedArrayConstructor = function aTypedArrayConstructor(C) {
    if (setPrototypeOf$3) {
      if (isPrototypeOf.call(TypedArray, C)) return C;
    } else for (var ARRAY in TypedArrayConstructorsList) {
      if (has$a(TypedArrayConstructorsList, NAME)) {
        var TypedArrayConstructor = global$e[ARRAY];

        if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
          return C;
        }
      }
    }

    throw TypeError('Target is not a typed array constructor');
  };

  var exportTypedArrayMethod = function exportTypedArrayMethod(KEY, property, forced) {
    if (!DESCRIPTORS$8) return;
    if (forced) for (var ARRAY in TypedArrayConstructorsList) {
      var TypedArrayConstructor = global$e[ARRAY];

      if (TypedArrayConstructor && has$a(TypedArrayConstructor.prototype, KEY)) {
        delete TypedArrayConstructor.prototype[KEY];
      }
    }

    if (!TypedArrayPrototype[KEY] || forced) {
      redefine$6(TypedArrayPrototype, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
    }
  };

  var exportTypedArrayStaticMethod = function exportTypedArrayStaticMethod(KEY, property, forced) {
    var ARRAY, TypedArrayConstructor;
    if (!DESCRIPTORS$8) return;

    if (setPrototypeOf$3) {
      if (forced) for (ARRAY in TypedArrayConstructorsList) {
        TypedArrayConstructor = global$e[ARRAY];

        if (TypedArrayConstructor && has$a(TypedArrayConstructor, KEY)) {
          delete TypedArrayConstructor[KEY];
        }
      }

      if (!TypedArray[KEY] || forced) {
        // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
          return redefine$6(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
        } catch (error) {
          /* empty */
        }
      } else return;
    }

    for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global$e[ARRAY];

      if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
        redefine$6(TypedArrayConstructor, KEY, property);
      }
    }
  };

  for (NAME in TypedArrayConstructorsList) {
    if (!global$e[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
  } // WebKit bug - typed arrays constructors prototype is Object.prototype


  if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
    // eslint-disable-next-line no-shadow
    TypedArray = function TypedArray() {
      throw TypeError('Incorrect invocation');
    };

    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
      if (global$e[NAME]) setPrototypeOf$3(global$e[NAME], TypedArray);
    }
  }

  if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$2) {
    TypedArrayPrototype = TypedArray.prototype;
    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
      if (global$e[NAME]) setPrototypeOf$3(global$e[NAME].prototype, TypedArrayPrototype);
    }
  } // WebKit bug - one more object in Uint8ClampedArray prototype chain


  if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf$3(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
    setPrototypeOf$3(Uint8ClampedArrayPrototype, TypedArrayPrototype);
  }

  if (DESCRIPTORS$8 && !has$a(TypedArrayPrototype, TO_STRING_TAG$3)) {
    TYPED_ARRAY_TAG_REQIRED = true;
    defineProperty$3(TypedArrayPrototype, TO_STRING_TAG$3, {
      get: function get() {
        return isObject$9(this) ? this[TYPED_ARRAY_TAG] : undefined;
      }
    });

    for (NAME in TypedArrayConstructorsList) {
      if (global$e[NAME]) {
        createNonEnumerableProperty$9(global$e[NAME], TYPED_ARRAY_TAG, NAME);
      }
    }
  }

  module$1x.exports = {
    NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
    aTypedArray: aTypedArray,
    aTypedArrayConstructor: aTypedArrayConstructor,
    exportTypedArrayMethod: exportTypedArrayMethod,
    exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
    isView: isView,
    isTypedArray: isTypedArray,
    TypedArray: TypedArray,
    TypedArrayPrototype: TypedArrayPrototype
  };
  var _internalsArrayBufferViewCore = module$1x.exports;

  var module$1y = {
    exports: {}
  };
  var wellKnownSymbol$e = _internalsWellKnownSymbol;
  var Iterators$3 = _internalsIterators;
  var ITERATOR$2 = wellKnownSymbol$e('iterator');
  var ArrayPrototype$1 = Array.prototype; // check on default Array iterator

  module$1y.exports = function (it) {
    return it !== undefined && (Iterators$3.Array === it || ArrayPrototype$1[ITERATOR$2] === it);
  };

  var _internalsIsArrayIteratorMethod = module$1y.exports;

  var module$1z = {
    exports: {}
  };
  var classof$6 = _internalsClassof;
  var Iterators$4 = _internalsIterators;
  var wellKnownSymbol$f = _internalsWellKnownSymbol;
  var ITERATOR$3 = wellKnownSymbol$f('iterator');

  module$1z.exports = function (it) {
    if (it != undefined) return it[ITERATOR$3] || it['@@iterator'] || Iterators$4[classof$6(it)];
  };

  var _internalsGetIteratorMethod = module$1z.exports;

  var module$1A = {
    exports: {}
  };
  var toObject$7 = _internalsToObject;
  var toLength$d = _internalsToLength;
  var getIteratorMethod = _internalsGetIteratorMethod;
  var isArrayIteratorMethod = _internalsIsArrayIteratorMethod;
  var bind$2 = _internalsFunctionBindContext;
  var aTypedArrayConstructor$1 = _internalsArrayBufferViewCore.aTypedArrayConstructor;

  module$1A.exports = function from(source
  /* , mapfn, thisArg */
  ) {
    var O = toObject$7(source);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var i, length, result, step, iterator, next;

    if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      O = [];

      while (!(step = next.call(iterator)).done) {
        O.push(step.value);
      }
    }

    if (mapping && argumentsLength > 2) {
      mapfn = bind$2(mapfn, arguments[2], 2);
    }

    length = toLength$d(O.length);
    result = new (aTypedArrayConstructor$1(this))(length);

    for (i = 0; length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }

    return result;
  };

  var _internalsTypedArrayFrom = module$1A.exports;

  var module$1B = {
    exports: {}
  };
  var toInteger$8 = _internalsToInteger;

  module$1B.exports = function (it) {
    var result = toInteger$8(it);
    if (result < 0) throw RangeError("The argument can't be less than 0");
    return result;
  };

  var _internalsToPositiveInteger = module$1B.exports;

  var module$1C = {
    exports: {}
  };
  var toPositiveInteger = _internalsToPositiveInteger;

  module$1C.exports = function (it, BYTES) {
    var offset = toPositiveInteger(it);
    if (offset % BYTES) throw RangeError('Wrong offset');
    return offset;
  };

  var _internalsToOffset = module$1C.exports;

  var module$1D = {
    exports: {}
  };
  var wellKnownSymbol$g = _internalsWellKnownSymbol;
  var ITERATOR$4 = wellKnownSymbol$g('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function next() {
        return {
          done: !!called++
        };
      },
      'return': function _return() {
        SAFE_CLOSING = true;
      }
    };

    iteratorWithReturn[ITERATOR$4] = function () {
      return this;
    }; // eslint-disable-next-line no-throw-literal


    Array.from(iteratorWithReturn, function () {
      throw 2;
    });
  } catch (error) {
    /* empty */
  }

  module$1D.exports = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;

    try {
      var object = {};

      object[ITERATOR$4] = function () {
        return {
          next: function next() {
            return {
              done: ITERATION_SUPPORT = true
            };
          }
        };
      };

      exec(object);
    } catch (error) {
      /* empty */
    }

    return ITERATION_SUPPORT;
  };

  var _internalsCheckCorrectnessOfIteration = module$1D.exports;

  var module$1E = {
    exports: {}
  };

  /* eslint-disable no-new */
  var global$f = _internalsGlobal;
  var fails$g = _internalsFails;
  var checkCorrectnessOfIteration = _internalsCheckCorrectnessOfIteration;
  var NATIVE_ARRAY_BUFFER_VIEWS$1 = _internalsArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
  var ArrayBuffer$2 = global$f.ArrayBuffer;
  var Int8Array$2 = global$f.Int8Array;
  module$1E.exports = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails$g(function () {
    Int8Array$2(1);
  }) || !fails$g(function () {
    new Int8Array$2(-1);
  }) || !checkCorrectnessOfIteration(function (iterable) {
    new Int8Array$2();
    new Int8Array$2(null);
    new Int8Array$2(1.5);
    new Int8Array$2(iterable);
  }, true) || fails$g(function () {
    // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
    return new Int8Array$2(new ArrayBuffer$2(2), 1, undefined).length !== 1;
  });
  var _internalsTypedArrayConstructorsRequireWrappers = module$1E.exports;

  var module$1F = {
    exports: {}
  };
  var $$8 = _internalsExport;
  var global$g = _internalsGlobal;
  var DESCRIPTORS$9 = _internalsDescriptors;
  var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = _internalsTypedArrayConstructorsRequireWrappers;
  var ArrayBufferViewCore = _internalsArrayBufferViewCore;
  var ArrayBufferModule$1 = _internalsArrayBuffer;
  var anInstance$1 = _internalsAnInstance;
  var createPropertyDescriptor$4 = _internalsCreatePropertyDescriptor;
  var createNonEnumerableProperty$a = _internalsCreateNonEnumerableProperty;
  var toLength$e = _internalsToLength;
  var toIndex$1 = _internalsToIndex;
  var toOffset = _internalsToOffset;
  var toPrimitive$3 = _internalsToPrimitive;
  var has$b = _internalsHas;
  var classof$7 = _internalsClassof;
  var isObject$a = _internalsIsObject;
  var create$2 = _internalsObjectCreate;
  var setPrototypeOf$4 = _internalsObjectSetPrototypeOf;
  var getOwnPropertyNames$1 = _internalsObjectGetOwnPropertyNames.f;
  var typedArrayFrom = _internalsTypedArrayFrom;
  var forEach$1 = _internalsArrayIteration.forEach;
  var setSpecies = _internalsSetSpecies;
  var definePropertyModule$6 = _internalsObjectDefineProperty;
  var getOwnPropertyDescriptorModule$1 = _internalsObjectGetOwnPropertyDescriptor;
  var InternalStateModule$3 = _internalsInternalState;
  var inheritIfRequired = _internalsInheritIfRequired;
  var getInternalState$3 = InternalStateModule$3.get;
  var setInternalState$2 = InternalStateModule$3.set;
  var nativeDefineProperty$1 = definePropertyModule$6.f;
  var nativeGetOwnPropertyDescriptor$1 = getOwnPropertyDescriptorModule$1.f;
  var round = Math.round;
  var RangeError$2 = global$g.RangeError;
  var ArrayBuffer$3 = ArrayBufferModule$1.ArrayBuffer;
  var DataView$2 = ArrayBufferModule$1.DataView;
  var NATIVE_ARRAY_BUFFER_VIEWS$2 = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
  var TYPED_ARRAY_TAG$1 = ArrayBufferViewCore.TYPED_ARRAY_TAG;
  var TypedArray$1 = ArrayBufferViewCore.TypedArray;
  var TypedArrayPrototype$1 = ArrayBufferViewCore.TypedArrayPrototype;
  var aTypedArrayConstructor$2 = ArrayBufferViewCore.aTypedArrayConstructor;
  var isTypedArray$1 = ArrayBufferViewCore.isTypedArray;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var WRONG_LENGTH$1 = 'Wrong length';

  var fromList = function fromList(C, list) {
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$2(C))(length);

    while (length > index) {
      result[index] = list[index++];
    }

    return result;
  };

  var addGetter$1 = function addGetter(it, key) {
    nativeDefineProperty$1(it, key, {
      get: function get() {
        return getInternalState$3(this)[key];
      }
    });
  };

  var isArrayBuffer = function isArrayBuffer(it) {
    var klass;
    return it instanceof ArrayBuffer$3 || (klass = classof$7(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
  };

  var isTypedArrayIndex = function isTypedArrayIndex(target, key) {
    return isTypedArray$1(target) && typeof key != 'symbol' && key in target && String(+key) == String(key);
  };

  var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
    return isTypedArrayIndex(target, key = toPrimitive$3(key, true)) ? createPropertyDescriptor$4(2, target[key]) : nativeGetOwnPropertyDescriptor$1(target, key);
  };

  var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
    if (isTypedArrayIndex(target, key = toPrimitive$3(key, true)) && isObject$a(descriptor) && has$b(descriptor, 'value') && !has$b(descriptor, 'get') && !has$b(descriptor, 'set') // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable && (!has$b(descriptor, 'writable') || descriptor.writable) && (!has$b(descriptor, 'enumerable') || descriptor.enumerable)) {
      target[key] = descriptor.value;
      return target;
    }

    return nativeDefineProperty$1(target, key, descriptor);
  };

  if (DESCRIPTORS$9) {
    if (!NATIVE_ARRAY_BUFFER_VIEWS$2) {
      getOwnPropertyDescriptorModule$1.f = wrappedGetOwnPropertyDescriptor;
      definePropertyModule$6.f = wrappedDefineProperty;
      addGetter$1(TypedArrayPrototype$1, 'buffer');
      addGetter$1(TypedArrayPrototype$1, 'byteOffset');
      addGetter$1(TypedArrayPrototype$1, 'byteLength');
      addGetter$1(TypedArrayPrototype$1, 'length');
    }

    $$8({
      target: 'Object',
      stat: true,
      forced: !NATIVE_ARRAY_BUFFER_VIEWS$2
    }, {
      getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
      defineProperty: wrappedDefineProperty
    });

    module$1F.exports = function (TYPE, wrapper, CLAMPED) {
      var BYTES = TYPE.match(/\d+$/)[0] / 8;
      var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
      var GETTER = 'get' + TYPE;
      var SETTER = 'set' + TYPE;
      var NativeTypedArrayConstructor = global$g[CONSTRUCTOR_NAME];
      var TypedArrayConstructor = NativeTypedArrayConstructor;
      var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
      var exported = {};

      var getter = function getter(that, index) {
        var data = getInternalState$3(that);
        return data.view[GETTER](index * BYTES + data.byteOffset, true);
      };

      var setter = function setter(that, index, value) {
        var data = getInternalState$3(that);
        if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
        data.view[SETTER](index * BYTES + data.byteOffset, value, true);
      };

      var addElement = function addElement(that, index) {
        nativeDefineProperty$1(that, index, {
          get: function get() {
            return getter(this, index);
          },
          set: function set(value) {
            return setter(this, index, value);
          },
          enumerable: true
        });
      };

      if (!NATIVE_ARRAY_BUFFER_VIEWS$2) {
        TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
          anInstance$1(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
          var index = 0;
          var byteOffset = 0;
          var buffer, byteLength, length;

          if (!isObject$a(data)) {
            length = toIndex$1(data);
            byteLength = length * BYTES;
            buffer = new ArrayBuffer$3(byteLength);
          } else if (isArrayBuffer(data)) {
            buffer = data;
            byteOffset = toOffset(offset, BYTES);
            var $len = data.byteLength;

            if ($length === undefined) {
              if ($len % BYTES) throw RangeError$2(WRONG_LENGTH$1);
              byteLength = $len - byteOffset;
              if (byteLength < 0) throw RangeError$2(WRONG_LENGTH$1);
            } else {
              byteLength = toLength$e($length) * BYTES;
              if (byteLength + byteOffset > $len) throw RangeError$2(WRONG_LENGTH$1);
            }

            length = byteLength / BYTES;
          } else if (isTypedArray$1(data)) {
            return fromList(TypedArrayConstructor, data);
          } else {
            return typedArrayFrom.call(TypedArrayConstructor, data);
          }

          setInternalState$2(that, {
            buffer: buffer,
            byteOffset: byteOffset,
            byteLength: byteLength,
            length: length,
            view: new DataView$2(buffer)
          });

          while (index < length) {
            addElement(that, index++);
          }
        });
        if (setPrototypeOf$4) setPrototypeOf$4(TypedArrayConstructor, TypedArray$1);
        TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create$2(TypedArrayPrototype$1);
      } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
        TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
          anInstance$1(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
          return inheritIfRequired(function () {
            if (!isObject$a(data)) return new NativeTypedArrayConstructor(toIndex$1(data));
            if (isArrayBuffer(data)) return $length !== undefined ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length) : typedArrayOffset !== undefined ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES)) : new NativeTypedArrayConstructor(data);
            if (isTypedArray$1(data)) return fromList(TypedArrayConstructor, data);
            return typedArrayFrom.call(TypedArrayConstructor, data);
          }(), dummy, TypedArrayConstructor);
        });
        if (setPrototypeOf$4) setPrototypeOf$4(TypedArrayConstructor, TypedArray$1);
        forEach$1(getOwnPropertyNames$1(NativeTypedArrayConstructor), function (key) {
          if (!(key in TypedArrayConstructor)) {
            createNonEnumerableProperty$a(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
          }
        });
        TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
      }

      if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
        createNonEnumerableProperty$a(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
      }

      if (TYPED_ARRAY_TAG$1) {
        createNonEnumerableProperty$a(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG$1, CONSTRUCTOR_NAME);
      }

      exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;
      $$8({
        global: true,
        forced: TypedArrayConstructor != NativeTypedArrayConstructor,
        sham: !NATIVE_ARRAY_BUFFER_VIEWS$2
      }, exported);

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
        createNonEnumerableProperty$a(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
      }

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
        createNonEnumerableProperty$a(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
      }

      setSpecies(CONSTRUCTOR_NAME);
    };
  } else module$1F.exports = function () {
    /* empty */
  };

  var _internalsTypedArrayConstructor = module$1F.exports;

  var createTypedArrayConstructor = _internalsTypedArrayConstructor; // `Uint16Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects

  createTypedArrayConstructor('Uint16', function (init) {
    return function Uint16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  var module$1G = {
    exports: {}
  };
  var toObject$8 = _internalsToObject;
  var toAbsoluteIndex$4 = _internalsToAbsoluteIndex;
  var toLength$f = _internalsToLength;
  var min$5 = Math.min; // `Array.prototype.copyWithin` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin

  module$1G.exports = [].copyWithin || function copyWithin(target
  /* = 0 */
  , start
  /* = 0, end = @length */
  ) {
    var O = toObject$8(this);
    var len = toLength$f(O.length);
    var to = toAbsoluteIndex$4(target, len);
    var from = toAbsoluteIndex$4(start, len);
    var end = arguments.length > 2 ? arguments[2] : undefined;
    var count = min$5((end === undefined ? len : toAbsoluteIndex$4(end, len)) - from, len - to);
    var inc = 1;

    if (from < to && to < from + count) {
      inc = -1;
      from += count - 1;
      to += count - 1;
    }

    while (count-- > 0) {
      if (from in O) O[to] = O[from];else delete O[to];
      to += inc;
      from += inc;
    }

    return O;
  };

  var _internalsArrayCopyWithin = module$1G.exports;

  var ArrayBufferViewCore$1 = _internalsArrayBufferViewCore;
  var $copyWithin = _internalsArrayCopyWithin;
  var aTypedArray$1 = ArrayBufferViewCore$1.aTypedArray;
  var exportTypedArrayMethod$1 = ArrayBufferViewCore$1.exportTypedArrayMethod; // `%TypedArray%.prototype.copyWithin` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin

  exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start
  /* , end */
  ) {
    return $copyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
  });

  var ArrayBufferViewCore$2 = _internalsArrayBufferViewCore;
  var $every = _internalsArrayIteration.every;
  var aTypedArray$2 = ArrayBufferViewCore$2.aTypedArray;
  var exportTypedArrayMethod$2 = ArrayBufferViewCore$2.exportTypedArrayMethod; // `%TypedArray%.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every

  exportTypedArrayMethod$2('every', function every(callbackfn
  /* , thisArg */
  ) {
    return $every(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$3 = _internalsArrayBufferViewCore;
  var $fill = _internalsArrayFill;
  var aTypedArray$3 = ArrayBufferViewCore$3.aTypedArray;
  var exportTypedArrayMethod$3 = ArrayBufferViewCore$3.exportTypedArrayMethod; // `%TypedArray%.prototype.fill` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
  // eslint-disable-next-line no-unused-vars

  exportTypedArrayMethod$3('fill', function fill(value
  /* , start, end */
  ) {
    return $fill.apply(aTypedArray$3(this), arguments);
  });

  var ArrayBufferViewCore$4 = _internalsArrayBufferViewCore;
  var $filter$1 = _internalsArrayIteration.filter;
  var speciesConstructor$2 = _internalsSpeciesConstructor;
  var aTypedArray$4 = ArrayBufferViewCore$4.aTypedArray;
  var aTypedArrayConstructor$3 = ArrayBufferViewCore$4.aTypedArrayConstructor;
  var exportTypedArrayMethod$4 = ArrayBufferViewCore$4.exportTypedArrayMethod; // `%TypedArray%.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter

  exportTypedArrayMethod$4('filter', function filter(callbackfn
  /* , thisArg */
  ) {
    var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var C = speciesConstructor$2(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$3(C))(length);

    while (length > index) {
      result[index] = list[index++];
    }

    return result;
  });

  var ArrayBufferViewCore$5 = _internalsArrayBufferViewCore;
  var $find = _internalsArrayIteration.find;
  var aTypedArray$5 = ArrayBufferViewCore$5.aTypedArray;
  var exportTypedArrayMethod$5 = ArrayBufferViewCore$5.exportTypedArrayMethod; // `%TypedArray%.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find

  exportTypedArrayMethod$5('find', function find(predicate
  /* , thisArg */
  ) {
    return $find(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$6 = _internalsArrayBufferViewCore;
  var $findIndex = _internalsArrayIteration.findIndex;
  var aTypedArray$6 = ArrayBufferViewCore$6.aTypedArray;
  var exportTypedArrayMethod$6 = ArrayBufferViewCore$6.exportTypedArrayMethod; // `%TypedArray%.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex

  exportTypedArrayMethod$6('findIndex', function findIndex(predicate
  /* , thisArg */
  ) {
    return $findIndex(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$7 = _internalsArrayBufferViewCore;
  var $forEach$1 = _internalsArrayIteration.forEach;
  var aTypedArray$7 = ArrayBufferViewCore$7.aTypedArray;
  var exportTypedArrayMethod$7 = ArrayBufferViewCore$7.exportTypedArrayMethod; // `%TypedArray%.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach

  exportTypedArrayMethod$7('forEach', function forEach(callbackfn
  /* , thisArg */
  ) {
    $forEach$1(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$8 = _internalsArrayBufferViewCore;
  var $includes = _internalsArrayIncludes.includes;
  var aTypedArray$8 = ArrayBufferViewCore$8.aTypedArray;
  var exportTypedArrayMethod$8 = ArrayBufferViewCore$8.exportTypedArrayMethod; // `%TypedArray%.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes

  exportTypedArrayMethod$8('includes', function includes(searchElement
  /* , fromIndex */
  ) {
    return $includes(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$9 = _internalsArrayBufferViewCore;
  var $indexOf = _internalsArrayIncludes.indexOf;
  var aTypedArray$9 = ArrayBufferViewCore$9.aTypedArray;
  var exportTypedArrayMethod$9 = ArrayBufferViewCore$9.exportTypedArrayMethod; // `%TypedArray%.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof

  exportTypedArrayMethod$9('indexOf', function indexOf(searchElement
  /* , fromIndex */
  ) {
    return $indexOf(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var global$h = _internalsGlobal;
  var ArrayBufferViewCore$a = _internalsArrayBufferViewCore;
  var ArrayIterators = _modulesEsArrayIterator;
  var wellKnownSymbol$h = _internalsWellKnownSymbol;
  var ITERATOR$5 = wellKnownSymbol$h('iterator');
  var Uint8Array = global$h.Uint8Array;
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var aTypedArray$a = ArrayBufferViewCore$a.aTypedArray;
  var exportTypedArrayMethod$a = ArrayBufferViewCore$a.exportTypedArrayMethod;
  var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR$5];
  var CORRECT_ITER_NAME = !!nativeTypedArrayIterator && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

  var typedArrayValues = function values() {
    return arrayValues.call(aTypedArray$a(this));
  }; // `%TypedArray%.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries


  exportTypedArrayMethod$a('entries', function entries() {
    return arrayEntries.call(aTypedArray$a(this));
  }); // `%TypedArray%.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys

  exportTypedArrayMethod$a('keys', function keys() {
    return arrayKeys.call(aTypedArray$a(this));
  }); // `%TypedArray%.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values

  exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME); // `%TypedArray%.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator

  exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

  var ArrayBufferViewCore$b = _internalsArrayBufferViewCore;
  var aTypedArray$b = ArrayBufferViewCore$b.aTypedArray;
  var exportTypedArrayMethod$b = ArrayBufferViewCore$b.exportTypedArrayMethod;
  var $join = [].join; // `%TypedArray%.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
  // eslint-disable-next-line no-unused-vars

  exportTypedArrayMethod$b('join', function join(separator) {
    return $join.apply(aTypedArray$b(this), arguments);
  });

  var module$1H = {
    exports: {}
  };
  var toIndexedObject$4 = _internalsToIndexedObject;
  var toInteger$9 = _internalsToInteger;
  var toLength$g = _internalsToLength;
  var arrayMethodIsStrict$1 = _internalsArrayMethodIsStrict;
  var arrayMethodUsesToLength$4 = _internalsArrayMethodUsesToLength;
  var min$6 = Math.min;
  var nativeLastIndexOf = [].lastIndexOf;
  var NEGATIVE_ZERO = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
  var STRICT_METHOD$1 = arrayMethodIsStrict$1('lastIndexOf'); // For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method

  var USES_TO_LENGTH$4 = arrayMethodUsesToLength$4('indexOf', {
    ACCESSORS: true,
    1: 0
  });
  var FORCED$1 = NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$4; // `Array.prototype.lastIndexOf` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof

  module$1H.exports = FORCED$1 ? function lastIndexOf(searchElement
  /* , fromIndex = @[*-1] */
  ) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return nativeLastIndexOf.apply(this, arguments) || 0;
    var O = toIndexedObject$4(this);
    var length = toLength$g(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = min$6(index, toInteger$9(arguments[1]));
    if (index < 0) index = length + index;

    for (; index >= 0; index--) {
      if (index in O && O[index] === searchElement) return index || 0;
    }

    return -1;
  } : nativeLastIndexOf;
  var _internalsArrayLastIndexOf = module$1H.exports;

  var ArrayBufferViewCore$c = _internalsArrayBufferViewCore;
  var $lastIndexOf = _internalsArrayLastIndexOf;
  var aTypedArray$c = ArrayBufferViewCore$c.aTypedArray;
  var exportTypedArrayMethod$c = ArrayBufferViewCore$c.exportTypedArrayMethod; // `%TypedArray%.prototype.lastIndexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
  // eslint-disable-next-line no-unused-vars

  exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement
  /* , fromIndex */
  ) {
    return $lastIndexOf.apply(aTypedArray$c(this), arguments);
  });

  var ArrayBufferViewCore$d = _internalsArrayBufferViewCore;
  var $map$1 = _internalsArrayIteration.map;
  var speciesConstructor$3 = _internalsSpeciesConstructor;
  var aTypedArray$d = ArrayBufferViewCore$d.aTypedArray;
  var aTypedArrayConstructor$4 = ArrayBufferViewCore$d.aTypedArrayConstructor;
  var exportTypedArrayMethod$d = ArrayBufferViewCore$d.exportTypedArrayMethod; // `%TypedArray%.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map

  exportTypedArrayMethod$d('map', function map(mapfn
  /* , thisArg */
  ) {
    return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
      return new (aTypedArrayConstructor$4(speciesConstructor$3(O, O.constructor)))(length);
    });
  });

  var module$1I = {
    exports: {}
  };
  var aFunction$3 = _internalsAFunction;
  var toObject$9 = _internalsToObject;
  var IndexedObject$2 = _internalsIndexedObject;
  var toLength$h = _internalsToLength; // `Array.prototype.{ reduce, reduceRight }` methods implementation

  var createMethod$3 = function createMethod(IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aFunction$3(callbackfn);
      var O = toObject$9(that);
      var self = IndexedObject$2(O);
      var length = toLength$h(O.length);
      var index = IS_RIGHT ? length - 1 : 0;
      var i = IS_RIGHT ? -1 : 1;
      if (argumentsLength < 2) while (true) {
        if (index in self) {
          memo = self[index];
          index += i;
          break;
        }

        index += i;

        if (IS_RIGHT ? index < 0 : length <= index) {
          throw TypeError('Reduce of empty array with no initial value');
        }
      }

      for (; IS_RIGHT ? index >= 0 : length > index; index += i) {
        if (index in self) {
          memo = callbackfn(memo, self[index], index, O);
        }
      }

      return memo;
    };
  };

  module$1I.exports = {
    // `Array.prototype.reduce` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
    left: createMethod$3(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
    right: createMethod$3(true)
  };
  var _internalsArrayReduce = module$1I.exports;

  var ArrayBufferViewCore$e = _internalsArrayBufferViewCore;
  var $reduce = _internalsArrayReduce.left;
  var aTypedArray$e = ArrayBufferViewCore$e.aTypedArray;
  var exportTypedArrayMethod$e = ArrayBufferViewCore$e.exportTypedArrayMethod; // `%TypedArray%.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce

  exportTypedArrayMethod$e('reduce', function reduce(callbackfn
  /* , initialValue */
  ) {
    return $reduce(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$f = _internalsArrayBufferViewCore;
  var $reduceRight = _internalsArrayReduce.right;
  var aTypedArray$f = ArrayBufferViewCore$f.aTypedArray;
  var exportTypedArrayMethod$f = ArrayBufferViewCore$f.exportTypedArrayMethod; // `%TypedArray%.prototype.reduceRicht` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright

  exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn
  /* , initialValue */
  ) {
    return $reduceRight(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$g = _internalsArrayBufferViewCore;
  var aTypedArray$g = ArrayBufferViewCore$g.aTypedArray;
  var exportTypedArrayMethod$g = ArrayBufferViewCore$g.exportTypedArrayMethod;
  var floor$3 = Math.floor; // `%TypedArray%.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse

  exportTypedArrayMethod$g('reverse', function reverse() {
    var that = this;
    var length = aTypedArray$g(that).length;
    var middle = floor$3(length / 2);
    var index = 0;
    var value;

    while (index < middle) {
      value = that[index];
      that[index++] = that[--length];
      that[length] = value;
    }

    return that;
  });

  var ArrayBufferViewCore$h = _internalsArrayBufferViewCore;
  var speciesConstructor$4 = _internalsSpeciesConstructor;
  var fails$h = _internalsFails;
  var aTypedArray$h = ArrayBufferViewCore$h.aTypedArray;
  var aTypedArrayConstructor$5 = ArrayBufferViewCore$h.aTypedArrayConstructor;
  var exportTypedArrayMethod$h = ArrayBufferViewCore$h.exportTypedArrayMethod;
  var $slice = [].slice;
  var FORCED$2 = fails$h(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).slice();
  }); // `%TypedArray%.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice

  exportTypedArrayMethod$h('slice', function slice(start, end) {
    var list = $slice.call(aTypedArray$h(this), start, end);
    var C = speciesConstructor$4(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$5(C))(length);

    while (length > index) {
      result[index] = list[index++];
    }

    return result;
  }, FORCED$2);

  var ArrayBufferViewCore$i = _internalsArrayBufferViewCore;
  var $some = _internalsArrayIteration.some;
  var aTypedArray$i = ArrayBufferViewCore$i.aTypedArray;
  var exportTypedArrayMethod$i = ArrayBufferViewCore$i.exportTypedArrayMethod; // `%TypedArray%.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some

  exportTypedArrayMethod$i('some', function some(callbackfn
  /* , thisArg */
  ) {
    return $some(aTypedArray$i(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$j = _internalsArrayBufferViewCore;
  var aTypedArray$j = ArrayBufferViewCore$j.aTypedArray;
  var exportTypedArrayMethod$j = ArrayBufferViewCore$j.exportTypedArrayMethod;
  var $sort = [].sort; // `%TypedArray%.prototype.sort` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort

  exportTypedArrayMethod$j('sort', function sort(comparefn) {
    return $sort.call(aTypedArray$j(this), comparefn);
  });

  var global$i = _internalsGlobal;
  var ArrayBufferViewCore$k = _internalsArrayBufferViewCore;
  var fails$i = _internalsFails;
  var Int8Array$3 = global$i.Int8Array;
  var aTypedArray$k = ArrayBufferViewCore$k.aTypedArray;
  var exportTypedArrayMethod$k = ArrayBufferViewCore$k.exportTypedArrayMethod;
  var $toLocaleString = [].toLocaleString;
  var $slice$1 = [].slice; // iOS Safari 6.x fails here

  var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails$i(function () {
    $toLocaleString.call(new Int8Array$3(1));
  });
  var FORCED$3 = fails$i(function () {
    return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
  }) || !fails$i(function () {
    Int8Array$3.prototype.toLocaleString.call([1, 2]);
  }); // `%TypedArray%.prototype.toLocaleString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring

  exportTypedArrayMethod$k('toLocaleString', function toLocaleString() {
    return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$k(this)) : aTypedArray$k(this), arguments);
  }, FORCED$3);

  var exportTypedArrayMethod$l = _internalsArrayBufferViewCore.exportTypedArrayMethod;
  var fails$j = _internalsFails;
  var global$j = _internalsGlobal;
  var Uint8Array$1 = global$j.Uint8Array;
  var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype || {};
  var arrayToString = [].toString;
  var arrayJoin = [].join;

  if (fails$j(function () {
    arrayToString.call({});
  })) {
    arrayToString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString; // `%TypedArray%.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring

  exportTypedArrayMethod$l('toString', arrayToString, IS_NOT_ARRAY_METHOD);

  function allocate(dialogue) {
    var layer = dialogue.layer,
        margin = dialogue.margin,
        width = dialogue.width,
        height = dialogue.height,
        alignment = dialogue.alignment,
        end = dialogue.end;
    var stageWidth = this.width - (this.scale * (margin.left + margin.right) | 0);
    var stageHeight = this.height;
    var vertical = this.scale * margin.vertical | 0;
    var vct = this.video.currentTime * 100;
    this._.space[layer] = this._.space[layer] || {
      left: {
        width: new Uint16Array(stageHeight + 1),
        end: new Uint16Array(stageHeight + 1)
      },
      center: {
        width: new Uint16Array(stageHeight + 1),
        end: new Uint16Array(stageHeight + 1)
      },
      right: {
        width: new Uint16Array(stageHeight + 1),
        end: new Uint16Array(stageHeight + 1)
      }
    };
    var channel = this._.space[layer];
    var align = ['right', 'left', 'center'][alignment % 3];

    var willCollide = function willCollide(y) {
      var lw = channel.left.width[y];
      var cw = channel.center.width[y];
      var rw = channel.right.width[y];
      var le = channel.left.end[y];
      var ce = channel.center.end[y];
      var re = channel.right.end[y];
      return align === 'left' && (le > vct && lw || ce > vct && cw && 2 * width + cw > stageWidth || re > vct && rw && width + rw > stageWidth) || align === 'center' && (le > vct && lw && 2 * lw + width > stageWidth || ce > vct && cw || re > vct && rw && 2 * rw + width > stageWidth) || align === 'right' && (le > vct && lw && lw + width > stageWidth || ce > vct && cw && 2 * width + cw > stageWidth || re > vct && rw);
    };

    var count = 0;
    var result = 0;

    var find = function find(y) {
      count = willCollide(y) ? 0 : count + 1;

      if (count >= height) {
        result = y;
        return true;
      }

      return false;
    };

    if (alignment <= 3) {
      for (var i = stageHeight - vertical - 1; i > vertical; i--) {
        if (find(i)) break;
      }
    } else if (alignment >= 7) {
      for (var _i = vertical + 1; _i < stageHeight - vertical; _i++) {
        if (find(_i)) break;
      }
    } else {
      for (var _i2 = stageHeight - height >> 1; _i2 < stageHeight - vertical; _i2++) {
        if (find(_i2)) break;
      }
    }

    if (alignment > 3) {
      result -= height - 1;
    }

    for (var _i3 = result; _i3 < result + height; _i3++) {
      channel[align].width[_i3] = width;
      channel[align].end[_i3] = end * 100;
    }

    return result;
  }

  function getPosition(dialogue) {
    var effect = dialogue.effect,
        move = dialogue.move,
        alignment = dialogue.alignment,
        width = dialogue.width,
        height = dialogue.height,
        margin = dialogue.margin,
        slices = dialogue.slices;
    var x = 0;
    var y = 0;

    if (effect) {
      if (effect.name === 'banner') {
        if (alignment <= 3) y = this.height - height - margin.vertical;
        if (alignment >= 4 && alignment <= 6) y = (this.height - height) / 2;
        if (alignment >= 7) y = margin.vertical;
        x = effect.lefttoright ? -width : this.width;
      }
    } else if (dialogue.pos || move) {
      var pos = dialogue.pos || {
        x: 0,
        y: 0
      };
      if (alignment % 3 === 1) x = this.scale * pos.x;
      if (alignment % 3 === 2) x = this.scale * pos.x - width / 2;
      if (alignment % 3 === 0) x = this.scale * pos.x - width;
      if (alignment <= 3) y = this.scale * pos.y - height;
      if (alignment >= 4 && alignment <= 6) y = this.scale * pos.y - height / 2;
      if (alignment >= 7) y = this.scale * pos.y;
    } else {
      if (alignment % 3 === 1) x = 0;
      if (alignment % 3 === 2) x = (this.width - width) / 2;
      if (alignment % 3 === 0) x = this.width - width - this.scale * margin.right;
      var hasT = slices.some(function (slice) {
        return slice.fragments.some(function (_ref) {
          var animationName = _ref.animationName;
          return animationName;
        });
      });

      if (hasT) {
        if (alignment <= 3) y = this.height - height - margin.vertical;
        if (alignment >= 4 && alignment <= 6) y = (this.height - height) / 2;
        if (alignment >= 7) y = margin.vertical;
      } else {
        y = allocate.call(this, dialogue);
      }
    }

    return {
      x,
      y
    };
  }

  function createStyle(dialogue) {
    var layer = dialogue.layer,
        alignment = dialogue.alignment,
        effect = dialogue.effect,
        pos = dialogue.pos,
        margin = dialogue.margin;
    var width = dialogue.width,
        height = dialogue.height,
        x = dialogue.x,
        y = dialogue.y;
    var cssText = '';
    if (layer) cssText += "z-index:".concat(layer, ";");
    cssText += "text-align:".concat(['right', 'left', 'center'][alignment % 3], ";");

    if (!effect) {
      var mw = this.width - this.scale * (margin.left + margin.right);
      cssText += "max-width:".concat(mw, "px;");

      if (!pos) {
        if (alignment % 3 === 1) {
          cssText += "margin-left:".concat(this.scale * margin.left, "px;");
        }

        if (alignment % 3 === 0) {
          cssText += "margin-right:".concat(this.scale * margin.right, "px;");
        }

        if (width > this.width - this.scale * (margin.left + margin.right)) {
          cssText += "margin-left:".concat(this.scale * margin.left, "px;");
          cssText += "margin-right:".concat(this.scale * margin.right, "px;");
        }
      }
    }

    cssText += "width:".concat(width, "px;height:").concat(height, "px;left:").concat(x, "px;top:").concat(y, "px;");
    return cssText;
  }

  function renderer(dialogue) {
    var $div = createDialogue.call(this, dialogue);
    assign(dialogue, {
      $div
    });

    this._.$stage.appendChild($div);

    var _$div$getBoundingClie = $div.getBoundingClientRect(),
        width = _$div$getBoundingClie.width,
        height = _$div$getBoundingClie.height;

    assign(dialogue, {
      width,
      height
    });
    assign(dialogue, getPosition.call(this, dialogue));
    $div.style.cssText = createStyle.call(this, dialogue);
    setTransformOrigin(dialogue);
    setClipPath.call(this, dialogue);
    return dialogue;
  }

  function framing() {
    var vct = this.video.currentTime;

    for (var i = this._.stagings.length - 1; i >= 0; i--) {
      var dia = this._.stagings[i];
      var end = dia.end;

      if (dia.effect && /scroll/.test(dia.effect.name)) {
        var _dia$effect = dia.effect,
            y1 = _dia$effect.y1,
            y2 = _dia$effect.y2,
            delay = _dia$effect.delay;
        var duration = ((y2 || this._.resampledRes.height) - y1) / (1000 / delay);
        end = Math.min(end, dia.start + duration);
      }

      if (end < vct) {
        this._.$stage.removeChild(dia.$div);

        if (dia.$clipPath) {
          this._.$defs.removeChild(dia.$clipPath);
        }

        this._.stagings.splice(i, 1);
      }
    }

    var dias = this.dialogues;

    while (this._.index < dias.length && vct >= dias[this._.index].start) {
      if (vct < dias[this._.index].end) {
        var _dia = renderer.call(this, dias[this._.index]);

        if (!this.video.paused) {
          batchAnimate(_dia.$div, 'play');
        }

        this._.stagings.push(_dia);
      }

      ++this._.index;
    }
  }

  function play() {
    var _this = this;

    var frame = function frame() {
      framing.call(_this);
      _this._.requestId = requestAnimationFrame(frame);
    };

    cancelAnimationFrame(this._.requestId);
    this._.requestId = requestAnimationFrame(frame);

    this._.stagings.forEach(function (_ref) {
      var $div = _ref.$div;
      batchAnimate($div, 'play');
    });

    return this;
  }

  function pause() {
    cancelAnimationFrame(this._.requestId);
    this._.requestId = 0;

    this._.stagings.forEach(function (_ref) {
      var $div = _ref.$div;
      batchAnimate($div, 'pause');
    });

    return this;
  }

  function clear() {
    while (this._.$stage.lastChild) {
      this._.$stage.removeChild(this._.$stage.lastChild);
    }

    while (this._.$defs.lastChild) {
      this._.$defs.removeChild(this._.$defs.lastChild);
    }

    this._.stagings = [];
    this._.space = [];
  }

  function seek() {
    var vct = this.video.currentTime;
    var dias = this.dialogues;
    clear.call(this);

    this._.index = function () {
      var from = 0;
      var to = dias.length - 1;

      while (from + 1 < to && vct > dias[to + from >> 1].end) {
        from = to + from >> 1;
      }

      if (!from) return 0;

      for (var i = from; i < to; i++) {
        if (dias[i].end > vct && vct >= dias[i].start || i && dias[i - 1].end < vct && vct < dias[i].start) {
          return i;
        }
      }

      return to;
    }();

    framing.call(this);
  }

  function bindEvents() {
    var l = this._.listener;
    l.play = play.bind(this);
    l.pause = pause.bind(this);
    l.seeking = seek.bind(this);
    this.video.addEventListener('play', l.play);
    this.video.addEventListener('pause', l.pause);
    this.video.addEventListener('seeking', l.seeking);
  }
  function unbindEvents() {
    var l = this._.listener;
    this.video.removeEventListener('play', l.play);
    this.video.removeEventListener('pause', l.pause);
    this.video.removeEventListener('seeking', l.seeking);
    l.play = null;
    l.pause = null;
    l.seeking = null;
  }

  function mergeT(ts) {
    return ts.reduceRight(function (results, t) {
      var merged = false;
      return results.map(function (r) {
        merged = t.t1 === r.t1 && t.t2 === r.t2 && t.accel === r.accel;
        return assign({}, r, merged ? {
          tag: assign({}, r.tag, t.tag)
        } : {});
      }).concat(merged ? [] : t);
    }, []);
  }

  function createEffectKeyframes(_ref) {
    var _this = this;

    var effect = _ref.effect,
        duration = _ref.duration; // TODO: when effect and move both exist, its behavior is weird, for now only move works.

    var name = effect.name,
        delay = effect.delay,
        lefttoright = effect.lefttoright,
        y1 = effect.y1;
    var y2 = effect.y2 || this._.resampledRes.height;

    if (name === 'banner') {
      var tx = this.scale * (duration / delay) * (lefttoright ? 1 : -1);
      return [0, "".concat(tx, "px")].map(function (x, i) {
        return {
          offset: i,
          transform: "translateX(".concat(x, ")")
        };
      });
    }

    if (/^scroll/.test(name)) {
      var updown = /up/.test(name) ? -1 : 1;
      var dp = (y2 - y1) / (duration / delay);
      return [y1, y2].map(function (y) {
        return _this.scale * y * updown;
      }).map(function (y, i) {
        return {
          offset: Math.min(i, dp),
          transform: "translateY".concat(y)
        };
      });
    }

    return [];
  }

  function createMoveKeyframes(_ref2) {
    var _this2 = this;

    var move = _ref2.move,
        duration = _ref2.duration,
        dialogue = _ref2.dialogue;
    var x1 = move.x1,
        y1 = move.y1,
        x2 = move.x2,
        y2 = move.y2,
        t1 = move.t1,
        t2 = move.t2;
    var t = [t1, t2 || duration];
    var pos = dialogue.pos || {
      x: 0,
      y: 0
    };
    return [[x1, y1], [x2, y2]].map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          x = _ref4[0],
          y = _ref4[1];

      return [_this2.scale * (x - pos.x), _this2.scale * (y - pos.y)];
    }).map(function (_ref5, index) {
      var _ref6 = _slicedToArray(_ref5, 2),
          x = _ref6[0],
          y = _ref6[1];

      return {
        offset: Math.min(t[index] / duration, 1),
        transform: "translate(".concat(x, "px, ").concat(y, "px)")
      };
    });
  }

  function createFadeKeyframes(_ref7) {
    var fade = _ref7.fade,
        duration = _ref7.duration;

    if (fade.type === 'fad') {
      var _t = fade.t1,
          _t2 = fade.t2;
      var kfs = [[0, 0]];

      if (_t < duration) {
        kfs.push([_t / duration, 1]);

        if (_t + _t2 < duration) {
          kfs.push([(duration - _t2) / duration, 1]);
        }

        kfs.push([1, 0]);
      } else {
        kfs.push([1, duration / _t]);
      }

      return kfs.map(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
            offset = _ref9[0],
            opacity = _ref9[1];

        return {
          offset,
          opacity
        };
      });
    }

    var a1 = fade.a1,
        a2 = fade.a2,
        a3 = fade.a3,
        t1 = fade.t1,
        t2 = fade.t2,
        t3 = fade.t3,
        t4 = fade.t4;
    var opacities = [a1, a2, a3].map(function (a) {
      return 1 - a / 255;
    });
    return [0, t1, t2, t3, t4, duration].map(function (t) {
      return t / duration;
    }).map(function (t, i) {
      return {
        offset: t,
        opacity: opacities[i >> 1]
      };
    }).filter(function (_ref10) {
      var offset = _ref10.offset;
      return offset <= 1;
    });
  }

  function createTransformKeyframes(_ref11) {
    var fromTag = _ref11.fromTag,
        tag = _ref11.tag,
        fragment = _ref11.fragment;
    var hasTransfrom = transformTags.some(function (x) {
      return tag[x] !== undefined && tag[x] !== fromTag[x];
    });
    if (!hasTransfrom) return null;
    var toTag = assign({}, fromTag, tag);

    if (fragment.drawing) {
      // scales will be handled inside svg
      assign(toTag, {
        p: 0,
        fscx: (tag.fscx || fromTag.fscx) / fromTag.fscx * 100,
        fscy: (tag.fscy || fromTag.fscy) / fromTag.fscy * 100
      });
      assign(fromTag, {
        fscx: 100,
        fscy: 100
      });
    }

    return ['transform', createTransform(fromTag), createTransform(toTag)];
  }

  function setKeyframes(dialogue) {
    var _this3 = this;

    var start = dialogue.start,
        end = dialogue.end,
        effect = dialogue.effect,
        move = dialogue.move,
        fade = dialogue.fade,
        slices = dialogue.slices;
    var duration = (end - start) * 1000;
    var keyframes = [].concat(_toConsumableArray(effect && !move ? createEffectKeyframes.call(this, {
      effect,
      duration
    }) : []), _toConsumableArray(move ? createMoveKeyframes.call(this, {
      move,
      duration,
      dialogue
    }) : []), _toConsumableArray(fade ? createFadeKeyframes({
      fade,
      duration
    }) : []));

    if (keyframes.length) {
      assign(dialogue, {
        keyframes
      }); // const delay = Math.min(0, dialogue.start - this.video.currentTime) * 1000;
      // const animation = $div.animate(keyframes, { duration, delay, fill: 'forwards' });
      // animation.pause();
    }

    slices.forEach(function (slice) {
      var sliceTag = _this3.styles[slice.style].tag;
      slice.fragments.forEach(function (fragment) {
        if (!fragment.tag.t || !fragment.tag.t.length) {
          return;
        }

        var fromTag = assign({}, sliceTag, fragment.tag);
        var kfs = mergeT(fragment.tag.t).map(function (_ref12) {
          var t1 = _ref12.t1,
              t2 = _ref12.t2,
              tag = _ref12.tag;
          var hasAlpha = tag.a1 !== undefined && tag.a1 === tag.a2 && tag.a2 === tag.a3 && tag.a3 === tag.a4;
          return [tag.fs && ['font-size', "".concat(_this3.scale * getRealFontSize(fromTag.fn, fromTag.fs), "px"), "".concat(_this3.scale * getRealFontSize(tag.fn, fromTag.fs), "px")], tag.fsp && ['letter-spacing', "".concat(_this3.scale * fromTag.fsp, "px"), "".concat(_this3.scale * tag.fsp, "px")], (tag.c1 || tag.a1 && !hasAlpha) && ['color', color2rgba(fromTag.a1 + fromTag.c1), color2rgba((tag.a1 || fromTag.a1) + (tag.c1 || fromTag.c1))], hasAlpha && ['opacity', 1 - parseInt(fromTag.a1, 16) / 255, 1 - parseInt(tag.a1, 16) / 255], createTransformKeyframes({
            fromTag,
            tag,
            fragment
          })].filter(function (x) {
            return x;
          }).map(function (_ref13) {
            var _ref14 = _slicedToArray(_ref13, 3),
                prop = _ref14[0],
                from = _ref14[1],
                to = _ref14[2];

            var values = [from, from, to, to];
            return [0, t1, t2, duration].map(function (t) {
              return t / duration;
            }).map(function (offset, i) {
              return {
                offset,
                [prop]: values[i]
              };
            });
          });
        }).flat(2);

        if (kfs.length) {
          assign(fragment, {
            keyframes: kfs
          });
        }
      });
    });
  }

  function resize() {
    var _this = this;

    var cw = this.video.clientWidth;
    var ch = this.video.clientHeight;
    var vw = this.video.videoWidth || cw;
    var vh = this.video.videoHeight || ch;
    var sw = this._.scriptRes.width;
    var sh = this._.scriptRes.height;
    var rw = sw;
    var rh = sh;
    var videoScale = Math.min(cw / vw, ch / vh);

    if (this.resampling === 'video_width') {
      rh = sw / vw * vh;
    }

    if (this.resampling === 'video_height') {
      rw = sh / vh * vw;
    }

    this.scale = Math.min(cw / rw, ch / rh);

    if (this.resampling === 'script_width') {
      this.scale = videoScale * (vw / rw);
    }

    if (this.resampling === 'script_height') {
      this.scale = videoScale * (vh / rh);
    }

    this.width = this.scale * rw;
    this.height = this.scale * rh;
    this._.resampledRes = {
      width: rw,
      height: rh
    };
    this.container.style.cssText = "width:".concat(cw, "px;height:").concat(ch, "px;");
    var cssText = "width:".concat(this.width, "px;") + "height:".concat(this.height, "px;") + "top:".concat((ch - this.height) / 2, "px;") + "left:".concat((cw - this.width) / 2, "px;");
    this._.$stage.style.cssText = cssText;
    this._.$svg.style.cssText = cssText;

    this._.$svg.setAttributeNS(null, 'viewBox', "0 0 ".concat(sw, " ").concat(sh));

    this.dialogues.forEach(function (dialogue) {
      setKeyframes.call(_this, dialogue);
    });
    seek.call(this);
    return this;
  }

  var GLOBAL_CSS = '.ASS-container,.ASS-stage{position:relative;overflow:hidden}.ASS-container video{position:absolute;top:0;left:0}.ASS-stage{pointer-events:none;position:absolute}.ASS-dialogue{font-size:0;position:absolute;z-index:0}.ASS-dialogue [data-stroke]{position:relative}.ASS-dialogue [data-stroke]::after,.ASS-dialogue [data-stroke]::before{content:attr(data-stroke);position:absolute;top:0;left:0;z-index:-1;filter:var(--ass-blur)}.ASS-dialogue [data-stroke]::before{color:var(--ass-shadow-color);transform:translate(var(--ass-shadow-offset));-webkit-text-stroke:var(--ass-border-width) var(--ass-shadow-color);text-shadow:var(--ass-shadow-delta);opacity:var(--ass-shadow-opacity)}.ASS-dialogue [data-stroke]::after{-webkit-text-stroke:var(--ass-border-width) var(--ass-border-color);text-shadow:var(--ass-border-delta);opacity:var(--ass-border-opacity)}.ASS-fix-font-size{position:absolute;visibility:hidden}.ASS-fix-objectBoundingBox{width:100%;height:100%;position:absolute;top:0;left:0}';
  function init(source, video) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.scale = 1; // private variables

    this._ = {
      index: 0,
      stagings: [],
      space: [],
      listener: {},
      $svg: createSVGEl('svg'),
      $defs: createSVGEl('defs'),
      $stage: document.createElement('div')
    };

    this._.$svg.appendChild(this._.$defs);

    this._.$stage.className = 'ASS-stage';
    this._.resampling = options.resampling || 'video_height';
    this.container = options.container || document.createElement('div');
    this.container.classList.add('ASS-container');
    this.container.appendChild($fixFontSize);
    this.container.appendChild(this._.$svg);
    this._.hasInitContainer = !!options.container;
    this.video = video;
    bindEvents.call(this);

    if (!this._.hasInitContainer) {
      var isPlaying = !video.paused;
      video.parentNode.insertBefore(this.container, video);
      this.container.appendChild(video);

      if (isPlaying && video.paused) {
        video.play();
      }
    }

    this.container.appendChild(this._.$stage);

    var _compile = compile(source),
        info = _compile.info,
        width = _compile.width,
        height = _compile.height,
        styles = _compile.styles,
        dialogues = _compile.dialogues;

    this.info = info;
    this._.scriptRes = {
      width: width || video.videoWidth,
      height: height || video.videoHeight
    };
    this.styles = styles;
    this.dialogues = dialogues;
    var styleRoot = getStyleRoot(this.container);
    var $style = styleRoot.querySelector('#ASS-global-style');

    if (!$style) {
      $style = document.createElement('style');
      $style.type = 'text/css';
      $style.id = 'ASS-global-style';
      $style.appendChild(document.createTextNode(GLOBAL_CSS));
      styleRoot.appendChild($style);
    }

    resize.call(this);

    if (!this.video.paused) {
      seek.call(this);
      play.call(this);
    }

    return this;
  }

  function show() {
    this._.$stage.style.visibility = 'visible';
    return this;
  }

  function hide() {
    this._.$stage.style.visibility = 'hidden';
    return this;
  }

  function destroy() {
    pause.call(this);
    clear.call(this);
    unbindEvents.call(this, this._.listener);

    if (!this._.hasInitContainer) {
      var isPlay = !this.video.paused;
      this.container.parentNode.insertBefore(this.video, this.container);
      this.container.parentNode.removeChild(this.container);

      if (isPlay && this.video.paused) {
        this.video.play();
      }
    } // eslint-disable-next-line no-restricted-syntax


    for (var key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = null;
      }
    }

    return this;
  }

  var regex = /^(video|script)_(width|height)$/;
  function getter() {
    return regex.test(this._.resampling) ? this._.resampling : 'video_height';
  }
  function setter(r) {
    if (r === this._.resampling) return r;

    if (regex.test(r)) {
      this._.resampling = r;
      this.resize();
    }

    return this._.resampling;
  }

  var ASS = /*#__PURE__*/function () {
    function ASS(source, video, options) {
      _classCallCheck(this, ASS);

      if (typeof source !== 'string') {
        return this;
      }

      return init.call(this, source, video, options);
    }

    _createClass(ASS, [{
      key: "resize",
      value: function resize$1() {
        return resize.call(this);
      }
    }, {
      key: "show",
      value: function show$1() {
        return show.call(this);
      }
    }, {
      key: "hide",
      value: function hide$1() {
        return hide.call(this);
      }
    }, {
      key: "destroy",
      value: function destroy$1() {
        return destroy.call(this);
      }
    }, {
      key: "resampling",
      get: function get() {
        return getter.call(this);
      },
      set: function set(r) {
        return setter.call(this, r);
      }
    }]);

    return ASS;
  }();

  return ASS;

})));
