const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../auth/config');
const mdAuth = require('../middleware/auth');


router.get('/', (req, res) => {

    User.find({}, 'name email img role').exec((err, users) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error downloading users',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            users
        });

    });

});

router.post('/', (req, res) => {

    const body = req.body;

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role

    });

    user.save((err, newUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'error saving user',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            message: 'user saved in DB',
            User: newUser
        });

    });
});


router.put('/:id', mdAuth.verifyToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error finding user',
                errors: err
            });
        }

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'no user found',
                errors: err

            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'error updating users',
                    errors: err
                });
            }

            updatedUser.password = 'no good luck, dude :(';

            res.status(200).json({
                ok: true,
                message: 'user updated in DB',
                User: updatedUser,
                userToken: req.user
            });

        })



    });



});


router.delete('/:id', mdAuth.verifyToken, (req, res) => {

    const id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error deleting user',
                errors: err
            });
        }

        if (!deletedUser) {
            return res.status(404).json({
                ok: false,
                message: 'error finding user',
            })
        }

        res.status(200).json({
            ok: true,
            message: 'user deleted',
            deletedUser
        })

    });

});


module.exports = router;