(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Defines a new instance of the rainyday.js.
 * @param options options element with script parameters
 * @param canvas to be used (if not defined a new one will be created)
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var RainyDay = (function () {
    function RainyDay(options, canvas) {
        _classCallCheck(this, RainyDay);

        if (this === window) {
            //if *this* is the window object, start over with a *new* object
            return new RainyDay(options, canvas);
        }

        this.img = options.image;
        var defaults = {
            opacity: 1,
            blur: 10,
            crop: [0, 0, this.img.naturalWidth, this.img.naturalHeight],
            enableSizeChange: true,
            parentElement: document.getElementsByTagName('body')[0],
            fps: 30,
            fillStyle: '#8ED6FF',
            enableCollisions: true,
            gravityThreshold: 3,
            gravityAngle: Math.PI / 2,
            gravityAngleVariance: 0,
            reflectionScaledownFactor: 5,
            reflectionDropMappingWidth: 200,
            reflectionDropMappingHeight: 200,
            width: this.img.clientWidth,
            height: this.img.clientHeight,
            position: 'absolute',
            top: 0,
            left: 0
        };

        // add the defaults to options
        for (var option in defaults) {
            if (typeof options[option] === 'undefined') {
                options[option] = defaults[option];
            }
        }
        //@Cloud debug
        console.log(this.options);
        this.options = options;

        this.drops = [];
        // prepare canvas elements
        this.canvas = canvas || this.prepareCanvas();
        this.prepareBackground();
        this.prepareGlass();

        // assume defaults
        this.reflection = this.REFLECTION_MINIATURE;
        this.trail = this.TRAIL_DROPS;
        this.gravity = this.GRAVITY_NON_LINEAR;
        this.collision = this.COLLISION_SIMPLE;

        // set polyfill of requestAnimationFrame
        this.setRequestAnimFrame();
    }

    /**
     * Defines a new raindrop object.
     * @param rainyday reference to the parent object
     * @param centerX x position of the center of this drop
     * @param centerY y position of the center of this drop
     * @param min minimum size of a drop
     * @param base base value for randomizing drop size
     */

    /**
     * Create the main canvas over a given element
     * @returns HTMLElement the canvas
     */

    _createClass(RainyDay, [{
        key: 'prepareCanvas',
        value: function prepareCanvas() {
            var canvas = document.createElement('canvas');
            canvas.style.position = this.options.position;
            canvas.style.top = this.options.top;
            canvas.style.left = this.options.left;
            canvas.width = this.options.width;
            canvas.height = this.options.height;
            this.options.parentElement.appendChild(canvas);
            if (this.options.enableSizeChange) {
                this.setResizeHandler();
            }
            //@Cloud debug add id
            this.options['id'] ? canvas['id'] = this.options['id'] : '';
            console.log(canvas);
            return canvas;
        }
    }, {
        key: 'setResizeHandler',
        value: function setResizeHandler() {
            // use setInterval if oneresize event already use by other.
            if (window.onresize !== null) {
                window.setInterval(this.checkSize.bind(this), 100);
            } else {
                window.onresize = this.checkSize.bind(this);
                window.onorientationchange = this.checkSize.bind(this);
            }
        }

        /**
         * Periodically check the size of the underlying element
         */
    }, {
        key: 'checkSize',
        value: function checkSize() {
            var clientWidth = this.img.clientWidth;
            var clientHeight = this.img.clientHeight;
            var clientOffsetLeft = this.img.offsetLeft;
            var clientOffsetTop = this.img.offsetTop;
            var canvasWidth = this.canvas.width;
            var canvasHeight = this.canvas.height;
            var canvasOffsetLeft = this.canvas.offsetLeft;
            var canvasOffsetTop = this.canvas.offsetTop;

            if (canvasWidth !== clientWidth || canvasHeight !== clientHeight) {
                this.canvas.width = clientWidth;
                this.canvas.height = clientHeight;
                this.prepareBackground();
                this.glass.width = this.canvas.width;
                this.glass.height = this.canvas.height;
                this.prepareReflections();
            }
            if (canvasOffsetLeft !== clientOffsetLeft || canvasOffsetTop !== clientOffsetTop) {
                this.canvas.offsetLeft = clientOffsetLeft;
                this.canvas.offsetTop = clientOffsetTop;
            }
        }

        /**
         * Start animation loop
         */
    }, {
        key: 'animateDrops',
        value: function animateDrops() {
            if (this.addDropCallback) {
                this.addDropCallback();
            }
            // |this.drops| array may be changed as we iterate over drops
            var dropsClone = this.drops.slice();
            var newDrops = [];
            for (var i = 0; i < dropsClone.length; ++i) {
                if (dropsClone[i].animate()) {
                    newDrops.push(dropsClone[i]);
                }
            }
            this.drops = newDrops;
            window.requestAnimFrame(this.animateDrops.bind(this));
        }

        /**
         * Polyfill for requestAnimationFrame
         */
    }, {
        key: 'setRequestAnimFrame',
        value: function setRequestAnimFrame() {
            var fps = this.options.fps;
            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                    window.setTimeout(callback, 1000 / fps);
                };
            })();
        }

        /**
         * Create the helper canvas for rendering raindrop reflections.
         */
    }, {
        key: 'prepareReflections',
        value: function prepareReflections() {
            this.reflected = document.createElement('canvas');
            this.reflected.width = this.canvas.width / this.options.reflectionScaledownFactor;
            this.reflected.height = this.canvas.height / this.options.reflectionScaledownFactor;
            var ctx = this.reflected.getContext('2d');
            ctx.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.reflected.width, this.reflected.height);
        }

        /**
         * Create the glass canvas.
         */
    }, {
        key: 'prepareGlass',
        value: function prepareGlass() {
            this.glass = document.createElement('canvas');
            this.glass.width = this.canvas.width;
            this.glass.height = this.canvas.height;
            this.context = this.glass.getContext('2d');
        }

        /**
         * Main function for starting rain rendering.
         * @param presets list of presets to be applied
         * @param speed speed of the animation (if not provided or 0 static image will be generated)
         */
    }, {
        key: 'rain',
        value: function rain(presets, speed) {
            // prepare canvas for drop reflections
            if (this.reflection !== this.REFLECTION_NONE) {
                this.prepareReflections();
            }

            this.animateDrops();

            // animation
            this.presets = presets;

            this.PRIVATE_GRAVITY_FORCE_FACTOR_Y = this.options.fps * 0.001 / 25;
            this.PRIVATE_GRAVITY_FORCE_FACTOR_X = (Math.PI / 2 - this.options.gravityAngle) * (this.options.fps * 0.001) / 50;

            // prepare gravity matrix
            if (this.options.enableCollisions) {

                // calculate max radius of a drop to establish gravity matrix resolution
                var maxDropRadius = 0;
                for (var i = 0; i < presets.length; i++) {
                    if (presets[i][0] + presets[i][1] > maxDropRadius) {
                        maxDropRadius = Math.floor(presets[i][0] + presets[i][1]);
                    }
                }

                if (maxDropRadius > 0) {
                    // initialize the gravity matrix
                    var mwi = Math.ceil(this.canvas.width / maxDropRadius);
                    var mhi = Math.ceil(this.canvas.height / maxDropRadius);
                    this.matrix = new CollisionMatrix(mwi, mhi, maxDropRadius);
                } else {
                    this.options.enableCollisions = false;
                }
            }

            for (var i = 0; i < presets.length; i++) {
                if (!presets[i][3]) {
                    presets[i][3] = -1;
                }
            }

            var lastExecutionTime = 0;
            this.addDropCallback = (function () {
                var timestamp = new Date().getTime();
                if (timestamp - lastExecutionTime < speed) {
                    return;
                }
                lastExecutionTime = timestamp;
                var context = this.canvas.getContext('2d');
                context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
                // select matching preset
                var preset;
                for (var i = 0; i < presets.length; i++) {
                    if (presets[i][2] > 1 || presets[i][3] === -1) {
                        if (presets[i][3] !== 0) {
                            presets[i][3]--;
                            for (var y = 0; y < presets[i][2]; ++y) {
                                this.putDrop(new Drop(this, Math.random() * this.canvas.width, Math.random() * this.canvas.height, presets[i][0], presets[i][1]));
                            }
                        }
                    } else if (Math.random() < presets[i][2]) {
                        preset = presets[i];
                        break;
                    }
                }
                if (preset) {
                    this.putDrop(new Drop(this, Math.random() * this.canvas.width, Math.random() * this.canvas.height, preset[0], preset[1]));
                }
                context.save();
                context.globalAlpha = this.options.opacity;
                context.drawImage(this.glass, 0, 0, this.canvas.width, this.canvas.height);
                context.restore();
            }).bind(this);
        }

        /**
         * Adds a new raindrop to the animation.
         * @param drop drop object to be added to the animation
         */
    }, {
        key: 'putDrop',
        value: function putDrop(drop) {
            drop.draw();
            if (this.gravity && drop.r > this.options.gravityThreshold) {
                if (this.options.enableCollisions) {
                    this.matrix.update(drop);
                }
                this.drops.push(drop);
            }
        }

        /**
         * Clear the drop and remove from the list if applicable.
         * @drop to be cleared
         * @force force removal from the list
         * result if true animation of this drop should be stopped
         */
    }, {
        key: 'clearDrop',
        value: function clearDrop(drop, force) {
            var result = drop.clear(force);
            if (result) {
                var index = this.drops.indexOf(drop);
                if (index >= 0) {
                    this.drops.splice(index, 1);
                }
            }
            return result;
        }

        /**
         * TRAIL function: no trail at all
         */
    }, {
        key: 'TRAIL_NONE',
        value: function TRAIL_NONE() {}
        // nothing going on here

        /**
         * TRAIL function: trail of small drops (default)
         * @param drop raindrop object
         */

    }, {
        key: 'TRAIL_DROPS',
        value: function TRAIL_DROPS(drop) {
            if (!drop.trailY || drop.y - drop.trailY >= Math.random() * 100 * drop.r) {
                drop.trailY = drop.y;
                this.putDrop(new Drop(this, drop.x + (Math.random() * 2 - 1) * Math.random(), drop.y - drop.r - 5, Math.ceil(drop.r / 5), 0));
            }
        }

        /**
         * TRAIL function: trail of unblurred image
         * @param drop raindrop object
         */
    }, {
        key: 'TRAIL_SMUDGE',
        value: function TRAIL_SMUDGE(drop) {
            var y = drop.y - drop.r - 3;
            var x = drop.x - drop.r / 2 + Math.random() * 2;
            if (y < 0 || x < 0) {
                return;
            }
            this.context.drawImage(this.clearbackground, x, y, drop.r, 2, x, y, drop.r, 2);
        }

        /**
         * GRAVITY function: no gravity at all
         * @returns Boolean true if the animation is stopped
         */
    }, {
        key: 'GRAVITY_NONE',
        value: function GRAVITY_NONE() {
            return true;
        }

        /**
         * GRAVITY function: linear gravity
         * @param drop raindrop object
         * @returns Boolean true if the animation is stopped
         */
    }, {
        key: 'GRAVITY_LINEAR',
        value: function GRAVITY_LINEAR(drop) {
            if (this.clearDrop(drop)) {
                return true;
            }

            if (drop.yspeed) {
                drop.yspeed += this.PRIVATE_GRAVITY_FORCE_FACTOR_Y * Math.floor(drop.r);
                drop.xspeed += this.PRIVATE_GRAVITY_FORCE_FACTOR_X * Math.floor(drop.r);
            } else {
                drop.yspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_Y;
                drop.xspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_X;
            }

            drop.y += drop.yspeed;
            drop.draw();
            return false;
        }

        /**
         * GRAVITY function: non-linear gravity (default)
         * @param drop raindrop object
         * @returns Boolean true if the animation is stopped
         */
    }, {
        key: 'GRAVITY_NON_LINEAR',
        value: function GRAVITY_NON_LINEAR(drop) {
            if (this.clearDrop(drop)) {
                return true;
            }

            if (drop.collided) {
                drop.collided = false;
                drop.seed = Math.floor(drop.r * Math.random() * this.options.fps);
                drop.skipping = false;
                drop.slowing = false;
            } else if (!drop.seed || drop.seed < 0) {
                drop.seed = Math.floor(drop.r * Math.random() * this.options.fps);
                drop.skipping = drop.skipping === false ? true : false;
                drop.slowing = true;
            }

            drop.seed--;

            if (drop.yspeed) {
                if (drop.slowing) {
                    drop.yspeed /= 1.1;
                    drop.xspeed /= 1.1;
                    if (drop.yspeed < this.PRIVATE_GRAVITY_FORCE_FACTOR_Y) {
                        drop.slowing = false;
                    }
                } else if (drop.skipping) {
                    drop.yspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_Y;
                    drop.xspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_X;
                } else {
                    drop.yspeed += 1 * this.PRIVATE_GRAVITY_FORCE_FACTOR_Y * Math.floor(drop.r);
                    drop.xspeed += 1 * this.PRIVATE_GRAVITY_FORCE_FACTOR_X * Math.floor(drop.r);
                }
            } else {
                drop.yspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_Y;
                drop.xspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_X;
            }

            if (this.options.gravityAngleVariance !== 0) {
                drop.xspeed += (Math.random() * 2 - 1) * drop.yspeed * this.options.gravityAngleVariance;
            }

            drop.y += drop.yspeed;
            drop.x += drop.xspeed;

            drop.draw();
            return false;
        }

        /**
         * Utility function to return positive min value
         * @param val1 first number
         * @param val2 second number
         */
    }, {
        key: 'positiveMin',
        value: function positiveMin(val1, val2) {
            var result = 0;
            if (val1 < val2) {
                if (val1 <= 0) {
                    result = val2;
                } else {
                    result = val1;
                }
            } else {
                if (val2 <= 0) {
                    result = val1;
                } else {
                    result = val2;
                }
            }
            return result <= 0 ? 1 : result;
        }

        /**
         * REFLECTION function: no reflection at all
         */
    }, {
        key: 'REFLECTION_NONE',
        value: function REFLECTION_NONE() {
            this.context.fillStyle = this.options.fillStyle;
            this.context.fill();
        }

        /**
         * REFLECTION function: miniature reflection (default)
         * @param drop raindrop object
         */
    }, {
        key: 'REFLECTION_MINIATURE',
        value: function REFLECTION_MINIATURE(drop) {
            var sx = Math.max((drop.x - this.options.reflectionDropMappingWidth) / this.options.reflectionScaledownFactor, 0);
            var sy = Math.max((drop.y - this.options.reflectionDropMappingHeight) / this.options.reflectionScaledownFactor, 0);
            var sw = this.positiveMin(this.options.reflectionDropMappingWidth * 2 / this.options.reflectionScaledownFactor, this.reflected.width - sx);
            var sh = this.positiveMin(this.options.reflectionDropMappingHeight * 2 / this.options.reflectionScaledownFactor, this.reflected.height - sy);
            var dx = Math.max(drop.x - 1.1 * drop.r, 0);
            var dy = Math.max(drop.y - 1.1 * drop.r, 0);
            this.context.drawImage(this.reflected, sx, sy, sw, sh, dx, dy, drop.r * 2, drop.r * 2);
        }

        /**
         * COLLISION function: default collision implementation
         * @param drop one of the drops colliding
         * @param collisions list of potential collisions
         */
    }, {
        key: 'COLLISION_SIMPLE',
        value: function COLLISION_SIMPLE(drop, collisions) {
            var item = collisions;
            var drop2;
            while (item != null) {
                var p = item.drop;
                if (Math.sqrt(Math.pow(drop.x - p.x, 2) + Math.pow(drop.y - p.y, 2)) < drop.r + p.r) {
                    drop2 = p;
                    break;
                }
                item = item.next;
            }

            if (!drop2) {
                return;
            }

            // rename so that we're dealing with low/high drops
            var higher, lower;
            if (drop.y > drop2.y) {
                higher = drop;
                lower = drop2;
            } else {
                higher = drop2;
                lower = drop;
            }

            this.clearDrop(lower);
            // force stopping the second drop
            this.clearDrop(higher, true);
            this.matrix.remove(higher);
            lower.draw();

            lower.colliding = higher;
            lower.collided = true;
        }

        /**
         * Resizes canvas, draws original image and applies blurring algorithm.
         */
    }, {
        key: 'prepareBackground',
        value: function prepareBackground() {
            this.background = document.createElement('canvas');
            this.background.width = this.canvas.width;
            this.background.height = this.canvas.height;

            this.clearbackground = document.createElement('canvas');
            this.clearbackground.width = this.canvas.width;
            this.clearbackground.height = this.canvas.height;

            var context = this.background.getContext('2d');
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            context.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.canvas.width, this.canvas.height);

            context = this.clearbackground.getContext('2d');
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            context.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.canvas.width, this.canvas.height);

            if (!isNaN(this.options.blur) && this.options.blur >= 1) {
                this.stackBlurCanvasRGB(this.canvas.width, this.canvas.height, this.options.blur);
            }
        }

        /**
         * Implements the Stack Blur Algorithm (@see http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html).
         * @param width width of the canvas
         * @param height height of the canvas
         * @param radius blur radius
         */
    }, {
        key: 'stackBlurCanvasRGB',
        value: function stackBlurCanvasRGB(width, height, radius) {

            var shgTable = [[0, 9], [1, 11], [2, 12], [3, 13], [5, 14], [7, 15], [11, 16], [15, 17], [22, 18], [31, 19], [45, 20], [63, 21], [90, 22], [127, 23], [181, 24]];

            var mulTable = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];

            radius |= 0;

            var context = this.background.getContext('2d');
            var imageData = context.getImageData(0, 0, width, height);
            var pixels = imageData.data;
            var x, y, i, p, yp, yi, yw, rSum, gSum, bSum, rOutSum, gOutSum, bOutSum, rInSum, gInSum, bInSum, pr, pg, pb, rbs;
            var radiusPlus1 = radius + 1;
            var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

            var stackStart = new BlurStack();
            var stackEnd = new BlurStack();
            var stack = stackStart;
            for (i = 1; i < 2 * radius + 1; i++) {
                stack = stack.next = new BlurStack();
                if (i === radiusPlus1) {
                    stackEnd = stack;
                }
            }
            stack.next = stackStart;
            var stackIn = null;
            var stackOut = null;

            yw = yi = 0;

            var mulSum = mulTable[radius];
            var shgSum;
            for (var ssi = 0; ssi < shgTable.length; ++ssi) {
                if (radius <= shgTable[ssi][0]) {
                    shgSum = shgTable[ssi - 1][1];
                    break;
                }
            }

            for (y = 0; y < height; y++) {
                rInSum = gInSum = bInSum = rSum = gSum = bSum = 0;

                rOutSum = radiusPlus1 * (pr = pixels[yi]);
                gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
                bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

                rSum += sumFactor * pr;
                gSum += sumFactor * pg;
                bSum += sumFactor * pb;

                stack = stackStart;

                for (i = 0; i < radiusPlus1; i++) {
                    stack.r = pr;
                    stack.g = pg;
                    stack.b = pb;
                    stack = stack.next;
                }

                for (i = 1; i < radiusPlus1; i++) {
                    p = yi + ((width - 1 < i ? width - 1 : i) << 2);
                    rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
                    gSum += (stack.g = pg = pixels[p + 1]) * rbs;
                    bSum += (stack.b = pb = pixels[p + 2]) * rbs;

                    rInSum += pr;
                    gInSum += pg;
                    bInSum += pb;

                    stack = stack.next;
                }

                stackIn = stackStart;
                stackOut = stackEnd;
                for (x = 0; x < width; x++) {
                    pixels[yi] = rSum * mulSum >> shgSum;
                    pixels[yi + 1] = gSum * mulSum >> shgSum;
                    pixels[yi + 2] = bSum * mulSum >> shgSum;

                    rSum -= rOutSum;
                    gSum -= gOutSum;
                    bSum -= bOutSum;

                    rOutSum -= stackIn.r;
                    gOutSum -= stackIn.g;
                    bOutSum -= stackIn.b;

                    p = yw + ((p = x + radius + 1) < width - 1 ? p : width - 1) << 2;

                    rInSum += stackIn.r = pixels[p];
                    gInSum += stackIn.g = pixels[p + 1];
                    bInSum += stackIn.b = pixels[p + 2];

                    rSum += rInSum;
                    gSum += gInSum;
                    bSum += bInSum;

                    stackIn = stackIn.next;

                    rOutSum += pr = stackOut.r;
                    gOutSum += pg = stackOut.g;
                    bOutSum += pb = stackOut.b;

                    rInSum -= pr;
                    gInSum -= pg;
                    bInSum -= pb;

                    stackOut = stackOut.next;

                    yi += 4;
                }
                yw += width;
            }

            for (x = 0; x < width; x++) {
                gInSum = bInSum = rInSum = gSum = bSum = rSum = 0;

                yi = x << 2;
                rOutSum = radiusPlus1 * (pr = pixels[yi]);
                gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
                bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

                rSum += sumFactor * pr;
                gSum += sumFactor * pg;
                bSum += sumFactor * pb;

                stack = stackStart;

                for (i = 0; i < radiusPlus1; i++) {
                    stack.r = pr;
                    stack.g = pg;
                    stack.b = pb;
                    stack = stack.next;
                }

                yp = width;

                for (i = 1; i < radiusPlus1; i++) {
                    yi = yp + x << 2;

                    rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
                    gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
                    bSum += (stack.b = pb = pixels[yi + 2]) * rbs;

                    rInSum += pr;
                    gInSum += pg;
                    bInSum += pb;

                    stack = stack.next;

                    if (i < height - 1) {
                        yp += width;
                    }
                }

                yi = x;
                stackIn = stackStart;
                stackOut = stackEnd;
                for (y = 0; y < height; y++) {
                    p = yi << 2;
                    pixels[p] = rSum * mulSum >> shgSum;
                    pixels[p + 1] = gSum * mulSum >> shgSum;
                    pixels[p + 2] = bSum * mulSum >> shgSum;

                    rSum -= rOutSum;
                    gSum -= gOutSum;
                    bSum -= bOutSum;

                    rOutSum -= stackIn.r;
                    gOutSum -= stackIn.g;
                    bOutSum -= stackIn.b;

                    p = x + ((p = y + radiusPlus1) < height - 1 ? p : height - 1) * width << 2;

                    rSum += rInSum += stackIn.r = pixels[p];
                    gSum += gInSum += stackIn.g = pixels[p + 1];
                    bSum += bInSum += stackIn.b = pixels[p + 2];

                    stackIn = stackIn.next;

                    rOutSum += pr = stackOut.r;
                    gOutSum += pg = stackOut.g;
                    bOutSum += pb = stackOut.b;

                    rInSum -= pr;
                    gInSum -= pg;
                    bInSum -= pb;

                    stackOut = stackOut.next;

                    yi += width;
                }
            }

            context.putImageData(imageData, 0, 0);
        }
    }]);

    return RainyDay;
})();

