(function (exports) {
  "use strict";
  var mongoose = require('mongoose')
    , crudUtils = require('../utils/crudUtils')
    , post = mongoose.model('Post')
    , posts = require('../controller/posts')
    , users = require('../controller/users')
    , movies = require('../controller/movies')
    ,path = require('path')

  function index(req, res) {
    
    if(req.user){
      console.log("index")
     res.sendfile( path.resolve('././site/public/todo.html'));
    }
    console.log("index");
    res.sendfile( path.resolve('././site/public/login.html'));

  }
 

  exports.init = function (app, auth, passport) {
    //movies.create();
    // app.get('/', function (req, res)
    // {
    //   if(req.user!=null){
    //     res.render('todo.html');
    //   }
    //   if(req.user==null)
    //   {
    //     res.redirect('/userlogin');
    //   }
      
    // });

    app.get('/',index);
    app.get('/movielist',movies.list);
    app.post('/movie/addcomment', posts.create);
    app.get('/movie/listbyuser/:userId', posts.listbyUser);
    app.get('/movie/listbymovie/:movieId', posts.listbyMovie);
    app.get('/movie/listbyMovieimdb/:movieimdb', movies.listbyMovieImdb);
    app.post('/users', users.create);
    app.post('/socialusers', users.createsocial)
    app.get('/signup', users.signup);

    app.get('/userprofile', users.userprofile);
    app.get('/login', users.login);
    
    app.get('/logout', users.logout)
    
    app.post('/todo/add', posts.create)
    
    app.get('/todo/read', posts.read)
    app.post('/todo/update', posts.update)
    app.post('/todo/delete', posts.del)
    app.get('/auth/facebook', passport.authenticate('facebook', { failureRedirect: '/userlogin',scope: 'email'}), users.signin)
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/userlogin' }), users.authCallback)
    app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/userlogin'}), users.signin)
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/userlogin' }), users.authCallback)
    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/userlogin', failureFlash: 'Invalid email or password.'}), users.session)
    crudUtils.initRoutesForModel({ 'app': app, 'model': post, auth: auth });
  };
}(exports));