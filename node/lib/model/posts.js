var mongoose = require('mongoose')
    Schema = mongoose.Schema;
   postsSchema = new mongoose.Schema({
        text: { 'type': String, 'default': 'empty text...' }
       , rating: { 'type': String, 'default': 'empty text...' }
       , movie  : { type : Schema.ObjectId, ref : 'Movie' } 
       , createdAt : {type : Date, default : Date.now}
       , user  : { type : Schema.ObjectId, ref : 'User' }
  });

   postsSchema.statics = {
  
  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'username')
      .exec(cb)
  }
}

module.exports = mongoose.model('Post', postsSchema);