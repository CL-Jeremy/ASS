function parseEffect(text) {
  const param = text
    .toLowerCase()
    .trim()
    .split(/\s*;\s*/);
  if (param[0] === 'banner') {
    return {
      name: param[0],
      delay: param[1] * 1 || 0,
      leftToRight: param[2] * 1 || 0,
      fadeAwayWidth: param[3] * 1 || 0,
    };
  }
  if (/^scroll\s/.test(param[0])) {
    return {
      name: param[0],
      y1: Math.min(param[1] * 1, param[2] * 1),
      y2: Math.max(param[1] * 1, param[2] * 1),
      delay: param[3] * 1 || 0,
      fadeAwayHeight: param[4] * 1 || 0,
    };
  }
  return null;
}

function parseDrawing(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    // numbers
    .replace(/([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)/g, ' $1 ')
    // commands
    .replace(/([mnlbspc])/g, ' $1 ')
    .trim()
    .replace(/\s+/g, ' ')
    .split(/\s(?=[mnlbspc])/)
    .map((cmd) => (
      cmd.split(' ')
        .filter((x, i) => !(i && Number.isNaN(x * 1)))
    ));
}

const numTags = [
  'b', 'i', 'u', 's', 'fsp',
  'k', 'K', 'kf', 'ko', 'kt',
  'fe', 'q', 'p', 'pbo', 'a', 'an',
  'fscx', 'fscy', 'fax', 'fay', 'frx', 'fry', 'frz', 'fr',
  'be', 'blur', 'bord', 'xbord', 'ybord', 'shad', 'xshad', 'yshad',
];

const numRegexs = numTags.map((nt) => ({ name: nt, regex: new RegExp(`^${nt}-?\\d`) }));

function parseTag(text) {
  const tag = {};
  for (let i = 0; i < numRegexs.length; i++) {
    const { name, regex } = numRegexs[i];
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
    const [, num, color] = text.match(/^(\d?)c&?H?(\w*)/);
    tag[`c${num || 1}`] = color && `000000${color}`.slice(-6);
  } else if (/^\da&?H?[0-9a-f]+/i.test(text)) {
    const [, num, alpha] = text.match(/^(\d)a&?H?(\w\w)/);
    tag[`a${num}`] = alpha;
  } else if (/^alpha&?H?[0-9a-f]+/i.test(text)) {
    [, tag.alpha] = text.match(/^alpha&?H?([0-9a-f]+)/i);
    tag.alpha = `00${tag.alpha}`.slice(-2);
  } else if (/^(?:pos|org|move|fad|fade)\(/.test(text)) {
    const [, key, value] = text.match(/^(\w+)\((.*?)\)?$/);
    tag[key] = value
      .trim()
      .split(/\s*,\s*/)
      .map(Number);
  } else if (/^i?clip/.test(text)) {
    const p = text
      .match(/^i?clip\((.*?)\)?$/)[1]
      .trim()
      .split(/\s*,\s*/);
    tag.clip = {
      inverse: /iclip/.test(text),
      scale: 1,
      drawing: null,
      dots: null,
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
    const p = text
      .match(/^t\((.*?)\)?$/)[1]
      .trim()
      .replace(/\\.*/, (x) => x.replace(/,/g, '\n'))
      .split(/\s*,\s*/);
    if (!p[0]) return tag;
    tag.t = {
      t1: 0,
      t2: 0,
      accel: 1,
      tags: p[p.length - 1]
        .replace(/\n/g, ',')
        .split('\\')
        .slice(1)
        .map(parseTag),
    };
    if (p.length === 2) {
      tag.t.accel = p[0] * 1;
    }
    if (p.length === 3) {
      tag.t.t1 = p[0] * 1;
      tag.t.t2 = p[1] * 1;
    }
    if (p.length === 4) {
      tag.t.t1 = p[0] * 1;
      tag.t.t2 = p[1] * 1;
      tag.t.accel = p[2] * 1;
    }
  }

  return tag;
}

function parseTags(text) {
  const tags = [];
  let depth = 0;
  let str = '';
  for (let i = 0; i < text.length; i++) {
    const x = text[i];
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
  const pairs = text.split(/{([^{}]*?)}/);
  const parsed = [];
  if (pairs[0].length) {
    parsed.push({ tags: [], text: pairs[0], drawing: [] });
  }
  for (let i = 1; i < pairs.length; i += 2) {
    const tags = parseTags(pairs[i]);
    const isDrawing = tags.reduce((v, tag) => (tag.p === undefined ? v : !!tag.p), false);
    parsed.push({
      tags,
      text: isDrawing ? '' : pairs[i + 1],
      drawing: isDrawing ? parseDrawing(pairs[i + 1]) : [],
    });
  }
  return {
    raw: text,
    combined: parsed.map((frag) => frag.text).join(''),
    parsed,
  };
}

function parseTime(time) {
  const t = time.split(':');
  return t[0] * 3600 + t[1] * 60 + t[2] * 1;
}

function parseDialogue(text, format) {
  let fields = text.split(',');
  if (fields.length > format.length) {
    const textField = fields.slice(format.length - 1).join();
    fields = fields.slice(0, format.length - 1);
    fields.push(textField);
  }

  const dia = {};
  for (let i = 0; i < fields.length; i++) {
    const fmt = format[i];
    const fld = fields[i].trim();
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

const assign = Object.assign || (
  /* istanbul ignore next */
  function assign(target, ...sources) {
    for (let i = 0; i < sources.length; i++) {
      if (!sources[i]) continue;
      const keys = Object.keys(sources[i]);
      for (let j = 0; j < keys.length; j++) {
        // eslint-disable-next-line no-param-reassign
        target[keys[j]] = sources[i][keys[j]];
      }
    }
    return target;
  }
);

function parseStyle(text, format) {
  const values = text.match(/Style\s*:\s*(.*)/i)[1].split(/\s*,\s*/);
  return assign({}, ...format.map((fmt, idx) => ({ [fmt]: values[idx] })));
}

function parse(text) {
  const tree = {
    info: {},
    styles: { format: [], style: [] },
    events: { format: [], comment: [], dialogue: [] },
  };
  const lines = text.split(/\r?\n/);
  let state = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^;/.test(line)) continue;

    if (/^\[Script Info\]/i.test(line)) state = 1;
    else if (/^\[V4\+? Styles\]/i.test(line)) state = 2;
    else if (/^\[Events\]/i.test(line)) state = 3;
    else if (/^\[.*\]/.test(line)) state = 0;

    if (state === 0) continue;
    if (state === 1) {
      if (/:/.test(line)) {
        const [, key, value] = line.match(/(.*?)\s*:\s*(.*)/);
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
        const [, key, value] = line.match(/^(\w+?)\s*:\s*(.*)/i);
        tree.events[key.toLowerCase()].push(parseDialogue(value, tree.events.format));
      }
    }
  }

  return tree;
}

function createCommand(arr) {
  const cmd = {
    type: null,
    prev: null,
    next: null,
    points: [],
  };
  if (/[mnlbs]/.test(arr[0])) {
    cmd.type = arr[0]
      .toUpperCase()
      .replace('N', 'L')
      .replace('B', 'C');
  }
  for (let len = arr.length - !(arr.length & 1), i = 1; i < len; i += 2) {
    cmd.points.push({ x: arr[i] * 1, y: arr[i + 1] * 1 });
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
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  [].concat(...commands.map(({ points }) => points)).forEach(({ x, y }) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });
  return {
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
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
  const results = [];
  const bb1 = [0, 2 / 3, 1 / 3, 0];
  const bb2 = [0, 1 / 3, 2 / 3, 0];
  const bb3 = [0, 1 / 6, 2 / 3, 1 / 6];
  const dot4 = (a, b) => (a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]);
  let px = [points[points.length - 1].x, points[0].x, points[1].x, points[2].x];
  let py = [points[points.length - 1].y, points[0].y, points[1].y, points[2].y];
  results.push({
    type: prev === 'M' ? 'M' : 'L',
    points: [{ x: dot4(bb3, px), y: dot4(bb3, py) }],
  });
  for (let i = 3; i < points.length; i++) {
    px = [points[i - 3].x, points[i - 2].x, points[i - 1].x, points[i].x];
    py = [points[i - 3].y, points[i - 2].y, points[i - 1].y, points[i].y];
    results.push({
      type: 'C',
      points: [
        { x: dot4(bb1, px), y: dot4(bb1, py) },
        { x: dot4(bb2, px), y: dot4(bb2, py) },
        { x: dot4(bb3, px), y: dot4(bb3, py) },
      ],
    });
  }
  if (next === 'L' || next === 'C') {
    const last = points[points.length - 1];
    results.push({ type: 'L', points: [{ x: last.x, y: last.y }] });
  }
  return results;
}

function toSVGPath(instructions) {
  return instructions.map(({ type, points }) => (
    type + points.map(({ x, y }) => `${x},${y}`).join(',')
  )).join('');
}

function compileDrawing(rawCommands) {
  const commands = [];
  let i = 0;
  while (i < rawCommands.length) {
    const arr = rawCommands[i];
    const cmd = createCommand(arr);
    if (isValid(cmd)) {
      if (cmd.type === 'S') {
        const { x, y } = (commands[i - 1] || { points: [{ x: 0, y: 0 }] }).points.slice(-1)[0];
        cmd.points.unshift({ x, y });
      }
      if (i) {
        cmd.prev = commands[i - 1].type;
        commands[i - 1].next = cmd.type;
      }
      commands.push(cmd);
      i++;
    } else {
      if (i && commands[i - 1].type === 'S') {
        const additionPoints = {
          p: cmd.points,
          c: commands[i - 1].points.slice(0, 3),
        };
        commands[i - 1].points = commands[i - 1].points.concat(
          (additionPoints[arr[0]] || []).map(({ x, y }) => ({ x, y })),
        );
      }
      rawCommands.splice(i, 1);
    }
  }
  const instructions = [].concat(
    ...commands.map(({ type, points, prev, next }) => (
      type === 'S'
        ? s2b(points, prev, next)
        : { type, points }
    )),
  );

  return assign({ instructions, d: toSVGPath(instructions) }, getViewBox(commands));
}

const tTags = [
  'fs', 'clip',
  'c1', 'c2', 'c3', 'c4', 'a1', 'a2', 'a3', 'a4', 'alpha',
  'fscx', 'fscy', 'fax', 'fay', 'frx', 'fry', 'frz', 'fr',
  'be', 'blur', 'bord', 'xbord', 'ybord', 'shad', 'xshad', 'yshad',
];

function compileTag(tag, key, presets = {}) {
  let value = tag[key];
  if (value === undefined) {
    return null;
  }
  if (key === 'pos' || key === 'org') {
    return value.length === 2 ? { [key]: { x: value[0], y: value[1] } } : null;
  }
  if (key === 'move') {
    const [x1, y1, x2, y2, t1 = 0, t2 = 0] = value;
    return value.length === 4 || value.length === 6
      ? { move: { x1, y1, x2, y2, t1, t2 } }
      : null;
  }
  if (key === 'fad' || key === 'fade') {
    if (value.length === 2) {
      const [t1, t2] = value;
      return { fade: { type: 'fad', t1, t2 } };
    }
    if (value.length === 7) {
      const [a1, a2, a3, t1, t2, t3, t4] = value;
      return { fade: { type: 'fade', a1, a2, a3, t1, t2, t3, t4 } };
    }
    return null;
  }
  if (key === 'clip') {
    const { inverse, scale, drawing, dots } = value;
    if (drawing) {
      return { clip: { inverse, scale, drawing: compileDrawing(drawing), dots } };
    }
    if (dots) {
      const [x1, y1, x2, y2] = dots;
      return { clip: { inverse, scale, drawing, dots: { x1, y1, x2, y2 } } };
    }
    return null;
  }
  if (/^[xy]?(bord|shad)$/.test(key)) {
    value = Math.max(value, 0);
  }
  if (key === 'bord') {
    return { xbord: value, ybord: value };
  }
  if (key === 'shad') {
    return { xshad: value, yshad: value };
  }
  if (/^c\d$/.test(key)) {
    return { [key]: value || presets[key] };
  }
  if (key === 'alpha') {
    return { a1: value, a2: value, a3: value, a4: value };
  }
  if (key === 'fr') {
    return { frz: value };
  }
  if (key === 'fs') {
    return {
      fs: /^\+|-/.test(value)
        ? (value * 1 > -10 ? (1 + value / 10) : 1) * presets.fs
        : value * 1,
    };
  }
  if (key === 'K') {
    return { kf: value };
  }
  if (key === 't') {
    const { t1, accel, tags } = value;
    const t2 = value.t2 || (presets.end - presets.start) * 1e3;
    const compiledTag = {};
    tags.forEach((t) => {
      const k = Object.keys(t)[0];
      if (~tTags.indexOf(k) && !(k === 'clip' && !t[k].dots)) {
        assign(compiledTag, compileTag(t, k, presets));
      }
    });
    return { t: { t1, t2, accel, tag: compiledTag } };
  }
  return { [key]: value };
}

const a2an = [
  null, 1, 2, 3,
  null, 7, 8, 9,
  null, 4, 5, 6,
];

const globalTags = ['r', 'a', 'an', 'pos', 'org', 'move', 'fade', 'fad', 'clip'];

function inheritTag(pTag) {
  return JSON.parse(JSON.stringify(assign({}, pTag, {
    k: undefined,
    kf: undefined,
    ko: undefined,
    kt: undefined,
  })));
}

function compileText({ styles, style, parsed, start, end }) {
  let alignment;
  let pos;
  let org;
  let move;
  let fade;
  let clip;
  const slices = [];
  let slice = { style, fragments: [] };
  let prevTag = {};
  for (let i = 0; i < parsed.length; i++) {
    const { tags, text, drawing } = parsed[i];
    let reset;
    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j];
      reset = tag.r === undefined ? reset : tag.r;
    }
    const fragment = {
      tag: reset === undefined ? inheritTag(prevTag) : {},
      text,
      drawing: drawing.length ? compileDrawing(drawing) : null,
    };
    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j];
      alignment = alignment || a2an[tag.a || 0] || tag.an;
      pos = pos || compileTag(tag, 'pos');
      org = org || compileTag(tag, 'org');
      move = move || compileTag(tag, 'move');
      fade = fade || compileTag(tag, 'fade') || compileTag(tag, 'fad');
      clip = compileTag(tag, 'clip') || clip;
      const key = Object.keys(tag)[0];
      if (key && !~globalTags.indexOf(key)) {
        const sliceTag = styles[style].tag;
        const { c1, c2, c3, c4 } = sliceTag;
        const fs = prevTag.fs || sliceTag.fs;
        const compiledTag = compileTag(tag, key, { start, end, c1, c2, c3, c4, fs });
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
      slice = { style: styles[reset] ? reset : style, fragments: [] };
    }
    if (fragment.text || fragment.drawing) {
      const prev = slice.fragments[slice.fragments.length - 1] || {};
      if (prev.text && fragment.text && !Object.keys(fragment.tag).length) {
        // merge fragment to previous if its tag is empty
        prev.text += fragment.text;
      } else {
        slice.fragments.push(fragment);
      }
    }
  }
  slices.push(slice);

  return assign({ alignment, slices }, pos, org, move, fade, clip);
}

function compileDialogues({ styles, dialogues }) {
  let minLayer = Infinity;
  const results = [];
  for (let i = 0; i < dialogues.length; i++) {
    const dia = dialogues[i];
    if (dia.Start >= dia.End) {
      continue;
    }
    if (!styles[dia.Style]) {
      dia.Style = 'Default';
    }
    const stl = styles[dia.Style].style;
    const compiledText = compileText({
      styles,
      style: dia.Style,
      parsed: dia.Text.parsed,
      start: dia.Start,
      end: dia.End,
    });
    const alignment = compiledText.alignment || stl.Alignment;
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
        vertical: dia.MarginV || stl.MarginV,
      },
      effect: dia.Effect,
    }, compiledText, { alignment }));
  }
  for (let i = 0; i < results.length; i++) {
    results[i].layer -= minLayer;
  }
  return results.sort((a, b) => a.start - b.start || a.end - b.end);
}

