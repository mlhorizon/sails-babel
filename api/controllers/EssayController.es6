/**
 * EssayController
 * 2015-08-21 04:08:28
 * 
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 
export default {
    view (req, res) {
        console.log('from essay')
        res.render('essay/essay')
        
    }
}

