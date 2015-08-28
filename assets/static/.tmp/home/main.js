/**
 * FOR HomeController
 */

'use strict';

require('jquery/dist/jquery');

var _home2 = require('./home2');

$(function () {
  console.log('good');
  var sb = new _home2.Point('sb');
  console.log(sb);
  // alert('dom ready')
});