// same as Aegisub
// https://github.com/Aegisub/Aegisub/blob/master/src/ass_style.h
const DEFAULT_STYLE = {
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
  Encoding: '1',
};

/**
 * @param {String} color
 * @returns {Array} [AA, BBGGRR]
 */
function parseStyleColor(color) {
  if (/^(&|H|&H)[0-9a-f]{6,}/i.test(color)) {
    const [, a, c] = color.match(/&?H?([0-9a-f]{2})?([0-9a-f]{6})/i);
    return [a || '00', c];
  }
  const num = parseInt(color, 10);
  if (!Number.isNaN(num)) {
    const min = -2147483648;
    const max = 2147483647;
    if (num < min) {
      return ['00', '000000'];
    }
    const aabbggrr = (min <= num && num <= max)
      ? `00000000${(num < 0 ? num + 4294967296 : num).toString(16)}`.slice(-8)
      : String(num).slice(0, 8);
    return [aabbggrr.slice(0, 2), aabbggrr.slice(2)];
  }
  return ['00', '000000'];
}

function compileStyles({ info, style, defaultStyle }) {
  const result = {};
  const styles = [assign({}, DEFAULT_STYLE, defaultStyle, { Name: 'Default' })].concat(style);
  for (let i = 0; i < styles.length; i++) {
    const s = styles[i];
    // this behavior is same as Aegisub by black-box testing
    if (/^(\*+)Default$/.test(s.Name)) {
      s.Name = 'Default';
    }
    Object.keys(s).forEach((key) => {
      if (key !== 'Name' && key !== 'Fontname' && !/Colour/.test(key)) {
        s[key] *= 1;
      }
    });
    const [a1, c1] = parseStyleColor(s.PrimaryColour);
    const [a2, c2] = parseStyleColor(s.SecondaryColour);
    const [a3, c3] = parseStyleColor(s.OutlineColour);
    const [a4, c4] = parseStyleColor(s.BackColour);
    const tag = {
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
      q: /^[0-3]$/.test(info.WrapStyle) ? info.WrapStyle * 1 : 2,
    };
    result[s.Name] = { style: s, tag };
  }
  return result;
}

