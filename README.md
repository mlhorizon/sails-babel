# Sails-babel 

* 启用ES6和gulp来完成sails项目！

* Use es6 in both backend and frotend!

* Use browserify to pack js modules!

* You can create front-end and back-end easily

* Baed on [Sails](http://sailsjs.org) Application


#### [version 0.0.1]


## Some modules used

- used sails-hook-babel , detail: [https://github.com/artificialio/sails-hook-babel]
- used swig for template
- used gulp for auto workflow
- used broswerify for js files package
- used es6 in both front and backend
- used babel to transform es6 files to es5
- used scss to get css
- used md5 to construct html/js/css files

- also used sails-mongo and others, not necessary


## Description:

#### dir introduction

* controllers: You can use .es6 files in controllers ,by sails-hook-babel

* assets/static: static resources, include img, es6, scss... 

* assets/static/es6: es6 files in this dir. and the dir [es6/common]and [lib] is global modules. You can just import its name in es6 files: 
 
like: `import 'AAA'` , not like:  `import '../common/AAA'`

#### Usage:

And the 'AAA' file should be in [es6/common] or [lib]!

#### Attention:

the [lib] is normal es5 js files, but not es6 files. 
And [es6/*] can be both es6 and es5 files. Recommend only .es6 files in es6 dir.


# Sails-babel Install 安装

1、install sails （use npm -g）

2、install modules in project root

`

    "babel-core": "^5.8.22",

    "sails-hook-babel": "^5.0.1",

    "sails-mongo": "^0.11.2",

    "swig": "^1.4.2"

`

3、install modules in assets dir:
`

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

`


# Sails-babel Usage 使用说明

* 1、Start server in develop pattern, 
[in the root dir, and exec:]

`gulp start`

* 2、Start server in Production pattern:

`gulp start-prod` 

this will use the published assets-dist and views-dist, you can config them in sails config files

* 3、init Assets so you can debug in browser

`gulp assets-init`


* 4、Watch Assets so you can develop by runtime compile(scss\es6\...)

`gulp assets-develop`


* 5、Publish assets

`gulp publish`

* 6、Clean Assets

`gulp clean`

this will clean tmp files and published assets fils


* 7、Generate Controller with views and js/css !!

`gulp generate -c {ControllerName}`

* 8、Generate Controller without views and js/css , bare !!

`gulp generate -c {ControllerNam} --bare`

* 9、Remove Controller !!

`gulp remove -c {ControllerName}`

* 10、Generate View with Assets: js/css , No Controller!!

`gulp generate -v {ViewName}`

* 11、Remove One View !!

`gulp remove -v {ViewName}`


# Contact Me

The docs is maybe rougth, simple, not-easily-understood. So Any questions,

Email: 

* xunuoi@163.com [recommend]
* xwlxyjk@gmail.com


QQ: [751933537]

### Best Wishes!
