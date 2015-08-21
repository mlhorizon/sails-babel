

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