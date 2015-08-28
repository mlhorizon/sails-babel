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
     * ES6 FILE FOR ProductController 
     * 2015-08-24 01:08:58
     */

    'use strict';

    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    function hello() {
      var page = 'product';
      alert('Hello, this is ' + page + '. You can use es6 now.');
    }

    hello();

    exports.hello = hello;
  }, {}] }, {}, [1]);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvLnRtcC9wcm9kdWN0L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG4oZnVuY3Rpb24gZSh0LCBuLCByKSB7XG4gIGZ1bmN0aW9uIHMobywgdSkge1xuICAgIGlmICghbltvXSkge1xuICAgICAgaWYgKCF0W29dKSB7XG4gICAgICAgIHZhciBhID0gdHlwZW9mIHJlcXVpcmUgPT0gXCJmdW5jdGlvblwiICYmIHJlcXVpcmU7aWYgKCF1ICYmIGEpIHJldHVybiBhKG8sICEwKTtpZiAoaSkgcmV0dXJuIGkobywgITApO3ZhciBmID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG8gKyBcIidcIik7dGhyb3cgKGYuY29kZSA9IFwiTU9EVUxFX05PVF9GT1VORFwiLCBmKTtcbiAgICAgIH12YXIgbCA9IG5bb10gPSB7IGV4cG9ydHM6IHt9IH07dFtvXVswXS5jYWxsKGwuZXhwb3J0cywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIG4gPSB0W29dWzFdW2VdO3JldHVybiBzKG4gPyBuIDogZSk7XG4gICAgICB9LCBsLCBsLmV4cG9ydHMsIGUsIHQsIG4sIHIpO1xuICAgIH1yZXR1cm4gbltvXS5leHBvcnRzO1xuICB9dmFyIGkgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtmb3IgKHZhciBvID0gMDsgbyA8IHIubGVuZ3RoOyBvKyspIHMocltvXSk7cmV0dXJuIHM7XG59KSh7IDE6IFtmdW5jdGlvbiAocmVxdWlyZSwgbW9kdWxlLCBleHBvcnRzKSB7XG4gICAgLyoqXG4gICAgICogRVM2IEZJTEUgRk9SIFByb2R1Y3RDb250cm9sbGVyIFxuICAgICAqIDIwMTUtMDgtMjQgMDE6MDg6NThcbiAgICAgKi9cblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICAgIHZhbHVlOiB0cnVlXG4gICAgfSk7XG4gICAgZnVuY3Rpb24gaGVsbG8oKSB7XG4gICAgICB2YXIgcGFnZSA9ICdwcm9kdWN0JztcbiAgICAgIGFsZXJ0KCdIZWxsbywgdGhpcyBpcyAnICsgcGFnZSArICcuIFlvdSBjYW4gdXNlIGVzNiBub3cuJyk7XG4gICAgfVxuXG4gICAgaGVsbG8oKTtcblxuICAgIGV4cG9ydHMuaGVsbG8gPSBoZWxsbztcbiAgfSwge31dIH0sIHt9LCBbMV0pOyJdfQ==
