/**
 * ProductController
 * 2015-08-21 02:08:26
 * 
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    view: function view(req, res) {

        res.render('product/product');
    }
};
module.exports = exports['default'];