var Drop = (function () {
    function Drop(rainyday, centerX, centerY, min, base) {
        _classCallCheck(this, Drop);

        this.x = Math.floor(centerX);
        this.y = Math.floor(centerY);
        this.r = Math.random() * base + min;
        this.rainyday = rainyday;
        this.context = rainyday.context;
        this.reflection = rainyday.reflected;
    }

    /**
     * Defines a new helper object for Stack Blur Algorithm.
     */

    /**
     * Draws a raindrop on canvas at the current position.
     */

    _createClass(Drop, [{
        key: 'draw',
        value: function draw() {
            this.context.save();
            this.context.beginPath();

            var orgR = this.r;
            this.r = 0.95 * this.r;
            if (this.r < 3) {
                this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
                this.context.closePath();
            } else if (this.colliding || this.yspeed > 2) {
                if (this.colliding) {
                    var collider = this.colliding;
                    this.r = 1.001 * (this.r > collider.r ? this.r : collider.r);
                    this.x += collider.x - this.x;
                    this.colliding = null;
                }

                var yr = 1 + 0.1 * this.yspeed;
                this.context.moveTo(this.x - this.r / yr, this.y);
                this.context.bezierCurveTo(this.x - this.r, this.y - this.r * 2, this.x + this.r, this.y - this.r * 2, this.x + this.r / yr, this.y);
                this.context.bezierCurveTo(this.x + this.r, this.y + yr * this.r, this.x - this.r, this.y + yr * this.r, this.x - this.r / yr, this.y);
            } else {
                this.context.arc(this.x, this.y, this.r * 0.9, 0, Math.PI * 2, true);
                this.context.closePath();
            }

            this.context.clip();

            this.r = orgR;

            if (this.rainyday.reflection) {
                this.rainyday.reflection(this);
            }

            this.context.restore();
        }

        /**
         * Clears the raindrop region.
         * @param force force stop
         * @returns Boolean true if the animation is stopped
         */
    }, {
        key: 'clear',
        value: function clear(force) {
            this.context.clearRect(this.x - this.r - 1, this.y - this.r - 2, 2 * this.r + 2, 2 * this.r + 2);
            if (force) {
                this.terminate = true;
                return true;
            }
            if (this.y - this.r > this.rainyday.canvas.height || this.x - this.r > this.rainyday.canvas.width || this.x + this.r < 0) {
                // over edge so stop this drop
                return true;
            }
            return false;
        }

        /**
         * Moves the raindrop to a new position according to the gravity.
         */
    }, {
        key: 'animate',
        value: function animate() {
            if (this.terminate) {
                return false;
            }
            var stopped = this.rainyday.gravity(this);
            if (!stopped && this.rainyday.trail) {
                this.rainyday.trail(this);
            }
            if (this.rainyday.options.enableCollisions) {
                var collisions = this.rainyday.matrix.update(this, stopped);
                if (collisions) {
                    this.rainyday.collision(this, collisions);
                }
            }
            return !stopped || this.terminate;
        }
    }]);

    return Drop;
})();

