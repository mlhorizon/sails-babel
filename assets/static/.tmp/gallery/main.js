"use strict";

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
    /**
     * ES6 FILE FOR GalleryController 
     * 2015-08-25 07:08:53
     */

    'use strict';

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    function hello() {
      var page = 'gallery';
      alert('Hello, this is ' + page + '. You can use es6 now.');
    }

    hello();

    exports.hello = hello;
  }, {}] }, {}, [1]);