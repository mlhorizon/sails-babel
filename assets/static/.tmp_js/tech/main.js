/**
 * ES6 FILE FOR TechController 
 * 2015-08-21 02:08:15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

require('jquery/dist/jquery');

function hello() {
  var page = 'tech created by Wenlong';
  alert('Hello, this is ' + page + '. You can use es6 now.');

  $('body').html('dodldl');
}

hello();

exports.hello = hello;