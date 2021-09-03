const router = require('express').Router();
const User = require("../models/User.model");
const Pan = require('../models/Pan.model');

const fileUploader = require('../config/cloudinary.config');

const isLoggedIn = require("../middleware/isLoggedIn");

//////////CREATE A POST //////////
router.get('/create-post', isLoggedIn, (req, res) => {
    // console.log(req.user)
    res.render('pan/create-pan');
});

router.post('/create-post', fileUploader.single('imageUrl'), isLoggedIn, (req, res, next) => {
    const { name, description } = req.body;
    const owner = req.user._id;

    Pan.create({name, description, imageUrl: req.file.path, owner})
        .then(pan => User.findByIdAndUpdate(owner, {$push: {panes: pan._id}}))
        .then(() => res.redirect('/my-profile'))
        .catch(err => next(err));
});

////////////////// EDIT POST/PAN //////////

router.get('/edit-pan/:panId', isLoggedIn, (req, res, next) => {
    const { panId } = req.params;
    Pan.findById(panId)
        .then(panFound => res.render('pan/edit-pan', {pan: panFound}))
        .catch(err => next(err));
    
});

router.post('/edit-pan/:panId', fileUploader.single('imageUrl'), isLoggedIn, (req, res, next) => {
    const { panId } = req.params;
    const { name, description } = req.body;

    let imageUrl;
    if (req.file) {
        imageUrl = req.file.path;
    } else {
        imageUrl = req.body.existingImage;
    }

    Pan.findByIdAndUpdate(panId, {name, description, imageUrl}, {new: true})
        .then(() => res.redirect('/my-profile'))
        .catch(err => next(err));
});

/////////////// DELETE POST/PAN /////////////
router.post('/delete-pan/:panId', isLoggedIn, (req, res, next) => {
    const { panId } = req.params;

    Pan.findByIdAndDelete(panId)
        .then(() => res.redirect('/my-profile'))
        .catch(err => next(err));
});

//////////////// TRABAJO POR HACER /////////////

module.exports = router;