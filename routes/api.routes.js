const router = require('express').Router();
const User = require('../models/User.model');

router.get('/panSonDeMorelos/api', (req, res, next) => {
    User.find({})
        .then(users => {
            res.status(200).json({ users })
        })
        .catch(err => next(err));
});

router.get('/panSonDeMorelos/api/:id', (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            res.status(200).json({ user });
        })
        .catch(err => next(err));
});

module.exports = router;