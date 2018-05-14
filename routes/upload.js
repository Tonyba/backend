const router = require('express').Router();
const fileUpload = require('express-fileupload');
const User = require('../models/user');
const Medic = require('../models/medic');
const Hospital = require('../models/hospital');
const fs = require('fs');

router.use(fileUpload());

router.put('/:type/:id', (req, res) => {

    const type = req.params.type;
    const id = req.params.id;

    // collections
    const collections = ['hospitals', 'medics', 'users'];

    if (collections.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'type is invalid'
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'no images'
        });
    }

    // fileName
    const file = req.files.img;
    const name = file.name.split('.');
    const ext = name[name.length - 1];

    // valid extentions
    const validExt = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExt.indexOf(ext) < 0) {
        return res.status(500).json({
            ok: false,
            message: 'the file is not valid'
        });
    }

    const fileName = `${id}-${ new Date().getMilliseconds() }.${ ext }`;

    const path = `./uploads/${type}/${ fileName }`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error moving file',
                errors: err
            });
        }

        uploadByType(type, id, fileName, res)


    });

});

function uploadByType(type, id, fileName, res) {

    if (type === 'users') {

        User.findById(id, (err, user) => {

            if (!user) {
                return res(404).json({
                    ok: false,
                    message: 'the user does not exist'
                });
            }

            if (err) throw err;

            const oldPath = './uploads/users/' + user.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            user.img = fileName;

            user.save((err, user) => {
                return res.status(200).json({
                    ok: true,
                    message: 'user image updated',
                    user
                });
            });

        });

    }

    if (type === 'medics') {
        Medic.findById(id, (err, medic) => {

            if (!medic) {
                return res(404).json({
                    ok: false,
                    message: 'the medic does not exist'
                });
            }

            if (err) throw err;

            const oldPath = './uploads/medics/' + medic.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            medic.img = fileName;

            medic.save((err, medic) => {
                return res.status(200).json({
                    ok: true,
                    message: 'medic image updated',
                    medic
                });
            });

        });
    }

    if (type === 'hospitals') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res(404).json({
                    ok: false,
                    message: 'the hospital does not exist'
                });
            }

            if (err) throw err;

            const oldPath = './uploads/hospitals/' + hospital.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            hospital.img = fileName;

            hospital.save((err, hospital) => {
                return res.status(200).json({
                    ok: true,
                    message: 'hospital image updated',
                    hospital
                });
            });

        });
    }

}


module.exports = router;