function compile(text, options = {}) {
  const tree = parse(text);
  const styles = compileStyles({
    info: tree.info,
    style: tree.styles.style,
    defaultStyle: options.defaultStyle || {},
  });
  return {
    info: tree.info,
    width: tree.info.PlayResX * 1 || null,
    height: tree.info.PlayResY * 1 || null,
    collisions: tree.info.Collisions || 'Normal',
    styles,
    dialogues: compileDialogues({
      styles,
      dialogues: tree.events.dialogue,
    }),
  };
}

function alpha2opacity(a) {
  return 1 - `0x${a}` / 255;
}

function color2rgba(c) {
  const t = c.match(/(\w\w)(\w\w)(\w\w)(\w\w)/);
  const a = alpha2opacity(t[1]);
  const b = +`0x${t[2]}`;
  const g = +`0x${t[3]}`;
  const r = +`0x${t[4]}`;
  return `rgba(${r},${g},${b},${a})`;
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function createSVGEl(name, attrs = []) {
  const $el = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    $el.setAttributeNS(
      attr[0] === 'xlink:href' ? 'http://www.w3.org/1999/xlink' : null,
      attr[0],
      attr[1],
    );
  }
  return $el;
}

function getVendor(prop) {
  const { style } = document.body;
  const Prop = prop.replace(/^\w/, (x) => x.toUpperCase());
  if (prop in style) return '';
  if (`webkit${Prop}` in style) return '-webkit-';
  if (`moz${Prop}` in style) return '-moz-';
  return '';
}

const vendor = {
  clipPath: getVendor('clipPath'),
};

function getStyleRoot(container) {
  const rootNode = container.getRootNode ? container.getRootNode() : document;
  return rootNode === document ? rootNode.head : rootNode;
}
const transformTags = ['fscx', 'fscy', 'frx', 'fry', 'frz', 'fax', 'fay'];

