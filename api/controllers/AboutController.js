/**
 * AboutController
 * 2015-08-21 02:08:10
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

        res.render('about/about');
    }
};
module.exports = exports['default'];