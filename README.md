# sails-gulp-es6-babel-swig



Combined with package for easyily use

You can create front-end and back-end easily

Baed on [Sails](http://sailsjs.org) Application


[version 0.0.1]

used swig for template

used gulp
used broswerify
used es6
used babel
used scss

# desc:
assets: es6 files in dir es6. and the dir [common]and [lib] is global modules. You can just in es6 code: import 'AAA' and the 'AAA' file is in [es6/common] or [lib]

#attention#
[lib] is normal es5 js files but not es6 files. And [es6/*] can be all es6 files.


# sails-babel install 安装

1、install sails （use npm -g）
2、install modules in project root
    "babel-core": "^5.8.22",
    "sails-hook-babel": "^5.0.1",
    "sails-mongo": "^0.11.2",
    "swig": "^1.4.2"

3、install modules in assets dir:
    "babelify": "^6.2.0",
    "browserify": "^11.0.1",
    "globby": "^2.1.0",
    "gulp-babel": "^5.2.0",
    "gulp-imagemin": "^2.3.0",
    "gulp-load-plugins": "^1.0.0-rc.1",
    "gulp-md5-plus": "^0.1.7",
    "gulp-minify-css": "^1.2.0",
    "gulp-rename": "^1.2.2",
    "gulp-sass": "^2.0.4",
    "gulp-uglify": "^1.2.0",
    "imagemin-pngquant": "^4.1.2",
    "shelljs": "^0.5.3",
    "vinyl-buffer": "^1.0.0",
    "vinyl-source-stream": "^1.1.0"