var BlurStack = function BlurStack() {
    _classCallCheck(this, BlurStack);

    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.next = null;
}
/**
 * Defines a gravity matrix object which handles collision detection.
 * @param x number of columns in the matrix
 * @param y number of rows in the matrix
 * @param r grid size
 */
;

var CollisionMatrix = (function () {
    function CollisionMatrix(x, y, r) {
        _classCallCheck(this, CollisionMatrix);

        this.resolution = r;
        this.xc = x;
        this.yc = y;
        this.matrix = new Array(x);
        for (var i = 0; i <= x + 5; i++) {
            this.matrix[i] = new Array(y);
            for (var j = 0; j <= y + 5; ++j) {
                this.matrix[i][j] = new DropItem(null);
            }
        }
    }

    /**
     * Defines a linked list item.
     */

    /**
     * Updates position of the given drop on the collision matrix.
     * @param drop raindrop to be positioned/repositioned
     * @param forceDelete if true the raindrop will be removed from the matrix
     * @returns collisions if any
     */

    _createClass(CollisionMatrix, [{
        key: 'update',
        value: function update(drop, forceDelete) {
            if (drop.gid) {
                if (!this.matrix[drop.gmx] || !this.matrix[drop.gmx][drop.gmy]) {
                    return null;
                }
                this.matrix[drop.gmx][drop.gmy].remove(drop);
                if (forceDelete) {
                    return null;
                }

                drop.gmx = Math.floor(drop.x / this.resolution);
                drop.gmy = Math.floor(drop.y / this.resolution);
                if (!this.matrix[drop.gmx] || !this.matrix[drop.gmx][drop.gmy]) {
                    return null;
                }
                this.matrix[drop.gmx][drop.gmy].add(drop);

                var collisions = this.collisions(drop);
                if (collisions && collisions.next != null) {
                    return collisions.next;
                }
            } else {
                drop.gid = Math.random().toString(36).substr(2, 9);
                drop.gmx = Math.floor(drop.x / this.resolution);
                drop.gmy = Math.floor(drop.y / this.resolution);
                if (!this.matrix[drop.gmx] || !this.matrix[drop.gmx][drop.gmy]) {
                    return null;
                }

                this.matrix[drop.gmx][drop.gmy].add(drop);
            }
            return null;
        }

        /**
         * Looks for collisions with the given raindrop.
         * @param drop raindrop to be checked
         * @returns DropItem list of drops that collide with it
         */
    }, {
        key: 'collisions',
        value: function collisions(drop) {
            var item = new DropItem(null);
            var first = item;

            item = this.addAll(item, drop.gmx - 1, drop.gmy + 1);
            item = this.addAll(item, drop.gmx, drop.gmy + 1);
            item = this.addAll(item, drop.gmx + 1, drop.gmy + 1);

            return first;
        }

        /**
         * Appends all found drop at a given location to the given item.
         * @param to item to which the results will be appended to
         * @param x x position in the matrix
         * @param y y position in the matrix
         * @returns last discovered item on the list
         */
    }, {
        key: 'addAll',
        value: function addAll(to, x, y) {
            if (x > 0 && y > 0 && x < this.xc && y < this.yc) {
                var items = this.matrix[x][y];
                while (items.next != null) {
                    items = items.next;
                    to.next = new DropItem(items.drop);
                    to = to.next;
                }
            }
            return to;
        }

        /**
         * Removed the drop from its current position
         * @param drop to be removed
         */
    }, {
        key: 'remove',
        value: function remove(drop) {
            this.matrix[drop.gmx][drop.gmy].remove(drop);
        }
    }]);

    return CollisionMatrix;
})();

var DropItem = (function () {
    function DropItem(drop) {
        _classCallCheck(this, DropItem);

        this.drop = drop;
        this.next = null;
    }

    /**
     * Adds the raindrop to the end of the list.
     * @param drop raindrop to be added
     */

    _createClass(DropItem, [{
        key: 'add',
        value: function add(drop) {
            var item = this;
            while (item.next != null) {
                item = item.next;
            }
            item.next = new DropItem(drop);
        }

        /**
         * Removes the raindrop from the list.
         * @param drop raindrop to be removed
         */
    }, {
        key: 'remove',
        value: function remove(drop) {
            var item = this;
            var prevItem = null;
            while (item.next != null) {
                prevItem = item;
                item = item.next;
                if (item.drop.gid === drop.gid) {
                    prevItem.next = item.next;
                }
            }
        }
    }]);

    return DropItem;
})();