function initAnimation($el, keyframes, options) {
  const animation = $el.animate(keyframes, options);
  animation.pause();
  return animation;
}

function batchAnimate($el, action) {
  // https://caniuse.com/#feat=mdn-api_element_getanimations
  // const animations = $el.getAnimations({ subtree: true });
  $el.animations.forEach((animation) => {
    animation[action]();
  });
}

function createClipPath(clip) {
  const sw = this._.scriptRes.width;
  const sh = this._.scriptRes.height;
  let d = '';
  if (clip.dots !== null) {
    let { x1, y1, x2, y2 } = clip.dots;
    x1 /= sw;
    y1 /= sh;
    x2 /= sw;
    y2 /= sh;
    d = `M${x1},${y1}L${x1},${y2},${x2},${y2},${x2},${y1}Z`;
  }
  if (clip.drawing !== null) {
    d = clip.drawing.instructions.map(({ type, points }) => (
      type + points.map(({ x, y }) => `${x / sw},${y / sh}`).join(',')
    )).join('');
  }
  const scale = 1 / (1 << (clip.scale - 1));
  if (clip.inverse) {
    d += `M0,0L0,${scale},${scale},${scale},${scale},0,0,0Z`;
  }
  const id = `ASS-${uuid()}`;
  const $clipPath = createSVGEl('clipPath', [
    ['id', id],
    ['clipPathUnits', 'objectBoundingBox'],
  ]);
  $clipPath.appendChild(createSVGEl('path', [
    ['d', d],
    ['transform', `scale(${scale})`],
    ['clip-rule', 'evenodd'],
  ]));
  this._.$defs.appendChild($clipPath);
  return {
    $clipPath,
    cssText: `${vendor.clipPath}clip-path:url(#${id});`,
  };
}

function setClipPath(dialogue) {
  if (!dialogue.clip) {
    return;
  }
  const $fobb = document.createElement('div');
  this._.$stage.insertBefore($fobb, dialogue.$div);
  $fobb.appendChild(dialogue.$div);
  $fobb.className = 'ASS-fix-objectBoundingBox';
  const { cssText, $clipPath } = createClipPath.call(this, dialogue.clip);
  this._.$defs.appendChild($clipPath);
  $fobb.style.cssText = cssText;
  assign(dialogue, { $div: $fobb, $clipPath });
}

