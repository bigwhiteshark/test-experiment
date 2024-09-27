var w = Object.defineProperty;
var A = (i, t, s) => t in i ? w(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s;
var o = (i, t, s) => (A(i, typeof t != "symbol" ? t + "" : t, s), s), S = (i, t, s) => {
  if (!t.has(i))
    throw TypeError("Cannot " + s);
};
var l = (i, t, s) => (S(i, t, "read from private field"), s ? s.call(i) : t.get(i)), d = (i, t, s) => {
  if (t.has(i))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(i) : t.set(i, s);
}, n = (i, t, s, c) => (S(i, t, "write to private field"), c ? c.call(i, s) : t.set(i, s), s);
var D = (i, t, s) => (S(i, t, "access private method"), s);
import m from "../utils/colorToAnsi.js";
import E from "../utils/logLocation.js";
const B = typeof window != "object";
var r, u, f, g, y, F, $, T;
const e = class e {
  constructor() {
    d(this, y);
    d(this, $);
    d(this, r, [""]);
    d(this, u, [""]);
    d(this, f, [""]);
    d(this, g, [""]);
    o(this, "log", (...t) => {
      const s = D(this, $, T).call(this);
      return e.isDebug && !B ? console.trace(...s, ...t) : console.log(...s, ...t);
    });
    o(this, "debug", (...t) => {
      const s = D(this, $, T).call(this, !0);
      return B ? console.log(...s, ...t) : console.trace(...s, ...t);
    });
    return e.instance || (D(this, y, F).call(this), e.instance = this), e.instance;
  }
  bg(...t) {
    return n(this, r, t), this;
  }
  color(...t) {
    return n(this, u, t), this;
  }
  title(...t) {
    return n(this, f, t), this;
  }
  style(...t) {
    return n(this, g, t), this;
  }
  setDefaultStyle(t) {
    e.defaultBg = t.defaultBg || ["#D7F7C2"], e.defaultColor = t.defaultColor || ["#05690D"], e.defaultTitle = t.defaultTitle || ["easy-style-log"], e.defaultStyle = t.defaultStyle || [""], e.isDebug = t.isDebug || !1, e.nodeDebugBg = t.nodeDebugBg || "", e.nodeDebugColor = t.nodeDebugColor || "blue", D(this, y, F).call(this);
  }
};
r = new WeakMap(), u = new WeakMap(), f = new WeakMap(), g = new WeakMap(), y = new WeakSet(), F = function() {
  n(this, r, [...e.defaultBg]), n(this, u, [...e.defaultColor]), n(this, f, [...e.defaultTitle]), n(this, g, [...e.defaultStyle]);
}, $ = new WeakSet(), T = function(t = !1) {
  let s = [];
  if (B) {
    let c = "";
    if (e.isDebug || t) {
      const b = e.nodeDebugBg ? m(e.nodeDebugBg, !0) : "", a = e.nodeDebugColor ? m(e.nodeDebugColor) + "" : "";
      c = `\x1B[${b}${a && b ? ";" : ""}${a}m${E()}\x1B[49;39m`;
    }
    s[0] = l(this, f).reduce((b, a, h) => {
      const C = l(this, r)[h] ? m(l(this, r)[h], !0) : l(this, r)[0] ? m(l(this, r)[0], !0) : "", x = l(this, u)[h] ? m(l(this, u)[h]) : l(this, u)[0] ? m(l(this, u)[0]) : "";
      return b + `\x1B[${C}${x && C ? ";" : ""}${x}m${a}\x1B[49;39m`;
    }, c);
  } else {
    let c = "";
    s = l(this, f).map((b, a) => {
      c += `%c ${b} `;
      const h = l(this, r)[a] || l(this, r)[0], C = l(this, u)[a] || l(this, u)[0], x = l(this, g)[a] || l(this, g)[0];
      return `background: ${h};color: ${C}; padding: 3px 6px;margin:2px 0; border-radius: 2px; font-size: 14px;  font-weight: 600;` + x;
    }), s.unshift(c);
  }
  return D(this, y, F).call(this), s;
}, o(e, "defaultBg", B ? [""] : ["linear-gradient(to right, #12c2e9, #c471ed, #f64f59)"]), o(e, "defaultColor", B ? [""] : ["#FFFFFF"]), o(e, "defaultTitle", ["EASY-STYLE-LOG"]), o(e, "defaultStyle", [""]), o(e, "isDebug", !1), o(e, "nodeDebugBg", ""), o(e, "nodeDebugColor", "blue"), o(e, "instance");
let p = e;
export {
  p as Log
};
