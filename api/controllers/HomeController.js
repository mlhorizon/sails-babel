/**
 * HomeController
 * 2015-08-21 02:08:38
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
        console.log(' ==== welcome home');
        res.render('home/home');
    }
};
module.exports = exports['default'];