

//这里可以看出，尽管声明了引用的模块，还是可以通过指定需要的部分进行导入
// import 'jquery/dist/jquery'

import { Point, pig } from './home2'
import { Dog } from './home3'
  

var origin = new Point(0, 0);
console.log(origin);
 
alert('pig: '+pig)

var dog = new Dog('ludc')

console.log(dog)

/**
 * test for => ====================
 * @type {Array}
 */
var list = [1, 2, 3, 4, 5, 6]

//ES6 
list.forEach(v => console.log(v))



// fasel !! ========================
var num = Math.random()
//将这个数字输出到console
console.log('your num is ${num}')



// default params ==================
function hello (name="jack") {
    alert(name)
}

hello()


//=================================

export { num, hello }
