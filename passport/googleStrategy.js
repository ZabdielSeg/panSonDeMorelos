const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

passport.use(
    new GoogleStrategy(
        {
            clientID: "586011585871-q98n0rbpe24rrl7qdfddu71ms3ubumpl.apps.googleusercontent.com",
            clientSecret: "tzkyG-52eK_-0euG66EI1pkN",
            callbackURL: "/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            // to see the structure of the data in received response:
            console.log("Google account details:", profile);

            User.findOne({ googleID: profile.id })
                .then(user => {
                    if (user) {
                        // User.findOneAndUpdate({ googleID: profile.id }, { username: profile.displayName, profileImageUrl: profile._json.picture }, { new: true })
                        //     .then(() => done(null))
                        //     .catch(err => done(err))
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
