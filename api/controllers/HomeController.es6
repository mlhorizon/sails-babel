/**
 * HomeController
 * 2015-08-21 02:08:38
 * 
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 

export default {
    view (req, res) {
        console.log(' ==== welcome home')
        res.render('home/home')
        
    }
}

