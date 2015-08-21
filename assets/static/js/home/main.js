(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Point = function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
};

var pig = 'My name is pig';

exports.Point = Point;
exports.pig = pig;
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dog = function Dog(dname) {
    _classCallCheck(this, Dog);

    this.name = dname;
};

exports.Dog = Dog;
},{}],3:[function(require,module,exports){


//这里可以看出，尽管声明了引用的模块，还是可以通过指定需要的部分进行导入
// import 'jquery/dist/jquery'

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _home2 = require('./home2');

var _home3 = require('./home3');

var origin = new _home2.Point(0, 0);
console.log(origin);

alert('pig: ' + _home2.pig);

var dog = new _home3.Dog('ludc');

console.log(dog);

/**
 * test for => ====================
 * @type {Array}
 */
var list = [1, 2, 3, 4, 5, 6];

//ES6
list.forEach(function (v) {
  return console.log(v);
});

// fasel !! ========================
var num = Math.random();
//将这个数字输出到console
console.log('your num is ${num}');

// default params ==================
function hello() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? "jack" : arguments[0];

  alert(name);
}

hello();

//=================================

exports.num = num;
exports.hello = hello;
},{"./home2":1,"./home3":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInN0YXRpYy8udG1wX2pzL2hvbWUvaG9tZTIuanMiLCJzdGF0aWMvLnRtcF9qcy9ob21lL2hvbWUzLmpzIiwic3RhdGljLy50bXBfanMvaG9tZS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbnZhciBQb2ludCA9IGZ1bmN0aW9uIFBvaW50KHgsIHkpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUG9pbnQpO1xuXG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xufTtcblxudmFyIHBpZyA9ICdNeSBuYW1lIGlzIHBpZyc7XG5cbmV4cG9ydHMuUG9pbnQgPSBQb2ludDtcbmV4cG9ydHMucGlnID0gcGlnOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBEb2cgPSBmdW5jdGlvbiBEb2coZG5hbWUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRG9nKTtcblxuICAgIHRoaXMubmFtZSA9IGRuYW1lO1xufTtcblxuZXhwb3J0cy5Eb2cgPSBEb2c7IiwiXG5cbi8v6L+Z6YeM5Y+v5Lul55yL5Ye677yM5bC9566h5aOw5piO5LqG5byV55So55qE5qih5Z2X77yM6L+Y5piv5Y+v5Lul6YCa6L+H5oyH5a6a6ZyA6KaB55qE6YOo5YiG6L+b6KGM5a+85YWlXG4vLyBpbXBvcnQgJ2pxdWVyeS9kaXN0L2pxdWVyeSdcblxuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9ob21lMiA9IHJlcXVpcmUoJy4vaG9tZTInKTtcblxudmFyIF9ob21lMyA9IHJlcXVpcmUoJy4vaG9tZTMnKTtcblxudmFyIG9yaWdpbiA9IG5ldyBfaG9tZTIuUG9pbnQoMCwgMCk7XG5jb25zb2xlLmxvZyhvcmlnaW4pO1xuXG5hbGVydCgncGlnOiAnICsgX2hvbWUyLnBpZyk7XG5cbnZhciBkb2cgPSBuZXcgX2hvbWUzLkRvZygnbHVkYycpO1xuXG5jb25zb2xlLmxvZyhkb2cpO1xuXG4vKipcbiAqIHRlc3QgZm9yID0+ID09PT09PT09PT09PT09PT09PT09XG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cbnZhciBsaXN0ID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xuXG4vL0VTNlxubGlzdC5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gIHJldHVybiBjb25zb2xlLmxvZyh2KTtcbn0pO1xuXG4vLyBmYXNlbCAhISA9PT09PT09PT09PT09PT09PT09PT09PT1cbnZhciBudW0gPSBNYXRoLnJhbmRvbSgpO1xuLy/lsIbov5nkuKrmlbDlrZfovpPlh7rliLBjb25zb2xlXG5jb25zb2xlLmxvZygneW91ciBudW0gaXMgJHtudW19Jyk7XG5cbi8vIGRlZmF1bHQgcGFyYW1zID09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gaGVsbG8oKSB7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gXCJqYWNrXCIgOiBhcmd1bWVudHNbMF07XG5cbiAgYWxlcnQobmFtZSk7XG59XG5cbmhlbGxvKCk7XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydHMubnVtID0gbnVtO1xuZXhwb3J0cy5oZWxsbyA9IGhlbGxvOyJdfQ==
