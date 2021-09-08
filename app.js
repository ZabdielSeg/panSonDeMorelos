// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);


require('./passport')(app);

const User = require('./models/User.model');

app.use((req, res, next) => {
  User.findById(req.user)
    .populate('panes')
    .populate({
      path: 'reviews',
      populate: {
          path: 'owner',
          model: 'User'
      }
    })
    .then(user => {
      app.locals.user = user;
      next()
    })
    .catch(err => next(err));
});

const projectName = "panSonDeMorelos";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = projectName;
// app.locals.user = ((req, res, next) => req.user);

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const profileRoutes = require('./routes/profile.routes');
app.use('/', profileRoutes);

app.use('/', require('./routes/posts.routes'));

app.use('/', require('./routes/comments.routes'));

app.use('/', require('./routes/api.routes'));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
