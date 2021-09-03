const router = require("express").Router();
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  User.find({})
    .then(allUsers => {
      let appearRandomly = allUsers.sort(() => Math.random() - 0.5);
      res.render("index", { allUsers: appearRandomly})
    })
    .catch(err => next(err));
});


module.exports = router;
