const User = require('../model/user');
const bcryptjs = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'psw'}, (email, psw, done)=>{
        User.findOne({email: email}, (err, data)=>{
            if(err) throw err;
            if(!data){
                return done(null, false, {message: 'User does not exist'});
            }

            // if there is data
            bcryptjs.compare(psw, data.password, (err, match)=>{
                if(err) throw err;
                if(!match){
                    return done(null, false, {message: 'password is incorrect!'});
                }
                if(match){
                    return done(null, data);
                }
            })
        })
    }));

    //serializeUser to store user in session after login successful
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    }); 

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}