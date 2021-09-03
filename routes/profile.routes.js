const router = require('express').Router();
const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");

const fileUploader = require('../config/cloudinary.config');

////////// MAIN PROFILE ////////
router.get('/my-profile', isLoggedIn, (req, res, next) => {
    const id = req.user._id;
    User.findById(id)
        .populate('panes')
        .then(() => { res.render('user/profile'); })
        .catch(err => next(err));
});

////// EDIT PROFILE INFO ////////
router.get('/my-profile/edit-profile', isLoggedIn, (req, res) => {
    const id = req.user._id;
    let allCities = [
        'Amacuzac', 'Atlatlahucan', 'Axochiapan', 'Ayala', 'Coatetelco', 'Coatlán del Río', 'Cuautla', 'Cuernavaca', 'Emiliano Zapata', 'Hueyapan', 'Huitzilac', 'Jantetelco', 'Jiutepec', 'Jojutla', 'Jonacatepec de Leandro Valle', 'Mazatepec', 'Miacatlán', 'Ocuituco', 'Puente de Ixtla', 'Temixco', 'Temoac', 'Tepalcingo', 'Tepoztlán', 'Tetecala', 'Tetela del Volcán', 'Tlalnepantla', 'Tlaltizapán de Zapata', 'Tlaquiltenango', 'Tlayacapan', 'Totolapan', 'Xochitepec', 'Xoxocotla', 'Yautepec', 'Yecapixtla', 'Zacatepec', 'Zacualpan de Amilpas'
    ];

    User.findById(id)
        .then(user => {
            allCities = allCities.filter(val => !user.citiesWhereFound.includes(val));
            res.render('user/edit-profileInfo', { allCities });
        })
        .catch(err => next(err));
});

router.post('/my-profile/edit-profile', fileUploader.single('newProfileImageUrl'), isLoggedIn, (req, res, next) => {
    const id = req.user._id;
    const { username, citiesWhereFound, description } = req.body;
    console.log(citiesWhereFound);

    let profileImageUrl;
    if (req.file) {
        profileImageUrl = req.file.path;
    } else {
        profileImageUrl = req.body.existingImage;
    }

    User.findByIdAndUpdate(id, { username, citiesWhereFound, description, profileImageUrl }, { new: true })
        .then(() => res.redirect('/my-profile'))
        .catch(err => next(err));
});

///////////// SEE OTHERS PROFILE /////////
router.get('/see-profile/:username', isLoggedIn, (req, res, next) => {
    const { username } = req.params;

    User.findOne({ username })
        .populate('panes')
        .populate({
            path: 'reviews',
            populate: {
                path: 'owner',
                model: 'User'
            }
        })
        .then(user => {
            res.render('user/see-profile', { userInfo: user })
        })
        .catch(err => next(err));
});

module.exports = router;