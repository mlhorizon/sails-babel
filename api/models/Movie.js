
var ObjectId = require('sails-mongo').ObjectID

module.exports = {

  tableName: 'movie',

  attributes: {
    // Primitive attributes
    'title': {
      type: 'string',
      defaultsTo: '暂无'
    },
    'rating': {
      type: 'string',
      defaultsTo: '暂无'
    },
    'country': 'array',
    'image': {
      type: 'string',
      defaultsTo: 'img/movie/default_cover.png'
    },
    // Associations (aka relational attributes)
    'reviews': { 
      collection: 'Review',
      via: 'movie_id'
    },

    /*'genre': { 
      collection: 'genre'
    },*/

    // Attribute methods
    getTitle: function (){
      return this['title']
    }
  }
};