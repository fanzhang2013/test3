

var mongoose = require('mongoose')
  , User = mongoose.model('User')

exports.signin = function (req, res) {
 console.log(req.body)
}


exports.authCallback = function (req, res, next) {
//var user = req.user;
//res.send(user);
 //res.redirect('/')
}


exports.login = function (req, res) {
  console.log(req.user)
  res.send("invalid password or email");
}

exports.userprofile = function (req, res) {
  res.send(req.user);
}

exports.signup = function (req, res) {
}



exports.logout = function (req, res) {
  req.logout();
}



exports.session = function (req, res) {
  res.send(req.user);
}



exports.create = function (req, res) {
  var input = JSON.parse(req.body.user);
 
  User.findOne({ email: input.email }, function (err, user) {
        if (err) { return done(err) }
          if (!user) {
          var newuser = new User(input);
          newuser.provider = 'local';
          newuser.name = input.fullname;
          newuser.save(function (err) {
          if (err) {
            console.log(err.errors);
            res.send(err.errors);
          }
          req.session.user = newuser;
        
          res.send(newuser);
          })
        }
     if(user){

        res.send("user exist");
      } 
  })
  
 
}
exports.createsocial = function (req, res) {

 var input = req.body; 
 if(input.provider=="twitter"){
       User.findOne({ 'twitterId': input.providerid }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new User({
              name: input.username
            , username: input.username
            , provider: 'twitter'
            , twitterId: input.providerid
            , twitter: input.providerdetail
          })
          user.save(function (err) {
            if (err) console.log(err)
            res.send(user)
          })
        }
        else {
          res.send(user)
        }
      });

 }
 if(input.provider=="facebook"){
 User.findOne({ 'facebook.id': input.providerid  }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new User({
              name: input.username
            , username: input.fullname
            , provider: 'facebook'
            , facebook: input.providerdetail
          })
          
          user.save(function (err) {
            if (err) console.log(err)
            res.send(user)
          })
        }
        else {
         res.send(user)
        }
      });
  }
}



exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}



exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
