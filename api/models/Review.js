
var ObjectId = require('sails-mongo').ObjectID


module.exports = {
  tableName: 'movie_review',

  attributes: {
    // Primitive attributes
    'review_title': {
      type: 'string',
      defaultsTo: '无'
    },
    'content': {
      type: 'string',
      defaultsTo: '无'
    },
    'movie_id': {
      type: 'string'
    },
    'movies': {
      collection: 'Movie',
      via: 'id'
    }
  }
};