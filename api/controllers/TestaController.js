/**
 * TestaController
 * 2015-08-25 05:08:53
 * 
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


import request from 'request'
 
 
async function fetchPage(timeout) {
    return new Promise((resolve, reject) => {
        request(
            "http://www.baidu.com", 
            (error, response, body) => resolve(body)
        )
    })
}


export default {
    view (req, res) {        

        /*var {x,y,z} = {x:1,y:2,z:3}
        console.log(x,y,z)*/


        /*function bar (a, b) {
            return (this.x) + (this.y)
        }
 
        let foo = {
            x: 5,
            y: 2
        }
 

        let num = foo::bar(2, 3)
        console.log(num);*/


        /*function g({name: x}) {
          console.log(x);
        }
        g({name: 5});*/

 
        /*var s = new Set();
        s.add("hello").add("goodbye").add("hello");
        
        console.log(s)
        console.log(s.size);*/

        
        /*let customers  = [
            {
                'city': 'a',
                'name': 'Tom'
            },
            {
                'city': 'bb',
                'name': 'Jack'
            },
            {
                'city': 'a',
                'name': 'Zhide'
            },
        ]
        let results = (
          for (c of customers)
            if (c.city == "a")
              { name: c.name }
        )
        for (let x of results){
            console.log(x)
        }*/
        // console.log(results)



        ;(async () => {
            let body = await fetchPage()
            
            res.write(body)
        })()
 
    }
}
