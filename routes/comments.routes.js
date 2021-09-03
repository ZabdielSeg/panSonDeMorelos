const router = require('express').Router();
const Pan = require('../models/Pan.model');
const Review = require('../models/Review.model');
const User = require('../models/User.model');

const isLoggedIn = require('../middleware/isLoggedIn');

router.post('/create-comment', isLoggedIn, (req, res, next) => {
    const { id, comment } = req.body;
    console.log(id, comment);

    Review.create({ user: req.user.id, comment })
        .then(review => Pan.findByIdAndUpdate(id, {$push: {reviews: review._id}}))
        .then(() => res.redirect('/'))
        .catch(err => next(err))
});

router.post('/comment-panaderia', isLoggedIn, (req, res, next) => {
    const { id, comment, username } = req.body;
    const owner = req.user._id;
    console.log(owner, comment, username);

    Review.create({ owner, comment })
        .then(review => User.findByIdAndUpdate(id, {$push: {reviews: review._id}}))
        .then(() => res.redirect('/see-profile/'.concat(username)))
        .catch(err => next(err))
});

router.post('/delete-comment/:id', isLoggedIn, (req, res, next) => {
    const { id } = req.params;

    Review.findByIdAndDelete(id)
        .then(() => res.redirect('/'))
        .catch(err => next(err));
});

module.exports = router;