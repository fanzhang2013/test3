var uuid    = require('node-uuid');
var mongoose = require('mongoose');
var todocoll = mongoose.model('Post');
var Movie = mongoose.model('Movie');
var User = mongoose.model('User');
var util = {};

util.validate = function( input ) {
  return input.text
}

util.fixid = function( doc ) {
  if( doc._id ) {
    doc.id = doc._id.toString()
    delete doc._id
  }
  else if( doc.id ) {
    doc._id = new mongodb.ObjectID(doc.id)
    delete doc.id
  }
  return doc
}


  exports.create = function( req, res ) {
    console.log("post created");
    console.log(req.user);
    var input = JSON.parse(req.body.mydata); 
    todo=new todocoll({
      text: input.comments,
      createdAt: new Date().getTime(),
      movie: input.movieId,
      rating: input.rating,
      user: input.userId,
    })
    todo.save(function (err) {
    if (err) console.log(err)
      res.send( todo )
      })
  },


  exports.read= function( req, res ) {
    var input = req.query
    
    todocoll.find({'_id':  input.id}, null, null, function(error, result){
    if(error) {
        console.log(error);
    } else {

        res.send(result)
    }
  });
  },


  exports.listbyUser= function( req, res ) {
    
    var input = req.params.userId;
    var options = {sort:[['_id','desc']]};
    todocoll.find({'user':  input}, null, null, function(error, result){
    if(error) {
        console.log(error);
    } else {
        //console.log(result);
        var reviews = [];
        var reviewdetails;
        //var callbacks=function(reviews,loop){
         // console.log(loop);
          //res.send(reviews);
        //}
        function asyncLoop( i, callback ) {
          if( i < result.length ) {
          var re=result[i];
           
          User.find({'_id':  result[i].user}, null, null, function(error, resultuser){
             var users=resultuser[0];
             Movie.find({'_id':  re.movie}, null, null, function(error, resultmovie){
                var moviedetai = resultmovie[0];
                reviewdetails={ 'user':users, 'movie':moviedetai, 'review': re};
                reviews.push(reviewdetails);
                asyncLoop( i+1, callback );      
            });
             
          });
        }else {
        callback();
        }
      }
        //console.log(reviews);
        asyncLoop( 0, function() {
          res.send(reviews);
        });
        
    }
  });
  },

  exports.listbyMovie= function( req, res ) {
    var input = req.params.movieId;
    todocoll.find({'movie':  input}, null, null, function(error, result){
    if(error) {
        console.log(error);
    } else {
        //console.log(result);
        var reviews = [];
        var reviewdetails;
        //var callbacks=function(reviews,loop){
         // console.log(loop);
          //res.send(reviews);
        //}
        function asyncLoop( i, callback ) {
          if( i < result.length ) {
          var re=result[i];
           
          User.find({'_id':  result[i].user}, null, null, function(error, resultuser){
             var users=resultuser[0];
             Movie.find({'_id':  re.movie}, null, null, function(error, resultmovie){
                var moviedetai = resultmovie[0];
                reviewdetails={ 'user':users, 'movie':moviedetai, 'review': re};
                reviews.push(reviewdetails);
                asyncLoop( i+1, callback );      
            });
             
          });
        }else {
        callback();
        }
      }
        //console.log(reviews);
        asyncLoop( 0, function() {
          res.send(reviews);
        });
        
    }
  });
  },

  exports.update= function( req, res ) {
    var id    = req.query.id
    var input = req.body
    todocoll.update({
    _id: id
        }, {
    text:input.text,
    location:input.location
  }, 
  function(e, result) {
    if (e) {
      res.send(e.message);
    }
    else {
        res.send(result)
    }
  });
  },


  exports.del= function( req, res ) {
    var input = req.query.id
    console.log(input)
    todocoll.remove( {_id:input}, function(e, result) {
    if (e) {
      console.log(e)
      res.send(e.message);
    }
    else {
      console.log(result)
      res.send(result)
    }
  });
  }


