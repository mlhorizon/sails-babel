/**
 * ES6 FILE FOR DancerController 
 * 2015-08-25 09:08:43
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('jquery/dist/jquery');

var _rainyday = require('rainyday');

var rainList = undefined,
    canvas = undefined,
    dancer = undefined;

var Dancer = (function () {
    function Dancer() {
        _classCallCheck(this, Dancer);

        this.cacheEle();
        this.initNavMenu();
        this.initRain();
    }

    _createClass(Dancer, [{
        key: 'initRain',
        value: function initRain() {
            function runRain() {
                var engine = new _rainyday.RainyDay({
                    id: 'myDancer',
                    element: img_dancer,
                    image: img_dancer,
                    parentElement: dance_ctn,
                    blur: 10,
                    opacity: 1,
                    zIndex: -1,
                    fps: 30
                });
                // engine.rain([ [1, 2, 8000] ]);
                engine.rain([[3, 3, 0.88], [5, 5, 0.9], [6, 2, 1]], 100);

                var engine1 = new _rainyday.RainyDay({
                    id: 'myDancer_1',
                    element: img_dancer_1,
                    image: img_dancer_1,
                    parentElement: dance_ctn,
                    blur: 10,
                    opacity: 1,
                    zIndex: -2,
                    fps: 30
                });

                engine1.rain([[3, 3, 0.88], [5, 5, 0.9], [6, 2, 1]], 100);

                return [engine, engine1];
            }

            window.onload = function () {
                rainList = runRain();
                canvas = rainList[0].canvas;

                dancer.slideDancer(rainList);
            };
        }
    }, {
        key: 'initNavMenu',
        value: function initNavMenu() {
            this.$navMenu.on('click', function (event) {
                dancer.$navMenu.removeClass('active');
                $(this).addClass('active');
            });
        }
    }, {
        key: 'transEnd',
        value: function transEnd(tar, cbfn, isOnce) {
            var $tar = $(tar);
            var END_NAMES = {
                "Moz": "transitionEnd",
                "webkit": "webkitTransitionEnd",
                "ms": "MSTransitionEnd",
                "O": "oTransitionEnd"
            };

            if (!isOnce) {
                _bind($tar);
            } else {
                _onceBind($tar);
            }

            function _bind($target) {
                $.each(END_NAMES, function (k, v) {
                    $target.on(v, function (event) {
                        cbfn();
                    });
                });
            }
            function _onceBind($target) {
                $.each(END_NAMES, function (k, v) {
                    $target.one(v, function (event) {
                        cbfn();
                        $target.unbind(v, cbfn);
                        // $tar.get(0).removeEventListener(cbfn);
                    });
                });
            }
        }
    }, {
        key: 'refreshImg',
        value: function refreshImg() {
            var $can = $(canvas);
            this.transEnd($can, function () {
                rain.refreshImg('/static/cloud/img/index/1.jpg', function (event) {
                    $can.css('opacity', 1);
                });
            }, true);

            $can.css('opacity', 0.6);
        }
    }, {
        key: 'slideDancer',
        value: function slideDancer() {
            var $can = $(rainList[0].canvas),
                $can1 = $(rainList[1].canvas);

            $can1.addClass('opacity_0');

            function _cycle() {
                setTimeout(function () {
                    $can.toggleClass('opacity_0');
                    $can1.toggleClass('opacity_0');

                    _cycle();
                }, 6000);
            }

            _cycle();
        }
    }, {
        key: 'cacheEle',
        value: function cacheEle() {
            this.$nav = $('.main-nav');
            this.$navMenu = this.$nav.find('a');
        }
    }]);

    return Dancer;
})();

$(function () {
    dancer = new Dancer();
});

exports.Dancer = Dancer;