function createSVGStroke(tag, id, scale) {
  const hasBorder = tag.xbord || tag.ybord;
  const hasShadow = tag.xshad || tag.yshad;
  const isOpaque = tag.a1 !== 'FF';
  const blur = tag.blur || tag.be || 0;
  const $filter = createSVGEl('filter', [['id', id]]);
  $filter.appendChild(createSVGEl('feGaussianBlur', [
    ['stdDeviation', hasBorder ? 0 : blur],
    ['in', 'SourceGraphic'],
    ['result', 'sg_b'],
  ]));
  $filter.appendChild(createSVGEl('feFlood', [
    ['flood-color', color2rgba(tag.a1 + tag.c1)],
    ['result', 'c1'],
  ]));
  $filter.appendChild(createSVGEl('feComposite', [
    ['operator', 'in'],
    ['in', 'c1'],
    ['in2', 'sg_b'],
    ['result', 'main'],
  ]));
  if (hasBorder) {
    $filter.appendChild(createSVGEl('feMorphology', [
      ['radius', `${tag.xbord * scale} ${tag.ybord * scale}`],
      ['operator', 'dilate'],
      ['in', 'SourceGraphic'],
      ['result', 'dil'],
    ]));
    $filter.appendChild(createSVGEl('feGaussianBlur', [
      ['stdDeviation', blur],
      ['in', 'dil'],
      ['result', 'dil_b'],
    ]));
    $filter.appendChild(createSVGEl('feComposite', [
      ['operator', 'out'],
      ['in', 'dil_b'],
      ['in2', 'SourceGraphic'],
      ['result', 'dil_b_o'],
    ]));
    $filter.appendChild(createSVGEl('feFlood', [
      ['flood-color', color2rgba(tag.a3 + tag.c3)],
      ['result', 'c3'],
    ]));
    $filter.appendChild(createSVGEl('feComposite', [
      ['operator', 'in'],
      ['in', 'c3'],
      ['in2', 'dil_b_o'],
      ['result', 'border'],
    ]));
  }
  if (hasShadow && (hasBorder || isOpaque)) {
    $filter.appendChild(createSVGEl('feOffset', [
      ['dx', tag.xshad * scale],
      ['dy', tag.yshad * scale],
      ['in', hasBorder ? 'dil' : 'SourceGraphic'],
      ['result', 'off'],
    ]));
    $filter.appendChild(createSVGEl('feGaussianBlur', [
      ['stdDeviation', blur],
      ['in', 'off'],
      ['result', 'off_b'],
    ]));
    if (!isOpaque) {
      $filter.appendChild(createSVGEl('feOffset', [
        ['dx', tag.xshad * scale],
        ['dy', tag.yshad * scale],
        ['in', 'SourceGraphic'],
        ['result', 'sg_off'],
      ]));
      $filter.appendChild(createSVGEl('feComposite', [
        ['operator', 'out'],
        ['in', 'off_b'],
        ['in2', 'sg_off'],
        ['result', 'off_b_o'],
      ]));
    }
    $filter.appendChild(createSVGEl('feFlood', [
      ['flood-color', color2rgba(tag.a4 + tag.c4)],
      ['result', 'c4'],
    ]));
    $filter.appendChild(createSVGEl('feComposite', [
      ['operator', 'in'],
      ['in', 'c4'],
      ['in2', isOpaque ? 'off_b' : 'off_b_o'],
      ['result', 'shadow'],
    ]));
  }
  const $merge = createSVGEl('feMerge', []);
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

function get4QuadrantPoints([x, y]) {
  return [[0, 0], [0, 1], [1, 0], [1, 1]]
    .filter(([i, j]) => (i || x) && (j || y))
    .map(([i, j]) => [(i || -1) * x, (j || -1) * y]);
}

function getOffsets(x, y) {
  if (x === y) return [];
  const nx = Math.min(x, y);
  const ny = Math.max(x, y);
  // const offsets = [[nx, ny]];
  // for (let i = 0; i < nx; i++) {
  //   for (let j = Math.round(nx + 0.5); j < ny; j++) {
  //     offsets.push([i, j]);
  //   }
  // }
  // return [].concat(...offsets.map(get4QuadrantPoints));
  return Array.from({ length: Math.ceil(ny) - 1 }, (_, i) => i + 1).concat(ny)
    .map((n) => [(ny - n) / ny * nx, n])
    .map(([i, j]) => (x > y ? [j, i] : [i, j]))
    .map(get4QuadrantPoints)
    .flat();
}

function createCSSStroke(tag, scale) {
  const bc = color2rgba(`00${tag.c3}`);
  const bx = tag.xbord * scale;
  const by = tag.ybord * scale;
  const sc = color2rgba(`00${tag.c4}`);
  const sx = tag.xshad * scale;
  const sy = tag.yshad * scale;
  const blur = tag.blur || tag.be || 0;
  const deltaOffsets = getOffsets(bx, by);
  return [
    { key: 'border-width', value: `${Math.min(bx, by) * 2}px` },
    { key: 'border-color', value: bc },
    { key: 'border-opacity', value: alpha2opacity(tag.a3) },
    { key: 'border-delta', value: deltaOffsets.map(([x, y]) => `${x}px ${y}px ${bc}`).join() },
    { key: 'shadow-offset', value: `${sx}px, ${sy}px` },
    { key: 'shadow-color', value: sc },
    { key: 'shadow-opacity', value: alpha2opacity(tag.a4) },
    { key: 'shadow-delta', value: deltaOffsets.map(([x, y]) => `${x}px ${y}px ${sc}`).join() },
    { key: 'blur', value: `blur(${blur}px)` },
  ].map((kv) => Object.assign(kv, { key: `--ass-${kv.key}` }));
}

function createDrawing(fragment, styleTag) {
  const tag = assign({}, styleTag, fragment.tag);
  const { minX, minY, width, height } = fragment.drawing;
  const baseScale = this.scale / (1 << (tag.p - 1));
  const scaleX = (tag.fscx ? tag.fscx / 100 : 1) * baseScale;
  const scaleY = (tag.fscy ? tag.fscy / 100 : 1) * baseScale;
  const blur = tag.blur || tag.be || 0;
  const vbx = tag.xbord + (tag.xshad < 0 ? -tag.xshad : 0) + blur;
  const vby = tag.ybord + (tag.yshad < 0 ? -tag.yshad : 0) + blur;
  const vbw = width * scaleX + 2 * tag.xbord + Math.abs(tag.xshad) + 2 * blur;
  const vbh = height * scaleY + 2 * tag.ybord + Math.abs(tag.yshad) + 2 * blur;
  const $svg = createSVGEl('svg', [
    ['width', vbw],
    ['height', vbh],
    ['viewBox', `${-vbx} ${-vby} ${vbw} ${vbh}`],
  ]);
  const strokeScale = /Yes/i.test(this.info.ScaledBorderAndShadow) ? this.scale : 1;
  const filterId = `ASS-${uuid()}`;
  const $defs = createSVGEl('defs');
  $defs.appendChild(createSVGStroke(tag, filterId, strokeScale));
  $svg.appendChild($defs);
  const symbolId = `ASS-${uuid()}`;
  const $symbol = createSVGEl('symbol', [
    ['id', symbolId],
    ['viewBox', `${minX} ${minY} ${width} ${height}`],
  ]);
  $symbol.appendChild(createSVGEl('path', [['d', fragment.drawing.d]]));
  $svg.appendChild($symbol);
  $svg.appendChild(createSVGEl('use', [
    ['width', width * scaleX],
    ['height', height * scaleY],
    ['xlink:href', `#${symbolId}`],
    ['filter', `url(#${filterId})`],
  ]));
  $svg.style.cssText = (
    'position:absolute;'
    + `left:${minX * scaleX - vbx}px;`
    + `top:${minY * scaleY - vby}px;`
  );
  return {
    $svg,
    cssText: `position:relative;width:${width * scaleX}px;height:${height * scaleY}px;`,
  };
}

const $fixFontSize = document.createElement('div');
$fixFontSize.className = 'ASS-fix-font-size';
$fixFontSize.textContent = 'M';

const cache = Object.create(null);

function getRealFontSize(fn, fs) {
  const key = `${fn}-${fs}`;
  if (!cache[key]) {
    $fixFontSize.style.cssText = `line-height:normal;font-size:${fs}px;font-family:"${fn}",Arial;`;
    cache[key] = fs * fs / $fixFontSize.clientHeight;
  }
  return cache[key];
}

function createTransform(tag) {
  return [
    // TODO: I don't know why perspective is 314, it just performances well.
    'perspective(314px)',
    `rotateY(${tag.fry || 0}deg)`,
    `rotateX(${tag.frx || 0}deg)`,
    `rotateZ(${-tag.frz || 0}deg)`,
    `scale(${tag.p ? 1 : (tag.fscx || 100) / 100},${tag.p ? 1 : (tag.fscy || 100) / 100})`,
    `skew(${tag.fax || 0}rad,${tag.fay || 0}rad)`,
  ].join(' ');
}

function setTransformOrigin(dialogue) {
  const { alignment, width, height, x, y, $div } = dialogue;
  let { org } = dialogue;
  if (!org) {
    org = { x: 0, y: 0 };
    if (alignment % 3 === 1) org.x = x;
    if (alignment % 3 === 2) org.x = x + width / 2;
    if (alignment % 3 === 0) org.x = x + width;
    if (alignment <= 3) org.y = y + height;
    if (alignment >= 4 && alignment <= 6) org.y = y + height / 2;
    if (alignment >= 7) org.y = y;
  }
  for (let i = $div.childNodes.length - 1; i >= 0; i--) {
    const node = $div.childNodes[i];
    if (node.dataset.hasRotate === 'true') {
      // It's not extremely precise for offsets are round the value to an integer.
      const tox = org.x - x - node.offsetLeft;
      const toy = org.y - y - node.offsetTop;
      node.style.cssText += `transform-origin:${tox}px ${toy}px;`;
    }
  }
}

function encodeText(text, q) {
  return text
    .replace(/\\h/g, ' ')
    .replace(/\\N/g, '\n')
    .replace(/\\n/g, q === 2 ? '\n' : ' ');
}

function createDialogue(dialogue) {
  const $div = document.createElement('div');
  $div.className = 'ASS-dialogue';
  const df = document.createDocumentFragment();
  const { slices, start, end } = dialogue;
  const animationOptions = {
    duration: (end - start) * 1000,
    delay: Math.min(0, start - this.video.currentTime) * 1000,
    fill: 'forwards',
  };
  $div.animations = [];
  slices.forEach((slice) => {
    const sliceTag = this.styles[slice.style].tag;
    const borderStyle = this.styles[slice.style].style.BorderStyle;
    slice.fragments.forEach((fragment) => {
      const { text, drawing } = fragment;
      const tag = assign({}, sliceTag, fragment.tag);
      let cssText = 'display:inline-block;';
      const cssVars = [];
      if (!drawing) {
        cssText += `line-height:normal;font-family:"${tag.fn}",Arial;`;
        cssText += `font-size:${this.scale * getRealFontSize(tag.fn, tag.fs)}px;`;
        cssText += `color:${color2rgba(tag.a1 + tag.c1)};`;
        const scale = /Yes/i.test(this.info.ScaledBorderAndShadow) ? this.scale : 1;
        if (borderStyle === 1) {
          cssVars.push(...createCSSStroke(tag, scale));
        }
        if (borderStyle === 3) {
          // TODO: \bord0\shad16
          const bc = color2rgba(tag.a3 + tag.c3);
          const bx = tag.xbord * scale;
          const by = tag.ybord * scale;
          const sc = color2rgba(tag.a4 + tag.c4);
          const sx = tag.xshad * scale;
          const sy = tag.yshad * scale;
          cssText += (
            `${bx || by ? `background-color:${bc};` : ''}`
            + `border:0 solid ${bc};`
            + `border-width:${bx}px ${by}px;`
            + `margin:${-bx}px ${-by}px;`
            + `box-shadow:${sx}px ${sy}px ${sc};`
          );
        }
        cssText += tag.b ? `font-weight:${tag.b === 1 ? 'bold' : tag.b};` : '';
        cssText += tag.i ? 'font-style:italic;' : '';
        cssText += (tag.u || tag.s) ? `text-decoration:${tag.u ? 'underline' : ''} ${tag.s ? 'line-through' : ''};` : '';
        cssText += tag.fsp ? `letter-spacing:${tag.fsp}px;` : '';
        // TODO: (tag.q === 0) and (tag.q === 3) are not implemented yet,
        // for now just handle it as (tag.q === 1)
        if (tag.q === 1 || tag.q === 0 || tag.q === 3) {
          cssText += 'word-break:break-all;white-space:normal;';
        }
        if (tag.q === 2) {
          cssText += 'word-break:normal;white-space:nowrap;';
        }
      }
      const hasTransfrom = transformTags.some((x) => (
        /^fsc[xy]$/.test(x) ? tag[x] !== 100 : !!tag[x]
      ));
      if (hasTransfrom) {
        cssText += `transform:${createTransform(tag)};`;
        if (!drawing) {
          cssText += 'transform-style:preserve-3d;word-break:normal;white-space:nowrap;';
        }
      }
      if (drawing && tag.pbo) {
        const pbo = this.scale * -tag.pbo * (tag.fscy || 100) / 100;
        cssText += `vertical-align:${pbo}px;`;
      }

      const hasRotate = /"fr[xyz]":[^0]/.test(JSON.stringify(tag));
      encodeText(text, tag.q).split('\n').forEach((content, idx) => {
        const $span = document.createElement('span');
        $span.dataset.hasRotate = hasRotate;
        if (drawing) {
          const obj = createDrawing.call(this, fragment, sliceTag);
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
        }
        // TODO: maybe it can be optimized
        $span.style.cssText += cssText;
        cssVars.forEach(({ key, value }) => {
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

function allocate(dialogue) {
  const { layer, margin, width, height, alignment, end } = dialogue;
  const stageWidth = this.width - (this.scale * (margin.left + margin.right) | 0);
  const stageHeight = this.height;
  const vertical = this.scale * margin.vertical | 0;
  const vct = this.video.currentTime * 100;
  this._.space[layer] = this._.space[layer] || {
    left: { width: new Uint16Array(stageHeight + 1), end: new Uint16Array(stageHeight + 1) },
    center: { width: new Uint16Array(stageHeight + 1), end: new Uint16Array(stageHeight + 1) },
    right: { width: new Uint16Array(stageHeight + 1), end: new Uint16Array(stageHeight + 1) },
  };
  const channel = this._.space[layer];
  const align = ['right', 'left', 'center'][alignment % 3];
  const willCollide = (y) => {
    const lw = channel.left.width[y];
    const cw = channel.center.width[y];
    const rw = channel.right.width[y];
    const le = channel.left.end[y];
    const ce = channel.center.end[y];
    const re = channel.right.end[y];
    return (
      (align === 'left' && (
        (le > vct && lw)
        || (ce > vct && cw && 2 * width + cw > stageWidth)
        || (re > vct && rw && width + rw > stageWidth)
      ))
      || (align === 'center' && (
        (le > vct && lw && 2 * lw + width > stageWidth)
        || (ce > vct && cw)
        || (re > vct && rw && 2 * rw + width > stageWidth)
      ))
      || (align === 'right' && (
        (le > vct && lw && lw + width > stageWidth)
        || (ce > vct && cw && 2 * width + cw > stageWidth)
        || (re > vct && rw)
      ))
    );
  };
  let count = 0;
  let result = 0;
  const find = (y) => {
    count = willCollide(y) ? 0 : count + 1;
    if (count >= height) {
      result = y;
      return true;
    }
    return false;
  };
  if (alignment <= 3) {
    for (let i = stageHeight - vertical - 1; i > vertical; i--) {
      if (find(i)) break;
    }
  } else if (alignment >= 7) {
    for (let i = vertical + 1; i < stageHeight - vertical; i++) {
      if (find(i)) break;
    }
  } else {
    for (let i = (stageHeight - height) >> 1; i < stageHeight - vertical; i++) {
      if (find(i)) break;
    }
  }
  if (alignment > 3) {
    result -= height - 1;
  }
  for (let i = result; i < result + height; i++) {
    channel[align].width[i] = width;
    channel[align].end[i] = end * 100;
  }
  return result;
}

function getPosition(dialogue) {
  const { effect, move, alignment, width, height, margin, slices } = dialogue;
  let x = 0;
  let y = 0;
  if (effect) {
    if (effect.name === 'banner') {
      if (alignment <= 3) y = this.height - height - margin.vertical;
      if (alignment >= 4 && alignment <= 6) y = (this.height - height) / 2;
      if (alignment >= 7) y = margin.vertical;
      x = effect.lefttoright ? -width : this.width;
    }
  } else if (dialogue.pos || move) {
    const pos = dialogue.pos || { x: 0, y: 0 };
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
    const hasT = slices.some((slice) => (
      slice.fragments.some(({ animationName }) => animationName)
    ));
    if (hasT) {
      if (alignment <= 3) y = this.height - height - margin.vertical;
      if (alignment >= 4 && alignment <= 6) y = (this.height - height) / 2;
      if (alignment >= 7) y = margin.vertical;
    } else {
      y = allocate.call(this, dialogue);
    }
  }
  return { x, y };
}

function createStyle(dialogue) {
  const { layer, alignment, effect, pos, margin } = dialogue;
  const { width, height, x, y } = dialogue;
  let cssText = '';
  if (layer) cssText += `z-index:${layer};`;
  cssText += `text-align:${['right', 'left', 'center'][alignment % 3]};`;
  if (!effect) {
    const mw = this.width - this.scale * (margin.left + margin.right);
    cssText += `max-width:${mw}px;`;
    if (!pos) {
      if (alignment % 3 === 1) {
        cssText += `margin-left:${this.scale * margin.left}px;`;
      }
      if (alignment % 3 === 0) {
        cssText += `margin-right:${this.scale * margin.right}px;`;
      }
      if (width > this.width - this.scale * (margin.left + margin.right)) {
        cssText += `margin-left:${this.scale * margin.left}px;`;
        cssText += `margin-right:${this.scale * margin.right}px;`;
      }
    }
  }
  cssText += `width:${width}px;height:${height}px;left:${x}px;top:${y}px;`;
  return cssText;
}

function renderer(dialogue) {
  const $div = createDialogue.call(this, dialogue);
  assign(dialogue, { $div });
  this._.$stage.appendChild($div);
  const { width, height } = $div.getBoundingClientRect();
  assign(dialogue, { width, height });
  assign(dialogue, getPosition.call(this, dialogue));
  $div.style.cssText = createStyle.call(this, dialogue);
  setTransformOrigin(dialogue);
  setClipPath.call(this, dialogue);
  return dialogue;
}

function framing() {
  const vct = this.video.currentTime;
  for (let i = this._.stagings.length - 1; i >= 0; i--) {
    const dia = this._.stagings[i];
    let { end } = dia;
    if (dia.effect && /scroll/.test(dia.effect.name)) {
      const { y1, y2, delay } = dia.effect;
      const duration = ((y2 || this._.resampledRes.height) - y1) / (1000 / delay);
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
  const dias = this.dialogues;
  while (
    this._.index < dias.length
    && vct >= dias[this._.index].start
  ) {
    if (vct < dias[this._.index].end) {
      const dia = renderer.call(this, dias[this._.index]);
      if (!this.video.paused) {
        batchAnimate(dia.$div, 'play');
      }
      this._.stagings.push(dia);
    }
    ++this._.index;
  }
}

function play() {
  const frame = () => {
    framing.call(this);
    this._.requestId = requestAnimationFrame(frame);
  };
  cancelAnimationFrame(this._.requestId);
  this._.requestId = requestAnimationFrame(frame);
  this._.stagings.forEach(({ $div }) => {
    batchAnimate($div, 'play');
  });
  return this;
}

function pause() {
  cancelAnimationFrame(this._.requestId);
  this._.requestId = 0;
  this._.stagings.forEach(({ $div }) => {
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
  const vct = this.video.currentTime;
  const dias = this.dialogues;
  clear.call(this);
  this._.index = (() => {
    let from = 0;
    const to = dias.length - 1;
    while (from + 1 < to && vct > dias[(to + from) >> 1].end) {
      from = (to + from) >> 1;
    }
    if (!from) return 0;
    for (let i = from; i < to; i++) {
      if (
        dias[i].end > vct && vct >= dias[i].start
        || (i && dias[i - 1].end < vct && vct < dias[i].start)
      ) {
        return i;
      }
    }
    return to;
  })();
  framing.call(this);
}

function bindEvents() {
  const l = this._.listener;
  l.play = play.bind(this);
  l.pause = pause.bind(this);
  l.seeking = seek.bind(this);
  this.video.addEventListener('play', l.play);
  this.video.addEventListener('pause', l.pause);
  this.video.addEventListener('seeking', l.seeking);
}

function unbindEvents() {
  const l = this._.listener;
  this.video.removeEventListener('play', l.play);
  this.video.removeEventListener('pause', l.pause);
  this.video.removeEventListener('seeking', l.seeking);
  l.play = null;
  l.pause = null;
  l.seeking = null;
}

// TODO: multi \t can't be merged directly
function mergeT(ts) {
  return ts.reduceRight((results, t) => {
    let merged = false;
    return results
      .map((r) => {
        merged = t.t1 === r.t1 && t.t2 === r.t2 && t.accel === r.accel;
        return assign({}, r, merged ? { tag: assign({}, r.tag, t.tag) } : {});
      })
      .concat(merged ? [] : t);
  }, []);
}

function createEffectKeyframes({ effect, duration }) {
  // TODO: when effect and move both exist, its behavior is weird, for now only move works.
  const { name, delay, lefttoright, y1 } = effect;
  const y2 = effect.y2 || this._.resampledRes.height;
  if (name === 'banner') {
    const tx = this.scale * (duration / delay) * (lefttoright ? 1 : -1);
    return [0, `${tx}px`].map((x, i) => ({
      offset: i,
      transform: `translateX(${x})`,
    }));
  }
  if (/^scroll/.test(name)) {
    const updown = /up/.test(name) ? -1 : 1;
    const dp = (y2 - y1) / (duration / delay);
    return [y1, y2]
      .map((y) => this.scale * y * updown)
      .map((y, i) => ({
        offset: Math.min(i, dp),
        transform: `translateY${y}`,
      }));
  }
  return [];
}

function createMoveKeyframes({ move, duration, dialogue }) {
  const { x1, y1, x2, y2, t1, t2 } = move;
  const t = [t1, t2 || duration];
  const pos = dialogue.pos || { x: 0, y: 0 };
  return [[x1, y1], [x2, y2]]
    .map(([x, y]) => [this.scale * (x - pos.x), this.scale * (y - pos.y)])
    .map(([x, y], index) => ({
      offset: Math.min(t[index] / duration, 1),
      transform: `translate(${x}px, ${y}px)`,
    }));
}

function createFadeKeyframes({ fade, duration }) {
  if (fade.type === 'fad') {
    const { t1, t2 } = fade;
    const kfs = [[0, 0]];
    if (t1 < duration) {
      kfs.push([t1 / duration, 1]);
      if (t1 + t2 < duration) {
        kfs.push([(duration - t2) / duration, 1]);
      }
      kfs.push([1, 0]);
    } else {
      kfs.push([1, duration / t1]);
    }
    return kfs.map(([offset, opacity]) => ({ offset, opacity }));
  }
  const { a1, a2, a3, t1, t2, t3, t4 } = fade;
  const opacities = [a1, a2, a3].map((a) => 1 - a / 255);
  return [0, t1, t2, t3, t4, duration]
    .map((t) => t / duration)
    .map((t, i) => ({ offset: t, opacity: opacities[i >> 1] }))
    .filter(({ offset }) => offset <= 1);
}

function createTransformKeyframes({ fromTag, tag, fragment }) {
  const hasTransfrom = transformTags.some((x) => (
    tag[x] !== undefined && tag[x] !== fromTag[x]
  ));
  if (!hasTransfrom) return null;
  const toTag = assign({}, fromTag, tag);
  if (fragment.drawing) {
    // scales will be handled inside svg
    assign(toTag, {
      p: 0,
      fscx: ((tag.fscx || fromTag.fscx) / fromTag.fscx) * 100,
      fscy: ((tag.fscy || fromTag.fscy) / fromTag.fscy) * 100,
    });
    assign(fromTag, { fscx: 100, fscy: 100 });
  }
  return [
    'transform',
    createTransform(fromTag),
    createTransform(toTag),
  ];
}

function setKeyframes(dialogue) {
  const { start, end, effect, move, fade, slices } = dialogue;
  const duration = (end - start) * 1000;
  const keyframes = [
    ...(effect && !move ? createEffectKeyframes.call(this, { effect, duration }) : []),
    ...(move ? createMoveKeyframes.call(this, { move, duration, dialogue }) : []),
    ...(fade ? createFadeKeyframes({ fade, duration }) : []),
  ];
  if (keyframes.length) {
    assign(dialogue, { keyframes });
    // const delay = Math.min(0, dialogue.start - this.video.currentTime) * 1000;
    // const animation = $div.animate(keyframes, { duration, delay, fill: 'forwards' });
    // animation.pause();
  }
  slices.forEach((slice) => {
    const sliceTag = this.styles[slice.style].tag;
    slice.fragments.forEach((fragment) => {
      if (!fragment.tag.t || !fragment.tag.t.length) {
        return;
      }
      const fromTag = assign({}, sliceTag, fragment.tag);
      const kfs = mergeT(fragment.tag.t).map(({ t1, t2, tag }) => {
        const hasAlpha = (
          tag.a1 !== undefined
          && tag.a1 === tag.a2
          && tag.a2 === tag.a3
          && tag.a3 === tag.a4
        );
        return [
          tag.fs && [
            'font-size',
            `${this.scale * getRealFontSize(fromTag.fn, fromTag.fs)}px`,
            `${this.scale * getRealFontSize(tag.fn, fromTag.fs)}px`,
          ],
          tag.fsp && [
            'letter-spacing',
            `${this.scale * fromTag.fsp}px`,
            `${this.scale * tag.fsp}px`,
          ],
          (tag.c1 || (tag.a1 && !hasAlpha)) && [
            'color',
            color2rgba(fromTag.a1 + fromTag.c1),
            color2rgba((tag.a1 || fromTag.a1) + (tag.c1 || fromTag.c1)),
          ],
          hasAlpha && [
            'opacity',
            1 - parseInt(fromTag.a1, 16) / 255,
            1 - parseInt(tag.a1, 16) / 255,
          ],
          createTransformKeyframes({ fromTag, tag, fragment }),
        ].filter((x) => x).map(([prop, from, to]) => {
          const values = [from, from, to, to];
          return [0, t1, t2, duration]
            .map((t) => t / duration)
            .map((offset, i) => ({ offset, [prop]: values[i] }));
        });
      }).flat(2);
      if (kfs.length) {
        assign(fragment, { keyframes: kfs });
      }
    });
  });
}

function resize() {
  const cw = this.video.clientWidth;
  const ch = this.video.clientHeight;
  const vw = this.video.videoWidth || cw;
  const vh = this.video.videoHeight || ch;
  const sw = this._.scriptRes.width;
  const sh = this._.scriptRes.height;
  let rw = sw;
  let rh = sh;
  const videoScale = Math.min(cw / vw, ch / vh);
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
  this._.resampledRes = { width: rw, height: rh };

  this.container.style.cssText = `width:${cw}px;height:${ch}px;`;
  const cssText = (
    `width:${this.width}px;`
    + `height:${this.height}px;`
    + `top:${(ch - this.height) / 2}px;`
    + `left:${(cw - this.width) / 2}px;`
  );
  this._.$stage.style.cssText = cssText;
  this._.$svg.style.cssText = cssText;
  this._.$svg.setAttributeNS(null, 'viewBox', `0 0 ${sw} ${sh}`);

  this.dialogues.forEach((dialogue) => {
    setKeyframes.call(this, dialogue);
  });
  seek.call(this);

  return this;
}

const GLOBAL_CSS = '.ASS-container,.ASS-stage{position:relative;overflow:hidden}.ASS-container video{position:absolute;top:0;left:0}.ASS-stage{pointer-events:none;position:absolute}.ASS-dialogue{font-size:0;position:absolute;z-index:0}.ASS-dialogue [data-stroke]{position:relative}.ASS-dialogue [data-stroke]::after,.ASS-dialogue [data-stroke]::before{content:attr(data-stroke);position:absolute;top:0;left:0;z-index:-1;filter:var(--ass-blur)}.ASS-dialogue [data-stroke]::before{color:var(--ass-shadow-color);transform:translate(var(--ass-shadow-offset));-webkit-text-stroke:var(--ass-border-width) var(--ass-shadow-color);text-shadow:var(--ass-shadow-delta);opacity:var(--ass-shadow-opacity)}.ASS-dialogue [data-stroke]::after{-webkit-text-stroke:var(--ass-border-width) var(--ass-border-color);text-shadow:var(--ass-border-delta);opacity:var(--ass-border-opacity)}.ASS-fix-font-size{position:absolute;visibility:hidden}.ASS-fix-objectBoundingBox{width:100%;height:100%;position:absolute;top:0;left:0}';

function init(source, video, options = {}) {
  this.scale = 1;

  // private variables
  this._ = {
    index: 0,
    stagings: [],
    space: [],
    listener: {},
    $svg: createSVGEl('svg'),
    $defs: createSVGEl('defs'),
    $stage: document.createElement('div'),
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
    const isPlaying = !video.paused;
    video.parentNode.insertBefore(this.container, video);
    this.container.appendChild(video);
    if (isPlaying && video.paused) {
      video.play();
    }
  }
  this.container.appendChild(this._.$stage);

  const { info, width, height, styles, dialogues } = compile(source);
  this.info = info;
  this._.scriptRes = {
    width: width || video.videoWidth,
    height: height || video.videoHeight,
  };
  this.styles = styles;
  this.dialogues = dialogues;

  const styleRoot = getStyleRoot(this.container);
  let $style = styleRoot.querySelector('#ASS-global-style');
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
    const isPlay = !this.video.paused;
    this.container.parentNode.insertBefore(this.video, this.container);
    this.container.parentNode.removeChild(this.container);
    if (isPlay && this.video.paused) {
      this.video.play();
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in this) {
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      this[key] = null;
    }
  }

  return this;
}

const regex = /^(video|script)_(width|height)$/;

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

class ASS {
  constructor(source, video, options) {
    if (typeof source !== 'string') {
      return this;
    }
    return init.call(this, source, video, options);
  }

  resize() {
    return resize.call(this);
  }

  show() {
    return show.call(this);
  }

  hide() {
    return hide.call(this);
  }

  destroy() {
    return destroy.call(this);
  }

  get resampling() {
    return getter.call(this);
  }

  set resampling(r) {
    return setter.call(this, r);
  }
}

export default ASS;
