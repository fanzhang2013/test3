var mongoose = require('mongoose')
  , Movie = mongoose.model('Movie')
var request = require("request");

exports.list= function( req, res ) {
    var input = req.query
    Movie.find({}, null, {limit:25}, function(error, result){
    if(error) {
        console.log(error);
    } else {
        res.send(result);
    }
  });
  },

   exports.listbyMovieImdb= function( req, res ) {
    var input = req.params.movieimdb;
    
    Movie.find({'detail.alternate_ids.imdb':  input}, null, null, function(error, result){
    if(error) {
        console.log(error);
    } else {
         res.send(result);
    }
  });
  },

exports.create = function (req, res) {
  
  var movies=[];
  var firedonce=false;
  if(firedonce==false){
    Movie.remove({}, function(err) { 
     console.log('collection removed') 
     });
    request({
    uri: "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=gvryq9m2sjd24gskd4xmkebj&page_limit=1&page=1",
    method: "GET",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10
    }, function(error, response, body) {
    movies = JSON.parse(body);
    var moviesLength=0;
    var page=1;
    if(movies.total%50>0 && movies.total>=50){
      moviesLength=(parseInt(movies.total/50))+1;
    }
    if(movies.total<=50){
      moviesLength=movies.total;
    }
    for(var j=0; j<moviesLength; j++){
     
    request({
    uri: "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=gvryq9m2sjd24gskd4xmkebj&page_limit=50&page="+page,
    method: "GET",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10
    }, function(error, response, body) {
     
            var movieList=[];
            movieList = JSON.parse(body);
            for (var i=0; i< movieList.movies.length; i++){
            var newmovie = new Movie()
            newmovie.name = movieList.movies[i].title;
            newmovie.detail = movieList.movies[i];
            newmovie.save(function (err) {
                  if (err) {
                    console.log(err.errors)
                    
                  }
                  })
          }
         
      });
     page = page+1;
    }
   
  firedonce=true;
});
}
 
}

