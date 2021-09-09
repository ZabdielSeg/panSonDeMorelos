const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "https://pansondemorelos.herokuapp.com/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            // to see the structure of the data in received response:
            console.log("Google account details:", profile);

            User.findOne({ googleID: profile.id })
                .then(user => {
                    if (user) {
                        done(null, user);
                        return;
                    }

                    User.create({ username: profile.displayName, email: profile._json.email, googleID: profile.id,profileImageUrl: profile._json.picture })
                        .then(newUser => {
                            done(null, newUser);
                        })
                        .catch(err => done(err)); // closes User.create()
                })
                .catch(err => done(err)); // closes User.findOne()
        }
    )
);
