const router = require('express').Router();
const Hospital = require('../models/hospital');
const Medic = require('../models/medic');
const User = require('../models/user');

router.get('/all/:search', (req, res) => {

    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    Promise.all([
            searchHospitals(search, regex),
            searchMedics(search, regex),
            searchUsers(search, regex)
        ])
        .then(responses => {
            res.status(200).json({
                ok: true,
                hospitals: responses[0],
                medics: responses[1],
                users: responses[2]
            });
        });


});

router.get('/medics/:search', (req, res) => {
    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    searchMedics(search, regex).then(medics => {
        res.status(200).json({
            ok: true,
            medics
        });
    });

});

router.get('/hospitals/:search', (req, res) => {
    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    searchHospitals(search, regex).then(hospitals => {
        res.send(200).json({
            ok: true,
            hospitals
        });
    });
});

router.get('/users/:search', (req, res) => {
    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    searchHospitals(search, regex).then(users => {
        res.send(200).json({
            ok: true,
            users
        });
    });
});

function searchHospitals(search, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((err, hospitals) => {
                if (err) {
                    reject('error getting hospitals', err);
                } else {
                    resolve(hospitals);
                }
            });
    });
}

function searchMedics(search, regex) {

    return new Promise((resolve, reject) => {
        Medic.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((err, medics) => {
                if (err) {
                    reject('error getting medics', err);
                } else {
                    resolve(medics);
                }
            });
    });
}

function searchUsers(search, regex) {

    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, users) => {
                if (err) {
                    reject('error getting users', err);
                } else {
                    resolve(users);
                }
            });
    });
}

module.exports = router;