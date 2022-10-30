/**
 * Copyright (C) 2011 by Ben Noordhuis <info@bnoordhuis.nl>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const TMIN = 1;
const TMAX = 26;
const BASE = 36;
const SKEW = 38;
const DAMP = 700; // initial bias scaler
const INITIAL_N = 128;
const INITIAL_BIAS = 72;

function adapt_bias(delta, n_points, is_first) {
  // scale back, then increase delta
  delta /= is_first ? DAMP : 2;
  delta += ~~(delta / n_points);

  var s = (BASE - TMIN)
  var t = ~~((s * TMAX) / 2) // threshold=455

  for (var k = 0; delta > t; k += BASE) {
    delta = ~~(delta / s);
  }

  var a = (BASE - TMIN + 1) * delta
  var b = (delta + SKEW)

  return k + ~~(a / b)
}

function next_smallest_codepoint(codepoints, n) {
  var m = 0x110000; // unicode upper bound + 1

  for (var i = 0, len = codepoints.length; i < len; ++i) {
    var c = codepoints[i];
    if (c >= n && c < m) {
      m = c;
    }
  }

  // sanity check - should not happen
  if (m >= 0x110000) {
    throw new Error('Next smallest code point not found.');
  }

  return m;
}

function encode_digit(d) {
  return d + (d < 26 ? 97 : 22);
}

function threshold(k, bias) {
  if (k <= bias + TMIN) {
    return TMIN;
  }
  if (k >= bias + TMAX) {
    return TMAX;
  }
  return k - bias;
}

function encode_int(bias, delta) {
  var result = [];

  for (var k = BASE, q = delta; ; k += BASE) {
    var t = threshold(k, bias);
    if (q < t) {
      result.push(encode_digit(q));
      break;
    }
    else {
      result.push(encode_digit(t + ((q - t) % (BASE - t))));
      q = ~~((q - t) / (BASE - t));
    }
  }

  return result;
}

export function toAscii (input) {
  if (typeof input != 'string') {
    throw new Error('Argument must be a string.');
  }
  
  if(/^[\0-\x7E]*$/.test(input))
    return input;

  input = input.split('').map(function(c) {
    return c.charCodeAt(0);
  });

  var output = [];
  var non_basic = [];

  for (var i = 0, len = input.length; i < len; ++i) {
    var c = input[i];
    if (c < 128) {
      output.push(c);
    }
    else {
      non_basic.push(c);
    }
  }

  var b, h;
  b = h = output.length;

  if (b) {
    output.push(45); // delimiter '-'
  }

  var n = INITIAL_N;
  var bias = INITIAL_BIAS;
  var delta = 0;

  for (var len = input.length; h < len; ++n, ++delta) {
    var m = next_smallest_codepoint(non_basic, n);
    delta += (m - n) * (h + 1);
    n = m;

    for (var i = 0; i < len; ++i) {
      var c = input[i];
      if (c < n) {
        if (++delta == 0) {
          throw new Error('Delta overflow.');
        }
      }
      else if (c == n) {
        // TODO append in-place? i.e. -> output.push.apply(output, encode_int(bias, delta));
        output = output.concat(encode_int(bias, delta));
        bias = adapt_bias(delta, h + 1, b == h);
        delta = 0;
        h++;
      }
    }
  }

  return 'xn--' + String.fromCharCode.apply(String, output);
}