exports.RainyDay = RainyDay;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvLnRtcC9jb21tb24vcmFpbnlkYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIERlZmluZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHJhaW55ZGF5LmpzLlxuICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBlbGVtZW50IHdpdGggc2NyaXB0IHBhcmFtZXRlcnNcbiAqIEBwYXJhbSBjYW52YXMgdG8gYmUgdXNlZCAoaWYgbm90IGRlZmluZWQgYSBuZXcgb25lIHdpbGwgYmUgY3JlYXRlZClcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG52YXIgUmFpbnlEYXkgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJhaW55RGF5KG9wdGlvbnMsIGNhbnZhcykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUmFpbnlEYXkpO1xuXG4gICAgICAgIGlmICh0aGlzID09PSB3aW5kb3cpIHtcbiAgICAgICAgICAgIC8vaWYgKnRoaXMqIGlzIHRoZSB3aW5kb3cgb2JqZWN0LCBzdGFydCBvdmVyIHdpdGggYSAqbmV3KiBvYmplY3RcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmFpbnlEYXkob3B0aW9ucywgY2FudmFzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW1nID0gb3B0aW9ucy5pbWFnZTtcbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIGJsdXI6IDEwLFxuICAgICAgICAgICAgY3JvcDogWzAsIDAsIHRoaXMuaW1nLm5hdHVyYWxXaWR0aCwgdGhpcy5pbWcubmF0dXJhbEhlaWdodF0sXG4gICAgICAgICAgICBlbmFibGVTaXplQ2hhbmdlOiB0cnVlLFxuICAgICAgICAgICAgcGFyZW50RWxlbWVudDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXSxcbiAgICAgICAgICAgIGZwczogMzAsXG4gICAgICAgICAgICBmaWxsU3R5bGU6ICcjOEVENkZGJyxcbiAgICAgICAgICAgIGVuYWJsZUNvbGxpc2lvbnM6IHRydWUsXG4gICAgICAgICAgICBncmF2aXR5VGhyZXNob2xkOiAzLFxuICAgICAgICAgICAgZ3Jhdml0eUFuZ2xlOiBNYXRoLlBJIC8gMixcbiAgICAgICAgICAgIGdyYXZpdHlBbmdsZVZhcmlhbmNlOiAwLFxuICAgICAgICAgICAgcmVmbGVjdGlvblNjYWxlZG93bkZhY3RvcjogNSxcbiAgICAgICAgICAgIHJlZmxlY3Rpb25Ecm9wTWFwcGluZ1dpZHRoOiAyMDAsXG4gICAgICAgICAgICByZWZsZWN0aW9uRHJvcE1hcHBpbmdIZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmltZy5jbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5pbWcuY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gYWRkIHRoZSBkZWZhdWx0cyB0byBvcHRpb25zXG4gICAgICAgIGZvciAodmFyIG9wdGlvbiBpbiBkZWZhdWx0cykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW29wdGlvbl0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc1tvcHRpb25dID0gZGVmYXVsdHNbb3B0aW9uXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL0BDbG91ZCBkZWJ1Z1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgICAgIHRoaXMuZHJvcHMgPSBbXTtcbiAgICAgICAgLy8gcHJlcGFyZSBjYW52YXMgZWxlbWVudHNcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXMgfHwgdGhpcy5wcmVwYXJlQ2FudmFzKCk7XG4gICAgICAgIHRoaXMucHJlcGFyZUJhY2tncm91bmQoKTtcbiAgICAgICAgdGhpcy5wcmVwYXJlR2xhc3MoKTtcblxuICAgICAgICAvLyBhc3N1bWUgZGVmYXVsdHNcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gdGhpcy5SRUZMRUNUSU9OX01JTklBVFVSRTtcbiAgICAgICAgdGhpcy50cmFpbCA9IHRoaXMuVFJBSUxfRFJPUFM7XG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRoaXMuR1JBVklUWV9OT05fTElORUFSO1xuICAgICAgICB0aGlzLmNvbGxpc2lvbiA9IHRoaXMuQ09MTElTSU9OX1NJTVBMRTtcblxuICAgICAgICAvLyBzZXQgcG9seWZpbGwgb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgIHRoaXMuc2V0UmVxdWVzdEFuaW1GcmFtZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSBuZXcgcmFpbmRyb3Agb2JqZWN0LlxuICAgICAqIEBwYXJhbSByYWlueWRheSByZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBvYmplY3RcbiAgICAgKiBAcGFyYW0gY2VudGVyWCB4IHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhpcyBkcm9wXG4gICAgICogQHBhcmFtIGNlbnRlclkgeSBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoaXMgZHJvcFxuICAgICAqIEBwYXJhbSBtaW4gbWluaW11bSBzaXplIG9mIGEgZHJvcFxuICAgICAqIEBwYXJhbSBiYXNlIGJhc2UgdmFsdWUgZm9yIHJhbmRvbWl6aW5nIGRyb3Agc2l6ZVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHRoZSBtYWluIGNhbnZhcyBvdmVyIGEgZ2l2ZW4gZWxlbWVudFxuICAgICAqIEByZXR1cm5zIEhUTUxFbGVtZW50IHRoZSBjYW52YXNcbiAgICAgKi9cblxuICAgIF9jcmVhdGVDbGFzcyhSYWlueURheSwgW3tcbiAgICAgICAga2V5OiAncHJlcGFyZUNhbnZhcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBwcmVwYXJlQ2FudmFzKCkge1xuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gdGhpcy5vcHRpb25zLnBvc2l0aW9uO1xuICAgICAgICAgICAgY2FudmFzLnN0eWxlLnRvcCA9IHRoaXMub3B0aW9ucy50b3A7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUubGVmdCA9IHRoaXMub3B0aW9ucy5sZWZ0O1xuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdGhpcy5vcHRpb25zLndpZHRoO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMub3B0aW9ucy5oZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbmFibGVTaXplQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSZXNpemVIYW5kbGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL0BDbG91ZCBkZWJ1ZyBhZGQgaWRcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc1snaWQnXSA/IGNhbnZhc1snaWQnXSA9IHRoaXMub3B0aW9uc1snaWQnXSA6ICcnO1xuICAgICAgICAgICAgY29uc29sZS5sb2coY2FudmFzKTtcbiAgICAgICAgICAgIHJldHVybiBjYW52YXM7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3NldFJlc2l6ZUhhbmRsZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0UmVzaXplSGFuZGxlcigpIHtcbiAgICAgICAgICAgIC8vIHVzZSBzZXRJbnRlcnZhbCBpZiBvbmVyZXNpemUgZXZlbnQgYWxyZWFkeSB1c2UgYnkgb3RoZXIuXG4gICAgICAgICAgICBpZiAod2luZG93Lm9ucmVzaXplICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldEludGVydmFsKHRoaXMuY2hlY2tTaXplLmJpbmQodGhpcyksIDEwMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5vbnJlc2l6ZSA9IHRoaXMuY2hlY2tTaXplLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgd2luZG93Lm9ub3JpZW50YXRpb25jaGFuZ2UgPSB0aGlzLmNoZWNrU2l6ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBlcmlvZGljYWxseSBjaGVjayB0aGUgc2l6ZSBvZiB0aGUgdW5kZXJseWluZyBlbGVtZW50XG4gICAgICAgICAqL1xuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY2hlY2tTaXplJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoZWNrU2l6ZSgpIHtcbiAgICAgICAgICAgIHZhciBjbGllbnRXaWR0aCA9IHRoaXMuaW1nLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgdmFyIGNsaWVudEhlaWdodCA9IHRoaXMuaW1nLmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIHZhciBjbGllbnRPZmZzZXRMZWZ0ID0gdGhpcy5pbWcub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIHZhciBjbGllbnRPZmZzZXRUb3AgPSB0aGlzLmltZy5vZmZzZXRUb3A7XG4gICAgICAgICAgICB2YXIgY2FudmFzV2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIHZhciBjYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgY2FudmFzT2Zmc2V0TGVmdCA9IHRoaXMuY2FudmFzLm9mZnNldExlZnQ7XG4gICAgICAgICAgICB2YXIgY2FudmFzT2Zmc2V0VG9wID0gdGhpcy5jYW52YXMub2Zmc2V0VG9wO1xuXG4gICAgICAgICAgICBpZiAoY2FudmFzV2lkdGggIT09IGNsaWVudFdpZHRoIHx8IGNhbnZhc0hlaWdodCAhPT0gY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSBjbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBjbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQmFja2dyb3VuZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2xhc3Mud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLmdsYXNzLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVSZWZsZWN0aW9ucygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbnZhc09mZnNldExlZnQgIT09IGNsaWVudE9mZnNldExlZnQgfHwgY2FudmFzT2Zmc2V0VG9wICE9PSBjbGllbnRPZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5vZmZzZXRMZWZ0ID0gY2xpZW50T2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5vZmZzZXRUb3AgPSBjbGllbnRPZmZzZXRUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RhcnQgYW5pbWF0aW9uIGxvb3BcbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdhbmltYXRlRHJvcHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYW5pbWF0ZURyb3BzKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWRkRHJvcENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGREcm9wQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHx0aGlzLmRyb3BzfCBhcnJheSBtYXkgYmUgY2hhbmdlZCBhcyB3ZSBpdGVyYXRlIG92ZXIgZHJvcHNcbiAgICAgICAgICAgIHZhciBkcm9wc0Nsb25lID0gdGhpcy5kcm9wcy5zbGljZSgpO1xuICAgICAgICAgICAgdmFyIG5ld0Ryb3BzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRyb3BzQ2xvbmUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoZHJvcHNDbG9uZVtpXS5hbmltYXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RHJvcHMucHVzaChkcm9wc0Nsb25lW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRyb3BzID0gbmV3RHJvcHM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZSh0aGlzLmFuaW1hdGVEcm9wcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQb2x5ZmlsbCBmb3IgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgICAqL1xuICAgIH0sIHtcbiAgICAgICAga2V5OiAnc2V0UmVxdWVzdEFuaW1GcmFtZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRSZXF1ZXN0QW5pbUZyYW1lKCkge1xuICAgICAgICAgICAgdmFyIGZwcyA9IHRoaXMub3B0aW9ucy5mcHM7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIGZwcyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIHRoZSBoZWxwZXIgY2FudmFzIGZvciByZW5kZXJpbmcgcmFpbmRyb3AgcmVmbGVjdGlvbnMuXG4gICAgICAgICAqL1xuICAgIH0sIHtcbiAgICAgICAga2V5OiAncHJlcGFyZVJlZmxlY3Rpb25zJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHByZXBhcmVSZWZsZWN0aW9ucygpIHtcbiAgICAgICAgICAgIHRoaXMucmVmbGVjdGVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICB0aGlzLnJlZmxlY3RlZC53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoIC8gdGhpcy5vcHRpb25zLnJlZmxlY3Rpb25TY2FsZWRvd25GYWN0b3I7XG4gICAgICAgICAgICB0aGlzLnJlZmxlY3RlZC5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyB0aGlzLm9wdGlvbnMucmVmbGVjdGlvblNjYWxlZG93bkZhY3RvcjtcbiAgICAgICAgICAgIHZhciBjdHggPSB0aGlzLnJlZmxlY3RlZC5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgdGhpcy5vcHRpb25zLmNyb3BbMF0sIHRoaXMub3B0aW9ucy5jcm9wWzFdLCB0aGlzLm9wdGlvbnMuY3JvcFsyXSwgdGhpcy5vcHRpb25zLmNyb3BbM10sIDAsIDAsIHRoaXMucmVmbGVjdGVkLndpZHRoLCB0aGlzLnJlZmxlY3RlZC5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSB0aGUgZ2xhc3MgY2FudmFzLlxuICAgICAgICAgKi9cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3ByZXBhcmVHbGFzcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBwcmVwYXJlR2xhc3MoKSB7XG4gICAgICAgICAgICB0aGlzLmdsYXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICB0aGlzLmdsYXNzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB0aGlzLmdsYXNzLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZ2xhc3MuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYWluIGZ1bmN0aW9uIGZvciBzdGFydGluZyByYWluIHJlbmRlcmluZy5cbiAgICAgICAgICogQHBhcmFtIHByZXNldHMgbGlzdCBvZiBwcmVzZXRzIHRvIGJlIGFwcGxpZWRcbiAgICAgICAgICogQHBhcmFtIHNwZWVkIHNwZWVkIG9mIHRoZSBhbmltYXRpb24gKGlmIG5vdCBwcm92aWRlZCBvciAwIHN0YXRpYyBpbWFnZSB3aWxsIGJlIGdlbmVyYXRlZClcbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyYWluJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJhaW4ocHJlc2V0cywgc3BlZWQpIHtcbiAgICAgICAgICAgIC8vIHByZXBhcmUgY2FudmFzIGZvciBkcm9wIHJlZmxlY3Rpb25zXG4gICAgICAgICAgICBpZiAodGhpcy5yZWZsZWN0aW9uICE9PSB0aGlzLlJFRkxFQ1RJT05fTk9ORSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJlcGFyZVJlZmxlY3Rpb25zKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYW5pbWF0ZURyb3BzKCk7XG5cbiAgICAgICAgICAgIC8vIGFuaW1hdGlvblxuICAgICAgICAgICAgdGhpcy5wcmVzZXRzID0gcHJlc2V0cztcblxuICAgICAgICAgICAgdGhpcy5QUklWQVRFX0dSQVZJVFlfRk9SQ0VfRkFDVE9SX1kgPSB0aGlzLm9wdGlvbnMuZnBzICogMC4wMDEgLyAyNTtcbiAgICAgICAgICAgIHRoaXMuUFJJVkFURV9HUkFWSVRZX0ZPUkNFX0ZBQ1RPUl9YID0gKE1hdGguUEkgLyAyIC0gdGhpcy5vcHRpb25zLmdyYXZpdHlBbmdsZSkgKiAodGhpcy5vcHRpb25zLmZwcyAqIDAuMDAxKSAvIDUwO1xuXG4gICAgICAgICAgICAvLyBwcmVwYXJlIGdyYXZpdHkgbWF0cml4XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVuYWJsZUNvbGxpc2lvbnMpIHtcblxuICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBtYXggcmFkaXVzIG9mIGEgZHJvcCB0byBlc3RhYmxpc2ggZ3Jhdml0eSBtYXRyaXggcmVzb2x1dGlvblxuICAgICAgICAgICAgICAgIHZhciBtYXhEcm9wUmFkaXVzID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXNldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXNldHNbaV1bMF0gKyBwcmVzZXRzW2ldWzFdID4gbWF4RHJvcFJhZGl1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4RHJvcFJhZGl1cyA9IE1hdGguZmxvb3IocHJlc2V0c1tpXVswXSArIHByZXNldHNbaV1bMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1heERyb3BSYWRpdXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemUgdGhlIGdyYXZpdHkgbWF0cml4XG4gICAgICAgICAgICAgICAgICAgIHZhciBtd2kgPSBNYXRoLmNlaWwodGhpcy5jYW52YXMud2lkdGggLyBtYXhEcm9wUmFkaXVzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1oaSA9IE1hdGguY2VpbCh0aGlzLmNhbnZhcy5oZWlnaHQgLyBtYXhEcm9wUmFkaXVzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgQ29sbGlzaW9uTWF0cml4KG13aSwgbWhpLCBtYXhEcm9wUmFkaXVzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZW5hYmxlQ29sbGlzaW9ucyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcmVzZXRzW2ldWzNdKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXNldHNbaV1bM10gPSAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsYXN0RXhlY3V0aW9uVGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmFkZERyb3BDYWxsYmFjayA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aW1lc3RhbXAgLSBsYXN0RXhlY3V0aW9uVGltZSA8IHNwZWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGFzdEV4ZWN1dGlvblRpbWUgPSB0aW1lc3RhbXA7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZCwgMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgLy8gc2VsZWN0IG1hdGNoaW5nIHByZXNldFxuICAgICAgICAgICAgICAgIHZhciBwcmVzZXQ7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmVzZXRzW2ldWzJdID4gMSB8fCBwcmVzZXRzW2ldWzNdID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXNldHNbaV1bM10gIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVzZXRzW2ldWzNdLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBwcmVzZXRzW2ldWzJdOyArK3kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXREcm9wKG5ldyBEcm9wKHRoaXMsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzLmhlaWdodCwgcHJlc2V0c1tpXVswXSwgcHJlc2V0c1tpXVsxXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChNYXRoLnJhbmRvbSgpIDwgcHJlc2V0c1tpXVsyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlc2V0ID0gcHJlc2V0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwcmVzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXREcm9wKG5ldyBEcm9wKHRoaXMsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzLmhlaWdodCwgcHJlc2V0WzBdLCBwcmVzZXRbMV0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGV4dC5zYXZlKCk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IHRoaXMub3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuZ2xhc3MsIDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xuICAgICAgICAgICAgfSkuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGRzIGEgbmV3IHJhaW5kcm9wIHRvIHRoZSBhbmltYXRpb24uXG4gICAgICAgICAqIEBwYXJhbSBkcm9wIGRyb3Agb2JqZWN0IHRvIGJlIGFkZGVkIHRvIHRoZSBhbmltYXRpb25cbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdwdXREcm9wJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHB1dERyb3AoZHJvcCkge1xuICAgICAgICAgICAgZHJvcC5kcmF3KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5ncmF2aXR5ICYmIGRyb3AuciA+IHRoaXMub3B0aW9ucy5ncmF2aXR5VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbmFibGVDb2xsaXNpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWF0cml4LnVwZGF0ZShkcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wcy5wdXNoKGRyb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFyIHRoZSBkcm9wIGFuZCByZW1vdmUgZnJvbSB0aGUgbGlzdCBpZiBhcHBsaWNhYmxlLlxuICAgICAgICAgKiBAZHJvcCB0byBiZSBjbGVhcmVkXG4gICAgICAgICAqIEBmb3JjZSBmb3JjZSByZW1vdmFsIGZyb20gdGhlIGxpc3RcbiAgICAgICAgICogcmVzdWx0IGlmIHRydWUgYW5pbWF0aW9uIG9mIHRoaXMgZHJvcCBzaG91bGQgYmUgc3RvcHBlZFxuICAgICAgICAgKi9cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NsZWFyRHJvcCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhckRyb3AoZHJvcCwgZm9yY2UpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBkcm9wLmNsZWFyKGZvcmNlKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmRyb3BzLmluZGV4T2YoZHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVFJBSUwgZnVuY3Rpb246IG5vIHRyYWlsIGF0IGFsbFxuICAgICAgICAgKi9cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ1RSQUlMX05PTkUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gVFJBSUxfTk9ORSgpIHt9XG4gICAgICAgIC8vIG5vdGhpbmcgZ29pbmcgb24gaGVyZVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUUkFJTCBmdW5jdGlvbjogdHJhaWwgb2Ygc21hbGwgZHJvcHMgKGRlZmF1bHQpXG4gICAgICAgICAqIEBwYXJhbSBkcm9wIHJhaW5kcm9wIG9iamVjdFxuICAgICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnVFJBSUxfRFJPUFMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gVFJBSUxfRFJPUFMoZHJvcCkge1xuICAgICAgICAgICAgaWYgKCFkcm9wLnRyYWlsWSB8fCBkcm9wLnkgLSBkcm9wLnRyYWlsWSA+PSBNYXRoLnJhbmRvbSgpICogMTAwICogZHJvcC5yKSB7XG4gICAgICAgICAgICAgICAgZHJvcC50cmFpbFkgPSBkcm9wLnk7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXREcm9wKG5ldyBEcm9wKHRoaXMsIGRyb3AueCArIChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogTWF0aC5yYW5kb20oKSwgZHJvcC55IC0gZHJvcC5yIC0gNSwgTWF0aC5jZWlsKGRyb3AuciAvIDUpLCAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVFJBSUwgZnVuY3Rpb246IHRyYWlsIG9mIHVuYmx1cnJlZCBpbWFnZVxuICAgICAgICAgKiBAcGFyYW0gZHJvcCByYWluZHJvcCBvYmplY3RcbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdUUkFJTF9TTVVER0UnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gVFJBSUxfU01VREdFKGRyb3ApIHtcbiAgICAgICAgICAgIHZhciB5ID0gZHJvcC55IC0gZHJvcC5yIC0gMztcbiAgICAgICAgICAgIHZhciB4ID0gZHJvcC54IC0gZHJvcC5yIC8gMiArIE1hdGgucmFuZG9tKCkgKiAyO1xuICAgICAgICAgICAgaWYgKHkgPCAwIHx8IHggPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLmNsZWFyYmFja2dyb3VuZCwgeCwgeSwgZHJvcC5yLCAyLCB4LCB5LCBkcm9wLnIsIDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdSQVZJVFkgZnVuY3Rpb246IG5vIGdyYXZpdHkgYXQgYWxsXG4gICAgICAgICAqIEByZXR1cm5zIEJvb2xlYW4gdHJ1ZSBpZiB0aGUgYW5pbWF0aW9uIGlzIHN0b3BwZWRcbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdHUkFWSVRZX05PTkUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gR1JBVklUWV9OT05FKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR1JBVklUWSBmdW5jdGlvbjogbGluZWFyIGdyYXZpdHlcbiAgICAgICAgICogQHBhcmFtIGRyb3AgcmFpbmRyb3Agb2JqZWN0XG4gICAgICAgICAqIEByZXR1cm5zIEJvb2xlYW4gdHJ1ZSBpZiB0aGUgYW5pbWF0aW9uIGlzIHN0b3BwZWRcbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdHUkFWSVRZX0xJTkVBUicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBHUkFWSVRZX0xJTkVBUihkcm9wKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGVhckRyb3AoZHJvcCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRyb3AueXNwZWVkKSB7XG4gICAgICAgICAgICAgICAgZHJvcC55c3BlZWQgKz0gdGhpcy5QUklWQVRFX0dSQVZJVFlfRk9SQ0VfRkFDVE9SX1kgKiBNYXRoLmZsb29yKGRyb3Aucik7XG4gICAgICAgICAgICAgICAgZHJvcC54c3BlZWQgKz0gdGhpcy5QUklWQVRFX0dSQVZJVFlfRk9SQ0VfRkFDVE9SX1ggKiBNYXRoLmZsb29yKGRyb3Aucik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRyb3AueXNwZWVkID0gdGhpcy5QUklWQVRFX0dSQVZJVFlfRk9SQ0VfRkFDVE9SX1k7XG4gICAgICAgICAgICAgICAgZHJvcC54c3BlZWQgPSB0aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZHJvcC55ICs9IGRyb3AueXNwZWVkO1xuICAgICAgICAgICAgZHJvcC5kcmF3KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR1JBVklUWSBmdW5jdGlvbjogbm9uLWxpbmVhciBncmF2aXR5IChkZWZhdWx0KVxuICAgICAgICAgKiBAcGFyYW0gZHJvcCByYWluZHJvcCBvYmplY3RcbiAgICAgICAgICogQHJldHVybnMgQm9vbGVhbiB0cnVlIGlmIHRoZSBhbmltYXRpb24gaXMgc3RvcHBlZFxuICAgICAgICAgKi9cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ0dSQVZJVFlfTk9OX0xJTkVBUicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBHUkFWSVRZX05PTl9MSU5FQVIoZHJvcCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xlYXJEcm9wKGRyb3ApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkcm9wLmNvbGxpZGVkKSB7XG4gICAgICAgICAgICAgICAgZHJvcC5jb2xsaWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRyb3Auc2VlZCA9IE1hdGguZmxvb3IoZHJvcC5yICogTWF0aC5yYW5kb20oKSAqIHRoaXMub3B0aW9ucy5mcHMpO1xuICAgICAgICAgICAgICAgIGRyb3Auc2tpcHBpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBkcm9wLnNsb3dpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWRyb3Auc2VlZCB8fCBkcm9wLnNlZWQgPCAwKSB7XG4gICAgICAgICAgICAgICAgZHJvcC5zZWVkID0gTWF0aC5mbG9vcihkcm9wLnIgKiBNYXRoLnJhbmRvbSgpICogdGhpcy5vcHRpb25zLmZwcyk7XG4gICAgICAgICAgICAgICAgZHJvcC5za2lwcGluZyA9IGRyb3Auc2tpcHBpbmcgPT09IGZhbHNlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRyb3Auc2xvd2luZyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRyb3Auc2VlZC0tO1xuXG4gICAgICAgICAgICBpZiAoZHJvcC55c3BlZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZHJvcC5zbG93aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRyb3AueXNwZWVkIC89IDEuMTtcbiAgICAgICAgICAgICAgICAgICAgZHJvcC54c3BlZWQgLz0gMS4xO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZHJvcC55c3BlZWQgPCB0aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcC5zbG93aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRyb3Auc2tpcHBpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZHJvcC55c3BlZWQgPSB0aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWTtcbiAgICAgICAgICAgICAgICAgICAgZHJvcC54c3BlZWQgPSB0aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkcm9wLnlzcGVlZCArPSAxICogdGhpcy5QUklWQVRFX0dSQVZJVFlfRk9SQ0VfRkFDVE9SX1kgKiBNYXRoLmZsb29yKGRyb3Aucik7XG4gICAgICAgICAgICAgICAgICAgIGRyb3AueHNwZWVkICs9IDEgKiB0aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWCAqIE1hdGguZmxvb3IoZHJvcC5yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRyb3AueXNwZWVkID0gdGhpcy5QUklWQVRFX0dSQVZJVFlfRk9SQ0VfRkFDVE9SX1k7XG4gICAgICAgICAgICAgICAgZHJvcC54c3BlZWQgPSB0aGlzLlBSSVZBVEVfR1JBVklUWV9GT1JDRV9GQUNUT1JfWDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ncmF2aXR5QW5nbGVWYXJpYW5jZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGRyb3AueHNwZWVkICs9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogZHJvcC55c3BlZWQgKiB0aGlzLm9wdGlvbnMuZ3Jhdml0eUFuZ2xlVmFyaWFuY2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRyb3AueSArPSBkcm9wLnlzcGVlZDtcbiAgICAgICAgICAgIGRyb3AueCArPSBkcm9wLnhzcGVlZDtcblxuICAgICAgICAgICAgZHJvcC5kcmF3KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXRpbGl0eSBmdW5jdGlvbiB0byByZXR1cm4gcG9zaXRpdmUgbWluIHZhbHVlXG4gICAgICAgICAqIEBwYXJhbSB2YWwxIGZpcnN0IG51bWJlclxuICAgICAgICAgKiBAcGFyYW0gdmFsMiBzZWNvbmQgbnVtYmVyXG4gICAgICAgICAqL1xuICAgIH0sIHtcbiAgICAgICAga2V5OiAncG9zaXRpdmVNaW4nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcG9zaXRpdmVNaW4odmFsMSwgdmFsMikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDA7XG4gICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdmFsMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwyIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdmFsMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWwyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQgPD0gMCA/IDEgOiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUkVGTEVDVElPTiBmdW5jdGlvbjogbm8gcmVmbGVjdGlvbiBhdCBhbGxcbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdSRUZMRUNUSU9OX05PTkUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gUkVGTEVDVElPTl9OT05FKCkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMub3B0aW9ucy5maWxsU3R5bGU7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJFRkxFQ1RJT04gZnVuY3Rpb246IG1pbmlhdHVyZSByZWZsZWN0aW9uIChkZWZhdWx0KVxuICAgICAgICAgKiBAcGFyYW0gZHJvcCByYWluZHJvcCBvYmplY3RcbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdSRUZMRUNUSU9OX01JTklBVFVSRScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBSRUZMRUNUSU9OX01JTklBVFVSRShkcm9wKSB7XG4gICAgICAgICAgICB2YXIgc3ggPSBNYXRoLm1heCgoZHJvcC54IC0gdGhpcy5vcHRpb25zLnJlZmxlY3Rpb25Ecm9wTWFwcGluZ1dpZHRoKSAvIHRoaXMub3B0aW9ucy5yZWZsZWN0aW9uU2NhbGVkb3duRmFjdG9yLCAwKTtcbiAgICAgICAgICAgIHZhciBzeSA9IE1hdGgubWF4KChkcm9wLnkgLSB0aGlzLm9wdGlvbnMucmVmbGVjdGlvbkRyb3BNYXBwaW5nSGVpZ2h0KSAvIHRoaXMub3B0aW9ucy5yZWZsZWN0aW9uU2NhbGVkb3duRmFjdG9yLCAwKTtcbiAgICAgICAgICAgIHZhciBzdyA9IHRoaXMucG9zaXRpdmVNaW4odGhpcy5vcHRpb25zLnJlZmxlY3Rpb25Ecm9wTWFwcGluZ1dpZHRoICogMiAvIHRoaXMub3B0aW9ucy5yZWZsZWN0aW9uU2NhbGVkb3duRmFjdG9yLCB0aGlzLnJlZmxlY3RlZC53aWR0aCAtIHN4KTtcbiAgICAgICAgICAgIHZhciBzaCA9IHRoaXMucG9zaXRpdmVNaW4odGhpcy5vcHRpb25zLnJlZmxlY3Rpb25Ecm9wTWFwcGluZ0hlaWdodCAqIDIgLyB0aGlzLm9wdGlvbnMucmVmbGVjdGlvblNjYWxlZG93bkZhY3RvciwgdGhpcy5yZWZsZWN0ZWQuaGVpZ2h0IC0gc3kpO1xuICAgICAgICAgICAgdmFyIGR4ID0gTWF0aC5tYXgoZHJvcC54IC0gMS4xICogZHJvcC5yLCAwKTtcbiAgICAgICAgICAgIHZhciBkeSA9IE1hdGgubWF4KGRyb3AueSAtIDEuMSAqIGRyb3AuciwgMCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMucmVmbGVjdGVkLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkcm9wLnIgKiAyLCBkcm9wLnIgKiAyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDT0xMSVNJT04gZnVuY3Rpb246IGRlZmF1bHQgY29sbGlzaW9uIGltcGxlbWVudGF0aW9uXG4gICAgICAgICAqIEBwYXJhbSBkcm9wIG9uZSBvZiB0aGUgZHJvcHMgY29sbGlkaW5nXG4gICAgICAgICAqIEBwYXJhbSBjb2xsaXNpb25zIGxpc3Qgb2YgcG90ZW50aWFsIGNvbGxpc2lvbnNcbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdDT0xMSVNJT05fU0lNUExFJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIENPTExJU0lPTl9TSU1QTEUoZHJvcCwgY29sbGlzaW9ucykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjb2xsaXNpb25zO1xuICAgICAgICAgICAgdmFyIGRyb3AyO1xuICAgICAgICAgICAgd2hpbGUgKGl0ZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhciBwID0gaXRlbS5kcm9wO1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLnNxcnQoTWF0aC5wb3coZHJvcC54IC0gcC54LCAyKSArIE1hdGgucG93KGRyb3AueSAtIHAueSwgMikpIDwgZHJvcC5yICsgcC5yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRyb3AyID0gcDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLm5leHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZHJvcDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlbmFtZSBzbyB0aGF0IHdlJ3JlIGRlYWxpbmcgd2l0aCBsb3cvaGlnaCBkcm9wc1xuICAgICAgICAgICAgdmFyIGhpZ2hlciwgbG93ZXI7XG4gICAgICAgICAgICBpZiAoZHJvcC55ID4gZHJvcDIueSkge1xuICAgICAgICAgICAgICAgIGhpZ2hlciA9IGRyb3A7XG4gICAgICAgICAgICAgICAgbG93ZXIgPSBkcm9wMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGlnaGVyID0gZHJvcDI7XG4gICAgICAgICAgICAgICAgbG93ZXIgPSBkcm9wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNsZWFyRHJvcChsb3dlcik7XG4gICAgICAgICAgICAvLyBmb3JjZSBzdG9wcGluZyB0aGUgc2Vjb25kIGRyb3BcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEcm9wKGhpZ2hlciwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5yZW1vdmUoaGlnaGVyKTtcbiAgICAgICAgICAgIGxvd2VyLmRyYXcoKTtcblxuICAgICAgICAgICAgbG93ZXIuY29sbGlkaW5nID0gaGlnaGVyO1xuICAgICAgICAgICAgbG93ZXIuY29sbGlkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2l6ZXMgY2FudmFzLCBkcmF3cyBvcmlnaW5hbCBpbWFnZSBhbmQgYXBwbGllcyBibHVycmluZyBhbGdvcml0aG0uXG4gICAgICAgICAqL1xuICAgIH0sIHtcbiAgICAgICAga2V5OiAncHJlcGFyZUJhY2tncm91bmQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcHJlcGFyZUJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcblxuICAgICAgICAgICAgdGhpcy5jbGVhcmJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJiYWNrZ3JvdW5kLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB0aGlzLmNsZWFyYmFja2dyb3VuZC5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5iYWNrZ3JvdW5kLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5pbWcsIHRoaXMub3B0aW9ucy5jcm9wWzBdLCB0aGlzLm9wdGlvbnMuY3JvcFsxXSwgdGhpcy5vcHRpb25zLmNyb3BbMl0sIHRoaXMub3B0aW9ucy5jcm9wWzNdLCAwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgY29udGV4dCA9IHRoaXMuY2xlYXJiYWNrZ3JvdW5kLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuaW1nLCB0aGlzLm9wdGlvbnMuY3JvcFswXSwgdGhpcy5vcHRpb25zLmNyb3BbMV0sIHRoaXMub3B0aW9ucy5jcm9wWzJdLCB0aGlzLm9wdGlvbnMuY3JvcFszXSwgMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cbiAgICAgICAgICAgIGlmICghaXNOYU4odGhpcy5vcHRpb25zLmJsdXIpICYmIHRoaXMub3B0aW9ucy5ibHVyID49IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWNrQmx1ckNhbnZhc1JHQih0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0LCB0aGlzLm9wdGlvbnMuYmx1cik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW1wbGVtZW50cyB0aGUgU3RhY2sgQmx1ciBBbGdvcml0aG0gKEBzZWUgaHR0cDovL3d3dy5xdWFzaW1vbmRvLmNvbS9TdGFja0JsdXJGb3JDYW52YXMvU3RhY2tCbHVyRGVtby5odG1sKS5cbiAgICAgICAgICogQHBhcmFtIHdpZHRoIHdpZHRoIG9mIHRoZSBjYW52YXNcbiAgICAgICAgICogQHBhcmFtIGhlaWdodCBoZWlnaHQgb2YgdGhlIGNhbnZhc1xuICAgICAgICAgKiBAcGFyYW0gcmFkaXVzIGJsdXIgcmFkaXVzXG4gICAgICAgICAqL1xuICAgIH0sIHtcbiAgICAgICAga2V5OiAnc3RhY2tCbHVyQ2FudmFzUkdCJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN0YWNrQmx1ckNhbnZhc1JHQih3aWR0aCwgaGVpZ2h0LCByYWRpdXMpIHtcblxuICAgICAgICAgICAgdmFyIHNoZ1RhYmxlID0gW1swLCA5XSwgWzEsIDExXSwgWzIsIDEyXSwgWzMsIDEzXSwgWzUsIDE0XSwgWzcsIDE1XSwgWzExLCAxNl0sIFsxNSwgMTddLCBbMjIsIDE4XSwgWzMxLCAxOV0sIFs0NSwgMjBdLCBbNjMsIDIxXSwgWzkwLCAyMl0sIFsxMjcsIDIzXSwgWzE4MSwgMjRdXTtcblxuICAgICAgICAgICAgdmFyIG11bFRhYmxlID0gWzUxMiwgNTEyLCA0NTYsIDUxMiwgMzI4LCA0NTYsIDMzNSwgNTEyLCA0MDUsIDMyOCwgMjcxLCA0NTYsIDM4OCwgMzM1LCAyOTIsIDUxMiwgNDU0LCA0MDUsIDM2NCwgMzI4LCAyOTgsIDI3MSwgNDk2LCA0NTYsIDQyMCwgMzg4LCAzNjAsIDMzNSwgMzEyLCAyOTIsIDI3MywgNTEyLCA0ODIsIDQ1NCwgNDI4LCA0MDUsIDM4MywgMzY0LCAzNDUsIDMyOCwgMzEyLCAyOTgsIDI4NCwgMjcxLCAyNTksIDQ5NiwgNDc1LCA0NTYsIDQzNywgNDIwLCA0MDQsIDM4OCwgMzc0LCAzNjAsIDM0NywgMzM1LCAzMjMsIDMxMiwgMzAyLCAyOTIsIDI4MiwgMjczLCAyNjUsIDUxMiwgNDk3LCA0ODIsIDQ2OCwgNDU0LCA0NDEsIDQyOCwgNDE3LCA0MDUsIDM5NCwgMzgzLCAzNzMsIDM2NCwgMzU0LCAzNDUsIDMzNywgMzI4LCAzMjAsIDMxMiwgMzA1LCAyOTgsIDI5MSwgMjg0LCAyNzgsIDI3MSwgMjY1LCAyNTksIDUwNywgNDk2LCA0ODUsIDQ3NSwgNDY1LCA0NTYsIDQ0NiwgNDM3LCA0MjgsIDQyMCwgNDEyLCA0MDQsIDM5NiwgMzg4LCAzODEsIDM3NCwgMzY3LCAzNjAsIDM1NCwgMzQ3LCAzNDEsIDMzNSwgMzI5LCAzMjMsIDMxOCwgMzEyLCAzMDcsIDMwMiwgMjk3LCAyOTIsIDI4NywgMjgyLCAyNzgsIDI3MywgMjY5LCAyNjUsIDI2MSwgNTEyLCA1MDUsIDQ5NywgNDg5LCA0ODIsIDQ3NSwgNDY4LCA0NjEsIDQ1NCwgNDQ3LCA0NDEsIDQzNSwgNDI4LCA0MjIsIDQxNywgNDExLCA0MDUsIDM5OSwgMzk0LCAzODksIDM4MywgMzc4LCAzNzMsIDM2OCwgMzY0LCAzNTksIDM1NCwgMzUwLCAzNDUsIDM0MSwgMzM3LCAzMzIsIDMyOCwgMzI0LCAzMjAsIDMxNiwgMzEyLCAzMDksIDMwNSwgMzAxLCAyOTgsIDI5NCwgMjkxLCAyODcsIDI4NCwgMjgxLCAyNzgsIDI3NCwgMjcxLCAyNjgsIDI2NSwgMjYyLCAyNTksIDI1NywgNTA3LCA1MDEsIDQ5NiwgNDkxLCA0ODUsIDQ4MCwgNDc1LCA0NzAsIDQ2NSwgNDYwLCA0NTYsIDQ1MSwgNDQ2LCA0NDIsIDQzNywgNDMzLCA0MjgsIDQyNCwgNDIwLCA0MTYsIDQxMiwgNDA4LCA0MDQsIDQwMCwgMzk2LCAzOTIsIDM4OCwgMzg1LCAzODEsIDM3NywgMzc0LCAzNzAsIDM2NywgMzYzLCAzNjAsIDM1NywgMzU0LCAzNTAsIDM0NywgMzQ0LCAzNDEsIDMzOCwgMzM1LCAzMzIsIDMyOSwgMzI2LCAzMjMsIDMyMCwgMzE4LCAzMTUsIDMxMiwgMzEwLCAzMDcsIDMwNCwgMzAyLCAyOTksIDI5NywgMjk0LCAyOTIsIDI4OSwgMjg3LCAyODUsIDI4MiwgMjgwLCAyNzgsIDI3NSwgMjczLCAyNzEsIDI2OSwgMjY3LCAyNjUsIDI2MywgMjYxLCAyNTldO1xuXG4gICAgICAgICAgICByYWRpdXMgfD0gMDtcblxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmJhY2tncm91bmQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIHZhciBpbWFnZURhdGEgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIHZhciBwaXhlbHMgPSBpbWFnZURhdGEuZGF0YTtcbiAgICAgICAgICAgIHZhciB4LCB5LCBpLCBwLCB5cCwgeWksIHl3LCByU3VtLCBnU3VtLCBiU3VtLCByT3V0U3VtLCBnT3V0U3VtLCBiT3V0U3VtLCBySW5TdW0sIGdJblN1bSwgYkluU3VtLCBwciwgcGcsIHBiLCByYnM7XG4gICAgICAgICAgICB2YXIgcmFkaXVzUGx1czEgPSByYWRpdXMgKyAxO1xuICAgICAgICAgICAgdmFyIHN1bUZhY3RvciA9IHJhZGl1c1BsdXMxICogKHJhZGl1c1BsdXMxICsgMSkgLyAyO1xuXG4gICAgICAgICAgICB2YXIgc3RhY2tTdGFydCA9IG5ldyBCbHVyU3RhY2soKTtcbiAgICAgICAgICAgIHZhciBzdGFja0VuZCA9IG5ldyBCbHVyU3RhY2soKTtcbiAgICAgICAgICAgIHZhciBzdGFjayA9IHN0YWNrU3RhcnQ7XG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgMiAqIHJhZGl1cyArIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHN0YWNrID0gc3RhY2submV4dCA9IG5ldyBCbHVyU3RhY2soKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gcmFkaXVzUGx1czEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tFbmQgPSBzdGFjaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFjay5uZXh0ID0gc3RhY2tTdGFydDtcbiAgICAgICAgICAgIHZhciBzdGFja0luID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBzdGFja091dCA9IG51bGw7XG5cbiAgICAgICAgICAgIHl3ID0geWkgPSAwO1xuXG4gICAgICAgICAgICB2YXIgbXVsU3VtID0gbXVsVGFibGVbcmFkaXVzXTtcbiAgICAgICAgICAgIHZhciBzaGdTdW07XG4gICAgICAgICAgICBmb3IgKHZhciBzc2kgPSAwOyBzc2kgPCBzaGdUYWJsZS5sZW5ndGg7ICsrc3NpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJhZGl1cyA8PSBzaGdUYWJsZVtzc2ldWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoZ1N1bSA9IHNoZ1RhYmxlW3NzaSAtIDFdWzFdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgICAgIHJJblN1bSA9IGdJblN1bSA9IGJJblN1bSA9IHJTdW0gPSBnU3VtID0gYlN1bSA9IDA7XG5cbiAgICAgICAgICAgICAgICByT3V0U3VtID0gcmFkaXVzUGx1czEgKiAocHIgPSBwaXhlbHNbeWldKTtcbiAgICAgICAgICAgICAgICBnT3V0U3VtID0gcmFkaXVzUGx1czEgKiAocGcgPSBwaXhlbHNbeWkgKyAxXSk7XG4gICAgICAgICAgICAgICAgYk91dFN1bSA9IHJhZGl1c1BsdXMxICogKHBiID0gcGl4ZWxzW3lpICsgMl0pO1xuXG4gICAgICAgICAgICAgICAgclN1bSArPSBzdW1GYWN0b3IgKiBwcjtcbiAgICAgICAgICAgICAgICBnU3VtICs9IHN1bUZhY3RvciAqIHBnO1xuICAgICAgICAgICAgICAgIGJTdW0gKz0gc3VtRmFjdG9yICogcGI7XG5cbiAgICAgICAgICAgICAgICBzdGFjayA9IHN0YWNrU3RhcnQ7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcmFkaXVzUGx1czE7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5yID0gcHI7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLmcgPSBwZztcbiAgICAgICAgICAgICAgICAgICAgc3RhY2suYiA9IHBiO1xuICAgICAgICAgICAgICAgICAgICBzdGFjayA9IHN0YWNrLm5leHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IHJhZGl1c1BsdXMxOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcCA9IHlpICsgKCh3aWR0aCAtIDEgPCBpID8gd2lkdGggLSAxIDogaSkgPDwgMik7XG4gICAgICAgICAgICAgICAgICAgIHJTdW0gKz0gKHN0YWNrLnIgPSBwciA9IHBpeGVsc1twXSkgKiAocmJzID0gcmFkaXVzUGx1czEgLSBpKTtcbiAgICAgICAgICAgICAgICAgICAgZ1N1bSArPSAoc3RhY2suZyA9IHBnID0gcGl4ZWxzW3AgKyAxXSkgKiByYnM7XG4gICAgICAgICAgICAgICAgICAgIGJTdW0gKz0gKHN0YWNrLmIgPSBwYiA9IHBpeGVsc1twICsgMl0pICogcmJzO1xuXG4gICAgICAgICAgICAgICAgICAgIHJJblN1bSArPSBwcjtcbiAgICAgICAgICAgICAgICAgICAgZ0luU3VtICs9IHBnO1xuICAgICAgICAgICAgICAgICAgICBiSW5TdW0gKz0gcGI7XG5cbiAgICAgICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFjay5uZXh0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN0YWNrSW4gPSBzdGFja1N0YXJ0O1xuICAgICAgICAgICAgICAgIHN0YWNrT3V0ID0gc3RhY2tFbmQ7XG4gICAgICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcGl4ZWxzW3lpXSA9IHJTdW0gKiBtdWxTdW0gPj4gc2hnU3VtO1xuICAgICAgICAgICAgICAgICAgICBwaXhlbHNbeWkgKyAxXSA9IGdTdW0gKiBtdWxTdW0gPj4gc2hnU3VtO1xuICAgICAgICAgICAgICAgICAgICBwaXhlbHNbeWkgKyAyXSA9IGJTdW0gKiBtdWxTdW0gPj4gc2hnU3VtO1xuXG4gICAgICAgICAgICAgICAgICAgIHJTdW0gLT0gck91dFN1bTtcbiAgICAgICAgICAgICAgICAgICAgZ1N1bSAtPSBnT3V0U3VtO1xuICAgICAgICAgICAgICAgICAgICBiU3VtIC09IGJPdXRTdW07XG5cbiAgICAgICAgICAgICAgICAgICAgck91dFN1bSAtPSBzdGFja0luLnI7XG4gICAgICAgICAgICAgICAgICAgIGdPdXRTdW0gLT0gc3RhY2tJbi5nO1xuICAgICAgICAgICAgICAgICAgICBiT3V0U3VtIC09IHN0YWNrSW4uYjtcblxuICAgICAgICAgICAgICAgICAgICBwID0geXcgKyAoKHAgPSB4ICsgcmFkaXVzICsgMSkgPCB3aWR0aCAtIDEgPyBwIDogd2lkdGggLSAxKSA8PCAyO1xuXG4gICAgICAgICAgICAgICAgICAgIHJJblN1bSArPSBzdGFja0luLnIgPSBwaXhlbHNbcF07XG4gICAgICAgICAgICAgICAgICAgIGdJblN1bSArPSBzdGFja0luLmcgPSBwaXhlbHNbcCArIDFdO1xuICAgICAgICAgICAgICAgICAgICBiSW5TdW0gKz0gc3RhY2tJbi5iID0gcGl4ZWxzW3AgKyAyXTtcblxuICAgICAgICAgICAgICAgICAgICByU3VtICs9IHJJblN1bTtcbiAgICAgICAgICAgICAgICAgICAgZ1N1bSArPSBnSW5TdW07XG4gICAgICAgICAgICAgICAgICAgIGJTdW0gKz0gYkluU3VtO1xuXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrSW4gPSBzdGFja0luLm5leHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgck91dFN1bSArPSBwciA9IHN0YWNrT3V0LnI7XG4gICAgICAgICAgICAgICAgICAgIGdPdXRTdW0gKz0gcGcgPSBzdGFja091dC5nO1xuICAgICAgICAgICAgICAgICAgICBiT3V0U3VtICs9IHBiID0gc3RhY2tPdXQuYjtcblxuICAgICAgICAgICAgICAgICAgICBySW5TdW0gLT0gcHI7XG4gICAgICAgICAgICAgICAgICAgIGdJblN1bSAtPSBwZztcbiAgICAgICAgICAgICAgICAgICAgYkluU3VtIC09IHBiO1xuXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrT3V0ID0gc3RhY2tPdXQubmV4dDtcblxuICAgICAgICAgICAgICAgICAgICB5aSArPSA0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB5dyArPSB3aWR0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBnSW5TdW0gPSBiSW5TdW0gPSBySW5TdW0gPSBnU3VtID0gYlN1bSA9IHJTdW0gPSAwO1xuXG4gICAgICAgICAgICAgICAgeWkgPSB4IDw8IDI7XG4gICAgICAgICAgICAgICAgck91dFN1bSA9IHJhZGl1c1BsdXMxICogKHByID0gcGl4ZWxzW3lpXSk7XG4gICAgICAgICAgICAgICAgZ091dFN1bSA9IHJhZGl1c1BsdXMxICogKHBnID0gcGl4ZWxzW3lpICsgMV0pO1xuICAgICAgICAgICAgICAgIGJPdXRTdW0gPSByYWRpdXNQbHVzMSAqIChwYiA9IHBpeGVsc1t5aSArIDJdKTtcblxuICAgICAgICAgICAgICAgIHJTdW0gKz0gc3VtRmFjdG9yICogcHI7XG4gICAgICAgICAgICAgICAgZ1N1bSArPSBzdW1GYWN0b3IgKiBwZztcbiAgICAgICAgICAgICAgICBiU3VtICs9IHN1bUZhY3RvciAqIHBiO1xuXG4gICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFja1N0YXJ0O1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHJhZGl1c1BsdXMxOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2suciA9IHByO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5nID0gcGc7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLmIgPSBwYjtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFjay5uZXh0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHlwID0gd2lkdGg7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgcmFkaXVzUGx1czE7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB5aSA9IHlwICsgeCA8PCAyO1xuXG4gICAgICAgICAgICAgICAgICAgIHJTdW0gKz0gKHN0YWNrLnIgPSBwciA9IHBpeGVsc1t5aV0pICogKHJicyA9IHJhZGl1c1BsdXMxIC0gaSk7XG4gICAgICAgICAgICAgICAgICAgIGdTdW0gKz0gKHN0YWNrLmcgPSBwZyA9IHBpeGVsc1t5aSArIDFdKSAqIHJicztcbiAgICAgICAgICAgICAgICAgICAgYlN1bSArPSAoc3RhY2suYiA9IHBiID0gcGl4ZWxzW3lpICsgMl0pICogcmJzO1xuXG4gICAgICAgICAgICAgICAgICAgIHJJblN1bSArPSBwcjtcbiAgICAgICAgICAgICAgICAgICAgZ0luU3VtICs9IHBnO1xuICAgICAgICAgICAgICAgICAgICBiSW5TdW0gKz0gcGI7XG5cbiAgICAgICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFjay5uZXh0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgaGVpZ2h0IC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeXAgKz0gd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB5aSA9IHg7XG4gICAgICAgICAgICAgICAgc3RhY2tJbiA9IHN0YWNrU3RhcnQ7XG4gICAgICAgICAgICAgICAgc3RhY2tPdXQgPSBzdGFja0VuZDtcbiAgICAgICAgICAgICAgICBmb3IgKHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcCA9IHlpIDw8IDI7XG4gICAgICAgICAgICAgICAgICAgIHBpeGVsc1twXSA9IHJTdW0gKiBtdWxTdW0gPj4gc2hnU3VtO1xuICAgICAgICAgICAgICAgICAgICBwaXhlbHNbcCArIDFdID0gZ1N1bSAqIG11bFN1bSA+PiBzaGdTdW07XG4gICAgICAgICAgICAgICAgICAgIHBpeGVsc1twICsgMl0gPSBiU3VtICogbXVsU3VtID4+IHNoZ1N1bTtcblxuICAgICAgICAgICAgICAgICAgICByU3VtIC09IHJPdXRTdW07XG4gICAgICAgICAgICAgICAgICAgIGdTdW0gLT0gZ091dFN1bTtcbiAgICAgICAgICAgICAgICAgICAgYlN1bSAtPSBiT3V0U3VtO1xuXG4gICAgICAgICAgICAgICAgICAgIHJPdXRTdW0gLT0gc3RhY2tJbi5yO1xuICAgICAgICAgICAgICAgICAgICBnT3V0U3VtIC09IHN0YWNrSW4uZztcbiAgICAgICAgICAgICAgICAgICAgYk91dFN1bSAtPSBzdGFja0luLmI7XG5cbiAgICAgICAgICAgICAgICAgICAgcCA9IHggKyAoKHAgPSB5ICsgcmFkaXVzUGx1czEpIDwgaGVpZ2h0IC0gMSA/IHAgOiBoZWlnaHQgLSAxKSAqIHdpZHRoIDw8IDI7XG5cbiAgICAgICAgICAgICAgICAgICAgclN1bSArPSBySW5TdW0gKz0gc3RhY2tJbi5yID0gcGl4ZWxzW3BdO1xuICAgICAgICAgICAgICAgICAgICBnU3VtICs9IGdJblN1bSArPSBzdGFja0luLmcgPSBwaXhlbHNbcCArIDFdO1xuICAgICAgICAgICAgICAgICAgICBiU3VtICs9IGJJblN1bSArPSBzdGFja0luLmIgPSBwaXhlbHNbcCArIDJdO1xuXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrSW4gPSBzdGFja0luLm5leHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgck91dFN1bSArPSBwciA9IHN0YWNrT3V0LnI7XG4gICAgICAgICAgICAgICAgICAgIGdPdXRTdW0gKz0gcGcgPSBzdGFja091dC5nO1xuICAgICAgICAgICAgICAgICAgICBiT3V0U3VtICs9IHBiID0gc3RhY2tPdXQuYjtcblxuICAgICAgICAgICAgICAgICAgICBySW5TdW0gLT0gcHI7XG4gICAgICAgICAgICAgICAgICAgIGdJblN1bSAtPSBwZztcbiAgICAgICAgICAgICAgICAgICAgYkluU3VtIC09IHBiO1xuXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrT3V0ID0gc3RhY2tPdXQubmV4dDtcblxuICAgICAgICAgICAgICAgICAgICB5aSArPSB3aWR0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUmFpbnlEYXk7XG59KSgpO1xuXG52YXIgRHJvcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRHJvcChyYWlueWRheSwgY2VudGVyWCwgY2VudGVyWSwgbWluLCBiYXNlKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEcm9wKTtcblxuICAgICAgICB0aGlzLnggPSBNYXRoLmZsb29yKGNlbnRlclgpO1xuICAgICAgICB0aGlzLnkgPSBNYXRoLmZsb29yKGNlbnRlclkpO1xuICAgICAgICB0aGlzLnIgPSBNYXRoLnJhbmRvbSgpICogYmFzZSArIG1pbjtcbiAgICAgICAgdGhpcy5yYWlueWRheSA9IHJhaW55ZGF5O1xuICAgICAgICB0aGlzLmNvbnRleHQgPSByYWlueWRheS5jb250ZXh0O1xuICAgICAgICB0aGlzLnJlZmxlY3Rpb24gPSByYWlueWRheS5yZWZsZWN0ZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhIG5ldyBoZWxwZXIgb2JqZWN0IGZvciBTdGFjayBCbHVyIEFsZ29yaXRobS5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIERyYXdzIGEgcmFpbmRyb3Agb24gY2FudmFzIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgICAqL1xuXG4gICAgX2NyZWF0ZUNsYXNzKERyb3AsIFt7XG4gICAgICAgIGtleTogJ2RyYXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZHJhdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIHZhciBvcmdSID0gdGhpcy5yO1xuICAgICAgICAgICAgdGhpcy5yID0gMC45NSAqIHRoaXMucjtcbiAgICAgICAgICAgIGlmICh0aGlzLnIgPCAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbGxpZGluZyB8fCB0aGlzLnlzcGVlZCA+IDIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb2xsaWRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbGxpZGVyID0gdGhpcy5jb2xsaWRpbmc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuciA9IDEuMDAxICogKHRoaXMuciA+IGNvbGxpZGVyLnIgPyB0aGlzLnIgOiBjb2xsaWRlci5yKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54ICs9IGNvbGxpZGVyLnggLSB0aGlzLng7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlkaW5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgeXIgPSAxICsgMC4xICogdGhpcy55c3BlZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLnggLSB0aGlzLnIgLyB5ciwgdGhpcy55KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuYmV6aWVyQ3VydmVUbyh0aGlzLnggLSB0aGlzLnIsIHRoaXMueSAtIHRoaXMuciAqIDIsIHRoaXMueCArIHRoaXMuciwgdGhpcy55IC0gdGhpcy5yICogMiwgdGhpcy54ICsgdGhpcy5yIC8geXIsIHRoaXMueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmJlemllckN1cnZlVG8odGhpcy54ICsgdGhpcy5yLCB0aGlzLnkgKyB5ciAqIHRoaXMuciwgdGhpcy54IC0gdGhpcy5yLCB0aGlzLnkgKyB5ciAqIHRoaXMuciwgdGhpcy54IC0gdGhpcy5yIC8geXIsIHRoaXMueSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMuciAqIDAuOSwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmNsaXAoKTtcblxuICAgICAgICAgICAgdGhpcy5yID0gb3JnUjtcblxuICAgICAgICAgICAgaWYgKHRoaXMucmFpbnlkYXkucmVmbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMucmFpbnlkYXkucmVmbGVjdGlvbih0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGVhcnMgdGhlIHJhaW5kcm9wIHJlZ2lvbi5cbiAgICAgICAgICogQHBhcmFtIGZvcmNlIGZvcmNlIHN0b3BcbiAgICAgICAgICogQHJldHVybnMgQm9vbGVhbiB0cnVlIGlmIHRoZSBhbmltYXRpb24gaXMgc3RvcHBlZFxuICAgICAgICAgKi9cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NsZWFyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKGZvcmNlKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KHRoaXMueCAtIHRoaXMuciAtIDEsIHRoaXMueSAtIHRoaXMuciAtIDIsIDIgKiB0aGlzLnIgKyAyLCAyICogdGhpcy5yICsgMik7XG4gICAgICAgICAgICBpZiAoZm9yY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRlcm1pbmF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy55IC0gdGhpcy5yID4gdGhpcy5yYWlueWRheS5jYW52YXMuaGVpZ2h0IHx8IHRoaXMueCAtIHRoaXMuciA+IHRoaXMucmFpbnlkYXkuY2FudmFzLndpZHRoIHx8IHRoaXMueCArIHRoaXMuciA8IDApIHtcbiAgICAgICAgICAgICAgICAvLyBvdmVyIGVkZ2Ugc28gc3RvcCB0aGlzIGRyb3BcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb3ZlcyB0aGUgcmFpbmRyb3AgdG8gYSBuZXcgcG9zaXRpb24gYWNjb3JkaW5nIHRvIHRoZSBncmF2aXR5LlxuICAgICAgICAgKi9cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2FuaW1hdGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRlcm1pbmF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzdG9wcGVkID0gdGhpcy5yYWlueWRheS5ncmF2aXR5KHRoaXMpO1xuICAgICAgICAgICAgaWYgKCFzdG9wcGVkICYmIHRoaXMucmFpbnlkYXkudHJhaWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhaW55ZGF5LnRyYWlsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucmFpbnlkYXkub3B0aW9ucy5lbmFibGVDb2xsaXNpb25zKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbGxpc2lvbnMgPSB0aGlzLnJhaW55ZGF5Lm1hdHJpeC51cGRhdGUodGhpcywgc3RvcHBlZCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbGxpc2lvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYWlueWRheS5jb2xsaXNpb24odGhpcywgY29sbGlzaW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICFzdG9wcGVkIHx8IHRoaXMudGVybWluYXRlO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIERyb3A7XG59KSgpO1xuXG52YXIgQmx1clN0YWNrID0gZnVuY3Rpb24gQmx1clN0YWNrKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCbHVyU3RhY2spO1xuXG4gICAgdGhpcy5yID0gMDtcbiAgICB0aGlzLmcgPSAwO1xuICAgIHRoaXMuYiA9IDA7XG4gICAgdGhpcy5uZXh0ID0gbnVsbDtcbn1cbi8qKlxuICogRGVmaW5lcyBhIGdyYXZpdHkgbWF0cml4IG9iamVjdCB3aGljaCBoYW5kbGVzIGNvbGxpc2lvbiBkZXRlY3Rpb24uXG4gKiBAcGFyYW0geCBudW1iZXIgb2YgY29sdW1ucyBpbiB0aGUgbWF0cml4XG4gKiBAcGFyYW0geSBudW1iZXIgb2Ygcm93cyBpbiB0aGUgbWF0cml4XG4gKiBAcGFyYW0gciBncmlkIHNpemVcbiAqL1xuO1xuXG52YXIgQ29sbGlzaW9uTWF0cml4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb2xsaXNpb25NYXRyaXgoeCwgeSwgcikge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29sbGlzaW9uTWF0cml4KTtcblxuICAgICAgICB0aGlzLnJlc29sdXRpb24gPSByO1xuICAgICAgICB0aGlzLnhjID0geDtcbiAgICAgICAgdGhpcy55YyA9IHk7XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IEFycmF5KHgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSB4ICsgNTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm1hdHJpeFtpXSA9IG5ldyBBcnJheSh5KTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IHkgKyA1OyArK2opIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hdHJpeFtpXVtqXSA9IG5ldyBEcm9wSXRlbShudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSBsaW5rZWQgbGlzdCBpdGVtLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBwb3NpdGlvbiBvZiB0aGUgZ2l2ZW4gZHJvcCBvbiB0aGUgY29sbGlzaW9uIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gZHJvcCByYWluZHJvcCB0byBiZSBwb3NpdGlvbmVkL3JlcG9zaXRpb25lZFxuICAgICAqIEBwYXJhbSBmb3JjZURlbGV0ZSBpZiB0cnVlIHRoZSByYWluZHJvcCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgbWF0cml4XG4gICAgICogQHJldHVybnMgY29sbGlzaW9ucyBpZiBhbnlcbiAgICAgKi9cblxuICAgIF9jcmVhdGVDbGFzcyhDb2xsaXNpb25NYXRyaXgsIFt7XG4gICAgICAgIGtleTogJ3VwZGF0ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoZHJvcCwgZm9yY2VEZWxldGUpIHtcbiAgICAgICAgICAgIGlmIChkcm9wLmdpZCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5tYXRyaXhbZHJvcC5nbXhdIHx8ICF0aGlzLm1hdHJpeFtkcm9wLmdteF1bZHJvcC5nbXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm1hdHJpeFtkcm9wLmdteF1bZHJvcC5nbXldLnJlbW92ZShkcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAoZm9yY2VEZWxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZHJvcC5nbXggPSBNYXRoLmZsb29yKGRyb3AueCAvIHRoaXMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgZHJvcC5nbXkgPSBNYXRoLmZsb29yKGRyb3AueSAvIHRoaXMucmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm1hdHJpeFtkcm9wLmdteF0gfHwgIXRoaXMubWF0cml4W2Ryb3AuZ214XVtkcm9wLmdteV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubWF0cml4W2Ryb3AuZ214XVtkcm9wLmdteV0uYWRkKGRyb3ApO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbGxpc2lvbnMgPSB0aGlzLmNvbGxpc2lvbnMoZHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbGxpc2lvbnMgJiYgY29sbGlzaW9ucy5uZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxpc2lvbnMubmV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRyb3AuZ2lkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpO1xuICAgICAgICAgICAgICAgIGRyb3AuZ214ID0gTWF0aC5mbG9vcihkcm9wLnggLyB0aGlzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGRyb3AuZ215ID0gTWF0aC5mbG9vcihkcm9wLnkgLyB0aGlzLnJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5tYXRyaXhbZHJvcC5nbXhdIHx8ICF0aGlzLm1hdHJpeFtkcm9wLmdteF1bZHJvcC5nbXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubWF0cml4W2Ryb3AuZ214XVtkcm9wLmdteV0uYWRkKGRyb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9va3MgZm9yIGNvbGxpc2lvbnMgd2l0aCB0aGUgZ2l2ZW4gcmFpbmRyb3AuXG4gICAgICAgICAqIEBwYXJhbSBkcm9wIHJhaW5kcm9wIHRvIGJlIGNoZWNrZWRcbiAgICAgICAgICogQHJldHVybnMgRHJvcEl0ZW0gbGlzdCBvZiBkcm9wcyB0aGF0IGNvbGxpZGUgd2l0aCBpdFxuICAgICAgICAgKi9cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbGxpc2lvbnMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29sbGlzaW9ucyhkcm9wKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBEcm9wSXRlbShudWxsKTtcbiAgICAgICAgICAgIHZhciBmaXJzdCA9IGl0ZW07XG5cbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLmFkZEFsbChpdGVtLCBkcm9wLmdteCAtIDEsIGRyb3AuZ215ICsgMSk7XG4gICAgICAgICAgICBpdGVtID0gdGhpcy5hZGRBbGwoaXRlbSwgZHJvcC5nbXgsIGRyb3AuZ215ICsgMSk7XG4gICAgICAgICAgICBpdGVtID0gdGhpcy5hZGRBbGwoaXRlbSwgZHJvcC5nbXggKyAxLCBkcm9wLmdteSArIDEpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlyc3Q7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQXBwZW5kcyBhbGwgZm91bmQgZHJvcCBhdCBhIGdpdmVuIGxvY2F0aW9uIHRvIHRoZSBnaXZlbiBpdGVtLlxuICAgICAgICAgKiBAcGFyYW0gdG8gaXRlbSB0byB3aGljaCB0aGUgcmVzdWx0cyB3aWxsIGJlIGFwcGVuZGVkIHRvXG4gICAgICAgICAqIEBwYXJhbSB4IHggcG9zaXRpb24gaW4gdGhlIG1hdHJpeFxuICAgICAgICAgKiBAcGFyYW0geSB5IHBvc2l0aW9uIGluIHRoZSBtYXRyaXhcbiAgICAgICAgICogQHJldHVybnMgbGFzdCBkaXNjb3ZlcmVkIGl0ZW0gb24gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdhZGRBbGwnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkQWxsKHRvLCB4LCB5KSB7XG4gICAgICAgICAgICBpZiAoeCA+IDAgJiYgeSA+IDAgJiYgeCA8IHRoaXMueGMgJiYgeSA8IHRoaXMueWMpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLm1hdHJpeFt4XVt5XTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoaXRlbXMubmV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gaXRlbXMubmV4dDtcbiAgICAgICAgICAgICAgICAgICAgdG8ubmV4dCA9IG5ldyBEcm9wSXRlbShpdGVtcy5kcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSB0by5uZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0bztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVkIHRoZSBkcm9wIGZyb20gaXRzIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgICAgICogQHBhcmFtIGRyb3AgdG8gYmUgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbW92ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoZHJvcCkge1xuICAgICAgICAgICAgdGhpcy5tYXRyaXhbZHJvcC5nbXhdW2Ryb3AuZ215XS5yZW1vdmUoZHJvcCk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gQ29sbGlzaW9uTWF0cml4O1xufSkoKTtcblxudmFyIERyb3BJdGVtID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBEcm9wSXRlbShkcm9wKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEcm9wSXRlbSk7XG5cbiAgICAgICAgdGhpcy5kcm9wID0gZHJvcDtcbiAgICAgICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSByYWluZHJvcCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxuICAgICAqIEBwYXJhbSBkcm9wIHJhaW5kcm9wIHRvIGJlIGFkZGVkXG4gICAgICovXG5cbiAgICBfY3JlYXRlQ2xhc3MoRHJvcEl0ZW0sIFt7XG4gICAgICAgIGtleTogJ2FkZCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoZHJvcCkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzO1xuICAgICAgICAgICAgd2hpbGUgKGl0ZW0ubmV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0ubmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGl0ZW0ubmV4dCA9IG5ldyBEcm9wSXRlbShkcm9wKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSByYWluZHJvcCBmcm9tIHRoZSBsaXN0LlxuICAgICAgICAgKiBAcGFyYW0gZHJvcCByYWluZHJvcCB0byBiZSByZW1vdmVkXG4gICAgICAgICAqL1xuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVtb3ZlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShkcm9wKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgcHJldkl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgd2hpbGUgKGl0ZW0ubmV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcHJldkl0ZW0gPSBpdGVtO1xuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLm5leHQ7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uZHJvcC5naWQgPT09IGRyb3AuZ2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZJdGVtLm5leHQgPSBpdGVtLm5leHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIERyb3BJdGVtO1xufSkoKTtcblxuZXhwb3J0cy5SYWlueURheSA9IFJhaW55RGF5OyJdfQ==
