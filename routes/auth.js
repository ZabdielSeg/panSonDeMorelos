const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

const passport = require('passport')

// Require the User model in order to interact with the database
const User = require("../models/User.model");


const fileUploader = require('../config/cloudinary.config');

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const allCities = [
  'Amacuzac', 'Atlatlahucan', 'Axochiapan','Ayala','Coatetelco','Coatlán del Río','Cuautla',
  'Cuernavaca','Emiliano Zapata','Hueyapan','Huitzilac','Jantetelco','Jiutepec','Jojutla',
  'Jonacatepec de Leandro Valle','Mazatepec','Miacatlán','Ocuituco','Puente de Ixtla','Temixco',
  'Temoac','Tepalcingo','Tepoztlán','Tetecala','Tetela del Volcán','Tlalnepantla',
  'Tlaltizapán de Zapata','Tlaquiltenango','Tlayacapan','Totolapan','Xochitepec','Xoxocotla',
  'Yautepec','Yecapixtla','Zacatepec','Zacualpan de Amilpas'
];



router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup", { allCities });
});

router.post("/signup", fileUploader.single('profileImageUrl'), isLoggedOut, (req, res) => {
  const { username, password, email, isBakery, citiesWhereFound } = req.body;
  const finalCities = citiesWhereFound.map(city => city.replace(',', ', '))

  if (!username) {
    return res
      .status(400)
      .render("auth/signup", { errorMessage: "Please provide a username.", allCities: allCities });
  }

  if(username.length > 25){
    return res
      .status(400)
      .render("auth/signup", { errorMessage: "Your name must not be longer than 25 characters", allCities: allCities });
  }

  // if (password.length < 8) {
  //   return res.status(400).render("auth/signup", {
  //     errorMessage: "Your password needs to be at least 8 characters long.",
  //   });
  // }

  //   ! This use case is using a regular expression to control for special characters and min length
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  // if (!regex.test(password)) {
  //   return res.status(400).render("auth/signup", {
  //     errorMessage: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.", allCities: allCities
  //   });
  // }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Username already taken.", allCities: allCities });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          email,
          password: hashedPassword,
          citiesWhereFound,
          profileImageUrl: req.file.path,
          isBakery: Boolean(isBakery)
        });
      })
      .then((user) => {
        // Bind the user to the session object
        // req.session.user = user;
        res.redirect("/login");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Email need to be unique. The email you chose is already in use.",
            allCities: allCities
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message, allCities: allCities });
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login", { errorMessage: req.flash('error') });
});

router.post('/login', passport.authenticate(
  'local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}
));

///////// LOGIN WITH GOOGLE //////////

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login" // here you would redirect to the login page using traditional login approach
  })
);

//////////////////LOGIN WITH FACEBOOK //////////////////

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
