var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(async () => {
  var _a2;
  (function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const i of document.querySelectorAll('link[rel="modulepreload"]')) r(i);
    new MutationObserver((i) => {
      for (const o of i) if (o.type === "childList") for (const s of o.addedNodes) s.tagName === "LINK" && s.rel === "modulepreload" && r(s);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function n(i) {
      const o = {};
      return i.integrity && (o.integrity = i.integrity), i.referrerPolicy && (o.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? o.credentials = "include" : i.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
    }
    function r(i) {
      if (i.ep) return;
      i.ep = true;
      const o = n(i);
      fetch(i.href, o);
    }
  })();
  var Re = {}, Is = {};
  Is.byteLength = Pp;
  Is.toByteArray = Hp;
  Is.fromByteArray = Np;
  var $t = [], bt = [], kp = typeof Uint8Array < "u" ? Uint8Array : Array, ra = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var jr = 0, Bp = ra.length; jr < Bp; ++jr) $t[jr] = ra[jr], bt[ra.charCodeAt(jr)] = jr;
  bt[45] = 62;
  bt[95] = 63;
  function Ol(e) {
    var t = e.length;
    if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    var n = e.indexOf("=");
    n === -1 && (n = t);
    var r = n === t ? 0 : 4 - n % 4;
    return [
      n,
      r
    ];
  }
  function Pp(e) {
    var t = Ol(e), n = t[0], r = t[1];
    return (n + r) * 3 / 4 - r;
  }
  function Op(e, t, n) {
    return (t + n) * 3 / 4 - n;
  }
  function Hp(e) {
    var t, n = Ol(e), r = n[0], i = n[1], o = new kp(Op(e, r, i)), s = 0, a = i > 0 ? r - 4 : r, f;
    for (f = 0; f < a; f += 4) t = bt[e.charCodeAt(f)] << 18 | bt[e.charCodeAt(f + 1)] << 12 | bt[e.charCodeAt(f + 2)] << 6 | bt[e.charCodeAt(f + 3)], o[s++] = t >> 16 & 255, o[s++] = t >> 8 & 255, o[s++] = t & 255;
    return i === 2 && (t = bt[e.charCodeAt(f)] << 2 | bt[e.charCodeAt(f + 1)] >> 4, o[s++] = t & 255), i === 1 && (t = bt[e.charCodeAt(f)] << 10 | bt[e.charCodeAt(f + 1)] << 4 | bt[e.charCodeAt(f + 2)] >> 2, o[s++] = t >> 8 & 255, o[s++] = t & 255), o;
  }
  function Up(e) {
    return $t[e >> 18 & 63] + $t[e >> 12 & 63] + $t[e >> 6 & 63] + $t[e & 63];
  }
  function Rp(e, t, n) {
    for (var r, i = [], o = t; o < n; o += 3) r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), i.push(Up(r));
    return i.join("");
  }
  function Np(e) {
    for (var t, n = e.length, r = n % 3, i = [], o = 16383, s = 0, a = n - r; s < a; s += o) i.push(Rp(e, s, s + o > a ? a : s + o));
    return r === 1 ? (t = e[n - 1], i.push($t[t >> 2] + $t[t << 4 & 63] + "==")) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], i.push($t[t >> 10] + $t[t >> 4 & 63] + $t[t << 2 & 63] + "=")), i.join("");
  }
  var xc = {};
  xc.read = function(e, t, n, r, i) {
    var o, s, a = i * 8 - r - 1, f = (1 << a) - 1, u = f >> 1, c = -7, p = n ? i - 1 : 0, y = n ? -1 : 1, d = e[t + p];
    for (p += y, o = d & (1 << -c) - 1, d >>= -c, c += a; c > 0; o = o * 256 + e[t + p], p += y, c -= 8) ;
    for (s = o & (1 << -c) - 1, o >>= -c, c += r; c > 0; s = s * 256 + e[t + p], p += y, c -= 8) ;
    if (o === 0) o = 1 - u;
    else {
      if (o === f) return s ? NaN : (d ? -1 : 1) * (1 / 0);
      s = s + Math.pow(2, r), o = o - u;
    }
    return (d ? -1 : 1) * s * Math.pow(2, o - r);
  };
  xc.write = function(e, t, n, r, i, o) {
    var s, a, f, u = o * 8 - i - 1, c = (1 << u) - 1, p = c >> 1, y = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = r ? 0 : o - 1, w = r ? 1 : -1, b = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = c) : (s = Math.floor(Math.log(t) / Math.LN2), t * (f = Math.pow(2, -s)) < 1 && (s--, f *= 2), s + p >= 1 ? t += y / f : t += y * Math.pow(2, 1 - p), t * f >= 2 && (s++, f /= 2), s + p >= c ? (a = 0, s = c) : s + p >= 1 ? (a = (t * f - 1) * Math.pow(2, i), s = s + p) : (a = t * Math.pow(2, p - 1) * Math.pow(2, i), s = 0)); i >= 8; e[n + d] = a & 255, d += w, a /= 256, i -= 8) ;
    for (s = s << i | a, u += i; u > 0; e[n + d] = s & 255, d += w, s /= 256, u -= 8) ;
    e[n + d - w] |= b * 128;
  };
  (function(e) {
    const t = Is, n = xc, r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    e.Buffer = c, e.SlowBuffer = k, e.INSPECT_MAX_BYTES = 50;
    const i = 2147483647;
    e.kMaxLength = i;
    const { Uint8Array: o, ArrayBuffer: s, SharedArrayBuffer: a } = globalThis;
    c.TYPED_ARRAY_SUPPORT = f(), !c.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
    function f() {
      try {
        const g = new o(1), l = {
          foo: function() {
            return 42;
          }
        };
        return Object.setPrototypeOf(l, o.prototype), Object.setPrototypeOf(g, l), g.foo() === 42;
      } catch {
        return false;
      }
    }
    Object.defineProperty(c.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (c.isBuffer(this)) return this.buffer;
      }
    }), Object.defineProperty(c.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (c.isBuffer(this)) return this.byteOffset;
      }
    });
    function u(g) {
      if (g > i) throw new RangeError('The value "' + g + '" is invalid for option "size"');
      const l = new o(g);
      return Object.setPrototypeOf(l, c.prototype), l;
    }
    function c(g, l, h) {
      if (typeof g == "number") {
        if (typeof l == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
        return w(g);
      }
      return p(g, l, h);
    }
    c.poolSize = 8192;
    function p(g, l, h) {
      if (typeof g == "string") return b(g, l);
      if (s.isView(g)) return A(g);
      if (g == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof g);
      if (Ht(g, s) || g && Ht(g.buffer, s) || typeof a < "u" && (Ht(g, a) || g && Ht(g.buffer, a))) return O(g, l, h);
      if (typeof g == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
      const _ = g.valueOf && g.valueOf();
      if (_ != null && _ !== g) return c.from(_, l, h);
      const x = E(g);
      if (x) return x;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof g[Symbol.toPrimitive] == "function") return c.from(g[Symbol.toPrimitive]("string"), l, h);
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof g);
    }
    c.from = function(g, l, h) {
      return p(g, l, h);
    }, Object.setPrototypeOf(c.prototype, o.prototype), Object.setPrototypeOf(c, o);
    function y(g) {
      if (typeof g != "number") throw new TypeError('"size" argument must be of type number');
      if (g < 0) throw new RangeError('The value "' + g + '" is invalid for option "size"');
    }
    function d(g, l, h) {
      return y(g), g <= 0 ? u(g) : l !== void 0 ? typeof h == "string" ? u(g).fill(l, h) : u(g).fill(l) : u(g);
    }
    c.alloc = function(g, l, h) {
      return d(g, l, h);
    };
    function w(g) {
      return y(g), u(g < 0 ? 0 : m(g) | 0);
    }
    c.allocUnsafe = function(g) {
      return w(g);
    }, c.allocUnsafeSlow = function(g) {
      return w(g);
    };
    function b(g, l) {
      if ((typeof l != "string" || l === "") && (l = "utf8"), !c.isEncoding(l)) throw new TypeError("Unknown encoding: " + l);
      const h = T(g, l) | 0;
      let _ = u(h);
      const x = _.write(g, l);
      return x !== h && (_ = _.slice(0, x)), _;
    }
    function S(g) {
      const l = g.length < 0 ? 0 : m(g.length) | 0, h = u(l);
      for (let _ = 0; _ < l; _ += 1) h[_] = g[_] & 255;
      return h;
    }
    function A(g) {
      if (Ht(g, o)) {
        const l = new o(g);
        return O(l.buffer, l.byteOffset, l.byteLength);
      }
      return S(g);
    }
    function O(g, l, h) {
      if (l < 0 || g.byteLength < l) throw new RangeError('"offset" is outside of buffer bounds');
      if (g.byteLength < l + (h || 0)) throw new RangeError('"length" is outside of buffer bounds');
      let _;
      return l === void 0 && h === void 0 ? _ = new o(g) : h === void 0 ? _ = new o(g, l) : _ = new o(g, l, h), Object.setPrototypeOf(_, c.prototype), _;
    }
    function E(g) {
      if (c.isBuffer(g)) {
        const l = m(g.length) | 0, h = u(l);
        return h.length === 0 || g.copy(h, 0, 0, l), h;
      }
      if (g.length !== void 0) return typeof g.length != "number" || na(g.length) ? u(0) : S(g);
      if (g.type === "Buffer" && Array.isArray(g.data)) return S(g.data);
    }
    function m(g) {
      if (g >= i) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
      return g | 0;
    }
    function k(g) {
      return +g != g && (g = 0), c.alloc(+g);
    }
    c.isBuffer = function(l) {
      return l != null && l._isBuffer === true && l !== c.prototype;
    }, c.compare = function(l, h) {
      if (Ht(l, o) && (l = c.from(l, l.offset, l.byteLength)), Ht(h, o) && (h = c.from(h, h.offset, h.byteLength)), !c.isBuffer(l) || !c.isBuffer(h)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      if (l === h) return 0;
      let _ = l.length, x = h.length;
      for (let P = 0, L = Math.min(_, x); P < L; ++P) if (l[P] !== h[P]) {
        _ = l[P], x = h[P];
        break;
      }
      return _ < x ? -1 : x < _ ? 1 : 0;
    }, c.isEncoding = function(l) {
      switch (String(l).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    }, c.concat = function(l, h) {
      if (!Array.isArray(l)) throw new TypeError('"list" argument must be an Array of Buffers');
      if (l.length === 0) return c.alloc(0);
      let _;
      if (h === void 0) for (h = 0, _ = 0; _ < l.length; ++_) h += l[_].length;
      const x = c.allocUnsafe(h);
      let P = 0;
      for (_ = 0; _ < l.length; ++_) {
        let L = l[_];
        if (Ht(L, o)) P + L.length > x.length ? (c.isBuffer(L) || (L = c.from(L)), L.copy(x, P)) : o.prototype.set.call(x, L, P);
        else if (c.isBuffer(L)) L.copy(x, P);
        else throw new TypeError('"list" argument must be an Array of Buffers');
        P += L.length;
      }
      return x;
    };
    function T(g, l) {
      if (c.isBuffer(g)) return g.length;
      if (s.isView(g) || Ht(g, s)) return g.byteLength;
      if (typeof g != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof g);
      const h = g.length, _ = arguments.length > 2 && arguments[2] === true;
      if (!_ && h === 0) return 0;
      let x = false;
      for (; ; ) switch (l) {
        case "ascii":
        case "latin1":
        case "binary":
          return h;
        case "utf8":
        case "utf-8":
          return ta(g).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return h * 2;
        case "hex":
          return h >>> 1;
        case "base64":
          return xf(g).length;
        default:
          if (x) return _ ? -1 : ta(g).length;
          l = ("" + l).toLowerCase(), x = true;
      }
    }
    c.byteLength = T;
    function R(g, l, h) {
      let _ = false;
      if ((l === void 0 || l < 0) && (l = 0), l > this.length || ((h === void 0 || h > this.length) && (h = this.length), h <= 0) || (h >>>= 0, l >>>= 0, h <= l)) return "";
      for (g || (g = "utf8"); ; ) switch (g) {
        case "hex":
          return j(this, l, h);
        case "utf8":
        case "utf-8":
          return W(this, l, h);
        case "ascii":
          return F(this, l, h);
        case "latin1":
        case "binary":
          return V(this, l, h);
        case "base64":
          return K(this, l, h);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return te(this, l, h);
        default:
          if (_) throw new TypeError("Unknown encoding: " + g);
          g = (g + "").toLowerCase(), _ = true;
      }
    }
    c.prototype._isBuffer = true;
    function M(g, l, h) {
      const _ = g[l];
      g[l] = g[h], g[h] = _;
    }
    c.prototype.swap16 = function() {
      const l = this.length;
      if (l % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let h = 0; h < l; h += 2) M(this, h, h + 1);
      return this;
    }, c.prototype.swap32 = function() {
      const l = this.length;
      if (l % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let h = 0; h < l; h += 4) M(this, h, h + 3), M(this, h + 1, h + 2);
      return this;
    }, c.prototype.swap64 = function() {
      const l = this.length;
      if (l % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let h = 0; h < l; h += 8) M(this, h, h + 7), M(this, h + 1, h + 6), M(this, h + 2, h + 5), M(this, h + 3, h + 4);
      return this;
    }, c.prototype.toString = function() {
      const l = this.length;
      return l === 0 ? "" : arguments.length === 0 ? W(this, 0, l) : R.apply(this, arguments);
    }, c.prototype.toLocaleString = c.prototype.toString, c.prototype.equals = function(l) {
      if (!c.isBuffer(l)) throw new TypeError("Argument must be a Buffer");
      return this === l ? true : c.compare(this, l) === 0;
    }, c.prototype.inspect = function() {
      let l = "";
      const h = e.INSPECT_MAX_BYTES;
      return l = this.toString("hex", 0, h).replace(/(.{2})/g, "$1 ").trim(), this.length > h && (l += " ... "), "<Buffer " + l + ">";
    }, r && (c.prototype[r] = c.prototype.inspect), c.prototype.compare = function(l, h, _, x, P) {
      if (Ht(l, o) && (l = c.from(l, l.offset, l.byteLength)), !c.isBuffer(l)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof l);
      if (h === void 0 && (h = 0), _ === void 0 && (_ = l ? l.length : 0), x === void 0 && (x = 0), P === void 0 && (P = this.length), h < 0 || _ > l.length || x < 0 || P > this.length) throw new RangeError("out of range index");
      if (x >= P && h >= _) return 0;
      if (x >= P) return -1;
      if (h >= _) return 1;
      if (h >>>= 0, _ >>>= 0, x >>>= 0, P >>>= 0, this === l) return 0;
      let L = P - x, re = _ - h;
      const xe = Math.min(L, re), me = this.slice(x, P), ve = l.slice(h, _);
      for (let he = 0; he < xe; ++he) if (me[he] !== ve[he]) {
        L = me[he], re = ve[he];
        break;
      }
      return L < re ? -1 : re < L ? 1 : 0;
    };
    function v(g, l, h, _, x) {
      if (g.length === 0) return -1;
      if (typeof h == "string" ? (_ = h, h = 0) : h > 2147483647 ? h = 2147483647 : h < -2147483648 && (h = -2147483648), h = +h, na(h) && (h = x ? 0 : g.length - 1), h < 0 && (h = g.length + h), h >= g.length) {
        if (x) return -1;
        h = g.length - 1;
      } else if (h < 0) if (x) h = 0;
      else return -1;
      if (typeof l == "string" && (l = c.from(l, _)), c.isBuffer(l)) return l.length === 0 ? -1 : H(g, l, h, _, x);
      if (typeof l == "number") return l = l & 255, typeof o.prototype.indexOf == "function" ? x ? o.prototype.indexOf.call(g, l, h) : o.prototype.lastIndexOf.call(g, l, h) : H(g, [
        l
      ], h, _, x);
      throw new TypeError("val must be string, number or Buffer");
    }
    function H(g, l, h, _, x) {
      let P = 1, L = g.length, re = l.length;
      if (_ !== void 0 && (_ = String(_).toLowerCase(), _ === "ucs2" || _ === "ucs-2" || _ === "utf16le" || _ === "utf-16le")) {
        if (g.length < 2 || l.length < 2) return -1;
        P = 2, L /= 2, re /= 2, h /= 2;
      }
      function xe(ve, he) {
        return P === 1 ? ve[he] : ve.readUInt16BE(he * P);
      }
      let me;
      if (x) {
        let ve = -1;
        for (me = h; me < L; me++) if (xe(g, me) === xe(l, ve === -1 ? 0 : me - ve)) {
          if (ve === -1 && (ve = me), me - ve + 1 === re) return ve * P;
        } else ve !== -1 && (me -= me - ve), ve = -1;
      } else for (h + re > L && (h = L - re), me = h; me >= 0; me--) {
        let ve = true;
        for (let he = 0; he < re; he++) if (xe(g, me + he) !== xe(l, he)) {
          ve = false;
          break;
        }
        if (ve) return me;
      }
      return -1;
    }
    c.prototype.includes = function(l, h, _) {
      return this.indexOf(l, h, _) !== -1;
    }, c.prototype.indexOf = function(l, h, _) {
      return v(this, l, h, _, true);
    }, c.prototype.lastIndexOf = function(l, h, _) {
      return v(this, l, h, _, false);
    };
    function D(g, l, h, _) {
      h = Number(h) || 0;
      const x = g.length - h;
      _ ? (_ = Number(_), _ > x && (_ = x)) : _ = x;
      const P = l.length;
      _ > P / 2 && (_ = P / 2);
      let L;
      for (L = 0; L < _; ++L) {
        const re = parseInt(l.substr(L * 2, 2), 16);
        if (na(re)) return L;
        g[h + L] = re;
      }
      return L;
    }
    function $(g, l, h, _) {
      return To(ta(l, g.length - h), g, h, _);
    }
    function N(g, l, h, _) {
      return To(vp(l), g, h, _);
    }
    function U(g, l, h, _) {
      return To(xf(l), g, h, _);
    }
    function C(g, l, h, _) {
      return To(Ip(l, g.length - h), g, h, _);
    }
    c.prototype.write = function(l, h, _, x) {
      if (h === void 0) x = "utf8", _ = this.length, h = 0;
      else if (_ === void 0 && typeof h == "string") x = h, _ = this.length, h = 0;
      else if (isFinite(h)) h = h >>> 0, isFinite(_) ? (_ = _ >>> 0, x === void 0 && (x = "utf8")) : (x = _, _ = void 0);
      else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
      const P = this.length - h;
      if ((_ === void 0 || _ > P) && (_ = P), l.length > 0 && (_ < 0 || h < 0) || h > this.length) throw new RangeError("Attempt to write outside buffer bounds");
      x || (x = "utf8");
      let L = false;
      for (; ; ) switch (x) {
        case "hex":
          return D(this, l, h, _);
        case "utf8":
        case "utf-8":
          return $(this, l, h, _);
        case "ascii":
        case "latin1":
        case "binary":
          return N(this, l, h, _);
        case "base64":
          return U(this, l, h, _);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return C(this, l, h, _);
        default:
          if (L) throw new TypeError("Unknown encoding: " + x);
          x = ("" + x).toLowerCase(), L = true;
      }
    }, c.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function K(g, l, h) {
      return l === 0 && h === g.length ? t.fromByteArray(g) : t.fromByteArray(g.slice(l, h));
    }
    function W(g, l, h) {
      h = Math.min(g.length, h);
      const _ = [];
      let x = l;
      for (; x < h; ) {
        const P = g[x];
        let L = null, re = P > 239 ? 4 : P > 223 ? 3 : P > 191 ? 2 : 1;
        if (x + re <= h) {
          let xe, me, ve, he;
          switch (re) {
            case 1:
              P < 128 && (L = P);
              break;
            case 2:
              xe = g[x + 1], (xe & 192) === 128 && (he = (P & 31) << 6 | xe & 63, he > 127 && (L = he));
              break;
            case 3:
              xe = g[x + 1], me = g[x + 2], (xe & 192) === 128 && (me & 192) === 128 && (he = (P & 15) << 12 | (xe & 63) << 6 | me & 63, he > 2047 && (he < 55296 || he > 57343) && (L = he));
              break;
            case 4:
              xe = g[x + 1], me = g[x + 2], ve = g[x + 3], (xe & 192) === 128 && (me & 192) === 128 && (ve & 192) === 128 && (he = (P & 15) << 18 | (xe & 63) << 12 | (me & 63) << 6 | ve & 63, he > 65535 && he < 1114112 && (L = he));
          }
        }
        L === null ? (L = 65533, re = 1) : L > 65535 && (L -= 65536, _.push(L >>> 10 & 1023 | 55296), L = 56320 | L & 1023), _.push(L), x += re;
      }
      return I(_);
    }
    const Z = 4096;
    function I(g) {
      const l = g.length;
      if (l <= Z) return String.fromCharCode.apply(String, g);
      let h = "", _ = 0;
      for (; _ < l; ) h += String.fromCharCode.apply(String, g.slice(_, _ += Z));
      return h;
    }
    function F(g, l, h) {
      let _ = "";
      h = Math.min(g.length, h);
      for (let x = l; x < h; ++x) _ += String.fromCharCode(g[x] & 127);
      return _;
    }
    function V(g, l, h) {
      let _ = "";
      h = Math.min(g.length, h);
      for (let x = l; x < h; ++x) _ += String.fromCharCode(g[x]);
      return _;
    }
    function j(g, l, h) {
      const _ = g.length;
      (!l || l < 0) && (l = 0), (!h || h < 0 || h > _) && (h = _);
      let x = "";
      for (let P = l; P < h; ++P) x += Tp[g[P]];
      return x;
    }
    function te(g, l, h) {
      const _ = g.slice(l, h);
      let x = "";
      for (let P = 0; P < _.length - 1; P += 2) x += String.fromCharCode(_[P] + _[P + 1] * 256);
      return x;
    }
    c.prototype.slice = function(l, h) {
      const _ = this.length;
      l = ~~l, h = h === void 0 ? _ : ~~h, l < 0 ? (l += _, l < 0 && (l = 0)) : l > _ && (l = _), h < 0 ? (h += _, h < 0 && (h = 0)) : h > _ && (h = _), h < l && (h = l);
      const x = this.subarray(l, h);
      return Object.setPrototypeOf(x, c.prototype), x;
    };
    function G(g, l, h) {
      if (g % 1 !== 0 || g < 0) throw new RangeError("offset is not uint");
      if (g + l > h) throw new RangeError("Trying to access beyond buffer length");
    }
    c.prototype.readUintLE = c.prototype.readUIntLE = function(l, h, _) {
      l = l >>> 0, h = h >>> 0, _ || G(l, h, this.length);
      let x = this[l], P = 1, L = 0;
      for (; ++L < h && (P *= 256); ) x += this[l + L] * P;
      return x;
    }, c.prototype.readUintBE = c.prototype.readUIntBE = function(l, h, _) {
      l = l >>> 0, h = h >>> 0, _ || G(l, h, this.length);
      let x = this[l + --h], P = 1;
      for (; h > 0 && (P *= 256); ) x += this[l + --h] * P;
      return x;
    }, c.prototype.readUint8 = c.prototype.readUInt8 = function(l, h) {
      return l = l >>> 0, h || G(l, 1, this.length), this[l];
    }, c.prototype.readUint16LE = c.prototype.readUInt16LE = function(l, h) {
      return l = l >>> 0, h || G(l, 2, this.length), this[l] | this[l + 1] << 8;
    }, c.prototype.readUint16BE = c.prototype.readUInt16BE = function(l, h) {
      return l = l >>> 0, h || G(l, 2, this.length), this[l] << 8 | this[l + 1];
    }, c.prototype.readUint32LE = c.prototype.readUInt32LE = function(l, h) {
      return l = l >>> 0, h || G(l, 4, this.length), (this[l] | this[l + 1] << 8 | this[l + 2] << 16) + this[l + 3] * 16777216;
    }, c.prototype.readUint32BE = c.prototype.readUInt32BE = function(l, h) {
      return l = l >>> 0, h || G(l, 4, this.length), this[l] * 16777216 + (this[l + 1] << 16 | this[l + 2] << 8 | this[l + 3]);
    }, c.prototype.readBigUInt64LE = _n(function(l) {
      l = l >>> 0, zr(l, "offset");
      const h = this[l], _ = this[l + 7];
      (h === void 0 || _ === void 0) && ki(l, this.length - 8);
      const x = h + this[++l] * 2 ** 8 + this[++l] * 2 ** 16 + this[++l] * 2 ** 24, P = this[++l] + this[++l] * 2 ** 8 + this[++l] * 2 ** 16 + _ * 2 ** 24;
      return BigInt(x) + (BigInt(P) << BigInt(32));
    }), c.prototype.readBigUInt64BE = _n(function(l) {
      l = l >>> 0, zr(l, "offset");
      const h = this[l], _ = this[l + 7];
      (h === void 0 || _ === void 0) && ki(l, this.length - 8);
      const x = h * 2 ** 24 + this[++l] * 2 ** 16 + this[++l] * 2 ** 8 + this[++l], P = this[++l] * 2 ** 24 + this[++l] * 2 ** 16 + this[++l] * 2 ** 8 + _;
      return (BigInt(x) << BigInt(32)) + BigInt(P);
    }), c.prototype.readIntLE = function(l, h, _) {
      l = l >>> 0, h = h >>> 0, _ || G(l, h, this.length);
      let x = this[l], P = 1, L = 0;
      for (; ++L < h && (P *= 256); ) x += this[l + L] * P;
      return P *= 128, x >= P && (x -= Math.pow(2, 8 * h)), x;
    }, c.prototype.readIntBE = function(l, h, _) {
      l = l >>> 0, h = h >>> 0, _ || G(l, h, this.length);
      let x = h, P = 1, L = this[l + --x];
      for (; x > 0 && (P *= 256); ) L += this[l + --x] * P;
      return P *= 128, L >= P && (L -= Math.pow(2, 8 * h)), L;
    }, c.prototype.readInt8 = function(l, h) {
      return l = l >>> 0, h || G(l, 1, this.length), this[l] & 128 ? (255 - this[l] + 1) * -1 : this[l];
    }, c.prototype.readInt16LE = function(l, h) {
      l = l >>> 0, h || G(l, 2, this.length);
      const _ = this[l] | this[l + 1] << 8;
      return _ & 32768 ? _ | 4294901760 : _;
    }, c.prototype.readInt16BE = function(l, h) {
      l = l >>> 0, h || G(l, 2, this.length);
      const _ = this[l + 1] | this[l] << 8;
      return _ & 32768 ? _ | 4294901760 : _;
    }, c.prototype.readInt32LE = function(l, h) {
      return l = l >>> 0, h || G(l, 4, this.length), this[l] | this[l + 1] << 8 | this[l + 2] << 16 | this[l + 3] << 24;
    }, c.prototype.readInt32BE = function(l, h) {
      return l = l >>> 0, h || G(l, 4, this.length), this[l] << 24 | this[l + 1] << 16 | this[l + 2] << 8 | this[l + 3];
    }, c.prototype.readBigInt64LE = _n(function(l) {
      l = l >>> 0, zr(l, "offset");
      const h = this[l], _ = this[l + 7];
      (h === void 0 || _ === void 0) && ki(l, this.length - 8);
      const x = this[l + 4] + this[l + 5] * 2 ** 8 + this[l + 6] * 2 ** 16 + (_ << 24);
      return (BigInt(x) << BigInt(32)) + BigInt(h + this[++l] * 2 ** 8 + this[++l] * 2 ** 16 + this[++l] * 2 ** 24);
    }), c.prototype.readBigInt64BE = _n(function(l) {
      l = l >>> 0, zr(l, "offset");
      const h = this[l], _ = this[l + 7];
      (h === void 0 || _ === void 0) && ki(l, this.length - 8);
      const x = (h << 24) + this[++l] * 2 ** 16 + this[++l] * 2 ** 8 + this[++l];
      return (BigInt(x) << BigInt(32)) + BigInt(this[++l] * 2 ** 24 + this[++l] * 2 ** 16 + this[++l] * 2 ** 8 + _);
    }), c.prototype.readFloatLE = function(l, h) {
      return l = l >>> 0, h || G(l, 4, this.length), n.read(this, l, true, 23, 4);
    }, c.prototype.readFloatBE = function(l, h) {
      return l = l >>> 0, h || G(l, 4, this.length), n.read(this, l, false, 23, 4);
    }, c.prototype.readDoubleLE = function(l, h) {
      return l = l >>> 0, h || G(l, 8, this.length), n.read(this, l, true, 52, 8);
    }, c.prototype.readDoubleBE = function(l, h) {
      return l = l >>> 0, h || G(l, 8, this.length), n.read(this, l, false, 52, 8);
    };
    function Y(g, l, h, _, x, P) {
      if (!c.isBuffer(g)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (l > x || l < P) throw new RangeError('"value" argument is out of bounds');
      if (h + _ > g.length) throw new RangeError("Index out of range");
    }
    c.prototype.writeUintLE = c.prototype.writeUIntLE = function(l, h, _, x) {
      if (l = +l, h = h >>> 0, _ = _ >>> 0, !x) {
        const re = Math.pow(2, 8 * _) - 1;
        Y(this, l, h, _, re, 0);
      }
      let P = 1, L = 0;
      for (this[h] = l & 255; ++L < _ && (P *= 256); ) this[h + L] = l / P & 255;
      return h + _;
    }, c.prototype.writeUintBE = c.prototype.writeUIntBE = function(l, h, _, x) {
      if (l = +l, h = h >>> 0, _ = _ >>> 0, !x) {
        const re = Math.pow(2, 8 * _) - 1;
        Y(this, l, h, _, re, 0);
      }
      let P = _ - 1, L = 1;
      for (this[h + P] = l & 255; --P >= 0 && (L *= 256); ) this[h + P] = l / L & 255;
      return h + _;
    }, c.prototype.writeUint8 = c.prototype.writeUInt8 = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 1, 255, 0), this[h] = l & 255, h + 1;
    }, c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 2, 65535, 0), this[h] = l & 255, this[h + 1] = l >>> 8, h + 2;
    }, c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 2, 65535, 0), this[h] = l >>> 8, this[h + 1] = l & 255, h + 2;
    }, c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 4, 4294967295, 0), this[h + 3] = l >>> 24, this[h + 2] = l >>> 16, this[h + 1] = l >>> 8, this[h] = l & 255, h + 4;
    }, c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 4, 4294967295, 0), this[h] = l >>> 24, this[h + 1] = l >>> 16, this[h + 2] = l >>> 8, this[h + 3] = l & 255, h + 4;
    };
    function ue(g, l, h, _, x) {
      Sf(l, _, x, g, h, 7);
      let P = Number(l & BigInt(4294967295));
      g[h++] = P, P = P >> 8, g[h++] = P, P = P >> 8, g[h++] = P, P = P >> 8, g[h++] = P;
      let L = Number(l >> BigInt(32) & BigInt(4294967295));
      return g[h++] = L, L = L >> 8, g[h++] = L, L = L >> 8, g[h++] = L, L = L >> 8, g[h++] = L, h;
    }
    function be(g, l, h, _, x) {
      Sf(l, _, x, g, h, 7);
      let P = Number(l & BigInt(4294967295));
      g[h + 7] = P, P = P >> 8, g[h + 6] = P, P = P >> 8, g[h + 5] = P, P = P >> 8, g[h + 4] = P;
      let L = Number(l >> BigInt(32) & BigInt(4294967295));
      return g[h + 3] = L, L = L >> 8, g[h + 2] = L, L = L >> 8, g[h + 1] = L, L = L >> 8, g[h] = L, h + 8;
    }
    c.prototype.writeBigUInt64LE = _n(function(l, h = 0) {
      return ue(this, l, h, BigInt(0), BigInt("0xffffffffffffffff"));
    }), c.prototype.writeBigUInt64BE = _n(function(l, h = 0) {
      return be(this, l, h, BigInt(0), BigInt("0xffffffffffffffff"));
    }), c.prototype.writeIntLE = function(l, h, _, x) {
      if (l = +l, h = h >>> 0, !x) {
        const xe = Math.pow(2, 8 * _ - 1);
        Y(this, l, h, _, xe - 1, -xe);
      }
      let P = 0, L = 1, re = 0;
      for (this[h] = l & 255; ++P < _ && (L *= 256); ) l < 0 && re === 0 && this[h + P - 1] !== 0 && (re = 1), this[h + P] = (l / L >> 0) - re & 255;
      return h + _;
    }, c.prototype.writeIntBE = function(l, h, _, x) {
      if (l = +l, h = h >>> 0, !x) {
        const xe = Math.pow(2, 8 * _ - 1);
        Y(this, l, h, _, xe - 1, -xe);
      }
      let P = _ - 1, L = 1, re = 0;
      for (this[h + P] = l & 255; --P >= 0 && (L *= 256); ) l < 0 && re === 0 && this[h + P + 1] !== 0 && (re = 1), this[h + P] = (l / L >> 0) - re & 255;
      return h + _;
    }, c.prototype.writeInt8 = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 1, 127, -128), l < 0 && (l = 255 + l + 1), this[h] = l & 255, h + 1;
    }, c.prototype.writeInt16LE = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 2, 32767, -32768), this[h] = l & 255, this[h + 1] = l >>> 8, h + 2;
    }, c.prototype.writeInt16BE = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 2, 32767, -32768), this[h] = l >>> 8, this[h + 1] = l & 255, h + 2;
    }, c.prototype.writeInt32LE = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 4, 2147483647, -2147483648), this[h] = l & 255, this[h + 1] = l >>> 8, this[h + 2] = l >>> 16, this[h + 3] = l >>> 24, h + 4;
    }, c.prototype.writeInt32BE = function(l, h, _) {
      return l = +l, h = h >>> 0, _ || Y(this, l, h, 4, 2147483647, -2147483648), l < 0 && (l = 4294967295 + l + 1), this[h] = l >>> 24, this[h + 1] = l >>> 16, this[h + 2] = l >>> 8, this[h + 3] = l & 255, h + 4;
    }, c.prototype.writeBigInt64LE = _n(function(l, h = 0) {
      return ue(this, l, h, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), c.prototype.writeBigInt64BE = _n(function(l, h = 0) {
      return be(this, l, h, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function Fe(g, l, h, _, x, P) {
      if (h + _ > g.length) throw new RangeError("Index out of range");
      if (h < 0) throw new RangeError("Index out of range");
    }
    function ye(g, l, h, _, x) {
      return l = +l, h = h >>> 0, x || Fe(g, l, h, 4), n.write(g, l, h, _, 23, 4), h + 4;
    }
    c.prototype.writeFloatLE = function(l, h, _) {
      return ye(this, l, h, true, _);
    }, c.prototype.writeFloatBE = function(l, h, _) {
      return ye(this, l, h, false, _);
    };
    function Pe(g, l, h, _, x) {
      return l = +l, h = h >>> 0, x || Fe(g, l, h, 8), n.write(g, l, h, _, 52, 8), h + 8;
    }
    c.prototype.writeDoubleLE = function(l, h, _) {
      return Pe(this, l, h, true, _);
    }, c.prototype.writeDoubleBE = function(l, h, _) {
      return Pe(this, l, h, false, _);
    }, c.prototype.copy = function(l, h, _, x) {
      if (!c.isBuffer(l)) throw new TypeError("argument should be a Buffer");
      if (_ || (_ = 0), !x && x !== 0 && (x = this.length), h >= l.length && (h = l.length), h || (h = 0), x > 0 && x < _ && (x = _), x === _ || l.length === 0 || this.length === 0) return 0;
      if (h < 0) throw new RangeError("targetStart out of bounds");
      if (_ < 0 || _ >= this.length) throw new RangeError("Index out of range");
      if (x < 0) throw new RangeError("sourceEnd out of bounds");
      x > this.length && (x = this.length), l.length - h < x - _ && (x = l.length - h + _);
      const P = x - _;
      return this === l && typeof o.prototype.copyWithin == "function" ? this.copyWithin(h, _, x) : o.prototype.set.call(l, this.subarray(_, x), h), P;
    }, c.prototype.fill = function(l, h, _, x) {
      if (typeof l == "string") {
        if (typeof h == "string" ? (x = h, h = 0, _ = this.length) : typeof _ == "string" && (x = _, _ = this.length), x !== void 0 && typeof x != "string") throw new TypeError("encoding must be a string");
        if (typeof x == "string" && !c.isEncoding(x)) throw new TypeError("Unknown encoding: " + x);
        if (l.length === 1) {
          const L = l.charCodeAt(0);
          (x === "utf8" && L < 128 || x === "latin1") && (l = L);
        }
      } else typeof l == "number" ? l = l & 255 : typeof l == "boolean" && (l = Number(l));
      if (h < 0 || this.length < h || this.length < _) throw new RangeError("Out of range index");
      if (_ <= h) return this;
      h = h >>> 0, _ = _ === void 0 ? this.length : _ >>> 0, l || (l = 0);
      let P;
      if (typeof l == "number") for (P = h; P < _; ++P) this[P] = l;
      else {
        const L = c.isBuffer(l) ? l : c.from(l, x), re = L.length;
        if (re === 0) throw new TypeError('The value "' + l + '" is invalid for argument "value"');
        for (P = 0; P < _ - h; ++P) this[P + h] = L[P % re];
      }
      return this;
    };
    const kt = {};
    function Vr(g, l, h) {
      kt[g] = class extends h {
        constructor() {
          super(), Object.defineProperty(this, "message", {
            value: l.apply(this, arguments),
            writable: true,
            configurable: true
          }), this.name = `${this.name} [${g}]`, this.stack, delete this.name;
        }
        get code() {
          return g;
        }
        set code(x) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value: x,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${g}]: ${this.message}`;
        }
      };
    }
    Vr("ERR_BUFFER_OUT_OF_BOUNDS", function(g) {
      return g ? `${g} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    }, RangeError), Vr("ERR_INVALID_ARG_TYPE", function(g, l) {
      return `The "${g}" argument must be of type number. Received type ${typeof l}`;
    }, TypeError), Vr("ERR_OUT_OF_RANGE", function(g, l, h) {
      let _ = `The value of "${g}" is out of range.`, x = h;
      return Number.isInteger(h) && Math.abs(h) > 2 ** 32 ? x = Ai(String(h)) : typeof h == "bigint" && (x = String(h), (h > BigInt(2) ** BigInt(32) || h < -(BigInt(2) ** BigInt(32))) && (x = Ai(x)), x += "n"), _ += ` It must be ${l}. Received ${x}`, _;
    }, RangeError);
    function Ai(g) {
      let l = "", h = g.length;
      const _ = g[0] === "-" ? 1 : 0;
      for (; h >= _ + 4; h -= 3) l = `_${g.slice(h - 3, h)}${l}`;
      return `${g.slice(0, h)}${l}`;
    }
    function Ep(g, l, h) {
      zr(l, "offset"), (g[l] === void 0 || g[l + h] === void 0) && ki(l, g.length - (h + 1));
    }
    function Sf(g, l, h, _, x, P) {
      if (g > h || g < l) {
        const L = typeof l == "bigint" ? "n" : "";
        let re;
        throw l === 0 || l === BigInt(0) ? re = `>= 0${L} and < 2${L} ** ${(P + 1) * 8}${L}` : re = `>= -(2${L} ** ${(P + 1) * 8 - 1}${L}) and < 2 ** ${(P + 1) * 8 - 1}${L}`, new kt.ERR_OUT_OF_RANGE("value", re, g);
      }
      Ep(_, x, P);
    }
    function zr(g, l) {
      if (typeof g != "number") throw new kt.ERR_INVALID_ARG_TYPE(l, "number", g);
    }
    function ki(g, l, h) {
      throw Math.floor(g) !== g ? (zr(g, h), new kt.ERR_OUT_OF_RANGE("offset", "an integer", g)) : l < 0 ? new kt.ERR_BUFFER_OUT_OF_BOUNDS() : new kt.ERR_OUT_OF_RANGE("offset", `>= 0 and <= ${l}`, g);
    }
    const Sp = /[^+/0-9A-Za-z-_]/g;
    function xp(g) {
      if (g = g.split("=")[0], g = g.trim().replace(Sp, ""), g.length < 2) return "";
      for (; g.length % 4 !== 0; ) g = g + "=";
      return g;
    }
    function ta(g, l) {
      l = l || 1 / 0;
      let h;
      const _ = g.length;
      let x = null;
      const P = [];
      for (let L = 0; L < _; ++L) {
        if (h = g.charCodeAt(L), h > 55295 && h < 57344) {
          if (!x) {
            if (h > 56319) {
              (l -= 3) > -1 && P.push(239, 191, 189);
              continue;
            } else if (L + 1 === _) {
              (l -= 3) > -1 && P.push(239, 191, 189);
              continue;
            }
            x = h;
            continue;
          }
          if (h < 56320) {
            (l -= 3) > -1 && P.push(239, 191, 189), x = h;
            continue;
          }
          h = (x - 55296 << 10 | h - 56320) + 65536;
        } else x && (l -= 3) > -1 && P.push(239, 191, 189);
        if (x = null, h < 128) {
          if ((l -= 1) < 0) break;
          P.push(h);
        } else if (h < 2048) {
          if ((l -= 2) < 0) break;
          P.push(h >> 6 | 192, h & 63 | 128);
        } else if (h < 65536) {
          if ((l -= 3) < 0) break;
          P.push(h >> 12 | 224, h >> 6 & 63 | 128, h & 63 | 128);
        } else if (h < 1114112) {
          if ((l -= 4) < 0) break;
          P.push(h >> 18 | 240, h >> 12 & 63 | 128, h >> 6 & 63 | 128, h & 63 | 128);
        } else throw new Error("Invalid code point");
      }
      return P;
    }
    function vp(g) {
      const l = [];
      for (let h = 0; h < g.length; ++h) l.push(g.charCodeAt(h) & 255);
      return l;
    }
    function Ip(g, l) {
      let h, _, x;
      const P = [];
      for (let L = 0; L < g.length && !((l -= 2) < 0); ++L) h = g.charCodeAt(L), _ = h >> 8, x = h % 256, P.push(x), P.push(_);
      return P;
    }
    function xf(g) {
      return t.toByteArray(xp(g));
    }
    function To(g, l, h, _) {
      let x;
      for (x = 0; x < _ && !(x + h >= l.length || x >= g.length); ++x) l[x + h] = g[x];
      return x;
    }
    function Ht(g, l) {
      return g instanceof l || g != null && g.constructor != null && g.constructor.name != null && g.constructor.name === l.name;
    }
    function na(g) {
      return g !== g;
    }
    const Tp = function() {
      const g = "0123456789abcdef", l = new Array(256);
      for (let h = 0; h < 16; ++h) {
        const _ = h * 16;
        for (let x = 0; x < 16; ++x) l[_ + x] = g[h] + g[x];
      }
      return l;
    }();
    function _n(g) {
      return typeof BigInt > "u" ? Ap : g;
    }
    function Ap() {
      throw new Error("BigInt not supported");
    }
  })(Re);
  const B = Re.Buffer, Cp = Re.Blob, Lp = Re.BlobOptions, z = Re.Buffer, Fp = Re.File, Mp = Re.FileOptions, Dp = Re.INSPECT_MAX_BYTES, Kp = Re.SlowBuffer, $p = Re.TranscodeEncoding, Vp = Re.atob, zp = Re.btoa, jp = Re.constants, Wp = Re.isAscii, Gp = Re.isUtf8, Xp = Re.kMaxLength, qp = Re.kStringMaxLength, Zp = Re.resolveObjectURL, Yp = Re.transcode, Jp = Object.freeze(Object.defineProperty({
    __proto__: null,
    Blob: Cp,
    BlobOptions: Lp,
    Buffer: z,
    File: Fp,
    FileOptions: Mp,
    INSPECT_MAX_BYTES: Dp,
    SlowBuffer: Kp,
    TranscodeEncoding: $p,
    atob: Vp,
    btoa: zp,
    constants: jp,
    default: B,
    isAscii: Wp,
    isUtf8: Gp,
    kMaxLength: Xp,
    kStringMaxLength: qp,
    resolveObjectURL: Zp,
    transcode: Yp
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function Qp(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
  }
  function ey(e) {
    if (e.__esModule) return e;
    var t = e.default;
    if (typeof t == "function") {
      var n = function r() {
        return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
      };
      n.prototype = t.prototype;
    } else n = {};
    return Object.defineProperty(n, "__esModule", {
      value: true
    }), Object.keys(e).forEach(function(r) {
      var i = Object.getOwnPropertyDescriptor(e, r);
      Object.defineProperty(n, r, i.get ? i : {
        enumerable: true,
        get: function() {
          return e[r];
        }
      });
    }), n;
  }
  var at = {}, Ye = {}, Ce = {};
  Object.defineProperty(Ce, "__esModule", {
    value: true
  });
  Ce.testnet = Ce.regtest = Ce.bitcoin = void 0;
  Ce.bitcoin = {
    messagePrefix: `Bitcoin Signed Message:
`,
    bech32: "bc",
    bip32: {
      public: 76067358,
      private: 76066276
    },
    pubKeyHash: 0,
    scriptHash: 5,
    wif: 128
  };
  Ce.regtest = {
    messagePrefix: `Bitcoin Signed Message:
`,
    bech32: "bcrt",
    bip32: {
      public: 70617039,
      private: 70615956
    },
    pubKeyHash: 111,
    scriptHash: 196,
    wif: 239
  };
  Ce.testnet = {
    messagePrefix: `Bitcoin Signed Message:
`,
    bech32: "tb",
    bip32: {
      public: 70617039,
      private: 70615956
    },
    pubKeyHash: 111,
    scriptHash: 196,
    wif: 239
  };
  var ia = {}, Ts = {}, oa = {}, pn = {};
  Object.defineProperty(pn, "__esModule", {
    value: true
  });
  pn.encode = pn.decode = pn.check = void 0;
  function ty(e) {
    if (e.length < 8 || e.length > 72 || e[0] !== 48 || e[1] !== e.length - 2 || e[2] !== 2) return false;
    const t = e[3];
    if (t === 0 || 5 + t >= e.length || e[4 + t] !== 2) return false;
    const n = e[5 + t];
    return !(n === 0 || 6 + t + n !== e.length || e[4] & 128 || t > 1 && e[4] === 0 && !(e[5] & 128) || e[t + 6] & 128 || n > 1 && e[t + 6] === 0 && !(e[t + 7] & 128));
  }
  pn.check = ty;
  function ny(e) {
    if (e.length < 8) throw new Error("DER sequence length is too short");
    if (e.length > 72) throw new Error("DER sequence length is too long");
    if (e[0] !== 48) throw new Error("Expected DER sequence");
    if (e[1] !== e.length - 2) throw new Error("DER sequence length is invalid");
    if (e[2] !== 2) throw new Error("Expected DER integer");
    const t = e[3];
    if (t === 0) throw new Error("R length is zero");
    if (5 + t >= e.length) throw new Error("R length is too long");
    if (e[4 + t] !== 2) throw new Error("Expected DER integer (2)");
    const n = e[5 + t];
    if (n === 0) throw new Error("S length is zero");
    if (6 + t + n !== e.length) throw new Error("S length is invalid");
    if (e[4] & 128) throw new Error("R value is negative");
    if (t > 1 && e[4] === 0 && !(e[5] & 128)) throw new Error("R value excessively padded");
    if (e[t + 6] & 128) throw new Error("S value is negative");
    if (n > 1 && e[t + 6] === 0 && !(e[t + 7] & 128)) throw new Error("S value excessively padded");
    return {
      r: e.slice(4, 4 + t),
      s: e.slice(6 + t)
    };
  }
  pn.decode = ny;
  function ry(e, t) {
    const n = e.length, r = t.length;
    if (n === 0) throw new Error("R length is zero");
    if (r === 0) throw new Error("S length is zero");
    if (n > 33) throw new Error("R length is too long");
    if (r > 33) throw new Error("S length is too long");
    if (e[0] & 128) throw new Error("R value is negative");
    if (t[0] & 128) throw new Error("S value is negative");
    if (n > 1 && e[0] === 0 && !(e[1] & 128)) throw new Error("R value excessively padded");
    if (r > 1 && t[0] === 0 && !(t[1] & 128)) throw new Error("S value excessively padded");
    const i = B.allocUnsafe(6 + n + r);
    return i[0] = 48, i[1] = i.length - 2, i[2] = 2, i[3] = e.length, e.copy(i, 4), i[4 + n] = 2, i[5 + n] = t.length, t.copy(i, 6 + n), i;
  }
  pn.encode = ry;
  var Kn = {};
  Object.defineProperty(Kn, "__esModule", {
    value: true
  });
  Kn.REVERSE_OPS = Kn.OPS = void 0;
  const Ga = {
    OP_FALSE: 0,
    OP_0: 0,
    OP_PUSHDATA1: 76,
    OP_PUSHDATA2: 77,
    OP_PUSHDATA4: 78,
    OP_1NEGATE: 79,
    OP_RESERVED: 80,
    OP_TRUE: 81,
    OP_1: 81,
    OP_2: 82,
    OP_3: 83,
    OP_4: 84,
    OP_5: 85,
    OP_6: 86,
    OP_7: 87,
    OP_8: 88,
    OP_9: 89,
    OP_10: 90,
    OP_11: 91,
    OP_12: 92,
    OP_13: 93,
    OP_14: 94,
    OP_15: 95,
    OP_16: 96,
    OP_NOP: 97,
    OP_VER: 98,
    OP_IF: 99,
    OP_NOTIF: 100,
    OP_VERIF: 101,
    OP_VERNOTIF: 102,
    OP_ELSE: 103,
    OP_ENDIF: 104,
    OP_VERIFY: 105,
    OP_RETURN: 106,
    OP_TOALTSTACK: 107,
    OP_FROMALTSTACK: 108,
    OP_2DROP: 109,
    OP_2DUP: 110,
    OP_3DUP: 111,
    OP_2OVER: 112,
    OP_2ROT: 113,
    OP_2SWAP: 114,
    OP_IFDUP: 115,
    OP_DEPTH: 116,
    OP_DROP: 117,
    OP_DUP: 118,
    OP_NIP: 119,
    OP_OVER: 120,
    OP_PICK: 121,
    OP_ROLL: 122,
    OP_ROT: 123,
    OP_SWAP: 124,
    OP_TUCK: 125,
    OP_CAT: 126,
    OP_SUBSTR: 127,
    OP_LEFT: 128,
    OP_RIGHT: 129,
    OP_SIZE: 130,
    OP_INVERT: 131,
    OP_AND: 132,
    OP_OR: 133,
    OP_XOR: 134,
    OP_EQUAL: 135,
    OP_EQUALVERIFY: 136,
    OP_RESERVED1: 137,
    OP_RESERVED2: 138,
    OP_1ADD: 139,
    OP_1SUB: 140,
    OP_2MUL: 141,
    OP_2DIV: 142,
    OP_NEGATE: 143,
    OP_ABS: 144,
    OP_NOT: 145,
    OP_0NOTEQUAL: 146,
    OP_ADD: 147,
    OP_SUB: 148,
    OP_MUL: 149,
    OP_DIV: 150,
    OP_MOD: 151,
    OP_LSHIFT: 152,
    OP_RSHIFT: 153,
    OP_BOOLAND: 154,
    OP_BOOLOR: 155,
    OP_NUMEQUAL: 156,
    OP_NUMEQUALVERIFY: 157,
    OP_NUMNOTEQUAL: 158,
    OP_LESSTHAN: 159,
    OP_GREATERTHAN: 160,
    OP_LESSTHANOREQUAL: 161,
    OP_GREATERTHANOREQUAL: 162,
    OP_MIN: 163,
    OP_MAX: 164,
    OP_WITHIN: 165,
    OP_RIPEMD160: 166,
    OP_SHA1: 167,
    OP_SHA256: 168,
    OP_HASH160: 169,
    OP_HASH256: 170,
    OP_CODESEPARATOR: 171,
    OP_CHECKSIG: 172,
    OP_CHECKSIGVERIFY: 173,
    OP_CHECKMULTISIG: 174,
    OP_CHECKMULTISIGVERIFY: 175,
    OP_NOP1: 176,
    OP_NOP2: 177,
    OP_CHECKLOCKTIMEVERIFY: 177,
    OP_NOP3: 178,
    OP_CHECKSEQUENCEVERIFY: 178,
    OP_NOP4: 179,
    OP_NOP5: 180,
    OP_NOP6: 181,
    OP_NOP7: 182,
    OP_NOP8: 183,
    OP_NOP9: 184,
    OP_NOP10: 185,
    OP_CHECKSIGADD: 186,
    OP_PUBKEYHASH: 253,
    OP_PUBKEY: 254,
    OP_INVALIDOPCODE: 255
  };
  Kn.OPS = Ga;
  const Hl = {};
  Kn.REVERSE_OPS = Hl;
  for (const e of Object.keys(Ga)) {
    const t = Ga[e];
    Hl[t] = e;
  }
  var Cn = {};
  Object.defineProperty(Cn, "__esModule", {
    value: true
  });
  Cn.decode = Cn.encode = Cn.encodingLength = void 0;
  const Rn = Kn;
  function Ul(e) {
    return e < Rn.OPS.OP_PUSHDATA1 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5;
  }
  Cn.encodingLength = Ul;
  function iy(e, t, n) {
    const r = Ul(t);
    return r === 1 ? e.writeUInt8(t, n) : r === 2 ? (e.writeUInt8(Rn.OPS.OP_PUSHDATA1, n), e.writeUInt8(t, n + 1)) : r === 3 ? (e.writeUInt8(Rn.OPS.OP_PUSHDATA2, n), e.writeUInt16LE(t, n + 1)) : (e.writeUInt8(Rn.OPS.OP_PUSHDATA4, n), e.writeUInt32LE(t, n + 1)), r;
  }
  Cn.encode = iy;
  function oy(e, t) {
    const n = e.readUInt8(t);
    let r, i;
    if (n < Rn.OPS.OP_PUSHDATA1) r = n, i = 1;
    else if (n === Rn.OPS.OP_PUSHDATA1) {
      if (t + 2 > e.length) return null;
      r = e.readUInt8(t + 1), i = 2;
    } else if (n === Rn.OPS.OP_PUSHDATA2) {
      if (t + 3 > e.length) return null;
      r = e.readUInt16LE(t + 1), i = 3;
    } else {
      if (t + 5 > e.length) return null;
      if (n !== Rn.OPS.OP_PUSHDATA4) throw new Error("Unexpected opcode");
      r = e.readUInt32LE(t + 1), i = 5;
    }
    return {
      opcode: n,
      number: r,
      size: i
    };
  }
  Cn.decode = oy;
  var hi = {};
  Object.defineProperty(hi, "__esModule", {
    value: true
  });
  hi.encode = hi.decode = void 0;
  function sy(e, t, n) {
    t = t || 4, n = n === void 0 ? true : n;
    const r = e.length;
    if (r === 0) return 0;
    if (r > t) throw new TypeError("Script number overflow");
    if (n && !(e[r - 1] & 127) && (r <= 1 || !(e[r - 2] & 128))) throw new Error("Non-minimally encoded script number");
    if (r === 5) {
      const o = e.readUInt32LE(0), s = e.readUInt8(4);
      return s & 128 ? -((s & -129) * 4294967296 + o) : s * 4294967296 + o;
    }
    let i = 0;
    for (let o = 0; o < r; ++o) i |= e[o] << 8 * o;
    return e[r - 1] & 128 ? -(i & ~(128 << 8 * (r - 1))) : i;
  }
  hi.decode = sy;
  function ay(e) {
    return e > 2147483647 ? 5 : e > 8388607 ? 4 : e > 32767 ? 3 : e > 127 ? 2 : e > 0 ? 1 : 0;
  }
  function cy(e) {
    let t = Math.abs(e);
    const n = ay(t), r = B.allocUnsafe(n), i = e < 0;
    for (let o = 0; o < n; ++o) r.writeUInt8(t & 255, o), t >>= 8;
    return r[n - 1] & 128 ? r.writeUInt8(i ? 128 : 0, n - 1) : i && (r[n - 1] |= 128), r;
  }
  hi.encode = cy;
  var Xn = {}, ze = {};
  const As = ey(Jp);
  var Xi = {
    Array: function(e) {
      return e != null && e.constructor === Array;
    },
    Boolean: function(e) {
      return typeof e == "boolean";
    },
    Function: function(e) {
      return typeof e == "function";
    },
    Nil: function(e) {
      return e == null;
    },
    Number: function(e) {
      return typeof e == "number";
    },
    Object: function(e) {
      return typeof e == "object";
    },
    String: function(e) {
      return typeof e == "string";
    },
    "": function() {
      return true;
    }
  };
  Xi.Null = Xi.Nil;
  for (var vf in Xi) Xi[vf].toJSON = (function(e) {
    return e;
  }).bind(null, vf);
  var vc = Xi, ar = vc;
  function Rl(e) {
    return e.name || e.toString().match(/function (.*?)\s*\(/)[1];
  }
  function Ic(e) {
    return ar.Nil(e) ? "" : Rl(e.constructor);
  }
  function fy(e) {
    return ar.Function(e) ? "" : ar.String(e) ? JSON.stringify(e) : e && ar.Object(e) ? "" : e;
  }
  function Tc(e, t) {
    Error.captureStackTrace && Error.captureStackTrace(e, t);
  }
  function is(e) {
    return ar.Function(e) ? e.toJSON ? e.toJSON() : Rl(e) : ar.Array(e) ? "Array" : e && ar.Object(e) ? "Object" : e !== void 0 ? e : "";
  }
  function Nl(e, t, n) {
    var r = fy(t);
    return "Expected " + is(e) + ", got" + (n !== "" ? " " + n : "") + (r !== "" ? " " + r : "");
  }
  function wn(e, t, n) {
    n = n || Ic(t), this.message = Nl(e, t, n), Tc(this, wn), this.__type = e, this.__value = t, this.__valueTypeName = n;
  }
  wn.prototype = Object.create(Error.prototype);
  wn.prototype.constructor = wn;
  function uy(e, t, n, r, i) {
    var o = '" of type ';
    return t === "key" && (o = '" with key type '), Nl('property "' + is(n) + o + is(e), r, i);
  }
  function si(e, t, n, r, i) {
    e ? (i = i || Ic(r), this.message = uy(e, n, t, r, i)) : this.message = 'Unexpected property "' + t + '"', Tc(this, wn), this.__label = n, this.__property = t, this.__type = e, this.__value = r, this.__valueTypeName = i;
  }
  si.prototype = Object.create(Error.prototype);
  si.prototype.constructor = wn;
  function ly(e, t) {
    return new wn(e, {}, t);
  }
  function hy(e, t, n) {
    return e instanceof si ? (t = t + "." + e.__property, e = new si(e.__type, t, e.__label, e.__value, e.__valueTypeName)) : e instanceof wn && (e = new si(e.__type, t, n, e.__value, e.__valueTypeName)), Tc(e), e;
  }
  var Cl = {
    TfTypeError: wn,
    TfPropertyTypeError: si,
    tfCustomError: ly,
    tfSubError: hy,
    tfJSON: is,
    getValueTypeName: Ic
  }, sa, If;
  function dy() {
    if (If) return sa;
    If = 1;
    var e = vc, t = Cl;
    function n(T) {
      return B.isBuffer(T);
    }
    function r(T) {
      return typeof T == "string" && /^([0-9a-f]{2})+$/i.test(T);
    }
    function i(T, R) {
      var M = T.toJSON();
      function v(H) {
        if (!T(H)) return false;
        if (H.length === R) return true;
        throw t.tfCustomError(M + "(Length: " + R + ")", M + "(Length: " + H.length + ")");
      }
      return v.toJSON = function() {
        return M;
      }, v;
    }
    var o = i.bind(null, e.Array), s = i.bind(null, n), a = i.bind(null, r), f = i.bind(null, e.String);
    function u(T, R, M) {
      M = M || e.Number;
      function v(H, D) {
        return M(H, D) && H > T && H < R;
      }
      return v.toJSON = function() {
        return `${M.toJSON()} between [${T}, ${R}]`;
      }, v;
    }
    var c = Math.pow(2, 53) - 1;
    function p(T) {
      return typeof T == "number" && isFinite(T);
    }
    function y(T) {
      return T << 24 >> 24 === T;
    }
    function d(T) {
      return T << 16 >> 16 === T;
    }
    function w(T) {
      return (T | 0) === T;
    }
    function b(T) {
      return typeof T == "number" && T >= -c && T <= c && Math.floor(T) === T;
    }
    function S(T) {
      return (T & 255) === T;
    }
    function A(T) {
      return (T & 65535) === T;
    }
    function O(T) {
      return T >>> 0 === T;
    }
    function E(T) {
      return typeof T == "number" && T >= 0 && T <= c && Math.floor(T) === T;
    }
    var m = {
      ArrayN: o,
      Buffer: n,
      BufferN: s,
      Finite: p,
      Hex: r,
      HexN: a,
      Int8: y,
      Int16: d,
      Int32: w,
      Int53: b,
      Range: u,
      StringN: f,
      UInt8: S,
      UInt16: A,
      UInt32: O,
      UInt53: E
    };
    for (var k in m) m[k].toJSON = (function(T) {
      return T;
    }).bind(null, k);
    return sa = m, sa;
  }
  var fo = Cl, $e = vc, Zt = fo.tfJSON, Ll = fo.TfTypeError, Fl = fo.TfPropertyTypeError, Bi = fo.tfSubError, py = fo.getValueTypeName, ln = {
    arrayOf: function(t, n) {
      t = Kt(t), n = n || {};
      function r(i, o) {
        return !$e.Array(i) || $e.Nil(i) || n.minLength !== void 0 && i.length < n.minLength || n.maxLength !== void 0 && i.length > n.maxLength || n.length !== void 0 && i.length !== n.length ? false : i.every(function(s, a) {
          try {
            return tt(t, s, o);
          } catch (f) {
            throw Bi(f, a);
          }
        });
      }
      return r.toJSON = function() {
        var i = "[" + Zt(t) + "]";
        return n.length !== void 0 ? i += "{" + n.length + "}" : (n.minLength !== void 0 || n.maxLength !== void 0) && (i += "{" + (n.minLength === void 0 ? 0 : n.minLength) + "," + (n.maxLength === void 0 ? 1 / 0 : n.maxLength) + "}"), i;
      }, r;
    },
    maybe: function e(t) {
      t = Kt(t);
      function n(r, i) {
        return $e.Nil(r) || t(r, i, e);
      }
      return n.toJSON = function() {
        return "?" + Zt(t);
      }, n;
    },
    map: function(t, n) {
      t = Kt(t), n && (n = Kt(n));
      function r(i, o) {
        if (!$e.Object(i) || $e.Nil(i)) return false;
        for (var s in i) {
          try {
            n && tt(n, s, o);
          } catch (f) {
            throw Bi(f, s, "key");
          }
          try {
            var a = i[s];
            tt(t, a, o);
          } catch (f) {
            throw Bi(f, s);
          }
        }
        return true;
      }
      return n ? r.toJSON = function() {
        return "{" + Zt(n) + ": " + Zt(t) + "}";
      } : r.toJSON = function() {
        return "{" + Zt(t) + "}";
      }, r;
    },
    object: function(t) {
      var n = {};
      for (var r in t) n[r] = Kt(t[r]);
      function i(o, s) {
        if (!$e.Object(o) || $e.Nil(o)) return false;
        var a;
        try {
          for (a in n) {
            var f = n[a], u = o[a];
            tt(f, u, s);
          }
        } catch (c) {
          throw Bi(c, a);
        }
        if (s) {
          for (a in o) if (!n[a]) throw new Fl(void 0, a);
        }
        return true;
      }
      return i.toJSON = function() {
        return Zt(n);
      }, i;
    },
    anyOf: function() {
      var t = [].slice.call(arguments).map(Kt);
      function n(r, i) {
        return t.some(function(o) {
          try {
            return tt(o, r, i);
          } catch {
            return false;
          }
        });
      }
      return n.toJSON = function() {
        return t.map(Zt).join("|");
      }, n;
    },
    allOf: function() {
      var t = [].slice.call(arguments).map(Kt);
      function n(r, i) {
        return t.every(function(o) {
          try {
            return tt(o, r, i);
          } catch {
            return false;
          }
        });
      }
      return n.toJSON = function() {
        return t.map(Zt).join(" & ");
      }, n;
    },
    quacksLike: function(t) {
      function n(r) {
        return t === py(r);
      }
      return n.toJSON = function() {
        return t;
      }, n;
    },
    tuple: function() {
      var t = [].slice.call(arguments).map(Kt);
      function n(r, i) {
        return $e.Nil(r) || $e.Nil(r.length) || i && r.length !== t.length ? false : t.every(function(o, s) {
          try {
            return tt(o, r[s], i);
          } catch (a) {
            throw Bi(a, s);
          }
        });
      }
      return n.toJSON = function() {
        return "(" + t.map(Zt).join(", ") + ")";
      }, n;
    },
    value: function(t) {
      function n(r) {
        return r === t;
      }
      return n.toJSON = function() {
        return t;
      }, n;
    }
  };
  ln.oneOf = ln.anyOf;
  function Kt(e) {
    if ($e.String(e)) return e[0] === "?" ? ln.maybe(e.slice(1)) : $e[e] || ln.quacksLike(e);
    if (e && $e.Object(e)) {
      if ($e.Array(e)) {
        if (e.length !== 1) throw new TypeError("Expected compile() parameter of type Array of length 1");
        return ln.arrayOf(e[0]);
      }
      return ln.object(e);
    } else if ($e.Function(e)) return e;
    return ln.value(e);
  }
  function tt(e, t, n, r) {
    if ($e.Function(e)) {
      if (e(t, n)) return true;
      throw new Ll(r || e, t);
    }
    return tt(Kt(e), t, n);
  }
  for (var Ln in $e) tt[Ln] = $e[Ln];
  for (Ln in ln) tt[Ln] = ln[Ln];
  var Tf = dy();
  for (Ln in Tf) tt[Ln] = Tf[Ln];
  tt.compile = Kt;
  tt.TfTypeError = Ll;
  tt.TfPropertyTypeError = Fl;
  var yy = tt;
  (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: true
    }), e.oneOf = e.Null = e.BufferN = e.Function = e.UInt32 = e.UInt8 = e.tuple = e.maybe = e.Hex = e.Buffer = e.String = e.Boolean = e.Array = e.Number = e.Hash256bit = e.Hash160bit = e.Buffer256bit = e.isTaptree = e.isTapleaf = e.TAPLEAF_VERSION_MASK = e.Satoshi = e.isPoint = e.stacksEqual = e.typeforce = void 0;
    const t = As;
    e.typeforce = yy;
    const n = t.Buffer.alloc(32, 0), r = t.Buffer.from("fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f", "hex");
    function i(c, p) {
      return c.length !== p.length ? false : c.every((y, d) => y.equals(p[d]));
    }
    e.stacksEqual = i;
    function o(c) {
      if (!t.Buffer.isBuffer(c) || c.length < 33) return false;
      const p = c[0], y = c.slice(1, 33);
      if (y.compare(n) === 0 || y.compare(r) >= 0) return false;
      if ((p === 2 || p === 3) && c.length === 33) return true;
      const d = c.slice(33);
      return d.compare(n) === 0 || d.compare(r) >= 0 ? false : p === 4 && c.length === 65;
    }
    e.isPoint = o;
    const s = 21 * 1e14;
    function a(c) {
      return e.typeforce.UInt53(c) && c <= s;
    }
    e.Satoshi = a, e.TAPLEAF_VERSION_MASK = 254;
    function f(c) {
      return !c || !("output" in c) || !t.Buffer.isBuffer(c.output) ? false : c.version !== void 0 ? (c.version & e.TAPLEAF_VERSION_MASK) === c.version : true;
    }
    e.isTapleaf = f;
    function u(c) {
      return (0, e.Array)(c) ? c.length !== 2 ? false : c.every((p) => u(p)) : f(c);
    }
    e.isTaptree = u, e.Buffer256bit = e.typeforce.BufferN(32), e.Hash160bit = e.typeforce.BufferN(20), e.Hash256bit = e.typeforce.BufferN(32), e.Number = e.typeforce.Number, e.Array = e.typeforce.Array, e.Boolean = e.typeforce.Boolean, e.String = e.typeforce.String, e.Buffer = e.typeforce.Buffer, e.Hex = e.typeforce.Hex, e.maybe = e.typeforce.maybe, e.tuple = e.typeforce.tuple, e.UInt8 = e.typeforce.UInt8, e.UInt32 = e.typeforce.UInt32, e.Function = e.typeforce.Function, e.BufferN = e.typeforce.BufferN, e.Null = e.typeforce.Null, e.oneOf = e.typeforce.oneOf;
  })(ze);
  var Af;
  function gy() {
    if (Af) return Xn;
    Af = 1, Object.defineProperty(Xn, "__esModule", {
      value: true
    }), Xn.encode = Xn.decode = void 0;
    const e = pn, t = ot(), n = ze, { typeforce: r } = n, i = B.alloc(1, 0);
    function o(u) {
      let c = 0;
      for (; u[c] === 0; ) ++c;
      return c === u.length ? i : (u = u.slice(c), u[0] & 128 ? B.concat([
        i,
        u
      ], 1 + u.length) : u);
    }
    function s(u) {
      u[0] === 0 && (u = u.slice(1));
      const c = B.alloc(32, 0), p = Math.max(0, 32 - u.length);
      return u.copy(c, p), c;
    }
    function a(u) {
      const c = u.readUInt8(u.length - 1);
      if (!(0, t.isDefinedHashType)(c)) throw new Error("Invalid hashType " + c);
      const p = e.decode(u.slice(0, -1)), y = s(p.r), d = s(p.s);
      return {
        signature: B.concat([
          y,
          d
        ], 64),
        hashType: c
      };
    }
    Xn.decode = a;
    function f(u, c) {
      if (r({
        signature: n.BufferN(64),
        hashType: n.UInt8
      }, {
        signature: u,
        hashType: c
      }), !(0, t.isDefinedHashType)(c)) throw new Error("Invalid hashType " + c);
      const p = B.allocUnsafe(1);
      p.writeUInt8(c, 0);
      const y = o(u.slice(0, 32)), d = o(u.slice(32, 64));
      return B.concat([
        e.encode(y, d),
        p
      ]);
    }
    return Xn.encode = f, Xn;
  }
  var kf;
  function ot() {
    return kf || (kf = 1, function(e) {
      Object.defineProperty(e, "__esModule", {
        value: true
      }), e.signature = e.number = e.isCanonicalScriptSignature = e.isDefinedHashType = e.isCanonicalPubKey = e.toStack = e.fromASM = e.toASM = e.decompile = e.compile = e.countNonPushOnlyOPs = e.isPushOnly = e.OPS = void 0;
      const t = pn, n = Kn;
      Object.defineProperty(e, "OPS", {
        enumerable: true,
        get: function() {
          return n.OPS;
        }
      });
      const r = Cn, i = hi, o = gy(), s = ze, { typeforce: a } = s, f = n.OPS.OP_RESERVED;
      function u(v) {
        return s.Number(v) && (v === n.OPS.OP_0 || v >= n.OPS.OP_1 && v <= n.OPS.OP_16 || v === n.OPS.OP_1NEGATE);
      }
      function c(v) {
        return s.Buffer(v) || u(v);
      }
      function p(v) {
        return s.Array(v) && v.every(c);
      }
      e.isPushOnly = p;
      function y(v) {
        return v.length - v.filter(c).length;
      }
      e.countNonPushOnlyOPs = y;
      function d(v) {
        if (v.length === 0) return n.OPS.OP_0;
        if (v.length === 1) {
          if (v[0] >= 1 && v[0] <= 16) return f + v[0];
          if (v[0] === 129) return n.OPS.OP_1NEGATE;
        }
      }
      function w(v) {
        return B.isBuffer(v);
      }
      function b(v) {
        return s.Array(v);
      }
      function S(v) {
        return B.isBuffer(v);
      }
      function A(v) {
        if (w(v)) return v;
        a(s.Array, v);
        const H = v.reduce((N, U) => S(U) ? U.length === 1 && d(U) !== void 0 ? N + 1 : N + r.encodingLength(U.length) + U.length : N + 1, 0), D = B.allocUnsafe(H);
        let $ = 0;
        if (v.forEach((N) => {
          if (S(N)) {
            const U = d(N);
            if (U !== void 0) {
              D.writeUInt8(U, $), $ += 1;
              return;
            }
            $ += r.encode(D, N.length, $), N.copy(D, $), $ += N.length;
          } else D.writeUInt8(N, $), $ += 1;
        }), $ !== D.length) throw new Error("Could not decode chunks");
        return D;
      }
      e.compile = A;
      function O(v) {
        if (b(v)) return v;
        a(s.Buffer, v);
        const H = [];
        let D = 0;
        for (; D < v.length; ) {
          const $ = v[D];
          if ($ > n.OPS.OP_0 && $ <= n.OPS.OP_PUSHDATA4) {
            const N = r.decode(v, D);
            if (N === null || (D += N.size, D + N.number > v.length)) return null;
            const U = v.slice(D, D + N.number);
            D += N.number;
            const C = d(U);
            C !== void 0 ? H.push(C) : H.push(U);
          } else H.push($), D += 1;
        }
        return H;
      }
      e.decompile = O;
      function E(v) {
        if (w(v) && (v = O(v)), !v) throw new Error("Could not convert invalid chunks to ASM");
        return v.map((H) => {
          if (S(H)) {
            const D = d(H);
            if (D === void 0) return H.toString("hex");
            H = D;
          }
          return n.REVERSE_OPS[H];
        }).join(" ");
      }
      e.toASM = E;
      function m(v) {
        return a(s.String, v), A(v.split(" ").map((H) => n.OPS[H] !== void 0 ? n.OPS[H] : (a(s.Hex, H), B.from(H, "hex"))));
      }
      e.fromASM = m;
      function k(v) {
        return v = O(v), a(p, v), v.map((H) => S(H) ? H : H === n.OPS.OP_0 ? B.allocUnsafe(0) : i.encode(H - f));
      }
      e.toStack = k;
      function T(v) {
        return s.isPoint(v);
      }
      e.isCanonicalPubKey = T;
      function R(v) {
        const H = v & -129;
        return H > 0 && H < 4;
      }
      e.isDefinedHashType = R;
      function M(v) {
        return !B.isBuffer(v) || !R(v[v.length - 1]) ? false : t.check(v.slice(0, -1));
      }
      e.isCanonicalScriptSignature = M, e.number = i, e.signature = o;
    }(oa)), oa;
  }
  var pt = {};
  Object.defineProperty(pt, "__esModule", {
    value: true
  });
  pt.value = pt.prop = void 0;
  function wy(e, t, n) {
    Object.defineProperty(e, t, {
      configurable: true,
      enumerable: true,
      get() {
        const r = n.call(this);
        return this[t] = r, r;
      },
      set(r) {
        Object.defineProperty(this, t, {
          configurable: true,
          enumerable: true,
          value: r,
          writable: true
        });
      }
    });
  }
  pt.prop = wy;
  function by(e) {
    let t;
    return () => (t !== void 0 || (t = e()), t);
  }
  pt.value = by;
  Object.defineProperty(Ts, "__esModule", {
    value: true
  });
  Ts.p2data = void 0;
  const my = Ce, Jo = ot(), Ut = ze, Bf = pt, Pf = Jo.OPS;
  function _y(e, t) {
    if (!e.data && !e.output) throw new TypeError("Not enough data");
    t = Object.assign({
      validate: true
    }, t || {}), (0, Ut.typeforce)({
      network: Ut.typeforce.maybe(Ut.typeforce.Object),
      output: Ut.typeforce.maybe(Ut.typeforce.Buffer),
      data: Ut.typeforce.maybe(Ut.typeforce.arrayOf(Ut.typeforce.Buffer))
    }, e);
    const r = {
      name: "embed",
      network: e.network || my.bitcoin
    };
    if (Bf.prop(r, "output", () => {
      if (e.data) return Jo.compile([
        Pf.OP_RETURN
      ].concat(e.data));
    }), Bf.prop(r, "data", () => {
      if (e.output) return Jo.decompile(e.output).slice(1);
    }), t.validate && e.output) {
      const i = Jo.decompile(e.output);
      if (i[0] !== Pf.OP_RETURN) throw new TypeError("Output is invalid");
      if (!i.slice(1).every(Ut.typeforce.Buffer)) throw new TypeError("Output is invalid");
      if (e.data && !(0, Ut.stacksEqual)(e.data, r.data)) throw new TypeError("Data mismatch");
    }
    return Object.assign(r, e);
  }
  Ts.p2data = _y;
  var ks = {};
  Object.defineProperty(ks, "__esModule", {
    value: true
  });
  ks.p2ms = void 0;
  const Ey = Ce, Qr = ot(), Te = ze, En = pt, ei = Qr.OPS, Ao = ei.OP_RESERVED;
  function Sy(e, t) {
    if (!e.input && !e.output && !(e.pubkeys && e.m !== void 0) && !e.signatures) throw new TypeError("Not enough data");
    t = Object.assign({
      validate: true
    }, t || {});
    function n(f) {
      return Qr.isCanonicalScriptSignature(f) || (t.allowIncomplete && f === ei.OP_0) !== void 0;
    }
    (0, Te.typeforce)({
      network: Te.typeforce.maybe(Te.typeforce.Object),
      m: Te.typeforce.maybe(Te.typeforce.Number),
      n: Te.typeforce.maybe(Te.typeforce.Number),
      output: Te.typeforce.maybe(Te.typeforce.Buffer),
      pubkeys: Te.typeforce.maybe(Te.typeforce.arrayOf(Te.isPoint)),
      signatures: Te.typeforce.maybe(Te.typeforce.arrayOf(n)),
      input: Te.typeforce.maybe(Te.typeforce.Buffer)
    }, e);
    const i = {
      network: e.network || Ey.bitcoin
    };
    let o = [], s = false;
    function a(f) {
      s || (s = true, o = Qr.decompile(f), i.m = o[0] - Ao, i.n = o[o.length - 2] - Ao, i.pubkeys = o.slice(1, -2));
    }
    if (En.prop(i, "output", () => {
      if (e.m && i.n && e.pubkeys) return Qr.compile([].concat(Ao + e.m, e.pubkeys, Ao + i.n, ei.OP_CHECKMULTISIG));
    }), En.prop(i, "m", () => {
      if (i.output) return a(i.output), i.m;
    }), En.prop(i, "n", () => {
      if (i.pubkeys) return i.pubkeys.length;
    }), En.prop(i, "pubkeys", () => {
      if (e.output) return a(e.output), i.pubkeys;
    }), En.prop(i, "signatures", () => {
      if (e.input) return Qr.decompile(e.input).slice(1);
    }), En.prop(i, "input", () => {
      if (e.signatures) return Qr.compile([
        ei.OP_0
      ].concat(e.signatures));
    }), En.prop(i, "witness", () => {
      if (i.input) return [];
    }), En.prop(i, "name", () => {
      if (!(!i.m || !i.n)) return `p2ms(${i.m} of ${i.n})`;
    }), t.validate) {
      if (e.output) {
        if (a(e.output), !Te.typeforce.Number(o[0])) throw new TypeError("Output is invalid");
        if (!Te.typeforce.Number(o[o.length - 2])) throw new TypeError("Output is invalid");
        if (o[o.length - 1] !== ei.OP_CHECKMULTISIG) throw new TypeError("Output is invalid");
        if (i.m <= 0 || i.n > 16 || i.m > i.n || i.n !== o.length - 3) throw new TypeError("Output is invalid");
        if (!i.pubkeys.every((f) => (0, Te.isPoint)(f))) throw new TypeError("Output is invalid");
        if (e.m !== void 0 && e.m !== i.m) throw new TypeError("m mismatch");
        if (e.n !== void 0 && e.n !== i.n) throw new TypeError("n mismatch");
        if (e.pubkeys && !(0, Te.stacksEqual)(e.pubkeys, i.pubkeys)) throw new TypeError("Pubkeys mismatch");
      }
      if (e.pubkeys) {
        if (e.n !== void 0 && e.n !== e.pubkeys.length) throw new TypeError("Pubkey count mismatch");
        if (i.n = e.pubkeys.length, i.n < i.m) throw new TypeError("Pubkey count cannot be less than m");
      }
      if (e.signatures) {
        if (e.signatures.length < i.m) throw new TypeError("Not enough signatures provided");
        if (e.signatures.length > i.m) throw new TypeError("Too many signatures provided");
      }
      if (e.input) {
        if (e.input[0] !== ei.OP_0) throw new TypeError("Input is invalid");
        if (i.signatures.length === 0 || !i.signatures.every(n)) throw new TypeError("Input has invalid signature(s)");
        if (e.signatures && !(0, Te.stacksEqual)(e.signatures, i.signatures)) throw new TypeError("Signature mismatch");
        if (e.m !== void 0 && e.m !== e.signatures.length) throw new TypeError("Signature count mismatch");
      }
    }
    return Object.assign(i, e);
  }
  ks.p2ms = Sy;
  var Bs = {};
  Object.defineProperty(Bs, "__esModule", {
    value: true
  });
  Bs.p2pk = void 0;
  const xy = Ce, ti = ot(), Bt = ze, Wr = pt, Of = ti.OPS;
  function vy(e, t) {
    if (!e.input && !e.output && !e.pubkey && !e.input && !e.signature) throw new TypeError("Not enough data");
    t = Object.assign({
      validate: true
    }, t || {}), (0, Bt.typeforce)({
      network: Bt.typeforce.maybe(Bt.typeforce.Object),
      output: Bt.typeforce.maybe(Bt.typeforce.Buffer),
      pubkey: Bt.typeforce.maybe(Bt.isPoint),
      signature: Bt.typeforce.maybe(ti.isCanonicalScriptSignature),
      input: Bt.typeforce.maybe(Bt.typeforce.Buffer)
    }, e);
    const n = Wr.value(() => ti.decompile(e.input)), i = {
      name: "p2pk",
      network: e.network || xy.bitcoin
    };
    if (Wr.prop(i, "output", () => {
      if (e.pubkey) return ti.compile([
        e.pubkey,
        Of.OP_CHECKSIG
      ]);
    }), Wr.prop(i, "pubkey", () => {
      if (e.output) return e.output.slice(1, -1);
    }), Wr.prop(i, "signature", () => {
      if (e.input) return n()[0];
    }), Wr.prop(i, "input", () => {
      if (e.signature) return ti.compile([
        e.signature
      ]);
    }), Wr.prop(i, "witness", () => {
      if (i.input) return [];
    }), t.validate) {
      if (e.output) {
        if (e.output[e.output.length - 1] !== Of.OP_CHECKSIG) throw new TypeError("Output is invalid");
        if (!(0, Bt.isPoint)(i.pubkey)) throw new TypeError("Output pubkey is invalid");
        if (e.pubkey && !e.pubkey.equals(i.pubkey)) throw new TypeError("Pubkey mismatch");
      }
      if (e.signature && e.input && !e.input.equals(i.input)) throw new TypeError("Signature mismatch");
      if (e.input) {
        if (n().length !== 1) throw new TypeError("Input is invalid");
        if (!ti.isCanonicalScriptSignature(i.signature)) throw new TypeError("Input has invalid signature");
      }
    }
    return Object.assign(i, e);
  }
  Bs.p2pk = vy;
  var Ps = {}, Gt = {}, di = {}, nt = {}, qe = {}, Os = {}, Hs = {};
  Object.defineProperty(Hs, "__esModule", {
    value: true
  });
  Hs.crypto = void 0;
  Hs.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: true
    }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = i, e.ahash = o, e.aexists = s, e.aoutput = a, e.u8 = f, e.u32 = u, e.clean = c, e.createView = p, e.rotr = y, e.rotl = d, e.byteSwap = w, e.byteSwap32 = b, e.bytesToHex = O, e.hexToBytes = k, e.asyncLoop = R, e.utf8ToBytes = M, e.bytesToUtf8 = v, e.toBytes = H, e.kdfInputToBytes = D, e.concatBytes = $, e.checkOpts = N, e.createHasher = C, e.createOptHasher = K, e.createXOFer = W, e.randomBytes = Z;
    const t = Hs;
    function n(I) {
      return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
    }
    function r(I) {
      if (!Number.isSafeInteger(I) || I < 0) throw new Error("positive integer expected, got " + I);
    }
    function i(I, ...F) {
      if (!n(I)) throw new Error("Uint8Array expected");
      if (F.length > 0 && !F.includes(I.length)) throw new Error("Uint8Array expected of length " + F + ", got length=" + I.length);
    }
    function o(I) {
      if (typeof I != "function" || typeof I.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
      r(I.outputLen), r(I.blockLen);
    }
    function s(I, F = true) {
      if (I.destroyed) throw new Error("Hash instance has been destroyed");
      if (F && I.finished) throw new Error("Hash#digest() has already been called");
    }
    function a(I, F) {
      i(I);
      const V = F.outputLen;
      if (I.length < V) throw new Error("digestInto() expects output buffer of length at least " + V);
    }
    function f(I) {
      return new Uint8Array(I.buffer, I.byteOffset, I.byteLength);
    }
    function u(I) {
      return new Uint32Array(I.buffer, I.byteOffset, Math.floor(I.byteLength / 4));
    }
    function c(...I) {
      for (let F = 0; F < I.length; F++) I[F].fill(0);
    }
    function p(I) {
      return new DataView(I.buffer, I.byteOffset, I.byteLength);
    }
    function y(I, F) {
      return I << 32 - F | I >>> F;
    }
    function d(I, F) {
      return I << F | I >>> 32 - F >>> 0;
    }
    e.isLE = new Uint8Array(new Uint32Array([
      287454020
    ]).buffer)[0] === 68;
    function w(I) {
      return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
    }
    e.swap8IfBE = e.isLE ? (I) => I : (I) => w(I), e.byteSwapIfBE = e.swap8IfBE;
    function b(I) {
      for (let F = 0; F < I.length; F++) I[F] = w(I[F]);
      return I;
    }
    e.swap32IfBE = e.isLE ? (I) => I : b;
    const S = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", A = Array.from({
      length: 256
    }, (I, F) => F.toString(16).padStart(2, "0"));
    function O(I) {
      if (i(I), S) return I.toHex();
      let F = "";
      for (let V = 0; V < I.length; V++) F += A[I[V]];
      return F;
    }
    const E = {
      _0: 48,
      _9: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
    function m(I) {
      if (I >= E._0 && I <= E._9) return I - E._0;
      if (I >= E.A && I <= E.F) return I - (E.A - 10);
      if (I >= E.a && I <= E.f) return I - (E.a - 10);
    }
    function k(I) {
      if (typeof I != "string") throw new Error("hex string expected, got " + typeof I);
      if (S) return Uint8Array.fromHex(I);
      const F = I.length, V = F / 2;
      if (F % 2) throw new Error("hex string expected, got unpadded hex of length " + F);
      const j = new Uint8Array(V);
      for (let te = 0, G = 0; te < V; te++, G += 2) {
        const Y = m(I.charCodeAt(G)), ue = m(I.charCodeAt(G + 1));
        if (Y === void 0 || ue === void 0) {
          const be = I[G] + I[G + 1];
          throw new Error('hex string expected, got non-hex character "' + be + '" at index ' + G);
        }
        j[te] = Y * 16 + ue;
      }
      return j;
    }
    const T = async () => {
    };
    e.nextTick = T;
    async function R(I, F, V) {
      let j = Date.now();
      for (let te = 0; te < I; te++) {
        V(te);
        const G = Date.now() - j;
        G >= 0 && G < F || (await (0, e.nextTick)(), j += G);
      }
    }
    function M(I) {
      if (typeof I != "string") throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(I));
    }
    function v(I) {
      return new TextDecoder().decode(I);
    }
    function H(I) {
      return typeof I == "string" && (I = M(I)), i(I), I;
    }
    function D(I) {
      return typeof I == "string" && (I = M(I)), i(I), I;
    }
    function $(...I) {
      let F = 0;
      for (let j = 0; j < I.length; j++) {
        const te = I[j];
        i(te), F += te.length;
      }
      const V = new Uint8Array(F);
      for (let j = 0, te = 0; j < I.length; j++) {
        const G = I[j];
        V.set(G, te), te += G.length;
      }
      return V;
    }
    function N(I, F) {
      if (F !== void 0 && {}.toString.call(F) !== "[object Object]") throw new Error("options should be object or undefined");
      return Object.assign(I, F);
    }
    class U {
    }
    e.Hash = U;
    function C(I) {
      const F = (j) => I().update(H(j)).digest(), V = I();
      return F.outputLen = V.outputLen, F.blockLen = V.blockLen, F.create = () => I(), F;
    }
    function K(I) {
      const F = (j, te) => I(te).update(H(j)).digest(), V = I({});
      return F.outputLen = V.outputLen, F.blockLen = V.blockLen, F.create = (j) => I(j), F;
    }
    function W(I) {
      const F = (j, te) => I(te).update(H(j)).digest(), V = I({});
      return F.outputLen = V.outputLen, F.blockLen = V.blockLen, F.create = (j) => I(j), F;
    }
    e.wrapConstructor = C, e.wrapConstructorWithOpts = K, e.wrapXOFConstructorWithOpts = W;
    function Z(I = 32) {
      if (t.crypto && typeof t.crypto.getRandomValues == "function") return t.crypto.getRandomValues(new Uint8Array(I));
      if (t.crypto && typeof t.crypto.randomBytes == "function") return Uint8Array.from(t.crypto.randomBytes(I));
      throw new Error("crypto.getRandomValues must be defined");
    }
  })(Os);
  Object.defineProperty(qe, "__esModule", {
    value: true
  });
  qe.SHA512_IV = qe.SHA384_IV = qe.SHA224_IV = qe.SHA256_IV = qe.HashMD = void 0;
  qe.setBigUint64 = Ml;
  qe.Chi = Iy;
  qe.Maj = Ty;
  const Rt = Os;
  function Ml(e, t, n, r) {
    if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, n, r);
    const i = BigInt(32), o = BigInt(4294967295), s = Number(n >> i & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
    e.setUint32(t + f, s, r), e.setUint32(t + u, a, r);
  }
  function Iy(e, t, n) {
    return e & t ^ ~e & n;
  }
  function Ty(e, t, n) {
    return e & t ^ e & n ^ t & n;
  }
  let Ay = class extends Rt.Hash {
    constructor(t, n, r, i) {
      super(), this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(t), this.view = (0, Rt.createView)(this.buffer);
    }
    update(t) {
      (0, Rt.aexists)(this), t = (0, Rt.toBytes)(t), (0, Rt.abytes)(t);
      const { view: n, buffer: r, blockLen: i } = this, o = t.length;
      for (let s = 0; s < o; ) {
        const a = Math.min(i - this.pos, o - s);
        if (a === i) {
          const f = (0, Rt.createView)(t);
          for (; i <= o - s; s += i) this.process(f, s);
          continue;
        }
        r.set(t.subarray(s, s + a), this.pos), this.pos += a, s += a, this.pos === i && (this.process(n, 0), this.pos = 0);
      }
      return this.length += t.length, this.roundClean(), this;
    }
    digestInto(t) {
      (0, Rt.aexists)(this), (0, Rt.aoutput)(t, this), this.finished = true;
      const { buffer: n, view: r, blockLen: i, isLE: o } = this;
      let { pos: s } = this;
      n[s++] = 128, (0, Rt.clean)(this.buffer.subarray(s)), this.padOffset > i - s && (this.process(r, 0), s = 0);
      for (let p = s; p < i; p++) n[p] = 0;
      Ml(r, i - 8, BigInt(this.length * 8), o), this.process(r, 0);
      const a = (0, Rt.createView)(t), f = this.outputLen;
      if (f % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
      const u = f / 4, c = this.get();
      if (u > c.length) throw new Error("_sha2: outputLen bigger than state");
      for (let p = 0; p < u; p++) a.setUint32(4 * p, c[p], o);
    }
    digest() {
      const { buffer: t, outputLen: n } = this;
      this.digestInto(t);
      const r = t.slice(0, n);
      return this.destroy(), r;
    }
    _cloneInto(t) {
      t || (t = new this.constructor()), t.set(...this.get());
      const { blockLen: n, buffer: r, length: i, finished: o, destroyed: s, pos: a } = this;
      return t.destroyed = s, t.finished = o, t.length = i, t.pos = a, i % n && t.buffer.set(r), t;
    }
    clone() {
      return this._cloneInto();
    }
  };
  qe.HashMD = Ay;
  qe.SHA256_IV = Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  qe.SHA224_IV = Uint32Array.from([
    3238371032,
    914150663,
    812702999,
    4144912697,
    4290775857,
    1750603025,
    1694076839,
    3204075428
  ]);
  qe.SHA384_IV = Uint32Array.from([
    3418070365,
    3238371032,
    1654270250,
    914150663,
    2438529370,
    812702999,
    355462360,
    4144912697,
    1731405415,
    4290775857,
    2394180231,
    1750603025,
    3675008525,
    1694076839,
    1203062813,
    3204075428
  ]);
  qe.SHA512_IV = Uint32Array.from([
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ]);
  Object.defineProperty(nt, "__esModule", {
    value: true
  });
  nt.ripemd160 = nt.RIPEMD160 = nt.md5 = nt.MD5 = nt.sha1 = nt.SHA1 = void 0;
  const cr = qe, Ve = Os, ni = Uint32Array.from([
    1732584193,
    4023233417,
    2562383102,
    271733878,
    3285377520
  ]), Sn = new Uint32Array(80);
  class Dl extends cr.HashMD {
    constructor() {
      super(64, 20, 8, false), this.A = ni[0] | 0, this.B = ni[1] | 0, this.C = ni[2] | 0, this.D = ni[3] | 0, this.E = ni[4] | 0;
    }
    get() {
      const { A: t, B: n, C: r, D: i, E: o } = this;
      return [
        t,
        n,
        r,
        i,
        o
      ];
    }
    set(t, n, r, i, o) {
      this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = o | 0;
    }
    process(t, n) {
      for (let f = 0; f < 16; f++, n += 4) Sn[f] = t.getUint32(n, false);
      for (let f = 16; f < 80; f++) Sn[f] = (0, Ve.rotl)(Sn[f - 3] ^ Sn[f - 8] ^ Sn[f - 14] ^ Sn[f - 16], 1);
      let { A: r, B: i, C: o, D: s, E: a } = this;
      for (let f = 0; f < 80; f++) {
        let u, c;
        f < 20 ? (u = (0, cr.Chi)(i, o, s), c = 1518500249) : f < 40 ? (u = i ^ o ^ s, c = 1859775393) : f < 60 ? (u = (0, cr.Maj)(i, o, s), c = 2400959708) : (u = i ^ o ^ s, c = 3395469782);
        const p = (0, Ve.rotl)(r, 5) + u + a + c + Sn[f] | 0;
        a = s, s = o, o = (0, Ve.rotl)(i, 30), i = r, r = p;
      }
      r = r + this.A | 0, i = i + this.B | 0, o = o + this.C | 0, s = s + this.D | 0, a = a + this.E | 0, this.set(r, i, o, s, a);
    }
    roundClean() {
      (0, Ve.clean)(Sn);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0), (0, Ve.clean)(this.buffer);
    }
  }
  nt.SHA1 = Dl;
  nt.sha1 = (0, Ve.createHasher)(() => new Dl());
  const ky = Math.pow(2, 32), By = Array.from({
    length: 64
  }, (e, t) => Math.floor(ky * Math.abs(Math.sin(t + 1)))), ko = ni.slice(0, 4), aa = new Uint32Array(16);
  class Kl extends cr.HashMD {
    constructor() {
      super(64, 16, 8, true), this.A = ko[0] | 0, this.B = ko[1] | 0, this.C = ko[2] | 0, this.D = ko[3] | 0;
    }
    get() {
      const { A: t, B: n, C: r, D: i } = this;
      return [
        t,
        n,
        r,
        i
      ];
    }
    set(t, n, r, i) {
      this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0;
    }
    process(t, n) {
      for (let a = 0; a < 16; a++, n += 4) aa[a] = t.getUint32(n, true);
      let { A: r, B: i, C: o, D: s } = this;
      for (let a = 0; a < 64; a++) {
        let f, u, c;
        a < 16 ? (f = (0, cr.Chi)(i, o, s), u = a, c = [
          7,
          12,
          17,
          22
        ]) : a < 32 ? (f = (0, cr.Chi)(s, i, o), u = (5 * a + 1) % 16, c = [
          5,
          9,
          14,
          20
        ]) : a < 48 ? (f = i ^ o ^ s, u = (3 * a + 5) % 16, c = [
          4,
          11,
          16,
          23
        ]) : (f = o ^ (i | ~s), u = 7 * a % 16, c = [
          6,
          10,
          15,
          21
        ]), f = f + r + By[a] + aa[u], r = s, s = o, o = i, i = i + (0, Ve.rotl)(f, c[a % 4]);
      }
      r = r + this.A | 0, i = i + this.B | 0, o = o + this.C | 0, s = s + this.D | 0, this.set(r, i, o, s);
    }
    roundClean() {
      (0, Ve.clean)(aa);
    }
    destroy() {
      this.set(0, 0, 0, 0), (0, Ve.clean)(this.buffer);
    }
  }
  nt.MD5 = Kl;
  nt.md5 = (0, Ve.createHasher)(() => new Kl());
  const Py = Uint8Array.from([
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8
  ]), $l = Uint8Array.from(new Array(16).fill(0).map((e, t) => t)), Oy = $l.map((e) => (9 * e + 5) % 16), Vl = (() => {
    const n = [
      [
        $l
      ],
      [
        Oy
      ]
    ];
    for (let r = 0; r < 4; r++) for (let i of n) i.push(i[r].map((o) => Py[o]));
    return n;
  })(), zl = Vl[0], jl = Vl[1], Wl = [
    [
      11,
      14,
      15,
      12,
      5,
      8,
      7,
      9,
      11,
      13,
      14,
      15,
      6,
      7,
      9,
      8
    ],
    [
      12,
      13,
      11,
      15,
      6,
      9,
      9,
      7,
      12,
      15,
      11,
      13,
      7,
      8,
      7,
      7
    ],
    [
      13,
      15,
      14,
      11,
      7,
      7,
      6,
      8,
      13,
      14,
      13,
      12,
      5,
      5,
      6,
      9
    ],
    [
      14,
      11,
      12,
      14,
      8,
      6,
      5,
      5,
      15,
      12,
      15,
      14,
      9,
      9,
      8,
      6
    ],
    [
      15,
      12,
      13,
      13,
      9,
      5,
      8,
      6,
      14,
      11,
      12,
      11,
      8,
      6,
      5,
      5
    ]
  ].map((e) => Uint8Array.from(e)), Hy = zl.map((e, t) => e.map((n) => Wl[t][n])), Uy = jl.map((e, t) => e.map((n) => Wl[t][n])), Ry = Uint32Array.from([
    0,
    1518500249,
    1859775393,
    2400959708,
    2840853838
  ]), Ny = Uint32Array.from([
    1352829926,
    1548603684,
    1836072691,
    2053994217,
    0
  ]);
  function Hf(e, t, n, r) {
    return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
  }
  const Bo = new Uint32Array(16);
  let Gl = class extends cr.HashMD {
    constructor() {
      super(64, 20, 8, true), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
    }
    get() {
      const { h0: t, h1: n, h2: r, h3: i, h4: o } = this;
      return [
        t,
        n,
        r,
        i,
        o
      ];
    }
    set(t, n, r, i, o) {
      this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = o | 0;
    }
    process(t, n) {
      for (let d = 0; d < 16; d++, n += 4) Bo[d] = t.getUint32(n, true);
      let r = this.h0 | 0, i = r, o = this.h1 | 0, s = o, a = this.h2 | 0, f = a, u = this.h3 | 0, c = u, p = this.h4 | 0, y = p;
      for (let d = 0; d < 5; d++) {
        const w = 4 - d, b = Ry[d], S = Ny[d], A = zl[d], O = jl[d], E = Hy[d], m = Uy[d];
        for (let k = 0; k < 16; k++) {
          const T = (0, Ve.rotl)(r + Hf(d, o, a, u) + Bo[A[k]] + b, E[k]) + p | 0;
          r = p, p = u, u = (0, Ve.rotl)(a, 10) | 0, a = o, o = T;
        }
        for (let k = 0; k < 16; k++) {
          const T = (0, Ve.rotl)(i + Hf(w, s, f, c) + Bo[O[k]] + S, m[k]) + y | 0;
          i = y, y = c, c = (0, Ve.rotl)(f, 10) | 0, f = s, s = T;
        }
      }
      this.set(this.h1 + a + c | 0, this.h2 + u + y | 0, this.h3 + p + i | 0, this.h4 + r + s | 0, this.h0 + o + f | 0);
    }
    roundClean() {
      (0, Ve.clean)(Bo);
    }
    destroy() {
      this.destroyed = true, (0, Ve.clean)(this.buffer), this.set(0, 0, 0, 0, 0);
    }
  };
  nt.RIPEMD160 = Gl;
  nt.ripemd160 = (0, Ve.createHasher)(() => new Gl());
  Object.defineProperty(di, "__esModule", {
    value: true
  });
  di.ripemd160 = di.RIPEMD160 = void 0;
  const Xl = nt;
  di.RIPEMD160 = Xl.RIPEMD160;
  di.ripemd160 = Xl.ripemd160;
  var pi = {};
  Object.defineProperty(pi, "__esModule", {
    value: true
  });
  pi.sha1 = pi.SHA1 = void 0;
  const ql = nt;
  pi.SHA1 = ql.SHA1;
  pi.sha1 = ql.sha1;
  var Pt = {}, pe = {}, J = {};
  Object.defineProperty(J, "__esModule", {
    value: true
  });
  J.toBig = J.shrSL = J.shrSH = J.rotrSL = J.rotrSH = J.rotrBL = J.rotrBH = J.rotr32L = J.rotr32H = J.rotlSL = J.rotlSH = J.rotlBL = J.rotlBH = J.add5L = J.add5H = J.add4L = J.add4H = J.add3L = J.add3H = void 0;
  J.add = uh;
  J.fromBig = Ac;
  J.split = Zl;
  const Po = BigInt(2 ** 32 - 1), Xa = BigInt(32);
  function Ac(e, t = false) {
    return t ? {
      h: Number(e & Po),
      l: Number(e >> Xa & Po)
    } : {
      h: Number(e >> Xa & Po) | 0,
      l: Number(e & Po) | 0
    };
  }
  function Zl(e, t = false) {
    const n = e.length;
    let r = new Uint32Array(n), i = new Uint32Array(n);
    for (let o = 0; o < n; o++) {
      const { h: s, l: a } = Ac(e[o], t);
      [r[o], i[o]] = [
        s,
        a
      ];
    }
    return [
      r,
      i
    ];
  }
  const Yl = (e, t) => BigInt(e >>> 0) << Xa | BigInt(t >>> 0);
  J.toBig = Yl;
  const Jl = (e, t, n) => e >>> n;
  J.shrSH = Jl;
  const Ql = (e, t, n) => e << 32 - n | t >>> n;
  J.shrSL = Ql;
  const eh = (e, t, n) => e >>> n | t << 32 - n;
  J.rotrSH = eh;
  const th = (e, t, n) => e << 32 - n | t >>> n;
  J.rotrSL = th;
  const nh = (e, t, n) => e << 64 - n | t >>> n - 32;
  J.rotrBH = nh;
  const rh = (e, t, n) => e >>> n - 32 | t << 64 - n;
  J.rotrBL = rh;
  const ih = (e, t) => t;
  J.rotr32H = ih;
  const oh = (e, t) => e;
  J.rotr32L = oh;
  const sh = (e, t, n) => e << n | t >>> 32 - n;
  J.rotlSH = sh;
  const ah = (e, t, n) => t << n | e >>> 32 - n;
  J.rotlSL = ah;
  const ch = (e, t, n) => t << n - 32 | e >>> 64 - n;
  J.rotlBH = ch;
  const fh = (e, t, n) => e << n - 32 | t >>> 64 - n;
  J.rotlBL = fh;
  function uh(e, t, n, r) {
    const i = (t >>> 0) + (r >>> 0);
    return {
      h: e + n + (i / 2 ** 32 | 0) | 0,
      l: i | 0
    };
  }
  const lh = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0);
  J.add3L = lh;
  const hh = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0;
  J.add3H = hh;
  const dh = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0);
  J.add4L = dh;
  const ph = (e, t, n, r, i) => t + n + r + i + (e / 2 ** 32 | 0) | 0;
  J.add4H = ph;
  const yh = (e, t, n, r, i) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0);
  J.add5L = yh;
  const gh = (e, t, n, r, i, o) => t + n + r + i + o + (e / 2 ** 32 | 0) | 0;
  J.add5H = gh;
  const Cy = {
    fromBig: Ac,
    split: Zl,
    toBig: Yl,
    shrSH: Jl,
    shrSL: Ql,
    rotrSH: eh,
    rotrSL: th,
    rotrBH: nh,
    rotrBL: rh,
    rotr32H: ih,
    rotr32L: oh,
    rotlSH: sh,
    rotlSL: ah,
    rotlBH: ch,
    rotlBL: fh,
    add: uh,
    add3L: lh,
    add3H: hh,
    add4L: dh,
    add4H: ph,
    add5H: gh,
    add5L: yh
  };
  J.default = Cy;
  Object.defineProperty(pe, "__esModule", {
    value: true
  });
  pe.sha512_224 = pe.sha512_256 = pe.sha384 = pe.sha512 = pe.sha224 = pe.sha256 = pe.SHA512_256 = pe.SHA512_224 = pe.SHA384 = pe.SHA512 = pe.SHA224 = pe.SHA256 = void 0;
  const q = qe, ee = J, ke = Os, Ly = Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]), xn = new Uint32Array(64);
  let kc = class extends q.HashMD {
    constructor(t = 32) {
      super(64, t, 8, false), this.A = q.SHA256_IV[0] | 0, this.B = q.SHA256_IV[1] | 0, this.C = q.SHA256_IV[2] | 0, this.D = q.SHA256_IV[3] | 0, this.E = q.SHA256_IV[4] | 0, this.F = q.SHA256_IV[5] | 0, this.G = q.SHA256_IV[6] | 0, this.H = q.SHA256_IV[7] | 0;
    }
    get() {
      const { A: t, B: n, C: r, D: i, E: o, F: s, G: a, H: f } = this;
      return [
        t,
        n,
        r,
        i,
        o,
        s,
        a,
        f
      ];
    }
    set(t, n, r, i, o, s, a, f) {
      this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = o | 0, this.F = s | 0, this.G = a | 0, this.H = f | 0;
    }
    process(t, n) {
      for (let p = 0; p < 16; p++, n += 4) xn[p] = t.getUint32(n, false);
      for (let p = 16; p < 64; p++) {
        const y = xn[p - 15], d = xn[p - 2], w = (0, ke.rotr)(y, 7) ^ (0, ke.rotr)(y, 18) ^ y >>> 3, b = (0, ke.rotr)(d, 17) ^ (0, ke.rotr)(d, 19) ^ d >>> 10;
        xn[p] = b + xn[p - 7] + w + xn[p - 16] | 0;
      }
      let { A: r, B: i, C: o, D: s, E: a, F: f, G: u, H: c } = this;
      for (let p = 0; p < 64; p++) {
        const y = (0, ke.rotr)(a, 6) ^ (0, ke.rotr)(a, 11) ^ (0, ke.rotr)(a, 25), d = c + y + (0, q.Chi)(a, f, u) + Ly[p] + xn[p] | 0, b = ((0, ke.rotr)(r, 2) ^ (0, ke.rotr)(r, 13) ^ (0, ke.rotr)(r, 22)) + (0, q.Maj)(r, i, o) | 0;
        c = u, u = f, f = a, a = s + d | 0, s = o, o = i, i = r, r = d + b | 0;
      }
      r = r + this.A | 0, i = i + this.B | 0, o = o + this.C | 0, s = s + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, c = c + this.H | 0, this.set(r, i, o, s, a, f, u, c);
    }
    roundClean() {
      (0, ke.clean)(xn);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, ke.clean)(this.buffer);
    }
  };
  pe.SHA256 = kc;
  class wh extends kc {
    constructor() {
      super(28), this.A = q.SHA224_IV[0] | 0, this.B = q.SHA224_IV[1] | 0, this.C = q.SHA224_IV[2] | 0, this.D = q.SHA224_IV[3] | 0, this.E = q.SHA224_IV[4] | 0, this.F = q.SHA224_IV[5] | 0, this.G = q.SHA224_IV[6] | 0, this.H = q.SHA224_IV[7] | 0;
    }
  }
  pe.SHA224 = wh;
  const bh = ee.split([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((e) => BigInt(e))), Fy = bh[0], My = bh[1], vn = new Uint32Array(80), In = new Uint32Array(80);
  let uo = class extends q.HashMD {
    constructor(t = 64) {
      super(128, t, 16, false), this.Ah = q.SHA512_IV[0] | 0, this.Al = q.SHA512_IV[1] | 0, this.Bh = q.SHA512_IV[2] | 0, this.Bl = q.SHA512_IV[3] | 0, this.Ch = q.SHA512_IV[4] | 0, this.Cl = q.SHA512_IV[5] | 0, this.Dh = q.SHA512_IV[6] | 0, this.Dl = q.SHA512_IV[7] | 0, this.Eh = q.SHA512_IV[8] | 0, this.El = q.SHA512_IV[9] | 0, this.Fh = q.SHA512_IV[10] | 0, this.Fl = q.SHA512_IV[11] | 0, this.Gh = q.SHA512_IV[12] | 0, this.Gl = q.SHA512_IV[13] | 0, this.Hh = q.SHA512_IV[14] | 0, this.Hl = q.SHA512_IV[15] | 0;
    }
    get() {
      const { Ah: t, Al: n, Bh: r, Bl: i, Ch: o, Cl: s, Dh: a, Dl: f, Eh: u, El: c, Fh: p, Fl: y, Gh: d, Gl: w, Hh: b, Hl: S } = this;
      return [
        t,
        n,
        r,
        i,
        o,
        s,
        a,
        f,
        u,
        c,
        p,
        y,
        d,
        w,
        b,
        S
      ];
    }
    set(t, n, r, i, o, s, a, f, u, c, p, y, d, w, b, S) {
      this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = o | 0, this.Cl = s | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = c | 0, this.Fh = p | 0, this.Fl = y | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = b | 0, this.Hl = S | 0;
    }
    process(t, n) {
      for (let E = 0; E < 16; E++, n += 4) vn[E] = t.getUint32(n), In[E] = t.getUint32(n += 4);
      for (let E = 16; E < 80; E++) {
        const m = vn[E - 15] | 0, k = In[E - 15] | 0, T = ee.rotrSH(m, k, 1) ^ ee.rotrSH(m, k, 8) ^ ee.shrSH(m, k, 7), R = ee.rotrSL(m, k, 1) ^ ee.rotrSL(m, k, 8) ^ ee.shrSL(m, k, 7), M = vn[E - 2] | 0, v = In[E - 2] | 0, H = ee.rotrSH(M, v, 19) ^ ee.rotrBH(M, v, 61) ^ ee.shrSH(M, v, 6), D = ee.rotrSL(M, v, 19) ^ ee.rotrBL(M, v, 61) ^ ee.shrSL(M, v, 6), $ = ee.add4L(R, D, In[E - 7], In[E - 16]), N = ee.add4H($, T, H, vn[E - 7], vn[E - 16]);
        vn[E] = N | 0, In[E] = $ | 0;
      }
      let { Ah: r, Al: i, Bh: o, Bl: s, Ch: a, Cl: f, Dh: u, Dl: c, Eh: p, El: y, Fh: d, Fl: w, Gh: b, Gl: S, Hh: A, Hl: O } = this;
      for (let E = 0; E < 80; E++) {
        const m = ee.rotrSH(p, y, 14) ^ ee.rotrSH(p, y, 18) ^ ee.rotrBH(p, y, 41), k = ee.rotrSL(p, y, 14) ^ ee.rotrSL(p, y, 18) ^ ee.rotrBL(p, y, 41), T = p & d ^ ~p & b, R = y & w ^ ~y & S, M = ee.add5L(O, k, R, My[E], In[E]), v = ee.add5H(M, A, m, T, Fy[E], vn[E]), H = M | 0, D = ee.rotrSH(r, i, 28) ^ ee.rotrBH(r, i, 34) ^ ee.rotrBH(r, i, 39), $ = ee.rotrSL(r, i, 28) ^ ee.rotrBL(r, i, 34) ^ ee.rotrBL(r, i, 39), N = r & o ^ r & a ^ o & a, U = i & s ^ i & f ^ s & f;
        A = b | 0, O = S | 0, b = d | 0, S = w | 0, d = p | 0, w = y | 0, { h: p, l: y } = ee.add(u | 0, c | 0, v | 0, H | 0), u = a | 0, c = f | 0, a = o | 0, f = s | 0, o = r | 0, s = i | 0;
        const C = ee.add3L(H, $, U);
        r = ee.add3H(C, v, D, N), i = C | 0;
      }
      ({ h: r, l: i } = ee.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: o, l: s } = ee.add(this.Bh | 0, this.Bl | 0, o | 0, s | 0), { h: a, l: f } = ee.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: c } = ee.add(this.Dh | 0, this.Dl | 0, u | 0, c | 0), { h: p, l: y } = ee.add(this.Eh | 0, this.El | 0, p | 0, y | 0), { h: d, l: w } = ee.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: b, l: S } = ee.add(this.Gh | 0, this.Gl | 0, b | 0, S | 0), { h: A, l: O } = ee.add(this.Hh | 0, this.Hl | 0, A | 0, O | 0), this.set(r, i, o, s, a, f, u, c, p, y, d, w, b, S, A, O);
    }
    roundClean() {
      (0, ke.clean)(vn, In);
    }
    destroy() {
      (0, ke.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  };
  pe.SHA512 = uo;
  class mh extends uo {
    constructor() {
      super(48), this.Ah = q.SHA384_IV[0] | 0, this.Al = q.SHA384_IV[1] | 0, this.Bh = q.SHA384_IV[2] | 0, this.Bl = q.SHA384_IV[3] | 0, this.Ch = q.SHA384_IV[4] | 0, this.Cl = q.SHA384_IV[5] | 0, this.Dh = q.SHA384_IV[6] | 0, this.Dl = q.SHA384_IV[7] | 0, this.Eh = q.SHA384_IV[8] | 0, this.El = q.SHA384_IV[9] | 0, this.Fh = q.SHA384_IV[10] | 0, this.Fl = q.SHA384_IV[11] | 0, this.Gh = q.SHA384_IV[12] | 0, this.Gl = q.SHA384_IV[13] | 0, this.Hh = q.SHA384_IV[14] | 0, this.Hl = q.SHA384_IV[15] | 0;
    }
  }
  pe.SHA384 = mh;
  const je = Uint32Array.from([
    2352822216,
    424955298,
    1944164710,
    2312950998,
    502970286,
    855612546,
    1738396948,
    1479516111,
    258812777,
    2077511080,
    2011393907,
    79989058,
    1067287976,
    1780299464,
    286451373,
    2446758561
  ]), We = Uint32Array.from([
    573645204,
    4230739756,
    2673172387,
    3360449730,
    596883563,
    1867755857,
    2520282905,
    1497426621,
    2519219938,
    2827943907,
    3193839141,
    1401305490,
    721525244,
    746961066,
    246885852,
    2177182882
  ]);
  class _h extends uo {
    constructor() {
      super(28), this.Ah = je[0] | 0, this.Al = je[1] | 0, this.Bh = je[2] | 0, this.Bl = je[3] | 0, this.Ch = je[4] | 0, this.Cl = je[5] | 0, this.Dh = je[6] | 0, this.Dl = je[7] | 0, this.Eh = je[8] | 0, this.El = je[9] | 0, this.Fh = je[10] | 0, this.Fl = je[11] | 0, this.Gh = je[12] | 0, this.Gl = je[13] | 0, this.Hh = je[14] | 0, this.Hl = je[15] | 0;
    }
  }
  pe.SHA512_224 = _h;
  class Eh extends uo {
    constructor() {
      super(32), this.Ah = We[0] | 0, this.Al = We[1] | 0, this.Bh = We[2] | 0, this.Bl = We[3] | 0, this.Ch = We[4] | 0, this.Cl = We[5] | 0, this.Dh = We[6] | 0, this.Dl = We[7] | 0, this.Eh = We[8] | 0, this.El = We[9] | 0, this.Fh = We[10] | 0, this.Fl = We[11] | 0, this.Gh = We[12] | 0, this.Gl = We[13] | 0, this.Hh = We[14] | 0, this.Hl = We[15] | 0;
    }
  }
  pe.SHA512_256 = Eh;
  pe.sha256 = (0, ke.createHasher)(() => new kc());
  pe.sha224 = (0, ke.createHasher)(() => new wh());
  pe.sha512 = (0, ke.createHasher)(() => new uo());
  pe.sha384 = (0, ke.createHasher)(() => new mh());
  pe.sha512_256 = (0, ke.createHasher)(() => new Eh());
  pe.sha512_224 = (0, ke.createHasher)(() => new _h());
  Object.defineProperty(Pt, "__esModule", {
    value: true
  });
  Pt.sha224 = Pt.SHA224 = Pt.sha256 = Pt.SHA256 = void 0;
  const Us = pe;
  Pt.SHA256 = Us.SHA256;
  Pt.sha256 = Us.sha256;
  Pt.SHA224 = Us.SHA224;
  Pt.sha224 = Us.sha224;
  (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: true
    }), e.taggedHash = e.TAGGED_HASH_PREFIXES = e.TAGS = e.hash256 = e.hash160 = e.sha256 = e.sha1 = e.ripemd160 = void 0;
    const t = di, n = pi, r = Pt;
    function i(c) {
      return B.from((0, t.ripemd160)(Uint8Array.from(c)));
    }
    e.ripemd160 = i;
    function o(c) {
      return B.from((0, n.sha1)(Uint8Array.from(c)));
    }
    e.sha1 = o;
    function s(c) {
      return B.from((0, r.sha256)(Uint8Array.from(c)));
    }
    e.sha256 = s;
    function a(c) {
      return B.from((0, t.ripemd160)((0, r.sha256)(Uint8Array.from(c))));
    }
    e.hash160 = a;
    function f(c) {
      return B.from((0, r.sha256)((0, r.sha256)(Uint8Array.from(c))));
    }
    e.hash256 = f, e.TAGS = [
      "BIP0340/challenge",
      "BIP0340/aux",
      "BIP0340/nonce",
      "TapLeaf",
      "TapBranch",
      "TapSighash",
      "TapTweak",
      "KeyAgg list",
      "KeyAgg coefficient"
    ], e.TAGGED_HASH_PREFIXES = {
      "BIP0340/challenge": B.from([
        123,
        181,
        45,
        122,
        159,
        239,
        88,
        50,
        62,
        177,
        191,
        122,
        64,
        125,
        179,
        130,
        210,
        243,
        242,
        216,
        27,
        177,
        34,
        79,
        73,
        254,
        81,
        143,
        109,
        72,
        211,
        124,
        123,
        181,
        45,
        122,
        159,
        239,
        88,
        50,
        62,
        177,
        191,
        122,
        64,
        125,
        179,
        130,
        210,
        243,
        242,
        216,
        27,
        177,
        34,
        79,
        73,
        254,
        81,
        143,
        109,
        72,
        211,
        124
      ]),
      "BIP0340/aux": B.from([
        241,
        239,
        78,
        94,
        192,
        99,
        202,
        218,
        109,
        148,
        202,
        250,
        157,
        152,
        126,
        160,
        105,
        38,
        88,
        57,
        236,
        193,
        31,
        151,
        45,
        119,
        165,
        46,
        216,
        193,
        204,
        144,
        241,
        239,
        78,
        94,
        192,
        99,
        202,
        218,
        109,
        148,
        202,
        250,
        157,
        152,
        126,
        160,
        105,
        38,
        88,
        57,
        236,
        193,
        31,
        151,
        45,
        119,
        165,
        46,
        216,
        193,
        204,
        144
      ]),
      "BIP0340/nonce": B.from([
        7,
        73,
        119,
        52,
        167,
        155,
        203,
        53,
        91,
        155,
        140,
        125,
        3,
        79,
        18,
        28,
        244,
        52,
        215,
        62,
        247,
        45,
        218,
        25,
        135,
        0,
        97,
        251,
        82,
        191,
        235,
        47,
        7,
        73,
        119,
        52,
        167,
        155,
        203,
        53,
        91,
        155,
        140,
        125,
        3,
        79,
        18,
        28,
        244,
        52,
        215,
        62,
        247,
        45,
        218,
        25,
        135,
        0,
        97,
        251,
        82,
        191,
        235,
        47
      ]),
      TapLeaf: B.from([
        174,
        234,
        143,
        220,
        66,
        8,
        152,
        49,
        5,
        115,
        75,
        88,
        8,
        29,
        30,
        38,
        56,
        211,
        95,
        28,
        181,
        64,
        8,
        212,
        211,
        87,
        202,
        3,
        190,
        120,
        233,
        238,
        174,
        234,
        143,
        220,
        66,
        8,
        152,
        49,
        5,
        115,
        75,
        88,
        8,
        29,
        30,
        38,
        56,
        211,
        95,
        28,
        181,
        64,
        8,
        212,
        211,
        87,
        202,
        3,
        190,
        120,
        233,
        238
      ]),
      TapBranch: B.from([
        25,
        65,
        161,
        242,
        229,
        110,
        185,
        95,
        162,
        169,
        241,
        148,
        190,
        92,
        1,
        247,
        33,
        111,
        51,
        237,
        130,
        176,
        145,
        70,
        52,
        144,
        208,
        91,
        245,
        22,
        160,
        21,
        25,
        65,
        161,
        242,
        229,
        110,
        185,
        95,
        162,
        169,
        241,
        148,
        190,
        92,
        1,
        247,
        33,
        111,
        51,
        237,
        130,
        176,
        145,
        70,
        52,
        144,
        208,
        91,
        245,
        22,
        160,
        21
      ]),
      TapSighash: B.from([
        244,
        10,
        72,
        223,
        75,
        42,
        112,
        200,
        180,
        146,
        75,
        242,
        101,
        70,
        97,
        237,
        61,
        149,
        253,
        102,
        163,
        19,
        235,
        135,
        35,
        117,
        151,
        198,
        40,
        228,
        160,
        49,
        244,
        10,
        72,
        223,
        75,
        42,
        112,
        200,
        180,
        146,
        75,
        242,
        101,
        70,
        97,
        237,
        61,
        149,
        253,
        102,
        163,
        19,
        235,
        135,
        35,
        117,
        151,
        198,
        40,
        228,
        160,
        49
      ]),
      TapTweak: B.from([
        232,
        15,
        225,
        99,
        156,
        156,
        160,
        80,
        227,
        175,
        27,
        57,
        193,
        67,
        198,
        62,
        66,
        156,
        188,
        235,
        21,
        217,
        64,
        251,
        181,
        197,
        161,
        244,
        175,
        87,
        197,
        233,
        232,
        15,
        225,
        99,
        156,
        156,
        160,
        80,
        227,
        175,
        27,
        57,
        193,
        67,
        198,
        62,
        66,
        156,
        188,
        235,
        21,
        217,
        64,
        251,
        181,
        197,
        161,
        244,
        175,
        87,
        197,
        233
      ]),
      "KeyAgg list": B.from([
        72,
        28,
        151,
        28,
        60,
        11,
        70,
        215,
        240,
        178,
        117,
        174,
        89,
        141,
        78,
        44,
        126,
        215,
        49,
        156,
        89,
        74,
        92,
        110,
        199,
        158,
        160,
        212,
        153,
        2,
        148,
        240,
        72,
        28,
        151,
        28,
        60,
        11,
        70,
        215,
        240,
        178,
        117,
        174,
        89,
        141,
        78,
        44,
        126,
        215,
        49,
        156,
        89,
        74,
        92,
        110,
        199,
        158,
        160,
        212,
        153,
        2,
        148,
        240
      ]),
      "KeyAgg coefficient": B.from([
        191,
        201,
        4,
        3,
        77,
        28,
        136,
        232,
        200,
        14,
        34,
        229,
        61,
        36,
        86,
        109,
        100,
        130,
        78,
        214,
        66,
        114,
        129,
        192,
        145,
        0,
        249,
        77,
        205,
        82,
        201,
        129,
        191,
        201,
        4,
        3,
        77,
        28,
        136,
        232,
        200,
        14,
        34,
        229,
        61,
        36,
        86,
        109,
        100,
        130,
        78,
        214,
        66,
        114,
        129,
        192,
        145,
        0,
        249,
        77,
        205,
        82,
        201,
        129
      ])
    };
    function u(c, p) {
      return s(B.concat([
        e.TAGGED_HASH_PREFIXES[c],
        p
      ]));
    }
    e.taggedHash = u;
  })(Gt);
  function Dy(e) {
    if (e.length >= 255) throw new TypeError("Alphabet too long");
    for (var t = new Uint8Array(256), n = 0; n < t.length; n++) t[n] = 255;
    for (var r = 0; r < e.length; r++) {
      var i = e.charAt(r), o = i.charCodeAt(0);
      if (t[o] !== 255) throw new TypeError(i + " is ambiguous");
      t[o] = r;
    }
    var s = e.length, a = e.charAt(0), f = Math.log(s) / Math.log(256), u = Math.log(256) / Math.log(s);
    function c(d) {
      if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
      if (d.length === 0) return "";
      for (var w = 0, b = 0, S = 0, A = d.length; S !== A && d[S] === 0; ) S++, w++;
      for (var O = (A - S) * u + 1 >>> 0, E = new Uint8Array(O); S !== A; ) {
        for (var m = d[S], k = 0, T = O - 1; (m !== 0 || k < b) && T !== -1; T--, k++) m += 256 * E[T] >>> 0, E[T] = m % s >>> 0, m = m / s >>> 0;
        if (m !== 0) throw new Error("Non-zero carry");
        b = k, S++;
      }
      for (var R = O - b; R !== O && E[R] === 0; ) R++;
      for (var M = a.repeat(w); R < O; ++R) M += e.charAt(E[R]);
      return M;
    }
    function p(d) {
      if (typeof d != "string") throw new TypeError("Expected String");
      if (d.length === 0) return new Uint8Array();
      for (var w = 0, b = 0, S = 0; d[w] === a; ) b++, w++;
      for (var A = (d.length - w) * f + 1 >>> 0, O = new Uint8Array(A); d[w]; ) {
        var E = d.charCodeAt(w);
        if (E > 255) return;
        var m = t[E];
        if (m === 255) return;
        for (var k = 0, T = A - 1; (m !== 0 || k < S) && T !== -1; T--, k++) m += s * O[T] >>> 0, O[T] = m % 256 >>> 0, m = m / 256 >>> 0;
        if (m !== 0) throw new Error("Non-zero carry");
        S = k, w++;
      }
      for (var R = A - S; R !== A && O[R] === 0; ) R++;
      for (var M = new Uint8Array(b + (A - R)), v = b; R !== A; ) M[v++] = O[R++];
      return M;
    }
    function y(d) {
      var w = p(d);
      if (w) return w;
      throw new Error("Non-base" + s + " character");
    }
    return {
      encode: c,
      decodeUnsafe: p,
      decode: y
    };
  }
  var Ky = Dy;
  const $y = Ky, Vy = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  var zy = $y(Vy), ca = zy, jy = function(e) {
    function t(o) {
      var s = Uint8Array.from(o), a = e(s), f = s.length + 4, u = new Uint8Array(f);
      return u.set(s, 0), u.set(a.subarray(0, 4), s.length), ca.encode(u, f);
    }
    function n(o) {
      var s = o.slice(0, -4), a = o.slice(-4), f = e(s);
      if (!(a[0] ^ f[0] | a[1] ^ f[1] | a[2] ^ f[2] | a[3] ^ f[3])) return s;
    }
    function r(o) {
      var s = ca.decodeUnsafe(o);
      if (s) return n(s);
    }
    function i(o) {
      var s = ca.decode(o), a = n(s);
      if (!a) throw new Error("Invalid checksum");
      return a;
    }
    return {
      encode: t,
      decode: i,
      decodeUnsafe: r
    };
  }, { sha256: Uf } = Pt, Wy = jy;
  function Gy(e) {
    return Uf(Uf(e));
  }
  var Rs = Wy(Gy);
  const Bc = Qp(Rs);
  Object.defineProperty(Ps, "__esModule", {
    value: true
  });
  Ps.p2pkh = void 0;
  const fa = Gt, Xy = Ce, ri = ot(), Je = ze, Yt = pt, Rf = Rs, Tn = ri.OPS;
  function qy(e, t) {
    if (!e.address && !e.hash && !e.output && !e.pubkey && !e.input) throw new TypeError("Not enough data");
    t = Object.assign({
      validate: true
    }, t || {}), (0, Je.typeforce)({
      network: Je.typeforce.maybe(Je.typeforce.Object),
      address: Je.typeforce.maybe(Je.typeforce.String),
      hash: Je.typeforce.maybe(Je.typeforce.BufferN(20)),
      output: Je.typeforce.maybe(Je.typeforce.BufferN(25)),
      pubkey: Je.typeforce.maybe(Je.isPoint),
      signature: Je.typeforce.maybe(ri.isCanonicalScriptSignature),
      input: Je.typeforce.maybe(Je.typeforce.Buffer)
    }, e);
    const n = Yt.value(() => {
      const s = B.from(Rf.decode(e.address)), a = s.readUInt8(0), f = s.slice(1);
      return {
        version: a,
        hash: f
      };
    }), r = Yt.value(() => ri.decompile(e.input)), i = e.network || Xy.bitcoin, o = {
      name: "p2pkh",
      network: i
    };
    if (Yt.prop(o, "address", () => {
      if (!o.hash) return;
      const s = B.allocUnsafe(21);
      return s.writeUInt8(i.pubKeyHash, 0), o.hash.copy(s, 1), Rf.encode(s);
    }), Yt.prop(o, "hash", () => {
      if (e.output) return e.output.slice(3, 23);
      if (e.address) return n().hash;
      if (e.pubkey || o.pubkey) return fa.hash160(e.pubkey || o.pubkey);
    }), Yt.prop(o, "output", () => {
      if (o.hash) return ri.compile([
        Tn.OP_DUP,
        Tn.OP_HASH160,
        o.hash,
        Tn.OP_EQUALVERIFY,
        Tn.OP_CHECKSIG
      ]);
    }), Yt.prop(o, "pubkey", () => {
      if (e.input) return r()[1];
    }), Yt.prop(o, "signature", () => {
      if (e.input) return r()[0];
    }), Yt.prop(o, "input", () => {
      if (e.pubkey && e.signature) return ri.compile([
        e.signature,
        e.pubkey
      ]);
    }), Yt.prop(o, "witness", () => {
      if (o.input) return [];
    }), t.validate) {
      let s = B.from([]);
      if (e.address) {
        if (n().version !== i.pubKeyHash) throw new TypeError("Invalid version or Network mismatch");
        if (n().hash.length !== 20) throw new TypeError("Invalid address");
        s = n().hash;
      }
      if (e.hash) {
        if (s.length > 0 && !s.equals(e.hash)) throw new TypeError("Hash mismatch");
        s = e.hash;
      }
      if (e.output) {
        if (e.output.length !== 25 || e.output[0] !== Tn.OP_DUP || e.output[1] !== Tn.OP_HASH160 || e.output[2] !== 20 || e.output[23] !== Tn.OP_EQUALVERIFY || e.output[24] !== Tn.OP_CHECKSIG) throw new TypeError("Output is invalid");
        const a = e.output.slice(3, 23);
        if (s.length > 0 && !s.equals(a)) throw new TypeError("Hash mismatch");
        s = a;
      }
      if (e.pubkey) {
        const a = fa.hash160(e.pubkey);
        if (s.length > 0 && !s.equals(a)) throw new TypeError("Hash mismatch");
        s = a;
      }
      if (e.input) {
        const a = r();
        if (a.length !== 2) throw new TypeError("Input is invalid");
        if (!ri.isCanonicalScriptSignature(a[0])) throw new TypeError("Input has invalid signature");
        if (!(0, Je.isPoint)(a[1])) throw new TypeError("Input has invalid pubkey");
        if (e.signature && !e.signature.equals(a[0])) throw new TypeError("Signature mismatch");
        if (e.pubkey && !e.pubkey.equals(a[1])) throw new TypeError("Pubkey mismatch");
        const f = fa.hash160(a[1]);
        if (s.length > 0 && !s.equals(f)) throw new TypeError("Hash mismatch");
      }
    }
    return Object.assign(o, e);
  }
  Ps.p2pkh = qy;
  var Ns = {};
  Object.defineProperty(Ns, "__esModule", {
    value: true
  });
  Ns.p2sh = void 0;
  const Nf = Gt, Zy = Ce, Mt = ot(), ge = ze, Nt = pt, Cf = Rs, Pi = Mt.OPS;
  function Yy(e, t) {
    if (!e.address && !e.hash && !e.output && !e.redeem && !e.input) throw new TypeError("Not enough data");
    t = Object.assign({
      validate: true
    }, t || {}), (0, ge.typeforce)({
      network: ge.typeforce.maybe(ge.typeforce.Object),
      address: ge.typeforce.maybe(ge.typeforce.String),
      hash: ge.typeforce.maybe(ge.typeforce.BufferN(20)),
      output: ge.typeforce.maybe(ge.typeforce.BufferN(23)),
      redeem: ge.typeforce.maybe({
        network: ge.typeforce.maybe(ge.typeforce.Object),
        output: ge.typeforce.maybe(ge.typeforce.Buffer),
        input: ge.typeforce.maybe(ge.typeforce.Buffer),
        witness: ge.typeforce.maybe(ge.typeforce.arrayOf(ge.typeforce.Buffer))
      }),
      input: ge.typeforce.maybe(ge.typeforce.Buffer),
      witness: ge.typeforce.maybe(ge.typeforce.arrayOf(ge.typeforce.Buffer))
    }, e);
    let n = e.network;
    n || (n = e.redeem && e.redeem.network || Zy.bitcoin);
    const r = {
      network: n
    }, i = Nt.value(() => {
      const a = B.from(Cf.decode(e.address)), f = a.readUInt8(0), u = a.slice(1);
      return {
        version: f,
        hash: u
      };
    }), o = Nt.value(() => Mt.decompile(e.input)), s = Nt.value(() => {
      const a = o(), f = a[a.length - 1];
      return {
        network: n,
        output: f === Pi.OP_FALSE ? B.from([]) : f,
        input: Mt.compile(a.slice(0, -1)),
        witness: e.witness || []
      };
    });
    if (Nt.prop(r, "address", () => {
      if (!r.hash) return;
      const a = B.allocUnsafe(21);
      return a.writeUInt8(r.network.scriptHash, 0), r.hash.copy(a, 1), Cf.encode(a);
    }), Nt.prop(r, "hash", () => {
      if (e.output) return e.output.slice(2, 22);
      if (e.address) return i().hash;
      if (r.redeem && r.redeem.output) return Nf.hash160(r.redeem.output);
    }), Nt.prop(r, "output", () => {
      if (r.hash) return Mt.compile([
        Pi.OP_HASH160,
        r.hash,
        Pi.OP_EQUAL
      ]);
    }), Nt.prop(r, "redeem", () => {
      if (e.input) return s();
    }), Nt.prop(r, "input", () => {
      if (!(!e.redeem || !e.redeem.input || !e.redeem.output)) return Mt.compile([].concat(Mt.decompile(e.redeem.input), e.redeem.output));
    }), Nt.prop(r, "witness", () => {
      if (r.redeem && r.redeem.witness) return r.redeem.witness;
      if (r.input) return [];
    }), Nt.prop(r, "name", () => {
      const a = [
        "p2sh"
      ];
      return r.redeem !== void 0 && r.redeem.name !== void 0 && a.push(r.redeem.name), a.join("-");
    }), t.validate) {
      let a = B.from([]);
      if (e.address) {
        if (i().version !== n.scriptHash) throw new TypeError("Invalid version or Network mismatch");
        if (i().hash.length !== 20) throw new TypeError("Invalid address");
        a = i().hash;
      }
      if (e.hash) {
        if (a.length > 0 && !a.equals(e.hash)) throw new TypeError("Hash mismatch");
        a = e.hash;
      }
      if (e.output) {
        if (e.output.length !== 23 || e.output[0] !== Pi.OP_HASH160 || e.output[1] !== 20 || e.output[22] !== Pi.OP_EQUAL) throw new TypeError("Output is invalid");
        const u = e.output.slice(2, 22);
        if (a.length > 0 && !a.equals(u)) throw new TypeError("Hash mismatch");
        a = u;
      }
      const f = (u) => {
        if (u.output) {
          const c = Mt.decompile(u.output);
          if (!c || c.length < 1) throw new TypeError("Redeem.output too short");
          if (u.output.byteLength > 520) throw new TypeError("Redeem.output unspendable if larger than 520 bytes");
          if (Mt.countNonPushOnlyOPs(c) > 201) throw new TypeError("Redeem.output unspendable with more than 201 non-push ops");
          const p = Nf.hash160(u.output);
          if (a.length > 0 && !a.equals(p)) throw new TypeError("Hash mismatch");
          a = p;
        }
        if (u.input) {
          const c = u.input.length > 0, p = u.witness && u.witness.length > 0;
          if (!c && !p) throw new TypeError("Empty input");
          if (c && p) throw new TypeError("Input and witness provided");
          if (c) {
            const y = Mt.decompile(u.input);
            if (!Mt.isPushOnly(y)) throw new TypeError("Non push-only scriptSig");
          }
        }
      };
      if (e.input) {
        const u = o();
        if (!u || u.length < 1) throw new TypeError("Input too short");
        if (!B.isBuffer(s().output)) throw new TypeError("Input is invalid");
        f(s());
      }
      if (e.redeem) {
        if (e.redeem.network && e.redeem.network !== n) throw new TypeError("Network mismatch");
        if (e.input) {
          const u = s();
          if (e.redeem.output && !e.redeem.output.equals(u.output)) throw new TypeError("Redeem.output mismatch");
          if (e.redeem.input && !e.redeem.input.equals(u.input)) throw new TypeError("Redeem.input mismatch");
        }
        f(e.redeem);
      }
      if (e.witness && e.redeem && e.redeem.witness && !(0, ge.stacksEqual)(e.redeem.witness, e.witness)) throw new TypeError("Witness and redeem.witness mismatch");
    }
    return Object.assign(r, e);
  }
  Ns.p2sh = Yy;
  var Cs = {}, bn = {};
  Object.defineProperty(bn, "__esModule", {
    value: true
  });
  bn.bech32m = bn.bech32 = void 0;
  const os = "qpzry9x8gf2tvdw0s3jn54khce6mua7l", Sh = {};
  for (let e = 0; e < os.length; e++) {
    const t = os.charAt(e);
    Sh[t] = e;
  }
  function ai(e) {
    const t = e >> 25;
    return (e & 33554431) << 5 ^ -(t >> 0 & 1) & 996825010 ^ -(t >> 1 & 1) & 642813549 ^ -(t >> 2 & 1) & 513874426 ^ -(t >> 3 & 1) & 1027748829 ^ -(t >> 4 & 1) & 705979059;
  }
  function Lf(e) {
    let t = 1;
    for (let n = 0; n < e.length; ++n) {
      const r = e.charCodeAt(n);
      if (r < 33 || r > 126) return "Invalid prefix (" + e + ")";
      t = ai(t) ^ r >> 5;
    }
    t = ai(t);
    for (let n = 0; n < e.length; ++n) {
      const r = e.charCodeAt(n);
      t = ai(t) ^ r & 31;
    }
    return t;
  }
  function Pc(e, t, n, r) {
    let i = 0, o = 0;
    const s = (1 << n) - 1, a = [];
    for (let f = 0; f < e.length; ++f) for (i = i << t | e[f], o += t; o >= n; ) o -= n, a.push(i >> o & s);
    if (r) o > 0 && a.push(i << n - o & s);
    else {
      if (o >= t) return "Excess padding";
      if (i << n - o & s) return "Non-zero padding";
    }
    return a;
  }
  function Jy(e) {
    return Pc(e, 8, 5, true);
  }
  function Qy(e) {
    const t = Pc(e, 5, 8, false);
    if (Array.isArray(t)) return t;
  }
  function eg(e) {
    const t = Pc(e, 5, 8, false);
    if (Array.isArray(t)) return t;
    throw new Error(t);
  }
  function xh(e) {
    let t;
    e === "bech32" ? t = 1 : t = 734539939;
    function n(s, a, f) {
      if (f = f || 90, s.length + 7 + a.length > f) throw new TypeError("Exceeds length limit");
      s = s.toLowerCase();
      let u = Lf(s);
      if (typeof u == "string") throw new Error(u);
      let c = s + "1";
      for (let p = 0; p < a.length; ++p) {
        const y = a[p];
        if (y >> 5) throw new Error("Non 5-bit word");
        u = ai(u) ^ y, c += os.charAt(y);
      }
      for (let p = 0; p < 6; ++p) u = ai(u);
      u ^= t;
      for (let p = 0; p < 6; ++p) {
        const y = u >> (5 - p) * 5 & 31;
        c += os.charAt(y);
      }
      return c;
    }
    function r(s, a) {
      if (a = a || 90, s.length < 8) return s + " too short";
      if (s.length > a) return "Exceeds length limit";
      const f = s.toLowerCase(), u = s.toUpperCase();
      if (s !== f && s !== u) return "Mixed-case string " + s;
      s = f;
      const c = s.lastIndexOf("1");
      if (c === -1) return "No separator character for " + s;
      if (c === 0) return "Missing prefix for " + s;
      const p = s.slice(0, c), y = s.slice(c + 1);
      if (y.length < 6) return "Data too short";
      let d = Lf(p);
      if (typeof d == "string") return d;
      const w = [];
      for (let b = 0; b < y.length; ++b) {
        const S = y.charAt(b), A = Sh[S];
        if (A === void 0) return "Unknown character " + S;
        d = ai(d) ^ A, !(b + 6 >= y.length) && w.push(A);
      }
      return d !== t ? "Invalid checksum for " + s : {
        prefix: p,
        words: w
      };
    }
    function i(s, a) {
      const f = r(s, a);
      if (typeof f == "object") return f;
    }
    function o(s, a) {
      const f = r(s, a);
      if (typeof f == "object") return f;
      throw new Error(f);
    }
    return {
      decodeUnsafe: i,
      decode: o,
      encode: n,
      toWords: Jy,
      fromWordsUnsafe: Qy,
      fromWords: eg
    };
  }
  bn.bech32 = xh("bech32");
  bn.bech32m = xh("bech32m");
  Object.defineProperty(Cs, "__esModule", {
    value: true
  });
  Cs.p2wpkh = void 0;
  const ua = Gt, tg = Ce, Qo = ot(), Oe = ze, An = pt, Oo = bn, Ff = Qo.OPS, ng = B.alloc(0);
  function rg(e, t) {
    if (!e.address && !e.hash && !e.output && !e.pubkey && !e.witness) throw new TypeError("Not enough data");
    t = Object.assign({
      validate: true
    }, t || {}), (0, Oe.typeforce)({
      address: Oe.typeforce.maybe(Oe.typeforce.String),
      hash: Oe.typeforce.maybe(Oe.typeforce.BufferN(20)),
      input: Oe.typeforce.maybe(Oe.typeforce.BufferN(0)),
      network: Oe.typeforce.maybe(Oe.typeforce.Object),
      output: Oe.typeforce.maybe(Oe.typeforce.BufferN(22)),
      pubkey: Oe.typeforce.maybe(Oe.isPoint),
      signature: Oe.typeforce.maybe(Qo.isCanonicalScriptSignature),
      witness: Oe.typeforce.maybe(Oe.typeforce.arrayOf(Oe.typeforce.Buffer))
    }, e);
    const n = An.value(() => {
      const o = Oo.bech32.decode(e.address), s = o.words.shift(), a = Oo.bech32.fromWords(o.words);
      return {
        version: s,
        prefix: o.prefix,
        data: B.from(a)
      };
    }), r = e.network || tg.bitcoin, i = {
      name: "p2wpkh",
      network: r
    };
    if (An.prop(i, "address", () => {
      if (!i.hash) return;
      const o = Oo.bech32.toWords(i.hash);
      return o.unshift(0), Oo.bech32.encode(r.bech32, o);
    }), An.prop(i, "hash", () => {
      if (e.output) return e.output.slice(2, 22);
      if (e.address) return n().data;
      if (e.pubkey || i.pubkey) return ua.hash160(e.pubkey || i.pubkey);
    }), An.prop(i, "output", () => {
      if (i.hash) return Qo.compile([
        Ff.OP_0,
        i.hash
      ]);
    }), An.prop(i, "pubkey", () => {
      if (e.pubkey) return e.pubkey;
      if (e.witness) return e.witness[1];
    }), An.prop(i, "signature", () => {
      if (e.witness) return e.witness[0];
    }), An.prop(i, "input", () => {
      if (i.witness) return ng;
    }), An.prop(i, "witness", () => {
      if (e.pubkey && e.signature) return [
        e.signature,
        e.pubkey
      ];
    }), t.validate) {
      let o = B.from([]);
      if (e.address) {
        if (r && r.bech32 !== n().prefix) throw new TypeError("Invalid prefix or Network mismatch");
        if (n().version !== 0) throw new TypeError("Invalid address version");
        if (n().data.length !== 20) throw new TypeError("Invalid address data");
        o = n().data;
      }
      if (e.hash) {
        if (o.length > 0 && !o.equals(e.hash)) throw new TypeError("Hash mismatch");
        o = e.hash;
      }
      if (e.output) {
        if (e.output.length !== 22 || e.output[0] !== Ff.OP_0 || e.output[1] !== 20) throw new TypeError("Output is invalid");
        if (o.length > 0 && !o.equals(e.output.slice(2))) throw new TypeError("Hash mismatch");
        o = e.output.slice(2);
      }
      if (e.pubkey) {
        const s = ua.hash160(e.pubkey);
        if (o.length > 0 && !o.equals(s)) throw new TypeError("Hash mismatch");
        if (o = s, !(0, Oe.isPoint)(e.pubkey) || e.pubkey.length !== 33) throw new TypeError("Invalid pubkey for p2wpkh");
      }
      if (e.witness) {
        if (e.witness.length !== 2) throw new TypeError("Witness is invalid");
        if (!Qo.isCanonicalScriptSignature(e.witness[0])) throw new TypeError("Witness has invalid signature");
        if (!(0, Oe.isPoint)(e.witness[1]) || e.witness[1].length !== 33) throw new TypeError("Witness has invalid pubkey");
        if (e.signature && !e.signature.equals(e.witness[0])) throw new TypeError("Signature mismatch");
        if (e.pubkey && !e.pubkey.equals(e.witness[1])) throw new TypeError("Pubkey mismatch");
        const s = ua.hash160(e.witness[1]);
        if (o.length > 0 && !o.equals(s)) throw new TypeError("Hash mismatch");
      }
    }
    return Object.assign(i, e);
  }
  Cs.p2wpkh = rg;
  var Ls = {};
  Object.defineProperty(Ls, "__esModule", {
    value: true
  });
  Ls.p2wsh = void 0;
  const Mf = Gt, ig = Ce, on = ot(), de = ze, Jt = pt, Ho = bn, Df = on.OPS, la = B.alloc(0);
  function Uo(e) {
    return !!(B.isBuffer(e) && e.length === 65 && e[0] === 4 && (0, de.isPoint)(e));
  }
  function og(e, t) {
    if (!e.address && !e.hash && !e.output && !e.redeem && !e.witness) throw new TypeError("Not enough data");
    t = Object.assign({
      validate: true
    }, t || {}), (0, de.typeforce)({
      network: de.typeforce.maybe(de.typeforce.Object),
      address: de.typeforce.maybe(de.typeforce.String),
      hash: de.typeforce.maybe(de.typeforce.BufferN(32)),
      output: de.typeforce.maybe(de.typeforce.BufferN(34)),
      redeem: de.typeforce.maybe({
        input: de.typeforce.maybe(de.typeforce.Buffer),
        network: de.typeforce.maybe(de.typeforce.Object),
        output: de.typeforce.maybe(de.typeforce.Buffer),
        witness: de.typeforce.maybe(de.typeforce.arrayOf(de.typeforce.Buffer))
      }),
      input: de.typeforce.maybe(de.typeforce.BufferN(0)),
      witness: de.typeforce.maybe(de.typeforce.arrayOf(de.typeforce.Buffer))
    }, e);
    const n = Jt.value(() => {
      const s = Ho.bech32.decode(e.address), a = s.words.shift(), f = Ho.bech32.fromWords(s.words);
      return {
        version: a,
        prefix: s.prefix,
        data: B.from(f)
      };
    }), r = Jt.value(() => on.decompile(e.redeem.input));
    let i = e.network;
    i || (i = e.redeem && e.redeem.network || ig.bitcoin);
    const o = {
      network: i
    };
    if (Jt.prop(o, "address", () => {
      if (!o.hash) return;
      const s = Ho.bech32.toWords(o.hash);
      return s.unshift(0), Ho.bech32.encode(i.bech32, s);
    }), Jt.prop(o, "hash", () => {
      if (e.output) return e.output.slice(2);
      if (e.address) return n().data;
      if (o.redeem && o.redeem.output) return Mf.sha256(o.redeem.output);
    }), Jt.prop(o, "output", () => {
      if (o.hash) return on.compile([
        Df.OP_0,
        o.hash
      ]);
    }), Jt.prop(o, "redeem", () => {
      if (e.witness) return {
        output: e.witness[e.witness.length - 1],
        input: la,
        witness: e.witness.slice(0, -1)
      };
    }), Jt.prop(o, "input", () => {
      if (o.witness) return la;
    }), Jt.prop(o, "witness", () => {
      if (e.redeem && e.redeem.input && e.redeem.input.length > 0 && e.redeem.output && e.redeem.output.length > 0) {
        const s = on.toStack(r());
        return o.redeem = Object.assign({
          witness: s
        }, e.redeem), o.redeem.input = la, [].concat(s, e.redeem.output);
      }
      if (e.redeem && e.redeem.output && e.redeem.witness) return [].concat(e.redeem.witness, e.redeem.output);
    }), Jt.prop(o, "name", () => {
      const s = [
        "p2wsh"
      ];
      return o.redeem !== void 0 && o.redeem.name !== void 0 && s.push(o.redeem.name), s.join("-");
    }), t.validate) {
      let s = B.from([]);
      if (e.address) {
        if (n().prefix !== i.bech32) throw new TypeError("Invalid prefix or Network mismatch");
        if (n().version !== 0) throw new TypeError("Invalid address version");
        if (n().data.length !== 32) throw new TypeError("Invalid address data");
        s = n().data;
      }
      if (e.hash) {
        if (s.length > 0 && !s.equals(e.hash)) throw new TypeError("Hash mismatch");
        s = e.hash;
      }
      if (e.output) {
        if (e.output.length !== 34 || e.output[0] !== Df.OP_0 || e.output[1] !== 32) throw new TypeError("Output is invalid");
        const a = e.output.slice(2);
        if (s.length > 0 && !s.equals(a)) throw new TypeError("Hash mismatch");
        s = a;
      }
      if (e.redeem) {
        if (e.redeem.network && e.redeem.network !== i) throw new TypeError("Network mismatch");
        if (e.redeem.input && e.redeem.input.length > 0 && e.redeem.witness && e.redeem.witness.length > 0) throw new TypeError("Ambiguous witness source");
        if (e.redeem.output) {
          const a = on.decompile(e.redeem.output);
          if (!a || a.length < 1) throw new TypeError("Redeem.output is invalid");
          if (e.redeem.output.byteLength > 3600) throw new TypeError("Redeem.output unspendable if larger than 3600 bytes");
          if (on.countNonPushOnlyOPs(a) > 201) throw new TypeError("Redeem.output unspendable with more than 201 non-push ops");
          const f = Mf.sha256(e.redeem.output);
          if (s.length > 0 && !s.equals(f)) throw new TypeError("Hash mismatch");
          s = f;
        }
        if (e.redeem.input && !on.isPushOnly(r())) throw new TypeError("Non push-only scriptSig");
        if (e.witness && e.redeem.witness && !(0, de.stacksEqual)(e.witness, e.redeem.witness)) throw new TypeError("Witness and redeem.witness mismatch");
        if (e.redeem.input && r().some(Uo) || e.redeem.output && (on.decompile(e.redeem.output) || []).some(Uo)) throw new TypeError("redeem.input or redeem.output contains uncompressed pubkey");
      }
      if (e.witness && e.witness.length > 0) {
        const a = e.witness[e.witness.length - 1];
        if (e.redeem && e.redeem.output && !e.redeem.output.equals(a)) throw new TypeError("Witness and redeem.output mismatch");
        if (e.witness.some(Uo) || (on.decompile(a) || []).some(Uo)) throw new TypeError("Witness contains uncompressed pubkey");
      }
    }
    return Object.assign(o, e);
  }
  Ls.p2wsh = og;
  var Oi = {}, $n = {};
  Object.defineProperty($n, "__esModule", {
    value: true
  });
  $n.getEccLib = $n.initEccLib = void 0;
  const $i = {};
  function sg(e, t) {
    e ? e !== $i.eccLib && ((t == null ? void 0 : t.DANGER_DO_NOT_VERIFY_ECCLIB) || cg(e), $i.eccLib = e) : $i.eccLib = e;
  }
  $n.initEccLib = sg;
  function ag() {
    if (!$i.eccLib) throw new Error("No ECC Library provided. You must call initEccLib() with a valid TinySecp256k1Interface instance");
    return $i.eccLib;
  }
  $n.getEccLib = ag;
  const Qt = (e) => B.from(e, "hex");
  function cg(e) {
    gt(typeof e.isXOnlyPoint == "function"), gt(e.isXOnlyPoint(Qt("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"))), gt(e.isXOnlyPoint(Qt("fffffffffffffffffffffffffffffffffffffffffffffffffffffffeeffffc2e"))), gt(e.isXOnlyPoint(Qt("f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9"))), gt(e.isXOnlyPoint(Qt("0000000000000000000000000000000000000000000000000000000000000001"))), gt(!e.isXOnlyPoint(Qt("0000000000000000000000000000000000000000000000000000000000000000"))), gt(!e.isXOnlyPoint(Qt("fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"))), gt(typeof e.xOnlyPointAddTweak == "function"), fg.forEach((t) => {
      const n = e.xOnlyPointAddTweak(Qt(t.pubkey), Qt(t.tweak));
      t.result === null ? gt(n === null) : (gt(n !== null), gt(n.parity === t.parity), gt(B.from(n.xOnlyPubkey).equals(Qt(t.result))));
    });
  }
  function gt(e) {
    if (!e) throw new Error("ecc library invalid");
  }
  const fg = [
    {
      pubkey: "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
      tweak: "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140",
      parity: -1,
      result: null
    },
    {
      pubkey: "1617d38ed8d8657da4d4761e8057bc396ea9e4b9d29776d4be096016dbd2509b",
      tweak: "a8397a935f0dfceba6ba9618f6451ef4d80637abf4e6af2669fbc9de6a8fd2ac",
      parity: 1,
      result: "e478f99dab91052ab39a33ea35fd5e6e4933f4d28023cd597c9a1f6760346adf"
    },
    {
      pubkey: "2c0b7cf95324a07d05398b240174dc0c2be444d96b159aa6c7f7b1e668680991",
      tweak: "823c3cd2142744b075a87eade7e1b8678ba308d566226a0056ca2b7a76f86b47",
      parity: 0,
      result: "9534f8dc8c6deda2dc007655981c78b49c5d96c778fbf363462a11ec9dfd948c"
    }
  ];
  var Fs = {}, He = {}, qa = {
    exports: {}
  };
  (function(e, t) {
    var n = As, r = n.Buffer;
    function i(s, a) {
      for (var f in s) a[f] = s[f];
    }
    r.from && r.alloc && r.allocUnsafe && r.allocUnsafeSlow ? e.exports = n : (i(n, t), t.Buffer = o);
    function o(s, a, f) {
      return r(s, a, f);
    }
    o.prototype = Object.create(r.prototype), i(r, o), o.from = function(s, a, f) {
      if (typeof s == "number") throw new TypeError("Argument must not be a number");
      return r(s, a, f);
    }, o.alloc = function(s, a, f) {
      if (typeof s != "number") throw new TypeError("Argument must be a number");
      var u = r(s);
      return a !== void 0 ? typeof f == "string" ? u.fill(a, f) : u.fill(a) : u.fill(0), u;
    }, o.allocUnsafe = function(s) {
      if (typeof s != "number") throw new TypeError("Argument must be a number");
      return r(s);
    }, o.allocUnsafeSlow = function(s) {
      if (typeof s != "number") throw new TypeError("Argument must be a number");
      return n.SlowBuffer(s);
    };
  })(qa, qa.exports);
  var ug = qa.exports, Za = ug.Buffer, lg = 9007199254740991;
  function Oc(e) {
    if (e < 0 || e > lg || e % 1 !== 0) throw new RangeError("value out of range");
  }
  function Ci(e, t, n) {
    if (Oc(e), t || (t = Za.allocUnsafe(vh(e))), !Za.isBuffer(t)) throw new TypeError("buffer must be a Buffer instance");
    return n || (n = 0), e < 253 ? (t.writeUInt8(e, n), Ci.bytes = 1) : e <= 65535 ? (t.writeUInt8(253, n), t.writeUInt16LE(e, n + 1), Ci.bytes = 3) : e <= 4294967295 ? (t.writeUInt8(254, n), t.writeUInt32LE(e, n + 1), Ci.bytes = 5) : (t.writeUInt8(255, n), t.writeUInt32LE(e >>> 0, n + 1), t.writeUInt32LE(e / 4294967296 | 0, n + 5), Ci.bytes = 9), t;
  }
  function Li(e, t) {
    if (!Za.isBuffer(e)) throw new TypeError("buffer must be a Buffer instance");
    t || (t = 0);
    var n = e.readUInt8(t);
    if (n < 253) return Li.bytes = 1, n;
    if (n === 253) return Li.bytes = 3, e.readUInt16LE(t + 1);
    if (n === 254) return Li.bytes = 5, e.readUInt32LE(t + 1);
    Li.bytes = 9;
    var r = e.readUInt32LE(t + 1), i = e.readUInt32LE(t + 5), o = i * 4294967296 + r;
    return Oc(o), o;
  }
  function vh(e) {
    return Oc(e), e < 253 ? 1 : e <= 65535 ? 3 : e <= 4294967295 ? 5 : 9;
  }
  var hg = {
    encode: Ci,
    decode: Li,
    encodingLength: vh
  };
  Object.defineProperty(He, "__esModule", {
    value: true
  });
  He.BufferReader = He.BufferWriter = He.cloneBuffer = He.reverseBuffer = He.writeUInt64LE = He.readUInt64LE = He.varuint = void 0;
  const fr = ze, { typeforce: Ih } = fr, qi = hg;
  He.varuint = qi;
  function Th(e, t) {
    if (typeof e != "number") throw new Error("cannot write a non-number as a number");
    if (e < 0) throw new Error("specified a negative value for writing an unsigned value");
    if (e > t) throw new Error("RangeError: value out of range");
    if (Math.floor(e) !== e) throw new Error("value has a fractional component");
  }
  function Ah(e, t) {
    const n = e.readUInt32LE(t);
    let r = e.readUInt32LE(t + 4);
    return r *= 4294967296, Th(r + n, 9007199254740991), r + n;
  }
  He.readUInt64LE = Ah;
  function kh(e, t, n) {
    return Th(t, 9007199254740991), e.writeInt32LE(t & -1, n), e.writeUInt32LE(Math.floor(t / 4294967296), n + 4), n + 8;
  }
  He.writeUInt64LE = kh;
  function dg(e) {
    if (e.length < 1) return e;
    let t = e.length - 1, n = 0;
    for (let r = 0; r < e.length / 2; r++) n = e[r], e[r] = e[t], e[t] = n, t--;
    return e;
  }
  He.reverseBuffer = dg;
  function pg(e) {
    const t = B.allocUnsafe(e.length);
    return e.copy(t), t;
  }
  He.cloneBuffer = pg;
  class Hc {
    static withCapacity(t) {
      return new Hc(B.alloc(t));
    }
    constructor(t, n = 0) {
      this.buffer = t, this.offset = n, Ih(fr.tuple(fr.Buffer, fr.UInt32), [
        t,
        n
      ]);
    }
    writeUInt8(t) {
      this.offset = this.buffer.writeUInt8(t, this.offset);
    }
    writeInt32(t) {
      this.offset = this.buffer.writeInt32LE(t, this.offset);
    }
    writeUInt32(t) {
      this.offset = this.buffer.writeUInt32LE(t, this.offset);
    }
    writeUInt64(t) {
      this.offset = kh(this.buffer, t, this.offset);
    }
    writeVarInt(t) {
      qi.encode(t, this.buffer, this.offset), this.offset += qi.encode.bytes;
    }
    writeSlice(t) {
      if (this.buffer.length < this.offset + t.length) throw new Error("Cannot write slice out of bounds");
      this.offset += t.copy(this.buffer, this.offset);
    }
    writeVarSlice(t) {
      this.writeVarInt(t.length), this.writeSlice(t);
    }
    writeVector(t) {
      this.writeVarInt(t.length), t.forEach((n) => this.writeVarSlice(n));
    }
    end() {
      if (this.buffer.length === this.offset) return this.buffer;
      throw new Error(`buffer size ${this.buffer.length}, offset ${this.offset}`);
    }
  }
  He.BufferWriter = Hc;
  class yg {
    constructor(t, n = 0) {
      this.buffer = t, this.offset = n, Ih(fr.tuple(fr.Buffer, fr.UInt32), [
        t,
        n
      ]);
    }
    readUInt8() {
      const t = this.buffer.readUInt8(this.offset);
      return this.offset++, t;
    }
    readInt32() {
      const t = this.buffer.readInt32LE(this.offset);
      return this.offset += 4, t;
    }
    readUInt32() {
      const t = this.buffer.readUInt32LE(this.offset);
      return this.offset += 4, t;
    }
    readUInt64() {
      const t = Ah(this.buffer, this.offset);
      return this.offset += 8, t;
    }
    readVarInt() {
      const t = qi.decode(this.buffer, this.offset);
      return this.offset += qi.decode.bytes, t;
    }
    readSlice(t) {
      if (this.buffer.length < this.offset + t) throw new Error("Cannot read slice out of bounds");
      const n = this.buffer.slice(this.offset, this.offset + t);
      return this.offset += t, n;
    }
    readVarSlice() {
      return this.readSlice(this.readVarInt());
    }
    readVector() {
      const t = this.readVarInt(), n = [];
      for (let r = 0; r < t; r++) n.push(this.readVarSlice());
      return n;
    }
  }
  He.BufferReader = yg;
  (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: true
    }), e.tweakKey = e.tapTweakHash = e.tapleafHash = e.findScriptPath = e.toHashTree = e.rootHashFromPath = e.MAX_TAPTREE_DEPTH = e.LEAF_VERSION_TAPSCRIPT = void 0;
    const t = As, n = $n, r = Gt, i = He, o = ze;
    e.LEAF_VERSION_TAPSCRIPT = 192, e.MAX_TAPTREE_DEPTH = 128;
    const s = (b) => "left" in b && "right" in b;
    function a(b, S) {
      if (b.length < 33) throw new TypeError(`The control-block length is too small. Got ${b.length}, expected min 33.`);
      const A = (b.length - 33) / 32;
      let O = S;
      for (let E = 0; E < A; E++) {
        const m = b.slice(33 + 32 * E, 65 + 32 * E);
        O.compare(m) < 0 ? O = d(O, m) : O = d(m, O);
      }
      return O;
    }
    e.rootHashFromPath = a;
    function f(b) {
      if ((0, o.isTapleaf)(b)) return {
        hash: c(b)
      };
      const S = [
        f(b[0]),
        f(b[1])
      ];
      S.sort((E, m) => E.hash.compare(m.hash));
      const [A, O] = S;
      return {
        hash: d(A.hash, O.hash),
        left: A,
        right: O
      };
    }
    e.toHashTree = f;
    function u(b, S) {
      if (s(b)) {
        const A = u(b.left, S);
        if (A !== void 0) return [
          ...A,
          b.right.hash
        ];
        const O = u(b.right, S);
        if (O !== void 0) return [
          ...O,
          b.left.hash
        ];
      } else if (b.hash.equals(S)) return [];
    }
    e.findScriptPath = u;
    function c(b) {
      const S = b.version || e.LEAF_VERSION_TAPSCRIPT;
      return r.taggedHash("TapLeaf", t.Buffer.concat([
        t.Buffer.from([
          S
        ]),
        w(b.output)
      ]));
    }
    e.tapleafHash = c;
    function p(b, S) {
      return r.taggedHash("TapTweak", t.Buffer.concat(S ? [
        b,
        S
      ] : [
        b
      ]));
    }
    e.tapTweakHash = p;
    function y(b, S) {
      if (!t.Buffer.isBuffer(b) || b.length !== 32 || S && S.length !== 32) return null;
      const A = p(b, S), O = (0, n.getEccLib)().xOnlyPointAddTweak(b, A);
      return !O || O.xOnlyPubkey === null ? null : {
        parity: O.parity,
        x: t.Buffer.from(O.xOnlyPubkey)
      };
    }
    e.tweakKey = y;
    function d(b, S) {
      return r.taggedHash("TapBranch", t.Buffer.concat([
        b,
        S
      ]));
    }
    function w(b) {
      const S = i.varuint.encodingLength(b.length), A = t.Buffer.allocUnsafe(S);
      return i.varuint.encode(b.length, A), t.Buffer.concat([
        A,
        b
      ]);
    }
  })(Fs);
  var Kf;
  function gg() {
    if (Kf) return Oi;
    Kf = 1, Object.defineProperty(Oi, "__esModule", {
      value: true
    }), Oi.p2tr = void 0;
    const e = As, t = Ce, n = ot(), r = ze, i = $n, o = Fs, s = pt, a = bn, f = Uc(), u = n.OPS, c = 1, p = 80;
    function y(d, w) {
      if (!d.address && !d.output && !d.pubkey && !d.internalPubkey && !(d.witness && d.witness.length > 1)) throw new TypeError("Not enough data");
      w = Object.assign({
        validate: true
      }, w || {}), (0, r.typeforce)({
        address: r.typeforce.maybe(r.typeforce.String),
        input: r.typeforce.maybe(r.typeforce.BufferN(0)),
        network: r.typeforce.maybe(r.typeforce.Object),
        output: r.typeforce.maybe(r.typeforce.BufferN(34)),
        internalPubkey: r.typeforce.maybe(r.typeforce.BufferN(32)),
        hash: r.typeforce.maybe(r.typeforce.BufferN(32)),
        pubkey: r.typeforce.maybe(r.typeforce.BufferN(32)),
        signature: r.typeforce.maybe(r.typeforce.anyOf(r.typeforce.BufferN(64), r.typeforce.BufferN(65))),
        witness: r.typeforce.maybe(r.typeforce.arrayOf(r.typeforce.Buffer)),
        scriptTree: r.typeforce.maybe(r.isTaptree),
        redeem: r.typeforce.maybe({
          output: r.typeforce.maybe(r.typeforce.Buffer),
          redeemVersion: r.typeforce.maybe(r.typeforce.Number),
          witness: r.typeforce.maybe(r.typeforce.arrayOf(r.typeforce.Buffer))
        }),
        redeemVersion: r.typeforce.maybe(r.typeforce.Number)
      }, d);
      const b = s.value(() => (0, f.fromBech32)(d.address)), S = s.value(() => {
        if (!(!d.witness || !d.witness.length)) return d.witness.length >= 2 && d.witness[d.witness.length - 1][0] === p ? d.witness.slice(0, -1) : d.witness.slice();
      }), A = s.value(() => {
        if (d.scriptTree) return (0, o.toHashTree)(d.scriptTree);
        if (d.hash) return {
          hash: d.hash
        };
      }), O = d.network || t.bitcoin, E = {
        name: "p2tr",
        network: O
      };
      if (s.prop(E, "address", () => {
        if (!E.pubkey) return;
        const m = a.bech32m.toWords(E.pubkey);
        return m.unshift(c), a.bech32m.encode(O.bech32, m);
      }), s.prop(E, "hash", () => {
        const m = A();
        if (m) return m.hash;
        const k = S();
        if (k && k.length > 1) {
          const T = k[k.length - 1], R = T[0] & r.TAPLEAF_VERSION_MASK, M = k[k.length - 2], v = (0, o.tapleafHash)({
            output: M,
            version: R
          });
          return (0, o.rootHashFromPath)(T, v);
        }
        return null;
      }), s.prop(E, "output", () => {
        if (E.pubkey) return n.compile([
          u.OP_1,
          E.pubkey
        ]);
      }), s.prop(E, "redeemVersion", () => d.redeemVersion ? d.redeemVersion : d.redeem && d.redeem.redeemVersion !== void 0 && d.redeem.redeemVersion !== null ? d.redeem.redeemVersion : o.LEAF_VERSION_TAPSCRIPT), s.prop(E, "redeem", () => {
        const m = S();
        if (!(!m || m.length < 2)) return {
          output: m[m.length - 2],
          witness: m.slice(0, -2),
          redeemVersion: m[m.length - 1][0] & r.TAPLEAF_VERSION_MASK
        };
      }), s.prop(E, "pubkey", () => {
        if (d.pubkey) return d.pubkey;
        if (d.output) return d.output.slice(2);
        if (d.address) return b().data;
        if (E.internalPubkey) {
          const m = (0, o.tweakKey)(E.internalPubkey, E.hash);
          if (m) return m.x;
        }
      }), s.prop(E, "internalPubkey", () => {
        if (d.internalPubkey) return d.internalPubkey;
        const m = S();
        if (m && m.length > 1) return m[m.length - 1].slice(1, 33);
      }), s.prop(E, "signature", () => {
        if (d.signature) return d.signature;
        const m = S();
        if (!(!m || m.length !== 1)) return m[0];
      }), s.prop(E, "witness", () => {
        if (d.witness) return d.witness;
        const m = A();
        if (m && d.redeem && d.redeem.output && d.internalPubkey) {
          const k = (0, o.tapleafHash)({
            output: d.redeem.output,
            version: E.redeemVersion
          }), T = (0, o.findScriptPath)(m, k);
          if (!T) return;
          const R = (0, o.tweakKey)(d.internalPubkey, m.hash);
          if (!R) return;
          const M = e.Buffer.concat([
            e.Buffer.from([
              E.redeemVersion | R.parity
            ]),
            d.internalPubkey
          ].concat(T));
          return [
            d.redeem.output,
            M
          ];
        }
        if (d.signature) return [
          d.signature
        ];
      }), w.validate) {
        let m = e.Buffer.from([]);
        if (d.address) {
          if (O && O.bech32 !== b().prefix) throw new TypeError("Invalid prefix or Network mismatch");
          if (b().version !== c) throw new TypeError("Invalid address version");
          if (b().data.length !== 32) throw new TypeError("Invalid address data");
          m = b().data;
        }
        if (d.pubkey) {
          if (m.length > 0 && !m.equals(d.pubkey)) throw new TypeError("Pubkey mismatch");
          m = d.pubkey;
        }
        if (d.output) {
          if (d.output.length !== 34 || d.output[0] !== u.OP_1 || d.output[1] !== 32) throw new TypeError("Output is invalid");
          if (m.length > 0 && !m.equals(d.output.slice(2))) throw new TypeError("Pubkey mismatch");
          m = d.output.slice(2);
        }
        if (d.internalPubkey) {
          const R = (0, o.tweakKey)(d.internalPubkey, E.hash);
          if (m.length > 0 && !m.equals(R.x)) throw new TypeError("Pubkey mismatch");
          m = R.x;
        }
        if (m && m.length && !(0, i.getEccLib)().isXOnlyPoint(m)) throw new TypeError("Invalid pubkey for p2tr");
        const k = A();
        if (d.hash && k && !d.hash.equals(k.hash)) throw new TypeError("Hash mismatch");
        if (d.redeem && d.redeem.output && k) {
          const R = (0, o.tapleafHash)({
            output: d.redeem.output,
            version: E.redeemVersion
          });
          if (!(0, o.findScriptPath)(k, R)) throw new TypeError("Redeem script not in tree");
        }
        const T = S();
        if (d.redeem && E.redeem) {
          if (d.redeem.redeemVersion && d.redeem.redeemVersion !== E.redeem.redeemVersion) throw new TypeError("Redeem.redeemVersion and witness mismatch");
          if (d.redeem.output) {
            if (n.decompile(d.redeem.output).length === 0) throw new TypeError("Redeem.output is invalid");
            if (E.redeem.output && !d.redeem.output.equals(E.redeem.output)) throw new TypeError("Redeem.output and witness mismatch");
          }
          if (d.redeem.witness && E.redeem.witness && !(0, r.stacksEqual)(d.redeem.witness, E.redeem.witness)) throw new TypeError("Redeem.witness and witness mismatch");
        }
        if (T && T.length) if (T.length === 1) {
          if (d.signature && !d.signature.equals(T[0])) throw new TypeError("Signature mismatch");
        } else {
          const R = T[T.length - 1];
          if (R.length < 33) throw new TypeError(`The control-block length is too small. Got ${R.length}, expected min 33.`);
          if ((R.length - 33) % 32 !== 0) throw new TypeError(`The control-block length of ${R.length} is incorrect!`);
          const M = (R.length - 33) / 32;
          if (M > 128) throw new TypeError(`The script path is too long. Got ${M}, expected max 128.`);
          const v = R.slice(1, 33);
          if (d.internalPubkey && !d.internalPubkey.equals(v)) throw new TypeError("Internal pubkey mismatch");
          if (!(0, i.getEccLib)().isXOnlyPoint(v)) throw new TypeError("Invalid internalPubkey for p2tr witness");
          const H = R[0] & r.TAPLEAF_VERSION_MASK, D = T[T.length - 2], $ = (0, o.tapleafHash)({
            output: D,
            version: H
          }), N = (0, o.rootHashFromPath)(R, $), U = (0, o.tweakKey)(v, N);
          if (!U) throw new TypeError("Invalid outputKey for p2tr witness");
          if (m.length && !m.equals(U.x)) throw new TypeError("Pubkey mismatch for p2tr witness");
          if (U.parity !== (R[0] & 1)) throw new Error("Incorrect parity");
        }
      }
      return Object.assign(E, d);
    }
    return Oi.p2tr = y, Oi;
  }
  var $f;
  function lo() {
    return $f || ($f = 1, function(e) {
      Object.defineProperty(e, "__esModule", {
        value: true
      }), e.p2tr = e.p2wsh = e.p2wpkh = e.p2sh = e.p2pkh = e.p2pk = e.p2ms = e.embed = void 0;
      const t = Ts;
      Object.defineProperty(e, "embed", {
        enumerable: true,
        get: function() {
          return t.p2data;
        }
      });
      const n = ks;
      Object.defineProperty(e, "p2ms", {
        enumerable: true,
        get: function() {
          return n.p2ms;
        }
      });
      const r = Bs;
      Object.defineProperty(e, "p2pk", {
        enumerable: true,
        get: function() {
          return r.p2pk;
        }
      });
      const i = Ps;
      Object.defineProperty(e, "p2pkh", {
        enumerable: true,
        get: function() {
          return i.p2pkh;
        }
      });
      const o = Ns;
      Object.defineProperty(e, "p2sh", {
        enumerable: true,
        get: function() {
          return o.p2sh;
        }
      });
      const s = Cs;
      Object.defineProperty(e, "p2wpkh", {
        enumerable: true,
        get: function() {
          return s.p2wpkh;
        }
      });
      const a = Ls;
      Object.defineProperty(e, "p2wsh", {
        enumerable: true,
        get: function() {
          return a.p2wsh;
        }
      });
      const f = gg();
      Object.defineProperty(e, "p2tr", {
        enumerable: true,
        get: function() {
          return f.p2tr;
        }
      });
    }(ia)), ia;
  }
  var Vf;
  function Uc() {
    if (Vf) return Ye;
    Vf = 1, Object.defineProperty(Ye, "__esModule", {
      value: true
    }), Ye.toOutputScript = Ye.fromOutputScript = Ye.toBech32 = Ye.toBase58Check = Ye.fromBech32 = Ye.fromBase58Check = void 0;
    const e = Ce, t = lo(), n = ot(), r = ze, i = bn, o = Rs, s = 40, a = 2, f = 16, u = 2, c = 80, p = "WARNING: Sending to a future segwit version address can lead to loss of funds. End users MUST be warned carefully in the GUI and asked if they wish to proceed with caution. Wallets should verify the segwit version from the output of fromBech32, then decide when it is safe to use which version of segwit.";
    function y(E, m) {
      const k = E.slice(2);
      if (k.length < a || k.length > s) throw new TypeError("Invalid program length for segwit address");
      const T = E[0] - c;
      if (T < u || T > f) throw new TypeError("Invalid version for segwit address");
      if (E[1] !== k.length) throw new TypeError("Invalid script for segwit address");
      return console.warn(p), S(k, T, m.bech32);
    }
    function d(E) {
      const m = B.from(o.decode(E));
      if (m.length < 21) throw new TypeError(E + " is too short");
      if (m.length > 21) throw new TypeError(E + " is too long");
      const k = m.readUInt8(0), T = m.slice(1);
      return {
        version: k,
        hash: T
      };
    }
    Ye.fromBase58Check = d;
    function w(E) {
      let m, k;
      try {
        m = i.bech32.decode(E);
      } catch {
      }
      if (m) {
        if (k = m.words[0], k !== 0) throw new TypeError(E + " uses wrong encoding");
      } else if (m = i.bech32m.decode(E), k = m.words[0], k === 0) throw new TypeError(E + " uses wrong encoding");
      const T = i.bech32.fromWords(m.words.slice(1));
      return {
        version: k,
        prefix: m.prefix,
        data: B.from(T)
      };
    }
    Ye.fromBech32 = w;
    function b(E, m) {
      (0, r.typeforce)((0, r.tuple)(r.Hash160bit, r.UInt8), arguments);
      const k = B.allocUnsafe(21);
      return k.writeUInt8(m, 0), E.copy(k, 1), o.encode(k);
    }
    Ye.toBase58Check = b;
    function S(E, m, k) {
      const T = i.bech32.toWords(E);
      return T.unshift(m), m === 0 ? i.bech32.encode(k, T) : i.bech32m.encode(k, T);
    }
    Ye.toBech32 = S;
    function A(E, m) {
      m = m || e.bitcoin;
      try {
        return t.p2pkh({
          output: E,
          network: m
        }).address;
      } catch {
      }
      try {
        return t.p2sh({
          output: E,
          network: m
        }).address;
      } catch {
      }
      try {
        return t.p2wpkh({
          output: E,
          network: m
        }).address;
      } catch {
      }
      try {
        return t.p2wsh({
          output: E,
          network: m
        }).address;
      } catch {
      }
      try {
        return t.p2tr({
          output: E,
          network: m
        }).address;
      } catch {
      }
      try {
        return y(E, m);
      } catch {
      }
      throw new Error(n.toASM(E) + " has no matching Address");
    }
    Ye.fromOutputScript = A;
    function O(E, m) {
      m = m || e.bitcoin;
      let k, T;
      try {
        k = d(E);
      } catch {
      }
      if (k) {
        if (k.version === m.pubKeyHash) return t.p2pkh({
          hash: k.hash
        }).output;
        if (k.version === m.scriptHash) return t.p2sh({
          hash: k.hash
        }).output;
      } else {
        try {
          T = w(E);
        } catch {
        }
        if (T) {
          if (T.prefix !== m.bech32) throw new Error(E + " has an invalid prefix");
          if (T.version === 0) {
            if (T.data.length === 20) return t.p2wpkh({
              hash: T.data
            }).output;
            if (T.data.length === 32) return t.p2wsh({
              hash: T.data
            }).output;
          } else if (T.version === 1) {
            if (T.data.length === 32) return t.p2tr({
              pubkey: T.data
            }).output;
          } else if (T.version >= u && T.version <= f && T.data.length >= a && T.data.length <= s) return console.warn(p), n.compile([
            T.version + c,
            T.data
          ]);
        }
      }
      throw new Error(E + " has no matching Script");
    }
    return Ye.toOutputScript = O, Ye;
  }
  var Ms = {}, Ds = {};
  Object.defineProperty(Ds, "__esModule", {
    value: true
  });
  Ds.fastMerkleRoot = void 0;
  function wg(e, t) {
    if (!Array.isArray(e)) throw TypeError("Expected values Array");
    if (typeof t != "function") throw TypeError("Expected digest Function");
    let n = e.length;
    const r = e.concat();
    for (; n > 1; ) {
      let i = 0;
      for (let o = 0; o < n; o += 2, ++i) {
        const s = r[o], a = o + 1 === n ? s : r[o + 1], f = B.concat([
          s,
          a
        ]);
        r[i] = t(f);
      }
      n = i;
    }
    return r[0];
  }
  Ds.fastMerkleRoot = wg;
  var jn = {};
  Object.defineProperty(jn, "__esModule", {
    value: true
  });
  jn.Transaction = void 0;
  const Ae = He, Qe = Gt, zf = ot(), bg = ot(), oe = ze, { typeforce: Ct } = oe;
  function Dt(e) {
    const t = e.length;
    return Ae.varuint.encodingLength(t) + t;
  }
  function mg(e) {
    const t = e.length;
    return Ae.varuint.encodingLength(t) + e.reduce((n, r) => n + Dt(r), 0);
  }
  const Hn = B.allocUnsafe(0), ha = [], da = B.from("0000000000000000000000000000000000000000000000000000000000000000", "hex"), jf = B.from("0000000000000000000000000000000000000000000000000000000000000001", "hex"), _g = B.from("ffffffffffffffff", "hex"), Eg = {
    script: Hn,
    valueBuffer: _g
  };
  function Sg(e) {
    return e.value !== void 0;
  }
  class ne {
    constructor() {
      this.version = 1, this.locktime = 0, this.ins = [], this.outs = [];
    }
    static fromBuffer(t, n) {
      const r = new Ae.BufferReader(t), i = new ne();
      i.version = r.readInt32();
      const o = r.readUInt8(), s = r.readUInt8();
      let a = false;
      o === ne.ADVANCED_TRANSACTION_MARKER && s === ne.ADVANCED_TRANSACTION_FLAG ? a = true : r.offset -= 2;
      const f = r.readVarInt();
      for (let c = 0; c < f; ++c) i.ins.push({
        hash: r.readSlice(32),
        index: r.readUInt32(),
        script: r.readVarSlice(),
        sequence: r.readUInt32(),
        witness: ha
      });
      const u = r.readVarInt();
      for (let c = 0; c < u; ++c) i.outs.push({
        value: r.readUInt64(),
        script: r.readVarSlice()
      });
      if (a) {
        for (let c = 0; c < f; ++c) i.ins[c].witness = r.readVector();
        if (!i.hasWitnesses()) throw new Error("Transaction has superfluous witness data");
      }
      if (i.locktime = r.readUInt32(), n) return i;
      if (r.offset !== t.length) throw new Error("Transaction has unexpected data");
      return i;
    }
    static fromHex(t) {
      return ne.fromBuffer(B.from(t, "hex"), false);
    }
    static isCoinbaseHash(t) {
      Ct(oe.Hash256bit, t);
      for (let n = 0; n < 32; ++n) if (t[n] !== 0) return false;
      return true;
    }
    isCoinbase() {
      return this.ins.length === 1 && ne.isCoinbaseHash(this.ins[0].hash);
    }
    addInput(t, n, r, i) {
      return Ct(oe.tuple(oe.Hash256bit, oe.UInt32, oe.maybe(oe.UInt32), oe.maybe(oe.Buffer)), arguments), oe.Null(r) && (r = ne.DEFAULT_SEQUENCE), this.ins.push({
        hash: t,
        index: n,
        script: i || Hn,
        sequence: r,
        witness: ha
      }) - 1;
    }
    addOutput(t, n) {
      return Ct(oe.tuple(oe.Buffer, oe.Satoshi), arguments), this.outs.push({
        script: t,
        value: n
      }) - 1;
    }
    hasWitnesses() {
      return this.ins.some((t) => t.witness.length !== 0);
    }
    stripWitnesses() {
      this.ins.forEach((t) => {
        t.witness = ha;
      });
    }
    weight() {
      const t = this.byteLength(false), n = this.byteLength(true);
      return t * 3 + n;
    }
    virtualSize() {
      return Math.ceil(this.weight() / 4);
    }
    byteLength(t = true) {
      const n = t && this.hasWitnesses();
      return (n ? 10 : 8) + Ae.varuint.encodingLength(this.ins.length) + Ae.varuint.encodingLength(this.outs.length) + this.ins.reduce((r, i) => r + 40 + Dt(i.script), 0) + this.outs.reduce((r, i) => r + 8 + Dt(i.script), 0) + (n ? this.ins.reduce((r, i) => r + mg(i.witness), 0) : 0);
    }
    clone() {
      const t = new ne();
      return t.version = this.version, t.locktime = this.locktime, t.ins = this.ins.map((n) => ({
        hash: n.hash,
        index: n.index,
        script: n.script,
        sequence: n.sequence,
        witness: n.witness
      })), t.outs = this.outs.map((n) => ({
        script: n.script,
        value: n.value
      })), t;
    }
    hashForSignature(t, n, r) {
      if (Ct(oe.tuple(oe.UInt32, oe.Buffer, oe.Number), arguments), t >= this.ins.length) return jf;
      const i = zf.compile(zf.decompile(n).filter((a) => a !== bg.OPS.OP_CODESEPARATOR)), o = this.clone();
      if ((r & 31) === ne.SIGHASH_NONE) o.outs = [], o.ins.forEach((a, f) => {
        f !== t && (a.sequence = 0);
      });
      else if ((r & 31) === ne.SIGHASH_SINGLE) {
        if (t >= this.outs.length) return jf;
        o.outs.length = t + 1;
        for (let a = 0; a < t; a++) o.outs[a] = Eg;
        o.ins.forEach((a, f) => {
          f !== t && (a.sequence = 0);
        });
      }
      r & ne.SIGHASH_ANYONECANPAY ? (o.ins = [
        o.ins[t]
      ], o.ins[0].script = i) : (o.ins.forEach((a) => {
        a.script = Hn;
      }), o.ins[t].script = i);
      const s = B.allocUnsafe(o.byteLength(false) + 4);
      return s.writeInt32LE(r, s.length - 4), o.__toBuffer(s, 0, false), Qe.hash256(s);
    }
    hashForWitnessV1(t, n, r, i, o, s) {
      if (Ct(oe.tuple(oe.UInt32, Ct.arrayOf(oe.Buffer), Ct.arrayOf(oe.Satoshi), oe.UInt32), arguments), r.length !== this.ins.length || n.length !== this.ins.length) throw new Error("Must supply prevout script and value for all inputs");
      const a = i === ne.SIGHASH_DEFAULT ? ne.SIGHASH_ALL : i & ne.SIGHASH_OUTPUT_MASK, u = (i & ne.SIGHASH_INPUT_MASK) === ne.SIGHASH_ANYONECANPAY, c = a === ne.SIGHASH_NONE, p = a === ne.SIGHASH_SINGLE;
      let y = Hn, d = Hn, w = Hn, b = Hn, S = Hn;
      if (!u) {
        let m = Ae.BufferWriter.withCapacity(36 * this.ins.length);
        this.ins.forEach((k) => {
          m.writeSlice(k.hash), m.writeUInt32(k.index);
        }), y = Qe.sha256(m.end()), m = Ae.BufferWriter.withCapacity(8 * this.ins.length), r.forEach((k) => m.writeUInt64(k)), d = Qe.sha256(m.end()), m = Ae.BufferWriter.withCapacity(n.map(Dt).reduce((k, T) => k + T)), n.forEach((k) => m.writeVarSlice(k)), w = Qe.sha256(m.end()), m = Ae.BufferWriter.withCapacity(4 * this.ins.length), this.ins.forEach((k) => m.writeUInt32(k.sequence)), b = Qe.sha256(m.end());
      }
      if (c || p) {
        if (p && t < this.outs.length) {
          const m = this.outs[t], k = Ae.BufferWriter.withCapacity(8 + Dt(m.script));
          k.writeUInt64(m.value), k.writeVarSlice(m.script), S = Qe.sha256(k.end());
        }
      } else {
        const m = this.outs.map((T) => 8 + Dt(T.script)).reduce((T, R) => T + R), k = Ae.BufferWriter.withCapacity(m);
        this.outs.forEach((T) => {
          k.writeUInt64(T.value), k.writeVarSlice(T.script);
        }), S = Qe.sha256(k.end());
      }
      const A = (o ? 2 : 0) + (s ? 1 : 0), O = 174 - (u ? 49 : 0) - (c ? 32 : 0) + (s ? 32 : 0) + (o ? 37 : 0), E = Ae.BufferWriter.withCapacity(O);
      if (E.writeUInt8(i), E.writeInt32(this.version), E.writeUInt32(this.locktime), E.writeSlice(y), E.writeSlice(d), E.writeSlice(w), E.writeSlice(b), c || p || E.writeSlice(S), E.writeUInt8(A), u) {
        const m = this.ins[t];
        E.writeSlice(m.hash), E.writeUInt32(m.index), E.writeUInt64(r[t]), E.writeVarSlice(n[t]), E.writeUInt32(m.sequence);
      } else E.writeUInt32(t);
      if (s) {
        const m = Ae.BufferWriter.withCapacity(Dt(s));
        m.writeVarSlice(s), E.writeSlice(Qe.sha256(m.end()));
      }
      return p && E.writeSlice(S), o && (E.writeSlice(o), E.writeUInt8(0), E.writeUInt32(4294967295)), Qe.taggedHash("TapSighash", B.concat([
        B.from([
          0
        ]),
        E.end()
      ]));
    }
    hashForWitnessV0(t, n, r, i) {
      Ct(oe.tuple(oe.UInt32, oe.Buffer, oe.Satoshi, oe.UInt32), arguments);
      let o = B.from([]), s, a = da, f = da, u = da;
      if (i & ne.SIGHASH_ANYONECANPAY || (o = B.allocUnsafe(36 * this.ins.length), s = new Ae.BufferWriter(o, 0), this.ins.forEach((p) => {
        s.writeSlice(p.hash), s.writeUInt32(p.index);
      }), f = Qe.hash256(o)), !(i & ne.SIGHASH_ANYONECANPAY) && (i & 31) !== ne.SIGHASH_SINGLE && (i & 31) !== ne.SIGHASH_NONE && (o = B.allocUnsafe(4 * this.ins.length), s = new Ae.BufferWriter(o, 0), this.ins.forEach((p) => {
        s.writeUInt32(p.sequence);
      }), u = Qe.hash256(o)), (i & 31) !== ne.SIGHASH_SINGLE && (i & 31) !== ne.SIGHASH_NONE) {
        const p = this.outs.reduce((y, d) => y + 8 + Dt(d.script), 0);
        o = B.allocUnsafe(p), s = new Ae.BufferWriter(o, 0), this.outs.forEach((y) => {
          s.writeUInt64(y.value), s.writeVarSlice(y.script);
        }), a = Qe.hash256(o);
      } else if ((i & 31) === ne.SIGHASH_SINGLE && t < this.outs.length) {
        const p = this.outs[t];
        o = B.allocUnsafe(8 + Dt(p.script)), s = new Ae.BufferWriter(o, 0), s.writeUInt64(p.value), s.writeVarSlice(p.script), a = Qe.hash256(o);
      }
      o = B.allocUnsafe(156 + Dt(n)), s = new Ae.BufferWriter(o, 0);
      const c = this.ins[t];
      return s.writeInt32(this.version), s.writeSlice(f), s.writeSlice(u), s.writeSlice(c.hash), s.writeUInt32(c.index), s.writeVarSlice(n), s.writeUInt64(r), s.writeUInt32(c.sequence), s.writeSlice(a), s.writeUInt32(this.locktime), s.writeUInt32(i), Qe.hash256(o);
    }
    getHash(t) {
      return t && this.isCoinbase() ? B.alloc(32, 0) : Qe.hash256(this.__toBuffer(void 0, void 0, t));
    }
    getId() {
      return (0, Ae.reverseBuffer)(this.getHash(false)).toString("hex");
    }
    toBuffer(t, n) {
      return this.__toBuffer(t, n, true);
    }
    toHex() {
      return this.toBuffer(void 0, void 0).toString("hex");
    }
    setInputScript(t, n) {
      Ct(oe.tuple(oe.Number, oe.Buffer), arguments), this.ins[t].script = n;
    }
    setWitness(t, n) {
      Ct(oe.tuple(oe.Number, [
        oe.Buffer
      ]), arguments), this.ins[t].witness = n;
    }
    __toBuffer(t, n, r = false) {
      t || (t = B.allocUnsafe(this.byteLength(r)));
      const i = new Ae.BufferWriter(t, n || 0);
      i.writeInt32(this.version);
      const o = r && this.hasWitnesses();
      return o && (i.writeUInt8(ne.ADVANCED_TRANSACTION_MARKER), i.writeUInt8(ne.ADVANCED_TRANSACTION_FLAG)), i.writeVarInt(this.ins.length), this.ins.forEach((s) => {
        i.writeSlice(s.hash), i.writeUInt32(s.index), i.writeVarSlice(s.script), i.writeUInt32(s.sequence);
      }), i.writeVarInt(this.outs.length), this.outs.forEach((s) => {
        Sg(s) ? i.writeUInt64(s.value) : i.writeSlice(s.valueBuffer), i.writeVarSlice(s.script);
      }), o && this.ins.forEach((s) => {
        i.writeVector(s.witness);
      }), i.writeUInt32(this.locktime), n !== void 0 ? t.slice(n, i.offset) : t;
    }
  }
  jn.Transaction = ne;
  ne.DEFAULT_SEQUENCE = 4294967295;
  ne.SIGHASH_DEFAULT = 0;
  ne.SIGHASH_ALL = 1;
  ne.SIGHASH_NONE = 2;
  ne.SIGHASH_SINGLE = 3;
  ne.SIGHASH_ANYONECANPAY = 128;
  ne.SIGHASH_OUTPUT_MASK = 3;
  ne.SIGHASH_INPUT_MASK = 128;
  ne.ADVANCED_TRANSACTION_MARKER = 0;
  ne.ADVANCED_TRANSACTION_FLAG = 1;
  Object.defineProperty(Ms, "__esModule", {
    value: true
  });
  Ms.Block = void 0;
  const qn = He, pa = Gt, xg = Ds, vg = jn, Bh = ze, { typeforce: Ig } = Bh, ya = new TypeError("Cannot compute merkle root for zero transactions"), Wf = new TypeError("Cannot compute witness commit for non-segwit block");
  class Yn {
    constructor() {
      this.version = 1, this.prevHash = void 0, this.merkleRoot = void 0, this.timestamp = 0, this.witnessCommit = void 0, this.bits = 0, this.nonce = 0, this.transactions = void 0;
    }
    static fromBuffer(t) {
      if (t.length < 80) throw new Error("Buffer too small (< 80 bytes)");
      const n = new qn.BufferReader(t), r = new Yn();
      if (r.version = n.readInt32(), r.prevHash = n.readSlice(32), r.merkleRoot = n.readSlice(32), r.timestamp = n.readUInt32(), r.bits = n.readUInt32(), r.nonce = n.readUInt32(), t.length === 80) return r;
      const i = () => {
        const a = vg.Transaction.fromBuffer(n.buffer.slice(n.offset), true);
        return n.offset += a.byteLength(), a;
      }, o = n.readVarInt();
      r.transactions = [];
      for (let a = 0; a < o; ++a) {
        const f = i();
        r.transactions.push(f);
      }
      const s = r.getWitnessCommit();
      return s && (r.witnessCommit = s), r;
    }
    static fromHex(t) {
      return Yn.fromBuffer(B.from(t, "hex"));
    }
    static calculateTarget(t) {
      const n = ((t & 4278190080) >> 24) - 3, r = t & 8388607, i = B.alloc(32, 0);
      return i.writeUIntBE(r, 29 - n, 3), i;
    }
    static calculateMerkleRoot(t, n) {
      if (Ig([
        {
          getHash: Bh.Function
        }
      ], t), t.length === 0) throw ya;
      if (n && !Gf(t)) throw Wf;
      const r = t.map((o) => o.getHash(n)), i = (0, xg.fastMerkleRoot)(r, pa.hash256);
      return n ? pa.hash256(B.concat([
        i,
        t[0].ins[0].witness[0]
      ])) : i;
    }
    getWitnessCommit() {
      if (!Gf(this.transactions)) return null;
      const t = this.transactions[0].outs.filter((r) => r.script.slice(0, 6).equals(B.from("6a24aa21a9ed", "hex"))).map((r) => r.script.slice(6, 38));
      if (t.length === 0) return null;
      const n = t[t.length - 1];
      return n instanceof B && n.length === 32 ? n : null;
    }
    hasWitnessCommit() {
      return this.witnessCommit instanceof B && this.witnessCommit.length === 32 || this.getWitnessCommit() !== null;
    }
    hasWitness() {
      return Tg(this.transactions);
    }
    weight() {
      const t = this.byteLength(false, false), n = this.byteLength(false, true);
      return t * 3 + n;
    }
    byteLength(t, n = true) {
      return t || !this.transactions ? 80 : 80 + qn.varuint.encodingLength(this.transactions.length) + this.transactions.reduce((r, i) => r + i.byteLength(n), 0);
    }
    getHash() {
      return pa.hash256(this.toBuffer(true));
    }
    getId() {
      return (0, qn.reverseBuffer)(this.getHash()).toString("hex");
    }
    getUTCDate() {
      const t = /* @__PURE__ */ new Date(0);
      return t.setUTCSeconds(this.timestamp), t;
    }
    toBuffer(t) {
      const n = B.allocUnsafe(this.byteLength(t)), r = new qn.BufferWriter(n);
      return r.writeInt32(this.version), r.writeSlice(this.prevHash), r.writeSlice(this.merkleRoot), r.writeUInt32(this.timestamp), r.writeUInt32(this.bits), r.writeUInt32(this.nonce), t || !this.transactions || (qn.varuint.encode(this.transactions.length, n, r.offset), r.offset += qn.varuint.encode.bytes, this.transactions.forEach((i) => {
        const o = i.byteLength();
        i.toBuffer(n, r.offset), r.offset += o;
      })), n;
    }
    toHex(t) {
      return this.toBuffer(t).toString("hex");
    }
    checkTxRoots() {
      const t = this.hasWitnessCommit();
      return !t && this.hasWitness() ? false : this.__checkMerkleRoot() && (t ? this.__checkWitnessCommit() : true);
    }
    checkProofOfWork() {
      const t = (0, qn.reverseBuffer)(this.getHash()), n = Yn.calculateTarget(this.bits);
      return t.compare(n) <= 0;
    }
    __checkMerkleRoot() {
      if (!this.transactions) throw ya;
      const t = Yn.calculateMerkleRoot(this.transactions);
      return this.merkleRoot.compare(t) === 0;
    }
    __checkWitnessCommit() {
      if (!this.transactions) throw ya;
      if (!this.hasWitnessCommit()) throw Wf;
      const t = Yn.calculateMerkleRoot(this.transactions, true);
      return this.witnessCommit.compare(t) === 0;
    }
  }
  Ms.Block = Yn;
  function Gf(e) {
    return e instanceof Array && e[0] && e[0].ins && e[0].ins instanceof Array && e[0].ins[0] && e[0].ins[0].witness && e[0].ins[0].witness instanceof Array && e[0].ins[0].witness.length > 0;
  }
  function Tg(e) {
    return e instanceof Array && e.some((t) => typeof t == "object" && t.ins instanceof Array && t.ins.some((n) => typeof n == "object" && n.witness instanceof Array && n.witness.length > 0));
  }
  var Ks = {}, Rc = {}, Nc = {}, Cc = {}, ho = {}, Ir = {}, Le = {};
  (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: true
    }), function(t) {
      t[t.UNSIGNED_TX = 0] = "UNSIGNED_TX", t[t.GLOBAL_XPUB = 1] = "GLOBAL_XPUB";
    }(e.GlobalTypes || (e.GlobalTypes = {})), e.GLOBAL_TYPE_NAMES = [
      "unsignedTx",
      "globalXpub"
    ], function(t) {
      t[t.NON_WITNESS_UTXO = 0] = "NON_WITNESS_UTXO", t[t.WITNESS_UTXO = 1] = "WITNESS_UTXO", t[t.PARTIAL_SIG = 2] = "PARTIAL_SIG", t[t.SIGHASH_TYPE = 3] = "SIGHASH_TYPE", t[t.REDEEM_SCRIPT = 4] = "REDEEM_SCRIPT", t[t.WITNESS_SCRIPT = 5] = "WITNESS_SCRIPT", t[t.BIP32_DERIVATION = 6] = "BIP32_DERIVATION", t[t.FINAL_SCRIPTSIG = 7] = "FINAL_SCRIPTSIG", t[t.FINAL_SCRIPTWITNESS = 8] = "FINAL_SCRIPTWITNESS", t[t.POR_COMMITMENT = 9] = "POR_COMMITMENT", t[t.TAP_KEY_SIG = 19] = "TAP_KEY_SIG", t[t.TAP_SCRIPT_SIG = 20] = "TAP_SCRIPT_SIG", t[t.TAP_LEAF_SCRIPT = 21] = "TAP_LEAF_SCRIPT", t[t.TAP_BIP32_DERIVATION = 22] = "TAP_BIP32_DERIVATION", t[t.TAP_INTERNAL_KEY = 23] = "TAP_INTERNAL_KEY", t[t.TAP_MERKLE_ROOT = 24] = "TAP_MERKLE_ROOT";
    }(e.InputTypes || (e.InputTypes = {})), e.INPUT_TYPE_NAMES = [
      "nonWitnessUtxo",
      "witnessUtxo",
      "partialSig",
      "sighashType",
      "redeemScript",
      "witnessScript",
      "bip32Derivation",
      "finalScriptSig",
      "finalScriptWitness",
      "porCommitment",
      "tapKeySig",
      "tapScriptSig",
      "tapLeafScript",
      "tapBip32Derivation",
      "tapInternalKey",
      "tapMerkleRoot"
    ], function(t) {
      t[t.REDEEM_SCRIPT = 0] = "REDEEM_SCRIPT", t[t.WITNESS_SCRIPT = 1] = "WITNESS_SCRIPT", t[t.BIP32_DERIVATION = 2] = "BIP32_DERIVATION", t[t.TAP_INTERNAL_KEY = 5] = "TAP_INTERNAL_KEY", t[t.TAP_TREE = 6] = "TAP_TREE", t[t.TAP_BIP32_DERIVATION = 7] = "TAP_BIP32_DERIVATION";
    }(e.OutputTypes || (e.OutputTypes = {})), e.OUTPUT_TYPE_NAMES = [
      "redeemScript",
      "witnessScript",
      "bip32Derivation",
      "tapInternalKey",
      "tapTree",
      "tapBip32Derivation"
    ];
  })(Le);
  var Tr = {};
  Object.defineProperty(Tr, "__esModule", {
    value: true
  });
  const Ph = Le, Ag = (e) => [
    ...Array(e).keys()
  ];
  function kg(e) {
    if (e.key[0] !== Ph.GlobalTypes.GLOBAL_XPUB) throw new Error("Decode Error: could not decode globalXpub with key 0x" + e.key.toString("hex"));
    if (e.key.length !== 79 || ![
      2,
      3
    ].includes(e.key[46])) throw new Error("Decode Error: globalXpub has invalid extended pubkey in key 0x" + e.key.toString("hex"));
    if (e.value.length / 4 % 1 !== 0) throw new Error("Decode Error: Global GLOBAL_XPUB value length should be multiple of 4");
    const t = e.key.slice(1), n = {
      masterFingerprint: e.value.slice(0, 4),
      extendedPubkey: t,
      path: "m"
    };
    for (const r of Ag(e.value.length / 4 - 1)) {
      const i = e.value.readUInt32LE(r * 4 + 4), o = !!(i & 2147483648), s = i & 2147483647;
      n.path += "/" + s.toString(10) + (o ? "'" : "");
    }
    return n;
  }
  Tr.decode = kg;
  function Bg(e) {
    const t = B.from([
      Ph.GlobalTypes.GLOBAL_XPUB
    ]), n = B.concat([
      t,
      e.extendedPubkey
    ]), r = e.path.split("/"), i = B.allocUnsafe(r.length * 4);
    e.masterFingerprint.copy(i, 0);
    let o = 4;
    return r.slice(1).forEach((s) => {
      const a = s.slice(-1) === "'";
      let f = 2147483647 & parseInt(a ? s.slice(0, -1) : s, 10);
      a && (f += 2147483648), i.writeUInt32LE(f, o), o += 4;
    }), {
      key: n,
      value: i
    };
  }
  Tr.encode = Bg;
  Tr.expected = "{ masterFingerprint: Buffer; extendedPubkey: Buffer; path: string; }";
  function Pg(e) {
    const t = e.extendedPubkey, n = e.masterFingerprint, r = e.path;
    return B.isBuffer(t) && t.length === 78 && [
      2,
      3
    ].indexOf(t[45]) > -1 && B.isBuffer(n) && n.length === 4 && typeof r == "string" && !!r.match(/^m(\/\d+'?)*$/);
  }
  Tr.check = Pg;
  function Og(e, t, n) {
    const r = t.extendedPubkey.toString("hex");
    return n.has(r) ? false : (n.add(r), e.filter((i) => i.extendedPubkey.equals(t.extendedPubkey)).length === 0);
  }
  Tr.canAddToArray = Og;
  var Lc = {};
  Object.defineProperty(Lc, "__esModule", {
    value: true
  });
  const Hg = Le;
  function Ug(e) {
    return {
      key: B.from([
        Hg.GlobalTypes.UNSIGNED_TX
      ]),
      value: e.toBuffer()
    };
  }
  Lc.encode = Ug;
  var Ar = {};
  Object.defineProperty(Ar, "__esModule", {
    value: true
  });
  const Oh = Le;
  function Rg(e) {
    if (e.key[0] !== Oh.InputTypes.FINAL_SCRIPTSIG) throw new Error("Decode Error: could not decode finalScriptSig with key 0x" + e.key.toString("hex"));
    return e.value;
  }
  Ar.decode = Rg;
  function Ng(e) {
    return {
      key: B.from([
        Oh.InputTypes.FINAL_SCRIPTSIG
      ]),
      value: e
    };
  }
  Ar.encode = Ng;
  Ar.expected = "Buffer";
  function Cg(e) {
    return B.isBuffer(e);
  }
  Ar.check = Cg;
  function Lg(e, t) {
    return !!e && !!t && e.finalScriptSig === void 0;
  }
  Ar.canAdd = Lg;
  var kr = {};
  Object.defineProperty(kr, "__esModule", {
    value: true
  });
  const Hh = Le;
  function Fg(e) {
    if (e.key[0] !== Hh.InputTypes.FINAL_SCRIPTWITNESS) throw new Error("Decode Error: could not decode finalScriptWitness with key 0x" + e.key.toString("hex"));
    return e.value;
  }
  kr.decode = Fg;
  function Mg(e) {
    return {
      key: B.from([
        Hh.InputTypes.FINAL_SCRIPTWITNESS
      ]),
      value: e
    };
  }
  kr.encode = Mg;
  kr.expected = "Buffer";
  function Dg(e) {
    return B.isBuffer(e);
  }
  kr.check = Dg;
  function Kg(e, t) {
    return !!e && !!t && e.finalScriptWitness === void 0;
  }
  kr.canAdd = Kg;
  var Br = {};
  Object.defineProperty(Br, "__esModule", {
    value: true
  });
  const Uh = Le;
  function $g(e) {
    if (e.key[0] !== Uh.InputTypes.NON_WITNESS_UTXO) throw new Error("Decode Error: could not decode nonWitnessUtxo with key 0x" + e.key.toString("hex"));
    return e.value;
  }
  Br.decode = $g;
  function Vg(e) {
    return {
      key: B.from([
        Uh.InputTypes.NON_WITNESS_UTXO
      ]),
      value: e
    };
  }
  Br.encode = Vg;
  Br.expected = "Buffer";
  function zg(e) {
    return B.isBuffer(e);
  }
  Br.check = zg;
  function jg(e, t) {
    return !!e && !!t && e.nonWitnessUtxo === void 0;
  }
  Br.canAdd = jg;
  var Pr = {};
  Object.defineProperty(Pr, "__esModule", {
    value: true
  });
  const Rh = Le;
  function Wg(e) {
    if (e.key[0] !== Rh.InputTypes.PARTIAL_SIG) throw new Error("Decode Error: could not decode partialSig with key 0x" + e.key.toString("hex"));
    if (!(e.key.length === 34 || e.key.length === 66) || ![
      2,
      3,
      4
    ].includes(e.key[1])) throw new Error("Decode Error: partialSig has invalid pubkey in key 0x" + e.key.toString("hex"));
    return {
      pubkey: e.key.slice(1),
      signature: e.value
    };
  }
  Pr.decode = Wg;
  function Gg(e) {
    const t = B.from([
      Rh.InputTypes.PARTIAL_SIG
    ]);
    return {
      key: B.concat([
        t,
        e.pubkey
      ]),
      value: e.signature
    };
  }
  Pr.encode = Gg;
  Pr.expected = "{ pubkey: Buffer; signature: Buffer; }";
  function Xg(e) {
    return B.isBuffer(e.pubkey) && B.isBuffer(e.signature) && [
      33,
      65
    ].includes(e.pubkey.length) && [
      2,
      3,
      4
    ].includes(e.pubkey[0]) && qg(e.signature);
  }
  Pr.check = Xg;
  function qg(e) {
    if (!B.isBuffer(e) || e.length < 9 || e[0] !== 48 || e.length !== e[1] + 3 || e[2] !== 2) return false;
    const t = e[3];
    if (t > 33 || t < 1 || e[3 + t + 1] !== 2) return false;
    const n = e[3 + t + 2];
    return !(n > 33 || n < 1 || e.length !== 3 + t + 2 + n + 2);
  }
  function Zg(e, t, n) {
    const r = t.pubkey.toString("hex");
    return n.has(r) ? false : (n.add(r), e.filter((i) => i.pubkey.equals(t.pubkey)).length === 0);
  }
  Pr.canAddToArray = Zg;
  var Or = {};
  Object.defineProperty(Or, "__esModule", {
    value: true
  });
  const Nh = Le;
  function Yg(e) {
    if (e.key[0] !== Nh.InputTypes.POR_COMMITMENT) throw new Error("Decode Error: could not decode porCommitment with key 0x" + e.key.toString("hex"));
    return e.value.toString("utf8");
  }
  Or.decode = Yg;
  function Jg(e) {
    return {
      key: B.from([
        Nh.InputTypes.POR_COMMITMENT
      ]),
      value: B.from(e, "utf8")
    };
  }
  Or.encode = Jg;
  Or.expected = "string";
  function Qg(e) {
    return typeof e == "string";
  }
  Or.check = Qg;
  function ew(e, t) {
    return !!e && !!t && e.porCommitment === void 0;
  }
  Or.canAdd = ew;
  var Hr = {};
  Object.defineProperty(Hr, "__esModule", {
    value: true
  });
  const Ch = Le;
  function tw(e) {
    if (e.key[0] !== Ch.InputTypes.SIGHASH_TYPE) throw new Error("Decode Error: could not decode sighashType with key 0x" + e.key.toString("hex"));
    return e.value.readUInt32LE(0);
  }
  Hr.decode = tw;
  function nw(e) {
    const t = B.from([
      Ch.InputTypes.SIGHASH_TYPE
    ]), n = B.allocUnsafe(4);
    return n.writeUInt32LE(e, 0), {
      key: t,
      value: n
    };
  }
  Hr.encode = nw;
  Hr.expected = "number";
  function rw(e) {
    return typeof e == "number";
  }
  Hr.check = rw;
  function iw(e, t) {
    return !!e && !!t && e.sighashType === void 0;
  }
  Hr.canAdd = iw;
  var Ur = {};
  Object.defineProperty(Ur, "__esModule", {
    value: true
  });
  const Lh = Le;
  function ow(e) {
    if (e.key[0] !== Lh.InputTypes.TAP_KEY_SIG || e.key.length !== 1) throw new Error("Decode Error: could not decode tapKeySig with key 0x" + e.key.toString("hex"));
    if (!Fh(e.value)) throw new Error("Decode Error: tapKeySig not a valid 64-65-byte BIP340 signature");
    return e.value;
  }
  Ur.decode = ow;
  function sw(e) {
    return {
      key: B.from([
        Lh.InputTypes.TAP_KEY_SIG
      ]),
      value: e
    };
  }
  Ur.encode = sw;
  Ur.expected = "Buffer";
  function Fh(e) {
    return B.isBuffer(e) && (e.length === 64 || e.length === 65);
  }
  Ur.check = Fh;
  function aw(e, t) {
    return !!e && !!t && e.tapKeySig === void 0;
  }
  Ur.canAdd = aw;
  var Rr = {};
  Object.defineProperty(Rr, "__esModule", {
    value: true
  });
  const Mh = Le;
  function cw(e) {
    if (e.key[0] !== Mh.InputTypes.TAP_LEAF_SCRIPT) throw new Error("Decode Error: could not decode tapLeafScript with key 0x" + e.key.toString("hex"));
    if ((e.key.length - 2) % 32 !== 0) throw new Error("Decode Error: tapLeafScript has invalid control block in key 0x" + e.key.toString("hex"));
    const t = e.value[e.value.length - 1];
    if ((e.key[1] & 254) !== t) throw new Error("Decode Error: tapLeafScript bad leaf version in key 0x" + e.key.toString("hex"));
    const n = e.value.slice(0, -1);
    return {
      controlBlock: e.key.slice(1),
      script: n,
      leafVersion: t
    };
  }
  Rr.decode = cw;
  function fw(e) {
    const t = B.from([
      Mh.InputTypes.TAP_LEAF_SCRIPT
    ]), n = B.from([
      e.leafVersion
    ]);
    return {
      key: B.concat([
        t,
        e.controlBlock
      ]),
      value: B.concat([
        e.script,
        n
      ])
    };
  }
  Rr.encode = fw;
  Rr.expected = "{ controlBlock: Buffer; leafVersion: number, script: Buffer; }";
  function uw(e) {
    return B.isBuffer(e.controlBlock) && (e.controlBlock.length - 1) % 32 === 0 && (e.controlBlock[0] & 254) === e.leafVersion && B.isBuffer(e.script);
  }
  Rr.check = uw;
  function lw(e, t, n) {
    const r = t.controlBlock.toString("hex");
    return n.has(r) ? false : (n.add(r), e.filter((i) => i.controlBlock.equals(t.controlBlock)).length === 0);
  }
  Rr.canAddToArray = lw;
  var Nr = {};
  Object.defineProperty(Nr, "__esModule", {
    value: true
  });
  const Dh = Le;
  function hw(e) {
    if (e.key[0] !== Dh.InputTypes.TAP_MERKLE_ROOT || e.key.length !== 1) throw new Error("Decode Error: could not decode tapMerkleRoot with key 0x" + e.key.toString("hex"));
    if (!Kh(e.value)) throw new Error("Decode Error: tapMerkleRoot not a 32-byte hash");
    return e.value;
  }
  Nr.decode = hw;
  function dw(e) {
    return {
      key: B.from([
        Dh.InputTypes.TAP_MERKLE_ROOT
      ]),
      value: e
    };
  }
  Nr.encode = dw;
  Nr.expected = "Buffer";
  function Kh(e) {
    return B.isBuffer(e) && e.length === 32;
  }
  Nr.check = Kh;
  function pw(e, t) {
    return !!e && !!t && e.tapMerkleRoot === void 0;
  }
  Nr.canAdd = pw;
  var Cr = {};
  Object.defineProperty(Cr, "__esModule", {
    value: true
  });
  const $h = Le;
  function yw(e) {
    if (e.key[0] !== $h.InputTypes.TAP_SCRIPT_SIG) throw new Error("Decode Error: could not decode tapScriptSig with key 0x" + e.key.toString("hex"));
    if (e.key.length !== 65) throw new Error("Decode Error: tapScriptSig has invalid key 0x" + e.key.toString("hex"));
    if (e.value.length !== 64 && e.value.length !== 65) throw new Error("Decode Error: tapScriptSig has invalid signature in key 0x" + e.key.toString("hex"));
    const t = e.key.slice(1, 33), n = e.key.slice(33);
    return {
      pubkey: t,
      leafHash: n,
      signature: e.value
    };
  }
  Cr.decode = yw;
  function gw(e) {
    const t = B.from([
      $h.InputTypes.TAP_SCRIPT_SIG
    ]);
    return {
      key: B.concat([
        t,
        e.pubkey,
        e.leafHash
      ]),
      value: e.signature
    };
  }
  Cr.encode = gw;
  Cr.expected = "{ pubkey: Buffer; leafHash: Buffer; signature: Buffer; }";
  function ww(e) {
    return B.isBuffer(e.pubkey) && B.isBuffer(e.leafHash) && B.isBuffer(e.signature) && e.pubkey.length === 32 && e.leafHash.length === 32 && (e.signature.length === 64 || e.signature.length === 65);
  }
  Cr.check = ww;
  function bw(e, t, n) {
    const r = t.pubkey.toString("hex") + t.leafHash.toString("hex");
    return n.has(r) ? false : (n.add(r), e.filter((i) => i.pubkey.equals(t.pubkey) && i.leafHash.equals(t.leafHash)).length === 0);
  }
  Cr.canAddToArray = bw;
  var Lr = {}, Xt = {}, Ot = {};
  Object.defineProperty(Ot, "__esModule", {
    value: true
  });
  const mw = 9007199254740991;
  function Fc(e) {
    if (e < 0 || e > mw || e % 1 !== 0) throw new RangeError("value out of range");
  }
  function Fi(e, t, n) {
    if (Fc(e), t || (t = B.allocUnsafe(Vh(e))), !B.isBuffer(t)) throw new TypeError("buffer must be a Buffer instance");
    return n || (n = 0), e < 253 ? (t.writeUInt8(e, n), Object.assign(Fi, {
      bytes: 1
    })) : e <= 65535 ? (t.writeUInt8(253, n), t.writeUInt16LE(e, n + 1), Object.assign(Fi, {
      bytes: 3
    })) : e <= 4294967295 ? (t.writeUInt8(254, n), t.writeUInt32LE(e, n + 1), Object.assign(Fi, {
      bytes: 5
    })) : (t.writeUInt8(255, n), t.writeUInt32LE(e >>> 0, n + 1), t.writeUInt32LE(e / 4294967296 | 0, n + 5), Object.assign(Fi, {
      bytes: 9
    })), t;
  }
  Ot.encode = Fi;
  function Mi(e, t) {
    if (!B.isBuffer(e)) throw new TypeError("buffer must be a Buffer instance");
    t || (t = 0);
    const n = e.readUInt8(t);
    if (n < 253) return Object.assign(Mi, {
      bytes: 1
    }), n;
    if (n === 253) return Object.assign(Mi, {
      bytes: 3
    }), e.readUInt16LE(t + 1);
    if (n === 254) return Object.assign(Mi, {
      bytes: 5
    }), e.readUInt32LE(t + 1);
    {
      Object.assign(Mi, {
        bytes: 9
      });
      const r = e.readUInt32LE(t + 1), o = e.readUInt32LE(t + 5) * 4294967296 + r;
      return Fc(o), o;
    }
  }
  Ot.decode = Mi;
  function Vh(e) {
    return Fc(e), e < 253 ? 1 : e <= 65535 ? 3 : e <= 4294967295 ? 5 : 9;
  }
  Ot.encodingLength = Vh;
  Object.defineProperty(Xt, "__esModule", {
    value: true
  });
  const Ro = Ot;
  Xt.range = (e) => [
    ...Array(e).keys()
  ];
  function _w(e) {
    if (e.length < 1) return e;
    let t = e.length - 1, n = 0;
    for (let r = 0; r < e.length / 2; r++) n = e[r], e[r] = e[t], e[t] = n, t--;
    return e;
  }
  Xt.reverseBuffer = _w;
  function Ew(e) {
    const t = e.map(zh);
    return t.push(B.from([
      0
    ])), B.concat(t);
  }
  Xt.keyValsToBuffer = Ew;
  function zh(e) {
    const t = e.key.length, n = e.value.length, r = Ro.encodingLength(t), i = Ro.encodingLength(n), o = B.allocUnsafe(r + t + i + n);
    return Ro.encode(t, o, 0), e.key.copy(o, r), Ro.encode(n, o, r + t), e.value.copy(o, r + t + i), o;
  }
  Xt.keyValToBuffer = zh;
  function jh(e, t) {
    if (typeof e != "number") throw new Error("cannot write a non-number as a number");
    if (e < 0) throw new Error("specified a negative value for writing an unsigned value");
    if (e > t) throw new Error("RangeError: value out of range");
    if (Math.floor(e) !== e) throw new Error("value has a fractional component");
  }
  function Sw(e, t) {
    const n = e.readUInt32LE(t);
    let r = e.readUInt32LE(t + 4);
    return r *= 4294967296, jh(r + n, 9007199254740991), r + n;
  }
  Xt.readUInt64LE = Sw;
  function xw(e, t, n) {
    return jh(t, 9007199254740991), e.writeInt32LE(t & -1, n), e.writeUInt32LE(Math.floor(t / 4294967296), n + 4), n + 8;
  }
  Xt.writeUInt64LE = xw;
  Object.defineProperty(Lr, "__esModule", {
    value: true
  });
  const Wh = Le, Gh = Xt, ss = Ot;
  function vw(e) {
    if (e.key[0] !== Wh.InputTypes.WITNESS_UTXO) throw new Error("Decode Error: could not decode witnessUtxo with key 0x" + e.key.toString("hex"));
    const t = Gh.readUInt64LE(e.value, 0);
    let n = 8;
    const r = ss.decode(e.value, n);
    n += ss.encodingLength(r);
    const i = e.value.slice(n);
    if (i.length !== r) throw new Error("Decode Error: WITNESS_UTXO script is not proper length");
    return {
      script: i,
      value: t
    };
  }
  Lr.decode = vw;
  function Iw(e) {
    const { script: t, value: n } = e, r = ss.encodingLength(t.length), i = B.allocUnsafe(8 + r + t.length);
    return Gh.writeUInt64LE(i, n, 0), ss.encode(t.length, i, 8), t.copy(i, 8 + r), {
      key: B.from([
        Wh.InputTypes.WITNESS_UTXO
      ]),
      value: i
    };
  }
  Lr.encode = Iw;
  Lr.expected = "{ script: Buffer; value: number; }";
  function Tw(e) {
    return B.isBuffer(e.script) && typeof e.value == "number";
  }
  Lr.check = Tw;
  function Aw(e, t) {
    return !!e && !!t && e.witnessUtxo === void 0;
  }
  Lr.canAdd = Aw;
  var Fr = {};
  Object.defineProperty(Fr, "__esModule", {
    value: true
  });
  const Xh = Le, Ya = Ot;
  function kw(e) {
    if (e.key[0] !== Xh.OutputTypes.TAP_TREE || e.key.length !== 1) throw new Error("Decode Error: could not decode tapTree with key 0x" + e.key.toString("hex"));
    let t = 0;
    const n = [];
    for (; t < e.value.length; ) {
      const r = e.value[t++], i = e.value[t++], o = Ya.decode(e.value, t);
      t += Ya.encodingLength(o), n.push({
        depth: r,
        leafVersion: i,
        script: e.value.slice(t, t + o)
      }), t += o;
    }
    return {
      leaves: n
    };
  }
  Fr.decode = kw;
  function Bw(e) {
    const t = B.from([
      Xh.OutputTypes.TAP_TREE
    ]), n = [].concat(...e.leaves.map((r) => [
      B.of(r.depth, r.leafVersion),
      Ya.encode(r.script.length),
      r.script
    ]));
    return {
      key: t,
      value: B.concat(n)
    };
  }
  Fr.encode = Bw;
  Fr.expected = "{ leaves: [{ depth: number; leafVersion: number, script: Buffer; }] }";
  function Pw(e) {
    return Array.isArray(e.leaves) && e.leaves.every((t) => t.depth >= 0 && t.depth <= 128 && (t.leafVersion & 254) === t.leafVersion && B.isBuffer(t.script));
  }
  Fr.check = Pw;
  function Ow(e, t) {
    return !!e && !!t && e.tapTree === void 0;
  }
  Fr.canAdd = Ow;
  var $s = {};
  Object.defineProperty($s, "__esModule", {
    value: true
  });
  const Hw = (e) => [
    ...Array(e).keys()
  ], Uw = (e) => e.length === 33 && [
    2,
    3
  ].includes(e[0]) || e.length === 65 && e[0] === 4;
  function Rw(e, t = Uw) {
    function n(a) {
      if (a.key[0] !== e) throw new Error("Decode Error: could not decode bip32Derivation with key 0x" + a.key.toString("hex"));
      const f = a.key.slice(1);
      if (!t(f)) throw new Error("Decode Error: bip32Derivation has invalid pubkey in key 0x" + a.key.toString("hex"));
      if (a.value.length / 4 % 1 !== 0) throw new Error("Decode Error: Input BIP32_DERIVATION value length should be multiple of 4");
      const u = {
        masterFingerprint: a.value.slice(0, 4),
        pubkey: f,
        path: "m"
      };
      for (const c of Hw(a.value.length / 4 - 1)) {
        const p = a.value.readUInt32LE(c * 4 + 4), y = !!(p & 2147483648), d = p & 2147483647;
        u.path += "/" + d.toString(10) + (y ? "'" : "");
      }
      return u;
    }
    function r(a) {
      const f = B.from([
        e
      ]), u = B.concat([
        f,
        a.pubkey
      ]), c = a.path.split("/"), p = B.allocUnsafe(c.length * 4);
      a.masterFingerprint.copy(p, 0);
      let y = 4;
      return c.slice(1).forEach((d) => {
        const w = d.slice(-1) === "'";
        let b = 2147483647 & parseInt(w ? d.slice(0, -1) : d, 10);
        w && (b += 2147483648), p.writeUInt32LE(b, y), y += 4;
      }), {
        key: u,
        value: p
      };
    }
    const i = "{ masterFingerprint: Buffer; pubkey: Buffer; path: string; }";
    function o(a) {
      return B.isBuffer(a.pubkey) && B.isBuffer(a.masterFingerprint) && typeof a.path == "string" && t(a.pubkey) && a.masterFingerprint.length === 4;
    }
    function s(a, f, u) {
      const c = f.pubkey.toString("hex");
      return u.has(c) ? false : (u.add(c), a.filter((p) => p.pubkey.equals(f.pubkey)).length === 0);
    }
    return {
      decode: n,
      encode: r,
      check: o,
      expected: i,
      canAddToArray: s
    };
  }
  $s.makeConverter = Rw;
  var Mc = {};
  Object.defineProperty(Mc, "__esModule", {
    value: true
  });
  function Nw(e) {
    return t;
    function t(n) {
      let r;
      if (e.includes(n.key[0]) && (r = n.key.slice(1), !(r.length === 33 || r.length === 65) || ![
        2,
        3,
        4
      ].includes(r[0]))) throw new Error("Format Error: invalid pubkey in key 0x" + n.key.toString("hex"));
      return r;
    }
  }
  Mc.makeChecker = Nw;
  var Dc = {};
  Object.defineProperty(Dc, "__esModule", {
    value: true
  });
  function Cw(e) {
    function t(s) {
      if (s.key[0] !== e) throw new Error("Decode Error: could not decode redeemScript with key 0x" + s.key.toString("hex"));
      return s.value;
    }
    function n(s) {
      return {
        key: B.from([
          e
        ]),
        value: s
      };
    }
    const r = "Buffer";
    function i(s) {
      return B.isBuffer(s);
    }
    function o(s, a) {
      return !!s && !!a && s.redeemScript === void 0;
    }
    return {
      decode: t,
      encode: n,
      check: i,
      expected: r,
      canAdd: o
    };
  }
  Dc.makeConverter = Cw;
  var Kc = {};
  Object.defineProperty(Kc, "__esModule", {
    value: true
  });
  const No = Ot, Lw = $s, Fw = (e) => e.length === 32;
  function Mw(e) {
    const t = Lw.makeConverter(e, Fw);
    function n(s) {
      const a = No.decode(s.value), f = No.encodingLength(a), u = t.decode({
        key: s.key,
        value: s.value.slice(f + a * 32)
      }), c = new Array(a);
      for (let p = 0, y = f; p < a; p++, y += 32) c[p] = s.value.slice(y, y + 32);
      return Object.assign({}, u, {
        leafHashes: c
      });
    }
    function r(s) {
      const a = t.encode(s), f = No.encodingLength(s.leafHashes.length), u = B.allocUnsafe(f);
      No.encode(s.leafHashes.length, u);
      const c = B.concat([
        u,
        ...s.leafHashes,
        a.value
      ]);
      return Object.assign({}, a, {
        value: c
      });
    }
    const i = "{ masterFingerprint: Buffer; pubkey: Buffer; path: string; leafHashes: Buffer[]; }";
    function o(s) {
      return Array.isArray(s.leafHashes) && s.leafHashes.every((a) => B.isBuffer(a) && a.length === 32) && t.check(s);
    }
    return {
      decode: n,
      encode: r,
      check: o,
      expected: i,
      canAddToArray: t.canAddToArray
    };
  }
  Kc.makeConverter = Mw;
  var $c = {};
  Object.defineProperty($c, "__esModule", {
    value: true
  });
  function Dw(e) {
    function t(s) {
      if (s.key[0] !== e || s.key.length !== 1) throw new Error("Decode Error: could not decode tapInternalKey with key 0x" + s.key.toString("hex"));
      if (s.value.length !== 32) throw new Error("Decode Error: tapInternalKey not a 32-byte x-only pubkey");
      return s.value;
    }
    function n(s) {
      return {
        key: B.from([
          e
        ]),
        value: s
      };
    }
    const r = "Buffer";
    function i(s) {
      return B.isBuffer(s) && s.length === 32;
    }
    function o(s, a) {
      return !!s && !!a && s.tapInternalKey === void 0;
    }
    return {
      decode: t,
      encode: n,
      check: i,
      expected: r,
      canAdd: o
    };
  }
  $c.makeConverter = Dw;
  var Vc = {};
  Object.defineProperty(Vc, "__esModule", {
    value: true
  });
  function Kw(e) {
    function t(s) {
      if (s.key[0] !== e) throw new Error("Decode Error: could not decode witnessScript with key 0x" + s.key.toString("hex"));
      return s.value;
    }
    function n(s) {
      return {
        key: B.from([
          e
        ]),
        value: s
      };
    }
    const r = "Buffer";
    function i(s) {
      return B.isBuffer(s);
    }
    function o(s, a) {
      return !!s && !!a && s.witnessScript === void 0;
    }
    return {
      decode: t,
      encode: n,
      check: i,
      expected: r,
      canAdd: o
    };
  }
  Vc.makeConverter = Kw;
  Object.defineProperty(Ir, "__esModule", {
    value: true
  });
  const lt = Le, $w = Tr, Vw = Lc, zw = Ar, jw = kr, Ww = Br, Gw = Pr, Xw = Or, qw = Hr, Zw = Ur, Yw = Rr, Jw = Nr, Qw = Cr, e1 = Lr, t1 = Fr, qh = $s, zc = Mc, Zh = Dc, Yh = Kc, Jh = $c, Qh = Vc, n1 = {
    unsignedTx: Vw,
    globalXpub: $w,
    checkPubkey: zc.makeChecker([])
  };
  Ir.globals = n1;
  const r1 = {
    nonWitnessUtxo: Ww,
    partialSig: Gw,
    sighashType: qw,
    finalScriptSig: zw,
    finalScriptWitness: jw,
    porCommitment: Xw,
    witnessUtxo: e1,
    bip32Derivation: qh.makeConverter(lt.InputTypes.BIP32_DERIVATION),
    redeemScript: Zh.makeConverter(lt.InputTypes.REDEEM_SCRIPT),
    witnessScript: Qh.makeConverter(lt.InputTypes.WITNESS_SCRIPT),
    checkPubkey: zc.makeChecker([
      lt.InputTypes.PARTIAL_SIG,
      lt.InputTypes.BIP32_DERIVATION
    ]),
    tapKeySig: Zw,
    tapScriptSig: Qw,
    tapLeafScript: Yw,
    tapBip32Derivation: Yh.makeConverter(lt.InputTypes.TAP_BIP32_DERIVATION),
    tapInternalKey: Jh.makeConverter(lt.InputTypes.TAP_INTERNAL_KEY),
    tapMerkleRoot: Jw
  };
  Ir.inputs = r1;
  const i1 = {
    bip32Derivation: qh.makeConverter(lt.OutputTypes.BIP32_DERIVATION),
    redeemScript: Zh.makeConverter(lt.OutputTypes.REDEEM_SCRIPT),
    witnessScript: Qh.makeConverter(lt.OutputTypes.WITNESS_SCRIPT),
    checkPubkey: zc.makeChecker([
      lt.OutputTypes.BIP32_DERIVATION
    ]),
    tapBip32Derivation: Yh.makeConverter(lt.OutputTypes.TAP_BIP32_DERIVATION),
    tapTree: t1,
    tapInternalKey: Jh.makeConverter(lt.OutputTypes.TAP_INTERNAL_KEY)
  };
  Ir.outputs = i1;
  Object.defineProperty(ho, "__esModule", {
    value: true
  });
  const we = Ir, as = Xt, Xf = Ot, Q = Le;
  function o1(e, t) {
    let n = 0;
    function r() {
      const S = Xf.decode(e, n);
      n += Xf.encodingLength(S);
      const A = e.slice(n, n + S);
      return n += S, A;
    }
    function i() {
      const S = e.readUInt32BE(n);
      return n += 4, S;
    }
    function o() {
      const S = e.readUInt8(n);
      return n += 1, S;
    }
    function s() {
      const S = r(), A = r();
      return {
        key: S,
        value: A
      };
    }
    function a() {
      if (n >= e.length) throw new Error("Format Error: Unexpected End of PSBT");
      const S = e.readUInt8(n) === 0;
      return S && n++, S;
    }
    if (i() !== 1886610036) throw new Error("Format Error: Invalid Magic Number");
    if (o() !== 255) throw new Error("Format Error: Magic Number must be followed by 0xff separator");
    const f = [], u = {};
    for (; !a(); ) {
      const S = s(), A = S.key.toString("hex");
      if (u[A]) throw new Error("Format Error: Keys must be unique for global keymap: key " + A);
      u[A] = 1, f.push(S);
    }
    const c = f.filter((S) => S.key[0] === Q.GlobalTypes.UNSIGNED_TX);
    if (c.length !== 1) throw new Error("Format Error: Only one UNSIGNED_TX allowed");
    const p = t(c[0].value), { inputCount: y, outputCount: d } = p.getInputOutputCounts(), w = [], b = [];
    for (const S of as.range(y)) {
      const A = {}, O = [];
      for (; !a(); ) {
        const E = s(), m = E.key.toString("hex");
        if (A[m]) throw new Error("Format Error: Keys must be unique for each input: input index " + S + " key " + m);
        A[m] = 1, O.push(E);
      }
      w.push(O);
    }
    for (const S of as.range(d)) {
      const A = {}, O = [];
      for (; !a(); ) {
        const E = s(), m = E.key.toString("hex");
        if (A[m]) throw new Error("Format Error: Keys must be unique for each output: output index " + S + " key " + m);
        A[m] = 1, O.push(E);
      }
      b.push(O);
    }
    return ed(p, {
      globalMapKeyVals: f,
      inputKeyVals: w,
      outputKeyVals: b
    });
  }
  ho.psbtFromBuffer = o1;
  function De(e, t, n) {
    if (!t.equals(B.from([
      n
    ]))) throw new Error(`Format Error: Invalid ${e} key: ${t.toString("hex")}`);
  }
  ho.checkKeyBuffer = De;
  function ed(e, { globalMapKeyVals: t, inputKeyVals: n, outputKeyVals: r }) {
    const i = {
      unsignedTx: e
    };
    let o = 0;
    for (const c of t) switch (c.key[0]) {
      case Q.GlobalTypes.UNSIGNED_TX:
        if (De("global", c.key, Q.GlobalTypes.UNSIGNED_TX), o > 0) throw new Error("Format Error: GlobalMap has multiple UNSIGNED_TX");
        o++;
        break;
      case Q.GlobalTypes.GLOBAL_XPUB:
        i.globalXpub === void 0 && (i.globalXpub = []), i.globalXpub.push(we.globals.globalXpub.decode(c));
        break;
      default:
        i.unknownKeyVals || (i.unknownKeyVals = []), i.unknownKeyVals.push(c);
    }
    const s = n.length, a = r.length, f = [], u = [];
    for (const c of as.range(s)) {
      const p = {};
      for (const y of n[c]) switch (we.inputs.checkPubkey(y), y.key[0]) {
        case Q.InputTypes.NON_WITNESS_UTXO:
          if (De("input", y.key, Q.InputTypes.NON_WITNESS_UTXO), p.nonWitnessUtxo !== void 0) throw new Error("Format Error: Input has multiple NON_WITNESS_UTXO");
          p.nonWitnessUtxo = we.inputs.nonWitnessUtxo.decode(y);
          break;
        case Q.InputTypes.WITNESS_UTXO:
          if (De("input", y.key, Q.InputTypes.WITNESS_UTXO), p.witnessUtxo !== void 0) throw new Error("Format Error: Input has multiple WITNESS_UTXO");
          p.witnessUtxo = we.inputs.witnessUtxo.decode(y);
          break;
        case Q.InputTypes.PARTIAL_SIG:
          p.partialSig === void 0 && (p.partialSig = []), p.partialSig.push(we.inputs.partialSig.decode(y));
          break;
        case Q.InputTypes.SIGHASH_TYPE:
          if (De("input", y.key, Q.InputTypes.SIGHASH_TYPE), p.sighashType !== void 0) throw new Error("Format Error: Input has multiple SIGHASH_TYPE");
          p.sighashType = we.inputs.sighashType.decode(y);
          break;
        case Q.InputTypes.REDEEM_SCRIPT:
          if (De("input", y.key, Q.InputTypes.REDEEM_SCRIPT), p.redeemScript !== void 0) throw new Error("Format Error: Input has multiple REDEEM_SCRIPT");
          p.redeemScript = we.inputs.redeemScript.decode(y);
          break;
        case Q.InputTypes.WITNESS_SCRIPT:
          if (De("input", y.key, Q.InputTypes.WITNESS_SCRIPT), p.witnessScript !== void 0) throw new Error("Format Error: Input has multiple WITNESS_SCRIPT");
          p.witnessScript = we.inputs.witnessScript.decode(y);
          break;
        case Q.InputTypes.BIP32_DERIVATION:
          p.bip32Derivation === void 0 && (p.bip32Derivation = []), p.bip32Derivation.push(we.inputs.bip32Derivation.decode(y));
          break;
        case Q.InputTypes.FINAL_SCRIPTSIG:
          De("input", y.key, Q.InputTypes.FINAL_SCRIPTSIG), p.finalScriptSig = we.inputs.finalScriptSig.decode(y);
          break;
        case Q.InputTypes.FINAL_SCRIPTWITNESS:
          De("input", y.key, Q.InputTypes.FINAL_SCRIPTWITNESS), p.finalScriptWitness = we.inputs.finalScriptWitness.decode(y);
          break;
        case Q.InputTypes.POR_COMMITMENT:
          De("input", y.key, Q.InputTypes.POR_COMMITMENT), p.porCommitment = we.inputs.porCommitment.decode(y);
          break;
        case Q.InputTypes.TAP_KEY_SIG:
          De("input", y.key, Q.InputTypes.TAP_KEY_SIG), p.tapKeySig = we.inputs.tapKeySig.decode(y);
          break;
        case Q.InputTypes.TAP_SCRIPT_SIG:
          p.tapScriptSig === void 0 && (p.tapScriptSig = []), p.tapScriptSig.push(we.inputs.tapScriptSig.decode(y));
          break;
        case Q.InputTypes.TAP_LEAF_SCRIPT:
          p.tapLeafScript === void 0 && (p.tapLeafScript = []), p.tapLeafScript.push(we.inputs.tapLeafScript.decode(y));
          break;
        case Q.InputTypes.TAP_BIP32_DERIVATION:
          p.tapBip32Derivation === void 0 && (p.tapBip32Derivation = []), p.tapBip32Derivation.push(we.inputs.tapBip32Derivation.decode(y));
          break;
        case Q.InputTypes.TAP_INTERNAL_KEY:
          De("input", y.key, Q.InputTypes.TAP_INTERNAL_KEY), p.tapInternalKey = we.inputs.tapInternalKey.decode(y);
          break;
        case Q.InputTypes.TAP_MERKLE_ROOT:
          De("input", y.key, Q.InputTypes.TAP_MERKLE_ROOT), p.tapMerkleRoot = we.inputs.tapMerkleRoot.decode(y);
          break;
        default:
          p.unknownKeyVals || (p.unknownKeyVals = []), p.unknownKeyVals.push(y);
      }
      f.push(p);
    }
    for (const c of as.range(a)) {
      const p = {};
      for (const y of r[c]) switch (we.outputs.checkPubkey(y), y.key[0]) {
        case Q.OutputTypes.REDEEM_SCRIPT:
          if (De("output", y.key, Q.OutputTypes.REDEEM_SCRIPT), p.redeemScript !== void 0) throw new Error("Format Error: Output has multiple REDEEM_SCRIPT");
          p.redeemScript = we.outputs.redeemScript.decode(y);
          break;
        case Q.OutputTypes.WITNESS_SCRIPT:
          if (De("output", y.key, Q.OutputTypes.WITNESS_SCRIPT), p.witnessScript !== void 0) throw new Error("Format Error: Output has multiple WITNESS_SCRIPT");
          p.witnessScript = we.outputs.witnessScript.decode(y);
          break;
        case Q.OutputTypes.BIP32_DERIVATION:
          p.bip32Derivation === void 0 && (p.bip32Derivation = []), p.bip32Derivation.push(we.outputs.bip32Derivation.decode(y));
          break;
        case Q.OutputTypes.TAP_INTERNAL_KEY:
          De("output", y.key, Q.OutputTypes.TAP_INTERNAL_KEY), p.tapInternalKey = we.outputs.tapInternalKey.decode(y);
          break;
        case Q.OutputTypes.TAP_TREE:
          De("output", y.key, Q.OutputTypes.TAP_TREE), p.tapTree = we.outputs.tapTree.decode(y);
          break;
        case Q.OutputTypes.TAP_BIP32_DERIVATION:
          p.tapBip32Derivation === void 0 && (p.tapBip32Derivation = []), p.tapBip32Derivation.push(we.outputs.tapBip32Derivation.decode(y));
          break;
        default:
          p.unknownKeyVals || (p.unknownKeyVals = []), p.unknownKeyVals.push(y);
      }
      u.push(p);
    }
    return {
      globalMap: i,
      inputs: f,
      outputs: u
    };
  }
  ho.psbtFromKeyVals = ed;
  var Vs = {};
  Object.defineProperty(Vs, "__esModule", {
    value: true
  });
  const ga = Ir, qf = Xt;
  function s1({ globalMap: e, inputs: t, outputs: n }) {
    const { globalKeyVals: r, inputKeyVals: i, outputKeyVals: o } = td({
      globalMap: e,
      inputs: t,
      outputs: n
    }), s = qf.keyValsToBuffer(r), a = (p) => p.length === 0 ? [
      B.from([
        0
      ])
    ] : p.map(qf.keyValsToBuffer), f = a(i), u = a(o), c = B.allocUnsafe(5);
    return c.writeUIntBE(482972169471, 0, 5), B.concat([
      c,
      s
    ].concat(f, u));
  }
  Vs.psbtToBuffer = s1;
  const a1 = (e, t) => e.key.compare(t.key);
  function wa(e, t) {
    const n = /* @__PURE__ */ new Set(), r = Object.entries(e).reduce((o, [s, a]) => {
      if (s === "unknownKeyVals") return o;
      const f = t[s];
      if (f === void 0) return o;
      const u = (Array.isArray(a) ? a : [
        a
      ]).map(f.encode);
      return u.map((p) => p.key.toString("hex")).forEach((p) => {
        if (n.has(p)) throw new Error("Serialize Error: Duplicate key: " + p);
        n.add(p);
      }), o.concat(u);
    }, []), i = e.unknownKeyVals ? e.unknownKeyVals.filter((o) => !n.has(o.key.toString("hex"))) : [];
    return r.concat(i).sort(a1);
  }
  function td({ globalMap: e, inputs: t, outputs: n }) {
    return {
      globalKeyVals: wa(e, ga.globals),
      inputKeyVals: t.map((r) => wa(r, ga.inputs)),
      outputKeyVals: n.map((r) => wa(r, ga.outputs))
    };
  }
  Vs.psbtToKeyVals = td;
  (function(e) {
    function t(n) {
      for (var r in n) e.hasOwnProperty(r) || (e[r] = n[r]);
    }
    Object.defineProperty(e, "__esModule", {
      value: true
    }), t(ho), t(Vs);
  })(Cc);
  Object.defineProperty(Nc, "__esModule", {
    value: true
  });
  const ba = Cc;
  function c1(e) {
    const t = e[0], n = ba.psbtToKeyVals(t), r = e.slice(1);
    if (r.length === 0) throw new Error("Combine: Nothing to combine");
    const i = Zf(t);
    if (i === void 0) throw new Error("Combine: Self missing transaction");
    const o = Gr(n.globalKeyVals), s = n.inputKeyVals.map(Gr), a = n.outputKeyVals.map(Gr);
    for (const f of r) {
      const u = Zf(f);
      if (u === void 0 || !u.toBuffer().equals(i.toBuffer())) throw new Error("Combine: One of the Psbts does not have the same transaction.");
      const c = ba.psbtToKeyVals(f);
      Gr(c.globalKeyVals).forEach(ma(o, n.globalKeyVals, c.globalKeyVals)), c.inputKeyVals.map(Gr).forEach((w, b) => w.forEach(ma(s[b], n.inputKeyVals[b], c.inputKeyVals[b]))), c.outputKeyVals.map(Gr).forEach((w, b) => w.forEach(ma(a[b], n.outputKeyVals[b], c.outputKeyVals[b])));
    }
    return ba.psbtFromKeyVals(i, {
      globalMapKeyVals: n.globalKeyVals,
      inputKeyVals: n.inputKeyVals,
      outputKeyVals: n.outputKeyVals
    });
  }
  Nc.combine = c1;
  function ma(e, t, n) {
    return (r) => {
      if (e.has(r)) return;
      const i = n.filter((o) => o.key.toString("hex") === r)[0];
      t.push(i), e.add(r);
    };
  }
  function Zf(e) {
    return e.globalMap.unsignedTx;
  }
  function Gr(e) {
    const t = /* @__PURE__ */ new Set();
    return e.forEach((n) => {
      const r = n.key.toString("hex");
      if (t.has(r)) throw new Error("Combine: KeyValue Map keys should be unique");
      t.add(r);
    }), t;
  }
  var jc = {};
  (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: true
    });
    const t = Ir;
    function n(d, w) {
      const b = d[w];
      if (b === void 0) throw new Error(`No input #${w}`);
      return b;
    }
    e.checkForInput = n;
    function r(d, w) {
      const b = d[w];
      if (b === void 0) throw new Error(`No output #${w}`);
      return b;
    }
    e.checkForOutput = r;
    function i(d, w, b) {
      if (d.key[0] < b) throw new Error("Use the method for your specific key instead of addUnknownKeyVal*");
      if (w && w.filter((S) => S.key.equals(d.key)).length !== 0) throw new Error(`Duplicate Key: ${d.key.toString("hex")}`);
    }
    e.checkHasKey = i;
    function o(d) {
      let w = 0;
      return Object.keys(d).forEach((b) => {
        Number(isNaN(Number(b))) && w++;
      }), w;
    }
    e.getEnumLength = o;
    function s(d, w) {
      let b = false;
      if (w.nonWitnessUtxo || w.witnessUtxo) {
        const S = !!w.redeemScript, A = !!w.witnessScript, O = !S || !!w.finalScriptSig, E = !A || !!w.finalScriptWitness, m = !!w.finalScriptSig || !!w.finalScriptWitness;
        b = O && E && m;
      }
      if (b === false) throw new Error(`Input #${d} has too much or too little data to clean`);
    }
    e.inputCheckUncleanFinalized = s;
    function a(d, w, b, S) {
      throw new Error(`Data for ${d} key ${w} is incorrect: Expected ${b} and got ${JSON.stringify(S)}`);
    }
    function f(d) {
      return (w, b) => {
        for (const S of Object.keys(w)) {
          const A = w[S], { canAdd: O, canAddToArray: E, check: m, expected: k } = t[d + "s"][S] || {}, T = !!E;
          if (m) if (T) {
            if (!Array.isArray(A) || b[S] && !Array.isArray(b[S])) throw new Error(`Key type ${S} must be an array`);
            A.every(m) || a(d, S, k, A);
            const R = b[S] || [], M = /* @__PURE__ */ new Set();
            if (!A.every((v) => E(R, v, M))) throw new Error("Can not add duplicate data to array");
            b[S] = R.concat(A);
          } else {
            if (m(A) || a(d, S, k, A), !O(b, A)) throw new Error(`Can not add duplicate data to ${d}`);
            b[S] = A;
          }
        }
      };
    }
    e.updateGlobal = f("global"), e.updateInput = f("input"), e.updateOutput = f("output");
    function u(d, w) {
      const b = d.length - 1, S = n(d, b);
      e.updateInput(w, S);
    }
    e.addInputAttributes = u;
    function c(d, w) {
      const b = d.length - 1, S = r(d, b);
      e.updateOutput(w, S);
    }
    e.addOutputAttributes = c;
    function p(d, w) {
      if (!B.isBuffer(w) || w.length < 4) throw new Error("Set Version: Invalid Transaction");
      return w.writeUInt32LE(d, 0), w;
    }
    e.defaultVersionSetter = p;
    function y(d, w) {
      if (!B.isBuffer(w) || w.length < 4) throw new Error("Set Locktime: Invalid Transaction");
      return w.writeUInt32LE(d, w.length - 4), w;
    }
    e.defaultLocktimeSetter = y;
  })(jc);
  Object.defineProperty(Rc, "__esModule", {
    value: true
  });
  const f1 = Nc, Yf = Cc, _a = Le, Me = jc;
  let u1 = class {
    constructor(t) {
      this.inputs = [], this.outputs = [], this.globalMap = {
        unsignedTx: t
      };
    }
    static fromBase64(t, n) {
      const r = B.from(t, "base64");
      return this.fromBuffer(r, n);
    }
    static fromHex(t, n) {
      const r = B.from(t, "hex");
      return this.fromBuffer(r, n);
    }
    static fromBuffer(t, n) {
      const r = Yf.psbtFromBuffer(t, n), i = new this(r.globalMap.unsignedTx);
      return Object.assign(i, r), i;
    }
    toBase64() {
      return this.toBuffer().toString("base64");
    }
    toHex() {
      return this.toBuffer().toString("hex");
    }
    toBuffer() {
      return Yf.psbtToBuffer(this);
    }
    updateGlobal(t) {
      return Me.updateGlobal(t, this.globalMap), this;
    }
    updateInput(t, n) {
      const r = Me.checkForInput(this.inputs, t);
      return Me.updateInput(n, r), this;
    }
    updateOutput(t, n) {
      const r = Me.checkForOutput(this.outputs, t);
      return Me.updateOutput(n, r), this;
    }
    addUnknownKeyValToGlobal(t) {
      return Me.checkHasKey(t, this.globalMap.unknownKeyVals, Me.getEnumLength(_a.GlobalTypes)), this.globalMap.unknownKeyVals || (this.globalMap.unknownKeyVals = []), this.globalMap.unknownKeyVals.push(t), this;
    }
    addUnknownKeyValToInput(t, n) {
      const r = Me.checkForInput(this.inputs, t);
      return Me.checkHasKey(n, r.unknownKeyVals, Me.getEnumLength(_a.InputTypes)), r.unknownKeyVals || (r.unknownKeyVals = []), r.unknownKeyVals.push(n), this;
    }
    addUnknownKeyValToOutput(t, n) {
      const r = Me.checkForOutput(this.outputs, t);
      return Me.checkHasKey(n, r.unknownKeyVals, Me.getEnumLength(_a.OutputTypes)), r.unknownKeyVals || (r.unknownKeyVals = []), r.unknownKeyVals.push(n), this;
    }
    addInput(t) {
      this.globalMap.unsignedTx.addInput(t), this.inputs.push({
        unknownKeyVals: []
      });
      const n = t.unknownKeyVals || [], r = this.inputs.length - 1;
      if (!Array.isArray(n)) throw new Error("unknownKeyVals must be an Array");
      return n.forEach((i) => this.addUnknownKeyValToInput(r, i)), Me.addInputAttributes(this.inputs, t), this;
    }
    addOutput(t) {
      this.globalMap.unsignedTx.addOutput(t), this.outputs.push({
        unknownKeyVals: []
      });
      const n = t.unknownKeyVals || [], r = this.outputs.length - 1;
      if (!Array.isArray(n)) throw new Error("unknownKeyVals must be an Array");
      return n.forEach((i) => this.addUnknownKeyValToOutput(r, i)), Me.addOutputAttributes(this.outputs, t), this;
    }
    clearFinalizedInput(t) {
      const n = Me.checkForInput(this.inputs, t);
      Me.inputCheckUncleanFinalized(t, n);
      for (const r of Object.keys(n)) [
        "witnessUtxo",
        "nonWitnessUtxo",
        "finalScriptSig",
        "finalScriptWitness",
        "unknownKeyVals"
      ].includes(r) || delete n[r];
      return this;
    }
    combine(...t) {
      const n = f1.combine([
        this
      ].concat(t));
      return Object.assign(this, n), this;
    }
    getTransaction() {
      return this.globalMap.unsignedTx.toBuffer();
    }
  };
  Rc.Psbt = u1;
  var Ee = {}, le = {};
  Object.defineProperty(le, "__esModule", {
    value: true
  });
  le.signatureBlocksAction = le.checkInputForSig = le.pubkeyInScript = le.pubkeyPositionInScript = le.witnessStackToScriptWitness = le.isP2TR = le.isP2SHScript = le.isP2WSHScript = le.isP2WPKH = le.isP2PKH = le.isP2PK = le.isP2MS = void 0;
  const Jf = Ot, Vi = ot(), Co = jn, l1 = Gt, Mr = lo();
  function Dr(e) {
    return (t) => {
      try {
        return e({
          output: t
        }), true;
      } catch {
        return false;
      }
    };
  }
  le.isP2MS = Dr(Mr.p2ms);
  le.isP2PK = Dr(Mr.p2pk);
  le.isP2PKH = Dr(Mr.p2pkh);
  le.isP2WPKH = Dr(Mr.p2wpkh);
  le.isP2WSHScript = Dr(Mr.p2wsh);
  le.isP2SHScript = Dr(Mr.p2sh);
  le.isP2TR = Dr(Mr.p2tr);
  function h1(e) {
    let t = B.allocUnsafe(0);
    function n(s) {
      t = B.concat([
        t,
        B.from(s)
      ]);
    }
    function r(s) {
      const a = t.length, f = Jf.encodingLength(s);
      t = B.concat([
        t,
        B.allocUnsafe(f)
      ]), Jf.encode(s, t, a);
    }
    function i(s) {
      r(s.length), n(s);
    }
    function o(s) {
      r(s.length), s.forEach(i);
    }
    return o(e), t;
  }
  le.witnessStackToScriptWitness = h1;
  function nd(e, t) {
    const n = (0, l1.hash160)(e), r = e.slice(1, 33), i = Vi.decompile(t);
    if (i === null) throw new Error("Unknown script error");
    return i.findIndex((o) => typeof o == "number" ? false : o.equals(e) || o.equals(n) || o.equals(r));
  }
  le.pubkeyPositionInScript = nd;
  function d1(e, t) {
    return nd(e, t) !== -1;
  }
  le.pubkeyInScript = d1;
  function p1(e, t) {
    return y1(e).some((r) => rd(r, Vi.signature.decode, t));
  }
  le.checkInputForSig = p1;
  function rd(e, t, n) {
    const { hashType: r } = t(e), i = [];
    switch (r & Co.Transaction.SIGHASH_ANYONECANPAY && i.push("addInput"), r & 31) {
      case Co.Transaction.SIGHASH_ALL:
        break;
      case Co.Transaction.SIGHASH_SINGLE:
      case Co.Transaction.SIGHASH_NONE:
        i.push("addOutput"), i.push("setInputSequence");
        break;
    }
    return i.indexOf(n) === -1;
  }
  le.signatureBlocksAction = rd;
  function y1(e) {
    let t = [];
    if ((e.partialSig || []).length === 0) {
      if (!e.finalScriptSig && !e.finalScriptWitness) return [];
      t = g1(e);
    } else t = e.partialSig;
    return t.map((n) => n.signature);
  }
  function g1(e) {
    const t = e.finalScriptSig ? Vi.decompile(e.finalScriptSig) || [] : [], n = e.finalScriptWitness ? Vi.decompile(e.finalScriptWitness) || [] : [];
    return t.concat(n).filter((r) => B.isBuffer(r) && Vi.isCanonicalScriptSignature(r)).map((r) => ({
      signature: r
    }));
  }
  Object.defineProperty(Ee, "__esModule", {
    value: true
  });
  Ee.checkTaprootInputForSigs = Ee.tapTreeFromList = Ee.tapTreeToList = Ee.tweakInternalPubKey = Ee.checkTaprootOutputFields = Ee.checkTaprootInputFields = Ee.isTaprootOutput = Ee.isTaprootInput = Ee.serializeTaprootSignature = Ee.tapScriptFinalizer = Ee.toXOnly = void 0;
  const Wc = ze, w1 = jn, zs = le, Vn = Fs, b1 = lo(), m1 = le, _1 = (e) => e.length === 32 ? e : e.slice(1, 33);
  Ee.toXOnly = _1;
  function E1(e, t, n) {
    const r = M1(t, e, n);
    try {
      const o = L1(t, r).concat(r.script).concat(r.controlBlock);
      return {
        finalScriptWitness: (0, zs.witnessStackToScriptWitness)(o)
      };
    } catch (i) {
      throw new Error(`Can not finalize taproot input #${e}: ${i}`);
    }
  }
  Ee.tapScriptFinalizer = E1;
  function S1(e, t) {
    const n = t ? B.from([
      t
    ]) : B.from([]);
    return B.concat([
      e,
      n
    ]);
  }
  Ee.serializeTaprootSignature = S1;
  function es(e) {
    return e && !!(e.tapInternalKey || e.tapMerkleRoot || e.tapLeafScript && e.tapLeafScript.length || e.tapBip32Derivation && e.tapBip32Derivation.length || e.witnessUtxo && (0, zs.isP2TR)(e.witnessUtxo.script));
  }
  Ee.isTaprootInput = es;
  function ts(e, t) {
    return e && !!(e.tapInternalKey || e.tapTree || e.tapBip32Derivation && e.tapBip32Derivation.length || t && (0, zs.isP2TR)(t));
  }
  Ee.isTaprootOutput = ts;
  function x1(e, t, n) {
    R1(e, t, n), C1(e, t, n);
  }
  Ee.checkTaprootInputFields = x1;
  function v1(e, t, n) {
    N1(e, t, n), I1(e, t);
  }
  Ee.checkTaprootOutputFields = v1;
  function I1(e, t) {
    if (!t.tapTree && !t.tapInternalKey) return;
    const n = t.tapInternalKey || e.tapInternalKey, r = t.tapTree || e.tapTree;
    if (n) {
      const { script: i } = e, o = T1(n, r);
      if (i && !i.equals(o)) throw new Error("Error adding output. Script or address missmatch.");
    }
  }
  function T1(e, t) {
    const n = t && id(t.leaves), { output: r } = (0, b1.p2tr)({
      internalPubkey: e,
      scriptTree: n
    });
    return r;
  }
  function A1(e, t) {
    const n = t.tapInternalKey, r = n && (0, Vn.tweakKey)(n, t.tapMerkleRoot);
    if (!r) throw new Error(`Cannot tweak tap internal key for input #${e}. Public key: ${n && n.toString("hex")}`);
    return r.x;
  }
  Ee.tweakInternalPubKey = A1;
  function k1(e) {
    if (!(0, Wc.isTaptree)(e)) throw new Error("Cannot convert taptree to tapleaf list. Expecting a tapree structure.");
    return Ja(e);
  }
  Ee.tapTreeToList = k1;
  function id(e = []) {
    return e.length === 1 && e[0].depth === 0 ? {
      output: e[0].script,
      version: e[0].leafVersion
    } : U1(e);
  }
  Ee.tapTreeFromList = id;
  function B1(e, t) {
    return O1(e).some((r) => (0, m1.signatureBlocksAction)(r, P1, t));
  }
  Ee.checkTaprootInputForSigs = B1;
  function P1(e) {
    return {
      signature: e.slice(0, 64),
      hashType: e.slice(64)[0] || w1.Transaction.SIGHASH_DEFAULT
    };
  }
  function O1(e) {
    const t = [];
    if (e.tapKeySig && t.push(e.tapKeySig), e.tapScriptSig && t.push(...e.tapScriptSig.map((n) => n.signature)), !t.length) {
      const n = H1(e.finalScriptWitness);
      n && t.push(n);
    }
    return t;
  }
  function H1(e) {
    if (!e) return;
    const t = e.slice(2);
    if (t.length === 64 || t.length === 65) return t;
  }
  function Ja(e, t = [], n = 0) {
    if (n > Vn.MAX_TAPTREE_DEPTH) throw new Error("Max taptree depth exceeded.");
    return e ? (0, Wc.isTapleaf)(e) ? (t.push({
      depth: n,
      leafVersion: e.version || Vn.LEAF_VERSION_TAPSCRIPT,
      script: e.output
    }), t) : (e[0] && Ja(e[0], t, n + 1), e[1] && Ja(e[1], t, n + 1), t) : [];
  }
  function U1(e) {
    let t;
    for (const n of e) if (t = Qa(n, t), !t) throw new Error("No room left to insert tapleaf in tree");
    return t;
  }
  function Qa(e, t, n = 0) {
    if (n > Vn.MAX_TAPTREE_DEPTH) throw new Error("Max taptree depth exceeded.");
    if (e.depth === n) return t ? void 0 : {
      output: e.script,
      version: e.leafVersion
    };
    if ((0, Wc.isTapleaf)(t)) return;
    const r = Qa(e, t && t[0], n + 1);
    if (r) return [
      r,
      t && t[1]
    ];
    const i = Qa(e, t && t[1], n + 1);
    if (i) return [
      t && t[0],
      i
    ];
  }
  function R1(e, t, n) {
    const r = es(e) && ci(t), i = ci(e) && es(t), o = e === t && es(t) && ci(t);
    if (r || i || o) throw new Error(`Invalid arguments for Psbt.${n}. Cannot use both taproot and non-taproot fields.`);
  }
  function N1(e, t, n) {
    const r = ts(e) && ci(t), i = ci(e) && ts(t), o = e === t && ts(t) && ci(t);
    if (r || i || o) throw new Error(`Invalid arguments for Psbt.${n}. Cannot use both taproot and non-taproot fields.`);
  }
  function C1(e, t, n) {
    if (t.tapMerkleRoot) {
      const r = (t.tapLeafScript || []).every((o) => Ea(o, t.tapMerkleRoot)), i = (e.tapLeafScript || []).every((o) => Ea(o, t.tapMerkleRoot));
      if (!r || !i) throw new Error(`Invalid arguments for Psbt.${n}. Tapleaf not part of taptree.`);
    } else if (e.tapMerkleRoot && !(t.tapLeafScript || []).every((i) => Ea(i, e.tapMerkleRoot))) throw new Error(`Invalid arguments for Psbt.${n}. Tapleaf not part of taptree.`);
  }
  function Ea(e, t) {
    if (!t) return true;
    const n = (0, Vn.tapleafHash)({
      output: e.script,
      version: e.leafVersion
    });
    return (0, Vn.rootHashFromPath)(e.controlBlock, n).equals(t);
  }
  function L1(e, t) {
    const n = (0, Vn.tapleafHash)({
      output: t.script,
      version: t.leafVersion
    });
    return (e.tapScriptSig || []).filter((r) => r.leafHash.equals(n)).map((r) => F1(t.script, r)).sort((r, i) => i.positionInScript - r.positionInScript).map((r) => r.signature);
  }
  function F1(e, t) {
    return Object.assign({
      positionInScript: (0, zs.pubkeyPositionInScript)(t.pubkey, e)
    }, t);
  }
  function M1(e, t, n) {
    if (!e.tapScriptSig || !e.tapScriptSig.length) throw new Error(`Can not finalize taproot input #${t}. No tapleaf script signature provided.`);
    const r = (e.tapLeafScript || []).sort((i, o) => i.controlBlock.length - o.controlBlock.length).find((i) => D1(i, e.tapScriptSig, n));
    if (!r) throw new Error(`Can not finalize taproot input #${t}. Signature for tapleaf script not found.`);
    return r;
  }
  function D1(e, t, n) {
    const r = (0, Vn.tapleafHash)({
      output: e.script,
      version: e.leafVersion
    });
    return (!n || n.equals(r)) && t.find((o) => o.leafHash.equals(r)) !== void 0;
  }
  function ci(e) {
    return e && !!(e.redeemScript || e.witnessScript || e.bip32Derivation && e.bip32Derivation.length);
  }
  Object.defineProperty(Ks, "__esModule", {
    value: true
  });
  Ks.Psbt = void 0;
  const Qf = Rc, eu = Ot, et = jc, tu = Uc(), cs = He, K1 = Ce, St = lo(), $1 = Fs, yn = ot(), Xe = jn, Se = Ee, Be = le, V1 = {
    network: K1.bitcoin,
    maximumFeeRate: 5e3
  };
  class fs {
    static fromBase64(t, n = {}) {
      const r = B.from(t, "base64");
      return this.fromBuffer(r, n);
    }
    static fromHex(t, n = {}) {
      const r = B.from(t, "hex");
      return this.fromBuffer(r, n);
    }
    static fromBuffer(t, n = {}) {
      const r = Qf.Psbt.fromBuffer(t, z1), i = new fs(n, r);
      return q1(i.__CACHE.__TX, i.__CACHE), i;
    }
    constructor(t = {}, n = new Qf.Psbt(new od())) {
      this.data = n, this.opts = Object.assign({}, V1, t), this.__CACHE = {
        __NON_WITNESS_UTXO_TX_CACHE: [],
        __NON_WITNESS_UTXO_BUF_CACHE: [],
        __TX_IN_CACHE: {},
        __TX: this.data.globalMap.unsignedTx.tx,
        __UNSAFE_SIGN_NONSEGWIT: false
      }, this.data.inputs.length === 0 && this.setVersion(2);
      const r = (i, o, s, a) => Object.defineProperty(i, o, {
        enumerable: s,
        writable: a
      });
      r(this, "__CACHE", false, true), r(this, "opts", false, true);
    }
    get inputCount() {
      return this.data.inputs.length;
    }
    get version() {
      return this.__CACHE.__TX.version;
    }
    set version(t) {
      this.setVersion(t);
    }
    get locktime() {
      return this.__CACHE.__TX.locktime;
    }
    set locktime(t) {
      this.setLocktime(t);
    }
    get txInputs() {
      return this.__CACHE.__TX.ins.map((t) => ({
        hash: (0, cs.cloneBuffer)(t.hash),
        index: t.index,
        sequence: t.sequence
      }));
    }
    get txOutputs() {
      return this.__CACHE.__TX.outs.map((t) => {
        let n;
        try {
          n = (0, tu.fromOutputScript)(t.script, this.opts.network);
        } catch {
        }
        return {
          script: (0, cs.cloneBuffer)(t.script),
          value: t.value,
          address: n
        };
      });
    }
    combine(...t) {
      return this.data.combine(...t.map((n) => n.data)), this;
    }
    clone() {
      const t = fs.fromBuffer(this.data.toBuffer());
      return t.opts = JSON.parse(JSON.stringify(this.opts)), t;
    }
    setMaximumFeeRate(t) {
      Lo(t), this.opts.maximumFeeRate = t;
    }
    setVersion(t) {
      Lo(t), Hi(this.data.inputs, "setVersion");
      const n = this.__CACHE;
      return n.__TX.version = t, n.__EXTRACTED_TX = void 0, this;
    }
    setLocktime(t) {
      Lo(t), Hi(this.data.inputs, "setLocktime");
      const n = this.__CACHE;
      return n.__TX.locktime = t, n.__EXTRACTED_TX = void 0, this;
    }
    setInputSequence(t, n) {
      Lo(n), Hi(this.data.inputs, "setInputSequence");
      const r = this.__CACHE;
      if (r.__TX.ins.length <= t) throw new Error("Input index too high");
      return r.__TX.ins[t].sequence = n, r.__EXTRACTED_TX = void 0, this;
    }
    addInputs(t) {
      return t.forEach((n) => this.addInput(n)), this;
    }
    addInput(t) {
      if (arguments.length > 1 || !t || t.hash === void 0 || t.index === void 0) throw new Error("Invalid arguments for Psbt.addInput. Requires single object with at least [hash] and [index]");
      (0, Se.checkTaprootInputFields)(t, t, "addInput"), Hi(this.data.inputs, "addInput"), t.witnessScript && us(t.witnessScript);
      const n = this.__CACHE;
      this.data.addInput(t);
      const r = n.__TX.ins[n.__TX.ins.length - 1];
      cd(n, r);
      const i = this.data.inputs.length - 1, o = this.data.inputs[i];
      return o.nonWitnessUtxo && tc(this.__CACHE, o, i), n.__FEE = void 0, n.__FEE_RATE = void 0, n.__EXTRACTED_TX = void 0, this;
    }
    addOutputs(t) {
      return t.forEach((n) => this.addOutput(n)), this;
    }
    addOutput(t) {
      if (arguments.length > 1 || !t || t.value === void 0 || t.address === void 0 && t.script === void 0) throw new Error("Invalid arguments for Psbt.addOutput. Requires single object with at least [script or address] and [value]");
      Hi(this.data.inputs, "addOutput");
      const { address: n } = t;
      if (typeof n == "string") {
        const { network: i } = this.opts, o = (0, tu.toOutputScript)(n, i);
        t = Object.assign({}, t, {
          script: o
        });
      }
      (0, Se.checkTaprootOutputFields)(t, t, "addOutput");
      const r = this.__CACHE;
      return this.data.addOutput(t), r.__FEE = void 0, r.__FEE_RATE = void 0, r.__EXTRACTED_TX = void 0, this;
    }
    extractTransaction(t) {
      if (!this.data.inputs.every(sd)) throw new Error("Not finalized");
      const n = this.__CACHE;
      if (t || W1(this, n, this.opts), n.__EXTRACTED_TX) return n.__EXTRACTED_TX;
      const r = n.__TX.clone();
      return pd(this.data.inputs, r, n, true), r;
    }
    getFeeRate() {
      return su("__FEE_RATE", "fee rate", this.data.inputs, this.__CACHE);
    }
    getFee() {
      return su("__FEE", "fee", this.data.inputs, this.__CACHE);
    }
    finalizeAllInputs() {
      return (0, et.checkForInput)(this.data.inputs, 0), Ui(this.data.inputs.length).forEach((t) => this.finalizeInput(t)), this;
    }
    finalizeInput(t, n) {
      const r = (0, et.checkForInput)(this.data.inputs, t);
      return (0, Se.isTaprootInput)(r) ? this._finalizeTaprootInput(t, r, void 0, n) : this._finalizeInput(t, r, n);
    }
    finalizeTaprootInput(t, n, r = Se.tapScriptFinalizer) {
      const i = (0, et.checkForInput)(this.data.inputs, t);
      if ((0, Se.isTaprootInput)(i)) return this._finalizeTaprootInput(t, i, n, r);
      throw new Error(`Cannot finalize input #${t}. Not Taproot.`);
    }
    _finalizeInput(t, n, r = Z1) {
      const { script: i, isP2SH: o, isP2WSH: s, isSegwit: a } = eb(t, n, this.__CACHE);
      if (!i) throw new Error(`No script found for input #${t}`);
      G1(n);
      const { finalScriptSig: f, finalScriptWitness: u } = r(t, n, i, a, o, s);
      if (f && this.data.updateInput(t, {
        finalScriptSig: f
      }), u && this.data.updateInput(t, {
        finalScriptWitness: u
      }), !f && !u) throw new Error(`Unknown error finalizing input #${t}`);
      return this.data.clearFinalizedInput(t), this;
    }
    _finalizeTaprootInput(t, n, r, i = Se.tapScriptFinalizer) {
      if (!n.witnessUtxo) throw new Error(`Cannot finalize input #${t}. Missing withness utxo.`);
      if (n.tapKeySig) {
        const o = St.p2tr({
          output: n.witnessUtxo.script,
          signature: n.tapKeySig
        }), s = (0, Be.witnessStackToScriptWitness)(o.witness);
        this.data.updateInput(t, {
          finalScriptWitness: s
        });
      } else {
        const { finalScriptWitness: o } = i(t, n, r);
        this.data.updateInput(t, {
          finalScriptWitness: o
        });
      }
      return this.data.clearFinalizedInput(t), this;
    }
    getInputType(t) {
      const n = (0, et.checkForInput)(this.data.inputs, t), r = yd(t, n, this.__CACHE), i = Ws(r, t, "input", n.redeemScript || ob(n.finalScriptSig), n.witnessScript || sb(n.finalScriptWitness)), o = i.type === "raw" ? "" : i.type + "-", s = wd(i.meaningfulScript);
      return o + s;
    }
    inputHasPubkey(t, n) {
      const r = (0, et.checkForInput)(this.data.inputs, t);
      return rb(n, r, t, this.__CACHE);
    }
    inputHasHDKey(t, n) {
      const r = (0, et.checkForInput)(this.data.inputs, t), i = ru(n);
      return !!r.bip32Derivation && r.bip32Derivation.some(i);
    }
    outputHasPubkey(t, n) {
      const r = (0, et.checkForOutput)(this.data.outputs, t);
      return ib(n, r, t, this.__CACHE);
    }
    outputHasHDKey(t, n) {
      const r = (0, et.checkForOutput)(this.data.outputs, t), i = ru(n);
      return !!r.bip32Derivation && r.bip32Derivation.some(i);
    }
    validateSignaturesOfAllInputs(t) {
      return (0, et.checkForInput)(this.data.inputs, 0), Ui(this.data.inputs.length).map((r) => this.validateSignaturesOfInput(r, t)).reduce((r, i) => i === true && r, true);
    }
    validateSignaturesOfInput(t, n, r) {
      const i = this.data.inputs[t];
      return (0, Se.isTaprootInput)(i) ? this.validateSignaturesOfTaprootInput(t, n, r) : this._validateSignaturesOfInput(t, n, r);
    }
    _validateSignaturesOfInput(t, n, r) {
      const i = this.data.inputs[t], o = (i || {}).partialSig;
      if (!i || !o || o.length < 1) throw new Error("No signatures to validate");
      if (typeof n != "function") throw new Error("Need validator function to validate signatures");
      const s = r ? o.filter((p) => p.pubkey.equals(r)) : o;
      if (s.length < 1) throw new Error("No signatures for this pubkey");
      const a = [];
      let f, u, c;
      for (const p of s) {
        const y = yn.signature.decode(p.signature), { hash: d, script: w } = c !== y.hashType ? ud(t, Object.assign({}, i, {
          sighashType: y.hashType
        }), this.__CACHE, true) : {
          hash: f,
          script: u
        };
        c = y.hashType, f = d, u = w, ad(p.pubkey, w, "verify"), a.push(n(p.pubkey, d, y.signature));
      }
      return a.every((p) => p === true);
    }
    validateSignaturesOfTaprootInput(t, n, r) {
      const i = this.data.inputs[t], o = (i || {}).tapKeySig, s = (i || {}).tapScriptSig;
      if (!i && !o && !(s && !s.length)) throw new Error("No signatures to validate");
      if (typeof n != "function") throw new Error("Need validator function to validate signatures");
      r = r && (0, Se.toXOnly)(r);
      const a = r ? ec(t, i, this.data.inputs, r, this.__CACHE) : J1(t, i, this.data.inputs, this.__CACHE);
      if (!a.length) throw new Error("No signatures for this pubkey");
      const f = a.find((c) => !c.leafHash);
      let u = 0;
      if (o && f) {
        if (!n(f.pubkey, f.hash, cu(o))) return false;
        u++;
      }
      if (s) for (const c of s) {
        const p = a.find((y) => c.pubkey.equals(y.pubkey));
        if (p) {
          if (!n(c.pubkey, p.hash, cu(c.signature))) return false;
          u++;
        }
      }
      return u > 0;
    }
    signAllInputsHD(t, n = [
      Xe.Transaction.SIGHASH_ALL
    ]) {
      if (!t || !t.publicKey || !t.fingerprint) throw new Error("Need HDSigner to sign input");
      const r = [];
      for (const i of Ui(this.data.inputs.length)) try {
        this.signInputHD(i, t, n), r.push(true);
      } catch {
        r.push(false);
      }
      if (r.every((i) => i === false)) throw new Error("No inputs were signed");
      return this;
    }
    signAllInputsHDAsync(t, n = [
      Xe.Transaction.SIGHASH_ALL
    ]) {
      return new Promise((r, i) => {
        if (!t || !t.publicKey || !t.fingerprint) return i(new Error("Need HDSigner to sign input"));
        const o = [], s = [];
        for (const a of Ui(this.data.inputs.length)) s.push(this.signInputHDAsync(a, t, n).then(() => {
          o.push(true);
        }, () => {
          o.push(false);
        }));
        return Promise.all(s).then(() => {
          if (o.every((a) => a === false)) return i(new Error("No inputs were signed"));
          r();
        });
      });
    }
    signInputHD(t, n, r = [
      Xe.Transaction.SIGHASH_ALL
    ]) {
      if (!n || !n.publicKey || !n.fingerprint) throw new Error("Need HDSigner to sign input");
      return fu(t, this.data.inputs, n).forEach((o) => this.signInput(t, o, r)), this;
    }
    signInputHDAsync(t, n, r = [
      Xe.Transaction.SIGHASH_ALL
    ]) {
      return new Promise((i, o) => {
        if (!n || !n.publicKey || !n.fingerprint) return o(new Error("Need HDSigner to sign input"));
        const a = fu(t, this.data.inputs, n).map((f) => this.signInputAsync(t, f, r));
        return Promise.all(a).then(() => {
          i();
        }).catch(o);
      });
    }
    signAllInputs(t, n) {
      if (!t || !t.publicKey) throw new Error("Need Signer to sign input");
      const r = [];
      for (const i of Ui(this.data.inputs.length)) try {
        this.signInput(i, t, n), r.push(true);
      } catch {
        r.push(false);
      }
      if (r.every((i) => i === false)) throw new Error("No inputs were signed");
      return this;
    }
    signAllInputsAsync(t, n) {
      return new Promise((r, i) => {
        if (!t || !t.publicKey) return i(new Error("Need Signer to sign input"));
        const o = [], s = [];
        for (const [a] of this.data.inputs.entries()) s.push(this.signInputAsync(a, t, n).then(() => {
          o.push(true);
        }, () => {
          o.push(false);
        }));
        return Promise.all(s).then(() => {
          if (o.every((a) => a === false)) return i(new Error("No inputs were signed"));
          r();
        });
      });
    }
    signInput(t, n, r) {
      if (!n || !n.publicKey) throw new Error("Need Signer to sign input");
      const i = (0, et.checkForInput)(this.data.inputs, t);
      return (0, Se.isTaprootInput)(i) ? this._signTaprootInput(t, i, n, void 0, r) : this._signInput(t, n, r);
    }
    signTaprootInput(t, n, r, i) {
      if (!n || !n.publicKey) throw new Error("Need Signer to sign input");
      const o = (0, et.checkForInput)(this.data.inputs, t);
      if ((0, Se.isTaprootInput)(o)) return this._signTaprootInput(t, o, n, r, i);
      throw new Error(`Input #${t} is not of type Taproot.`);
    }
    _signInput(t, n, r = [
      Xe.Transaction.SIGHASH_ALL
    ]) {
      const { hash: i, sighashType: o } = au(this.data.inputs, t, n.publicKey, this.__CACHE, r), s = [
        {
          pubkey: n.publicKey,
          signature: yn.signature.encode(n.sign(i), o)
        }
      ];
      return this.data.updateInput(t, {
        partialSig: s
      }), this;
    }
    _signTaprootInput(t, n, r, i, o = [
      Xe.Transaction.SIGHASH_DEFAULT
    ]) {
      const s = this.checkTaprootHashesForSig(t, n, r, i, o), a = s.filter((u) => !u.leafHash).map((u) => (0, Se.serializeTaprootSignature)(r.signSchnorr(u.hash), n.sighashType))[0], f = s.filter((u) => !!u.leafHash).map((u) => ({
        pubkey: (0, Se.toXOnly)(r.publicKey),
        signature: (0, Se.serializeTaprootSignature)(r.signSchnorr(u.hash), n.sighashType),
        leafHash: u.leafHash
      }));
      return a && this.data.updateInput(t, {
        tapKeySig: a
      }), f.length && this.data.updateInput(t, {
        tapScriptSig: f
      }), this;
    }
    signInputAsync(t, n, r) {
      return Promise.resolve().then(() => {
        if (!n || !n.publicKey) throw new Error("Need Signer to sign input");
        const i = (0, et.checkForInput)(this.data.inputs, t);
        return (0, Se.isTaprootInput)(i) ? this._signTaprootInputAsync(t, i, n, void 0, r) : this._signInputAsync(t, n, r);
      });
    }
    signTaprootInputAsync(t, n, r, i) {
      return Promise.resolve().then(() => {
        if (!n || !n.publicKey) throw new Error("Need Signer to sign input");
        const o = (0, et.checkForInput)(this.data.inputs, t);
        if ((0, Se.isTaprootInput)(o)) return this._signTaprootInputAsync(t, o, n, r, i);
        throw new Error(`Input #${t} is not of type Taproot.`);
      });
    }
    _signInputAsync(t, n, r = [
      Xe.Transaction.SIGHASH_ALL
    ]) {
      const { hash: i, sighashType: o } = au(this.data.inputs, t, n.publicKey, this.__CACHE, r);
      return Promise.resolve(n.sign(i)).then((s) => {
        const a = [
          {
            pubkey: n.publicKey,
            signature: yn.signature.encode(s, o)
          }
        ];
        this.data.updateInput(t, {
          partialSig: a
        });
      });
    }
    async _signTaprootInputAsync(t, n, r, i, o = [
      Xe.Transaction.SIGHASH_DEFAULT
    ]) {
      const s = this.checkTaprootHashesForSig(t, n, r, i, o), a = [], f = s.filter((c) => !c.leafHash)[0];
      if (f) {
        const c = Promise.resolve(r.signSchnorr(f.hash)).then((p) => ({
          tapKeySig: (0, Se.serializeTaprootSignature)(p, n.sighashType)
        }));
        a.push(c);
      }
      const u = s.filter((c) => !!c.leafHash);
      if (u.length) {
        const c = u.map((p) => Promise.resolve(r.signSchnorr(p.hash)).then((y) => ({
          tapScriptSig: [
            {
              pubkey: (0, Se.toXOnly)(r.publicKey),
              signature: (0, Se.serializeTaprootSignature)(y, n.sighashType),
              leafHash: p.leafHash
            }
          ]
        })));
        a.push(...c);
      }
      return Promise.all(a).then((c) => {
        c.forEach((p) => this.data.updateInput(t, p));
      });
    }
    checkTaprootHashesForSig(t, n, r, i, o) {
      if (typeof r.signSchnorr != "function") throw new Error(`Need Schnorr Signer to sign taproot input #${t}.`);
      const s = ec(t, n, this.data.inputs, r.publicKey, this.__CACHE, i, o);
      if (!s || !s.length) throw new Error(`Can not sign for input #${t} with the key ${r.publicKey.toString("hex")}`);
      return s;
    }
    toBuffer() {
      return Sa(this.__CACHE), this.data.toBuffer();
    }
    toHex() {
      return Sa(this.__CACHE), this.data.toHex();
    }
    toBase64() {
      return Sa(this.__CACHE), this.data.toBase64();
    }
    updateGlobal(t) {
      return this.data.updateGlobal(t), this;
    }
    updateInput(t, n) {
      return n.witnessScript && us(n.witnessScript), (0, Se.checkTaprootInputFields)(this.data.inputs[t], n, "updateInput"), this.data.updateInput(t, n), n.nonWitnessUtxo && tc(this.__CACHE, this.data.inputs[t], t), this;
    }
    updateOutput(t, n) {
      const r = this.data.outputs[t];
      return (0, Se.checkTaprootOutputFields)(r, n, "updateOutput"), this.data.updateOutput(t, n), this;
    }
    addUnknownKeyValToGlobal(t) {
      return this.data.addUnknownKeyValToGlobal(t), this;
    }
    addUnknownKeyValToInput(t, n) {
      return this.data.addUnknownKeyValToInput(t, n), this;
    }
    addUnknownKeyValToOutput(t, n) {
      return this.data.addUnknownKeyValToOutput(t, n), this;
    }
    clearFinalizedInput(t) {
      return this.data.clearFinalizedInput(t), this;
    }
  }
  Ks.Psbt = fs;
  const z1 = (e) => new od(e);
  class od {
    constructor(t = B.from([
      2,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ])) {
      this.tx = Xe.Transaction.fromBuffer(t), X1(this.tx), Object.defineProperty(this, "tx", {
        enumerable: false,
        writable: true
      });
    }
    getInputOutputCounts() {
      return {
        inputCount: this.tx.ins.length,
        outputCount: this.tx.outs.length
      };
    }
    addInput(t) {
      if (t.hash === void 0 || t.index === void 0 || !B.isBuffer(t.hash) && typeof t.hash != "string" || typeof t.index != "number") throw new Error("Error adding input.");
      const n = typeof t.hash == "string" ? (0, cs.reverseBuffer)(B.from(t.hash, "hex")) : t.hash;
      this.tx.addInput(n, t.index, t.sequence);
    }
    addOutput(t) {
      if (t.script === void 0 || t.value === void 0 || !B.isBuffer(t.script) || typeof t.value != "number") throw new Error("Error adding output.");
      this.tx.addOutput(t.script, t.value);
    }
    toBuffer() {
      return this.tx.toBuffer();
    }
  }
  function j1(e, t, n) {
    switch (n) {
      case "pubkey":
      case "pubkeyhash":
      case "witnesspubkeyhash":
        return nu(1, e.partialSig);
      case "multisig":
        const r = St.p2ms({
          output: t
        });
        return nu(r.m, e.partialSig, r.pubkeys);
      default:
        return false;
    }
  }
  function Sa(e) {
    if (e.__UNSAFE_SIGN_NONSEGWIT !== false) throw new Error("Not BIP174 compliant, can not export");
  }
  function nu(e, t, n) {
    if (!t) return false;
    let r;
    if (n ? r = n.map((i) => {
      const o = ab(i);
      return t.find((s) => s.pubkey.equals(o));
    }).filter((i) => !!i) : r = t, r.length > e) throw new Error("Too many signatures");
    return r.length === e;
  }
  function sd(e) {
    return !!e.finalScriptSig || !!e.finalScriptWitness;
  }
  function ru(e) {
    return (t) => !(!t.masterFingerprint.equals(e.fingerprint) || !e.derivePath(t.path).publicKey.equals(t.pubkey));
  }
  function Lo(e) {
    if (typeof e != "number" || e !== Math.floor(e) || e > 4294967295 || e < 0) throw new Error("Invalid 32 bit integer");
  }
  function W1(e, t, n) {
    const r = t.__FEE_RATE || e.getFeeRate(), i = t.__EXTRACTED_TX.virtualSize(), o = r * i;
    if (r >= n.maximumFeeRate) throw new Error(`Warning: You are paying around ${(o / 1e8).toFixed(8)} in fees, which is ${r} satoshi per byte for a transaction with a VSize of ${i} bytes (segwit counted as 0.25 byte per byte). Use setMaximumFeeRate method to raise your threshold, or pass true to the first arg of extractTransaction.`);
  }
  function Hi(e, t) {
    e.forEach((n) => {
      if ((0, Se.isTaprootInput)(n) ? (0, Se.checkTaprootInputForSigs)(n, t) : (0, Be.checkInputForSig)(n, t)) throw new Error("Can not modify transaction, signatures exist.");
    });
  }
  function G1(e) {
    if (!e.sighashType || !e.partialSig) return;
    const { partialSig: t, sighashType: n } = e;
    t.forEach((r) => {
      const { hashType: i } = yn.signature.decode(r.signature);
      if (n !== i) throw new Error("Signature sighash does not match input sighash type");
    });
  }
  function ad(e, t, n) {
    if (!(0, Be.pubkeyInScript)(e, t)) throw new Error(`Can not ${n} for this input with the key ${e.toString("hex")}`);
  }
  function X1(e) {
    if (!e.ins.every((n) => n.script && n.script.length === 0 && n.witness && n.witness.length === 0)) throw new Error("Format Error: Transaction ScriptSigs are not empty");
  }
  function q1(e, t) {
    e.ins.forEach((n) => {
      cd(t, n);
    });
  }
  function cd(e, t) {
    const n = (0, cs.reverseBuffer)(B.from(t.hash)).toString("hex") + ":" + t.index;
    if (e.__TX_IN_CACHE[n]) throw new Error("Duplicate input detected.");
    e.__TX_IN_CACHE[n] = 1;
  }
  function fd(e, t) {
    return (n, r, i, o) => {
      const s = e({
        redeem: {
          output: i
        }
      }).output;
      if (!r.equals(s)) throw new Error(`${t} for ${o} #${n} doesn't match the scriptPubKey in the prevout`);
    };
  }
  const iu = fd(St.p2sh, "Redeem script"), ou = fd(St.p2wsh, "Witness script");
  function su(e, t, n, r) {
    if (!n.every(sd)) throw new Error(`PSBT must be finalized to calculate ${t}`);
    if (e === "__FEE_RATE" && r.__FEE_RATE) return r.__FEE_RATE;
    if (e === "__FEE" && r.__FEE) return r.__FEE;
    let i, o = true;
    if (r.__EXTRACTED_TX ? (i = r.__EXTRACTED_TX, o = false) : i = r.__TX.clone(), pd(n, i, r, o), e === "__FEE_RATE") return r.__FEE_RATE;
    if (e === "__FEE") return r.__FEE;
  }
  function Z1(e, t, n, r, i, o) {
    const s = wd(n);
    if (!j1(t, n, s)) throw new Error(`Can not finalize input #${e}`);
    return Y1(n, s, t.partialSig, r, i, o);
  }
  function Y1(e, t, n, r, i, o) {
    let s, a;
    const f = Q1(e, t, n), u = o ? St.p2wsh({
      redeem: f
    }) : null, c = i ? St.p2sh({
      redeem: u || f
    }) : null;
    return r ? (u ? a = (0, Be.witnessStackToScriptWitness)(u.witness) : a = (0, Be.witnessStackToScriptWitness)(f.witness), c && (s = c.input)) : c ? s = c.input : s = f.input, {
      finalScriptSig: s,
      finalScriptWitness: a
    };
  }
  function au(e, t, n, r, i) {
    const o = (0, et.checkForInput)(e, t), { hash: s, sighashType: a, script: f } = ud(t, o, r, false, i);
    return ad(n, f, "sign"), {
      hash: s,
      sighashType: a
    };
  }
  function ud(e, t, n, r, i) {
    const o = n.__TX, s = t.sighashType || Xe.Transaction.SIGHASH_ALL;
    hd(s, i);
    let a, f;
    if (t.nonWitnessUtxo) {
      const p = js(n, t, e), y = o.ins[e].hash, d = p.getHash();
      if (!y.equals(d)) throw new Error(`Non-witness UTXO hash for input #${e} doesn't match the hash specified in the prevout`);
      const w = o.ins[e].index;
      f = p.outs[w];
    } else if (t.witnessUtxo) f = t.witnessUtxo;
    else throw new Error("Need a Utxo input item for signing");
    const { meaningfulScript: u, type: c } = Ws(f.script, e, "input", t.redeemScript, t.witnessScript);
    if ([
      "p2sh-p2wsh",
      "p2wsh"
    ].indexOf(c) >= 0) a = o.hashForWitnessV0(e, u, f.value, s);
    else if ((0, Be.isP2WPKH)(u)) {
      const p = St.p2pkh({
        hash: u.slice(2)
      }).output;
      a = o.hashForWitnessV0(e, p, f.value, s);
    } else {
      if (t.nonWitnessUtxo === void 0 && n.__UNSAFE_SIGN_NONSEGWIT === false) throw new Error(`Input #${e} has witnessUtxo but non-segwit script: ${u.toString("hex")}`);
      !r && n.__UNSAFE_SIGN_NONSEGWIT !== false && console.warn(`Warning: Signing non-segwit inputs without the full parent transaction means there is a chance that a miner could feed you incorrect information to trick you into paying large fees. This behavior is the same as Psbt's predecessor (TransactionBuilder - now removed) when signing non-segwit scripts. You are not able to export this Psbt with toBuffer|toBase64|toHex since it is not BIP174 compliant.
*********************
PROCEED WITH CAUTION!
*********************`), a = o.hashForSignature(e, u, s);
    }
    return {
      script: u,
      sighashType: s,
      hash: a
    };
  }
  function J1(e, t, n, r) {
    const i = [];
    if (t.tapInternalKey) {
      const s = ld(e, t, r);
      s && i.push(s);
    }
    if (t.tapScriptSig) {
      const s = t.tapScriptSig.map((a) => a.pubkey);
      i.push(...s);
    }
    return i.map((s) => ec(e, t, n, s, r)).flat();
  }
  function ld(e, t, n) {
    const { script: r } = Gc(e, t, n);
    return (0, Be.isP2TR)(r) ? r.subarray(2, 34) : null;
  }
  function cu(e) {
    return e.length === 64 ? e : e.subarray(0, 64);
  }
  function ec(e, t, n, r, i, o, s) {
    const a = i.__TX, f = t.sighashType || Xe.Transaction.SIGHASH_DEFAULT;
    hd(f, s);
    const u = n.map((w, b) => Gc(b, w, i)), c = u.map((w) => w.script), p = u.map((w) => w.value), y = [];
    if (t.tapInternalKey && !o) {
      const w = ld(e, t, i) || B.from([]);
      if ((0, Se.toXOnly)(r).equals(w)) {
        const b = a.hashForWitnessV1(e, c, p, f);
        y.push({
          pubkey: r,
          hash: b
        });
      }
    }
    const d = (t.tapLeafScript || []).filter((w) => (0, Be.pubkeyInScript)(r, w.script)).map((w) => {
      const b = (0, $1.tapleafHash)({
        output: w.script,
        version: w.leafVersion
      });
      return Object.assign({
        hash: b
      }, w);
    }).filter((w) => !o || o.equals(w.hash)).map((w) => {
      const b = a.hashForWitnessV1(e, c, p, f, w.hash);
      return {
        pubkey: r,
        hash: b,
        leafHash: w.hash
      };
    });
    return y.concat(d);
  }
  function hd(e, t) {
    if (t && t.indexOf(e) < 0) {
      const n = nb(e);
      throw new Error(`Sighash type is not allowed. Retry the sign method passing the sighashTypes array of whitelisted types. Sighash type: ${n}`);
    }
  }
  function Q1(e, t, n) {
    let r;
    switch (t) {
      case "multisig":
        const i = tb(e, n);
        r = St.p2ms({
          output: e,
          signatures: i
        });
        break;
      case "pubkey":
        r = St.p2pk({
          output: e,
          signature: n[0].signature
        });
        break;
      case "pubkeyhash":
        r = St.p2pkh({
          output: e,
          pubkey: n[0].pubkey,
          signature: n[0].signature
        });
        break;
      case "witnesspubkeyhash":
        r = St.p2wpkh({
          output: e,
          pubkey: n[0].pubkey,
          signature: n[0].signature
        });
        break;
    }
    return r;
  }
  function eb(e, t, n) {
    const r = n.__TX, i = {
      script: null,
      isSegwit: false,
      isP2SH: false,
      isP2WSH: false
    };
    if (i.isP2SH = !!t.redeemScript, i.isP2WSH = !!t.witnessScript, t.witnessScript) i.script = t.witnessScript;
    else if (t.redeemScript) i.script = t.redeemScript;
    else if (t.nonWitnessUtxo) {
      const o = js(n, t, e), s = r.ins[e].index;
      i.script = o.outs[s].script;
    } else t.witnessUtxo && (i.script = t.witnessUtxo.script);
    return (t.witnessScript || (0, Be.isP2WPKH)(i.script)) && (i.isSegwit = true), i;
  }
  function fu(e, t, n) {
    const r = (0, et.checkForInput)(t, e);
    if (!r.bip32Derivation || r.bip32Derivation.length === 0) throw new Error("Need bip32Derivation to sign with HD");
    const i = r.bip32Derivation.map((s) => {
      if (s.masterFingerprint.equals(n.fingerprint)) return s;
    }).filter((s) => !!s);
    if (i.length === 0) throw new Error("Need one bip32Derivation masterFingerprint to match the HDSigner fingerprint");
    return i.map((s) => {
      const a = n.derivePath(s.path);
      if (!s.pubkey.equals(a.publicKey)) throw new Error("pubkey did not match bip32Derivation");
      return a;
    });
  }
  function tb(e, t) {
    return St.p2ms({
      output: e
    }).pubkeys.map((r) => (t.filter((i) => i.pubkey.equals(r))[0] || {}).signature).filter((r) => !!r);
  }
  function dd(e) {
    let t = 0;
    function n(s) {
      return t += s, e.slice(t - s, t);
    }
    function r() {
      const s = eu.decode(e, t);
      return t += eu.decode.bytes, s;
    }
    function i() {
      return n(r());
    }
    function o() {
      const s = r(), a = [];
      for (let f = 0; f < s; f++) a.push(i());
      return a;
    }
    return o();
  }
  function nb(e) {
    let t = e & Xe.Transaction.SIGHASH_ANYONECANPAY ? "SIGHASH_ANYONECANPAY | " : "";
    switch (e & 31) {
      case Xe.Transaction.SIGHASH_ALL:
        t += "SIGHASH_ALL";
        break;
      case Xe.Transaction.SIGHASH_SINGLE:
        t += "SIGHASH_SINGLE";
        break;
      case Xe.Transaction.SIGHASH_NONE:
        t += "SIGHASH_NONE";
        break;
    }
    return t;
  }
  function tc(e, t, n) {
    e.__NON_WITNESS_UTXO_BUF_CACHE[n] = t.nonWitnessUtxo;
    const r = Xe.Transaction.fromBuffer(t.nonWitnessUtxo);
    e.__NON_WITNESS_UTXO_TX_CACHE[n] = r;
    const i = e, o = n;
    delete t.nonWitnessUtxo, Object.defineProperty(t, "nonWitnessUtxo", {
      enumerable: true,
      get() {
        const s = i.__NON_WITNESS_UTXO_BUF_CACHE[o], a = i.__NON_WITNESS_UTXO_TX_CACHE[o];
        if (s !== void 0) return s;
        {
          const f = a.toBuffer();
          return i.__NON_WITNESS_UTXO_BUF_CACHE[o] = f, f;
        }
      },
      set(s) {
        i.__NON_WITNESS_UTXO_BUF_CACHE[o] = s;
      }
    });
  }
  function pd(e, t, n, r) {
    let i = 0;
    e.forEach((f, u) => {
      if (r && f.finalScriptSig && (t.ins[u].script = f.finalScriptSig), r && f.finalScriptWitness && (t.ins[u].witness = dd(f.finalScriptWitness)), f.witnessUtxo) i += f.witnessUtxo.value;
      else if (f.nonWitnessUtxo) {
        const c = js(n, f, u), p = t.ins[u].index, y = c.outs[p];
        i += y.value;
      }
    });
    const o = t.outs.reduce((f, u) => f + u.value, 0), s = i - o;
    if (s < 0) throw new Error("Outputs are spending more than Inputs");
    const a = t.virtualSize();
    n.__FEE = s, n.__EXTRACTED_TX = t, n.__FEE_RATE = Math.floor(s / a);
  }
  function js(e, t, n) {
    const r = e.__NON_WITNESS_UTXO_TX_CACHE;
    return r[n] || tc(e, t, n), r[n];
  }
  function yd(e, t, n) {
    const { script: r } = Gc(e, t, n);
    return r;
  }
  function Gc(e, t, n) {
    if (t.witnessUtxo !== void 0) return {
      script: t.witnessUtxo.script,
      value: t.witnessUtxo.value
    };
    if (t.nonWitnessUtxo !== void 0) {
      const i = js(n, t, e).outs[n.__TX.ins[e].index];
      return {
        script: i.script,
        value: i.value
      };
    } else throw new Error("Can't find pubkey in input without Utxo data");
  }
  function rb(e, t, n, r) {
    const i = yd(n, t, r), { meaningfulScript: o } = Ws(i, n, "input", t.redeemScript, t.witnessScript);
    return (0, Be.pubkeyInScript)(e, o);
  }
  function ib(e, t, n, r) {
    const i = r.__TX.outs[n].script, { meaningfulScript: o } = Ws(i, n, "output", t.redeemScript, t.witnessScript);
    return (0, Be.pubkeyInScript)(e, o);
  }
  function ob(e) {
    if (!e) return;
    const t = yn.decompile(e);
    if (!t) return;
    const n = t[t.length - 1];
    if (!(!B.isBuffer(n) || gd(n) || cb(n) || !yn.decompile(n))) return n;
  }
  function sb(e) {
    if (!e) return;
    const t = dd(e), n = t[t.length - 1];
    if (!(gd(n) || !yn.decompile(n))) return n;
  }
  function ab(e) {
    if (e.length === 65) {
      const t = e[64] & 1, n = e.slice(0, 33);
      return n[0] = 2 | t, n;
    }
    return e.slice();
  }
  function gd(e) {
    return e.length === 33 && yn.isCanonicalPubKey(e);
  }
  function cb(e) {
    return yn.isCanonicalScriptSignature(e);
  }
  function Ws(e, t, n, r, i) {
    const o = (0, Be.isP2SHScript)(e), s = o && r && (0, Be.isP2WSHScript)(r), a = (0, Be.isP2WSHScript)(e);
    if (o && r === void 0) throw new Error("scriptPubkey is P2SH but redeemScript missing");
    if ((a || s) && i === void 0) throw new Error("scriptPubkey or redeemScript is P2WSH but witnessScript missing");
    let f;
    return s ? (f = i, iu(t, e, r, n), ou(t, r, i, n), us(f)) : a ? (f = i, ou(t, e, i, n), us(f)) : o ? (f = r, iu(t, e, r, n)) : f = e, {
      meaningfulScript: f,
      type: s ? "p2sh-p2wsh" : o ? "p2sh" : a ? "p2wsh" : "raw"
    };
  }
  function us(e) {
    if ((0, Be.isP2WPKH)(e) || (0, Be.isP2SHScript)(e)) throw new Error("P2WPKH or P2SH can not be contained within P2WSH");
  }
  function wd(e) {
    return (0, Be.isP2WPKH)(e) ? "witnesspubkeyhash" : (0, Be.isP2PKH)(e) ? "pubkeyhash" : (0, Be.isP2MS)(e) ? "multisig" : (0, Be.isP2PK)(e) ? "pubkey" : "nonstandard";
  }
  function Ui(e) {
    return [
      ...Array(e).keys()
    ];
  }
  (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: true
    }), e.initEccLib = e.Transaction = e.opcodes = e.Psbt = e.Block = e.script = e.payments = e.networks = e.crypto = e.address = void 0;
    const t = Uc();
    e.address = t;
    const n = Gt;
    e.crypto = n;
    const r = Ce;
    e.networks = r;
    const i = lo();
    e.payments = i;
    const o = ot();
    e.script = o;
    var s = Ms;
    Object.defineProperty(e, "Block", {
      enumerable: true,
      get: function() {
        return s.Block;
      }
    });
    var a = Ks;
    Object.defineProperty(e, "Psbt", {
      enumerable: true,
      get: function() {
        return a.Psbt;
      }
    });
    var f = Kn;
    Object.defineProperty(e, "opcodes", {
      enumerable: true,
      get: function() {
        return f.OPS;
      }
    });
    var u = jn;
    Object.defineProperty(e, "Transaction", {
      enumerable: true,
      get: function() {
        return u.Transaction;
      }
    });
    var c = $n;
    Object.defineProperty(e, "initEccLib", {
      enumerable: true,
      get: function() {
        return c.initEccLib;
      }
    });
  })(at);
  const bd = "0123456789abcdefABCDEF";
  bd.split("").map((e) => e.codePointAt(0));
  Array(256).fill(true).map((e, t) => {
    const n = String.fromCodePoint(t), r = bd.indexOf(n);
    return r < 0 ? void 0 : r < 16 ? r : r - 6;
  });
  new TextEncoder();
  new TextDecoder("ascii");
  function fb(e, t) {
    const n = Math.min(e.length, t.length);
    for (let r = 0; r < n; ++r) if (e[r] !== t[r]) return e[r] < t[r] ? -1 : 1;
    return e.length === t.length ? 0 : e.length > t.length ? 1 : -1;
  }
  const md = 0, Xc = 1, _d = 2, Ed = 3, Zi = 4, Sd = 5, xd = 6, vd = 7, ub = {
    [md.toString()]: "Expected Private",
    [Xc.toString()]: "Expected Point",
    [_d.toString()]: "Expected Tweak",
    [Ed.toString()]: "Expected Hash",
    [Zi.toString()]: "Expected Signature",
    [Sd.toString()]: "Expected Extra Data (32 bytes)",
    [xd.toString()]: "Expected Parity (1 | 0)",
    [vd.toString()]: "Bad Recovery Id"
  };
  function yt(e) {
    const t = ub[e.toString()] || `Unknow error code: ${e}`;
    throw new TypeError(t);
  }
  const po = 32, Yi = 33, yo = 65, Wn = 32, Id = 32, Td = 32, Ad = 32, Gs = 64, kd = new Uint8Array(32), ls = new Uint8Array([
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    254,
    186,
    174,
    220,
    230,
    175,
    72,
    160,
    59,
    191,
    210,
    94,
    140,
    208,
    54,
    65,
    65
  ]), lb = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    69,
    81,
    35,
    25,
    80,
    183,
    95,
    196,
    64,
    45,
    161,
    114,
    47,
    201,
    186,
    238
  ]);
  function qt(e) {
    return e instanceof Uint8Array;
  }
  function wr(e, t) {
    for (let n = 0; n < 32; ++n) if (e[n] !== t[n]) return e[n] < t[n] ? -1 : 1;
    return 0;
  }
  function nc(e) {
    return wr(e, kd) === 0;
  }
  function Bd(e) {
    return qt(e) && e.length === po && wr(e, kd) > 0 && wr(e, ls) < 0;
  }
  function hb(e) {
    return qt(e) && (e.length === Yi || e.length === yo || e.length === Wn);
  }
  function Pd(e) {
    return qt(e) && e.length === Wn;
  }
  function db(e) {
    return qt(e) && (e.length === Yi || e.length === yo);
  }
  function pb(e) {
    return qt(e) && e.length === Yi;
  }
  function yb(e) {
    return qt(e) && e.length === Id && wr(e, ls) < 0;
  }
  function gb(e) {
    return qt(e) && e.length === Td;
  }
  function wb(e) {
    return e === void 0 || qt(e) && e.length === Ad;
  }
  function bb(e) {
    return qt(e) && e.length === 64 && wr(e.subarray(0, 32), ls) < 0 && wr(e.subarray(32, 64), ls) < 0;
  }
  function mb(e) {
    return qt(e) && e.length === 64 && wr(e.subarray(0, 32), lb) < 0;
  }
  function _b(e) {
    e !== 0 && e !== 1 && yt(xd);
  }
  function Gn(e) {
    Bd(e) || yt(md);
  }
  function br(e) {
    hb(e) || yt(Xc);
  }
  function hs(e) {
    Pd(e) || yt(Xc);
  }
  function Ei(e) {
    yb(e) || yt(_d);
  }
  function Si(e) {
    gb(e) || yt(Ed);
  }
  function qc(e) {
    wb(e) || yt(Sd);
  }
  function Zc(e) {
    bb(e) || yt(Zi);
  }
  function Eb(e) {
    e() || yt(Zi);
  }
  function Sb(e) {
    nc(e.subarray(0, 32)) && yt(Zi), nc(e.subarray(32, 64)) && yt(Zi);
  }
  function xb(e) {
    mb(e) || yt(vd);
  }
  const vb = "/app/assets/secp256k1-Cao5Swmf.wasm", Ib = async (e = {}, t) => {
    let n;
    if (t.startsWith("data:")) {
      const r = t.replace(/^data:.*?base64,/, "");
      let i;
      if (typeof B == "function" && typeof B.from == "function") i = B.from(r, "base64");
      else if (typeof atob == "function") {
        const o = atob(r);
        i = new Uint8Array(o.length);
        for (let s = 0; s < o.length; s++) i[s] = o.charCodeAt(s);
      } else throw new Error("Cannot decode base64-encoded data URL");
      n = await WebAssembly.instantiate(i, e);
    } else {
      const r = await fetch(t), i = r.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && i.startsWith("application/wasm")) n = await WebAssembly.instantiateStreaming(r, e);
      else {
        const o = await r.arrayBuffer();
        n = await WebAssembly.instantiate(o, e);
      }
    }
    return n.instance.exports;
  };
  function Tb() {
    const e = new Uint8Array(4);
    if (typeof crypto > "u") throw new Error("The crypto object is unavailable. This may occur if your environment does not support the Web Cryptography API.");
    return crypto.getRandomValues(e), e;
  }
  function Ab() {
    const e = Tb();
    return (e[0] << 3 * 8) + (e[1] << 2 * 8) + (e[2] << 1 * 8) + e[3];
  }
  URL = globalThis.URL;
  const kb = await Ib({
    "./rand.js": {
      generateInt32: Ab
    },
    "./validate_error.js": {
      throwError: yt
    }
  }, vb), { memory: Bb, initializeContext: Pb, isPoint: Ob, PUBLIC_KEY_INPUT: Hb, pointAdd: Ub, PUBLIC_KEY_INPUT2: Rb, pointAddScalar: Nb, TWEAK_INPUT: Cb, xOnlyPointAddTweak: Lb, X_ONLY_PUBLIC_KEY_INPUT: Fb, xOnlyPointAddTweakCheck: Mb, X_ONLY_PUBLIC_KEY_INPUT2: Db, pointCompress: Kb, pointFromScalar: $b, PRIVATE_INPUT: Vb, xOnlyPointFromScalar: zb, xOnlyPointFromPoint: jb, pointMultiply: Wb, privateAdd: Gb, privateSub: Xb, privateNegate: qb, sign: Zb, HASH_INPUT: Yb, EXTRA_DATA_INPUT: Jb, SIGNATURE_INPUT: Qb, signRecoverable: em, signSchnorr: tm, verify: nm, recover: rm, verifySchnorr: im, rustsecp256k1_v0_8_1_default_error_callback_fn: om, rustsecp256k1_v0_8_1_default_illegal_callback_fn: sm, __data_end: am, __heap_base: cm } = kb, ce = Object.freeze(Object.defineProperty({
    __proto__: null,
    EXTRA_DATA_INPUT: Jb,
    HASH_INPUT: Yb,
    PRIVATE_INPUT: Vb,
    PUBLIC_KEY_INPUT: Hb,
    PUBLIC_KEY_INPUT2: Rb,
    SIGNATURE_INPUT: Qb,
    TWEAK_INPUT: Cb,
    X_ONLY_PUBLIC_KEY_INPUT: Fb,
    X_ONLY_PUBLIC_KEY_INPUT2: Db,
    __data_end: am,
    __heap_base: cm,
    initializeContext: Pb,
    isPoint: Ob,
    memory: Bb,
    pointAdd: Ub,
    pointAddScalar: Nb,
    pointCompress: Kb,
    pointFromScalar: $b,
    pointMultiply: Wb,
    privateAdd: Gb,
    privateNegate: qb,
    privateSub: Xb,
    recover: rm,
    rustsecp256k1_v0_8_1_default_error_callback_fn: om,
    rustsecp256k1_v0_8_1_default_illegal_callback_fn: sm,
    sign: Zb,
    signRecoverable: em,
    signSchnorr: tm,
    verify: nm,
    verifySchnorr: im,
    xOnlyPointAddTweak: Lb,
    xOnlyPointAddTweakCheck: Mb,
    xOnlyPointFromPoint: jb,
    xOnlyPointFromScalar: zb
  }, Symbol.toStringTag, {
    value: "Module"
  })), mn = new Uint8Array(ce.memory.buffer), uu = ce.PRIVATE_INPUT.value, lu = ce.PUBLIC_KEY_INPUT.value, hu = ce.PUBLIC_KEY_INPUT2.value, du = ce.X_ONLY_PUBLIC_KEY_INPUT.value, pu = ce.X_ONLY_PUBLIC_KEY_INPUT2.value, yu = ce.TWEAK_INPUT.value, gu = ce.HASH_INPUT.value, wu = ce.EXTRA_DATA_INPUT.value, bu = ce.SIGNATURE_INPUT.value, Ue = mn.subarray(uu, uu + po), Ie = mn.subarray(lu, lu + yo), mu = mn.subarray(hu, hu + yo), xt = mn.subarray(du, du + Wn), _u = mn.subarray(pu, pu + Wn), vt = mn.subarray(yu, yu + Id), It = mn.subarray(gu, gu + Td), yi = mn.subarray(wu, wu + Ad), Tt = mn.subarray(bu, bu + Gs);
  function xi(e, t) {
    return e === void 0 ? t !== void 0 ? t.length : Yi : e ? Yi : yo;
  }
  function Yc(e) {
    try {
      return Ie.set(e), ce.isPoint(e.length) === 1;
    } finally {
      Ie.fill(0);
    }
  }
  function fm() {
    ce.initializeContext();
  }
  function um(e) {
    return db(e) && Yc(e);
  }
  function lm(e) {
    return pb(e) && Yc(e);
  }
  function Od(e) {
    return Pd(e) && Yc(e);
  }
  function Hd(e) {
    return Bd(e);
  }
  function hm(e, t, n) {
    br(e), br(t);
    const r = xi(n, e);
    try {
      return Ie.set(e), mu.set(t), ce.pointAdd(e.length, t.length, r) === 1 ? Ie.slice(0, r) : null;
    } finally {
      Ie.fill(0), mu.fill(0);
    }
  }
  function dm(e, t, n) {
    br(e), Ei(t);
    const r = xi(n, e);
    try {
      return Ie.set(e), vt.set(t), ce.pointAddScalar(e.length, r) === 1 ? Ie.slice(0, r) : null;
    } finally {
      Ie.fill(0), vt.fill(0);
    }
  }
  function pm(e, t) {
    br(e);
    const n = xi(t, e);
    try {
      return Ie.set(e), ce.pointCompress(e.length, n), Ie.slice(0, n);
    } finally {
      Ie.fill(0);
    }
  }
  function Ud(e, t) {
    Gn(e);
    const n = xi(t);
    try {
      return Ue.set(e), ce.pointFromScalar(n) === 1 ? Ie.slice(0, n) : null;
    } finally {
      Ue.fill(0), Ie.fill(0);
    }
  }
  function ym(e) {
    Gn(e);
    try {
      return Ue.set(e), ce.xOnlyPointFromScalar(), xt.slice(0, Wn);
    } finally {
      Ue.fill(0), xt.fill(0);
    }
  }
  function gm(e) {
    br(e);
    try {
      return Ie.set(e), ce.xOnlyPointFromPoint(e.length), xt.slice(0, Wn);
    } finally {
      Ie.fill(0), xt.fill(0);
    }
  }
  function wm(e, t, n) {
    br(e), Ei(t);
    const r = xi(n, e);
    try {
      return Ie.set(e), vt.set(t), ce.pointMultiply(e.length, r) === 1 ? Ie.slice(0, r) : null;
    } finally {
      Ie.fill(0), vt.fill(0);
    }
  }
  function bm(e, t) {
    Gn(e), Ei(t);
    try {
      return Ue.set(e), vt.set(t), ce.privateAdd() === 1 ? Ue.slice(0, po) : null;
    } finally {
      Ue.fill(0), vt.fill(0);
    }
  }
  function mm(e, t) {
    if (Gn(e), Ei(t), nc(t)) return new Uint8Array(e);
    try {
      return Ue.set(e), vt.set(t), ce.privateSub() === 1 ? Ue.slice(0, po) : null;
    } finally {
      Ue.fill(0), vt.fill(0);
    }
  }
  function _m(e) {
    Gn(e);
    try {
      return Ue.set(e), ce.privateNegate(), Ue.slice(0, po);
    } finally {
      Ue.fill(0);
    }
  }
  function Em(e, t) {
    hs(e), Ei(t);
    try {
      xt.set(e), vt.set(t);
      const n = ce.xOnlyPointAddTweak();
      return n !== -1 ? {
        parity: n,
        xOnlyPubkey: xt.slice(0, Wn)
      } : null;
    } finally {
      xt.fill(0), vt.fill(0);
    }
  }
  function Sm(e, t, n, r) {
    hs(e), hs(n), Ei(t);
    const i = r !== void 0;
    i && _b(r);
    try {
      if (xt.set(e), _u.set(n), vt.set(t), i) return ce.xOnlyPointAddTweakCheck(r) === 1;
      {
        ce.xOnlyPointAddTweak();
        const o = xt.slice(0, Wn);
        return fb(o, n) === 0;
      }
    } finally {
      xt.fill(0), _u.fill(0), vt.fill(0);
    }
  }
  function xm(e, t, n) {
    Si(e), Gn(t), qc(n);
    try {
      return It.set(e), Ue.set(t), n !== void 0 && yi.set(n), ce.sign(n === void 0 ? 0 : 1), Tt.slice(0, Gs);
    } finally {
      It.fill(0), Ue.fill(0), n !== void 0 && yi.fill(0), Tt.fill(0);
    }
  }
  function vm(e, t, n) {
    Si(e), Gn(t), qc(n);
    try {
      It.set(e), Ue.set(t), n !== void 0 && yi.set(n);
      const r = ce.signRecoverable(n === void 0 ? 0 : 1);
      return {
        signature: Tt.slice(0, Gs),
        recoveryId: r
      };
    } finally {
      It.fill(0), Ue.fill(0), n !== void 0 && yi.fill(0), Tt.fill(0);
    }
  }
  function Rd(e, t, n) {
    Si(e), Gn(t), qc(n);
    try {
      return It.set(e), Ue.set(t), n !== void 0 && yi.set(n), ce.signSchnorr(n === void 0 ? 0 : 1), Tt.slice(0, Gs);
    } finally {
      It.fill(0), Ue.fill(0), n !== void 0 && yi.fill(0), Tt.fill(0);
    }
  }
  function Im(e, t, n, r = false) {
    Si(e), br(t), Zc(n);
    try {
      return It.set(e), Ie.set(t), Tt.set(n), ce.verify(t.length, r === true ? 1 : 0) === 1;
    } finally {
      It.fill(0), Ie.fill(0), Tt.fill(0);
    }
  }
  function Tm(e, t, n, r = false) {
    Si(e), Zc(t), Sb(t), n & 2 && xb(t), Eb(() => Od(t.subarray(0, 32)));
    const i = xi(r);
    try {
      return It.set(e), Tt.set(t), ce.recover(i, n) === 1 ? Ie.slice(0, i) : null;
    } finally {
      It.fill(0), Tt.fill(0), Ie.fill(0);
    }
  }
  function Am(e, t, n) {
    Si(e), hs(t), Zc(n);
    try {
      return It.set(e), xt.set(t), Tt.set(n), ce.verifySchnorr() === 1;
    } finally {
      It.fill(0), xt.fill(0), Tt.fill(0);
    }
  }
  const km = Object.freeze(Object.defineProperty({
    __proto__: null,
    __initializeContext: fm,
    isPoint: um,
    isPointCompressed: lm,
    isPrivate: Hd,
    isXOnlyPoint: Od,
    pointAdd: hm,
    pointAddScalar: dm,
    pointCompress: pm,
    pointFromScalar: Ud,
    pointMultiply: wm,
    privateAdd: bm,
    privateNegate: _m,
    privateSub: mm,
    recover: Tm,
    sign: xm,
    signRecoverable: vm,
    signSchnorr: Rd,
    verify: Im,
    verifySchnorr: Am,
    xOnlyPointAddTweak: Em,
    xOnlyPointAddTweakCheck: Sm,
    xOnlyPointFromPoint: gm,
    xOnlyPointFromScalar: ym
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const Bm = {
    p: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
    n: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
    b: 7n,
    Gx: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
    Gy: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
  }, { p: ur, n: mr, Gx: Pm, Gy: Om, b: Nd } = Bm, lr = 32, hr = 64, Ze = (e = "") => {
    throw new Error(e);
  }, Cd = (e) => typeof e == "bigint", Ld = (e) => typeof e == "string", Hm = (e) => e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array", _r = (e, t) => !Hm(e) || typeof t == "number" && t > 0 && e.length !== t ? Ze("Uint8Array expected") : e, Fd = (e) => new Uint8Array(e), Um = (e) => Uint8Array.from(e), Md = (e, t) => e.toString(16).padStart(t, "0"), Jc = (e) => Array.from(_r(e)).map((t) => Md(t, 2)).join(""), en = {
    _0: 48,
    _9: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102
  }, Eu = (e) => {
    if (e >= en._0 && e <= en._9) return e - en._0;
    if (e >= en.A && e <= en.F) return e - (en.A - 10);
    if (e >= en.a && e <= en.f) return e - (en.a - 10);
  }, Dd = (e) => {
    const t = "hex invalid";
    if (!Ld(e)) return Ze(t);
    const n = e.length, r = n / 2;
    if (n % 2) return Ze(t);
    const i = Fd(r);
    for (let o = 0, s = 0; o < r; o++, s += 2) {
      const a = Eu(e.charCodeAt(s)), f = Eu(e.charCodeAt(s + 1));
      if (a === void 0 || f === void 0) return Ze(t);
      i[o] = a * 16 + f;
    }
    return i;
  }, dr = (e, t) => _r(Ld(e) ? Dd(e) : Um(_r(e)), t), ds = (...e) => {
    const t = Fd(e.reduce((r, i) => r + _r(i).length, 0));
    let n = 0;
    return e.forEach((r) => {
      t.set(r, n), n += r.length;
    }), t;
  }, gi = BigInt, go = (e, t, n, r = "bad number: out of range") => Cd(e) && t <= e && e < n ? e : Ze(r), X = (e, t = ur) => {
    const n = e % t;
    return n >= 0n ? n : t + n;
  }, pr = (e) => X(e, mr), Qc = (e, t) => {
    (e === 0n || t <= 0n) && Ze("no inverse n=" + e + " mod=" + t);
    let n = X(e, t), r = t, i = 0n, o = 1n;
    for (; n !== 0n; ) {
      const s = r / n, a = r % n, f = i - o * s;
      r = n, n = a, i = o, o = f;
    }
    return r === 1n ? X(i, t) : Ze("no inverse");
  }, Su = (e) => e instanceof Kr ? e : Ze("Point expected"), Kd = (e) => X(X(e * e) * e + Nd), xu = (e) => go(e, 0n, ur), zi = (e) => go(e, 1n, ur), rc = (e) => go(e, 1n, mr), ic = (e) => (e & 1n) === 0n, $d = (e) => Uint8Array.of(e), Vd = (e) => $d(ic(e) ? 2 : 3), Rm = (e) => {
    const t = Kd(zi(e));
    let n = 1n;
    for (let r = t, i = (ur + 1n) / 4n; i > 0n; i >>= 1n) i & 1n && (n = n * r % ur), r = r * r % ur;
    return X(n * n) === t ? n : Ze("sqrt invalid");
  };
  let Kr = (_a2 = class {
    constructor(t, n, r) {
      __publicField(this, "px");
      __publicField(this, "py");
      __publicField(this, "pz");
      this.px = xu(t), this.py = zi(n), this.pz = xu(r), Object.freeze(this);
    }
    static fromBytes(t) {
      _r(t);
      let n;
      const r = t[0], i = t.subarray(1), o = ps(i, 0, lr), s = t.length;
      if (s === lr + 1 && [
        2,
        3
      ].includes(r)) {
        let a = Rm(o);
        const f = ic(a);
        ic(gi(r)) !== f && (a = X(-a)), n = new _a2(o, a, 1n);
      }
      return s === hr + 1 && r === 4 && (n = new _a2(o, ps(i, lr, hr), 1n)), n ? n.assertValidity() : Ze("bad point: not on curve");
    }
    equals(t) {
      const { px: n, py: r, pz: i } = this, { px: o, py: s, pz: a } = Su(t), f = X(n * a), u = X(o * i), c = X(r * a), p = X(s * i);
      return f === u && c === p;
    }
    is0() {
      return this.equals(Jn);
    }
    negate() {
      return new _a2(this.px, X(-this.py), this.pz);
    }
    double() {
      return this.add(this);
    }
    add(t) {
      const { px: n, py: r, pz: i } = this, { px: o, py: s, pz: a } = Su(t), f = 0n, u = Nd;
      let c = 0n, p = 0n, y = 0n;
      const d = X(u * 3n);
      let w = X(n * o), b = X(r * s), S = X(i * a), A = X(n + r), O = X(o + s);
      A = X(A * O), O = X(w + b), A = X(A - O), O = X(n + i);
      let E = X(o + a);
      return O = X(O * E), E = X(w + S), O = X(O - E), E = X(r + i), c = X(s + a), E = X(E * c), c = X(b + S), E = X(E - c), y = X(f * O), c = X(d * S), y = X(c + y), c = X(b - y), y = X(b + y), p = X(c * y), b = X(w + w), b = X(b + w), S = X(f * S), O = X(d * O), b = X(b + S), S = X(w - S), S = X(f * S), O = X(O + S), w = X(b * O), p = X(p + w), w = X(E * O), c = X(A * c), c = X(c - w), w = X(A * b), y = X(E * y), y = X(y + w), new _a2(c, p, y);
    }
    multiply(t, n = true) {
      if (!n && t === 0n) return Jn;
      if (rc(t), t === 1n) return this;
      if (this.equals(yr)) return $m(t).p;
      let r = Jn, i = yr;
      for (let o = this; t > 0n; o = o.double(), t >>= 1n) t & 1n ? r = r.add(o) : n && (i = i.add(o));
      return r;
    }
    toAffine() {
      const { px: t, py: n, pz: r } = this;
      if (this.equals(Jn)) return {
        x: 0n,
        y: 0n
      };
      if (r === 1n) return {
        x: t,
        y: n
      };
      const i = Qc(r, ur);
      return X(r * i) !== 1n && Ze("inverse invalid"), {
        x: X(t * i),
        y: X(n * i)
      };
    }
    assertValidity() {
      const { x: t, y: n } = this.toAffine();
      return zi(t), zi(n), X(n * n) === Kd(t) ? this : Ze("bad point: not on curve");
    }
    toBytes(t = true) {
      const { x: n, y: r } = this.assertValidity().toAffine(), i = Ji(n);
      return t ? ds(Vd(r), i) : ds($d(4), i, Ji(r));
    }
    static fromAffine(t) {
      const { x: n, y: r } = t;
      return n === 0n && r === 0n ? Jn : new _a2(n, r, 1n);
    }
    toHex(t) {
      return Jc(this.toBytes(t));
    }
    static fromPrivateKey(t) {
      return yr.multiply(Cm(t));
    }
    static fromHex(t) {
      return _a2.fromBytes(dr(t));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    toRawBytes(t) {
      return this.toBytes(t);
    }
  }, __publicField(_a2, "BASE"), __publicField(_a2, "ZERO"), _a2);
  const yr = new Kr(Pm, Om, 1n), Jn = new Kr(0n, 1n, 0n);
  Kr.BASE = yr;
  Kr.ZERO = Jn;
  const zd = (e, t, n) => yr.multiply(t, false).add(e.multiply(n, false)).assertValidity(), ef = (e) => gi("0x" + (Jc(e) || "0")), ps = (e, t, n) => ef(e.subarray(t, n)), Nm = 2n ** 256n, Ji = (e) => Dd(Md(go(e, 0n, Nm), hr)), Cm = (e) => {
    const t = Cd(e) ? e : ef(dr(e, lr));
    return go(t, 1n, mr, "private key invalid 3");
  }, oc = (e) => e > mr >> 1n;
  class hn {
    constructor(t, n, r) {
      __publicField(this, "r");
      __publicField(this, "s");
      __publicField(this, "recovery");
      this.r = rc(t), this.s = rc(n), r != null && (this.recovery = r), Object.freeze(this);
    }
    static fromBytes(t) {
      _r(t, hr);
      const n = ps(t, 0, lr), r = ps(t, lr, hr);
      return new hn(n, r);
    }
    toBytes() {
      const { r: t, s: n } = this;
      return ds(Ji(t), Ji(n));
    }
    addRecoveryBit(t) {
      return new hn(this.r, this.s, t);
    }
    hasHighS() {
      return oc(this.s);
    }
    toCompactRawBytes() {
      return this.toBytes();
    }
    toCompactHex() {
      return Jc(this.toBytes());
    }
    recoverPublicKey(t) {
      return Mm(this, t);
    }
    static fromCompact(t) {
      return hn.fromBytes(dr(t, hr));
    }
    assertValidity() {
      return this;
    }
    normalizeS() {
      const { r: t, s: n, recovery: r } = this;
      return oc(n) ? new hn(t, pr(-n), r) : this;
    }
  }
  const Lm = (e) => {
    const t = e.length * 8 - 256;
    t > 1024 && Ze("msg invalid");
    const n = ef(e);
    return t > 0 ? n >> gi(t) : n;
  }, jd = (e) => pr(Lm(_r(e))), Fm = {
    lowS: true
  }, vu = (e, t, n, r = Fm) => {
    let { lowS: i } = r;
    i == null && (i = true), "strict" in r && Ze("option not supported");
    let o;
    const s = e && typeof e == "object" && "r" in e;
    !s && dr(e).length !== hr && Ze("signature must be 64 bytes");
    try {
      o = s ? new hn(e.r, e.s) : hn.fromCompact(e);
      const a = jd(dr(t)), f = Kr.fromBytes(dr(n)), { r: u, s: c } = o;
      if (i && oc(c)) return false;
      const p = Qc(c, mr), y = pr(a * p), d = pr(u * p), w = zd(f, y, d).toAffine();
      return pr(w.x) === u;
    } catch {
      return false;
    }
  }, Mm = (e, t) => {
    const { r: n, s: r, recovery: i } = e;
    [
      0,
      1,
      2,
      3
    ].includes(i) || Ze("recovery id invalid");
    const o = jd(dr(t, lr)), s = i === 2 || i === 3 ? n + mr : n;
    zi(s);
    const a = Vd(gi(i)), f = ds(a, Ji(s)), u = Kr.fromBytes(f), c = Qc(s, mr), p = pr(-o * c), y = pr(r * c);
    return zd(u, p, y);
  }, ys = 8, Dm = 256, Wd = Math.ceil(Dm / ys) + 1, sc = 2 ** (ys - 1), Km = () => {
    const e = [];
    let t = yr, n = t;
    for (let r = 0; r < Wd; r++) {
      n = t, e.push(n);
      for (let i = 1; i < sc; i++) n = n.add(t), e.push(n);
      t = n.double();
    }
    return e;
  };
  let Iu;
  const Tu = (e, t) => {
    const n = t.negate();
    return e ? n : t;
  }, $m = (e) => {
    const t = Iu || (Iu = Km());
    let n = Jn, r = yr;
    const i = 2 ** ys, o = i, s = gi(i - 1), a = gi(ys);
    for (let f = 0; f < Wd; f++) {
      let u = Number(e & s);
      e >>= a, u > sc && (u -= o, e += 1n);
      const c = f * sc, p = c, y = c + Math.abs(u) - 1, d = f % 2 !== 0, w = u < 0;
      u === 0 ? r = r.add(Tu(d, t[p])) : n = n.add(Tu(w, t[y]));
    }
    return {
      p: n,
      f: r
    };
  }, Xr = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  function Xs(e) {
    return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
  }
  function ac(e) {
    if (!Number.isSafeInteger(e) || e < 0) throw new Error("positive integer expected, got " + e);
  }
  function ht(e, ...t) {
    if (!Xs(e)) throw new Error("Uint8Array expected");
    if (t.length > 0 && !t.includes(e.length)) throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
  }
  function Gd(e) {
    if (typeof e != "function" || typeof e.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
    ac(e.outputLen), ac(e.blockLen);
  }
  function gs(e, t = true) {
    if (e.destroyed) throw new Error("Hash instance has been destroyed");
    if (t && e.finished) throw new Error("Hash#digest() has already been called");
  }
  function Vm(e, t) {
    ht(e);
    const n = t.outputLen;
    if (e.length < n) throw new Error("digestInto() expects output buffer of length at least " + n);
  }
  function zn(...e) {
    for (let t = 0; t < e.length; t++) e[t].fill(0);
  }
  function fi(e) {
    return new DataView(e.buffer, e.byteOffset, e.byteLength);
  }
  function Lt(e, t) {
    return e << 32 - t | e >>> t;
  }
  function Fo(e, t) {
    return e << t | e >>> 32 - t >>> 0;
  }
  const Xd = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", zm = Array.from({
    length: 256
  }, (e, t) => t.toString(16).padStart(2, "0"));
  function gr(e) {
    if (ht(e), Xd) return e.toHex();
    let t = "";
    for (let n = 0; n < e.length; n++) t += zm[e[n]];
    return t;
  }
  const tn = {
    _0: 48,
    _9: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102
  };
  function Au(e) {
    if (e >= tn._0 && e <= tn._9) return e - tn._0;
    if (e >= tn.A && e <= tn.F) return e - (tn.A - 10);
    if (e >= tn.a && e <= tn.f) return e - (tn.a - 10);
  }
  function Qi(e) {
    if (typeof e != "string") throw new Error("hex string expected, got " + typeof e);
    if (Xd) return Uint8Array.fromHex(e);
    const t = e.length, n = t / 2;
    if (t % 2) throw new Error("hex string expected, got unpadded hex of length " + t);
    const r = new Uint8Array(n);
    for (let i = 0, o = 0; i < n; i++, o += 2) {
      const s = Au(e.charCodeAt(o)), a = Au(e.charCodeAt(o + 1));
      if (s === void 0 || a === void 0) {
        const f = e[o] + e[o + 1];
        throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + o);
      }
      r[i] = s * 16 + a;
    }
    return r;
  }
  function qd(e) {
    if (typeof e != "string") throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(e));
  }
  function tf(e) {
    return typeof e == "string" && (e = qd(e)), ht(e), e;
  }
  function _t(...e) {
    let t = 0;
    for (let r = 0; r < e.length; r++) {
      const i = e[r];
      ht(i), t += i.length;
    }
    const n = new Uint8Array(t);
    for (let r = 0, i = 0; r < e.length; r++) {
      const o = e[r];
      n.set(o, i), i += o.length;
    }
    return n;
  }
  class Zd {
  }
  function nf(e) {
    const t = (r) => e().update(tf(r)).digest(), n = e();
    return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
  }
  function Yd(e = 32) {
    if (Xr && typeof Xr.getRandomValues == "function") return Xr.getRandomValues(new Uint8Array(e));
    if (Xr && typeof Xr.randomBytes == "function") return Uint8Array.from(Xr.randomBytes(e));
    throw new Error("crypto.getRandomValues must be defined");
  }
  const rf = BigInt(0), cc = BigInt(1);
  function ws(e, t = "") {
    if (typeof e != "boolean") {
      const n = t && `"${t}"`;
      throw new Error(n + "expected boolean, got type=" + typeof e);
    }
    return e;
  }
  function er(e, t, n = "") {
    const r = Xs(e), i = e == null ? void 0 : e.length, o = t !== void 0;
    if (!r || o && i !== t) {
      const s = n && `"${n}" `, a = o ? ` of length ${t}` : "", f = r ? `length=${i}` : `type=${typeof e}`;
      throw new Error(s + "expected Uint8Array" + a + ", got " + f);
    }
    return e;
  }
  function Mo(e) {
    const t = e.toString(16);
    return t.length & 1 ? "0" + t : t;
  }
  function Jd(e) {
    if (typeof e != "string") throw new Error("hex string expected, got " + typeof e);
    return e === "" ? rf : BigInt("0x" + e);
  }
  function qs(e) {
    return Jd(gr(e));
  }
  function Qd(e) {
    return ht(e), Jd(gr(Uint8Array.from(e).reverse()));
  }
  function of(e, t) {
    return Qi(e.toString(16).padStart(t * 2, "0"));
  }
  function e0(e, t) {
    return of(e, t).reverse();
  }
  function st(e, t, n) {
    let r;
    if (typeof t == "string") try {
      r = Qi(t);
    } catch (i) {
      throw new Error(e + " must be hex string or Uint8Array, cause: " + i);
    }
    else if (Xs(t)) r = Uint8Array.from(t);
    else throw new Error(e + " must be hex string or Uint8Array");
    return r.length, r;
  }
  const xa = (e) => typeof e == "bigint" && rf <= e;
  function jm(e, t, n) {
    return xa(e) && xa(t) && xa(n) && t <= e && e < n;
  }
  function Wm(e, t, n, r) {
    if (!jm(t, n, r)) throw new Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
  }
  function t0(e) {
    let t;
    for (t = 0; e > rf; e >>= cc, t += 1) ;
    return t;
  }
  const wo = (e) => (cc << BigInt(e)) - cc;
  function Gm(e, t, n) {
    if (typeof e != "number" || e < 2) throw new Error("hashLen must be a number");
    if (typeof t != "number" || t < 2) throw new Error("qByteLen must be a number");
    if (typeof n != "function") throw new Error("hmacFn must be a function");
    const r = (d) => new Uint8Array(d), i = (d) => Uint8Array.of(d);
    let o = r(e), s = r(e), a = 0;
    const f = () => {
      o.fill(1), s.fill(0), a = 0;
    }, u = (...d) => n(s, o, ...d), c = (d = r(0)) => {
      s = u(i(0), d), o = u(), d.length !== 0 && (s = u(i(1), d), o = u());
    }, p = () => {
      if (a++ >= 1e3) throw new Error("drbg: tried 1000 values");
      let d = 0;
      const w = [];
      for (; d < t; ) {
        o = u();
        const b = o.slice();
        w.push(b), d += o.length;
      }
      return _t(...w);
    };
    return (d, w) => {
      f(), c(d);
      let b;
      for (; !(b = w(p())); ) c();
      return f(), b;
    };
  }
  function sf(e, t, n = {}) {
    if (!e || typeof e != "object") throw new Error("expected valid options object");
    function r(i, o, s) {
      const a = e[i];
      if (s && a === void 0) return;
      const f = typeof a;
      if (f !== o || a === null) throw new Error(`param "${i}" is invalid: expected ${o}, got ${f}`);
    }
    Object.entries(t).forEach(([i, o]) => r(i, o, false)), Object.entries(n).forEach(([i, o]) => r(i, o, true));
  }
  function ku(e) {
    const t = /* @__PURE__ */ new WeakMap();
    return (n, ...r) => {
      const i = t.get(n);
      if (i !== void 0) return i;
      const o = e(n, ...r);
      return t.set(n, o), o;
    };
  }
  const ct = BigInt(0), it = BigInt(1), tr = BigInt(2), n0 = BigInt(3), r0 = BigInt(4), i0 = BigInt(5), Xm = BigInt(7), o0 = BigInt(8), qm = BigInt(9), s0 = BigInt(16);
  function mt(e, t) {
    const n = e % t;
    return n >= ct ? n : t + n;
  }
  function wt(e, t, n) {
    let r = e;
    for (; t-- > ct; ) r *= r, r %= n;
    return r;
  }
  function Bu(e, t) {
    if (e === ct) throw new Error("invert: expected non-zero number");
    if (t <= ct) throw new Error("invert: expected positive modulus, got " + t);
    let n = mt(e, t), r = t, i = ct, o = it;
    for (; n !== ct; ) {
      const a = r / n, f = r % n, u = i - o * a;
      r = n, n = f, i = o, o = u;
    }
    if (r !== it) throw new Error("invert: does not exist");
    return mt(i, t);
  }
  function af(e, t, n) {
    if (!e.eql(e.sqr(t), n)) throw new Error("Cannot find square root");
  }
  function a0(e, t) {
    const n = (e.ORDER + it) / r0, r = e.pow(t, n);
    return af(e, r, t), r;
  }
  function Zm(e, t) {
    const n = (e.ORDER - i0) / o0, r = e.mul(t, tr), i = e.pow(r, n), o = e.mul(t, i), s = e.mul(e.mul(o, tr), i), a = e.mul(o, e.sub(s, e.ONE));
    return af(e, a, t), a;
  }
  function Ym(e) {
    const t = bo(e), n = c0(e), r = n(t, t.neg(t.ONE)), i = n(t, r), o = n(t, t.neg(r)), s = (e + Xm) / s0;
    return (a, f) => {
      let u = a.pow(f, s), c = a.mul(u, r);
      const p = a.mul(u, i), y = a.mul(u, o), d = a.eql(a.sqr(c), f), w = a.eql(a.sqr(p), f);
      u = a.cmov(u, c, d), c = a.cmov(y, p, w);
      const b = a.eql(a.sqr(c), f), S = a.cmov(u, c, b);
      return af(a, S, f), S;
    };
  }
  function c0(e) {
    if (e < n0) throw new Error("sqrt is not defined for small field");
    let t = e - it, n = 0;
    for (; t % tr === ct; ) t /= tr, n++;
    let r = tr;
    const i = bo(e);
    for (; Pu(i, r) === 1; ) if (r++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
    if (n === 1) return a0;
    let o = i.pow(r, t);
    const s = (t + it) / tr;
    return function(f, u) {
      if (f.is0(u)) return u;
      if (Pu(f, u) !== 1) throw new Error("Cannot find square root");
      let c = n, p = f.mul(f.ONE, o), y = f.pow(u, t), d = f.pow(u, s);
      for (; !f.eql(y, f.ONE); ) {
        if (f.is0(y)) return f.ZERO;
        let w = 1, b = f.sqr(y);
        for (; !f.eql(b, f.ONE); ) if (w++, b = f.sqr(b), w === c) throw new Error("Cannot find square root");
        const S = it << BigInt(c - w - 1), A = f.pow(p, S);
        c = w, p = f.sqr(A), y = f.mul(y, p), d = f.mul(d, A);
      }
      return d;
    };
  }
  function Jm(e) {
    return e % r0 === n0 ? a0 : e % o0 === i0 ? Zm : e % s0 === qm ? Ym(e) : c0(e);
  }
  const Qm = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function e_(e) {
    const t = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "number",
      BITS: "number"
    }, n = Qm.reduce((r, i) => (r[i] = "function", r), t);
    return sf(e, n), e;
  }
  function t_(e, t, n) {
    if (n < ct) throw new Error("invalid exponent, negatives unsupported");
    if (n === ct) return e.ONE;
    if (n === it) return t;
    let r = e.ONE, i = t;
    for (; n > ct; ) n & it && (r = e.mul(r, i)), i = e.sqr(i), n >>= it;
    return r;
  }
  function f0(e, t, n = false) {
    const r = new Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((s, a, f) => e.is0(a) ? s : (r[f] = s, e.mul(s, a)), e.ONE), o = e.inv(i);
    return t.reduceRight((s, a, f) => e.is0(a) ? s : (r[f] = e.mul(s, r[f]), e.mul(s, a)), o), r;
  }
  function Pu(e, t) {
    const n = (e.ORDER - it) / tr, r = e.pow(t, n), i = e.eql(r, e.ONE), o = e.eql(r, e.ZERO), s = e.eql(r, e.neg(e.ONE));
    if (!i && !o && !s) throw new Error("invalid Legendre symbol result");
    return i ? 1 : o ? 0 : -1;
  }
  function u0(e, t) {
    t !== void 0 && ac(t);
    const n = t !== void 0 ? t : e.toString(2).length, r = Math.ceil(n / 8);
    return {
      nBitLength: n,
      nByteLength: r
    };
  }
  function bo(e, t, n = false, r = {}) {
    if (e <= ct) throw new Error("invalid field: expected ORDER > 0, got " + e);
    let i, o, s = false, a;
    if (typeof t == "object" && t != null) {
      if (r.sqrt || n) throw new Error("cannot specify opts in two arguments");
      const y = t;
      y.BITS && (i = y.BITS), y.sqrt && (o = y.sqrt), typeof y.isLE == "boolean" && (n = y.isLE), typeof y.modFromBytes == "boolean" && (s = y.modFromBytes), a = y.allowedLengths;
    } else typeof t == "number" && (i = t), r.sqrt && (o = r.sqrt);
    const { nBitLength: f, nByteLength: u } = u0(e, i);
    if (u > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    let c;
    const p = Object.freeze({
      ORDER: e,
      isLE: n,
      BITS: f,
      BYTES: u,
      MASK: wo(f),
      ZERO: ct,
      ONE: it,
      allowedLengths: a,
      create: (y) => mt(y, e),
      isValid: (y) => {
        if (typeof y != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof y);
        return ct <= y && y < e;
      },
      is0: (y) => y === ct,
      isValidNot0: (y) => !p.is0(y) && p.isValid(y),
      isOdd: (y) => (y & it) === it,
      neg: (y) => mt(-y, e),
      eql: (y, d) => y === d,
      sqr: (y) => mt(y * y, e),
      add: (y, d) => mt(y + d, e),
      sub: (y, d) => mt(y - d, e),
      mul: (y, d) => mt(y * d, e),
      pow: (y, d) => t_(p, y, d),
      div: (y, d) => mt(y * Bu(d, e), e),
      sqrN: (y) => y * y,
      addN: (y, d) => y + d,
      subN: (y, d) => y - d,
      mulN: (y, d) => y * d,
      inv: (y) => Bu(y, e),
      sqrt: o || ((y) => (c || (c = Jm(e)), c(p, y))),
      toBytes: (y) => n ? e0(y, u) : of(y, u),
      fromBytes: (y, d = true) => {
        if (a) {
          if (!a.includes(y.length) || y.length > u) throw new Error("Field.fromBytes: expected " + a + " bytes, got " + y.length);
          const b = new Uint8Array(u);
          b.set(y, n ? 0 : b.length - y.length), y = b;
        }
        if (y.length !== u) throw new Error("Field.fromBytes: expected " + u + " bytes, got " + y.length);
        let w = n ? Qd(y) : qs(y);
        if (s && (w = mt(w, e)), !d && !p.isValid(w)) throw new Error("invalid field element: outside of range 0..ORDER");
        return w;
      },
      invertBatch: (y) => f0(p, y),
      cmov: (y, d, w) => w ? d : y
    });
    return Object.freeze(p);
  }
  function l0(e) {
    if (typeof e != "bigint") throw new Error("field order must be bigint");
    const t = e.toString(2).length;
    return Math.ceil(t / 8);
  }
  function h0(e) {
    const t = l0(e);
    return t + Math.ceil(t / 2);
  }
  function n_(e, t, n = false) {
    const r = e.length, i = l0(t), o = h0(t);
    if (r < 16 || r < o || r > 1024) throw new Error("expected " + o + "-1024 bytes of input, got " + r);
    const s = n ? Qd(e) : qs(e), a = mt(s, t - it) + it;
    return n ? e0(a, i) : of(a, i);
  }
  function r_(e, t, n, r) {
    if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, n, r);
    const i = BigInt(32), o = BigInt(4294967295), s = Number(n >> i & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
    e.setUint32(t + f, s, r), e.setUint32(t + u, a, r);
  }
  function i_(e, t, n) {
    return e & t ^ ~e & n;
  }
  function o_(e, t, n) {
    return e & t ^ e & n ^ t & n;
  }
  class cf extends Zd {
    constructor(t, n, r, i) {
      super(), this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(t), this.view = fi(this.buffer);
    }
    update(t) {
      gs(this), t = tf(t), ht(t);
      const { view: n, buffer: r, blockLen: i } = this, o = t.length;
      for (let s = 0; s < o; ) {
        const a = Math.min(i - this.pos, o - s);
        if (a === i) {
          const f = fi(t);
          for (; i <= o - s; s += i) this.process(f, s);
          continue;
        }
        r.set(t.subarray(s, s + a), this.pos), this.pos += a, s += a, this.pos === i && (this.process(n, 0), this.pos = 0);
      }
      return this.length += t.length, this.roundClean(), this;
    }
    digestInto(t) {
      gs(this), Vm(t, this), this.finished = true;
      const { buffer: n, view: r, blockLen: i, isLE: o } = this;
      let { pos: s } = this;
      n[s++] = 128, zn(this.buffer.subarray(s)), this.padOffset > i - s && (this.process(r, 0), s = 0);
      for (let p = s; p < i; p++) n[p] = 0;
      r_(r, i - 8, BigInt(this.length * 8), o), this.process(r, 0);
      const a = fi(t), f = this.outputLen;
      if (f % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
      const u = f / 4, c = this.get();
      if (u > c.length) throw new Error("_sha2: outputLen bigger than state");
      for (let p = 0; p < u; p++) a.setUint32(4 * p, c[p], o);
    }
    digest() {
      const { buffer: t, outputLen: n } = this;
      this.digestInto(t);
      const r = t.slice(0, n);
      return this.destroy(), r;
    }
    _cloneInto(t) {
      t || (t = new this.constructor()), t.set(...this.get());
      const { blockLen: n, buffer: r, length: i, finished: o, destroyed: s, pos: a } = this;
      return t.destroyed = s, t.finished = o, t.length = i, t.pos = a, i % n && t.buffer.set(r), t;
    }
    clone() {
      return this._cloneInto();
    }
  }
  const kn = Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]), Ge = Uint32Array.from([
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ]), Do = BigInt(2 ** 32 - 1), Ou = BigInt(32);
  function s_(e, t = false) {
    return t ? {
      h: Number(e & Do),
      l: Number(e >> Ou & Do)
    } : {
      h: Number(e >> Ou & Do) | 0,
      l: Number(e & Do) | 0
    };
  }
  function a_(e, t = false) {
    const n = e.length;
    let r = new Uint32Array(n), i = new Uint32Array(n);
    for (let o = 0; o < n; o++) {
      const { h: s, l: a } = s_(e[o], t);
      [r[o], i[o]] = [
        s,
        a
      ];
    }
    return [
      r,
      i
    ];
  }
  const Hu = (e, t, n) => e >>> n, Uu = (e, t, n) => e << 32 - n | t >>> n, qr = (e, t, n) => e >>> n | t << 32 - n, Zr = (e, t, n) => e << 32 - n | t >>> n, Ko = (e, t, n) => e << 64 - n | t >>> n - 32, $o = (e, t, n) => e >>> n - 32 | t << 64 - n;
  function nn(e, t, n, r) {
    const i = (t >>> 0) + (r >>> 0);
    return {
      h: e + n + (i / 2 ** 32 | 0) | 0,
      l: i | 0
    };
  }
  const c_ = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), f_ = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, u_ = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), l_ = (e, t, n, r, i) => t + n + r + i + (e / 2 ** 32 | 0) | 0, h_ = (e, t, n, r, i) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), d_ = (e, t, n, r, i, o) => t + n + r + i + o + (e / 2 ** 32 | 0) | 0, p_ = Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]), Bn = new Uint32Array(64);
  class y_ extends cf {
    constructor(t = 32) {
      super(64, t, 8, false), this.A = kn[0] | 0, this.B = kn[1] | 0, this.C = kn[2] | 0, this.D = kn[3] | 0, this.E = kn[4] | 0, this.F = kn[5] | 0, this.G = kn[6] | 0, this.H = kn[7] | 0;
    }
    get() {
      const { A: t, B: n, C: r, D: i, E: o, F: s, G: a, H: f } = this;
      return [
        t,
        n,
        r,
        i,
        o,
        s,
        a,
        f
      ];
    }
    set(t, n, r, i, o, s, a, f) {
      this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = o | 0, this.F = s | 0, this.G = a | 0, this.H = f | 0;
    }
    process(t, n) {
      for (let p = 0; p < 16; p++, n += 4) Bn[p] = t.getUint32(n, false);
      for (let p = 16; p < 64; p++) {
        const y = Bn[p - 15], d = Bn[p - 2], w = Lt(y, 7) ^ Lt(y, 18) ^ y >>> 3, b = Lt(d, 17) ^ Lt(d, 19) ^ d >>> 10;
        Bn[p] = b + Bn[p - 7] + w + Bn[p - 16] | 0;
      }
      let { A: r, B: i, C: o, D: s, E: a, F: f, G: u, H: c } = this;
      for (let p = 0; p < 64; p++) {
        const y = Lt(a, 6) ^ Lt(a, 11) ^ Lt(a, 25), d = c + y + i_(a, f, u) + p_[p] + Bn[p] | 0, b = (Lt(r, 2) ^ Lt(r, 13) ^ Lt(r, 22)) + o_(r, i, o) | 0;
        c = u, u = f, f = a, a = s + d | 0, s = o, o = i, i = r, r = d + b | 0;
      }
      r = r + this.A | 0, i = i + this.B | 0, o = o + this.C | 0, s = s + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, c = c + this.H | 0, this.set(r, i, o, s, a, f, u, c);
    }
    roundClean() {
      zn(Bn);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), zn(this.buffer);
    }
  }
  const d0 = a_([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((e) => BigInt(e))), g_ = d0[0], w_ = d0[1], Pn = new Uint32Array(80), On = new Uint32Array(80);
  class b_ extends cf {
    constructor(t = 64) {
      super(128, t, 16, false), this.Ah = Ge[0] | 0, this.Al = Ge[1] | 0, this.Bh = Ge[2] | 0, this.Bl = Ge[3] | 0, this.Ch = Ge[4] | 0, this.Cl = Ge[5] | 0, this.Dh = Ge[6] | 0, this.Dl = Ge[7] | 0, this.Eh = Ge[8] | 0, this.El = Ge[9] | 0, this.Fh = Ge[10] | 0, this.Fl = Ge[11] | 0, this.Gh = Ge[12] | 0, this.Gl = Ge[13] | 0, this.Hh = Ge[14] | 0, this.Hl = Ge[15] | 0;
    }
    get() {
      const { Ah: t, Al: n, Bh: r, Bl: i, Ch: o, Cl: s, Dh: a, Dl: f, Eh: u, El: c, Fh: p, Fl: y, Gh: d, Gl: w, Hh: b, Hl: S } = this;
      return [
        t,
        n,
        r,
        i,
        o,
        s,
        a,
        f,
        u,
        c,
        p,
        y,
        d,
        w,
        b,
        S
      ];
    }
    set(t, n, r, i, o, s, a, f, u, c, p, y, d, w, b, S) {
      this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = o | 0, this.Cl = s | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = c | 0, this.Fh = p | 0, this.Fl = y | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = b | 0, this.Hl = S | 0;
    }
    process(t, n) {
      for (let E = 0; E < 16; E++, n += 4) Pn[E] = t.getUint32(n), On[E] = t.getUint32(n += 4);
      for (let E = 16; E < 80; E++) {
        const m = Pn[E - 15] | 0, k = On[E - 15] | 0, T = qr(m, k, 1) ^ qr(m, k, 8) ^ Hu(m, k, 7), R = Zr(m, k, 1) ^ Zr(m, k, 8) ^ Uu(m, k, 7), M = Pn[E - 2] | 0, v = On[E - 2] | 0, H = qr(M, v, 19) ^ Ko(M, v, 61) ^ Hu(M, v, 6), D = Zr(M, v, 19) ^ $o(M, v, 61) ^ Uu(M, v, 6), $ = u_(R, D, On[E - 7], On[E - 16]), N = l_($, T, H, Pn[E - 7], Pn[E - 16]);
        Pn[E] = N | 0, On[E] = $ | 0;
      }
      let { Ah: r, Al: i, Bh: o, Bl: s, Ch: a, Cl: f, Dh: u, Dl: c, Eh: p, El: y, Fh: d, Fl: w, Gh: b, Gl: S, Hh: A, Hl: O } = this;
      for (let E = 0; E < 80; E++) {
        const m = qr(p, y, 14) ^ qr(p, y, 18) ^ Ko(p, y, 41), k = Zr(p, y, 14) ^ Zr(p, y, 18) ^ $o(p, y, 41), T = p & d ^ ~p & b, R = y & w ^ ~y & S, M = h_(O, k, R, w_[E], On[E]), v = d_(M, A, m, T, g_[E], Pn[E]), H = M | 0, D = qr(r, i, 28) ^ Ko(r, i, 34) ^ Ko(r, i, 39), $ = Zr(r, i, 28) ^ $o(r, i, 34) ^ $o(r, i, 39), N = r & o ^ r & a ^ o & a, U = i & s ^ i & f ^ s & f;
        A = b | 0, O = S | 0, b = d | 0, S = w | 0, d = p | 0, w = y | 0, { h: p, l: y } = nn(u | 0, c | 0, v | 0, H | 0), u = a | 0, c = f | 0, a = o | 0, f = s | 0, o = r | 0, s = i | 0;
        const C = c_(H, $, U);
        r = f_(C, v, D, N), i = C | 0;
      }
      ({ h: r, l: i } = nn(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: o, l: s } = nn(this.Bh | 0, this.Bl | 0, o | 0, s | 0), { h: a, l: f } = nn(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: c } = nn(this.Dh | 0, this.Dl | 0, u | 0, c | 0), { h: p, l: y } = nn(this.Eh | 0, this.El | 0, p | 0, y | 0), { h: d, l: w } = nn(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: b, l: S } = nn(this.Gh | 0, this.Gl | 0, b | 0, S | 0), { h: A, l: O } = nn(this.Hh | 0, this.Hl | 0, A | 0, O | 0), this.set(r, i, o, s, a, f, u, c, p, y, d, w, b, S, A, O);
    }
    roundClean() {
      zn(Pn, On);
    }
    destroy() {
      zn(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  const ff = nf(() => new y_()), Ru = nf(() => new b_());
  class p0 extends Zd {
    constructor(t, n) {
      super(), this.finished = false, this.destroyed = false, Gd(t);
      const r = tf(n);
      if (this.iHash = t.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const i = this.blockLen, o = new Uint8Array(i);
      o.set(r.length > i ? t.create().update(r).digest() : r);
      for (let s = 0; s < o.length; s++) o[s] ^= 54;
      this.iHash.update(o), this.oHash = t.create();
      for (let s = 0; s < o.length; s++) o[s] ^= 106;
      this.oHash.update(o), zn(o);
    }
    update(t) {
      return gs(this), this.iHash.update(t), this;
    }
    digestInto(t) {
      gs(this), ht(t, this.outputLen), this.finished = true, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
    }
    digest() {
      const t = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(t), t;
    }
    _cloneInto(t) {
      t || (t = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: n, iHash: r, finished: i, destroyed: o, blockLen: s, outputLen: a } = this;
      return t = t, t.finished = i, t.destroyed = o, t.blockLen = s, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = true, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  const bs = (e, t, n) => new p0(e, t).update(n).digest();
  bs.create = (e, t) => new p0(e, t);
  const wi = BigInt(0), nr = BigInt(1);
  function ms(e, t) {
    const n = t.negate();
    return e ? n : t;
  }
  function va(e, t) {
    const n = f0(e.Fp, t.map((r) => r.Z));
    return t.map((r, i) => e.fromAffine(r.toAffine(n[i])));
  }
  function y0(e, t) {
    if (!Number.isSafeInteger(e) || e <= 0 || e > t) throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
  }
  function Ia(e, t) {
    y0(e, t);
    const n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e, o = wo(e), s = BigInt(e);
    return {
      windows: n,
      windowSize: r,
      mask: o,
      maxNumber: i,
      shiftBy: s
    };
  }
  function Nu(e, t, n) {
    const { windowSize: r, mask: i, maxNumber: o, shiftBy: s } = n;
    let a = Number(e & i), f = e >> s;
    a > r && (a -= o, f += nr);
    const u = t * r, c = u + Math.abs(a) - 1, p = a === 0, y = a < 0, d = t % 2 !== 0;
    return {
      nextN: f,
      offset: c,
      isZero: p,
      isNeg: y,
      isNegF: d,
      offsetF: u
    };
  }
  function m_(e, t) {
    if (!Array.isArray(e)) throw new Error("array expected");
    e.forEach((n, r) => {
      if (!(n instanceof t)) throw new Error("invalid point at index " + r);
    });
  }
  function __(e, t) {
    if (!Array.isArray(e)) throw new Error("array of scalars expected");
    e.forEach((n, r) => {
      if (!t.isValid(n)) throw new Error("invalid scalar at index " + r);
    });
  }
  const Ta = /* @__PURE__ */ new WeakMap(), g0 = /* @__PURE__ */ new WeakMap();
  function Aa(e) {
    return g0.get(e) || 1;
  }
  function Cu(e) {
    if (e !== wi) throw new Error("invalid wNAF");
  }
  class E_ {
    constructor(t, n) {
      this.BASE = t.BASE, this.ZERO = t.ZERO, this.Fn = t.Fn, this.bits = n;
    }
    _unsafeLadder(t, n, r = this.ZERO) {
      let i = t;
      for (; n > wi; ) n & nr && (r = r.add(i)), i = i.double(), n >>= nr;
      return r;
    }
    precomputeWindow(t, n) {
      const { windows: r, windowSize: i } = Ia(n, this.bits), o = [];
      let s = t, a = s;
      for (let f = 0; f < r; f++) {
        a = s, o.push(a);
        for (let u = 1; u < i; u++) a = a.add(s), o.push(a);
        s = a.double();
      }
      return o;
    }
    wNAF(t, n, r) {
      if (!this.Fn.isValid(r)) throw new Error("invalid scalar");
      let i = this.ZERO, o = this.BASE;
      const s = Ia(t, this.bits);
      for (let a = 0; a < s.windows; a++) {
        const { nextN: f, offset: u, isZero: c, isNeg: p, isNegF: y, offsetF: d } = Nu(r, a, s);
        r = f, c ? o = o.add(ms(y, n[d])) : i = i.add(ms(p, n[u]));
      }
      return Cu(r), {
        p: i,
        f: o
      };
    }
    wNAFUnsafe(t, n, r, i = this.ZERO) {
      const o = Ia(t, this.bits);
      for (let s = 0; s < o.windows && r !== wi; s++) {
        const { nextN: a, offset: f, isZero: u, isNeg: c } = Nu(r, s, o);
        if (r = a, !u) {
          const p = n[f];
          i = i.add(c ? p.negate() : p);
        }
      }
      return Cu(r), i;
    }
    getPrecomputes(t, n, r) {
      let i = Ta.get(n);
      return i || (i = this.precomputeWindow(n, t), t !== 1 && (typeof r == "function" && (i = r(i)), Ta.set(n, i))), i;
    }
    cached(t, n, r) {
      const i = Aa(t);
      return this.wNAF(i, this.getPrecomputes(i, t, r), n);
    }
    unsafe(t, n, r, i) {
      const o = Aa(t);
      return o === 1 ? this._unsafeLadder(t, n, i) : this.wNAFUnsafe(o, this.getPrecomputes(o, t, r), n, i);
    }
    createCache(t, n) {
      y0(n, this.bits), g0.set(t, n), Ta.delete(t);
    }
    hasCache(t) {
      return Aa(t) !== 1;
    }
  }
  function S_(e, t, n, r) {
    let i = t, o = e.ZERO, s = e.ZERO;
    for (; n > wi || r > wi; ) n & nr && (o = o.add(i)), r & nr && (s = s.add(i)), i = i.double(), n >>= nr, r >>= nr;
    return {
      p1: o,
      p2: s
    };
  }
  function x_(e, t, n, r) {
    m_(n, e), __(r, t);
    const i = n.length, o = r.length;
    if (i !== o) throw new Error("arrays of points and scalars must have equal length");
    const s = e.ZERO, a = t0(BigInt(i));
    let f = 1;
    a > 12 ? f = a - 3 : a > 4 ? f = a - 2 : a > 0 && (f = 2);
    const u = wo(f), c = new Array(Number(u) + 1).fill(s), p = Math.floor((t.BITS - 1) / f) * f;
    let y = s;
    for (let d = p; d >= 0; d -= f) {
      c.fill(s);
      for (let b = 0; b < o; b++) {
        const S = r[b], A = Number(S >> BigInt(d) & u);
        c[A] = c[A].add(n[b]);
      }
      let w = s;
      for (let b = c.length - 1, S = s; b > 0; b--) S = S.add(c[b]), w = w.add(S);
      if (y = y.add(w), d !== 0) for (let b = 0; b < f; b++) y = y.double();
    }
    return y;
  }
  function Lu(e, t, n) {
    if (t) {
      if (t.ORDER !== e) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
      return e_(t), t;
    } else return bo(e, {
      isLE: n
    });
  }
  function v_(e, t, n = {}, r) {
    if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object") throw new Error(`expected valid ${e} CURVE object`);
    for (const f of [
      "p",
      "n",
      "h"
    ]) {
      const u = t[f];
      if (!(typeof u == "bigint" && u > wi)) throw new Error(`CURVE.${f} must be positive bigint`);
    }
    const i = Lu(t.p, n.Fp, r), o = Lu(t.n, n.Fn, r), a = [
      "Gx",
      "Gy",
      "a",
      "b"
    ];
    for (const f of a) if (!i.isValid(t[f])) throw new Error(`CURVE.${f} must be valid field element of CURVE.Fp`);
    return t = Object.freeze(Object.assign({}, t)), {
      CURVE: t,
      Fp: i,
      Fn: o
    };
  }
  const Fu = (e, t) => (e + (e >= 0 ? t : -t) / w0) / t;
  function I_(e, t, n) {
    const [[r, i], [o, s]] = t, a = Fu(s * e, n), f = Fu(-i * e, n);
    let u = e - a * r - f * o, c = -a * i - f * s;
    const p = u < dn, y = c < dn;
    p && (u = -u), y && (c = -c);
    const d = wo(Math.ceil(t0(n) / 2)) + ui;
    if (u < dn || u >= d || c < dn || c >= d) throw new Error("splitScalar (endomorphism): failed, k=" + e);
    return {
      k1neg: p,
      k1: u,
      k2neg: y,
      k2: c
    };
  }
  function fc(e) {
    if (![
      "compact",
      "recovered",
      "der"
    ].includes(e)) throw new Error('Signature format must be "compact", "recovered", or "der"');
    return e;
  }
  function ka(e, t) {
    const n = {};
    for (let r of Object.keys(t)) n[r] = e[r] === void 0 ? t[r] : e[r];
    return ws(n.lowS, "lowS"), ws(n.prehash, "prehash"), n.format !== void 0 && fc(n.format), n;
  }
  class T_ extends Error {
    constructor(t = "") {
      super(t);
    }
  }
  const cn = {
    Err: T_,
    _tlv: {
      encode: (e, t) => {
        const { Err: n } = cn;
        if (e < 0 || e > 256) throw new n("tlv.encode: wrong tag");
        if (t.length & 1) throw new n("tlv.encode: unpadded data");
        const r = t.length / 2, i = Mo(r);
        if (i.length / 2 & 128) throw new n("tlv.encode: long form length too big");
        const o = r > 127 ? Mo(i.length / 2 | 128) : "";
        return Mo(e) + o + i + t;
      },
      decode(e, t) {
        const { Err: n } = cn;
        let r = 0;
        if (e < 0 || e > 256) throw new n("tlv.encode: wrong tag");
        if (t.length < 2 || t[r++] !== e) throw new n("tlv.decode: wrong tlv");
        const i = t[r++], o = !!(i & 128);
        let s = 0;
        if (!o) s = i;
        else {
          const f = i & 127;
          if (!f) throw new n("tlv.decode(long): indefinite length not supported");
          if (f > 4) throw new n("tlv.decode(long): byte length is too big");
          const u = t.subarray(r, r + f);
          if (u.length !== f) throw new n("tlv.decode: length bytes not complete");
          if (u[0] === 0) throw new n("tlv.decode(long): zero leftmost byte");
          for (const c of u) s = s << 8 | c;
          if (r += f, s < 128) throw new n("tlv.decode(long): not minimal encoding");
        }
        const a = t.subarray(r, r + s);
        if (a.length !== s) throw new n("tlv.decode: wrong value length");
        return {
          v: a,
          l: t.subarray(r + s)
        };
      }
    },
    _int: {
      encode(e) {
        const { Err: t } = cn;
        if (e < dn) throw new t("integer: negative integers are not allowed");
        let n = Mo(e);
        if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
        return n;
      },
      decode(e) {
        const { Err: t } = cn;
        if (e[0] & 128) throw new t("invalid signature integer: negative");
        if (e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
        return qs(e);
      }
    },
    toSig(e) {
      const { Err: t, _int: n, _tlv: r } = cn, i = st("signature", e), { v: o, l: s } = r.decode(48, i);
      if (s.length) throw new t("invalid signature: left bytes after parsing");
      const { v: a, l: f } = r.decode(2, o), { v: u, l: c } = r.decode(2, f);
      if (c.length) throw new t("invalid signature: left bytes after parsing");
      return {
        r: n.decode(a),
        s: n.decode(u)
      };
    },
    hexFromSig(e) {
      const { _tlv: t, _int: n } = cn, r = t.encode(2, n.encode(e.r)), i = t.encode(2, n.encode(e.s)), o = r + i;
      return t.encode(48, o);
    }
  }, dn = BigInt(0), ui = BigInt(1), w0 = BigInt(2), Vo = BigInt(3), A_ = BigInt(4);
  function ii(e, t) {
    const { BYTES: n } = e;
    let r;
    if (typeof t == "bigint") r = t;
    else {
      let i = st("private key", t);
      try {
        r = e.fromBytes(i);
      } catch {
        throw new Error(`invalid private key: expected ui8a of size ${n}, got ${typeof t}`);
      }
    }
    if (!e.isValidNot0(r)) throw new Error("invalid private key: out of range [1..N-1]");
    return r;
  }
  function k_(e, t = {}) {
    const n = v_("weierstrass", e, t), { Fp: r, Fn: i } = n;
    let o = n.CURVE;
    const { h: s, n: a } = o;
    sf(t, {}, {
      allowInfinityPoint: "boolean",
      clearCofactor: "function",
      isTorsionFree: "function",
      fromBytes: "function",
      toBytes: "function",
      endo: "object",
      wrapPrivateKey: "boolean"
    });
    const { endo: f } = t;
    if (f && (!r.is0(o.a) || typeof f.beta != "bigint" || !Array.isArray(f.basises))) throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    const u = m0(r, i);
    function c() {
      if (!r.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
    }
    function p($, N, U) {
      const { x: C, y: K } = N.toAffine(), W = r.toBytes(C);
      if (ws(U, "isCompressed"), U) {
        c();
        const Z = !r.isOdd(K);
        return _t(b0(Z), W);
      } else return _t(Uint8Array.of(4), W, r.toBytes(K));
    }
    function y($) {
      er($, void 0, "Point");
      const { publicKey: N, publicKeyUncompressed: U } = u, C = $.length, K = $[0], W = $.subarray(1);
      if (C === N && (K === 2 || K === 3)) {
        const Z = r.fromBytes(W);
        if (!r.isValid(Z)) throw new Error("bad point: is not on curve, wrong x");
        const I = b(Z);
        let F;
        try {
          F = r.sqrt(I);
        } catch (te) {
          const G = te instanceof Error ? ": " + te.message : "";
          throw new Error("bad point: is not on curve, sqrt error" + G);
        }
        c();
        const V = r.isOdd(F);
        return (K & 1) === 1 !== V && (F = r.neg(F)), {
          x: Z,
          y: F
        };
      } else if (C === U && K === 4) {
        const Z = r.BYTES, I = r.fromBytes(W.subarray(0, Z)), F = r.fromBytes(W.subarray(Z, Z * 2));
        if (!S(I, F)) throw new Error("bad point: is not on curve");
        return {
          x: I,
          y: F
        };
      } else throw new Error(`bad point: got length ${C}, expected compressed=${N} or uncompressed=${U}`);
    }
    const d = t.toBytes || p, w = t.fromBytes || y;
    function b($) {
      const N = r.sqr($), U = r.mul(N, $);
      return r.add(r.add(U, r.mul($, o.a)), o.b);
    }
    function S($, N) {
      const U = r.sqr(N), C = b($);
      return r.eql(U, C);
    }
    if (!S(o.Gx, o.Gy)) throw new Error("bad curve params: generator point");
    const A = r.mul(r.pow(o.a, Vo), A_), O = r.mul(r.sqr(o.b), BigInt(27));
    if (r.is0(r.add(A, O))) throw new Error("bad curve params: a or b");
    function E($, N, U = false) {
      if (!r.isValid(N) || U && r.is0(N)) throw new Error(`bad point coordinate ${$}`);
      return N;
    }
    function m($) {
      if (!($ instanceof v)) throw new Error("ProjectivePoint expected");
    }
    function k($) {
      if (!f || !f.basises) throw new Error("no endo");
      return I_($, f.basises, i.ORDER);
    }
    const T = ku(($, N) => {
      const { X: U, Y: C, Z: K } = $;
      if (r.eql(K, r.ONE)) return {
        x: U,
        y: C
      };
      const W = $.is0();
      N == null && (N = W ? r.ONE : r.inv(K));
      const Z = r.mul(U, N), I = r.mul(C, N), F = r.mul(K, N);
      if (W) return {
        x: r.ZERO,
        y: r.ZERO
      };
      if (!r.eql(F, r.ONE)) throw new Error("invZ was invalid");
      return {
        x: Z,
        y: I
      };
    }), R = ku(($) => {
      if ($.is0()) {
        if (t.allowInfinityPoint && !r.is0($.Y)) return;
        throw new Error("bad point: ZERO");
      }
      const { x: N, y: U } = $.toAffine();
      if (!r.isValid(N) || !r.isValid(U)) throw new Error("bad point: x or y not field elements");
      if (!S(N, U)) throw new Error("bad point: equation left != right");
      if (!$.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
      return true;
    });
    function M($, N, U, C, K) {
      return U = new v(r.mul(U.X, $), U.Y, U.Z), N = ms(C, N), U = ms(K, U), N.add(U);
    }
    class v {
      constructor(N, U, C) {
        this.X = E("x", N), this.Y = E("y", U, true), this.Z = E("z", C), Object.freeze(this);
      }
      static CURVE() {
        return o;
      }
      static fromAffine(N) {
        const { x: U, y: C } = N || {};
        if (!N || !r.isValid(U) || !r.isValid(C)) throw new Error("invalid affine point");
        if (N instanceof v) throw new Error("projective point not allowed");
        return r.is0(U) && r.is0(C) ? v.ZERO : new v(U, C, r.ONE);
      }
      static fromBytes(N) {
        const U = v.fromAffine(w(er(N, void 0, "point")));
        return U.assertValidity(), U;
      }
      static fromHex(N) {
        return v.fromBytes(st("pointHex", N));
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      precompute(N = 8, U = true) {
        return D.createCache(this, N), U || this.multiply(Vo), this;
      }
      assertValidity() {
        R(this);
      }
      hasEvenY() {
        const { y: N } = this.toAffine();
        if (!r.isOdd) throw new Error("Field doesn't support isOdd");
        return !r.isOdd(N);
      }
      equals(N) {
        m(N);
        const { X: U, Y: C, Z: K } = this, { X: W, Y: Z, Z: I } = N, F = r.eql(r.mul(U, I), r.mul(W, K)), V = r.eql(r.mul(C, I), r.mul(Z, K));
        return F && V;
      }
      negate() {
        return new v(this.X, r.neg(this.Y), this.Z);
      }
      double() {
        const { a: N, b: U } = o, C = r.mul(U, Vo), { X: K, Y: W, Z } = this;
        let I = r.ZERO, F = r.ZERO, V = r.ZERO, j = r.mul(K, K), te = r.mul(W, W), G = r.mul(Z, Z), Y = r.mul(K, W);
        return Y = r.add(Y, Y), V = r.mul(K, Z), V = r.add(V, V), I = r.mul(N, V), F = r.mul(C, G), F = r.add(I, F), I = r.sub(te, F), F = r.add(te, F), F = r.mul(I, F), I = r.mul(Y, I), V = r.mul(C, V), G = r.mul(N, G), Y = r.sub(j, G), Y = r.mul(N, Y), Y = r.add(Y, V), V = r.add(j, j), j = r.add(V, j), j = r.add(j, G), j = r.mul(j, Y), F = r.add(F, j), G = r.mul(W, Z), G = r.add(G, G), j = r.mul(G, Y), I = r.sub(I, j), V = r.mul(G, te), V = r.add(V, V), V = r.add(V, V), new v(I, F, V);
      }
      add(N) {
        m(N);
        const { X: U, Y: C, Z: K } = this, { X: W, Y: Z, Z: I } = N;
        let F = r.ZERO, V = r.ZERO, j = r.ZERO;
        const te = o.a, G = r.mul(o.b, Vo);
        let Y = r.mul(U, W), ue = r.mul(C, Z), be = r.mul(K, I), Fe = r.add(U, C), ye = r.add(W, Z);
        Fe = r.mul(Fe, ye), ye = r.add(Y, ue), Fe = r.sub(Fe, ye), ye = r.add(U, K);
        let Pe = r.add(W, I);
        return ye = r.mul(ye, Pe), Pe = r.add(Y, be), ye = r.sub(ye, Pe), Pe = r.add(C, K), F = r.add(Z, I), Pe = r.mul(Pe, F), F = r.add(ue, be), Pe = r.sub(Pe, F), j = r.mul(te, ye), F = r.mul(G, be), j = r.add(F, j), F = r.sub(ue, j), j = r.add(ue, j), V = r.mul(F, j), ue = r.add(Y, Y), ue = r.add(ue, Y), be = r.mul(te, be), ye = r.mul(G, ye), ue = r.add(ue, be), be = r.sub(Y, be), be = r.mul(te, be), ye = r.add(ye, be), Y = r.mul(ue, ye), V = r.add(V, Y), Y = r.mul(Pe, ye), F = r.mul(Fe, F), F = r.sub(F, Y), Y = r.mul(Fe, ue), j = r.mul(Pe, j), j = r.add(j, Y), new v(F, V, j);
      }
      subtract(N) {
        return this.add(N.negate());
      }
      is0() {
        return this.equals(v.ZERO);
      }
      multiply(N) {
        const { endo: U } = t;
        if (!i.isValidNot0(N)) throw new Error("invalid scalar: out of range");
        let C, K;
        const W = (Z) => D.cached(this, Z, (I) => va(v, I));
        if (U) {
          const { k1neg: Z, k1: I, k2neg: F, k2: V } = k(N), { p: j, f: te } = W(I), { p: G, f: Y } = W(V);
          K = te.add(Y), C = M(U.beta, j, G, Z, F);
        } else {
          const { p: Z, f: I } = W(N);
          C = Z, K = I;
        }
        return va(v, [
          C,
          K
        ])[0];
      }
      multiplyUnsafe(N) {
        const { endo: U } = t, C = this;
        if (!i.isValid(N)) throw new Error("invalid scalar: out of range");
        if (N === dn || C.is0()) return v.ZERO;
        if (N === ui) return C;
        if (D.hasCache(this)) return this.multiply(N);
        if (U) {
          const { k1neg: K, k1: W, k2neg: Z, k2: I } = k(N), { p1: F, p2: V } = S_(v, C, W, I);
          return M(U.beta, F, V, K, Z);
        } else return D.unsafe(C, N);
      }
      multiplyAndAddUnsafe(N, U, C) {
        const K = this.multiplyUnsafe(U).add(N.multiplyUnsafe(C));
        return K.is0() ? void 0 : K;
      }
      toAffine(N) {
        return T(this, N);
      }
      isTorsionFree() {
        const { isTorsionFree: N } = t;
        return s === ui ? true : N ? N(v, this) : D.unsafe(this, a).is0();
      }
      clearCofactor() {
        const { clearCofactor: N } = t;
        return s === ui ? this : N ? N(v, this) : this.multiplyUnsafe(s);
      }
      isSmallOrder() {
        return this.multiplyUnsafe(s).is0();
      }
      toBytes(N = true) {
        return ws(N, "isCompressed"), this.assertValidity(), d(v, this, N);
      }
      toHex(N = true) {
        return gr(this.toBytes(N));
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
      get px() {
        return this.X;
      }
      get py() {
        return this.X;
      }
      get pz() {
        return this.Z;
      }
      toRawBytes(N = true) {
        return this.toBytes(N);
      }
      _setWindowSize(N) {
        this.precompute(N);
      }
      static normalizeZ(N) {
        return va(v, N);
      }
      static msm(N, U) {
        return x_(v, i, N, U);
      }
      static fromPrivateKey(N) {
        return v.BASE.multiply(ii(i, N));
      }
    }
    v.BASE = new v(o.Gx, o.Gy, r.ONE), v.ZERO = new v(r.ZERO, r.ONE, r.ZERO), v.Fp = r, v.Fn = i;
    const H = i.BITS, D = new E_(v, t.endo ? Math.ceil(H / 2) : H);
    return v.BASE.precompute(8), v;
  }
  function b0(e) {
    return Uint8Array.of(e ? 2 : 3);
  }
  function m0(e, t) {
    return {
      secretKey: t.BYTES,
      publicKey: 1 + e.BYTES,
      publicKeyUncompressed: 1 + 2 * e.BYTES,
      publicKeyHasPrefix: true,
      signature: 2 * t.BYTES
    };
  }
  function B_(e, t = {}) {
    const { Fn: n } = e, r = t.randomBytes || Yd, i = Object.assign(m0(e.Fp, n), {
      seed: h0(n.ORDER)
    });
    function o(d) {
      try {
        return !!ii(n, d);
      } catch {
        return false;
      }
    }
    function s(d, w) {
      const { publicKey: b, publicKeyUncompressed: S } = i;
      try {
        const A = d.length;
        return w === true && A !== b || w === false && A !== S ? false : !!e.fromBytes(d);
      } catch {
        return false;
      }
    }
    function a(d = r(i.seed)) {
      return n_(er(d, i.seed, "seed"), n.ORDER);
    }
    function f(d, w = true) {
      return e.BASE.multiply(ii(n, d)).toBytes(w);
    }
    function u(d) {
      const w = a(d);
      return {
        secretKey: w,
        publicKey: f(w)
      };
    }
    function c(d) {
      if (typeof d == "bigint") return false;
      if (d instanceof e) return true;
      const { secretKey: w, publicKey: b, publicKeyUncompressed: S } = i;
      if (n.allowedLengths || w === b) return;
      const A = st("key", d).length;
      return A === b || A === S;
    }
    function p(d, w, b = true) {
      if (c(d) === true) throw new Error("first arg must be private key");
      if (c(w) === false) throw new Error("second arg must be public key");
      const S = ii(n, d);
      return e.fromHex(w).multiply(S).toBytes(b);
    }
    return Object.freeze({
      getPublicKey: f,
      getSharedSecret: p,
      keygen: u,
      Point: e,
      utils: {
        isValidSecretKey: o,
        isValidPublicKey: s,
        randomSecretKey: a,
        isValidPrivateKey: o,
        randomPrivateKey: a,
        normPrivateKeyToScalar: (d) => ii(n, d),
        precompute(d = 8, w = e.BASE) {
          return w.precompute(d, false);
        }
      },
      lengths: i
    });
  }
  function P_(e, t, n = {}) {
    Gd(t), sf(n, {}, {
      hmac: "function",
      lowS: "boolean",
      randomBytes: "function",
      bits2int: "function",
      bits2int_modN: "function"
    });
    const r = n.randomBytes || Yd, i = n.hmac || ((U, ...C) => bs(t, U, _t(...C))), { Fp: o, Fn: s } = e, { ORDER: a, BITS: f } = s, { keygen: u, getPublicKey: c, getSharedSecret: p, utils: y, lengths: d } = B_(e, n), w = {
      prehash: false,
      lowS: typeof n.lowS == "boolean" ? n.lowS : false,
      format: void 0,
      extraEntropy: false
    }, b = "compact";
    function S(U) {
      const C = a >> ui;
      return U > C;
    }
    function A(U, C) {
      if (!s.isValidNot0(C)) throw new Error(`invalid signature ${U}: out of range 1..Point.Fn.ORDER`);
      return C;
    }
    function O(U, C) {
      fc(C);
      const K = d.signature, W = C === "compact" ? K : C === "recovered" ? K + 1 : void 0;
      return er(U, W, `${C} signature`);
    }
    class E {
      constructor(C, K, W) {
        this.r = A("r", C), this.s = A("s", K), W != null && (this.recovery = W), Object.freeze(this);
      }
      static fromBytes(C, K = b) {
        O(C, K);
        let W;
        if (K === "der") {
          const { r: V, s: j } = cn.toSig(er(C));
          return new E(V, j);
        }
        K === "recovered" && (W = C[0], K = "compact", C = C.subarray(1));
        const Z = s.BYTES, I = C.subarray(0, Z), F = C.subarray(Z, Z * 2);
        return new E(s.fromBytes(I), s.fromBytes(F), W);
      }
      static fromHex(C, K) {
        return this.fromBytes(Qi(C), K);
      }
      addRecoveryBit(C) {
        return new E(this.r, this.s, C);
      }
      recoverPublicKey(C) {
        const K = o.ORDER, { r: W, s: Z, recovery: I } = this;
        if (I == null || ![
          0,
          1,
          2,
          3
        ].includes(I)) throw new Error("recovery id invalid");
        if (a * w0 < K && I > 1) throw new Error("recovery id is ambiguous for h>1 curve");
        const V = I === 2 || I === 3 ? W + a : W;
        if (!o.isValid(V)) throw new Error("recovery id 2 or 3 invalid");
        const j = o.toBytes(V), te = e.fromBytes(_t(b0((I & 1) === 0), j)), G = s.inv(V), Y = k(st("msgHash", C)), ue = s.create(-Y * G), be = s.create(Z * G), Fe = e.BASE.multiplyUnsafe(ue).add(te.multiplyUnsafe(be));
        if (Fe.is0()) throw new Error("point at infinify");
        return Fe.assertValidity(), Fe;
      }
      hasHighS() {
        return S(this.s);
      }
      toBytes(C = b) {
        if (fc(C), C === "der") return Qi(cn.hexFromSig(this));
        const K = s.toBytes(this.r), W = s.toBytes(this.s);
        if (C === "recovered") {
          if (this.recovery == null) throw new Error("recovery bit must be present");
          return _t(Uint8Array.of(this.recovery), K, W);
        }
        return _t(K, W);
      }
      toHex(C) {
        return gr(this.toBytes(C));
      }
      assertValidity() {
      }
      static fromCompact(C) {
        return E.fromBytes(st("sig", C), "compact");
      }
      static fromDER(C) {
        return E.fromBytes(st("sig", C), "der");
      }
      normalizeS() {
        return this.hasHighS() ? new E(this.r, s.neg(this.s), this.recovery) : this;
      }
      toDERRawBytes() {
        return this.toBytes("der");
      }
      toDERHex() {
        return gr(this.toBytes("der"));
      }
      toCompactRawBytes() {
        return this.toBytes("compact");
      }
      toCompactHex() {
        return gr(this.toBytes("compact"));
      }
    }
    const m = n.bits2int || function(C) {
      if (C.length > 8192) throw new Error("input is too large");
      const K = qs(C), W = C.length * 8 - f;
      return W > 0 ? K >> BigInt(W) : K;
    }, k = n.bits2int_modN || function(C) {
      return s.create(m(C));
    }, T = wo(f);
    function R(U) {
      return Wm("num < 2^" + f, U, dn, T), s.toBytes(U);
    }
    function M(U, C) {
      return er(U, void 0, "message"), C ? er(t(U), void 0, "prehashed message") : U;
    }
    function v(U, C, K) {
      if ([
        "recovered",
        "canonical"
      ].some((ue) => ue in K)) throw new Error("sign() legacy options not supported");
      const { lowS: W, prehash: Z, extraEntropy: I } = ka(K, w);
      U = M(U, Z);
      const F = k(U), V = ii(s, C), j = [
        R(V),
        R(F)
      ];
      if (I != null && I !== false) {
        const ue = I === true ? r(d.secretKey) : I;
        j.push(st("extraEntropy", ue));
      }
      const te = _t(...j), G = F;
      function Y(ue) {
        const be = m(ue);
        if (!s.isValidNot0(be)) return;
        const Fe = s.inv(be), ye = e.BASE.multiply(be).toAffine(), Pe = s.create(ye.x);
        if (Pe === dn) return;
        const kt = s.create(Fe * s.create(G + Pe * V));
        if (kt === dn) return;
        let Vr = (ye.x === Pe ? 0 : 2) | Number(ye.y & ui), Ai = kt;
        return W && S(kt) && (Ai = s.neg(kt), Vr ^= 1), new E(Pe, Ai, Vr);
      }
      return {
        seed: te,
        k2sig: Y
      };
    }
    function H(U, C, K = {}) {
      U = st("message", U);
      const { seed: W, k2sig: Z } = v(U, C, K);
      return Gm(t.outputLen, s.BYTES, i)(W, Z);
    }
    function D(U) {
      let C;
      const K = typeof U == "string" || Xs(U), W = !K && U !== null && typeof U == "object" && typeof U.r == "bigint" && typeof U.s == "bigint";
      if (!K && !W) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
      if (W) C = new E(U.r, U.s);
      else if (K) {
        try {
          C = E.fromBytes(st("sig", U), "der");
        } catch (Z) {
          if (!(Z instanceof cn.Err)) throw Z;
        }
        if (!C) try {
          C = E.fromBytes(st("sig", U), "compact");
        } catch {
          return false;
        }
      }
      return C || false;
    }
    function $(U, C, K, W = {}) {
      const { lowS: Z, prehash: I, format: F } = ka(W, w);
      if (K = st("publicKey", K), C = M(st("message", C), I), "strict" in W) throw new Error("options.strict was renamed to lowS");
      const V = F === void 0 ? D(U) : E.fromBytes(st("sig", U), F);
      if (V === false) return false;
      try {
        const j = e.fromBytes(K);
        if (Z && V.hasHighS()) return false;
        const { r: te, s: G } = V, Y = k(C), ue = s.inv(G), be = s.create(Y * ue), Fe = s.create(te * ue), ye = e.BASE.multiplyUnsafe(be).add(j.multiplyUnsafe(Fe));
        return ye.is0() ? false : s.create(ye.x) === te;
      } catch {
        return false;
      }
    }
    function N(U, C, K = {}) {
      const { prehash: W } = ka(K, w);
      return C = M(C, W), E.fromBytes(U, "recovered").recoverPublicKey(C).toBytes();
    }
    return Object.freeze({
      keygen: u,
      getPublicKey: c,
      getSharedSecret: p,
      utils: y,
      lengths: d,
      Point: e,
      sign: H,
      verify: $,
      recoverPublicKey: N,
      Signature: E,
      hash: t
    });
  }
  function O_(e) {
    const t = {
      a: e.a,
      b: e.b,
      p: e.Fp.ORDER,
      n: e.n,
      h: e.h,
      Gx: e.Gx,
      Gy: e.Gy
    }, n = e.Fp;
    let r = e.allowedPrivateKeyLengths ? Array.from(new Set(e.allowedPrivateKeyLengths.map((s) => Math.ceil(s / 2)))) : void 0;
    const i = bo(t.n, {
      BITS: e.nBitLength,
      allowedLengths: r,
      modFromBytes: e.wrapPrivateKey
    }), o = {
      Fp: n,
      Fn: i,
      allowInfinityPoint: e.allowInfinityPoint,
      endo: e.endo,
      isTorsionFree: e.isTorsionFree,
      clearCofactor: e.clearCofactor,
      fromBytes: e.fromBytes,
      toBytes: e.toBytes
    };
    return {
      CURVE: t,
      curveOpts: o
    };
  }
  function H_(e) {
    const { CURVE: t, curveOpts: n } = O_(e), r = {
      hmac: e.hmac,
      randomBytes: e.randomBytes,
      lowS: e.lowS,
      bits2int: e.bits2int,
      bits2int_modN: e.bits2int_modN
    };
    return {
      CURVE: t,
      curveOpts: n,
      hash: e.hash,
      ecdsaOpts: r
    };
  }
  function U_(e, t) {
    const n = t.Point;
    return Object.assign({}, t, {
      ProjectivePoint: n,
      CURVE: Object.assign({}, e, u0(n.Fn.ORDER, n.Fn.BITS))
    });
  }
  function R_(e) {
    const { CURVE: t, curveOpts: n, hash: r, ecdsaOpts: i } = H_(e), o = k_(t, n), s = P_(o, r, i);
    return U_(e, s);
  }
  function N_(e, t) {
    const n = (r) => R_({
      ...e,
      hash: r
    });
    return {
      ...n(t),
      create: n
    };
  }
  const uf = {
    p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
    n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
    h: BigInt(1),
    a: BigInt(0),
    b: BigInt(7),
    Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
    Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
  }, C_ = {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    basises: [
      [
        BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
        -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")
      ],
      [
        BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
        BigInt("0x3086d221a7d46bcde86c90e49284eb15")
      ]
    ]
  }, Mu = BigInt(2);
  function L_(e) {
    const t = uf.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), o = BigInt(22), s = BigInt(23), a = BigInt(44), f = BigInt(88), u = e * e * e % t, c = u * u * e % t, p = wt(c, n, t) * c % t, y = wt(p, n, t) * c % t, d = wt(y, Mu, t) * u % t, w = wt(d, i, t) * d % t, b = wt(w, o, t) * w % t, S = wt(b, a, t) * b % t, A = wt(S, f, t) * S % t, O = wt(A, a, t) * b % t, E = wt(O, n, t) * c % t, m = wt(E, s, t) * w % t, k = wt(m, r, t) * u % t, T = wt(k, Mu, t);
    if (!uc.eql(uc.sqr(T), e)) throw new Error("Cannot find square root");
    return T;
  }
  const uc = bo(uf.p, {
    sqrt: L_
  }), sn = N_({
    ...uf,
    Fp: uc,
    lowS: true,
    endo: C_
  }, ff), F_ = Uint8Array.from([
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8
  ]), _0 = Uint8Array.from(new Array(16).fill(0).map((e, t) => t)), M_ = _0.map((e) => (9 * e + 5) % 16), E0 = (() => {
    const n = [
      [
        _0
      ],
      [
        M_
      ]
    ];
    for (let r = 0; r < 4; r++) for (let i of n) i.push(i[r].map((o) => F_[o]));
    return n;
  })(), S0 = E0[0], x0 = E0[1], v0 = [
    [
      11,
      14,
      15,
      12,
      5,
      8,
      7,
      9,
      11,
      13,
      14,
      15,
      6,
      7,
      9,
      8
    ],
    [
      12,
      13,
      11,
      15,
      6,
      9,
      9,
      7,
      12,
      15,
      11,
      13,
      7,
      8,
      7,
      7
    ],
    [
      13,
      15,
      14,
      11,
      7,
      7,
      6,
      8,
      13,
      14,
      13,
      12,
      5,
      5,
      6,
      9
    ],
    [
      14,
      11,
      12,
      14,
      8,
      6,
      5,
      5,
      15,
      12,
      15,
      14,
      9,
      9,
      8,
      6
    ],
    [
      15,
      12,
      13,
      13,
      9,
      5,
      8,
      6,
      14,
      11,
      12,
      11,
      8,
      6,
      5,
      5
    ]
  ].map((e) => Uint8Array.from(e)), D_ = S0.map((e, t) => e.map((n) => v0[t][n])), K_ = x0.map((e, t) => e.map((n) => v0[t][n])), $_ = Uint32Array.from([
    0,
    1518500249,
    1859775393,
    2400959708,
    2840853838
  ]), V_ = Uint32Array.from([
    1352829926,
    1548603684,
    1836072691,
    2053994217,
    0
  ]);
  function Du(e, t, n, r) {
    return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
  }
  const zo = new Uint32Array(16);
  class z_ extends cf {
    constructor() {
      super(64, 20, 8, true), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
    }
    get() {
      const { h0: t, h1: n, h2: r, h3: i, h4: o } = this;
      return [
        t,
        n,
        r,
        i,
        o
      ];
    }
    set(t, n, r, i, o) {
      this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = o | 0;
    }
    process(t, n) {
      for (let d = 0; d < 16; d++, n += 4) zo[d] = t.getUint32(n, true);
      let r = this.h0 | 0, i = r, o = this.h1 | 0, s = o, a = this.h2 | 0, f = a, u = this.h3 | 0, c = u, p = this.h4 | 0, y = p;
      for (let d = 0; d < 5; d++) {
        const w = 4 - d, b = $_[d], S = V_[d], A = S0[d], O = x0[d], E = D_[d], m = K_[d];
        for (let k = 0; k < 16; k++) {
          const T = Fo(r + Du(d, o, a, u) + zo[A[k]] + b, E[k]) + p | 0;
          r = p, p = u, u = Fo(a, 10) | 0, a = o, o = T;
        }
        for (let k = 0; k < 16; k++) {
          const T = Fo(i + Du(w, s, f, c) + zo[O[k]] + S, m[k]) + y | 0;
          i = y, y = c, c = Fo(f, 10) | 0, f = s, s = T;
        }
      }
      this.set(this.h1 + a + c | 0, this.h2 + u + y | 0, this.h3 + p + i | 0, this.h4 + r + s | 0, this.h0 + o + f | 0);
    }
    roundClean() {
      zn(zo);
    }
    destroy() {
      this.destroyed = true, zn(this.buffer), this.set(0, 0, 0, 0, 0);
    }
  }
  const j_ = nf(() => new z_());
  function lc(e) {
    return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
  }
  function I0(e, t) {
    return Array.isArray(t) ? t.length === 0 ? true : e ? t.every((n) => typeof n == "string") : t.every((n) => Number.isSafeInteger(n)) : false;
  }
  function W_(e) {
    if (typeof e != "function") throw new Error("function expected");
    return true;
  }
  function hc(e, t) {
    if (typeof t != "string") throw new Error(`${e}: string expected`);
    return true;
  }
  function lf(e) {
    if (!Number.isSafeInteger(e)) throw new Error(`invalid integer: ${e}`);
  }
  function dc(e) {
    if (!Array.isArray(e)) throw new Error("array expected");
  }
  function T0(e, t) {
    if (!I0(true, t)) throw new Error(`${e}: array of strings expected`);
  }
  function G_(e, t) {
    if (!I0(false, t)) throw new Error(`${e}: array of numbers expected`);
  }
  function A0(...e) {
    const t = (o) => o, n = (o, s) => (a) => o(s(a)), r = e.map((o) => o.encode).reduceRight(n, t), i = e.map((o) => o.decode).reduce(n, t);
    return {
      encode: r,
      decode: i
    };
  }
  function X_(e) {
    const t = typeof e == "string" ? e.split("") : e, n = t.length;
    T0("alphabet", t);
    const r = new Map(t.map((i, o) => [
      i,
      o
    ]));
    return {
      encode: (i) => (dc(i), i.map((o) => {
        if (!Number.isSafeInteger(o) || o < 0 || o >= n) throw new Error(`alphabet.encode: digit index outside alphabet "${o}". Allowed: ${e}`);
        return t[o];
      })),
      decode: (i) => (dc(i), i.map((o) => {
        hc("alphabet.decode", o);
        const s = r.get(o);
        if (s === void 0) throw new Error(`Unknown letter: "${o}". Allowed: ${e}`);
        return s;
      }))
    };
  }
  function q_(e = "") {
    return hc("join", e), {
      encode: (t) => (T0("join.decode", t), t.join(e)),
      decode: (t) => (hc("join.decode", t), t.split(e))
    };
  }
  function Ku(e, t, n) {
    if (t < 2) throw new Error(`convertRadix: invalid from=${t}, base cannot be less than 2`);
    if (n < 2) throw new Error(`convertRadix: invalid to=${n}, base cannot be less than 2`);
    if (dc(e), !e.length) return [];
    let r = 0;
    const i = [], o = Array.from(e, (a) => {
      if (lf(a), a < 0 || a >= t) throw new Error(`invalid integer: ${a}`);
      return a;
    }), s = o.length;
    for (; ; ) {
      let a = 0, f = true;
      for (let u = r; u < s; u++) {
        const c = o[u], p = t * a, y = p + c;
        if (!Number.isSafeInteger(y) || p / t !== a || y - c !== p) throw new Error("convertRadix: carry overflow");
        const d = y / n;
        a = y % n;
        const w = Math.floor(d);
        if (o[u] = w, !Number.isSafeInteger(w) || w * n + a !== y) throw new Error("convertRadix: carry overflow");
        if (f) w ? f = false : r = u;
        else continue;
      }
      if (i.push(a), f) break;
    }
    for (let a = 0; a < e.length - 1 && e[a] === 0; a++) i.push(0);
    return i.reverse();
  }
  function Z_(e) {
    lf(e);
    const t = 2 ** 8;
    return {
      encode: (n) => {
        if (!lc(n)) throw new Error("radix.encode input should be Uint8Array");
        return Ku(Array.from(n), t, e);
      },
      decode: (n) => (G_("radix.decode", n), Uint8Array.from(Ku(n, e, t)))
    };
  }
  function Y_(e, t) {
    return lf(e), W_(t), {
      encode(n) {
        if (!lc(n)) throw new Error("checksum.encode: input should be Uint8Array");
        const r = t(n).slice(0, e), i = new Uint8Array(n.length + e);
        return i.set(n), i.set(r, n.length), i;
      },
      decode(n) {
        if (!lc(n)) throw new Error("checksum.decode: input should be Uint8Array");
        const r = n.slice(0, -e), i = n.slice(-e), o = t(r).slice(0, e);
        for (let s = 0; s < e; s++) if (o[s] !== i[s]) throw new Error("Invalid checksum");
        return r;
      }
    };
  }
  const J_ = (e) => A0(Z_(58), X_(e), q_("")), Q_ = J_("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), e2 = (e) => A0(Y_(4, (t) => e(e(t))), Q_);
  const jo = sn.ProjectivePoint, Ba = e2(ff);
  function $u(e) {
    ht(e);
    const t = e.length === 0 ? "0" : gr(e);
    return BigInt("0x" + t);
  }
  function t2(e) {
    if (typeof e != "bigint") throw new Error("bigint expected");
    return Qi(e.toString(16).padStart(64, "0"));
  }
  const n2 = qd("Bitcoin seed"), Pa = {
    private: 76066276,
    public: 76067358
  }, Oa = 2147483648, r2 = (e) => j_(ff(e)), i2 = (e) => fi(e).getUint32(0, false), Wo = (e) => {
    if (!Number.isSafeInteger(e) || e < 0 || e > 2 ** 32 - 1) throw new Error("invalid number, should be from 0 to 2**32-1, got " + e);
    const t = new Uint8Array(4);
    return fi(t).setUint32(0, e, false), t;
  };
  class Qn {
    get fingerprint() {
      if (!this.pubHash) throw new Error("No publicKey set!");
      return i2(this.pubHash);
    }
    get identifier() {
      return this.pubHash;
    }
    get pubKeyHash() {
      return this.pubHash;
    }
    get privateKey() {
      return this.privKeyBytes || null;
    }
    get publicKey() {
      return this.pubKey || null;
    }
    get privateExtendedKey() {
      const t = this.privateKey;
      if (!t) throw new Error("No private key");
      return Ba.encode(this.serialize(this.versions.private, _t(new Uint8Array([
        0
      ]), t)));
    }
    get publicExtendedKey() {
      if (!this.pubKey) throw new Error("No public key");
      return Ba.encode(this.serialize(this.versions.public, this.pubKey));
    }
    static fromMasterSeed(t, n = Pa) {
      if (ht(t), 8 * t.length < 128 || 8 * t.length > 512) throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got " + t.length);
      const r = bs(Ru, n2, t);
      return new Qn({
        versions: n,
        chainCode: r.slice(32),
        privateKey: r.slice(0, 32)
      });
    }
    static fromExtendedKey(t, n = Pa) {
      const r = Ba.decode(t), i = fi(r), o = i.getUint32(0, false), s = {
        versions: n,
        depth: r[4],
        parentFingerprint: i.getUint32(5, false),
        index: i.getUint32(9, false),
        chainCode: r.slice(13, 45)
      }, a = r.slice(45), f = a[0] === 0;
      if (o !== n[f ? "private" : "public"]) throw new Error("Version mismatch");
      return f ? new Qn({
        ...s,
        privateKey: a.slice(1)
      }) : new Qn({
        ...s,
        publicKey: a
      });
    }
    static fromJSON(t) {
      return Qn.fromExtendedKey(t.xpriv);
    }
    constructor(t) {
      if (this.depth = 0, this.index = 0, this.chainCode = null, this.parentFingerprint = 0, !t || typeof t != "object") throw new Error("HDKey.constructor must not be called directly");
      if (this.versions = t.versions || Pa, this.depth = t.depth || 0, this.chainCode = t.chainCode || null, this.index = t.index || 0, this.parentFingerprint = t.parentFingerprint || 0, !this.depth && (this.parentFingerprint || this.index)) throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
      if (t.publicKey && t.privateKey) throw new Error("HDKey: publicKey and privateKey at same time.");
      if (t.privateKey) {
        if (!sn.utils.isValidPrivateKey(t.privateKey)) throw new Error("Invalid private key");
        this.privKey = typeof t.privateKey == "bigint" ? t.privateKey : $u(t.privateKey), this.privKeyBytes = t2(this.privKey), this.pubKey = sn.getPublicKey(t.privateKey, true);
      } else if (t.publicKey) this.pubKey = jo.fromHex(t.publicKey).toRawBytes(true);
      else throw new Error("HDKey: no public or private key provided");
      this.pubHash = r2(this.pubKey);
    }
    derive(t) {
      if (!/^[mM]'?/.test(t)) throw new Error('Path must start with "m" or "M"');
      if (/^[mM]'?$/.test(t)) return this;
      const n = t.replace(/^[mM]'?\//, "").split("/");
      let r = this;
      for (const i of n) {
        const o = /^(\d+)('?)$/.exec(i), s = o && o[1];
        if (!o || o.length !== 3 || typeof s != "string") throw new Error("invalid child index: " + i);
        let a = +s;
        if (!Number.isSafeInteger(a) || a >= Oa) throw new Error("Invalid index");
        o[2] === "'" && (a += Oa), r = r.deriveChild(a);
      }
      return r;
    }
    deriveChild(t) {
      if (!this.pubKey || !this.chainCode) throw new Error("No publicKey or chainCode set");
      let n = Wo(t);
      if (t >= Oa) {
        const a = this.privateKey;
        if (!a) throw new Error("Could not derive hardened child key");
        n = _t(new Uint8Array([
          0
        ]), a, n);
      } else n = _t(this.pubKey, n);
      const r = bs(Ru, this.chainCode, n), i = $u(r.slice(0, 32)), o = r.slice(32);
      if (!sn.utils.isValidPrivateKey(i)) throw new Error("Tweak bigger than curve order");
      const s = {
        versions: this.versions,
        chainCode: o,
        depth: this.depth + 1,
        parentFingerprint: this.fingerprint,
        index: t
      };
      try {
        if (this.privateKey) {
          const a = mt(this.privKey + i, sn.CURVE.n);
          if (!sn.utils.isValidPrivateKey(a)) throw new Error("The tweak was out of range or the resulted private key is invalid");
          s.privateKey = a;
        } else {
          const a = jo.fromHex(this.pubKey).add(jo.fromPrivateKey(i));
          if (a.equals(jo.ZERO)) throw new Error("The tweak was equal to negative P, which made the result key invalid");
          s.publicKey = a.toRawBytes(true);
        }
        return new Qn(s);
      } catch {
        return this.deriveChild(t + 1);
      }
    }
    sign(t) {
      if (!this.privateKey) throw new Error("No privateKey set!");
      return ht(t, 32), sn.sign(t, this.privKey).toCompactRawBytes();
    }
    verify(t, n) {
      if (ht(t, 32), ht(n, 64), !this.publicKey) throw new Error("No publicKey set!");
      let r;
      try {
        r = sn.Signature.fromCompact(n);
      } catch {
        return false;
      }
      return sn.verify(r, t, this.publicKey);
    }
    wipePrivateData() {
      return this.privKey = void 0, this.privKeyBytes && (this.privKeyBytes.fill(0), this.privKeyBytes = void 0), this;
    }
    toJSON() {
      return {
        xpriv: this.privateExtendedKey,
        xpub: this.publicExtendedKey
      };
    }
    serialize(t, n) {
      if (!this.chainCode) throw new Error("No chainCode set");
      return ht(n, 33), _t(Wo(t), new Uint8Array([
        this.depth
      ]), Wo(this.parentFingerprint), Wo(this.index), this.chainCode, n);
    }
  }
  const o2 = 4, Vu = 0, zu = 1, s2 = 2;
  function vi(e) {
    let t = e.length;
    for (; --t >= 0; ) e[t] = 0;
  }
  const a2 = 0, k0 = 1, c2 = 2, f2 = 3, u2 = 258, hf = 29, mo = 256, eo = mo + 1 + hf, li = 30, df = 19, B0 = 2 * eo + 1, rr = 15, Ha = 16, l2 = 7, pf = 256, P0 = 16, O0 = 17, H0 = 18, pc = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0
  ]), ns = new Uint8Array([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13
  ]), h2 = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    2,
    3,
    7
  ]), U0 = new Uint8Array([
    16,
    17,
    18,
    0,
    8,
    7,
    9,
    6,
    10,
    5,
    11,
    4,
    12,
    3,
    13,
    2,
    14,
    1,
    15
  ]), d2 = 512, fn = new Array((eo + 2) * 2);
  vi(fn);
  const ji = new Array(li * 2);
  vi(ji);
  const to = new Array(d2);
  vi(to);
  const no = new Array(u2 - f2 + 1);
  vi(no);
  const yf = new Array(hf);
  vi(yf);
  const _s = new Array(li);
  vi(_s);
  function Ua(e, t, n, r, i) {
    this.static_tree = e, this.extra_bits = t, this.extra_base = n, this.elems = r, this.max_length = i, this.has_stree = e && e.length;
  }
  let R0, N0, C0;
  function Ra(e, t) {
    this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
  }
  const L0 = (e) => e < 256 ? to[e] : to[256 + (e >>> 7)], ro = (e, t) => {
    e.pending_buf[e.pending++] = t & 255, e.pending_buf[e.pending++] = t >>> 8 & 255;
  }, ft = (e, t, n) => {
    e.bi_valid > Ha - n ? (e.bi_buf |= t << e.bi_valid & 65535, ro(e, e.bi_buf), e.bi_buf = t >> Ha - e.bi_valid, e.bi_valid += n - Ha) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += n);
  }, Vt = (e, t, n) => {
    ft(e, n[t * 2], n[t * 2 + 1]);
  }, F0 = (e, t) => {
    let n = 0;
    do
      n |= e & 1, e >>>= 1, n <<= 1;
    while (--t > 0);
    return n >>> 1;
  }, p2 = (e) => {
    e.bi_valid === 16 ? (ro(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = e.bi_buf & 255, e.bi_buf >>= 8, e.bi_valid -= 8);
  }, y2 = (e, t) => {
    const n = t.dyn_tree, r = t.max_code, i = t.stat_desc.static_tree, o = t.stat_desc.has_stree, s = t.stat_desc.extra_bits, a = t.stat_desc.extra_base, f = t.stat_desc.max_length;
    let u, c, p, y, d, w, b = 0;
    for (y = 0; y <= rr; y++) e.bl_count[y] = 0;
    for (n[e.heap[e.heap_max] * 2 + 1] = 0, u = e.heap_max + 1; u < B0; u++) c = e.heap[u], y = n[n[c * 2 + 1] * 2 + 1] + 1, y > f && (y = f, b++), n[c * 2 + 1] = y, !(c > r) && (e.bl_count[y]++, d = 0, c >= a && (d = s[c - a]), w = n[c * 2], e.opt_len += w * (y + d), o && (e.static_len += w * (i[c * 2 + 1] + d)));
    if (b !== 0) {
      do {
        for (y = f - 1; e.bl_count[y] === 0; ) y--;
        e.bl_count[y]--, e.bl_count[y + 1] += 2, e.bl_count[f]--, b -= 2;
      } while (b > 0);
      for (y = f; y !== 0; y--) for (c = e.bl_count[y]; c !== 0; ) p = e.heap[--u], !(p > r) && (n[p * 2 + 1] !== y && (e.opt_len += (y - n[p * 2 + 1]) * n[p * 2], n[p * 2 + 1] = y), c--);
    }
  }, M0 = (e, t, n) => {
    const r = new Array(rr + 1);
    let i = 0, o, s;
    for (o = 1; o <= rr; o++) i = i + n[o - 1] << 1, r[o] = i;
    for (s = 0; s <= t; s++) {
      let a = e[s * 2 + 1];
      a !== 0 && (e[s * 2] = F0(r[a]++, a));
    }
  }, g2 = () => {
    let e, t, n, r, i;
    const o = new Array(rr + 1);
    for (n = 0, r = 0; r < hf - 1; r++) for (yf[r] = n, e = 0; e < 1 << pc[r]; e++) no[n++] = r;
    for (no[n - 1] = r, i = 0, r = 0; r < 16; r++) for (_s[r] = i, e = 0; e < 1 << ns[r]; e++) to[i++] = r;
    for (i >>= 7; r < li; r++) for (_s[r] = i << 7, e = 0; e < 1 << ns[r] - 7; e++) to[256 + i++] = r;
    for (t = 0; t <= rr; t++) o[t] = 0;
    for (e = 0; e <= 143; ) fn[e * 2 + 1] = 8, e++, o[8]++;
    for (; e <= 255; ) fn[e * 2 + 1] = 9, e++, o[9]++;
    for (; e <= 279; ) fn[e * 2 + 1] = 7, e++, o[7]++;
    for (; e <= 287; ) fn[e * 2 + 1] = 8, e++, o[8]++;
    for (M0(fn, eo + 1, o), e = 0; e < li; e++) ji[e * 2 + 1] = 5, ji[e * 2] = F0(e, 5);
    R0 = new Ua(fn, pc, mo + 1, eo, rr), N0 = new Ua(ji, ns, 0, li, rr), C0 = new Ua(new Array(0), h2, 0, df, l2);
  }, D0 = (e) => {
    let t;
    for (t = 0; t < eo; t++) e.dyn_ltree[t * 2] = 0;
    for (t = 0; t < li; t++) e.dyn_dtree[t * 2] = 0;
    for (t = 0; t < df; t++) e.bl_tree[t * 2] = 0;
    e.dyn_ltree[pf * 2] = 1, e.opt_len = e.static_len = 0, e.sym_next = e.matches = 0;
  }, K0 = (e) => {
    e.bi_valid > 8 ? ro(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
  }, ju = (e, t, n, r) => {
    const i = t * 2, o = n * 2;
    return e[i] < e[o] || e[i] === e[o] && r[t] <= r[n];
  }, Na = (e, t, n) => {
    const r = e.heap[n];
    let i = n << 1;
    for (; i <= e.heap_len && (i < e.heap_len && ju(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !ju(t, r, e.heap[i], e.depth)); ) e.heap[n] = e.heap[i], n = i, i <<= 1;
    e.heap[n] = r;
  }, Wu = (e, t, n) => {
    let r, i, o = 0, s, a;
    if (e.sym_next !== 0) do
      r = e.pending_buf[e.sym_buf + o++] & 255, r += (e.pending_buf[e.sym_buf + o++] & 255) << 8, i = e.pending_buf[e.sym_buf + o++], r === 0 ? Vt(e, i, t) : (s = no[i], Vt(e, s + mo + 1, t), a = pc[s], a !== 0 && (i -= yf[s], ft(e, i, a)), r--, s = L0(r), Vt(e, s, n), a = ns[s], a !== 0 && (r -= _s[s], ft(e, r, a)));
    while (o < e.sym_next);
    Vt(e, pf, t);
  }, yc = (e, t) => {
    const n = t.dyn_tree, r = t.stat_desc.static_tree, i = t.stat_desc.has_stree, o = t.stat_desc.elems;
    let s, a, f = -1, u;
    for (e.heap_len = 0, e.heap_max = B0, s = 0; s < o; s++) n[s * 2] !== 0 ? (e.heap[++e.heap_len] = f = s, e.depth[s] = 0) : n[s * 2 + 1] = 0;
    for (; e.heap_len < 2; ) u = e.heap[++e.heap_len] = f < 2 ? ++f : 0, n[u * 2] = 1, e.depth[u] = 0, e.opt_len--, i && (e.static_len -= r[u * 2 + 1]);
    for (t.max_code = f, s = e.heap_len >> 1; s >= 1; s--) Na(e, n, s);
    u = o;
    do
      s = e.heap[1], e.heap[1] = e.heap[e.heap_len--], Na(e, n, 1), a = e.heap[1], e.heap[--e.heap_max] = s, e.heap[--e.heap_max] = a, n[u * 2] = n[s * 2] + n[a * 2], e.depth[u] = (e.depth[s] >= e.depth[a] ? e.depth[s] : e.depth[a]) + 1, n[s * 2 + 1] = n[a * 2 + 1] = u, e.heap[1] = u++, Na(e, n, 1);
    while (e.heap_len >= 2);
    e.heap[--e.heap_max] = e.heap[1], y2(e, t), M0(n, f, e.bl_count);
  }, Gu = (e, t, n) => {
    let r, i = -1, o, s = t[0 * 2 + 1], a = 0, f = 7, u = 4;
    for (s === 0 && (f = 138, u = 3), t[(n + 1) * 2 + 1] = 65535, r = 0; r <= n; r++) o = s, s = t[(r + 1) * 2 + 1], !(++a < f && o === s) && (a < u ? e.bl_tree[o * 2] += a : o !== 0 ? (o !== i && e.bl_tree[o * 2]++, e.bl_tree[P0 * 2]++) : a <= 10 ? e.bl_tree[O0 * 2]++ : e.bl_tree[H0 * 2]++, a = 0, i = o, s === 0 ? (f = 138, u = 3) : o === s ? (f = 6, u = 3) : (f = 7, u = 4));
  }, Xu = (e, t, n) => {
    let r, i = -1, o, s = t[0 * 2 + 1], a = 0, f = 7, u = 4;
    for (s === 0 && (f = 138, u = 3), r = 0; r <= n; r++) if (o = s, s = t[(r + 1) * 2 + 1], !(++a < f && o === s)) {
      if (a < u) do
        Vt(e, o, e.bl_tree);
      while (--a !== 0);
      else o !== 0 ? (o !== i && (Vt(e, o, e.bl_tree), a--), Vt(e, P0, e.bl_tree), ft(e, a - 3, 2)) : a <= 10 ? (Vt(e, O0, e.bl_tree), ft(e, a - 3, 3)) : (Vt(e, H0, e.bl_tree), ft(e, a - 11, 7));
      a = 0, i = o, s === 0 ? (f = 138, u = 3) : o === s ? (f = 6, u = 3) : (f = 7, u = 4);
    }
  }, w2 = (e) => {
    let t;
    for (Gu(e, e.dyn_ltree, e.l_desc.max_code), Gu(e, e.dyn_dtree, e.d_desc.max_code), yc(e, e.bl_desc), t = df - 1; t >= 3 && e.bl_tree[U0[t] * 2 + 1] === 0; t--) ;
    return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
  }, b2 = (e, t, n, r) => {
    let i;
    for (ft(e, t - 257, 5), ft(e, n - 1, 5), ft(e, r - 4, 4), i = 0; i < r; i++) ft(e, e.bl_tree[U0[i] * 2 + 1], 3);
    Xu(e, e.dyn_ltree, t - 1), Xu(e, e.dyn_dtree, n - 1);
  }, m2 = (e) => {
    let t = 4093624447, n;
    for (n = 0; n <= 31; n++, t >>>= 1) if (t & 1 && e.dyn_ltree[n * 2] !== 0) return Vu;
    if (e.dyn_ltree[9 * 2] !== 0 || e.dyn_ltree[10 * 2] !== 0 || e.dyn_ltree[13 * 2] !== 0) return zu;
    for (n = 32; n < mo; n++) if (e.dyn_ltree[n * 2] !== 0) return zu;
    return Vu;
  };
  let qu = false;
  const _2 = (e) => {
    qu || (g2(), qu = true), e.l_desc = new Ra(e.dyn_ltree, R0), e.d_desc = new Ra(e.dyn_dtree, N0), e.bl_desc = new Ra(e.bl_tree, C0), e.bi_buf = 0, e.bi_valid = 0, D0(e);
  }, $0 = (e, t, n, r) => {
    ft(e, (a2 << 1) + (r ? 1 : 0), 3), K0(e), ro(e, n), ro(e, ~n), n && e.pending_buf.set(e.window.subarray(t, t + n), e.pending), e.pending += n;
  }, E2 = (e) => {
    ft(e, k0 << 1, 3), Vt(e, pf, fn), p2(e);
  }, S2 = (e, t, n, r) => {
    let i, o, s = 0;
    e.level > 0 ? (e.strm.data_type === s2 && (e.strm.data_type = m2(e)), yc(e, e.l_desc), yc(e, e.d_desc), s = w2(e), i = e.opt_len + 3 + 7 >>> 3, o = e.static_len + 3 + 7 >>> 3, o <= i && (i = o)) : i = o = n + 5, n + 4 <= i && t !== -1 ? $0(e, t, n, r) : e.strategy === o2 || o === i ? (ft(e, (k0 << 1) + (r ? 1 : 0), 3), Wu(e, fn, ji)) : (ft(e, (c2 << 1) + (r ? 1 : 0), 3), b2(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, s + 1), Wu(e, e.dyn_ltree, e.dyn_dtree)), D0(e), r && K0(e);
  }, x2 = (e, t, n) => (e.pending_buf[e.sym_buf + e.sym_next++] = t, e.pending_buf[e.sym_buf + e.sym_next++] = t >> 8, e.pending_buf[e.sym_buf + e.sym_next++] = n, t === 0 ? e.dyn_ltree[n * 2]++ : (e.matches++, t--, e.dyn_ltree[(no[n] + mo + 1) * 2]++, e.dyn_dtree[L0(t) * 2]++), e.sym_next === e.sym_end);
  var v2 = _2, I2 = $0, T2 = S2, A2 = x2, k2 = E2, B2 = {
    _tr_init: v2,
    _tr_stored_block: I2,
    _tr_flush_block: T2,
    _tr_tally: A2,
    _tr_align: k2
  };
  const P2 = (e, t, n, r) => {
    let i = e & 65535 | 0, o = e >>> 16 & 65535 | 0, s = 0;
    for (; n !== 0; ) {
      s = n > 2e3 ? 2e3 : n, n -= s;
      do
        i = i + t[r++] | 0, o = o + i | 0;
      while (--s);
      i %= 65521, o %= 65521;
    }
    return i | o << 16 | 0;
  };
  var io = P2;
  const O2 = () => {
    let e, t = [];
    for (var n = 0; n < 256; n++) {
      e = n;
      for (var r = 0; r < 8; r++) e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
      t[n] = e;
    }
    return t;
  }, H2 = new Uint32Array(O2()), U2 = (e, t, n, r) => {
    const i = H2, o = r + n;
    e ^= -1;
    for (let s = r; s < o; s++) e = e >>> 8 ^ i[(e ^ t[s]) & 255];
    return e ^ -1;
  };
  var Ne = U2, Er = {
    2: "need dictionary",
    1: "stream end",
    0: "",
    "-1": "file error",
    "-2": "stream error",
    "-3": "data error",
    "-4": "insufficient memory",
    "-5": "buffer error",
    "-6": "incompatible version"
  }, _o = {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    Z_BINARY: 0,
    Z_TEXT: 1,
    Z_UNKNOWN: 2,
    Z_DEFLATED: 8
  };
  const { _tr_init: R2, _tr_stored_block: gc, _tr_flush_block: N2, _tr_tally: Fn, _tr_align: C2 } = B2, { Z_NO_FLUSH: Mn, Z_PARTIAL_FLUSH: L2, Z_FULL_FLUSH: F2, Z_FINISH: Et, Z_BLOCK: Zu, Z_OK: Ke, Z_STREAM_END: Yu, Z_STREAM_ERROR: zt, Z_DATA_ERROR: M2, Z_BUF_ERROR: Ca, Z_DEFAULT_COMPRESSION: D2, Z_FILTERED: K2, Z_HUFFMAN_ONLY: Go, Z_RLE: $2, Z_FIXED: V2, Z_DEFAULT_STRATEGY: z2, Z_UNKNOWN: j2, Z_DEFLATED: Zs } = _o, W2 = 9, G2 = 15, X2 = 8, q2 = 29, Z2 = 256, wc = Z2 + 1 + q2, Y2 = 30, J2 = 19, Q2 = 2 * wc + 1, eE = 15, ie = 3, Nn = 258, jt = Nn + ie + 1, tE = 32, bi = 42, gf = 57, bc = 69, mc = 73, _c = 91, Ec = 103, ir = 113, Di = 666, rt = 1, Ii = 2, Sr = 3, Ti = 4, nE = 3, or = (e, t) => (e.msg = Er[t], t), Ju = (e) => e * 2 - (e > 4 ? 9 : 0), Un = (e) => {
    let t = e.length;
    for (; --t >= 0; ) e[t] = 0;
  }, rE = (e) => {
    let t, n, r, i = e.w_size;
    t = e.hash_size, r = t;
    do
      n = e.head[--r], e.head[r] = n >= i ? n - i : 0;
    while (--t);
    t = i, r = t;
    do
      n = e.prev[--r], e.prev[r] = n >= i ? n - i : 0;
    while (--t);
  };
  let iE = (e, t, n) => (t << e.hash_shift ^ n) & e.hash_mask, Dn = iE;
  const ut = (e) => {
    const t = e.state;
    let n = t.pending;
    n > e.avail_out && (n = e.avail_out), n !== 0 && (e.output.set(t.pending_buf.subarray(t.pending_out, t.pending_out + n), e.next_out), e.next_out += n, t.pending_out += n, e.total_out += n, e.avail_out -= n, t.pending -= n, t.pending === 0 && (t.pending_out = 0));
  }, dt = (e, t) => {
    N2(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, ut(e.strm);
  }, se = (e, t) => {
    e.pending_buf[e.pending++] = t;
  }, Ri = (e, t) => {
    e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = t & 255;
  }, Sc = (e, t, n, r) => {
    let i = e.avail_in;
    return i > r && (i = r), i === 0 ? 0 : (e.avail_in -= i, t.set(e.input.subarray(e.next_in, e.next_in + i), n), e.state.wrap === 1 ? e.adler = io(e.adler, t, i, n) : e.state.wrap === 2 && (e.adler = Ne(e.adler, t, i, n)), e.next_in += i, e.total_in += i, i);
  }, V0 = (e, t) => {
    let n = e.max_chain_length, r = e.strstart, i, o, s = e.prev_length, a = e.nice_match;
    const f = e.strstart > e.w_size - jt ? e.strstart - (e.w_size - jt) : 0, u = e.window, c = e.w_mask, p = e.prev, y = e.strstart + Nn;
    let d = u[r + s - 1], w = u[r + s];
    e.prev_length >= e.good_match && (n >>= 2), a > e.lookahead && (a = e.lookahead);
    do
      if (i = t, !(u[i + s] !== w || u[i + s - 1] !== d || u[i] !== u[r] || u[++i] !== u[r + 1])) {
        r += 2, i++;
        do
          ;
        while (u[++r] === u[++i] && u[++r] === u[++i] && u[++r] === u[++i] && u[++r] === u[++i] && u[++r] === u[++i] && u[++r] === u[++i] && u[++r] === u[++i] && u[++r] === u[++i] && r < y);
        if (o = Nn - (y - r), r = y - Nn, o > s) {
          if (e.match_start = t, s = o, o >= a) break;
          d = u[r + s - 1], w = u[r + s];
        }
      }
    while ((t = p[t & c]) > f && --n !== 0);
    return s <= e.lookahead ? s : e.lookahead;
  }, mi = (e) => {
    const t = e.w_size;
    let n, r, i;
    do {
      if (r = e.window_size - e.lookahead - e.strstart, e.strstart >= t + (t - jt) && (e.window.set(e.window.subarray(t, t + t - r), 0), e.match_start -= t, e.strstart -= t, e.block_start -= t, e.insert > e.strstart && (e.insert = e.strstart), rE(e), r += t), e.strm.avail_in === 0) break;
      if (n = Sc(e.strm, e.window, e.strstart + e.lookahead, r), e.lookahead += n, e.lookahead + e.insert >= ie) for (i = e.strstart - e.insert, e.ins_h = e.window[i], e.ins_h = Dn(e, e.ins_h, e.window[i + 1]); e.insert && (e.ins_h = Dn(e, e.ins_h, e.window[i + ie - 1]), e.prev[i & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = i, i++, e.insert--, !(e.lookahead + e.insert < ie)); ) ;
    } while (e.lookahead < jt && e.strm.avail_in !== 0);
  }, z0 = (e, t) => {
    let n = e.pending_buf_size - 5 > e.w_size ? e.w_size : e.pending_buf_size - 5, r, i, o, s = 0, a = e.strm.avail_in;
    do {
      if (r = 65535, o = e.bi_valid + 42 >> 3, e.strm.avail_out < o || (o = e.strm.avail_out - o, i = e.strstart - e.block_start, r > i + e.strm.avail_in && (r = i + e.strm.avail_in), r > o && (r = o), r < n && (r === 0 && t !== Et || t === Mn || r !== i + e.strm.avail_in))) break;
      s = t === Et && r === i + e.strm.avail_in ? 1 : 0, gc(e, 0, 0, s), e.pending_buf[e.pending - 4] = r, e.pending_buf[e.pending - 3] = r >> 8, e.pending_buf[e.pending - 2] = ~r, e.pending_buf[e.pending - 1] = ~r >> 8, ut(e.strm), i && (i > r && (i = r), e.strm.output.set(e.window.subarray(e.block_start, e.block_start + i), e.strm.next_out), e.strm.next_out += i, e.strm.avail_out -= i, e.strm.total_out += i, e.block_start += i, r -= i), r && (Sc(e.strm, e.strm.output, e.strm.next_out, r), e.strm.next_out += r, e.strm.avail_out -= r, e.strm.total_out += r);
    } while (s === 0);
    return a -= e.strm.avail_in, a && (a >= e.w_size ? (e.matches = 2, e.window.set(e.strm.input.subarray(e.strm.next_in - e.w_size, e.strm.next_in), 0), e.strstart = e.w_size, e.insert = e.strstart) : (e.window_size - e.strstart <= a && (e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, e.insert > e.strstart && (e.insert = e.strstart)), e.window.set(e.strm.input.subarray(e.strm.next_in - a, e.strm.next_in), e.strstart), e.strstart += a, e.insert += a > e.w_size - e.insert ? e.w_size - e.insert : a), e.block_start = e.strstart), e.high_water < e.strstart && (e.high_water = e.strstart), s ? Ti : t !== Mn && t !== Et && e.strm.avail_in === 0 && e.strstart === e.block_start ? Ii : (o = e.window_size - e.strstart, e.strm.avail_in > o && e.block_start >= e.w_size && (e.block_start -= e.w_size, e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, o += e.w_size, e.insert > e.strstart && (e.insert = e.strstart)), o > e.strm.avail_in && (o = e.strm.avail_in), o && (Sc(e.strm, e.window, e.strstart, o), e.strstart += o, e.insert += o > e.w_size - e.insert ? e.w_size - e.insert : o), e.high_water < e.strstart && (e.high_water = e.strstart), o = e.bi_valid + 42 >> 3, o = e.pending_buf_size - o > 65535 ? 65535 : e.pending_buf_size - o, n = o > e.w_size ? e.w_size : o, i = e.strstart - e.block_start, (i >= n || (i || t === Et) && t !== Mn && e.strm.avail_in === 0 && i <= o) && (r = i > o ? o : i, s = t === Et && e.strm.avail_in === 0 && r === i ? 1 : 0, gc(e, e.block_start, r, s), e.block_start += r, ut(e.strm)), s ? Sr : rt);
  }, La = (e, t) => {
    let n, r;
    for (; ; ) {
      if (e.lookahead < jt) {
        if (mi(e), e.lookahead < jt && t === Mn) return rt;
        if (e.lookahead === 0) break;
      }
      if (n = 0, e.lookahead >= ie && (e.ins_h = Dn(e, e.ins_h, e.window[e.strstart + ie - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), n !== 0 && e.strstart - n <= e.w_size - jt && (e.match_length = V0(e, n)), e.match_length >= ie) if (r = Fn(e, e.strstart - e.match_start, e.match_length - ie), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= ie) {
        e.match_length--;
        do
          e.strstart++, e.ins_h = Dn(e, e.ins_h, e.window[e.strstart + ie - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart;
        while (--e.match_length !== 0);
        e.strstart++;
      } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = Dn(e, e.ins_h, e.window[e.strstart + 1]);
      else r = Fn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
      if (r && (dt(e, false), e.strm.avail_out === 0)) return rt;
    }
    return e.insert = e.strstart < ie - 1 ? e.strstart : ie - 1, t === Et ? (dt(e, true), e.strm.avail_out === 0 ? Sr : Ti) : e.sym_next && (dt(e, false), e.strm.avail_out === 0) ? rt : Ii;
  }, Yr = (e, t) => {
    let n, r, i;
    for (; ; ) {
      if (e.lookahead < jt) {
        if (mi(e), e.lookahead < jt && t === Mn) return rt;
        if (e.lookahead === 0) break;
      }
      if (n = 0, e.lookahead >= ie && (e.ins_h = Dn(e, e.ins_h, e.window[e.strstart + ie - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = ie - 1, n !== 0 && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - jt && (e.match_length = V0(e, n), e.match_length <= 5 && (e.strategy === K2 || e.match_length === ie && e.strstart - e.match_start > 4096) && (e.match_length = ie - 1)), e.prev_length >= ie && e.match_length <= e.prev_length) {
        i = e.strstart + e.lookahead - ie, r = Fn(e, e.strstart - 1 - e.prev_match, e.prev_length - ie), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
        do
          ++e.strstart <= i && (e.ins_h = Dn(e, e.ins_h, e.window[e.strstart + ie - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart);
        while (--e.prev_length !== 0);
        if (e.match_available = 0, e.match_length = ie - 1, e.strstart++, r && (dt(e, false), e.strm.avail_out === 0)) return rt;
      } else if (e.match_available) {
        if (r = Fn(e, 0, e.window[e.strstart - 1]), r && dt(e, false), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return rt;
      } else e.match_available = 1, e.strstart++, e.lookahead--;
    }
    return e.match_available && (r = Fn(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < ie - 1 ? e.strstart : ie - 1, t === Et ? (dt(e, true), e.strm.avail_out === 0 ? Sr : Ti) : e.sym_next && (dt(e, false), e.strm.avail_out === 0) ? rt : Ii;
  }, oE = (e, t) => {
    let n, r, i, o;
    const s = e.window;
    for (; ; ) {
      if (e.lookahead <= Nn) {
        if (mi(e), e.lookahead <= Nn && t === Mn) return rt;
        if (e.lookahead === 0) break;
      }
      if (e.match_length = 0, e.lookahead >= ie && e.strstart > 0 && (i = e.strstart - 1, r = s[i], r === s[++i] && r === s[++i] && r === s[++i])) {
        o = e.strstart + Nn;
        do
          ;
        while (r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && r === s[++i] && i < o);
        e.match_length = Nn - (o - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
      }
      if (e.match_length >= ie ? (n = Fn(e, 1, e.match_length - ie), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (n = Fn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), n && (dt(e, false), e.strm.avail_out === 0)) return rt;
    }
    return e.insert = 0, t === Et ? (dt(e, true), e.strm.avail_out === 0 ? Sr : Ti) : e.sym_next && (dt(e, false), e.strm.avail_out === 0) ? rt : Ii;
  }, sE = (e, t) => {
    let n;
    for (; ; ) {
      if (e.lookahead === 0 && (mi(e), e.lookahead === 0)) {
        if (t === Mn) return rt;
        break;
      }
      if (e.match_length = 0, n = Fn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, n && (dt(e, false), e.strm.avail_out === 0)) return rt;
    }
    return e.insert = 0, t === Et ? (dt(e, true), e.strm.avail_out === 0 ? Sr : Ti) : e.sym_next && (dt(e, false), e.strm.avail_out === 0) ? rt : Ii;
  };
  function Ft(e, t, n, r, i) {
    this.good_length = e, this.max_lazy = t, this.nice_length = n, this.max_chain = r, this.func = i;
  }
  const Ki = [
    new Ft(0, 0, 0, 0, z0),
    new Ft(4, 4, 8, 4, La),
    new Ft(4, 5, 16, 8, La),
    new Ft(4, 6, 32, 32, La),
    new Ft(4, 4, 16, 16, Yr),
    new Ft(8, 16, 32, 32, Yr),
    new Ft(8, 16, 128, 128, Yr),
    new Ft(8, 32, 128, 256, Yr),
    new Ft(32, 128, 258, 1024, Yr),
    new Ft(32, 258, 258, 4096, Yr)
  ], aE = (e) => {
    e.window_size = 2 * e.w_size, Un(e.head), e.max_lazy_match = Ki[e.level].max_lazy, e.good_match = Ki[e.level].good_length, e.nice_match = Ki[e.level].nice_length, e.max_chain_length = Ki[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = ie - 1, e.match_available = 0, e.ins_h = 0;
  };
  function cE() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Zs, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(Q2 * 2), this.dyn_dtree = new Uint16Array((2 * Y2 + 1) * 2), this.bl_tree = new Uint16Array((2 * J2 + 1) * 2), Un(this.dyn_ltree), Un(this.dyn_dtree), Un(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(eE + 1), this.heap = new Uint16Array(2 * wc + 1), Un(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(2 * wc + 1), Un(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  const Eo = (e) => {
    if (!e) return 1;
    const t = e.state;
    return !t || t.strm !== e || t.status !== bi && t.status !== gf && t.status !== bc && t.status !== mc && t.status !== _c && t.status !== Ec && t.status !== ir && t.status !== Di ? 1 : 0;
  }, j0 = (e) => {
    if (Eo(e)) return or(e, zt);
    e.total_in = e.total_out = 0, e.data_type = j2;
    const t = e.state;
    return t.pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap === 2 ? gf : t.wrap ? bi : ir, e.adler = t.wrap === 2 ? 0 : 1, t.last_flush = -2, R2(t), Ke;
  }, W0 = (e) => {
    const t = j0(e);
    return t === Ke && aE(e.state), t;
  }, fE = (e, t) => Eo(e) || e.state.wrap !== 2 ? zt : (e.state.gzhead = t, Ke), G0 = (e, t, n, r, i, o) => {
    if (!e) return zt;
    let s = 1;
    if (t === D2 && (t = 6), r < 0 ? (s = 0, r = -r) : r > 15 && (s = 2, r -= 16), i < 1 || i > W2 || n !== Zs || r < 8 || r > 15 || t < 0 || t > 9 || o < 0 || o > V2 || r === 8 && s !== 1) return or(e, zt);
    r === 8 && (r = 9);
    const a = new cE();
    return e.state = a, a.strm = e, a.status = bi, a.wrap = s, a.gzhead = null, a.w_bits = r, a.w_size = 1 << a.w_bits, a.w_mask = a.w_size - 1, a.hash_bits = i + 7, a.hash_size = 1 << a.hash_bits, a.hash_mask = a.hash_size - 1, a.hash_shift = ~~((a.hash_bits + ie - 1) / ie), a.window = new Uint8Array(a.w_size * 2), a.head = new Uint16Array(a.hash_size), a.prev = new Uint16Array(a.w_size), a.lit_bufsize = 1 << i + 6, a.pending_buf_size = a.lit_bufsize * 4, a.pending_buf = new Uint8Array(a.pending_buf_size), a.sym_buf = a.lit_bufsize, a.sym_end = (a.lit_bufsize - 1) * 3, a.level = t, a.strategy = o, a.method = n, W0(e);
  }, uE = (e, t) => G0(e, t, Zs, G2, X2, z2), lE = (e, t) => {
    if (Eo(e) || t > Zu || t < 0) return e ? or(e, zt) : zt;
    const n = e.state;
    if (!e.output || e.avail_in !== 0 && !e.input || n.status === Di && t !== Et) return or(e, e.avail_out === 0 ? Ca : zt);
    const r = n.last_flush;
    if (n.last_flush = t, n.pending !== 0) {
      if (ut(e), e.avail_out === 0) return n.last_flush = -1, Ke;
    } else if (e.avail_in === 0 && Ju(t) <= Ju(r) && t !== Et) return or(e, Ca);
    if (n.status === Di && e.avail_in !== 0) return or(e, Ca);
    if (n.status === bi && n.wrap === 0 && (n.status = ir), n.status === bi) {
      let i = Zs + (n.w_bits - 8 << 4) << 8, o = -1;
      if (n.strategy >= Go || n.level < 2 ? o = 0 : n.level < 6 ? o = 1 : n.level === 6 ? o = 2 : o = 3, i |= o << 6, n.strstart !== 0 && (i |= tE), i += 31 - i % 31, Ri(n, i), n.strstart !== 0 && (Ri(n, e.adler >>> 16), Ri(n, e.adler & 65535)), e.adler = 1, n.status = ir, ut(e), n.pending !== 0) return n.last_flush = -1, Ke;
    }
    if (n.status === gf) {
      if (e.adler = 0, se(n, 31), se(n, 139), se(n, 8), n.gzhead) se(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), se(n, n.gzhead.time & 255), se(n, n.gzhead.time >> 8 & 255), se(n, n.gzhead.time >> 16 & 255), se(n, n.gzhead.time >> 24 & 255), se(n, n.level === 9 ? 2 : n.strategy >= Go || n.level < 2 ? 4 : 0), se(n, n.gzhead.os & 255), n.gzhead.extra && n.gzhead.extra.length && (se(n, n.gzhead.extra.length & 255), se(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = Ne(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = bc;
      else if (se(n, 0), se(n, 0), se(n, 0), se(n, 0), se(n, 0), se(n, n.level === 9 ? 2 : n.strategy >= Go || n.level < 2 ? 4 : 0), se(n, nE), n.status = ir, ut(e), n.pending !== 0) return n.last_flush = -1, Ke;
    }
    if (n.status === bc) {
      if (n.gzhead.extra) {
        let i = n.pending, o = (n.gzhead.extra.length & 65535) - n.gzindex;
        for (; n.pending + o > n.pending_buf_size; ) {
          let a = n.pending_buf_size - n.pending;
          if (n.pending_buf.set(n.gzhead.extra.subarray(n.gzindex, n.gzindex + a), n.pending), n.pending = n.pending_buf_size, n.gzhead.hcrc && n.pending > i && (e.adler = Ne(e.adler, n.pending_buf, n.pending - i, i)), n.gzindex += a, ut(e), n.pending !== 0) return n.last_flush = -1, Ke;
          i = 0, o -= a;
        }
        let s = new Uint8Array(n.gzhead.extra);
        n.pending_buf.set(s.subarray(n.gzindex, n.gzindex + o), n.pending), n.pending += o, n.gzhead.hcrc && n.pending > i && (e.adler = Ne(e.adler, n.pending_buf, n.pending - i, i)), n.gzindex = 0;
      }
      n.status = mc;
    }
    if (n.status === mc) {
      if (n.gzhead.name) {
        let i = n.pending, o;
        do {
          if (n.pending === n.pending_buf_size) {
            if (n.gzhead.hcrc && n.pending > i && (e.adler = Ne(e.adler, n.pending_buf, n.pending - i, i)), ut(e), n.pending !== 0) return n.last_flush = -1, Ke;
            i = 0;
          }
          n.gzindex < n.gzhead.name.length ? o = n.gzhead.name.charCodeAt(n.gzindex++) & 255 : o = 0, se(n, o);
        } while (o !== 0);
        n.gzhead.hcrc && n.pending > i && (e.adler = Ne(e.adler, n.pending_buf, n.pending - i, i)), n.gzindex = 0;
      }
      n.status = _c;
    }
    if (n.status === _c) {
      if (n.gzhead.comment) {
        let i = n.pending, o;
        do {
          if (n.pending === n.pending_buf_size) {
            if (n.gzhead.hcrc && n.pending > i && (e.adler = Ne(e.adler, n.pending_buf, n.pending - i, i)), ut(e), n.pending !== 0) return n.last_flush = -1, Ke;
            i = 0;
          }
          n.gzindex < n.gzhead.comment.length ? o = n.gzhead.comment.charCodeAt(n.gzindex++) & 255 : o = 0, se(n, o);
        } while (o !== 0);
        n.gzhead.hcrc && n.pending > i && (e.adler = Ne(e.adler, n.pending_buf, n.pending - i, i));
      }
      n.status = Ec;
    }
    if (n.status === Ec) {
      if (n.gzhead.hcrc) {
        if (n.pending + 2 > n.pending_buf_size && (ut(e), n.pending !== 0)) return n.last_flush = -1, Ke;
        se(n, e.adler & 255), se(n, e.adler >> 8 & 255), e.adler = 0;
      }
      if (n.status = ir, ut(e), n.pending !== 0) return n.last_flush = -1, Ke;
    }
    if (e.avail_in !== 0 || n.lookahead !== 0 || t !== Mn && n.status !== Di) {
      let i = n.level === 0 ? z0(n, t) : n.strategy === Go ? sE(n, t) : n.strategy === $2 ? oE(n, t) : Ki[n.level].func(n, t);
      if ((i === Sr || i === Ti) && (n.status = Di), i === rt || i === Sr) return e.avail_out === 0 && (n.last_flush = -1), Ke;
      if (i === Ii && (t === L2 ? C2(n) : t !== Zu && (gc(n, 0, 0, false), t === F2 && (Un(n.head), n.lookahead === 0 && (n.strstart = 0, n.block_start = 0, n.insert = 0))), ut(e), e.avail_out === 0)) return n.last_flush = -1, Ke;
    }
    return t !== Et ? Ke : n.wrap <= 0 ? Yu : (n.wrap === 2 ? (se(n, e.adler & 255), se(n, e.adler >> 8 & 255), se(n, e.adler >> 16 & 255), se(n, e.adler >> 24 & 255), se(n, e.total_in & 255), se(n, e.total_in >> 8 & 255), se(n, e.total_in >> 16 & 255), se(n, e.total_in >> 24 & 255)) : (Ri(n, e.adler >>> 16), Ri(n, e.adler & 65535)), ut(e), n.wrap > 0 && (n.wrap = -n.wrap), n.pending !== 0 ? Ke : Yu);
  }, hE = (e) => {
    if (Eo(e)) return zt;
    const t = e.state.status;
    return e.state = null, t === ir ? or(e, M2) : Ke;
  }, dE = (e, t) => {
    let n = t.length;
    if (Eo(e)) return zt;
    const r = e.state, i = r.wrap;
    if (i === 2 || i === 1 && r.status !== bi || r.lookahead) return zt;
    if (i === 1 && (e.adler = io(e.adler, t, n, 0)), r.wrap = 0, n >= r.w_size) {
      i === 0 && (Un(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0);
      let f = new Uint8Array(r.w_size);
      f.set(t.subarray(n - r.w_size, n), 0), t = f, n = r.w_size;
    }
    const o = e.avail_in, s = e.next_in, a = e.input;
    for (e.avail_in = n, e.next_in = 0, e.input = t, mi(r); r.lookahead >= ie; ) {
      let f = r.strstart, u = r.lookahead - (ie - 1);
      do
        r.ins_h = Dn(r, r.ins_h, r.window[f + ie - 1]), r.prev[f & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = f, f++;
      while (--u);
      r.strstart = f, r.lookahead = ie - 1, mi(r);
    }
    return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = ie - 1, r.match_available = 0, e.next_in = s, e.input = a, e.avail_in = o, r.wrap = i, Ke;
  };
  var pE = uE, yE = G0, gE = W0, wE = j0, bE = fE, mE = lE, _E = hE, EE = dE, SE = "pako deflate (from Nodeca project)", Wi = {
    deflateInit: pE,
    deflateInit2: yE,
    deflateReset: gE,
    deflateResetKeep: wE,
    deflateSetHeader: bE,
    deflate: mE,
    deflateEnd: _E,
    deflateSetDictionary: EE,
    deflateInfo: SE
  };
  const xE = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
  var vE = function(e) {
    const t = Array.prototype.slice.call(arguments, 1);
    for (; t.length; ) {
      const n = t.shift();
      if (n) {
        if (typeof n != "object") throw new TypeError(n + "must be non-object");
        for (const r in n) xE(n, r) && (e[r] = n[r]);
      }
    }
    return e;
  }, IE = (e) => {
    let t = 0;
    for (let r = 0, i = e.length; r < i; r++) t += e[r].length;
    const n = new Uint8Array(t);
    for (let r = 0, i = 0, o = e.length; r < o; r++) {
      let s = e[r];
      n.set(s, i), i += s.length;
    }
    return n;
  }, Ys = {
    assign: vE,
    flattenChunks: IE
  };
  let X0 = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch {
    X0 = false;
  }
  const oo = new Uint8Array(256);
  for (let e = 0; e < 256; e++) oo[e] = e >= 252 ? 6 : e >= 248 ? 5 : e >= 240 ? 4 : e >= 224 ? 3 : e >= 192 ? 2 : 1;
  oo[254] = oo[254] = 1;
  var TE = (e) => {
    if (typeof TextEncoder == "function" && TextEncoder.prototype.encode) return new TextEncoder().encode(e);
    let t, n, r, i, o, s = e.length, a = 0;
    for (i = 0; i < s; i++) n = e.charCodeAt(i), (n & 64512) === 55296 && i + 1 < s && (r = e.charCodeAt(i + 1), (r & 64512) === 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), a += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
    for (t = new Uint8Array(a), o = 0, i = 0; o < a; i++) n = e.charCodeAt(i), (n & 64512) === 55296 && i + 1 < s && (r = e.charCodeAt(i + 1), (r & 64512) === 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), n < 128 ? t[o++] = n : n < 2048 ? (t[o++] = 192 | n >>> 6, t[o++] = 128 | n & 63) : n < 65536 ? (t[o++] = 224 | n >>> 12, t[o++] = 128 | n >>> 6 & 63, t[o++] = 128 | n & 63) : (t[o++] = 240 | n >>> 18, t[o++] = 128 | n >>> 12 & 63, t[o++] = 128 | n >>> 6 & 63, t[o++] = 128 | n & 63);
    return t;
  };
  const AE = (e, t) => {
    if (t < 65534 && e.subarray && X0) return String.fromCharCode.apply(null, e.length === t ? e : e.subarray(0, t));
    let n = "";
    for (let r = 0; r < t; r++) n += String.fromCharCode(e[r]);
    return n;
  };
  var kE = (e, t) => {
    const n = t || e.length;
    if (typeof TextDecoder == "function" && TextDecoder.prototype.decode) return new TextDecoder().decode(e.subarray(0, t));
    let r, i;
    const o = new Array(n * 2);
    for (i = 0, r = 0; r < n; ) {
      let s = e[r++];
      if (s < 128) {
        o[i++] = s;
        continue;
      }
      let a = oo[s];
      if (a > 4) {
        o[i++] = 65533, r += a - 1;
        continue;
      }
      for (s &= a === 2 ? 31 : a === 3 ? 15 : 7; a > 1 && r < n; ) s = s << 6 | e[r++] & 63, a--;
      if (a > 1) {
        o[i++] = 65533;
        continue;
      }
      s < 65536 ? o[i++] = s : (s -= 65536, o[i++] = 55296 | s >> 10 & 1023, o[i++] = 56320 | s & 1023);
    }
    return AE(o, i);
  }, BE = (e, t) => {
    t = t || e.length, t > e.length && (t = e.length);
    let n = t - 1;
    for (; n >= 0 && (e[n] & 192) === 128; ) n--;
    return n < 0 || n === 0 ? t : n + oo[e[n]] > t ? n : t;
  }, so = {
    string2buf: TE,
    buf2string: kE,
    utf8border: BE
  };
  function PE() {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
  }
  var q0 = PE;
  const Z0 = Object.prototype.toString, { Z_NO_FLUSH: OE, Z_SYNC_FLUSH: HE, Z_FULL_FLUSH: UE, Z_FINISH: RE, Z_OK: Es, Z_STREAM_END: NE, Z_DEFAULT_COMPRESSION: CE, Z_DEFAULT_STRATEGY: LE, Z_DEFLATED: FE } = _o;
  function So(e) {
    this.options = Ys.assign({
      level: CE,
      method: FE,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: LE
    }, e || {});
    let t = this.options;
    t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new q0(), this.strm.avail_out = 0;
    let n = Wi.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
    if (n !== Es) throw new Error(Er[n]);
    if (t.header && Wi.deflateSetHeader(this.strm, t.header), t.dictionary) {
      let r;
      if (typeof t.dictionary == "string" ? r = so.string2buf(t.dictionary) : Z0.call(t.dictionary) === "[object ArrayBuffer]" ? r = new Uint8Array(t.dictionary) : r = t.dictionary, n = Wi.deflateSetDictionary(this.strm, r), n !== Es) throw new Error(Er[n]);
      this._dict_set = true;
    }
  }
  So.prototype.push = function(e, t) {
    const n = this.strm, r = this.options.chunkSize;
    let i, o;
    if (this.ended) return false;
    for (t === ~~t ? o = t : o = t === true ? RE : OE, typeof e == "string" ? n.input = so.string2buf(e) : Z0.call(e) === "[object ArrayBuffer]" ? n.input = new Uint8Array(e) : n.input = e, n.next_in = 0, n.avail_in = n.input.length; ; ) {
      if (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), (o === HE || o === UE) && n.avail_out <= 6) {
        this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
        continue;
      }
      if (i = Wi.deflate(n, o), i === NE) return n.next_out > 0 && this.onData(n.output.subarray(0, n.next_out)), i = Wi.deflateEnd(this.strm), this.onEnd(i), this.ended = true, i === Es;
      if (n.avail_out === 0) {
        this.onData(n.output);
        continue;
      }
      if (o > 0 && n.next_out > 0) {
        this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
        continue;
      }
      if (n.avail_in === 0) break;
    }
    return true;
  };
  So.prototype.onData = function(e) {
    this.chunks.push(e);
  };
  So.prototype.onEnd = function(e) {
    e === Es && (this.result = Ys.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
  };
  function wf(e, t) {
    const n = new So(t);
    if (n.push(e, true), n.err) throw n.msg || Er[n.err];
    return n.result;
  }
  function ME(e, t) {
    return t = t || {}, t.raw = true, wf(e, t);
  }
  function DE(e, t) {
    return t = t || {}, t.gzip = true, wf(e, t);
  }
  var KE = So, $E = wf, VE = ME, zE = DE, jE = {
    Deflate: KE,
    deflate: $E,
    deflateRaw: VE,
    gzip: zE
  };
  const Xo = 16209, WE = 16191;
  var GE = function(t, n) {
    let r, i, o, s, a, f, u, c, p, y, d, w, b, S, A, O, E, m, k, T, R, M, v, H;
    const D = t.state;
    r = t.next_in, v = t.input, i = r + (t.avail_in - 5), o = t.next_out, H = t.output, s = o - (n - t.avail_out), a = o + (t.avail_out - 257), f = D.dmax, u = D.wsize, c = D.whave, p = D.wnext, y = D.window, d = D.hold, w = D.bits, b = D.lencode, S = D.distcode, A = (1 << D.lenbits) - 1, O = (1 << D.distbits) - 1;
    e: do {
      w < 15 && (d += v[r++] << w, w += 8, d += v[r++] << w, w += 8), E = b[d & A];
      t: for (; ; ) {
        if (m = E >>> 24, d >>>= m, w -= m, m = E >>> 16 & 255, m === 0) H[o++] = E & 65535;
        else if (m & 16) {
          k = E & 65535, m &= 15, m && (w < m && (d += v[r++] << w, w += 8), k += d & (1 << m) - 1, d >>>= m, w -= m), w < 15 && (d += v[r++] << w, w += 8, d += v[r++] << w, w += 8), E = S[d & O];
          n: for (; ; ) {
            if (m = E >>> 24, d >>>= m, w -= m, m = E >>> 16 & 255, m & 16) {
              if (T = E & 65535, m &= 15, w < m && (d += v[r++] << w, w += 8, w < m && (d += v[r++] << w, w += 8)), T += d & (1 << m) - 1, T > f) {
                t.msg = "invalid distance too far back", D.mode = Xo;
                break e;
              }
              if (d >>>= m, w -= m, m = o - s, T > m) {
                if (m = T - m, m > c && D.sane) {
                  t.msg = "invalid distance too far back", D.mode = Xo;
                  break e;
                }
                if (R = 0, M = y, p === 0) {
                  if (R += u - m, m < k) {
                    k -= m;
                    do
                      H[o++] = y[R++];
                    while (--m);
                    R = o - T, M = H;
                  }
                } else if (p < m) {
                  if (R += u + p - m, m -= p, m < k) {
                    k -= m;
                    do
                      H[o++] = y[R++];
                    while (--m);
                    if (R = 0, p < k) {
                      m = p, k -= m;
                      do
                        H[o++] = y[R++];
                      while (--m);
                      R = o - T, M = H;
                    }
                  }
                } else if (R += p - m, m < k) {
                  k -= m;
                  do
                    H[o++] = y[R++];
                  while (--m);
                  R = o - T, M = H;
                }
                for (; k > 2; ) H[o++] = M[R++], H[o++] = M[R++], H[o++] = M[R++], k -= 3;
                k && (H[o++] = M[R++], k > 1 && (H[o++] = M[R++]));
              } else {
                R = o - T;
                do
                  H[o++] = H[R++], H[o++] = H[R++], H[o++] = H[R++], k -= 3;
                while (k > 2);
                k && (H[o++] = H[R++], k > 1 && (H[o++] = H[R++]));
              }
            } else if (m & 64) {
              t.msg = "invalid distance code", D.mode = Xo;
              break e;
            } else {
              E = S[(E & 65535) + (d & (1 << m) - 1)];
              continue n;
            }
            break;
          }
        } else if (m & 64) if (m & 32) {
          D.mode = WE;
          break e;
        } else {
          t.msg = "invalid literal/length code", D.mode = Xo;
          break e;
        }
        else {
          E = b[(E & 65535) + (d & (1 << m) - 1)];
          continue t;
        }
        break;
      }
    } while (r < i && o < a);
    k = w >> 3, r -= k, w -= k << 3, d &= (1 << w) - 1, t.next_in = r, t.next_out = o, t.avail_in = r < i ? 5 + (i - r) : 5 - (r - i), t.avail_out = o < a ? 257 + (a - o) : 257 - (o - a), D.hold = d, D.bits = w;
  };
  const Jr = 15, Qu = 852, el = 592, tl = 0, Fa = 1, nl = 2, XE = new Uint16Array([
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ]), qE = new Uint8Array([
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ]), ZE = new Uint16Array([
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ]), YE = new Uint8Array([
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ]), JE = (e, t, n, r, i, o, s, a) => {
    const f = a.bits;
    let u = 0, c = 0, p = 0, y = 0, d = 0, w = 0, b = 0, S = 0, A = 0, O = 0, E, m, k, T, R, M = null, v;
    const H = new Uint16Array(Jr + 1), D = new Uint16Array(Jr + 1);
    let $ = null, N, U, C;
    for (u = 0; u <= Jr; u++) H[u] = 0;
    for (c = 0; c < r; c++) H[t[n + c]]++;
    for (d = f, y = Jr; y >= 1 && H[y] === 0; y--) ;
    if (d > y && (d = y), y === 0) return i[o++] = 1 << 24 | 64 << 16 | 0, i[o++] = 1 << 24 | 64 << 16 | 0, a.bits = 1, 0;
    for (p = 1; p < y && H[p] === 0; p++) ;
    for (d < p && (d = p), S = 1, u = 1; u <= Jr; u++) if (S <<= 1, S -= H[u], S < 0) return -1;
    if (S > 0 && (e === tl || y !== 1)) return -1;
    for (D[1] = 0, u = 1; u < Jr; u++) D[u + 1] = D[u] + H[u];
    for (c = 0; c < r; c++) t[n + c] !== 0 && (s[D[t[n + c]]++] = c);
    if (e === tl ? (M = $ = s, v = 20) : e === Fa ? (M = XE, $ = qE, v = 257) : (M = ZE, $ = YE, v = 0), O = 0, c = 0, u = p, R = o, w = d, b = 0, k = -1, A = 1 << d, T = A - 1, e === Fa && A > Qu || e === nl && A > el) return 1;
    for (; ; ) {
      N = u - b, s[c] + 1 < v ? (U = 0, C = s[c]) : s[c] >= v ? (U = $[s[c] - v], C = M[s[c] - v]) : (U = 96, C = 0), E = 1 << u - b, m = 1 << w, p = m;
      do
        m -= E, i[R + (O >> b) + m] = N << 24 | U << 16 | C | 0;
      while (m !== 0);
      for (E = 1 << u - 1; O & E; ) E >>= 1;
      if (E !== 0 ? (O &= E - 1, O += E) : O = 0, c++, --H[u] === 0) {
        if (u === y) break;
        u = t[n + s[c]];
      }
      if (u > d && (O & T) !== k) {
        for (b === 0 && (b = d), R += p, w = u - b, S = 1 << w; w + b < y && (S -= H[w + b], !(S <= 0)); ) w++, S <<= 1;
        if (A += 1 << w, e === Fa && A > Qu || e === nl && A > el) return 1;
        k = O & T, i[k] = d << 24 | w << 16 | R - o | 0;
      }
    }
    return O !== 0 && (i[R + O] = u - b << 24 | 64 << 16 | 0), a.bits = d, 0;
  };
  var Gi = JE;
  const QE = 0, Y0 = 1, J0 = 2, { Z_FINISH: rl, Z_BLOCK: eS, Z_TREES: qo, Z_OK: xr, Z_STREAM_END: tS, Z_NEED_DICT: nS, Z_STREAM_ERROR: At, Z_DATA_ERROR: Q0, Z_MEM_ERROR: ep, Z_BUF_ERROR: rS, Z_DEFLATED: il } = _o, Js = 16180, ol = 16181, sl = 16182, al = 16183, cl = 16184, fl = 16185, ul = 16186, ll = 16187, hl = 16188, dl = 16189, Ss = 16190, rn = 16191, Ma = 16192, pl = 16193, Da = 16194, yl = 16195, gl = 16196, wl = 16197, bl = 16198, Zo = 16199, Yo = 16200, ml = 16201, _l = 16202, El = 16203, Sl = 16204, xl = 16205, Ka = 16206, vl = 16207, Il = 16208, _e = 16209, tp = 16210, np = 16211, iS = 852, oS = 592, sS = 15, aS = sS, Tl = (e) => (e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24);
  function cS() {
    this.strm = null, this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
  const $r = (e) => {
    if (!e) return 1;
    const t = e.state;
    return !t || t.strm !== e || t.mode < Js || t.mode > np ? 1 : 0;
  }, rp = (e) => {
    if ($r(e)) return At;
    const t = e.state;
    return e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = t.wrap & 1), t.mode = Js, t.last = 0, t.havedict = 0, t.flags = -1, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Int32Array(iS), t.distcode = t.distdyn = new Int32Array(oS), t.sane = 1, t.back = -1, xr;
  }, ip = (e) => {
    if ($r(e)) return At;
    const t = e.state;
    return t.wsize = 0, t.whave = 0, t.wnext = 0, rp(e);
  }, op = (e, t) => {
    let n;
    if ($r(e)) return At;
    const r = e.state;
    return t < 0 ? (n = 0, t = -t) : (n = (t >> 4) + 5, t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? At : (r.window !== null && r.wbits !== t && (r.window = null), r.wrap = n, r.wbits = t, ip(e));
  }, sp = (e, t) => {
    if (!e) return At;
    const n = new cS();
    e.state = n, n.strm = e, n.window = null, n.mode = Js;
    const r = op(e, t);
    return r !== xr && (e.state = null), r;
  }, fS = (e) => sp(e, aS);
  let Al = true, $a, Va;
  const uS = (e) => {
    if (Al) {
      $a = new Int32Array(512), Va = new Int32Array(32);
      let t = 0;
      for (; t < 144; ) e.lens[t++] = 8;
      for (; t < 256; ) e.lens[t++] = 9;
      for (; t < 280; ) e.lens[t++] = 7;
      for (; t < 288; ) e.lens[t++] = 8;
      for (Gi(Y0, e.lens, 0, 288, $a, 0, e.work, {
        bits: 9
      }), t = 0; t < 32; ) e.lens[t++] = 5;
      Gi(J0, e.lens, 0, 32, Va, 0, e.work, {
        bits: 5
      }), Al = false;
    }
    e.lencode = $a, e.lenbits = 9, e.distcode = Va, e.distbits = 5;
  }, ap = (e, t, n, r) => {
    let i;
    const o = e.state;
    return o.window === null && (o.wsize = 1 << o.wbits, o.wnext = 0, o.whave = 0, o.window = new Uint8Array(o.wsize)), r >= o.wsize ? (o.window.set(t.subarray(n - o.wsize, n), 0), o.wnext = 0, o.whave = o.wsize) : (i = o.wsize - o.wnext, i > r && (i = r), o.window.set(t.subarray(n - r, n - r + i), o.wnext), r -= i, r ? (o.window.set(t.subarray(n - r, n), 0), o.wnext = r, o.whave = o.wsize) : (o.wnext += i, o.wnext === o.wsize && (o.wnext = 0), o.whave < o.wsize && (o.whave += i))), 0;
  }, lS = (e, t) => {
    let n, r, i, o, s, a, f, u, c, p, y, d, w, b, S = 0, A, O, E, m, k, T, R, M;
    const v = new Uint8Array(4);
    let H, D;
    const $ = new Uint8Array([
      16,
      17,
      18,
      0,
      8,
      7,
      9,
      6,
      10,
      5,
      11,
      4,
      12,
      3,
      13,
      2,
      14,
      1,
      15
    ]);
    if ($r(e) || !e.output || !e.input && e.avail_in !== 0) return At;
    n = e.state, n.mode === rn && (n.mode = Ma), s = e.next_out, i = e.output, f = e.avail_out, o = e.next_in, r = e.input, a = e.avail_in, u = n.hold, c = n.bits, p = a, y = f, M = xr;
    e: for (; ; ) switch (n.mode) {
      case Js:
        if (n.wrap === 0) {
          n.mode = Ma;
          break;
        }
        for (; c < 16; ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        if (n.wrap & 2 && u === 35615) {
          n.wbits === 0 && (n.wbits = 15), n.check = 0, v[0] = u & 255, v[1] = u >>> 8 & 255, n.check = Ne(n.check, v, 2, 0), u = 0, c = 0, n.mode = ol;
          break;
        }
        if (n.head && (n.head.done = false), !(n.wrap & 1) || (((u & 255) << 8) + (u >> 8)) % 31) {
          e.msg = "incorrect header check", n.mode = _e;
          break;
        }
        if ((u & 15) !== il) {
          e.msg = "unknown compression method", n.mode = _e;
          break;
        }
        if (u >>>= 4, c -= 4, R = (u & 15) + 8, n.wbits === 0 && (n.wbits = R), R > 15 || R > n.wbits) {
          e.msg = "invalid window size", n.mode = _e;
          break;
        }
        n.dmax = 1 << n.wbits, n.flags = 0, e.adler = n.check = 1, n.mode = u & 512 ? dl : rn, u = 0, c = 0;
        break;
      case ol:
        for (; c < 16; ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        if (n.flags = u, (n.flags & 255) !== il) {
          e.msg = "unknown compression method", n.mode = _e;
          break;
        }
        if (n.flags & 57344) {
          e.msg = "unknown header flags set", n.mode = _e;
          break;
        }
        n.head && (n.head.text = u >> 8 & 1), n.flags & 512 && n.wrap & 4 && (v[0] = u & 255, v[1] = u >>> 8 & 255, n.check = Ne(n.check, v, 2, 0)), u = 0, c = 0, n.mode = sl;
      case sl:
        for (; c < 32; ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        n.head && (n.head.time = u), n.flags & 512 && n.wrap & 4 && (v[0] = u & 255, v[1] = u >>> 8 & 255, v[2] = u >>> 16 & 255, v[3] = u >>> 24 & 255, n.check = Ne(n.check, v, 4, 0)), u = 0, c = 0, n.mode = al;
      case al:
        for (; c < 16; ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        n.head && (n.head.xflags = u & 255, n.head.os = u >> 8), n.flags & 512 && n.wrap & 4 && (v[0] = u & 255, v[1] = u >>> 8 & 255, n.check = Ne(n.check, v, 2, 0)), u = 0, c = 0, n.mode = cl;
      case cl:
        if (n.flags & 1024) {
          for (; c < 16; ) {
            if (a === 0) break e;
            a--, u += r[o++] << c, c += 8;
          }
          n.length = u, n.head && (n.head.extra_len = u), n.flags & 512 && n.wrap & 4 && (v[0] = u & 255, v[1] = u >>> 8 & 255, n.check = Ne(n.check, v, 2, 0)), u = 0, c = 0;
        } else n.head && (n.head.extra = null);
        n.mode = fl;
      case fl:
        if (n.flags & 1024 && (d = n.length, d > a && (d = a), d && (n.head && (R = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new Uint8Array(n.head.extra_len)), n.head.extra.set(r.subarray(o, o + d), R)), n.flags & 512 && n.wrap & 4 && (n.check = Ne(n.check, r, d, o)), a -= d, o += d, n.length -= d), n.length)) break e;
        n.length = 0, n.mode = ul;
      case ul:
        if (n.flags & 2048) {
          if (a === 0) break e;
          d = 0;
          do
            R = r[o + d++], n.head && R && n.length < 65536 && (n.head.name += String.fromCharCode(R));
          while (R && d < a);
          if (n.flags & 512 && n.wrap & 4 && (n.check = Ne(n.check, r, d, o)), a -= d, o += d, R) break e;
        } else n.head && (n.head.name = null);
        n.length = 0, n.mode = ll;
      case ll:
        if (n.flags & 4096) {
          if (a === 0) break e;
          d = 0;
          do
            R = r[o + d++], n.head && R && n.length < 65536 && (n.head.comment += String.fromCharCode(R));
          while (R && d < a);
          if (n.flags & 512 && n.wrap & 4 && (n.check = Ne(n.check, r, d, o)), a -= d, o += d, R) break e;
        } else n.head && (n.head.comment = null);
        n.mode = hl;
      case hl:
        if (n.flags & 512) {
          for (; c < 16; ) {
            if (a === 0) break e;
            a--, u += r[o++] << c, c += 8;
          }
          if (n.wrap & 4 && u !== (n.check & 65535)) {
            e.msg = "header crc mismatch", n.mode = _e;
            break;
          }
          u = 0, c = 0;
        }
        n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = true), e.adler = n.check = 0, n.mode = rn;
        break;
      case dl:
        for (; c < 32; ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        e.adler = n.check = Tl(u), u = 0, c = 0, n.mode = Ss;
      case Ss:
        if (n.havedict === 0) return e.next_out = s, e.avail_out = f, e.next_in = o, e.avail_in = a, n.hold = u, n.bits = c, nS;
        e.adler = n.check = 1, n.mode = rn;
      case rn:
        if (t === eS || t === qo) break e;
      case Ma:
        if (n.last) {
          u >>>= c & 7, c -= c & 7, n.mode = Ka;
          break;
        }
        for (; c < 3; ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        switch (n.last = u & 1, u >>>= 1, c -= 1, u & 3) {
          case 0:
            n.mode = pl;
            break;
          case 1:
            if (uS(n), n.mode = Zo, t === qo) {
              u >>>= 2, c -= 2;
              break e;
            }
            break;
          case 2:
            n.mode = gl;
            break;
          case 3:
            e.msg = "invalid block type", n.mode = _e;
        }
        u >>>= 2, c -= 2;
        break;
      case pl:
        for (u >>>= c & 7, c -= c & 7; c < 32; ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        if ((u & 65535) !== (u >>> 16 ^ 65535)) {
          e.msg = "invalid stored block lengths", n.mode = _e;
          break;
        }
        if (n.length = u & 65535, u = 0, c = 0, n.mode = Da, t === qo) break e;
      case Da:
        n.mode = yl;
      case yl:
        if (d = n.length, d) {
          if (d > a && (d = a), d > f && (d = f), d === 0) break e;
          i.set(r.subarray(o, o + d), s), a -= d, o += d, f -= d, s += d, n.length -= d;
          break;
        }
        n.mode = rn;
        break;
      case gl:
        for (; c < 14; ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        if (n.nlen = (u & 31) + 257, u >>>= 5, c -= 5, n.ndist = (u & 31) + 1, u >>>= 5, c -= 5, n.ncode = (u & 15) + 4, u >>>= 4, c -= 4, n.nlen > 286 || n.ndist > 30) {
          e.msg = "too many length or distance symbols", n.mode = _e;
          break;
        }
        n.have = 0, n.mode = wl;
      case wl:
        for (; n.have < n.ncode; ) {
          for (; c < 3; ) {
            if (a === 0) break e;
            a--, u += r[o++] << c, c += 8;
          }
          n.lens[$[n.have++]] = u & 7, u >>>= 3, c -= 3;
        }
        for (; n.have < 19; ) n.lens[$[n.have++]] = 0;
        if (n.lencode = n.lendyn, n.lenbits = 7, H = {
          bits: n.lenbits
        }, M = Gi(QE, n.lens, 0, 19, n.lencode, 0, n.work, H), n.lenbits = H.bits, M) {
          e.msg = "invalid code lengths set", n.mode = _e;
          break;
        }
        n.have = 0, n.mode = bl;
      case bl:
        for (; n.have < n.nlen + n.ndist; ) {
          for (; S = n.lencode[u & (1 << n.lenbits) - 1], A = S >>> 24, O = S >>> 16 & 255, E = S & 65535, !(A <= c); ) {
            if (a === 0) break e;
            a--, u += r[o++] << c, c += 8;
          }
          if (E < 16) u >>>= A, c -= A, n.lens[n.have++] = E;
          else {
            if (E === 16) {
              for (D = A + 2; c < D; ) {
                if (a === 0) break e;
                a--, u += r[o++] << c, c += 8;
              }
              if (u >>>= A, c -= A, n.have === 0) {
                e.msg = "invalid bit length repeat", n.mode = _e;
                break;
              }
              R = n.lens[n.have - 1], d = 3 + (u & 3), u >>>= 2, c -= 2;
            } else if (E === 17) {
              for (D = A + 3; c < D; ) {
                if (a === 0) break e;
                a--, u += r[o++] << c, c += 8;
              }
              u >>>= A, c -= A, R = 0, d = 3 + (u & 7), u >>>= 3, c -= 3;
            } else {
              for (D = A + 7; c < D; ) {
                if (a === 0) break e;
                a--, u += r[o++] << c, c += 8;
              }
              u >>>= A, c -= A, R = 0, d = 11 + (u & 127), u >>>= 7, c -= 7;
            }
            if (n.have + d > n.nlen + n.ndist) {
              e.msg = "invalid bit length repeat", n.mode = _e;
              break;
            }
            for (; d--; ) n.lens[n.have++] = R;
          }
        }
        if (n.mode === _e) break;
        if (n.lens[256] === 0) {
          e.msg = "invalid code -- missing end-of-block", n.mode = _e;
          break;
        }
        if (n.lenbits = 9, H = {
          bits: n.lenbits
        }, M = Gi(Y0, n.lens, 0, n.nlen, n.lencode, 0, n.work, H), n.lenbits = H.bits, M) {
          e.msg = "invalid literal/lengths set", n.mode = _e;
          break;
        }
        if (n.distbits = 6, n.distcode = n.distdyn, H = {
          bits: n.distbits
        }, M = Gi(J0, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, H), n.distbits = H.bits, M) {
          e.msg = "invalid distances set", n.mode = _e;
          break;
        }
        if (n.mode = Zo, t === qo) break e;
      case Zo:
        n.mode = Yo;
      case Yo:
        if (a >= 6 && f >= 258) {
          e.next_out = s, e.avail_out = f, e.next_in = o, e.avail_in = a, n.hold = u, n.bits = c, GE(e, y), s = e.next_out, i = e.output, f = e.avail_out, o = e.next_in, r = e.input, a = e.avail_in, u = n.hold, c = n.bits, n.mode === rn && (n.back = -1);
          break;
        }
        for (n.back = 0; S = n.lencode[u & (1 << n.lenbits) - 1], A = S >>> 24, O = S >>> 16 & 255, E = S & 65535, !(A <= c); ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        if (O && !(O & 240)) {
          for (m = A, k = O, T = E; S = n.lencode[T + ((u & (1 << m + k) - 1) >> m)], A = S >>> 24, O = S >>> 16 & 255, E = S & 65535, !(m + A <= c); ) {
            if (a === 0) break e;
            a--, u += r[o++] << c, c += 8;
          }
          u >>>= m, c -= m, n.back += m;
        }
        if (u >>>= A, c -= A, n.back += A, n.length = E, O === 0) {
          n.mode = xl;
          break;
        }
        if (O & 32) {
          n.back = -1, n.mode = rn;
          break;
        }
        if (O & 64) {
          e.msg = "invalid literal/length code", n.mode = _e;
          break;
        }
        n.extra = O & 15, n.mode = ml;
      case ml:
        if (n.extra) {
          for (D = n.extra; c < D; ) {
            if (a === 0) break e;
            a--, u += r[o++] << c, c += 8;
          }
          n.length += u & (1 << n.extra) - 1, u >>>= n.extra, c -= n.extra, n.back += n.extra;
        }
        n.was = n.length, n.mode = _l;
      case _l:
        for (; S = n.distcode[u & (1 << n.distbits) - 1], A = S >>> 24, O = S >>> 16 & 255, E = S & 65535, !(A <= c); ) {
          if (a === 0) break e;
          a--, u += r[o++] << c, c += 8;
        }
        if (!(O & 240)) {
          for (m = A, k = O, T = E; S = n.distcode[T + ((u & (1 << m + k) - 1) >> m)], A = S >>> 24, O = S >>> 16 & 255, E = S & 65535, !(m + A <= c); ) {
            if (a === 0) break e;
            a--, u += r[o++] << c, c += 8;
          }
          u >>>= m, c -= m, n.back += m;
        }
        if (u >>>= A, c -= A, n.back += A, O & 64) {
          e.msg = "invalid distance code", n.mode = _e;
          break;
        }
        n.offset = E, n.extra = O & 15, n.mode = El;
      case El:
        if (n.extra) {
          for (D = n.extra; c < D; ) {
            if (a === 0) break e;
            a--, u += r[o++] << c, c += 8;
          }
          n.offset += u & (1 << n.extra) - 1, u >>>= n.extra, c -= n.extra, n.back += n.extra;
        }
        if (n.offset > n.dmax) {
          e.msg = "invalid distance too far back", n.mode = _e;
          break;
        }
        n.mode = Sl;
      case Sl:
        if (f === 0) break e;
        if (d = y - f, n.offset > d) {
          if (d = n.offset - d, d > n.whave && n.sane) {
            e.msg = "invalid distance too far back", n.mode = _e;
            break;
          }
          d > n.wnext ? (d -= n.wnext, w = n.wsize - d) : w = n.wnext - d, d > n.length && (d = n.length), b = n.window;
        } else b = i, w = s - n.offset, d = n.length;
        d > f && (d = f), f -= d, n.length -= d;
        do
          i[s++] = b[w++];
        while (--d);
        n.length === 0 && (n.mode = Yo);
        break;
      case xl:
        if (f === 0) break e;
        i[s++] = n.length, f--, n.mode = Yo;
        break;
      case Ka:
        if (n.wrap) {
          for (; c < 32; ) {
            if (a === 0) break e;
            a--, u |= r[o++] << c, c += 8;
          }
          if (y -= f, e.total_out += y, n.total += y, n.wrap & 4 && y && (e.adler = n.check = n.flags ? Ne(n.check, i, y, s - y) : io(n.check, i, y, s - y)), y = f, n.wrap & 4 && (n.flags ? u : Tl(u)) !== n.check) {
            e.msg = "incorrect data check", n.mode = _e;
            break;
          }
          u = 0, c = 0;
        }
        n.mode = vl;
      case vl:
        if (n.wrap && n.flags) {
          for (; c < 32; ) {
            if (a === 0) break e;
            a--, u += r[o++] << c, c += 8;
          }
          if (n.wrap & 4 && u !== (n.total & 4294967295)) {
            e.msg = "incorrect length check", n.mode = _e;
            break;
          }
          u = 0, c = 0;
        }
        n.mode = Il;
      case Il:
        M = tS;
        break e;
      case _e:
        M = Q0;
        break e;
      case tp:
        return ep;
      case np:
      default:
        return At;
    }
    return e.next_out = s, e.avail_out = f, e.next_in = o, e.avail_in = a, n.hold = u, n.bits = c, (n.wsize || y !== e.avail_out && n.mode < _e && (n.mode < Ka || t !== rl)) && ap(e, e.output, e.next_out, y - e.avail_out), p -= e.avail_in, y -= e.avail_out, e.total_in += p, e.total_out += y, n.total += y, n.wrap & 4 && y && (e.adler = n.check = n.flags ? Ne(n.check, i, y, e.next_out - y) : io(n.check, i, y, e.next_out - y)), e.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === rn ? 128 : 0) + (n.mode === Zo || n.mode === Da ? 256 : 0), (p === 0 && y === 0 || t === rl) && M === xr && (M = rS), M;
  }, hS = (e) => {
    if ($r(e)) return At;
    let t = e.state;
    return t.window && (t.window = null), e.state = null, xr;
  }, dS = (e, t) => {
    if ($r(e)) return At;
    const n = e.state;
    return n.wrap & 2 ? (n.head = t, t.done = false, xr) : At;
  }, pS = (e, t) => {
    const n = t.length;
    let r, i, o;
    return $r(e) || (r = e.state, r.wrap !== 0 && r.mode !== Ss) ? At : r.mode === Ss && (i = 1, i = io(i, t, n, 0), i !== r.check) ? Q0 : (o = ap(e, t, n, n), o ? (r.mode = tp, ep) : (r.havedict = 1, xr));
  };
  var yS = ip, gS = op, wS = rp, bS = fS, mS = sp, _S = lS, ES = hS, SS = dS, xS = pS, vS = "pako inflate (from Nodeca project)", un = {
    inflateReset: yS,
    inflateReset2: gS,
    inflateResetKeep: wS,
    inflateInit: bS,
    inflateInit2: mS,
    inflate: _S,
    inflateEnd: ES,
    inflateGetHeader: SS,
    inflateSetDictionary: xS,
    inflateInfo: vS
  };
  function IS() {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
  }
  var TS = IS;
  const cp = Object.prototype.toString, { Z_NO_FLUSH: AS, Z_FINISH: kS, Z_OK: ao, Z_STREAM_END: za, Z_NEED_DICT: ja, Z_STREAM_ERROR: BS, Z_DATA_ERROR: kl, Z_MEM_ERROR: PS } = _o;
  function xo(e) {
    this.options = Ys.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ""
    }, e || {});
    const t = this.options;
    t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, t.windowBits === 0 && (t.windowBits = -15)), t.windowBits >= 0 && t.windowBits < 16 && !(e && e.windowBits) && (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && (t.windowBits & 15 || (t.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new q0(), this.strm.avail_out = 0;
    let n = un.inflateInit2(this.strm, t.windowBits);
    if (n !== ao) throw new Error(Er[n]);
    if (this.header = new TS(), un.inflateGetHeader(this.strm, this.header), t.dictionary && (typeof t.dictionary == "string" ? t.dictionary = so.string2buf(t.dictionary) : cp.call(t.dictionary) === "[object ArrayBuffer]" && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (n = un.inflateSetDictionary(this.strm, t.dictionary), n !== ao))) throw new Error(Er[n]);
  }
  xo.prototype.push = function(e, t) {
    const n = this.strm, r = this.options.chunkSize, i = this.options.dictionary;
    let o, s, a;
    if (this.ended) return false;
    for (t === ~~t ? s = t : s = t === true ? kS : AS, cp.call(e) === "[object ArrayBuffer]" ? n.input = new Uint8Array(e) : n.input = e, n.next_in = 0, n.avail_in = n.input.length; ; ) {
      for (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), o = un.inflate(n, s), o === ja && i && (o = un.inflateSetDictionary(n, i), o === ao ? o = un.inflate(n, s) : o === kl && (o = ja)); n.avail_in > 0 && o === za && n.state.wrap > 0 && e[n.next_in] !== 0; ) un.inflateReset(n), o = un.inflate(n, s);
      switch (o) {
        case BS:
        case kl:
        case ja:
        case PS:
          return this.onEnd(o), this.ended = true, false;
      }
      if (a = n.avail_out, n.next_out && (n.avail_out === 0 || o === za)) if (this.options.to === "string") {
        let f = so.utf8border(n.output, n.next_out), u = n.next_out - f, c = so.buf2string(n.output, f);
        n.next_out = u, n.avail_out = r - u, u && n.output.set(n.output.subarray(f, f + u), 0), this.onData(c);
      } else this.onData(n.output.length === n.next_out ? n.output : n.output.subarray(0, n.next_out));
      if (!(o === ao && a === 0)) {
        if (o === za) return o = un.inflateEnd(this.strm), this.onEnd(o), this.ended = true, true;
        if (n.avail_in === 0) break;
      }
    }
    return true;
  };
  xo.prototype.onData = function(e) {
    this.chunks.push(e);
  };
  xo.prototype.onEnd = function(e) {
    e === ao && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Ys.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
  };
  function bf(e, t) {
    const n = new xo(t);
    if (n.push(e), n.err) throw n.msg || Er[n.err];
    return n.result;
  }
  function OS(e, t) {
    return t = t || {}, t.raw = true, bf(e, t);
  }
  var HS = xo, US = bf, RS = OS, NS = bf, CS = {
    Inflate: HS,
    inflate: US,
    inflateRaw: RS,
    ungzip: NS
  };
  const { Deflate: LS, deflate: FS, deflateRaw: MS, gzip: DS } = jE, { Inflate: KS, inflate: $S, inflateRaw: VS, ungzip: zS } = CS;
  var jS = LS, WS = FS, GS = MS, XS = DS, qS = KS, ZS = $S, YS = VS, JS = zS, QS = _o, fp = {
    Deflate: jS,
    deflate: WS,
    deflateRaw: GS,
    gzip: XS,
    Inflate: qS,
    inflate: ZS,
    inflateRaw: YS,
    ungzip: JS,
    constants: QS
  };
  window.Buffer = z;
  at.initEccLib(km);
  const ex = {
    testnet4: {
      label: "Testnet4",
      bitcoin: {
        messagePrefix: `Bitcoin Signed Message:
`,
        bech32: "tb",
        bip32: {
          public: 70617039,
          private: 70615956
        },
        pubKeyHash: 111,
        scriptHash: 196,
        wif: 239
      },
      canonicalDeposit: "tb1pn2zjxaax22ex4akv5v9j0rw22hyr4td3550jr4gf5ttf6zdsp5xsjd7fwd",
      mempoolApi: "https://mempool.space/testnet4/api",
      mempoolTx: "https://mempool.space/testnet4/tx",
      dbName: "bip47db_testnet4"
    },
    mainnet: {
      label: "Mainnet",
      bitcoin: {
        messagePrefix: `Bitcoin Signed Message:
`,
        bech32: "bc",
        bip32: {
          public: 76067358,
          private: 76066276
        },
        pubKeyHash: 0,
        scriptHash: 5,
        wif: 128
      },
      canonicalDeposit: "bc1pn2zjxaax22ex4akv5v9j0rw22hyr4td3550jr4gf5ttf6zdsp5xs99gx5z",
      mempoolApi: "https://mempool.space/api",
      mempoolTx: "https://mempool.space/tx",
      dbName: "bip47db_mainnet"
    }
  };
  let gn = "mainnet";
  function ae() {
    return ex[gn];
  }
  const Bl = 192, up = 2 * 1024 * 1024, lp = 50, tx = 1, sr = 5e3, oi = 8, Wa = 40, Pl = 69;
  let fe = {};
  window.addEventListener("beforeunload", (e) => {
    if (fe.ephPriv) return e.preventDefault(), e.returnValue = "You have an active inscription with an in-memory signing key. Refreshing or closing this tab will destroy the key, and if a commit transaction has already been broadcast, its output will be stranded.", e.returnValue;
  });
  let vo = false;
  function Qs() {
    return new Promise((e, t) => {
      const n = indexedDB.open(ae().dbName, tx);
      n.onupgradeneeded = (r) => {
        const i = r.target.result;
        if (!i.objectStoreNames.contains("batches")) {
          const o = i.createObjectStore("batches", {
            keyPath: "txid"
          });
          o.createIndex("blockHeight", "blockHeight"), o.createIndex("publisherKey", "publisherKey");
        }
        if (!i.objectStoreNames.contains("codes")) {
          const o = i.createObjectStore("codes", {
            keyPath: [
              "batchTxid",
              "paymentCode"
            ]
          });
          o.createIndex("paymentCode", "paymentCode"), o.createIndex("notificationAddress", "notificationAddress"), o.createIndex("publisherKey", "publisherKey");
        }
      }, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error);
    });
  }
  async function an(e, t) {
    const n = await Qs();
    return new Promise((r, i) => {
      const o = n.transaction(e, "readwrite");
      o.objectStore(e).put(t), o.oncomplete = r, o.onerror = () => i(o.error);
    });
  }
  async function Wt(e) {
    const t = await Qs();
    return new Promise((n, r) => {
      const o = t.transaction(e, "readonly").objectStore(e).getAll();
      o.onsuccess = () => n(o.result), o.onerror = () => r(o.error);
    });
  }
  async function rs(e, t, n) {
    const r = await Qs();
    return new Promise((i, o) => {
      const a = r.transaction(e, "readonly").objectStore(e).index(t).getAll(n);
      a.onsuccess = () => i(a.result), a.onerror = () => o(a.error);
    });
  }
  async function nx() {
    const e = await Qs();
    return new Promise((t, n) => {
      const r = e.transaction([
        "batches",
        "codes"
      ], "readwrite");
      r.objectStore("batches").clear(), r.objectStore("codes").clear(), r.oncomplete = t, r.onerror = () => n(r.error);
    });
  }
  function Ni(e) {
    if (e.length < 76) return z.concat([
      z.from([
        e.length
      ]),
      e
    ]);
    if (e.length <= 255) return z.concat([
      z.from([
        76,
        e.length
      ]),
      e
    ]);
    const t = z.alloc(3);
    return t[0] = 77, t.writeUInt16LE(e.length, 1), z.concat([
      t,
      e
    ]);
  }
  function co(e) {
    return Bc.encode(z.concat([
      z.from([
        71
      ]),
      e
    ]));
  }
  function vr(e) {
    const t = e.trim();
    return /^[0-9a-fA-F]{160}$/.test(t) ? z.from(t, "hex") : z.from(Bc.decode(t).subarray(1, 81));
  }
  function mf(e) {
    return z.from(e.subarray(2, 35));
  }
  function rx(e) {
    return z.from(e.subarray(35, 67));
  }
  function xs(e, t) {
    const n = mf(e), r = rx(e), i = z.alloc(4);
    i.writeUInt32BE(t.bip32.public, 0);
    const o = Bc.encode(z.concat([
      i,
      z.from([
        3
      ]),
      z.alloc(4),
      z.alloc(4),
      r,
      n
    ])), s = Qn.fromExtendedKey(o, {
      private: t.bip32.private,
      public: t.bip32.public
    });
    return z.from(s.deriveChild(0).publicKey);
  }
  function Io(e, t) {
    const n = xs(e, t);
    return at.address.toBase58Check(at.crypto.ripemd160(at.crypto.sha256(n)), t.pubKeyHash);
  }
  function hp(e) {
    const t = z.from(`Bitcoin Signed Message:
`, "utf8"), n = z.from(e, "utf8"), r = n.length < 253 ? z.from([
      n.length
    ]) : (() => {
      const i = z.alloc(3);
      return i[0] = 253, i.writeUInt16LE(n.length, 1), i;
    })();
    return at.crypto.hash256(z.concat([
      t,
      r,
      n
    ]));
  }
  function ix(e) {
    const t = e.trim().replace(/\s+/g, "");
    if (!/^[A-Za-z0-9+/]+=*$/.test(t)) throw new Error("Invalid base64 encoding. Check for typos or extra characters.");
    let n;
    try {
      n = z.from(t, "base64");
    } catch (i) {
      throw new Error("Base64 decode failed: " + i.message);
    }
    if (n.length !== 65) throw new Error(`Signature must be exactly 65 bytes (got ${n.length}).`);
    const r = n[0];
    if (r < 27 || r > 34) throw new Error(`Invalid signature header byte: ${r}. Expected 27\u201334.`);
    return {
      recoveryId: r - 27 & 3,
      signature: z.from(n.subarray(1, 65))
    };
  }
  function ox() {
    let e;
    do
      e = z.from(crypto.getRandomValues(new Uint8Array(32)));
    while (!Hd(e));
    const t = z.from(Ud(e, true));
    return {
      priv: e,
      xonly: z.from(t.subarray(1, 33))
    };
  }
  async function dp(e) {
    return z.from(await crypto.subtle.digest("SHA-256", e));
  }
  function _f() {
    const e = document.createElement("div");
    e.className = "copy-toast", e.textContent = "Copied!", document.body.appendChild(e), setTimeout(() => e.remove(), 1600);
  }
  window.showCopied = _f;
  function pp(e) {
    gn = e, fe = {}, document.getElementById("netMainnet").className = e === "mainnet" ? "net-active-mainnet" : "", document.getElementById("netTestnet").className = e === "testnet4" ? "net-active-testnet" : "";
    const t = document.getElementById("netBanner");
    e === "mainnet" ? t.style.display = "none" : (t.style.display = "", t.className = "net-banner net-" + e, t.textContent = ae().label), mp(), document.getElementById("batchList").innerHTML = '<div class="empty">Switched to ' + ae().label + ". Click Sync to load batches.</div>", document.getElementById("stats").style.display = "none", document.getElementById("searchResult").innerHTML = "";
  }
  document.getElementById("netMainnet").addEventListener("click", () => {
    gn !== "mainnet" && pp("mainnet");
  });
  document.getElementById("netTestnet").addEventListener("click", () => {
    gn !== "testnet4" && pp("testnet4");
  });
  document.querySelectorAll(".tab").forEach((e) => e.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active")), document.querySelectorAll(".tab-panel").forEach((t) => t.classList.remove("active")), e.classList.add("active"), document.getElementById("tab-" + e.dataset.tab).classList.add("active"), e.dataset.tab === "browse" && vs();
  }));
  const sx = "https://corsproxy.io/?";
  function yp() {
    const e = parseInt(document.getElementById("nymStart").value) || 1, t = parseInt(document.getElementById("nymLimit").value) || 200;
    return `https://paynym.rs/api/v1/nyms?page=${Math.max(1, Math.ceil(e / 200))}&limit=${t}`;
  }
  function ea() {
    const e = document.getElementById("paynymApiLink");
    e && (e.href = yp());
  }
  function Ef(e) {
    const t = [], n = /* @__PURE__ */ new Set();
    function r(o) {
      o && typeof o == "string" && o.startsWith("PM") && !n.has(o) && (n.add(o), t.push(o));
    }
    function i(o) {
      if (typeof o == "string") {
        r(o);
        return;
      }
      if (!(!o || typeof o != "object")) {
        if (Array.isArray(o.codes)) {
          if (o.codes.some((a) => typeof a == "object" && "segwit" in a)) {
            const a = [], f = [];
            for (const c of o.codes) if (c && typeof c == "object") {
              const p = c.code || c.payment_code || null;
              p && (c.segwit ? a : f).push(p);
            }
            const u = a.length > 0 ? a : f;
            for (const c of u) r(c);
          } else for (const a of o.codes) typeof a == "string" ? r(a) : a && typeof a == "object" && r(a.code || a.payment_code || null);
          return;
        }
        r(o.code || o.payment_code || o.paymentCode || o.pcode || null);
      }
    }
    if (Array.isArray(e)) for (const o of e) i(o);
    else if (e && typeof e == "object") {
      const o = e.codes || e.nyms || e.data || e.results;
      if (Array.isArray(o)) for (const s of o) i(s);
      else i(e);
    }
    return t;
  }
  function gp(e) {
    const t = document.getElementById("inputCodes").value.trim(), n = new Set(t ? t.split(`
`).map((i) => i.trim()).filter((i) => i) : []), r = e.filter((i) => !n.has(i));
    return r.length && (document.getElementById("inputCodes").value = t ? t + `
` + r.join(`
`) : r.join(`
`), _i()), {
      added: r.length,
      dupes: e.length - r.length
    };
  }
  function _i() {
    const e = document.getElementById("inputCodes"), t = document.getElementById("lineNumbers"), n = Math.max(e.value.split(`
`).length, 1);
    let r = "";
    for (let i = 1; i <= n; i++) r += i + `
`;
    t.textContent = r, t.scrollTop = e.scrollTop;
  }
  document.getElementById("inputCodes").addEventListener("input", () => {
    vo = false, _i();
  });
  document.getElementById("inputCodes").addEventListener("scroll", () => {
    document.getElementById("lineNumbers").scrollTop = document.getElementById("inputCodes").scrollTop;
  });
  _i();
  document.getElementById("nymStart").addEventListener("input", ea);
  document.getElementById("nymLimit").addEventListener("input", ea);
  ea();
  document.getElementById("inputCodes").addEventListener("paste", (e) => {
    setTimeout(() => {
      const t = document.getElementById("inputCodes").value.trim();
      if (t.startsWith("{") || t.startsWith("[")) try {
        const n = Ef(JSON.parse(t));
        n.length && (document.getElementById("inputCodes").value = n.join(`
`), _i(), document.getElementById("dedupResult").innerHTML = `<span class="kept">\u2713 Detected JSON \u2014 extracted ${n.length} payment codes.</span>`);
      } catch {
      }
      _i();
    }, 0);
  });
  document.getElementById("btnFetchNyms").addEventListener("click", async () => {
    const e = document.getElementById("dedupResult"), t = parseInt(document.getElementById("nymLimit").value) || 200, n = parseInt(document.getElementById("nymStart").value) || 1, r = document.getElementById("btnFetchNyms");
    r.disabled = true, r.textContent = "Fetching...", e.innerHTML = '<span style="color:var(--accent)">Fetching from record ' + n + "...</span>";
    try {
      const i = [];
      let s = Math.ceil(n / 200);
      const a = (n - 1) % 200;
      let f = true, u = 0, c = false;
      for (; i.length < t; ) {
        const b = `https://paynym.rs/api/v1/nyms?page=${s}&limit=200`, S = await fetch(sx + encodeURIComponent(b));
        if (!S.ok) throw new Error(`Request failed (${S.status})`);
        const A = await S.json(), O = Array.isArray(A) ? A.length : 0;
        if (O === 0) {
          c = true;
          break;
        }
        let E = A;
        f && a > 0 && (E = A.slice(a), f = false), u += E.length;
        const m = Ef(E);
        for (const k of m) if (i.push(k), i.length >= t) break;
        if (O < 200) {
          c = true;
          break;
        }
        s++;
      }
      if (vo = c, !i.length) {
        e.innerHTML = '<span class="removed">No codes returned. API format may have changed.</span>';
        return;
      }
      const p = n + u - 1, { added: y, dupes: d } = gp(i);
      let w = `<span class="kept">\u2713 Fetched ${i.length} codes from ${u} nyms (records ${n}\u2013${p}), added ${y} new.</span>`;
      d && (w += ` <span class="removed">${d} already in field.</span>`), w += ' <span style="color:var(--text-muted)">Click "Prepare batch" to dedupe and trim to batch size.</span>', e.innerHTML = w;
    } catch (i) {
      console.error(i), e.innerHTML = `<span class="removed">Fetch failed: ${i.message}.</span> <span style="color:var(--text-muted)">Try "Paste JSON manually" \u2014 open <a href="${yp()}" target="_blank" style="color:var(--link)">the API</a> in a new tab, copy the response, and paste it.</span>`;
    } finally {
      r.disabled = false, r.textContent = "Fetch from PayNym.rs";
    }
  });
  document.getElementById("btnPasteJson").addEventListener("click", () => {
    const e = document.getElementById("jsonPasteArea");
    e.style.display = e.style.display === "none" ? "block" : "none";
  });
  document.getElementById("btnParseJson").addEventListener("click", () => {
    const e = document.getElementById("dedupResult"), t = document.getElementById("jsonInput").value.trim();
    if (!t) {
      e.innerHTML = '<span class="removed">Paste the JSON response first.</span>';
      return;
    }
    try {
      const n = Ef(JSON.parse(t));
      if (!n.length) {
        e.innerHTML = '<span class="removed">No PM8T codes found in JSON.</span>';
        return;
      }
      vo = false;
      const { added: r, dupes: i } = gp(n);
      let o = `<span class="kept">\u2713 Parsed ${n.length} codes, added ${r} new.</span>`;
      i && (o += ` <span class="removed">${i} already in field.</span>`), e.innerHTML = o, document.getElementById("jsonInput").value = "", document.getElementById("jsonPasteArea").style.display = "none";
    } catch (n) {
      e.innerHTML = `<span class="removed">JSON parse error: ${n.message}</span>`;
    }
  });
  document.getElementById("btnDedup").addEventListener("click", async () => {
    const e = document.getElementById("dedupResult"), t = document.getElementById("btnDedup"), n = document.getElementById("inputCodes").value.split(`
`).map((b) => b.trim()).filter((b) => b);
    if (!n.length) {
      e.innerHTML = '<span class="removed">No codes.</span>';
      return;
    }
    [
      "hashSection",
      "sigCard",
      "commitPsbtCard",
      "revealSection"
    ].some((b) => document.getElementById(b).style.display !== "none") && ([
      "utxoRef",
      "utxoValue",
      "utxoHex",
      "changeAddress",
      "msgToSign",
      "sparrowSig",
      "psbtOutput",
      "commitTxid",
      "savedRevealHex",
      "savedRevealInput"
    ].forEach((b) => {
      document.getElementById(b).value = "";
    }), document.getElementById("savedRevealResult").innerHTML = "", [
      "hashSection",
      "sigCard",
      "commitPsbtCard",
      "revealSection",
      "savedRevealSection"
    ].forEach((b) => {
      document.getElementById(b).style.display = "none";
    }), [
      "btnBroadcastReveal",
      "btnSaveReveal"
    ].forEach((b) => {
      document.getElementById(b).disabled = false;
    }), fe = {}), t.disabled = true, t.textContent = "Preparing...", e.innerHTML = '<span style="color:var(--accent)">Syncing from chain...</span>';
    try {
      await _p();
    } catch (b) {
      console.warn("Sync failed, using local DB:", b.message);
    }
    const i = [], o = [];
    for (let b = 0; b < n.length; b++) try {
      i.push({
        pm: co(vr(n[b])),
        lineIdx: b
      });
    } catch {
      o.push(n[b]);
    }
    const s = /* @__PURE__ */ new Set(), a = [];
    for (const b of i) s.has(b.pm) || (s.add(b.pm), a.push(b));
    const f = i.length - a.length, u = /* @__PURE__ */ new Set();
    for (const b of a) (await rs("codes", "paymentCode", b.pm)).length > 0 && u.add(b.pm);
    const c = a.filter((b) => !u.has(b.pm)), p = c.length > sr ? c.length - sr : 0, y = c.slice(0, sr);
    document.getElementById("inputCodes").value = y.map((b) => b.pm).join(`
`), _i();
    const d = i.length + o.length;
    let w = `<span class="kept">\u2713 ${y.length} ready to inscribe.</span>`;
    if (d !== y.length) {
      const b = [];
      f && b.push(`${f} duplicates`), u.size && b.push(`${u.size} already inscribed`), p && b.push(`${p} trimmed to batch limit of ${sr}`), o.length && b.push(`${o.length} unparseable`), w += ` <span class="removed">${d} found. ${b.join(". ")}.</span>`;
    }
    if (p && y.length > 0) {
      const b = parseInt(document.getElementById("nymStart").value) || 1, S = y[y.length - 1].lineIdx, A = b + S;
      w += ` <span style="color:var(--text-muted)">Last record in batch: ${A}. Set "Start from" to ${A + 1} for the next batch.</span>`;
    }
    vo && (p ? w += ` <span class="kept">End of PayNym.rs reached \u2014 ${p} record${p === 1 ? "" : "s"} remain for subsequent batches.</span>` : w += ' <span class="kept">End of PayNym.rs reached \u2014 no more records to inscribe after this batch.</span>'), e.innerHTML = w, t.disabled = false, t.textContent = "Prepare batch";
  });
  document.getElementById("publisherPM").addEventListener("input", (e) => {
    const t = document.getElementById("pubInfo"), n = e.target.value.trim();
    if (!n) {
      t.style.display = "none";
      return;
    }
    try {
      const r = vr(n), i = mf(r), o = Io(r, ae().bitcoin);
      t.innerHTML = `<strong>Pubkey:</strong> <code>${i.toString("hex")}</code><br><strong>Notification address:</strong> <code>${o}</code><br><span style="color:var(--yellow)">Sign the payload hash with this address.</span>`, t.style.display = "block";
    } catch (r) {
      t.innerHTML = `<span style="color:var(--red)">${r.message}</span>`, t.style.display = "block";
    }
  });
  document.getElementById("btnFetch").addEventListener("click", async () => {
    const e = document.getElementById("utxoRef").value.trim();
    if (!e.includes(":")) return alert("Format: TXID:VOUT");
    const [t, n] = e.split(":");
    try {
      const r = await (await fetch(`${ae().mempoolApi}/tx/${t}/hex`)).text(), i = await (await fetch(`${ae().mempoolApi}/tx/${t}`)).json();
      document.getElementById("utxoHex").value = r, document.getElementById("utxoValue").value = i.vout[parseInt(n)].value, alert("Fetched!");
    } catch {
      alert("Fetch failed.");
    }
  });
  document.getElementById("btnFetchFee").addEventListener("click", async () => {
    try {
      const t = await (await fetch(`${ae().mempoolApi}/v1/fees/recommended`)).json(), n = t.fastestFee || t.halfHourFee || 1;
      document.getElementById("feeRate").value = Math.min(n, 1e3);
    } catch {
      alert("Failed to fetch fee rate.");
    }
  });
  document.getElementById("btnGenerateHash").addEventListener("click", async () => {
    try {
      const e = document.getElementById("inputCodes").value.split(`
`).map((S) => S.trim()).filter((S) => S);
      if (!e.length) throw new Error("No codes");
      if (e.length > sr) throw new Error(`Too many codes: ${e.length}. Maximum ${sr} per batch due to Bitcoin transaction size limits. Split into ${Math.ceil(e.length / sr)} batches.`);
      const t = document.getElementById("publisherPM").value.trim();
      if (!t) throw new Error("Publisher code required");
      if (!document.getElementById("utxoRef").value.trim()) throw new Error("UTXO reference required (txid:vout)");
      if (!document.getElementById("utxoValue").value.trim()) throw new Error("UTXO value required (sats)");
      if (!document.getElementById("utxoHex").value.trim()) throw new Error("Raw transaction hex required");
      if (!document.getElementById("changeAddress").value.trim()) throw new Error("Change address required");
      if (!document.getElementById("feeRate").value.trim()) throw new Error("Fee rate required (sats/vB)");
      const a = vr(t), f = mf(a), u = e.map(vr), c = z.alloc(oi);
      c[0] = 71, c[1] = 219, c[2] = 1, c.writeUInt32BE(u.length, 3), c[7] = 1;
      const p = z.concat(u.map((S) => z.concat([
        S,
        z.from([
          0
        ])
      ]))), y = z.concat([
        c,
        p
      ]), d = await dp(y), w = ox();
      fe = {
        rawCodes: u,
        header: c,
        body: p,
        msgHash: d,
        publisherPubkey: f,
        ephPriv: w.priv,
        ephXonly: w.xonly
      }, document.getElementById("msgToSign").value = d.toString("hex"), document.getElementById("hashSection").style.display = "block";
      const b = Io(a, ae().bitcoin);
      document.getElementById("signInstructions").innerHTML = `<strong>Ephemeral key generated.</strong><br><br><strong>Sign the hash with your notification address:</strong><br>1. Open your Ashigaru or Samourai wallet. Sign Message using the BIP47 notification address private key.<br>2. Address: <code>${b}</code><br>3. Paste the hash above as the message<br>4. Copy the base64 signature \u2192 Step 5`, document.getElementById("sigCard").style.display = "block";
    } catch (e) {
      console.error(e), alert(e.message);
    }
  });
  document.getElementById("btnCopyHash").addEventListener("click", () => {
    document.getElementById("msgToSign").select(), document.execCommand("copy"), _f();
  });
  document.getElementById("btnCopyPsbt").addEventListener("click", () => {
    document.getElementById("psbtOutput").select(), document.execCommand("copy"), _f();
  });
  document.getElementById("btnBuildCommit").addEventListener("click", async () => {
    try {
      const e = document.getElementById("sparrowSig").value.trim();
      if (!e) throw new Error("Paste signature");
      if (!fe.msgHash) throw new Error("Complete Step 4");
      const { recoveryId: t, signature: n } = ix(e), r = fe.msgHash.toString("hex"), i = hp(r), o = hn.fromCompact(n).addRecoveryBit(t), s = z.from(o.recoverPublicKey(i).toRawBytes(true)), a = at.address.toBase58Check(at.crypto.ripemd160(at.crypto.sha256(s)), ae().bitcoin.pubKeyHash), f = document.getElementById("publisherPM").value.trim(), u = vr(f), c = Io(u, ae().bitcoin);
      if (a !== c) throw new Error(`Signature verification failed.
Recovered address: ${a}
Expected address: ${c}

Fix the signature in Step 5 and try again.`);
      const p = z.concat([
        fe.msgHash.subarray(0, 4),
        z.from([
          t
        ]),
        n
      ]), y = z.concat([
        fe.header,
        fe.body,
        p
      ]);
      if (y.length > up) throw new Error(">2MB");
      const d = z.from(fp.deflate(y, {
        level: 9
      }));
      if (y.length / d.length > lp) throw new Error(">50:1");
      const w = [];
      for (let K = 0; K < d.length; K += 520) w.push(z.from(d.subarray(K, K + 520)));
      const b = at.script.compile([
        fe.ephXonly,
        at.opcodes.OP_CHECKSIG
      ]), S = z.concat([
        z.from([
          0,
          99
        ]),
        Ni(z.from("ord")),
        Ni(z.from([
          1
        ])),
        Ni(z.from("application/x-bip47db")),
        Ni(z.from([
          0
        ])),
        ...w.map((K) => Ni(K)),
        z.from([
          104
        ])
      ]), A = z.concat([
        b,
        S
      ]), O = 38e4, E = A.length + 500;
      if (E > O) throw new Error(`Batch too large: estimated reveal weight ${E} WU exceeds the ${O} WU safety limit (Bitcoin standardness is 400000 WU). Reduce the number of payment codes and try again.`);
      const m = at.payments.p2tr({
        internalPubkey: fe.ephXonly,
        scriptTree: {
          output: A
        },
        redeem: {
          output: A,
          redeemVersion: Bl
        },
        network: ae().bitcoin
      });
      if (!m.address || !m.output || !m.witness) throw new Error("P2TR failed");
      const k = {
        leafVersion: Bl,
        script: A,
        controlBlock: m.witness[m.witness.length - 1]
      }, T = parseFloat(document.getElementById("feeRate").value);
      if (!isFinite(T) || T <= 0) throw new Error("Fee rate must be a positive number");
      if (T > 1e3) throw new Error("Fee rate is capped at 1000 sat/vB. If you really need a higher rate, edit the cap in the source.");
      const R = 160 + Math.ceil(A.length / 4), v = 546 + Math.ceil(R * T), H = Math.ceil(155 * T), D = new at.Psbt({
        network: ae().bitcoin
      }), [$, N] = document.getElementById("utxoRef").value.trim().split(":"), U = parseInt(document.getElementById("utxoValue").value), C = U - v - H;
      if (C < 546) throw new Error(`UTXO too small: need ${v + H + 546}, got ${U}`);
      D.addInput({
        hash: $,
        index: parseInt(N),
        nonWitnessUtxo: z.from(document.getElementById("utxoHex").value.trim(), "hex")
      }), D.addOutput({
        address: m.address,
        value: v
      }), D.addOutput({
        address: document.getElementById("changeAddress").value.trim(),
        value: C
      }), fe.p2tr = m, fe.tapLeafScript = k, fe.commitAmt = v, fe.commitFee = H, document.getElementById("psbtOutput").value = D.toBase64(), document.getElementById("commitPsbtCard").style.display = "block";
    } catch (e) {
      console.error(e), alert("Build error: " + e.message);
    }
  });
  function wp() {
    const e = document.getElementById("commitTxid").value.trim();
    if (!e || !/^[0-9a-fA-F]{64}$/.test(e)) throw new Error("Invalid TXID");
    if (!fe.p2tr || !fe.ephPriv) throw !!fe.p2tr && !fe.ephPriv ? new Error(`Reveal already signed \u2014 the ephemeral key has been consumed and cannot sign a second reveal transaction.

If you saved the hex earlier, paste it into "Broadcast a previously-saved reveal" below. If you did not save it and the broadcast did not succeed, the commit output is unfortunately stranded \u2014 you will need to start a fresh inscription (new Step 4, new commit UTXO).`) : new Error(`No active inscription state. This usually means the tab was refreshed after completing Steps 4 and 5, which wipes the ephemeral signing key from memory.

If you already broadcast a commit transaction for this inscription, its output cannot be spent without the matching ephemeral key. You will need to start a fresh inscription: go back to Step 4 (Generate message hash), then Step 5 (Build commit PSBT) with a new funding UTXO, and broadcast the new commit.

If you saved the signed reveal hex to a file before refreshing, paste it into "Broadcast a previously-saved reveal" below \u2014 that path does not need buildState.`);
    const t = new at.Psbt({
      network: ae().bitcoin
    });
    t.addInput({
      hash: e,
      index: 0,
      witnessUtxo: {
        value: fe.commitAmt,
        script: fe.p2tr.output
      },
      tapLeafScript: [
        fe.tapLeafScript
      ]
    }), t.addOutput({
      address: ae().canonicalDeposit,
      value: 546
    }), t.signInput(0, {
      publicKey: z.concat([
        z.from([
          2
        ]),
        fe.ephXonly
      ]),
      signSchnorr: (r) => z.from(Rd(r, fe.ephPriv))
    }), t.finalizeInput(0);
    const n = t.extractTransaction().toHex();
    return fe.ephPriv.fill(0), fe.ephPriv = null, {
      hex: n,
      commitTxid: e
    };
  }
  function bp(e, t) {
    const n = typeof gn < "u" && gn || "bitcoin", r = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").replace(/T/, "_").slice(0, 19), i = `bip47db-reveal-${n}-${t.slice(0, 8)}-${r}.txt`, o = `# BIP47DB signed reveal transaction
# network:     ${n}
# commit txid: ${t}
# saved at:    ${(/* @__PURE__ */ new Date()).toISOString()}
# 
# Broadcast this hex to the Bitcoin network (bitcoin-cli sendrawtransaction,
# mempool.space's broadcast form, or the "Broadcast a previously-saved reveal"
# section of the BIP47DB publisher) once the commit transaction has confirmed.

${e}
`, s = new Blob([
      o
    ], {
      type: "text/plain"
    }), a = URL.createObjectURL(s), f = document.createElement("a");
    f.href = a, f.download = i, document.body.appendChild(f), f.click(), document.body.removeChild(f), URL.revokeObjectURL(a);
  }
  document.getElementById("btnBroadcastReveal").addEventListener("click", async () => {
    let e;
    try {
      e = wp();
    } catch (t) {
      console.error(t), alert("Broadcast error: " + t.message);
      return;
    }
    try {
      const t = await fetch(`${ae().mempoolApi}/tx`, {
        method: "POST",
        body: e.hex
      }), n = await t.text();
      if (!t.ok) throw new Error(n);
      document.getElementById("revealLink").href = `${ae().mempoolTx}/${n}`, document.getElementById("revealLink").innerText = `View: ${n}`, document.getElementById("revealSection").style.display = "block", document.getElementById("btnBroadcastReveal").disabled = true, document.getElementById("btnSaveReveal").disabled = true;
    } catch (t) {
      console.error(t), bp(e.hex, e.commitTxid), document.getElementById("savedRevealHex").value = e.hex, document.getElementById("savedRevealSection").style.display = "block", document.getElementById("btnBroadcastReveal").disabled = true, document.getElementById("btnSaveReveal").disabled = true, alert("Broadcast failed: " + t.message + `

The signed reveal has been saved to a file and is shown on-screen. Broadcast it later using the "Broadcast a previously-saved reveal" section below, once the commit transaction has confirmed.`);
    }
  });
  document.getElementById("btnSaveReveal").addEventListener("click", () => {
    try {
      if (!fe.p2tr || !fe.ephPriv) throw new Error('Nothing to save. If you already saved a reveal, use "Broadcast a previously-saved reveal" below.');
      const { hex: e, commitTxid: t } = wp();
      bp(e, t), document.getElementById("savedRevealHex").value = e, document.getElementById("savedRevealSection").style.display = "block", document.getElementById("btnBroadcastReveal").disabled = true, document.getElementById("btnSaveReveal").disabled = true;
    } catch (e) {
      console.error(e), alert("Save error: " + e.message);
    }
  });
  document.getElementById("btnCopySavedReveal").addEventListener("click", () => {
    document.getElementById("savedRevealHex").select(), document.execCommand("copy");
  });
  document.getElementById("btnBroadcastSavedReveal").addEventListener("click", async () => {
    const e = document.getElementById("btnBroadcastSavedReveal"), t = document.getElementById("savedRevealResult");
    try {
      const n = document.getElementById("savedRevealInput").value.split(`
`).filter((o) => !o.trim().startsWith("#")).join("").replace(/\s+/g, "");
      if (!n) throw new Error("Paste the signed reveal hex first.");
      if (!/^[0-9a-fA-F]+$/.test(n)) throw new Error("After stripping comments, the remaining content is not valid hex.");
      e.disabled = true, e.textContent = "Broadcasting...", t.innerHTML = "";
      const r = await fetch(`${ae().mempoolApi}/tx`, {
        method: "POST",
        body: n
      }), i = await r.text();
      if (!r.ok) throw new Error(i);
      t.innerHTML = `<span style="color: var(--green)">\u2713 Broadcast. <a href="${ae().mempoolTx}/${i}" target="_blank">View: ${i}</a></span>`;
    } catch (n) {
      console.error(n), t.innerHTML = `<span style="color: var(--yellow)">Error: ${n.message}</span>`;
    } finally {
      e.disabled = false, e.textContent = "Broadcast saved reveal";
    }
  });
  function mp() {
    [
      "inputCodes",
      "publisherPM",
      "utxoRef",
      "utxoValue",
      "utxoHex",
      "changeAddress",
      "msgToSign",
      "sparrowSig",
      "psbtOutput",
      "commitTxid",
      "savedRevealHex",
      "savedRevealInput"
    ].forEach((e) => {
      document.getElementById(e).value = "";
    }), document.getElementById("feeRate").value = "1", document.getElementById("nymLimit").value = "200", document.getElementById("nymStart").value = "1", document.getElementById("dedupResult").innerHTML = "", document.getElementById("savedRevealResult").innerHTML = "", document.getElementById("pubInfo").style.display = "none", [
      "hashSection",
      "sigCard",
      "commitPsbtCard",
      "revealSection",
      "savedRevealSection"
    ].forEach((e) => {
      document.getElementById(e).style.display = "none";
    }), [
      "btnBroadcastReveal",
      "btnSaveReveal"
    ].forEach((e) => {
      document.getElementById(e).disabled = false;
    }), fe = {}, vo = false, ea();
  }
  document.getElementById("btnReset").addEventListener("click", mp);
  function ax(e) {
    if (!e || e.length < 2) return null;
    const t = e[e.length - 2];
    if (!t) return null;
    const n = z.from(t, "hex"), r = z.from([
      0,
      99,
      3,
      111,
      114,
      100
    ]);
    let i = -1;
    for (let f = 0; f <= n.length - r.length; f++) if (n.subarray(f, f + r.length).equals(r)) {
      i = f + r.length;
      break;
    }
    if (i < 0) return null;
    let o = i, s = null;
    for (; o < n.length; ) {
      const f = n[o];
      if (f === 0) {
        o++;
        break;
      }
      if (f === 1 && n[o + 1] === 0) {
        o += 2;
        break;
      }
      if (f === 104) return null;
      let u = false;
      if (f === 81 ? (u = true, o++) : f === 1 && n[o + 1] === 1 && (u = true, o += 2), u) {
        const c = n[o];
        o++;
        let p;
        if (c >= 1 && c <= 75) p = c;
        else if (c === 76) p = n[o], o++;
        else if (c === 77) p = n.readUInt16LE(o), o += 2;
        else return null;
        s = n.subarray(o, o + p).toString(), o += p;
      } else o++, o += 1 + n[o];
    }
    if (s !== "application/x-bip47db") return null;
    const a = [];
    for (; o < n.length && n[o] !== 104; ) {
      const f = n[o];
      o++;
      let u;
      if (f >= 1 && f <= 75) u = f;
      else if (f === 76) u = n[o], o++;
      else if (f === 77) u = n.readUInt16LE(o), o += 2;
      else if (f === 78) u = n.readUInt32LE(o), o += 4;
      else return null;
      a.push(n.subarray(o, o + u)), o += u;
    }
    return z.concat(a);
  }
  async function cx(e) {
    const t = new fp.Inflate();
    if (t.push(e, true), t.err) throw new Error("Decompress failed");
    const n = z.from(t.result);
    if (n.length > up) throw new Error(">2MB");
    if (n.length / e.length > lp) throw new Error(">50:1");
    if (n.length < 8) throw new Error("Truncated");
    if (n[0] !== 71 || n[1] !== 219) throw new Error("Bad magic");
    const r = n[2], i = n.readUInt32BE(3), o = n[7];
    let s = oi;
    const a = oi + i * 81 + Pl, f = Wa + i * 81 + Pl;
    if (n.length === f) s = Wa;
    else if (n.length === a) s = oi;
    else if (n.length >= f) s = Wa;
    else if (n.length >= a) s = oi;
    else throw new Error("Truncated");
    const u = [];
    for (let H = 0; H < i; H++) {
      const D = s + H * 81;
      u.push({
        code: z.from(n.subarray(D, D + 80)),
        segwitExt: !!(n[D + 80] & 1)
      });
    }
    const c = s + i * 81, p = n.subarray(c, c + 4), y = n[c + 4], d = n.subarray(c + 5, c + 69), w = n.subarray(0, c), b = await dp(w);
    let S = true;
    for (let H = 0; H < 4; H++) p[H] !== b[H] && (S = false);
    const A = b.toString("hex"), O = hn.fromCompact(d).addRecoveryBit(y);
    let E = null, m = null;
    try {
      const H = hp(b.toString("hex")), D = O.recoverPublicKey(H), $ = z.from(D.toRawBytes(true));
      vu(d, H, $) && (E = $);
    } catch {
    }
    try {
      const H = O.recoverPublicKey(b), D = z.from(H.toRawBytes(true));
      vu(d, b, D) && (m = D);
    } catch {
    }
    function k(H) {
      if (!H) return false;
      for (const D of u) {
        if (z.from(D.code.subarray(2, 35)).equals(H)) return true;
        try {
          if (xs(D.code, ae().bitcoin).equals(H)) return true;
        } catch {
        }
      }
      return false;
    }
    let T = null, R = null;
    E && k(E) ? (T = E, R = "bip137") : m && k(m) ? (T = m, R = "raw") : E ? (T = E, R = "bip137") : m && (T = m, R = "raw");
    let M = null, v = false;
    if (T) for (const H of u) {
      if (z.from(H.code.subarray(2, 35)).equals(T)) {
        M = co(H.code), v = true;
        break;
      }
      try {
        if (xs(H.code, ae().bitcoin).equals(T)) {
          M = co(H.code), v = true;
          break;
        }
      } catch {
      }
    }
    return {
      raw: n,
      version: r,
      count: i,
      flags: o,
      headerSize: s,
      codes: u,
      checksum: p,
      recoveryFlag: y,
      signature: d,
      checksumValid: S,
      publisherKey: T,
      publisherPaymentCode: M,
      sigFormat: R,
      msgHashHex: A,
      verified: v
    };
  }
  async function fx(e) {
    if (!e) return null;
    const t = z.from(e, "hex"), n = await Wt("codes"), r = /* @__PURE__ */ new Set();
    for (const i of n) {
      if (r.has(i.paymentCode)) continue;
      r.add(i.paymentCode);
      const o = vr(i.paymentCode);
      if (z.from(o.subarray(2, 35)).equals(t)) return i.paymentCode;
      try {
        if (xs(o, ae().bitcoin).equals(t)) return i.paymentCode;
      } catch {
      }
    }
    return null;
  }
  async function _p() {
    const e = document.getElementById("batchList");
    e.innerHTML = '<div class="loading">Querying deposit address...</div>';
    const t = [];
    let n = "";
    for (; ; ) {
      const f = n ? `${ae().mempoolApi}/address/${ae().canonicalDeposit}/txs/chain/${n}` : `${ae().mempoolApi}/address/${ae().canonicalDeposit}/txs`, u = await fetch(f);
      if (!u.ok) throw new Error("Fetch failed");
      const c = await u.json();
      if (!c.length || (t.push(...c), n = c[c.length - 1].txid, c.length < 25)) break;
    }
    if (!t.length) {
      e.innerHTML = '<div class="empty">No batches found.</div>';
      return;
    }
    const r = await Wt("batches"), i = new Map(r.map((f) => [
      f.txid,
      f
    ]));
    for (const f of t) {
      const u = i.get(f.txid);
      if (u && !u.blockHeight && f.status.block_height) {
        u.blockHeight = f.status.block_height, u.timestamp = f.status.block_time || u.timestamp, await an("batches", u);
        const c = await Wt("codes");
        for (const p of c) p.batchTxid === f.txid && !p.blockHeight && (p.blockHeight = f.status.block_height, await an("codes", p));
      }
    }
    const o = new Set(i.keys()), s = t.filter((f) => !o.has(f.txid));
    if (!s.length) {
      await vs();
      return;
    }
    e.innerHTML = `<div class="loading">Decoding ${s.length} tx(s)...</div>`;
    for (const f of s) {
      let u = null;
      for (const p of f.vin) if (p.witness && p.witness.length > 0) {
        const y = ax(p.witness);
        if (y) {
          u = y;
          break;
        }
      }
      const c = {
        txid: f.txid,
        blockHeight: f.status.block_height || null,
        timestamp: f.status.block_time || Date.now() / 1e3
      };
      if (!u) {
        c.error = "No BIP47DB envelope", await an("batches", c);
        continue;
      }
      try {
        const p = await cx(u);
        Object.assign(c, {
          rawHex: p.raw.toString("hex"),
          version: p.version,
          count: p.count,
          flags: p.flags,
          headerSize: p.headerSize,
          checksum: p.checksum.toString("hex"),
          recoveryFlag: p.recoveryFlag,
          signature: p.signature.toString("hex"),
          checksumValid: p.checksumValid,
          publisherKey: p.publisherKey ? p.publisherKey.toString("hex") : null,
          publisherPaymentCode: p.publisherPaymentCode,
          sigFormat: p.sigFormat,
          msgHashHex: p.msgHashHex,
          verified: p.verified
        }), await an("batches", c);
        for (const y of p.codes) {
          const d = co(y.code);
          await an("codes", {
            batchTxid: f.txid,
            paymentCode: d,
            rawHex: z.from(y.code).toString("hex"),
            notificationAddress: Io(y.code, ae().bitcoin),
            segwitExt: y.segwitExt,
            blockHeight: f.status.block_height || null,
            publisherKey: c.publisherKey
          });
        }
      } catch (p) {
        c.error = p.message, await an("batches", c);
      }
    }
    const a = await Wt("batches");
    for (const f of a) if (f.publisherKey && !f.publisherPaymentCode) {
      const u = await fx(f.publisherKey);
      u && (f.publisherPaymentCode = u, f.verified = true, await an("batches", f));
    }
    await vs();
  }
  async function vs() {
    const e = document.getElementById("batchList"), t = await Wt("batches");
    if (!t.length) {
      e.innerHTML = '<div class="empty">No batches. Click Sync.</div>', document.getElementById("stats").style.display = "none";
      return;
    }
    t.sort((s, a) => s.blockHeight === null ? -1 : a.blockHeight === null ? 1 : a.blockHeight - s.blockHeight);
    let n = 0, r = 0, i = 0;
    for (const s of t) !s.error && s.checksumValid && n++, s.verified && r++, i += s.count || 0;
    document.getElementById("stats").style.display = "flex", document.getElementById("statBatches").textContent = t.length, document.getElementById("statValid").textContent = n, document.getElementById("statVerified").textContent = r, document.getElementById("statCodes").textContent = i;
    const o = await Wt("codes");
    e.innerHTML = "";
    for (const s of t) {
      const a = o.filter((y) => y.batchTxid === s.txid), f = document.createElement("div");
      f.className = "batch";
      let u, c;
      if (s.error) u = '<span class="batch-status status-invalid">INVALID</span>', c = `<div><strong>TX:</strong> <a class="txid" href="${ae().mempoolTx}/${s.txid}" target="_blank" onclick="event.stopPropagation()">${s.txid}</a></div><div><strong>Block:</strong> ${s.blockHeight || "mempool"}</div><div style="color:var(--red);margin-top:4px">${s.error}</div>`;
      else {
        u = `<span class="batch-status ${s.checksumValid ? "status-valid" : "status-invalid"}">${s.checksumValid ? "VALID" : "BAD CHECKSUM"}</span>`, s.checksumValid && (u += s.verified ? '<span class="batch-status status-verified">VERIFIED</span>' : '<span class="batch-status status-warn">UNVERIFIED</span>');
        let d;
        s.publisherPaymentCode ? d = `<span style="color:var(--green)">${s.publisherPaymentCode.slice(0, 12)}...</span>` : s.publisherKey ? d = s.publisherKey.slice(0, 16) + "..." : d = "unknown", c = `<div><strong>TX:</strong> <a class="txid" href="${ae().mempoolTx}/${s.txid}" target="_blank" onclick="event.stopPropagation()">${s.txid}</a></div><div><strong>Block:</strong> ${s.blockHeight || "mempool"} \xB7 <strong>Codes:</strong> ${s.count} \xB7 <strong>Publisher:</strong> ${d}</div>`;
      }
      const p = s.error ? `<div style="color:var(--red)">${s.error}</div>` : ux(s, a);
      f.innerHTML = `<div class="batch-header"><div class="batch-meta">${c}</div><div class="batch-badges">${u}</div></div><div class="batch-body">${p}</div>`, f.querySelector(".batch-header").addEventListener("click", (y) => {
        y.target.closest("a") || f.querySelector(".batch-body").classList.toggle("open");
      }), e.appendChild(f);
    }
    document.querySelectorAll(".batch-body").forEach((s) => {
      s.querySelectorAll(".subtab").forEach((a) => {
        a.addEventListener("click", (f) => {
          f.stopPropagation();
          const u = a.dataset.subtab;
          s.querySelectorAll(".subtab").forEach((c) => c.classList.remove("active")), s.querySelectorAll(".subpanel").forEach((c) => c.classList.remove("active")), a.classList.add("active"), s.querySelector(`.subpanel[data-subpanel="${u}"]`).classList.add("active");
        });
      });
    });
  }
  function ux(e, t) {
    const n = t.length === 0 ? '<div class="empty">No codes</div>' : '<div class="code-list">' + t.map((i) => {
      const o = i.paymentCode === e.publisherPaymentCode;
      return `<div class="row"><span class="pm">${i.paymentCode}</span>${o ? '<span class="badge-pub">publisher</span>' : ""}${i.segwitExt ? '<span class="badge-sw">segwit</span>' : ""}</div>`;
    }).join("") + "</div>", r = `<table class="meta-table"><tr><td>Version</td><td>${e.version}</td></tr><tr><td>Count</td><td>${e.count}</td></tr><tr><td>Flags</td><td>0x${(e.flags || 0).toString(16).padStart(2, "0")}</td></tr><tr><td>Header size</td><td>${e.headerSize || "?"} bytes${e.headerSize === 40 ? " (legacy)" : ""}</td></tr><tr><td>Checksum</td><td>${e.checksum} ${e.checksumValid ? "\u2713" : "\u2717"}</td></tr><tr><td>Recovery flag</td><td>${e.recoveryFlag}</td></tr><tr><td>Signature</td><td>${e.signature}</td></tr><tr><td>Message hash</td><td style="color:var(--accent)">${e.msgHashHex || "(re-sync)"}</td></tr><tr><td>Publisher pubkey</td><td>${e.publisherKey || "(unmatched)"}</td></tr></table>`;
    return `<div class="subtabs"><button class="subtab active" data-subtab="codes">Codes (${e.count})</button><button class="subtab" data-subtab="meta">Header / Trailer</button><button class="subtab" data-subtab="hex">Hex Dump</button><button class="subtab" data-subtab="verify">Verify</button></div><div class="subpanel active" data-subpanel="codes">${n}</div><div class="subpanel" data-subpanel="meta">${r}</div><div class="subpanel" data-subpanel="hex">${hx(e)}</div><div class="subpanel" data-subpanel="verify">${lx(e)}</div>`;
  }
  function lx(e) {
    if (!e.rawHex) return '<div class="empty">No data</div>';
    const t = e.msgHashHex || "(clear DB and re-sync)";
    let n = "(publisher unmatched)", r = "(unknown)";
    if (e.publisherPaymentCode) {
      r = e.publisherPaymentCode;
      try {
        n = Io(vr(e.publisherPaymentCode), ae().bitcoin);
      } catch {
      }
    }
    let i = "";
    try {
      const a = z.from(e.signature, "hex");
      i = z.concat([
        z.from([
          31 + e.recoveryFlag
        ]),
        a
      ]).toString("base64");
    } catch {
      i = "(error)";
    }
    const o = e.verified ? `<span style="color:#818cf8;font-weight:600">\u2713 VERIFIED</span> \u2014 signed by the publisher's BIP-47 notification address key.` : '<span style="color:var(--yellow);font-weight:600">\u2717 UNVERIFIED</span> \u2014 signature does not match any known payment code.';
    function s(a) {
      return `<span style="cursor:pointer" title="Click to copy" onclick="navigator.clipboard.writeText('${a.replace(/'/g, "\\'")}');showCopied()">${a}</span>`;
    }
    return `<table class="meta-table"><tr><td>Status</td><td>${o}</td></tr><tr><td>Message hash</td><td style="color:var(--accent);font-weight:600">${s(t)}</td></tr><tr><td>Publisher Payment Code</td><td>${s(r)}</td></tr><tr><td>Notification address</td><td>${s(n)}</td></tr><tr><td>Signature (base64)</td><td style="color:var(--link)">${s(i)}</td></tr><tr><td>Sig format</td><td>${e.sigFormat === "bip137" ? "BIP-137 (standard Bitcoin signmessage)" : "raw SHA-256"}</td></tr></table>`;
  }
  function hx(e) {
    if (!e.rawHex) return '<div class="empty">No hex</div>';
    const t = e.headerSize || oi, n = t * 2, r = e.count * 81 * 2, i = e.rawHex.slice(0, n), o = e.rawHex.slice(n, n + r), s = e.rawHex.slice(n + r), a = e.rawHex;
    let f = "";
    f += `<div class="hex-section"><div class="hex-section-label">Header (${t} bytes)</div><table class="meta-table">`, f += `<tr><td style="width:170px;white-space:nowrap">Magic [0\u20131]</td><td><span class="hex-header">${a.slice(0, 4)}</span> (0x47DB)</td></tr>`, f += `<tr><td style="white-space:nowrap">Version [2]</td><td><span class="hex-header">${a.slice(4, 6)}</span> (${parseInt(a.slice(4, 6), 16)})</td></tr>`, f += `<tr><td style="white-space:nowrap">Record count [3\u20136]</td><td><span class="hex-header">${a.slice(6, 14)}</span> (${parseInt(a.slice(6, 14), 16)})</td></tr>`, f += `<tr><td style="white-space:nowrap">Flags [7]</td><td><span class="hex-header">${a.slice(14, 16)}</span></td></tr>`, t === 40 && (f += `<tr><td style="white-space:nowrap">Prev txid [8\u201339]</td><td style="font-size:11px;word-break:break-all"><span class="hex-header">${a.slice(16, 80)}</span> (legacy)</td></tr>`), f += "</table></div>", f += `<div class="hex-section"><div class="hex-section-label">Body (${e.count} records \xD7 81 bytes)</div>`, f += '<div style="max-height:400px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--border) transparent">', f += '<table class="meta-table">';
    for (let d = 0; d < e.count; d++) {
      const w = n + d * 81 * 2, b = a.slice(w, w + 160), S = a.slice(w + 160, w + 162), O = !!(parseInt(S, 16) & 1);
      let E = "";
      try {
        E = co(z.from(b, "hex"));
      } catch {
        E = "(error)";
      }
      f += `<tr><td colspan="2" style="color:var(--accent);font-weight:600;border-bottom:none;padding-bottom:2px">Record ${d + 1}</td></tr>`, f += `<tr><td style="width:170px;white-space:nowrap">Payment code</td><td style="font-size:12px;word-break:break-all"><span class="hex-body" style="cursor:pointer" title="Click to copy" onclick="navigator.clipboard.writeText('${E}');showCopied()">${E}</span></td></tr>`, f += `<tr><td style="white-space:nowrap">Version [0]</td><td><span class="hex-body">${b.slice(0, 2)}</span> (${parseInt(b.slice(0, 2), 16)})</td></tr>`, f += `<tr><td style="white-space:nowrap">Features [1]</td><td><span class="hex-body">${b.slice(2, 4)}</span></td></tr>`, f += `<tr><td style="white-space:nowrap">Pubkey [2\u201334]</td><td style="font-size:11px;word-break:break-all"><span class="hex-body">${b.slice(4, 70)}</span></td></tr>`, f += `<tr><td style="white-space:nowrap">Chain code [35\u201366]</td><td style="font-size:11px;word-break:break-all"><span class="hex-body">${b.slice(70, 134)}</span></td></tr>`;
      const m = b.slice(134, 160);
      m !== "0".repeat(26) && (f += `<tr><td style="white-space:nowrap">Reserved [67\u201379]</td><td style="font-size:11px;word-break:break-all"><span class="hex-body">${m}</span></td></tr>`), f += `<tr><td style="white-space:nowrap">Record flag</td><td><span class="hex-body">${S}</span> (${O ? "segwit" : "standard"})</td></tr>`;
    }
    f += "</table></div></div>";
    const u = s.slice(0, 8), c = s.slice(8, 10), p = s.slice(10, 138);
    f += '<div class="hex-section"><div class="hex-section-label">Trailer (69 bytes)</div><table class="meta-table">', f += `<tr><td style="width:170px;white-space:nowrap">Checksum [0\u20133] ${e.checksumValid ? "\u2713" : "\u2717"}</td><td><span class="hex-trailer">${u}</span></td></tr>`, f += `<tr><td style="white-space:nowrap">Recovery flag [4]</td><td><span class="hex-trailer">${c}</span> (${parseInt(c, 16)})</td></tr>`, f += `<tr><td style="white-space:nowrap">Signature [5\u201368]</td><td style="font-size:11px;word-break:break-all"><span class="hex-trailer">${p}</span></td></tr>`, f += "</table></div>";
    function y(d) {
      let w = "";
      for (let b = 0; b < d.length; b += 2) w += d.slice(b, b + 2), (b + 2) % 32 === 0 ? w += `
` : w += " ";
      return w.trim();
    }
    return f += `<div class="hex-section" style="margin-top:16px"><div class="hex-section-label" style="cursor:pointer" onclick="const el=this.nextElementSibling;el.style.display=el.style.display==='none'?'block':'none'">Raw hex (click to expand)</div><div style="display:none"><div class="hex-dump"><div class="hex-section"><div class="hex-section-label">Header</div><pre class="hex-header" style="margin:0;white-space:pre-wrap;word-break:break-all">${y(i)}</pre></div><div class="hex-section"><div class="hex-section-label">Body</div><pre class="hex-body" style="margin:0;white-space:pre-wrap;word-break:break-all">${y(o)}</pre></div><div class="hex-section"><div class="hex-section-label">Trailer</div><pre class="hex-trailer" style="margin:0;white-space:pre-wrap;word-break:break-all">${y(s)}</pre></div></div></div></div>`, `<div style="font-family:'JetBrains Mono',monospace;font-size:12px">${f}</div>`;
  }
  document.getElementById("btnSearch").addEventListener("click", async () => {
    const e = document.getElementById("searchInput").value.trim(), t = document.getElementById("searchResult");
    if (!e) {
      t.innerHTML = "";
      return;
    }
    let n = [];
    try {
      e.startsWith("PM") ? n = await rs("codes", "paymentCode", e) : e.startsWith("tb1") || e.startsWith("m") || e.startsWith("n") ? n = await rs("codes", "notificationAddress", e) : /^[0-9a-fA-F]+$/.test(e) && (n = await rs("codes", "publisherKey", e));
    } catch (r) {
      t.innerHTML = `<div class="search-result" style="color:var(--red)">${r.message}</div>`;
      return;
    }
    if (!n.length) {
      t.innerHTML = '<div class="search-result">No matches.</div>';
      return;
    }
    t.innerHTML = `<div class="search-result"><strong>${n.length}</strong> match(es):<br><br>` + n.map((r) => `<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border-subtle)"><strong>${r.paymentCode}</strong><br><span style="color:var(--text-muted)">Notif: ${r.notificationAddress}</span><br><span style="color:var(--text-muted)">Block: ${r.blockHeight || "mempool"} \xB7 <a href="${ae().mempoolTx}/${r.batchTxid}" target="_blank">${r.batchTxid.slice(0, 16)}...</a></span>${r.segwitExt ? ' <span style="color:var(--yellow)">[segwit]</span>' : ""}</div>`).join("") + "</div>";
  });
  document.getElementById("btnLoadBatches").addEventListener("click", async () => {
    const e = document.getElementById("btnLoadBatches");
    e.disabled = true, e.textContent = "Syncing...";
    try {
      await _p();
    } catch (t) {
      console.error(t), document.getElementById("batchList").innerHTML = `<div class="empty" style="color:var(--red)">${t.message}</div>`;
    } finally {
      e.disabled = false, e.textContent = "Sync batches";
    }
  });
  document.getElementById("btnExportDb").addEventListener("click", async () => {
    try {
      const e = await Wt("batches"), t = await Wt("codes"), n = {
        schema: `bip47db_${gn}/v1`,
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        network: gn,
        canonicalDeposit: ae().canonicalDeposit,
        batchCount: e.length,
        codeCount: t.length,
        batches: e,
        codes: t
      }, r = new Blob([
        JSON.stringify(n, null, 2)
      ], {
        type: "application/json"
      }), i = URL.createObjectURL(r), o = document.createElement("a");
      o.href = i, o.download = `bip47db-${gn}-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19)}.json`, document.body.appendChild(o), o.click(), document.body.removeChild(o), URL.revokeObjectURL(i);
    } catch (e) {
      alert("Export failed: " + e.message);
    }
  });
  document.getElementById("btnImportDb").addEventListener("click", () => {
    document.getElementById("importFileInput").click();
  });
  document.getElementById("importFileInput").addEventListener("change", async (e) => {
    const t = e.target.files[0];
    if (t) {
      try {
        const n = JSON.parse(await t.text());
        if (!n.batches && !n.codes) throw new Error("Invalid: no batches or codes");
        let r = 0, i = 0, o = 0, s = 0;
        if (n.batches && Array.isArray(n.batches)) {
          const a = new Set((await Wt("batches")).map((f) => f.txid));
          for (const f of n.batches) f.txid && !a.has(f.txid) ? (await an("batches", f), r++) : o++;
        }
        if (n.codes && Array.isArray(n.codes)) {
          const a = new Set((await Wt("codes")).map((f) => f.batchTxid + "|" + f.paymentCode));
          for (const f of n.codes) a.has(f.batchTxid + "|" + f.paymentCode) ? s++ : (await an("codes", f), i++);
        }
        alert(`Imported: ${r} batches, ${i} codes.
Skipped: ${o} batches, ${s} codes.`), await vs();
      } catch (n) {
        console.error(n), alert("Import failed: " + n.message);
      }
      e.target.value = "";
    }
  });
  document.getElementById("btnClearDb").addEventListener("click", async () => {
    confirm("Delete all cached data?") && (await nx(), document.getElementById("batchList").innerHTML = '<div class="empty">Cleared.</div>', document.getElementById("stats").style.display = "none", document.getElementById("searchResult").innerHTML = "");
  });
})();
