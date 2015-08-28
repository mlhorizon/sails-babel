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
        'use strict';

        Object.defineProperty(exports, '__esModule', {
            value: true
        });

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError('Cannot call a class as a function');
            }
        }

        var Point = function Point(x, y) {
            _classCallCheck(this, Point);

            this.x = x;
            this.y = y;
        };

        var pig = 'My name is pig';

        exports.Point = Point;
        exports.pig = pig;
    }, {}] }, {}, [1]);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvLnRtcC9ob21lL2hvbWUyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbihmdW5jdGlvbiBlKHQsIG4sIHIpIHtcbiAgICBmdW5jdGlvbiBzKG8sIHUpIHtcbiAgICAgICAgaWYgKCFuW29dKSB7XG4gICAgICAgICAgICBpZiAoIXRbb10pIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO2lmICghdSAmJiBhKSByZXR1cm4gYShvLCAhMCk7aWYgKGkpIHJldHVybiBpKG8sICEwKTt2YXIgZiA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBvICsgXCInXCIpO3Rocm93IChmLmNvZGUgPSBcIk1PRFVMRV9OT1RfRk9VTkRcIiwgZik7XG4gICAgICAgICAgICB9dmFyIGwgPSBuW29dID0geyBleHBvcnRzOiB7fSB9O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSB0W29dWzFdW2VdO3JldHVybiBzKG4gPyBuIDogZSk7XG4gICAgICAgICAgICB9LCBsLCBsLmV4cG9ydHMsIGUsIHQsIG4sIHIpO1xuICAgICAgICB9cmV0dXJuIG5bb10uZXhwb3J0cztcbiAgICB9dmFyIGkgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtmb3IgKHZhciBvID0gMDsgbyA8IHIubGVuZ3RoOyBvKyspIHMocltvXSk7cmV0dXJuIHM7XG59KSh7IDE6IFtmdW5jdGlvbiAocmVxdWlyZSwgbW9kdWxlLCBleHBvcnRzKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIFBvaW50ID0gZnVuY3Rpb24gUG9pbnQoeCwgeSkge1xuICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvaW50KTtcblxuICAgICAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBpZyA9ICdNeSBuYW1lIGlzIHBpZyc7XG5cbiAgICAgICAgZXhwb3J0cy5Qb2ludCA9IFBvaW50O1xuICAgICAgICBleHBvcnRzLnBpZyA9IHBpZztcbiAgICB9LCB7fV0gfSwge30sIFsxXSk7Il19
