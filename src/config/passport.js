// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

module.exports = function(passport) {
  //set up passport
  passport.use(
    'local-signup',
    new LocalStrategy(function(username, password, done) {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne(
          {
            username: username,
          },
          function(err, user) {
            // if there are any errors, return the error
            if (err) return done(err);

            // check to see if theres already a user with that email
            if (user) {
              return done(null, false, {
                message: 'That email is already taken.',
              });
            } else {
              // if there is no user with that email
              // create the user
              console.log('Making user');
              var newUser = new User();
              console.log('made user', newUser);

              // set the user's local credentials
              newUser.username = username;
              newUser.password = newUser.generateHash(password);

              // save the user
              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          }
        );
      });
    })
  );

  passport.use(
    'local-login',
    new LocalStrategy(function(username, password, done) {
      User.findOne(
        {
          username: username,
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'Incorrect username.',
            });
          }
          if (!user.validPassword(password)) {
            return done(null, false, {
              message: 'Incorrect password.',
            });
          }
          return done(null, user);
        }
      );
    })
  );

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
