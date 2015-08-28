(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
     * ES6 FILE FOR EssayController 
     * 2015-08-24 01:08:37
     */

    'use strict';

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    function hello() {
      var page = 'essay';
      alert('Hello, this is ' + page + '. You can use es6 now.');
    }

    hello();

    exports.hello = hello;
  }, {}] }, {}, [1]);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvLnRtcC9lc3NheS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuKGZ1bmN0aW9uIGUodCwgbiwgcikge1xuICBmdW5jdGlvbiBzKG8sIHUpIHtcbiAgICBpZiAoIW5bb10pIHtcbiAgICAgIGlmICghdFtvXSkge1xuICAgICAgICB2YXIgYSA9IHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO2lmICghdSAmJiBhKSByZXR1cm4gYShvLCAhMCk7aWYgKGkpIHJldHVybiBpKG8sICEwKTt2YXIgZiA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBvICsgXCInXCIpO3Rocm93IChmLmNvZGUgPSBcIk1PRFVMRV9OT1RfRk9VTkRcIiwgZik7XG4gICAgICB9dmFyIGwgPSBuW29dID0geyBleHBvcnRzOiB7fSB9O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBuID0gdFtvXVsxXVtlXTtyZXR1cm4gcyhuID8gbiA6IGUpO1xuICAgICAgfSwgbCwgbC5leHBvcnRzLCBlLCB0LCBuLCByKTtcbiAgICB9cmV0dXJuIG5bb10uZXhwb3J0cztcbiAgfXZhciBpID0gdHlwZW9mIHJlcXVpcmUgPT0gXCJmdW5jdGlvblwiICYmIHJlcXVpcmU7Zm9yICh2YXIgbyA9IDA7IG8gPCByLmxlbmd0aDsgbysrKSBzKHJbb10pO3JldHVybiBzO1xufSkoeyAxOiBbZnVuY3Rpb24gKHJlcXVpcmUsIG1vZHVsZSwgZXhwb3J0cykge1xuICAgIC8qKlxuICAgICAqIEVTNiBGSUxFIEZPUiBFc3NheUNvbnRyb2xsZXIgXG4gICAgICogMjAxNS0wOC0yNCAwMTowODozN1xuICAgICAqL1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgICAgdmFsdWU6IHRydWVcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBoZWxsbygpIHtcbiAgICAgIHZhciBwYWdlID0gJ2Vzc2F5JztcbiAgICAgIGFsZXJ0KCdIZWxsbywgdGhpcyBpcyAnICsgcGFnZSArICcuIFlvdSBjYW4gdXNlIGVzNiBub3cuJyk7XG4gICAgfVxuXG4gICAgaGVsbG8oKTtcblxuICAgIGV4cG9ydHMuaGVsbG8gPSBoZWxsbztcbiAgfSwge31dIH0sIHt9LCBbMV0pOyJdfQ==
