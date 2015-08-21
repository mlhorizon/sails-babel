/**
 * ES6 FILE FOR EssayController 
 * 2015-08-21 04:08:28
 */ 
import 'jquery/dist/jquery'

function hello() {
    var page = 'Cloud'

    alert(`Hello, this is ${page}. You can use es6 now.`)
    setTimeout(() => {
        $('body').html('Used jquery')
    })
}


hello()

export { hello } 
