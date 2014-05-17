var mongoose = require('mongoose')
    Schema = mongoose.Schema;
   moviesSchema = new mongoose.Schema({
         name: { 'type': String, 'default': 'empty text...' }
       , detail: {}
       , createdAt : {type : Date, default : Date.now}
  });

module.exports = mongoose.model('Movie', moviesSchema);